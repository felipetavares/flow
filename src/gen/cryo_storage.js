module.exports = function (position, map) {
  if (position === undefined) {
    position = new Vec.Vec2(5000, 5000);
  }

  var l = 10;

  for (var y=0;y<l;y++) {
    for (var x=0;x<l;x++) {
      Cryo(position.add(new Vec.Vec2(x*4, y*4)), map);
    }
  }
}

var Cryo = require('./cryo_chamber.js')
var Gen = require('./');
var Vec = require('../vec');
var Objects = require('../objects');
