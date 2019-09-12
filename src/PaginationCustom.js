import React from 'react';
import Pagination from "react-js-pagination";


class PaginationCustom extends React.Component {

    render() {
        const {page, perPageCount, totalCount, displayRage} = this.props;


        return <nav aria-label="...">
            <Pagination
                activePage={page}
                itemsCountPerPage={perPageCount}
                totalItemsCount={totalCount}
                pageRangeDisplayed={displayRage}
                onChange={(pageNumber) => this.props.handlePageChange(pageNumber)}
                innerClass="pagination"
                activeClass="active"
                itemClass="page-item"
                linkClass="page-link"
            />
        </nav>;
    }
}

export default PaginationCustom;