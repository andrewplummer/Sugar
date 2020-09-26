export function getOrdinalSuffix(n) {
  if (n >= 11 && n <= 13) {
    return 'th';
  }
  switch (Math.abs(n) % 10) {
    case 1:  return 'st';
    case 2:  return 'nd';
    case 3:  return 'rd';
    default: return 'th';
  }
}
