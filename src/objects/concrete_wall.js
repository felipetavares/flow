var Vec = require('../vec/lib.js');
var DefaultObject = require('./default.js');

function ConcreteWall () {
  this.id = 'Objects.ConcreteWall';

  this.pos = new Vec.Vec2();

  this.move = function () {

  }

  this.tile = function () {
    return 'concrete_wall';
  }
}

module.exports = {
  'ConcreteWall': ConcreteWall
}
