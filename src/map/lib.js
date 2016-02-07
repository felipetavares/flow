function Map () {
  this.id = 'Map.Map';

  /*
    DUMP!
    Only used by the client
  */
  this.min = new Vec.Vec2(0, 0);
  this.max = new Vec.Vec2(0, 0);

  /*
    MAYBE
  */
  this.maxObjectId = 0;

  /*
    DUMP!
    Objects will be stored inside a Grid
  */
  this.objects = new Object();

  /*
    DUMP!
    Only used by the client
  */
  this.updatedPositions = new Array();

  /*
    DUMP!
    We need only one tileset
  */
  this.graphicalTileset = null;
  this.terminalTileset = new Tileset.Tileset();

  /*
    DUMP!
    The ones worried about messages are users!
  */
  this.messages = new Array();
  /*
    DUMP!
    Users will keep a list of dirty objects
  */
  this.dirty = new Array();

  /*
    DUMP!
    Users will maintain a list of dirty properties
  */
  this.latestPacket = new Object();
  this.latestPositions = new Object();
  this.latestTime = 0;

  this.message = function (message) {
    this.messages.push(message);
  }

  /*
    DUMP!
    We only need one object naming, not two
  */
  this.characterFromId = function (id) {
    for (var o in this.objects) {
      if (this.objects[o].characterId == id)
        return this.objects[o];
    }

    return null;
  }

  this.pushBoundaries = function (o) {
    if (o.pos.x < this.min.x)
      this.min.x = o.pos.x;
    if (o.pos.y < this.min.y)
      this.min.y = o.pos.y;
    if (o.pos.x >= this.max.x)
      this.max.x = o.pos.x+1;
    if (o.pos.y >= this.max.y)
      this.max.y = o.pos.y+1;
  }

  this.getNextId = function () {
    return this.maxObjectId++;
  }

  this.add = function (o) {
    this.pushBoundaries(o);

    o.map = this;
    o.uniqueId = this.getNextId();

    this.objects[o.uniqueId] = o;
  }

  // TODO: Maybe ensure that both the object position
  // and the delta are integer vectors?
  this.tryMove = function (object, delta) {
    var positions = this.generatePositions(object.pos, delta);

    if (this.queryObstacles(object, positions)) {
      return false;
    } else {
      object.pos.addeq(delta);

      this.pushBoundaries(object);

      return true;
    }
  }

  this.generatePositions = function (start, delta) {
    var end = start.add(delta).add(new Vec.Vec2(0.5, 0.5));
    var positions = new Array();
    var position = new Vec.Vec2();
    var increment = delta.norm();

    position.assign(start.add(new Vec.Vec2(0.5, 0.5)));

    do {
      position.addeq(increment);
      positions.push(position.integer());
    } while(!position.integer().eq(end.integer()));

    return positions;
  }

  this.queryObstacles = function (object, positions) {
    for (var p in positions) {
      // TODO: THIS WILL BE VERY SLOW!
      // TODO: Divide to conquest
      for (var o in this.objects) {
        if (this.objects[o] != object) {
          if (this.objects[o].pos.eq(positions[p]) &&
              this.collide(this.objects[o], object)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  this.collide = function (a, b) {
    return a.solid() && b.solid();
  }

  this.queryTile = function (p) {
    var candidates = [];

    for (var o in this.objects) {
      if (this.objects[o].pos.eq(p)) {
        candidates.push(this.objects[o]);
      }
    }

    if (candidates.length) {
      candidates.sort(function (a, b) {
        if (a.z > b.z) {
          return -1;
        } else
        if (a.z < b.z) {
          return 1;
        } else {
          return 0;
        }
      });

      return candidates[0].tile();
    }

    return 'blank';
  }

  /*
    Execute on the first object at 'where'
    that supports the action
  */
  this.action = function (name, where, character, user) {
    for (var o in this.objects) {
      if (this.objects[o].pos.eq(where)) {
        if (this.objects[o][name]) {
          this.objects[o][name](character, user);
          break;
        }
      }
    }
  }

  this.getObjectsInView = function (start, size) {
    var inView = [];
    for (var o in this.objects) {
      if (this.objects[o].pos.inside(start, start.add(size)))
        inView.push(this.objects[o]);
    }
    return inView;
  }

  this.getSize = function () {
    return this.max.sub(this.min);
  }

  this.getState = function (player, user, done) {
    var state = new Packet.WorldState();
    var viewSize = player.screen?player.screen:new Vec.Vec2(16, 8);
    var inView = this.getObjectsInView(player.pos.sub(viewSize.div(2)),
                                       viewSize);
    var prevInView = this.latestPacket[user.name];
    var positions = [];

    for (var i in inView) {
      var pos = new Vec.Vec2();
      pos.assign(inView[i].pos);
      positions.push(pos);
    }

    this.latestPacket[user.name] = inView;

    var sendToClient = [];

    for (var v in inView) {
      var some = false;

      if (prevInView) {
        for (var p in prevInView) {
          var e = prevInView[p];

          var equal = (inView[v].uniqueId == e.uniqueId);

          if (equal && !inView[v].pos.eq(this.latestPositions[user.name][p])) {
            some = false;
          } else if (equal) {
            some = true;
          }
        }
      }

      if (!some) {
        sendToClient.push(inView[v]);
      }
    }

    console.log(sendToClient.length);

    this.latestPositions[user.name] = positions;

    var _this = this;

    Util.serialize(sendToClient, function (objects) {
      state.objects = objects;

      var min = player.pos.sub(viewSize.div(2));
      var max = min.add(viewSize);

      Util.serialize([min, max], function (array) {
        state.min = array[0];
        state.max = array[1];

        for (var m=0;m<_this.messages.length;m++) {
          var msg = _this.messages[m];

          if (msg.user == user) {
            delete msg.user;
            state.messages.push(msg);
            _this.messages.splice(m, 1);
            m--;
          }
        }

        done(state);
      });
    });
  }

  this.loadState = function (state, done) {
    if (state.time < this.latestTime) {
      done();
      return;
    }

    var _this = this;

    Util.unserialize([state.min, state.max], function (array) {
      var min = array[0];
      var max = array[1];

      if (min === undefined || max === undefined)
        return;

      _this.updatedPositions = new Array();
      _this.dirty = new Array();

      var screenSize = max.sub(min);

      // Updated the old positions of the objects
      for (var o in _this.objects) {
        var pos = _this.objects[o].pos.sub(_this.min.sub(min));
        var screenPos = pos.sub(min);

        if (!_this.dirty[screenPos.y*screenSize.x+screenPos.x]) {
          _this.dirty[screenPos.y*screenSize.x+screenPos.x] = true;
          _this.updatedPositions.push(pos);
        }
      }

      _this.min = min;
      _this.max = max;

      Util.unserialize(state.objects, function (objects) {
        for (var o in objects) {
          _this.objects[objects[o].uniqueId] = objects[o];
        }

        // And the new ones
        for (var o in _this.objects) {
          var screenPos = _this.objects[o].pos.sub(min);
          if (!_this.dirty[screenPos.y*screenSize.x+screenPos.x]) {
            _this.dirty[screenPos.y*screenSize.x+screenPos.x] = true;
            _this.updatedPositions.push(_this.objects[o].pos);
          }
        }

        done();
      });
    });
  }

  // Clear variables that shan't be written to fs
  this.clear = function () {
    delete this.messages;
    delete this.latestPacket;
  }
}

module.exports = {
  'Map': Map,
  'Tileset': Tileset
};

var Util = require('../util/lib.js');
var Vec = require('../vec/lib.js');
var Packet = require('../packet/lib.js');
var Objects = require('../objects/lib.js');
var Tileset = require('./tileset.js');
