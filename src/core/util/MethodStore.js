import { hasOwnProperty } from './helpers';

export default class MethodStore {

  constructor() {
    this.store = {};
  }

  has(name, member, isInstance) {
    const key = this.getKey(name, member, isInstance);
    return hasOwnProperty(this.store, key);
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
