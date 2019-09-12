import React, {Component} from "react";
import {Link, Route} from 'react-router-dom';
import HouseDetails from "./HouseDetails";
import HousesContainer from "./HousesContainer";
import BreadCrumbs from "./BreadCrumbs";
import BrsContainer from "./BrsContainer";
import BrDetails from "./BrDetails";

const Home = () => (
    <div>
        <BreadCrumbs
            links={[]}
            activePage="Home"
        />

        <div className="starter-template">
            <h1>DiFo Homes</h1>
            <p className="lead">
                Distilled version of hemnet.<br/>
                Containing historical homes aswell
            </p>
        </div>

        <div className="row">

            <div className="col-sm-6">
                <Link to="/houses" className="custom-card">
                    <div className="card border-dark mb-3 w-100">
                        <div className="card-header">Houses</div>
                        <div className="card-body text-dark">
                            <p className="card-text">Houses can be found here.</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="col-sm-6">
                <Link to="/brs" className="custom-card">
                    <div className="card border-dark mb-3 w-100">
                        <div className="card-header">Brs</div>
                        <div className="card-body text-dark">
                            <p className="card-text">Brs can be found here.</p>
                        </div>
                    </div>
                </Link>
            </div>

        </div>
    </div>
);

const House = ({match}) => (
    <div>
        <BreadCrumbs
            links={[<Link to="/">Home</Link>, <Link to="/houses">Houses</Link>]}
            activePage={match.params.houseId}
        />

        <HouseDetails
            houseId={match.params.houseId}
        />

    </div>
);

const Br = ({match}) => (
    <div>
        <BreadCrumbs
            links={[<Link to="/">Home</Link>, <Link to="/brs">Brs</Link>]}
            activePage={match.params.brId}
        />

        <BrDetails
            brId={match.params.brId}
        />

    </div>
);


class App extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={Home}/>
                <Route exact path="/houses" component={HousesContainer}/>
                <Route path={"/houses/:houseId"} component={House}/>
                <Route exact path="/brs" component={BrsContainer}/>
                <Route path={"/brs/:brId"} component={Br}/>

            </div>
        );
    }
}

export default App;