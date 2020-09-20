export function cloneDate(date) {
  return new Date(date.getTime());
}

export function isValidDate(date) {
  return !Number.isNaN(date.getTime());
}
