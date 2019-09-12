import React from "react";
import {Link} from "react-router-dom";
import BreadCrumbs from "./BreadCrumbs";
import BrsForm from "./BrsForm";


class HousesContainer extends React.Component {

    render() {

        return <div>
            <BreadCrumbs
                links={[<Link to="/">Home</Link>]}
                activePage="Brs"
            />

            <BrsForm
                location={this.props.location}
                history={this.props.history}
            />

        </div>;
    }

}

export default HousesContainer;
