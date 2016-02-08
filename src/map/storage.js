module.exports = function (size) {
  this.id = 'Map.Storage';

  if (size === undefined) {
    //throw new Error('Needs size as parameter');
  }

  this.grid = new Grid(size);
  this.idMap = new Object();
  this.lastUniqueId = 0;

  this.setMap = function (map) {
    this.grid.clear();

    for (var id in this.idMap) {
      this.idMap[id].map = map;
      this.insert(this.idMap[id], this.idMap[id].pos());
    }
  }

  this.all = function () {
    return this.idMap;
  }

  this.clear = function () {
    this.grid.clear();
    this.idMap = new Object();
  }

  this.generateUniqueId = function () {
    return this.lastUniqueId++;
  }

  this.insert = function (object) {
    if (object.uniqueId === undefined) {
      object.uniqueId = this.generateUniqueId();
    }

    this.idMap[object.uniqueId] = object;

    this.grid.insert(object, object.pos());
  }

  // Return a object given its id.
  this.get = function (id) {
    if (this.idMap[id] !== undefined) {
      return this.idMap[id];
    } else {
      return null;
    }
  }

  // Given a position, return all objects
  this.at = function (pos) {
    pos.assign(pos.integer());

    try {
      var candidates = this.grid.at(pos);
      var result = new Array();

      for (var c in candidates) {
        if (candidates[c].pos().eq(pos)) {
          result.push(candidates[c]);
        }
      }

      return result;
    } catch (e) {
      Log.heading('error')
      Log.log(e.stack);

      return new Array();
    }
  }

  // Given an area, return all objects
  // This implementation is not the best one
  this.inside = function (minF, maxF) {
    var min = minF.integer();
    var max = maxF.integer();

    min.assign(min.divVec(this.grid.cellSize).integerFloor());
    max.assign(max.divVec(this.grid.cellSize).integerCeil());

    var result = new Array();

    try {
      for (var y=min.y;y<=max.y;y++) {
        for (var x=min.x;x<=max.x;x++) {
          result = result.concat(this.grid.cell(new Vec2(x, y)));
        }
      }
    } catch (e) {
      Log.heading('error');
      Log.log(e.stack);
    }

    return result;
  }

  this.move = function (object, to) {
    this.grid.move(object, to);
  }

  this.dump = function () {
    return this.idMap;
  }
}

var Grid = require('./grid.js');
var Vec2 = require('../vec').Vec2;
var Log = require('../log');
