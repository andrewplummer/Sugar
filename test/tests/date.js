namespace('Date', function () {
  'use strict';

  var now = new Date();
  var thisYear = now.getFullYear();

  group('Locale Setup', function() {

    notEqual(Sugar.Date.getLocale().code, undefined, 'Current locale must be something... other libs may overwrite this');
    testSetLocale('en');

  });

  method('isValid', function() {

    test(new Date('a fridge too far'), false, 'new Date invalid');
    test(new Date(), true, 'new Date valid');

    // Issue #219

    test(testCreateDate('29:00'),  true,  'hours may fall outside range');
    test(testCreateDate('30:00'),  false, 'no hours allowed outside range');
    test(testCreateDate('139:00'), false, '3 digits not supported');

    // These dates actually will parse out natively in V8
    // equal(Date.create('05:75').isValid(), false, 'no minutes allowed outside range');
    // equal(Date.create('05:59:60').isValid(), false, 'no seconds allowed outside range');
    test(testCreateDate('05:59:59'), true, 'seconds within range');

  });

  method('isUTC', function() {
    var d = new Date(1998, 0);
    test(d, d.getTimezoneOffset() === 0, 'UTC is true if the current timezone has no offset');

    d = run(d, 'clone');
    d = run(d, 'addMinutes', [d.getTimezoneOffset()]);
    test(d, d.getTimezoneOffset() === 0, 'UTC cannot be forced');

    // UTC is still false even if the time is reset to the intended utc equivalent, as timezones can never be changed
    equal(run(Date, 'create'), new Date(), 'empty');
  });

  group('Create | Chainables', function() {
    equal(new Sugar.Date().raw, new Date(), 'No argument produces current date');
    equal(new Sugar.Date(undefined).raw, new Date(), 'Undefined is the same as no argument');
    equal(new Sugar.Date(null).raw, new Date(0), 'Null is the same as 0');
    equal(new Sugar.Date(1455030000000).raw, new Date(1455030000000), 'Integer is used as unix timestamp');
    equal(new Sugar.Date('tomorrow').raw, testCreateDate('tomorrow'), 'Chainable constructor should go through create');
    equal(new Sugar.Date('8/10/50', { locale: 'en-GB'}).raw, new Date(1950, 9, 8), 'Chainable constructor accepts options');
    equal(new Sugar.Date('8/10/50', 'en-GB').raw, new Date(1950, 9, 8), 'Chainable constructor accepts a locale code');
    equal(Sugar.Date('8/10/50', 'en-GB').raw, new Date(1950, 9, 8), 'Chainable as factory accepts a locale code');
    equal(testIsUTC(new Sugar.Date(new Date(), { setUTC: true }).raw), true, 'Date object should be sent to create');
  });

  group('Create | Objects', function() {

    assertDateParsed({year:1998 }, new Date(1998, 0));
    assertDateParsed({year:1998,month:1}, new Date(1998,1));
    assertDateParsed({year:1998,month:1,day:23}, new Date(1998,1,23));
    assertDateParsed({year:1998,month:1,day:23,hour:11}, new Date(1998,1,23,11));
    assertDateParsed({year:1998,month:1,day:23,hour:11,minutes:54}, new Date(1998,1,23,11,54));
    assertDateParsed({year:1998,month:1,day:23,hour:11,minutes:54,seconds:32}, new Date(1998,1,23,11,54,32));
    assertDateParsed({year:1998,month:1,day:23,hour:11,minutes:54,seconds:32,milliseconds:454}, new Date(1998,1,23,11,54,32,454));

    var obj = { year: 1998 };
    testCreateDate(obj);

    equal(obj.year, 1998, 'Year should still be 1998');
    equal(Object.keys(obj).length, 1, 'No other properties should be set');

    // Should handle fractions, ms should be truncated
    assertDateParsed({days:20.5},    testDateSet(getRelativeDateReset(0,0), {date:20,hour:12}));
    assertDateParsed({hours:2.5},    testDateSet(getRelativeDateReset(0,0,0), {hour:2,minute:30}));
    assertDateParsed({minutes:15.5}, testDateSet(getRelativeDateReset(0,0,0,0), {minute:15,second:30}));
    assertDateParsed({seconds:42.5}, testDateSet(getRelativeDateReset(0,0,0,0,0), {second:42,millisecond:500}));
    assertDateParsed({milliseconds:999.99999}, testDateSet(getRelativeDateReset(0,0,0,0,0,0), {millisecond:999}));

  });

  group('Create | Timestamps', function() {
    var timestamp = 1294012800000;
    var d = testCreateDate(timestamp); // 2011-01-03 00:00:00 
    equal(d.getFullYear(), 2011, '2011')
    equal(d.getMonth(), 0, 'is January');
    equal(d.getDate(), Math.floor(3 - (d.getTimezoneOffset() / 60 / 24)), 'is the 3rd');
    equal(d.getTime(), timestamp, 'is exact');
  });

  group('Create | Options', function() {

    testCreateFakeLocale('fo');

    assertDateParsed('8/10/50', { locale: 'en-GB'}, new Date(1950, 9, 8));

    var now = new Date();
    var opt = {
      past: true
    };
    equal(testCreateDate('Sunday',    opt) > now, false, 'past in options | Sunday');
    equal(testCreateDate('Monday',    opt) > now, false, 'past in options | Monday');
    equal(testCreateDate('Tuesday',   opt) > now, false, 'past in options | Tuesday');
    equal(testCreateDate('Wednesday', opt) > now, false, 'past in options | Wednesday');
    equal(testCreateDate('Thursday',  opt) > now, false, 'past in options | Thursday');
    equal(testCreateDate('Friday',    opt) > now, false, 'past in options | Friday');
    equal(testCreateDate('Saturday',  opt) > now, false, 'past in options | Saturday');

    var opt = {
      future: true
    };
    equal(testCreateDate('Sunday',    opt) > now, true, 'future in options | Sunday');
    equal(testCreateDate('Monday',    opt) > now, true, 'future in options | Monday');
    equal(testCreateDate('Tuesday',   opt) > now, true, 'future in options | Tuesday');
    equal(testCreateDate('Wednesday', opt) > now, true, 'future in options | Wednesday');
    equal(testCreateDate('Thursday',  opt) > now, true, 'future in options | Thursday');
    equal(testCreateDate('Friday',    opt) > now, true, 'future in options | Friday');
    equal(testCreateDate('Saturday',  opt) > now, true, 'future in options | Saturday');

    var opt = {
      past: true,
      future: true
    };
    assertDateParsed('Sunday',    opt, testCreateDate('Sunday'));
    assertDateParsed('Monday',    opt, testCreateDate('Monday'));
    assertDateParsed('Tuesday',   opt, testCreateDate('Tuesday'));
    assertDateParsed('Wednesday', opt, testCreateDate('Wednesday'));
    assertDateParsed('Thursday',  opt, testCreateDate('Thursday'));
    assertDateParsed('Friday',    opt, testCreateDate('Friday'));
    assertDateParsed('Saturday',  opt, testCreateDate('Saturday'));


    // fromUTC option

    var d1 = new Date(2012, 11, 31);
    var d2 = testCreateDate('2012-12-31', { fromUTC: true });
    equal(d1 - d2, d1.getTimezoneOffset() * 60 * 1000, 'string created dates allow options object as last argument');
    equal(testIsUTC(d2), false, 'UTC flag should not be set');

    var d1 = new Date(2012, 11, 31);
    var d2 = testCreateDate('2012-12-31', { fromUTC: false });
    equal(d1 - d2, 0, 'false param should not be parsed as utc');

    var d1 = new Date(2012, 11, 31);
    var d2 = testCreateDate({ year: 2012, month: 11, day: 31 }, { fromUTC: true });
    equal(d1 - d2, d1.getTimezoneOffset() * 60 * 1000, 'object created dates allow options object as last argument');

    var opt = {
      fromUTC: true,
      locale: 'fo',
      future: true
    };

    var now = new Date();
    var d1 = testCreateDate('March', { future: true });
    var d2 = testCreateDate('mimofo', opt);

    equal(d2 > now, true, 'compound options | future is true');
    equal(d1 - d2, d1.getTimezoneOffset() * 60 * 1000, 'compound options | utc is true');

    // Testing native fallback parsing.
    if (new Date('10 06 2014').getTime() > 0) {
      var d1 = testCreateDate('10 06 2014', { fromUTC: true });
      var d2 = new Date(2014, 9, 6);
      equal(d1 - d2, d1.getTimezoneOffset() * 60 * 1000, 'native fallback will still honor fromUTC flag');
    }

    // setUTC option

    var d = testCreateDate(1440428400000, { setUTC: true });
    equal(testIsUTC(d), true, 'setUTC should be allowed on a timestamp');

    var d = testCreateDate({ month: 7, day: 25 }, { setUTC: true });
    equal(testIsUTC(d), true, 'setUTC should be allowed on a parameter created date');

    var d1 = new Date(2012, 11, 31);
    var d2 = testCreateDate({ year: 2012, month: 11, date: 31 }, {
      fromUTC: true,
      setUTC: true
    });
    equal(d1 - d2, d1.getTimezoneOffset() * 60 * 1000, 'both UTC flags should parsed as UTC');
    equal(testIsUTC(d2), true, 'both UTC flags should also set UTC');

    // Empty/unrecgonized params should be allowed
    assertDateParsed({}, new Date());
    assertDateParsed({ fromUTC: true }, new Date());

    // Issue #545 Allowing "set" option
    var params = {};
    testCreateDate('January 13th, 2016', { params: params });
    equal(params.year, 2016, 'Set object should expose year');
    equal(params.month, 0, 'Set object should expose month');
    equal(params.date, 13, 'Set object should expose date');

  });

  group('Create | Simple', function() {
    assertDateParsed('1999',      new Date(1999, 0));
    assertDateParsed('June',      new Date(thisYear, 5));
    assertDateParsed('June 15',   new Date(thisYear, 5, 15));
    assertDateParsed('June 15th', new Date(thisYear, 5, 15));
    assertDateParsed('Saturday',  testGetWeekday(6));
  });

  group('Create | American Style Slashes', function() {

    assertDateParsed('08/25',      new Date(thisYear, 7, 25));
    assertDateParsed('8/25',       new Date(thisYear, 7, 25));
    assertDateParsed('08/25/1978', new Date(1978, 7, 25));
    assertDateParsed('8/25/1978',  new Date(1978, 7, 25));
    assertDateParsed('8/25/78',    new Date(1978, 7, 25));
    assertDateParsed('08/25/78',   new Date(1978, 7, 25));
    assertDateParsed('8/25/01',    new Date(2001, 7, 25));
    assertDateParsed('8/25/49',    new Date(2049, 7, 25));
    assertDateParsed('8/25/50',    new Date(1950, 7, 25));

    // Abbreviated reverse slash format yy/mm/dd cannot exist because it clashes with forward
    // slash format dd/mm/yy (with european variant). This rule however, doesn't follow for dashes,
    // which is abbreviated ISO-8601 format: yy-mm-dd
    assertDateParsed('01/02/03', new Date(2003, 0, 2));

    var d = testCreateDate('08/25/0001');
    d = new Date(d.getTime() - (d.getTimezoneOffset() * 60 * 1000));
    equal(d, new Date(-62115206400000), 'mm/dd/0001');
  });

  group('Create | American Style Dashes', function() {

    assertDateParsed('08-25-1978', new Date(1978, 7, 25));
    assertDateParsed('8-25-1978', new Date(1978, 7, 25));

    // yy-mm-dd is NOT a valid ISO 8601 representation as of 2004, hence this format will
    // revert to a little endian representation, where year truncation is allowed. See:
    // http://en.wikipedia.org/wiki/ISO_8601#Truncated_representations
    assertDateParsed('08-05-05', new Date(2005, 7, 5));

    assertDateParsed('06-2008', new Date(2008, 5));
    assertDateParsed('6-2008', new Date(2008, 5));

  });

  group('Create | American Style Dots', function() {
    assertDateParsed('08.25.1978', new Date(1978, 7, 25));
    assertDateParsed('8.25.1978', new Date(1978, 7, 25));
  });

  group('Create | European Style', function() {

    assertDateParsed('08/10', 'en-GB',      new Date(thisYear, 9, 8));
    assertDateParsed('8/10', 'en-GB',       new Date(thisYear, 9, 8));
    assertDateParsed('08/10/1978', 'en-GB', new Date(1978, 9, 8));
    assertDateParsed('8/10/1978', 'en-GB',  new Date(1978, 9, 8));
    assertDateParsed('8/10/78', 'en-GB',    new Date(1978, 9, 8));
    assertDateParsed('08/10/78', 'en-GB',   new Date(1978, 9, 8));
    assertDateParsed('8/10/01', 'en-GB',    new Date(2001, 9, 8));
    assertDateParsed('8/10/49', 'en-GB',    new Date(2049, 9, 8));
    assertDateParsed('8/10/50', 'en-GB',    new Date(1950, 9, 8));
    assertDateParsed('08/10', 'en-AU',      new Date(thisYear, 9, 8));

    // Dashes
    assertDateParsed('08-10-1978', 'en-GB', new Date(1978, 9, 8));

    // Dots
    assertDateParsed('08.10.1978', 'en-GB', new Date(1978, 9, 8));
    assertDateParsed('8.10.1978', 'en-GB',  new Date(1978, 9, 8));

    assertDateParsed('08-05-05', 'en-GB', new Date(2005, 4, 8));
    assertDateParsed('8/10/85', new Date(1985, 7, 10));

    testSetLocale('en-GB');
    assertDateParsed('8/10/85', new Date(1985, 9, 8));

    testSetLocale('en');
    assertDateParsed('8/10/85', new Date(1985, 7, 10));

  });

  group('Create | Dygraphs', function() {

    // http://dygraphs.com/date-formats.html
    assertDateParsed('2009/07/12', new Date(2009,6,12));
    assertDateParsed('2009/7/12', new Date(2009,6,12));
    assertDateParsed('2009/07/12 12:34', new Date(2009,6,12,12,34));
    assertDateParsed('2009/07/12 12:34:56', new Date(2009,6,12,12,34,56));
    assertDateParsed('2009/07/12 12:34:56.789', new Date(2009,6,12,12,34,56,789));

    assertDateParsed('07/02/2012', new Date(2012,6,2));
    assertDateParsed('7/02/2012', new Date(2012,6,2));
    assertDateParsed('7/02/2012 12:34', new Date(2012,6,2,12,34));

    assertDateParsed('2009-7-12', new Date(2009,6,12));
    assertDateParsed('2009-07-12', new Date(2009,6,12));
    assertDateParsed('2009-07-12 12:34', new Date(2009,6,12,12,34));
    assertDateParsed('2009-07-12 12:34:56', new Date(2009,6,12,12,34,56));

    assertDateParsed('1-1-2012', new Date(2012,0,1));
    assertDateParsed('1-1-12', new Date(2012,0,1));
    assertDateParsed('1/1/12', new Date(2012,0,1));
    assertDateParsed('1-1-12 11:12', new Date(2012,0,1,11,12));
    assertDateParsed('1/1/12 11:12', new Date(2012,0,1,11,12));
    assertDateParsed('1-1-12 11:12:34.567', new Date(2012,0,1,11,12,34,567));
    assertDateParsed('1/1/12 11:12:34.567', new Date(2012,0,1,11,12,34,567));

    assertDateParsed('1/2', new Date(now.getFullYear(),0,2));
    assertDateParsed('1-2', new Date(now.getFullYear(),0,2));
    assertDateParsed('1/2/3', new Date(2003,0,2));
    assertDateParsed('1-2-3', new Date(2003,0,2));

    assertDateParsed('2011-10-10T14:48:00+0200', getUTCDate(2011,9,10,12,48));
    assertDateParsed('2011-10-10T14:48:00', new Date(2011,9,10,14,48));

    assertDateParsed('2000-01-02T12:34:56Z', getUTCDate(2000,0,2,12,34,56));
    assertDateParsed('2000-01-02T12:34:56.789Z', getUTCDate(2000,0,2,12,34,56,789));
    assertDateParsed('2000-01-02T12:34:56.789012Z', getUTCDate(2000,0,2,12,34,56,789));

  });

  group('Create | IETF', function() {
    // Note that most browsers parse these, and Sugar will fall back to browser parsing.
    assertDateParsed('Mon Sep 05 2011 12:30:00 GMT-0700 (PDT)', getUTCDate(2011,8,5,19,30));
    assertDateParsed('Sat, 28 Aug 2004 08:15:38 GMT', getUTCDate(2004,7,28,8,15,38));
    assertDateParsed('Sat, 28 Aug 2004 08:15:38 GMT-0500 (EASST)', getUTCDate(2004,7,28,13,15,38));
    assertDateParsed('Wed Jun 22 2016 21:43 GMT+0300 (Jordan Daylight Time)', getUTCDate(2016,5,22,18,43));
  });

  group('Create | Reverse Full Slashes', function() {

    // Slashes
    assertDateParsed('1978/08/25', new Date(1978, 7, 25));
    assertDateParsed('1978/8/25',  new Date(1978, 7, 25));
    assertDateParsed('1978/08',    new Date(1978, 7));
    assertDateParsed('1978/8',     new Date(1978, 7));

    // Dashes
    assertDateParsed('1978-08-25', new Date(1978, 7, 25));
    assertDateParsed('1978-08',    new Date(1978, 7));
    assertDateParsed('1978-8',     new Date(1978, 7));

    // Dots
    assertDateParsed('1978.08.25', new Date(1978, 7, 25));
    assertDateParsed('1978.08',    new Date(1978, 7));
    assertDateParsed('1978.8',     new Date(1978, 7));

    assertDateParsed('01-02-03', 'en-GB', new Date(2003, 1, 1));
    assertDateParsed('01/02/03', 'en-GB', new Date(2003, 1, 1));

  });

  group('Create | Text Month', function() {

    assertDateParsed('June 2008',       new Date(2008, 5));
    assertDateParsed('June-2008',       new Date(2008, 5));
    assertDateParsed('June.2008',       new Date(2008, 5));
    assertDateParsed('June 1st, 2008',  new Date(2008, 5, 1));
    assertDateParsed('June 2nd, 2008',  new Date(2008, 5, 2));
    assertDateParsed('June 3rd, 2008',  new Date(2008, 5, 3));
    assertDateParsed('June 4th, 2008',  new Date(2008, 5, 4));
    assertDateParsed('June 15th, 2008', new Date(2008, 5, 15));
    assertDateParsed('June 1st 2008',   new Date(2008, 5, 1));
    assertDateParsed('June 2nd 2008',   new Date(2008, 5, 2));
    assertDateParsed('June 3rd 2008',   new Date(2008, 5, 3));
    assertDateParsed('June 4th 2008',   new Date(2008, 5, 4));
    assertDateParsed('June 15, 2008',   new Date(2008, 5, 15));
    assertDateParsed('June 15 2008',    new Date(2008, 5, 15));
    assertDateParsed('15 July, 2008',   new Date(2008, 6, 15));
    assertDateParsed('15 July 2008',    new Date(2008, 6, 15));
    assertDateParsed('juNe 1St 2008',   new Date(2008, 5, 1));
    assertDateParsed('February, 1998',  new Date(1998, 1));

    assertDateParsed('June 2008',       'en-GB', new Date(2008, 5));
    assertDateParsed('June-2008',       'en-GB', new Date(2008, 5));
    assertDateParsed('June.2008',       'en-GB', new Date(2008, 5));
    assertDateParsed('June 1st, 2008',  'en-GB', new Date(2008, 5, 1));
    assertDateParsed('June 2nd, 2008',  'en-GB', new Date(2008, 5, 2));
    assertDateParsed('June 3rd, 2008',  'en-GB', new Date(2008, 5, 3));
    assertDateParsed('June 4th, 2008',  'en-GB', new Date(2008, 5, 4));
    assertDateParsed('June 15th, 2008', 'en-GB', new Date(2008, 5, 15));
    assertDateParsed('June 1st 2008',   'en-GB', new Date(2008, 5, 1));
    assertDateParsed('June 2nd 2008',   'en-GB', new Date(2008, 5, 2));
    assertDateParsed('June 3rd 2008',   'en-GB', new Date(2008, 5, 3));
    assertDateParsed('June 4th 2008',   'en-GB', new Date(2008, 5, 4));
    assertDateParsed('June 15, 2008',   'en-GB', new Date(2008, 5, 15));
    assertDateParsed('June 15 2008',    'en-GB', new Date(2008, 5, 15));
    assertDateParsed('15 July, 2008',   'en-GB', new Date(2008, 6, 15));
    assertDateParsed('15 July 2008',    'en-GB', new Date(2008, 6, 15));
    assertDateParsed('juNe 1St 2008',   'en-GB', new Date(2008, 5, 1));

    assertDateParsed('Monday January 16th 2012',   new Date(2012, 0, 16));
    assertDateParsed('Monday, January 16th 2012',  new Date(2012, 0, 16));
    assertDateParsed('Monday, January, 16th 2012', new Date(2012, 0, 16));
    assertDateParsed('Monday January, 16th 2012',  new Date(2012, 0, 16));

    assertDateParsed('Monday January 16th, 2012',   new Date(2012, 0, 16));
    assertDateParsed('Monday January, 16th, 2012',  new Date(2012, 0, 16));
    assertDateParsed('Monday, January, 16th, 2012', new Date(2012, 0, 16));

    assertDateParsed('Mon. January 16th, 2012',   new Date(2012, 0, 16));
    assertDateParsed('Mon. January, 16th, 2012',  new Date(2012, 0, 16));
    assertDateParsed('Mon., January, 16th, 2012', new Date(2012, 0, 16));

    assertDateParsed('Mon. Jan. 16th, 2012',   new Date(2012, 0, 16));
    assertDateParsed('Mon. Jan., 16th, 2012',  new Date(2012, 0, 16));
    assertDateParsed('Mon., Jan., 16th, 2012', new Date(2012, 0, 16));

    // Issue #507 "sept"
    assertDateParsed('Sept 2015', new Date(2015, 8, 1));

  });

  group('Create | Whitespace', function() {
    assertDateParsed(' July 4th, 1987 ',  new Date(1987, 6, 4));
    assertDateParsed('  7/4/1987 ',       new Date(1987, 6, 4));
    assertDateParsed('   1987-07-04    ', new Date(1987, 6, 4));
  });

  group('Create | Abbreviated Formats', function() {
    assertDateParsed('Dec 1st, 2008',  new Date(2008, 11, 1));
    assertDateParsed('Dec. 1st, 2008', new Date(2008, 11, 1));
    assertDateParsed('1 Dec. 2008',    new Date(2008, 11, 1));
    assertDateParsed('1 Dec., 2008',   new Date(2008, 11, 1));
    assertDateParsed('1 Dec, 2008',    new Date(2008, 11, 1));
    assertDateParsed('June 1st, 2008 12:04', new Date(2008, 5, 1, 12, 4));
  });

  group('Create | Abbreviated with Text Month', function() {

    assertDateParsed('09-May-78', new Date(1978, 4, 9));
    assertDateParsed('09-May-1978', new Date(1978, 4, 9));
    assertDateParsed('09-May-1978 3:45pm', new Date(1978, 4, 9, 15, 45));

    assertDateParsed('1978-May-09', new Date(1978, 4, 9));
    assertDateParsed('1978-May-09 3:45pm', new Date(1978, 4, 9, 15, 45));

    assertDateParsed('Thursday July 3rd, 2008', new Date(2008, 6, 3));
    assertDateParsed('Thu July 3rd, 2008', new Date(2008, 6, 3));
    assertDateParsed('Thu. July 3rd, 2008', new Date(2008, 6, 3));

    // Date should not override an incorrect weekday
    assertDateParsed('Wednesday July 3rd, 2008', new Date(2008, 6, 2));

  });

  group('Create | Core Formats', function() {

    assertDateParsed('08/25/1978 12:04', new Date(1978, 7, 25, 12, 4));
    assertDateParsed('08-25-1978 12:04', new Date(1978, 7, 25, 12, 4));
    assertDateParsed('1978/08/25 12:04', new Date(1978, 7, 25, 12, 4));

    assertDateParsed('08-25-1978 12:04:57', new Date(1978, 7, 25, 12, 4, 57));
    assertDateParsed('08-25-1978 12:04:57.322', new Date(1978, 7, 25, 12, 4, 57, 322));

    assertDateParsed('08-25-1978 12pm', new Date(1978, 7, 25, 12));
    assertDateParsed('08-25-1978 12:42pm', new Date(1978, 7, 25, 12, 42));
    assertDateParsed('08-25-1978 12:42:32pm', new Date(1978, 7, 25, 12, 42, 32));
    assertDateParsed('08-25-1978 12:42:32.488pm', new Date(1978, 7, 25, 12, 42, 32, 488));

    assertDateParsed('08-25-1978 00:00am', new Date(1978, 7, 25, 0, 0, 0, 0));
    assertDateParsed('08-25-1978 00:00:00am', new Date(1978, 7, 25, 0, 0, 0, 0));
    assertDateParsed('08-25-1978 00:00:00.000am', new Date(1978, 7, 25, 0, 0, 0, 0));

    assertDateParsed('08-25-1978 1pm', new Date(1978, 7, 25, 13));
    assertDateParsed('08-25-1978 1:42pm', new Date(1978, 7, 25, 13, 42));
    assertDateParsed('08-25-1978 1:42:32pm', new Date(1978, 7, 25, 13, 42, 32));
    assertDateParsed('08-25-1978 1:42:32.488pm', new Date(1978, 7, 25, 13, 42, 32, 488));

    assertDateParsed('08-25-1978 1am', new Date(1978, 7, 25, 1));
    assertDateParsed('08-25-1978 1:42am', new Date(1978, 7, 25, 1, 42));
    assertDateParsed('08-25-1978 1:42:32am', new Date(1978, 7, 25, 1, 42, 32));
    assertDateParsed('08-25-1978 1:42:32.488am', new Date(1978, 7, 25, 1, 42, 32, 488));

    assertDateParsed('08-25-1978 11pm', new Date(1978, 7, 25, 23));
    assertDateParsed('08-25-1978 11:42pm', new Date(1978, 7, 25, 23, 42));
    assertDateParsed('08-25-1978 11:42:32pm', new Date(1978, 7, 25, 23, 42, 32));
    assertDateParsed('08-25-1978 11:42:32.488pm', new Date(1978, 7, 25, 23, 42, 32, 488));

    assertDateParsed('08-25-1978 11am', new Date(1978, 7, 25, 11));
    assertDateParsed('08-25-1978 11:42am', new Date(1978, 7, 25, 11, 42));
    assertDateParsed('08-25-1978 11:42:32am', new Date(1978, 7, 25, 11, 42, 32));
    assertDateParsed('08-25-1978 11:42:32.488am', new Date(1978, 7, 25, 11, 42, 32, 488));

  });

  group('Create | ISO-8601', function() {

    // Without offsets

    assertDateParsed('2010', new Date(2010,0));
    assertDateParsed('2010-11', new Date(2010,10));
    assertDateParsed('2010-11-22', new Date(2010,10,22));
    assertDateParsed('2010-11-22T22', new Date(2010,10,22,22));
    assertDateParsed('2010-11-22T22:59', new Date(2010,10,22,22,59));
    assertDateParsed('2010-11-22T22:59:55', new Date(2010,10,22,22,59,55));
    assertDateParsed('2010-11-22T22:59:55.400', new Date(2010,10,22,22,59,55,400));

    // With offsets

    // Date-only with offset is not a format explicitly addressed
    // by ISO-8601 but is being supported here.
    assertDateParsed('2010Z', getUTCDate(2010,0));
    assertDateParsed('2010-11Z', getUTCDate(2010,10));
    assertDateParsed('2010-11-22Z', getUTCDate(2010,10,22));

    assertDateParsed('2010-11-22T22Z', getUTCDate(2010,10,22,22));
    assertDateParsed('2010-11-22T22:59Z', getUTCDate(2010,10,22,22,59));
    assertDateParsed('2010-11-22T22:59:55Z', getUTCDate(2010,10,22,22,59,55));
    assertDateParsed('2010-11-22T22:59:55.400Z', getUTCDate(2010,10,22,22,59,55,400));

    assertDateParsed('2010-11-22T22:59Z',            getUTCDate(2010,10,22,22,59));
    assertDateParsed('1994-11-05T13:15:30Z',         getUTCDate(1994,10,5,13,15,30));
    assertDateParsed('1997-07-16T19:20+00:00',       getUTCDate(1997,6,16,19,20));
    assertDateParsed('1997-07-16T19:20+01:00',       getUTCDate(1997,6,16,18,20));
    assertDateParsed('1997-07-16T19:20:30+01:00',    getUTCDate(1997,6,16,18,20,30));
    assertDateParsed('1997-07-16T19:20:30.45+01:00', getUTCDate(1997,6,16,18,20,30,450));
    assertDateParsed('1994-11-05T08:15:30-05:00',    getUTCDate(1994,10,5,13,15,30));
    assertDateParsed('1994-11-05T08:15:30-05:00',    getUTCDate(1994,10,5,13,15,30));

    // With U+2212 MINUS SIGN
    assertDateParsed('1994-11-05T08:15:30−05:00',    getUTCDate(1994,10,5,13,15,30));

    equal(testIsUTC(testCreateDate('1994-11-05T13:15:30Z')), false, 'does not forcefully set UTC flag');

    // Basic format
    assertDateParsed('1776', new Date(1776,0));
    assertDateParsed('177605', new Date(1776,4));
    assertDateParsed('17760523', new Date(1776,4,23));
    assertDateParsed('17760523T02', new Date(1776,4,23,2));
    assertDateParsed('17760523T0245', new Date(1776,4,23,2,45));
    assertDateParsed('17760523T024508', new Date(1776,4,23,2,45,8));
    assertDateParsed('17760523T024508+0830', getUTCDate(1776,4,22,18,15,8));

    assertDateParsed('1776-05-23T02:45:08-08:30', getUTCDate(1776,4,23,11,15,8));
    assertDateParsed('1776-05-23T02:45:08+08:30', getUTCDate(1776,4,22,18,15,8));
    assertDateParsed('1776-05-23T02:45:08-0830',  getUTCDate(1776,4,23,11,15,8));
    assertDateParsed('1776-05-23T02:45:08+0830',  getUTCDate(1776,4,22,18,15,8));

    // No limit on the number of millisecond decimals, so....
    assertDateParsed('1997-07-16T19:20:30.4+01:00',     getUTCDate(1997,6,16,18,20,30,400));
    assertDateParsed('1997-07-16T19:20:30.46+01:00',    getUTCDate(1997,6,16,18,20,30,460));
    assertDateParsed('1997-07-16T19:20:30.462+01:00',   getUTCDate(1997,6,16,18,20,30,462));
    assertDateParsed('1997-07-16T19:20:30.4628+01:00',  getUTCDate(1997,6,16,18,20,30,463));
    assertDateParsed('1997-07-16T19:20:30.46284+01:00', getUTCDate(1997,6,16,18,20,30,463));

    // .NET output
    assertDateParsed('2012-04-23T07:58:42.7940000z', getUTCDate(2012,3,23,7,58,42,794));

    // decimals in ISO-8601 dates
    assertDateParsed('1997-07-16T14:30:40.5', new Date(1997,6,16,14,30,40,500));
    assertDateParsed('1997-07-16T14:30.5',    new Date(1997,6,16,14,30,30));

    // Comma based decimals in ISO-8601 dates
    assertDateParsed('1997-07-16T14:30:40,5', new Date(1997,6,16,14,30,40,500));
    assertDateParsed('1997-07-16T14:30,5',    new Date(1997,6,16,14,30,30));

    // decimal hours in ISO dates
    assertDateParsed('1997-07-16T14.5', new Date(1997,6,16,14,30));
    assertDateParsed('1997-07-16T14,5', new Date(1997,6,16,14,30));

    // These are all the same moment...
    assertDateParsed('2001-04-03T18:30Z',      getUTCDate(2001,3,3,18,30));
    assertDateParsed('2001-04-03T22:30+04',    getUTCDate(2001,3,3,18,30));
    assertDateParsed('2001-04-03T1130-0700',   getUTCDate(2001,3,3,18,30));
    assertDateParsed('2001-04-03T15:00-03:30', getUTCDate(2001,3,3,18,30));

    // Allows just hour with just hour offset
    assertDateParsed('2001-04-03T22+04', getUTCDate(2001,3,3,18));

    // Simple formats
    assertDateParsed('2001-1-1',    new Date(2001, 0, 1));
    assertDateParsed('2001-01-1',   new Date(2001, 0, 1));
    assertDateParsed('2001-01-01',  new Date(2001, 0, 1));
    assertDateParsed('2010-11-22',  new Date(2010, 10, 22));
    assertDateParsed('20101122',    new Date(2010, 10, 22));
    assertDateParsed('-0002-07-26', new Date(-2, 6, 26));
    assertDateParsed('+1978-04-17', new Date(1978, 3, 17));

    // 24 hour should parse
    assertDateParsed('2012-05-03T24:00:00Z', getUTCDate(2012,4,4));

    // Although ISO-8601 allows "60" for leap seconds,
    // the ES6 spec does not, so disallowing this format.
    assertDateNotParsed('1998-12-31T23:59:60Z');

  });

  group('Create | Time Formats', function() {
    assertDateParsed('1pm',           new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13));
    assertDateParsed('1:30pm',        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 30));
    assertDateParsed('1:30:22pm',     new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 30, 22));
    assertDateParsed('1:30:22.432pm', new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 30, 22, 432));
    assertDateParsed('17:48:03.947',  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 48, 3, 947));
  });

  group('Create | .NET JSON', function() {
    assertDateParsed('\\/Date(628318530718)\\/',    new Date(628318530718));
    assertDateParsed('\\/Date(1318287600+0100)\\/', new Date(1318287600));
    assertDateParsed('\\/Date(1318287600-0700)\\/', new Date(1318287600));
  });

  group('Create | Fuzzy Dates', function() {

    assertDateParsed('the 1st Sunday of last month',    testGetWeekdayInRelativeMonth(-1,0,0));
    assertDateParsed('the 1st Monday of last month',    testGetWeekdayInRelativeMonth(-1,1,0));
    assertDateParsed('the 1st Tuesday of last month',   testGetWeekdayInRelativeMonth(-1,2,0));
    assertDateParsed('the 1st Wednesday of last month', testGetWeekdayInRelativeMonth(-1,3,0));
    assertDateParsed('the 1st Thursday of last month',  testGetWeekdayInRelativeMonth(-1,4,0));
    assertDateParsed('the 1st Friday of last month',    testGetWeekdayInRelativeMonth(-1,5,0));
    assertDateParsed('the 1st Saturday of last month',  testGetWeekdayInRelativeMonth(-1,6,0));

    assertDateParsed('the 1st Sunday of next month',    testGetWeekdayInRelativeMonth(1,0,0));
    assertDateParsed('the 1st Monday of next month',    testGetWeekdayInRelativeMonth(1,1,0));
    assertDateParsed('the 1st Tuesday of next month',   testGetWeekdayInRelativeMonth(1,2,0));
    assertDateParsed('the 1st Wednesday of next month', testGetWeekdayInRelativeMonth(1,3,0));
    assertDateParsed('the 1st Thursday of next month',  testGetWeekdayInRelativeMonth(1,4,0));
    assertDateParsed('the 1st Friday of next month',    testGetWeekdayInRelativeMonth(1,5,0));
    assertDateParsed('the 1st Saturday of next month',  testGetWeekdayInRelativeMonth(1,6,0));

    assertDateParsed('the 1st Friday of last month', testGetWeekdayInRelativeMonth(-1,5,0));
    assertDateParsed('the 2nd Friday of last month', testGetWeekdayInRelativeMonth(-1,5,1));
    assertDateParsed('the 3rd Friday of last month', testGetWeekdayInRelativeMonth(-1,5,2));
    assertDateParsed('the 4th Friday of last month', testGetWeekdayInRelativeMonth(-1,5,3));

    assertDateParsed('the 1st Friday of next month', testGetWeekdayInRelativeMonth(1,5,0));
    assertDateParsed('the 2nd Friday of next month', testGetWeekdayInRelativeMonth(1,5,1));
    assertDateParsed('the 3rd Friday of next month', testGetWeekdayInRelativeMonth(1,5,2));
    assertDateParsed('the 4th Friday of next month', testGetWeekdayInRelativeMonth(1,5,3));

    assertDateParsed('now', new Date());
    assertDateParsed('Now', new Date());
    assertDateParsed('Just now', new Date());
    assertDateParsed('today',    getRelativeDateReset(0,0,0));
    assertDateParsed('Today',    getRelativeDateReset(0,0,0));

    assertDateParsed('4pm',           new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16));
    assertDateParsed('today at 4pm',  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16));
    assertDateParsed('today at 4 pm', new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16));
    assertDateParsed('4pm today',     new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16));
    assertDateParsed('8am Saturday',  testGetWeekday(6, 0, 8));
    assertDateParsed('8am on Saturday',  testGetWeekday(6, 0, 8));

    assertDateParsed('yesterday', getRelativeDateReset(0,0,-1));
    assertDateParsed('Yesterday', getRelativeDateReset(0,0,-1));
    assertDateParsed('tomorrow',  getRelativeDateReset(0,0, 1));
    assertDateParsed('Tomorrow',  getRelativeDateReset(0,0, 1));

    assertDateParsed('Two days before yesterday', getRelativeDateReset(0,0,-3));
    assertDateParsed('Two days before today',     getRelativeDateReset(0,0,-2));
    assertDateParsed('The day before yesterday',  getRelativeDateReset(0,0,-2));
    assertDateParsed('One day before yesterday',  getRelativeDateReset(0,0,-2));
    assertDateParsed('The day after tomorrow',    getRelativeDateReset(0,0, 2));
    assertDateParsed('One day after tomorrow',    getRelativeDateReset(0,0, 2));
    assertDateParsed('Two days after today',      getRelativeDateReset(0,0, 2));
    assertDateParsed('Two days from today',       getRelativeDateReset(0,0, 2));
    assertDateParsed('Two days after tomorrow',   getRelativeDateReset(0,0, 3));
    assertDateParsed('tWo dAyS after toMoRRoW',   getRelativeDateReset(0,0, 3));
    assertDateParsed('2 days after tomorrow',     getRelativeDateReset(0,0, 3));
    assertDateParsed('2 day after tomorrow',      getRelativeDateReset(0,0, 3));
    assertDateParsed('18 days after tomorrow',    getRelativeDateReset(0,0, 19));
    assertDateParsed('18 day after tomorrow',     getRelativeDateReset(0,0, 19));

    assertDateParsed('2 years ago',        getRelativeDate(-2));
    assertDateParsed('2 months ago',       getRelativeDate(0, -2));
    assertDateParsed('2 weeks ago',        getRelativeDate(0, 0, -14));
    assertDateParsed('2 days ago',         getRelativeDate(0, 0, -2));
    assertDateParsed('2 hours ago',        getRelativeDate(0, 0, 0, -2));
    assertDateParsed('2 minutes ago',      getRelativeDate(0, 0, 0, 0, -2));
    assertDateParsed('2 seconds ago',      getRelativeDate(0, 0, 0, 0, 0, -2));
    assertDateParsed('2 milliseconds ago', getRelativeDate(0, 0, 0, 0, 0, 0, -2));
    assertDateParsed('a second ago',       getRelativeDate(0, 0, 0, 0, 0, -1));

    assertDateParsed('2 years from now',        getRelativeDate(2));
    assertDateParsed('2 months from now',       getRelativeDate(0, 2));
    assertDateParsed('2 weeks from now',        getRelativeDate(0, 0, 14));
    assertDateParsed('2 days from now',         getRelativeDate(0, 0, 2));
    assertDateParsed('2 hours from now',        getRelativeDate(0, 0, 0, 2));
    assertDateParsed('2 minutes from now',      getRelativeDate(0, 0, 0, 0, 2));
    assertDateParsed('2 seconds from now',      getRelativeDate(0, 0, 0, 0, 0, 2));
    assertDateParsed('2 milliseconds from now', getRelativeDate(0, 0, 0, 0, 0, 0, 2));

    assertDateParsed('2 years later',        getRelativeDate(2));
    assertDateParsed('2 months later',       getRelativeDate(0, 2));
    assertDateParsed('2 weeks later',        getRelativeDate(0, 0, 14));
    assertDateParsed('2 days later',         getRelativeDate(0, 0, 2));
    assertDateParsed('2 hours later',        getRelativeDate(0, 0, 0, 2));
    assertDateParsed('2 minutes later',      getRelativeDate(0, 0, 0, 0, 2));
    assertDateParsed('2 seconds later',      getRelativeDate(0, 0, 0, 0, 0, 2));
    assertDateParsed('2 milliseconds later', getRelativeDate(0, 0, 0, 0, 0, 0, 2));

    // Article trouble
    assertDateParsed('an hour ago',      getRelativeDate(0, 0, 0, -1));
    assertDateParsed('an hour from now', getRelativeDate(0, 0, 0, 1));

    assertDateParsed('Monday',                testGetWeekday(1));
    assertDateParsed('The day after Monday',  testGetWeekday(2));
    assertDateParsed('The day before Monday', testGetWeekday(0));
    assertDateParsed('2 days after monday',   testGetWeekday(3));
    assertDateParsed('2 days before monday',  testGetWeekday(6, -1));
    assertDateParsed('2 weeks after monday',  testGetWeekday(1, 2));

    assertDateParsed('Next Monday',        testGetWeekday(1, 1));
    assertDateParsed('next week monday',   testGetWeekday(1, 1));
    assertDateParsed('Next friDay',        testGetWeekday(5, 1));
    assertDateParsed('next week thursday', testGetWeekday(4, 1));

    assertDateParsed('last Monday',        testGetWeekday(1, -1));
    assertDateParsed('last week monday',   testGetWeekday(1, -1));
    assertDateParsed('last friDay',        testGetWeekday(5, -1));
    assertDateParsed('last week thursday', testGetWeekday(4, -1));
    assertDateParsed('last Monday at 4pm', testGetWeekday(1, -1, 16));

    assertDateParsed('this Monday',        testGetWeekday(1));
    assertDateParsed('this week monday',   testGetWeekday(1));
    assertDateParsed('this friDay',        testGetWeekday(5));
    assertDateParsed('this week thursday', testGetWeekday(4));

    assertDateParsed('Monday of last week',   testGetWeekday(1, -1));
    assertDateParsed('saturday of next week', testGetWeekday(6, 1));
    assertDateParsed('Monday last week',      testGetWeekday(1, -1));
    assertDateParsed('saturday next week',    testGetWeekday(6, 1));

    assertDateParsed('Monday of this week',   testGetWeekday(1));
    assertDateParsed('saturday of this week', testGetWeekday(6));
    assertDateParsed('Monday this week',      testGetWeekday(1));
    assertDateParsed('saturday this week',    testGetWeekday(6));

    assertDateParsed('Tue of last week',  testGetWeekday(2, -1));

    assertDateParsed('Next week',  getRelativeDate(0, 0, 7));
    assertDateParsed('Last week',  getRelativeDate(0, 0, -7));
    assertDateParsed('Next month', getRelativeDate(0, 1));
    assertDateParsed('Next year',  getRelativeDate(1));
    assertDateParsed('this year',  getRelativeDate(0));

    assertDateParsed('beginning of the week',      testGetWeekday(0));
    assertDateParsed('beginning of this week',     testGetWeekday(0));
    assertDateParsed('beginning of next week',     testGetWeekday(0, 1));
    assertDateParsed('the beginning of next week', testGetWeekday(0, 1));
    assertDateParsed('end of this week',           testGetWeekday(6, 0, 23, 59, 59, 999));

    assertDateParsed('beginning of the week', 'en-GB', testGetBeginningOfWeek(1));
    assertDateParsed('end of this week', 'en-GB', testGetEndOfWeek(0));

    assertDateParsed('end of day Friday', testGetWeekday(5, 0, 23, 59, 59, 999));

    assertDateParsed('beginning of the month',  getRelativeDateReset(0, 0));
    assertDateParsed('beginning of this month', getRelativeDateReset(0, 0));
    assertDateParsed('beginning of next month', getRelativeDateReset(0, 1));

    assertDateParsed('the beginning of next month', getRelativeDateReset(0, 1));
    assertDateParsed('the end of next month', testGetEndOfRelativeMonth(1));
    assertDateParsed('the end of the month',  testGetEndOfRelativeMonth(0));

    assertDateParsed('the beginning of the year',  getRelativeDateReset(0));
    assertDateParsed('the beginning of this year', getRelativeDateReset(0));
    assertDateParsed('the beginning of next year', getRelativeDateReset(1));
    assertDateParsed('the beginning of last year', getRelativeDateReset(-1));

    assertDateParsed('the end of next year', testGetEndOfMonth(now.getFullYear() + 1, 11));
    assertDateParsed('the end of last year', testGetEndOfMonth(now.getFullYear() - 1, 11));

    assertDateParsed('the beginning of the day', getRelativeDateReset(0,0,0));

    assertDateParsed('end of March',           new Date(now.getFullYear(), 2, 31, 23, 59, 59, 999));
    assertDateParsed('beginning of March',     new Date(now.getFullYear(), 2));
    assertDateParsed('the first day of March', new Date(now.getFullYear(), 2));
    assertDateParsed('the last day of March',  new Date(now.getFullYear(), 2, 31));

    assertDateParsed('the last day of March 2010',  new Date(2010, 2, 31));
    assertDateParsed('the last day of March, 2012', new Date(2012, 2, 31));
    assertDateParsed('end of march, 2005',          new Date(2005,2,31,23,59,59,999));

    var year = now.getFullYear();
    var days = testGetDaysInMonth(year + 1, 1);
    assertDateParsed('the end of next February', new Date(year + 1, 1, days, 23, 59, 59, 999));

    assertDateParsed('beginning of 1998', new Date(1998, 0));
    assertDateParsed('end of 1998', new Date(1998, 11, 31, 23, 59, 59, 999));
    assertDateParsed('the first day of 1998', new Date(1998, 0));
    assertDateParsed('the last day of 1998', new Date(1998, 11, 31));

    assertDateParsed('The 15th of last month', new Date(now.getFullYear(), now.getMonth() - 1, 15));
    assertDateParsed('January 30th of last year', new Date(now.getFullYear() - 1, 0, 30));
    assertDateParsed('January of last year', new Date(now.getFullYear() - 1, 0));

    assertDateParsed('First day of may', new Date(now.getFullYear(), 4, 1));
    assertDateParsed('Last day of may', new Date(now.getFullYear(), 4, 31));
    assertDateParsed('Last day of next month', new Date(now.getFullYear(), now.getMonth() + 1, testGetDaysInMonth(now.getFullYear(), now.getMonth() + 1)));
    assertDateParsed('Last day of november', new Date(now.getFullYear(), 10, 30));

    assertDateParsed('the first day of next January', new Date(now.getFullYear() + 1, 0, 1));

    assertDateParsed('Next week', getRelativeDate(0, 0, 7));

    assertDateNotParsed('foo of next week');
    assertDateParsed('Thursday of next week', testGetWeekday(4, 1));
    assertDateParsed('Thursday of next week, 3:30pm', testGetWeekday(4, 1, 15, 30));

    assertDateParsed('the 1st Tuesday of June, 2012', new Date(2012, 5, 5));
    assertDateParsed('the 2nd Tuesday of June, 2012', new Date(2012, 5, 12));

    assertDateParsed('the 1st Tuesday of November, 2012', new Date(2012, 10, 6));
    assertDateParsed('the 2nd Tuesday of November, 2012', new Date(2012, 10, 13));
    assertDateParsed('the 3rd Tuesday of November, 2012', new Date(2012, 10, 20));
    assertDateParsed('the 4th Tuesday of November, 2012', new Date(2012, 10, 27));
    assertDateParsed('the 5th Tuesday of November, 2012', new Date(2012, 11, 4));
    assertDateParsed('the 6th Tuesday of November, 2012', new Date(2012, 11, 11));

    assertDateParsed('the 1st Friday of February, 2012', new Date(2012, 1, 3));
    assertDateParsed('the 2nd Friday of February, 2012', new Date(2012, 1, 10));
    assertDateParsed('the 3rd Friday of February, 2012', new Date(2012, 1, 17));
    assertDateParsed('the 4th Friday of February, 2012', new Date(2012, 1, 24));
    assertDateParsed('the 5th Friday of February, 2012', new Date(2012, 2, 2));
    assertDateParsed('the 6th Friday of February, 2012', new Date(2012, 2, 9));

    assertDateParsed('the 15th of last month', testDateSet(getRelativeDateReset(0,-1),{date:15}));
    assertDateParsed('the 15th of last month at 2:30pm', testDateSet(getRelativeDateReset(0,-1),{date:15,hour:14,minute:30}));

    var d = new Date(thisYear, 1);
    while(d.getDay() !== 5) {
      d.setDate(d.getDate() + 1);
    }

    assertDateParsed('the 1st Friday of February', testGetWeekdayInMonth(1, 5));

    var msg = '1st friday of February should be this year or next';
    equal(testCreateFutureDate('the 1st Friday of February').getFullYear(), now > d ? thisYear + 1 : thisYear, msg);

    var msg = '1st friday of February should be this year or last';
    equal(testCreatePastDate('the 1st Friday of February').getFullYear(), now < d ? thisYear - 1 : thisYear, msg);

    assertDateParsed('in 60 seconds', getRelativeDate(0, 0, 0, 0, 1));
    assertDateParsed('in 45 minutes', getRelativeDate(0, 0, 0, 0, 45));
    assertDateParsed('in 5 hours',    getRelativeDate(0, 0, 0, 5));
    assertDateParsed('in 5 days',     getRelativeDate(0, 0, 5));
    assertDateParsed('in 5 weeks',    getRelativeDate(0, 0, 35));
    assertDateParsed('in 5 months',   getRelativeDate(0, 5));
    assertDateParsed('in 5 years',    getRelativeDate(5));

    // Testing absolute date with future preference
    equal(testCreateFutureDate('1998-12-25'), new Date(1998, 11, 25), 'Future preference but in the past');
    equal(testCreateFutureDate({}), new Date(), 'Empty object future preference');
    equal(testCreateFutureDate(new Date(1998,11,30)), new Date(1998, 11, 30), 'Date object with future preference');

    // Leap seconds do not exist as a concept, so make sure that the
    // end of a leap second year/month is 23:59:59.999
    assertDateParsed('the end of 1998', new Date(1998,11,31,23,59,59,999));

    // Issue #203

    assertDateParsed('The day after tomorrow 3:45pm', 'en', new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 15, 45));
    assertDateParsed('The day before yesterday at 11:15am', 'en', new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 11, 15));

    var d = new Date();
    d.setDate(28);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    assertDateParsed('the 28th', d);
    assertDateParsed('28th', d);

    var d = new Date();
    d.setDate(28);
    d.setHours(17);
    d.setMinutes(30);
    d.setSeconds(0);
    d.setMilliseconds(0);

    assertDateParsed('the 28th at 5:30pm', d);

    var d = new Date();
    d.setMonth(0);
    d.setDate(28);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    assertDateParsed('the 28th of January', d);
    assertDateParsed('28th of January', d);

    // Issue #310

    assertDateParsed('5:00am in a month', testDateSet(getRelativeDateReset(0,1,0),  {hour:5}));
    assertDateParsed('5am in a month',    testDateSet(getRelativeDateReset(0,1,0),  {hour:5}));
    assertDateParsed('21:00 in 2 weeks',  testDateSet(getRelativeDateReset(0,0,14), {hour:21}));
    assertDateParsed('6:30pm in 1 day',   testDateSet(getRelativeDateReset(0,0,1),  {hour:18,minute:30}));
    assertDateParsed('6:30pm in 3 days',  testDateSet(getRelativeDateReset(0,0,3),  {hour:18,minute:30}));
    assertDateParsed('6:30pm 2 days ago', testDateSet(getRelativeDateReset(0,0,-2), {hour:18,minute:30}));
    assertDateParsed('5:01am in a month', testDateSet(getRelativeDateReset(0,1,0),  {hour:5,minute:1}));

    assertDateNotParsed('6:30pm in -3 days');
    assertDateNotParsed('5:30am in an hour');
    assertDateNotParsed('5am in a minute');

    // Issue #375 "end of yesterday"

    assertDateParsed('beginning of yesterday', run(testCreateDate('yesterday'), 'beginningOfDay'));
    assertDateParsed('end of yesterday',       run(testCreateDate('yesterday'), 'endOfDay'));
    assertDateParsed('beginning of today',     run(testCreateDate('today'), 'beginningOfDay'));
    assertDateParsed('end of today',           run(testCreateDate('today'), 'endOfDay'));
    assertDateParsed('beginning of tomorrow',  run(testCreateDate('tomorrow'), 'beginningOfDay'));
    assertDateParsed('end of tomorrow',        run(testCreateDate('tomorrow'), 'endOfDay'));

    // Issue #431 "ten minutes ago"
    assertDateParsed('ten minutes ago', getRelativeDate(0, 0, 0, 0, -10));
    assertDateParsed('ten minutes from now', getRelativeDate(0, 0, 0, 0, 10));

    // Issue #509 "a/p" for "am/pm"
    assertDateParsed('yesterday at 3p',    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 15));
    assertDateParsed('yesterday at 3a',    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 3));
    assertDateParsed('yesterday at 3:00p', new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 15));
    assertDateParsed('yesterday at 3:00a', new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 3));

    // Issue #455 "a.m./p.m."
    assertDateParsed('3a.m.',  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3));
    assertDateParsed('3p.m.',  new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15));
    assertDateParsed('3 a.m.', new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3));
    assertDateParsed('3 p.m.', new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15));

    // Issue #453 "tomorrow at noon"
    assertDateParsed('noon',             new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12));
    assertDateParsed('tomorrow at noon', new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12));

    assertDateParsed('Monday at noon',            testGetWeekday(1, 0, 12));
    assertDateParsed('next Saturday at noon',     testGetWeekday(6, 1, 12));
    assertDateParsed('last Tuesday at noon',      testGetWeekday(2, -1, 12));
    assertDateParsed('Monday at midnight',        testGetWeekday(2, 0));
    assertDateParsed('next Saturday at midnight', testGetWeekday(7, 1));
    assertDateParsed('last Tuesday at midnight',  testGetWeekday(3, -1));

    assertDateParsed('midnight', getRelativeDateReset(0, 0, 1));
    assertDateParsed('midnight tonight', getRelativeDateReset(0, 0, 1));
    assertDateParsed('tomorrow at midnight', getRelativeDateReset(0, 0, 2));

    assertDateParsed('midnight Tuesday', testGetWeekday(3, 0));
    assertDateParsed('midnight on Tuesday', testGetWeekday(3, 0));

    // Issue #455
    assertDateParsed('a week from Tuesday', testGetWeekday(2, 1));
    assertDateParsed('week from Tuesday', testGetWeekday(2, 1));
    assertDateParsed('first of the month', new Date(now.getFullYear(), now.getMonth()));

    assertDateParsed('the first Friday of February, 2012',  new Date(2012, 1, 3));
    assertDateParsed('the second Friday of February, 2012', new Date(2012, 1, 10));
    assertDateParsed('the third Friday of February, 2012',  new Date(2012, 1, 17));
    assertDateParsed('the fourth Friday of February, 2012', new Date(2012, 1, 24));
    assertDateParsed('the fifth Friday of February, 2012',  new Date(2012, 2, 2));
    assertDateParsed('the sixth Friday of February, 2012',  new Date(2012, 2, 9));

    assertDateParsed('the 3rd Tuesday in November, 2012', new Date(2012, 10, 20));

    assertDateParsed('the second Sunday in June, 2016',    new Date(2016, 5, 12));
    assertDateParsed('the second Monday in June, 2016',    new Date(2016, 5, 13));
    assertDateParsed('the second Tuesday in June, 2016',   new Date(2016, 5, 14));
    assertDateParsed('the second Wednesday in June, 2016', new Date(2016, 5, 8));
    assertDateParsed('the second Thursday in June, 2016',  new Date(2016, 5, 9));
    assertDateParsed('the second Friday in June, 2016',    new Date(2016, 5, 10));
    assertDateParsed('the second Saturday in June, 2016',  new Date(2016, 5, 11));

    assertDateParsed('the last Sunday in November, 2012',    new Date(2012, 10, 25));
    assertDateParsed('the last Monday in November, 2012',    new Date(2012, 10, 26));
    assertDateParsed('the last Tuesday in November, 2012',   new Date(2012, 10, 27));
    assertDateParsed('the last Wednesday in November, 2012', new Date(2012, 10, 28));
    assertDateParsed('the last Thursday in November, 2012',  new Date(2012, 10, 29));
    assertDateParsed('the last Friday in November, 2012',    new Date(2012, 10, 30));
    assertDateParsed('the last Saturday in November, 2012',  new Date(2012, 10, 24));

    assertDateParsed('next weekend', testGetWeekday(6, 1));
    assertDateParsed('the second weekend of August, 2011', new Date(2011, 7, 13));
    assertDateParsed('the last weekend of January, 1985', new Date(1985, 0, 26));

    // Issue #455 Allowing "half" for hours years, and days

    assertDateParsed('half hour ago', getRelativeDate(0, 0, 0, 0, -30));
    assertDateParsed('half an hour ago', getRelativeDate(0, 0, 0, 0, -30));
    assertDateParsed('a half hour ago', getRelativeDate(0, 0, 0, 0, -30));

    assertDateParsed('half hour from now', getRelativeDate(0, 0, 0, 0, 30));
    assertDateParsed('half an hour from now', getRelativeDate(0, 0, 0, 0, 30));
    assertDateParsed('a half hour from now', getRelativeDate(0, 0, 0, 0, 30));

    assertDateParsed('in half an hour', getRelativeDate(0, 0, 0, 0, 30));
    assertDateParsed('in a half hour', getRelativeDate(0, 0, 0, 0, 30));

    assertDateParsed('half year ago', getRelativeDate(0, -6));
    assertDateParsed('half a year ago', getRelativeDate(0, -6));

    assertDateParsed('half a day ago', getRelativeDate(0, 0, 0, -12));

    assertDateNotParsed('half a week ago');
    assertDateNotParsed('half a month ago');

  });

  group('Create | Numerals', function() {

    assertDateParsed('the first of January',   new Date(now.getFullYear(), 0, 1));
    assertDateParsed('the second of January',  new Date(now.getFullYear(), 0, 2));
    assertDateParsed('the third of January',   new Date(now.getFullYear(), 0, 3));
    assertDateParsed('the fourth of January',  new Date(now.getFullYear(), 0, 4));
    assertDateParsed('the fifth of January',   new Date(now.getFullYear(), 0, 5));
    assertDateParsed('the sixth of January',   new Date(now.getFullYear(), 0, 6));
    assertDateParsed('the seventh of January', new Date(now.getFullYear(), 0, 7));
    assertDateParsed('the eighth of January',  new Date(now.getFullYear(), 0, 8));
    assertDateParsed('the ninth of January',   new Date(now.getFullYear(), 0, 9));
    assertDateParsed('the tenth of January',   new Date(now.getFullYear(), 0, 10));

    assertDateParsed('the fifth of January',   new Date(now.getFullYear(), 0,  5));
    assertDateParsed('the fifth of February',  new Date(now.getFullYear(), 1,  5));
    assertDateParsed('the fifth of March',     new Date(now.getFullYear(), 2,  5));
    assertDateParsed('the fifth of April',     new Date(now.getFullYear(), 3,  5));
    assertDateParsed('the fifth of May',       new Date(now.getFullYear(), 4,  5));
    assertDateParsed('the fifth of June',      new Date(now.getFullYear(), 5,  5));
    assertDateParsed('the fifth of July',      new Date(now.getFullYear(), 6,  5));
    assertDateParsed('the fifth of August',    new Date(now.getFullYear(), 7,  5));
    assertDateParsed('the fifth of September', new Date(now.getFullYear(), 8,  5));
    assertDateParsed('the fifth of October',   new Date(now.getFullYear(), 9,  5));
    assertDateParsed('the fifth of November',  new Date(now.getFullYear(), 10, 5));
    assertDateParsed('the fifth of December',  new Date(now.getFullYear(), 11, 5));

    assertDateParsed('one day ago',    getRelativeDate(0, 0,-1));
    assertDateParsed('two days ago',   getRelativeDate(0, 0,-2));
    assertDateParsed('three days ago', getRelativeDate(0, 0,-3));
    assertDateParsed('four days ago',  getRelativeDate(0, 0,-4));
    assertDateParsed('five days ago',  getRelativeDate(0, 0,-5));
    assertDateParsed('six days ago',   getRelativeDate(0, 0,-6));
    assertDateParsed('seven days ago', getRelativeDate(0, 0,-7));
    assertDateParsed('eight days ago', getRelativeDate(0, 0,-8));
    assertDateParsed('nine days ago',  getRelativeDate(0, 0,-9));
    assertDateParsed('ten days ago',   getRelativeDate(0, 0,-10));

    assertDateParsed('one day from now',    getRelativeDate(0, 0, 1));
    assertDateParsed('two days from now',   getRelativeDate(0, 0, 2));
    assertDateParsed('three days from now', getRelativeDate(0, 0, 3));
    assertDateParsed('four days from now',  getRelativeDate(0, 0, 4));
    assertDateParsed('five days from now',  getRelativeDate(0, 0, 5));
    assertDateParsed('six days from now',   getRelativeDate(0, 0, 6));
    assertDateParsed('seven days from now', getRelativeDate(0, 0, 7));
    assertDateParsed('eight days from now', getRelativeDate(0, 0, 8));
    assertDateParsed('nine days from now',  getRelativeDate(0, 0, 9));
    assertDateParsed('ten days from now',   getRelativeDate(0, 0, 10));

  });

  group('Create | UTC', function() {

    equal(testCreateUTCDate('February 29, 2012 22:15:42'), new Date(Date.UTC(2012, 1, 29, 22, 15, 42)), 'full text');
    equal(testCreateUTCDate('2012-05-31'), new Date(Date.UTC(2012, 4, 31)), 'dashed');
    equal(testCreateUTCDate('1998-02-23 11:54:32'), new Date(Date.UTC(1998,1,23,11,54,32)), 'dashed with time');
    equal(testCreateUTCDate({ year: 1998, month: 1, day: 23, hour: 11 }), new Date(Date.UTC(1998,1,23,11)), 'params');
    equal(testCreateUTCDate('08-25-1978 11:42:32.488am'), new Date(Date.UTC(1978, 7, 25, 11, 42, 32, 488)), 'full with ms');
    equal(testCreateUTCDate('1994-11-05T13:15:30Z'), new Date(Date.UTC(1994, 10, 5, 13, 15, 30)), '"Z" is still utc');

    var d = testCreateUTCDate('two days ago');
    var expected = getRelativeDate(0, 0, -2, 0);
    var tzOffset = (expected.getTimezoneOffset() - new Date().getTimezoneOffset()) * 60 * 1000;
    expected.setTime(expected.getTime() - tzOffset);
    equal(d, expected, 'relative dates are not UTC');

    // New handling of UTC dates

    var date1 = testCreateUTCDate('2001-06-15');
    var date2 = new Date(2001, 5, 15);
    date2.setTime(date2.getTime() - (date2.getTimezoneOffset() * 60 * 1000));

    equal(date1, date2, 'is equal to date with timezone subtracted');
    equal(testIsUTC(date1), false, 'does not set internal flag');

    var d = run(new Date(2001, 5, 15), 'setUTC', [true]);

    equal(testIsUTC(d), true, 'sets internal flag');
    equal(d, new Date(2001, 5, 15), 'does not change date');
    equal(dateRun(d, 'beginningOfMonth'), new Date(Date.UTC(2001, 5, 1)), 'the beginning of the month');
    equal(dateRun(d, 'endOfMonth'), new Date(Date.UTC(2001, 5, 30, 23, 59, 59, 999)), 'the end of the month');
    equal(run(d, 'minutesSince', [testCreateUTCDate('2001-06-15')]), d.getTimezoneOffset(), 'minutesSince is equal to the timezone offset');

    // In this example the date is flagged as UTC but was not parsed that way.
    // In JST timezone this would be 2001-06-15 09:00:00. However since the UTC
    // flag will be presumed (unless specifically overridden) when a context date
    // is flagged as UTC, the test date will be UTC (2001-06-15 00:00:00), so the
    // hours offset should be equal to 24 minus whatever timezone offset we're in.
    var d = run(new Date(2001, 5, 15), 'setUTC', [true]);
    equal(run(d, 'hoursSince', ['2001-6-14']), 24 + (d.getTimezoneOffset() / 60), 'hoursSince | preserves UTC flag');

    // This effect can be overridden using the fromUTC flag.
    var d = run(new Date(2001, 5, 15), 'setUTC', [true]);
    equal(run(d, 'hoursSince', ['2001-6-14', { fromUTC: false }]), 24, 'hoursSince | does not preserve UTC flag if fromUTC is set');

    // Passing just an options object without a date will still parse
    var d = run(new Date(2001, 5, 15), 'setUTC', [true]);
    equal(run(d, 'hoursSince', [{ fromUTC: false }]), 0, 'hoursSince | needs more than just an options object');

    var d = run(testCreateDate('1 month ago'), 'setUTC', [true])
    equal(run(d, 'isLastMonth'), true, 'isLastMonth');

    var d = run(testCreateUTCDate('2001-06-15'), 'setUTC', [true]);

    equal(run(d, 'format', ['{ZZ}']), '+0000', 'format UTC date will have +0000 offset');
    equal(run(d, 'getUTCOffset'), '+0000', 'getUTCOffset');
    equal(dateRun(d, 'advance', ['1 month']), new Date(Date.UTC(2001, 6, 15)), 'advancing');

    equal(run(run(testCreateUTCDate('2010-02-01'), 'setUTC', [true]), 'daysInMonth'), 28, 'should find correct days in month');
    equal(run(run(testCreateUTCDate('2000-01'), 'setUTC', [true]), 'isLeapYear'), true, 'isLeapYear accounts for utc dates');

    var d = run(testCreateUTCDate('2000-02-18 11:00pm'), 'setUTC', [true]);

    equal(run(d, 'is', ['Friday']), true, 'is friday');
    equal(run(d, 'isWeekday', []), true, 'friday isWeekday');
    equal(run(d, 'is', ['2000-02-18']), true, 'friday full date');
    equal(run(d, 'isAfter', [testCreateUTCDate('2000-02-18 10:00pm')]), true, 'isAfter');
    equal(dateRun(d, 'reset'), new Date(Date.UTC(2000, 1, 18)), 'resetting');

    var d = run(testCreateUTCDate('2000-02-14'), 'setUTC', [true]);

    equal(run(d, 'format'), 'February 14, 2000 12:00 AM', 'formatting monday');
    equal(run(d, 'short'), '02/14/2000', 'short format');
    equal(run(d, 'medium'), 'February 14, 2000', 'medium format');
    equal(run(d, 'long'), 'February 14, 2000 12:00 AM', 'long format');
    equal(run(d, 'full'), 'Monday, February 14, 2000 12:00 AM', 'full format');

    // UTC flag is now deprecated in comparison methods so instead we
    // need to run through Date#create.
    equal(run(d, 'is', ['Monday']), true, 'is monday');
    equal(run(d, 'isWeekday', []), true, 'monday is a weekday');
    equal(run(d, 'is', ['2000-02-14']), true, 'monday full date');

    equal(run(testCreateUTCDate('1 minute ago'), 'relative'), '1 minute ago', 'relative dates are unaffected');

    var d = run(run(new Date(2001, 5, 15), 'setUTC', [true]), 'setUTC', [false]);
    equal(testIsUTC(d), false, 'utc flag can be set off');

    // Issue #235

    equal(run(run(run(testCreateDate(), 'setUTC', [true]), 'clone'), 'isUTC'), true, 'clone should preserve UTC');
    equal(testIsUTC(run(new Date(), 'clone')), false, 'clone should never be UTC if flag not set');
    equal(run(testCreateDate(run(new Date(), 'setUTC', [true])), 'isUTC'), true, 'create should preserve UTC');

    var isCurrentlyGMT = new Date().getTimezoneOffset() === 0;
    equal(run(testCreateDate(new Date()), 'isUTC'), isCurrentlyGMT, 'non utc date should not have UTC flag');

    // Issue #244

    equal(testCreateUTCDate('0999'), new Date(Date.UTC(999, 0)), '3 digit year 999 should be equal to ISO-8601');
    equal(testCreateUTCDate('0123'), new Date(Date.UTC(123, 0)), '3 digit year 123 should be equal to ISO-8601');

    var d = run(testCreateUTCDate({ year: 2013, month: 0, date: 14 }), 'setUTC', [true]);
    run(d, 'set', [{week:1}]);
    equal(d, new Date(Date.UTC(2012, 11, 31)), 'utc dates should not throw errors on week set');

  });

  group('Create | Other', function() {

    // Issue #98: System time set to January 31st
    assertDateParsed('2011-09-01T05:00:00Z', getUTCDate(2011, 8, 1, 5));

    // Issue #152 times should be allowed in front
    assertDateParsed('3:45 2012-3-15', new Date(2012, 2, 15, 3, 45));
    assertDateParsed('3:45pm 2012-3-15', new Date(2012, 2, 15, 15, 45));
    assertDateParsed('3:45pm 3/15/2012', new Date(2012, 2, 15, 15, 45));
    assertDateParsed('3:45pm 3/4/2012', 'en-GB', new Date(2012, 3, 3, 15, 45));


    // Issue #144 various time/date formats
    var d = testGetWeekday(4);
    d.setHours(15);
    assertDateParsed('6/30/2012 3:00 PM', new Date(2012, 5, 30, 15));
    assertDateParsed('Thursday at 3:00 PM', d);
    assertDateParsed('Thursday at 3:00PM', d);


    // Date.create should not clone a date by default
    var date1 = new Date(5000);
    var date2 = testCreateDate(date1);
    date1.setTime(10000);
    equal(date1.getTime(), date2.getTime(), 'created date should be affected');

    // Date.create should allow a clone flag
    var date1 = new Date(5000);
    var date2 = testCreateDate(date1, { clone: true });
    date1.setTime(10000);
    notEqual(date1.getTime(), date2.getTime(), 'created date should not be affected');


    // Simple 12:00am

    equal(testCreateDate('12:00am').getHours(), 0, '12:00am hours should be 0');
    equal(testCreateDate('12am').getHours(), 0, '12am hours should be 0');

    // Issue #227

    assertDateParsed('0 January', new Date(now.getFullYear() - 1, 11, 31));
    assertDateParsed('1 January', new Date(now.getFullYear(), 0, 1));
    assertDateParsed('01 January', new Date(now.getFullYear(), 0, 1));
    assertDateParsed('15 January', new Date(now.getFullYear(), 0, 15));
    assertDateParsed('31 January', new Date(now.getFullYear(), 0, 31));

    assertDateParsed('1 Jan', new Date(now.getFullYear(), 0, 1));
    assertDateParsed('01 Jan', new Date(now.getFullYear(), 0, 1));
    assertDateParsed('15 Jan', new Date(now.getFullYear(), 0, 15));
    assertDateParsed('31 Jan', new Date(now.getFullYear(), 0, 31));

    assertDateParsed('0 July', new Date(now.getFullYear(), 5, 30));
    assertDateParsed('1 July', new Date(now.getFullYear(), 6, 1));
    assertDateParsed('01 July', new Date(now.getFullYear(), 6, 1));
    assertDateParsed('15 July', new Date(now.getFullYear(), 6, 15));
    assertDateParsed('31 July', new Date(now.getFullYear(), 6, 31));
    assertDateParsed('32 July', new Date(now.getFullYear(), 7, 1));

    assertDateParsed('1 Dec', new Date(now.getFullYear(), 11, 1));
    assertDateParsed('01 Dec', new Date(now.getFullYear(), 11, 1));
    assertDateParsed('15 Dec', new Date(now.getFullYear(), 11, 15));
    assertDateParsed('31 Dec', new Date(now.getFullYear(), 11, 31));

    assertDateParsed('1 December', new Date(now.getFullYear(), 11, 1));
    assertDateParsed('01 December', new Date(now.getFullYear(), 11, 1));
    assertDateParsed('15 December', new Date(now.getFullYear(), 11, 15));
    assertDateParsed('31 December', new Date(now.getFullYear(), 11, 31));
    assertDateParsed('32 December', new Date(now.getFullYear() + 1, 0, 1));

    assertDateParsed('1 January 3pm', new Date(now.getFullYear(), 0, 1, 15));
    assertDateParsed('1 January 3:45pm', new Date(now.getFullYear(), 0, 1, 15, 45));

    assertDateParsed("'87", new Date(1987, 0));
    assertDateParsed("May '87", new Date(1987, 4));
    assertDateParsed("14 May '87", new Date(1987, 4, 14));

    // Issue #224
    equal(run(testCreateDate(''), 'isValid'), false, 'empty strings are not valid');

    // Issue #387 null in date constructor
    equal(new Date(null), testCreateDate(null), 'null');

  });

  group('Create | Future Dates', function() {

    // Ensure that dates don't traverse TOO far into the past/future
    equal(run(testCreateFutureDate('January'), 'monthsFromNow') > 12, false, 'no more than 12 months from now');
    equal(run(testCreateFutureDate('December'), 'monthsFromNow') > 12, false, 'no more than 12 months from now');

    // Issue #210

    equal(testCreateFutureDate('Sunday at 3:00').getDay(), 0, 'Date.future | weekday should never be ambiguous');

  });

  group('Create | 2-digit years', function() {

    // Issue #383 Date.past in 2-digit years
    equal(testCreatePastDate('12/20/30'), new Date(1930,11,20), 'Date.past | 1923-12-20');
    equal(testCreateFutureDate('12/20/98'), new Date(2098,11,20), 'Date.future | 2098-12-20');

  });

  group('Create | Invalid Dates', function() {

    testCreateFakeLocale('fo');

    equal(run(testCreateDate('my pants'), 'isPast'), undefined, 'isPast | invalid dates should return false');
    equal(run(testCreateDate('my pants'), 'isFuture'), undefined, 'isFuture | invalid dates should return false');
    equal(run(testCreateDate('my pants'), 'isToday'), undefined, 'isToday | invalid dates should return false');
    equal(run(testCreateDate('my pants'), 'isTomorrow'), undefined, 'isTomorrow | invalid dates should return false');
    equal(run(testCreateDate('my pants'), 'is', ['today']), undefined, 'is | invalid dates should return false');

    // Issue #264

    testSetLocale('fo');
    equal(run(testCreateDate(), 'isToday'), true, 'isToday should always work regardless of locale');
    equal(run(testCreateDate('yesterday', 'en'), 'isYesterday'), true, 'isYesterday should always work regardless of locale');
    equal(run(testCreateDate('tomorrow', 'en'), 'isTomorrow'), true, 'isTomorrow should always work regardless of locale');
    equal(run(testCreateDate('monday', 'en'), 'isMonday'), true, 'isMonday should always work regardless of locale');
    equal(run(testCreateDate('tuesday', 'en'), 'isTuesday'), true, 'isTuesday should always work regardless of locale');
    equal(run(testCreateDate('wednesday', 'en'), 'isWednesday'), true, 'isWednesday should always work regardless of locale');
    equal(run(testCreateDate('thursday', 'en'), 'isThursday'), true, 'isThursday should always work regardless of locale');
    equal(run(testCreateDate('friday', 'en'), 'isFriday'), true, 'isFriday should always work regardless of locale');
    equal(run(testCreateDate('saturday', 'en'), 'isSaturday'), true, 'isSaturday should always work regardless of locale');
    equal(run(testCreateDate('sunday', 'en'), 'isSunday'), true, 'isSunday should always work regardless of locale');
    equal(run(testCreateDate('1 day ago', 'en'), 'isPast'), true, 'isPast should always work regardless of locale');
    equal(run(testCreateDate('1 day from now', 'en'), 'isFuture'), true, 'isFuture should always work regardless of locale');
    testSetLocale('en');

  });


  method('isPast', function() {

    // Issue #141 future/past preference

    test(testCreatePastDate('Sunday'),    true, 'weekdays | Sunday');
    test(testCreatePastDate('Monday'),    true, 'weekdays | Monday');
    test(testCreatePastDate('Tuesday'),   true, 'weekdays | Tuesday');
    test(testCreatePastDate('Wednesday'), true, 'weekdays | Wednesday');
    test(testCreatePastDate('Thursday'),  true, 'weekdays | Thursday');
    test(testCreatePastDate('Friday'),    true, 'weekdays | Friday');
    test(testCreatePastDate('Saturday'),  true, 'weekdays | Saturday');

    test(testCreatePastDate('January'),   true, 'months | January');
    test(testCreatePastDate('February'),  true, 'months | February');
    test(testCreatePastDate('March'),     true, 'months | March');
    test(testCreatePastDate('April'),     true, 'months | April');
    test(testCreatePastDate('May'),       true, 'months | May');
    test(testCreatePastDate('June'),      true, 'months | June');
    test(testCreatePastDate('July'),      true, 'months | July');
    test(testCreatePastDate('August'),    true, 'months | August');
    test(testCreatePastDate('September'), true, 'months | September');
    test(testCreatePastDate('October'),   true, 'months | October');
    test(testCreatePastDate('November'),  true, 'months | November');
    test(testCreatePastDate('December'),  true, 'months | December');

  });

  method('isFuture', function() {

    test(testCreateFutureDate('Sunday'),    true, 'weekdays | Sunday');
    test(testCreateFutureDate('Monday'),    true, 'weekdays | Monday');
    test(testCreateFutureDate('Tuesday'),   true, 'weekdays | Tuesday');
    test(testCreateFutureDate('Wednesday'), true, 'weekdays | Wednesday');
    test(testCreateFutureDate('Thursday'),  true, 'weekdays | Thursday');
    test(testCreateFutureDate('Friday'),    true, 'weekdays | Friday');
    test(testCreateFutureDate('Saturday'),  true, 'weekdays | Saturday');

    test(testCreateFutureDate('January'),   true, 'months | January');
    test(testCreateFutureDate('February'),  true, 'months | February');
    test(testCreateFutureDate('March'),     true, 'months | March');
    test(testCreateFutureDate('April'),     true, 'months | April');
    test(testCreateFutureDate('May'),       true, 'months | May');
    test(testCreateFutureDate('June'),      true, 'months | June');
    test(testCreateFutureDate('July'),      true, 'months | July');
    test(testCreateFutureDate('August'),    true, 'months | August');
    test(testCreateFutureDate('September'), true, 'months | September');
    test(testCreateFutureDate('October'),   true, 'months | October');
    test(testCreateFutureDate('November'),  true, 'months | November');
    test(testCreateFutureDate('December'),  true, 'months | December');


    test(testCreateFutureDate('1:00am'), true, '1am should be the future');
    test(testCreateFutureDate('11:00pm'), true, '11pm should be the future');

    equal(testCreateFutureDate('1:00am') < testCreateDate('1 day from now'), true, '1am should be the future');
    equal(testCreateFutureDate('11:00pm') < testCreateDate('1 day from now'), true, '11pm should be the future');

  });

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

  });

  method('set', function() {

    // Just the time
    var d;

    d = new Date('August 25, 2010 11:45:20');
    run(d, 'set', [2008, 5, 18, 4, 25, 30, 400]);

    equal(d.getFullYear(), 2008, 'year');
    equal(d.getMonth(), 5, 'month');
    equal(d.getDate(), 18, 'date');
    equal(d.getHours(), 4, 'hours');
    equal(d.getMinutes(), 25, 'minutes');
    equal(d.getSeconds(), 30, 'seconds');
    equal(d.getMilliseconds(), 400, 'milliseconds');

    d = new Date('August 25, 2010 11:45:20');
    run(d, 'set', [{ year: 2008, month: 5, date: 18, hour: 4, minute: 25, second: 30, millisecond: 400 }]);

    equal(d.getFullYear(), 2008, 'object | year');
    equal(d.getMonth(), 5, 'object | month');
    equal(d.getDate(), 18, 'object | date');
    equal(d.getHours(), 4, 'object | hours');
    equal(d.getMinutes(), 25, 'object | minutes');
    equal(d.getSeconds(), 30, 'object | seconds');
    equal(d.getMilliseconds(), 400, 'object | milliseconds');

    d = new Date('August 25, 2010 11:45:20');
    run(d, 'set', [{ years: 2008, months: 5, date: 18, hours: 4, minutes: 25, seconds: 30, milliseconds: 400 }]);

    equal(d.getFullYear(), 2008, 'object plural | year');
    equal(d.getMonth(), 5, 'object plural | month');
    equal(d.getDate(), 18, 'object plural | date');
    equal(d.getHours(), 4, 'object plural | hours');
    equal(d.getMinutes(), 25, 'object plural | minutes');
    equal(d.getSeconds(), 30, 'object plural | seconds');
    equal(d.getMilliseconds(), 400, 'object plural | milliseconds');

    run(d, 'set', [{ weekday: 2 }]);
    equal(d.getDate(), 17, 'object | weekday 2');
    run(d, 'set', [{ weekday: 5 }]);
    equal(d.getDate(), 20, 'object | weekday 5');


    run(d, 'set', [{ weekday: 2 }, true]);
    equal(d.getDate(), 17, 'object | reset time | weekday 2');
    run(d, 'set', [{ weekday: 5 }, true]);
    equal(d.getDate(), 20, 'object | reset time | weekday 5');


    d = new Date('August 25, 2010 11:45:20');
    run(d, 'set', [{ years: 2005, hours: 2 }]);

    equal(d.getFullYear(), 2005, 'no reset | year');
    equal(d.getMonth(), 7, 'no reset | month');
    equal(d.getDate(), 25, 'no reset | date');
    equal(d.getHours(), 2, 'no reset | hours');
    equal(d.getMinutes(), 45, 'no reset | minutes');
    equal(d.getSeconds(), 20, 'no reset | seconds');
    equal(d.getMilliseconds(), 0, 'no reset | milliseconds');

    d = new Date('August 25, 2010 11:45:20');
    run(d, 'set', [{ years: 2008, hours: 4 }, true]);

    equal(d.getFullYear(), 2008, 'reset | year');
    equal(d.getMonth(), 7, 'reset | month');
    equal(d.getDate(), 25, 'reset | date');
    equal(d.getHours(), 4, 'reset | hours');
    equal(d.getMinutes(), 0, 'reset | minutes');
    equal(d.getSeconds(), 0, 'reset | seconds');
    equal(d.getMilliseconds(), 0, 'reset | milliseconds');


    d = run(new Date('August 25, 2010 11:45:20'), 'setUTC', [true]);
    run(d, 'set', [{ years: 2008, hours: 4 }, true]);

    equal(d.getFullYear(), 2008, 'utc | reset utc | year');
    equal(d.getMonth(), 7, 'utc | reset utc | month');
    equal(d.getDate(), d.getTimezoneOffset() > 240 ? 24 : 25, 'utc | reset utc | date');
    equal(d.getHours(), testGetHours(4 - (d.getTimezoneOffset() / 60)), 'utc | reset utc | hours');
    equal(d.getMinutes(), Math.abs(d.getTimezoneOffset() % 60), 'utc | reset utc | minutes');
    equal(d.getSeconds(), 0, 'utc | reset utc | seconds');
    equal(d.getMilliseconds(), 0, 'utc | reset utc | milliseconds');


    d = run(new Date('August 25, 2010 11:45:20'), 'setUTC', [true]);
    run(d, 'set', [{ years: 2005, hours: 2 }, false]);

    equal(d.getFullYear(), 2005, 'utc | no reset utc | year');
    equal(d.getMonth(), 7, 'utc | no reset utc | month');
    equal(d.getDate(), d.getTimezoneOffset() >= 135 ? 24 : 25, 'utc | no reset utc | date');
    equal(d.getHours(), testGetHours(2 - (d.getTimezoneOffset() / 60)), 'utc | no reset utc | hours');
    equal(d.getMinutes(), 45, 'utc | no reset utc | minutes');
    equal(d.getSeconds(), 20, 'utc | no reset utc | seconds');
    equal(d.getMilliseconds(), 0, 'utc | no reset utc | milliseconds');


    d = run(new Date('August 25, 2010 11:45:20'), 'setUTC', [true]);
    run(d, 'set', [{ years: 2005, hours: 2 }, false]);

    equal(d.getFullYear(), 2005, 'utc | no reset | year');
    equal(d.getMonth(), 7, 'utc | no reset | month');
    equal(d.getDate(), d.getTimezoneOffset() >= 135 ? 24 : 25, 'utc | no reset | date');
    equal(d.getHours(), testGetHours(2 - (d.getTimezoneOffset() / 60)), 'utc | no reset | hours');
    equal(d.getMinutes(), 45, 'utc | no reset | minutes');
    equal(d.getSeconds(), 20, 'utc | no reset | seconds');
    equal(d.getMilliseconds(), 0, 'utc | no reset | milliseconds');

    d = new Date('August 5, 2010 13:45:02');
    d.setMilliseconds(234);
    run(d, 'set', [{ month: 3 }]);

    equal(d.getFullYear(), 2010, 'does not reset year');
    equal(d.getMonth(), 3, 'does reset month');
    equal(d.getDate(), 5, 'does not reset date');
    equal(d.getHours(), 13, 'does not reset hours');
    equal(d.getMinutes(), 45, 'does not reset minutes');
    equal(d.getSeconds(), 2, 'does not reset seconds');
    equal(d.getMilliseconds(), 234, 'does not reset milliseconds');

    d = new Date('August 5, 2010 13:45:02');
    run(d, 'set', [{ month: 3 }, true]);

    equal(d.getFullYear(), 2010, 'does not reset year');
    equal(d.getMonth(), 3, 'does reset month');
    equal(d.getDate(), 1, 'does reset date');
    equal(d.getHours(), 0, 'does reset hours');
    equal(d.getMinutes(), 0, 'does reset minutes');
    equal(d.getSeconds(), 0, 'does reset seconds');
    equal(d.getMilliseconds(), 0, 'does reset milliseconds');

    equal(run(new Date, 'set', [0]), new Date(0), 'handles timestamps');

    var obj = { year: 1998 };
    var d = new Date();
    run(d, 'set', [obj]);

    equal(obj.year, 1998, 'Year should still be 1998');
    equal(Object.keys(obj).length, 1, 'No other properties should be set');
  });

  group('Get/Set Weekday', function() {
    var d;

    d = new Date('August 25, 2010 11:45:20');

    equal(run(d, 'getWeekday'), 3, 'get | wednesday');

    run(d, 'setWeekday', [0]);
    equal(d.getDate(), 22, 'set | sunday');
    run(d, 'setWeekday', [1]);
    equal(d.getDate(), 23, 'set | monday');
    run(d, 'setWeekday', [2]);
    equal(d.getDate(), 24, 'set | tuesday');
    run(d, 'setWeekday', [3]);
    equal(d.getDate(), 25, 'set | wednesday');
    run(d, 'setWeekday', [4]);
    equal(d.getDate(), 26, 'set | thursday');
    run(d, 'setWeekday', [5]);
    equal(d.getDate(), 27, 'set | friday');
    run(d, 'setWeekday', [6]);
    equal(d.getDate(), 28, 'set | saturday');

    equal(run(d, 'setWeekday', [6]), d.getTime(), 'set | should return the timestamp');

    d = run(new Date('August 25, 2010 11:45:20'), 'setUTC', [true]);

    equal(run(d, 'getWeekday'), 3, 'get | utc | wednesday');

    run(d, 'setWeekday', [0]);
    equal(d.getDate(), 22, 'set | utc | sunday');
    run(d, 'setWeekday', [1]);
    equal(d.getDate(), 23, 'set | utc | monday');
    run(d, 'setWeekday', [2]);
    equal(d.getDate(), 24, 'set | utc | tuesday');
    run(d, 'setWeekday', [3]);
    equal(d.getDate(), 25, 'set | utc | wednesday');
    run(d, 'setWeekday', [4]);
    equal(d.getDate(), 26, 'set | utc | thursday');
    run(d, 'setWeekday', [5]);
    equal(d.getDate(), 27, 'set | utc | friday');
    run(d, 'setWeekday', [6]);
    equal(d.getDate(), 28, 'set | utc | saturday');

    equal(run(d, 'setWeekday', [6]), d.getTime(), 'set | utc | should return the timestamp');

    d = new Date('August 25, 2010 11:45:20');

    d.setDate(12);
    equal(run(d, 'getWeekday'), 4, 'get | Thursday');
    equal(d.getUTCDay(), 4, 'get | utc | Thursday');

    d.setDate(13);
    equal(run(d, 'getWeekday'), 5, 'get | Friday');
    equal(d.getUTCDay(), 5, 'get | utc | Friday');

    d.setDate(14);
    equal(run(d, 'getWeekday'), 6, 'get | Saturday');
    equal(d.getUTCDay(), 6, 'get | utc | Saturday');

    d.setDate(15);
    equal(run(d, 'getWeekday'), 0, 'get | Sunday');
    equal(d.getUTCDay(), 0, 'get | utc | Sunday');

    d.setDate(16);
    equal(run(d, 'getWeekday'), 1, 'get | Monday');
    equal(d.getUTCDay(), 1, 'get | utc | Monday');

    d.setDate(17);
    equal(run(d, 'getWeekday'), 2, 'get | Tuesday');
    equal(d.getUTCDay(), 2, 'get | utc | Tuesday');

    d.setDate(18);
    equal(run(d, 'getWeekday'), 3, 'get | Wednesday');
    equal(d.getUTCDay(), 3, 'get | utc | Wednesday');

    equal(run(new Date(), 'advance', [{ weekday: 7 }]), new Date(), 'cannot advance by weekdays');
    equal(run(new Date(), 'rewind', [{ weekday: 7 }]), new Date(), 'cannot rewind by weekdays');


    // UTC Date
    d = run(testCreateUTCDate('2010-01-01 03:00', 'en'), 'setUTC', [true]);

    run(d, 'setWeekday', [1]);
    equal(d.getUTCDay(), 1, 'set | should account for UTC shift | getUTCDay');


    d = new Date(2010, 11, 31, 24, 59, 59);

    equal(run(d, 'getWeekday'), d.getDay(), 'get | equal to getDay');
    equal(run(d, 'getUTCWeekday'), d.getUTCDay(), 'get | utc | equal to getUTCDay');


    d = run(new Date('August 25, 2010 11:45:20'), 'setUTC', [true]);

    equal(run(d, 'getWeekday'), 3, 'get | utc | wednesday');

    run(d, 'setWeekday', [0]);
    equal(d.getDate(), 22, 'set | utc | sunday');
    run(d, 'setWeekday', [1]);
    equal(d.getDate(), 23, 'set | utc | monday');
    run(d, 'setWeekday', [2]);
    equal(d.getDate(), 24, 'set | utc | tuesday');
    run(d, 'setWeekday', [3]);
    equal(d.getDate(), 25, 'set | utc | wednesday');
    run(d, 'setWeekday', [4]);
    equal(d.getDate(), 26, 'set | utc | thursday');
    run(d, 'setWeekday', [5]);
    equal(d.getDate(), 27, 'set | utc | friday');
    run(d, 'setWeekday', [6]);
    equal(d.getDate(), 28, 'set | utc | saturday');

    run(d, 'setWeekday');
    equal(d.getDate(), 28, 'set | utc | undefined');

  });

  method('advance', function() {

    var d = new Date('August 25, 2010 11:45:20');

    run(d, 'advance', [1,-3,2,8,12,-2,44]);

    equal(d.getFullYear(), 2011, 'year');
    equal(d.getMonth(), 4, 'month');
    equal(d.getDate(), 27, 'day');
    equal(d.getHours(), 19, 'hours');
    equal(d.getMinutes(), 57, 'minutes');
    equal(d.getSeconds(), 18, 'seconds');
    equal(d.getMilliseconds(), 44, 'milliseconds');


    var d = new Date('August 25, 2010 11:45:20');
    run(d, 'advance', [{ year: 1, month: -3, days: 2, hours: 8, minutes: 12, seconds: -2, milliseconds: 44 }]);

    equal(d.getFullYear(), 2011, 'object | year');
    equal(d.getMonth(), 4, 'object | month');
    equal(d.getDate(), 27, 'object | day');
    equal(d.getHours(), 19, 'object | hours');
    equal(d.getMinutes(), 57, 'object | minutes');
    equal(d.getSeconds(), 18, 'object | seconds');
    equal(d.getMilliseconds(), 44, 'object | milliseconds');

    var d = new Date('August 25, 2010 11:45:20');
    run(d, 'advance', [{ week: 1}]);
    equal(d, new Date(2010, 8, 1, 11, 45, 20), 'positive weeks supported');
    run(d, 'advance', [{ week: -2}]);
    equal(d, new Date(2010, 7, 18, 11, 45, 20), 'negative weeks supported');

    equal(run(new Date(), 'advance', [{ years: 1 }]), testCreateDate('one year from now'), 'advancing 1 year');

    test(new Date(2014, 3, 11), ['0 days'], new Date(2014, 3, 11), 'advancing 0 days should be a noop');
    test(new Date(2014, 3, 11), ['-1 days'], new Date(2014, 3, 10), 'advancing -1 days');

    var d = new Date();
    var dayInMs = 24 * 60 * 60 * 1000;
    test(d, [dayInMs], new Date(d.getTime() + dayInMs), 'can advance milliseconds');


    // Advance also allows resetting.

    var d = new Date(2011, 0, 31, 23, 40, 28, 500);
    dateTest(d, [{ year: 1 }, true], new Date(2012, 0), 'with reset | year');
    dateTest(d, [{ month: 1 }, true], new Date(2011, 1), 'with reset | month');
    dateTest(d, [{ week: 1 }, true], new Date(2011, 1, 7), 'with reset | week');
    dateTest(d, [{ date: 1 }, true], new Date(2011, 1, 1), 'with reset | date');
    dateTest(d, [{ hour: 1 }, true], new Date(2011, 1, 1, 0), 'with reset | hour');
    dateTest(d, [{ minute: 1 }, true], new Date(2011, 0, 31, 23, 41), 'with reset | minute');
    dateTest(d, [{ second: 1 }, true], new Date(2011, 0, 31, 23, 40, 29), 'with reset | second');
    dateTest(d, [{ millisecond: 1 }, true], new Date(2011, 0, 31, 23, 40, 28, 501), 'with reset | millisecond');

    // Advance also allows string methods

    var d = new Date(2011, 0, 31, 23, 40, 28, 500);
    dateTest(d, ['3 years'], new Date(2014, 0, 31, 23, 40, 28, 500), 'string input | year');
    dateTest(d, ['3 months'], new Date(2011, 3, 30, 23, 40, 28, 500), 'string input | month');
    dateTest(d, ['3 weeks'], new Date(2011, 1, 21, 23, 40, 28, 500), 'string input | week');
    dateTest(d, ['3 days'], new Date(2011, 1, 3, 23, 40, 28, 500), 'string input | date');
    dateTest(d, ['3 hours'], new Date(2011, 1, 1, 2, 40, 28, 500), 'string input | hour');
    dateTest(d, ['3 minutes'], new Date(2011, 0, 31, 23, 43, 28, 500), 'string input | minute');
    dateTest(d, ['3 seconds'], new Date(2011, 0, 31, 23, 40, 31, 500), 'string input | second');
    dateTest(d, ['3 milliseconds'], new Date(2011, 0, 31, 23, 40, 28, 503), 'string input | millisecond');

    dateTest(d, ['day'], new Date(2011, 1, 1, 23, 40, 28, 500), 'string input | millisecond');

    // Issue #549 - Fractions in string units

    var d = new Date(2016, 0, 5, 12);
    dateTest(d, ['10.33 minutes'], new Date(2016, 0, 5, 12, 10, 20), 'string | 10.333 minutes');

    var d = new Date(2016, 0, 5, 12);
    dateTest(d, ['2.25 hours'], new Date(2016, 0, 5, 14, 15), 'string | 2.25 hours');

    var d = new Date(2016, 0, 5, 12);
    dateTest(d, ['11.5 days'], new Date(2016, 0, 17), 'string | 11.5 days');

    var d = new Date(2016, 0, 5, 12);
    dateTest(d, ['-2.25 hours'], new Date(2016, 0, 5, 9, 45), 'string | -2.25 hours');

    // Notably leaving off higher order units here to avoid ambiguity.

  });

  method('rewind', function() {
    var d = new Date('August 25, 2010 11:45:20');

    run(d, 'rewind', [1,-3,2,8,12,-2,4]);

    equal(d.getFullYear(), 2009, 'year');
    equal(d.getMonth(), 10, 'month');
    equal(d.getDate(), 23, 'day');
    equal(d.getHours(), 3, 'hours');
    equal(d.getMinutes(), 33, 'minutes');
    equal(d.getSeconds(), 21, 'seconds');
    equal(d.getMilliseconds(), 996, 'milliseconds');

    d = new Date('August 25, 2010 11:45:20');
    run(d, 'rewind', [{ year: 1, month: -3, days: 2, hours: 8, minutes: 12, seconds: -2, milliseconds: 4 }]);

    equal(d.getFullYear(), 2009, 'object | year');
    equal(d.getMonth(), 10, 'object | month');
    equal(d.getDate(), 23, 'object | day');
    equal(d.getHours(), 3, 'object | hours');
    equal(d.getMinutes(), 33, 'object | minutes');
    equal(d.getSeconds(), 21, 'object | seconds');
    equal(d.getMilliseconds(), 996, 'object | milliseconds');

    d = new Date('August 25, 2010 11:45:20');
    run(d, 'rewind', [{ week: 1}]);
    equal(d, new Date(2010, 7, 18, 11, 45, 20), 'positive weeks supported');
    run(d, 'rewind', [{ week: -1}]);
    equal(d, new Date(2010, 7, 25, 11, 45, 20), 'negative weeks supported');

    equal(run(new Date(), 'rewind', [{ years: 1 }]), testCreateDate('one year ago'), 'rewinding 1 year');

    var d = new Date();
    var dayInMs = 24 * 60 * 60 * 1000;
    test(d, [dayInMs], new Date(d.getTime() - dayInMs), 'can rewind milliseconds');

    // Issue #492
    d = new Date('August 25, 2010 11:45:20');
    run(d, 'rewind', [{ week: 1, day: 1}]);
    equal(d, new Date(2010, 7, 17, 11, 45, 20), 'negative weeks supported');
  });

  method('daysInMonth', function() {
    var d = new Date('August 25, 2010 11:45:20');

    d.setMonth(0);
    test(d, 31, 'jan');
    d.setMonth(1);
    test(d, 28, 'feb');
    d.setMonth(2);
    test(d, 31, 'mar');
    // This test fails in Casablanca in Windows XP! Reason unknown.
    d.setMonth(3);
    test(d, 30, 'apr');
    d.setMonth(4);
    test(d, 31, 'may');
    d.setMonth(5);
    test(d, 30, 'jun');
    d.setMonth(6);
    test(d, 31, 'jul');
    d.setMonth(7);
    test(d, 31, 'aug');
    d.setMonth(8);
    test(d, 30, 'sep');
    d.setMonth(9);
    test(d, 31, 'oct');
    d.setMonth(10);
    test(d, 30, 'nov');
    d.setMonth(11);
    test(d, 31, 'dec');

    d.setFullYear(2012);
    d.setMonth(1);
    test(d, 29, 'feb leap year');
  });

  method('setISOWeek', function() {
    var d = new Date('August 25, 2010 11:45:20');

    run(d, 'setISOWeek', [1]);
    equal(d, new Date(2010,0,6,11,45,20), 'week 1');
    run(d, 'setISOWeek', [15]);
    equal(d, new Date(2010,3,14,11,45,20), 'week 15');
    run(d, 'setISOWeek', [27]);
    equal(d, new Date(2010,6,7,11,45,20), 'week 27');
    run(d, 'setISOWeek', [52]);
    equal(d, new Date(2010,11,29,11,45,20), 'week 52');
    run(d, 'setISOWeek');
    equal(d, new Date(2010,11,29,11,45,20), 'week stays set');

    d = testCreateDate('August 25, 2010 11:45:20', 'en');
    equal(run(d, 'setISOWeek', [1]), new Date(2010, 0, 6, 11, 45, 20).getTime(), 'returns a timestamp');

    d = run(testCreateUTCDate('January 1, 2010 02:15:20'), 'setUTC', [true]);

    run(d, 'setISOWeek', [15]);
    equal(d, new Date(Date.UTC(2010,3,16,2,15,20)), 'utc | week 15');
    run(d, 'setISOWeek', [27]);
    equal(d, new Date(Date.UTC(2010,6,9,2,15,20)), 'utc | week 27');
    run(d, 'setISOWeek', [52]);
    equal(d, new Date(Date.UTC(2010,11,31,2,15,20)), 'utc | week 52');
    run(d, 'setISOWeek');
    equal(d, new Date(Date.UTC(2010,11,31,2,15,20)), 'utc | week stays set');

    // Issue #251

    test(new Date(2013, 0), [1], new Date(2013, 0, 1).getTime(), 'Should follow ISO-8601');
    test(new Date(2013, 0, 6), [1], new Date(2013, 0, 6).getTime(), 'Sunday should remain at the end of the week as per ISO-8601 standard');
    test(new Date(2013, 0, 13), [1], new Date(2013, 0, 6).getTime(), 'Sunday one week ahead');
    test(new Date(2013, 0, 7), [1], new Date(2012, 11, 31).getTime(), 'Monday should remain at the beginning of the week as per ISO-8601 standard');
    test(new Date(2013, 0, 14), [2], new Date(2013, 0, 7).getTime(), 'Monday one week ahead');

  });

  method('format', function() {

    var d = new Date('August 5, 2010 13:45:02');

    test(d, 'August 5, 2010 1:45 PM', 'no arguments is standard format with no time');
    test(d, ['{ms}'], '0', 'ms');
    test(d, ['{S}'], '0', 'S');
    test(d, ['{SSS}'], '000', 'SSS');
    test(d, ['{s}'], '2', 's');
    test(d, ['{ss}'], '02', 'ss');
    test(d, ['{seconds}'], '2', 'seconds');
    test(d, ['{m}'], '45', 'm');
    test(d, ['{mm}'], '45', 'mm');
    test(d, ['{minutes}'], '45', 'minutes');
    test(d, ['{h}'], '1', 'h');
    test(d, ['{hh}'], '01', 'hh');
    test(d, ['{H}'], '13', 'H');
    test(d, ['{HH}'], '13', 'HH');
    test(d, ['{hours}'], '1', 'hours');
    test(d, ['{24hr}'], '13', '24hr');
    test(d, ['{12hr}'], '1', '12hr');
    test(d, ['{d}'], '5', 'd');
    test(d, ['{dd}'], '05', 'dd');
    test(d, ['{date}'], '5', 'date');
    test(d, ['{day}'], '5', 'days');
    test(d, ['{do}'], '5th', 'Day ordinal');
    test(d, ['{dow}'], 'thu', 'dow');
    test(d, ['{Dow}'], 'Thu', 'Dow');
    test(d, ['{e}'], '4', 'Day of week as number');
    test(d, ['{eo}'], '4th', 'Day of week as ordinal number');
    test(d, ['{weekday}'], 'thursday', 'weekday');
    test(d, ['{Weekday}'], 'Thursday', 'Weekday');
    test(d, ['{D}'], '217', 'Day of the year');
    test(d, ['{DDD}'], '217', 'Day of the year padded');
    test(d, ['{gg}'], '10', '2 digit week year');
    test(d, ['{gggg}'], '2010', '4 digit week year');
    test(d, ['{GG}'], '10', '2 digit ISO week year');
    test(d, ['{GGGG}'], '2010', '4 digit ISO week year');
    test(d, ['{M}'], '8', 'M');
    test(d, ['{MM}'], '08', 'MM');
    test(d, ['{month}'], 'august', 'month');
    test(d, ['{Mon}'], 'Aug', 'Mon');
    test(d, ['{Month}'], 'August', 'Month');
    test(d, ['{Mo}'], '8th', 'Month ordinal');
    test(d, ['{yy}'], '10', 'yy');
    test(d, ['{yyyy}'], '2010', 'yyyy');
    test(d, ['{year}'], '2010', 'year');
    test(d, ['{Q}'], '3', 'Quarter');
    test(d, ['{t}'], 'p', 't');
    test(d, ['{T}'], 'P', 'T');
    test(d, ['{tt}'], 'pm', 'tt');
    test(d, ['{TT}'], 'PM', 'TT');
    test(d, ['{w}'], '32', 'locale week number (English)');
    test(d, ['{ww}'], '32', 'locale week number padded (English)');
    test(d, ['{wo}'], '32nd', 'locale week number ordinal (English)');
    test(d, ['{W}'], '31', 'ISO week number');
    test(d, ['{WW}'], '31', 'ISO week number padded');
    test(d, ['{Wo}'], '31st', 'ISO week number ordinal');
    test(d, ['{X}'], Math.floor(d.getTime() / 1000).toString(), 'Unix timestamp');
    test(d, ['{x}'], d.getTime().toString(), 'Unix millisecond timestamp');

    test(d, ['{Z}'],  getExpectedTimezoneOffset(d, true), 'Z');
    test(d, ['{ZZ}'], getExpectedTimezoneOffset(d), 'ZZ');

    raisesError(function(){ test(new Date(NaN)); }, 'Invalid date raises error', TypeError);
    raisesError(function(){ run(d, 'format', ['{foo}']); }, 'unknown ldml token raises error', TypeError);

    // Not all environments provide that so just make sure it returns the abbreviation or nothing.
    equal(/\w{3}|^$/.test(run(d, 'format', ['{z}'])), true, 'Timezone abbreviation');

    test(new Date('January 4, 2010'), ['{D}'], '4', 'Day of the year');
    test(new Date('January 4, 2010'), ['{DDD}'], '004', 'Day of the year padded');

    test(new Date('January 3, 2010'), ['{W}'], '53', 'ISO week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{WW}'], '53', 'ISO week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{Wo}'], '53rd', 'ISO week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{W}'], '1', 'ISO week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{WW}'], '01', 'ISO week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{Wo}'], '1st', 'ISO week number ordinal | Jan 4 2010');

    test(new Date('December 26, 2009'), ['{w}'], '52', 'locale week number | Dec 26 2009');
    test(new Date('December 26, 2009'), ['{ww}'], '52', 'locale week number padded | Dec 26 2009');
    test(new Date('December 26, 2009'), ['{wo}'], '52nd', 'locale week number ordinal | Dec 26 2009');
    test(new Date('December 27, 2009'), ['{w}'], '1', 'locale week number | Dec 27 2009');
    test(new Date('December 27, 2009'), ['{ww}'], '01', 'locale week number padded | Dec 27 2009');
    test(new Date('December 27, 2009'), ['{wo}'], '1st', 'locale week number ordinal | Dec 27 2009');

    test(new Date('January 3, 2010'), ['{w}', 'en-GB'], '53', 'locale week number | Jan 3 2010 | UK');
    test(new Date('January 3, 2010'), ['{ww}', 'en-GB'], '53', 'locale week number padded | Jan 3 2010 | UK');
    test(new Date('January 3, 2010'), ['{wo}', 'en-GB'], '53rd', 'locale week number ordinal | Jan 3 2010 | UK');
    test(new Date('January 4, 2010'), ['{w}', 'en-GB'], '1', 'locale week number | Jan 4 2010 | UK');
    test(new Date('January 4, 2010'), ['{ww}', 'en-GB'], '01', 'locale week number padded | Jan 4 2010 | UK');
    test(new Date('January 4, 2010'), ['{wo}', 'en-GB'], '1st', 'locale week number ordinal | Jan 4 2010 | UK');

    test(new Date('December 26, 2009'), ['{gg}'], '09', '2 digit week year');
    test(new Date('December 26, 2009'), ['{gggg}'], '2009', '4 digit week year');
    test(new Date('December 27, 2009'), ['{gg}'], '10', '2 digit week year | next');
    test(new Date('December 27, 2009'), ['{gggg}'], '2010', '4 digit week year | next');

    test(new Date('December 28, 2008'), ['{gg}', 'en-GB'], '08', '2 digit week year | UK');
    test(new Date('December 28, 2008'), ['{gggg}', 'en-GB'], '2008', '4 digit week year | UK');
    test(new Date('December 29, 2008'), ['{gg}', 'en-GB'], '09', '2 digit week year | next | UK');
    test(new Date('December 29, 2008'), ['{gggg}', 'en-GB'], '2009', '4 digit week year | next | UK');
    test(new Date('January 3, 2010'),   ['{gg}', 'en-GB'], '09', '2 digit week year | prev | UK');
    test(new Date('January 3, 2010'),   ['{gggg}', 'en-GB'], '2009', '4 digit week year | prev | UK');

    test(new Date('December 28, 2008'), ['{GG}'], '08', '2 digit week year | ISO-8601');
    test(new Date('December 28, 2008'), ['{GGGG}'], '2008', '4 digit week year | ISO-8601');
    test(new Date('December 29, 2008'), ['{GG}'], '09', '2 digit week year | next | ISO-8601');
    test(new Date('December 29, 2008'), ['{GGGG}'], '2009', '4 digit week year | next | ISO-8601');
    test(new Date('January 3, 2010'),   ['{GG}'], '09', '2 digit week year | prev | ISO-8601');
    test(new Date('January 3, 2010'),   ['{GGGG}'], '2009', '4 digit week year | prev | ISO-8601');

    test(new Date(-60000000000000), ['{yy}'], '68', 'yy in year 0068 should be 2 digits');
    test(new Date(-60000000000000), ['{yyyy}'], '0068', 'yyyy in year 0068 should be 4 digits');

    test(new Date(2010,  0), ['{Q}'], '1', 'Jan is Q1');
    test(new Date(2010,  1), ['{Q}'], '1', 'Feb is Q1');
    test(new Date(2010,  2), ['{Q}'], '1', 'Mar is Q1');
    test(new Date(2010,  3), ['{Q}'], '2', 'Apr is Q2');
    test(new Date(2010,  4), ['{Q}'], '2', 'May is Q2');
    test(new Date(2010,  5), ['{Q}'], '2', 'Jun is Q2');
    test(new Date(2010,  6), ['{Q}'], '3', 'Jul is Q3');
    test(new Date(2010,  7), ['{Q}'], '3', 'Aug is Q3');
    test(new Date(2010,  8), ['{Q}'], '3', 'Sep is Q3');
    test(new Date(2010,  9), ['{Q}'], '4', 'Oct is Q4');
    test(new Date(2010, 10), ['{Q}'], '4', 'Nov is Q4');
    test(new Date(2010, 11), ['{Q}'], '4', 'Dec is Q4');

    d = new Date('August 5, 2010 04:03:02');

    test(d, ['{mm}'], '03', 'mm pads the digit');
    test(d, ['{dd}'], '05', 'dd pads the digit');
    test(d, ['{hh}'], '04', 'hh pads the digit');
    test(d, ['{ss}'], '02', 'ss pads the digit');

    test(d, ['{M}/{d}/{yyyy}'], '8/5/2010', 'slashes');
    test(d, ['{Weekday}, {Month} {dd}, {yyyy}'], 'Thursday, August 05, 2010', 'text date');
    test(d, ['{Weekday}, {Month} {dd}, {yyyy} {12hr}:{mm}:{ss} {tt}'], 'Thursday, August 05, 2010 4:03:02 am', 'text date with time');
    test(d, ['{Month} {dd}'], 'August 05', 'month and day');
    test(d, ['{Dow}, {dd} {Mon} {yyyy} {hh}:{mm}:{ss} GMT'], 'Thu, 05 Aug 2010 04:03:02 GMT', 'full GMT');
    test(d, ['{yyyy}-{MM}-{dd}T{hh}:{mm}:{ss}'], '2010-08-05T04:03:02', 'ISO-8601 without timezone');
    test(d, ['{12hr}:{mm} {tt}'], '4:03 am', 'hr:min');
    test(d, ['{12hr}:{mm}:{ss} {tt}'], '4:03:02 am', 'hr:min:sec');
    test(d, ['{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}Z'], '2010-08-05 04:03:02Z', 'ISO-8601 UTC');
    test(d, ['{Month}, {yyyy}'], 'August, 2010', 'month and year');

    var tz = getExpectedTimezoneOffset(d, true);
    test(d, ['ISO8601'], '2010-08-05T04:03:02.000'+tz, 'ISO8601');
    test(d, ['{ISO8601}'], '2010-08-05T04:03:02.000'+tz, 'ISO8601 | token');

    // RFC
    var d = new Date('August 5, 2010 04:03:02');
    var rfc1123 = testCapitalize(getWeekdayFromDate(d).slice(0,3))+', '+testPadNumber(d.getDate(), 2)+' '+testCapitalize(getMonthFromDate(d).slice(0,3))+' '+d.getFullYear()+' '+testPadNumber(d.getHours(), 2)+':'+testPadNumber(d.getMinutes(), 2)+':'+testPadNumber(d.getSeconds(), 2)+' '+ run(d, 'getUTCOffset');
    var rfc1036 = testCapitalize(getWeekdayFromDate(d))+', '+testPadNumber(d.getDate(), 2)+'-'+testCapitalize(getMonthFromDate(d).slice(0,3))+'-'+d.getFullYear().toString().slice(2)+' '+testPadNumber(d.getHours(), 2)+':'+testPadNumber(d.getMinutes(), 2)+':'+testPadNumber(d.getSeconds(), 2)+' '+run(d, 'getUTCOffset');
    test(d, ['RFC1123'], rfc1123, 'RFC1123');
    test(d, ['RFC1036'], rfc1036, 'RFC1036');
    test(d, ['{RFC1123}'], rfc1123, 'RFC1123 | token');
    test(d, ['{RFC1036}'], rfc1036, 'RFC1036 | token');

    // RFC - UTC
    var d = run(new Date('August 5, 2010 04:03:02'), 'setUTC', [true]);
    rfc1123 = testCapitalize(getWeekdayFromDate(d,true).slice(0,3))+', '+testPadNumber(d.getUTCDate(), 2)+' '+testCapitalize(getMonthFromDate(d,true).slice(0,3))+' '+d.getUTCFullYear()+' '+testPadNumber(d.getUTCHours(), 2)+':'+testPadNumber(d.getUTCMinutes(), 2)+':'+testPadNumber(d.getUTCSeconds(), 2)+' +0000';
    rfc1036 = testCapitalize(getWeekdayFromDate(d,true))+', '+testPadNumber(d.getUTCDate(), 2)+'-'+testCapitalize(getMonthFromDate(d,true).slice(0,3))+'-'+d.getUTCFullYear().toString().slice(2)+' '+testPadNumber(d.getUTCHours(), 2)+':'+testPadNumber(d.getUTCMinutes(), 2)+':'+testPadNumber(d.getUTCSeconds(), 2)+' +0000';
    test(d, ['RFC1123'], rfc1123, 'RFC1123 UTC');
    test(d, ['RFC1036'], rfc1036, 'RFC1036 UTC');
    test(d, ['{RFC1123}'], rfc1123, 'RFC1123 UTC | token');
    test(d, ['{RFC1036}'], rfc1036, 'RFC1036 UTC | token');

    // ISO-8601 - UTC
    var d = run(new Date('August 5, 2010 04:03:02'), 'setUTC', [true]);
    var iso = d.getUTCFullYear()+'-'+testPadNumber(d.getUTCMonth()+1, 2)+'-'+testPadNumber(d.getUTCDate(), 2)+'T'+testPadNumber(d.getUTCHours(), 2)+':'+testPadNumber(d.getUTCMinutes(), 2)+':'+testPadNumber(d.getUTCSeconds(), 2)+'.'+testPadNumber(d.getUTCMilliseconds(), 3)+'Z';
    test(d, ['ISO8601'], iso, 'ISO8601 UTC');
    test(d, ['{ISO8601}'], iso, 'ISO8601 UTC | token');

    // strftime tokens

    var d = new Date('August 5, 2010 14:03:02');

    test(d, ['%a'], 'Thu', 'Abbreviated weekday');
    test(d, ['%A'], 'Thursday', 'Weekday');
    test(d, ['%b'], 'Aug', 'Abbreviated month');
    test(d, ['%B'], 'August', 'Month');
    test(d, ['%c'], 'Thu Aug 5 2010 2:03 PM', 'Preferred stamp');
    test(d, ['%C'], '20', 'Century as 2 digit string');
    test(d, ['%d'], '05', 'Padded day of the month');
    test(d, ['%D'], '08/05/10', 'American 2 digit abbreviation');
    test(d, ['%e'], ' 5', 'Day of the month with space padding');
    test(d, ['%F'], '2010-08-05', 'Common datestamp format');
    test(d, ['%g'], '10', '2 digit week year');
    test(d, ['%G'], '2010', '4 digit week year');
    test(d, ['%h'], 'Aug', 'Abbreviated month');
    test(d, ['%H'], '14', 'Hours in 24 hour');
    test(d, ['%I'], '02', 'Hours in 12 hour');
    test(d, ['%j'], '217', 'Day of the year');
    test(d, ['%m'], '08', '2 digit month');
    test(d, ['%M'], '03', '2 digit minute');
    test(d, ['%p'], 'PM', 'PM');
    test(d, ['%P'], 'pm', 'pm');
    test(d, ['%r'], '02:03:02 PM', '12 hour clock time with seconds');
    test(d, ['%R'], '14:03', '24 hour clock time without seconds');
    test(d, ['%S'], '02', 'seconds');
    test(d, ['%T'], '14:03:02', '24 hour clock time with seconds');
    test(d, ['%u'], '4', 'ISO-8601 day of week');
    test(d, ['%U'], '31', 'Week number with first Sunday as first week');
    test(d, ['%V'], '31', 'ISO week number');
    test(d, ['%w'], '4', 'Day of the week (Sunday as 0)');
    test(d, ['%W'], '31', 'Week number with first Monday we first week');
    test(d, ['%x'], '08/05/2010', 'Locale based representation | date only');
    test(d, ['%X'], '2:03 PM', 'Locale based representation | time only');
    test(d, ['%Y'], '2010', 'Full year');

    raisesError(function(){ run(d, 'format', ['%']); }, 'unused strf token raises error', TypeError);
    raisesError(function(){ run(d, 'format', ['%foo']); }, 'unknown strf token raises error', TypeError);

    equal(/[+-]\d{4}/.test(run(d, 'format', ['%z'])), true, 'Timezone offset');
    equal(/\w{3}/.test(run(d, 'format', ['%Z'])), true, 'Timezone abbreviation');

    test(new Date('January 1, 2010'), ['%c', 'en-GB'], 'Fri 1 Jan 2010 0:00', 'Preferred stamp | UK');

    test(new Date('December 28, 2008'), ['%g'], '08', '2 digit week year | ISO-8601');
    test(new Date('December 28, 2008'), ['%G'], '2008', '4 digit week year | ISO-8601');
    test(new Date('December 29, 2008'), ['%g'], '09', '2 digit week year | next | ISO-8601');
    test(new Date('December 29, 2008'), ['%G'], '2009', '4 digit week year | next | ISO-8601');
    test(new Date('January 3, 2010'),   ['%g'], '09', '2 digit week year | prev | ISO-8601');
    test(new Date('January 3, 2010'),   ['%G'], '2009', '4 digit week year | prev | ISO-8601');

    test(new Date('August 5, 2010 4:03:02'), ['%H'], '04', 'Padded hours in 24 hour');
    test(new Date('August 5, 2010 23:59:59'), ['%j'], '217', 'Day of the year at end of day');
    test(new Date('August 5, 2010 00:00:00'), ['%j'], '217', 'Day of the year at beginning of day');
    test(new Date('August 5, 2008 00:00:00'), ['%j'], '218', 'Day of the year on leap year');
    test(new Date('January 1, 2010 00:00:00'), ['%j'], '001', 'Padded day of the year');
    test(new Date('December 31, 2010 23:59:59'), ['%j'], '365', 'Last second of the year');
    test(new Date('August 5, 2010 4:00'), ['%p'], 'AM', 'AM');
    test(new Date('August 5, 2010 4:00'), ['%P'], 'am', 'am');

    test(new Date('January 3, 2010'), ['%u'], '7', 'ISO-8601 day of week Sunday');
    test(new Date('January 4, 2010'), ['%u'], '1', 'ISO-8601 day of week Monday');

    test(new Date('January 3, 2010'), ['%w'], '0', 'Day of week Sunday');
    test(new Date('January 4, 2010'), ['%w'], '1', 'Day of week Monday');

    test(new Date('January 1, 2010'), ['%U'], '00', 'Week of the year (Sunday first) 1st');
    test(new Date('January 2, 2010'), ['%U'], '00', 'Week of the year (Sunday first) 2nd');
    test(new Date('January 3, 2010'), ['%U'], '01', 'Week of the year (Sunday first) 3rd');
    test(new Date('January 4, 2010'), ['%U'], '01', 'Week of the year (Sunday first) 4th');

    test(new Date('January 1, 2010'), ['%V'], '53', 'ISO week of the year 1st');
    test(new Date('January 2, 2010'), ['%V'], '53', 'ISO week of the year 2nd');
    test(new Date('January 3, 2010'), ['%V'], '53', 'ISO week of the year 3rd');
    test(new Date('January 4, 2010'), ['%V'], '01', 'ISO week of the year 4th');

    test(new Date('January 1, 2010'), ['%W'], '00', 'Week of the year (Monday first) 1st');
    test(new Date('January 2, 2010'), ['%W'], '00', 'Week of the year (Monday first) 2nd');
    test(new Date('January 3, 2010'), ['%W'], '00', 'Week of the year (Monday first) 3rd');
    test(new Date('January 4, 2010'), ['%W'], '01', 'Week of the year (Monday first) 4th');

    test(new Date('May 1, 2010'), ['%b'], 'May', 'May');

    test(new Date(-60000000000000), ['%y'], '68', '%y in year 0068 should be 2 digits');
    test(new Date(-60000000000000), ['%Y'], '0068', '%Y in year 0068 should be 4 digits');

    test(d, ['%Y%A'], '2010Thursday', 'tokens together');
    test(d, ['%Y\n%A'], '2010\nThursday', 'can input newlines');
    test(d, ['%Y\t%A'], '2010\tThursday', 'can input tabs');
    test(d, ['%Y%%%A'], '2010%Thursday', 'can escape percent signs');

    // Shortcuts

    var then = new Date(2010, 0, 5, 15, 52);

    assertFormatShortcut(then, 'short', '01/05/2010');
    assertFormatShortcut(then, 'medium', 'January 5, 2010');
    assertFormatShortcut(then, 'long', 'January 5, 2010 3:52 PM');
    assertFormatShortcut(then, 'full', 'Tuesday, January 5, 2010 3:52 PM');
    test(then, ['{time}'], '3:52 PM', 'preferred time');
    test(then, ['{stamp}'], 'Tue Jan 5 2010 3:52 PM', 'preferred stamp');

    assertFormatShortcut(then, 'short', '05/01/2010', 'en-GB');
    assertFormatShortcut(then, 'medium', '5 January 2010', 'en-GB');
    assertFormatShortcut(then, 'long', '5 January 2010 15:52', 'en-GB');
    assertFormatShortcut(then, 'full', 'Tuesday, 5 January, 2010 15:52', 'en-GB');
    test(then, ['{time}', 'en-GB'], '15:52', 'preferred time | UK');
    test(then, ['{stamp}', 'en-GB'], 'Tue 5 Jan 2010 15:52', 'preferred stamp | UK');

    assertFormatShortcut(then, 'short', '05/01/2010', 'en-AU');
    assertFormatShortcut(then, 'medium', '5 January 2010', 'en-AU');
    assertFormatShortcut(then, 'long', '5 January 2010 15:52', 'en-AU');
    assertFormatShortcut(then, 'full', 'Tuesday, 5 January, 2010 15:52', 'en-AU');

    assertFormatShortcut(then, 'short', '2010-01-05', 'en-CA');
    assertFormatShortcut(then, 'medium', '5 January, 2010', 'en-CA');
    assertFormatShortcut(then, 'long', '5 January, 2010 15:52', 'en-CA');
    assertFormatShortcut(then, 'full', 'Tuesday, 5 January, 2010 15:52', 'en-CA');

    // Issue #262
    equal(/\d+-/.test(run(new Date(), 'format', ['{ZZ}'])), false, 'Timezone format should not include hyphens')

    // Issue #498
    test(new Date(1901, 0, 2), ['{yy}'], '01', 'Zero padded year should respect yy format');
    test(new Date(1901, 0, 2), ['{yyyy}'], '1901', 'Zero padded year should respect yyyy format');

  });

  method('getUTCOffset', function() {
    var d = new Date('August 5, 2010 04:03:02');
    test(d, getExpectedTimezoneOffset(d), 'no colon');
    test(d, [true], getExpectedTimezoneOffset(d, true), 'colon');
  });

  method('relative', function() {

    equal(run(testCreateDate(), 'relative'), '1 second ago', 'no args');

    assertRelative('6234 milliseconds ago', '6 seconds ago');
    assertRelative('6 seconds ago', '6 seconds ago');
    assertRelative('360 seconds ago', '6 minutes ago');
    assertRelative('360 minutes ago', '6 hours ago');
    assertRelative('360 hours ago', '2 weeks ago');
    assertRelative('340 days ago', '11 months ago');
    assertRelative('360 days ago', '11 months ago');
    assertRelative('360 weeks ago', '6 years ago');
    assertRelative('360 months ago', '30 years ago');
    assertRelative('360 years ago', '360 years ago');
    assertRelative('12 months ago', '1 year ago');

    assertRelative('6234 milliseconds from now', '6 seconds from now');
    assertRelative('361 seconds from now', '6 minutes from now');
    assertRelative('361 minutes from now', '6 hours from now');
    assertRelative('360 hours from now', '2 weeks from now');
    assertRelative('340 days from now', '11 months from now');
    assertRelative('360 days from now', '11 months from now');
    assertRelative('360 weeks from now', '6 years from now');
    assertRelative('360 months from now', '30 years from now');
    assertRelative('360 years from now', '360 years from now');
    assertRelative('13 months from now', '1 year from now');


    // Handling callback

    var simpleDateFormat = '{Month} {date}, {year}';

    var dyn = function(value, unit, ms, loc) {
      // One year
      if (ms < -(365 * 24 * 60 * 60 * 1000)) {
        return simpleDateFormat;
      }
    }

    var d = getRelativeDate(0, 0, 0, 0, -5);
    var result = run(d, 'relative', [dyn]);
    equal(result, '5 minutes ago', '5 minutes should stay relative');

    var d = getRelativeDate(0, -13)
    var result = run(d, 'relative', [dyn]);
    var expected = run(d, 'format', [simpleDateFormat]);
    equal(result, expected, 'higher reverts to absolute');

    equal(run(testCreateDate('2002-02-17'), 'relative', [dyn]), 'February 17, 2002', 'function that returns a format uses that format');
    equal(run(testCreateDate('45 days ago'), 'relative', [dyn]), '1 month ago', 'function that returns undefined uses relative format');

    // globalize system with plurals

    var strings = ['ミリ秒','秒','分','時間','日','週間','月','年'];

    var dyn = function(value, unit, ms, loc) {
      equal(value, 5, '5 minutes ago | value is the closest relevant value');
      equal(unit, 2, '5 minutes ago | unit is the closest relevant unit');
      equalWithMargin(ms, -300000, 20, '5 minutes ago | ms is the offset in ms');
      equal(loc.code, 'en', '4 hours ago | 4th argument is the locale object');
      return value + strings[unit] + (ms < 0 ? '前' : '後');
    }
    equal(run(testCreateDate('5 minutes ago'), 'relative', [dyn]), '5分前', '5 minutes ago');

    var dyn = function(value, unit, ms, loc) {
      equal(value, 1, '1 minute from now | value is the closest relevant value');
      equal(unit, 2, '1 minute from now | unit is the closest relevant unit');
      equalWithMargin(ms, 61000, 20, '1 minute from now | ms is the offset in ms');
      equal(loc.code, 'en', '4 hours ago | 4th argument is the locale object');
      return value + strings[unit] + (ms < 0 ? '前' : '後');
    }
    equal(run(testCreateDate('61 seconds from now'), 'relative', [dyn]), '1分後', '1 minute from now');

    var dyn = function(value, unit, ms, loc) {
      equal(value, 4, '4 hours ago | value is the closest relevant value');
      equal(unit, 3, '4 hours ago | unit is the closest relevant unit');
      equalWithMargin(ms, -14400000, 20, '4 hours ago | ms is the offset in ms');
      equal(loc.code, 'en', '4 hours ago | 4th argument is the locale object');
      return value + strings[unit] + (ms < 0 ? '前' : '後');
    }
    equal(run(testCreateDate('240 minutes ago'), 'relative', [dyn]), '4時間前', '4 hours ago');

    run(testCreateDate('223 milliseconds ago'), 'relative', [function(value, unit) {
      equalWithMargin(value, 223, 20, 'still passes < 1 second');
      equal(unit, 0, 'still passes millisecond is zero');
    }]);

    // Handling locale code

    testCreateFakeLocale('fo');

    var dyn = function(value, unit, ms, loc) {
      return loc.code;
    }
    equal(run(testCreateDate('5 minutes ago'), 'relative', ['fo']), 'the past!', 'lang code');
    equal(run(testCreateDate('5 minutes ago'), 'relative', ['fo', dyn]), 'fo', 'lang code and callback');

    raisesError(function(){ test(new Date(NaN)); }, 'Invalid date raises error', TypeError);

    // Issue #474
    // "1 month from now" can be forced back when there are not enough days in a month.
    // In these cases "relative()" should return "4 weeks from now" instead of "1 month from now".
    equal(run(testCreateDate('11/10/2014 21:00:00'), 'daysSince', ['7/1/2014']), 132, 'daysSince should be 132 at 9pm');
    equal(run(testCreateDate('11/10/2014 22:00:00'), 'daysSince', ['7/1/2014']), 132, 'daysSince should be 132 at 10pm');

  });

  method('relativeTo', function() {

    testCreateFakeLocale('fo');

    var d = new Date(2016,3,14,22,47,52,500);

    assertRelativeTo(d, [new Date(2015,3,14,22,47,52,500)], '1 year');
    assertRelativeTo(d, [new Date(2016,2,14,22,47,52,500)], '1 month');
    assertRelativeTo(d, [new Date(2016,3,13,22,47,52,500)], '1 day');
    assertRelativeTo(d, [new Date(2016,3,14,21,47,52,500)], '1 hour');
    assertRelativeTo(d, [new Date(2016,3,14,22,46,52,500)], '1 minute');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,51,500)], '1 second');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,51,499)], '1 second');

    assertRelativeTo(d, [new Date(2017,3,14,22,47,52,500)], '1 year');
    assertRelativeTo(d, [new Date(2016,4,14,22,47,52,500)], '1 month');
    assertRelativeTo(d, [new Date(2016,3,15,22,47,52,500)], '1 day');
    assertRelativeTo(d, [new Date(2016,3,14,23,47,52,500)], '1 hour');
    assertRelativeTo(d, [new Date(2016,3,14,22,48,52,500)], '1 minute');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,53,500)], '1 second');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,51,501)], '1 second');

    assertRelativeTo(d, [new Date(2017,0)], '8 months');
    assertRelativeTo(d, [new Date(2000,0)], '16 years');

    assertRelativeTo(d, [new Date(2017,3,14,22,47,52,500), 'fo'], '1domomoney');
    assertRelativeTo(d, [new Date(2016,4,14,22,47,52,500), 'fo'], '1timomoney');
    assertRelativeTo(d, [new Date(2016,3,15,22,47,52,500), 'fo'], '1somomoney');
    assertRelativeTo(d, [new Date(2016,3,14,23,47,52,500), 'fo'], '1famomoney');
    assertRelativeTo(d, [new Date(2016,3,14,22,48,52,500), 'fo'], '1mimomoney');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,53,500), 'fo'], '1remomoney');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,51,501), 'fo'], '1remomoney');

    assertRelativeTo(new Date(2010,0,18), ['The first day of January, 2010'], '2 weeks');
    assertRelativeTo(new Date(2010,0),    ['August 10, 2010'], '7 months');

    assertRelativeTo(new Date(), ['last week'],  '1 week',  true);
    assertRelativeTo(new Date(), ['last month'], '1 month', true);
    assertRelativeTo(new Date(), ['last year'],  '1 year',  true);

    assertRelativeTo(new Date(), ['next week'],  '1 week');
    assertRelativeTo(new Date(), ['next month'], '1 month');
    assertRelativeTo(new Date(), ['next year'],  '1 year');

    raisesError(function(){ test(new Date(NaN)); }, 'Invalid date raises error', TypeError);

  });

  method('is', function() {

    var d = new Date(2010,7,5,13,45,2,542);

    test(d, ['nonsense'], false, 'nonsense');
    test(d, ['August'], true, 'August');
    test(d, ['August 5th, 2010'], true, 'August 5th, 2010');
    test(d, ['August 5th, 2010 13:45'], true, 'August 5th, 2010, 13:45');
    test(d, ['August 5th, 2010 13:45:02'], true, 'August 5th 2010, 13:45:02');
    test(d, ['August 5th, 2010 13:45:02.542'], true, 'August 5th 2010, 13:45:02:542');
    test(d, ['September'], false, 'September');
    test(d, ['August 6th, 2010'], false, 'August 6th, 2010');
    test(d, ['August 5th, 2010 13:46'], false, 'August 5th, 2010, 13:46');
    test(d, ['August 5th, 2010 13:45:03'], false, 'August 5th 2010, 13:45:03');
    test(d, ['August 5th, 2010 13:45:03.543'], false, 'August 5th 2010, 13:45:03:543');
    test(d, ['July'], false, 'July');
    test(d, ['August 4th, 2010'], false, 'August 4th, 2010');
    test(d, ['August 5th, 2010 13:44'], false, 'August 5th, 2010, 13:44');
    test(d, ['August 5th, 2010 13:45:01'], false, 'August 5th 2010, 13:45:01');
    test(d, ['August 5th, 2010 13:45:03.541'], false, 'August 5th 2010, 13:45:03:541');
    test(d, ['2010'], true, '2010');
    test(d, ['today'], false, 'today');
    test(d, ['now'], false, 'now');
    test(d, ['weekday'], true, 'weekday');
    test(d, ['weekend'], false, 'weekend');
    test(d, ['Thursday'], true, 'Thursday');
    test(d, ['Friday'], false, 'Friday');

    test(d, [d], true, 'self is true');
    test(d, [new Date(2010,7,5,13,45,2,542)], true, 'equal date is true');
    test(d, [new Date()], false, 'other dates are not true');
    test(d, [1281015902542 + (d.getTimezoneOffset() * 60 * 1000)], true, 'timestamps also accepted');

    test(new Date(), ['now', 10], true, 'now is now');
    test(new Date(2010,7,5,13,42,42,324), ['August 5th, 2010 13:42:42.324'], true, 'August 5th, 2010 13:42:42.324');
    test(new Date(2010,7,5,13,42,42,324), ['August 5th, 2010 13:42:42.319'], false, 'August 5th, 2010 13:42:42.319');
    test(new Date(2010,7,5,13,42,42,324), ['August 5th, 2010 13:42:42.325'], false, 'August 5th, 2010 13:42:42.325');
    test(new Date(2010,7,5,13,42,42,324), ['August 5th, 2010 13:42:42.323'], false, 'August 5th, 2010 13:42:42.323');

    test(new Date(2001, 0), ['the beginning of 2001'], true, 'the beginning of 2001');
    test(new Date(now.getFullYear(), 2), ['the beginning of March'], true, 'the beginning of March');
    test(new Date(2001, 11, 31, 23, 59, 59, 999), ['the end of 2001'], true, 'the end of 2001');
    test(new Date(now.getFullYear(), 2, 31, 23, 59, 59, 999), ['the end of March'], true, 'the end of March');
    test(new Date(2001, 11, 31), ['the last day of 2001'], true, 'the last day of 2001');
    test(new Date(now.getFullYear(), 2, 31), ['the last day of March'], true, 'the last day of March');

    test(testCreateDate('the beginning of the week'), ['the beginning of the week'], true, 'the beginning of the week is the beginning of the week');
    test(testCreateDate('the end of the week'), ['the end of the week'], true, 'the end of the week is the end of the week');
    test(testCreateDate('tuesday'), ['the beginning of the week'], false, 'tuesday is the beginning of the week');
    test(testCreateDate('tuesday'), ['the end of the week'], false, 'tuesday is the end of the week');

    test(testCreateDate('sunday'), ['the beginning of the week'], true, 'sunday is the beginning of the week');

    test(testCreateDate('tuesday'), ['tuesday'], true, 'tuesday is tuesday');
    test(testCreateDate('sunday'), ['sunday'], true, 'sunday is sunday');
    test(testCreateDate('saturday'), ['saturday'], true, 'saturday is saturday');

    test(testGetWeekday(0), ['the beginning of the week'], true, 'the beginning of the week');
    test(testGetWeekday(6, 0, 23, 59, 59, 999), ['the end of the week'], true, 'the end of the week');

    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,431)], false, 'accuracy | accurate to millisecond by default | 431');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432)], true, 'accuracy |  accurate to millisecond by default | 432');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,433)], false, 'accuracy | accurate to millisecond by default | 433');

    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,431), 2], true, 'accuracy | accuracy can be overridden | 431');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432), 2], true, 'accuracy | accuracy can be overridden | 432');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,433), 2], true, 'accuracy | accuracy can be overridden | 433');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,429), 2], false, 'accuracy | accuracy can be overridden but still is constrained');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,435), 2], false, 'accuracy | accuracy can be overridden but still is constrained');


    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,431), -500], false, 'accuracy | negative accuracy reverts to zero');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432), -500], true, 'accuracy | negative accuracy reverts to zero');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,433), -500], false, 'accuracy | negative accuracy reverts to zero');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,429), -500], false, 'accuracy | negative accuracy reverts to zero');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,435), -500], false, 'accuracy | negative accuracy reverts to zero');


    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432), 86400000], true, 'accuracy | accurate to a day');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,23,3,1,432), 86400000], true, 'accuracy | accurate to a day');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,21,3,1,432), 86400000], true, 'accuracy | accurate to a day');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,14,22,3,1,432), 86400000], true, 'accuracy | accurate to a day');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,16,22,3,1,432), 86400000], true, 'accuracy | accurate to a day');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,14,22,3,1,431), 86400000], false, 'accuracy | accurate to a day is still contstrained');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,16,22,3,1,433), 86400000], false, 'accuracy | accurate to a day is still contstrained');

    test(new Date(1970,4,15,22,3,1,432), [new Date(1969,4,14,22,3,2,432), 31536000000], false, 'accuracy | 1969 accurate to a year is still contstrained');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1969,4,15,22,3,1,432), 31536000000], true, 'accuracy | 1969 accurate to a year');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432), 31536000000], true, 'accuracy | 1970 accurate to a year');

    // Indianapolis went off DST during this year, so this test is also a good
    // measurement of DST traversal that can happen between years.
    test(new Date(1970,4,15,22,3,1,432), [new Date(1971,4,15,22,3,1,432), 31536000000], true, 'accuracy | 1971 accurate to a year');
    test(new Date(1971,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432), 31536000000], true, 'accuracy | 1971 accurate to a year');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1971,4,15,22,3,1,433), 31536000000], false, 'accuracy | 1971 accurate to a year');
    test(new Date(1971,4,15,22,3,1,433), [new Date(1970,4,15,22,3,1,432), 31536000000], false, 'accuracy | 1971 accurate to a year');

    test(new Date(1970,4,15,22,3,1,432), [new Date(1971,4,16,22,3,1,432), 31536000000], false, 'accuracy | 1971 accurate to a year is still contstrained');


    // Note that relative #is formats can only be considered to be accurate to within a few milliseconds
    // to avoid complications rising from the date being created momentarily after the function is called.
    test(getRelativeDate(0,0,0,0,0,0, -5), ['3 milliseconds ago'], false, '3 milliseconds ago is accurate to milliseconds');
    test(getRelativeDate(0,0,0,0,0,0, -5), ['5 milliseconds ago', 5], true, '5 milliseconds ago is accurate to milliseconds');
    test(getRelativeDate(0,0,0,0,0,0, -5), ['7 milliseconds ago'], false, '7 milliseconds ago is accurate to milliseconds');

    test(getRelativeDate(0,0,0,0,0,-5), ['4 seconds ago'], false, '4 seconds ago is not 5 seconds ago');
    test(getRelativeDate(0,0,0,0,0,-5), ['5 seconds ago'], true, '5 seconds ago is 5 seconds ago');
    test(getRelativeDate(0,0,0,0,0,-5), ['6 seconds ago'], false, '6 seconds ago is not 5 seconds ago');
    test(getRelativeDate(0,0,0,0,0,-5), ['7 seconds ago'], false, '7 seconds ago is not 5 seconds ago');

    test(getRelativeDate(0,0,0,0,-5), ['4 minutes ago'], false, '4 minutes ago is not 5 minutes ago');
    test(getRelativeDate(0,0,0,0,-5), ['5 minutes ago'], true, '5 minutes ago is 5 minutes ago');
    test(getRelativeDate(0,0,0,0,-5), ['6 minutes ago'], false, '6 minutes ago is not 5 minutes ago');
    test(getRelativeDate(0,0,0,0,-5), ['7 minutes ago'], false, '7 minutes ago is not 5 minutes ago');

    test(getRelativeDate(0,0,0,-5), ['4 hours ago'], false, '4 hours ago is not 5 hours ago');
    test(getRelativeDate(0,0,0,-5), ['5 hours ago'], true, '5 hours ago is 5 hours ago');
    test(getRelativeDate(0,0,0,-4, -45), ['5 hours ago'], true, '4:45 hours ago is still 5 hours ago');
    test(getRelativeDate(0,0,0,-5), ['6 hours ago'], false, '6 hours ago is not 5 hours ago');
    test(getRelativeDate(0,0,0,-5), ['7 hours ago'], false, '7 hours ago is not 5 hours ago');

    test(getRelativeDate(0,0,-5), ['4 days ago'], false, '4 days ago is not 5 days ago');
    test(getRelativeDate(0,0,-5), ['5 days ago'], true, '5 days ago is 5 hours ago');
    test(getRelativeDate(0,0,-5), ['6 days ago'], false, '6 days ago is not 5 days ago');
    test(getRelativeDate(0,0,-5), ['7 days ago'], false, '7 days ago is not 5 days ago');

    test(getRelativeDate(0,-5), ['4 months ago'], false, '4 months ago is not 5 months ago');
    test(getRelativeDate(0,-5), ['5 months ago'], true, '5 months ago is 5 months ago');
    test(getRelativeDate(0,-5), ['6 months ago'], false, '6 months ago is not 5 months ago');
    test(getRelativeDate(0,-5), ['7 months ago'], false, '7 months ago is accurate to months');

    test(getRelativeDate(-5), ['4 years ago'], false, '4 years ago is not 5 years ago');
    test(getRelativeDate(-5), ['5 years ago'], true, '5 years ago is 5 years ago');
    test(getRelativeDate(-5), ['6 years ago'], false, '6 years ago is not 5 years ago');
    test(getRelativeDate(-5), ['7 years ago'], false, '7 years ago is not 5 years ago');

    test(testCreateDate('tomorrow'), ['future'], true, 'tomorrow is the future');
    test(testCreateDate('tomorrow'), ['past'], false, 'tomorrow is the past');

    test(new Date(), ['future'], false, 'now is the future');
    test(new Date(), ['past', 100], false, 'now is the past');

    test(testCreateDate('yesterday'), ['future'], false, 'yesterday is the future');
    test(testCreateDate('yesterday'), ['past'], true, 'yesterday is the past');

    test(testCreateDate('monday'), ['weekday'], true, 'monday is a weekday');
    test(testCreateDate('monday'), ['weekend'], false, 'monday is a weekend');

    test(testCreateDate('friday'), ['weekday'], true, 'friday is a weekday');
    test(testCreateDate('friday'), ['weekend'], false, 'friday is a weekend');

    test(testCreateDate('saturday'), ['weekday'], false, 'saturday is a weekday');
    test(testCreateDate('saturday'), ['weekend'], true, 'saturday is a weekend');

    test(testCreateDate('sunday'), ['weekday'], false, 'sunday is a weekday');
    test(testCreateDate('sunday'), ['weekend'], true, 'sunday is a weekend');

    test(new Date(2001,5,4,12,22,34,445), [new Date(2001,5,4,12,22,34,445)], true, 'straight dates passed in are accurate to the millisecond');
    test(new Date(2001,5,4,12,22,34,445), [new Date(2001,5,4,12,22,34,444)], false, 'straight dates passed in are accurate to the millisecond');
    test(new Date(2001,5,4,12,22,34,445), [new Date(2001,5,4,12,22,34,446)], false, 'straight dates passed in are accurate to the millisecond');

    test(testCreateDate('3 hours ago'), ['now', 'bloopie'], false, 'does not die on string-based precision');

    test(new Date(2001, 5, 4), [{ year: 2001 }], true, 'is 2001 by object');

    // Issue #160
    test(testCreateDate('12/01/2013'), ['November 2013'], false, 'December 2013 is not November 2013');

  });

  method('isLeapYear', function() {
    test(testCreateDate('2008'), true, '2008');
    test(testCreateDate('2009'), false, '2009');
    test(testCreateDate('2010'), false, '2010');
    test(testCreateDate('2011'), false, '2011');
    test(testCreateDate('2012'), true, '2012');
    test(testCreateDate('2016'), true, '2016');
    test(testCreateDate('2020'), true, '2020');
    test(testCreateDate('2021'), false, '2021');
    test(testCreateDate('1600'), true, '1600');
    test(testCreateDate('1700'), false, '1700');
    test(testCreateDate('1800'), false, '1800');
    test(testCreateDate('1900'), false, '1900');
    test(testCreateDate('2000'), true, '2000');
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

    var d = new Date();
    var offset = d.getTime() - getRelativeDate(0, 0, -7).getTime();
    var since, until;

    // I'm occasionally seeing some REALLY big lags with IE here (up to 500ms), so giving a 1s buffer here.
    //
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

    equal(run(d, 'minutesSince', ['last week']), Math.round(offset / 1000 / 60), 'minutes since last week');
    equal(run(d, 'minutesUntil', ['last week']), Math.round(-offset / 1000 / 60), 'minutes until last week');
    equal(run(d, 'hoursSince', ['last week']), Math.round(offset / 1000 / 60 / 60), 'hours since last week');
    equal(run(d, 'hoursUntil', ['last week']), Math.round(-offset / 1000 / 60 / 60), 'hours until last week');
    equal(run(d, 'daysSince', ['last week']), Math.round(offset / 1000 / 60 / 60 / 24), 'days since last week');
    equal(run(d, 'daysUntil', ['last week']), Math.round(-offset / 1000 / 60 / 60 / 24), 'days until last week');
    equal(run(d, 'weeksSince', ['last week']), Math.round(offset / 1000 / 60 / 60 / 24 / 7), 'weeks since last week');
    equal(run(d, 'weeksUntil', ['last week']), Math.round(-offset / 1000 / 60 / 60 / 24 / 7), 'weeks until last week');
    equal(run(d, 'monthsSince', ['last week']), Math.round(offset / 1000 / 60 / 60 / 24 / 30.4375), 'months since last week');
    equal(run(d, 'monthsUntil', ['last week']), Math.round(-offset / 1000 / 60 / 60 / 24 / 30.4375), 'months until last week');
    equal(run(d, 'yearsSince', ['last week']), Math.round(offset / 1000 / 60 / 60 / 24 / 365.25), 'years since last week');
    equal(run(d, 'yearsUntil', ['last week']), Math.round(-offset / 1000 / 60 / 60 / 24 / 365.25), 'years until the last day of 2011');

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

  group('Beginning/End', function() {

    var d = new Date('August 5, 2010 13:45:02');

    equal(dateRun(d, 'beginningOfDay'), new Date(2010, 7, 5), 'beginningOfDay');
    equal(dateRun(d, 'beginningOfWeek'), new Date(2010, 7, 1), 'beginningOfWeek');
    equal(dateRun(d, 'beginningOfMonth'), new Date(2010, 7), 'beginningOfMonth');
    equal(dateRun(d, 'beginningOfYear'), new Date(2010, 0), 'beginningOfYear');

    equal(dateRun(d, 'endOfDay'), new Date(2010, 7, 5, 23, 59, 59, 999), 'endOfDay');
    equal(dateRun(d, 'endOfWeek'), new Date(2010, 7, 7, 23, 59, 59, 999), 'endOfWeek');
    equal(dateRun(d, 'endOfMonth'), new Date(2010, 7, 31, 23, 59, 59, 999), 'endOfMonth');
    equal(dateRun(d, 'endOfYear'), new Date(2010, 11, 31, 23, 59, 59, 999), 'endOfYear');

    equal(dateRun(d, 'beginningOfWeek', ['en-GB']), new Date(2010, 7, 2), 'beginningOfWeek | optional locale code');
    equal(dateRun(d, 'endOfWeek', ['en-GB']), new Date(2010, 7, 8, 23, 59, 59, 999), 'endOfWeek | optional locale code');

    var d = new Date('January 1, 1979 01:33:42');

    equal(dateRun(d, 'beginningOfDay'), new Date(1979, 0, 1), 'beginningOfDay | January 1, 1979');
    equal(dateRun(d, 'beginningOfWeek'), new Date(1978, 11, 31), 'beginningOfWeek | January 1, 1979');
    equal(dateRun(d, 'beginningOfMonth'), new Date(1979, 0), 'beginningOfMonth | January 1, 1979');
    equal(dateRun(d, 'beginningOfYear'), new Date(1979, 0), 'beginningOfYear | January 1, 1979');

    equal(dateRun(d, 'endOfDay'), new Date(1979, 0, 1, 23, 59, 59, 999), 'endOfDay | January 1, 1979');
    equal(dateRun(d, 'endOfWeek'), new Date(1979, 0, 6, 23, 59, 59, 999), 'endOfWeek | January 1, 1979');
    equal(dateRun(d, 'endOfMonth'), new Date(1979, 0, 31, 23, 59, 59, 999), 'endOfMonth | January 1, 1979');
    equal(dateRun(d, 'endOfYear'), new Date(1979, 11, 31, 23, 59, 59, 999), 'endOfYear | January 1, 1979');

    var d = new Date('December 31, 1945 01:33:42');

    equal(dateRun(d, 'beginningOfDay'), new Date(1945, 11, 31), 'beginningOfDay | January 1, 1945');
    equal(dateRun(d, 'beginningOfWeek'), new Date(1945, 11, 30), 'beginningOfWeek | January 1, 1945');
    equal(dateRun(d, 'beginningOfMonth'), new Date(1945, 11), 'beginningOfMonth | January 1, 1945');
    equal(dateRun(d, 'beginningOfYear'), new Date(1945, 0), 'beginningOfYear | January 1, 1945');

    equal(dateRun(d, 'endOfDay'), new Date(1945, 11, 31, 23, 59, 59, 999), 'endOfDay | January 1, 1945');
    equal(dateRun(d, 'endOfWeek'), new Date(1946, 0, 5, 23, 59, 59, 999), 'endOfWeek | January 1, 1945');
    equal(dateRun(d, 'endOfMonth'), new Date(1945, 11, 31, 23, 59, 59, 999), 'endOfMonth | January 1, 1945');
    equal(dateRun(d, 'endOfYear'), new Date(1945, 11, 31, 23, 59, 59, 999), 'endOfYear | January 1, 1945');

    var d = new Date('February 29, 2012 22:15:42');

    equal(dateRun(d, 'beginningOfDay'), new Date(2012, 1, 29), 'beginningOfDay | February 29, 2012');
    equal(dateRun(d, 'beginningOfWeek'), new Date(2012, 1, 26), 'beginningOfWeek | February 29, 2012');
    equal(dateRun(d, 'beginningOfMonth'), new Date(2012, 1), 'beginningOfMonth | February 29, 2012');
    equal(dateRun(d, 'beginningOfYear'), new Date(2012, 0), 'beginningOfYear | February 29, 2012');

    equal(dateRun(d, 'endOfDay'), new Date(2012, 1, 29, 23, 59, 59, 999), 'endOfDay | February 29, 2012');
    equal(dateRun(d, 'endOfWeek'), new Date(2012, 2, 3, 23, 59, 59, 999), 'endOfWeek | February 29, 2012');
    equal(dateRun(d, 'endOfMonth'), new Date(2012, 1, 29, 23, 59, 59, 999), 'endOfMonth | February 29, 2012');
    equal(dateRun(d, 'endOfYear'), new Date(2012, 11, 31, 23, 59, 59, 999), 'endOfYear | February 29, 2012');

    var d = run(testCreateUTCDate('January 1, 2010 02:00:00'), 'setUTC', [true]);

    equal(dateRun(d, 'beginningOfDay'), new Date(Date.UTC(2010, 0)), 'beginningOfDay | utc');
    equal(dateRun(d, 'beginningOfWeek'), new Date(Date.UTC(2009, 11, 27)), 'beginningOfWeek | utc');
    equal(dateRun(d, 'beginningOfMonth'), new Date(Date.UTC(2010, 0)), 'beginningOfMonth | utc');
    equal(dateRun(d, 'beginningOfYear'), new Date(Date.UTC(2010, 0)), 'beginningOfYear | utc');

    equal(dateRun(d, 'endOfDay'), new Date(Date.UTC(2010, 0, 1, 23, 59, 59, 999)), 'endOfDay | utc');
    equal(dateRun(d, 'endOfWeek'), new Date(Date.UTC(2010, 0, 2, 23, 59, 59, 999)), 'endOfWeek | utc');
    equal(dateRun(d, 'endOfMonth'), new Date(Date.UTC(2010, 0, 31, 23, 59, 59, 999)), 'endOfMonth | utc');
    equal(dateRun(d, 'endOfYear'), new Date(Date.UTC(2010, 11, 31, 23, 59, 59, 999)), 'endOfYear | utc');

  });

  group('addUnit', function() {

    var d = new Date('February 29, 2012 22:15:42');

    equal(dateRun(d, 'addMilliseconds', [12]), new Date(2012, 1, 29, 22, 15, 42, 12), 'addMilliseconds');
    equal(dateRun(d, 'addSeconds', [12]), new Date(2012, 1, 29, 22, 15, 54), 'addSeconds');
    equal(dateRun(d, 'addMinutes', [12]), new Date(2012, 1, 29, 22, 27, 42), 'addMinutes');
    equal(dateRun(d, 'addHours', [12]), new Date(2012, 2, 1, 10, 15, 42), 'addHours');
    equal(dateRun(d, 'addDays', [12]), new Date(2012, 2, 12, 22, 15, 42), 'addDays');
    equal(dateRun(d, 'addWeeks', [12]), new Date(2012, 4, 23, 22, 15, 42), 'addWeeks');
    equal(dateRun(d, 'addMonths', [12]), new Date(2013, 1, 28, 22, 15, 42), 'addMonths');
    equal(dateRun(d, 'addYears', [12]), new Date(2024, 1, 29, 22, 15, 42), 'addYears');

    equal(dateRun(d, 'addMilliseconds', [-12]), new Date(2012, 1, 29, 22, 15, 41, 988), 'addMilliseconds | negative');
    equal(dateRun(d, 'addSeconds', [-12]), new Date(2012, 1, 29, 22, 15, 30), 'addSeconds | negative');
    equal(dateRun(d, 'addMinutes', [-12]), new Date(2012, 1, 29, 22, 3, 42), 'addMinutes | negative');
    equal(dateRun(d, 'addHours', [-12]), new Date(2012, 1, 29, 10, 15, 42), 'addHours | negative');
    equal(dateRun(d, 'addDays', [-12]), new Date(2012, 1, 17, 22, 15, 42), 'addDays | negative');
    equal(dateRun(d, 'addWeeks', [-12]), new Date(2011, 11, 7, 22, 15, 42), 'addWeeks | negative');
    equal(dateRun(d, 'addMonths', [-12]), new Date(2011, 1, 28, 22, 15, 42), 'addMonths | negative');
    equal(dateRun(d, 'addYears', [-12]), new Date(2000, 1, 29, 22, 15, 42), 'addYears | negative');

    // Issue #221

    equal(dateRun(new Date(2012, 0), 'addMonths', [-13]), new Date(2010, 11), 'Date#addMonths | Month traversal should not kick in when n < -12');

  });

  method('reset', function() {

    var d = new Date('February 29, 2012 22:15:42');

    dateTest(d, [], new Date(2012, 1, 29), 'No args resets time');

    dateTest(d, ['year'],        new Date(2012, 0), 'year');
    dateTest(d, ['month'],       new Date(2012, 1, 1), 'month');
    dateTest(d, ['day'],         new Date(2012, 1, 29), 'day');
    dateTest(d, ['hour'],        new Date(2012, 1, 29, 22), 'hour');
    dateTest(d, ['minute'],      new Date(2012, 1, 29, 22, 15), 'minute');
    dateTest(d, ['second'],      new Date(2012, 1, 29, 22, 15, 42), 'second');
    dateTest(d, ['millisecond'], new Date(2012, 1, 29, 22, 15, 42), 'millisecond does nothing');

    dateTest(d, ['year'],         new Date(2012, 0), 'years');
    dateTest(d, ['months'],       new Date(2012, 1, 1), 'months');
    dateTest(d, ['days'],         new Date(2012, 1, 29), 'days');
    dateTest(d, ['hours'],        new Date(2012, 1, 29, 22), 'hours');
    dateTest(d, ['minutes'],      new Date(2012, 1, 29, 22, 15), 'minutes');
    dateTest(d, ['seconds'],      new Date(2012, 1, 29, 22, 15, 42), 'seconds');
    dateTest(d, ['milliseconds'], new Date(2012, 1, 29, 22, 15, 42), 'milliseconds does nothing');

    dateTest(d, ['date'],  new Date(2012, 1, 29), 'date');
    dateTest(d, ['flegh'], new Date(2012, 1, 29, 22, 15, 42), 'an unknown string will do nothing');

    dateTest(d, ['weeks'], new Date(2012, 1, 26), 'reset week');
    dateTest(d, ['week'],  new Date(2012, 1, 26), 'reset weeks');
    dateTest(d, ['week', 'en-GB'],  new Date(2012, 1, 27), 'reset weeks | en-GB');

    equal(dateRun(d, 'addDays', [5, true]), new Date(2012, 2, 5), 'can also reset the time');

  });

  group('isMethods', function() {

    equal(run(now, 'isYesterday'), false, 'isYesterday');
    equal(run(now, 'isToday'), true, 'isToday');
    equal(run(now, 'isTomorrow'), false, 'isTomorrow');
    equal(run(now, 'isWeekday'), now.getDay() !== 0 && now.getDay() !== 6, 'isWeekday');
    equal(run(now, 'isWeekend'), now.getDay() === 0 || now.getDay() === 6, 'isWeekend');
    equal(run(now, 'isFuture'), false, 'isFuture');
    equal(run(now, 'isPast'), true, 'isPast');

    var d = new Date('February 29, 2008 22:15:42');

    equal(run(d, 'isYesterday'), false, 'isYesterday | February 29, 2008');
    equal(run(d, 'isToday'), false, 'isToday | February 29, 2008');
    equal(run(d, 'isTomorrow'), false, 'isTomorrow | February 29, 2008');
    equal(run(d, 'isWeekday'), true, 'isWeekday | February 29, 2008');
    equal(run(d, 'isWeekend'), false, 'isWeekend | February 29, 2008');
    equal(run(d, 'isFuture'), false, 'isFuture | February 29, 2008');
    equal(run(d, 'isPast'), true, 'isPast | February 29, 2008');

    d.setFullYear(thisYear + 2);

    equal(run(d, 'isYesterday'), false, 'isYesterday | 2 years from now');
    equal(run(d, 'isToday'), false, 'isToday | 2 years from now');
    equal(run(d, 'isTomorrow'), false, 'isTomorrow | 2 years from now');
    equal(run(d, 'isFuture'), true, 'isFuture | 2 years from now');
    equal(run(d, 'isPast'), false, 'isPast | 2 years from now');

    equal(run(now, 'isLastWeek'), false, 'isLastWeek | now');
    equal(run(now, 'isThisWeek'), true,  'isThisWeek | now');
    equal(run(now, 'isNextWeek'), false, 'isNextWeek | now');

    equal(run(now, 'isLastMonth'), false, 'isLastMonth | now');
    equal(run(now, 'isThisMonth'), true,  'isThisMonth | now');
    equal(run(now, 'isNextMonth'), false, 'isNextMonth | now');

    equal(run(now, 'isLastYear'), false, 'isLastYear | now');
    equal(run(now, 'isThisYear'), true,  'isThisYear | now');
    equal(run(now, 'isNextYear'), false, 'isNextYear | now');

    equal(run(getRelativeDate(0,0,-7), 'isLastWeek'), true,  'last week');
    equal(run(getRelativeDate(0,0,-7), 'isThisWeek'), false, 'last week');
    equal(run(getRelativeDate(0,0,-7), 'isNextWeek'), false, 'last week');

    equal(run(getRelativeDate(0,0,7), 'isLastWeek'), false, 'next week');
    equal(run(getRelativeDate(0,0,7), 'isThisWeek'), false, 'next week');
    equal(run(getRelativeDate(0,0,7), 'isNextWeek'), true,  'next week');

    equal(run(testGetWeekday(0), 'isLastWeek'), false, 'sunday is not last week');
    equal(run(testGetWeekday(0), 'isThisWeek'), true,  'sunday is this week');
    equal(run(testGetWeekday(0), 'isNextWeek'), false, 'sunday is not next week');

    equal(run(testGetWeekday(5), 'isLastWeek'), false, 'friday is not last week');
    equal(run(testGetWeekday(5), 'isThisWeek'), true,  'friday is this week');
    equal(run(testGetWeekday(5), 'isNextWeek'), false, 'friday is not next week');

    equal(run(testGetWeekday(6), 'isLastWeek'), false, 'satuday is not last week');
    equal(run(testGetWeekday(6), 'isThisWeek'), true,  'satuday is this week');
    equal(run(testGetWeekday(6), 'isNextWeek'), false, 'satuday is not next week');

    equal(run(testCreateDate('last sunday'), 'isLastWeek'), true,  'last sunday is last week');
    equal(run(testCreateDate('last sunday'), 'isThisWeek'), false, 'last sunday is not this week');
    equal(run(testCreateDate('last sunday'), 'isNextWeek'), false, 'last sunday is not next week');

    equal(run(testCreateDate('next sunday'), 'isLastWeek'), false, 'next sunday is not last week');
    equal(run(testCreateDate('next sunday'), 'isThisWeek'), false, 'next sunday is not this week');
    equal(run(testCreateDate('next sunday'), 'isNextWeek'), true,  'next sunday is next week');

    equal(run(testCreateDate('last monday'), 'isLastWeek'), true,  'last monday is last week');
    equal(run(testCreateDate('last monday'), 'isThisWeek'), false, 'last monday is not this week');
    equal(run(testCreateDate('last monday'), 'isNextWeek'), false, 'last monday is not next week');

    equal(run(testCreateDate('next monday'), 'isLastWeek'), false, 'next monday is not last week');
    equal(run(testCreateDate('next monday'), 'isThisWeek'), false, 'next monday is not this week');
    equal(run(testCreateDate('next monday'), 'isNextWeek'), true,  'next monday is next week');

    equal(run(testCreateDate('last friday'), 'isLastWeek'), true,  'last friday is last week');
    equal(run(testCreateDate('last friday'), 'isThisWeek'), false, 'last friday is not this week');
    equal(run(testCreateDate('last friday'), 'isNextWeek'), false, 'last friday is not next week');

    equal(run(testCreateDate('next friday'), 'isLastWeek'), false, 'next friday is not last week');
    equal(run(testCreateDate('next friday'), 'isThisWeek'), false, 'next friday is not this week');
    equal(run(testCreateDate('next friday'), 'isNextWeek'), true,  'next friday is next week');

    equal(run(testCreateDate('last saturday'), 'isLastWeek'), true,  'last saturday is last week');
    equal(run(testCreateDate('last saturday'), 'isThisWeek'), false, 'last saturday is not this week');
    equal(run(testCreateDate('last saturday'), 'isNextWeek'), false, 'last saturday is not next week');

    equal(run(testCreateDate('next saturday'), 'isLastWeek'), false, 'next saturday is not last week');
    equal(run(testCreateDate('next saturday'), 'isThisWeek'), false, 'next saturday is not this week');
    equal(run(testCreateDate('next saturday'), 'isNextWeek'), true,  'next saturday is next week');

    equal(run(testCreateDate('the beginning of the week'), 'isLastWeek'), false, 'the beginning of the week is not last week');
    equal(run(testCreateDate('the beginning of the week'), 'isThisWeek'), true, 'the beginning of the week is this week');
    equal(run(testCreateDate('the beginning of the week'), 'isNextWeek'), false, 'the beginning of the week is not next weeek');


    var d = testCreateDate('the beginning of the week');
    run(d, 'addMinutes', [-1]);

    equal(run(d, 'isLastWeek'), true, 'isLastWeek | the beginning of the week - 1 minute');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the beginning of the week - 1 minute');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the beginning of the week - 1 minute');


    var d = testCreateDate('the end of the week');

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the end of the week');
    equal(run(d, 'isThisWeek'), true, 'isThisWeek | the end of the week');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the end of the week');


    var d = testCreateDate('the end of the week');
    run(d, 'addMinutes', [1]);

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the end of the week + 1 minute');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the end of the week + 1 minute');
    equal(run(d, 'isNextWeek'), true, 'isNextWeek | the end of the week + 1 minute');


    var d = testCreateDate('the beginning of last week');

    equal(run(d, 'isLastWeek'), true, 'isLastWeek | the beginning of last week');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the beginning of last week');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the beginning of last week');


    var d = testCreateDate('the beginning of last week');
    run(d, 'addMinutes', [-1]);

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the beginning of last week - 1 minute');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the beginning of last week - 1 minute');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the beginning of last week - 1 minute');


    var d = testCreateDate('the end of next week');

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the end of next week');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the end of next week');
    equal(run(d, 'isNextWeek'), true, 'isNextWeek | the end of next week');


    var d = testCreateDate('the end of next week');
    run(d, 'addMinutes', [1]);

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the end of next week + 1 minute');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the end of next week + 1 minute');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the end of next week + 1 minute');


    var d = testCreateDate('the end of last week');

    equal(run(d, 'isLastWeek'), true, 'isLastWeek | the end of last week');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the end of last week');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the end of last week');


    var d = testCreateDate('the end of last week');
    run(d, 'addMinutes', [1]);

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the end of last week + 1 minute');
    equal(run(d, 'isThisWeek'), true, 'isThisWeek | the end of last week + 1 minute');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the end of last week + 1 minute');


    var d = testCreateDate('the beginning of next week');

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the beginning of next week');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the beginning of next week');
    equal(run(d, 'isNextWeek'), true, 'isNextWeek | the beginning of next week');


    var d = testCreateDate('the beginning of next week');
    run(d, 'addMinutes', [-1]);

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the beginning of next week - 1 minute');
    equal(run(d, 'isThisWeek'), true, 'isThisWeek | the beginning of next week - 1 minute');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the beginning of next week - 1 minute');


    equal(run(getRelativeDate(0, -1), 'isLastWeek'), false, 'isLastWeek | last month');
    equal(run(getRelativeDate(0, -1), 'isThisWeek'), false, 'isThisWeek | last month');
    equal(run(getRelativeDate(0, -1), 'isNextWeek'), false, 'isNextWeek | last month');
    equal(run(getRelativeDate(0, -1), 'isLastMonth'), true, 'isLastMonth | last month');
    equal(run(getRelativeDate(0, -1), 'isThisMonth'), false, 'isThisMonth | last month');
    equal(run(getRelativeDate(0, -1), 'isNextMonth'), false, 'isNextMonth | last month');

    equal(run(getRelativeDate(0, 1), 'isLastWeek'), false, 'isLastWeek | next month');
    equal(run(getRelativeDate(0, 1), 'isThisWeek'), false, 'isThisWeek | next month');
    equal(run(getRelativeDate(0, 1), 'isNextWeek'), false, 'isNextWeek | next month');
    equal(run(getRelativeDate(0, 1), 'isLastMonth'), false, 'isLastMonth | next month');
    equal(run(getRelativeDate(0, 1), 'isThisMonth'), false, 'isThisMonth | next month');
    equal(run(getRelativeDate(0, 1), 'isNextMonth'), true, 'isNextMonth | next month');

    equal(run(getRelativeDate(-1), 'isLastWeek'), false, 'isLastWeek | last year');
    equal(run(getRelativeDate(-1), 'isThisWeek'), false, 'isThisWeek | last year');
    equal(run(getRelativeDate(-1), 'isNextWeek'), false, 'isNextWeek | last year');
    equal(run(getRelativeDate(-1), 'isLastMonth'), false, 'isLastMonth | last year');
    equal(run(getRelativeDate(-1), 'isThisMonth'), false, 'isThisMonth | last year');
    equal(run(getRelativeDate(-1), 'isNextMonth'), false, 'isNextMonth | last year');
    equal(run(getRelativeDate(-1), 'isLastYear'), true, 'isLastYear | last year');
    equal(run(getRelativeDate(-1), 'isThisYear'), false, 'isThisYear | last year');
    equal(run(getRelativeDate(-1), 'isNextYear'), false, 'isNextYear | last year');

    equal(run(getRelativeDate(1), 'isLastWeek'), false, 'isLastWeek | next year');
    equal(run(getRelativeDate(1), 'isThisWeek'), false, 'isThisWeek | next year');
    equal(run(getRelativeDate(1), 'isNextWeek'), false, 'isNextWeek | next year');
    equal(run(getRelativeDate(1), 'isLastMonth'), false, 'isLastMonth | next year');
    equal(run(getRelativeDate(1), 'isThisMonth'), false, 'isThisMonth | next year');
    equal(run(getRelativeDate(1), 'isNextMonth'), false, 'isNextMonth | next year');
    equal(run(getRelativeDate(1), 'isLastYear'), false, 'isLastYear | next year');
    equal(run(getRelativeDate(1), 'isThisYear'), false, 'isThisYear | next year');
    equal(run(getRelativeDate(1), 'isNextYear'), true, 'isNextYear | next year');

    equal(run(run(new Date, 'beginningOfWeek'), 'isLastWeek'), false, 'the beginning of this week is not last week');

    // en-GB defines Monday as the beginning of the week. This means however that
    // depending on what day it is, "Sunday" could be last week or it could be this week.

    var isSunday = new Date().getDay() === 0;

    equal(run(testGetWeekday(0), 'isLastWeek', ['en-GB']), isSunday ? false : true,  'en-GB | sunday could be last week');
    equal(run(testGetWeekday(0), 'isThisWeek', ['en-GB']), isSunday ? true : false, 'en-GB | sunday could be this week');
    equal(run(testGetWeekday(0), 'isNextWeek', ['en-GB']), false, 'en-GB | sunday is not next week');

    equal(run(testGetWeekday(0,-1), 'isLastWeek', ['en-GB']), isSunday ? true : false, 'en-GB | last sunday could be last week');
    equal(run(testGetWeekday(0,-1), 'isThisWeek', ['en-GB']), false, 'en-GB | last sunday is not this week');
    equal(run(testGetWeekday(0,-1), 'isNextWeek', ['en-GB']), false, 'en-GB | last sunday is not next week');

    equal(run(testGetWeekday(0, 1), 'isLastWeek', ['en-GB']), false, 'en-GB | next sunday is not last week');
    equal(run(testGetWeekday(0, 1), 'isThisWeek', ['en-GB']), isSunday ? false : true,  'en-GB | next sunday could be this week');
    equal(run(testGetWeekday(0, 1), 'isNextWeek', ['en-GB']), isSunday ? true : false, 'en-GB | next sunday could be next week');

  });

  group('isDateOfWeek', function() {

    equal(run(new Date(2001, 11, 28), 'isSunday'), false, 'isSunday');
    equal(run(new Date(2001, 11, 28), 'isMonday'), false, 'isMonday');
    equal(run(new Date(2001, 11, 28), 'isTuesday'), false, 'isTuesday');
    equal(run(new Date(2001, 11, 28), 'isWednesday'), false, 'isWednesday');
    equal(run(new Date(2001, 11, 28), 'isThursday'), false, 'isThursday');
    equal(run(new Date(2001, 11, 28), 'isFriday'), true, 'isFriday');
    equal(run(new Date(2001, 11, 28), 'isSaturday'), false, 'isSaturday');

    equal(run(new Date(2001, 11, 28), 'isJanuary'), false, 'isJanuary');
    equal(run(new Date(2001, 11, 28), 'isFebruary'), false, 'isFebruary');
    equal(run(new Date(2001, 11, 28), 'isMarch'), false, 'isMarch');
    equal(run(new Date(2001, 11, 28), 'isApril'), false, 'isApril');
    equal(run(new Date(2001, 11, 28), 'isMay'), false, 'isMay');
    equal(run(new Date(2001, 11, 28), 'isJune'), false, 'isJune');
    equal(run(new Date(2001, 11, 28), 'isJuly'), false, 'isJuly');
    equal(run(new Date(2001, 11, 28), 'isAugust'), false, 'isAugust');
    equal(run(new Date(2001, 11, 28), 'isSeptember'), false, 'isSeptember');
    equal(run(new Date(2001, 11, 28), 'isOctober'), false, 'isOctober');
    equal(run(new Date(2001, 11, 28), 'isNovember'), false, 'isNovember');
    equal(run(new Date(2001, 11, 28), 'isDecember'), true, 'isDecember');

  });

  method('isAfter', function() {

    dateTest(new Date(2001,1,23), [new Date(2000,1,23)], true, 'January 23, 2000');
    dateTest(new Date(2001,1,23), [new Date(2002,1,23)], false, 'January 23, 2002');

    dateTest(new Date(1999,0), [new Date(1998)], true, '1999');
    dateTest(new Date(1998,2), [new Date(1998,1)], true, 'March, 1998');
    dateTest(new Date(1998,1,24), [new Date(1998,1,23)], true, 'February 24, 1998');
    dateTest(new Date(1998,1,23,12), [new Date(1998,1,23,11)], true, 'February 23, 1998 12pm');
    dateTest(new Date(1998,1,23,11,55), [new Date(1998,1,23,11,54)], true, 'February 23, 1998 11:55am');
    dateTest(new Date(1998,1,23,11,54,33), [new Date(1998,1,23,11,54,32)], true, 'February 23, 1998 11:54:33am');
    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,454)], true, 'February 23, 1998 11:54:32.455am');

    dateTest(new Date(1999,1), [{ year: 1998 }], true, 'object | 1999');
    dateTest(new Date(1998,2), [{ year: 1998, month: 1 }], true, 'object | March, 1998');
    dateTest(new Date(1998,1,24), [{ year: 1998, month: 1, day: 23 }], true, 'object | February 24, 1998');
    dateTest(new Date(1998,1,23,12), [{ year: 1998, month: 1, day: 23, hour: 11 }], true, 'object | February 23, 1998 12pm');
    dateTest(new Date(1998,1,23,11,55), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }], true, 'object | February 23, 1998 11:55am');
    dateTest(new Date(1998,1,23,11,54,33), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }], true, 'object | February 23, 1998 11:54:33am');
    dateTest(new Date(1998,1,23,11,54,32,455), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }], true, 'object | February 23, 1998 11:54:32.455am');

    dateTest(new Date(1999,1), ['1998'], true, 'string | 1998');
    dateTest(new Date(1998,2), ['February, 1998'], true, 'string | February, 1998');
    dateTest(new Date(1998,1,24), ['February 23, 1998'], true, 'string | February 23, 1998');
    dateTest(new Date(1998,1,23,12), ['February 23, 1998 11am'], true, 'string | February 23, 1998 11pm');
    dateTest(new Date(1998,1,23,11,55), ['February 23, 1998 11:54am'], true, 'string | February 23, 1998 11:54am');
    dateTest(new Date(1998,1,23,11,54,33), ['February 23, 1998 11:54:32am'], true, 'string | February 23, 1998 11:54:32am');
    dateTest(new Date(1998,1,23,11,54,32,455), ['February 23, 1998 11:54:32.454am'], true, 'string | February 23, 1998 11:54:32.454am');

    dateTest(new Date(1999,5), ['1999'], true, 'June 1999 is after implied January 1999');
    dateTest(getRelativeDate(1), ['tomorrow'], true, 'relative | next year');
    dateTest(getRelativeDate(0, 1), ['tomorrow'], true, 'relative | next month');
    dateTest(getRelativeDate(0, 0, 1), ['tomorrow'], true, 'relative | tomorrow');

    dateTest(testGetWeekday(0),    ['monday'], false, 'relative | sunday');
    dateTest(testGetWeekday(2),    ['monday'], true, 'relative | tuesday');
    dateTest(testGetWeekday(0, 1), ['monday'], true, 'relative | next week sunday');
    dateTest(testGetWeekday(0,-1), ['monday'], false, 'relative | last week sunday');
    dateTest(testGetWeekday(0),    ['the beginning of this week'], false, 'relative | the beginning of this week');
    dateTest(testGetWeekday(0),    ['the beginning of last week'], true, 'relative | the beginning of last week');
    dateTest(testGetWeekday(0),    ['the end of this week'], false, 'relative | the end of this week');

    dateTest(new Date(2001,1,23), [new Date(2000,1,24), 24 * 60 * 60 * 1000], true, 'buffers work');
    dateTest(new Date(1999,1), [{ year: 1999 }], true, 'February 1999 is after implied January 1999');
    dateTest(new Date(1998,10), [{ year: 1999 }, 90 * 24 * 60 * 60 * 1000], true, 'November 1998 is after implied January 1999 with 90 days of margin');

  });

  method('isBefore', function() {

    dateTest(new Date(2001,1,23), [new Date(2000,1,23)], false, 'January 23, 2000');
    dateTest(new Date(2001,1,23), [new Date(2002,1,23)], true, 'January 23, 2002');

    dateTest(new Date(1999,0), [new Date(1998)], false, '1999');
    dateTest(new Date(1998,2), [new Date(1998,1)], false, 'March, 1998');
    dateTest(new Date(1998,1,24), [new Date(1998,1,23)], false, 'February 24, 1998');
    dateTest(new Date(1998,1,23,12), [new Date(1998,1,23,11)], false, 'February 23, 1998 12pm');
    dateTest(new Date(1998,1,23,11,55), [new Date(1998,1,23,11,54)], false, 'February 23, 1998 11:55am');
    dateTest(new Date(1998,1,23,11,54,33), [new Date(1998,1,23,11,54,34)], true, 'February 23, 1998 11:54:34am');
    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,454)], false, 'February 23, 1998 11:54:32.455am');

    dateTest(new Date(1999,1), [{ year: 1998 }], false, 'object | 1999');
    dateTest(new Date(1998,2), [{ year: 1998, month: 1 }], false, 'object | March, 1998');
    dateTest(new Date(1998,1,24), [{ year: 1998, month: 1, day: 23 }], false, 'object | February 24, 1998');
    dateTest(new Date(1998,1,23,12), [{ year: 1998, month: 1, day: 23, hour: 11 }], false, 'object | February 23, 1998 12pm');
    dateTest(new Date(1998,1,23,11,55), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }], false, 'object | February 23, 1998 11:55am');
    dateTest(new Date(1998,1,23,11,54,33), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }], false, 'object | February 23, 1998 11:54:33am');
    dateTest(new Date(1998,1,23,11,54,32,455), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }], false, 'object | February 23, 1998 11:54:32.455am');

    dateTest(new Date(1997,11,31,23,59,59,999), [{ year: 1998 }], true, 'object | 1999');
    dateTest(new Date(1998,0), [{ year: 1998, month: 1 }], true, 'object | March, 1998');
    dateTest(new Date(1998,1,22), [{ year: 1998, month: 1, day: 23 }], true, 'object | February 24, 1998');
    dateTest(new Date(1998,1,23,10), [{ year: 1998, month: 1, day: 23, hour: 11 }], true, 'object | February 23, 1998 12pm');
    dateTest(new Date(1998,1,23,11,53), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }], true, 'object | February 23, 1998 11:55am');
    dateTest(new Date(1998,1,23,11,54,31), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }], true, 'object | February 23, 1998 11:54:33am');
    dateTest(new Date(1998,1,23,11,54,32,453), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }], true, 'object | February 23, 1998 11:54:32.455am');

    dateTest(new Date(1999,1), ['1998'], false, 'string | 1998');
    dateTest(new Date(1998,2), ['February, 1998'], false, 'string | February, 1998');
    dateTest(new Date(1998,1,24), ['February 23, 1998'], false, 'string | February 23, 1998');
    dateTest(new Date(1998,1,23,12), ['February 23, 1998 11am'], false, 'string | February 23, 1998 11pm');
    dateTest(new Date(1998,1,23,11,55), ['February 23, 1998 11:54am'], false, 'string | February 23, 1998 11:54am');
    dateTest(new Date(1998,1,23,11,54,33), ['February 23, 1998 11:54:32am'], false, 'string | February 23, 1998 11:54:32am');
    dateTest(new Date(1998,1,23,11,54,32,455), ['February 23, 1998 11:54:32.454am'], false, 'string | February 23, 1998 11:54:32.454am');

    dateTest(new Date(1999,5), ['1999'], false, 'June 1999 is not after 1999 in general');
    dateTest(getRelativeDate(1), ['tomorrow'], false, 'relative | next year');
    dateTest(getRelativeDate(0, 1), ['tomorrow'], false, 'relative | next month');
    dateTest(getRelativeDate(0, 0, 1), ['tomorrow'], false, 'relative | tomorrow');

    dateTest(testGetWeekday(0),    ['monday'], true, 'relative | sunday');
    dateTest(testGetWeekday(2),    ['monday'], false, 'relative | tuesday');
    dateTest(testGetWeekday(0, 1), ['monday'], false, 'relative | next week sunday');
    dateTest(testGetWeekday(0,-1), ['monday'], true, 'relative | last week sunday');
    dateTest(testGetWeekday(0),    ['the beginning of this week'], false, 'relative | the beginning of this week');
    dateTest(testGetWeekday(0),    ['the beginning of last week'], false, 'relative | the beginning of last week');
    dateTest(testGetWeekday(0),    ['the end of this week'], true, 'relative | the end of this week');

    dateTest(new Date(2001,1,25), [new Date(2001,1,24), 48 * 60 * 60 * 1000], true, 'buffers work');

  });

  method('isBetween', function() {

    dateTest(new Date(2001,1,23), [new Date(2000,1,23), new Date(2002,1,23)], true, 'January 23, 2001 is between January 23, 2000 and January 23, 2002');
    dateTest(new Date(2001,1,23), [new Date(2002,1,23), new Date(2000,1,23)], true, 'January 23, 2001 is between January 23, 2002 and January 23, 2000');
    dateTest(new Date(1999,1,23), [new Date(2002,1,23), new Date(2000,1,23)], false, 'January 23, 1999 is between January 23, 2002 and January 23, 2000');
    dateTest(new Date(2003,1,23), [new Date(2002,1,23), new Date(2000,1,23)], false, 'January 23, 2003 is between January 23, 2002 and January 23, 2000');

    dateTest(new Date(1998,2), [new Date(1998,1), new Date(1998, 3)], true, 'February, 1998 - April, 1998');
    dateTest(new Date(1998,2), [new Date(1998,1), new Date(1998, 0)], false, 'February, 1998 - January, 1998');
    dateTest(new Date(1998,2), [new Date(1998,5), new Date(1998, 3)], false, 'June, 1998 - April, 1998');

    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,456)], true, 'February 23, 1998 11:54:32.454am - February 23, 1998 11:54:32:456am');
    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,456), new Date(1998,1,23,11,54,32,454)], true, 'February 23, 1998 11:54:32.456am - February 23, 1998 11:54:32:454am');
    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,452)], false, 'February 23, 1998 11:54:32.454am - February 23, 1998 11:54:32:452am');
    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,456), new Date(1998,1,23,11,54,32,458)], false, 'February 23, 1998 11:54:32.456am - February 23, 1998 11:54:32:458am');

    dateTest(new Date(1998,1), [{ year: 1998 }, { year: 1999 }], true, 'object | Feb 1998 is between 1998 - 1999');
    dateTest(new Date(1999,1), [{ year: 1998 }, { year: 1999 }], false, 'object | Feb 1999 is between 1998 - 1999');
    dateTest(new Date(1999,1), [{ year: 1998 }, { year: 1997 }], false, 'object | Feb 1999 is between 1998 - 1997');
    dateTest(new Date(1998,2), [{ year: 1998, month: 1 }, { year: 1998, month: 3 }], true, 'object | March, 1998 is between February, 1998 and April, 1998');
    dateTest(new Date(1998,2), [{ year: 1998, month: 0 }, { year: 1998, month: 1 }], false, 'object | March, 1998 is between January, 1998 and February, 1998');

    dateTest(new Date(1998,1), ['1998', '1999'], true, 'string | Feb 1998 is between 1998 - 1999');
    dateTest(new Date(1999,1), ['1998', '1999'], false, 'string | Feb 1999 is between 1998 - 1999');
    dateTest(new Date(1999,1), ['1998', '1997'], false, 'string | Feb 1998 is between 1998 - 1997');
    dateTest(new Date(1998,2), ['February, 1998', 'April, 1998'], true, 'string | March, 1998 is between February, 1998 and April, 1998');
    dateTest(new Date(1998,2), ['January, 1998', 'February, 1998'], false, 'string | March, 1998 is not between January, 1998 and February, 1998');

    dateTest(new Date(1999,5), ['1998','1999'], false, 'Ambiguous periods are hard coded to the ms, there is no "implied specificity" as with Date#is');

    dateTest(new Date(), ['yesterday','tomorrow'], true, 'relative | now is between today and tomorrow');
    dateTest(getRelativeDate(1), ['yesterday','tomorrow'], false, 'relative | last year is between today and tomorrow');
    dateTest(getRelativeDate(0, 1), ['yesterday','tomorrow'], false, 'relative | last month is between today and tomorrow');
    dateTest(getRelativeDate(0, 0, 0), ['today','tomorrow'], true, 'relative | right now is between today and tomorrow');
    dateTest(getRelativeDate(0, 0, 1), ['today','tomorrow'], false, 'relative | tomorrow is between today and tomorrow');

    dateTest(testGetWeekday(0),    ['monday', 'friday'], false, 'relative | sunday is between monday and friday');
    dateTest(testGetWeekday(2),    ['monday', 'friday'], true, 'relative | tuesday is between monday and friday');
    dateTest(testGetWeekday(0, 1), ['monday', 'friday'], false, 'relative | next week sunday is between monday and friday');
    dateTest(testGetWeekday(0,-1), ['monday', 'friday'], false, 'relative | last week sunday is between monday and friday');
    dateTest(testGetWeekday(0),    ['the beginning of this week','the beginning of last week'], true, 'relative | sunday is between the beginning of this week and the beginning of last week');
    dateTest(testGetWeekday(0),    ['the beginning of this week','the beginning of next week'], true, 'relative | sunday is between the beginning of this week and the beginning of next week');
    dateTest(testGetWeekday(0),    ['the beginning of last week','the beginning of next week'], true, 'relative | sunday is between the beginning of last week and the beginning of next week');
    dateTest(testGetWeekday(0),    ['the beginning of last week','the end of this week'], true, 'relative | sunday is between the beginning of last week and the end of this week');

    dateTest(testCreateDate('yesterday'), ['yesterday', 'today'], true, 'today is between yesterday and today');
    dateTest(testCreateDate('tomorrow'), ['today', 'tomorrow'], true, 'tomrrow is between today and tomorrow');

  });

  method('clone', function() {

    var date1 = testCreateDate('July 4th, 1776');
    var date2 = run(run(date1, 'clone'), 'beginningOfYear');

    equal(date2.getMonth(), 0, 'Date#clone | cloned element is reset to January');
    equal(date1.getMonth(), 6, 'Date#clone | source element is reset to unchanged');

    var date1 = new Date('invalid');
    var date2 = run(date1, 'clone');

    equal(run(date1, 'isValid'), false, 'Date#clone | source element is invalid');
    equal(run(date2, 'isValid'), false, 'Date#clone | cloned element is also invalid');

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

  method('getISOWeek', function() {

    var d = new Date(2010,7,5,13,45,2,542);
    test(d, 31, 'basic August 5th, 2010');
    equal(d, new Date(2010,7,5,13,45,2,542), 'should not modify the date');

    test(new Date(2011, 0, 1), 52, 'January 1, 2011');
    test(new Date(2011, 0, 2), 52, 'January 2, 2011');
    test(new Date(2011, 0, 3),  1, 'January 3, 2011');
    test(new Date(2011, 0, 4),  1, 'January 4, 2011');

    test(new Date(2011, 11, 25), 51, 'December 25, 2011');
    test(new Date(2011, 11, 26), 52, 'December 26, 2011');
    test(new Date(2011, 11, 27), 52, 'December 27, 2011');

    test(new Date(2011, 11, 31), 52, 'December 31, 2011');
    test(new Date(2012, 0, 1),   52, 'January 1, 2012');
    test(new Date(2012, 0, 2),    1, 'January 2, 2012');

    test(new Date(2013, 11, 28), 52, 'December 28, 2013');
    test(new Date(2013, 11, 29), 52, 'December 29, 2013');
    test(new Date(2013, 11, 30),  1, 'December 30, 2013');
    test(new Date(2013, 11, 31),  1, 'December 31, 2013');
    test(new Date(2014,  0,  1),  1, 'January 01, 2014');
    test(new Date(2014,  0,  2),  1, 'January 02, 2014');
    test(new Date(2014,  0,  5),  1, 'January 05, 2014');
    test(new Date(2014,  0,  6),  2, 'January 06, 2014');

    test(new Date(2010, 0, 1), 53, 'January 1st, 2010');
    test(new Date(2010, 0, 6), 1, 'January 6th, 2010');
    test(new Date(2010, 0, 7), 1, 'January 7th, 2010');
    test(new Date(2010, 0, 7, 23, 59, 59, 999), 1, 'January 7th, 2010 h23:59:59.999');
    test(new Date(2010, 0, 8), 1, 'January 8th, 2010');
    test(new Date(2010, 3, 15), 15, 'April 15th, 2010');

    var d = run(new Date(2010,7,5,13,45,2,542), 'setUTC', [true]);
    test(d, d.getTimezoneOffset() > 615 ? 32 : 31, 'utc | basic');
    test(new Date(2010, 0, 1), 53, 'utc | January 1st UTC is actually 2009');
    test(new Date(2010, 0, 6), 1, 'utc | January 6th');
    test(new Date(2010, 0, 7), 1, 'utc | January 7th');
    test(new Date(2010, 0, 7, 23, 59, 59, 999), 1, 'utc | January 7th 23:59:59.999');
    test(new Date(2010, 0, 8), 1, 'utc | January 8th');
    test(new Date(2010, 3, 15), 15, 'utc | April 15th');

  });

  method('iso', function() {

    var d = new Date('August 5, 2010 04:03:02');
    var expected = run(run(d, 'setUTC', [true]), 'format', ['ISO8601']);
    test(d, expected, 'Date#iso is an alias for the ISO8601 format in UTC');

    // Issue #146 - These tests were failing when system time was set to Friday, June 1, 2012 PDT

    test(testCreateDate('2010-01-20T20:00:00.000Z'), '2010-01-20T20:00:00.000Z');
    test(testCreateDate('2010-02-20T20:00:00.000Z'), '2010-02-20T20:00:00.000Z');
    test(testCreateDate('2010-03-20T20:00:00.000Z'), '2010-03-20T20:00:00.000Z');
    test(testCreateDate('2010-04-20T20:00:00.000Z'), '2010-04-20T20:00:00.000Z');
    test(testCreateDate('2010-05-20T20:00:00.000Z'), '2010-05-20T20:00:00.000Z');
    test(testCreateDate('2010-05-20T20:00:00.000Z'), '2010-05-20T20:00:00.000Z');
    test(testCreateDate('2010-06-20T20:00:00.000Z'), '2010-06-20T20:00:00.000Z');
    test(testCreateDate('2010-07-20T20:00:00.000Z'), '2010-07-20T20:00:00.000Z');
    test(testCreateDate('2010-08-20T20:00:00.000Z'), '2010-08-20T20:00:00.000Z');
    test(testCreateDate('2010-09-20T20:00:00.000Z'), '2010-09-20T20:00:00.000Z');
    test(testCreateDate('2010-10-20T20:00:00.000Z'), '2010-10-20T20:00:00.000Z');
    test(testCreateDate('2010-11-20T20:00:00.000Z'), '2010-11-20T20:00:00.000Z');
    test(testCreateDate('2010-12-20T20:00:00.000Z'), '2010-12-20T20:00:00.000Z');

    test(testCreateDate('Jan 20 2010 12:00:00 GMT-0800 (PST)'), '2010-01-20T20:00:00.000Z');
    test(testCreateDate('Feb 20 2010 12:00:00 GMT-0800 (PST)'), '2010-02-20T20:00:00.000Z');
    test(testCreateDate('Mar 20 2010 12:00:00 GMT-0800 (PST)'), '2010-03-20T20:00:00.000Z');
    test(testCreateDate('Apr 20 2010 12:00:00 GMT-0800 (PST)'), '2010-04-20T20:00:00.000Z');
    test(testCreateDate('May 20 2010 12:00:00 GMT-0800 (PST)'), '2010-05-20T20:00:00.000Z');
    test(testCreateDate('Jun 20 2010 12:00:00 GMT-0800 (PST)'), '2010-06-20T20:00:00.000Z');
    test(testCreateDate('Jul 20 2010 12:00:00 GMT-0800 (PST)'), '2010-07-20T20:00:00.000Z');
    test(testCreateDate('Aug 20 2010 12:00:00 GMT-0800 (PST)'), '2010-08-20T20:00:00.000Z');
    test(testCreateDate('Sep 20 2010 12:00:00 GMT-0800 (PST)'), '2010-09-20T20:00:00.000Z');
    test(testCreateDate('Oct 20 2010 12:00:00 GMT-0800 (PST)'), '2010-10-20T20:00:00.000Z');
    test(testCreateDate('Nov 20 2010 12:00:00 GMT-0800 (PST)'), '2010-11-20T20:00:00.000Z');
    test(testCreateDate('Dec 20 2010 12:00:00 GMT-0800 (PST)'), '2010-12-20T20:00:00.000Z');

    var d = run(testCreateUTCDate('2001-06-15'), 'setUTC', [true]);
    equal(run(d, 'iso'), '2001-06-15T00:00:00.000Z', 'will properly be output in UTC');

  });

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


  // Issue #326 begining/endOfISOWeek

  method('beginningOfISOWeek', function() {

    test(new Date(2013, 6, 8),  new Date(2013, 6, 8), 'Mon');
    test(new Date(2013, 6, 9),  new Date(2013, 6, 8), 'Tue');
    test(new Date(2013, 6, 10), new Date(2013, 6, 8), 'Wed');
    test(new Date(2013, 6, 11), new Date(2013, 6, 8), 'Thu');
    test(new Date(2013, 6, 12), new Date(2013, 6, 8), 'Fri');
    test(new Date(2013, 6, 13), new Date(2013, 6, 8), 'Sat');
    test(new Date(2013, 6, 14), new Date(2013, 6, 8), 'Sun');
    test(new Date(2013, 6, 15), new Date(2013, 6, 15), 'next Mon');

    test(new Date(2013, 6, 10, 8, 30), new Date(2013, 6, 8), 'resets time');
  });

  method('endOfISOWeek', function() {

    test(new Date(2013, 6, 8),  new Date(2013, 6, 14, 23, 59, 59, 999), 'Mon');
    test(new Date(2013, 6, 9),  new Date(2013, 6, 14, 23, 59, 59, 999), 'Tue');
    test(new Date(2013, 6, 10), new Date(2013, 6, 14, 23, 59, 59, 999), 'Wed');
    test(new Date(2013, 6, 11), new Date(2013, 6, 14, 23, 59, 59, 999), 'Thu');
    test(new Date(2013, 6, 12), new Date(2013, 6, 14, 23, 59, 59, 999), 'Fri');
    test(new Date(2013, 6, 13), new Date(2013, 6, 14, 23, 59, 59, 999), 'Sat');
    test(new Date(2013, 6, 14), new Date(2013, 6, 14, 23, 59, 59, 999), 'Sun');
    test(new Date(2013, 6, 15), new Date(2013, 6, 21, 23, 59, 59, 999), 'next Mon');

    test(new Date(2013, 6, 12, 8, 30), new Date(2013, 6, 14, 23, 59, 59, 999), 'resets time');

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

    var d = new Date;
    d.setTime(d.getTime() + ((d.getTimezoneOffset() + 60) * 60 * 1000));
    equal(run(d, 'isFuture'), true, 'should respect global offset');
    equal(run(d, 'isPast'), false, 'should respect global offset');

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

  group('Month traversal issues', function() {

    // If traversing into a new month don't reset the date if the date was also advanced

    equal(run(new Date(2011, 0, 31), 'advance', [{ month: 1 }]), new Date(2011, 1, 28), 'advanced by month will land on last day if the day does not exist');
    equal(run(new Date(2011, 0, 31), 'advance', [{ month: 1, day: 3 }]), new Date(2011, 2, 3), 'can still advance days after reset');
    equal(run(new Date(2011, 2, 31), 'rewind', [{ month: 1 }]), new Date(2011, 1, 28), 'rewind by month will land on last day if the day does not exist');
    equal(run(new Date(2011, 2, 31), 'rewind', [{ month: 1, day: 3 }]), new Date(2011, 1, 25), 'can still rewind days after reset');
    equal(run(new Date(2011, 0, 31), 'set', [{ month: 1 }]), new Date(2011, 1, 28), 'set does not cause month traversal');
    equal(run(new Date(2011, 0, 31), 'set', [{ month: 1, day: 3 }]), new Date(2011, 1, 3), 'set with day does not cause month traversal');


    var d = run(new Date(2010, 0, 31), 'set', [{ month: 1 }, true]);
    equal(d, new Date(2010, 1), 'reset dates will not accidentally traverse into a different month');

  });

  group('DST Issues', function() {

    // These tests are meant to be run in a North American timezone with DST (PDT, MDT, etc)

    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 1, 45), 'addHours', 1, 'Spring DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 2), 'addHours', -1, 'Spring DST | Reverse');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 1, 1, 45), 'addHours', 15, 'Fall DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 2), 'addHours', -15, 'Fall DST | Reverse');

    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 1, 45), 'addMinutes', 15, 'Spring DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 2), 'addMinutes', -15, 'Spring DST | Reverse');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 1, 1, 45), 'addMinutes', 15, 'Fall DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 2), 'addMinutes', -15, 'Fall DST | Reverse');

    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 1, 59, 59), 'addSeconds', 10, 'Spring DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 2), 'addSeconds', -10, 'Spring DST | Reverse');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 1, 1, 59, 59), 'addSeconds', 10, 'Fall DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 2), 'addSeconds', -10, 'Fall DST | Reverse');

    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 1, 59, 59, 950), 'addMilliseconds', 100, 'Spring DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 2), 'addMilliseconds', -100, 'Spring DST | Reverse');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 1, 1, 59, 59, 950), 'addMilliseconds', 100, 'Fall DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 2), 'addMilliseconds', -100, 'Fall DST | Reverse');

    var d1 = new Date(2015, 2, 8);
    var d2 = run(new Date(d1), 'addDays', [1]);
    var t1 = d1.getTimezoneOffset();
    var t2 = d2.getTimezoneOffset();
    equal(d2 - d1, (24 * 60 * 60 * 1000) + ((t2 - t1) * 60 * 1000), 'adding a day should be equal to 24 hours + whatever change in timezone offset that may have occurred');

    // Catch for DST inequivalencies
    // FAILS IN DAMASCUS IN XP!
    var d = run(new Date(2010, 11, 9, 17), 'set', [{ year: 1998, month: 3, day: 3}, true]);
    equal(d.getHours(), 0, 'handles DST properly');

  });

});

