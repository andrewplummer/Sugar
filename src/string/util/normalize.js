import coerce from './coerce';

const DELIMITER_REG = /[_-\s]+/g;
const UPPER_REG = /([A-Z\d]+)([A-Z][a-z])/g
const LOWER_REG = /([a-z\d])([A-Z])/g;

export default function normalize(str, token) {
  return coerce(str)
    .replace(DELIMITER_REG, token)
    .replace(UPPER_REG, `$1${token}$2`)
    .replace(LOWER_REG, `$1${token}$2`)
    .toLowerCase();
}
