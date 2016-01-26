var Objects = require('../objects/lib.js');
var Map = require('../map/lib.js');
var Vec = require('../vec/lib.js');

function Game () {
    this.character = new Objects.Character();
    this.map = new Map.Map();
    this.cmds = new Array();

    this.map.add(this.character);

    this.execute = function (input) {
	for (var c in this.cmds) {
	    if (this.cmds[c].execute(input))
		break;
	}
    }

    this.addCmd = function (cmd) {
	this.cmds.push(cmd);
    }
}

module.exports = {
    'Game': Game
}
