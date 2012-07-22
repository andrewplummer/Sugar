Sugar
=====

[![Build Status](https://secure.travis-ci.org/andrewplummer/Sugar.png)](http://travis-ci.org/andrewplummer/Sugar)

A Javascript library for working with native objects.
http://sugarjs.com/


Edge Build
===============

Public stable releases will be made available on the site and also exist in `release/`.
Any push made to `master` branch *should* have its unit tests passing, although maybe not
in all browsing environments (IE, etc) to ensure that it is stable, at least to a certain degree.


Custom Builds
===============

Sugar now allows custom builds that let you opt in or out packages. This can be done [here](http://sugarjs.com/customize).
Custom builds can also be created with `script/build_custom.rb`. With ruby installed, simply call:

```
ruby script/build_custom.rb core array string
```

listing the packages you want to include. The advantage of using this
script is that it will perform all the minification on the fly, providing more fine-grained control by allowing you to
manipulate the source code in `lib/` before building. If you want to remove specific methods from a package, you can do it this way.
Be careful about removing dependencies, however, especially methods in `core.js`, the extending methods of which are required.


Unit Tests Node
===============

Unit tests can be run through the shell script at `./unit_tests/node.sh`


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
Date.addLocale(LOCALE_CODE, LOCALIZATION_OBJECT)
```

Documentation for this available [here](http://sugarjs.com/dates). Also refer to `lib/locales` for examples of what kind of data and formats are required in localization objects. All localizations, including those not found in the main package will be kept here.


Contributing Locales
====================

If you do add a custom format for your locale, please consider forking and adding it to the repo! This especially includes the addition of new locales, but also new formats or tweaks to existing locales. Not everything can be added to the main package, but I would like to have as many languages/formats as possible available. When adding a locale contribution, the most important thing is to add unit tests that assert the correct format. These unit tests are found at `unit_tests/environments/sugar/date_LOCALE.js`. Simply add or adjust the formats for the locale (the more tests, the better!) and issue me a pull request -- I will update the code to add these locales/formats. Have a look at other unit tests files for an example of the unit testing format.


Contributing Lib Comparisons
============================

Lib comparisons to various other libraries can be seen at http://sugarjs.com/libs. This is one of the areas where contributions are most welcome, as I don't have extensive knowledge of many different libraries, and there is so much to cover. To contribute simply find or create the appropriate lib name in `docs/libs`, and follow the format provided. This will be an ongoing process, and I will push changes here out to the site every so often.


Other Contributions
===================

For other contributions, please add well formed unit tests in the Sugar environment at `unit_tests/environments/sugar/MODULE.js`. Unit tests can be run directly in the browser from `unit_tests/sugar.html`, and should all be passing in all major browsers (Webkit,Mozilla,Opera, and IE6+). Node.js unit tests should also be passing and can be run in the console with `unit_tests/node.sh`.


