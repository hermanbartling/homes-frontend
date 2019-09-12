import React, {Fragment} from 'react';
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import {Link} from "react-router-dom";


class HomesMap extends React.Component {

    render() {
        const {
            centerCoordinate,
            homes,
            homePath,
            addLinkInPopup = true,
            boundingBoxCoordinates = null,
            zoom = 15
        } = this.props;

        let centerPosition = centerCoordinate != null ? [centerCoordinate.lat, centerCoordinate.lng] : [59, 18];

        let bounds = null;
        let defaultZoom = zoom;
        if (homes != null && homes.length === 1) {
            defaultZoom = 17;
        }


        if (boundingBoxCoordinates != null && homes.length > 1) {
            bounds = [
                [boundingBoxCoordinates.corner1.lat, boundingBoxCoordinates.corner1.lng],
                [boundingBoxCoordinates.corner2.lat, boundingBoxCoordinates.corner2.lng]
            ];
            defaultZoom = null;
        }

        let mapMarkers = [];
        if (homes != null) {
            for (let i = 0; i < homes.length; i++) {
                let home = homes[i];
                let popupContent = <Link to={homePath + `/` + home.id} target="_blank">{home.address}</Link>;
                if (!addLinkInPopup) {
                    popupContent = home.address;
                }

                if (home.coordinate == null || home.coordinate.lat == null || home.coordinate.lng == null) {
                    continue;
                }

                mapMarkers.push(
                    <Marker
                        key={home.id}
                        position={[home.coordinate.lat, home.coordinate.lng]}
                    >
                        <Popup>
                            {popupContent}
                        </Popup>
                    </Marker>
                );
            }
        } else {
            return <div>The map is loading ...</div>
        }

        return <Map
            center={centerPosition}
            zoom={defaultZoom}
            bounds={bounds}
        >
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Fragment>{mapMarkers}</Fragment>

        </Map>;
    }
}

export default HomesMap;