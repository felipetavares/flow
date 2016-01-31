function View (size) {
  this.size = size;
  this.content = new Array();

  this.push = function (tile) {
    this.content.push(tile);
  }

  this.at = function (pos) {
    return this.content[pos.y*this.size.x+pos.x];
  }
}

exports.View = View;
