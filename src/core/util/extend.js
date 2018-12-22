import NamespaceStore from './NamespaceStore';
import { hasOwnProperty } from './helpers';

const nativeDescriptors = new NamespaceStore();

export function extendNative(native, globalName, methodName, fn, isInstance) {
  if (canExtendNative(native)) {
    if (hasOwnProperty(native, methodName)) {
      const descriptor = Object.getOwnPropertyDescriptor(native, methodName);
      nativeDescriptors.set(globalName, methodName, descriptor, isInstance);
    }
    try {
      // Built-in methods MUST be configurable, writable, and non-enumerable.
      Object.defineProperty(native, methodName, {
        writable: true,
        configurable: true,
        value: fn
      });
    } catch (e) {
      // The extend operation may fail if a non-configurable property
      // is set on the native.
      nativeDescriptors.remove(globalName, methodName, isInstance);
      throw e;
    }
  }
}

export function restoreNative(native, globalName, methodName, fn, isInstance) {
  if (native[methodName] === fn) {
    if (nativeDescriptors.has(globalName, methodName, isInstance)) {
      const descriptor = nativeDescriptors.get(globalName, methodName, isInstance);
      Object.defineProperty(native, methodName, descriptor);
      nativeDescriptors.remove(globalName, methodName, isInstance);
    } else {
      delete native[methodName];
    }
  }
}

function canExtendNative(native) {
  return native !== Object.prototype;
}
