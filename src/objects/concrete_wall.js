function ConcreteWall () {
  DefaultObject.call(this);

  this.id = 'Objects.ConcreteWall';

  this.move = function () {
  }

  this.tile = function () {
    return 'concrete_wall';
  }
}

module.exports = {
  'ConcreteWall': ConcreteWall
}

var Vec = require('../vec');
var DefaultObject = require('./default.js');
