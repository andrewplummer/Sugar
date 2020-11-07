namespace('Date', function () {
  'use strict';

  var now = new Date();
  var thisYear = now.getFullYear();

  method('get', function() {
    var d = new Date('August 25, 2010 11:45:20');

    test(d, ['next week'], new Date('September 1, 2010 11:45:20'), 'next week');
    test(d, ['next monday'], new Date('August 30, 2010'), 'next monday');

    test(d, ['5 milliseconds ago'], new Date(2010, 7, 25, 11, 45, 19, 995), '5 milliseconds ago');
    test(d, ['5 seconds ago'], new Date('August 25, 2010 11:45:15'), '5 seconds ago');
    test(d, ['5 minutes ago'], new Date('August 25, 2010 11:40:20'), '5 minutes ago');
    test(d, ['5 hours ago'], new Date('August 25, 2010 6:45:20'), '5 hours ago');
    test(d, ['5 days ago'], new Date('August 20, 2010 11:45:20'), '5 days ago');
    test(d, ['5 weeks ago'], new Date('July 21, 2010 11:45:20'), '5 weeks ago');
    test(d, ['5 months ago'], new Date('March 25, 2010 11:45:20'), '5 months ago');
    test(d, ['5 years ago'], new Date('August 25, 2005 11:45:20'), '5 years ago');
    test(d, ['5 years before'], new Date('August 25, 2005 11:45:20'), '5 years before');

    test(d, ['5 milliseconds from now'], new Date(2010, 7, 25, 11, 45, 20, 5), '5 milliseconds from now');
    test(d, ['5 seconds from now'], new Date('August 25, 2010 11:45:25'), '5 seconds from now');
    test(d, ['5 minutes from now'], new Date('August 25, 2010 11:50:20'), '5 minutes from now');
    test(d, ['5 hours from now'], new Date('August 25, 2010 16:45:20'), '5 hours from now');
    test(d, ['5 days from now'], new Date('August 30, 2010 11:45:20'), '5 days from now');
    test(d, ['5 weeks from now'], new Date('September 29, 2010 11:45:20'), '5 weeks from now');
    test(d, ['5 months from now'], new Date('January 25, 2011 11:45:20'), '5 months from now');
    test(d, ['5 years from now'], new Date('August 25, 2015 11:45:20'), '5 years from now');
    test(d, ['5 years after'], new Date('August 25, 2015 11:45:20'), '5 years after');

    var d1 = run(new Date(Date.UTC(2010, 7, 25)), 'setUTC', [true]);
    var d2 = run(d1, 'get', ['tomorrow']);
    equal(d2, new Date(Date.UTC(2010, 7, 26)), 'date should be taken as UTC');
    equal(testIsUTC(d2), true, 'utc flag should be preserved');

    var d1 = run(new Date(Date.UTC(2010, 7, 25)), 'setUTC', [true]);
    var d2 = run(d1, 'get', ['tomorrow', { fromUTC: false, setUTC: false }]);
    // d1 may be Aug 24th or Aug 25th depending on the timezone.
    equal(d2, new Date(2010, 7, d1.getDate() + 1), 'fromUTC can override utc preservation');
    equal(testIsUTC(d2), false, 'setUTC can override utc preservation');

    // Issue #620 - Get with preference
    test(new Date(1833, 11, 1), ['December', { past: true }], new Date(1832, 11, 1), 'Preference option should work');
    test(new Date(2017, 7, 14), ['Saturday', { past: true }], new Date(2017, 7, 12), 'Preference option should work');
  });

  group('Since/Until', function() {

    var d = new Date(2010,7,5,13,45,2,542);

    equal(run(new Date(2010,7,5,13,45,2,543),  'millisecondsSince', [d]), 1, '1 milliseconds since');
    equal(run(new Date(2010,7,5,13,45,2,541),  'millisecondsUntil', [d]), 1, '1 milliseconds until');
    equal(run(new Date(2010,7,5,13,45,3,542),  'secondsSince', [d]), 1, '1 seconds since');
    equal(run(new Date(2010,7,5,13,45,1,542),  'secondsUntil', [d]), 1, '1 seconds until');
    equal(run(new Date(2010,7,5,13,46,2,542),  'minutesSince', [d]), 1, '1 minutes since');
    equal(run(new Date(2010,7,5,13,44,2,542),  'minutesUntil', [d]), 1, '1 minutes until');
    equal(run(new Date(2010,7,5,14,45,2,542),  'hoursSince', [d]), 1, '1 hours since');
    equal(run(new Date(2010,7,5,12,45,2,542),  'hoursUntil', [d]), 1, '1 hours until');
    equal(run(new Date(2010,7,6,13,45,2,542),  'daysSince', [d]), 1, '1 days since');
    equal(run(new Date(2010,7,4,13,45,2,542),  'daysUntil', [d]), 1, '1 days until');
    equal(run(new Date(2010,7,12,13,45,2,542), 'weeksSince', [d]), 1, '1 weeks since');
    equal(run(new Date(2010,6,29,13,45,2,542), 'weeksUntil', [d]), 1, '1 weeks until');
    equal(run(new Date(2010,8,5,13,45,2,542),  'monthsSince', [d]), 1, '1 months since');
    equal(run(new Date(2010,6,5,13,45,2,542),  'monthsUntil', [d]), 1, '1 months until');
    equal(run(new Date(2011,7,5,13,45,2,542),  'yearsSince', [d]), 1, '1 years since');
    equal(run(new Date(2009,7,5,13,45,2,542),  'yearsUntil', [d]), 1, '1 years until');

    var shift = testGetTimezoneDiff(d, new Date(2011,7,5,13,45,2,542));

    equal(run(new Date(2011,7,5,13,45,2,542), 'millisecondsSince', [d]), 31536000000 + shift, 'milliseconds since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'millisecondsUntil', [d]), -31536000000 - shift, 'milliseconds until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'secondsSince', [d]), 31536000 + (shift / 1000), 'seconds since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'secondsUntil', [d]), -31536000 - (shift / 1000), 'seconds until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'minutesSince', [d]), 525600 + (shift / 1000 / 60), 'minutes since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'minutesUntil', [d]), -525600 - (shift / 1000 / 60), 'minutes until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'hoursSince', [d]), 8760 + (shift / 1000 / 60 / 60), 'hours since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'hoursUntil', [d]), -8760 - (shift / 1000 / 60 / 60), 'hours until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'daysSince', [d]), 365, 'days since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'daysUntil', [d]), -365, 'days until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'weeksSince', [d]), 52, 'weeks since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'weeksUntil', [d]), -52, 'weeks until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'monthsSince', [d]), 12, 'months since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'monthsUntil', [d]), -12, 'months until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'yearsSince', [d]), 1, 'years since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'yearsUntil', [d]), -1, 'years until a year before');



    equal(run(new Date(2010,7, 5,13,45,2,543), 'millisecondsFromNow', [d]), 1, '| FromNow alias | milliseconds');
    equal(run(new Date(2010,7, 5,13,45,2,541), 'millisecondsAgo', [d]), 1, 'om now alias | milliseconds');
    equal(run(new Date(2010,7, 5,13,45,3,542), 'secondsFromNow', [d]), 1, '| FromNow alias | seconds');
    equal(run(new Date(2010,7, 5,13,45,1,542), 'secondsAgo', [d]), 1, 'o alias | seconds');
    equal(run(new Date(2010,7, 5,13,46,2,542), 'minutesFromNow', [d]), 1, '| FromNow alias | minutes');
    equal(run(new Date(2010,7, 5,13,44,2,542), 'minutesAgo', [d]), 1, 'o alias | minutes');
    equal(run(new Date(2010,7, 5,14,45,2,542), 'hoursFromNow', [d]), 1, '| FromNow alias | hours');
    equal(run(new Date(2010,7, 5,12,45,2,542), 'hoursAgo', [d]), 1, 'o alias | hours');
    equal(run(new Date(2010,7, 6,13,45,2,542), 'daysFromNow', [d]), 1, '| FromNow alias | days');
    equal(run(new Date(2010,7, 4,13,45,2,542), 'daysAgo', [d]), 1, 'o alias | days');
    equal(run(new Date(2010,7,12,13,45,2,542), 'weeksFromNow', [d]), 1, '| FromNow alias | weeks');
    equal(run(new Date(2010,6,29,13,45,2,542), 'weeksAgo', [d]), 1, 'o alias | weeks');
    equal(run(new Date(2010,8, 5,13,45,2,542), 'monthsFromNow', [d]), 1, '| FromNow alias | months');
    equal(run(new Date(2010,6, 5,13,45,2,542), 'monthsAgo', [d]), 1, 'o alias | months');
    equal(run(new Date(2011,7, 5,13,45,2,542), 'yearsFromNow', [d]), 1, '| FromNow alias | years');
    equal(run(new Date(2009,7, 5,13,45,2,542), 'yearsAgo', [d]), 1, 'o alias | years');

    var shift = testGetTimezoneDiff(new Date(2011, 11, 31), d);

    // Works with Date.create?
    equal(run(d, 'millisecondsSince', ['the last day of 2011']), -44273697458 + shift, 'milliseconds since the last day of 2011');
    equal(run(d, 'millisecondsUntil', ['the last day of 2011']), 44273697458 - shift, 'milliseconds until the last day of 2011');
    equal(run(d, 'secondsSince', ['the last day of 2011']), -44273697 + (shift / 1000), 'seconds since the last day of 2011');
    equal(run(d, 'secondsUntil', ['the last day of 2011']), 44273697 - (shift / 1000), 'seconds until the last day of 2011');
    equal(run(d, 'minutesSince', ['the last day of 2011']), -737894 + (shift / 60 / 1000), 'minutes since the last day of 2011');
    equal(run(d, 'minutesUntil', ['the last day of 2011']), 737894 - (shift / 60 / 1000), 'minutes until the last day of 2011');
    equal(run(d, 'hoursSince', ['the last day of 2011']), -12298 + (shift / 60 / 60 / 1000), 'hours since the last day of 2011');
    equal(run(d, 'hoursUntil', ['the last day of 2011']), 12298 - (shift / 60 / 60 / 1000), 'hours until the last day of 2011');
    equal(run(d, 'daysSince', ['the last day of 2011']), -512, 'days since the last day of 2011');
    equal(run(d, 'daysUntil', ['the last day of 2011']), 512, 'days until the last day of 2011');
    equal(run(d, 'weeksSince', ['the last day of 2011']), -73, 'weeks since the last day of 2011');
    equal(run(d, 'weeksUntil', ['the last day of 2011']), 73, 'weeks until the last day of 2011');
    equal(run(d, 'monthsSince', ['the last day of 2011']), -16, 'months since the last day of 2011');
    equal(run(d, 'monthsUntil', ['the last day of 2011']), 16, 'months until the last day of 2011');
    equal(run(d, 'yearsSince', ['the last day of 2011']), -1, 'years since the last day of 2011');
    equal(run(d, 'yearsUntil', ['the last day of 2011']), 1, 'years until the last day of 2011');


    var d = new Date(2010, 10);
    var years = Math.floor((new Date() - d) / 1000 / 60 / 60 / 24 / 365.25);
    equal(run(d, 'yearsUntil', ['Thursday']), years, 'Relative dates should not be influenced by other input');

    var d = new Date();
    var offset = d.getTime() - getRelativeDate(0, 0, -7).getTime();
    var since, until;

    // I'm occasionally seeing some REALLY big lags with IE here (up to 500ms), so giving a 1s buffer here.

    var msSince = run(d, 'millisecondsSince', ['last week']);
    var msUntil = run(d, 'millisecondsUntil', ['last week']);
    var actualMsSince = Math.round(offset);
    var actualMsUntil = Math.round(-offset);

    equal((msSince <= actualMsSince + 1000) && (msSince >= actualMsSince - 1000), true, 'milliseconds since last week');
    equal((msUntil <= actualMsUntil + 1000) && (msUntil >= actualMsUntil - 1000), true, 'milliseconds until last week');

    var secSince = run(d, 'secondsSince', ['last week']);
    var secUntil = run(d, 'secondsUntil', ['last week']);
    var actualSecSince = Math.round(offset / 1000);
    var actualSecUntil = Math.round(-offset / 1000);

    equal((secSince <= actualSecSince + 5) && (secSince >= actualSecSince - 5), true, 'seconds since last week');
    equal((secUntil <= actualSecUntil + 5) && (secUntil >= actualSecUntil - 5), true, 'seconds until last week');

    function fromLastWeek(method) {
      return run(new Date(), method, ['last week'])
    }

    equalWithMargin(fromLastWeek('minutesSince'), Math.round(offset / 1000 / 60), 1, 'minutes since last week');
    equalWithMargin(fromLastWeek('minutesUntil'), Math.round(-offset / 1000 / 60), 1, 'minutes until last week');
    equalWithMargin(fromLastWeek('hoursSince'),   Math.round(offset / 1000 / 60 / 60), 1, 'hours since last week');
    equalWithMargin(fromLastWeek('hoursUntil'),   Math.round(-offset / 1000 / 60 / 60), 1, 'hours until last week');
    equalWithMargin(fromLastWeek('daysSince'),    Math.round(offset / 1000 / 60 / 60 / 24), 1, 'days since last week');
    equalWithMargin(fromLastWeek('daysUntil'),    Math.round(-offset / 1000 / 60 / 60 / 24), 1, 'days until last week');
    equalWithMargin(fromLastWeek('weeksSince'),   Math.round(offset / 1000 / 60 / 60 / 24 / 7), 1, 'weeks since last week');
    equalWithMargin(fromLastWeek('weeksUntil'),   Math.round(-offset / 1000 / 60 / 60 / 24 / 7), 1, 'weeks until last week');

    equal(fromLastWeek('monthsSince'),   0, 'months since last week');
    equal(fromLastWeek('monthsUntil'),  -0, 'months until last week');
    equal(fromLastWeek('yearsSince'),    0, 'years since last week');
    equal(fromLastWeek('yearsUntil'),   -0, 'years until last week');

    // Issue #236
    var d = getRelativeDate(0, 0, 0, 14);
    equal(run(d, 'daysFromNow'), 0, 'should floor the number rather than round');

    // Issue #267
    equal(run(new Date('Mar 01, 2013'), 'daysUntil', [new Date('Mar 28, 2013')]), 27, 'should not be phased by DST traversal');
    equal(run(new Date('Mar 10, 2013'), 'daysUntil', [new Date('Mar 11, 2013')]), 1, 'exact DST traversal point for CST/CDT');

    // Issue #474
    var daysUntil9pm = run(new Date('11/10/2014 21:00:00'), 'daysSince', [new Date('7/1/2014')]);
    var daysUntil10pm = run(new Date('11/10/2014 22:00:00'), 'daysSince', [new Date('7/1/2014')]);
    equal(daysUntil9pm, daysUntil10pm, 'daysSince should not traverse between 21:00 and 22:00');

    // Issue #474
    // "1 month from now" can be forced back when there are not enough days in a month.
    // In these cases "relative()" should return "4 weeks from now" instead of "1 month from now".
    equal(run(testCreateDate('11/10/2014 21:00:00'), 'daysSince', ['7/1/2014']), 132, 'daysSince should be 132 at 9pm');
    equal(run(testCreateDate('11/10/2014 22:00:00'), 'daysSince', ['7/1/2014']), 132, 'daysSince should be 132 at 10pm');

    // Traversing over February

    equal(run(new Date(2015, 0, 31), 'monthsUntil', [new Date(2015, 1, 28)]),  1, 'Jan 31st is  1 months until Feb 28th');
    equal(run(new Date(2015, 0, 31), 'monthsSince', [new Date(2015, 1, 28)]), -1, 'Jan 31st is -1 months since Feb 28th');
    equal(run(new Date(2015, 1, 28), 'monthsUntil', [new Date(2015, 0, 31)]), -1, 'Feb 28th is -1 months until Jan 31st');
    equal(run(new Date(2015, 1, 28), 'monthsSince', [new Date(2015, 0, 31)]),  1, 'Feb 28th is  1 months since Jan 31st');

    equal(run(new Date(2015, 0, 31), 'monthsUntil', [new Date(2015, 2, 31)]),  2, 'Jan 31st is  2 months until Mar 31st');
    equal(run(new Date(2015, 0, 31), 'monthsSince', [new Date(2015, 2, 31)]), -2, 'Jan 31st is -2 months since Mar 31st');
    equal(run(new Date(2015, 2, 31), 'monthsUntil', [new Date(2015, 0, 31)]), -2, 'Mar 31st is -2 months until Jan 31st');
    equal(run(new Date(2015, 2, 31), 'monthsSince', [new Date(2015, 0, 31)]),  2, 'Mar 31st is  2 months since Jan 31st');

  });

  group('Date Locales', function() {

    testCreateFakeLocale('fo');

    equal(run(new Date(2011, 5, 18), 'format', ['{Month} {date}, {yyyy}']), 'June 18, 2011', 'Non-initialized defaults to English formatting');
    equal(run(getRelativeDate(0, 0, 0, -1), 'relative'), '1 hour ago', 'Non-initialized relative formatting is also English');
    equal(run(testCreateDate('June 18, 2011'), 'isValid'), true, 'English dates will also be properly parsed without being initialized or passing a locale code');


    testSetLocale('fo');

    equal(run(testCreateDate('2011kupo', 'fo'), 'isValid'), true, 'dates will parse if their locale is passed');
    equal(run(testCreateDate('２０１１年０６月１８日'), 'isValid'), false, 'dates will not parse thereafter as the current locale is still en');

    equal(run(new Date(2011, 5, 6), 'format', ['{Month}']), 'La', 'june is La');

    raisesError(function(){ testSetLocale(); }, 'no arguments raises error');
    equal(Sugar.Date.getLocale().code, 'fo', 'setting locale with no arguments had no effect');

    equal(run(new Date(2011, 5, 6), 'format', ['{Month}']), 'La', 'will not change the locale if no argument passed');
    equal(run(new Date(2011, 5, 6), 'format', ['', 'en']), 'June 6, 2011 12:00 AM', 'local locale should override global');
    equal(run(testCreateDate('5 months ago', 'en'), 'relative', ['en']), '5 months ago', 'local locale should override global');

    raisesError(function(){ testSetLocale(''); }, '"" raises an invalid locale error');
    equal(run(new Date(2011, 5, 6), 'format', ['{Month}']), 'La', 'will not change the locale if blank string passed');

    raisesError(function(){ testSetLocale('pink'); }, 'Non-existent locales will raise an error');
    equal(run(testCreateDate('2011kupo'), 'format'), 'yeehaw', 'will not set the current locale to an invalid locale');

  });

  group('Custom Formats', function() {
    testSetLocale('en');

    Sugar.Date.getLocale('en').addFormat('!{month}!{year}!');
    assertDateParsed('!March!2015!', new Date(2015, 2));

    Sugar.Date.getLocale('en').addRawFormat('(\\d+)\\^\\^(\\d+)%%(\\d+), but at the (beginning|end)', ['date','year','month','edge']);
    assertDateParsed('25^^2008%%02, but at the end', new Date(2008, 1, 25, 23, 59, 59, 999));

    Sugar.Date.getLocale('en').addRawFormat('on ze (\\d+)th of (january|february|march|april|may) lavigne', ['date','month']);
    assertDateParsed('on ze 18th of april lavigne', 'en', new Date(thisYear, 3, 18));

    equal(typeof Sugar.Date.getLocale(), 'object', 'current locale object is exposed in case needed');
    equal(Sugar.Date.getLocale().code, 'en', 'adding the format did not change the current locale');


    // Issue #119
    Sugar.Date.getLocale('en').addRawFormat('(\\d{2})(\\d{2})', ['hour','minute']);
    assertDateParsed('0615', testCreateDate('06:15'));

    // Not sure how nuts I want to get with this so for the sake of the tests just push the proper format back over the top...
    Sugar.Date.getLocale('en').addRawFormat('(\\d{4})', ['year']);

  });

  // TODO: handle this:
  // Issue #146 - These tests were failing when system time was set to Friday, June 1, 2012 PDT

  method('getAllLocales', function() {
    var all = run(Date, 'getAllLocales');
    equal(typeof all, 'object', 'Result should be an object');
    equal(all['en'].code, 'en', 'English should be set');
  });

  method('getAllLocaleCodes', function() {
    var all = run(Date, 'getAllLocaleCodes');
    equal(testIsArray(all), true, 'Result should be an array');
    equal(all[0], 'en', 'English should be the first');
  });

  group('Adding locales', function() {

    testSetLocale('en');
    Sugar.Date.addLocale('bar', {
      months: ['a','b','c'],
      parse: ['{month}']
    });

    equal(Sugar.Date.getLocale().code, Sugar.Date.getLocale('en').code, 'adding a locale does not affect the current locale');
    equal(Sugar.Date.getLocale('bar').months[0], 'a', 'new locale has been added');
    assertDateParsed('a', 'bar', testCreateDate('January'));

    Sugar.Date.addLocale({
      code: 'barbar',
      months: ['d','e','f'],
      parse: ['{month}']
    });
    assertDateParsed('f', 'barbar', testCreateDate('March'));

    testSetLocale('bar');
    Sugar.Date.removeLocale('bar');
    equal(Sugar.Date.getLocale('bar'), undefined, 'should have removed the locale');
    equal(Sugar.Date.getLocale() === Sugar.Date.getLocale('en'), true, 'current locale should be reset to English');

  });

  method('newDateInternal', function() {

    // Issue #342 handling offsets for comparison

    Sugar.Date.setOption('newDateInternal', function() {
      var d = new Date();
      // Honolulu time zone GMT-10:00
      var offset = (d.getTimezoneOffset() - (10 * 60)) * 60 * 1000;
      d.setTime(d.getTime() + offset);
      return d;
    });

    var offset = 600 - new Date().getTimezoneOffset();

    var d = testCreateDate();
    var expected = new Date();
    expected.setTime(expected.getTime() - (offset * 60 * 1000));
    equal(d, expected, 'now | offset was respected');

    var d = testCreateDate('1 day ago');
    var expected = new Date();
    // Need to set the timezone BEFORE setting the date as that's how
    // our newDateInternal method is working. Otherwise the date may
    // traverse across a DST boundary which could affect the offset.
    expected.setTime(expected.getTime() - (offset * 60 * 1000));
    expected.setDate(expected.getDate() - 1);
    equal(d, expected, '1 day ago | offset was respected');

    equal(testCreatePastDate('4pm').getTime() < (new Date().getTime() + (-offset * 60 * 1000)), true, 'past repsects global offset');
    equal(testCreateFutureDate('4pm').getTime() > (new Date().getTime() + (-offset * 60 * 1000)), true, 'future repsects global offset');

    // Relative formatting with newDateInternal

    Sugar.Date.setOption('newDateInternal', function() {
      return new Date(1963, 11, 22);
    });

    equal(run(new Date(1963, 5, 20), 'relative'), '6 months ago', 'relative should respect newDateInternal as well');

    // Issue #342 internal constructor override

    var AwesomeDate = function() {};
    AwesomeDate.prototype = new Date();
    AwesomeDate.prototype.getMinutes = function() {};

    Sugar.Date.setOption('newDateInternal', function() {
      return new AwesomeDate();
    });

    equal(testCreateDate() instanceof AwesomeDate, true, 'Result should be use in Date.create');

    Sugar.Date.setOption('newDateInternal', null);
    equal(testCreateDate() instanceof AwesomeDate, false, 'Internal function should have been reset');

  });

});

