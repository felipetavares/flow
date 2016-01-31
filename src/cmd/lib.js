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

function makeDirectionalCommand (cmd, fn) {
    return new Cmd(2, [cmd, [
	new Exec('n', function (addr, token) {
	    fn(new Vec.Vec2(0, -1), addr, token);
	}),
	new Exec('s', function (addr, token) {
	    fn(new Vec.Vec2(0, 1), addr, token);
	}),
	new Exec('e', function (addr, token) {
	    fn(new Vec.Vec2(1, 0), addr, token);
	}),
	new Exec('w', function (addr, token) {
	    fn(new Vec.Vec2(-1, 0), addr, token);
	}),
	new Exec('ne', function (addr, token) {
	    fn(new Vec.Vec2(1, -1), addr, token);
	}),
	new Exec('nw', function (addr, token) {
	    fn(new Vec.Vec2(-1, -1), addr, token);
	}),
	new Exec('se', function (addr, token) {
	    fn(new Vec.Vec2(1, 1), addr, token);
	}),
	new Exec('sw', function (addr, token) {
	    fn(new Vec.Vec2(-1, 1), addr, token);
	})]]);
}

module.exports = {
    'Cmd': Cmd,
    'Exec': Exec,
    'makeDirectionalCommand': makeDirectionalCommand
}

var Vec = require('../vec/lib.js');
