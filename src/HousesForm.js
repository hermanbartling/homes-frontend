import React from "react";
import ApiUtil from "./ApiUtil";
import HouseList from "./HouseList";
import CommunicationError from "./CommunicationError";
import * as queryString from "query-string";
import PaginationCustom from "./PaginationCustom";
import HomesMap from "./HomesMap";


const WAIT_INTERVAL = 500;
const ENTER_KEY = 13;

const Q_PAGE = 'page';
const Q_AREA = 'area';
const Q_MUNICIPALITY = 'municipality';
const Q_ADDRESS = 'address';
const Q_EXCLUDE_REMOVED = 'excludeRemoved';

class HousesForm extends React.Component {

    constructor(props) {
        super(props);
        const queryParams = queryString.parse(this.props.location.search);

        this.state = {
            houses: null,
            mapConfig: {
                centerCoordinate: null,
                boundingBox: null
            },
            communicationError: null,
            [Q_PAGE]: queryParams[Q_PAGE] ? queryParams[Q_PAGE] : 1,
            itemsCountPerPage: 100,
            totalItemsCount: null,
            [Q_AREA]: Q_AREA in queryParams ? queryParams[Q_AREA] : '',
            [Q_MUNICIPALITY]: Q_MUNICIPALITY in queryParams ? queryParams[Q_MUNICIPALITY] : '',
            [Q_ADDRESS]: Q_ADDRESS in queryParams ? queryParams[Q_ADDRESS] : '',
            [Q_EXCLUDE_REMOVED]: !(Q_EXCLUDE_REMOVED in queryParams && queryParams[Q_EXCLUDE_REMOVED] === 'false'),
        };
        this.apiUtil = new ApiUtil();

        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.getHouses = this.getHouses.bind(this);
        this.updateURL = this.updateURL.bind(this);
        this.goToHouseDetails = this.goToHouseDetails.bind(this);

    }

    updateURL = () => {
        const searchParams = new URLSearchParams();
        if (this.state[Q_PAGE] != null) {
            searchParams.set(Q_PAGE, this.state[Q_PAGE])
        }
        if (this.state[Q_AREA].length > 0) {
            searchParams.set(Q_AREA, this.state[Q_AREA])
        }
        if (this.state[Q_MUNICIPALITY].length > 0) {
            searchParams.set(Q_MUNICIPALITY, this.state[Q_MUNICIPALITY])
        }
        if (this.state[Q_ADDRESS].length > 0) {
            searchParams.set(Q_ADDRESS, this.state[Q_ADDRESS])
        }
        searchParams.set(Q_EXCLUDE_REMOVED, this.state[Q_EXCLUDE_REMOVED]);

        const queryParams = searchParams.toString();
        this.props.history.push(`?${queryParams}`);
    };

    componentDidMount() {
        this.timer = null;
        this.applyFilter();
    }

    getHouses() {

        let searchParams = {
            [Q_AREA]: this.state[Q_AREA],
            [Q_MUNICIPALITY]: this.state[Q_MUNICIPALITY],
            [Q_ADDRESS]: this.state[Q_ADDRESS],
        };

        if (this.state[Q_EXCLUDE_REMOVED] === true) {
            searchParams[Q_EXCLUDE_REMOVED] = this.state[Q_EXCLUDE_REMOVED];
        }

        this.apiUtil.getHouses(
            this.state[Q_PAGE],
            this.state.itemsCountPerPage,
            searchParams
        )
            .then(
                (result) => {
                    this.setState({
                        houses: result.homes,
                        totalItemsCount: result.pagination.totalElements,
                        mapConfig: result.mapConfig,
                        communicationError: null
                    });
                },
                (error) => {
                    this.setState({
                        communicationError: error
                    });
                }
            );
    }


    handlePageChange(pageNumber) {
        this.setState(
            {[Q_PAGE]: pageNumber},
            () => {
                this.applyFilter()
            });
    }

    handleFilterChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState(
            {
                [name]: value,
                [Q_PAGE]: 1
            }
        );

        clearTimeout(this.timer);
        this.timer = setTimeout(this.applyFilter, WAIT_INTERVAL);
    }

    handleKeyDown(event) {
        if (event.keyCode === ENTER_KEY) {
            this.applyFilter();
        }
    }

    applyFilter() {
        this.updateURL();
        this.getHouses();
    }

    goToHouseDetails(houseId) {
        let path = `/houses/` + houseId;
        // this.props.history.push(path);
        var win = window.open(path, '_blank');
        win.focus();
    }

    render() {
        const {
            houses,
            itemsCountPerPage,
            totalItemsCount,
            mapConfig,
            communicationError,
        } = this.state;

        let houseList = <HouseList
            houses={houses}
            goToHouseDetails={(houseId) => this.goToHouseDetails(houseId)}
        />;

        if (communicationError != null) {
            houseList = <CommunicationError error={communicationError}/>;
        }


        return (
            <div>
                <form>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="col-form-label-sm">Municipality</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Municipality"
                                name={Q_MUNICIPALITY}
                                value={this.state[Q_MUNICIPALITY]}
                                onChange={this.handleFilterChange}
                                onKeyDown={this.handleKeyDown}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label className="col-form-label-sm">Address</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Address"
                                name={Q_ADDRESS}
                                value={this.state[Q_ADDRESS]}
                                onChange={this.handleFilterChange}
                                onKeyDown={this.handleKeyDown}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-check">
                            <input
                                className="form-check-input col-control-sm"
                                type="checkbox"
                                name={Q_EXCLUDE_REMOVED}
                                value={this.state[Q_EXCLUDE_REMOVED]}
                                checked={this.state[Q_EXCLUDE_REMOVED]}
                                onChange={this.handleFilterChange}
                                onKeyDown={this.handleKeyDown}
                            />
                            <label className="form-check-label col-form-label-sm" htmlFor="gridCheck">
                                Exclude removed houses
                            </label>
                        </div>
                    </div>
                </form>

                <div className="row">
                    <div className="col-sm-12">
                        <HomesMap
                            centerCoordinate={mapConfig.centerCoordinate}
                            homes={houses}
                            homePath={`/houses`}
                            boundingBoxCoordinates={mapConfig.boundingBox}
                            zoom={8}
                        />
                    </div>
                </div>


                {houseList}
                <PaginationCustom
                    page={this.state[Q_PAGE]}
                    perPageCount={itemsCountPerPage}
                    totalCount={totalItemsCount}
                    displayRage={10}
                    handlePageChange={(page) => {
                        this.handlePageChange(page)
                    }}
                />

            </div>
        );

    }

}

export default HousesForm;
