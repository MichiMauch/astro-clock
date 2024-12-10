"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var orbit_1 = require("../src/utils/orbit");
var tleLines = [
    "1 25544U 98067A   24345.54333896  .00017806  00000+0  31407-3 0  9998",
    "2 25544  51.6364 161.6568 0007197 324.6090  35.4420 15.50446230485902",
];
var orbit = (0, orbit_1.calculateOrbit)(tleLines);
console.log("Berechnete Umlaufbahn:", orbit);
