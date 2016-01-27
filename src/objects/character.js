var Vec = require('../vec/lib.js');
var DefaultObject = require('./default.js');

function Character (addr) {
    this.id = 'Objects.Character';

    this.addr = addr;
    this.pos = new Vec.Vec2();

    this.move = DefaultObject.move;

    this.character = function () {
	return '@';
    }
}

module.exports = {
    'Character': Character
}
