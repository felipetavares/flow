/* The game */
var game;
/* The screen */
var screen;
/* Keys input */
var compositor;
/* Area to draw the map */
var map;
var entrybox;
var entrytitle;
var errorbox;
var menu;
/* Link to server */
var socket;

var view;

exports.init = function (_socket, _game) {
  compositor = new Compositor.Compositor();
  socket = _socket;
  game = _game;

  screen = Blessed.screen({
    style: {
      fg: 'red',
      bg: 'green'
    },
    smartCSR: true
  });

  map = Blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    style: {
        fg: 'white',
        bg: 'black'
    },
    tags: true
  });
  entrybox = Blessed.textbox({
    top: '50%',
    left: '25%',
    width: '50%',
    height: 1,
    style: {
        fg: 'black',
        bg: 'white'
    },
    censor: false,
    secret: false
  });
  entrytitle = Blessed.box({
    top: '50%-1',
    left: '25%',
    width: '50%',
    height: 1,
    style: {
        fg: 'white',
        bg: 'black'
    },
    tags: true
  });
  errorbox = Blessed.box({
    top: 0,
    left: '25%',
    width: '50%',
    height: 1,
    style: {
        fg: 'red',
        bg: 'black'
    },
    tags: true
  });
  menu = Blessed.list({
    top: '50%-1',
    left: '25%',
    width: '50%',
    height: 3,
    style: {
        fg: 'white',
        bg: 'black',
        selected: {
          fg: 'black',
          bg: 'white'
        }
    },
    tags: true,
    keys: true
  });

  /*
    TODO: Change this name in the future to reflect
    some kind of contextual information that may be
    more interesting to the user than the app's
    name.
  */
  screen.title = 'Flow Client';

  menu.setItems([
    'Login',
    'Register',
    'Quit'
  ]);

  mainMenu();

  screen.render();

  compositor.on(compositor.directional(function (d) {
    sendMsg(['go', d.x, d.y], game.token);
  }));

  map.on('keypress', function (ch, key) {
    if (ch == 'q') {
      sendMsg(['logout'], game.token, function () {
        quit();
      });
    }

    compositor.insert(ch, key);
  });
}

function render (view) {
  var string = '';
  var terminal = game.map.terminalTileset;

  for (var y=0;y<view.size.y;y++) {
    for (var x=0;x<view.size.x;x++) {
      var char = terminal.character(view.at(new Vec.Vec2(x, y)));
      string += '{'+char.fg+'-fg}'+'{'+char.bg+'-bg}'+char.char+'{/'+char.fg+'-fg}'+'{/'+char.bg+'-bg}';
    }
    string += '\n';
  }

  return string;
}

exports.draw = function (login) {
  if (login) {
    sendMsg(['screen', screen.width, screen.height], game.token, function () {
      screen.append(map);
      setkeys();
    });
  } else {
    if (game.token) {
      /*
        Buffer containing screen data
      */
      var viewData;
      if (!view || !view.size.eq(game.map.getSize())) {
        view = game.map.createView();
      }

      viewData = new Map.View.View(view.size, view.content);

      game.map.render(viewData);

      map.setContent(render(viewData));

      screen.render();
    }
  }
}

exports.error = function (error) {
  screen.append(errorbox);

  errorbox.setContent('{center}'+error+'{/center}');

  mainMenu();

  screen.remove(errorbox);
}

function sendMsg (data, token, done) {
    var msg = new Buffer(JSON.stringify(new Packet.Action(data, token)));

    socket.send(msg, 0, msg.length, 41322, '::1', done);
}

function mainMenu () {
  screen.append(menu);

  menu.pick(function (k, v) {
    if (v == 'Login') {
      login('login');
    } else
    if (v == 'Register') {
      login('register');
    }
    if (v == 'Quit') {
      quit();
    }
  });
}

function setkeys () {
  map.focus();
}

function login (cmd) {
  screen.append(entrytitle);
  screen.append(entrybox);

  entrytitle.setContent("{center}Username{/center}");
  entrybox.censor = false;
  entrybox.clearValue();

  entrybox.readInput(function () {
    var user = entrybox.getValue();

    entrybox.censor = true;
    entrybox.clearValue();

    entrytitle.setContent('{center}Password{/center}');

    screen.render();

    entrybox.readInput(function () {
      screen.remove(entrybox);
      screen.remove(entrytitle);

      var password = Crypto.createHash('sha256')
                    .update(entrybox.getValue()).digest().toString();

      sendMsg([cmd, user, password], function () {
        if (cmd == 'login') {
        } else {
          mainMenu();
        }
      });

      screen.render();
    });
  });

  screen.render();
}

function quit (code) {
  socket.close();
  process.exit(code===undefined?0:code);
}

var Blessed = require('blessed');
var Crypto = require('crypto');
var Packet = require('../packet/lib.js');
var Vec = require('../vec/lib.js');
var Map = require('../map/lib.js');
var Compositor = require('./compositor.js');
