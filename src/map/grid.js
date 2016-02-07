module.exports = function (size, cellSize) {
  this.id = 'Map.Grid';

  if (size !== undefined) {
    this.cellSize = cellSize===undefined?
                    new Vec2(1, 1):
                    cellSize;
    this.size = size.divVec(this.cellSize);
    this.grid = new Object();
  }

  this.clear = function () {
    this.grid = new Object();
  }

  this.validate = function (position) {
    if (position.x >= this.size.x*this.cellSize.x ||
        position.y >= this.size.y*this.cellSize.y ||
        position.x < 0 ||
        position.y < 0) {
      throw new Error('Access outside boundary at '+position.str());
    }
    if (Math.floor(position.x) !== position.x ||
        Math.floor(position.y) !== position.y) {
      throw new Error('Non integer position');
    }
  }

  this.linear = function (position) {
    this.validate(position);

    var gridPosition = position.divVec(this.cellSize).integer();

    return this.size.x*gridPosition.y+gridPosition.x;
  }

  this.linearNoScaling = function (position) {
    this.validate(position);

    return this.size.x*position.y+position.x;
  }

  this.insert = function (object, position) {
    var linearPosition = this.linear(position);

    if (this.grid[linearPosition] === undefined)
      this.grid[linearPosition] = new Array();

    this.grid[linearPosition].push(object);
  }

  this.at = function (position) {
    var linearPosition = this.linear(position);
    var result = this.grid[linearPosition];

    return result===undefined?[]:result;
  }

  this.cell = function (position) {
    var linearPosition = this.linearNoScaling(position);
    var result = this.grid[linearPosition];

    return result===undefined?[]:result;
  }

  this.move = function (object, to) {
    var objects = this.at(object.pos());

    for (var o=0;o<objects.length;o++) {
      if (objects[o] === object) {
        objects.splice(o, 1);
        o--;
        break;
      }
    }

    object.pos(to);
    this.insert(object, to);
  }
}

var Vec2 = require('../vec').Vec2;
