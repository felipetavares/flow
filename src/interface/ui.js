function Segment (pos, len, text) {
  this.pos = pos;
  this.len = len;
  this.text = text;
}

function Ui () {
  this.dirtySegments = new Array();
  this.offset = new Vec.Vec2(0, 0);

  // Write a string to one line of the screen
  this.printSegment = function (segment, pos) {
    pos = pos.add(this.offset);

    this.dirtySegments.push(new Segment(pos, segment.length, segment));

    Terminal.terminal.color(7);
    Terminal.terminal.bgColor(0);
    Terminal.terminal.moveTo(pos.x, pos.y);
    Terminal.terminal(segment);

    this.offset.y = pos.y;
  }

  this.draw = function () {
    for (var d in this.dirtySegments) {
      var segment = this.dirtySegments[d];

      Terminal.terminal.color(7);
      Terminal.terminal.bgColor(0);
      Terminal.terminal.moveTo(segment.pos.x, segment.pos.y);
      Terminal.terminal(segment.text);
    }
  }

  // Tell where to clear
  this.clear = function (map) {
    var left = new Vec.Vec2(1, 0);

    for (var d in this.dirtySegments) {
      var p = this.dirtySegments[d].pos;
      var e = p.add(left.mul(this.dirtySegments[d].len+1));

      while (!p.eq(e)) {
        map.updatedPositions.push(p.add(map.min).sub(new Vec.Vec2(1, 1)));
        p = p.add(left);
      }
    }

    this.dirtySegments = new Array();

    this.offset.y = 0;
  }
}

module.exports.Ui = Ui;

var Vec = require('../vec');
var Terminal = require('terminal-kit');
