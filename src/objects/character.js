function Character (characterId) {
  DefaultObject.call(this);
  this.z = 1;

  this.id = 'Objects.Character';

  this.characterId = characterId;

  this.access = function (character, user) {
    this.map.message(new Packet.Message('Hello '+user.name, user));
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
