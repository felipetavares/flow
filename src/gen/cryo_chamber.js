module.exports = function (position, map) {
  if (position === undefined) {
    position = new Vec.Vec2();
  }

  Gen.map(map);

  var cons = Gen.point(Objects.Console,
                       position.add(new Vec.Vec2(1, 0)));
  var door = Gen.point(Objects.SlidingDoor,
                       position.add(new Vec.Vec2(2, 1)));

  Gen.line(Objects.ConcreteWall,
           position,
           new Vec.Vec2(2, 0));
  Gen.line(Objects.ConcreteWall,
           position.add(new Vec.Vec2(0, 2)),
           new Vec.Vec2(2, 0));
  Gen.point(Objects.ConcreteWall,
            position.add(new Vec.Vec2(0, 1)));

  cons.connect(door.uniqueId, {
    'enable': 'open',
    'disable': 'close'
  });
}

var Gen = require('./lib.js');
var Vec = require('../vec/lib.js');
var Objects = require('../objects/lib.js');
