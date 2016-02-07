function Segment (pos, len, text) {
  this.pos = pos;
  this.len = len;
  this.text = text;
}

function Ui () {
  this.dirtySegments = new Array();
  this.offset = new Vec2(0, 0);

  // Write a string to one line of the screen
  this.printSegment = function (offscreen, segment, pos) {
    pos = pos.add(this.offset);

    this.dirtySegments.push(new Segment(pos, segment.length, segment));

    offscreen.put({
      x: pos.x,
      y: pos.y,
      attr: {
        color: 7,
        bgColor: 0
      }
    }, segment);

    this.offset.y = pos.y+1;
  }

  this.draw = function (offscreen) {
    for (var d in this.dirtySegments) {
      var segment = this.dirtySegments[d];

      offscreen.put({
        x: segment.pos.x,
        y: segment.pos.y,
        attr: {
          color: 7,
          bgColor: 0
        }
      }, segment.text);
    }
  }

  // Tell where to clear
  this.clear = function (map) {
    map.updated = new Array();

    var left = new Vec2(1, 0);

    for (var d in this.dirtySegments) {
      var p = this.dirtySegments[d].pos;
      var e = p.add(left.mul(this.dirtySegments[d].len+1));

      while (!p.eq(e)) {
        map.updated.push(p);
        p = p.add(left);
      }
    }

    this.dirtySegments = new Array();

    this.offset.y = 0;
  }
}

module.exports.Ui = Ui;

var Vec2 = require('../vec').Vec2;
var Terminal = require('terminal-kit');
