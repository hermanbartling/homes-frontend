import React from 'react';
import {
    getDateTimeString,
    getWeekdayFromDateTimeString,
    forwardDateToWeekDayAndTime,
    getWeekNumberFromDateTimeString,
    rollDateTimeForwardWeeks
} from './DateUtil.js';
import ApiUtil from './ApiUtil';

class CandidateMeasurements extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            error: null,
            candidatesCreateSuccess: [],
            candidatesCreateFailed: [],
            candidatesCreateTotal: 0,
            disableCreateButton: false
        };

        this.apiUtil = new ApiUtil();

        this.handleCreateMeasurements = this.handleCreateMeasurements.bind(this);
        this.dismissFailureMessage = this.dismissFailureMessage.bind(this);
    }

    deriveCandidates() {
        const {startDate, endDay, endTimeHour, repetitions, weekPeriodicity} = this.props;

        var measurements = [
            {
                'start_at': startDate,
                'week': getWeekNumberFromDateTimeString(startDate),
                'end_at': forwardDateToWeekDayAndTime(startDate, endDay, endTimeHour)
            }
        ];

        var nextStartDate = startDate;
        for (var i = 0; i < repetitions - 1; i++) {
            nextStartDate = rollDateTimeForwardWeeks(nextStartDate, weekPeriodicity);
            measurements.push(
                {
                    'start_at': nextStartDate,
                    'week': getWeekNumberFromDateTimeString(nextStartDate),
                    'end_at': forwardDateToWeekDayAndTime(nextStartDate, endDay, endTimeHour)
                }
            );
        }

        return measurements;
    }


    handleCreateMeasurements(candidateMeasurements) {
        if (this.state.disableCreateButton) {
            return;
        }

        this.setState(
            {
                disableCreateButton: true,
                candidatesCreateTotal: candidateMeasurements.length,
                candidatesCreateFailed: [],
                candidatesCreateSuccess: []
            }
        );
        for (var i = 0; i < candidateMeasurements.length; i++) {
            this.createMeasurement(candidateMeasurements[i]);
        }
    }

    handleCreateMeasurementSuccess(createdMeasurement) {
        this.setState((state, props) => ({
            candidatesCreateSuccess: [...state.candidatesCreateSuccess, createdMeasurement.id]
        }));
        this.checkIfAllCandidatesProcessed();
    }

    handleCreateMeasurementFail(error) {
        this.setState((state, props) => ({
            candidatesCreateFailed: [...state.candidatesCreateFailed, error]
        }));
        this.checkIfAllCandidatesProcessed();
    }

    checkIfAllCandidatesProcessed() {
        const processedCandidates = this.state.candidatesCreateSuccess.length + this.state.candidatesCreateFailed.length;
        if (processedCandidates === this.state.candidatesCreateTotal) {
            const newMeasurementIds = this.state.candidatesCreateSuccess;
            this.props.onCandidatesCreated(newMeasurementIds);
            this.setState(
                {
                    disableCreateButton: false,
                    candidatesCreateSuccess: [],
                    candidatesCreateTotal: 0
                }
            );

        }
    }

    dismissFailureMessage() {
        this.setState((state) => ({candidatesCreateFailed: []}));
    }


    createMeasurement(measurement) {
        this.apiUtil.createMeasurement(measurement.start_at, measurement.end_at).then(
            (result) => {
                this.handleCreateMeasurementSuccess(result);
            },
            (error) => {
                this.handleCreateMeasurementFail(error);
            }
        );
    }

    render() {
        const candidateMeasurements = this.deriveCandidates(this.props);
        const {disableCreateButton, candidatesCreateFailed} = this.state;
        var failureMessage = null;

        if (candidatesCreateFailed && candidatesCreateFailed.length > 0) {
            failureMessage = (
                <div className="alert alert-warning alert-dismissible" role="alert">
                    <button
                        type="button"
                        className="close"
                        aria-label="Close"
                        onClick={() => this.dismissFailureMessage()}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="alert-heading">Problem uppstod</h4>
                    {candidatesCreateFailed.length} mätningar kunde inte schemaläggas.
                    Se nedan för detaljer. Ta gärna en skärmdump av den här sidan och kontakta supporten
                    om problemet kvarstår.
                    <hr/>
                    <ul>
                        {candidatesCreateFailed.map((err, index) => (
                            <li key={index}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            );
        }

        return (
            <div>
                <table className="table table-condensed table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>V</th>
                        <th colSpan="2">Start</th>
                        <th colSpan="2">Avslut</th>
                    </tr>
                    </thead>
                    <tbody>
                    {candidateMeasurements.map(m => (
                        <tr key={m.start_at}>
                            <td>{m.week}</td>
                            <td>{getWeekdayFromDateTimeString(m.start_at)}</td>
                            <td>{getDateTimeString(m.start_at)}</td>
                            <td>{getWeekdayFromDateTimeString(m.end_at)}</td>
                            <td>{getDateTimeString(m.end_at)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {failureMessage}

                <div>
                    {!disableCreateButton &&
                    <button
                        type="submit"
                        className="btn btn-default"
                        onClick={() => this.handleCreateMeasurements(candidateMeasurements)}
                        disabled={disableCreateButton}
                    >
                        Schemalägg
                    </button>
                    }
                </div>

            </div>
        );

    }

}

export default CandidateMeasurements;