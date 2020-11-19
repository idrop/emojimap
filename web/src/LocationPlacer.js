import React from "react";
import EmojiMarker from "./EmojiMarker";

export default function LocationPlacer({locations}) {

    if (locations != null) {

        return (
            <>
                {locations.map(value => <EmojiMarker position={[value.lat, value.lng]} key={'' + value.hash} emoji={value.emoji}/>)}
            </>
        );
    }
    return null;
}