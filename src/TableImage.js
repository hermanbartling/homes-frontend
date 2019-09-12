import React from "react";


class TableImage extends React.Component {

    constructor(props) {
        super(props);
        this.leftPadding = 40;
        this.topPadding = 40;
        this.measureColor = "#000000";
    }

    getWidthMeasure(width) {
        let left = this.leftPadding;
        let right = left + parseInt(width);
        let top = this.topPadding / 2;

        let arr = [
            left + "," + top,
            right + "," + top
        ];

        return arr.join(" ");
    }

    getHeightMeasure(height) {
        let top = this.topPadding;
        let bottom = this.topPadding + parseInt(height);
        let left = this.leftPadding / 2;

        let arr = [
            left + "," + top,
            left + "," + bottom
        ];

        return arr.join(" ");
    }

    getHeightMeasurePath(height) {
        let top = this.topPadding;
        let bottom = this.topPadding + parseInt(height);
        let left = this.leftPadding / 2;

        let arr = [
            "M" + left + "," + bottom,
            left + "," + top
        ];

        return arr.join(" ");
    }

    getTopBar(width) {
        let left = this.leftPadding;
        let right = left + parseInt(width);
        let top = this.topPadding;
        let bottom = top + 10;

        let arr = [
            left + "," + top,
            right + "," + top,
            right + "," + bottom,
            left + "," + bottom
        ];

        return arr.join(" ");
    }

    getLeftLeg(height, width) {
        let left = (width / 10) + this.leftPadding;
        let right = left + 10;
        let top = 10 + this.topPadding;
        let bottom = top + parseInt(height) - 10;

        let arr = [
            left + "," + top,
            right + "," + top,
            right + "," + bottom,
            left + "," + bottom
        ];

        return arr.join(" ");
    }

    getRightLeg(height, width) {
        let right = width - (width / 10) + this.leftPadding;
        let left = right - 10;
        let top = 10 + this.topPadding;
        let bottom = top + parseInt(height) - 10;

        let arr = [
            left + "," + top,
            right + "," + top,
            right + "," + bottom,
            left + "," + bottom
        ];

        return arr.join(" ");
    }

    render() {
        const {height, width, depth} = this.props;

        return (
            <div>
                <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 640 200"
                    width="640" height="200"
                >
                    <style>
                        .small {}
                    </style>
                    <text
                        x={width / 2 + this.leftPadding - 20}
                        y={this.topPadding / 2 - 10}
                        className="measurement-text"
                    >{width} cm
                    </text>
                    <polyline
                        points={this.getWidthMeasure(width)}
                        fill="none"
                        stroke={this.measureColor}
                    />
                    <text
                        // y={height / 2 + this.topPadding + 10}
                        // x={this.leftPadding / 2 - 10}
                        // className="measurement-text vertical"
                    >
                        <textPath
                            href="#heightLine"
                            method='strech'
                        >
                            {height} cm
                        </textPath>

                    </text>
                    <path
                        // points={this.getHeightMeasure(height)}
                        d={this.getHeightMeasurePath(height)}
                        // d="10,90 75,50"
                        fill="none"
                        stroke={this.measureColor}
                        id='heightLine'
                    />

                    <polygon
                        points={this.getTopBar(width)}
                        className='wood'
                        stroke="none"
                        id="top_regel"
                    />
                    <polygon
                        points={this.getLeftLeg(height, width)}
                        className='wood'
                        stroke="none"
                        id="left_leg"
                    />
                    <polygon
                        points={this.getRightLeg(height, width)}
                        className='wood'
                        stroke="none"
                        id="right_leg"
                    />
                </svg>

                <p>Height: {height}</p>
                <p>Width: {width}</p>
                <p>Depth: {depth}</p>
            </div>
        );
    }
}

export default TableImage;