
const FLAG_UTC = 0x1; // UTC designator Z
const FLAG_GMT = 0x2; // GMT prefix
const FLAG_PAD = 0x4; // Padded hours
const FLAG_MIN = 0x8; // Required minutes
const FLAG_SEP = 0x10; // Colon time separator

const MASKS = {
  'iso-basic': FLAG_PAD | FLAG_MIN,
  'iso-extended': FLAG_UTC | FLAG_PAD | FLAG_MIN | FLAG_SEP,
  'gmt-short': FLAG_GMT | FLAG_SEP,
  'gmt-long': FLAG_GMT | FLAG_PAD | FLAG_MIN | FLAG_SEP,
};

export function getFormattedOffset(date, format) {
  const offset = date.getTimezoneOffset();
  const mask = MASKS[format];

  if (mask & FLAG_UTC && !offset) {
    return 'Z';
  }

  const abs = Math.abs(offset);

  let str = mask & FLAG_GMT ? 'GMT' : '';
  str += offset > 0 ? '-' : '+';

  let h = String(Math.trunc(abs / 60));
  if (mask & FLAG_PAD) {
    h = h.padStart(2, '0');
  }
  str += h;

  if (mask & FLAG_MIN || abs % 60 !== 0) {
    if (mask & FLAG_SEP) {
      str += ':';
    }
    str += String(abs % 60).padStart(2, '0');
  }

  return str;
}
