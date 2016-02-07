var Vec = require('../vec');
var Test = require('./');

exports.name = 'Vec.Vec2';
exports.test = function () {
  var v = new Vec.Vec2(0, 0);

  Test.verifyTest (v.inside(new Vec.Vec2(0, 0),
                        new Vec.Vec2(1, 1)), true);
  Test.verifyTest (v.inside(new Vec.Vec2(-1, -1),
                        new Vec.Vec2(1, 1)), true);
  Test.verifyTest (v.inside(new Vec.Vec2(-1, -1),
                        new Vec.Vec2(0, 0)), true);
  Test.verifyTest (v.inside(new Vec.Vec2(0, 0),
                        new Vec.Vec2(0, 0)), true);
  Test.verifyTest (v.inside(new Vec.Vec2(-2, -2),
                        new Vec.Vec2(-1, -1)), false);
  Test.verifyTest (v.inside(new Vec.Vec2(1, -2),
                        new Vec.Vec2(2, -1)), false);
  Test.verifyTest (v.inside(new Vec.Vec2(1, 1),
                        new Vec.Vec2(2, 2)), false);
  Test.verifyTest (v.inside(new Vec.Vec2(-2, 1),
                        new Vec.Vec2(-1, 2)), false);

  v = new Vec.Vec2(-14, -41);

  Test.verifyTest (v.inside(new Vec.Vec2(-22, -45),
                        new Vec.Vec2(-6, -37)), true);
}
