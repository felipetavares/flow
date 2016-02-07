#!/usr/bin/env node

function init () {
  // Extract the arguments from the command line
  var arguments = process.argv.slice(2, process.argv.length+1);
  // Creates a compositor to interpret the commands
  var compositor = new Compositor.Compositor();

  var sourceFileName = '';
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

  interactive(destinationFileName, sourceFileName);
}

function interactive (to, from) {
  var compositor = new Compositor.Compositor();

  load(from, function (map) {
    if (!map)
      map = new Map.Map(new Vec.Vec2(10000, 10000));

    compositor.on({
      'clear': function () {
        for (o in map.objects) {
          if (map.objects[o].id !== 'Objects.Character') {
            delete map.objects[o];
          }
        }
        return true;
      },
      'save': function () {
        setTimeout(function () {
          save(map, to, function (error) {
            if (error) {
              console.log('error writing to '+to+':\n\t'+error);
            } else {
              console.log('written to '+to);
            }

            process.exit(0);
          });
        }, 0);

        console.log('writing...');
      },
      'log': function () {
        console.log(map);
        return true;
      },
      'exit': function () {
        process.exit(0);
      },
      ':any': function (name) {
        var type = require('./gen/'+name+'.js');
        var obj = new type(undefined, map);

        return true;
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
  });
}

function run (from, to) {

}

function save (map, to, done) {
  //map.clear();

  Util.serialize(map, function (data) {
    data = JSON.stringify(data, null, 2);

    Fs.writeFile(to, data, function (error) {
      if (error) {
        done(error);
      } else {
        done(false);
      }
    });
  });
}

function load (from, done) {
  Fs.exists(from, function (exists) {
    if (exists) {
      Fs.readFile(from, function (error, content) {
        if (!error) {
          map = JSON.parse(content);
          Util.unserialize(map, function (map) {
            done(map);
          });
        } else {
          done(false);
        }
      });
    } else {
      done(false);
    }
  });
}

var Compositor = require('./interface/compositor.js');
var Util = require('./util');
var Map = require('./map');
var Fs = require('fs');
var Objects = require('./objects');
var Vec = require('./vec');

init();
