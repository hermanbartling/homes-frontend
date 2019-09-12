import React from 'react';
import Calendar from 'react-calendar' // https://github.com/wojtekmaj/react-calendar
import CandidateMeasurements from './CandidateMeasurements'
import CommunicationError from './CommunicationError';
import {forwardDateToWeekDayAndTime, rollDateTimeForwardWeeks, isSameDay} from './DateUtil.js';
import ApiUtil from './ApiUtil';


class SchedulingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDay: 1,
            startTimeHour: 9,
            endDay: 5,
            endTimeHour: 9,
            repetitions: 1,
            weekPeriodicity: 2,
            earliestPossibleStartDate: new Date(),
            startDate: new Date(),
            hourOptions: {},
            weekdayOptions: {},
            weekPeriodOptions: {}
        };

        this.minHourConfig = 0;
        this.maxHourConfig = 0;

        this.apiUtil = new ApiUtil();

        this.handleChangedStartDay = this.handleChangedStartDay.bind(this);
        this.handleChangedStartTime = this.handleChangedStartTime.bind(this);
        this.handleChangedEndDay = this.handleChangedEndDay.bind(this);
        this.handleChangedEndTime = this.handleChangedEndTime.bind(this);
        this.handleChangedRepetitions = this.handleChangedRepetitions.bind(this);
        this.handleChangedWeekPeriodicity = this.handleChangedWeekPeriodicity.bind(this);
        this.handleChangedStartDate = this.handleChangedStartDate.bind(this);
        this.handleCandidatesCreated = this.handleCandidatesCreated.bind(this);
    }

    componentDidMount() {
        this.getMetaData();
    }

    getMetaData() {
        this.apiUtil.getMetaData().then(
            (result) => {

                const earliestPossibleStartDate = new Date(result.earliestPossibleStartDate);
                const {startDate, startDay, startTimeHour} = this.state;
                const updatedStartDate = SchedulingForm.updateStartDate(
                    earliestPossibleStartDate,
                    startDate,
                    startDay,
                    startTimeHour
                );
                this.setState({
                    isMetaDataLoaded: true,
                    communicationError: null,
                    earliestPossibleStartDate: earliestPossibleStartDate,
                    startDate: updatedStartDate,
                    hourOptions: result.hourOptions,
                    weekdayOptions: result.weekdayOptions,
                    weekPeriodOptions: result.weekPeriodOptions
                });

                this.minHourConfig = parseInt(result.hourMin);
                this.maxHourConfig = parseInt(result.hourMax);

            },
            (error) => {
                this.setState({
                    isMetaDataLoaded: true,
                    communicationError: error
                });
            }
        );

    }

    static updateStartDate(earliestPossibleStartDate, startDate, startDay, startTimeHour) {
        var forwardedStartDate;
        if (startDate < earliestPossibleStartDate) {
            forwardedStartDate = forwardDateToWeekDayAndTime(earliestPossibleStartDate, startDay, startTimeHour);
        } else {
            forwardedStartDate = forwardDateToWeekDayAndTime(startDate, startDay, startTimeHour);
        }

        if (forwardedStartDate < earliestPossibleStartDate) {
            forwardedStartDate = rollDateTimeForwardWeeks(forwardedStartDate, 1);
        }

        return forwardedStartDate;
    }

    handleChangedStartDay(event) {
        const startDay = parseInt(event.target.value);
        const {earliestPossibleStartDate, startTimeHour, startDate} = this.state;

        this.setState((state) => ({
            startDay: startDay,
            startDate: SchedulingForm.updateStartDate(earliestPossibleStartDate, startDate, startDay, startTimeHour)
        }));
    }

    handleChangedStartTime(event) {
        const startTimeHour = parseInt(event.target.value);
        const {earliestPossibleStartDate, startDay, startDate} = this.state;
        this.setState({
                startTimeHour: startTimeHour,
                startDate: SchedulingForm.updateStartDate(earliestPossibleStartDate, startDate, startDay, startTimeHour)
            }
        );
    }

    handleChangedEndDay(event) {
        this.setState({endDay: parseInt(event.target.value)});
    }

    handleChangedEndTime(event) {
        this.setState({endTimeHour: parseInt(event.target.value)});
    }

    handleChangedRepetitions(event) {
        let newRepetitionValue = event.target.value;
        newRepetitionValue = Math.min(newRepetitionValue, 100);
        newRepetitionValue = Math.max(newRepetitionValue, 1);
        this.setState({repetitions: parseInt(newRepetitionValue)});
    }

    handleChangedWeekPeriodicity(event) {
        this.setState({weekPeriodicity: event.target.value});
    }

    handleChangedStartDate(event) {
        let newStartDate = event;
        let newStartHour = this.state.startTimeHour;

        const earliestPossibleStartDate = this.state.earliestPossibleStartDate;
        // earliestPossibleStartDate can be > this.maxHourConfig when metadata not yet fetched
        const earliestPossibleStartHour = Math.min(earliestPossibleStartDate.getHours(), this.maxHourConfig);

        if (isSameDay(newStartDate, earliestPossibleStartDate)) {
            if (newStartHour < earliestPossibleStartHour) {
                newStartHour = earliestPossibleStartHour;
            }
        }
        newStartDate.setHours(newStartHour);
        this.setState(
            {
                startDate: newStartDate,
                startTimeHour: newStartHour
            }
        );

    }

    getStartHourOptions() {
        let minHour = this.minHourConfig;
        const {startDate, earliestPossibleStartDate} = this.state;

        if (isSameDay(startDate, earliestPossibleStartDate)) {
            minHour = Math.min(this.maxHourConfig, earliestPossibleStartDate.getHours());
        }

        let hoursToRender = {};
        const availableHours = this.state.hourOptions;
        Object.keys(availableHours).forEach(function (hour) {
            if (hour >= minHour) {
                hoursToRender[hour] = availableHours[hour];
            }
        });
        return hoursToRender;

    }

    handleCandidatesCreated(measurementIds) {
        this.getMetaData();
        this.setState({repetitions: 1});
        this.props.onCandidatesCreated(measurementIds);
    }

    render() {
        const {
            startDay,
            startTimeHour,
            endDay,
            endTimeHour,
            weekPeriodicity,
            startDate,
            repetitions,
            earliestPossibleStartDate,
            isMetaDataLoaded,
            communicationError,
            weekdayOptions,
            hourOptions,
            weekPeriodOptions
        } = this.state;

        if (communicationError) {
            return <CommunicationError error={communicationError}/>;
        } else if (!isMetaDataLoaded) {
            return <div>Laddar...</div>;
        } else {
            return (
                <div>
                    <form className="form-horizontal" onSubmit={this.handleSubmit}>

                        <div className="row">
                            <div className="col-sm-6">
                                <h3>Inställningar för schema</h3>
                                <div className="form-group">
                                    <FormSelectorInput
                                        labelClassName="col-sm-3 control-label text-left"
                                        labelText="Startar"
                                        inputClassName="col-sm-4"
                                        onChange={this.handleChangedStartDay}
                                        selectedValue={startDay}
                                        options={weekdayOptions}
                                    />
                                    <FormSelectorInput
                                        labelClassName="col-sm-1 control-label text-left"
                                        labelText="kl"
                                        inputClassName="col-sm-4"
                                        onChange={this.handleChangedStartTime}
                                        selectedValue={startTimeHour}
                                        options={this.getStartHourOptions()}
                                    />
                                </div>

                                <div className="form-group">
                                    <FormSelectorInput
                                        labelClassName="col-sm-3 control-label text-left"
                                        labelText="Avslutas"
                                        inputClassName="col-sm-4"
                                        onChange={this.handleChangedEndDay}
                                        selectedValue={endDay}
                                        options={weekdayOptions}
                                    />
                                    <FormSelectorInput
                                        labelClassName="col-sm-1 control-label text-left"
                                        labelText="kl"
                                        inputClassName="col-sm-4"
                                        onChange={this.handleChangedEndTime}
                                        selectedValue={endTimeHour}
                                        options={hourOptions}
                                    />
                                </div>

                                <div className="form-group">
                                    <FormSelectorInput
                                        labelClassName="col-sm-3 control-label text-left"
                                        labelText="Period"
                                        inputClassName="col-sm-6"
                                        onChange={this.handleChangedWeekPeriodicity}
                                        selectedValue={weekPeriodicity}
                                        options={weekPeriodOptions}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="col-sm-3 control-label text-left">Startdatum: </label>
                                    <div className="col-sm-9">
                                        <Calendar
                                            locale="sv-SE"
                                            minDate={earliestPossibleStartDate}
                                            showWeekNumbers={true}
                                            tileDisabled={({activeStartDate, date, view}) => date.getDay() !== startDay}
                                            calendarType="ISO 8601"
                                            onClickDay={this.handleChangedStartDate}
                                            value={startDate}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="col-sm-3 control-label text-left">Antal: </label>
                                    <div className="col-sm-3">
                                        <input
                                            className="form-control text-center"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={repetitions}
                                            onChange={this.handleChangedRepetitions}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="col-sm-6">
                                <h3>Kommer schemaläggas</h3>
                                <CandidateMeasurements
                                    startDate={startDate}
                                    weekPeriodicity={weekPeriodicity}
                                    repetitions={repetitions}
                                    endDay={endDay}
                                    endTimeHour={endTimeHour}
                                    onCandidatesCreated={(measurementIds) => this.handleCandidatesCreated(measurementIds)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6"></div>
                            <div className="col-sm-6">
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
    }

}

class FormSelectorInput extends React.Component {

    static getOptions(options) {
        let array = [];
        Object.keys(options).forEach(function (key) {
            array.push(<option value={key} key={key}>{options[key]}</option>);
        });
        return array;
    }


    render() {

        const {labelClassName, labelText, inputClassName, onChange, selectedValue, options} = this.props;

        return (
            <div>
                <label className={labelClassName}>{labelText}: </label>
                <div className={inputClassName}>
                    <select className="form-control"
                            onChange={onChange}
                            value={selectedValue}
                    >
                        {FormSelectorInput.getOptions(options).map(option => (option))}
                    </select>
                </div>
            </div>
        );
    }

}



export default SchedulingForm;