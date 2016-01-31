function Character (characterId) {
  this.id = 'Objects.Character';

  this.characterId = characterId;

  this.pos = new Vec.Vec2();

  this.move = DefaultObject.move;

  this.tile = function () {
    return 'character';
  }
}

module.exports = {
  'Character': Character
}

var Vec = require('../vec/lib.js');
var DefaultObject = require('./default.js');
