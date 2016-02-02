function Compositor () {
  // Store state combinations here
  this.states = {};
  // Store states changes to form a composed
  // states here
  this.composition = null;
  this.currentState = null;
  this.changemap = null;
  // Directions for states
  this.directions = {
    'k:k': new Vec.Vec2(0, -1),
    'k:l': new Vec.Vec2(1, 0),
    'k:j': new Vec.Vec2(0, 1),
    'k:h': new Vec.Vec2(-1, 0)
    //new Vec.Vec2(-1, -1),
    //new Vec.Vec2(1, -1),
    //new Vec.Vec2(1, 1),
    //new Vec.Vec2(-1, 1)
  };

  // Callback to execute after each change
  // is made
  this.change = function (changemap) {
    this.changemap = changemap;

    if (changemap['global']) {
      changemap['global'](true);
    }
   }

  // Merges a new state combination into
  // this.states
  this.on = function (stateSequence, statemap) {
    if (statemap === undefined)
      statemap = this.states;

    for (var s in stateSequence) {
      // ohh! collision here!
      if (statemap[s]) {
        this.on(stateSequence[s], statemap[s]);
      } else {
        statemap[s] = stateSequence[s];
      }
    }
  }

  // Receives this.states or this.composition
  this.checkInStatemap = function (statemap, state, data) {
    for (var k in statemap) {
      var keyMatch, stateMatch;

      keyMatch = /(.*):any$/.exec(k);
      stateMatch = /(.*):.*$/.exec(state);

      // Use the ':any' key to transition on any state
      // 'k:any' transitions with any state that starts
      // with 'k:'
      if (k === state || (keyMatch && stateMatch &&
                          keyMatch[1] == stateMatch[1])
                      || (keyMatch && !stateMatch &&
                          keyMatch[1] == '')) {
        // Okay, we are good to go! Single state!
        if (typeof statemap[k] === 'function') {
          this.currentState = k;
          var previousState = this.currentState;

          if (statemap[k](state, data)) {
            this.composition = null;
            this.currentState = null;
          }

          if (this.changemap) {
            var callback;

            if (this.composition && this.composition !== this.states) {
              callback = this.changemap[this.currentState];
            } else {
              callback = this.changemap['global'];
            }

            if (callback) {
              callback(previousState!==this.currentState);
            }
          }
        }
        // Damn! Multiple states! Ya complex human being
        // is trying to f*** with me???
        else {
          // But I'm smart, ya bad person!
          this.composition = statemap[k];
          this.currentState = k;
        }

        break;
      }
    }
  }

  // Think of Compositor as a stream
  // here we insert a new state into the stream
  this.insert = function (state, data) {
    // We are in the process of making a
    // composition!
    if (this.composition) {
      this.checkInStatemap(this.composition, state, data);
    } else {
      this.checkInStatemap(this.states, state, data);
    }
  }

  this.goTo = function (stateSequence) {
    var previousState = this.currentState
    this.composition = this.states;

    for (var s in stateSequence) {
      this.insert(stateSequence[s]);
    }

    if (this.composition === this.states) {
      this.composition = null;
      this.currentState = null;
    }

    if (stateSequence.length == 0 &&
        this.changemap &&
        this.changemap['global']) {
      this.changemap['global'](previousState!==this.currentState);
    }
  }

  this.directional = function (fn) {
    var dirFunctions = {};

    for (var d in this.directions) {
      var _this = this;
      dirFunctions[d] = (function (p) {
        return function (state, data) {
          fn(_this.directions[p], state, data);
        }
      })(d);
    }

    return dirFunctions;
  }
}

exports.Compositor = Compositor;

var Vec = require('../vec/lib.js');
