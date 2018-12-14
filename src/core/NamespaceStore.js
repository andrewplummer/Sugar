
export default class NamespaceStore {

  constructor() {
    this.static = {};
    this.instance = {};
  }

  has(name, isInstance) {
    return this.getStore(isInstance).hasOwnProperty(name);
  }

  get(name, isInstance) {
    return this.getStore(isInstance)[name];
  }

  set(name, val, isInstance) {
    this.getStore(isInstance)[name] = val;
  }

  remove(name, isInstance) {
    delete this.getStore(isInstance)[name];
  }

  getStore(isInstance) {
    return isInstance ? this.instance : this.static;
  }

}
