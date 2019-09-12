import React from "react";
import ApiUtil from "./ApiUtil";
import CommunicationError from "./CommunicationError";
import * as queryString from "query-string";
import PaginationCustom from "./PaginationCustom";
import HomesMap from "./HomesMap";
import BrList from "./BrList";
import {createSorter} from './utils/Sort';


const WAIT_INTERVAL = 500;
const ENTER_KEY = 13;

const Q_PAGE = 'page';
const Q_PAGE_SIZE = 'pageSize';
const Q_AREA = 'area';
const Q_BROKER_PERSON_NAME = 'brokerPersonName';
const Q_ADDRESS = 'address';
const Q_EXCLUDE_REMOVED = 'excludeRemoved';

class BrsForm extends React.Component {

    constructor(props) {
        super(props);
        const queryParams = queryString.parse(this.props.location.search);

        this.state = {
            brs: [],
            sorters: [{property: 'sqmLiving', direction: 'DESC'}, {property: 'fee', direction: 'DESC'}, {property: 'timeAdded', direction: 'DESC'}],
            mapConfig: {
                centerCoordinate: null,
                boundingBox: null
            },
            communicationError: null,
            [Q_PAGE]: queryParams[Q_PAGE] ? queryParams[Q_PAGE] : 1,
            [Q_PAGE_SIZE]: queryParams[Q_PAGE_SIZE] ? queryParams[Q_PAGE_SIZE] : 100,
            totalItemsCount: null,
            totalPageCount: null,
            [Q_AREA]: Q_AREA in queryParams ? queryParams[Q_AREA] : '',
            [Q_ADDRESS]: Q_ADDRESS in queryParams ? queryParams[Q_ADDRESS] : '',
            [Q_BROKER_PERSON_NAME]: Q_BROKER_PERSON_NAME in queryParams ? queryParams[Q_BROKER_PERSON_NAME] : '',
            [Q_EXCLUDE_REMOVED]: !(Q_EXCLUDE_REMOVED in queryParams && queryParams[Q_EXCLUDE_REMOVED] === 'false'),
        };
        this.apiUtil = new ApiUtil();

        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.getBrs = this.getBrs.bind(this);
        this.updateURL = this.updateURL.bind(this);
        this.goToBrDetails = this.goToBrDetails.bind(this);

    }

    updateURL = () => {
        const searchParams = new URLSearchParams();
        if (this.state[Q_PAGE] != null) {
            searchParams.set(Q_PAGE, this.state[Q_PAGE])
        }
        if (this.state[Q_PAGE_SIZE] != null) {
            searchParams.set(Q_PAGE_SIZE, this.state[Q_PAGE_SIZE])
        }
        if (this.state[Q_AREA].length > 0) {
            searchParams.set(Q_AREA, this.state[Q_AREA])
        }
        if (this.state[Q_ADDRESS].length > 0) {
            searchParams.set(Q_ADDRESS, this.state[Q_ADDRESS])
        }
        if (this.state[Q_BROKER_PERSON_NAME].length > 0) {
            searchParams.set(Q_BROKER_PERSON_NAME, this.state[Q_BROKER_PERSON_NAME])
        }
        searchParams.set(Q_EXCLUDE_REMOVED, this.state[Q_EXCLUDE_REMOVED]);

        const queryParams = searchParams.toString();
        this.props.history.push(`?${queryParams}`);
    };

    componentDidMount() {
        this.timer = null;
        this.applyFilter();
    }

    getBrs() {

        let searchParams = {
            [Q_AREA]: this.state[Q_AREA],
            [Q_ADDRESS]: this.state[Q_ADDRESS],
            [Q_BROKER_PERSON_NAME]: this.state[Q_BROKER_PERSON_NAME],
        };

        if (this.state[Q_EXCLUDE_REMOVED] === true) {
            searchParams[Q_EXCLUDE_REMOVED] = this.state[Q_EXCLUDE_REMOVED];
        }

        this.apiUtil.getBrs(
            this.state[Q_PAGE],
            this.state[Q_PAGE_SIZE],
            searchParams
        )
            .then(
                (result) => {

                    const {sorters} = this.state;
                    if (result.homes && result.homes.length) {
                        if (Array.isArray(sorters) && sorters.length) {
                            result.homes.sort(createSorter(...sorters));
                        }
                    }

                    this.setState({
                        brs: result.homes,
                        totalItemsCount: result.pagination.totalElements,
                        totalPageCount: result.pagination.totalPages,
                        mapConfig: result.mapConfig,
                        communicationError: null
                    });

                    if (result.homes.length < 100) {
                        this.setState({
                            [Q_PAGE_SIZE]: 100
                        });
                    }


                },
                (error) => {
                    this.setState({
                        communicationError: error
                    });
                }
            );
    }


    handlePageSizeChange(pageSize) {
        this.setState(
            {[Q_PAGE_SIZE]: pageSize},
            () => {
                this.applyFilter()
            });
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
        this.getBrs();
    }

    goToBrDetails(brId) {
        let path = `/brs/` + brId;
        // this.props.history.push(path);
        var win = window.open(path, '_blank');
        win.focus();
    }

    render() {
        const {
            brs,
            totalItemsCount,
            totalPageCount,
            mapConfig,
            communicationError
        } = this.state;

        let brList = <BrList
            brs={brs}
            goToBrDetails={(brId) => this.goToBrDetails(brId)}
        />;

        if (communicationError != null) {
            brList = <CommunicationError error={communicationError}/>;
        }

        let map = "";
        if (brs != null && brs.length > 0) {
            map = <HomesMap
                centerCoordinate={mapConfig.centerCoordinate}
                homes={brs}
                homePath={`/brs`}
                boundingBoxCoordinates={mapConfig.boundingBox}
                zoom={8}
            />

        }

        let pagination = "";
        if (totalPageCount > 1) {
            pagination = <PaginationCustom
                page={this.state[Q_PAGE]}
                perPageCount={this.state[Q_PAGE_SIZE]}
                totalCount={totalItemsCount}
                displayRage={10}
                handlePageChange={(page) => {
                    this.handlePageChange(page)
                }}
            />
        }

        let resultCount = <div>Found: {totalItemsCount}, Showing: {brs.length}</div>;
        if (brs.length < totalItemsCount) {
            resultCount = <div>
                Found: {totalItemsCount}, Showing: {brs.length}, <a className="btn btn-sm" href="#"
                                                                    onClick={() => this.handlePageSizeChange(totalItemsCount)}>Show
                all</a>
            </div>;
        }

        return (
            <div>
                <form>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label className="col-form-label-sm">Område</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Område"
                                name={Q_AREA}
                                value={this.state[Q_AREA]}
                                onChange={this.handleFilterChange}
                                onKeyDown={this.handleKeyDown}
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label className="col-form-label-sm">Adress</label>
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
                        <div className="form-group col-md-4">
                            <label className="col-form-label-sm">Mäklare</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Mäklare"
                                name={Q_BROKER_PERSON_NAME}
                                value={this.state[Q_BROKER_PERSON_NAME]}
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
                                Exclude removed brs
                            </label>
                        </div>
                        {resultCount}
                    </div>

                </form>

                <div className="row">
                    <div className="col-sm-12">
                        {map}
                    </div>
                </div>

                {brList}
                {pagination}

            </div>
        );

    }

}

export default BrsForm;
