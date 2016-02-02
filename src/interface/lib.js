/* The game */
var game;
/* Keys/messages input */
var compositor;
/* Link to server */
var socket;

var view;

exports.init = function (_socket, _game) {
  /*
    Setup module variables
  */
  compositor = new Compositor.Compositor();
  socket = _socket;
  game = _game;

  var currentScreen = {};

  Terminal.terminal.grabInput(true);
  Terminal.terminal.fullscreen();

  Terminal.terminal.on('key', function (key, matches, data) {
    compositor.insert('k:'+key, key);
  });

  /*
    TODO: Change this name in the future to reflect
    some kind of contextual information that may be
    more interesting to the user than the app's
    name.
  */
  Terminal.terminal.windowTitle('Flow Client')

  /*
    Decide what to do with input characters
    and input messages / timers

    without any prefix -> global state

    t: -> timer
    k: -> key
    m: -> server message
  */
  compositor.on({
    'wait': {
      'm:login': function (state, msg) {
        if (msg.error) {
          return true;
        } else {
          server(['screen', Terminal.terminal.width, Terminal.terminal.height], function () {
            // 1 sec timeout
            timeout(1);
          });
        }
      },
      'm:screen': function (state, msg) {
        game.loadState(msg);
        compositor.goTo(['game']);
      },
      't:out': function () {
        return true;
      }
    },
    'game': compositor.directional(function (d) {
      server(['go', d.x, d.y]);
    }),
    'login': {
      // Everything is handled in the 'change' events
    },
    'register': {
      'k:q': function () {
        return true;
      },
      'k:any': function (character) {
        // Do something
      }
    }
  });

  compositor.on({
    'k:q': function () {
      quit();
    },
    'k:l': function () {
      game.token = null;
      compositor.goTo(['login']);
    },
    'k:r': function () {
      compositor.goTo(['register']);
    },
    'game': {
      'k:q': function () {
        server(['logout'], function () {
          compositor.goTo([]);
        });
      },
      'm:update': function (state, msg) {
        game.loadState(msg);

        var colors = {
          'black': 0,
          'red': 1,
          'green': 2,
          'yellow': 3,
          'blue': 4,
          'magneta': 5,
          'cyan': 6,
          'white': 7
        };

        for (var u in game.map.updatedPositions) {
          var pos = game.map.updatedPositions[u];
          var tileset = game.map.terminalTileset;

          var char = tileset.character(tileset.code(game.map.queryTile(pos)));

          var screenPos = pos.sub(game.map.min).add(new Vec.Vec2(1, 1));

          Terminal.terminal.moveTo(screenPos.x, screenPos.y);
          Terminal.terminal.color(colors[char.fg]);
          Terminal.terminal.bgColor(colors[char.bg]);
          Terminal.terminal(char.char);
        }
      }
    }
  });

  compositor.on({
    'game': {
      'k:a': compositor.directional(function (d) {
        server(['access', d.x, d.y]);
        compositor.goTo(['game']);
      })
    }
  });

  /*
    Execute after each state change

    global is special here
  */
  compositor.change({
    'global': function (make) {
      Terminal.terminal.hideCursor(false);

      if (make) {
        var menu = ['[L]ogin', '[R]egister', '[Q]uit'];

        Terminal.terminal.clear();
        Terminal.terminal.singleLineMenu(menu, function (error, input) {
          switch (input.selectedIndex) {
            case 0:
              compositor.goTo(['k:l']);
            break;
            case 1:
              compositor.goTo(['k:r']);
            break;
            case 2:
              compositor.goTo(['k:q']);
            break;
          }
        });
      }
    },
    'game': function (make) {
      if (make) {
        Terminal.terminal.color(7);
        Terminal.terminal.bgColor(0);
        Terminal.terminal.clear();
        Terminal.terminal.hideCursor(true);
      }
    },
    'login': function (make) {
      /*
        Creates the screen
      */
      if (make) {
        var username;
        var password;

        Terminal.terminal.clear();
        Terminal.terminal('Username: ');
        Terminal.terminal.inputField({}, function (error, input) {
          Terminal.terminal('\n');
          username = input;

          Terminal.terminal.windowTitle(username+' on The Flow');

          Terminal.terminal('Password: ');
          Terminal.terminal.inputField({echo: false}, function (error, input) {
            Terminal.terminal('\n');
            password = input;

            server(['login', username, encrypt(password)], function () {
              compositor.goTo(['wait']);
              timeout(1);
            });
          });
        });
      }
    },
    'register': function (make) {
      if (make) {
        var username;
        var password;

        Terminal.terminal.clear();
        Terminal.terminal('Username: ');
        Terminal.terminal.inputField({}, function (error, input) {
          Terminal.terminal('\n');
          username = input;

          Terminal.terminal('Password: ');
          Terminal.terminal.inputField({echo: false}, function (error, input) {
            Terminal.terminal('\n');
            password = input;

            server(['register', username, encrypt(password)], function () {
              compositor.goTo([]);
            });
          });
        });
      }
    }
  })
}

exports.message = function (msg) {
  if (!game.token && msg.token)
    game.token = msg.token;

  for (var m in msg.messages) {
    Terminal.terminal(msg.messages[m].text);
  }

  compositor.insert('m:'+msg.action[0], msg);
}

function server (data, done) {
  var msg = new Buffer(JSON.stringify(new Packet.Action(data, game.token)));

  socket.send(msg, 0, msg.length, 41322, '::1', done);
}

function quit (code) {
  Terminal.terminal.color(7);
  Terminal.terminal.bgColor(0);
  Terminal.terminal.clear();
  Terminal.terminal.grabInput(false);
  Terminal.terminal.hideCursor(false);
  socket.close();
  process.exit(code===undefined?0:code);
}

function encrypt (password) {
  return Crypto.createHash('sha256').update(password).digest().toString();
}

function timeout (time) {
  setTimeout(function () {
    compositor.insert('t:out');
  }, 1000*time);
}

var Crypto = require('crypto');
var Packet = require('../packet/lib.js');
var Vec = require('../vec/lib.js');
var Map = require('../map/lib.js');
var Compositor = require('./compositor.js');
var Terminal = require('terminal-kit');
