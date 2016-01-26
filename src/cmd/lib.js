var Vec = require('../vec/lib.js');

function Exec (pattern, fn) {
    this.pattern = pattern;
    this.fn = fn;

    this.str = function () {
	return this.pattern;
    }

    this.execute = function () {
	this.fn();
    }
}

function Cmd (number, args){
    this.number = number;
    this.args = args;

    this.execute = function (input) {
	if (input.length >= this.number) {
	    for (var i=0;i<this.number;i++) {
		if (this.args[i]) {
		    if (typeof this.args[i] == 'object') {
			if (this.args[i].every(function (x) {
			    if (typeof x !== 'object') {
				return x != input[i];
			    } else {
				if (x.str() == input[i]) {
				    x.execute();
				    return false;
				} else {
				    return true;
				}
			    }
			})) {
			    return false;
			}
		    } else {
			if (this.args[i] != input[i]) {
			    return false;
			}
		    }
		} else {
		    return false;
		}
	    }
	} else {
	    return false;
	}
    }
}

function makeDirectionalCommand (cmd, fn) {
    return new Cmd(2, [cmd, [
	new Exec('n', function () {
	    fn(new Vec.Vec2(0, -1));
	}),
	new Exec('s', function () {
	    fn(new Vec.Vec2(0, 1));	    
	}),
	new Exec('e', function () {
	    fn(new Vec.Vec2(1, 0));
	}),
	new Exec('w', function () {
	    fn(new Vec.Vec2(-1, 0));
	}),
	new Exec('ne', function () {
	    fn(new Vec.Vec2(1, -1));
	}),
	new Exec('nw', function () {
	    fn(new Vec.Vec2(-1, -1));	    
	}),
	new Exec('se', function () {
	    fn(new Vec.Vec2(1, 1));
	}),
	new Exec('sw', function () {
	    fn(new Vec.Vec2(-1, 1));
	})]]);
}

module.exports = {
    'Cmd': Cmd,
    'Exec': Exec,
    'makeDirectionalCommand': makeDirectionalCommand
}
