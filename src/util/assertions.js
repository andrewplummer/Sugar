
const MIN = 1e-6;
const MAX = 1e21;

function usesScientificNotation(n) {
  if (n === 0) {
    return false;
  }
  const abs = Math.abs(n);
  return abs >= MAX || abs <= MIN;
}

function isFinite(n) {
  return Number.isFinite(n);
}

function isInteger(n) {
  return Number.isInteger(n);
}

export function assertFinite(n) {
  if (!isFinite(n)) {
    throw new TypeError(n + ' is not a finite number');
  }
}

export function assertInteger(n) {
  if (!isInteger(n)) {
    throw new TypeError(n + ' is not an integer');
  }
}

export function assertPositiveInteger(n) {
  if (!isInteger(n) || n <= 0) {
    throw new TypeError(n + ' is not a positive integer');
  }
}

export function assertDecimal(n) {
  if (!isFinite(n) || usesScientificNotation(n)) {
    throw new TypeError(n + ' cannot be represented as a decimal');
  }
}
