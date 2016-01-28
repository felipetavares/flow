#!/usr/bin/env node

var Package = require('../package.json');
var Objects = require('./objects/lib.js');
var Map = require('./map/lib.js');
var Vec = require('./vec/lib.js');
var Game = require('./game/lib.js');
var Dgram = require('dgram');
var Packet = require('./packet/lib.js');

// Log information about the client before starting.

if (process.argv.length > 2 &&
    process.argv[2] == '-v') {
    console.log('Flow Client');
    console.log('Version '+Package.version);
    process.exit();
}

var stdin = process.openStdin();
var socket = Dgram.createSocket('udp6');
var game = new Game.Game();

stdin.on('data', function(data) {
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

    sendMsg(input);
});

socket.on('message', function (msg, remoteAddr) {
    var state = JSON.parse(msg.toString());

    game.loadState(state);

    draw(true);
});

function draw (full) {
    if (full) {
	game.map.draw();
    } else {
	console.log('command not recognized.');
    }

    console.log();
    process.stdout.write('% ');
}

function init () {
    socket.bind();
    sendMsg(['view']);
}

function sendMsg (data) {
    var msg = new Buffer(JSON.stringify(new Packet.Action(data)));

    socket.send(msg, 0, msg.length, 41322, '::1');
}

init();
