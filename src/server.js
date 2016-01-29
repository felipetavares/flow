#!/usr/bin/env node

var Fs = require('fs');
var Sudp = require('sudp');
var Game = require('./game/lib.js');
var Cmd = require('./cmd/lib.js');
var Objects = require('./objects/lib.js');
var User = require('./user/lib.js');

var socket = Sudp.createSocket('udp6');
var stdin = process.openStdin();
var game = new Game.Game();
/*
  Our default port: start with 4,1, remove one
  from the first and add one to the second, repeat
  until you have 5 numbers
*/
var defaultPort = 41322;
var mapFileName = 'map.json';

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

  /* It's not a good idea to log the auth token */
  //console.log('t '+action.token);

  game.execute(action.action, remoteAddr, action.token);

  /* console.log to put up some space for the map */
  console.log();

  /* Server-side game visualization, how cool is that? */
  game.map.draw();

  console.log();

  /* Send game state to users */
  User.update(socket, game);
});

/* When the server socket is created */
socket.on('listening', function () {
    var addr = socket.address();

    console.log('listening at '+addr.address+':'+addr.port);
});

/* When the server socket is closed (dah) */
socket.on('close', function () {
  save(function () {
    process.exit();
  });
});

function save (done) {
  var data = Util.serialize(game.map);
  data = JSON.stringify(data);

  Fs.writeFile(mapFileName, data, function (error) {
    if (error) {
      done(error);
    } else {
      User.save(done);
    }
  });
}

function load (done) {
  Fs.exists(mapFileName, function (exists) {
    if (exists) {
      Fs.readFile(mapFileName, function (error, content) {
        if (!error) {
          game.map = JSON.parse(content);
          game.map = Util.unserialize(game.map);

          User.load(done);
        } else {
          User.load(done);
        }
      });
    } else {
      User.load(done);
    }
  });
}

/* First function to be executed */
function init () {
  /* Loads map */
  load(function () {
    /* Creates commands */
    game.addCmd(Cmd.makeDirectionalCommand('go', function (direction, addr, token) {
      var character = User.characters(token, game.map)[0];

      if (character) {
        character.move(direction);
      }
    }));

    game.addCmd(new Cmd.Cmd(1, [[new Cmd.Exec('view', function (addr, token) {
    })]]));

    game.addCmd(new Cmd.Cmd(3, [[new Cmd.Exec('login', function (addr, token, input) {
      console.log('l '+input)

      User.login(input[1], input[2], addr);
    })]]));

    game.addCmd(new Cmd.Cmd(3, [[new Cmd.Exec('register', function (addr, token, input) {
      console.log ('r '+input);

      if (!User.exists(input[1])) {
        var cId = User.createCharacterId();

        console.log ('creating character for newly created user');
        console.log ('cid is '+cId);

        User.add(new User.User(input[1], input[2], cId, addr));
        game.add(new Objects.Character(cId));
      }
    })]]));

    socket.bind(defaultPort);
  });
}

/*
  Due to some complex dynamic on the way node loads
  files and on the way we 'unserialize' objects, we
  need to load util at the end of our definitions.
*/
var Util = require('./util/lib.js');

init();
