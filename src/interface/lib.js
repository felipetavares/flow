var Blessed = require('blessed');
var Crypto = require('crypto');
var Packet = require('../packet/lib.js');

/* The game */
var game;
/* The screen */
var screen;
/* Area to draw the map */
var map;
var entrybox;
var entrytitle;
var errorbox;
var menu;
/* Link to server */
var socket;

exports.init = function (_socket, _game) {
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
    }
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
    top: '25%',
    left: '25%',
    width: '50%',
    height: '50%',
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
}

exports.draw = function () {
  var string = game.map.toString();

  map.setContent(string);

  screen.render();
}

exports.error = function (error) {
  screen.append(errorbox);

  errorbox.setContent('{center}'+error+'{/center}');

  mainMenu();

  screen.remove(errorbox);
}

function sendMsg (data, token) {
    var msg = new Buffer(JSON.stringify(new Packet.Action(data, token)));

    socket.send(msg, 0, msg.length, 41322, '::1');
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

  map.on('keypress', function (ch, key) {
    if (ch == 'q') {
      quit();
    }

    var dmap = {
      'l': 'e',
      '6': 'e',
      'h': 'w',
      '4': 'w',
      'k': 'n',
      '8': 'n',
      'j': 's',
      '2': 's',
      '7': 'nw',
      '9': 'ne',
      '1': 'sw',
      '3': 'se'
    };

    if (dmap[ch]) {
     sendMsg(['go', dmap[ch]], game.token);
    }
  });
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

      sendMsg([cmd, user, password]);

      if (cmd == 'login') {
        screen.append(map);
        setkeys();
      } else {
        mainMenu();
      }

      screen.render();
    });
  });

  screen.render();
}

function quit (code) {
  socket.close();
  process.exit(code===undefined?0:code);
}
