var Objects = require('../objects/lib.js');
var Map = require('../map/lib.js');
var Vec = require('../vec/lib.js');

function Game () {
    this.character = new Objects.Character();
    this.map = new Map.Map();
    this.map.add(this.character);
}

module.exports = {
    'Game': Game
}
