import React from "react";
import HouseListItem from "./HouseListItem";


class HouseList extends React.Component {

    render() {
        const {
            houses
        } = this.props;

        if (houses == null) {
            return <div>Loading houses ...</div>;
        }

        return (
            <div>
                <table className="table table-sm table-hover">
                    <caption>Houses: {houses.length}</caption>
                    <thead>
                    </thead>
                    <tbody>
                    {houses.map((house) => (
                        <HouseListItem
                            house={house}
                            key={house.id}
                            goToHouseDetails={(houseId) => this.props.goToHouseDetails(houseId)}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        );

    }

}

export default HouseList;
