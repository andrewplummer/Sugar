import { isArray, isFunction, isPrimitive } from './typeChecks';

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

export function assertPositiveNumber(n) {
  if (n <= 0) {
    throw new TypeError(n + ' is not a positive number');
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

export function assertPositiveIntegerOrInfinity(n) {
  if ((!Number.isInteger(n) || n <= 0) && n !== Infinity) {
    throw new TypeError(n + ' is not a positive integer or Infinity');
  }
}

export function assertDecimal(n) {
  if (!Number.isFinite(n) || usesScientificNotation(n)) {
    throw new TypeError(n + ' cannot be represented as a decimal');
  }
}

export function assertArgument(exists) {
  if (!exists) {
    throw new TypeError('Argument required');
  }
}

export function assertCallable(obj) {
  if (!isFunction(obj)) {
    throw new TypeError('Function is not callable');
  }
}

export function assertArray(obj) {
  if (!isArray(obj)) {
    throw new TypeError('Array required');
  }
}

export function assertWritable(obj) {
  if (isPrimitive(obj)) {
    // If strict mode is active then primitives will throw an
    // error when attempting to write properties. We can't be
    // sure if strict mode is available, so pre-emptively
    // throw an error here to ensure consistent behavior.
    throw new TypeError('Property cannot be written');
  }
}
