function Segment (pos, len) {
  this.pos = pos;
  this.len = len;
}

function Ui () {
  this.dirtySegments = new Array();
  this.offset = new Vec.Vec2(0, 0);

  // Write a string to one line of the screen
  this.printSegment = function (segment, pos) {
    pos = pos.add(this.offset);

    this.dirtySegments.push(new Segment(pos, segment.length));

    Terminal.terminal.color(7);
    Terminal.terminal.bgColor(0);
    Terminal.terminal.moveTo(pos.x, pos.y);
    Terminal.terminal(segment);

    this.offset.y = pos.y;
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

var Vec = require('../vec/lib.js');
var Terminal = require('terminal-kit');
