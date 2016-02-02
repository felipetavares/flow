module.exports = function () {
  this.map = null;
  this.connected = new Array();
  this.pos = new Vec.Vec2();
  this.z = 0;

  this.move = function (delta) {
    return this.map.tryMove(this, delta);
  }

  this.connect = function (to, actionsMap) {
    this.connected.push({
      uniqueId: to,
      action: actionsMap
    });
  }

  this.activateConnected = function (action, character, user) {
    // Enable all connected objects
    for (var c in this.connected) {
      var o = this.map.objects[this.connected[c].uniqueId];
      o[this.connected[c].action[action]](character, user);
    }
  }

  this.solid = function () {
    return true;
  }

  this.tile = function () {
    return 'blank';
  }
};

var Vec = require('../vec/lib.js');
