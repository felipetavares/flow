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

function main () {
    var character = new Character.Character();
    var randomMap = new Map.Map();

    randomMap.add(character);

    character.move(new Vec.Vec2(0, -1));
    character.move(new Vec.Vec2(2, 0));
    character.move(new Vec.Vec2(0, 8));

    console.log(character.pos.str());
}

main();
