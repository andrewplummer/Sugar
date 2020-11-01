import LocaleParser from './LocaleParser';
import { memoize } from '../../util/caching';

export function parseDate(options) {
  const {
    input,
    locale,
    past,
    future,
    explain,
    timeZone,
    cache = true,
    ...parserOptions
  } = options;

  let parser;
  if (cache) {
    parser = getCachedParser(locale, parserOptions);
  } else {
    parser = getParser(locale, parserOptions);
  }

  return parser.parse(input, {
    past,
    future,
    explain,
    timeZone,
  });
}

function getParser(locale, options) {
  return new LocaleParser(locale, options);
}

const getCachedParser = memoize(getParser);
