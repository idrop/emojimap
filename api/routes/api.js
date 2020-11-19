var express = require('express');
var router = express.Router();

const {body, param, validationResult} = require('express-validator');

const redis = require('redis');
client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
});

geo = require('georedis').initialize(client);

client.on('error', function (err) {
    console.log('redis error ' + err);
});

const latBounds = {min: -85.05112878, max: 85.05112878};
const lngBounds = {min: -180, max: 180};

console.log("inited api.js");

router.post('/map',
    [
        body('lat').isFloat(latBounds),
        body('lng').isFloat(lngBounds),
        body('emoji').not().isEmpty(),
        body('token').not().isEmpty(),
    ],
    (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("errors: " + JSON.stringify(errors.array()));
            return res.status(400).json({ok: false});
        }

        console.log("body is " + JSON.stringify(req.body));
        saveEmojiPos(req.body.lat, req.body.lng, req.body.emoji,)
        res.status(200).json({ok: true});

    });

router.get('/locations/:lat/:lng/:radius',
    [
        param('lat').isFloat(latBounds),
        param('lng').isFloat(lngBounds),
        param('radius').isInt({gt: 0}),
    ],
    (req, res) => {
        getLocations(req.params.lat, req.params.lng, req.params.radius, (response) => {

            const locations = response.map(loc => {
                return {lat: loc.latitude, lng: loc.longitude, emoji: loc.key, hash: loc.hash}
            });

            console.log("About to send back locs " + JSON.stringify(locations))
            res.status(200).json(locations);
        });

    });


module.exports = router;

function saveEmojiPos(lat, lng, emoji) {

    geo.addLocation(emoji, {latitude: lat, longitude: lng}, function (err, reply) {
        if (err) {
            console.error(err);
        } else {
            console.log('1 added location:', reply);
        }
    });
}

function getLocations(lat, lng, radius, callbackFn) {
    console.log("query for geo nearby with lat " + lat + ", lng " + lng + ", rad " + radius);


    var options = {
        withCoordinates: true, // Will provide coordinates with locations, default false
        withHashes: true, // Will provide a 52bit Geohash Integer, default false
    }

    geo.nearby({latitude: lat, longitude: lng}, radius, options, function (err, locations) {
        if (err) {
            console.error(err);
        } else {
            console.log("locs: " + JSON.stringify(locations))
            callbackFn(locations);
        }
    })

}
