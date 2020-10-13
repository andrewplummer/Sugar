import LocaleParser from './LocaleParser';

const parsers = new Map();

export function parseDate(options) {
  const { input, past, future, explain, timeZone, ...parserOptions } = options;
  const parser = getParser(parserOptions);
  return parser.parse(input, {
    past,
    future,
    explain,
    timeZone,
  });
}

function getParser(options) {
  // TODO: memoize??
  const { locale, cache = true, ...rest } = options;
  let parser;
  if (cache) {
    parser = parsers.get(locale);
  }
  if (!parser) {
    parser = new LocaleParser(locale, rest);
    parsers.set(locale, parser);
  }
  return parser;
}
