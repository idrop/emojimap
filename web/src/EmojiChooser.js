import {useState} from "react";
import {Popup, useMap, useMapEvents} from "react-leaflet";
import {Picker} from "emoji-mart";
import 'emoji-mart/css/emoji-mart.css'

export default function EmojiChooser({setEmojiPosFn}) {

    const [position, setPosition] = useState(null);

    const onEmojiClick = (emojiObject) => {
        const newVar = {lat: position.lat, lng: position.lng, emoji: emojiObject.native, unified: emojiObject.unified, test: "y"};
        setEmojiPosFn(newVar);
        setPosition(null);
    };

    const map = useMap();

    useMapEvents({
        click(e) {
            localStorage.setItem("last_pos", JSON.stringify(e.latlng));
            localStorage.setItem("last_zoom", map.getZoom().toString());
            setPosition(e.latlng);
        }
    });

    return position === null ? null :
        <Popup position={position}>
            <Picker onSelect={onEmojiClick} emoji={""} theme={"auto"} showSkinTones={false} />
        </Popup>

}