import React from "react";
import CommunicationError from "./CommunicationError";
import ApiUtil from "./ApiUtil";


class BrfDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            brf: null,
            communicationError: null,
            brfInfoMissing: false
        };
        this.apiUtil = new ApiUtil();

        this.getBrfDetails = this.getBrfDetails.bind(this);

    }

    componentDidMount() {
        if (this.props.brfId != null) {
            this.getBrfDetails(this.props.brfId);
        } else {
            this.setState({
                brfInfoMissing: true,
            });
        }
    }

    getBrfDetails(id) {
        this.apiUtil.getBrf(id)
            .then(
                (result) => {
                    this.setState({
                        brf: result,
                        communicationError: null,
                    });
                },
                (error) => {
                    this.setState({
                        communicationError: error
                    });
                }
            );
    }


    render() {
        const {
            brf,
            communicationError,
            brfInfoMissing
        } = this.state;

        if (communicationError) {
            return <CommunicationError
                customHeader={'Problem att ladda BRF-info'}
                error={communicationError}
            />;
        } else if (brf == null && !brfInfoMissing) {
            return <h1>LOADING...</h1>;
        } else if (brfInfoMissing) {
            return <div>
                <h3>Föreningsinfo</h3>
                Information om bostadsrättsföreningen saknas.
            </div>;
        } else {

            // console.log(brf);

            return (
                <div>
                    <h3>Föreningsinfo</h3>
                    <p>
                        Namn: <strong>{brf.name}</strong><br/>
                        Medlemmar: <strong>{brf.memberCount}</strong><br/>
                        Registreringsår: <strong>{brf.yearRegistered}</strong><br/>
                        Status: <strong>{brf.status}</strong><br/>
                    </p>
                </div>
            );
        }

    }

}

export default BrfDetails;
