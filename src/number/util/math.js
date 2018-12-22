function withPrecision(n, place, fn) {
  if (!place) {
    return fn(n);
  }
  let mult = Math.pow(10, Math.abs(place));
  if (place < 0) {
    mult = 1 / mult;
  }
  return fn(n * mult) / mult;
}

export function trunc(n, place) {
  return withPrecision(n, place, Math.trunc);
}

export function round(n, place) {
  return withPrecision(n, place, Math.round);
}

export function floor(n, place) {
  return withPrecision(n, place, Math.floor);
}

export function ceil(n, place) {
  return withPrecision(n, place, Math.ceil);
}
