#!/usr/bin/env node

var Package = require('../package.json');

var socket;
var game;

/*
  Log information about the client.
*/
if (process.argv.length > 2 &&
    process.argv[2] == '-v') {
    console.log('Flow Client');
    console.log('Version '+Package.version);
    process.exit();
}

function init () {
  socket = Sudp.createSocket('udp6');
  game = new Game.Game();

  socket.on('message', function (msg, remoteAddr) {
    var state = JSON.parse(msg.toString());

    if (state.error) {
      Interface.error(state.error);
    } else {
      Interface.message(state);
    }
  });

  game.map.terminalTileset.load('./assets/terminal.json', function () {
    Interface.init(socket, game);

    socket.bind();
  });
}

var Objects = require('./objects/lib.js');
var Map = require('./map/lib.js');
var Vec = require('./vec/lib.js');
var Game = require('./game/lib.js');
var Sudp = require('sudp');
var Interface = require('./interface/lib.js');

init();
