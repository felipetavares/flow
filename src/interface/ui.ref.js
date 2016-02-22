/*
  User Interface

  The user interface function is to provide
  windows that can have custom content.
*/

var EventType = module.exports.EventType = {
  CreateWindow: 0,
  DestroyWindow: 1
};

module.exports.Ui = function () {
  this.windows = new Array();

  this.showWindow = function (window) {
    this.windows.push(window);
  }

  this.hideWindow = function (window) {
    var index = this.windows.indexOf(window);

    if (index >= 0) {
      this.windows.splice(index, 1);
    }
  }

  this.render = function (at) {
    var char = null;

    this.windows.some(function (window) {
      var pos = window.pos();

      if (at.insideTight(pos, pos.add(window.size()))) {
        char = window.render(at.sub(pos));

        return true;
      }

      return false;
    });

    return char;
  }

  this.event = function (type, data, map) {
    switch (type) {
      case EventType.CreateWindow:
        this.showWindow(data);
        this.updateWindowArea(data, map);
      break;
      case EventType.DestroyWindow:
        this.hideWindow(data);
        this.updateWindowArea(data, map);
      break;
    }

    return data;
  }

  this.updateWindowArea = function (window, map) {
    var pos = window.pos();
    var end = window.size().add(pos);

    for (var y=pos.x;y<end.y;y++) {
      for (var x=pos.y;x<end.x;x++) {
        map.updated.push(
          new Vec2(x, y)
        );
      }
    }
  }
}

var Vec2 = require('../vec').Vec2;
var Tileset = require('../map/tileset.js');
