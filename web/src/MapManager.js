import React, {useEffect, useState} from "react";
import {useMap, useMapEvents} from "react-leaflet";
import EmojiChooser from "./EmojiChooser";
import LocationPlacer from "./LocationPlacer";

export default function MapManager() {

    const [locations, setLocations] = useState([]);

    const [drawLoc, setDrawLoc] = useState(new Date());

    const [emojiPos, setEmojiPos] = useState(null);

    const map = useMap();

    /**
     * fn poked by child EmojiChooser when emoji picked in UI
     * @param emojiPos
     */
    const setEmojiPosFn = (emojiPos) => {
        // will cause the useEffect for emojiPos to fire after render
        setEmojiPos(emojiPos);
    }

    /**
     * runs from useEffect for emojiPos
     * @param emojiPos
     */
    const postEmojiPos = (emojiPos) => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({...emojiPos, token: "abc"}),
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',

        };

        fetch('/api/map', requestOptions)
            .then(res => res.json())
            .then(result => {
                    const lastPos = localStorage.getItem("last_pos");
                    const lastZoom = localStorage.getItem("last_zoom");
                    map.flyTo(JSON.parse(lastPos), Number.parseInt(lastZoom));
                    // setDrawLoc(new Date())
                },
                (error) => {
                    console.log("map: got error" + error);
                }
            );
    }

    /**
     * when state emojiPos is set,
     * post the emoji & pos
     */
    useEffect(() => { // for Δ to emojiPos

        if (emojiPos != null) {
            postEmojiPos(emojiPos);
        }
    }, [emojiPos]);


    useEffect(() => { // for Δ to drawLoc

        let latlng = map.getCenter();
        const bounds = map.getBounds();
        const distance = bounds.getNorthWest().distanceTo(bounds.getSouthEast());

        fetch('/api/locations/' + latlng.lat.toFixed(2) + '/' + latlng.lng.toFixed(2) + '/' + distance.toFixed(0) / 2)
            .then(response => response.json())
            .then(locations => {
                setLocations(locations);
            }, (error) => {
                console.log("locations: got error" + error);
            });

    }, [drawLoc]);

    useMapEvents({
        moveend: (e) => {
            setDrawLoc(new Date())
        },
    });

    return (
        <>
            <EmojiChooser setEmojiPosFn={setEmojiPosFn}/>
            <LocationPlacer locations={locations}/>
        </>
    );

}