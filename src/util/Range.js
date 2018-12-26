import step, { collectArgs } from '../number/util/step';

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

  clone() {
    return create(this, this.start, this.end);
  }

  toArray() {
    return this.every(1);
  }

  span() {
    return Math.abs(this.getStart() - this.getEnd()) + 1;
  }

  clamp(m) {
    const val = Math.min(this.getMax(), Math.max(this.getMin(), this.getValue(m)));
    return this.getMember(val);
  }

  every(...args) {
    if (!this.isValid()) {
      return [];
    }
    const [n, fn] = collectArgs(args);
    return step(this.getStart(), this.getEnd(), n, (val, ...args) => {
      const m = this.getMember(val);
      return fn ? fn.apply(this, [m, ...args]) : m;
    });
  }

  contains(obj) {
    if (obj instanceof Range) {
      return obj.getMin() >= this.getMin() && obj.getMax() <= this.getMax();
    }
    return obj >= this.start && obj <= this.end;
  }

  intersect(r) {
    let start, end;
    const [rMin, rMax] = [r.getMin(), r.getMax()];
    const [tMin, tMax] = [this.getMin(), this.getMax()];
    if (rMin > tMax || rMax < tMin) {
      start = NaN;
      end   = NaN;
    } else {
      start = Math.max(rMin, tMin);
      end   = Math.min(rMax, tMax);
    }
    return createFromValues(this, start, end);
  }

  union(r) {
    const start = Math.min(r.getMin(), this.getMin());
    const end   = Math.max(r.getMax(), this.getMax());
    return createFromValues(this, start, end);
  }

  // Protected

  isValidMember(m) {
    return Number.isFinite(this.getValue(m));
  }

  getValue(m) {
    return m.valueOf();
  }

  getMember(val) {
    return val;
  }

  // Private

  getStart() {
    return this.getValue(this.start);
  }

  getEnd() {
    return this.getValue(this.end);
  }

  getMin() {
    return Math.min(this.getStart(), this.getEnd());
  }

  getMax() {
    return Math.max(this.getStart(), this.getEnd());
  }

}

function create(r, start, end) {
  return new r.constructor(start, end);
}

function createFromValues(r, start, end) {
  return create(r, r.getMember(start), r.getMember(end));
}
