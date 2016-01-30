var Fs = require('fs');
var Crypto = require('crypto');

var usersFileName = 'users.json';
/* Number of bytes used for the session tokens */
var tokenLength = 128;

/* All users are stored in this object */
var users = {};
/* Current session */
var sessions = {};

/*
  User class, holds information about a user
*/
function User (name, password, characterId, addr) {
  this.id = 'User.User';

  this.characterIds = characterId===undefined?[]:[characterId];

  this.name = name===undefined?'undefined':name;
  this.password = password===undefined?'':password;

  /* Last address */
  this.addr = addr;

  this.login = function (name, password, addr) {
    if (name == this.name) {
      if (password == this.password) {
        this.addr = addr;
        return Crypto.randomBytes(tokenLength).toString('hex');
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  this.logged = function () {
    for (var s in session) {
      if (session[s] === this) {
        return true;
      }
    }
    return false;
  }
}

/*
  Load user list from fs
*/
function load (done) {
  Fs.exists(usersFileName, function (exists) {
    if (exists) {
      Fs.readFile(usersFileName, function (error, content) {
        if (!error) {
          users = JSON.parse(content);
          users = Util.unserialize(users);

          /*
            Ensure we have this propertie even if it
            wasn't in the fs version for any reason

            (e.g.: someone overitten the file)
          */
          if (!users.maxCharacterId)
            users.maxCharacterId = 1;

          done(true);
        } else {
          users.maxCharacterId = 1;
          done(false);
        }
      });
    } else {
      users.maxCharacterId = 1;
      done(false);
    }
  });
}

/* Save users to disk */
function save (done) {
  var data = Util.serialize(users);
  data = JSON.stringify(data);

  Fs.writeFile(usersFileName, data, function (error) {
    done(error);
  });
}

/*
  Add a new user *if* the user doesn't
  exist.
*/
function add (user) {
  if (users[user.name]) {
    return false;
  } else {
    users[user.name] = user;
    return true;
  }
}

function logged (name) {
  for (var u in sessions) {
    if (sessions[u].name == name)
      return true;
  }

  return false;
}

function exists (name) {
  return users[name]?true:false;
}

function logout (name) {
  for (var u in sessions) {
    if (sessions[u].name == name) {
      delete sessions[u];

      return true;
    }
  }

  return false;
}

/* Login */
function login (name, password, addr) {
  if (users[name]) {
    var token;
    if (token = users[name].login(name, password, addr)) {
      if (logged(name)) {
        logout(name);
      }

      sessions[token] = users[name];

      return token;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/* Verifies an access token */
function verify (token) {
  return sessions[token]?true:false;
}

/* Gets characters for a given token */
function characters (token, map) {
  if (verify(token)) {
    return charactersFromIds(sessions[token].characterIds, map);
  } else {
    return false;
  }
}

function charactersFromIds (ids, map) {
  var chars = [];

  for (var i in ids) {
    chars.push(map.characterFromId(ids[i]));
  }

  return chars;
}

function createCharacterId () {
  return users.maxCharacterId++;
}

function update (socket, game) {
  for (var s in sessions) {
    var chars = characters(s, game.map);

    for (var c in chars) {
      var gameState = game.getState(chars[c]);
      gameState.token = s;
      var retMsg = new Buffer(JSON.stringify(gameState));

      socket.send(retMsg, 0, retMsg.length,
                  sessions[s].addr.port,
                  sessions[s].addr.address);
    }
  }
}

function get (token) {
  if (sessions[token])
    return sessions[token];
  return false;
}

module.exports = {
  'User': User,
  'load': load,
  'save': save,
  'add': add,
  'login': login,
  'createCharacterId': createCharacterId,
  'verify': verify,
  'logged': logged,
  'exists': exists,
  'characters': characters,
  'update': update,
  'get': get
}

var Util = require('../util/lib.js');
