function Vec2 (x, y) {
  this.id = 'Vec.Vec2';

  this.zero = 0.001;

  this.x = x===undefined?0:x;
  this.y = y===undefined?0:y;

  this.positive = function () {
    return this.x >= 0 && this.y >= 0;
  }

  this.negative = function () {
    return this.x <= 0 && this.y <= 0;
  }

  this.inside = function (start, end) {
    var qa = start.sub(this);
    var qb = end.sub(this);

    return qa.negative() && qb.positive();
  }

  // Which quadrant the vector is?

  this.q1 = function () {
    return this.x > 0 && this.y > 0;
  }

  this.q2 = function () {
    return this.x < 0 && this.y > 0;
  }

  this.q3 = function () {
    return this.x < 0 && this.y < 0;
  }

  this.q4 = function () {
    return this.x > 0 && this.y < 0;
  }

  this.quad = function () {
    if (this.q1()) {
      return 1;
    } else
    if (this.q2()) {
        return 2;
    } else
    if (this.q3()) {
        return 3;
    } else
    if (this.q4()) {
        return 4;
    } else {
        return 0;
    }
  }

  this.eq = function (v) {
    return Math.abs(this.x-v.x) < this.zero &&
           Math.abs(this.y-v.y) < this.zero;
  }

  this.add = function (v) {
    return new Vec2(this.x+v.x, this.y+v.y);
  }

  this.sub = function (v) {
    return new Vec2(this.x-v.x, this.y-v.y);
  }

  this.mul = function (s) {
    return new Vec2(this.x*s, this.y*s);
  }

  this.div = function (s) {
    return new Vec2(this.x/s, this.y/s);
  }

  this.divVec = function (v) {
    return new Vec2(this.x/v.x, this.y/v.y);
  }

  this.mulVec = function (v) {
    return new Vec2(this.x*v.x, this.y*v.y);
  }

  this.dot = function (v) {
  return this.x*v.x+this.y+v.y;
  }

  this.lenSq = function () {
  return this.x*this.x+this.y*this.y;
  }

  this.len = function () {
  return Math.sqrt(this.lenSq());
  }

  this.norm = function () {
  return this.div(this.len());
  }

  this.normalize = function () {
  this.assign(this.norm());
  }

  this.addeq = function (v) {
  this.assign(this.add(v));
  }

  this.subeq = function (v) {
  this.assign(this.sub(v));
  }

  this.muleq = function (s) {
  this.assign(this.mul(s));
  }

  this.diveq = function (s) {
  this.assign(this.div(s));
  }

  this.assign = function (v) {
  this.x = v.x;
  this.y = v.y;
  }

  this.str = function () {
  return "(" + this.x + ", " + this.y + ")";
  }

  this.integer = function () {
  return new Vec2(this.scalarInteger(this.x),
          this.scalarInteger(this.y));
  }

  this.integerFloor = function () {
    return new Vec2(Math.floor(this.x),
                    Math.floor(this.y));
  }

  this.integerCeil = function () {
    return new Vec2(Math.ceil(this.x),
                    Math.ceil(this.y));
  }

  this.scalarInteger = function (x) {
  if (x < 0) {
      return Math.floor(x);
  } else
  if (x > 0) {
      return Math.floor(x);
  }
  }

  this.clone = function () {
    return new Vec2(this.x, this.y);
  }
}

module.exports = {
    'Vec2': Vec2
};
