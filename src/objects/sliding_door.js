function SlidingDoor () {
  this.id = 'Objects.SlidingDoor';

  this.closed = true;

  this.pos = new Vec.Vec2();

  this.move = function () {
  }
  this.open = function () {
    this.closed = false;
  }
  this.close = function () {
    this.closed = true;
  }

  this.tile = function () {
    return 'sliding_door:'+this.closed?'closed':'open';
  }
}

module.exports = {
  'SlidingDoor': SlidingDoor
}

var Vec = require('../vec/lib.js');
var DefaultObject = require('./default.js');
