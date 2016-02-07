function Game () {
  this.map = new Map.Map(new Vec.Vec2(10000, 10000));
  this.cmds = new Array();

  /* Only used in the client */
  this.token = null;

  this.add = function (player) {
    this.map.insert(player);
  }

  this.execute = function (input, addr, token) {
    for (var c in this.cmds) {
      if (this.cmds[c].execute(input, addr, token)) {
      return true;
      }
    }

    return false;
  }

  this.addCmd = function (cmd) {
    this.cmds.push(cmd);
  }
}

module.exports = {
    'Game': Game
}

var Objects = require('../objects');
var Map = require('../map');
var Vec = require('../vec');
var Util = require('../util');
