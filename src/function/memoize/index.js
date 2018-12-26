export default function(fn, hashFn) {
  const cache = {};
  hashFn = hashFn || defaultHashFn;
  return function memoized() {
    const key = hashFn.apply(this, arguments);
    if (cache.hasOwnProperty(key)) {
      return cache[key];
    }
    return cache[key] = fn.apply(this, arguments);
  };
}

function defaultHashFn(arg) {
  return arg;
}
