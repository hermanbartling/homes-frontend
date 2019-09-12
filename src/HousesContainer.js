import React from "react";
import {Link} from "react-router-dom";
import HousesForm from "./HousesForm";
import BreadCrumbs from "./BreadCrumbs";


class HousesContainer extends React.Component {

    render() {

        return <div>
            <BreadCrumbs
                links={[<Link to="/">Home</Link>]}
                activePage="Houses"
            />

            <HousesForm
                location={this.props.location}
                history={this.props.history}
            />

        </div>;
    }

}

export default HousesContainer;
