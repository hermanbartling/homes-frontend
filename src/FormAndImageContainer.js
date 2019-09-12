import React from "react";
import TableImage from "./TableImage";
import TableForm from "./TableForm";


class FormAndImageContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 200,
            height: 70,
            depth: 60
        };

        this.handleWidthChanged = this.handleWidthChanged.bind(this);
        this.handleHeightChanged = this.handleHeightChanged.bind(this);
        this.handleDepthChanged = this.handleDepthChanged.bind(this);
    }

    handleWidthChanged(newWidth) {
        this.setState({
            width: newWidth
        });
    }

    handleHeightChanged(newHeight) {
        this.setState({
            height: newHeight
        });
    }

    handleDepthChanged(newDepth) {
        this.setState({
            depth: newDepth
        });
    }

    render() {
        const {height, width, depth} = this.state;

        return (
            <div>
                <h3>What you want</h3>
                <TableForm
                    onWidthChanged={(newWidth) => this.handleWidthChanged(newWidth)}
                    onHeightChanged={(newHeight) => this.handleHeightChanged(newHeight)}
                    onDepthChanged={(newDepth) => this.handleDepthChanged(newDepth)}
                    height={height}
                    width={width}
                    depth={depth}
                />
                <hr/>
                <h3>What you get</h3>
                <TableImage
                    height={height}
                    width={width}
                    depth={depth}
                />
            </div>

        );
    }

}

export default FormAndImageContainer;
