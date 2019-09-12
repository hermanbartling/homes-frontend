import React from "react";
import BrListItem from "./BrListItem";


class BrList extends React.Component {

    render() {
        const {
            brs
        } = this.props;

        if (brs == null) {
            return <div>Loading brs ...</div>;
        }

        return (
            <div>
                <table className="table table-sm table-hover">
                    <thead>
                    </thead>
                    <tbody>
                    {brs.map((br) => (
                        <BrListItem
                            br={br}
                            key={br.id}
                            goToBrDetails={(brId) => this.props.goToBrDetails(brId)}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        );

    }


}

export default BrList;
