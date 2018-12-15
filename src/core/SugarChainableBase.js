
export default class ChainableBase {

  constructor(raw) {
    this.raw = raw;
  }

  valueOf() {
    return this.raw;
  }

}