namespace('Number', function () {

  group('Unit Aliases', function() {

    equal(run(4, 'milliseconds'), 4, 'milliseconds | 4');
    equal(run(3.25, 'milliseconds'), 3, 'milliseconds | rounded');

    equal(run(0, 'seconds'), 0, 'seconds | 0');
    equal(run(1, 'seconds'), 1000, 'seconds | 1');
    equal(run(30, 'seconds'), 30000, 'seconds | 30');
    equal(run(60, 'seconds'), 60000, 'seconds | 60');


    equal(run(1, 'minutes'), 60000, 'minutes | 1');
    equal(run(10, 'minutes'), 600000, 'minutes | 10');
    equal(run(100, 'minutes'), 6000000, 'minutes | 100');
    equal(run(0, 'minutes'), 0, 'minutes | 0');
    equal(run(0.5, 'minutes'), 30000, 'minutes | 0.5');
    equal(run(1, 'minutes'), run(60, 'seconds'), 'minutes | 1 minute is 60 seconds');

    equal(run(1, 'hours'), 3600000, 'hours | 1');
    equal(run(10, 'hours'), 36000000, 'hours | 10');
    equal(run(100, 'hours'), 360000000, 'hours | 100');
    equal(run(0, 'hours'), 0, 'hours | 0');
    equal(run(0.5, 'hours'), 1800000, 'hours | 0.5');
    equal(run(1, 'hours'), run(60, 'minutes'), 'hours | 1 hour is 60 minutes');
    equal(run(1, 'hours'), run(3600, 'seconds'), 'hours | 1 hour is 3600 seconds');


    equal(run(1, 'days'), 86400000, 'days | 1');
    equal(run(10, 'days'), 864000000, 'days | 10');
    equal(run(100, 'days'), 8640000000, 'days | 100');
    equal(run(0, 'days'), 0, 'days | 0');
    equal(run(0.5, 'days'), 43200000, 'days | 0.5');
    equal(run(1, 'days'), run(24, 'hours'), 'days | 1 day is 24 hours');
    equal(run(1, 'days'), run(1440, 'minutes'), 'days | 1 day is 1440 minutes');
    equal(run(1, 'days'), run(86400, 'seconds'), 'days | 1 day is 86400 seconds');


    equal(run(1, 'weeks'), 604800000, 'weeks | 1');
    equal(run(0.5, 'weeks'), 302400000, 'weeks | 0.5');
    equal(run(10, 'weeks'), 6048000000, 'weeks | 10');
    equal(run(0, 'weeks'), 0, 'weeks | 0');
    equal(run(1, 'weeks'), run(7, 'days'), 'weeks | 1 week is 7 days');
    equal(run(1, 'weeks'), run(24 * 7, 'hours'), 'weeks | 1 week is 24 * 7 hours');
    equal(run(1, 'weeks'), run(60 * 24 * 7, 'minutes'), 'weeks | 1 week is 60 * 24 * 7 minutes');
    equal(run(1, 'weeks'), run(60 * 60 * 24 * 7, 'seconds'), 'weeks | 1 week is 60 * 60 * 24 * 7 seconds');

    equal(run(1, 'months'), 2629800000, 'months | 1 month');
    equal(run(0.5, 'months'), 1314900000, 'months | 0.5 month');
    equal(run(10, 'months'), 26298000000, 'months | 10 month');
    equal(run(0, 'months'), 0, 'months | 0 months');
    equal(run(1, 'months'), run(30.4375, 'days'), 'months | 1 month is 30.4375 days');
    equal(run(1, 'months'), run(24 * 30.4375, 'hours'), 'months | 1 month is 24 * 30.4375 hours');
    equal(run(1, 'months'), run(60 * 24 * 30.4375, 'minutes'), 'months | 1 month is 60 * 24 * 30.4375 minutes');
    equal(run(1, 'months'), run(60 * 60 * 24 * 30.4375, 'seconds'), 'months | 1 month is 60 * 60 * 24 * 30.4375 seconds');

    equal(run(1, 'years'), 31557600000, 'years | 1');
    equal(run(0.5, 'years'), 15778800000, 'years | 0.5');
    equal(run(10, 'years'), 315576000000, 'years | 10');
    equal(run(0, 'years'), 0, 'years | 0');
    equal(run(1, 'years'), run(365.25, 'days'), 'years | 1 year is 365.25 days');
    equal(run(1, 'years'), run(24 * 365.25, 'hours'), 'years | 1 year is 24 * 365.25 hours');
    equal(run(1, 'years'), run(60 * 24 * 365.25, 'minutes'), 'years | 1 year is 60 * 24 * 365.25 minutes');
    equal(run(1, 'years'), run(60 * 60 * 24 * 365.25, 'seconds'), 'years | 1 year is 60 * 60 * 24 * 365.25 seconds');


    // Compatibility

    equal(run(1, 'second'), 1000, 'second | 1 second');
    equal(run(1, 'minute'), 60000, 'minute | 1 minute');
    equal(run(1, 'hour'), 3600000, 'hour | 1 hour');
    equal(run(1, 'day'), 86400000, 'day | 1 day');
    equal(run(1, 'week'), 604800000, 'week | 1 week');
    equal(run(1, 'month'), 2629800000, 'month | 1 month');
    equal(run(1, 'year'), 31557600000, 'year | 1 year');

  });

  group('Unit Before/After', function () {

    function assertBeforeAfter(ms, method, args, ems, message) {
      equal(run(ms, method, args), getRelativeDate(0, 0, 0, 0, 0, 0, ems), message);
    }
    assertBeforeAfter(1, 'secondAfter', [], 1000, 'secondAfter | 1');
    assertBeforeAfter(5, 'secondsAfter', [], 5000, 'secondsAfter | 5');
    assertBeforeAfter(10, 'minutesAfter', [], 600000, 'minutesAfter | 10');

    assertBeforeAfter(1, 'secondFromNow', [], 1000, 'secondFromNow | 1');
    assertBeforeAfter(5, 'secondsFromNow', [], 5000, 'secondsFromNow | 5');
    assertBeforeAfter(10, 'minutesFromNow', [], 600000, 'minutesFromNow | 10');

    assertBeforeAfter(1, 'secondAgo', [], -1000, 'secondAgo | 1');
    assertBeforeAfter(5, 'secondsAgo', [], -5000, 'secondAgo | 5');
    assertBeforeAfter(10, 'secondsAgo', [], -10000, 'secondAgo | 10');

    assertBeforeAfter(1, 'secondBefore', [], -1000, 'secondBefore | 1');
    assertBeforeAfter(5, 'secondsBefore', [], -5000, 'secondBefore | 5');
    assertBeforeAfter(10, 'secondsBefore', [], -10000, 'secondBefore | 10');

    assertBeforeAfter(5, 'minutesAfter', [run(5, 'minutesAgo')], 0, 'minutesAfter | 5 minutes after 5 minutes ago');
    assertBeforeAfter(10, 'minutesAfter', [run(5, 'minutesAgo')], 1000 * 60 * 5, 'minutesAfter | 10 minutes after 5 minutes ago');

    assertBeforeAfter(5, 'minutesFromNow', [run(5, 'minutesAgo')], 0, 'minutesFromNow | 5 minutes from now 5 minutes ago');
    assertBeforeAfter(10, 'minutesFromNow', [run(5, 'minutesAgo')], 1000 * 60 * 5, 'minutesFromNow | 10 minutes from now 5 minutes ago');

    assertBeforeAfter(5, 'minutesAgo', [run(5, 'minutesFromNow')], 0, 'minutesAgo | 5 minutes ago 5 minutes from now');
    assertBeforeAfter(10, 'minutesAgo', [run(5, 'minutesFromNow')], -(1000 * 60 * 5), 'minutesAgo | 10 minutes ago 5 minutes from now');

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

  method('duration', function() {

    testCreateFakeLocale('fo');

    testSetLocale('en');

    test(-3600000, '0 milliseconds', 'negative number should be 0');

    test(0, '0 milliseconds', '1 milliseconds');
    test(1, '1 millisecond', '1 millisecond');
    test(2, '2 milliseconds', '2 milliseconds');
    test(100, '100 milliseconds', '100 milliseconds');
    test(500, '500 milliseconds', '500 milliseconds');
    test(949, '949 milliseconds', '949 milliseconds');
    test(950, '1 second', '950 milliseconds');
    test(999, '1 second', '999 milliseconds');
    test(1000, '1 second', '1 second');
    test(1999, '2 seconds', '2 seconds');
    test(5000, '5 seconds', '5 seconds');
    test(55000, '55 seconds', '55 seconds');
    test(56000, '56 seconds', '56 seconds');
    test(57000, '1 minute', '57 seconds');
    test(60000, '1 minute', '60 seconds');
    test(3600000, '1 hour', '360000 seconds');

    test(run(5, 'hours'), '5 hours', '5 hours');
    test(run(22, 'hours'), '22 hours', '22 hours');
    test(run(23, 'hours'), '1 day', '23 hours');
    test(run(6, 'days'), '6 days', '6 days');
    test(run(7, 'days'), '1 week', '1 week');
    test(run(28, 'days'), '4 weeks', '30 days');
    test(run(29, 'days'), '1 month', '1 months');
    test(run(11, 'months'), '11 months', '11 months');
    test(run(12, 'months'), '1 year', '1 year');
    test(run(2, 'years'), '2 years', '2 years');
    test(run(15, 'years'), '15 years', '15 years');
    test(run(1500, 'years'), '1500 years', '1500 years');

    testSetLocale('fo');

    test(run(5, 'days'), '5somomoney', 'Fake locale | 5 days');
    test(run(150, 'days'), '4timomoney', 'Fake locale | 150 days');
    test(run(38000, 'seconds'), '10famomoney', 'Fake locale | 38000 seconds');
    test(run(38000, 'minutes'), '3lamomoney', 'Fake locale | 38000 minutes');
    test(run(38000, 'hours'), '4domomoney', 'Fake locale | 38000 hours');


    // Duration without setting the locale code

    test(run(5, 'days'), ['en'], '5 days', 'English | 5 days');
    test(run(150, 'days'), ['en'], '4 months', 'English | 150 days');
    test(run(38000, 'seconds'), ['en'], '10 hours', 'English | 38000 seconds');
    test(run(38000, 'minutes'), ['en'], '3 weeks', 'English | 38000 minutes');
    test(run(38000, 'hours'), ['en'], '4 years', 'English | 38000 hours');
    testSetLocale('en');
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

});
