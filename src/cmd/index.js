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

module.exports = {
  'Cmd': Cmd,
  'Exec': Exec
}

var Vec = require('../vec');
