import React from 'react';
import HemnetLink from "./HemnetLink";
import moment from "moment";
import ImageUtil from "./utils/ImageUtil";


class BrListItem extends React.Component {

    constructor(props) {
        super(props);
        this.imageUtil = new ImageUtil();
    }

    render() {
        const {br} = this.props;


        let timeInfo = <div>
            <strong>{moment().diff(moment(br.timeAdded, 'YYYYMMDD'), 'days')}</strong> dagar online
            ({moment(br.timeAdded).format("YYYY-MM-DD")})
        </div>;

        if (br.removed) {
            timeInfo = <div>
                <strong>{moment(br.timeRemoved).diff(moment(br.timeAdded), 'days')}</strong> dagar online<br/>
                {moment(br.timeAdded).format("YYYY-MM-DD")} -> {moment(br.timeRemoved).format("YYYY-MM-DD")}
            </div>;
        }


        let thumbnail = <span>No images :(</span>;

        if (br.firstImageUrl != null) {
            thumbnail = <img
                src={this.imageUtil.getUrl(br.firstImageUrl)}
                className="thumbnail-size mx-auto d-block"
                alt={``}
            />
        }

        let visitCountInfo = "";
        if (br.visitCount != null) {
            visitCountInfo = <div className="col-sm-1">
                <p>
                    <strong>{br.visitCount}</strong> besök
                </p>
            </div>;
        }


        return (
            <tr
                key={br.id}
                className="table-row"
            >
                <td onClick={() => this.props.goToBrDetails(br.id)}>
                    {thumbnail}
                </td>
                <td onClick={() => this.props.goToBrDetails(br.id)}
                >
                    <div className="row home-list-details">
                        <div className="col-sm-6">
                            <p>
                                <strong>{br.address}</strong>, {br.area}<br/>
                                <strong>{br.sqmLiving}</strong> kvm, <strong>{br.fee}</strong> kr/mån<br/>
                                <strong>{br.rooms}</strong> rum<br/>
                            </p>

                        </div>

                        <div className="col-sm-5">
                            <strong>{br.price}</strong> kr, <strong>{br.pricePerSqm}</strong> kr / kvm<br/>
                            {timeInfo}
                            {br.broker.personName}
                        </div>
                        {visitCountInfo}
                    </div>
                </td>
                <td className="text-center align-middle">
                    <HemnetLink
                        url={br.url}
                        isGone={br.removed}
                    />
                </td>
            </tr>

        );

    }
}

export default BrListItem;