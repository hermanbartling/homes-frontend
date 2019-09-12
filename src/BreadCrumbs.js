import React from 'react';


class BreadCrumbs extends React.Component {

    render() {
        const {links, activePage} = this.props;


        return (
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {links.map((link, index) => (
                        <li
                            className="breadcrumb-item"
                            key={index}
                        >{link}</li>
                    ))}
                    <li className="breadcrumb-item active" aria-current="page">{activePage}</li>
                </ol>
            </nav>);
    }
}

export default BreadCrumbs;