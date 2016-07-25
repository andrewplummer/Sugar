# Sugar

A Javascript library for working with native objects.
https://sugarjs.com/

## Version

This readme applies to Sugar v1.5. Note that information here may differ from
the latest documentation found on the site.

## Installing

Pre-built scripts [sugar.min.js](sugar.min.js) and [sugar.js](sugar.js) can be
immediately included in any project. Both are the standard build of Sugar that
includes default packages.

In npm, use `npm install sugar@1.5` for the full build.

## Upgrading

If you are upgrading from an older version, please have a look at
[CAUTION.md](CAUTION.md) which is a vetted changelog that details the severity
of what has changed. Also please refer there for notes about a patch that
applies to versions prior to v1.3.9.

## Custom Builds

Custom builds can no longer be created for v1.5.0 from the main site. However,
build tools in this repo can create them manually. Remove unneeded code from
the modules in the `lib` directory, then run `gulp build`. Only remove entire
modules, (never `core` or `common`), or methods within `extend()` blocks.

## Date Localizations

Sugar has the following localizations available:

- English (en, required)
- [Danish (da)](lib/locales/da.js)
- [Dutch (nl)](lib/locales/nl.js)
- [Finnish (fi)](lib/locales/fi.js)
- [French (fr)](lib/locales/fr.js)
- [German (de)](lib/locales/de.js)
- [Italian (it)](lib/locales/it.js)
- [Japanese (ja)](lib/locales/ja.js)
- [Korean (ko)](lib/locales/ko.js)
- [Norwegian (no)](lib/locales/no.js)
- [Polish (pl)](lib/locales/pl.js)
- [Portuguese (pt)](lib/locales/pt.js)
- [Russian (ru)](lib/locales/ru.js)
- [Spanish (es)](lib/locales/es.js)
- [Swedish (sv)](lib/locales/sv.js)
- [Simplified Chinese (zh-CN)](lib/locales/zh-CN.js)
- [Traditional Chinese (zh-TW)](lib/locales/zh-TW.js)

These files must be added after Sugar is loaded.
