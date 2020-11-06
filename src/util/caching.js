// TODO: rename to memoize??
export function memoize(fn, hashFn) {
  const cache = new Map();
  hashFn = hashFn || defaultHashFn;
  function memoized() {
    const key = hashFn.apply(this, arguments);
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const val = fn.apply(this, arguments);
      cache.set(key, val);
      return val;
    }
  }
  memoized.cache = cache;
  return memoized;
}

function defaultHashFn(arg) {
  return arg;
}
