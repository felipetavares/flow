function serialize (o, done) {
  if (typeof o === 'object' &&
      o !== null &&
      o.length === undefined) {
    // Serialized object
    var of = new Object();
    var readLength = 0;
    var execLength = 0;

    // Loop through all object's properties
    for (var p in o) {
      // Ignore map because it is circular
      if (p === 'map') {
        continue;
      } else {
        readLength ++;
      }

      setTimeout((function (p) {
        return (function () {
          serialize(o[p], function (n) {
            if (n !== undefined)
              of[p] = n;

            execLength++;

            if (readLength == execLength) {
              setTimeout(function () {
                done(of);
              }, 0);
            }
          });
        });
      })(p), 0);
    }

    if (!readLength) {
      setTimeout(function () {
        done(of)
      }, 0);
    }
  } else
  // An array
  if (typeof o === 'object') {
    // Serialized array
    var of = new Array();
    var readLength = 0;
    var execLength = 0;

    // Loop through all object's properties
    for (var p in o) {
      readLength ++;

      setTimeout((function (p) {
        return (function () {
          serialize(o[p], function (n) {
            if (n !== undefined)
              of[p] = n;

            execLength++;

            if (readLength == execLength) {
              setTimeout(function () {
                done(of)
              }, 0);
            }
          });
        });
      })(p), 0);
    }

    if (!readLength) {
      setTimeout(function () {
        done(of)
      }, 0);
    }
  } else
  if (typeof o !== 'function') {
    setTimeout(function () {
      done(o);
    }, 0);
  } else {
    setTimeout(function () {
      done(o);
    }, 0);
  }
}

function unserialize (o, done) {
  if (typeof o === 'object' &&
      o !== null &&
      o.length === undefined) {
    // Unserialized object
    var of = o.id===undefined?{}:(new (eval(o.id)));

    var readLength = 0;
    var execLength = 0;

    // Loop through all object's properties
    for (var p in o) {
      readLength ++;

      setTimeout((function (p) {
        return (function () {
          unserialize(o[p], function (n) {
            of[p] = n;

            execLength++;

            if (readLength == execLength) {
              setTimeout(function () {
                done(of)
              }, 0);
            }
          });
        });
      })(p), 0);
    }

    if (!readLength) {
      setTimeout(function () {
        done(of)
      }, 0);
    }
  } else
  // An array
  if (typeof o === 'object') {
    // Serialized array
    var of = new Array();
    var readLength = 0;
    var execLength = 0;

    // Loop through all object's properties
    for (var p in o) {
      readLength ++;

      setTimeout((function (p) {
        return (function () {
          unserialize(o[p], function (n) {
            of[p] = n;

            execLength++;

            if (readLength == execLength) {
              setTimeout(function () {
                done(of)
              }, 0);
            }
          });
        });
      })(p), 0);
    }

    if (!readLength) {
      setTimeout(function () {
        done(of)
      }, 0);
    }
  } else {
    setTimeout(function () {
      done(o);
    }, 0);
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
