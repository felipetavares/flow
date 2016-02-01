function Exec (pattern, fn) {
    this.pattern = pattern;
    this.fn = fn;

    this.str = function () {
	return this.pattern;
    }

    this.execute = function () {
	this.fn.apply(this, arguments);
    }
}

function Cmd (number, args){
    this.number = number;
    this.args = args;

    this.execute = function (input, addr, token) {
	if (input.length >= this.number) {
	    for (var i=0;i<this.number;i++) {
		if (this.args[i]) {
		    if (typeof this.args[i] == 'object') {
			if (this.args[i].every(function (x) {
			    if (typeof x !== 'object') {
				return x != input[i];
			    } else {
				if (x.str() == input[i]) {
				    x.execute(addr, token, input);
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

	return true;
    }
}

var serverSideDirections = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

function makeDirectionalCommand (cmd, fn, directions) {
    return new Cmd(2, [cmd, [
	new Exec(directions[0], function (addr, token) {
	    fn(new Vec.Vec2(0, -1), addr, token);
	}),
	new Exec(directions[1], function (addr, token) {
	    fn(new Vec.Vec2(0, 1), addr, token);
	}),
	new Exec(directions[2], function (addr, token) {
	    fn(new Vec.Vec2(1, 0), addr, token);
	}),
	new Exec(directions[3], function (addr, token) {
	    fn(new Vec.Vec2(-1, 0), addr, token);
	}),
	new Exec(directions[4], function (addr, token) {
	    fn(new Vec.Vec2(1, -1), addr, token);
	}),
	new Exec(directions[5], function (addr, token) {
	    fn(new Vec.Vec2(-1, -1), addr, token);
	}),
	new Exec(directions[6], function (addr, token) {
	    fn(new Vec.Vec2(1, 1), addr, token);
	}),
	new Exec(directions[7], function (addr, token) {
	    fn(new Vec.Vec2(-1, 1), addr, token);
	})]]);
}

module.exports = {
    'Cmd': Cmd,
    'Exec': Exec,
    'makeDirectionalCommand': makeDirectionalCommand,
    'serverSideDirections': serverSideDirections
}

var Vec = require('../vec/lib.js');
