var Fs = require('fs');

var map = {
  'blank': 0,
  'character': 1
};

function Character (conf) {
  this.fg = conf.fg===undefined?'white':conf.fg;
  this.bg = conf.bg===undefined?'black':conf.bg;
  this.char = conf.char===undefined?' ':conf.char;
}

function Tileset (graphical) {
  this.graphical = graphical===undefined?false:graphical;
  this.chartable = {};

  this.interpret = function (value) {
    if (typeof value === 'string') {
      return new Character({'char': value});
    } else {
      return new Character(value);
    }
  }

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
              var value = _this.chartable[c];
              delete _this.chartable[c];

              _this.chartable[_this.code(c)] = _this.interpret(value);
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
    var fromMap = map[name];

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
      return new Character();
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

module.exports = {
  'Tileset': Tileset,
  'Character': Character
};
