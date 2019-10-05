export default function(fn, ms = 0) {
  let timer = null;
  let result = null;
  const debounced = () => {
    const args = arguments;
    debounced.cancel();
    timer = setTimeout(() => {
      result = fn.apply(this, args);
    }, ms);
    return result;
  };

  debounced.cancel = () => {
    clearTimeout(timer);
  };

  return debounced;
}
