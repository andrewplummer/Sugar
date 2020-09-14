export function setWeekday(date, val) {
  date.setDate(date.getDate() + (val - date.getDay()));
}
