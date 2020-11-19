import React from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import MapManager from "./MapManager";

export default function Map() {

    const getLastPos = () => {
        const pos = localStorage.getItem("last_pos");
        return pos === null ? [51.505, -0.09] : JSON.parse(pos);
    }

    const getLastZoom = () => {
        const zoom = localStorage.getItem("last_zoom");
        return zoom === null ? 13 : Number.parseInt(zoom);
    }

    return (
        <MapContainer center={getLastPos()} zoom={getLastZoom()} scrollWheelZoom={true} doubleClickZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapManager/>
        </MapContainer>
    );

}