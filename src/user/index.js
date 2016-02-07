var usersFileName = 'users.json';
/* Number of bytes used for the session tokens */
var tokenLength = 16;

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

  /* Screen size */
  this.screen = new Vec2(1, 1);
  /* Last address */
  this.addr = addr;
  /* Message buffer */
  this.messages = new Array();
  /* What to send to the client */
  this.dirtyMap = new DirtyMap();
  /* Close users */
  this.closeUsers = new Array();
  /* All close things */
  this.close = new Object();

  this.clear = function () {
    delete this.close;
    delete this.closeUsers;
    delete this.dirtyMap;
    delete this.messages;
    delete this.addr;
    delete this.screen;
  }

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

  this.send = function (socket, map, token) {
    var dirty = this.dirtyMap.get();
    var packet = new Packet.WorldState();
    /*
      TODO: Fill packet.messages
    */

    for (var d in dirty) {
      if (dirty[d] === true) {
        var o = map.get(d);
        packet.objects[o.uniqueId] = o;
      } else {
        for (var p in dirty[d]) {
          var o = map.get(d);
          var packetO = packet.objects[o.uniqueId];

          if (packetO === undefined) {
            packet.objects[o.uniqueId] = {};
            packetO = packet.objects[o.uniqueId];
          }

          packetO[p] = map.get(d)[p];
        }
      }
    }

    this.dirtyMap.clear();

    packet.action = ['update'];

    var _this = this;

    Util.serialize(packet, function (serializedPacket) {
      Util.compress(serializedPacket, function (compressedPacket) {
        for (var u in _this.closeUsers) {
          var user = _this.closeUsers[u];

          if (user.addr) {
            socket.send(compressedPacket, 0, compressedPacket.length,
                        user.addr.port,
                        user.addr.address);
          }
        }
      });
    });
  }

  this.updateClose = function (map, position, markAll) {
    var halfScreen = this.screen.div(2);
    var top = position.sub(halfScreen);
    var bottom = top.add(this.screen);
    var close = map.inside(top, bottom);

    this.closeUsers = new Array();

    for (var c in close) {
      if (markAll || !this.close[close[c].uniqueId]) {
        this.close[close[c].uniqueId] = true;
        this.setAllDirty(close[c]);
      }

      if (close[c].id === 'Objects.Character') {
        var user = getUserFromCharacter(close[c].uniqueId);

        if (user) {
          this.closeUsers.push(user);
        }
      }
    }
  }

  this.setDirty = function (object, propertie) {
    console.log ('dirty '+object.id+':'+propertie);
    this.dirtyMap.set(object, propertie);
  }

  this.setAllDirty = function (object) {
    this.dirtyMap.setAll(object);
  }
}

function getUserFromCharacter (cId) {
  for (var u in users) {
    for (var i in users[u].characterIds) {
      var id = users[u].characterIds[i];

      if (id === cId) {
        return users[u];
      }
    }
  }

  return null;
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
          Util.unserialize(users, function (_users) {
            users = _users;

            done(true);
          });
        } else {
          done(false);
        }
      });
    } else {
      done(false);
    }
  });
}

/* Save users to disk */
function save (done) {
  for (var u in users) {
    users[u].clear();
  }

  Util.serialize(users, function (data) {
    data = JSON.stringify(data);

    Fs.writeFile(usersFileName, data, function (error) {
      done(error);
    });
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
function login (name, password, addr, map) {
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

/* Gets characters ids for a given token */
function characterIds (token) {
  if (verify(token)) {
    return sessions[token].characterIds;
  } else {
    return false;
  }
}

function charactersFromIds (ids, map) {
  var chars = [];

  for (var i in ids) {
    chars.push(map.get(ids[i]));
  }

  return chars;
}

function createCharacterId () {
  return users.maxCharacterId++;
}

function update (socket, token, game) {
  if (sessions[token])
    sessions[token].send(socket, game.map, token);
}

function setScreen (token, map, screen) {
  sessions[token].screen = screen;

  /* Make all dirty */
  sessions[token].updateClose(map, characters(token, map)[0].pos(), true);
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
  'logout': logout,
  'createCharacterId': createCharacterId,
  'verify': verify,
  'logged': logged,
  'exists': exists,
  'characters': characters,
  'characterIds': characterIds,
  'setScreen': setScreen,
  'update': update,
  'get': get
}

var Util = require('../util');
var Fs = require('fs');
var Crypto = require('crypto');
var DirtyMap = require('./dirtymap.js');
var Vec2 = require('../vec').Vec2;
var Packet = require('../packet');
