function Character (characterId) {
  DefaultObject.call(this);

  this.id = 'Objects.Character';

  this.characterId = characterId;

  this.move = function (direction, character, user) {
    this.map.message(new Packet.Message('Hello user!', user));
  }

  this.tile = function () {
    return 'character';
  }
}

module.exports = {
  'Character': Character
}

var Vec = require('../vec/lib.js');
var DefaultObject = require('./default.js');
var Packet = require('../packet/lib.js');
