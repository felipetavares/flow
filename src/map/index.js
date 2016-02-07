module.exports.Map = function (size) {
  this.id = 'Map.Map';

  if (size === undefined) {
    //throw new Error('Needs size as parameter');

    size = new Vec2(10000, 10000);
  }

  this.tileset = new Tileset.Tileset();
  this.storage = new Storage(size);

  /* EXPERIMENTAL */
  this.min = null;
  this.updated = new Array();
  this.lastTime = 0;

  this.get = function (id) {
    return this.storage.get(id);
  }

  this.insert = function (object) {
    object.map = this;
    this.storage.insert(object);
  }

  this.move = function (object, delta) {
    var positions = Util.generatePositions(object.pos(), delta);

    if (this.queryObstacles(object, positions)) {
      return false;
    } else {
      var to = object.pos().add(delta);

      this.storage.move(object, to);
    }
  }

  this.queryObstacles = function (object, positions) {
    for (var p in positions) {
      var selected = this.storage.at(positions[p]);
      for (var s in selected) {
        if (selected[s] !== object) {
          if (this.collide(selected[s], object)) {
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

  this.queryTile = function (position) {
    var candidates = this.storage.at(position).slice();

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

  this.action = function (name, where, character, user) {
    var objects = this.at(where);

    for (var o in objects) {
      if (objects[o][name]) {
        console.log(objects[o]);
        objects[o][name](character, user);
        break;
      }
    }
  }

  this.at = function (position) {
    return this.storage.at(position);
  }

  this.inside = function (top, bottom) {
    return this.storage.inside(top, bottom);
  }

  this.save = function (done) {
    Util.serialize({objects: this.storage.dump(),
                    size: this.size},
                    function (map) {
      done(map);
    });
  }

  this.load = function (map, done) {
    Util.unserialize(map.objects, function (objects) {
      for (var o in objects) {
        this.insert(objects[o]);
      }

      done();
    });
  }

  this.partialLoad = function (message, screen, done) {
    if (message.time < this.lastTime)
      return;

    this.lastTime = message.time;

    var _this = this;

    this.updated = new Array();

    // process.stderr.write(JSON.stringify(message, 2)+'\n');

    Util.unserialize(message, function (unserialized) {
      var min = null;

      for (var o in unserialized.objects) {
        if (_this.me) {
          for (var m in _this.me) {
            if (o == _this.me[m]) {
              _this.partialLoadObject(unserialized.objects[o], o);
              min = _this.get(o).pos().sub(screen.div(2));
            }
          }
        }
      }

      if (min === null)
        min = _this.min;
      if (_this.min === null)
        _this.min = min

      // We moved
      // So, update the positions of everything in the screen
      if (min !== null && (min !== _this.min || !min.eq(_this.min))) {
        var objects = _this.inside(min, min.add(screen));

        for (var o in objects) {
          _this.updatePos(objects[o].pos(), _this.min);
        }
      }

      for (var o in unserialized.objects) {
        var obj = unserialized.objects[o];

        _this.partialLoadObject(obj, o, _this.min, min);
      }

      // We moved
      // So, update the positions of everything in the screen
      if (min !== null && (min !== _this.min || !min.eq(_this.min))) {
        var objects = _this.inside(min, min.add(screen));

        for (var o in objects) {
          _this.updatePos(objects[o].pos(), min);
        }
      }

      _this.min = min;

      done();
    });
  }

  this.updatePos = function (pos, min) {
    if (min !== undefined && pos !== undefined) {
      if (pos.sub(min).positive()) {
        this.updated.push(pos.sub(min));
      }
    }
  }

  this.partialLoadObject = function (obj, o, oldMin, min) {
    if (obj.id && this.get(o) === null) {
      this.insert(obj, obj.pos());

      if (oldMin !== undefined)
        this.updatePos(obj.pos(), oldMin);
    } else {
      var real = this.get(o);
      if (oldMin !== undefined)
        this.updatePos(real.pos(), oldMin);

      // Maybe check before doing this?
      this.storage.move(real, new Vec2(obj.x===undefined?real.x:obj.x,
                                       obj.y===undefined?real.y:obj.y));

      for (p in obj) {
        real[p] = obj[p];
      }

      if (min !== undefined)
        this.updatePos(real.pos(), min);
    }
  }

  this.setMap = function () {
    this.storage.setMap(this);
  }
}

module.exports.Grid = require('./grid.js');
module.exports.Storage = require('./storage.js');

var Tileset = require('./tileset.js');
var Storage = require('./storage.js');
var Util = require('../util');
var Vec2 = require('../vec').Vec2;
