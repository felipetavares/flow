#!/usr/bin/env node

var Package = require('../package.json');
var Objects = require('./objects/lib.js');
var Map = require('./map/lib.js');
var Vec = require('./vec/lib.js');
var Game = require('./game/lib.js');
var Cmd = require('./cmd/lib.js');

// Log information about the client before starting.

// TODO: Use a flag instead of always logging.
// When -v is passed, print info and exit.

console.log('Flow Client');
console.log('Version '+Package.version);
console.log();

var stdin = process.openStdin();
var game = new Game.Game();

stdin.addListener('data', function(data) {
    var input = data.slice(0, data.length-1)
	.toString().split(' ');

    // Remove blanks
    for (var i=0;i<input.length;i++) {
	if (input[i].length == 0) {
	    input.splice(i, 1);
	    i--;
	}
    }

    if (input.length &&
	input[0] == 'exit') {
	process.exit();
	return;
    }

    game.execute(input);

    draw();
});

function draw () {
    game.map.draw();
    console.log();
    process.stdout.write('% ');
}

function init () {
    game.addCmd(Cmd.makeDirectionalCommand('go', function (direction) {
	game.character.move(direction);
    }));
}

init();
draw();
