package('Date', function () {



  // Setup

  var d;
  var now = new Date();
  var thisYear = now.getFullYear();

  // Imaginary locale to test locale switching
  testAddLocale('fo', {
    units: 'do,re,mi,fa,so,la,ti,do',
    months: 'do,re,mi,fa,so,la,ti,do',
    dateParse: '{year}kupo',
    duration: '{num}{unit}momoney',
    long: 'yeehaw'
  });

  notEqual(testGetLocale().code, undefined, 'Current locale must be something... other libs may overwrite this');

  testSetLocale('en');

  method('isValid', function() {

    test(new Date('a fridge too far'), false, 'new Date invalid');
    test(new Date(), true, 'new Date valid');

    // Issue #219

    test(testCreateDate('28:00'),  true,  'hours may fall outside range');
    test(testCreateDate('59:00'),  true,  'no hours allowed outside range');
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
    dateEqual(run(Date, 'create'), new Date(), 'empty');
  });

  group('Create | Enumerated Parameters', function() {
    dateEqual(testCreateDate(1998), new Date(1998), '1998');
    dateEqual(testCreateDate(1998,1), new Date(1998,1), 'January, 1998');
    dateEqual(testCreateDate(1998,1,23), new Date(1998,1,23), 'January 23, 1998');
    dateEqual(testCreateDate(1998,1,23,11), new Date(1998,1,23,11), 'January 23, 1998 11am');
    dateEqual(testCreateDate(1998,1,23,11,54), new Date(1998,1,23,11,54), 'January 23, 1998 11:54am');
    dateEqual(testCreateDate(1998,1,23,11,54,32), new Date(1998,1,23,11,54,32), 'January 23, 1998 11:54:32');
    dateEqual(testCreateDate(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,454), 'January 23, 1998 11:54:32.454');
    dateEqual(testCreateDate('1998', true), new Date(1998, 0), 'will not choke on a boolean as second param');
    dateEqual(testCreateDate('1998', ''), new Date(1998, 0), 'will not choke on an empty string as second param');
  });


  group('Create | Objects', function() {
    dateEqual(testCreateDate({ year: 1998 }), new Date(1998, 0), '1998');
    dateEqual(testCreateDate({ year: 1998, month: 1 }), new Date(1998,1), 'January, 1998');
    dateEqual(testCreateDate({ year: 1998, month: 1, day: 23 }), new Date(1998,1,23), 'January 23, 1998');
    dateEqual(testCreateDate({ year: 1998, month: 1, day: 23, hour: 11 }), new Date(1998,1,23,11), 'January 23, 1998 11am');
    dateEqual(testCreateDate({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }), new Date(1998,1,23,11,54), 'January 23, 1998 11:54am');
    dateEqual(testCreateDate({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }), new Date(1998,1,23,11,54,32), 'January 23, 1998 11:54:32');
    dateEqual(testCreateDate({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }), new Date(1998,1,23,11,54,32,454), 'January 23, 1998 11:54:32.454');

  });

  group('Create | Timestamps', function() {
    var timestamp = 1294012800000;
    d = testCreateDate(timestamp); // 2011-01-03 00:00:00 
    equal(d.getFullYear(), 2011, '2011')
    equal(d.getMonth(), 0, 'is January');
    equal(d.getDate(), Math.floor(3 - (d.getTimezoneOffset() / 60 / 24)), 'is the 3rd');
    equal(d.getTime(), timestamp, 'is exact');
  });

  group('Create | Simple', function() {
    dateEqual(testCreateDate('1999'), new Date(1999, 0), 'Just the year');
    dateEqual(testCreateDate('June'), new Date(thisYear, 5), 'Just the month');
    dateEqual(testCreateDate('June 15'), new Date(thisYear, 5, 15), 'Month and day');
    dateEqual(testCreateDate('June 15th'), new Date(thisYear, 5, 15), 'Month and ordinal day');
  });

  group('Create | American Style Slashes', function() {
    dateEqual(testCreateDate('08/25'), new Date(thisYear, 7, 25), 'mm/dd');
    dateEqual(testCreateDate('8/25'), new Date(thisYear, 7, 25), 'm/dd');
    dateEqual(testCreateDate('08/25/1978'), new Date(1978, 7, 25), 'mm/dd/yyyy');
    dateEqual(testCreateDate('8/25/1978'), new Date(1978, 7, 25), '/m/dd/yyyy');
    dateEqual(testCreateDate('8/25/78'), new Date(1978, 7, 25), 'm/dd/yy');
    dateEqual(testCreateDate('08/25/78'), new Date(1978, 7, 25), 'mm/dd/yy');
    dateEqual(testCreateDate('8/25/01'), new Date(2001, 7, 25), 'm/dd/01');
    dateEqual(testCreateDate('8/25/49'), new Date(2049, 7, 25), 'm/dd/49');
    dateEqual(testCreateDate('8/25/50'), new Date(1950, 7, 25), 'm/dd/50');

    // Abbreviated reverse slash format yy/mm/dd cannot exist because it clashes with forward
    // slash format dd/mm/yy (with european variant). This rule however, doesn't follow for dashes,
    // which is abbreviated ISO8601 format: yy-mm-dd
    dateEqual(testCreateDate('01/02/03'), new Date(2003, 0, 2), 'Ambiguous 2 digit format mm/dd/yy');

    var d = testCreateDate('08/25/0001');
    d = new Date(d.getTime() - (d.getTimezoneOffset() * 60 * 1000));
    dateEqual(d, new Date(-62115206400000), 'mm/dd/0001');
  });

  group('Create | American Style Dashes', function() {
    dateEqual(testCreateDate('08-25-1978'), new Date(1978, 7, 25), 'mm-dd-yyyy');
    dateEqual(testCreateDate('8-25-1978'), new Date(1978, 7, 25), 'm-dd-yyyy');

    // dd-dd-dd is NOT a valid ISO 8601 representation as of 2004, hence this format will
    // revert to a little endian representation, where year truncation is allowed. See:
    // http://en.wikipedia.org/wiki/ISO_8601#Truncated_representations
    dateEqual(testCreateDate('08-05-05'), new Date(2005, 7, 5), 'dd-dd-dd is an ISO8601 format');

    dateEqual(testCreateDate('06-2008'), new Date(2008, 5), 'Date#create | Full text | mm-yyyy');
    dateEqual(testCreateDate('6-2008'), new Date(2008, 5), 'Date#create | Full text | m-yyyy');
  });

  group('Create | American Style Dots', function() {
    dateEqual(testCreateDate('08.25.1978'), new Date(1978, 7, 25), 'mm.dd.yyyy');
    dateEqual(testCreateDate('8.25.1978'), new Date(1978, 7, 25), 'm.dd.yyyy');
  });

  group('Create | European Style', function() {
    dateEqual(testCreateDate('08/10', 'en-GB'), new Date(thisYear, 9, 8), 'dd/mm');
    dateEqual(testCreateDate('8/10', 'en-GB'), new Date(thisYear, 9, 8), 'd/mm');
    dateEqual(testCreateDate('08/10/1978', 'en-GB'), new Date(1978, 9, 8), 'dd/mm/yyyy');
    dateEqual(testCreateDate('8/10/1978', 'en-GB'), new Date(1978, 9, 8), 'd/mm/yyyy');
    dateEqual(testCreateDate('8/10/78', 'en-GB'), new Date(1978, 9, 8), 'd/mm/yy');
    dateEqual(testCreateDate('08/10/78', 'en-GB'), new Date(1978, 9, 8), 'dd/mm/yy');
    dateEqual(testCreateDate('8/10/01', 'en-GB'), new Date(2001, 9, 8), 'd/mm/01');
    dateEqual(testCreateDate('8/10/49', 'en-GB'), new Date(2049, 9, 8), 'd/mm/49');
    dateEqual(testCreateDate('8/10/50', 'en-GB'), new Date(1950, 9, 8), 'd/mm/50');
    dateEqual(testCreateDate('08/10', 'en-AU'), new Date(thisYear, 9, 8), 'any English locale suffix should work and not use US format');

    // Dashes
    dateEqual(testCreateDate('08-10-1978', 'en-GB'), new Date(1978, 9, 8), 'mm-dd-yyyy');

    // Dots
    dateEqual(testCreateDate('08.10.1978', 'en-GB'), new Date(1978, 9, 8), 'dd.mm.yyyy');
    dateEqual(testCreateDate('8.10.1978', 'en-GB'), new Date(1978, 9, 8), 'd.mm.yyyy');
    dateEqual(testCreateDate('08-05-05', 'en-GB'), new Date(2005, 4, 8), 'dd-dd-dd is NOT an ISO8601 format');
    dateEqual(testCreateDate('8/10/85'), new Date(1985, 7, 10), 'American format will now revert back');

    testSetLocale('en-GB');
    dateEqual(testCreateDate('8/10/85'), new Date(1985, 9, 8), 'after global set');
    testSetLocale('en');
    dateEqual(testCreateDate('8/10/85'), new Date(1985, 7, 10), 'before global reset');
  });

  group('Create | IETF', function() {
    // Stolen with love from XDate
    dateEqual(testCreateDate('Mon Sep 05 2011 12:30:00 GMT-0700 (PDT)'), getUTCDate(2011,9,5,19,30));
  });

  group('Create | Reverse Full Slashes', function() {

    // Slashes
    dateEqual(testCreateDate('1978/08/25'), new Date(1978, 7, 25), 'yyyy/mm/dd');
    dateEqual(testCreateDate('1978/8/25'), new Date(1978, 7, 25), 'yyyy/m/dd');
    dateEqual(testCreateDate('1978/08'), new Date(1978, 7), 'yyyy/mm');
    dateEqual(testCreateDate('1978/8'), new Date(1978, 7), 'yyyy/m');

    // Dashes
    dateEqual(testCreateDate('1978-08-25'), new Date(1978, 7, 25), 'yyyy-mm-dd');
    dateEqual(testCreateDate('1978-08'), new Date(1978, 7), 'yyyy-mm');
    dateEqual(testCreateDate('1978-8'), new Date(1978, 7), 'yyyy-m');

    // Dots
    dateEqual(testCreateDate('1978.08.25'), new Date(1978, 7, 25), 'yyyy.mm.dd');
    dateEqual(testCreateDate('1978.08'), new Date(1978, 7), 'yyyy.mm');
    dateEqual(testCreateDate('1978.8'), new Date(1978, 7), 'yyyy.m');
    dateEqual(testCreateDate('01-02-03', 'en-GB'), new Date(2003, 1, 1), 'Ambiguous 2 digit variant yy-mm-dd is NOT ISO 8601');
    dateEqual(testCreateDate('01/02/03', 'en-GB'), new Date(2003, 1, 1), 'Ambiguous 2 digit European variant dd/mm/yy');

  });

  group('Create | Text Month', function() {
    dateEqual(testCreateDate('June 2008'), new Date(2008, 5), 'Month yyyy');
    dateEqual(testCreateDate('June-2008'), new Date(2008, 5), 'Month-yyyy');
    dateEqual(testCreateDate('June.2008'), new Date(2008, 5), 'Month.yyyy');
    dateEqual(testCreateDate('June 1st, 2008'), new Date(2008, 5, 1), 'Month 1st, yyyy');
    dateEqual(testCreateDate('June 2nd, 2008'), new Date(2008, 5, 2), 'Month 2nd, yyyy');
    dateEqual(testCreateDate('June 3rd, 2008'), new Date(2008, 5, 3), 'Month 3rd, yyyy');
    dateEqual(testCreateDate('June 4th, 2008'), new Date(2008, 5, 4), 'Month 4th, yyyy');
    dateEqual(testCreateDate('June 15th, 2008'), new Date(2008, 5, 15), 'Month 15th, yyyy');
    dateEqual(testCreateDate('June 1st 2008'), new Date(2008, 5, 1), 'Month 1st yyyy');
    dateEqual(testCreateDate('June 2nd 2008'), new Date(2008, 5, 2), 'Month 2nd yyyy');
    dateEqual(testCreateDate('June 3rd 2008'), new Date(2008, 5, 3), 'Month 3rd yyyy');
    dateEqual(testCreateDate('June 4th 2008'), new Date(2008, 5, 4), 'Month 4th yyyy');
    dateEqual(testCreateDate('June 15, 2008'), new Date(2008, 5, 15), 'Month dd, yyyy');
    dateEqual(testCreateDate('June 15 2008'), new Date(2008, 5, 15), 'Month dd yyyy');
    dateEqual(testCreateDate('15 July, 2008'), new Date(2008, 6, 15), 'dd Month, yyyy');
    dateEqual(testCreateDate('15 July 2008'), new Date(2008, 6, 15), 'dd Month yyyy');
    dateEqual(testCreateDate('juNe 1St 2008'), new Date(2008, 5, 1), 'Month 1st yyyy case insensitive');
  });

  group('Create | Special Cases', function() {
    dateEqual(testCreateDate(' July 4th, 1987 '), new Date(1987, 6, 4), 'Untrimmed full text');
    dateEqual(testCreateDate('  7/4/1987 '), new Date(1987, 6, 4), 'Untrimmed American');
    dateEqual(testCreateDate('   1987-07-04    '), new Date(1987, 6, 4), 'Untrimmed ISO8601');
  });

  group('Create | Abbreviated Formats', function() {
    dateEqual(testCreateDate('Dec 1st, 2008'), new Date(2008, 11, 1), 'without dot');
    dateEqual(testCreateDate('Dec. 1st, 2008'), new Date(2008, 11, 1), 'with dot');
    dateEqual(testCreateDate('1 Dec. 2008'), new Date(2008, 11, 1), 'reversed with dot');
    dateEqual(testCreateDate('1 Dec., 2008'), new Date(2008, 11, 1), 'reversed with dot and comma');
    dateEqual(testCreateDate('1 Dec, 2008'), new Date(2008, 11, 1), 'reversed with comma and no dot');
  });

  group('Create | Abbreviated with Text Month', function() {
    dateEqual(testCreateDate('09-May-78'), new Date(1978, 4, 9), 'Little Endian | yy');
    dateEqual(testCreateDate('09-May-1978'), new Date(1978, 4, 9), 'Little Endian | yyyy');
    dateEqual(testCreateDate('1978-May-09'), new Date(1978, 4, 9), '');
    dateEqual(testCreateDate('Wednesday July 3rd, 2008'), new Date(2008, 6, 3), 'With day of week');
    dateEqual(testCreateDate('Wed July 3rd, 2008'), new Date(2008, 6, 3), 'With day of week abbreviated');
    dateEqual(testCreateDate('Wed. July 3rd, 2008'), new Date(2008, 6, 3), 'With day of week abbreviated plus dot');
    dateEqual(testCreateDate('Wed, 03 Jul 2008 08:00:00 EST'), new Date(Date.UTC(2008, 6, 3, 13)), 'RFC822');
  });

  group('Create | ISO8601', function() {
    dateEqual(testCreateDate('2001-1-1'), new Date(2001, 0, 1), 'not padded');
    dateEqual(testCreateDate('2001-01-1'), new Date(2001, 0, 1), 'month padded');
    dateEqual(testCreateDate('2001-01-01'), new Date(2001, 0, 1), 'month and day padded');
    dateEqual(testCreateDate('2010-11-22'), new Date(2010, 10, 22), 'month and day padded 2010');
    dateEqual(testCreateDate('20101122'), new Date(2010, 10, 22), 'digits strung together');
    dateEqual(testCreateDate('17760523T024508+0830'), getUTCDate(1776,5,22,18,15,08), 'full datetime strung together');
    dateEqual(testCreateDate('-0002-07-26'), new Date(-2, 6, 26), 'minus sign (bc)'); // BC
    dateEqual(testCreateDate('+1978-04-17'), new Date(1978, 3, 17), 'plus sign (ad)'); // AD
  });

  group('Create | Date and Time', function() {
    dateEqual(testCreateDate('08/25/1978 12:04'), new Date(1978, 7, 25, 12, 4), 'Slash format');
    dateEqual(testCreateDate('08-25-1978 12:04'), new Date(1978, 7, 25, 12, 4), 'Dash format');
    dateEqual(testCreateDate('1978/08/25 12:04'), new Date(1978, 7, 25, 12, 4), 'Reverse slash format');
    dateEqual(testCreateDate('June 1st, 2008 12:04'), new Date(2008, 5, 1, 12, 4), 'Full text format');

    dateEqual(testCreateDate('08-25-1978 12:04:57'), new Date(1978, 7, 25, 12, 4, 57), 'with seconds');
    dateEqual(testCreateDate('08-25-1978 12:04:57.322'), new Date(1978, 7, 25, 12, 4, 57, 322), 'with milliseconds');

    dateEqual(testCreateDate('08-25-1978 12pm'), new Date(1978, 7, 25, 12), 'with am/pm');
    dateEqual(testCreateDate('08-25-1978 12:42pm'), new Date(1978, 7, 25, 12, 42), 'with minutes and am/pm');
    dateEqual(testCreateDate('08-25-1978 12:42:32pm'), new Date(1978, 7, 25, 12, 42, 32), 'with seconds and am/pm');
    dateEqual(testCreateDate('08-25-1978 12:42:32.488pm'), new Date(1978, 7, 25, 12, 42, 32, 488), 'with seconds and am/pm');

    dateEqual(testCreateDate('08-25-1978 00:00am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'with zero am');
    dateEqual(testCreateDate('08-25-1978 00:00:00am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'with seconds and zero am');
    dateEqual(testCreateDate('08-25-1978 00:00:00.000am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'with milliseconds and zero am');

    dateEqual(testCreateDate('08-25-1978 1pm'), new Date(1978, 7, 25, 13), '1pm am/pm');
    dateEqual(testCreateDate('08-25-1978 1:42pm'), new Date(1978, 7, 25, 13, 42), '1pm minutes and am/pm');
    dateEqual(testCreateDate('08-25-1978 1:42:32pm'), new Date(1978, 7, 25, 13, 42, 32), '1pm seconds and am/pm');
    dateEqual(testCreateDate('08-25-1978 1:42:32.488pm'), new Date(1978, 7, 25, 13, 42, 32, 488), '1pm seconds and am/pm');

    dateEqual(testCreateDate('08-25-1978 1am'), new Date(1978, 7, 25, 1), '1am am/pm');
    dateEqual(testCreateDate('08-25-1978 1:42am'), new Date(1978, 7, 25, 1, 42), '1am minutes and am/pm');
    dateEqual(testCreateDate('08-25-1978 1:42:32am'), new Date(1978, 7, 25, 1, 42, 32), '1am seconds and am/pm');
    dateEqual(testCreateDate('08-25-1978 1:42:32.488am'), new Date(1978, 7, 25, 1, 42, 32, 488), '1am seconds and am/pm');

    dateEqual(testCreateDate('08-25-1978 11pm'), new Date(1978, 7, 25, 23), '11pm am/pm');
    dateEqual(testCreateDate('08-25-1978 11:42pm'), new Date(1978, 7, 25, 23, 42), '11pm minutes and am/pm');
    dateEqual(testCreateDate('08-25-1978 11:42:32pm'), new Date(1978, 7, 25, 23, 42, 32), '11pm seconds and am/pm');
    dateEqual(testCreateDate('08-25-1978 11:42:32.488pm'), new Date(1978, 7, 25, 23, 42, 32, 488), '11pm seconds and am/pm');

    dateEqual(testCreateDate('08-25-1978 11am'), new Date(1978, 7, 25, 11), '11am am/pm');
    dateEqual(testCreateDate('08-25-1978 11:42am'), new Date(1978, 7, 25, 11, 42), '11am minutes and am/pm');
    dateEqual(testCreateDate('08-25-1978 11:42:32am'), new Date(1978, 7, 25, 11, 42, 32), '11am seconds and am/pm');
    dateEqual(testCreateDate('08-25-1978 11:42:32.488am'), new Date(1978, 7, 25, 11, 42, 32, 488), '11am seconds and am/pm');
  });

  group('Create | ISO8601', function() {
    dateEqual(testCreateDate('2010-11-22T22:59Z'), getUTCDate(2010,11,22,22,59), 'full with UTC timezone');
    dateEqual(testCreateDate('1997-07-16T19:20+00:00'), getUTCDate(1997, 7, 16, 19, 20), 'zero minutes with timezone');
    dateEqual(testCreateDate('1997-07-16T19:20+01:00'), getUTCDate(1997, 7, 16, 18, 20), 'minutes with timezone');
    dateEqual(testCreateDate('1997-07-16T19:20:30+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30), 'seconds with timezone');
    dateEqual(testCreateDate('1997-07-16T19:20:30.45+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 450), 'milliseconds with timezone');
    dateEqual(testCreateDate('1994-11-05T08:15:30-05:00'), getUTCDate(1994, 11, 5, 13, 15, 30), 'Full example 1');
    dateEqual(testCreateDate('1994-11-05T13:15:30Z'), getUTCDate(1994, 11, 5, 13, 15, 30), 'Full example 1');

    equal(testCreateDate('1994-11-05T13:15:30Z')._utc, false, 'does not forcefully set UTC flag');

    dateEqual(testCreateDate('1776-05-23T02:45:08-08:30'), getUTCDate(1776, 5, 23, 11, 15, 08), 'Full example 3');
    dateEqual(testCreateDate('1776-05-23T02:45:08+08:30'), getUTCDate(1776, 5, 22, 18, 15, 08), 'Full example 4');
    dateEqual(testCreateDate('1776-05-23T02:45:08-0830'), getUTCDate(1776, 5, 23, 11, 15, 08), 'Full example 5');
    dateEqual(testCreateDate('1776-05-23T02:45:08+0830'), getUTCDate(1776, 5, 22, 18, 15, 08), 'Full example 6');

    // No limit on the number of millisecond decimals, so....
    dateEqual(testCreateDate('1997-07-16T19:20:30.4+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 400), 'milliseconds have no limit 1');
    dateEqual(testCreateDate('1997-07-16T19:20:30.46+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 460), 'milliseconds have no limit 2');
    dateEqual(testCreateDate('1997-07-16T19:20:30.462+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 462), 'milliseconds have no limit 3');
    dateEqual(testCreateDate('1997-07-16T19:20:30.4628+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 463), 'milliseconds have no limit 4');
    dateEqual(testCreateDate('1997-07-16T19:20:30.46284+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 463), 'milliseconds have no limit 5');

    // .NET output
    dateEqual(testCreateDate('2012-04-23T07:58:42.7940000z'), getUTCDate(2012, 4, 23, 7, 58, 42, 794), '.NET long format');

    // Fractions in ISO8601 dates
    dateEqual(testCreateDate('1997-07-16T14:30:40.5'), new Date(1997, 6, 16, 14, 30, 40, 500), 'fractions in seconds');
    dateEqual(testCreateDate('1997-07-16T14:30.5'), new Date(1997, 6, 16, 14, 30, 30), 'fractions in minutes');

    // Comma based fractions in ISO8601 dates
    dateEqual(testCreateDate('1997-07-16T14:30:40,5'), new Date(1997, 6, 16, 14, 30, 40, 500), 'fractions in seconds');
    dateEqual(testCreateDate('1997-07-16T14:30,5'), new Date(1997, 6, 16, 14, 30, 30), 'fractions in minutes');

    // Fractional hours in ISO dates
    dateEqual(testCreateDate('1997-07-16T14.5'), new Date(1997, 6, 16, 14, 30), 'fractions in hours');
    dateEqual(testCreateDate('1997-07-16T14,5'), new Date(1997, 6, 16, 14, 30), 'fractions in hours');

    // These are all the same moment...
    dateEqual(testCreateDate('2001-04-03T18:30Z'), getUTCDate(2001,4,3,18,30), 'Synonymous dates with timezone 1');
    dateEqual(testCreateDate('2001-04-03T22:30+04'), getUTCDate(2001,4,3,18,30), 'Synonymous dates with timezone 2');
    dateEqual(testCreateDate('2001-04-03T1130-0700'), getUTCDate(2001,4,3,18,30), 'Synonymous dates with timezone 3');
    dateEqual(testCreateDate('2001-04-03T15:00-03:30'), getUTCDate(2001,4,3,18,30), 'Synonymous dates with timezone 4');

    // Time
    dateEqual(testCreateDate('1pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13), '1pm');
    dateEqual(testCreateDate('1:30pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 30), '1:30pm');
    dateEqual(testCreateDate('1:30:22pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 30, 22), '1:30:22pm');
    dateEqual(testCreateDate('1:30:22.432pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 30, 22, 432), '1:30:22.432pm');
    dateEqual(testCreateDate('17:48:03.947'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 48, 3, 947), '17:48:03.947');

  });

  group('Create | .NET JSON', function() {
    dateEqual(testCreateDate('\/Date(628318530718)\/'), new Date(628318530718), 'basic');
    dateEqual(testCreateDate('\/Date(1318287600+0100)\/'), new Date(1318287600), '+ date format with timezone');
    dateEqual(testCreateDate('\/Date(1318287600-0700)\/'), new Date(1318287600), '- date format with timezone');
  });

  group('Create | Fuzzy Dates', function() {
    dateEqual(testCreateDate('now'), new Date(), 'now');
    dateEqual(testCreateDate('Now'), new Date(), 'Now');
    dateEqual(testCreateDate('Just now'), new Date(), 'Just Now');
    dateEqual(testCreateDate('today'), new Date(now.getFullYear(), now.getMonth(), now.getDate()), 'today');
    dateEqual(testCreateDate('Today'), new Date(now.getFullYear(), now.getMonth(), now.getDate()), 'Today');
    dateEqual(testCreateDate('yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), 'yesterday');
    dateEqual(testCreateDate('Yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), 'Yesterday');
    dateEqual(testCreateDate('tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), 'tomorrow');
    dateEqual(testCreateDate('Tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), 'Tomorrow');
    dateEqual(testCreateDate('4pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16), '4pm');
    dateEqual(testCreateDate('today at 4pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16), 'Today at 4pm');
    dateEqual(testCreateDate('today at 4 pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16), 'Today at 4 pm');
    dateEqual(testCreateDate('4pm today'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16), '4pm today');

    dateEqual(testCreateDate('The day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'The day after tomorrow');
    dateEqual(testCreateDate('The day before yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), 'The day before yesterday');
    dateEqual(testCreateDate('One day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'One day after tomorrow');
    dateEqual(testCreateDate('One day before yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), 'One day before yesterday');
    dateEqual(testCreateDate('Two days after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), 'Two days after tomorrow');
    dateEqual(testCreateDate('Two days before yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3), 'Two days before yesterday');
    dateEqual(testCreateDate('Two days after today'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'Two days after today');
    dateEqual(testCreateDate('Two days before today'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), 'Two days before today');
    dateEqual(testCreateDate('Two days from today'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'Two days from today');

    dateEqual(testCreateDate('tWo dAyS after toMoRRoW'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), 'tWo dAyS after toMoRRoW');
    dateEqual(testCreateDate('2 days after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), '2 days after tomorrow');
    dateEqual(testCreateDate('2 day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), '2 day after tomorrow');
    dateEqual(testCreateDate('18 days after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 19), '18 days after tomorrow');
    dateEqual(testCreateDate('18 day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 19), '18 day after tomorrow');

    dateEqual(testCreateDate('2 years ago'), getRelativeDate(-2), '2 years ago');
    dateEqual(testCreateDate('2 months ago'), getRelativeDate(null, -2), '2 months ago');
    dateEqual(testCreateDate('2 weeks ago'), getRelativeDate(null, null, -14), '2 weeks ago');
    dateEqual(testCreateDate('2 days ago'), getRelativeDate(null, null, -2), '2 days ago');
    dateEqual(testCreateDate('2 hours ago'), getRelativeDate(null, null, null, -2), '2 hours ago');
    dateEqual(testCreateDate('2 minutes ago'), getRelativeDate(null, null, null, null, -2), '2 minutes ago');
    dateEqual(testCreateDate('2 seconds ago'), getRelativeDate(null, null, null, null, null, -2), '2 seconds ago');
    dateEqual(testCreateDate('2 milliseconds ago'), getRelativeDate(null, null, null, null, null, null, -2), '2 milliseconds ago');
    dateEqual(testCreateDate('a second ago'), getRelativeDate(null, null, null, null, null, -1), 'a second ago');

    dateEqual(testCreateDate('2 years from now'), getRelativeDate(2), '2 years from now');
    dateEqual(testCreateDate('2 months from now'), getRelativeDate(null, 2), '2 months from now');
    dateEqual(testCreateDate('2 weeks from now'), getRelativeDate(null, null, 14), '2 weeks from now');
    dateEqual(testCreateDate('2 days from now'), getRelativeDate(null, null, 2), '2 days from now');
    dateEqual(testCreateDate('2 hours from now'), getRelativeDate(null, null, null, 2), '2 hours from now');
    dateEqual(testCreateDate('2 minutes from now'), getRelativeDate(null, null, null, null, 2), '2 minutes from now');
    dateEqual(testCreateDate('2 seconds from now'), getRelativeDate(null, null, null, null, null, 2), '2 seconds from now');
    dateEqual(testCreateDate('2 milliseconds from now'), getRelativeDate(null, null, null, null, null, null, 2), '2 milliseconds from now');

    dateEqual(testCreateDate('2 years later'), getRelativeDate(2), '2 years later');
    dateEqual(testCreateDate('2 months later'), getRelativeDate(null, 2), '2 months later');
    dateEqual(testCreateDate('2 weeks later'), getRelativeDate(null, null, 14), '2 weeks later');
    dateEqual(testCreateDate('2 days later'), getRelativeDate(null, null, 2), '2 days later');
    dateEqual(testCreateDate('2 hours later'), getRelativeDate(null, null, null, 2), '2 hours later');
    dateEqual(testCreateDate('2 minutes later'), getRelativeDate(null, null, null, null, 2), '2 minutes later');
    dateEqual(testCreateDate('2 seconds later'), getRelativeDate(null, null, null, null, null, 2), '2 seconds later');
    dateEqual(testCreateDate('2 milliseconds later'), getRelativeDate(null, null, null, null, null, null, 2), '2 milliseconds later');

    // Article trouble
    dateEqual(testCreateDate('an hour ago'), getRelativeDate(null, null, null, -1), 'an hours ago');
    dateEqual(testCreateDate('an hour from now'), getRelativeDate(null, null, null, 1), 'an hour from now');

    dateEqual(testCreateDate('Monday'), getDateWithWeekdayAndOffset(1), 'Monday');
    dateEqual(testCreateDate('The day after Monday'), getDateWithWeekdayAndOffset(2), 'The day after Monday');
    dateEqual(testCreateDate('The day before Monday'), getDateWithWeekdayAndOffset(0), 'The day before Monday');
    dateEqual(testCreateDate('2 days after monday'), getDateWithWeekdayAndOffset(3), '2 days after monday');
    dateEqual(testCreateDate('2 days before monday'), getDateWithWeekdayAndOffset(6, -7), '2 days before monday');
    dateEqual(testCreateDate('2 weeks after monday'), getDateWithWeekdayAndOffset(1, 14), '2 weeks after monday');

    dateEqual(testCreateDate('Next Monday'), getDateWithWeekdayAndOffset(1, 7), 'Next Monday');
    dateEqual(testCreateDate('next week monday'), getDateWithWeekdayAndOffset(1, 7), 'next week monday');
    dateEqual(testCreateDate('Next friDay'), getDateWithWeekdayAndOffset(5, 7), 'Next friDay');
    dateEqual(testCreateDate('next week thursday'), getDateWithWeekdayAndOffset(4, 7), 'next week thursday');

    dateEqual(testCreateDate('last Monday'), getDateWithWeekdayAndOffset(1, -7), 'last Monday');
    dateEqual(testCreateDate('last week monday'), getDateWithWeekdayAndOffset(1, -7), 'last week monday');
    dateEqual(testCreateDate('last friDay'), getDateWithWeekdayAndOffset(5, -7), 'last friDay');
    dateEqual(testCreateDate('last week thursday'), getDateWithWeekdayAndOffset(4, -7), 'last week thursday');
    dateEqual(testCreateDate('last Monday at 4pm'), getDateWithWeekdayAndOffset(1, -7, 16), 'last Monday at 4pm');

    dateEqual(testCreateDate('this Monday'), getDateWithWeekdayAndOffset(1, 0), 'this Monday');
    dateEqual(testCreateDate('this week monday'), getDateWithWeekdayAndOffset(1, 0), 'this week monday');
    dateEqual(testCreateDate('this friDay'), getDateWithWeekdayAndOffset(5, 0), 'this friDay');
    dateEqual(testCreateDate('this week thursday'), getDateWithWeekdayAndOffset(4, 0), 'this week thursday');

    dateEqual(testCreateDate('Monday of last week'), getDateWithWeekdayAndOffset(1, -7), 'Monday of last week');
    dateEqual(testCreateDate('saturday of next week'), getDateWithWeekdayAndOffset(6, 7), 'saturday of next week');
    dateEqual(testCreateDate('Monday last week'), getDateWithWeekdayAndOffset(1, -7), 'Monday last week');
    dateEqual(testCreateDate('saturday next week'), getDateWithWeekdayAndOffset(6, 7), 'saturday next week');

    dateEqual(testCreateDate('Monday of this week'), getDateWithWeekdayAndOffset(1, 0), 'Monday of this week');
    dateEqual(testCreateDate('saturday of this week'), getDateWithWeekdayAndOffset(6, 0), 'saturday of this week');
    dateEqual(testCreateDate('Monday this week'), getDateWithWeekdayAndOffset(1, 0), 'Monday this week');
    dateEqual(testCreateDate('saturday this week'), getDateWithWeekdayAndOffset(6, 0), 'saturday this week');

    dateEqual(testCreateDate('Tue of last week'), getDateWithWeekdayAndOffset(2, -7), 'Tue of last week');
    dateEqual(testCreateDate('Tue. of last week'), getDateWithWeekdayAndOffset(2, -7), 'Tue. of last week');

    dateEqual(testCreateDate('Next week'), getRelativeDate(null, null, 7), 'Next week');
    dateEqual(testCreateDate('Last week'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('Next month'), getRelativeDate(null, 1), 'Next month');
    dateEqual(testCreateDate('Next year'), getRelativeDate(1), 'Next year');
    dateEqual(testCreateDate('this year'), getRelativeDate(0), 'this year');

    dateEqual(testCreateDate('beginning of the week'), getDateWithWeekdayAndOffset(0), 'beginning of the week');
    dateEqual(testCreateDate('beginning of this week'), getDateWithWeekdayAndOffset(0), 'beginning of this week');
    dateEqual(testCreateDate('end of this week'), getDateWithWeekdayAndOffset(6, 0, 23, 59, 59, 999), 'end of this week');
    dateEqual(testCreateDate('beginning of next week'), getDateWithWeekdayAndOffset(0, 7), 'beginning of next week');
    dateEqual(testCreateDate('the beginning of next week'), getDateWithWeekdayAndOffset(0, 7), 'the beginning of next week');

    dateEqual(testCreateDate('beginning of the month'), new Date(now.getFullYear(), now.getMonth()), 'beginning of the month');
    dateEqual(testCreateDate('beginning of this month'), new Date(now.getFullYear(), now.getMonth()), 'beginning of this month');
    dateEqual(testCreateDate('beginning of next month'), new Date(now.getFullYear(), now.getMonth() + 1), 'beginning of next month');
    dateEqual(testCreateDate('the beginning of next month'), new Date(now.getFullYear(), now.getMonth() + 1), 'the beginning of next month');
    dateEqual(testCreateDate('the end of next month'), new Date(now.getFullYear(), now.getMonth() + 1, testGetDaysInMonth(now.getFullYear(), now.getMonth() + 1), 23, 59, 59, 999), 'the end of next month');
    dateEqual(testCreateDate('the end of the month'), new Date(now.getFullYear(), now.getMonth(), testGetDaysInMonth(now.getFullYear(), now.getMonth()), 23, 59, 59, 999), 'the end of the month');

    dateEqual(testCreateDate('the beginning of the year'), new Date(now.getFullYear(), 0), 'the beginning of the year');
    dateEqual(testCreateDate('the beginning of this year'), new Date(now.getFullYear(), 0), 'the beginning of this year');
    dateEqual(testCreateDate('the beginning of next year'), new Date(now.getFullYear() + 1, 0), 'the beginning of next year');
    dateEqual(testCreateDate('the beginning of last year'), new Date(now.getFullYear() - 1, 0), 'the beginning of last year');
    dateEqual(testCreateDate('the end of next year'), new Date(now.getFullYear() + 1, 11, 31, 23, 59, 59, 999), 'the end of next year');
    dateEqual(testCreateDate('the end of last year'), new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999), 'the end of last year');

    dateEqual(testCreateDate('the beginning of the day'), new Date(now.getFullYear(), now.getMonth(), now.getDate()), 'the beginning of the day');

    dateEqual(testCreateDate('beginning of March'), new Date(now.getFullYear(), 2), 'beginning of March');
    dateEqual(testCreateDate('end of March'), new Date(now.getFullYear(), 2, 31, 23, 59, 59, 999), 'end of March');
    dateEqual(testCreateDate('the first day of March'), new Date(now.getFullYear(), 2), 'the first day of March');
    dateEqual(testCreateDate('the last day of March'), new Date(now.getFullYear(), 2, 31), 'the last day of March');
    dateEqual(testCreateDate('the last day of March 2010'), new Date(2010, 2, 31), 'the last day of March 2010');
    dateEqual(testCreateDate('the last day of March, 2012'), new Date(2012, 2, 31), 'the last day of March, 2012');

    dateEqual(testCreateDate('beginning of 1998'), new Date(1998, 0), 'beginning of 1998');
    dateEqual(testCreateDate('end of 1998'), new Date(1998, 11, 31, 23, 59, 59, 999), 'end of 1998');
    dateEqual(testCreateDate('the first day of 1998'), new Date(1998, 0), 'the first day of 1998');
    dateEqual(testCreateDate('the last day of 1998'), new Date(1998, 11, 31), 'the last day of 1998');

    dateEqual(testCreateDate('The 15th of last month.'), new Date(now.getFullYear(), now.getMonth() - 1, 15), 'The 15th of last month');
    dateEqual(testCreateDate('January 30th of last year.'), new Date(now.getFullYear() - 1, 0, 30), 'January 30th of last year');
    dateEqual(testCreateDate('January of last year.'), new Date(now.getFullYear() - 1, 0), 'January of last year');

    dateEqual(testCreateDate('First day of may'), new Date(now.getFullYear(), 4, 1), 'First day of may');
    dateEqual(testCreateDate('Last day of may'), new Date(now.getFullYear(), 4, 31), 'Last day of may');
    dateEqual(testCreateDate('Last day of next month'), new Date(now.getFullYear(), now.getMonth() + 1, testGetDaysInMonth(now.getFullYear(), now.getMonth() + 1)), 'Last day of next month');
    dateEqual(testCreateDate('Last day of november'), new Date(now.getFullYear(), 10, 30), 'Last day of november');

    dateEqual(testCreateDate('the first day of next January'), new Date(now.getFullYear() + 1, 0, 1), 'the first day of next january');

    dateEqual(testCreateDate('Next week'), getRelativeDate(null, null, 7), 'Next week');

    dateEqual(testCreateDate('Thursday of next week, 3:30pm'), getDateWithWeekdayAndOffset(4, 7, 15, 30), 'thursday of next week, 3:30pm');


    dateEqual(testCreateDate('the 2nd Tuesday of June, 2012'), new Date(2012, 5, 12), 'the 2nd tuesday of June, 2012');

    dateEqual(testCreateDate('the 1st Tuesday of November, 2012'), new Date(2012, 10, 6), 'the 1st tuesday of November');
    dateEqual(testCreateDate('the 2nd Tuesday of November, 2012'), new Date(2012, 10, 13), 'the 2nd tuesday of November');
    dateEqual(testCreateDate('the 3rd Tuesday of November, 2012'), new Date(2012, 10, 20), 'the 3rd tuesday of November');
    dateEqual(testCreateDate('the 4th Tuesday of November, 2012'), new Date(2012, 10, 27), 'the 4th tuesday of November');
    dateEqual(testCreateDate('the 5th Tuesday of November, 2012'), new Date(2012, 11, 4), 'the 5th tuesday of November');
    dateEqual(testCreateDate('the 6th Tuesday of November, 2012'), new Date(2012, 11, 11), 'the 6th tuesday of November');

    dateEqual(testCreateDate('the 1st Friday of February, 2012'), new Date(2012, 1, 3), 'the 1st Friday of February');
    dateEqual(testCreateDate('the 2nd Friday of February, 2012'), new Date(2012, 1, 10), 'the 2nd Friday of February');
    dateEqual(testCreateDate('the 3rd Friday of February, 2012'), new Date(2012, 1, 17), 'the 3rd Friday of February');
    dateEqual(testCreateDate('the 4th Friday of February, 2012'), new Date(2012, 1, 24), 'the 4th Friday of February');
    dateEqual(testCreateDate('the 5th Friday of February, 2012'), new Date(2012, 2, 2), 'the 5th Friday of February');
    dateEqual(testCreateDate('the 6th Friday of February, 2012'), new Date(2012, 2, 9), 'the 6th Friday of February');

    var d = new Date(thisYear, 1);
    while(d.getDay() !== 5) {
      d.setDate(d.getDate() + 1);
    }

    equal(testCreateDate('the 1st Friday of February').getFullYear(), thisYear, '1st friday of February should be this year');
    equal(testCreateFutureDate('the 1st Friday of February').getFullYear(), now > d ? thisYear + 1 : thisYear, '1st friday of February should be this year or next');
    equal(testCreatePastDate('the 1st Friday of February').getFullYear(), now < d ? thisYear - 1 : thisYear, '1st friday of February should be this year or last');

    dateEqual(testCreateDate('in 60 seconds'), getRelativeDate(null, null, null, null, 1), 'in 60 seconds');
    dateEqual(testCreateDate('in 45 minutes'), getRelativeDate(null, null, null, null, 45), 'in 45 minutes');
    dateEqual(testCreateDate('in 5 hours'), getRelativeDate(null, null, null, 5), 'in 5 hours');
    dateEqual(testCreateDate('in 5 days'), getRelativeDate(null, null, 5), 'in 5 days');
    dateEqual(testCreateDate('in 5 weeks'), getRelativeDate(null, null, 35), 'in 5 weeks');
    dateEqual(testCreateDate('in 5 months'), getRelativeDate(null, 5), 'in 5 months');
    dateEqual(testCreateDate('in 5 years'), getRelativeDate(5), 'in 5 years');


    // Issue #203

    dateEqual(testCreateDate('The day after tomorrow 3:45pm', 'en'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 15, 45), 'The day after tomorrow at 3:45pm');
    dateEqual(testCreateDate('The day before yesterday at 11:15am', 'en'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 11, 15), 'the day before yesterday at 11:15am');


    var d = new Date();
    d.setDate(28);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    dateEqual(testCreateDate('the 28th'), d, 'the 28th');
    dateEqual(testCreateDate('28th'), d, '28th');


    var d = new Date();
    d.setMonth(0);
    d.setDate(28);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    dateEqual(testCreateDate('the 28th of January'), d, 'the 28th of January');
    dateEqual(testCreateDate('28th of January'), d, '28th of January');


    // Issue #310

    dateEqual(testCreateDate('6:30pm in 1 day'), run(getRelativeDate(null, null, 1), 'set', [{hours:18,minutes:30}, true]), '6:30pm in 1 day');
    dateEqual(testCreateDate('6:30pm in 3 days'), run(getRelativeDate(null, null, 3), 'set', [{hours:18,minutes:30}, true]), '6:30pm in 3 days');
    dateEqual(testCreateDate('6:30pm in -3 days'), run(getRelativeDate(null, null, -3), 'set', [{hours:18,minutes:30}, true]), '6:30pm in -3 days');

    dateEqual(testCreateDate('6:30pm 2 days ago'), run(getRelativeDate(null, null, -2), 'set', [{hours:18,minutes:30}, true]), '6:30pm in 2 days ago');

    dateEqual(testCreateDate('21:00 in 2 weeks'), run(getRelativeDate(null, null, 14), 'set', [{hours:21}, true]), '21:00pm in 2 weeks');
    dateEqual(testCreateDate('5:00am in a month'), run(getRelativeDate(null, 1), 'set', [{hours:5}, true]), '5:00am in a month');
    dateEqual(testCreateDate('5am in a month'), run(getRelativeDate(null, 1), 'set', [{hours:5}, true]), '5am in a month');
    dateEqual(testCreateDate('5:01am in a month'), run(getRelativeDate(null, 1), 'set', [{hours:5,minutes:1}, true]), '5:01am in a month');

    equal(run(testCreateDate('5am in an hour'), 'isValid'), false, '5am in an hour is invalid');
    equal(run(testCreateDate('5am in a minute'), 'isValid'), false, '5am in a minute is invalid');

    // Issue #375 "end of yesterday"

    dateEqual(testCreateDate('beginning of yesterday'), run(testCreateDate('yesterday'), 'beginningOfDay'), 'beginning of yesterday');
    dateEqual(testCreateDate('end of yesterday'), run(testCreateDate('yesterday'), 'endOfDay'), 'end of yesterday');
    dateEqual(testCreateDate('beginning of today'), run(testCreateDate('today'), 'beginningOfDay'), 'beginning of today');
    dateEqual(testCreateDate('end of today'), run(testCreateDate('today'), 'endOfDay'), 'end of today');
    dateEqual(testCreateDate('beginning of tomorrow'), run(testCreateDate('tomorrow'), 'beginningOfDay'), 'beginning of tomorrow');
    dateEqual(testCreateDate('end of tomorrow'), run(testCreateDate('tomorrow'), 'endOfDay'), 'end of tomorrow');

    // Issue #431 "ten minutes ago"
    dateEqual(testCreateDate('ten minutes ago'), getRelativeDate(null, null, null, null, -10), 'ten minutes ago');
    dateEqual(testCreateDate('ten minutes from now'), getRelativeDate(null, null, null, null, 10), 'ten minutes from now');

  });


  group('Create | UTC', function() {
    dateEqual(runUTC('create', ['February 29, 2012 22:15:42', 'en']), new Date(Date.UTC(2012, 1, 29, 22, 15, 42)), 'full text');
    dateEqual(runUTC('create', ['2012-05-31', 'en']), new Date(Date.UTC(2012, 4, 31)), 'dashed');
    dateEqual(runUTC('create', ['1998-02-23 11:54:32', 'en']), new Date(Date.UTC(1998,1,23,11,54,32)), 'dashed with time');
    dateEqual(runUTC('create', [{ year: 1998, month: 1, day: 23, hour: 11 }, 'en']), new Date(Date.UTC(1998,1,23,11)), 'params');
    dateEqual(runUTC('create', ['08-25-1978 11:42:32.488am', 'en']), new Date(Date.UTC(1978, 7, 25, 11, 42, 32, 488)), 'full with ms');
    dateEqual(runUTC('create', ['1994-11-05T13:15:30Z', 'en']), new Date(Date.UTC(1994, 10, 5, 13, 15, 30)), '"Z" is still utc');
    dateEqual(runUTC('create', ['two days ago', 'en']), getRelativeDate(null, null, -2), 'relative dates are not UTC');

    // New handling of UTC dates

    var date1 = runUTC('create', ['2001-06-15', 'en']);
    var date2 = new Date(2001, 5, 15);
    date2.setTime(date2.getTime() - (date2.getTimezoneOffset() * 60 * 1000));

    dateEqual(date1, date2, 'is equal to date with timezone subtracted');
    equal(date1._utc, false, 'does not set internal flag');

    var d = run(new Date(2001, 5, 15), 'setUTC', [true]);

    equal(d._utc, true, 'sets internal flag');
    dateEqual(d, new Date(2001, 5, 15), 'does not change date');
    dateEqual(dateRun(d, 'beginningOfMonth'), new Date(Date.UTC(2001, 5, 1)), 'the beginning of the month');
    dateEqual(dateRun(d, 'endOfMonth'), new Date(Date.UTC(2001, 5, 30, 23, 59, 59, 999)), 'the end of the month');
    equal(run(d, 'minutesSince', [runUTC('create', ['2001-06-15', 'en'])]), d.getTimezoneOffset(), 'minutesSince is equal to the timezone offset');
    equal(run(d, 'hoursSince', ['2001-6-14']), 24, 'hoursSince | does not actually shift time');

    var d = run(testCreateDate('1 month ago'), 'setUTC', [true])
    equal(run(d, 'isLastMonth'), true, 'isLastMonth');

    var d = run(runUTC('create', ['2001-06-15', 'en']), 'setUTC', [true]);

    equal(run(d, 'iso'), '2001-06-15T00:00:00.000Z', 'will properly be output in UTC');
    equal(run(d, 'format', ['{tz}']), '+0000', 'format UTC date will have +0000 offset');
    equal(run(d, 'getUTCOffset'), '+0000', 'getUTCOffset');
    dateEqual(dateRun(d, 'advance', ['1 month']), new Date(Date.UTC(2001, 6, 15)), 'advancing');

    equal(run(run(runUTC('create', ['2010-02-01', 'en']), 'setUTC', [true]), 'daysInMonth'), 28, 'should find correct days in month');
    equal(run(run(runUTC('create', ['2000-01', 'en']), 'setUTC', [true]), 'isLeapYear'), true, 'isLeapYear accounts for utc dates');

    var d = run(runUTC('create', ['2000-02-18 11:00pm', 'en']), 'setUTC', [true]);

    equal(run(d, 'is', ['Friday', null, true]), true, 'is friday');
    equal(run(d, 'isWeekday', [true]), true, 'friday isWeekday');
    equal(run(d, 'is', ['2000-02-18', null, true]), true, 'friday full date');
    equal(run(d, 'isAfter', [runUTC('create', ['2000-02-18 10:00pm', 'en'])]), true, 'isAfter');
    equal(dateRun(d, 'reset'), new Date(Date.UTC(2000, 1, 18)), 'resetting');


    var d = run(runUTC('create', ['2000-02-14', 'en']), 'setUTC', [true]);

    equal(run(d, 'is', ['Monday', null, true]), true, 'is monday');
    equal(run(d, 'isWeekday', [true]), true, 'monday is a weekday');
    equal(run(d, 'is', ['2000-02-14', null, true]), true, 'monday full date');
    equal(run(d, 'format'), 'February 14, 2000 12:00am', 'fomratting monday');
    equal(run(d, 'full'), 'Monday February 14, 2000 12:00:00am', 'full format');
    equal(run(d, 'long'), 'February 14, 2000 12:00am', 'long format');
    equal(run(d, 'short'), 'February 14, 2000', 'short format');

    equal(run(runUTC('create', ['1 minute ago', 'en']), 'relative'), '1 minute ago', 'relative dates are unaffected');

    var d = run(run(new Date(2001, 5, 15), 'setUTC', [true]), 'setUTC', [false]);
    equal(d._utc, false, 'utc flag can be set off');

    // Issue #235

    equal(run(run(run(testCreateDate(), 'setUTC', [true]), 'clone'), 'isUTC'), true, 'clone should preserve UTC');
    equal(run(new Date(), 'clone')._utc, false, 'clone should never be UTC if flag not set');
    equal(run(testCreateDate(run(new Date(), 'setUTC', [true])), 'isUTC'), true, 'create should preserve UTC');

    var isCurrentlyGMT = new Date(2011, 0, 1).getTimezoneOffset() === 0;
    equal(run(testCreateDate(new Date()), 'isUTC'), isCurrentlyGMT, 'non utc date should not have UTC flag');

    // Issue #244

    dateEqual(runUTC('create', ['0999']), new Date(Date.UTC(999, 0)), '3 digit year 999 should be equal to ISO8601');
    dateEqual(runUTC('create', ['0123']), new Date(Date.UTC(123, 0)), '3 digit year 123 should be equal to ISO8601');

    var d = run(runUTC('create', [2013, 0, 14]), 'setUTC', [true]);
    run(d, 'set', [{week:1}]);
    dateEqual(d, runUTC('create', [2012, 11, 31]), 'utc dates should not throw errors on week set');

  });


  group('Create | Other', function() {

    // Issue #98: System time set to January 31st
    dateEqual(testCreateDate('2011-09-01T05:00:00Z'), getUTCDate(2011, 9, 1, 5), 'text format');

    // Issue #152 times should be allowed in front
    dateEqual(testCreateDate('3:45 2012-3-15'), new Date(2012, 2, 15, 3, 45), 'time in the front');
    dateEqual(testCreateDate('3:45pm 2012-3-15'), new Date(2012, 2, 15, 15, 45), 'big endian with time');
    dateEqual(testCreateDate('3:45pm 3/15/2012'), new Date(2012, 2, 15, 15, 45), 'crazy endian slashes with time');
    dateEqual(testCreateDate('3:45pm 3/4/2012', 'en-GB'), new Date(2012, 3, 3, 15, 45), 'little endian slashes with time');


    // Issue #144 various time/date formats
    var d = getDateWithWeekdayAndOffset(4);
    d.setHours(15);
    dateEqual(testCreateDate('6/30/2012 3:00 PM'), new Date(2012, 5, 30, 15), '6/30/2012 3:00 PM');
    dateEqual(testCreateDate('Thursday at 3:00 PM'), d, 'Thursday at 3:00 PM');
    dateEqual(testCreateDate('Thursday at 3:00PM'), d, 'Thursday at 3:00PM (no space)');


    // Date.create should clone a date

    var date1 = new Date(5000);
    var date2 = testCreateDate(date1);
    date1.setTime(10000);

    notEqual(date1.getTime(), date2.getTime(), 'created date should not be affected');


    // Simple 12:00am

    equal(testCreateDate('12:00am').getHours(), 0, '12:00am hours should be 0');
    equal(testCreateDate('12am').getHours(), 0, '12am hours should be 0');

    // Issue #227

    dateEqual(testCreateDate('0 January'), new Date(now.getFullYear() - 1, 11, 31), 'Date#addMonths | 0 January');
    dateEqual(testCreateDate('1 January'), new Date(now.getFullYear(), 0, 1), 'Date#addMonths | 1 January');
    dateEqual(testCreateDate('01 January'), new Date(now.getFullYear(), 0, 1), 'Date#addMonths | 01 January');
    dateEqual(testCreateDate('15 January'), new Date(now.getFullYear(), 0, 15), 'Date#addMonths | 15 January');
    dateEqual(testCreateDate('31 January'), new Date(now.getFullYear(), 0, 31), 'Date#addMonths | 31 January');

    dateEqual(testCreateDate('1 Jan'), new Date(now.getFullYear(), 0, 1), 'Date#addMonths | 1 Jan');
    dateEqual(testCreateDate('01 Jan'), new Date(now.getFullYear(), 0, 1), 'Date#addMonths | 01 Jan');
    dateEqual(testCreateDate('15 Jan'), new Date(now.getFullYear(), 0, 15), 'Date#addMonths | 15 Jan');
    dateEqual(testCreateDate('31 Jan'), new Date(now.getFullYear(), 0, 31), 'Date#addMonths | 31 Jan');

    dateEqual(testCreateDate('0 July'), new Date(now.getFullYear(), 5, 30), 'Date#addMonths | 0 July');
    dateEqual(testCreateDate('1 July'), new Date(now.getFullYear(), 6, 1), 'Date#addMonths | 1 July');
    dateEqual(testCreateDate('01 July'), new Date(now.getFullYear(), 6, 1), 'Date#addMonths | 01 July');
    dateEqual(testCreateDate('15 July'), new Date(now.getFullYear(), 6, 15), 'Date#addMonths | 15 July');
    dateEqual(testCreateDate('31 July'), new Date(now.getFullYear(), 6, 31), 'Date#addMonths | 31 July');
    dateEqual(testCreateDate('32 July'), new Date(now.getFullYear(), 7, 1), 'Date#addMonths | 32 July');

    dateEqual(testCreateDate('1 Dec'), new Date(now.getFullYear(), 11, 1), 'Date#addMonths | 1 Dec');
    dateEqual(testCreateDate('01 Dec'), new Date(now.getFullYear(), 11, 1), 'Date#addMonths | 01 Dec');
    dateEqual(testCreateDate('15 Dec'), new Date(now.getFullYear(), 11, 15), 'Date#addMonths | 15 Dec');
    dateEqual(testCreateDate('31 Dec'), new Date(now.getFullYear(), 11, 31), 'Date#addMonths | 31 Dec');

    dateEqual(testCreateDate('1 December'), new Date(now.getFullYear(), 11, 1), 'Date#addMonths | 1 December');
    dateEqual(testCreateDate('01 December'), new Date(now.getFullYear(), 11, 1), 'Date#addMonths | 01 December');
    dateEqual(testCreateDate('15 December'), new Date(now.getFullYear(), 11, 15), 'Date#addMonths | 15 December');
    dateEqual(testCreateDate('31 December'), new Date(now.getFullYear(), 11, 31), 'Date#addMonths | 31 December');
    dateEqual(testCreateDate('32 December'), new Date(now.getFullYear() + 1, 0, 1), 'Date#addMonths | 32 December');

    dateEqual(testCreateDate('1 January 3pm'), new Date(now.getFullYear(), 0, 1, 15), 'Date#addMonths | 1 January 3pm');
    dateEqual(testCreateDate('1 January 3:45pm'), new Date(now.getFullYear(), 0, 1, 15, 45), 'Date#addMonths | 1 January 3:45pm');

    dateEqual(testCreateDate("'87"), new Date(1987, 0), "Date#create | '87");
    dateEqual(testCreateDate("May '87"), new Date(1987, 4), "Date#create | May '87");
    dateEqual(testCreateDate("14 May '87"), new Date(1987, 4, 14), "Date#create | 14 May '87");

    // Issue #224
    equal(run(testCreateDate(''), 'isValid'), false, 'empty strings are not valid');

    // Issue #387 null in date constructor
    dateEqual(new Date(null), testCreateDate(null), 'null');

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

  group('Future Dates', function() {

    // Ensure that dates don't traverse TOO far into the past/future
    equal(run(testCreateFutureDate('January'), 'monthsFromNow') > 12, false, 'no more than 12 months from now');
    equal(run(testCreateFutureDate('December'), 'monthsFromNow') > 12, false, 'no more than 12 months from now');

    // Issue #210

    equal(testCreateFutureDate('Sunday at 3:00').getDay(), 0, 'Date.future | weekday should never be ambiguous');
  });

  group('2-digit years', function() {

    // Issue #383 Date.past in 2-digit years
    dateEqual(testCreatePastDate('12/20/23'), new Date(1923,11,20), 'Date.past | 1923-12-20');
    dateEqual(testCreateFutureDate('12/20/99'), new Date(2099,11,20), 'Date.future | 2099-12-20');

  });

  group('Invalid Dates', function() {
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
    equal(d.getSeconds(), 02, 'does not reset seconds');
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


    // Catch for DST inequivalencies
    // FAILS IN DAMASCUS IN XP!
    d = run(new Date(2010, 11, 9, 17), 'set', [{ year: 1998, month: 3, day: 3}, true]);
    equal(d.getHours(), 0, 'handles DST properly');


    d = run(new Date(2010, 0, 31), 'set', [{ month: 1 }, true]);
    dateEqual(d, new Date(2010,1), 'reset dates will not accidentally traverse into a different month');

    d = run(new Date(2010, 0, 31), 'advance', [{ month: 1 }]);
    dateEqual(d, new Date(2010,1,28), 'reset dates will not accidentally traverse into a different month');

    dateEqual(run(new Date, 'set', [0]), new Date(0), 'handles timestamps');

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

    dateEqual(run(new Date(), 'advance', [{ weekday: 7 }]), new Date(), 'cannot advance by weekdays');
    dateEqual(run(new Date(), 'rewind', [{ weekday: 7 }]), new Date(), 'cannot rewind by weekdays');


    // UTC Date
    d = run(runUTC('create', ['2010-01-01 03:00', 'en']), 'setUTC', [true]);

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
    var d;

    d = new Date('August 25, 2010 11:45:20');

    run(d, 'advance', [1,-3,2,8,12,-2,44]);

    equal(d.getFullYear(), 2011, 'year');
    equal(d.getMonth(), 4, 'month');
    equal(d.getDate(), 27, 'day');
    equal(d.getHours(), 19, 'hours');
    equal(d.getMinutes(), 57, 'minutes');
    equal(d.getSeconds(), 18, 'seconds');
    equal(d.getMilliseconds(), 44, 'milliseconds');



    d = new Date('August 25, 2010 11:45:20');
    run(d, 'advance', [{ year: 1, month: -3, days: 2, hours: 8, minutes: 12, seconds: -2, milliseconds: 44 }]);

    equal(d.getFullYear(), 2011, 'object | year');
    equal(d.getMonth(), 4, 'object | month');
    equal(d.getDate(), 27, 'object | day');
    equal(d.getHours(), 19, 'object | hours');
    equal(d.getMinutes(), 57, 'object | minutes');
    equal(d.getSeconds(), 18, 'object | seconds');
    equal(d.getMilliseconds(), 44, 'object | milliseconds');

    d = new Date('August 25, 2010 11:45:20');
    run(d, 'advance', [{ week: 1}]);
    dateEqual(d, new Date(2010, 8, 1, 11, 45, 20), 'positive weeks supported');
    run(d, 'advance', [{ week: -2}]);
    dateEqual(d, new Date(2010, 7, 18, 11, 45, 20), 'negative weeks supported');

    dateEqual(run(new Date(), 'advance', [{ years: 1 }]), testCreateDate('one year from now'), 'advancing 1 year');

    test(new Date(2014, 3, 11), ['0 days'], new Date(2014, 3, 11), 'advancing 0 days should be a noop');
    test(new Date(2014, 3, 11), ['-1 days'], new Date(2014, 3, 10), 'advancing -1 days');

    var d = new Date();
    var dayInMs = 24 * 60 * 60 * 1000;
    test(d, [dayInMs], new Date(d.getTime() + dayInMs), 'can advance milliseconds');


    // If traversing into a new month don't reset the date if the date was also advanced

    dateTest(new Date(2011, 0, 31), [{ month: 1 }], new Date(2011, 1, 28), 'basic month traversal will reset the date to the last day');
    dateTest(new Date(2011, 0, 31), [{ month: 1, day: 3 }], new Date(2011, 2, 3), 'when the day is specified date reset will not happen');
    dateEqual(run(new Date(2011, 0, 31), 'set', [{ month: 1, day: 3 }]), new Date(2011, 1, 3), 'set will also not cause date traversal');


    // Advance also allows resetting.

    d = new Date(2011, 0, 31, 23, 40, 28, 500);
    dateTest(d, [{ year: 1 }, true], new Date(2012, 0), 'with reset | year');
    dateTest(d, [{ month: 1 }, true], new Date(2011, 1), 'with reset | month');
    dateTest(d, [{ week: 1 }, true], new Date(2011, 1, 7), 'with reset | week');
    dateTest(d, [{ date: 1 }, true], new Date(2011, 1, 1), 'with reset | date');
    dateTest(d, [{ hour: 1 }, true], new Date(2011, 1, 1, 0), 'with reset | hour');
    dateTest(d, [{ minute: 1 }, true], new Date(2011, 0, 31, 23, 41), 'with reset | minute');
    dateTest(d, [{ second: 1 }, true], new Date(2011, 0, 31, 23, 40, 29), 'with reset | second');
    dateTest(d, [{ millisecond: 1 }, true], new Date(2011, 0, 31, 23, 40, 28, 501), 'with reset | millisecond');

    // Advance also allows string methods

    d = new Date(2011, 0, 31, 23, 40, 28, 500);
    dateTest(d, ['3 years'], new Date(2014, 0, 31, 23, 40, 28, 500), 'string input | year');
    dateTest(d, ['3 months'], new Date(2011, 3, 30, 23, 40, 28, 500), 'string input | month');
    dateTest(d, ['3 weeks'], new Date(2011, 1, 21, 23, 40, 28, 500), 'string input | week');
    dateTest(d, ['3 days'], new Date(2011, 1, 3, 23, 40, 28, 500), 'string input | date');
    dateTest(d, ['3 hours'], new Date(2011, 1, 1, 2, 40, 28, 500), 'string input | hour');
    dateTest(d, ['3 minutes'], new Date(2011, 0, 31, 23, 43, 28, 500), 'string input | minute');
    dateTest(d, ['3 seconds'], new Date(2011, 0, 31, 23, 40, 31, 500), 'string input | second');
    dateTest(d, ['3 milliseconds'], new Date(2011, 0, 31, 23, 40, 28, 503), 'string input | millisecond');

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
    dateEqual(d, new Date(2010, 7, 18, 11, 45, 20), 'positive weeks supported');
    run(d, 'rewind', [{ week: -1}]);
    dateEqual(d, new Date(2010, 7, 25, 11, 45, 20), 'negative weeks supported');

    dateEqual(run(new Date(), 'rewind', [{ years: 1 }]), testCreateDate('one year ago'), 'rewinding 1 year');

    var d = new Date();
    var dayInMs = 24 * 60 * 60 * 1000;
    test(d, [dayInMs], new Date(d.getTime() - dayInMs), 'can rewind milliseconds');

    // Issue #492
    d = new Date('August 25, 2010 11:45:20');
    run(d, 'rewind', [{ week: 1, day: 1}]);
    dateEqual(d, new Date(2010, 7, 17, 11, 45, 20), 'negative weeks supported');
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
    dateEqual(d, new Date(2010,0,6,11,45,20), 'week 1');
    run(d, 'setISOWeek', [15]);
    dateEqual(d, new Date(2010,3,14,11,45,20), 'week 15');
    run(d, 'setISOWeek', [27]);
    dateEqual(d, new Date(2010,6,7,11,45,20), 'week 27');
    run(d, 'setISOWeek', [52]);
    dateEqual(d, new Date(2010,11,29,11,45,20), 'week 52');
    run(d, 'setISOWeek');
    dateEqual(d, new Date(2010,11,29,11,45,20), 'week stays set');

    d = testCreateDate('August 25, 2010 11:45:20', 'en');
    equal(run(d, 'setISOWeek', [1]), new Date(2010, 0, 6, 11, 45, 20).getTime(), 'returns a timestamp');

    d = run(runUTC('create', ['January 1, 2010 02:15:20', 'en']), 'setUTC', [true]);

    run(d, 'setISOWeek', [15]);
    dateEqual(d, new Date(Date.UTC(2010,3,16,2,15,20)), 'utc | week 15');
    run(d, 'setISOWeek', [27]);
    dateEqual(d, new Date(Date.UTC(2010,6,9,2,15,20)), 'utc | week 27');
    run(d, 'setISOWeek', [52]);
    dateEqual(d, new Date(Date.UTC(2010,11,31,2,15,20)), 'utc | week 52');
    run(d, 'setISOWeek');
    dateEqual(d, new Date(Date.UTC(2010,11,31,2,15,20)), 'utc | week stays set');

    // Issue #251

    test(new Date(2013, 0), [1], new Date(2013, 0, 1).getTime(), 'Should follow ISO8601');
    test(new Date(2013, 0, 6), [1], new Date(2013, 0, 6).getTime(), 'Sunday should remain at the end of the week as per ISO8601 standard');
    test(new Date(2013, 0, 13), [1], new Date(2013, 0, 6).getTime(), 'Sunday one week ahead');
    test(new Date(2013, 0, 7), [1], new Date(2012, 11, 31).getTime(), 'Monday should remain at the beginning of the week as per ISO8601 standard');
    test(new Date(2013, 0, 14), [2], new Date(2013, 0, 7).getTime(), 'Monday one week ahead');

  });

  method('format', function() {
    var d = new Date('August 5, 2010 13:45:02');

    test(d, 'August 5, 2010 1:45pm', 'no arguments is standard format with no time');
    test(d, ['{ms}'], '0', 'ms');
    test(d, ['{milliseconds}'], '0', 'milliseconds');
    test(d, ['{f}'], '0', 'f');
    test(d, ['{ff}'], '00', 'ff');
    test(d, ['{fff}'], '000', 'fff');
    test(d, ['{ffff}'], '0000', 'ffff');
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
    test(d, ['{dow}'], 'thu', 'dow');
    test(d, ['{Dow}'], 'Thu', 'Dow');
    test(d, ['{do}'], 'th', 'do');
    test(d, ['{Do}'], 'Th', 'Do');
    test(d, ['{weekday}'], 'thursday', 'weekday');
    test(d, ['{Weekday}'], 'Thursday', 'Weekday');
    test(d, ['{M}'], '8', 'M');
    test(d, ['{MM}'], '08', 'MM');
    test(d, ['{month}'], 'august', 'month');
    test(d, ['{Mon}'], 'Aug', 'Mon');
    test(d, ['{Month}'], 'August', 'Month');
    test(d, ['{yy}'], '10', 'yy');
    test(d, ['{yyyy}'], '2010', 'yyyy');
    test(d, ['{year}'], '2010', 'year');
    test(d, ['{t}'], 'p', 't');
    test(d, ['{T}'], 'P', 'T');
    test(d, ['{tt}'], 'pm', 'tt');
    test(d, ['{TT}'], 'PM', 'TT');
    test(d, ['{ord}'], '5th', 'ord');
    equal(!!run(d, 'format', ['{Z}']).match(testGetTimezoneHours(d)), true, 'Z');
    equal(!!run(d, 'format', ['{ZZ}']).match(testGetTimezoneHours(d)), true, 'Z');

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
    test(d, ['{yyyy}-{MM}-{dd}T{hh}:{mm}:{ss}'], '2010-08-05T04:03:02', 'ISO8601 without timezone');
    test(d, ['{12hr}:{mm} {tt}'], '4:03 am', 'hr:min');
    test(d, ['{12hr}:{mm}:{ss} {tt}'], '4:03:02 am', 'hr:min:sec');
    test(d, ['{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}Z'], '2010-08-05 04:03:02Z', 'ISO8601 UTC');
    test(d, ['{Month}, {yyyy}'], 'August, 2010', 'month and year');

    var isotzd = getExpectedTimezoneOffset(d, true);
    test(d, [getProperty(Date, 'ISO8601_DATE')], '2010-08-05', 'ISO8601_DATE | constant');
    test(d, [getProperty(Date, 'ISO8601_DATETIME')], '2010-08-05T04:03:02.000'+isotzd, 'ISO8601_DATETIME | constant');

    test(d, ['ISO8601_DATE'], '2010-08-05', 'ISO8601_DATE | string');
    test(d, ['ISO8601_DATETIME'], '2010-08-05T04:03:02.000'+isotzd, 'ISO8601_DATETIME | string');

    // RFC
    var d = new Date('August 5, 2010 04:03:02');
    var rfc1123 = testCapitalize(getWeekdayFromDate(d).slice(0,3))+', '+testPadNumber(d.getDate(), 2)+' '+testCapitalize(getMonthFromDate(d).slice(0,3))+' '+d.getFullYear()+' '+testPadNumber(d.getHours(), 2)+':'+testPadNumber(d.getMinutes(), 2)+':'+testPadNumber(d.getSeconds(), 2)+' '+ run(d, 'getUTCOffset');
    var rfc1036 = testCapitalize(getWeekdayFromDate(d))+', '+testPadNumber(d.getDate(), 2)+'-'+testCapitalize(getMonthFromDate(d).slice(0,3))+'-'+d.getFullYear().toString().slice(2)+' '+testPadNumber(d.getHours(), 2)+':'+testPadNumber(d.getMinutes(), 2)+':'+testPadNumber(d.getSeconds(), 2)+' '+run(d, 'getUTCOffset');
    test(d, [getProperty(Date, 'RFC1123')], rfc1123, 'RFC1123 | constant');
    test(d, [getProperty(Date, 'RFC1036')], rfc1036, 'RFC1036 | constant');
    test(d, ['RFC1123'], rfc1123, 'RFC1123 | string');
    test(d, ['RFC1036'], rfc1036, 'RFC1036 | string');

    // RFC - UTC
    var d = run(new Date('August 5, 2010 04:03:02'), 'setUTC', [true]);
    rfc1123 = testCapitalize(getWeekdayFromDate(d,true).slice(0,3))+', '+testPadNumber(d.getUTCDate(), 2)+' '+testCapitalize(getMonthFromDate(d,true).slice(0,3))+' '+d.getUTCFullYear()+' '+testPadNumber(d.getUTCHours(), 2)+':'+testPadNumber(d.getUTCMinutes(), 2)+':'+testPadNumber(d.getUTCSeconds(), 2)+' +0000';
    rfc1036 = testCapitalize(getWeekdayFromDate(d,true))+', '+testPadNumber(d.getUTCDate(), 2)+'-'+testCapitalize(getMonthFromDate(d,true).slice(0,3))+'-'+d.getUTCFullYear().toString().slice(2)+' '+testPadNumber(d.getUTCHours(), 2)+':'+testPadNumber(d.getUTCMinutes(), 2)+':'+testPadNumber(d.getUTCSeconds(), 2)+' +0000';
    test(d, ['RFC1123'], rfc1123, 'Date#format | string constants | RFC1123 UTC');
    test(d, ['RFC1036'], rfc1036, 'Date#format | string constants | RFC1036 UTC');

    // ISO8601 - UTC
    var d = run(new Date('August 5, 2010 04:03:02'), 'setUTC', [true]);
    var iso = d.getUTCFullYear()+'-'+testPadNumber(d.getUTCMonth()+1, 2)+'-'+testPadNumber(d.getUTCDate(), 2)+'T'+testPadNumber(d.getUTCHours(), 2)+':'+testPadNumber(d.getUTCMinutes(), 2)+':'+testPadNumber(d.getUTCSeconds(), 2)+'.'+testPadNumber(d.getUTCMilliseconds(), 3)+'Z';
    test(d, [getProperty(Date, 'ISO8601_DATETIME')], iso, 'ISO8601_DATETIME UTC | constant');
    test(d, ['ISO8601_DATETIME'], iso, 'ISO8601_DATETIME UTC');

    test(new Date(NaN), [getProperty(Date, 'ISO8601_DATETIME')], 'Invalid Date', 'invalid');

    // Issue #262
    equal(/\d+-/.test(run(new Date(), 'format', ['{timezone}'])), false, 'Timezone format should not include hyphens')

  });

  group('Locale Specific Formats', function() {
    var d = new Date('August 5, 2010 04:03:02');
    equal(run(d, 'format', ['short']), 'August 5, 2010', 'Date#format | shortcuts | short');
    equal(run(d, 'short'), 'August 5, 2010', 'Date#format | shortcuts | short method');
    equal(run(d, 'format', ['long']), 'August 5, 2010 4:03am', 'Date#format | shortcuts | long');
    equal(run(d, 'long'), 'August 5, 2010 4:03am', 'Date#format | shortcuts | long method');
    equal(run(d, 'format', ['full']), 'Thursday August 5, 2010 4:03:02am', 'Date#format | shortcuts | full');
    equal(run(d, 'full'), 'Thursday August 5, 2010 4:03:02am', 'Date#format | shortcuts | full method');
  });


  method('getUTCOffset', function() {
    var d = new Date('August 5, 2010 04:03:02');
    test(d, getExpectedTimezoneOffset(d), 'no colon');
    test(d, [true], getExpectedTimezoneOffset(d, true), 'colon');
  });

  method('iso', function() {
    var d = new Date('August 5, 2010 04:03:02');
    var expected = run(run(d, 'setUTC', [true], 'format', [getProperty(Date, 'ISO8601_DATETIME')]));
    test(d, expected, 'Date#iso is an alias for the ISO8601_DATETIME format in UTC');
  });

  group('Relative Dates', function() {

    var d;
    var simpleDateFormat = '{Month} {date}, {year}';

    var dyn = function(value, unit, ms, loc) {
      // One year
      if(ms < -(365 * 24 * 60 * 60 * 1000)) {
        return simpleDateFormat;
      }
    }

    d = getRelativeDate(null, null, null, null, -5);
    equal(run(d, 'relative', [dyn]), '5 minutes ago', '5 minutes should stay relative');

    d = getRelativeDate(null, -13)
    equal(run(d, 'relative', [dyn]), run(d, 'format', [simpleDateFormat]), 'higher reverts to absolute');

    equal(run(testCreateDate('2002-02-17'), 'relative', [dyn]), 'February 17, 2002', 'function that returns a format uses that format');
    equal(run(testCreateDate('45 days ago'), 'relative', [dyn]), '1 month ago', 'function that returns undefined uses relative format');

    // globalize system with plurals

    var strings = ['ミリ秒','秒','分','時間','日','週間','月','年'];

    dyn = function(value, unit, ms, loc) {
      equal(value, 5, '5 minutes ago | value is the closest relevant value');
      equal(unit, 2, '5 minutes ago | unit is the closest relevant unit');
      equalWithMargin(ms, -300000, 20, '5 minutes ago | ms is the offset in ms');
      equal(loc.code, 'en', '4 hours ago | 4th argument is the locale object');
      return value + strings[unit] + (ms < 0 ? '前' : '後');
    }
    equal(run(testCreateDate('5 minutes ago'), 'format', [dyn]), '5分前', '5 minutes ago');


    dyn = function(value, unit, ms, loc) {
      equal(value, 1, '1 minute from now | value is the closest relevant value');
      equal(unit, 2, '1 minute from now | unit is the closest relevant unit');
      equalWithMargin(ms, 61000, 20, '1 minute from now | ms is the offset in ms');
      equal(loc.code, 'en', '4 hours ago | 4th argument is the locale object');
      return value + strings[unit] + (ms < 0 ? '前' : '後');
    }
    equal(run(testCreateDate('61 seconds from now'), 'format', [dyn]), '1分後', '1 minute from now');

    dyn = function(value, unit, ms, loc) {
      equal(value, 4, '4 hours ago | value is the closest relevant value');
      equal(unit, 3, '4 hours ago | unit is the closest relevant unit');
      equalWithMargin(ms, -14400000, 20, '4 hours ago | ms is the offset in ms');
      equal(loc.code, 'en', '4 hours ago | 4th argument is the locale object');
      return value + strings[unit] + (ms < 0 ? '前' : '後');
    }
    equal(run(testCreateDate('240 minutes ago'), 'format', [dyn]), '4時間前', '4 hours ago');

    run(testCreateDate('223 milliseconds ago'), 'format', [function(value, unit) {
      equalWithMargin(value, 223, 20, 'still passes < 1 second');
      equal(unit, 0, 'still passes millisecond is zero');
    }]);

    equal(run(testCreateDate('2002-02-17'), 'format', [function() {}]), 'February 17, 2002 12:00am', 'function that returns undefined defaults to standard format');

    equal(run(testCreateDate(), 'relative'), '1 second ago', '6 milliseconds ago');
    equal(run(testCreateDate('6234 milliseconds ago'), 'relative'), '6 seconds ago', '6 milliseconds ago');
    equal(run(testCreateDate('6 seconds ago'), 'relative'), '6 seconds ago', '6 seconds ago');
    equal(run(testCreateDate('360 seconds ago'), 'relative'), '6 minutes ago', '360 seconds ago');
    equal(run(testCreateDate('360 minutes ago'), 'relative'), '6 hours ago', 'minutes ago');
    equal(run(testCreateDate('360 hours ago'), 'relative'), '2 weeks ago', 'hours ago');
    equal(run(testCreateDate('340 days ago'), 'relative'), '11 months ago', '340 days ago');
    equal(run(testCreateDate('360 days ago'), 'relative'), '11 months ago', '360 days ago');
    equal(run(testCreateDate('360 weeks ago'), 'relative'), '6 years ago', 'weeks ago');
    equal(run(testCreateDate('360 months ago'), 'relative'), '30 years ago', 'months ago');
    equal(run(testCreateDate('360 years ago'), 'relative'), '360 years ago', 'years ago');
    equal(run(testCreateDate('12 months ago'), 'relative'), '1 year ago', '12 months ago');

    equal(run(testCreateDate('6234 milliseconds from now'), 'relative'), '6 seconds from now', '6 milliseconds from now');
    equal(run(testCreateDate('361 seconds from now'), 'relative'), '6 minutes from now', '360 seconds from now');
    equal(run(testCreateDate('361 minutes from now'), 'relative'), '6 hours from now', 'minutes from now');
    equal(run(testCreateDate('360 hours from now'), 'relative'), '2 weeks from now', 'hours from now');
    equal(run(testCreateDate('340 days from now'), 'relative'), '11 months from now', '340 days from now');
    equal(run(testCreateDate('360 days from now'), 'relative'), '11 months from now', '360 days from now');
    equal(run(testCreateDate('360 weeks from now'), 'relative'), '6 years from now', 'weeks from now');
    equal(run(testCreateDate('360 months from now'), 'relative'), '30 years from now', 'months from now');
    equal(run(testCreateDate('360 years from now'), 'relative'), '360 years from now', 'years from now');
    equal(run(testCreateDate('13 months from now'), 'relative'), '1 year from now', '12 months ago from now');

    // Issue #474
    // "1 month from now" can be forced back when there are not enough days in a month.
    // In these cases "relative()" should return "4 weeks from now" instead of "1 month from now".
    testMonthsFromNow(1, '1 month from now', '4 weeks from now');
    testMonthsFromNow(2, '2 months from now', '1 month from now');

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
    test(testCreateDate('sunday'), ['the beginning of the week'], true, 'sunday is the beginning of the week');

    test(testCreateDate('tuesday'), ['tuesday'], true, 'tuesday is tuesday');
    test(testCreateDate('sunday'), ['sunday'], true, 'sunday is sunday');
    test(testCreateDate('saturday'), ['saturday'], true, 'saturday is saturday');

    test(getDateWithWeekdayAndOffset(0), ['the beginning of the week'], true, 'the beginning of the week');
    test(getDateWithWeekdayAndOffset(6, 0, 23, 59, 59, 999), ['the end of the week'], true, 'the end of the week');

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
    test(new Date(1970,4,15,22,3,1,432), [new Date(1971,4,15,22,3,1,432), 31536000000], true, 'accuracy | 1971 accurate to a year');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1971,4,16,22,3,1,432), 31536000000], false, 'accuracy | 1971 accurate to a year is still contstrained');


    // Note that relative #is formats can only be considered to be accurate to within a few milliseconds
    // to avoid complications rising from the date being created momentarily after the function is called.
    test(getRelativeDate(null,null,null,null,null,null, -5), ['3 milliseconds ago'], false, '3 milliseconds ago is accurate to milliseconds');
    test(getRelativeDate(null,null,null,null,null,null, -5), ['5 milliseconds ago', 5], true, '5 milliseconds ago is accurate to milliseconds');
    test(getRelativeDate(null,null,null,null,null,null, -5), ['7 milliseconds ago'], false, '7 milliseconds ago is accurate to milliseconds');

    test(getRelativeDate(null,null,null,null,null,-5), ['4 seconds ago'], false, '4 seconds ago is not 5 seconds ago');
    test(getRelativeDate(null,null,null,null,null,-5), ['5 seconds ago'], true, '5 seconds ago is 5 seconds ago');
    test(getRelativeDate(null,null,null,null,null,-5), ['6 seconds ago'], false, '6 seconds ago is not 5 seconds ago');
    test(getRelativeDate(null,null,null,null,null,-5), ['7 seconds ago'], false, '7 seconds ago is not 5 seconds ago');

    test(getRelativeDate(null,null,null,null,-5), ['4 minutes ago'], false, '4 minutes ago is not 5 minutes ago');
    test(getRelativeDate(null,null,null,null,-5), ['5 minutes ago'], true, '5 minutes ago is 5 minutes ago');
    test(getRelativeDate(null,null,null,null,-5), ['6 minutes ago'], false, '6 minutes ago is not 5 minutes ago');
    test(getRelativeDate(null,null,null,null,-5), ['7 minutes ago'], false, '7 minutes ago is not 5 minutes ago');

    test(getRelativeDate(null,null,null,-5), ['4 hours ago'], false, '4 hours ago is not 5 hours ago');
    test(getRelativeDate(null,null,null,-5), ['5 hours ago'], true, '5 hours ago is 5 hours ago');
    test(getRelativeDate(null,null,null,-5, 15), ['5 hours ago'], true, '5:15 hours ago is still 5 hours ago');
    test(getRelativeDate(null,null,null,-5), ['6 hours ago'], false, '6 hours ago is not 5 hours ago');
    test(getRelativeDate(null,null,null,-5), ['7 hours ago'], false, '7 hours ago is not 5 hours ago');

    test(getRelativeDate(null,null,-5), ['4 days ago'], false, '4 days ago is not 5 days ago');
    test(getRelativeDate(null,null,-5), ['5 days ago'], true, '5 days ago is 5 hours ago');
    test(getRelativeDate(null,null,-5), ['6 days ago'], false, '6 days ago is not 5 days ago');
    test(getRelativeDate(null,null,-5), ['7 days ago'], false, '7 days ago is not 5 days ago');

    test(getRelativeDate(null,-5), ['4 months ago'], false, '4 months ago is not 5 months ago');
    test(getRelativeDate(null,-5), ['5 months ago'], true, '5 months ago is 5 months ago');
    test(getRelativeDate(null,-5), ['6 months ago'], false, '6 months ago is not 5 months ago');
    test(getRelativeDate(null,-5), ['7 months ago'], false, '7 months ago is accurate to months');

    test(getRelativeDate(-5), ['4 years ago'], false, '4 years ago is not 5 years ago');
    test(getRelativeDate(-5), ['5 years ago'], true, '5 years ago is 5 years ago');
    test(getRelativeDate(-5), ['6 years ago'], false, '6 years ago is not 5 years ago');
    test(getRelativeDate(-5), ['7 years ago'], false, '7 years ago is not 5 years ago');

    test(testCreateDate('tomorrow'), ['future'], true, 'tomorrow is the future');
    test(testCreateDate('tomorrow'), ['past'], false, 'tomorrow is the past');

    test(new Date(), ['future'], false, 'now is the future');

    // now CAN be in the past if there is any lag between when the dates are
    // created, so give this a bit of a buffer...
    test(run(new Date(), 'advance', [{ milliseconds: 5 }]), ['past', 40], false, 'now is the past');

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

  method('getISOWeek', function() {
    var d;

    d = new Date(2010,7,5,13,45,2,542);

    test(d, 31, 'basic August 5th, 2010');
    dateEqual(d, new Date(2010,7,5,13,45,2,542), 'should not modify the date');

    test(new Date(2010, 0, 1), 53, 'January 1st, 2010');
    test(new Date(2010, 0, 6), 1, 'January 6th, 2010');
    test(new Date(2010, 0, 7), 1, 'January 7th, 2010');
    test(new Date(2010, 0, 7, 23, 59, 59, 999), 1, 'January 7th, 2010 h23:59:59.999');
    test(new Date(2010, 0, 8), 1, 'January 8th, 2010');
    test(new Date(2010, 3, 15), 15, 'April 15th, 2010');

    d = run(new Date(2010,7,5,13,45,2,542), 'setUTC', [true]);

    test(d, d.getTimezoneOffset() > 615 ? 32 : 31, 'utc | basic');
    test(new Date(2010, 0, 1), 53, 'utc | January 1st UTC is actually 2009');
    test(new Date(2010, 0, 6), 1, 'utc | January 6th');
    test(new Date(2010, 0, 7), 1, 'utc | January 7th');
    test(new Date(2010, 0, 7, 23, 59, 59, 999), 1, 'utc | January 7th 23:59:59.999');
    test(new Date(2010, 0, 8), 1, 'utc | January 8th');
    test(new Date(2010, 3, 15), 15, 'utc | April 15th');

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

    equal(run(new Date(2011,7,5,13,45,2,542), 'millisecondsSince', [d]), 31536000000, 'milliseconds since last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'millisecondsUntil', [d]), -31536000000, 'milliseconds until last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'secondsSince', [d]), 31536000, 'seconds since last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'secondsUntil', [d]), -31536000, 'seconds until last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'minutesSince', [d]), 525600, 'minutes since last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'minutesUntil', [d]), -525600, 'minutes until last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'hoursSince', [d]), 8760, 'hours since last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'hoursUntil', [d]), -8760, 'hours until last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'daysSince', [d]), 365, 'days since last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'daysUntil', [d]), -365, 'days until last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'weeksSince', [d]), 52, 'weeks since last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'weeksUntil', [d]), -52, 'weeks until last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'monthsSince', [d]), 12, 'months since last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'monthsUntil', [d]), -12, 'months until last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'yearsSince', [d]), 1, 'years since last year');
    equal(run(new Date(2011,7,5,13,45,2,542), 'yearsUntil', [d]), -1, 'years until last year');



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

    var dst = (d.getTimezoneOffset() - new Date(2011, 11, 31).getTimezoneOffset()) * 60 * 1000;

    // Works with Date.create?
    equal(run(d, 'millisecondsSince', ['the last day of 2011']), -44273697458 + dst, 'milliseconds since the last day of 2011');
    equal(run(d, 'millisecondsUntil', ['the last day of 2011']), 44273697458 - dst, 'milliseconds until the last day of 2011');
    equal(run(d, 'secondsSince', ['the last day of 2011']), -44273697 + (dst / 1000), 'seconds since the last day of 2011');
    equal(run(d, 'secondsUntil', ['the last day of 2011']), 44273697 - (dst / 1000), 'seconds until the last day of 2011');
    equal(run(d, 'minutesSince', ['the last day of 2011']), -737894 + (dst / 60 / 1000), 'minutes since the last day of 2011');
    equal(run(d, 'minutesUntil', ['the last day of 2011']), 737894 - (dst / 60 / 1000), 'minutes until the last day of 2011');
    equal(run(d, 'hoursSince', ['the last day of 2011']), -12298 + (dst / 60 / 60 / 1000), 'hours since the last day of 2011');
    equal(run(d, 'hoursUntil', ['the last day of 2011']), 12298 - (dst / 60 / 60 / 1000), 'hours until the last day of 2011');
    equal(run(d, 'daysSince', ['the last day of 2011']), -512, 'days since the last day of 2011');
    equal(run(d, 'daysUntil', ['the last day of 2011']), 512, 'days until the last day of 2011');
    equal(run(d, 'weeksSince', ['the last day of 2011']), -73, 'weeks since the last day of 2011');
    equal(run(d, 'weeksUntil', ['the last day of 2011']), 73, 'weeks until the last day of 2011');
    equal(run(d, 'monthsSince', ['the last day of 2011']), -16, 'months since the last day of 2011');
    equal(run(d, 'monthsUntil', ['the last day of 2011']), 16, 'months until the last day of 2011');
    equal(run(d, 'yearsSince', ['the last day of 2011']), -1, 'years since the last day of 2011');
    equal(run(d, 'yearsUntil', ['the last day of 2011']), 1, 'years until the last day of 2011');

    var d = new Date();
    var offset = d.getTime() - getRelativeDate(null, null, -7).getTime();
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
    var d = getRelativeDate(null, null, null, 14);
    equal(run(d, 'daysFromNow'), 0, 'should floor the number rather than round');

    // Issue #267
    equal(run(new Date('Mar 01, 2013'), 'daysUntil', [new Date('Mar 28, 2013')]), 27, 'should not be phased by DST traversal');
    equal(run(new Date('Mar 10, 2013'), 'daysUntil', [new Date('Mar 11, 2013')]), 1, 'exact DST traversal point for CST/CDT');

    // Issue #474
    var daysUntil9pm = run(new Date('11/10/2014 21:00:00'), 'daysSince', [new Date('7/1/2014')]);
    var daysUntil10pm = run(new Date('11/10/2014 22:00:00'), 'daysSince', [new Date('7/1/2014')]);
    equal(daysUntil9pm, daysUntil10pm, 'daysSince should not traverse between 21:00 and 22:00');

  });


  group('Beginning/End', function() {

    var d = new Date('August 5, 2010 13:45:02');

    dateEqual(dateRun(d, 'beginningOfDay'), new Date(2010, 7, 5), 'beginningOfDay');
    dateEqual(dateRun(d, 'beginningOfWeek'), new Date(2010, 7, 1), 'beginningOfWeek');
    dateEqual(dateRun(d, 'beginningOfMonth'), new Date(2010, 7), 'beginningOfMonth');
    dateEqual(dateRun(d, 'beginningOfYear'), new Date(2010, 0), 'beginningOfYear');

    dateEqual(dateRun(d, 'endOfDay'), new Date(2010, 7, 5, 23, 59, 59, 999), 'endOfDay');
    dateEqual(dateRun(d, 'endOfWeek'), new Date(2010, 7, 7, 23, 59, 59, 999), 'endOfWeek');
    dateEqual(dateRun(d, 'endOfMonth'), new Date(2010, 7, 31, 23, 59, 59, 999), 'endOfMonth');
    dateEqual(dateRun(d, 'endOfYear'), new Date(2010, 11, 31, 23, 59, 59, 999), 'endOfYear');

    var d = new Date('January 1, 1979 01:33:42');

    dateEqual(dateRun(d, 'beginningOfDay'), new Date(1979, 0, 1), 'beginningOfDay | January 1, 1979');
    dateEqual(dateRun(d, 'beginningOfWeek'), new Date(1978, 11, 31), 'beginningOfWeek | January 1, 1979');
    dateEqual(dateRun(d, 'beginningOfMonth'), new Date(1979, 0), 'beginningOfMonth | January 1, 1979');
    dateEqual(dateRun(d, 'beginningOfYear'), new Date(1979, 0), 'beginningOfYear | January 1, 1979');

    dateEqual(dateRun(d, 'endOfDay'), new Date(1979, 0, 1, 23, 59, 59, 999), 'endOfDay | January 1, 1979');
    dateEqual(dateRun(d, 'endOfWeek'), new Date(1979, 0, 6, 23, 59, 59, 999), 'endOfWeek | January 1, 1979');
    dateEqual(dateRun(d, 'endOfMonth'), new Date(1979, 0, 31, 23, 59, 59, 999), 'endOfMonth | January 1, 1979');
    dateEqual(dateRun(d, 'endOfYear'), new Date(1979, 11, 31, 23, 59, 59, 999), 'endOfYear | January 1, 1979');

    var d = new Date('December 31, 1945 01:33:42');

    dateEqual(dateRun(d, 'beginningOfDay'), new Date(1945, 11, 31), 'beginningOfDay | January 1, 1945');
    dateEqual(dateRun(d, 'beginningOfWeek'), new Date(1945, 11, 30), 'beginningOfWeek | January 1, 1945');
    dateEqual(dateRun(d, 'beginningOfMonth'), new Date(1945, 11), 'beginningOfMonth | January 1, 1945');
    dateEqual(dateRun(d, 'beginningOfYear'), new Date(1945, 0), 'beginningOfYear | January 1, 1945');

    dateEqual(dateRun(d, 'endOfDay'), new Date(1945, 11, 31, 23, 59, 59, 999), 'endOfDay | January 1, 1945');
    dateEqual(dateRun(d, 'endOfWeek'), new Date(1946, 0, 5, 23, 59, 59, 999), 'endOfWeek | January 1, 1945');
    dateEqual(dateRun(d, 'endOfMonth'), new Date(1945, 11, 31, 23, 59, 59, 999), 'endOfMonth | January 1, 1945');
    dateEqual(dateRun(d, 'endOfYear'), new Date(1945, 11, 31, 23, 59, 59, 999), 'endOfYear | January 1, 1945');

    var d = new Date('February 29, 2012 22:15:42');

    dateEqual(dateRun(d, 'beginningOfDay'), new Date(2012, 1, 29), 'beginningOfDay | February 29, 2012');
    dateEqual(dateRun(d, 'beginningOfWeek'), new Date(2012, 1, 26), 'beginningOfWeek | February 29, 2012');
    dateEqual(dateRun(d, 'beginningOfMonth'), new Date(2012, 1), 'beginningOfMonth | February 29, 2012');
    dateEqual(dateRun(d, 'beginningOfYear'), new Date(2012, 0), 'beginningOfYear | February 29, 2012');

    dateEqual(dateRun(d, 'endOfDay'), new Date(2012, 1, 29, 23, 59, 59, 999), 'endOfDay | February 29, 2012');
    dateEqual(dateRun(d, 'endOfWeek'), new Date(2012, 2, 3, 23, 59, 59, 999), 'endOfWeek | February 29, 2012');
    dateEqual(dateRun(d, 'endOfMonth'), new Date(2012, 1, 29, 23, 59, 59, 999), 'endOfMonth | February 29, 2012');
    dateEqual(dateRun(d, 'endOfYear'), new Date(2012, 11, 31, 23, 59, 59, 999), 'endOfYear | February 29, 2012');

    dateEqual(dateRun(d, 'beginningOfDay', [true]), new Date(2012, 1, 29), 'beginningOfDay | reset if true | February 29, 2012');
    dateEqual(dateRun(d, 'beginningOfWeek', [true]), new Date(2012, 1, 26), 'beginningOfWeek | reset if true | February 29, 2012');
    dateEqual(dateRun(d, 'beginningOfMonth', [true]), new Date(2012, 1), 'beginningOfMonth | reset if true | February 29, 2012');
    dateEqual(dateRun(d, 'beginningOfYear', [true]), new Date(2012, 0), 'beginningOfYear | reset if true | February 29, 2012');

    dateEqual(dateRun(d, 'endOfDay', [true]), new Date(2012, 1, 29, 23, 59, 59, 999), 'endOfDay | reset if true | February 29, 2012');
    dateEqual(dateRun(d, 'endOfWeek', [true]), new Date(2012, 2, 3, 23, 59, 59, 999), 'endOfWeek | reset if true | February 29, 2012');
    dateEqual(dateRun(d, 'endOfMonth', [true]), new Date(2012, 1, 29, 23, 59, 59, 999), 'endOfMonth | reset if true | February 29, 2012');
    dateEqual(dateRun(d, 'endOfYear', [true]), new Date(2012, 11, 31, 23, 59, 59, 999), 'endOfYear | reset if true | February 29, 2012');

    var d = run(runUTC('create', ['January 1, 2010 02:00:00', 'en']), 'setUTC', [true]);

    dateEqual(dateRun(d, 'beginningOfDay'), new Date(Date.UTC(2010, 0)), 'beginningOfDay | utc');
    dateEqual(dateRun(d, 'beginningOfWeek'), new Date(Date.UTC(2009, 11, 27)), 'beginningOfWeek | utc');
    dateEqual(dateRun(d, 'beginningOfMonth'), new Date(Date.UTC(2010, 0)), 'beginningOfMonth | utc');
    dateEqual(dateRun(d, 'beginningOfYear'), new Date(Date.UTC(2010, 0)), 'beginningOfYear | utc');

    dateEqual(dateRun(d, 'endOfDay'), new Date(Date.UTC(2010, 0, 1, 23, 59, 59, 999)), 'endOfDay | utc');
    dateEqual(dateRun(d, 'endOfWeek'), new Date(Date.UTC(2010, 0, 2, 23, 59, 59, 999)), 'endOfWeek | utc');
    dateEqual(dateRun(d, 'endOfMonth'), new Date(Date.UTC(2010, 0, 31, 23, 59, 59, 999)), 'endOfMonth | utc');
    dateEqual(dateRun(d, 'endOfYear'), new Date(Date.UTC(2010, 11, 31, 23, 59, 59, 999)), 'endOfYear | utc');

  });

  group('addUnit', function() {

    var d = new Date('February 29, 2012 22:15:42');

    dateEqual(dateRun(d, 'addMilliseconds', [12]), new Date(2012, 1, 29, 22, 15, 42, 12), 'addMilliseconds');
    dateEqual(dateRun(d, 'addSeconds', [12]), new Date(2012, 1, 29, 22, 15, 54), 'addSeconds');
    dateEqual(dateRun(d, 'addMinutes', [12]), new Date(2012, 1, 29, 22, 27, 42), 'addMinutes');
    dateEqual(dateRun(d, 'addHours', [12]), new Date(2012, 2, 1, 10, 15, 42), 'addHours');
    dateEqual(dateRun(d, 'addDays', [12]), new Date(2012, 2, 12, 22, 15, 42), 'addDays');
    dateEqual(dateRun(d, 'addWeeks', [12]), new Date(2012, 4, 23, 22, 15, 42), 'addWeeks');
    dateEqual(dateRun(d, 'addMonths', [12]), new Date(2013, 1, 28, 22, 15, 42), 'addMonths');
    dateEqual(dateRun(d, 'addYears', [12]), new Date(2024, 1, 29, 22, 15, 42), 'addYears');

    dateEqual(dateRun(d, 'addMilliseconds', [-12]), new Date(2012, 1, 29, 22, 15, 41, 988), 'addMilliseconds | negative');
    dateEqual(dateRun(d, 'addSeconds', [-12]), new Date(2012, 1, 29, 22, 15, 30), 'addSeconds | negative');
    dateEqual(dateRun(d, 'addMinutes', [-12]), new Date(2012, 1, 29, 22, 3, 42), 'addMinutes | negative');
    dateEqual(dateRun(d, 'addHours', [-12]), new Date(2012, 1, 29, 10, 15, 42), 'addHours | negative');
    dateEqual(dateRun(d, 'addDays', [-12]), new Date(2012, 1, 17, 22, 15, 42), 'addDays | negative');
    dateEqual(dateRun(d, 'addWeeks', [-12]), new Date(2011, 11, 7, 22, 15, 42), 'addWeeks | negative');
    dateEqual(dateRun(d, 'addMonths', [-12]), new Date(2011, 1, 28, 22, 15, 42), 'addMonths | negative');
    dateEqual(dateRun(d, 'addYears', [-12]), new Date(2000, 1, 29, 22, 15, 42), 'addYears | negative');

    // Issue #221

    dateEqual(dateRun(new Date(2012, 0), 'addMonths', [-13]), new Date(2010, 11), 'Date#addMonths | Month traversal should not kick in when n < -12');

  });

  method('reset', function() {
    var d = new Date('February 29, 2012 22:15:42');
    var yearZero = new Date(2000, 0);
    yearZero.setFullYear(0);

    dateTest(d, new Date(2012, 1, 29), 'Clears time');

    dateTest(d, ['years'],        yearZero, 'years');
    dateTest(d, ['months'],       new Date(2012, 0), 'months');
    dateTest(d, ['weeks'],        new Date(2012, 0, 4), 'weeks | ISO8601');
    dateTest(d, ['days'],         new Date(2012, 1, 1), 'days');
    dateTest(d, ['hours'],        new Date(2012, 1, 29), 'hours');
    dateTest(d, ['minutes'],      new Date(2012, 1, 29, 22), 'minutes');
    dateTest(d, ['seconds'],      new Date(2012, 1, 29, 22, 15), 'seconds');
    dateTest(d, ['milliseconds'], new Date(2012, 1, 29, 22, 15, 42), 'milliseconds');

    dateTest(d, ['year'],        yearZero, 'year');
    dateTest(d, ['month'],       new Date(2012, 0), 'month');
    dateTest(d, ['week'],        new Date(2012, 0, 4), 'weeks | ISO8601');
    dateTest(d, ['day'],         new Date(2012, 1, 1), 'day');
    dateTest(d, ['hour'],        new Date(2012, 1, 29), 'hour');
    dateTest(d, ['minute'],      new Date(2012, 1, 29, 22), 'minute');
    dateTest(d, ['second'],      new Date(2012, 1, 29, 22, 15), 'second');
    dateTest(d, ['millisecond'], new Date(2012, 1, 29, 22, 15, 42), 'millisecond');

    dateTest(d, ['date'],  new Date(2012, 1, 1), 'date');
    dateTest(d, ['flegh'], new Date(2012, 1, 29, 22, 15, 42), 'an unknown string will do nothing');

    dateEqual(dateRun(d, 'addDays', [5, true]), new Date(2012, 2, 5), 'can also reset the time');
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
    equal(run(now, 'isThisWeek'), true, 'isThisWeek | now');
    equal(run(now, 'isNextWeek'), false, 'isNextWeek | now');
    equal(run(now, 'isLastMonth'), false, 'isLastMonth | now');
    equal(run(now, 'isThisMonth'), true, 'isThisMonth | now');
    equal(run(now, 'isNextMonth'), false, 'isNextMonth | now');
    equal(run(now, 'isLastYear'), false, 'isLastYear | now');
    equal(run(now, 'isThisYear'), true, 'isThisYear | now');
    equal(run(now, 'isNextYear'), false, 'isNextYear | now');

    equal(run(getRelativeDate(null, null, -7), 'isLastWeek'), true, 'isLastWeek | last week');
    equal(run(getRelativeDate(null, null, -7), 'isThisWeek'), false, 'isThisWeek | last week');
    equal(run(getRelativeDate(null, null, -7), 'isNextWeek'), false, 'isNextWeek | last week');

    equal(run(getRelativeDate(null, null, 7), 'isLastWeek'), false, 'isLastWeek | next week');
    equal(run(getRelativeDate(null, null, 7), 'isThisWeek'), false, 'isThisWeek | next week');
    equal(run(getRelativeDate(null, null, 7), 'isNextWeek'), true, 'isNextWeek | next week');

    equal(run(getDateWithWeekdayAndOffset(0), 'isLastWeek'), false, 'isLastWeek | this week sunday is last week');
    equal(run(getDateWithWeekdayAndOffset(0), 'isThisWeek'), true, 'isThisWeek | this week sunday is this week');
    equal(run(getDateWithWeekdayAndOffset(0), 'isNextWeek'), false, 'isNextWeek | this week sunday is next week');

    equal(run(getDateWithWeekdayAndOffset(5), 'isLastWeek'), false, 'isLastWeek | friday is last week');
    equal(run(getDateWithWeekdayAndOffset(5), 'isThisWeek'), true, 'isThisWeek | friday is this week');
    equal(run(getDateWithWeekdayAndOffset(5), 'isNextWeek'), false, 'isNextWeek | friday is next week');

    equal(run(getDateWithWeekdayAndOffset(6), 'isLastWeek'), false, 'isLastWeek | satuday is last week');
    equal(run(getDateWithWeekdayAndOffset(6), 'isThisWeek'), true, 'isThisWeek | satuday is this week');
    equal(run(getDateWithWeekdayAndOffset(6), 'isNextWeek'), false, 'isNextWeek | satuday is next week');

    equal(run(testCreateDate('last sunday'), 'isLastWeek'), true, 'isLastWeek | last sunday');
    equal(run(testCreateDate('last sunday'), 'isThisWeek'), false, 'isThisWeek | last sunday');
    equal(run(testCreateDate('last sunday'), 'isNextWeek'), false, 'isNextWeek | last sunday');

    equal(run(testCreateDate('next sunday'), 'isLastWeek'), false, 'isLastWeek | next sunday');
    equal(run(testCreateDate('next sunday'), 'isThisWeek'), false, 'isThisWeek | next sunday');
    equal(run(testCreateDate('next sunday'), 'isNextWeek'), true, 'isNextWeek | next sunday');

    equal(run(testCreateDate('last monday'), 'isLastWeek'), true, 'isLastWeek | last monday');
    equal(run(testCreateDate('last monday'), 'isThisWeek'), false, 'isThisWeek | last monday');
    equal(run(testCreateDate('last monday'), 'isNextWeek'), false, 'isNextWeek | last monday');

    equal(run(testCreateDate('next monday'), 'isLastWeek'), false, 'isLastWeek | next monday');
    equal(run(testCreateDate('next monday'), 'isThisWeek'), false, 'isThisWeek | next monday');
    equal(run(testCreateDate('next monday'), 'isNextWeek'), true, 'isNextWeek | next monday');

    equal(run(testCreateDate('last friday'), 'isLastWeek'), true, 'isLastWeek | last friday');
    equal(run(testCreateDate('last friday'), 'isThisWeek'), false, 'isThisWeek | last friday');
    equal(run(testCreateDate('last friday'), 'isNextWeek'), false, 'isNextWeek | last friday');

    equal(run(testCreateDate('next friday'), 'isLastWeek'), false, 'isLastWeek | next friday');
    equal(run(testCreateDate('next friday'), 'isThisWeek'), false, 'isThisWeek | next friday');
    equal(run(testCreateDate('next friday'), 'isNextWeek'), true, 'isNextWeek | next friday');

    equal(run(testCreateDate('last saturday'), 'isLastWeek'), true, 'isLastWeek | last saturday');
    equal(run(testCreateDate('last saturday'), 'isThisWeek'), false, 'isThisWeek | last saturday');
    equal(run(testCreateDate('last saturday'), 'isNextWeek'), false, 'isNextWeek | last saturday');

    equal(run(testCreateDate('next saturday'), 'isLastWeek'), false, 'isLastWeek | next saturday');
    equal(run(testCreateDate('next saturday'), 'isThisWeek'), false, 'isThisWeek | next saturday');
    equal(run(testCreateDate('next saturday'), 'isNextWeek'), true, 'isNextWeek | next saturday');

    equal(run(testCreateDate('the beginning of the week'), 'isLastWeek'), false, 'isLastWeek | the beginning of the week');
    equal(run(testCreateDate('the beginning of the week'), 'isThisWeek'), true, 'isThisWeek | the beginning of the week');
    equal(run(testCreateDate('the beginning of the week'), 'isNextWeek'), false, 'isNextWeek | the beginning of the week');


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


    equal(run(getRelativeDate(null, -1), 'isLastWeek'), false, 'isLastWeek | last month');
    equal(run(getRelativeDate(null, -1), 'isThisWeek'), false, 'isThisWeek | last month');
    equal(run(getRelativeDate(null, -1), 'isNextWeek'), false, 'isNextWeek | last month');
    equal(run(getRelativeDate(null, -1), 'isLastMonth'), true, 'isLastMonth | last month');
    equal(run(getRelativeDate(null, -1), 'isThisMonth'), false, 'isThisMonth | last month');
    equal(run(getRelativeDate(null, -1), 'isNextMonth'), false, 'isNextMonth | last month');

    equal(run(getRelativeDate(null, 1), 'isLastWeek'), false, 'isLastWeek | next month');
    equal(run(getRelativeDate(null, 1), 'isThisWeek'), false, 'isThisWeek | next month');
    equal(run(getRelativeDate(null, 1), 'isNextWeek'), false, 'isNextWeek | next month');
    equal(run(getRelativeDate(null, 1), 'isLastMonth'), false, 'isLastMonth | next month');
    equal(run(getRelativeDate(null, 1), 'isThisMonth'), false, 'isThisMonth | next month');
    equal(run(getRelativeDate(null, 1), 'isNextMonth'), true, 'isNextMonth | next month');

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
    dateTest(getRelativeDate(null, 1), ['tomorrow'], true, 'relative | next month');
    dateTest(getRelativeDate(null, null, 1), ['tomorrow'], true, 'relative | tomorrow');

    dateTest(getDateWithWeekdayAndOffset(0), ['monday'], false, 'relative | sunday');
    dateTest(getDateWithWeekdayAndOffset(2), ['monday'], true, 'relative | tuesday');
    dateTest(getDateWithWeekdayAndOffset(0,7), ['monday'], true, 'relative | next week sunday');
    dateTest(getDateWithWeekdayAndOffset(0,-7), ['monday'], false, 'relative | last week sunday');
    dateTest(getDateWithWeekdayAndOffset(0), ['the beginning of this week'], false, 'relative | the beginning of this week');
    dateTest(getDateWithWeekdayAndOffset(0), ['the beginning of last week'], true, 'relative | the beginning of last week');
    dateTest(getDateWithWeekdayAndOffset(0), ['the end of this week'], false, 'relative | the end of this week');

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
    dateTest(getRelativeDate(null, 1), ['tomorrow'], false, 'relative | next month');
    dateTest(getRelativeDate(null, null, 1), ['tomorrow'], false, 'relative | tomorrow');

    dateTest(getDateWithWeekdayAndOffset(0), ['monday'], true, 'relative | sunday');
    dateTest(getDateWithWeekdayAndOffset(2), ['monday'], false, 'relative | tuesday');
    dateTest(getDateWithWeekdayAndOffset(0,7), ['monday'], false, 'relative | next week sunday');
    dateTest(getDateWithWeekdayAndOffset(0,-7), ['monday'], true, 'relative | last week sunday');
    dateTest(getDateWithWeekdayAndOffset(0), ['the beginning of this week'], false, 'relative | the beginning of this week');
    dateTest(getDateWithWeekdayAndOffset(0), ['the beginning of last week'], false, 'relative | the beginning of last week');
    dateTest(getDateWithWeekdayAndOffset(0), ['the end of this week'], true, 'relative | the end of this week');

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
    dateTest(getRelativeDate(null, 1), ['yesterday','tomorrow'], false, 'relative | last month is between today and tomorrow');
    dateTest(getRelativeDate(null, null, 0), ['today','tomorrow'], true, 'relative | right now is between today and tomorrow');
    dateTest(getRelativeDate(null, null, 1), ['today','tomorrow'], false, 'relative | tomorrow is between today and tomorrow');

    dateTest(getDateWithWeekdayAndOffset(0), ['monday', 'friday'], false, 'relative | sunday is between monday and friday');
    dateTest(getDateWithWeekdayAndOffset(2), ['monday', 'friday'], true, 'relative | tuesday is between monday and friday');
    dateTest(getDateWithWeekdayAndOffset(0,7), ['monday', 'friday'], false, 'relative | next week sunday is between monday and friday');
    dateTest(getDateWithWeekdayAndOffset(0,-7), ['monday', 'friday'], false, 'relative | last week sunday is between monday and friday');
    dateTest(getDateWithWeekdayAndOffset(0), ['the beginning of this week','the beginning of last week'], false, 'relative | sunday is between the beginning of this week and the beginning of last week');
    dateTest(getDateWithWeekdayAndOffset(0), ['the beginning of this week','the beginning of next week'], false, 'relative | sunday is between the beginning of this week and the beginning of next week');
    dateTest(getDateWithWeekdayAndOffset(0), ['the beginning of last week','the beginning of next week'], true, 'relative | sunday is between the beginning of last week and the beginning of next week');
    dateTest(getDateWithWeekdayAndOffset(0), ['the beginning of last week','the end of this week'], true, 'relative | sunday is between the beginning of last week and the end of this week');


    dateTest(testCreateDate('yesterday'), ['yesterday', 'today'], false, 'today is between yesterday and today');
    dateTest(testCreateDate('yesterday'), ['yesterday', 'today', 5], true, 'today is between yesterday and today with a 5ms margin');
    dateTest(testCreateDate('tomorrow'), ['today', 'tomorrow'], false, 'tomrrow is between today and tomorrow');
    dateTest(testCreateDate('tomorrow'), ['today', 'tomorrow', 5], true, 'tomrrow is between today and tomorrow with a 5ms margin');

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


  method('addFormat', function() {

    run(Date, 'addFormat', ['(\\d+)\\^\\^(\\d+)%%(\\d+), but at the (beginning|end)', ['date','year','month','edge']]);
    dateEqual(testCreateDate('25^^2008%%02, but at the end'), new Date(2008, 1, 25, 23, 59, 59, 999), 'Date.addFormat | make your own crazy format!');

    run(Date, 'addFormat', ['on ze (\\d+)th of (january|february|march|april|may) lavigne', ['date','month'], 'en']);
    dateEqual(testCreateDate('on ze 18th of april lavigne', 'en'), new Date(thisYear, 3, 18), 'handles other formats');

    equal(typeof testGetLocale(), 'object', 'current localization object is exposed in case needed');
    equal(testGetLocale().code, 'en', 'adding the format did not change the current locale');

  });

  group('Date Locales', function() {

    equal(run(new Date(2011, 5, 18), 'format', ['{Month} {date}, {yyyy}']), 'June 18, 2011', 'Non-initialized defaults to English formatting');
    equal(run(getRelativeDate(null, null, null, -1), 'relative'), '1 hour ago', 'Non-initialized relative formatting is also English');
    equal(run(testCreateDate('June 18, 2011'), 'isValid'), true, 'English dates will also be properly parsed without being initialized or passing a locale code');


    testSetLocale('fo');

    equal(run(testCreateDate('2011kupo', 'fo'), 'isValid'), true, 'dates will parse if their locale is passed');
    equal(run(testCreateDate('２０１１年０６月１８日'), 'isValid'), false, 'dates will not parse thereafter as the current locale is still en');

    equal(run(new Date(2011, 5, 6), 'format', ['{Month}']), 'La', 'june is La');

    raisesError(function(){ testSetLocale(); }, 'no arguments raises error');
    equal(testGetLocale().code, 'fo', 'setting locale with no arguments had no effect');
    equal(run(new Date(2011, 5, 6), 'format', ['{Month}']), 'La', 'will not change the locale if no argument passed');
    equal(run(new Date(2011, 5, 6), 'format', ['', 'en']), 'June 6, 2011 12:00am', 'local locale should override global');
    equal(run(testCreateDate('5 months ago', 'en'), 'relative', ['en']), '5 months ago', 'local locale should override global');

    raisesError(function(){ testSetLocale(''); }, '"" raises an invalid locale error');
    equal(run(new Date(2011, 5, 6), 'format', ['{Month}']), 'La', 'will not change the locale if blank string passed');
    dateEqual(testCreateDate('2010-Jan-25', 'fo'), new Date(2010, 0, 25), 'Static input format always matches English months');

    raisesError(function(){ testSetLocale('pink'); }, 'Non-existent locales will raise an error');
    equal(run(testCreateDate('2010-Jan-25'), 'format'), 'yeehaw', 'will not set the current locale to an invalid locale');

  });

  testSetLocale('en');

  method('getISOWeek', function() {

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

  });

  group('Custom Formats', function() {

    // https://github.com/andrewplummer/Sugar/issues/119#issuecomment-4520966

    run(Date, 'addFormat', ['(\\d{2})(\\d{2})',['hour','minute']]);
    dateEqual(testCreateDate('0615'), testCreateDate('06:15'), 'Overrides defined formats');

    // Not sure how nuts I want to get with this so for the sake of the tests just push the proper format back over the top...
    run(Date, 'addFormat', ['(\\d{4})', ['year']]);
  });

  method('iso', function() {

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
  });


  group('Adding a locale', function() {
    testSetLocale('en');
    testAddLocale('foobar', { months: ['a','b','c'] });

    equal(testGetLocale().code, testGetLocale('en').code, 'adding a locale does not affect the current locale');
    equal(testGetLocale('foobar').months[0], 'a', 'new locale has been added');
    dateEqual(testCreateDate('a', 'foobar'), testCreateDate('January'), 'formats have been recognized');
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


  group('newDateInternal', function() {

    // Issue #342 handling offsets for comparison

    Sugar.Date.newDateInternal = function() {
      var d = new Date();
      // Honolulu time zone
      d.setTime(d.getTime() + ((d.getTimezoneOffset() - 600) * 60 * 1000));
      return d;
    };

    var offset = 600 - new Date().getTimezoneOffset();
    dateEqual(testCreateDate(), getRelativeDate(null, null, null, null, -offset), 'simple create should respect global offset');
    dateEqual(testCreateDate('1 day ago'), getRelativeDate(null, null, -1, null, -offset), 'relative date should respect global offset');
    equal(testCreatePastDate('4pm').getTime() < (new Date().getTime() + (-offset * 60 * 1000)), true, 'past repsects global offset');
    equal(testCreateFutureDate('4pm').getTime() > (new Date().getTime() + (-offset * 60 * 1000)), true, 'future repsects global offset');

    var d = new Date;
    d.setTime(d.getTime() + ((d.getTimezoneOffset() + 60) * 60 * 1000));
    equal(run(d, 'isFuture'), true, 'should respect global offset');
    equal(run(d, 'isPast'), false, 'should respect global offset');


    // Issue #342 internal constructor override

    var AwesomeDate = function() {};
    AwesomeDate.prototype = new Date();
    AwesomeDate.prototype.getMinutes = function() {
    }

    Sugar.Date.newDateInternal = function() {
      return new AwesomeDate();
    }

    equal(testCreateDate() instanceof AwesomeDate, true, 'Result should be use in Date.create');

    Sugar.Date.newDateInternal = null;

  });

});

package('Number', function () {

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

    dateEqual(run(1, 'secondAfter'), 1000, 'secondAfter | 1');
    dateEqual(run(5, 'secondsAfter'), 5000, 'secondsAfter | 5');
    dateEqual(run(10, 'minutesAfter'), 600000, 'minutesAfter | 10');

    dateEqual(run(1, 'secondFromNow'), 1000, 'secondFromNow | 1');
    dateEqual(run(5, 'secondsFromNow'), 5000, 'secondsFromNow | 5');
    dateEqual(run(10, 'minutesFromNow'), 600000, 'minutesFromNow | 10');

    dateEqual(run(1, 'secondAgo'), -1000, 'secondAgo | 1');
    dateEqual(run(5, 'secondsAgo'), -5000, 'secondAgo | 5');
    dateEqual(run(10, 'secondsAgo'), -10000, 'secondAgo | 10');

    dateEqual(run(1, 'secondBefore'), -1000, 'secondBefore | 1');
    dateEqual(run(5, 'secondsBefore'), -5000, 'secondBefore | 5');
    dateEqual(run(10, 'secondsBefore'), -10000, 'secondBefore | 10');

    dateEqual(run(5, 'minutesAfter', [run(5, 'minutesAgo')]), 0, 'minutesAfter | 5 minutes after 5 minutes ago');
    dateEqual(run(10, 'minutesAfter', [run(5, 'minutesAgo')]), 1000 * 60 * 5, 'minutesAfter | 10 minutes after 5 minutes ago');

    dateEqual(run(5, 'minutesFromNow', [run(5, 'minutesAgo')]), 0, 'minutesFromNow | 5 minutes from now 5 minutes ago');
    dateEqual(run(10, 'minutesFromNow', [run(5, 'minutesAgo')]), 1000 * 60 * 5, 'minutesFromNow | 10 minutes from now 5 minutes ago');

    dateEqual(run(5, 'minutesAgo', [run(5, 'minutesFromNow')]), 0, 'minutesAgo | 5 minutes ago 5 minutes from now');
    dateEqual(run(10, 'minutesAgo', [run(5, 'minutesFromNow')]), -(1000 * 60 * 5), 'minutesAgo | 10 minutes ago 5 minutes from now');

    dateEqual(run(5, 'minutesBefore', [run(5, 'minutesFromNow')]), 0, 'minutesBefore | 5 minutes before 5 minutes from now');
    dateEqual(run(10, 'minutesBefore', [run(5, 'minutesFromNow')]), -(1000 * 60 * 5), 'minutesBefore | 10 minutes before 5 minutes from now');


    var christmas = new Date('December 25, 1972');

    dateEqual(run(5, 'minutesBefore', [christmas]), getRelativeDate.call(christmas, null, null, null, null, -5), 'minutesBefore | 5 minutes before christmas');
    dateEqual(run(5, 'minutesAfter', [christmas]), getRelativeDate.call(christmas, null, null, null, null, 5), 'minutesAfter | 5 minutes after christmas');

    dateEqual(run(5, 'hoursBefore', [christmas]), getRelativeDate.call(christmas, null, null, null, -5), 'hoursBefore | 5 hours before christmas');
    dateEqual(run(5, 'hoursAfter', [christmas]), getRelativeDate.call(christmas, null, null, null, 5), 'hoursAfter | 5 hours after christmas');

    dateEqual(run(5, 'daysBefore', [christmas]), getRelativeDate.call(christmas, null, null, -5), 'daysBefore | 5 days before christmas');
    dateEqual(run(5, 'daysAfter', [christmas]), getRelativeDate.call(christmas, null, null, 5), 'daysAfter | 5 days after christmas');

    dateEqual(run(5, 'weeksBefore', [christmas]), getRelativeDate.call(christmas, null, null, -35), 'weeksBefore | 5 weeks before christmas');
    dateEqual(run(5, 'weeksAfter', [christmas]), getRelativeDate.call(christmas, null, null, 35), 'weeksAfter | 5 weeks after christmas');

    dateEqual(run(5, 'monthsBefore', [christmas]), getRelativeDate.call(christmas, null, -5), 'monthsBefore | 5 months before christmas');
    dateEqual(run(5, 'monthsAfter', [christmas]), getRelativeDate.call(christmas, null, 5), 'monthsAfter | 5 months after christmas');

    dateEqual(run(5, 'yearsBefore', [christmas]), getRelativeDate.call(christmas, -5), 'yearsBefore | 5 years before christmas');
    dateEqual(run(5, 'yearsAfter', [christmas]), getRelativeDate.call(christmas, 5), 'yearsAfter | 5 years after christmas');

    dateEqual(run(5, 'hoursBefore', [1972, 11, 25]), getRelativeDate.call(christmas, null, null, null, -5), 'hoursBefore | accepts numbers');


    // Hooking it all up!!

    // Try this in WinXP:
    // 1. Set timezone to Damascus
    // 2. var d = new Date(1998, 3, 3, 17); d.setHours(0); d.getHours();
    // 3. hours = 23
    // 4. PROFIT $$$

    dateEqual(run(5, 'minutesBefore', ['April 2rd, 1998']), new Date(1998, 3, 1, 23, 55), 'minutesBefore | 5 minutes before April 3rd, 1998');
    dateEqual(run(5, 'minutesAfter', ['January 2nd, 2005']), new Date(2005, 0, 2, 0, 5), 'minutesAfter | 5 minutes after January 2nd, 2005');
    dateEqual(run(5, 'hoursBefore', ['the first day of 2005']), new Date(2004, 11, 31, 19), 'hoursBefore | 5 hours before the first day of 2005');
    dateEqual(run(5, 'hoursAfter', ['the last day of 2006']), new Date(2006, 11, 31, 5), 'hoursAfter | 5 hours after the last day of 2006');
    dateEqual(run(5, 'hoursAfter', ['the end of 2006']), new Date(2007, 0, 1, 4, 59, 59, 999), 'hoursAfter | 5 hours after the end of 2006');


    var expected = getDateWithWeekdayAndOffset(1, -7);
    expected.setDate(expected.getDate() - 5);
    dateEqual(run(5, 'daysBefore', ['last week monday']), expected, 'daysBefore | 5 days before last week monday');

    var expected = new Date(getDateWithWeekdayAndOffset(2, 7).getTime() + run(5, 'days'));
    dateEqual(run(5, 'daysAfter', ['next tuesday']), expected, 'daysAfter | 5 days after next week tuesday');

    var expected = getRelativeDate(null, null, -35);
    expected.setHours(0);
    expected.setMinutes(0);
    expected.setSeconds(0);
    expected.setMilliseconds(0);
    dateEqual(run(5, 'weeksBefore', ['today']), expected, 'weeksBefore | 5 weeks before today');

    var expected = getRelativeDate(null, null, 35);
    dateEqual(run(5, 'weeksAfter', ['now']), expected, 'weeksAfter | 5 weeks after now');

    var expected = getRelativeDate(null, -5);
    expected.setHours(0);
    expected.setMinutes(0);
    expected.setSeconds(0);
    expected.setMilliseconds(0);
    dateEqual(run(5, 'monthsBefore', ['today']), expected, 'monthsBefore | 5 months before today');

    var expected = getRelativeDate(null, 5);
    dateEqual(run(5, 'monthsAfter', ['now']), expected, 'monthsAfter | 5 months after now');

  });

  method('duration', function() {

    testSetLocale('en');

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


    // Fake Locale

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
      'ampm','articles','code','date','dateParse','day','duration','edge','full',
      'full_month','future','cachedFormat','compiledFormats', 'modifiers','long','modifiers','modifiersByName',
      'months','num','numbers','past','plural','shift','short','sign','timeMarker',
      'timeParse','timeSuffixes','tokens','units','weekdays','year'
    ];

    properties.forEach(function(p) {
      equal(!!en[p], true, 'property ' + p + ' should exist in the locale object');
    });

    var cf = en.compiledFormats[0];
    equal(cf.hasOwnProperty('variant'), true, 'compiled format should have a variant property');
    equal(cf.hasOwnProperty('locale'), true, 'compiled format should have a locale property');
    equal(cf.hasOwnProperty('reg'), true, 'compiled format should have a reg property');
    equal(cf.hasOwnProperty('to'), true, 'compiled format should have a to property');

  });

});
