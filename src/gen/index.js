var map;

module.exports.map = function (_map) {
  map = _map;
}

function point (O, pos) {
  if (map) {
    var o = new O();
    o.pos(pos);
    map.insert(o);

    return o;
  }
}

module.exports.line = function (O, start, delta) {
  if (map) {
    var pos = Util.generatePositions(start, delta);
    pos.splice(0, 0, start);

    for (var p in pos) {
      point(O, pos[p]);
    }
  }
}

module.exports.point = point;

var Util = require('../util');
