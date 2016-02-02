function asKey (addr) {
    return addr.address+addr.port;
}

function serialize (o) {
  var of = {};

  if (((typeof o === 'object') ||
      (typeof o === 'function')) && o != null) {
    for (var p in o) {
      if (p == 'map' || p == 'prototype')
        continue;
      if (o[p] === null) {
        of[p] = null;
        continue;
      }

      if (typeof o[p] === 'function') {
      } else if (typeof o[p] === 'object' && o[p].length === undefined) {
        of[p] = serialize(o[p]);
      } else if (typeof o[p] === 'object' && o[p].length) {
        of[p] = new Array();
        for (var k in o[p]) {
          of[p].push(serialize(o[p][k]));
        }
      } else {
        of[p] = o[p];
      }
    }
  } else {
      of = o;
  }

  return of;
}

function unserialize (of) {
  if ((typeof of === 'object') && of != null ) {
    var o = (!of.id)?{}:new (eval(of.id));

    for (var p in of) {
      if (of[p] === null) {
        o[p] = null;
        continue;
      }

      if (typeof of[p] === 'object' && of[p].length === undefined) {
        o[p] = unserialize(of[p]);
      } else if (typeof of[p] === 'object' && of[p].length) {
        o[p] = new Array();
        for (var k in of[p]) {
          o[p].push(unserialize(of[p][k]));
        }
      } else {
        o[p] = of[p];
      }
    }

    return o;
  } else {
    return of;
  }
}

/*
  From java
*/
function hashCode(string) {
  var hash = 0, i, chr, len;
  if (string.length === 0) return hash;
  for (i = 0, len = string.length; i < len; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

module.exports = {
  'asKey': asKey,
  'serialize': serialize,
  'unserialize': unserialize,
  'hashCode': hashCode
};

var Game = require('../game/lib.js');
var Objects = require('../objects/lib.js');
var Packet = require('../packet/lib.js');
var Map = require('../map/lib.js');
var Cmd = require('../cmd/lib.js');
var Vec = require('../vec/lib.js');
var Map = require('../map/lib.js');
var User = require('../user/lib.js');
