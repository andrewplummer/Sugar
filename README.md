Sugar
=====

A Javascript library for working with native objects.
http://sugarjs.com/


Edge Build
===============

Public stable releases will be made available on the site and also exist in `release/`.
Any push made to `master` branch will have its unit tests passing, although maybe not
in all browsing environments (IE, etc) to ensure that it is stable, at least to a certain degree.
I will also include a minified version that will also have its unit tests run against it here:
`release/sugar-edge.min.js`


Unit Tests Node
===============

Unit tests can be run through the shell script at `./unit_tests/node.sh`.


Date Localizations
==================

Sugar includes 11 localizations in the main package:

- English (en)
- French (fr)
- German (de)
- Spanish (es)
- Italian (it)
- Russian (ru)
- Korean (ko)
- Portuguese (pt)
- Japanese (ja)
- Simplified Chinese (zh-CN)
- Traditional Chinese (zh-TW)


In addition to these major locales, custom locales can be added using:

```
Date.setFormat(LOCALE_CODE, LOCALIZATION_OBJECT)
```

More documentation to come soon, but for now refer to `lib/locales.js` for examples of what kind of data and formats are required in localization objects. All localizations, including those not found in the main package will be kept in this file.

Contributing Locales
====================

If you do add a custom format for your locale, please consider forking and adding it to the repo! This especially includes the addition of new locales, but also new formats or tweaks to existing locales. Not everything can be added to the main package, but I would like to have as many languages/formats as possible available. When adding a locale contribution, the most important thing is to add unit tests that assert the correct format. These unit tests are found at `unit_tests/environments/sugar/date_LOCALE.js`. Simply add or adjust the formats for the locale (the more tests, the better!) and issue me a pull request -- I will update the code to add these locales/formats. Have a look at other unit tests files for an example of the unit testing format.
