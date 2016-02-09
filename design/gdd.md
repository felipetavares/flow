# Background story

We will use the background story from [The Flow](http://ctrl-c.club/~philips/shortstories/2927938077851216750.html).

## World generation

The world will be generated randomily but just once.

Generators are written in modules. Each module is a file inside the `src/gen` directory.

Modules are written in such a way that they can be both called directly or by other modules, check `src/gen/cryo_chamber.js` and `src/gen/cryo_storage.js` to understand how this works.

The `flow-gen` command line utility can be used to call these files into a map, example:

```
] flow-gen new map.json from map.json
% clear
% cryo_storage
% save
writing...
written to map.json
```

### flow-gen command list

* **clear**: clears all objects in the map *except characters*;
* **save**: saves the map;
* **log**: prints the map to the console;
* **exit**: well... it surprisingly exits!
* anything else: calls the file with the same name found in `gen/filename.js`. Example: `cryo_storage` will load and run the file `gen/cryo_storage.js` by creating an object of its type.

### IDEA

> Generating it with one more dimension (time) and moving along it, or applying cellular automatas to it in real time (both are essentialy the same)

## Starting location

Each user will start at a different location, but all of them inside a cryo-chamber.

Some interesting scenarios I have in mind:

* crashed ship
* broken ship floating in space near a space station, so the user would have to find a way to make it to the space station. This would also need the implementation of multiple z-levels to simulate space.
* space station
* underground bunker
* crashed cryo-chamber
* basement
* tower
* cryo-chamber storage (with multiple cryo-chambers near it)

### IDEA

> Permadeath?

### IDEA

> Multiple planets with just in time generation when a user arrives (or teleports) to it

# Client/Server model

node.js server and client.

A square centered on the player is the player's *view*. The size of this square can change in-game, but maybe 7x7 or 5x5 is good.

Every message sent from the player to the server is an *action*. To every action, the server replies to all the players within the view of the player who initiated the action with a *world state*.

The world state is an array of all (modified?) objects within the view of a player.

There is one special action, called *view* (used when the player connects), which just informs the server who is the player and the it replies with the world state of the player.

All the messages are **JSON**-based.

# Persistency

Custom file format.

# Tile support

Implement tile support, even if the node.js version can only work on a terminal.

The plan is to expland it to a fully featured browser/desktop version in the future.

# Repository

We will work using github:

https://github.com/felipetavares/flow

to contribut use PRs.

# Goals

Will be represented using github issues.

# Interface

Check out `interface.md`.

## The `go` command (server)

The `go` command when called without arguments, makes the character move
to the last direction he/she moved.

When used with one argument (if there is more than one argument, the remaining is ignored) `go` moves the character to the direction indicated by the argument.

This direction can be:

* `n`
* `s`
* `w`
* `e`
* `ne`
* `nw`
* `se`
* `sw`

## The `go` command (client)

The keypad numbers/`h`, `j`, `k`, and `l` can be used to move around.

# Combat

Meele and gun combat. Also, lots of explosives.

Maybe hacking?

# Thank you

for motivating me to start this project!
