/* The game */
var game;
/* Keys/messages input */
var compositor;
/* Link to server */
var socket;
/* Things that we draw over */
var ui;
/* Off-screen buffer */
var offscreen;

exports.init = function (_socket, _game) {
  /*
    Setup module variables
  */
  compositor = new Compositor.Compositor();
  socket = _socket;
  game = _game;

  offscreen = Terminal.ScreenBuffer.create({
    dst: Terminal.terminal,
    width: Terminal.terminal.width,
    height: Terminal.terminal.height
  });

  ui = new Ui.Ui();

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
          game.map.me = msg.you;

          server(['screen', Terminal.terminal.width, Terminal.terminal.height], function () {
            // 1 sec timeout
            timeout(1);
          });
        }
      },
      'm:screen': function (state, msg) {
        compositor.goTo(['game']);
        game.map.partialLoad(msg, new Vec2(Terminal.terminal.width, Terminal.terminal.height),
        function () {
          Terminal.terminal.color(7);
          Terminal.terminal.bgColor(0);
          Terminal.terminal.clear();
          renderBackground();
          Terminal.terminal.hideCursor(true);
        });
      },
      't:out': function () {
        return true;
      }
    },
    'game': compositor.directional(function (d) {
      server(['go', d.x, d.y]);
    }),
    'login': {
    },
    'register': {
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
        server(['logout']);
        return true;
      },
      't:clear': function () {
        ui.clear(game.map);
        game.map.min.addeq(new Vec2(1, 1));
        render();
        game.map.min.subeq(new Vec2(1, 1));
      },
      'm:update': function (state, msg) {
        game.map.partialLoad(msg, new Vec2(Terminal.terminal.width, Terminal.terminal.height),
        function () {
          try {
            render();
            ui.draw(offscreen);
            offscreen.draw({delta: true});
          } catch (e) {
            process.stderr.write(e.stack);
          }
        });
        compositor.goTo(['processing']);
      }
    },
    'processing': {
      't:go': function () {
        compositor.goTo(['game']);
      },
      't:clear': function () {
        ui.clear(game.map);
        game.map.min.addeq(new Vec2(1, 1));
        render();
        game.map.min.subeq(new Vec2(1, 1));
        compositor.goTo(['processing']);
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

        Terminal.terminal.color(7);
        Terminal.terminal.bgColor(0);
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

var messageTimeout;

exports.message = function (msg) {
  if (!game.token && msg.token)
    game.token = msg.token;

  for (var m in msg.messages) {
    ui.printSegment(offscreen, msg.messages[m].text, new Vec2(0, 0));

    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(function () {
      compositor.insert('t:clear');
    }, 1000*5);
  }

  compositor.insert('m:'+msg.action[0], msg);
}

function render () {
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

  var tileset = game.map.tileset;

  for (var u in game.map.updated) {
    var pos = game.map.updated[u];

    var char = tileset.character(tileset.code(game.map.queryTile(pos.add(game.map.min))));

    offscreen.put({
      x: pos.x,
      y: pos.y,
      attr: {
        color: colors[char.fg],
        bgColor: colors[char.bg]
      }
    }, char.char);
  }

  offscreen.draw({delta: true});

  compositor.insert('t:go');
}

function renderBackground () {
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


  var tileset = game.map.tileset;
  var char = tileset.character(tileset.code('blank'));
  var chars = Terminal.terminal.width*Terminal.terminal.height;

  Terminal.terminal.moveTo(1, 1);
  Terminal.terminal.color(colors[char.fg]);
  Terminal.terminal.bgColor(colors[char.bg]);

  var str = '';

  for (var i=0;i<chars;i++) {
    str += char.char;
  }

  Terminal.terminal(str);
}

function server (data, done) {
  Util.compress(new Packet.Action(data, game.token), function (msg) {
    socket.send(msg, 0, msg.length, 41322, 'ctrl-c.club', done);
  });
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
var Packet = require('../packet');
var Vec2 = require('../vec').Vec2;
var Map = require('../map');
var Compositor = require('./compositor.js');
var Terminal = require('terminal-kit');
var Ui = require('./ui.js');
var Util = require('../util');
