var Vec = require('../vec/lib.js');

var DefaultObject = {
    'move': function (delta) {
	return this.map.tryMove(this, delta);
    }
};

function Map () {
    this.min = new Vec.Vec2(0, 0);
    this.max = new Vec.Vec2(0, 0);

    this.objects = new Array();
    
    this.pushBoundaries = function (o) {
	if (o.pos.x < this.min.x)
	    this.min.x = o.pos.x;
	if (o.pos.y < this.min.y)
	    this.min.y = o.pos.y;
	if (o.pos.x > this.max.x)
	    this.min.x = o.pos.x;
	if (o.pos.y > this.max.y)
	    this.min.y = o.pos.y;
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
	var end = start.add(delta);
	var positions = new Array();
	var position = new Vec.Vec2();
	var increment = delta.norm();

	position.assign(start);

	while (!position.eq(end)) {
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
}

module.exports = {
    'Map': Map,
    'DefaultObject': DefaultObject
};
