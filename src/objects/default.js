module.exports = function () {
  this.map = null;
  this.connected = new Array();
  this.pos = new Vec.Vec2();

  this.move = function (delta) {
    return this.map.tryMove(this, delta);
  }

  this.connect = function (to, actionsMap) {
    this.connected.push({
      uniqueId: to,
      action: actionsMap
    });
  }

  this.activateConnected = function (action) {
    // Enable all connected objects
    for (var c in this.connected) {
      var o = this.map.objects[this.connected[c].uniqueId];
      o[this.connected[c].action[action]]();
    }
  }
};

var Vec = require('../vec/lib.js');
