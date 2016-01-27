var Objects = require('../objects/lib.js');
var Map = require('../map/lib.js');
var Vec = require('../vec/lib.js');
var Util = require('../util/lib.js');

function Game () {
    this.character = new Array();
    this.map = new Map.Map();
    this.cmds = new Array();

    this.add = function (player) {
	this.character[Util.asKey(player.addr)] = player;
	this.map.add(player);
    }

    this.execute = function (input, addr) {
	for (var c in this.cmds) {
	    if (this.cmds[c].execute(input, addr)) {
		return true;
	    }
	}
	
	return false;
    }

    this.addCmd = function (cmd) {
	this.cmds.push(cmd);
    }

    this.getState = function (player) {
	return this.map.getState(player);
    }

    this.loadState = function (state) {
	this.map.loadState(state);
    }
}

module.exports = {
    'Game': Game
}
