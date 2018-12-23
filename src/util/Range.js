import step from './step';

export default class Range {

  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  toString() {
    return this.isValid() ? this.start + '..' + this.end : 'Invalid Range';
  }

  isValid() {
    return this.isValidMember(this.start) && this.isValidMember(this.end);
  }

  toArray() {
    return this.every(1);
  }

  span() {
    return Math.abs(this.end - this.start) + 1;
  }

  clone() {
    return create(this, this.start, this.end);
  }

  clamp(val) {
    return Math.min(getMax(this), Math.max(getMin(this), val));
  }

  every(...args) {
    return step(...getValues(this), ...args);
  }

  contains(obj) {
    if (obj instanceof Range) {
      return getMin(obj) >= getMin(this) && getMax(obj) <= getMax(this);
    }
    return obj >= this.start && obj <= this.end;
  }

  intersect(r) {
    let start, end;
    const [rMin, rMax] = [getMin(r), getMax(r)];
    const [tMin, tMax] = [getMin(this), getMax(this)];
    if (rMin > tMax || rMax < tMin) {
      start = NaN;
      end   = NaN;
    } else {
      start = Math.max(rMin, tMin);
      end   = Math.min(rMax, tMax);
    }
    return create(this, start, end);
  }

  union(r) {
    const start = Math.min(getMin(r), getMin(this));
    const end   = Math.max(getMax(r), getMax(this));
    return create(this, start, end);
  }

  // Protected

  isValidMember(member) {
    return Number.isFinite(this.toValue(member));
  }

  toValue(val) {
    return val.valueOf();
  }

}

function create(r, start, end) {
  return new r.constructor(start, end);
}

function getMin(range) {
  return Math.min(...getValues(range));
}

function getMax(range) {
  return Math.max(...getValues(range));
}

function getValues(range) {
  return [range.toValue(range.start), range.toValue(range.end)];
}

