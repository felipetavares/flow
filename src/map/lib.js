var Vec = require('../vec/lib.js');
var Packet = require('../packet/lib.js');
var Objects = require('../objects/lib.js');

function Map () {
    this.min = new Vec.Vec2(0, 0);
    this.max = new Vec.Vec2(0, 0);

    this.objects = new Array();
    
    this.pushBoundaries = function (o) {
	if (o.pos.x < this.min.x)
	    this.min.x = o.pos.x;
	if (o.pos.y < this.min.y)
	    this.min.y = o.pos.y;
	if (o.pos.x >= this.max.x)
	    this.max.x = o.pos.x+1;
	if (o.pos.y >= this.max.y)
	    this.max.y = o.pos.y+1;
    }

    this.add = function (o) {
	this.pushBoundaries(o);

	o.map = this;

	this.objects.push(o);
    }

    // TODO: Maybe ensure that both the object position
    // and the delta are integer vectors?
    this.tryMove = function (object, delta) {
	var positions = this.generatePositions(object.pos, delta);
	
	if (this.queryObstacles(object, positions)) {
	    return false;
	} else {
	    object.pos.addeq(delta);

	    this.pushBoundaries(object);

	    return true;
	}
    }

    this.generatePositions = function (start, delta) {
	var end = start.add(delta).add(new Vec.Vec2(0.5, 0.5));
	var positions = new Array();
	var position = new Vec.Vec2();
	var increment = delta.norm();

	position.assign(start.add(new Vec.Vec2(0.5, 0.5)));

	while (!position.integer().eq(end.integer())) {
	    position.addeq(increment);
	    positions.push(position.integer());
	}

	return positions;
    }

    this.queryObstacles = function (object, positions) {
	for (var p in positions) {
	    // TODO: THIS WILL BE VERY SLOW!
	    // TODO: Divide to conquest
	    for (var o in this.objects) {
		if (this.objects[o] !== object) {
		    if (this.objects[o].pos.eq(positions[p]) &&
			this.collide(this.objects[o], object)) {
			return true;
		    }
		}
	    }
	}
	
	return false;
    }

    this.collide = function () {
	return true;
    }

    this.queryCharacter = function (p) {
	for (var o in this.objects) {
	    if (this.objects[o].pos.eq(p)) {
		return this.objects[o].character();
	    }
	}
	return '.';
    }

    this.draw = function () {
	var size = this.max.sub(this.min);

	for (var y=0;y<size.y;y++) {
	    var line = '';
	    for (var x=0;x<size.x;x++) {
		line += this.queryCharacter(this.min.add(new Vec.Vec2(x, y)));
	    }
	    console.log(line);
	}
    }

    this.serialize = function (o) {
	var of = {};

	for (var p in o) {
	    if (p == 'map')
		continue;

	    if (typeof o[p] === 'function') {
	    } else if (typeof o[p] === 'object' && !o[p].length) {
		of[p] = this.serialize(o[p]);
	    } else if (typeof o[p] === 'object' && o[p].length) {
		of[p] = new Array();
		for (var k in o[p]) {
		    of[p].push(this.serialize(o[p][k]));
		}
	    } else {
		of[p] = o[p];
	    }
	}

	return of;
    }

    this.unserialize = function (of) {
	var table = {
	    'Objects.Character': Objects.Character,
	    'Vec.Vec2': Vec.Vec2
	};
	
	var o = new (table[of.id]);

	for (var p in of) {
	    if (typeof of[p] === 'object' && !of[p].length) {
		o[p] = this.unserialize(of[p]);
	    } else if (typeof of[p] === 'object' && of[p].length) {
		o[p] = new Array();
		for (var k in of[p]) {
		    o[p].push(this.unserialize(of[p][k]));
		}		
	    } else {
		o[p] = of[p];
	    }
	}

	return o;
    }

    this.getState = function (player) {
	var state = new Packet.WorldState();

	for (var o in this.objects) {
	    state.objects.push(this.serialize(this.objects[o]));
	}

	state.min = this.serialize(this.min);
	state.max = this.serialize(this.max);

	return state;
    }

    this.loadState = function (state) {
	this.min = this.unserialize(state.min);
	this.max = this.unserialize(state.max);

	this.objects = new Array();

	for (var o in state.objects) {
	    this.add(this.unserialize(state.objects[o]));
	}
    }
}

module.exports = {
    'Map': Map,
};
