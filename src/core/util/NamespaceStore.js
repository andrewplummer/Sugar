
export default class NamespaceStore {

  constructor() {
    this.store = {};
  }

  has(name, member, isInstance) {
    const key = this.getKey(name, member, isInstance);
    return this.store.hasOwnProperty(key);
  }

  get(name, member, isInstance) {
    const key = this.getKey(name, member, isInstance);
    return this.store[key];
  }

  set(name, member, val, isInstance) {
    const key = this.getKey(name, member, isInstance);
    this.store[key] = val;
  }

  remove(name, member, isInstance) {
    const key = this.getKey(name, member, isInstance);
    delete this.store[key];
  }

  getKey(name, member, isInstance) {
    return name + (isInstance ? '#' : '.') + member;
  }

}
