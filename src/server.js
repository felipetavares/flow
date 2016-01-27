#!/usr/bin/env node

var Dgram = require('dgram');
var Game = require('./game/lib.js');
var Cmd = require('./cmd/lib.js');

var socket = Dgram.createSocket('udp6');
var stdin = process.openStdin();
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
	socket.close();
	return;
    }
});

socket.on('error', function (error) {
    console.log('error: \n'+error.stack);
});

socket.on('message', function (msg, remoteAddr) {
    console.log('> from '+remoteAddr.address);

    var action = JSON.parse(msg.toString());

    console.log('a '+action.action);
    
    game.execute(action.action);

    var retMsg = new Buffer(JSON.stringify(game.getState(game.character)));
    
    socket.send(retMsg, 0, retMsg.length, remoteAddr.port, remoteAddr.address);
});

socket.on('listening', function () {
    var addr = socket.address();
    
    console.log('listening at '+addr.address+':'+addr.port);
});

socket.on('close', function () {
    save();
    process.exit();
});

function save () {
    // Write to disk
}

function load () {
    // Read from disk
}

function init () {
    game.addCmd(Cmd.makeDirectionalCommand('go', function (direction) {
	game.character.move(direction);
    }));
    load();
}

init();

socket.bind(41322);
