function Compositor () {
  // Store key combinations here
  this.keys = {};
  // Store keypresses to form a composed
  // keypress here
  this.composition = null;
  // Directions for keys
  this.directions = {
    'k': new Vec.Vec2(0, -1),
    'l': new Vec.Vec2(1, 0),
    'j': new Vec.Vec2(0, 1),
    'h': new Vec.Vec2(-1, 0)
    //new Vec.Vec2(-1, -1),
    //new Vec.Vec2(1, -1),
    //new Vec.Vec2(1, 1),
    // new Vec.Vec2(-1, 1)
  };

  // Merges a new key combination into
  // this.keys
  this.on = function (keySequence, keymap) {
    if (keymap === undefined)
      keymap = this.keys;

    for (var s in keySequence) {
      // ohh! collision here!
      if (keymap[s]) {
        this.on(keySequence[s], keymap[s]);
      } else {
        keymap[s] = keySequence[s];
      }
    }
  }

  // Receives this.keys or this.composition
  this.checkInKeymap = function (keymap, char) {
    for (var k in keymap) {
      if (k === char) {
        // Okay, we are good to go! Single key!
        if (typeof keymap[k] === 'function') {
          keymap[k]();

          this.composition = null;
        }
        // Damn! Multiple keys! Ya complex human being
        // is trying to f*** with me???
        else {
          // But I'm smart, ya bad person!
          this.composition = keymap[k];
        }
      }
    }
  }

  // Think of Compositor as a stream
  // here we insert a new key into the stream
  this.insert = function (char, key) {
    // We are in the process of making a
    // composition!
    if (this.composition) {
      this.checkInKeymap(this.composition, char);
    } else {
      this.checkInKeymap(this.keys, char);
    }
  }

  this.directional = function (fn) {
    var dirFunctions = {};

    for (var d in directions) {
      dirFunctions[d] = fn(directions[d]);
    }

    return dirFunctions;
  }
}

exports.Compositor = Compositor;

var Vec = require('../vec/lib.js');
