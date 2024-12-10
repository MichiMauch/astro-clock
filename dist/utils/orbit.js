"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOrbit = calculateOrbit;
var satellite = require("satellite.js");
function calculateOrbit(tleLines) {
    var satrec = satellite.twoline2satrec(tleLines[0].trim(), tleLines[1].trim());
    var now = new Date();
    var positions = [];
    for (var i = 0; i < 90; i++) { // Berechne für 90 Minuten (Schrittweite: 1 Minute)
        var time = new Date(now.getTime() + i * 60000); // 1 Minute in Millisekunden
        var positionAndVelocity = satellite.propagate(satrec, time);
        var gmst = satellite.gstime(time);
        if (positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
            var position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
            var latitude = satellite.degreesLat(position.latitude);
            var longitude = satellite.degreesLong(position.longitude);
            positions.push({ latitude: latitude, longitude: longitude });
        }
    }
    return positions;
}
