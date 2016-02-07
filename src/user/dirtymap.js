module.exports = function () {
  this.dirty = new Object();

  this.set = function (object, propertie) {
    if (typeof this.dirty[object.uniqueId] !== 'object')
      this.dirty[object.uniqueId] = new Object();

    this.dirty[object.uniqueId][propertie] = true;
  }

  this.setAll = function (object) {
    this.dirty[object.uniqueId] = true;
  }

  this.get = function () {
    return this.dirty;
  }

  this.clear = function () {
    this.dirty = new Object();
  }
}
