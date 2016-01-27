var Vec = require('../vec/lib.js');

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

    this.execute = function (input, addr) {
	if (input.length >= this.number) {
	    for (var i=0;i<this.number;i++) {
		if (this.args[i]) {
		    if (typeof this.args[i] == 'object') {
			if (this.args[i].every(function (x) {
			    if (typeof x !== 'object') {
				return x != input[i];
			    } else {
				if (x.str() == input[i]) {
				    x.execute(addr);
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
	new Exec('n', function (addr) {
	    fn(new Vec.Vec2(0, -1), addr);
	}),
	new Exec('s', function (addr) {
	    fn(new Vec.Vec2(0, 1), addr);	    
	}),
	new Exec('e', function (addr) {
	    fn(new Vec.Vec2(1, 0), addr);
	}),
	new Exec('w', function (addr) {
	    fn(new Vec.Vec2(-1, 0), addr);
	}),
	new Exec('ne', function (addr) {
	    fn(new Vec.Vec2(1, -1), addr);
	}),
	new Exec('nw', function (addr) {
	    fn(new Vec.Vec2(-1, -1), addr);	    
	}),
	new Exec('se', function (addr) {
	    fn(new Vec.Vec2(1, 1), addr);
	}),
	new Exec('sw', function (addr) {
	    fn(new Vec.Vec2(-1, 1), addr);
	})]]);
}

module.exports = {
    'Cmd': Cmd,
    'Exec': Exec,
    'makeDirectionalCommand': makeDirectionalCommand
}
