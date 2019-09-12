import React from "react";


class TableForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleChangedWidth = this.handleChangedWidth.bind(this);
        this.handleChangedHeight = this.handleChangedHeight.bind(this);
        this.handleChangedDepth = this.handleChangedDepth.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangedWidth(event) {
        let newWidth = event.target.value;
        this.props.onWidthChanged(newWidth);
    }

    handleChangedHeight(event) {
        let newHeight = event.target.value;
        this.props.onHeightChanged(newHeight);
    }

    handleChangedDepth(event) {
        let newDepth = event.target.value;
        this.props.onDepthChanged(newDepth);
    }

    handleSubmit(event) {
        console.log(this.state + "submitted");
    }

    render() {
        const {height, width, depth} = this.props;

        return (
            <div>
                <form className="form-horizontal" onSubmit={this.handleSubmit}>

                    <div className="row">
                        <div className="col-sm-6">

                            <div className="form-group">
                                <label className="col-sm-3 control-label text-left">Bredd: </label>
                                <div className="col-sm-3">
                                    <input
                                        className="form-control text-center"
                                        type="number"
                                        min="20"
                                        max="300"
                                        value={width}
                                        onChange={this.handleChangedWidth}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label text-left">Djup: </label>
                                <div className="col-sm-3">
                                    <input
                                        className="form-control text-center"
                                        type="number"
                                        min="10"
                                        max="200"
                                        value={depth}
                                        onChange={this.handleChangedDepth}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label text-left">Höjd: </label>
                                <div className="col-sm-3">
                                    <input
                                        className="form-control text-center"
                                        type="number"
                                        min="10"
                                        max="200"
                                        value={height}
                                        onChange={this.handleChangedHeight}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                </form>
            </div>
        );
    }

}


export default TableForm;