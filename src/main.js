#!/usr/bin/env node

var Package = require('../package.json');
var Objects = require('./objects/lib.js');
var Map = require('./map/lib.js');
var Vec = require('./vec/lib.js');
var Game = require('./game/lib.js');

// Log information about the client before starting.

// TODO: Use a flag instead of always logging. When -v is passed,
// print info and exit.

console.log('Flow Client');
console.log('Version '+Package.version);
console.log();

var stdin = process.openStdin();

var game = new Game.Game();

stdin.addListener('data', function(data) {
    var input = data.slice(0, data.length-1)
	.toString().split(' ');

    if (input.length > 1 &&
	input[0] == 'go') {

	if (input[1] == 'north') {
	    game.character.move(new Vec.Vec2(0, -1));
	} else
	if (input[1] == 'south') {
	    game.character.move(new Vec.Vec2(0, 1));
	} else
	if (input[1] == 'west') {
	    game.character.move(new Vec.Vec2(-1, 0));
	} else
	if (input[1] == 'east') {
	    game.character.move(new Vec.Vec2(1, 0));
	}
	
	draw();

	return;
    }

    if (input[0] == 'exit') {
	process.exit();
    }
});

function draw () {
    game.map.draw();
    console.log();
    process.stdout.write('% ');
}

draw();
