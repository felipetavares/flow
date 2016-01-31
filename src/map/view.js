function View (size, array) {
  this.size = size;
  this.content = new Array();

  this.push = function (tile) {
    this.content.push(tile);
  }

  this.at = function (pos) {
    return this.content[pos.y*this.size.x+pos.x];
  }

  this.set = function (pos, code) {
    this.content[pos.y*this.size.x+pos.x] = code;
  }

  if (array !== undefined) {
    this.content = array.slice();
  } else {
    /*
      Fills the view
    */
    for (var i=0;i<size.x*size.y;i++) {
      this.push(0);
    }
  }
}

exports.View = View;
