import React from 'react';
import SchedulingForm from './SchedulingForm';
import ScheduledMeasurements from './ScheduledMeasurements';
import CommunicationError from './CommunicationError';
import ApiUtil from './ApiUtil';


class Scheduler extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMeasurementsLoaded: true,
            communicationError: null,
            scheduledMeasurements: [],
            newMeasurementIds: []
        };
        this.schedulingForm = React.createRef();
        this.apiUtil = new ApiUtil();

        this.handleDeleteMeasurement = this.handleDeleteMeasurement.bind(this);
        this.handleCandidatesCreated = this.handleCandidatesCreated.bind(this);
    }

    componentDidMount() {
        this.getScheduledMeasurements();
    }

    getScheduledMeasurements() {
        this.apiUtil.getScheduledMeasurements()
            .then(
                (result) => {
                    this.setState({
                        isMeasurementsLoaded: true,
                        scheduledMeasurements: result,
                        communicationError: null,
                    });
                },
                (error) => {
                    this.setState({
                        isMeasurementsLoaded: true,
                        communicationError: error
                    });
                }
            );
    }

    deleteMeasurement(measurementId) {
        this.apiUtil.deleteMeasurement(measurementId)
            .then(
                (result) => {
                    this.getScheduledMeasurements();
                    this.schedulingForm.current.getMetaData();
                },
                (error) => {
                    this.setState({
                        isMeasurementsLoaded: true,
                        communicationError: error
                    });

                }
            );
    }

    handleDeleteMeasurement(measurementId) {
        this.deleteMeasurement(measurementId);
    }

    handleCandidatesCreated(newMeasurementIds) {
        this.setState({
            newMeasurementIds: newMeasurementIds
        });
        this.getScheduledMeasurements();
    }

    render() {
        const {isMeasurementsLoaded, communicationError, scheduledMeasurements, newMeasurementIds} = this.state;

        if (communicationError) {
            return <CommunicationError error={communicationError}/>;
        } else if (!isMeasurementsLoaded) {
            return <div>Laddar...</div>;
        } else {
            return (
                <div>
                    <SchedulingForm
                        ref={this.schedulingForm}
                        onCandidatesCreated={(newMeasurementIds) => this.handleCandidatesCreated(newMeasurementIds)}
                    />
                    <hr/>
                    <h3>Schemalagda Mätningar</h3>
                    <ScheduledMeasurements
                        onDelete={(measurementId) => this.handleDeleteMeasurement(measurementId)}
                        scheduledMeasurements={scheduledMeasurements}
                        newMeasurementIds={newMeasurementIds}
                    />
                </div>

            );
        }
    }

}

export default Scheduler;
