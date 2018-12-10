
export default function(val, place, fn = Math.round) {
  let mult = Math.pow(10, Math.abs(place || 0));
  if (place < 0) {
    mult = 1 / mult;
  }
  return fn(val * mult) / mult;
}

