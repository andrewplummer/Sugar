// The null coalescing operator breaks node tests
// due to an issue with esm so exporting a util
// here until we can use it:
//
// https://github.com/standard-things/esm/issues/866
export function coalesceNull(val, fallback) {
  return val != null ? val : fallback;
}
