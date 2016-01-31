var Fs = require('fs');

function Tileset (graphical) {
  this.graphical = graphical===undefined?false:graphical;
  /* map because any prop with the name 'map' isn't serialized */
  this.map = {
    'blank': 0,
    'character': 1
  };
  this.chartable = {};

  this.load = function (file, done) {
    var _this = this;

    Fs.exists(file, function (exists) {
      if (exists) {
        Fs.readFile(file, function (error, content) {
          if (!error) {
            _this.chartable = JSON.parse(content);

            /*
              Convert names to codes
            */
            for (var c in _this.chartable) {
              _this.chartable[_this.code(c)] = _this.chartable[c];
              delete _this.chartable[c];
            }

            done(true);
          } else {
            done(false);
          }
        });
      } else {
        done(false);
      }
    });
  }

  this.code = function (name) {
    var fromMap = this.map[name];

    if (fromMap) {
      return fromMap;
    } else {
      return 0;
    }
  }

  this.character = function (code) {
    var fromTable = this.chartable[code];

    if (fromTable) {
      return fromTable;
    } else {
      return ' ';
    }
  }

  /*
    When we want to add graphical tile support,
    implement this
  */
  this.image = function (name) {
    return null;
  }
}

exports.Tileset = Tileset;
