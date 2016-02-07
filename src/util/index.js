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

            if (readLength === execLength) {
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
  if (typeof o === 'object' && o !== null) {
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
      done();
    }, 0);
  }
}

function unserialize (o, done) {
  try {
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
  if (typeof o === 'object' && o !== null) {
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
  } catch (e) {
    console.log(e.stack);
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

function compress (packet, done) {
  var buffer = new Buffer(JSON.stringify(packet));
  Zlib.deflate(buffer, function(err, dbuffer) {
    done(dbuffer);
  });
}

function decompress (packet, done) {
  Zlib.unzip(packet, function(err, buffer) {
    done(JSON.parse(buffer.toString()));
  });
}

function generatePositions (start, delta) {
  var end = start.add(delta).add(new Vec2(0.5, 0.5));
  var positions = new Array();
  var position = new Vec2();
  var increment = delta.norm();

  position.assign(start.add(new Vec2(0.5, 0.5)));

  do {
    position.addeq(increment);
    positions.push(position.integer());
  } while(!position.integer().eq(end.integer()));

  return positions;
}

module.exports = {
  'serialize': serialize,
  'unserialize': unserialize,
  'hashCode': hashCode,
  'compress': compress,
  'decompress': decompress,
  'generatePositions': generatePositions
};

var Game = require('../game');
var Objects = require('../objects');
var Packet = require('../packet');
var Map = require('../map');
var Cmd = require('../cmd');
var Vec2 = require('../vec').Vec2;
var Vec = require('../vec');
var Map = require('../map');
var User = require('../user');
var Zlib = require('zlib');
