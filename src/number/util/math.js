function alias(fn) {
  return function(n, place) {
    if (!place) {
      return fn(n);
    }
    let mult = Math.pow(10, Math.abs(place));
    if (place < 0) {
      mult = 1 / mult;
    }
    return fn(n * mult) / mult;
  };
}

export const trunc = alias(Math.trunc);
export const round = alias(Math.round);
export const floor = alias(Math.floor);
export const ceil  = alias(Math.ceil);
