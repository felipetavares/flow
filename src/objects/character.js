var Vec = require('../vec/lib.js');
var DefaultObject = require('./default.js');

function Character () {
    this.id = 'Objects.Character';

    this.pos = new Vec.Vec2();

    this.move = DefaultObject.move;

    this.character = function () {
	return '@';
    }
}

module.exports = {
    'Character': Character
}
