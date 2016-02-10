function Character () {
  this.id = 'Objects.Character';

  DefaultObject.call(this);

  /* Custom defaults */
  this.z = 1;

  this.tile = function () {
    return 'character';
  }

  /* Stats */
  this.stats = {
    'str': 0,
    'dex': 0,
    'int': 0,
    'per': 0,
    'hp': 0
  };

  /* Skills */
  this.skills = {
    'throwing': {
      'experience': 0,
      'level': 0,
      'next': 10,
      'stats': [
        {
          'name': 'str',
          'weight': 0.5
        },
        {
          'name': 'dex',
          'weight': 0.5
        }
      ]
    }
  };

  this.useSkill = function (skill) {
    skill = this.skills[skill];

    skill.experience += 1;

    if (skill.experience >= skill.next) {
      // Skill levels up! *plim*
      skill.level += 1;
      // This curve is not good,
      // TODO: research a better one
      skill.next = Math.pow(10, skill.level+1);

      // Level up any related stats
      for (var s in skill.stats) {
        this.stats[skill.stats[s].name] ++;
      }
    }
  }

  /*
    Perform a skill check in skill against a given
    DC.
  */
  this.skillCheck = function (skill, dc) {
    skill = this.skills[skill];

    var relStats = 0;

    // Calculate the sum of the related stats
    for (var s in skill.stats) {
      var value = this.stats[skill.stats[s].name];
      value *= skill.stats[s].weight;

      relStats += value;
    }

    return skill.level + relStats >= dc;
  }

  /* Actions */
  this.throw = function (character, user) {
    var distance = 0;

    if (this.skillCheck('throwing', distance)) {
      this.useSkill('throwing');
      // Throws a rock
    }
    // Fails
  }
}

module.exports = {
  'Character': Character
}

var Vec2 = require('../vec').Vec2;
var DefaultObject = require('./default.js');
var Packet = require('../packet');
