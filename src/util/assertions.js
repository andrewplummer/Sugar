
const MIN = 1e-6;
const MAX = 1e21;

function usesScientificNotation(n) {
  if (n === 0) {
    return false;
  }
  const abs = Math.abs(n);
  return abs >= MAX || abs <= MIN;
}

export function assertNumber(n) {
  if (!n && n !== 0) {
    throw new TypeError(n + ' is not a valid number');
  }
}

export function assertFinite(n) {
  if (!Number.isFinite(n)) {
    throw new TypeError(n + ' is not a finite number');
  }
}

export function assertInteger(n) {
  if (!Number.isInteger(n)) {
    throw new TypeError(n + ' is not an integer');
  }
}

export function assertPositiveInteger(n) {
  if (!Number.isInteger(n) || n <= 0) {
    throw new TypeError(n + ' is not a positive integer');
  }
}

export function assertDecimal(n) {
  if (!Number.isFinite(n) || usesScientificNotation(n)) {
    throw new TypeError(n + ' cannot be represented as a decimal');
  }
}
