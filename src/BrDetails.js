import React from "react";
import Images from "./Images";
import CommunicationError from "./CommunicationError";
import ApiUtil from "./ApiUtil";
import moment from "moment";
import HemnetLink from "./HemnetLink";
import HomesMap from "./HomesMap";
import BrfDetails from "./BrfDetails";


class BrDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            details: null,
            communicationError: null,
        };
        this.apiUtil = new ApiUtil();

        this.getBrDetails = this.getBrDetails.bind(this);

    }

    componentDidMount() {
        this.getBrDetails(this.props.brId);
    }

    getBrDetails(id) {
        this.apiUtil.getBr(id)
            .then(
                (result) => {
                    this.setState({
                        details: result,
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
            details,
            communicationError
        } = this.state;

        if (communicationError) {
            return <CommunicationError error={communicationError}/>;
        } else if (details == null) {
            return <h1>LOADING...</h1>;
        } else {

            // let coordinate = {lat: 59.2399, lng: 18.4705};
            // let position = [
            //     details.coordinate.lat,
            //     details.coordinate.lng
            // ];
            // console.log(position);

            let map = "No coordinate :-(";
            if (details.coordinate != null) {
                map = <HomesMap
                    centerCoordinate={details.coordinate}
                    homes={[details]}
                    addLinkInPopup={false}
                />;
            }


            return (
                <div>
                    <h1>{details.address}
                        <small>
                            <HemnetLink
                                url={details.url}
                                linkClassName="float-right"
                                isGone={details.removed}
                            />
                        </small>
                    </h1>

                    <div className="row">
                        <div className="col-sm-6">
                            <dl className="row home-list-details">
                                <dt className="col-sm-6">
                                    Address
                                </dt>
                                <dd className="col-sm-6">
                                    {details.address}
                                </dd>
                                <dt className="col-sm-6">
                                    Avgift
                                </dt>
                                <dd className="col-sm-6">
                                    {details.fee}
                                </dd>
                                <dt className="col-sm-6">
                                    Rum
                                </dt>
                                <dd className="col-sm-6">
                                    {details.rooms}
                                </dd>
                                <dt className="col-sm-6">
                                    Area
                                </dt>
                                <dd className="col-sm-6">
                                    {details.sqmLiving}
                                </dd>
                                <dt className="col-sm-6">
                                    Added
                                </dt>
                                <dd className="col-sm-6">
                                    {moment(details.timeAdded).format("YYYY-MM-DD")}
                                </dd>
                                <dt className="col-sm-6">
                                    Days online
                                </dt>
                                <dd className="col-sm-6">
                                    {moment().diff(moment(details.timeAdded, 'YYYYMMDD'), 'days')}
                                </dd>
                            </dl>
                        </div>


                        <div className="col-sm-6">
                            <dl className="row home-list-details">
                                <dt className="col-sm-6">
                                    Price
                                </dt>
                                <dd className="col-sm-6 font-weight-bold">
                                    {details.price} kr
                                </dd>
                                <dt className="col-sm-6">
                                    Living area
                                </dt>
                                <dd className="col-sm-6 font-weight-bold">
                                    {details.sqmLiving} sqm
                                </dd>
                                <dt className="col-sm-6">
                                    Broker
                                </dt>
                                <dd className="col-sm-6 font-weight-bold">
                                    {details.broker.personName}
                                </dd>
                                <dt className="col-sm-6">
                                    Broker Firm
                                </dt>
                                <dd className="col-sm-6 font-weight-bold">
                                    {details.broker.firmName}
                                </dd>
                            </dl>

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <BrfDetails brfId={details.brfId}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            {map}
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-sm-12">
                            <Images
                                urls={details.imageUrls}
                            />
                        </div>
                    </div>

                </div>
            );
        }

    }

}

export default BrDetails;
