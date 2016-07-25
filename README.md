# Sugar

A Javascript library for working with native objects.
https://sugarjs.com/

## Version 1.5

Note that this readme applies to Sugar v1.5. This version will continue to be
supported as needed. Note that information here may differ from the latest
documentation found on the site.

## Installing

Pre-built scripts [sugar.min.js](sugar.min.js) and [sugar.js](sugar.js) can be
immediately included in any project. Both are the standard build of Sugar that
includes default packages.

In npm, use `npm install sugar@1.5` for the full build.

## Usage

Note that this version of Sugar modifies natives on initialization. All methods
are mapped to the global namespace, either built-in classes or their prototypes,
and all methods are called directly on them. Polyfills are applied if the native
implementation is broken or missing.

## Docs

A limited API reference for v1.5 is available on the [site](https://sugarjs.com/docs/),
however note that documentation outside of this may no longer be applicable.

## Upgrading

If you are upgrading from an older version, please have a look at
[CAUTION.md](CAUTION.md) which is a vetted changelog that details the severity
of what has changed. Also please refer there for notes about a patch that
applies to versions prior to v1.3.9.

## Custom Builds

Custom builds can no longer be created for v1.5 from the main site. However,
build tools in this repo can create them manually. Remove unneeded code from
the modules in the `lib` directory, then run `gulp build`. Only remove entire
modules or methods within `extend()` blocks. Never remove `core` or `common`.

## Date Locales

Sugar includes English as the default locale. In addition, the following locales
are also available. These files must be added after Sugar is loaded.

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
