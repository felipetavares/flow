module.exports = {
    'move': function (delta) {
	return this.map.tryMove(this, delta);
    }
};
