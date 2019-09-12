import React from 'react';
import {getDateTimeString, getWeekdayFromDateTimeString} from './DateUtil.js';


class ScheduledMeasurements extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deletedMeasurementIds: []
        };
        this.handleDeleteMeasurement = this.handleDeleteMeasurement.bind(this);
    }

    handleDeleteMeasurement(measurementId) {
        this.setState((state) => ({deletedMeasurementIds: [...state.deletedMeasurementIds, measurementId]}));
        this.props.onDelete(measurementId);
    }

    measurementDeleted(measurementId) {
        return this.state.deletedMeasurementIds.includes(measurementId);
    }

    render() {
        const {scheduledMeasurements} = this.props;

        if (scheduledMeasurements.length === 0) {
            return (
                <div>
                    Det finns just nu inga schemalagda mätningar för uppföljningen
                </div>
            );
        } else {
            return (
                <table className="table table-condensed table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>Vecka</th>
                        <th colSpan="2">Start</th>
                        <th colSpan="2">Avslut</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {scheduledMeasurements.map(m => (
                        <tr key={m.id} className={this.props.newMeasurementIds.includes(m.id) ? 'success' : 'default'}>
                            <td>{m.week}</td>
                            <td>{getWeekdayFromDateTimeString(m.start_at)}</td>
                            <td>{getDateTimeString(m.start_at)}</td>
                            <td>{getWeekdayFromDateTimeString(m.end_at)}</td>
                            <td>{getDateTimeString(m.end_at)}</td>
                            <td>
                                {!this.measurementDeleted(m.id) &&
                                <div className="btn-group">
                                    <button
                                        className="btn btn-default btn-xs"
                                        onClick={() => this.handleDeleteMeasurement(m.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                                }
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            );
        }
    }
}

export default ScheduledMeasurements;