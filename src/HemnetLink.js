import React from 'react';


class HemnetLink extends React.Component {

    render() {
        const {url, linkClassName, isGone} = this.props;

        if (isGone === true) {
            return HemnetLink.goneButton(url, linkClassName);
        } else {
            return HemnetLink.presentButton(url, linkClassName);
        }

    }

    static presentButton(url, linkClassName) {
        return <a
            href={url}
            target='_blank'
            rel="noopener noreferrer"
            className={`btn btn-success btn-sm ` + linkClassName}
        >
            <span
                className={`oi oi-external-link`}
                title="To hemnet"
                aria-hidden="true"
            />
        </a>;
    }

    static goneButton(url, linkClassName) {
        return <a
            href={url}
            target='_blank'
            rel="noopener noreferrer"
            className={`btn btn-sm ` + linkClassName}
        >
            <span
                className="oi oi-x text-dark"
                title="Item is gone"
                aria-hidden="true"
            />
        </a>;
    }
}

export default HemnetLink;