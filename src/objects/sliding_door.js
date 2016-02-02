function SlidingDoor () {
  DefaultObject.call(this);

  this.id = 'Objects.SlidingDoor';

  this.closed = true;

  this.move = function () {
  }
  this.open = function (character, user) {
    this.closed = false;

    this.map.message(new Packet.Message('The sliding door opens', user));
  }
  this.close = function (character, user) {
    this.closed = true;

    this.map.message(new Packet.Message('The sliding door closes', user));
  }

  this.tile = function () {
    return 'sliding_door:'+(this.closed?'closed':'open');
  }

  this.solid = function () {
    return this.closed;
  }
}

module.exports = {
  'SlidingDoor': SlidingDoor
}

var Vec = require('../vec/lib.js');
var DefaultObject = require('./default.js');
var Packet = require('../packet/lib.js');
