// Add other objects below, follow the same pattern
var Character = require('./character.js');
var ConcreteWall = require('./concrete_wall.js');
var SlidingDoor = require('./sliding_door.js');
var Console = require('./console.js');

module.exports = {
  'Character': Character.Character,
  'ConcreteWall': ConcreteWall.ConcreteWall,
  'SlidingDoor': SlidingDoor.SlidingDoor,
  'Console': Console.Console
}
