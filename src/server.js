#!/usr/bin/env node

var Fs = require('fs');
var Sudp = require('sudp');
var Game = require('./game');
var Cmd = require('./cmd');
var Objects = require('./objects');
var User = require('./user');
var Packet = require('./packet');
var Test = require('./test');
var Package = require('../package.json')
var Log = require('./log');
var Vec = require('./vec');

var socket = Sudp.createSocket('udp6');
var stdin = process.openStdin();
var game = new Game.Game();
/*
  Our default port: start with 4,1, remove one
  from the first and add one to the second, repeat
  until you have 5 numbers
*/
var defaultPort = process.env.port?process.env.PORT:41322;
var mapFileName = 'map.json';

Log.log('Flow Server Version '+Package.version+'\n');
Log.heading('start');

/*
  User -t to execute unit tests
*/
if (process.argv.length > 2 &&
    process.argv[2] == '-t') {
  Log.heading('test');
  Test.test();
  process.exit();
}

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
  Log.heading('error');
  Log.log('Stack: \n'+error.stack);
});

/* When we receive an UDP packet */
socket.on('message', function (msg, remoteAddr) {
  Util.decompress(msg, function (action) {
    Log.heading('action');
    Log.log('Address: '+remoteAddr.address);
    Log.log('Port: '+remoteAddr.port);
    Log.log('Command: '+action.action[0]);

    if (action.token) {
      var user;
      if (user = User.get(action.token)) {
        Log.log('Token: valid');
        Log.log('User name: '+user.name);
        game.execute(action.action, remoteAddr, action.token);
      } else {
        Log.log('Token: invalid');
      }

      /* Send game state to users */
      User.update(socket, action.token, game);
    } else {
      // Only login & register are allowed without an
      // access token
      if (action.action.length == 3 &&
          action.action[0] == 'login' ||
          action.action[0] == 'register')
        game.execute(action.action, remoteAddr, action.token);
    }
  });
});

/* When the server socket is created */
socket.on('listening', function () {
  var addr = socket.address();

  Log.heading('listen');
  Log.log('Address: '+addr.address);
  Log.log('Port: '+addr.port);
});

/* When the server socket is closed (dah) */
socket.on('close', function () {
  Log.heading('save');
  save(function () {
    Log.heading('exit');
    process.exit();
  });
});

function save (done) {
  Util.serialize(game.map, function (data) {
    // Pretty
    //data = JSON.stringify(data, null, 2);
    // Not pretty
    data = JSON.stringify(data);

    Fs.writeFile(mapFileName, data, function (error) {
      if (error) {
        done(error);
      } else {
        User.save(done);
      }
    });
  });
}

function load (done) {
  Log.heading('load');

  Fs.exists(mapFileName, function (exists) {
    if (exists) {
      Fs.readFile(mapFileName, function (error, content) {
        if (!error) {
          game.map = JSON.parse(content);
          Util.unserialize(game.map, function (map) {
            game.map = map;

            /*
              Because the objects weren't added using
              map.add, they don't have a .map propertie,
              so we fix this here.

              Maybe it would be better to move this over
              to a function at map/lib.js?
            */
            game.map.setMap();

            User.load(done);
          });
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
    game.addCmd(new Cmd.Cmd(3, [[new Cmd.Exec('go', function (addr, token, input) {
      var character = User.characters(token, game.map)[0];

      if (character) {
        character.move(new Vec.Vec2(input[1], input[2]), character, User.get(token));
      }
    })]]));

    game.addCmd(new Cmd.Cmd(3, [[new Cmd.Exec('access', function (addr, token, input) {
      var character = User.characters(token, game.map)[0];

      if (character) {
        var position = new Vec.Vec2(input[1], input[2]);
        position = position.add(character.pos());

        game.map.action('access', position, character, User.get(token));
      }
    })]]));

    game.addCmd(new Cmd.Cmd(3, [[new Cmd.Exec('screen', function (addr, token, input) {
      Log.heading('screen');
      var user = User.get(token);
      Log.log('Name: '+user.name);
      Log.log('Width: '+input[1]);
      Log.log('Height: '+input[2]);

      User.setScreen(token, game.map, new Vec.Vec2(input[1], input[2]));

      var state = new Packet.WorldState();
      state.token = token;
      state.action= input;
      Util.compress(state, function (msg) {
        socket.send(msg, 0, msg.length,
                    addr.port,
                    addr.address);
      });
    })]]));

    game.addCmd(new Cmd.Cmd(3, [[new Cmd.Exec('login', function (addr, token, input) {
      Log.heading('login');
      Log.log('Name: '+input[1])

      var token = User.login(input[1], input[2], addr, game.map);

      if (!token) {
        var state = new Packet.WorldState();
        state.error = 'Invalid login.';
        state.action = input;
        Util.compress(state, function (msg) {
          socket.send(msg, 0, msg.length,
                      addr.port,
                      addr.address);
        });
        Log.log('Status: fail');
      } else {
        var state = new Packet.WorldState();
        state.token = token;
        state.action= input;
        state.you = User.characterIds(token);
        Util.compress(state, function (msg) {
          socket.send(msg, 0, msg.length,
                      addr.port,
                      addr.address);
        });
        Log.log('Status: success');
      }
    })]]));

    game.addCmd(new Cmd.Cmd(1, [[new Cmd.Exec('logout', function (addr, token, input) {
      Log.heading('logout');

      var user;
      if (user = User.get(token)) {
        var result = User.logout(user.name);

        if (!result) {
          Log.log('Status: fail');
        } else {
          Log.log('Status: success');
        }
      }
    })]]));

    game.addCmd(new Cmd.Cmd(3, [[new Cmd.Exec('register', function (addr, token, input) {
      Log.heading('register');
      Log.log ('Name: '+input[1]);

      if (!User.exists(input[1])) {
        var character = new Objects.Character();
        game.add(character);
        User.add(new User.User(input[1], input[2], character.uniqueId, addr));

        Log.log ('Creating character for user');
        Log.log ('ID is '+character.uniqueId);

        game.execute(['login', input[1], input[2]], addr, token);
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
var Util = require('./util');

init();
