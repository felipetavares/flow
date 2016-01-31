function Map () {
  this.id = 'Map.Map';

  this.min = new Vec.Vec2(0, 0);
  this.max = new Vec.Vec2(0, 0);

  this.objects = new Array();

  this.graphicalTileset = null;
  this.terminalTileset = new Tileset.Tileset();

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

  this.add = function (o) {
    this.pushBoundaries(o);

    o.map = this;

    this.objects.push(o);
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

  this.collide = function () {
    return true;
  }

  this.queryTile = function (p) {
    for (var o in this.objects) {
      if (this.objects[o].pos.eq(p)) {
        return this.objects[o].tile();
      }
    }
    return 'blank';
  }

  this.getObjectsInView = function (start, size) {
    var inView = [];
    for (var o in this.objects) {
      if (this.objects[o].pos.inside(start, start.add(size)))
        inView.push(this.objects[o]);
    }
    return inView;
  }

  this.createView = function () {
    var size = this.max.sub(this.min);
    var view = new View.View(size);
    return view;
  }

  this.getSize = function () {
    return this.max.sub(this.min);
  }

  this.render = function (view) {
    var size = this.max.sub(this.min);
    var tileset = new Tileset.Tileset();

    for (var o in this.objects) {
      var p = this.objects[o].pos.sub(this.min);
      view.set(p, tileset.code(this.objects[o].tile()));
    }
  }

  this.getState = function (player) {
    var state = new Packet.WorldState();
    var viewSize = player.screen?player.screen:new Vec.Vec2(16, 8);
    var inView = this.getObjectsInView(player.pos.sub(viewSize.div(2)),
                                       viewSize);

    for (var o in inView) {
      state.objects.push(Util.serialize(inView[o]));
    }

    var min = player.pos.sub(viewSize.div(2));
    var max = min.add(viewSize);

    state.min = Util.serialize(min);
    state.max = Util.serialize(max);

    return state;
  }

  this.loadState = function (state) {
    this.min = Util.unserialize(state.min);
    this.max = Util.unserialize(state.max);

    this.objects = new Array();

    for (var o in state.objects) {
      this.add(Util.unserialize(state.objects[o]));
    }
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
var View = require('./view.js');

module.exports.View = View;