namespace('Number', function () {

  group('Unit Before/After', function () {

    function assertBeforeAfter(ms, method, args, ems, message) {
      equal(run(ms, method, args), getRelativeDate(0, 0, 0, 0, 0, 0, ems), message);
    }
    assertBeforeAfter(1, 'secondAfter', [], 1000, 'secondAfter | 1');
    assertBeforeAfter(5, 'secondsAfter', [], 5000, 'secondsAfter | 5');
    assertBeforeAfter(10, 'minutesAfter', [], 600000, 'minutesAfter | 10');

    assertBeforeAfter(1, 'secondBefore', [], -1000, 'secondBefore | 1');
    assertBeforeAfter(5, 'secondsBefore', [], -5000, 'secondBefore | 5');
    assertBeforeAfter(10, 'secondsBefore', [], -10000, 'secondBefore | 10');

    assertBeforeAfter(5, 'minutesAfter', [run(5, 'minutesAgo')], 0, 'minutesAfter | 5 minutes after 5 minutes ago');
    assertBeforeAfter(10, 'minutesAfter', [run(5, 'minutesAgo')], 1000 * 60 * 5, 'minutesAfter | 10 minutes after 5 minutes ago');

    assertBeforeAfter(5, 'minutesBefore', [run(5, 'minutesFromNow')], 0, 'minutesBefore | 5 minutes before 5 minutes from now');
    assertBeforeAfter(10, 'minutesBefore', [run(5, 'minutesFromNow')], -(1000 * 60 * 5), 'minutesBefore | 10 minutes before 5 minutes from now');

    var christmas = new Date('December 25, 1972');

    equal(run(5, 'minutesBefore', [christmas]), getRelativeDate.call(christmas,0,0,0,0,-5), 'minutesBefore | 5 minutes before christmas');
    equal(run(5, 'minutesAfter', [christmas]), getRelativeDate.call(christmas,0,0,0,0,5), 'minutesAfter | 5 minutes after christmas');

    equal(run(5, 'hoursBefore', [christmas]), getRelativeDate.call(christmas,0,0,0,-5), 'hoursBefore | 5 hours before christmas');
    equal(run(5, 'hoursAfter', [christmas]), getRelativeDate.call(christmas,0,0,0,5), 'hoursAfter | 5 hours after christmas');

    equal(run(5, 'daysBefore', [christmas]), getRelativeDate.call(christmas,0,0,-5), 'daysBefore | 5 days before christmas');
    equal(run(5, 'daysAfter', [christmas]), getRelativeDate.call(christmas,0,0,5), 'daysAfter | 5 days after christmas');

    equal(run(5, 'weeksBefore', [christmas]), getRelativeDate.call(christmas,0,0, -35), 'weeksBefore | 5 weeks before christmas');
    equal(run(5, 'weeksAfter', [christmas]), getRelativeDate.call(christmas,0,0, 35), 'weeksAfter | 5 weeks after christmas');

    equal(run(5, 'monthsBefore', [christmas]), getRelativeDate.call(christmas,0,-5), 'monthsBefore | 5 months before christmas');
    equal(run(5, 'monthsAfter', [christmas]), getRelativeDate.call(christmas,0,5), 'monthsAfter | 5 months after christmas');

    equal(run(5, 'yearsBefore', [christmas]), getRelativeDate.call(christmas,-5), 'yearsBefore | 5 years before christmas');
    equal(run(5, 'yearsAfter', [christmas]), getRelativeDate.call(christmas,5), 'yearsAfter | 5 years after christmas');


    // Hooking it all up!!

    // Try this in WinXP:
    // 1. Set timezone to Damascus
    // 2. var d = new Date(1998, 3, 3, 17); d.setHours(0); d.getHours();
    // 3. hours = 23
    // 4. PROFIT $$$

    equal(run(5, 'minutesBefore', ['April 2rd, 1998']), new Date(1998, 3, 1, 23, 55), 'minutesBefore | 5 minutes before April 3rd, 1998');
    equal(run(5, 'minutesAfter', ['January 2nd, 2005']), new Date(2005, 0, 2, 0, 5), 'minutesAfter | 5 minutes after January 2nd, 2005');
    equal(run(5, 'hoursBefore', ['the first day of 2005']), new Date(2004, 11, 31, 19), 'hoursBefore | 5 hours before the first day of 2005');
    equal(run(5, 'hoursAfter', ['the last day of 2006']), new Date(2006, 11, 31, 5), 'hoursAfter | 5 hours after the last day of 2006');
    equal(run(5, 'hoursAfter', ['the end of 2006']), new Date(2007, 0, 1, 4, 59, 59, 999), 'hoursAfter | 5 hours after the end of 2006');


    var expected = testGetWeekday(1, -1);
    expected.setDate(expected.getDate() - 5);
    equal(run(5, 'daysBefore', ['last week monday']), expected, 'daysBefore | 5 days before last week monday');

    var expected = new Date(testGetWeekday(2, 1).getTime() + run(5, 'days'));
    equal(run(5, 'daysAfter', ['next tuesday']), expected, 'daysAfter | 5 days after next week tuesday');

    var expected = getRelativeDate(0, 0, -35);
    expected.setHours(0);
    expected.setMinutes(0);
    expected.setSeconds(0);
    expected.setMilliseconds(0);
    equal(run(5, 'weeksBefore', ['today']), expected, 'weeksBefore | 5 weeks before today');

    var expected = getRelativeDate(0, 0, 35);
    equal(run(5, 'weeksAfter', ['now']), expected, 'weeksAfter | 5 weeks after now');

    var expected = getRelativeDate(0, -5);
    expected.setHours(0);
    expected.setMinutes(0);
    expected.setSeconds(0);
    expected.setMilliseconds(0);
    equal(run(5, 'monthsBefore', ['today']), expected, 'monthsBefore | 5 months before today');

    var expected = getRelativeDate(0, 5);
    equal(run(5, 'monthsAfter', ['now']), expected, 'monthsAfter | 5 months after now');

  });

  group('Date Locales', function() {

    // Issue #415 locale object properties should be exported.
    var en = Sugar.Date.getLocale('en');
    var properties = [
      'code',
      'months', 'weekdays', 'units', 'numerals', 'placeholders',
      'articles', 'tokens', 'timeMarkers', 'ampm', 'timeSuffixes',
      'parse', 'timeParse', 'timeFrontParse', 'modifiers',
      'compiledFormats', 'parsingAliases', 'parsingTokens', 'numeralMap'
    ];

    for (var i = 0; i < properties.length; i++) {
      var p = properties[i];
      equal(!!en[p], true, 'property ' + p + ' should exist in the locale object');
    }

    var cf = en.compiledFormats[0];
    equal(cf.hasOwnProperty('reg'), true, 'compiled format should have a reg property');
    equal(cf.hasOwnProperty('to'), true, 'compiled format should have a to property');

  });

  group('Specificity', function() {
    var obj;

    obj = {};
    Sugar.Date.create('tomorrow at 8:00pm', { params: obj });
    // TODO: make these constants
    equal(obj.specificity, 2);

    obj = {};
    Sugar.Date.create('tomorrow at noon', { params: obj });
    equal(obj.specificity, 3);

    obj = {};
    Sugar.Date.create('the end of february', { params: obj });
    equal(obj.specificity, 4);
  });

});
