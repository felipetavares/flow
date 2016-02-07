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
    Util.decompress(msg, function (state) {
      Interface.message(state);
    });
  });

  game.map.tileset.load('./assets/terminal.json', function () {
    Interface.init(socket, game);

    socket.bind();
  });
}

var Objects = require('./objects');
var Map = require('./map');
var Vec = require('./vec');
var Game = require('./game');
var Sudp = require('sudp');
var Interface = require('./interface');
var Util = require('./util');

init();
