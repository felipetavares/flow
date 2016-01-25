#!/usr/bin/env node

var Package = require('../package.json');
var Character = require('./objects/character.js');
var Map = require('./map/lib.js');
var Vec = require('./vec/lib.js');

// Log information about the client before starting.

// TODO: Use a flag instead of always logging. When -v is passed,
// print info and exit.

console.log('Flow Client');
console.log('Version '+Package.version);
console.log();

function main () {
    var character = new Character.Character();
    var map = new Map.Map();

    map.add(character);

    map.draw();
    console.log();
    console.log('% ');
    
    // Read user input
}

main();
