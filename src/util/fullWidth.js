const FULL_WIDTH_REG = /[\uFF01-\uFF5E]/g;
const SHIFT_BY = 65248;

export function normalizeFullWidth(str) {
  return str.replace(FULL_WIDTH_REG, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - SHIFT_BY);
  });
}
