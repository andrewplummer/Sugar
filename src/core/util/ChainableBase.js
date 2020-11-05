
export default class ChainableBase {

  constructor(raw) {
    this.raw = raw;
  }

  toString() {
    return this.raw.toString();
  }

  valueOf() {
    return this.raw.valueOf();
  }

}
