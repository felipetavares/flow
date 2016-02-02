#!/usr/bin/env node

function init () {
  // Extract the arguments from the command line
  var arguments = process.argv.slice(2, process.argv.length+1);
  // Creates a compositor to interpret the commands
  var compositor = new Compositor.Compositor();

  var sourceFileName = null;
  var destinationFileName = null;

  compositor.on({
    'new': {
      ':any': function (file) {
        destinationFileName = file;
        return true;
      }
    },
    'from': {
      ':any': function (file) {
        sourceFileName = file;
        return true;
      }
    }
  });

  compositor.goTo(arguments);

  if (destinationFileName === null) {
    console.log('flow-gen new FILENAME');
    process.exit(1);
  }

  if (sourceFileName === null) {
    interactive(destinationFileName);
  } else {
    run(sourceFileName, destinationFileName);
  }
}

function interactive (to) {
  var map = new Map.Map();
  var compositor = new Compositor.Compositor();

  compositor.on({
    'cryo': function () {
      var door = new Objects.SlidingDoor();
      var cons = new Objects.Console();
      var walls = [];

      walls[0] = new Objects.ConcreteWall();
      walls[1] = new Objects.ConcreteWall();
      walls[2] = new Objects.ConcreteWall();
      walls[3] = new Objects.ConcreteWall();
      walls[4] = new Objects.ConcreteWall();
      walls[5] = new Objects.ConcreteWall();

      door.pos = new Vec.Vec2(10, 10);
      walls[0].pos = new Vec.Vec2(10, 9);
      cons.pos = new Vec.Vec2(9, 9);
      walls[1].pos = new Vec.Vec2(8, 9);
      walls[2].pos = new Vec.Vec2(8, 10);
      walls[3].pos = new Vec.Vec2(8, 11);
      walls[4].pos = new Vec.Vec2(9, 11);
      walls[5].pos = new Vec.Vec2(10, 11);

      map.add(door);
      map.add(cons);
      for (var w in walls) {
        map.add(walls[w]);
      }

      cons.connect(door.uniqueId, {
        'enable': 'open',
        'disable': 'close'
      });

      return true;
    },
    'save': function () {
      save(map, to, function (error) {
        if (error) {
          console.log('error writing to '+to+':\n\t'+error);
        } else {
          console.log('written to '+to);
        }

        process.exit(0);
      });

      console.log('writing...');
    },
    'exit': function () {
      process.exit(0);
    }
  });

  compositor.change({
    'global': function (make) {
      if (make) {
        process.stdout.write('% ');
      }
    }
  });

  process.stdin.on('readable', function () {
    var buffer = process.stdin.read();

    if (buffer) {
      var str = buffer.toString();
      str = str.slice(0, str.length-1);

      compositor.insert(str);
    }
  });
}

function run (from, to) {

}

function save (map, to, done) {
  map.clear();

  var data = Util.serialize(map);
  data = JSON.stringify(data);

  Fs.writeFile(to, data, function (error) {
    if (error) {
      done(error);
    } else {
      done(false);
    }
  });
}

var Compositor = require('./interface/compositor.js');
var Util = require('./util/lib.js');
var Map = require('./map/lib.js');
var Fs = require('fs');
var Objects = require('./objects/lib.js');
var Vec = require('./vec/lib.js');

init();
