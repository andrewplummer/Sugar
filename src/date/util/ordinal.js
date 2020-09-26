import { getUnitDistance } from './distance';

export function getDayOfYear(date, year) {
  if (!year) {
    year = date.getFullYear();
  }
  const jan1 = new Date(year, 0);
  return getUnitDistance(date, jan1, 'day') + 1;
}
