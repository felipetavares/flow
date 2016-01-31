function Character (characterId) {
  DefaultObject.call(this);

  this.id = 'Objects.Character';

  this.characterId = characterId;

  this.tile = function () {
    return 'character';
  }
}

module.exports = {
  'Character': Character
}

var Vec = require('../vec/lib.js');
var DefaultObject = require('./default.js');
