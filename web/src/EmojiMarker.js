import React from "react";
import {divIcon, Point} from 'leaflet';
import {Marker} from 'react-leaflet';

export default function EmojiMarker({position, uuid, emoji}) {

    const point = new Point(15, 30);
    const icon = divIcon({className: 'marker', html: emoji, iconAnchor: point});
    return <Marker position={position} key={uuid} icon={icon}/>
}