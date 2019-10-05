noop = function() {};

arg2 = function() {
  return arguments[1];
};

add = function(n1, n2) {
  return n1 + n2;
};

mult = function(n1, n2) {
  return n1 * n2;
};

square = function(n) {
  return n * n;
};

args = function() {
  return Array.prototype.slice.call(arguments);
};

concatA = function(str) {
  return str + 'A';
};
