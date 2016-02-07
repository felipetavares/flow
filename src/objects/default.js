module.exports = function () {
  this.map = null;
  this.connected = new Array();
  this.x = 5000;
  this.y = 5000;
  this.z = 0;

  this.move = function (delta, character, user) {
    var prevX = this.x;
    var prevY = this.y;

    this.map.move(this, delta);

    if (prevX !== this.x) {
      user.setDirty(this, 'x');
    }
    if (prevY !== this.y) {
      user.setDirty(this, 'y');
    }

    user.updateClose(this.map, this.pos());
  }

  this.connect = function (to, actionsMap) {
    this.connected.push({
      uniqueId: to,
      action: actionsMap
    });
  }

  this.activateConnected = function (action, character, user) {
    for (var c in this.connected) {
      var o = this.map.get(this.connected[c].uniqueId);
      o[this.connected[c].action[action]](character, user);
    }
  }

  this.solid = function () {
    return true;
  }

  this.pos = function (newPos) {
    if (newPos !== undefined) {
      this.x = newPos.x;
      this.y = newPos.y;
    }

    return new Vec2(this.x, this.y);
  }

  this.tile = function () {
    return 'blank';
  }
};

var Vec2 = require('../vec').Vec2;
