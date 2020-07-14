const toString = Object.prototype.toString;

// PERF: Attempts to speed this method up get very Heisenbergy. Quickly
// returning based on typeof works for primitives, but slows down object
// types. Even === checks on null and undefined (no typeof) will end up
// basically breaking even. This seems to be as fast as it can go.
export function classToString(obj) {
  return toString.call(obj);
}

export function isClass(obj, className, classTag) {
  if (!classTag) {
    classTag = classToString(obj);
  }
  return classTag === '[object '+ className +']';
}
