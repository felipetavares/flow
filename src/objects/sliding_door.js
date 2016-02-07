function SlidingDoor () {
  DefaultObject.call(this);

  this.id = 'Objects.SlidingDoor';

  this.closed = true;

  this.move = function () {
  }
  this.open = function (character, user) {
    user.setDirty(this, 'closed');

    this.closed = false;

    user.message(new Packet.Message('The sliding door opens'));
  }
  this.close = function (character, user) {
    user.setDirty(this, 'closed');

    this.closed = true;

    user.message(new Packet.Message('The sliding door closes'));
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

var Vec = require('../vec');
var DefaultObject = require('./default.js');
var Packet = require('../packet');
