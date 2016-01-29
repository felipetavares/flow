#!/usr/bin/env node

var Dgram = require('dgram');
var Game = require('./game/lib.js');
var Cmd = require('./cmd/lib.js');
var Objects = require('./objects/lib.js');
var Util = require('./util/lib.js');

var socket = Dgram.createSocket('udp6');
var stdin = process.openStdin();
var game = new Game.Game();

/* When the user types something */
stdin.on('data', function(data) {
    /*
      Get user input and dumps whitespaces, creating an array:
      'hi I\'m someone' => ['hi','I\'m','someone']
    */
    var input = data.slice(0, data.length-1)
	.toString().split(' ');

    /*
      When the user types multiple whitespaces between words,
      empty strings are created in our `input` array, so here
      we remove them.
    */
    for (var i=0;i<input.length;i++) {
      if (input[i].length == 0) {
        input.splice(i, 1);
        i--;
      }
    }

    /*
      Verifies if the input is an exit command,
      if it is, closes the communication socket.
    */
    if (input.length &&
        input[0] == 'exit') {
      socket.close();
      return;
    }
});

socket.on('error', function (error) {
    console.log('error: \n'+error.stack);
});

/* When we receive an UDP packet */
socket.on('message', function (msg, remoteAddr) {
    console.log('> from '+remoteAddr.address);

    var action = JSON.parse(msg.toString());

    console.log('a '+action.action);

   game.execute(action.action, remoteAddr);

    for (var c in game.character) {
	var retMsg = new Buffer(JSON.stringify(game.getState(game.character[c])));
	socket.send(retMsg, 0, retMsg.length,
		    game.character[c].addr.port,
		    game.character[c].addr.address);
    }
});

/* When the server socket is created */
socket.on('listening', function () {
    var addr = socket.address();

    console.log('listening at '+addr.address+':'+addr.port);
});

/* When the server socket is closed (dah) */
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

/* First function to be executed */
function init () {
  /* Creates commands */
  game.addCmd(Cmd.makeDirectionalCommand('go', function (direction, addr) {
    if (game.character[Util.asKey(addr)]) {
      game.character[Util.asKey(addr)].move(direction);
    }
  }));

  game.addCmd(new Cmd.Cmd(1, [[new Cmd.Exec('view', function (addr) {
    game.add(new Objects.Character(addr));
  })]]));

  /* Loads map */
  load();
}

init();

/*
  Our default port: start with 4,1, remove one
  from the first and add one to the second, repeat
  until you have 5 numbers
*/
socket.bind(41322);
