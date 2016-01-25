var Map = require('../map/lib.js');
var Vec = require('../vec/lib.js');

function Character () {
    this.pos = new Vec.Vec2();

    this.move = Map.DefaultObject.move;
}

module.exports = {
    'Character': Character
}
