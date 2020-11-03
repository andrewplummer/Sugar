import LocaleParser from "./LocaleParser";
import { memoize } from "../../util/caching";

export function parseDate(input, date, options) {
  const { locale, past, future, cache = true, ...parserOpt } = options;

  let parser;
  if (cache) {
    parser = getCachedParser(locale, parserOpt);
  } else {
    parser = getParser(locale, parserOpt);
  }

  return parser.parse(input, date, {
    past,
    future,
  });
}

function getParser(locale, options) {
  return new LocaleParser(locale, options);
}

const getCachedParser = memoize(getParser);
