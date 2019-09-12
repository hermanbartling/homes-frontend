import React from 'react';
import moment from "moment";
import HemnetLink from "./HemnetLink";


class HouseListItem extends React.Component {

    render() {
        const {house} = this.props;

        let externalLink = <span>Removed</span>;
        if (!house.removed) {
            externalLink = <HemnetLink url={house.url}/>
        } else {
            externalLink = <span
                className="oi oi-x text-dark"
                title="House is gone"
                aria-hidden="true"
            ></span>;

        }


        let thumbnail = <span>No images :(</span>;

        if (house.firstImageUrl != null) {
            thumbnail = <img
                src={house.firstImageUrl}
                className="thumbnail-size rounded mx-auto d-block img-thumbnail"
                alt={``}
            />
        }


        return (
            <tr
                key={house.id}
                className="table-row"
                onClick={() => this.props.goToHouseDetails(house.id)}
            >
                <td>{thumbnail}</td>
                <td>
                    <dl className="row home-list-details">
                        <dt className="col-sm-6">
                            Municipality
                        </dt>
                        <dd className="col-sm-6 font-weight-bold">
                            {house.municipality}
                        </dd>
                        <dt className="col-sm-6">
                            Area
                        </dt>
                        <dd className="col-sm-6">
                            {house.area}
                        </dd>
                        <dt className="col-sm-6">
                            Address
                        </dt>
                        <dd className="col-sm-6">
                            {house.address}
                        </dd>
                    </dl>
                </td>
                <td>
                    <dl className="row home-list-details">
                        <dt className="col-sm-6">
                            Price
                        </dt>
                        <dd className="col-sm-6 font-weight-bold">
                            {house.price} kr
                        </dd>
                        <dt className="col-sm-6">
                            Added
                        </dt>
                        <dd className="col-sm-6">
                            {moment(house.timeAdded).format("YYYY-MM-DD")}
                        </dd>
                        <dt className="col-sm-6">
                            Days online
                        </dt>
                        <dd className="col-sm-6">
                            {moment().diff(moment(house.timeAdded, 'YYYYMMDD'), 'days')}
                        </dd>
                    </dl>
                </td>
                <td className="text-center align-middle">{externalLink}</td>
            </tr>

        );
    }
}

export default HouseListItem;