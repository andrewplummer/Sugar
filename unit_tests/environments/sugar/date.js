test('Date', function () {

  equal(Date.getLocale().code !== undefined, true, 'Current locale must be something... other libs may overwrite this');

  // Imaginary local to test locale switching
  Date.addLocale('fo', {
    units: 'do,re,mi,fa,so,la,ti,do',
    months: 'do,re,mi,fa,so,la,ti,do',
    dateParse: '{year}kupo',
    duration: '{num}{unit}momoney',
    long: 'yeehaw'
  });

  Date.setLocale('en');

  // Mootools over-stepping itself here with the "create" method implemented as a Function instance method,
  // which interferes with class methods as classes themselves are functions. Taking back this class method
  // for the sake of the tests.
  if(typeof Date.create() === 'function') {
    Date.restore('create');
  };

  var day, d, date1, date2, dst, o;
  var isCurrentlyGMT = new Date(2011, 0, 1).getTimezoneOffset() === 0;
  var now = new Date();
  var thisYear = now.getFullYear();

  // Invalid date
  equal(new Date('a fridge too far').isValid(), false, 'Date#isValid | new Date invalid');
  equal(new Date().isValid(), true, 'Date#isValid | new Date valid');

  equal(Date.create().isValid(), true, 'Date#isValid | created date is valid');
  equal(Date.create('a fridge too far').isValid(), false, 'Date#isValid | Date#create invalid');


  d = new Date(1998, 0);

  equal(d.isUTC(), d.getTimezoneOffset() === 0, 'Date#isUTC | UTC is true if the current timezone has no offset');

  // UTC is still false even if the time is reset to the intended utc equivalent, as timezones can never be changed
  equal(d.clone().addMinutes(d.getTimezoneOffset()).isUTC(), d.getTimezoneOffset() === 0, 'Date#isUTC | UTC cannot be forced');

  dateEqual(Date.create(), new Date(), 'Date#create | empty');



  // Date constructor accepts enumerated parameters

  dateEqual(Date.create(1998), new Date(1998), 'Date#create | enumerated | 1998');
  dateEqual(Date.create(1998,1), new Date(1998,1), 'Date#create | enumerated | January, 1998');
  dateEqual(Date.create(1998,1,23), new Date(1998,1,23), 'Date#create | enumerated | January 23, 1998');
  dateEqual(Date.create(1998,1,23,11), new Date(1998,1,23,11), 'Date#create | enumerated | January 23, 1998 11am');
  dateEqual(Date.create(1998,1,23,11,54), new Date(1998,1,23,11,54), 'Date#create | enumerated | January 23, 1998 11:54am');
  dateEqual(Date.create(1998,1,23,11,54,32), new Date(1998,1,23,11,54,32), 'Date#create | enumerated | January 23, 1998 11:54:32');
  dateEqual(Date.create(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,454), 'Date#create | enumerated | January 23, 1998 11:54:32.454');

  dateEqual(Date.create('1998', true), new Date(1998, 0), 'Date#create | will not choke on a boolean as second param');
  dateEqual(Date.create('1998', ''), new Date(1998, 0), 'Date#create | will not choke on an empty string as second param');


  // Date constructor accepts an object

  dateEqual(Date.create({ year: 1998 }), new Date(1998, 0), 'Date#create | object | 1998');
  dateEqual(Date.create({ year: 1998, month: 1 }), new Date(1998,1), 'Date#create | object | January, 1998');
  dateEqual(Date.create({ year: 1998, month: 1, day: 23 }), new Date(1998,1,23), 'Date#create | object | January 23, 1998');
  dateEqual(Date.create({ year: 1998, month: 1, day: 23, hour: 11 }), new Date(1998,1,23,11), 'Date#create | object | January 23, 1998 11am');
  dateEqual(Date.create({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }), new Date(1998,1,23,11,54), 'Date#create | object | January 23, 1998 11:54am');
  dateEqual(Date.create({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }), new Date(1998,1,23,11,54,32), 'Date#create | object | January 23, 1998 11:54:32');
  dateEqual(Date.create({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }), new Date(1998,1,23,11,54,32,454), 'Date#create | object | January 23, 1998 11:54:32.454');


  dateEqual(new Date(new Date(2008, 6, 22)), new Date(2008, 6, 22), 'Date | date accepts itself as a constructor');


  var timestamp = 1294012800000;
  d = Date.create(timestamp); // 2011-01-03 00:00:00 

  equal(d.getFullYear(), 2011, 'Date#create | Accepts numbers | 2011')
  equal(d.getMonth(), 0, 'Date#create | Accepts numbers | January');
  equal(d.getDate(), Math.floor(3 - (d.getTimezoneOffset() / 60 / 24)), 'Date#create | Accepts numbers | January');

  equal(d.is(timestamp), true, 'Date#is | Accepts numbers');


  dateEqual(Date.create('1999'), new Date(1999, 0), 'Date#create | Just the year');

  dateEqual(Date.create('June'), new Date(thisYear, 5), 'Date#create | Just the month');
  dateEqual(Date.create('June 15'), new Date(thisYear, 5, 15), 'Date#create | Month and day');
  dateEqual(Date.create('June 15th'), new Date(thisYear, 5, 15), 'Date#create | Month and ordinal day');

  // Slashes (American style)
  dateEqual(Date.create('08/25'), new Date(thisYear, 7, 25), 'Date#create | American style slashes | mm/dd');
  dateEqual(Date.create('8/25'), new Date(thisYear, 7, 25), 'Date#create | American style slashes | m/dd');
  dateEqual(Date.create('08/25/1978'), new Date(1978, 7, 25), 'Date#create | American style slashes | mm/dd/yyyy');
  dateEqual(Date.create('8/25/1978'), new Date(1978, 7, 25), 'Date#create | American style slashes | /m/dd/yyyy');
  dateEqual(Date.create('8/25/78'), new Date(1978, 7, 25), 'Date#create | American style slashes | m/dd/yy');
  dateEqual(Date.create('08/25/78'), new Date(1978, 7, 25), 'Date#create | American style slashes | mm/dd/yy');
  dateEqual(Date.create('8/25/01'), new Date(2001, 7, 25), 'Date#create | American style slashes | m/dd/01');
  dateEqual(Date.create('8/25/49'), new Date(2049, 7, 25), 'Date#create | American style slashes | m/dd/49');
  dateEqual(Date.create('8/25/50'), new Date(1950, 7, 25), 'Date#create | American style slashes | m/dd/50');


  // August 25, 0001... the numeral 1 gets interpreted as 1901...
  // freakin' unbelievable...
  dateEqual(toUTC(Date.create('08/25/0001')), new Date(-62115206400000), 'Date#create | American style slashes | mm/dd/0001');

  // Dashes (American style)
  dateEqual(Date.create('08-25-1978'), new Date(1978, 7, 25), 'Date#create | American style dashes | mm-dd-yyyy');
  dateEqual(Date.create('8-25-1978'), new Date(1978, 7, 25), 'Date#create | American style dashes | m-dd-yyyy');


  // dd-dd-dd is NOT a valid ISO 8601 representation as of 2004, hence this format will
  // revert to a little endian representation, where year truncation is allowed. See:
  // http://en.wikipedia.org/wiki/ISO_8601#Truncated_representations
  dateEqual(Date.create('08-05-05'), new Date(2005, 7, 5), 'Date#create | dd-dd-dd is an ISO8601 format');

  // Dots (American style)
  dateEqual(Date.create('08.25.1978'), new Date(1978, 7, 25), 'Date#create | American style dots | mm.dd.yyyy');
  dateEqual(Date.create('8.25.1978'), new Date(1978, 7, 25), 'Date#create | American style dots | m.dd.yyyy');






  // Abbreviated reverse slash format yy/mm/dd cannot exist because it clashes with forward
  // slash format dd/mm/yy (with european variant). This rule however, doesn't follow for dashes,
  // which is abbreviated ISO8601 format: yy-mm-dd
  dateEqual(Date.create('01/02/03'), new Date(2003, 0, 2), 'Date#create | Ambiguous 2 digit format mm/dd/yy');


  dateEqual(Date.create('08/10', 'en-GB'), new Date(thisYear, 9, 8), 'Date#create | European style slashes | dd/mm');
  dateEqual(Date.create('8/10', 'en-GB'), new Date(thisYear, 9, 8), 'Date#create | European style slashes | d/mm');
  dateEqual(Date.create('08/10/1978', 'en-GB'), new Date(1978, 9, 8), 'Date#create | European style slashes | dd/mm/yyyy');
  dateEqual(Date.create('8/10/1978', 'en-GB'), new Date(1978, 9, 8), 'Date#create | European style slashes | d/mm/yyyy');
  dateEqual(Date.create('8/10/78', 'en-GB'), new Date(1978, 9, 8), 'Date#create | European style slashes | d/mm/yy');
  dateEqual(Date.create('08/10/78', 'en-GB'), new Date(1978, 9, 8), 'Date#create | European style slashes | dd/mm/yy');
  dateEqual(Date.create('8/10/01', 'en-GB'), new Date(2001, 9, 8), 'Date#create | European style slashes | d/mm/01');
  dateEqual(Date.create('8/10/49', 'en-GB'), new Date(2049, 9, 8), 'Date#create | European style slashes | d/mm/49');
  dateEqual(Date.create('8/10/50', 'en-GB'), new Date(1950, 9, 8), 'Date#create | European style slashes | d/mm/50');

  dateEqual(Date.create('08/10', 'en-AU'), new Date(thisYear, 9, 8), 'Date#create | European style slashes | any English locale suffix should work and not use US format');

  // Dashes (European style)
  dateEqual(Date.create('08-10-1978', 'en-GB'), new Date(1978, 9, 8), 'Date#create | European style dashes | mm-dd-yyyy');

  // Dots (European style)
  dateEqual(Date.create('08.10.1978', 'en-GB'), new Date(1978, 9, 8), 'Date#create | European style dots | dd.mm.yyyy');
  dateEqual(Date.create('8.10.1978', 'en-GB'), new Date(1978, 9, 8), 'Date#create | European style dots | d.mm.yyyy');
  dateEqual(Date.create('08-05-05', 'en-GB'), new Date(2005, 4, 8), 'Date#create | dd-dd-dd is NOT an ISO8601 format');

  dateEqual(Date.create('8/10/85'), new Date(1985, 7, 10), 'Date#create | American format will now revert back');


  Date.setLocale('en-GB');
  dateEqual(Date.create('8/10/85'), new Date(1985, 9, 8), 'Date#create | European style slashes | after global set');
  Date.setLocale('en');
  dateEqual(Date.create('8/10/85'), new Date(1985, 7, 10), 'Date#create | European style slashes | before global reset');


  // Stolen with love from XDate, ability to parse IETF format
  dateEqual(Date.create('Mon Sep 05 2011 12:30:00 GMT-0700 (PDT)'), getUTCDate(2011,9,5,19,30), 'Date#create | IETF format');


  /*
   * Reverse slashes
   * This seems like it should be invalid. Looking at the link below it seems that there isn't a format
   * that uses slashes in combination with the "big endian" format. If this changes or there is a valid
   * use case here then we can rethink...
   *
   * http://en.wikipedia.org/wiki/Calendar_date
   *
   */
  //dateEqual(Date.create('1978/08/25'), new Date(1978, 7, 25), 'Date#create | Reverse slashes | yyyy/mm/dd');
  //dateEqual(Date.create('1978/8/25'), new Date(1978, 7, 25), 'Date#create | Reverse slashes | yyyy/m/dd');
  //dateEqual(Date.create('1978/08'), new Date(1978, 7), 'Date#create | Reverse slashes | yyyy/mm');
  //dateEqual(Date.create('1978/8'), new Date(1978, 7), 'Date#create | Reverse slashes | yyyy/m');

  // Reverse dashes
  dateEqual(Date.create('1978-08-25'), new Date(1978, 7, 25), 'Date#create | Reverse dashes | yyyy-mm-dd');
  dateEqual(Date.create('1978-08'), new Date(1978, 7), 'Date#create | Reverse dashes | yyyy-mm');
  dateEqual(Date.create('1978-8'), new Date(1978, 7), 'Date#create | Reverse dashes | yyyy-m');

  // Reverse dots
  dateEqual(Date.create('1978.08.25'), new Date(1978, 7, 25), 'Date#create | Reverse dots | yyyy.mm.dd');
  dateEqual(Date.create('1978.08'), new Date(1978, 7), 'Date#create | Reverse dots | yyyy.mm');
  dateEqual(Date.create('1978.8'), new Date(1978, 7), 'Date#create | Reverse dots | yyyy.m');
  dateEqual(Date.create('01-02-03', 'en-GB'), new Date(2003, 1, 1), 'Date#create | Ambiguous 2 digit variant yy-mm-dd is NOT ISO 8601');
  dateEqual(Date.create('01/02/03', 'en-GB'), new Date(2003, 1, 1), 'Date#create | Ambiguous 2 digit European variant dd/mm/yy');


  // Text based formats
  dateEqual(Date.create('June 2008'), new Date(2008, 5), 'Date#create | Full text | Month yyyy');
  dateEqual(Date.create('June-2008'), new Date(2008, 5), 'Date#create | Full text | Month-yyyy');
  dateEqual(Date.create('June.2008'), new Date(2008, 5), 'Date#create | Full text | Month.yyyy');
  dateEqual(Date.create('06-2008'), new Date(2008, 5), 'Date#create | Full text | mm-yyyy');
  dateEqual(Date.create('6-2008'), new Date(2008, 5), 'Date#create | Full text | m-yyyy');
  dateEqual(Date.create('June 1st, 2008'), new Date(2008, 5, 1), 'Date#create | Full text | Month 1st, yyyy');
  dateEqual(Date.create('June 2nd, 2008'), new Date(2008, 5, 2), 'Date#create | Full text | Month 2nd, yyyy');
  dateEqual(Date.create('June 3rd, 2008'), new Date(2008, 5, 3), 'Date#create | Full text | Month 3rd, yyyy');
  dateEqual(Date.create('June 4th, 2008'), new Date(2008, 5, 4), 'Date#create | Full text | Month 4th, yyyy');
  dateEqual(Date.create('June 15th, 2008'), new Date(2008, 5, 15), 'Date#create | Full text | Month 15th, yyyy');
  dateEqual(Date.create('June 1st 2008'), new Date(2008, 5, 1), 'Date#create | Full text | Month 1st yyyy');
  dateEqual(Date.create('June 2nd 2008'), new Date(2008, 5, 2), 'Date#create | Full text | Month 2nd yyyy');
  dateEqual(Date.create('June 3rd 2008'), new Date(2008, 5, 3), 'Date#create | Full text | Month 3rd yyyy');
  dateEqual(Date.create('June 4th 2008'), new Date(2008, 5, 4), 'Date#create | Full text | Month 4th yyyy');
  dateEqual(Date.create('June 15, 2008'), new Date(2008, 5, 15), 'Date#create | Full text | Month dd, yyyy');
  dateEqual(Date.create('June 15 2008'), new Date(2008, 5, 15), 'Date#create | Full text | Month dd yyyy');
  dateEqual(Date.create('15 July, 2008'), new Date(2008, 6, 15), 'Date#create | Full text | dd Month, yyyy');
  dateEqual(Date.create('15 July 2008'), new Date(2008, 6, 15), 'Date#create | Full text | dd Month yyyy');
  dateEqual(Date.create('juNe 1St 2008'), new Date(2008, 5, 1), 'Date#create | Full text | Month 1st yyyy case insensitive');


  // Special cases
  dateEqual(Date.create(' July 4th, 1987 '), new Date(1987, 6, 4), 'Date#create | Special Cases | Untrimmed full text');
  dateEqual(Date.create('  7/4/1987 '), new Date(1987, 6, 4), 'Date#create | Special Cases | Untrimmed American');
  dateEqual(Date.create('   1987-07-04    '), new Date(1987, 6, 4), 'Date#create | Special Cases | Untrimmed ISO8601');

  // Abbreviated formats
  dateEqual(Date.create('Dec 1st, 2008'), new Date(2008, 11, 1), 'Date#create | Abbreviated | without dot');
  dateEqual(Date.create('Dec. 1st, 2008'), new Date(2008, 11, 1), 'Date#create | Abbreviated | with dot');
  dateEqual(Date.create('1 Dec. 2008'), new Date(2008, 11, 1), 'Date#create | Abbreviated | reversed with dot');
  dateEqual(Date.create('1 Dec., 2008'), new Date(2008, 11, 1), 'Date#create | Abbreviated | reversed with dot and comma');
  dateEqual(Date.create('1 Dec, 2008'), new Date(2008, 11, 1), 'Date#create | Abbreviated | reversed with comma and no dot');


  // http://en.wikipedia.org/wiki/Calendar_date
  dateEqual(Date.create('09-May-78'), new Date(1978, 4, 9), 'Date#create | Abbreviated | little endian yy');
  dateEqual(Date.create('09-May-1978'), new Date(1978, 4, 9), 'Date#create | Abbreviated | little endian yyyy');
  dateEqual(Date.create('1978-May-09'), new Date(1978, 4, 9), 'Date#create | Abbreviated | big endian');
  dateEqual(Date.create('Wednesday July 3rd, 2008'), new Date(2008, 6, 3), 'Date#create | Full Text | With day of week');
  dateEqual(Date.create('Wed July 3rd, 2008'), new Date(2008, 6, 3), 'Date#create | Full Text | With day of week abbreviated');
  dateEqual(Date.create('Wed. July 3rd, 2008'), new Date(2008, 6, 3), 'Date#create | Full Text | With day of week abbreviated plus dot');
  dateEqual(Date.create('Wed, 03 Jul 2008 08:00:00 EST'), new Date(Date.UTC(2008, 6, 3, 13)), 'Date#create | RFC822');




  // ISO 8601
  dateEqual(Date.create('2001-1-1'), new Date(2001, 0, 1), 'Date#create | ISO8601 | not padded');
  dateEqual(Date.create('2001-01-1'), new Date(2001, 0, 1), 'Date#create | ISO8601 | month padded');
  dateEqual(Date.create('2001-01-01'), new Date(2001, 0, 1), 'Date#create | ISO8601 | month and day padded');
  dateEqual(Date.create('2010-11-22'), new Date(2010, 10,22), 'Date#create | ISO8601 | month and day padded 2010');
  dateEqual(Date.create('20101122'), new Date(2010, 10,22), 'Date#create | ISO8601 | digits strung together');
  dateEqual(Date.create('17760523T024508+0830'), getUTCDate(1776, 5, 22, 18, 15, 08), 'Date#create | ISO8601 | full datetime strung together');
  dateEqual(Date.create('-0002-07-26'), new Date(-2, 6, 26), 'Date#create | ISO8601 | minus sign (bc)'); // BC
  dateEqual(Date.create('+1978-04-17'), new Date(1978, 3, 17), 'Date#create | ISO8601 | plus sign (ad)'); // AD



  // Date with time formats
  dateEqual(Date.create('08/25/1978 12:04'), new Date(1978, 7, 25, 12, 4), 'Date#create | Date/Time | Slash format');
  dateEqual(Date.create('08-25-1978 12:04'), new Date(1978, 7, 25, 12, 4), 'Date#create | Date/Time | Dash format');
  dateEqual(Date.create('1978/08/25 12:04'), new Date(1978, 7, 25, 12, 4), 'Date#create | Date/Time | Reverse slash format');
  dateEqual(Date.create('June 1st, 2008 12:04'), new Date(2008, 5, 1, 12, 4), 'Date#create | Date/Time | Full text format');


  dateEqual(Date.create('08-25-1978 12:04:57'), new Date(1978, 7, 25, 12, 4, 57), 'Date#create | Date/Time | with seconds');
  dateEqual(Date.create('08-25-1978 12:04:57.322'), new Date(1978, 7, 25, 12, 4, 57, 322), 'Date#create | Date/Time | with milliseconds');

  dateEqual(Date.create('08-25-1978 12pm'), new Date(1978, 7, 25, 12), 'Date#create | Date/Time | with am/pm');
  dateEqual(Date.create('08-25-1978 12:42pm'), new Date(1978, 7, 25, 12, 42), 'Date#create | Date/Time | with minutes and am/pm');
  dateEqual(Date.create('08-25-1978 12:42:32pm'), new Date(1978, 7, 25, 12, 42, 32), 'Date#create | Date/Time | with seconds and am/pm');
  dateEqual(Date.create('08-25-1978 12:42:32.488pm'), new Date(1978, 7, 25, 12, 42, 32, 488), 'Date#create | Date/Time | with seconds and am/pm');

  dateEqual(Date.create('08-25-1978 00:00am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with zero am');
  dateEqual(Date.create('08-25-1978 00:00:00am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with seconds and zero am');
  dateEqual(Date.create('08-25-1978 00:00:00.000am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with milliseconds and zero am');

  dateEqual(Date.create('08-25-1978 1pm'), new Date(1978, 7, 25, 13), 'Date#create | Date/Time | 1pm am/pm');
  dateEqual(Date.create('08-25-1978 1:42pm'), new Date(1978, 7, 25, 13, 42), 'Date#create | Date/Time | 1pm minutes and am/pm');
  dateEqual(Date.create('08-25-1978 1:42:32pm'), new Date(1978, 7, 25, 13, 42, 32), 'Date#create | Date/Time | 1pm seconds and am/pm');
  dateEqual(Date.create('08-25-1978 1:42:32.488pm'), new Date(1978, 7, 25, 13, 42, 32, 488), 'Date#create | Date/Time | 1pm seconds and am/pm');

  dateEqual(Date.create('08-25-1978 1am'), new Date(1978, 7, 25, 1), 'Date#create | Date/Time | 1am am/pm');
  dateEqual(Date.create('08-25-1978 1:42am'), new Date(1978, 7, 25, 1, 42), 'Date#create | Date/Time | 1am minutes and am/pm');
  dateEqual(Date.create('08-25-1978 1:42:32am'), new Date(1978, 7, 25, 1, 42, 32), 'Date#create | Date/Time | 1am seconds and am/pm');
  dateEqual(Date.create('08-25-1978 1:42:32.488am'), new Date(1978, 7, 25, 1, 42, 32, 488), 'Date#create | Date/Time | 1am seconds and am/pm');

  dateEqual(Date.create('08-25-1978 11pm'), new Date(1978, 7, 25, 23), 'Date#create | Date/Time | 11pm am/pm');
  dateEqual(Date.create('08-25-1978 11:42pm'), new Date(1978, 7, 25, 23, 42), 'Date#create | Date/Time | 11pm minutes and am/pm');
  dateEqual(Date.create('08-25-1978 11:42:32pm'), new Date(1978, 7, 25, 23, 42, 32), 'Date#create | Date/Time | 11pm seconds and am/pm');
  dateEqual(Date.create('08-25-1978 11:42:32.488pm'), new Date(1978, 7, 25, 23, 42, 32, 488), 'Date#create | Date/Time | 11pm seconds and am/pm');

  dateEqual(Date.create('08-25-1978 11am'), new Date(1978, 7, 25, 11), 'Date#create | Date/Time | 11am am/pm');
  dateEqual(Date.create('08-25-1978 11:42am'), new Date(1978, 7, 25, 11, 42), 'Date#create | Date/Time | 11am minutes and am/pm');
  dateEqual(Date.create('08-25-1978 11:42:32am'), new Date(1978, 7, 25, 11, 42, 32), 'Date#create | Date/Time | 11am seconds and am/pm');
  dateEqual(Date.create('08-25-1978 11:42:32.488am'), new Date(1978, 7, 25, 11, 42, 32, 488), 'Date#create | Date/Time | 11am seconds and am/pm');


  dateEqual(Date.create('2010-11-22T22:59Z'), getUTCDate(2010,11,22,22,59), 'Date#create | ISO8601 | full with UTC timezone');
  dateEqual(Date.create('1997-07-16T19:20+00:00'), getUTCDate(1997, 7, 16, 19, 20), 'Date#create | ISO8601 | zero minutes with timezone');
  dateEqual(Date.create('1997-07-16T19:20+01:00'), getUTCDate(1997, 7, 16, 18, 20), 'Date#create | ISO8601 | minutes with timezone');
  dateEqual(Date.create('1997-07-16T19:20:30+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30), 'Date#create | ISO8601 | seconds with timezone');
  dateEqual(Date.create('1997-07-16T19:20:30.45+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 450), 'Date#create | ISO8601 | milliseconds with timezone');
  dateEqual(Date.create('1994-11-05T08:15:30-05:00'), getUTCDate(1994, 11, 5, 13, 15, 30), 'Date#create | ISO8601 | Full example 1');
  dateEqual(Date.create('1994-11-05T13:15:30Z'), getUTCDate(1994, 11, 5, 13, 15, 30), 'Date#create | ISO8601 | Full example 1');

  equal(Date.create('1994-11-05T13:15:30Z')._utc, false, 'Date#create | ISO8601 | does not forcefully set UTC flag');

  dateEqual(Date.create('1776-05-23T02:45:08-08:30'), getUTCDate(1776, 5, 23, 11, 15, 08), 'Date#create | ISO8601 | Full example 3');
  dateEqual(Date.create('1776-05-23T02:45:08+08:30'), getUTCDate(1776, 5, 22, 18, 15, 08), 'Date#create | ISO8601 | Full example 4');
  dateEqual(Date.create('1776-05-23T02:45:08-0830'), getUTCDate(1776, 5, 23, 11, 15, 08), 'Date#create | ISO8601 | Full example 5');
  dateEqual(Date.create('1776-05-23T02:45:08+0830'), getUTCDate(1776, 5, 22, 18, 15, 08), 'Date#create | ISO8601 | Full example 6');


  // No limit on the number of millisecond decimals, so....
  dateEqual(Date.create('1997-07-16T19:20:30.4+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 400), 'Date#create | ISO8601 | milliseconds have no limit 1');
  dateEqual(Date.create('1997-07-16T19:20:30.46+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 460), 'Date#create | ISO8601 | milliseconds have no limit 2');
  dateEqual(Date.create('1997-07-16T19:20:30.462+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 462), 'Date#create | ISO8601 | milliseconds have no limit 3');
  dateEqual(Date.create('1997-07-16T19:20:30.4628+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 463), 'Date#create | ISO8601 | milliseconds have no limit 4');
  dateEqual(Date.create('1997-07-16T19:20:30.46284+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 463), 'Date#create | ISO8601 | milliseconds have no limit 5');


  // .NET output
  dateEqual(Date.create('2012-04-23T07:58:42.7940000z'), getUTCDate(2012, 4, 23, 7, 58, 42, 794), 'Date#create | ISO8601 | .NET long format');

  // Fractions in ISO8601 dates
  dateEqual(Date.create('1997-07-16T14:30:40.5'), new Date(1997, 6, 16, 14, 30, 40, 500), 'Date#create | ISO8601 | fractions in seconds');
  dateEqual(Date.create('1997-07-16T14:30.5'), new Date(1997, 6, 16, 14, 30, 30), 'Date#create | ISO8601 | fractions in minutes');

  // Comma based fractions in ISO8601 dates
  dateEqual(Date.create('1997-07-16T14:30:40,5'), new Date(1997, 6, 16, 14, 30, 40, 500), 'Date#create | ISO8601 | fractions in seconds');
  dateEqual(Date.create('1997-07-16T14:30,5'), new Date(1997, 6, 16, 14, 30, 30), 'Date#create | ISO8601 | fractions in minutes');

  // Fractional hours in ISO dates
  dateEqual(Date.create('1997-07-16T14.5'), new Date(1997, 6, 16, 14, 30), 'Date#create | ISO8601 | fractions in hours');
  dateEqual(Date.create('1997-07-16T14,5'), new Date(1997, 6, 16, 14, 30), 'Date#create | ISO8601 | fractions in hours');

  // These are all the same moment...
  dateEqual(Date.create('2001-04-03T18:30Z'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 1');
  dateEqual(Date.create('2001-04-03T22:30+04'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 2');
  dateEqual(Date.create('2001-04-03T1130-0700'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 3');
  dateEqual(Date.create('2001-04-03T15:00-03:30'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 4');


  dateEqual(Date.create('\/Date(628318530718)\/'), new Date(628318530718), 'Date#create | handles .NET JSON date format');
  dateEqual(Date.create('\/Date(1318287600+0100)\/'), new Date(1318287600), 'Date#create | handles .NET JSON + date format with timezone');
  dateEqual(Date.create('\/Date(1318287600-0700)\/'), new Date(1318287600), 'Date#create | handles .NET JSON - date format with timezone');



  // Fuzzy dates
  dateEqual(Date.create('now'), new Date(), 'Date#create | Fuzzy Dates | Now');
  dateEqual(Date.create('Just now'), new Date(), 'Date#create | Fuzzy Dates | Just Now');
  dateEqual(Date.create('today'), new Date(now.getFullYear(), now.getMonth(), now.getDate()), 'Date#create | Fuzzy Dates | Today');
  dateEqual(Date.create('yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), 'Date#create | Fuzzy Dates | Yesterday');
  dateEqual(Date.create('tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), 'Date#create | Fuzzy Dates | Tomorrow');
  dateEqual(Date.create('4pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16), 'Date#create | Fuzzy Dates | 4pm');
  dateEqual(Date.create('today at 4pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16), 'Date#create | Fuzzy Dates | Today at 4pm');
  dateEqual(Date.create('today at 4 pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16), 'Date#create | Fuzzy Dates | Today at 4 pm');
  dateEqual(Date.create('4pm today'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16), 'Date#create | Fuzzy Dates | 4pm today');


  dateEqual(Date.create('The day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'Date#create | Fuzzy Dates | The day after tomorrow');
  dateEqual(Date.create('The day before yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), 'Date#create | Fuzzy Dates | The day before yesterday');
  dateEqual(Date.create('One day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'Date#create | Fuzzy Dates | One day after tomorrow');
  dateEqual(Date.create('One day before yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), 'Date#create | Fuzzy Dates | One day before yesterday');
  dateEqual(Date.create('Two days after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), 'Date#create | Fuzzy Dates | Two days after tomorrow');
  dateEqual(Date.create('Two days before yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3), 'Date#create | Fuzzy Dates | Two days before yesterday');
  dateEqual(Date.create('Two days after today'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'Date#create | Fuzzy Dates | Two days after today');
  dateEqual(Date.create('Two days before today'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), 'Date#create | Fuzzy Dates | Two days before today');
  dateEqual(Date.create('Two days from today'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), 'Date#create | Fuzzy Dates | Two days from today');

  dateEqual(Date.create('tWo dAyS after toMoRRoW'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), 'Date#create | Fuzzy Dates | tWo dAyS after toMoRRoW');
  dateEqual(Date.create('2 days after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), 'Date#create | Fuzzy Dates | 2 days after tomorrow');
  dateEqual(Date.create('2 day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), 'Date#create | Fuzzy Dates | 2 day after tomorrow');
  dateEqual(Date.create('18 days after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 19), 'Date#create | Fuzzy Dates | 18 days after tomorrow');
  dateEqual(Date.create('18 day after tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 19), 'Date#create | Fuzzy Dates | 18 day after tomorrow');


  dateEqual(Date.create('2 years ago'), getRelativeDate(-2), 'Date#create | Fuzzy Dates | 2 years ago');
  dateEqual(Date.create('2 months ago'), getRelativeDate(null, -2), 'Date#create | Fuzzy Dates | 2 months ago');
  dateEqual(Date.create('2 weeks ago'), getRelativeDate(null, null, -14), 'Date#create | Fuzzy Dates | 2 weeks ago');
  dateEqual(Date.create('2 days ago'), getRelativeDate(null, null, -2), 'Date#create | Fuzzy Dates | 2 days ago');
  dateEqual(Date.create('2 hours ago'), getRelativeDate(null, null, null, -2), 'Date#create | Fuzzy Dates | 2 hours ago');
  dateEqual(Date.create('2 minutes ago'), getRelativeDate(null, null, null, null, -2), 'Date#create | Fuzzy Dates | 2 minutes ago');
  dateEqual(Date.create('2 seconds ago'), getRelativeDate(null, null, null, null, null, -2), 'Date#create | Fuzzy Dates | 2 seconds ago');
  dateEqual(Date.create('2 milliseconds ago'), getRelativeDate(null, null, null, null, null, null, -2), 'Date#create | Fuzzy Dates | 2 milliseconds ago');
  dateEqual(Date.create('a second ago'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Fuzzy Dates | a second ago');

  dateEqual(Date.create('2 years from now'), getRelativeDate(2), 'Date#create | Fuzzy Dates | 2 years from now');
  dateEqual(Date.create('2 months from now'), getRelativeDate(null, 2), 'Date#create | Fuzzy Dates | 2 months from now');
  dateEqual(Date.create('2 weeks from now'), getRelativeDate(null, null, 14), 'Date#create | Fuzzy Dates | 2 weeks from now');
  dateEqual(Date.create('2 days from now'), getRelativeDate(null, null, 2), 'Date#create | Fuzzy Dates | 2 days from now');
  dateEqual(Date.create('2 hours from now'), getRelativeDate(null, null, null, 2), 'Date#create | Fuzzy Dates | 2 hours from now');
  dateEqual(Date.create('2 minutes from now'), getRelativeDate(null, null, null, null, 2), 'Date#create | Fuzzy Dates | 2 minutes from now');
  dateEqual(Date.create('2 seconds from now'), getRelativeDate(null, null, null, null, null, 2), 'Date#create | Fuzzy Dates | 2 seconds from now');
  dateEqual(Date.create('2 milliseconds from now'), getRelativeDate(null, null, null, null, null, null, 2), 'Date#create | Fuzzy Dates | 2 milliseconds from now');

  dateEqual(Date.create('2 years later'), getRelativeDate(2), 'Date#create | Fuzzy Dates | 2 years later');
  dateEqual(Date.create('2 months later'), getRelativeDate(null, 2), 'Date#create | Fuzzy Dates | 2 months later');
  dateEqual(Date.create('2 weeks later'), getRelativeDate(null, null, 14), 'Date#create | Fuzzy Dates | 2 weeks later');
  dateEqual(Date.create('2 days later'), getRelativeDate(null, null, 2), 'Date#create | Fuzzy Dates | 2 days later');
  dateEqual(Date.create('2 hours later'), getRelativeDate(null, null, null, 2), 'Date#create | Fuzzy Dates | 2 hours later');
  dateEqual(Date.create('2 minutes later'), getRelativeDate(null, null, null, null, 2), 'Date#create | Fuzzy Dates | 2 minutes later');
  dateEqual(Date.create('2 seconds later'), getRelativeDate(null, null, null, null, null, 2), 'Date#create | Fuzzy Dates | 2 seconds later');
  dateEqual(Date.create('2 milliseconds later'), getRelativeDate(null, null, null, null, null, null, 2), 'Date#create | Fuzzy Dates | 2 milliseconds later');

  // Article trouble
  dateEqual(Date.create('an hour ago'), getRelativeDate(null, null, null, -1), 'Date#create | Fuzzy Dates | an hours ago');
  dateEqual(Date.create('an hour from now'), getRelativeDate(null, null, null, 1), 'Date#create | Fuzzy Dates | an hour from now');

  dateEqual(Date.create('Monday'), getDateWithWeekdayAndOffset(1), 'Date#create | Fuzzy Dates | Monday');
  dateEqual(Date.create('The day after Monday'), getDateWithWeekdayAndOffset(2), 'Date#create | Fuzzy Dates | The day after Monday');
  dateEqual(Date.create('The day before Monday'), getDateWithWeekdayAndOffset(0), 'Date#create | Fuzzy Dates | The day before Monday');
  dateEqual(Date.create('2 days after monday'), getDateWithWeekdayAndOffset(3), 'Date#create | Fuzzy Dates | 2 days after monday');
  dateEqual(Date.create('2 days before monday'), getDateWithWeekdayAndOffset(6, -7), 'Date#create | Fuzzy Dates | 2 days before monday');
  dateEqual(Date.create('2 weeks after monday'), getDateWithWeekdayAndOffset(1, 14), 'Date#create | Fuzzy Dates | 2 weeks after monday');

  dateEqual(Date.create('Next Monday'), getDateWithWeekdayAndOffset(1, 7), 'Date#create | Fuzzy Dates | Next Monday');
  dateEqual(Date.create('next week monday'), getDateWithWeekdayAndOffset(1, 7), 'Date#create | Fuzzy Dates | next week monday');
  dateEqual(Date.create('Next friDay'), getDateWithWeekdayAndOffset(5, 7), 'Date#create | Fuzzy Dates | Next friDay');
  dateEqual(Date.create('next week thursday'), getDateWithWeekdayAndOffset(4, 7), 'Date#create | Fuzzy Dates | next week thursday');

  dateEqual(Date.create('last Monday'), getDateWithWeekdayAndOffset(1, -7), 'Date#create | Fuzzy Dates | last Monday');
  dateEqual(Date.create('last week monday'), getDateWithWeekdayAndOffset(1, -7), 'Date#create | Fuzzy Dates | last week monday');
  dateEqual(Date.create('last friDay'), getDateWithWeekdayAndOffset(5, -7), 'Date#create | Fuzzy Dates | last friDay');
  dateEqual(Date.create('last week thursday'), getDateWithWeekdayAndOffset(4, -7), 'Date#create | Fuzzy Dates | last week thursday');
  dateEqual(Date.create('last Monday at 4pm'), getDateWithWeekdayAndOffset(1, -7, 16), 'Date#create | Fuzzy Dates | last Monday at 4pm');

  dateEqual(Date.create('this Monday'), getDateWithWeekdayAndOffset(1, 0), 'Date#create | Fuzzy Dates | this Monday');
  dateEqual(Date.create('this week monday'), getDateWithWeekdayAndOffset(1, 0), 'Date#create | Fuzzy Dates | this week monday');
  dateEqual(Date.create('this friDay'), getDateWithWeekdayAndOffset(5, 0), 'Date#create | Fuzzy Dates | this friDay');
  dateEqual(Date.create('this week thursday'), getDateWithWeekdayAndOffset(4, 0), 'Date#create | Fuzzy Dates | this week thursday');

  dateEqual(Date.create('Monday of last week'), getDateWithWeekdayAndOffset(1, -7), 'Date#create | Fuzzy Dates | Monday of last week');
  dateEqual(Date.create('saturday of next week'), getDateWithWeekdayAndOffset(6, 7), 'Date#create | Fuzzy Dates | saturday of next week');
  dateEqual(Date.create('Monday last week'), getDateWithWeekdayAndOffset(1, -7), 'Date#create | Fuzzy Dates | Monday last week');
  dateEqual(Date.create('saturday next week'), getDateWithWeekdayAndOffset(6, 7), 'Date#create | Fuzzy Dates | saturday next week');

  dateEqual(Date.create('Monday of this week'), getDateWithWeekdayAndOffset(1, 0), 'Date#create | Fuzzy Dates | Monday of this week');
  dateEqual(Date.create('saturday of this week'), getDateWithWeekdayAndOffset(6, 0), 'Date#create | Fuzzy Dates | saturday of this week');
  dateEqual(Date.create('Monday this week'), getDateWithWeekdayAndOffset(1, 0), 'Date#create | Fuzzy Dates | Monday this week');
  dateEqual(Date.create('saturday this week'), getDateWithWeekdayAndOffset(6, 0), 'Date#create | Fuzzy Dates | saturday this week');

  dateEqual(Date.create('Tue of last week'), getDateWithWeekdayAndOffset(2, -7), 'Date#create | Fuzzy Dates | Tue of last week');
  dateEqual(Date.create('Tue. of last week'), getDateWithWeekdayAndOffset(2, -7), 'Date#create | Fuzzy Dates | Tue. of last week');


  dateEqual(Date.create('Next week'), getRelativeDate(null, null, 7), 'Date#create | Fuzzy Dates | Next week');
  dateEqual(Date.create('Last week'), getRelativeDate(null, null, -7), 'Date#create | Fuzzy Dates | Last week');
  dateEqual(Date.create('Next month'), getRelativeDate(null, 1), 'Date#create | Fuzzy Dates | Next month');
  dateEqual(Date.create('Next year'), getRelativeDate(1), 'Date#create | Fuzzy Dates | Next year');
  dateEqual(Date.create('this year'), getRelativeDate(0), 'Date#create | Fuzzy Dates | this year');

  dateEqual(Date.create('beginning of the week'), getDateWithWeekdayAndOffset(0), 'Date#create | Fuzzy Dates | beginning of the week');
  dateEqual(Date.create('beginning of this week'), getDateWithWeekdayAndOffset(0), 'Date#create | Fuzzy Dates | beginning of this week');
  dateEqual(Date.create('end of this week'), getDateWithWeekdayAndOffset(6, 0, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | end of this week');
  dateEqual(Date.create('beginning of next week'), getDateWithWeekdayAndOffset(0, 7), 'Date#create | Fuzzy Dates | beginning of next week');
  dateEqual(Date.create('the beginning of next week'), getDateWithWeekdayAndOffset(0, 7), 'Date#create | Fuzzy Dates | the beginning of next week');

  dateEqual(Date.create('beginning of the month'), new Date(now.getFullYear(), now.getMonth()), 'Date#create | Fuzzy Dates | beginning of the month');
  dateEqual(Date.create('beginning of this month'), new Date(now.getFullYear(), now.getMonth()), 'Date#create | Fuzzy Dates | beginning of this month');
  dateEqual(Date.create('beginning of next month'), new Date(now.getFullYear(), now.getMonth() + 1), 'Date#create | Fuzzy Dates | beginning of next month');
  dateEqual(Date.create('the beginning of next month'), new Date(now.getFullYear(), now.getMonth() + 1), 'Date#create | Fuzzy Dates | the beginning of next month');
  dateEqual(Date.create('the end of next month'), new Date(now.getFullYear(), now.getMonth() + 1, getDaysInMonth(now.getFullYear(), now.getMonth() + 1), 23, 59, 59, 999), 'Date#create | Fuzzy Dates | the end of next month');
  dateEqual(Date.create('the end of the month'), new Date(now.getFullYear(), now.getMonth(), getDaysInMonth(now.getFullYear(), now.getMonth()), 23, 59, 59, 999), 'Date#create | Fuzzy Dates | the end of the month');

  dateEqual(Date.create('the beginning of the year'), new Date(now.getFullYear(), 0), 'Date#create | Fuzzy Dates | the beginning of the year');
  dateEqual(Date.create('the beginning of this year'), new Date(now.getFullYear(), 0), 'Date#create | Fuzzy Dates | the beginning of this year');
  dateEqual(Date.create('the beginning of next year'), new Date(now.getFullYear() + 1, 0), 'Date#create | Fuzzy Dates | the beginning of next year');
  dateEqual(Date.create('the beginning of last year'), new Date(now.getFullYear() - 1, 0), 'Date#create | Fuzzy Dates | the beginning of last year');
  dateEqual(Date.create('the end of next year'), new Date(now.getFullYear() + 1, 11, 31, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | the end of next year');
  dateEqual(Date.create('the end of last year'), new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | the end of last year');

  dateEqual(Date.create('the beginning of the day'), new Date(now.getFullYear(), now.getMonth(), now.getDate()), 'Date#create | Fuzzy Dates | the beginning of the day');

  dateEqual(Date.create('beginning of March'), new Date(now.getFullYear(), 2), 'Date#create | Fuzzy Dates | beginning of March');
  dateEqual(Date.create('end of March'), new Date(now.getFullYear(), 2, 31, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | end of March');
  dateEqual(Date.create('the first day of March'), new Date(now.getFullYear(), 2), 'Date#create | Fuzzy Dates | the first day of March');
  dateEqual(Date.create('the last day of March'), new Date(now.getFullYear(), 2, 31), 'Date#create | Fuzzy Dates | the last day of March');

  dateEqual(Date.create('beginning of 1998'), new Date(1998, 0), 'Date#create | Fuzzy Dates | beginning of 1998');
  dateEqual(Date.create('end of 1998'), new Date(1998, 11, 31, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | end of 1998');
  dateEqual(Date.create('the first day of 1998'), new Date(1998, 0), 'Date#create | Fuzzy Dates | the first day of 1998');
  dateEqual(Date.create('the last day of 1998'), new Date(1998, 11, 31), 'Date#create | Fuzzy Dates | the last day of 1998');





  dateEqual(Date.create('The 15th of last month.'), new Date(now.getFullYear(), now.getMonth() - 1, 15), 'Date#create | Fuzzy Dates | The 15th of last month');
  dateEqual(Date.create('January 30th of last year.'), new Date(now.getFullYear() - 1, 0, 30), 'Date#create | Fuzzy Dates | January 30th of last year');
  dateEqual(Date.create('January of last year.'), new Date(now.getFullYear() - 1, 0), 'Date#create | Fuzzy Dates | January of last year');

  dateEqual(Date.create('First day of may'), new Date(now.getFullYear(), 4, 1), 'Date#create | Fuzzy Dates | First day of may');
  dateEqual(Date.create('Last day of may'), new Date(now.getFullYear(), 4, 31), 'Date#create | Fuzzy Dates | Last day of may');
  dateEqual(Date.create('Last day of next month'), new Date(now.getFullYear(), now.getMonth() + 1, getDaysInMonth(now.getFullYear(), now.getMonth() + 1)), 'Date#create | Fuzzy Dates | Last day of next month');
  dateEqual(Date.create('Last day of november'), new Date(now.getFullYear(), 10, 30), 'Date#create | Fuzzy Dates | Last day of november');

  // Just the time
  dateEqual(Date.create('1pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13), 'Date#create | ISO8601 | 1pm');
  dateEqual(Date.create('1:30pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 30), 'Date#create | ISO8601 | 1:30pm');
  dateEqual(Date.create('1:30:22pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 30, 22), 'Date#create | ISO8601 | 1:30:22pm');
  dateEqual(Date.create('1:30:22.432pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 30, 22, 432), 'Date#create | ISO8601 | 1:30:22.432pm');
  dateEqual(Date.create('17:48:03.947'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 48, 3, 947), 'Date#create | ISO8601 | 17:48:03.947');

  dateEqual(Date.create('the first day of next January'), new Date(now.getFullYear() + 1, 0, 1), 'Date#create | Fuzzy Dates | the first day of next january');

  var d;

  d = new Date('August 25, 2010 11:45:20');
  d.set(2008, 5, 18, 4, 25, 30, 400);

  equal(d.getFullYear(), 2008, 'Date#set | year');
  equal(d.getMonth(), 5, 'Date#set | month');
  equal(d.getDate(), 18, 'Date#set | date');
  equal(d.getHours(), 4, 'Date#set | hours');
  equal(d.getMinutes(), 25, 'Date#set | minutes');
  equal(d.getSeconds(), 30, 'Date#set | seconds');
  equal(d.getMilliseconds(), 400, 'Date#set | milliseconds');

  d = new Date('August 25, 2010 11:45:20');
  d.set({ year: 2008, month: 5, date: 18, hour: 4, minute: 25, second: 30, millisecond: 400 });

  equal(d.getFullYear(), 2008, 'Date#set | object | year');
  equal(d.getMonth(), 5, 'Date#set | object | month');
  equal(d.getDate(), 18, 'Date#set | object | date');
  equal(d.getHours(), 4, 'Date#set | object | hours');
  equal(d.getMinutes(), 25, 'Date#set | object | minutes');
  equal(d.getSeconds(), 30, 'Date#set | object | seconds');
  equal(d.getMilliseconds(), 400, 'Date#set | object | milliseconds');

  d = new Date('August 25, 2010 11:45:20');
  d.set({ years: 2008, months: 5, date: 18, hours: 4, minutes: 25, seconds: 30, milliseconds: 400 });

  equal(d.getFullYear(), 2008, 'Date#set | object plural | year');
  equal(d.getMonth(), 5, 'Date#set | object plural | month');
  equal(d.getDate(), 18, 'Date#set | object plural | date');
  equal(d.getHours(), 4, 'Date#set | object plural | hours');
  equal(d.getMinutes(), 25, 'Date#set | object plural | minutes');
  equal(d.getSeconds(), 30, 'Date#set | object plural | seconds');
  equal(d.getMilliseconds(), 400, 'Date#set | object plural | milliseconds');

  d.set({ weekday: 2 });
  equal(d.getDate(), 17, 'Date#set | object | weekday 2');
  d.set({ weekday: 5 });
  equal(d.getDate(), 20, 'Date#set | object | weekday 5');


  d.set({ weekday: 2 }, true);
  equal(d.getDate(), 17, 'Date#set | object | reset time | weekday 2');
  d.set({ weekday: 5 }, true);
  equal(d.getDate(), 20, 'Date#set | object | reset time | weekday 5');


  d = new Date('August 25, 2010 11:45:20');
  d.set({ years: 2005, hours: 2 });

  equal(d.getFullYear(), 2005, 'Date#set | no reset | year');
  equal(d.getMonth(), 7, 'Date#set | no reset | month');
  equal(d.getDate(), 25, 'Date#set | no reset | date');
  equal(d.getHours(), 2, 'Date#set | no reset | hours');
  equal(d.getMinutes(), 45, 'Date#set | no reset | minutes');
  equal(d.getSeconds(), 20, 'Date#set | no reset | seconds');
  equal(d.getMilliseconds(), 0, 'Date#set | no reset | milliseconds');



  d = new Date('August 25, 2010 11:45:20');
  d.set({ years: 2008, hours: 4 }, true);

  equal(d.getFullYear(), 2008, 'Date#set | reset | year');
  equal(d.getMonth(), 7, 'Date#set | reset | month');
  equal(d.getDate(), 25, 'Date#set | reset | date');
  equal(d.getHours(), 4, 'Date#set | reset | hours');
  equal(d.getMinutes(), 0, 'Date#set | reset | minutes');
  equal(d.getSeconds(), 0, 'Date#set | reset | seconds');
  equal(d.getMilliseconds(), 0, 'Date#set | reset | milliseconds');


  d = new Date('August 25, 2010 11:45:20').utc();
  d.set({ years: 2008, hours: 4 }, true);

  equal(d.getFullYear(), 2008, 'Date#set | utc | reset utc | year');
  equal(d.getMonth(), 7, 'Date#set | utc | reset utc | month');
  equal(d.getDate(), d.getTimezoneOffset() > 240 ? 24 : 25, 'Date#set | utc | reset utc | date');
  equal(d.getHours(), getHours(4 - (d.getTimezoneOffset() / 60)), 'Date#set | utc | reset utc | hours');
  equal(d.getMinutes(), Math.abs(d.getTimezoneOffset() % 60), 'Date#set | utc | reset utc | minutes');
  equal(d.getSeconds(), 0, 'Date#set | utc | reset utc | seconds');
  equal(d.getMilliseconds(), 0, 'Date#set | utc | reset utc | milliseconds');


  d = new Date('August 25, 2010 11:45:20').utc();
  d.set({ years: 2005, hours: 2 }, false);

  equal(d.getFullYear(), 2005, 'Date#set | utc | no reset utc | year');
  equal(d.getMonth(), 7, 'Date#set | utc | no reset utc | month');
  equal(d.getDate(), d.getTimezoneOffset() >= 135 ? 24 : 25, 'Date#set | utc | no reset utc | date');
  equal(d.getHours(), getHours(2 - (d.getTimezoneOffset() / 60)), 'Date#set | utc | no reset utc | hours');
  equal(d.getMinutes(), 45, 'Date#set | utc | no reset utc | minutes');
  equal(d.getSeconds(), 20, 'Date#set | utc | no reset utc | seconds');
  equal(d.getMilliseconds(), 0, 'Date#set | utc | no reset utc | milliseconds');


  d = new Date('August 25, 2010 11:45:20').utc();
  d.set({ years: 2005, hours: 2 }, false);

  equal(d.getFullYear(), 2005, 'Date#set | utc | no reset | year');
  equal(d.getMonth(), 7, 'Date#set | utc | no reset | month');
  equal(d.getDate(), d.getTimezoneOffset() >= 135 ? 24 : 25, 'Date#set | utc | no reset | date');
  equal(d.getHours(), getHours(2 - (d.getTimezoneOffset() / 60)), 'Date#set | utc | no reset | hours');
  equal(d.getMinutes(), 45, 'Date#set | utc | no reset | minutes');
  equal(d.getSeconds(), 20, 'Date#set | utc | no reset | seconds');
  equal(d.getMilliseconds(), 0, 'Date#set | utc | no reset | milliseconds');


  dateEqual(Date.create('Next week'), getRelativeDate(null, null, 7), 'Date#create | Fuzzy Dates | Next week');

  d = new Date('August 25, 2010 11:45:20');

  equal(d.getWeekday(), 3, 'Date#getWeekday | wednesday');

  d.setWeekday(0);
  equal(d.getDate(), 22, 'Date#setWeekday | sunday');
  d.setWeekday(1);
  equal(d.getDate(), 23, 'Date#setWeekday | monday');
  d.setWeekday(2);
  equal(d.getDate(), 24, 'Date#setWeekday | tuesday');
  d.setWeekday(3);
  equal(d.getDate(), 25, 'Date#setWeekday | wednesday');
  d.setWeekday(4);
  equal(d.getDate(), 26, 'Date#setWeekday | thursday');
  d.setWeekday(5);
  equal(d.getDate(), 27, 'Date#setWeekday | friday');
  d.setWeekday(6);
  equal(d.getDate(), 28, 'Date#setWeekday | saturday');

  equal(d.setWeekday(6), d.getTime(), 'Date#setWeekday | should return the timestamp');

  d = new Date('August 25, 2010 11:45:20').utc();

  equal(d.getWeekday(), 3, 'Date#getUTCWeekday | wednesday');

  d.setWeekday(0);
  equal(d.getDate(), 22, 'Date#setWeekday | utc | sunday');
  d.setWeekday(1);
  equal(d.getDate(), 23, 'Date#setWeekday | utc | monday');
  d.setWeekday(2);
  equal(d.getDate(), 24, 'Date#setWeekday | utc | tuesday');
  d.setWeekday(3);
  equal(d.getDate(), 25, 'Date#setWeekday | utc | wednesday');
  d.setWeekday(4);
  equal(d.getDate(), 26, 'Date#setWeekday | utc | thursday');
  d.setWeekday(5);
  equal(d.getDate(), 27, 'Date#setWeekday | utc | friday');
  d.setWeekday(6);
  equal(d.getDate(), 28, 'Date#setWeekday | utc | saturday');

  equal(d.setWeekday(6), d.getTime(), 'Date#setWeekday | utc | should return the timestamp');


  d = new Date('August 25, 2010 11:45:20');

  d.setDate(12);
  equal(d.getWeekday(), 4, 'Date#getWeekday | Thursday');
  equal(d.clone().utc().getWeekday(), 4, 'Date#setWeekday | utc | Thursday');

  d.setDate(13);
  equal(d.getWeekday(), 5, 'Date#getWeekday | Friday');
  equal(d.clone().utc().getWeekday(), 5, 'Date#setWeekday | utc | Friday');

  d.setDate(14);
  equal(d.getWeekday(), 6, 'Date#getWeekday | Saturday');
  equal(d.clone().utc().getWeekday(), 6, 'Date#getWeekday | utc | Saturday');

  d.setDate(15);
  equal(d.getWeekday(), 0, 'Date#getWeekday | Sunday');
  equal(d.clone().utc().getWeekday(), 0, 'Date#getWeekday | utc | Sunday');

  d.setDate(16);
  equal(d.getWeekday(), 1, 'Date#getWeekday | Monday');
  equal(d.clone().utc().getWeekday(), 1, 'Date#getWeekday | utc | Monday');

  d.setDate(17);
  equal(d.getWeekday(), 2, 'Date#getWeekday | Tuesday');
  equal(d.clone().utc().getWeekday(), 2, 'Date#getWeekday | utc | Tuesday');

  d.setDate(18);
  equal(d.getWeekday(), 3, 'Date#getWeekday | Wednesday');
  equal(d.clone().utc().getWeekday(), 3, 'Date#getWeekday | utc | Wednesday');


  dateEqual(new Date().advance({ weekday: 7 }), new Date(), 'Date#advance | cannot advance by weekdays');
  dateEqual(new Date().rewind({ weekday: 7 }), new Date(), 'Date#advance | cannot rewind by weekdays');

  // UTC Date
  var d = Date.utc.create('2010-01-01 03:00', 'en').utc();

  d.setWeekday(1)
  equal(d.getUTCDay(), 1, 'Date#setWeekday | should account for UTC shift | getUTCDay');



  var d = new Date(2010, 11, 31, 24, 59, 59);

  equal(d.getWeekday(), d.getDay(), 'Date#getWeekday | equal to getDay');
  equal(d.getUTCWeekday(), d.getUTCDay(), 'Date#getUTCWeekday | equal to getUTCDay');


  d = new Date('August 25, 2010 11:45:20').utc();

  equal(d.getWeekday(), 3, 'Date#getWeekday | utc | wednesday');

  d.setWeekday(0);
  equal(d.getDate(), 22, 'Date#setWeekday | utc | sunday');
  d.setWeekday(1);
  equal(d.getDate(), 23, 'Date#setWeekday | utc | monday');
  d.setWeekday(2);
  equal(d.getDate(), 24, 'Date#setWeekday | utc | tuesday');
  d.setWeekday(3);
  equal(d.getDate(), 25, 'Date#setWeekday | utc | wednesday');
  d.setWeekday(4);
  equal(d.getDate(), 26, 'Date#setWeekday | utc | thursday');
  d.setWeekday(5);
  equal(d.getDate(), 27, 'Date#setWeekday | utc | friday');
  d.setWeekday(6);
  equal(d.getDate(), 28, 'Date#setWeekday | utc | saturday');

  d.setWeekday();
  equal(d.getDate(), 28, 'Date#setWeekday | utc | undefined');


  d = new Date('August 25, 2010 11:45:20');

  d.advance(1,-3,2,8,12,-2,44);

  equal(d.getFullYear(), 2011, 'Date#advance | year');
  equal(d.getMonth(), 4, 'Date#advance | month');
  equal(d.getDate(), 27, 'Date#advance | day');
  equal(d.getHours(), 19, 'Date#advance | hours');
  equal(d.getMinutes(), 57, 'Date#advance | minutes');
  equal(d.getSeconds(), 18, 'Date#advance | seconds');
  equal(d.getMilliseconds(), 44, 'Date#advance | milliseconds');


  d = new Date('August 25, 2010 11:45:20');

  d.rewind(1,-3,2,8,12,-2,4);

  equal(d.getFullYear(), 2009, 'Date#rewind | year');
  equal(d.getMonth(), 10, 'Date#rewind | month');
  equal(d.getDate(), 23, 'Date#rewind | day');
  equal(d.getHours(), 3, 'Date#rewind | hours');
  equal(d.getMinutes(), 33, 'Date#rewind | minutes');
  equal(d.getSeconds(), 21, 'Date#rewind | seconds');
  equal(d.getMilliseconds(), 996, 'Date#rewind | milliseconds');



  d = new Date('August 25, 2010 11:45:20');
  d.advance({ year: 1, month: -3, days: 2, hours: 8, minutes: 12, seconds: -2, milliseconds: 44 });

  equal(d.getFullYear(), 2011, 'Date#advance | object | year');
  equal(d.getMonth(), 4, 'Date#advance | object | month');
  equal(d.getDate(), 27, 'Date#advance | object | day');
  equal(d.getHours(), 19, 'Date#advance | object | hours');
  equal(d.getMinutes(), 57, 'Date#advance | object | minutes');
  equal(d.getSeconds(), 18, 'Date#advance | object | seconds');
  equal(d.getMilliseconds(), 44, 'Date#advance | object | milliseconds');


  d = new Date('August 25, 2010 11:45:20');
  d.rewind({ year: 1, month: -3, days: 2, hours: 8, minutes: 12, seconds: -2, milliseconds: 4 });

  equal(d.getFullYear(), 2009, 'Date#rewind | object | year');
  equal(d.getMonth(), 10, 'Date#rewind | object | month');
  equal(d.getDate(), 23, 'Date#rewind | object | day');
  equal(d.getHours(), 3, 'Date#rewind | object | hours');
  equal(d.getMinutes(), 33, 'Date#rewind | object | minutes');
  equal(d.getSeconds(), 21, 'Date#rewind | object | seconds');
  equal(d.getMilliseconds(), 996, 'Date#rewind | object | milliseconds');



  d = new Date('August 25, 2010 11:45:20');
  d.advance({ week: 1});
  dateEqual(d, new Date(2010, 8, 1, 11, 45, 20), 'Date#advance | positive weeks supported');
  d.advance({ week: -2});
  dateEqual(d, new Date(2010, 7, 18, 11, 45, 20), 'Date#advance | negative weeks supported');


  d = new Date('August 25, 2010 11:45:20');
  d.rewind({ week: 1});
  dateEqual(d, new Date(2010, 7, 18, 11, 45, 20), 'Date#rewind | positive weeks supported');
  d.rewind({ week: -1});
  dateEqual(d, new Date(2010, 7, 25, 11, 45, 20), 'Date#rewind | negative weeks supported');



  dateEqual(new Date().advance({ years: 1 }), Date.create('one year from now'), 'Date#advance | advancing 1 year');
  dateEqual(new Date().rewind({ years: 1 }), Date.create('one year ago'), 'Date#rewind | rewinding 1 year');









  d.set({ month: 0 })
  equal(d.daysInMonth(), 31, 'Date#daysInMonth | jan');
  d.set({ month: 1 })
  equal(d.daysInMonth(), 28, 'Date#daysInMonth | feb');
  d.set({ month: 2 })
  equal(d.daysInMonth(), 31, 'Date#daysInMonth | mar');
  d.set({ month: 3 })
  // This test fails in Casablanca in Windows XP! Reason unknown.
  equal(d.daysInMonth(), 30, 'Date#daysInMonth | apr');
  d.set({ month: 4 })
  equal(d.daysInMonth(), 31, 'Date#daysInMonth | may');
  d.set({ month: 5 })
  equal(d.daysInMonth(), 30, 'Date#daysInMonth | jun');
  d.set({ month: 6 })
  equal(d.daysInMonth(), 31, 'Date#daysInMonth | jul');
  d.set({ month: 7 })
  equal(d.daysInMonth(), 31, 'Date#daysInMonth | aug');
  d.set({ month: 8 })
  equal(d.daysInMonth(), 30, 'Date#daysInMonth | sep');
  d.set({ month: 9 })
  equal(d.daysInMonth(), 31, 'Date#daysInMonth | oct');
  d.set({ month: 10 })
  equal(d.daysInMonth(), 30, 'Date#daysInMonth | nov');
  d.set({ month: 11 })
  equal(d.daysInMonth(), 31, 'Date#daysInMonth | dec');

  d.set({ year: 2012, month: 1 });
  equal(d.daysInMonth(), 29, 'Date#daysInMonth | feb leap year');


  d = new Date('August 5, 2010 13:45:02');
  d.setMilliseconds(234);
  d.set({ month: 3 });

  equal(d.getFullYear(), 2010, 'Date#set | does not reset year');
  equal(d.getMonth(), 3, 'Date#set | does reset month');
  equal(d.getDate(), 5, 'Date#set | does not reset date');
  equal(d.getHours(), 13, 'Date#set | does not reset hours');
  equal(d.getMinutes(), 45, 'Date#set | does not reset minutes');
  equal(d.getSeconds(), 02, 'Date#set | does not reset seconds');
  equal(d.getMilliseconds(), 234, 'Date#set | does not reset milliseconds');



  d = new Date('August 5, 2010 13:45:02');
  d.set({ month: 3 }, true);

  equal(d.getFullYear(), 2010, 'Date#set | does not reset year');
  equal(d.getMonth(), 3, 'Date#set | does reset month');
  equal(d.getDate(), 1, 'Date#set | does reset date');
  equal(d.getHours(), 0, 'Date#set | does reset hours');
  equal(d.getMinutes(), 0, 'Date#set | does reset minutes');
  equal(d.getSeconds(), 0, 'Date#set | does reset seconds');
  equal(d.getMilliseconds(), 0, 'Date#set | does reset milliseconds');



  // Catch for DST inequivalencies
  // FAILS IN DAMASCUS IN XP!
  equal(new Date(2010, 11, 9, 17).set({ year: 1998, month: 3, day: 3}, true).getHours(), 0, 'Date#set | handles DST properly');


  d = new Date(2010, 0, 31);
  dateEqual(d.set({ month: 1 }, true), new Date(2010,1), 'Date#set | reset dates will not accidentally traverse into a different month');

  d = new Date(2010, 0, 31);
  dateEqual(d.advance({ month: 1 }), new Date(2010,1,28), 'Date#set | reset dates will not accidentally traverse into a different month');

  d = new Date('August 25, 2010 11:45:20');
  d.setISOWeek(1);
  dateEqual(d, new Date(2010,0,6,11,45,20), 'Date#setISOWeek | week 1');
  d.setISOWeek(15);
  dateEqual(d, new Date(2010,3,14,11,45,20), 'Date#setISOWeek | week 15');
  d.setISOWeek(27);
  dateEqual(d, new Date(2010,6,7,11,45,20), 'Date#setISOWeek | week 27');
  d.setISOWeek(52);
  dateEqual(d, new Date(2010,11,29,11,45,20), 'Date#setISOWeek | week 52');
  d.setISOWeek();
  dateEqual(d, new Date(2010,11,29,11,45,20), 'Date#setISOWeek | week stays set');


  d = Date.create('August 25, 2010 11:45:20', 'en');
  equal(d.setISOWeek(1), new Date(2010, 0, 6, 11, 45, 20).getTime(), 'Date#setISOWeek | returns a timestamp');


  d = Date.utc.create('January 1, 2010 02:15:20', 'en').utc(true);

  d.setISOWeek(1);
  dateEqual(d, new Date(Date.UTC(2010,0,8,2,15,20)), 'Date#setISOWeek | utc | week 1');
  d.setISOWeek(15);
  dateEqual(d, new Date(Date.UTC(2010,3,16,2,15,20)), 'Date#setISOWeek | utc | week 15');
  d.setISOWeek(27);
  dateEqual(d, new Date(Date.UTC(2010,6,9,2,15,20)), 'Date#setISOWeek | utc | week 27');
  d.setISOWeek(52);
  dateEqual(d, new Date(Date.UTC(2010,11,31,2,15,20)), 'Date#setISOWeek | utc | week 52');
  d.setISOWeek();
  dateEqual(d, new Date(Date.UTC(2010,11,31,2,15,20)), 'Date#setISOWeek | utc | week stays set');


  // Date formatting. Much thanks to inspiration taken from Date.js here.
  // I quite like the formatting patterns in Date.js, however there are a few
  // notable limitations. One example is a format such as 4m23s which would have
  // to be formatted as mmss and wouldn't parse at all without special massaging.
  // Going to take a different tack here with a format that's more explicit and
  // easy to remember, if not quite as terse and elegant.


  d = new Date('August 5, 2010 13:45:02');


  equal(d.format(), 'August 5, 2010 1:45pm', 'Date#format | no arguments is standard format with no time');

  equal(d.format('{ms}'), '0', 'Date#format | custom formats | ms');
  equal(d.format('{milliseconds}'), '0', 'Date#format | custom formats | milliseconds');
  equal(d.format('{f}'), '0', 'Date#format | custom formats | f');
  equal(d.format('{ff}'), '00', 'Date#format | custom formats | ff');
  equal(d.format('{fff}'), '000', 'Date#format | custom formats | fff');
  equal(d.format('{ffff}'), '0000', 'Date#format | custom formats | ffff');
  equal(d.format('{s}'), '2', 'Date#format | custom formats | s');
  equal(d.format('{ss}'), '02', 'Date#format | custom formats | ss');
  equal(d.format('{seconds}'), '2', 'Date#format | custom formats | seconds');
  equal(d.format('{m}'), '45', 'Date#format | custom formats | m');
  equal(d.format('{mm}'), '45', 'Date#format | custom formats | mm');
  equal(d.format('{minutes}'), '45', 'Date#format | custom formats | minutes');
  equal(d.format('{h}'), '1', 'Date#format | custom formats | h');
  equal(d.format('{hh}'), '01', 'Date#format | custom formats | hh');
  equal(d.format('{H}'), '13', 'Date#format | custom formats | H');
  equal(d.format('{HH}'), '13', 'Date#format | custom formats | HH');
  equal(d.format('{hours}'), '1', 'Date#format | custom formats | hours');
  equal(d.format('{24hr}'), '13', 'Date#format | custom formats | 24hr');
  equal(d.format('{12hr}'), '1', 'Date#format | custom formats | 12hr');
  equal(d.format('{d}'), '5', 'Date#format | custom formats | d');
  equal(d.format('{dd}'), '05', 'Date#format | custom formats | dd');
  equal(d.format('{date}'), '5', 'Date#format | custom formats | date');
  equal(d.format('{day}'), '5', 'Date#format | custom formats | days');
  equal(d.format('{dow}'), 'thu', 'Date#format | custom formats | dow');
  equal(d.format('{Dow}'), 'Thu', 'Date#format | custom formats | Dow');
  equal(d.format('{weekday}'), 'thursday', 'Date#format | custom formats | weekday');
  equal(d.format('{Weekday}'), 'Thursday', 'Date#format | custom formats | Weekday');
  equal(d.format('{M}'), '8', 'Date#format | custom formats | M');
  equal(d.format('{MM}'), '08', 'Date#format | custom formats | MM');
  equal(d.format('{month}'), 'august', 'Date#format | custom formats | month');
  equal(d.format('{Mon}'), 'Aug', 'Date#format | custom formats | Mon');
  equal(d.format('{Month}'), 'August', 'Date#format | custom formats | Month');
  equal(d.format('{yy}'), '10', 'Date#format | custom formats | yy');
  equal(d.format('{yyyy}'), '2010', 'Date#format | custom formats | yyyy');
  equal(d.format('{year}'), '2010', 'Date#format | custom formats | year');
  equal(d.format('{t}'), 'p', 'Date#format | custom formats | t');
  equal(d.format('{T}'), 'P', 'Date#format | custom formats | T');
  equal(d.format('{tt}'), 'pm', 'Date#format | custom formats | tt');
  equal(d.format('{TT}'), 'PM', 'Date#format | custom formats | TT');
  equal(d.format('{ord}'), '5th', 'Date#format | custom formats | ord');

  equal(d.format('{Z}'), d.getUTCOffset(), 'Date#format | custom formats | Z');
  equal(d.format('{ZZ}'), d.getUTCOffset().replace(/(\d{2})$/, ':$1'), 'Date#format | custom formats | ZZ');


  d = new Date('August 5, 2010 04:03:02');

  equal(d.format('{mm}'), '03', 'Date#format | custom formats | mm pads the digit');
  equal(d.format('{dd}'), '05', 'Date#format | custom formats | dd pads the digit');
  equal(d.format('{hh}'), '04', 'Date#format | custom formats | hh pads the digit');
  equal(d.format('{ss}'), '02', 'Date#format | custom formats | ss pads the digit');


  equal(d.format('{M}/{d}/{yyyy}'), '8/5/2010', 'Date#format | full formats | slashes');
  equal(d.format('{Weekday}, {Month} {dd}, {yyyy}'), 'Thursday, August 05, 2010', 'Date#format | full formats | text date');
  equal(d.format('{Weekday}, {Month} {dd}, {yyyy} {12hr}:{mm}:{ss} {tt}'), 'Thursday, August 05, 2010 4:03:02 am', 'Date#format | full formats | text date with time');
  equal(d.format('{Month} {dd}'), 'August 05', 'Date#format | full formats | month and day');
  equal(d.format('{Dow}, {dd} {Mon} {yyyy} {hh}:{mm}:{ss} GMT'), 'Thu, 05 Aug 2010 04:03:02 GMT', 'Date#format | full formats | full GMT');
  equal(d.format('{yyyy}-{MM}-{dd}T{hh}:{mm}:{ss}'), '2010-08-05T04:03:02', 'Date#format | full formats | ISO8601 without timezone');
  equal(d.format('{12hr}:{mm} {tt}'), '4:03 am', 'Date#format | full formats | hr:min');
  equal(d.format('{12hr}:{mm}:{ss} {tt}'), '4:03:02 am', 'Date#format | full formats | hr:min:sec');
  equal(d.format('{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}Z'), '2010-08-05 04:03:02Z', 'Date#format | full formats | ISO8601 UTC');
  equal(d.format('{Month}, {yyyy}'), 'August, 2010', 'Date#format | full formats | month and year');



  // Locale specific output formats/shortcuts

  equal(d.format('short'), 'August 5, 2010', 'Date#format | shortcuts | short');
  equal(d.short(), 'August 5, 2010', 'Date#format | shortcuts | short method');
  equal(d.format('long'), 'August 5, 2010 4:03am', 'Date#format | shortcuts | long');
  equal(d.long(), 'August 5, 2010 4:03am', 'Date#format | shortcuts | long method');
  equal(d.format('full'), 'Thursday August 5, 2010 4:03:02am', 'Date#format | shortcuts | full');
  equal(d.full(), 'Thursday August 5, 2010 4:03:02am', 'Date#format | shortcuts | full method');

  // Don't want this for now as there's no set concept of a "time" necessarily without
  // raising questions like "with seconds?" etc... treads on short/long/full so find a better
  // way to handle this if necessary.
  // equal(d.format('w00t {time}'), 'w00t 4:03:02am', 'Date#format | shortcuts | custom time format');




  // Be VERY careful here. Timezone offset is NOT always guaranteed to be the same for a given timezone,
  // as DST may come into play.
  var offset = d.getTimezoneOffset();
  var isotzd = testPadNumber(Math.floor(-offset / 60), 2, true) + ':' + testPadNumber(Math.abs(offset % 60), 2);
  var tzd = isotzd.replace(/:/, '');
  if(d.isUTC()) {
    isotzd = 'Z';
    tzd = '+0000';
  }

  equal(d.getUTCOffset(), tzd, 'Date#getUTCOffset | no colon');
  equal(d.getUTCOffset(true), isotzd, 'Date#getUTCOffset | colon');

  equal(d.format(Date.ISO8601_DATE), '2010-08-05', 'Date#format | constants | ISO8601_DATE');
  equal(d.format(Date.ISO8601_DATETIME), '2010-08-05T04:03:02.000'+isotzd, 'Date#format | constants | ISO8601_DATETIME');


  equal(d.format('ISO8601_DATE'), '2010-08-05', 'Date#format | string constants | ISO8601_DATE');
  equal(d.format('ISO8601_DATETIME'), '2010-08-05T04:03:02.000'+isotzd, 'Date#format | constants | ISO8601_DATETIME');

  var iso = d.getUTCFullYear()+'-'+testPadNumber(d.getUTCMonth()+1, 2)+'-'+testPadNumber(d.getUTCDate(), 2)+'T'+testPadNumber(d.getUTCHours(), 2)+':'+testPadNumber(d.getUTCMinutes(), 2)+':'+testPadNumber(d.getUTCSeconds(), 2)+'.'+testPadNumber(d.getUTCMilliseconds(), 3)+'Z';


  equal(d.clone().utc().format(Date.ISO8601_DATETIME), iso, 'Date#format | constants | ISO8601_DATETIME UTC HOLY');
  equal(d.clone().utc().format('ISO8601_DATETIME'), iso, 'Date#format | string constants | ISO8601_DATETIME UTC');


  var rfc1123 = testCapitalize(getWeekdayFromDate(d).slice(0,3))+', '+testPadNumber(d.getDate(), 2)+' '+testCapitalize(getMonthFromDate(d).slice(0,3))+' '+d.getFullYear()+' '+testPadNumber(d.getHours(), 2)+':'+testPadNumber(d.getMinutes(), 2)+':'+testPadNumber(d.getSeconds(), 2)+' '+d.getUTCOffset();
  var rfc1036 = testCapitalize(getWeekdayFromDate(d))+', '+testPadNumber(d.getDate(), 2)+'-'+testCapitalize(getMonthFromDate(d).slice(0,3))+'-'+d.getFullYear().toString().slice(2)+' '+testPadNumber(d.getHours(), 2)+':'+testPadNumber(d.getMinutes(), 2)+':'+testPadNumber(d.getSeconds(), 2)+' '+d.getUTCOffset();
  equal(d.format(Date.RFC1123), rfc1123, 'Date#format | constants | RFC1123');
  equal(d.format(Date.RFC1036), rfc1036, 'Date#format | constants | RFC1036');
  equal(d.format('RFC1123'), rfc1123, 'Date#format | string constants | RFC1123');
  equal(d.format('RFC1036'), rfc1036, 'Date#format | string constants | RFC1036');


  rfc1123 = testCapitalize(getWeekdayFromDate(d,true).slice(0,3))+', '+testPadNumber(d.getUTCDate(), 2)+' '+testCapitalize(getMonthFromDate(d,true).slice(0,3))+' '+d.getUTCFullYear()+' '+testPadNumber(d.getUTCHours(), 2)+':'+testPadNumber(d.getUTCMinutes(), 2)+':'+testPadNumber(d.getUTCSeconds(), 2)+' +0000';
  rfc1036 = testCapitalize(getWeekdayFromDate(d,true))+', '+testPadNumber(d.getUTCDate(), 2)+'-'+testCapitalize(getMonthFromDate(d,true).slice(0,3))+'-'+d.getUTCFullYear().toString().slice(2)+' '+testPadNumber(d.getUTCHours(), 2)+':'+testPadNumber(d.getUTCMinutes(), 2)+':'+testPadNumber(d.getUTCSeconds(), 2)+' +0000';

  equal(d.clone().utc().format('RFC1123'), rfc1123, 'Date#format | string constants | RFC1123 UTC');
  equal(d.clone().utc().format('RFC1036'), rfc1036, 'Date#format | string constants | RFC1036 UTC');


  equal(Date.create('totally invalid').format(Date.ISO8601_DATETIME), 'Invalid Date', 'Date#format | invalid');



  // ISO format

  equal(d.toISOString(), d.clone().utc().format(Date.ISO8601_DATETIME), 'Date#toISOString is an alias for the ISO8601_DATETIME format in UTC');
  equal(d.iso(), d.clone().utc().format(Date.ISO8601_DATETIME), 'Date#iso is an alias for the ISO8601_DATETIME format in UTC');




  // relative time formatting


  skipEnvironments(['mootools'], function() {

    var dyn = function(value, unit, ms, loc) {
      if(ms < -(1).year()) {
        return '{Month} {date}, {year}';
      }
    }

    equal(Date.create('5 minutes ago').format(dyn), getRelativeDate(null, null, null, null, -5).format(), 'Date#format | relative fn | 5 minutes should stay relative');
    equal(Date.create('13 months ago').format(dyn), Date.create('13 months ago').format('{Month} {date}, {year}'), 'Date#format | relative fn | higher reverts to absolute');

    // globalize system with plurals

    var strings = ['ミリ秒','秒','分','時間','日','週間','月','年'];

    dyn = function(value, unit, ms, loc) {
      equal(value, 5, 'Date#format | relative fn | 5 minutes ago | value is the closest relevant value');
      equal(unit, 2, 'Date#format | relative fn | 5 minutes ago | unit is the closest relevant unit');
      equalWithMargin(ms, -300000, 10, 'Date#format | relative fn | 5 minutes ago | ms is the offset in ms');
      equal(loc.code, 'en', 'Date#format | relative fn | 4 hours ago | 4th argument is the locale object');
      return value + strings[unit] + (ms < 0 ? '前' : '後');
    }

    equal(Date.create('5 minutes ago').format(dyn), '5分前', 'Date#format | relative fn | 5 minutes ago');


    dyn = function(value, unit, ms, loc) {
      equal(value, 1, 'Date#format | relative fn | 1 minute from now | value is the closest relevant value');
      equal(unit, 2, 'Date#format | relative fn | 1 minute from now | unit is the closest relevant unit');
      equalWithMargin(ms, 61000, 5, 'Date#format | relative fn | 1 minute from now | ms is the offset in ms');
      equal(loc.code, 'en', 'Date#format | relative fn | 4 hours ago | 4th argument is the locale object');
      return value + strings[unit] + (ms < 0 ? '前' : '後');
    }

    equal(Date.create('61 seconds from now').format(dyn), '1分後', 'Date#format | relative fn | 1 minute from now');



    dyn = function(value, unit, ms, loc) {
      equal(value, 4, 'Date#format | relative fn | 4 hours ago | value is the closest relevant value');
      equal(unit, 3, 'Date#format | relative fn | 4 hours ago | unit is the closest relevant unit');
      equalWithMargin(ms, -14400000, 10, 'Date#format | relative fn | 4 hours ago | ms is the offset in ms');
      equal(loc.code, 'en', 'Date#format | relative fn | 4 hours ago | 4th argument is the locale object');
      return value + strings[unit] + (ms < 0 ? '前' : '後');
    }

    equal(Date.create('240 minutes ago').format(dyn), '4時間前', 'Date#format | relative fn | 4 hours ago');

    Date.create('223 milliseconds ago').format(function(value, unit) {
      equalWithMargin(value, 223, 10, 'Date format | relative fn | still passes < 1 second');
      equal(unit, 0, 'Date format | relative fn | still passes millisecond is zero');
    });

    equal(Date.create('2002-02-17').format(function() {}), 'February 17, 2002 12:00am', 'Date#format | function that returns undefined defaults to standard format');

  });

  equal(Date.create().relative(), '1 second ago', 'Date#relative | relative | 6 milliseconds');
  equal(Date.create('6234 milliseconds ago').relative(), '6 seconds ago', 'Date#relative | relative | 6 milliseconds');
  equal(Date.create('6 seconds ago').relative(), '6 seconds ago', 'Date#relative | relative | 6 seconds');
  equal(Date.create('360 seconds ago').relative(), '6 minutes ago', 'Date#relative | relative | 360 seconds');
  equal(Date.create('360 minutes ago').relative(), '6 hours ago', 'Date#relative | relative | minutes');
  equal(Date.create('360 hours ago').relative(), '2 weeks ago', 'Date#relative | relative | hours');
  equal(Date.create('340 days ago').relative(), '11 months ago', 'Date#relative | relative | 340 days');
  equal(Date.create('360 days ago').relative(), '1 year ago', 'Date#relative | relative | 360 days');
  equal(Date.create('360 weeks ago').relative(), '6 years ago', 'Date#relative | relative | weeks');
  equal(Date.create('360 months ago').relative(), '30 years ago', 'Date#relative | relative | months');
  equal(Date.create('360 years ago').relative(), '360 years ago', 'Date#relative | relative | years');
  equal(Date.create('12 months ago').relative(), '1 year ago', 'Date#relative | relative | 12 months ago');

  equal(Date.create('6234 milliseconds from now').relative(), '6 seconds from now', 'Date#relative | relative future | 6 milliseconds');
  equal(Date.create('361 seconds from now').relative(), '6 minutes from now', 'Date#relative | relative future | 360 seconds');
  equal(Date.create('361 minutes from now').relative(), '6 hours from now', 'Date#relative | relative future | minutes');
  equal(Date.create('360 hours from now').relative(), '2 weeks from now', 'Date#relative | relative future | hours');
  equal(Date.create('340 days from now').relative(), '11 months from now', 'Date#relative | relative future | 340 days');
  equal(Date.create('360 days from now').relative(), '1 year from now', 'Date#relative | relative future | 360 days');
  equal(Date.create('360 weeks from now').relative(), '6 years from now', 'Date#relative | relative future | weeks');
  equal(Date.create('360 months from now').relative(), '30 years from now', 'Date#relative | relative future | months');
  equal(Date.create('360 years from now').relative(), '360 years from now', 'Date#relative | relative future | years');
  equal(Date.create('13 months from now').relative(), '1 year from now', 'Date#relative | relative future | 12 months ago');

  var dyn = function(value, unit, ms, loc) {
    if(ms < -(1).year()) {
      return '{Month} {date}, {year}';
    }
  }
  equal(Date.create('2002-02-17').relative(dyn), 'February 17, 2002', 'Date#relative | function that returns a format uses that format');
  equal(Date.create('45 days ago').relative(dyn), '1 month ago', 'Date#relative | function that returns undefined uses relative format');


  d = new Date(2010,7,5,13,45,2,542);

  equal(d.is('nonsense'), false, 'Date#is | nonsense');
  equal(d.is('August'), true, 'Date#is | August');
  equal(d.is('August 5th, 2010'), true, 'Date#is | August 5th, 2010');
  equal(d.is('August 5th, 2010 13:45'), true, 'Date#is | August 5th, 2010, 13:45');
  equal(d.is('August 5th, 2010 13:45:02'), true, 'Date#is | August 5th 2010, 13:45:02');
  equal(d.is('August 5th, 2010 13:45:02.542'), true, 'Date#is | August 5th 2010, 13:45:02:542');
  equal(d.is('September'), false, 'Date#is | September');
  equal(d.is('August 6th, 2010'), false, 'Date#is | August 6th, 2010');
  equal(d.is('August 5th, 2010 13:46'), false, 'Date#is | August 5th, 2010, 13:46');
  equal(d.is('August 5th, 2010 13:45:03'), false, 'Date#is | August 5th 2010, 13:45:03');
  equal(d.is('August 5th, 2010 13:45:03.543'), false, 'Date#is | August 5th 2010, 13:45:03:543');
  equal(d.is('July'), false, 'Date#is | July');
  equal(d.is('August 4th, 2010'), false, 'Date#is | August 4th, 2010');
  equal(d.is('August 5th, 2010 13:44'), false, 'Date#is | August 5th, 2010, 13:44');
  equal(d.is('August 5th, 2010 13:45:01'), false, 'Date#is | August 5th 2010, 13:45:01');
  equal(d.is('August 5th, 2010 13:45:03.541'), false, 'Date#is | August 5th 2010, 13:45:03:541');
  equal(d.is('2010'), true, 'Date#is | 2010');
  equal(d.is('today'), false, 'Date#is | today');
  equal(d.is('now'), false, 'Date#is | now');
  equal(d.is('weekday'), true, 'Date#is | weekday');
  equal(d.is('weekend'), false, 'Date#is | weekend');
  equal(d.is('Thursday'), true, 'Date#is | Thursday');
  equal(d.is('Friday'), false, 'Date#is | Friday');

  equal(d.is(d), true, 'Date#is | self is true');
  equal(d.is(new Date(2010,7,5,13,45,2,542)), true, 'Date#is | equal date is true');
  equal(d.is(new Date()), false, 'Date#is | other dates are not true');
  equal(d.is(1281015902542 + (offset * 60 * 1000)), true, 'Date#is | timestamps also accepted');

  equal(new Date().is('now', 10), true, 'Date#is | now is now');
  equal(new Date(2010,7,5,13,42,42,324).is('August 5th, 2010 13:42:42.324'), true, 'Date#is | August 5th, 2010 13:42:42.324');
  equal(new Date(2010,7,5,13,42,42,324).is('August 5th, 2010 13:42:42.319'), false, 'Date#is | August 5th, 2010 13:42:42.319');
  equal(new Date(2010,7,5,13,42,42,324).is('August 5th, 2010 13:42:42.325'), false, 'Date#is | August 5th, 2010 13:42:42.325');
  equal(new Date(2010,7,5,13,42,42,324).is('August 5th, 2010 13:42:42.323'), false, 'Date#is | August 5th, 2010 13:42:42.323');

  equal(new Date(2001, 0).is('the beginning of 2001'), true, 'Date#is | the beginning of 2001');
  equal(new Date(now.getFullYear(), 2).is('the beginning of March'), true, 'Date#is | the beginning of March');
  equal(new Date(2001, 11, 31, 23, 59, 59, 999).is('the end of 2001'), true, 'Date#is | the end of 2001');
  equal(new Date(now.getFullYear(), 2, 31, 23, 59, 59, 999).is('the end of March'), true, 'Date#is | the end of March');
  equal(new Date(2001, 11, 31).is('the last day of 2001'), true, 'Date#is | the last day of 2001');
  equal(new Date(now.getFullYear(), 2, 31).is('the last day of March'), true, 'Date#is | the last day of March');

  equal(Date.create('the beginning of the week').is('the beginning of the week'), true, 'Date#is | the beginning of the week is the beginning of the week');
  equal(Date.create('the end of the week').is('the end of the week'), true, 'Date#is | the end of the week is the end of the week');
  equal(Date.create('tuesday').is('the beginning of the week'), false, 'Date#is | tuesday is the beginning of the week');
  equal(Date.create('tuesday').is('the end of the week'), false, 'Date#is | tuesday is the end of the week');

  equal(Date.create('sunday').is('the beginning of the week'), true, 'Date#is | sunday is the beginning of the week');
  equal(Date.create('sunday').is('the beginning of the week'), true, 'Date#is | sunday is the beginning of the week');

  equal(Date.create('tuesday').is('tuesday'), true, 'Date#is | tuesday is tuesday');
  equal(Date.create('sunday').is('sunday'), true, 'Date#is | sunday is sunday');
  equal(Date.create('saturday').is('saturday'), true, 'Date#is | saturday is saturday');

  equal(getDateWithWeekdayAndOffset(0).is('the beginning of the week'), true, 'Date#is | the beginning of the week');
  equal(getDateWithWeekdayAndOffset(6, 0, 23, 59, 59, 999).is('the end of the week'), true, 'Date#is | the end of the week');



  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,431)), false, 'Date#is | accuracy | accurate to millisecond by default | 431');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432)), true, 'Date#is | accuracy |  accurate to millisecond by default | 432');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,433)), false, 'Date#is | accuracy | accurate to millisecond by default | 433');

  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,431), 2), true, 'Date#is | accuracy | accuracy can be overridden | 431');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 2), true, 'Date#is | accuracy | accuracy can be overridden | 432');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,433), 2), true, 'Date#is | accuracy | accuracy can be overridden | 433');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,429), 2), false, 'Date#is | accuracy | accuracy can be overridden but still is constrained');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,435), 2), false, 'Date#is | accuracy | accuracy can be overridden but still is constrained');


  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,431), -500), false, 'Date#is | accuracy | negative accuracy reverts to zero');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), -500), true, 'Date#is | accuracy | negative accuracy reverts to zero');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,433), -500), false, 'Date#is | accuracy | negative accuracy reverts to zero');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,429), -500), false, 'Date#is | accuracy | negative accuracy reverts to zero');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,435), -500), false, 'Date#is | accuracy | negative accuracy reverts to zero');


  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 86400000), true, 'Date#is | accuracy | accurate to a day');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,23,3,1,432), 86400000), true, 'Date#is | accuracy | accurate to a day');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,21,3,1,432), 86400000), true, 'Date#is | accuracy | accurate to a day');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,14,22,3,1,432), 86400000), true, 'Date#is | accuracy | accurate to a day');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,16,22,3,1,432), 86400000), true, 'Date#is | accuracy | accurate to a day');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,14,22,3,1,431), 86400000), false, 'Date#is | accuracy | accurate to a day is still contstrained');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,16,22,3,1,433), 86400000), false, 'Date#is | accuracy | accurate to a day is still contstrained');

  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,14,22,3,2,432), 31536000000), false, 'Date#is | accuracy | 1969 accurate to a year is still contstrained');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | 1969 accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | 1970 accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1971,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | 1971 accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1971,4,16,22,3,1,432), 31536000000), false, 'Date#is | accuracy | 1971 accurate to a year is still contstrained');





  // Note that relative #is formats can only be considered to be accurate to within a few milliseconds
  // to avoid complications rising from the date being created momentarily after the function is called.
  equal(getRelativeDate(null,null,null,null,null,null, -5).is('3 milliseconds ago'), false, 'Date#is | 3 milliseconds ago is accurate to milliseconds');
  equal(getRelativeDate(null,null,null,null,null,null, -5).is('5 milliseconds ago', 5), true, 'Date#is | 5 milliseconds ago is accurate to milliseconds');
  equal(getRelativeDate(null,null,null,null,null,null, -5).is('7 milliseconds ago'), false, 'Date#is | 7 milliseconds ago is accurate to milliseconds');

  equal(getRelativeDate(null,null,null,null,null,-5).is('4 seconds ago'), false, 'Date#is | 4 seconds ago is not 5 seconds ago');
  equal(getRelativeDate(null,null,null,null,null,-5).is('5 seconds ago'), true, 'Date#is | 5 seconds ago is 5 seconds ago');
  equal(getRelativeDate(null,null,null,null,null,-5).is('6 seconds ago'), false, 'Date#is | 6 seconds ago is not 5 seconds ago');
  equal(getRelativeDate(null,null,null,null,null,-5).is('7 seconds ago'), false, 'Date#is | 7 seconds ago is not 5 seconds ago');

  equal(getRelativeDate(null,null,null,null,-5).is('4 minutes ago'), false, 'Date#is | 4 minutes ago is not 5 minutes ago');
  equal(getRelativeDate(null,null,null,null,-5).is('5 minutes ago'), true, 'Date#is | 5 minutes ago is 5 minutes ago');
  equal(getRelativeDate(null,null,null,null,-5).is('6 minutes ago'), false, 'Date#is | 6 minutes ago is not 5 minutes ago');
  equal(getRelativeDate(null,null,null,null,-5).is('7 minutes ago'), false, 'Date#is | 7 minutes ago is not 5 minutes ago');

  equal(getRelativeDate(null,null,null,-5).is('4 hours ago'), false, 'Date#is | 4 hours ago is not 5 hours ago');
  equal(getRelativeDate(null,null,null,-5).is('5 hours ago'), true, 'Date#is | 5 hours ago is 5 hours ago');
  equal(getRelativeDate(null,null,null,-5, 15).is('5 hours ago'), true, 'Date#is | 5:15 hours ago is still 5 hours ago');
  equal(getRelativeDate(null,null,null,-5).is('6 hours ago'), false, 'Date#is | 6 hours ago is not 5 hours ago');
  equal(getRelativeDate(null,null,null,-5).is('7 hours ago'), false, 'Date#is | 7 hours ago is not 5 hours ago');

  equal(getRelativeDate(null,null,-5).is('4 days ago'), false, 'Date#is | 4 days ago is not 5 days ago');
  equal(getRelativeDate(null,null,-5).is('5 days ago'), true, 'Date#is | 5 days ago is 5 hours ago');
  equal(getRelativeDate(null,null,-5).is('6 days ago'), false, 'Date#is | 6 days ago is not 5 days ago');
  equal(getRelativeDate(null,null,-5).is('7 days ago'), false, 'Date#is | 7 days ago is not 5 days ago');

  equal(getRelativeDate(null,-5).is('4 months ago'), false, 'Date#is | 4 months ago is not 5 months ago');
  equal(getRelativeDate(null,-5).is('5 months ago'), true, 'Date#is | 5 months ago is 5 months ago');
  equal(getRelativeDate(null,-5).is('6 months ago'), false, 'Date#is | 6 months ago is not 5 months ago');
  equal(getRelativeDate(null,-5).is('7 months ago'), false, 'Date#is | 7 months ago is accurate to months');

  equal(getRelativeDate(-5).is('4 years ago'), false, 'Date#is | 4 years ago is not 5 years ago');
  equal(getRelativeDate(-5).is('5 years ago'), true, 'Date#is | 5 years ago is 5 years ago');
  equal(getRelativeDate(-5).is('6 years ago'), false, 'Date#is | 6 years ago is not 5 years ago');
  equal(getRelativeDate(-5).is('7 years ago'), false, 'Date#is | 7 years ago is not 5 years ago');



  equal(Date.create('tomorrow').is('future'), true, 'Date#is | tomorrow is the future');
  equal(Date.create('tomorrow').is('past'), false, 'Date#is | tomorrow is the past');

  equal(new Date().is('future'), false, 'Date#is | now is the future');

  // now CAN be in the past if there is any lag between when the dates are
  // created, so give this a bit of a buffer...
  equal(new Date().advance({ milliseconds: 5 }).is('past', 5), false, 'Date#is | now is the past');

  equal(Date.create('yesterday').is('future'), false, 'Date#is | yesterday is the future');
  equal(Date.create('yesterday').is('past'), true, 'Date#is | yesterday is the past');

  equal(Date.create('monday').is('weekday'), true, 'Date#is | monday is a weekday');
  equal(Date.create('monday').is('weekend'), false, 'Date#is | monday is a weekend');

  equal(Date.create('friday').is('weekday'), true, 'Date#is | friday is a weekday');
  equal(Date.create('friday').is('weekend'), false, 'Date#is | friday is a weekend');

  equal(Date.create('saturday').is('weekday'), false, 'Date#is | saturday is a weekday');
  equal(Date.create('saturday').is('weekend'), true, 'Date#is | saturday is a weekend');

  equal(Date.create('sunday').is('weekday'), false, 'Date#is | sunday is a weekday');
  equal(Date.create('sunday').is('weekend'), true, 'Date#is | sunday is a weekend');



  equal(new Date(2001,5,4,12,22,34,445).is(new Date(2001,5,4,12,22,34,445)), true, 'Date#is | straight dates passed in are accurate to the millisecond');
  equal(new Date(2001,5,4,12,22,34,445).is(new Date(2001,5,4,12,22,34,444)), false, 'Date#is | straight dates passed in are accurate to the millisecond');
  equal(new Date(2001,5,4,12,22,34,445).is(new Date(2001,5,4,12,22,34,446)), false, 'Date#is | straight dates passed in are accurate to the millisecond');

  equal(Date.create('3 hours ago').is('now', 'bloopie'), false, 'Date#is | does not die on string-based precision');


  equal(Date.create('2008').isLeapYear(), true, 'Date#leapYear | 2008');
  equal(Date.create('2009').isLeapYear(), false, 'Date#leapYear | 2009');
  equal(Date.create('2010').isLeapYear(), false, 'Date#leapYear | 2010');
  equal(Date.create('2011').isLeapYear(), false, 'Date#leapYear | 2011');
  equal(Date.create('2012').isLeapYear(), true, 'Date#leapYear | 2012');
  equal(Date.create('2016').isLeapYear(), true, 'Date#leapYear | 2016');
  equal(Date.create('2020').isLeapYear(), true, 'Date#leapYear | 2020');
  equal(Date.create('2021').isLeapYear(), false, 'Date#leapYear | 2021');
  equal(Date.create('1600').isLeapYear(), true, 'Date#leapYear | 1600');
  equal(Date.create('1700').isLeapYear(), false, 'Date#leapYear | 1700');
  equal(Date.create('1800').isLeapYear(), false, 'Date#leapYear | 1800');
  equal(Date.create('1900').isLeapYear(), false, 'Date#leapYear | 1900');
  equal(Date.create('2000').isLeapYear(), true, 'Date#leapYear | 2000');


  d = new Date(2010,7,5,13,45,2,542);

  equal(d.getISOWeek(), 31, 'Date#getISOWeek | basic August 5th, 2010');
  dateEqual(d, new Date(2010,7,5,13,45,2,542), 'Date#getISOWeek | should not modify the date');

  equal(new Date(2010, 0, 1).getISOWeek(), 53, 'Date#getISOWeek | January 1st, 2010');
  equal(new Date(2010, 0, 6).getISOWeek(), 1, 'Date#getISOWeek | January 6th, 2010');
  equal(new Date(2010, 0, 7).getISOWeek(), 1, 'Date#getISOWeek | January 7th, 2010');
  equal(new Date(2010, 0, 7, 23, 59, 59, 999).getISOWeek(), 1, 'Date#getISOWeek | January 7th, 2010 h23:59:59.999');
  equal(new Date(2010, 0, 8).getISOWeek(), 1, 'Date#getISOWeek | January 8th, 2010');
  equal(new Date(2010, 3, 15).getISOWeek(), 15, 'Date#getISOWeek | April 15th, 2010');

  d = new Date(2010,7,5,13,45,2,542).utc();

  equal(d.getISOWeek(), d.getTimezoneOffset() > 615 ? 32 : 31, 'Date#getISOWeek | utc | basic');
  equal(new Date(2010, 0, 1).getISOWeek(), 53, 'Date#getISOWeek | utc | January 1st UTC is actually 2009');
  equal(new Date(2010, 0, 6).getISOWeek(), 1, 'Date#getISOWeek | utc | January 6th');
  equal(new Date(2010, 0, 7).getISOWeek(), 1, 'Date#getISOWeek | utc | January 7th');
  equal(new Date(2010, 0, 7, 23, 59, 59, 999).getISOWeek(), 1, 'Date#getISOWeek | utc | January 7th 23:59:59.999');
  equal(new Date(2010, 0, 8).getISOWeek(), 1, 'Date#getISOWeek | utc | January 8th');
  equal(new Date(2010, 3, 15).getISOWeek(), 15, 'Date#getISOWeek | utc | April 15th');


  d = new Date(2010,7,5,13,45,2,542);

  equal(new Date(2010,7,5,13,45,2,543).millisecondsSince(d), 1, 'Date#millisecondsSince | 1 milliseconds since');
  equal(new Date(2010,7,5,13,45,2,541).millisecondsUntil(d), 1, 'Date#millisecondsUntil | 1 milliseconds until');
  equal(new Date(2010,7,5,13,45,3,542).secondsSince(d), 1, 'Date#secondsSince | 1 seconds since');
  equal(new Date(2010,7,5,13,45,1,542).secondsUntil(d), 1, 'Date#secondsUntil | 1 seconds until');
  equal(new Date(2010,7,5,13,46,2,542).minutesSince(d), 1, 'Date#minutesSince | 1 minutes since');
  equal(new Date(2010,7,5,13,44,2,542).minutesUntil(d), 1, 'Date#minutesUntil | 1 minutes until');
  equal(new Date(2010,7,5,14,45,2,542).hoursSince(d), 1, 'Date#hoursSince | 1 hours since');
  equal(new Date(2010,7,5,12,45,2,542).hoursUntil(d), 1, 'Date#hoursUntil | 1 hours until');
  equal(new Date(2010,7,6,13,45,2,542).daysSince(d), 1, 'Date#daysSince | 1 days since');
  equal(new Date(2010,7,4,13,45,2,542).daysUntil(d), 1, 'Date#daysUntil | 1 days until');
  equal(new Date(2010,7,12,13,45,2,542).weeksSince(d), 1, 'Date#weeksSince | 1 weeks since');
  equal(new Date(2010,6,29,13,45,2,542).weeksUntil(d), 1, 'Date#weeksUntil | 1 weeks until');
  equal(new Date(2010,8,5,13,45,2,542).monthsSince(d), 1, 'Date#monthsSince | 1 months since');
  equal(new Date(2010,6,5,13,45,2,542).monthsUntil(d), 1, 'Date#monthsUntil | 1 months until');
  equal(new Date(2011,7,5,13,45,2,542).yearsSince(d), 1, 'Date#yearsSince | 1 years since');
  equal(new Date(2009,7,5,13,45,2,542).yearsUntil(d), 1, 'Date#yearsUntil | 1 years until');


  equal(new Date(2011,7,5,13,45,2,542).millisecondsSince(d), 31536000000, 'Date#millisecondsSince | milliseconds since last year');
  equal(new Date(2011,7,5,13,45,2,542).millisecondsUntil(d), -31536000000, 'Date#millisecondsUntil | milliseconds until last year');
  equal(new Date(2011,7,5,13,45,2,542).secondsSince(d), 31536000, 'Date#secondsSince | seconds since last year');
  equal(new Date(2011,7,5,13,45,2,542).secondsUntil(d), -31536000, 'Date#secondsUntil | seconds until last year');
  equal(new Date(2011,7,5,13,45,2,542).minutesSince(d), 525600, 'Date#minutesSince | minutes since last year');
  equal(new Date(2011,7,5,13,45,2,542).minutesUntil(d), -525600, 'Date#minutesUntil | minutes until last year');
  equal(new Date(2011,7,5,13,45,2,542).hoursSince(d), 8760, 'Date#hoursSince | hours since last year');
  equal(new Date(2011,7,5,13,45,2,542).hoursUntil(d), -8760, 'Date#hoursUntil | hours until last year');
  equal(new Date(2011,7,5,13,45,2,542).daysSince(d), 365, 'Date#daysSince | days since last year');
  equal(new Date(2011,7,5,13,45,2,542).daysUntil(d), -365, 'Date#daysUntil | days until last year');
  equal(new Date(2011,7,5,13,45,2,542).weeksSince(d), 52, 'Date#weeksSince | weeks since last year');
  equal(new Date(2011,7,5,13,45,2,542).weeksUntil(d), -52, 'Date#weeksUntil | weeks until last year');
  equal(new Date(2011,7,5,13,45,2,542).monthsSince(d), 12, 'Date#monthsSince | months since last year');
  equal(new Date(2011,7,5,13,45,2,542).monthsUntil(d), -12, 'Date#monthsUntil | months until last year');
  equal(new Date(2011,7,5,13,45,2,542).yearsSince(d), 1, 'Date#yearsSince | years since last year');
  equal(new Date(2011,7,5,13,45,2,542).yearsUntil(d), -1, 'Date#yearsUntil | years until last year');



  equal(new Date(2010,7,5,13,45,2,543).millisecondsFromNow(d), 1, 'Date#millisecondsFromNow | FromNow alias | milliseconds');
  equal(new Date(2010,7,5,13,45,2,541).millisecondsAgo(d), 1, 'Date#millisecondsAgo | from now alias | milliseconds');
  equal(new Date(2010,7,5,13,45,3,542).secondsFromNow(d), 1, 'Date#secondsFromNow | FromNow alias | seconds');
  equal(new Date(2010,7,5,13,45,1,542).secondsAgo(d), 1, 'Date#secondsAgo | Ago alias | seconds');
  equal(new Date(2010,7,5,13,46,2,542).minutesFromNow(d), 1, 'Date#minutesFromNow | FromNow alias | minutes');
  equal(new Date(2010,7,5,13,44,2,542).minutesAgo(d), 1, 'Date#minutesAgo | Ago alias | minutes');
  equal(new Date(2010,7,5,14,45,2,542).hoursFromNow(d), 1, 'Date#hoursFromNow | FromNow alias | hours');
  equal(new Date(2010,7,5,12,45,2,542).hoursAgo(d), 1, 'Date#hoursAgo | Ago alias | hours');
  equal(new Date(2010,7,6,13,45,2,542).daysFromNow(d), 1, 'Date#daysFromNow | FromNow alias | days');
  equal(new Date(2010,7,4,13,45,2,542).daysAgo(d), 1, 'Date#daysAgo | Ago alias | days');
  equal(new Date(2010,7,12,13,45,2,542).weeksFromNow(d), 1, 'Date#weeksFromNow | FromNow alias | weeks');
  equal(new Date(2010,6,29,13,45,2,542).weeksAgo(d), 1, 'Date#weeksAgo | Ago alias | weeks');
  equal(new Date(2010,8,5,13,45,2,542).monthsFromNow(d), 1, 'Date#monthsFromNow | FromNow alias | months');
  equal(new Date(2010,6,5,13,45,2,542).monthsAgo(d), 1, 'Date#monthsAgo | Ago alias | months');
  equal(new Date(2011,7,5,13,45,2,542).yearsFromNow(d), 1, 'Date#yearsFromNow | FromNow alias | years');
  equal(new Date(2009,7,5,13,45,2,542).yearsAgo(d), 1, 'Date#yearsAgo | Ago alias | years');

  dst = (d.getTimezoneOffset() - new Date(2011, 11, 31).getTimezoneOffset()) * 60 * 1000;

  // Works with Date.create?
  equal(d.millisecondsSince('the last day of 2011'), -44273697458 + dst, 'Date#millisecondsSince | milliseconds since the last day of 2011');
  equal(d.millisecondsUntil('the last day of 2011'), 44273697458 - dst, 'Date#millisecondsUntil | milliseconds until the last day of 2011');
  equal(d.secondsSince('the last day of 2011'), -44273697 + (dst / 1000), 'Date#secondsSince | seconds since the last day of 2011');
  equal(d.secondsUntil('the last day of 2011'), 44273697 - (dst / 1000), 'Date#secondsUntil | seconds until the last day of 2011');
  equal(d.minutesSince('the last day of 2011'), -737894 + (dst / 60 / 1000), 'Date#minutesSince | minutes since the last day of 2011');
  equal(d.minutesUntil('the last day of 2011'), 737894 - (dst / 60 / 1000), 'Date#minutesUntil | minutes until the last day of 2011');
  equal(d.hoursSince('the last day of 2011'), -12298 + (dst / 60 / 60 / 1000), 'Date#hoursSince | hours since the last day of 2011');
  equal(d.hoursUntil('the last day of 2011'), 12298 - (dst / 60 / 60 / 1000), 'Date#hoursUntil | hours until the last day of 2011');
  equal(d.daysSince('the last day of 2011'), -512, 'Date#daysSince | days since the last day of 2011');
  equal(d.daysUntil('the last day of 2011'), 512, 'Date#daysUntil | days until the last day of 2011');
  equal(d.weeksSince('the last day of 2011'), -73, 'Date#weeksSince | weeks since the last day of 2011');
  equal(d.weeksUntil('the last day of 2011'), 73, 'Date#weeksUntil | weeks until the last day of 2011');
  equal(d.monthsSince('the last day of 2011'), -16, 'Date#monthsSince | months since the last day of 2011');
  equal(d.monthsUntil('the last day of 2011'), 16, 'Date#monthsUntil | months until the last day of 2011');
  equal(d.yearsSince('the last day of 2011'), -1, 'Date#yearsSince | years since the last day of 2011');
  equal(d.yearsUntil('the last day of 2011'), 1, 'Date#yearsUntil | years until the last day of 2011');



  d = new Date();
  var offset = d.getTime() - new Date(d).advance({ week: -1 });
  var since, until;

  // I'm occasionally seeing some REALLY big lags with IE here (up to 500ms), so giving a 1s buffer here.
  //
  var msSince = d.millisecondsSince('last week');
  var msUntil = d.millisecondsUntil('last week');
  var actualMsSince = Math.round(offset);
  var actualMsUntil = Math.round(-offset);

  equal((msSince <= actualMsSince + 1000) && (msSince >= actualMsSince - 1000), true, 'Date#millisecondsSince | milliseconds since last week');
  equal((msUntil <= actualMsUntil + 1000) && (msUntil >= actualMsUntil - 1000), true, 'Date#millisecondsUntil | milliseconds until last week');

  var secSince = d.secondsSince('last week');
  var secUntil = d.secondsUntil('last week');
  var actualSecSince = Math.round(offset / 1000);
  var actualSecUntil = Math.round(-offset / 1000);

  equal((secSince <= actualSecSince + 5) && (secSince >= actualSecSince - 5), true, 'Date#secondsSince | seconds since last week');
  equal((secUntil <= actualSecUntil + 5) && (secUntil >= actualSecUntil - 5), true, 'Date#secondsUntil | seconds until last week');

  equal(d.minutesSince('last week'), Math.round(offset / 1000 / 60), 'Date#minutesSince | minutes since last week');
  equal(d.minutesUntil('last week'), Math.round(-offset / 1000 / 60), 'Date#minutesUntil | minutes until last week');
  equal(d.hoursSince('last week'), Math.round(offset / 1000 / 60 / 60), 'Date#hoursSince | hours since last week');
  equal(d.hoursUntil('last week'), Math.round(-offset / 1000 / 60 / 60), 'Date#hoursUntil | hours until last week');
  equal(d.daysSince('last week'), Math.round(offset / 1000 / 60 / 60 / 24), 'Date#daysSince | days since last week');
  equal(d.daysUntil('last week'), Math.round(-offset / 1000 / 60 / 60 / 24), 'Date#daysUntil | days until last week');
  equal(d.weeksSince('last week'), Math.round(offset / 1000 / 60 / 60 / 24 / 7), 'Date#weeksSince | weeks since last week');
  equal(d.weeksUntil('last week'), Math.round(-offset / 1000 / 60 / 60 / 24 / 7), 'Date#weeksUntil | weeks until last week');
  equal(d.monthsSince('last week'), Math.round(offset / 1000 / 60 / 60 / 24 / 30.4375), 'Date#monthsSince | months since last week');
  equal(d.monthsUntil('last week'), Math.round(-offset / 1000 / 60 / 60 / 24 / 30.4375), 'Date#monthsUntil | months until last week');
  equal(d.yearsSince('last week'), Math.round(offset / 1000 / 60 / 60 / 24 / 365.25), 'Date#yearsSince | years since last week');
  equal(d.yearsUntil('last week'), Math.round(-offset / 1000 / 60 / 60 / 24 / 365.25), 'Date#yearsUntil | years until the last day of 2011');



  d = new Date('August 5, 2010 13:45:02');

  dateEqual(new Date(d).beginningOfDay(), new Date(2010, 7, 5), 'Date#beginningOfDay');
  dateEqual(new Date(d).beginningOfWeek(), new Date(2010, 7, 1), 'Date#beginningOfWeek');
  dateEqual(new Date(d).beginningOfMonth(), new Date(2010, 7), 'Date#beginningOfMonth');
  dateEqual(new Date(d).beginningOfYear(), new Date(2010, 0), 'Date#beginningOfYear');

  dateEqual(new Date(d).endOfDay(), new Date(2010, 7, 5, 23, 59, 59, 999), 'Date#endOfDay');
  dateEqual(new Date(d).endOfWeek(), new Date(2010, 7, 7, 23, 59, 59, 999), 'Date#endOfWeek');
  dateEqual(new Date(d).endOfMonth(), new Date(2010, 7, 31, 23, 59, 59, 999), 'Date#endOfMonth');
  dateEqual(new Date(d).endOfYear(), new Date(2010, 11, 31, 23, 59, 59, 999), 'Date#endOfYear');


  d = new Date('January 1, 1979 01:33:42');

  dateEqual(new Date(d).beginningOfDay(), new Date(1979, 0, 1), 'Date#beginningOfDay | January 1, 1979');
  dateEqual(new Date(d).beginningOfWeek(), new Date(1978, 11, 31), 'Date#beginningOfWeek | January 1, 1979');
  dateEqual(new Date(d).beginningOfMonth(), new Date(1979, 0), 'Date#beginningOfMonth | January 1, 1979');
  dateEqual(new Date(d).beginningOfYear(), new Date(1979, 0), 'Date#beginningOfYear | January 1, 1979');

  dateEqual(new Date(d).endOfDay(), new Date(1979, 0, 1, 23, 59, 59, 999), 'Date#endOfDay | January 1, 1979');
  dateEqual(new Date(d).endOfWeek(), new Date(1979, 0, 6, 23, 59, 59, 999), 'Date#endOfWeek | January 1, 1979');
  dateEqual(new Date(d).endOfMonth(), new Date(1979, 0, 31, 23, 59, 59, 999), 'Date#endOfMonth | January 1, 1979');
  dateEqual(new Date(d).endOfYear(), new Date(1979, 11, 31, 23, 59, 59, 999), 'Date#endOfYear | January 1, 1979');


  d = new Date('December 31, 1945 01:33:42');

  dateEqual(new Date(d).beginningOfDay(), new Date(1945, 11, 31), 'Date#beginningOfDay | January 1, 1945');
  dateEqual(new Date(d).beginningOfWeek(), new Date(1945, 11, 30), 'Date#beginningOfWeek | January 1, 1945');
  dateEqual(new Date(d).beginningOfMonth(), new Date(1945, 11), 'Date#beginningOfMonth | January 1, 1945');
  dateEqual(new Date(d).beginningOfYear(), new Date(1945, 0), 'Date#beginningOfYear | January 1, 1945');

  dateEqual(new Date(d).endOfDay(), new Date(1945, 11, 31, 23, 59, 59, 999), 'Date#endOfDay | January 1, 1945');
  dateEqual(new Date(d).endOfWeek(), new Date(1946, 0, 5, 23, 59, 59, 999), 'Date#endOfWeek | January 1, 1945');
  dateEqual(new Date(d).endOfMonth(), new Date(1945, 11, 31, 23, 59, 59, 999), 'Date#endOfMonth | January 1, 1945');
  dateEqual(new Date(d).endOfYear(), new Date(1945, 11, 31, 23, 59, 59, 999), 'Date#endOfYear | January 1, 1945');


  d = new Date('February 29, 2012 22:15:42');

  dateEqual(new Date(d).beginningOfDay(), new Date(2012, 1, 29), 'Date#beginningOfDay | February 29, 2012');
  dateEqual(new Date(d).beginningOfWeek(), new Date(2012, 1, 26), 'Date#beginningOfWeek | February 29, 2012');
  dateEqual(new Date(d).beginningOfMonth(), new Date(2012, 1), 'Date#beginningOfMonth | February 29, 2012');
  dateEqual(new Date(d).beginningOfYear(), new Date(2012, 0), 'Date#beginningOfYear | February 29, 2012');

  dateEqual(new Date(d).endOfDay(), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfDay | February 29, 2012');
  dateEqual(new Date(d).endOfWeek(), new Date(2012, 2, 3, 23, 59, 59, 999), 'Date#endOfWeek | February 29, 2012');
  dateEqual(new Date(d).endOfMonth(), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfMonth | February 29, 2012');
  dateEqual(new Date(d).endOfYear(), new Date(2012, 11, 31, 23, 59, 59, 999), 'Date#endOfYear | February 29, 2012');

  dateEqual(new Date(d).beginningOfDay(true), new Date(2012, 1, 29), 'Date#beginningOfDay | reset if true | February 29, 2012');
  dateEqual(new Date(d).beginningOfWeek(true), new Date(2012, 1, 26), 'Date#beginningOfWeek | reset if true | February 29, 2012');
  dateEqual(new Date(d).beginningOfMonth(true), new Date(2012, 1), 'Date#beginningOfMonth | reset if true | February 29, 2012');
  dateEqual(new Date(d).beginningOfYear(true), new Date(2012, 0), 'Date#beginningOfYear | reset if true | February 29, 2012');

  dateEqual(new Date(d).endOfDay(true), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfDay | reset if true | February 29, 2012');
  dateEqual(new Date(d).endOfWeek(true), new Date(2012, 2, 3, 23, 59, 59, 999), 'Date#endOfWeek | reset if true | February 29, 2012');
  dateEqual(new Date(d).endOfMonth(true), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfMonth | reset if true | February 29, 2012');
  dateEqual(new Date(d).endOfYear(true), new Date(2012, 11, 31, 23, 59, 59, 999), 'Date#endOfYear | reset if true | February 29, 2012');


  d = Date.utc.create('January 1, 2010 02:00:00', 'en').utc(true);

  dateEqual(d.clone().beginningOfDay(), new Date(Date.UTC(2010, 0)), 'Date#beginningOfDay | utc');
  dateEqual(d.clone().beginningOfWeek(), new Date(Date.UTC(2009, 11, 27)), 'Date#beginningOfWeek | utc');
  dateEqual(d.clone().beginningOfMonth(), new Date(Date.UTC(2010, 0)), 'Date#beginningOfMonth | utc');
  dateEqual(d.clone().beginningOfYear(), new Date(Date.UTC(2010, 0)), 'Date#beginningOfYear | utc');

  dateEqual(d.clone().endOfDay(), new Date(Date.UTC(2010, 0, 1, 23, 59, 59, 999)), 'Date#endOfDay | utc');
  dateEqual(d.clone().endOfWeek(), new Date(Date.UTC(2010, 0, 2, 23, 59, 59, 999)), 'Date#endOfWeek | utc');
  dateEqual(d.clone().endOfMonth(), new Date(Date.UTC(2010, 0, 31, 23, 59, 59, 999)), 'Date#endOfMonth | utc');
  dateEqual(d.clone().endOfYear(), new Date(Date.UTC(2010, 11, 31, 23, 59, 59, 999)), 'Date#endOfYear | utc');



  d = new Date('February 29, 2012 22:15:42');


  dateEqual(new Date(d).addMilliseconds(12), new Date(2012, 1, 29, 22, 15, 42, 12), 'Date#addMilliseconds | 12');
  dateEqual(new Date(d).addSeconds(12), new Date(2012, 1, 29, 22, 15, 54), 'Date#addSeconds | 12');
  dateEqual(new Date(d).addMinutes(12), new Date(2012, 1, 29, 22, 27, 42), 'Date#addMinutes | 12');
  dateEqual(new Date(d).addHours(12), new Date(2012, 2, 1, 10, 15, 42), 'Date#addHours | 12');
  dateEqual(new Date(d).addDays(12), new Date(2012, 2, 12, 22, 15, 42), 'Date#addDays | 12');
  dateEqual(new Date(d).addWeeks(12), new Date(2012, 4, 23, 22, 15, 42), 'Date#addWeeks | 12');
  dateEqual(new Date(d).addMonths(12), new Date(2013, 1, 28, 22, 15, 42), 'Date#addMonths | 12');
  dateEqual(new Date(d).addYears(12), new Date(2024, 1, 29, 22, 15, 42), 'Date#addYears | 12');


  dateEqual(new Date(d).addMilliseconds(-12), new Date(2012, 1, 29, 22, 15, 41, 988), 'Date#addMilliseconds | negative | 12');
  dateEqual(new Date(d).addSeconds(-12), new Date(2012, 1, 29, 22, 15, 30), 'Date#addSeconds | negative | 12');
  dateEqual(new Date(d).addMinutes(-12), new Date(2012, 1, 29, 22, 3, 42), 'Date#addMinutes | negative | 12');
  dateEqual(new Date(d).addHours(-12), new Date(2012, 1, 29, 10, 15, 42), 'Date#addHours | negative | 12');
  dateEqual(new Date(d).addDays(-12), new Date(2012, 1, 17, 22, 15, 42), 'Date#addDays | negative | 12');
  dateEqual(new Date(d).addWeeks(-12), new Date(2011, 11, 7, 22, 15, 42), 'Date#addWeeks | negative | 12');
  dateEqual(new Date(d).addMonths(-12), new Date(2011, 1, 28, 22, 15, 42), 'Date#addMonths | negative | 12');
  dateEqual(new Date(d).addYears(-12), new Date(2000, 1, 29, 22, 15, 42), 'Date#addYears | negative | 12');


  dateEqual(Date.utc.create('February 29, 2012 22:15:42', 'en'), new Date(Date.UTC(2012, 1, 29, 22, 15, 42)), 'Date#create | utc');
  dateEqual(Date.utc.create('2012-05-31', 'en'), new Date(Date.UTC(2012, 4, 31)), 'Date#create | utc | 2012-05-31');
  dateEqual(Date.utc.create('1998-02-23 11:54:32', 'en'), new Date(Date.UTC(1998,1,23,11,54,32)), 'Date#create | utc | enumerated params');
  dateEqual(Date.utc.create({ year: 1998, month: 1, day: 23, hour: 11 }, 'en'), new Date(Date.UTC(1998,1,23,11)), 'Date#create | object');
  dateEqual(Date.utc.create('08-25-1978 11:42:32.488am', 'en'), new Date(Date.UTC(1978, 7, 25, 11, 42, 32, 488)), 'Date#create | full with ms');
  dateEqual(Date.utc.create('1994-11-05T13:15:30Z', 'en'), new Date(Date.UTC(1994, 10, 5, 13, 15, 30)), 'Date#create | utc | "Z" is still utc');
  dateEqual(Date.utc.create('two days ago', 'en'), Date.create('two days ago'), 'Date#create | utc | relative dates are not UTC');



  d = new Date('February 29, 2012 22:15:42');

  var yearZero = new Date(2000, 0);
  yearZero.setFullYear(0);

  dateEqual(d.clone().reset(),               new Date(2012, 1, 29), 'Date#resetTime | Clears time');

  dateEqual(d.clone().reset('years'),        yearZero, 'Date#reset | years');
  dateEqual(d.clone().reset('months'),       new Date(2012, 0), 'Date#reset | months');
  dateEqual(d.clone().reset('weeks'),        new Date(2012, 0, 4), 'Date#reset | weeks | ISO8601');
  dateEqual(d.clone().reset('days'),         new Date(2012, 1, 1), 'Date#reset | days');
  dateEqual(d.clone().reset('hours'),        new Date(2012, 1, 29), 'Date#reset | hours');
  dateEqual(d.clone().reset('minutes'),      new Date(2012, 1, 29, 22), 'Date#reset | minutes');
  dateEqual(d.clone().reset('seconds'),      new Date(2012, 1, 29, 22, 15), 'Date#reset | seconds');
  dateEqual(d.clone().reset('milliseconds'), new Date(2012, 1, 29, 22, 15, 42), 'Date#reset | milliseconds');

  dateEqual(d.clone().reset('year'),        yearZero, 'Date#reset | year');
  dateEqual(d.clone().reset('month'),       new Date(2012, 0), 'Date#reset | month');
  dateEqual(d.clone().reset('week'),        new Date(2012, 0, 4), 'Date#reset | weeks | ISO8601');
  dateEqual(d.clone().reset('day'),         new Date(2012, 1, 1), 'Date#reset | day');
  dateEqual(d.clone().reset('hour'),        new Date(2012, 1, 29), 'Date#reset | hour');
  dateEqual(d.clone().reset('minute'),      new Date(2012, 1, 29, 22), 'Date#reset | minute');
  dateEqual(d.clone().reset('second'),      new Date(2012, 1, 29, 22, 15), 'Date#reset | second');
  dateEqual(d.clone().reset('millisecond'), new Date(2012, 1, 29, 22, 15, 42), 'Date#reset | millisecond');

  dateEqual(d.clone().reset('date'),         new Date(2012, 1, 1), 'Date#reset | date');
  dateEqual(d.clone().reset('flegh'), new Date(2012, 1, 29, 22, 15, 42), 'Date#reset | an unknown string will do nothing');

  dateEqual(d.clone().addDays(5, true), new Date(2012, 2, 5), 'Date#addDays | can also reset the time');


  equal(now.isYesterday(), false, 'Date#isYesterday');
  equal(now.isToday(), true, 'Date#isToday');
  equal(now.isTomorrow(), false, 'Date#isTomorrow');
  equal(now.isWeekday(), now.getDay() !== 0 && now.getDay() !== 6, 'Date#isWeekday');
  equal(now.isWeekend(), now.getDay() === 0 || now.getDay() === 6, 'Date#isWeekend');
  equal(now.isFuture(), false, 'Date#isFuture');
  equal(now.isPast(), true, 'Date#isPast');


  d = new Date('February 29, 2008 22:15:42');

  equal(d.isYesterday(), false, 'Date#isYesterday | February 29, 2008');
  equal(d.isToday(), false, 'Date#isToday | February 29, 2008');
  equal(d.isTomorrow(), false, 'Date#isTomorrow | February 29, 2008');
  equal(d.isWeekday(), true, 'Date#isWeekday | February 29, 2008');
  equal(d.isWeekend(), false, 'Date#isWeekend | February 29, 2008');
  equal(d.isFuture(), false, 'Date#isFuture | February 29, 2008');
  equal(d.isPast(), true, 'Date#isPast | February 29, 2008');


  d.setFullYear(thisYear + 2);

  equal(d.isYesterday(), false, 'Date#isYesterday | 2 years from now');
  equal(d.isToday(), false, 'Date#isToday | 2 years from now');
  equal(d.isTomorrow(), false, 'Date#isTomorrow | 2 years from now');
  equal(d.isFuture(), true, 'Date#isFuture | 2 years from now');
  equal(d.isPast(), false, 'Date#isPast | 2 years from now');




  equal(new Date().isLastWeek(), false, 'Date#isLastWeek | now');
  equal(new Date().isThisWeek(), true, 'Date#isThisWeek | now');
  equal(new Date().isNextWeek(), false, 'Date#isNextWeek | now');
  equal(new Date().isLastMonth(), false, 'Date#isLastMonth | now');
  equal(new Date().isThisMonth(), true, 'Date#isThisMonth | now');
  equal(new Date().isNextMonth(), false, 'Date#isNextMonth | now');
  equal(new Date().isLastYear(), false, 'Date#isLastYear | now');
  equal(new Date().isThisYear(), true, 'Date#isThisYear | now');
  equal(new Date().isNextYear(), false, 'Date#isNextYear | now');

  equal(getRelativeDate(null, null, -7).isLastWeek(), true, 'Date#isLastWeek | last week');
  equal(getRelativeDate(null, null, -7).isThisWeek(), false, 'Date#isThisWeek | last week');
  equal(getRelativeDate(null, null, -7).isNextWeek(), false, 'Date#isNextWeek | last week');

  equal(getRelativeDate(null, null, 7).isLastWeek(), false, 'Date#isLastWeek | next week');
  equal(getRelativeDate(null, null, 7).isThisWeek(), false, 'Date#isThisWeek | next week');
  equal(getRelativeDate(null, null, 7).isNextWeek(), true, 'Date#isNextWeek | next week');

  equal(getDateWithWeekdayAndOffset(0).isLastWeek(), false, 'Date#isLastWeek | this week sunday is last week');
  equal(getDateWithWeekdayAndOffset(0).isThisWeek(), true, 'Date#isThisWeek | this week sunday is this week');
  equal(getDateWithWeekdayAndOffset(0).isNextWeek(), false, 'Date#isNextWeek | this week sunday is next week');

  equal(getDateWithWeekdayAndOffset(5).isLastWeek(), false, 'Date#isLastWeek | friday is last week');
  equal(getDateWithWeekdayAndOffset(5).isThisWeek(), true, 'Date#isThisWeek | friday is this week');
  equal(getDateWithWeekdayAndOffset(5).isNextWeek(), false, 'Date#isNextWeek | friday is next week');

  equal(getDateWithWeekdayAndOffset(6).isLastWeek(), false, 'Date#isLastWeek | satuday is last week');
  equal(getDateWithWeekdayAndOffset(6).isThisWeek(), true, 'Date#isThisWeek | satuday is this week');
  equal(getDateWithWeekdayAndOffset(6).isNextWeek(), false, 'Date#isNextWeek | satuday is next week');

  equal(Date.create('last sunday').isLastWeek(), true, 'Date#isLastWeek | last sunday');
  equal(Date.create('last sunday').isThisWeek(), false, 'Date#isThisWeek | last sunday');
  equal(Date.create('last sunday').isNextWeek(), false, 'Date#isNextWeek | last sunday');

  equal(Date.create('next sunday').isLastWeek(), false, 'Date#isLastWeek | next sunday');
  equal(Date.create('next sunday').isThisWeek(), false, 'Date#isThisWeek | next sunday');
  equal(Date.create('next sunday').isNextWeek(), true, 'Date#isNextWeek | next sunday');

  equal(Date.create('last monday').isLastWeek(), true, 'Date#isLastWeek | last monday');
  equal(Date.create('last monday').isThisWeek(), false, 'Date#isThisWeek | last monday');
  equal(Date.create('last monday').isNextWeek(), false, 'Date#isNextWeek | last monday');

  equal(Date.create('next monday').isLastWeek(), false, 'Date#isLastWeek | next monday');
  equal(Date.create('next monday').isThisWeek(), false, 'Date#isThisWeek | next monday');
  equal(Date.create('next monday').isNextWeek(), true, 'Date#isNextWeek | next monday');

  equal(Date.create('last friday').isLastWeek(), true, 'Date#isLastWeek | last friday');
  equal(Date.create('last friday').isThisWeek(), false, 'Date#isThisWeek | last friday');
  equal(Date.create('last friday').isNextWeek(), false, 'Date#isNextWeek | last friday');

  equal(Date.create('next friday').isLastWeek(), false, 'Date#isLastWeek | next friday');
  equal(Date.create('next friday').isThisWeek(), false, 'Date#isThisWeek | next friday');
  equal(Date.create('next friday').isNextWeek(), true, 'Date#isNextWeek | next friday');

  equal(Date.create('last saturday').isLastWeek(), true, 'Date#isLastWeek | last saturday');
  equal(Date.create('last saturday').isThisWeek(), false, 'Date#isThisWeek | last saturday');
  equal(Date.create('last saturday').isNextWeek(), false, 'Date#isNextWeek | last saturday');

  equal(Date.create('next saturday').isLastWeek(), false, 'Date#isLastWeek | next saturday');
  equal(Date.create('next saturday').isThisWeek(), false, 'Date#isThisWeek | next saturday');
  equal(Date.create('next saturday').isNextWeek(), true, 'Date#isNextWeek | next saturday');

  equal(Date.create('the beginning of the week').isLastWeek(), false, 'Date#isLastWeek | the beginning of the week');
  equal(Date.create('the beginning of the week').isThisWeek(), true, 'Date#isThisWeek | the beginning of the week');
  equal(Date.create('the beginning of the week').isNextWeek(), false, 'Date#isNextWeek | the beginning of the week');

  equal(Date.create('the beginning of the week').addMinutes(-1).isLastWeek(), true, 'Date#isLastWeek | the beginning of the week - 1 minute');
  equal(Date.create('the beginning of the week').addMinutes(-1).isThisWeek(), false, 'Date#isThisWeek | the beginning of the week - 1 minute');
  equal(Date.create('the beginning of the week').addMinutes(-1).isNextWeek(), false, 'Date#isNextWeek | the beginning of the week - 1 minute');

  equal(Date.create('the end of the week').isLastWeek(), false, 'Date#isLastWeek | the end of the week');
  equal(Date.create('the end of the week').isThisWeek(), true, 'Date#isThisWeek | the end of the week');
  equal(Date.create('the end of the week').isNextWeek(), false, 'Date#isNextWeek | the end of the week');

  equal(Date.create('the end of the week').addMinutes(1).isLastWeek(), false, 'Date#isLastWeek | the end of the week + 1 minute');
  equal(Date.create('the end of the week').addMinutes(1).isThisWeek(), false, 'Date#isThisWeek | the end of the week + 1 minute');
  equal(Date.create('the end of the week').addMinutes(1).isNextWeek(), true, 'Date#isNextWeek | the end of the week + 1 minute');


  equal(Date.create('the beginning of last week').isLastWeek(), true, 'Date#isLastWeek | the beginning of last week');
  equal(Date.create('the beginning of last week').isThisWeek(), false, 'Date#isThisWeek | the beginning of last week');
  equal(Date.create('the beginning of last week').isNextWeek(), false, 'Date#isNextWeek | the beginning of last week');

  equal(Date.create('the beginning of last week').addMinutes(-1).isLastWeek(), false, 'Date#isLastWeek | the beginning of last week - 1 minute');
  equal(Date.create('the beginning of last week').addMinutes(-1).isThisWeek(), false, 'Date#isThisWeek | the beginning of last week - 1 minute');
  equal(Date.create('the beginning of last week').addMinutes(-1).isNextWeek(), false, 'Date#isNextWeek | the beginning of last week - 1 minute');

  equal(Date.create('the end of next week').isLastWeek(), false, 'Date#isLastWeek | the end of next week');
  equal(Date.create('the end of next week').isThisWeek(), false, 'Date#isThisWeek | the end of next week');
  equal(Date.create('the end of next week').isNextWeek(), true, 'Date#isNextWeek | the end of next week');

  equal(Date.create('the end of next week').addMinutes(1).isLastWeek(), false, 'Date#isLastWeek | the end of next week + 1 minute');
  equal(Date.create('the end of next week').addMinutes(1).isThisWeek(), false, 'Date#isThisWeek | the end of next week + 1 minute');
  equal(Date.create('the end of next week').addMinutes(1).isNextWeek(), false, 'Date#isNextWeek | the end of next week + 1 minute');

  equal(Date.create('the end of last week').isLastWeek(), true, 'Date#isLastWeek | the end of last week');
  equal(Date.create('the end of last week').isThisWeek(), false, 'Date#isThisWeek | the end of last week');
  equal(Date.create('the end of last week').isNextWeek(), false, 'Date#isNextWeek | the end of last week');

  equal(Date.create('the end of last week').addMinutes(1).isLastWeek(), false, 'Date#isLastWeek | the end of last week + 1 minute');
  equal(Date.create('the end of last week').addMinutes(1).isThisWeek(), true, 'Date#isThisWeek | the end of last week + 1 minute');
  equal(Date.create('the end of last week').addMinutes(1).isNextWeek(), false, 'Date#isNextWeek | the end of last week + 1 minute');

  equal(Date.create('the beginning of next week').isLastWeek(), false, 'Date#isLastWeek | the beginning of next week');
  equal(Date.create('the beginning of next week').isThisWeek(), false, 'Date#isThisWeek | the beginning of next week');
  equal(Date.create('the beginning of next week').isNextWeek(), true, 'Date#isNextWeek | the beginning of next week');

  equal(Date.create('the beginning of next week').addMinutes(-1).isLastWeek(), false, 'Date#isLastWeek | the beginning of next week - 1 minute');
  equal(Date.create('the beginning of next week').addMinutes(-1).isThisWeek(), true, 'Date#isThisWeek | the beginning of next week - 1 minute');
  equal(Date.create('the beginning of next week').addMinutes(-1).isNextWeek(), false, 'Date#isNextWeek | the beginning of next week - 1 minute');




  equal(new Date(2001, 11, 28).isSunday(), false, 'Date#isSunday');
  equal(new Date(2001, 11, 28).isMonday(), false, 'Date#isMonday');
  equal(new Date(2001, 11, 28).isTuesday(), false, 'Date#isTuesday');
  equal(new Date(2001, 11, 28).isWednesday(), false, 'Date#isWednesday');
  equal(new Date(2001, 11, 28).isThursday(), false, 'Date#isThursday');
  equal(new Date(2001, 11, 28).isFriday(), true, 'Date#isFriday');
  equal(new Date(2001, 11, 28).isSaturday(), false, 'Date#isSaturday');

  equal(new Date(2001, 11, 28).isJanuary(), false, 'Date#isJanuary');
  equal(new Date(2001, 11, 28).isFebruary(), false, 'Date#isFebruary');
  equal(new Date(2001, 11, 28).isMarch(), false, 'Date#isMarch');
  equal(new Date(2001, 11, 28).isApril(), false, 'Date#isApril');
  equal(new Date(2001, 11, 28).isMay(), false, 'Date#isMay');
  equal(new Date(2001, 11, 28).isJune(), false, 'Date#isJune');
  equal(new Date(2001, 11, 28).isJuly(), false, 'Date#isJuly');
  equal(new Date(2001, 11, 28).isAugust(), false, 'Date#isAugust');
  equal(new Date(2001, 11, 28).isSeptember(), false, 'Date#isSeptember');
  equal(new Date(2001, 11, 28).isOctober(), false, 'Date#isOctober');
  equal(new Date(2001, 11, 28).isNovember(), false, 'Date#isNovember');
  equal(new Date(2001, 11, 28).isDecember(), true, 'Date#isDecember');




  equal(getRelativeDate(null, -1).isLastWeek(), false, 'Date#isLastWeek | last month');
  equal(getRelativeDate(null, -1).isThisWeek(), false, 'Date#isThisWeek | last month');
  equal(getRelativeDate(null, -1).isNextWeek(), false, 'Date#isNextWeek | last month');
  equal(getRelativeDate(null, -1).isLastMonth(), true, 'Date#isLastMonth | last month');
  equal(getRelativeDate(null, -1).isThisMonth(), false, 'Date#isThisMonth | last month');
  equal(getRelativeDate(null, -1).isNextMonth(), false, 'Date#isNextMonth | last month');

  equal(getRelativeDate(null, 1).isLastWeek(), false, 'Date#isLastWeek | next month');
  equal(getRelativeDate(null, 1).isThisWeek(), false, 'Date#isThisWeek | next month');
  equal(getRelativeDate(null, 1).isNextWeek(), false, 'Date#isNextWeek | next month');
  equal(getRelativeDate(null, 1).isLastMonth(), false, 'Date#isLastMonth | next month');
  equal(getRelativeDate(null, 1).isThisMonth(), false, 'Date#isThisMonth | next month');
  equal(getRelativeDate(null, 1).isNextMonth(), true, 'Date#isNextMonth | next month');


  equal(getRelativeDate(-1).isLastWeek(), false, 'Date#isLastWeek | last year');
  equal(getRelativeDate(-1).isThisWeek(), false, 'Date#isThisWeek | last year');
  equal(getRelativeDate(-1).isNextWeek(), false, 'Date#isNextWeek | last year');
  equal(getRelativeDate(-1).isLastMonth(), false, 'Date#isLastMonth | last year');
  equal(getRelativeDate(-1).isThisMonth(), false, 'Date#isThisMonth | last year');
  equal(getRelativeDate(-1).isNextMonth(), false, 'Date#isNextMonth | last year');
  equal(getRelativeDate(-1).isLastYear(), true, 'Date#isLastYear | last year');
  equal(getRelativeDate(-1).isThisYear(), false, 'Date#isThisYear | last year');
  equal(getRelativeDate(-1).isNextYear(), false, 'Date#isNextYear | last year');

  equal(getRelativeDate(1).isLastWeek(), false, 'Date#isLastWeek | next year');
  equal(getRelativeDate(1).isThisWeek(), false, 'Date#isThisWeek | next year');
  equal(getRelativeDate(1).isNextWeek(), false, 'Date#isNextWeek | next year');
  equal(getRelativeDate(1).isLastMonth(), false, 'Date#isLastMonth | next year');
  equal(getRelativeDate(1).isThisMonth(), false, 'Date#isThisMonth | next year');
  equal(getRelativeDate(1).isNextMonth(), false, 'Date#isNextMonth | next year');
  equal(getRelativeDate(1).isLastYear(), false, 'Date#isLastYear | next year');
  equal(getRelativeDate(1).isThisYear(), false, 'Date#isThisYear | next year');
  equal(getRelativeDate(1).isNextYear(), true, 'Date#isNextYear | next year');



  equal(new Date(2001,1,23).isAfter(new Date(2000,1,23)), true, 'Date#isAfter | January 23, 2000');
  equal(new Date(2001,1,23).isAfter(new Date(2002,1,23)), false, 'Date#isAfter | January 23, 2002');

  equal(new Date(1999,0).isAfter(new Date(1998)), true, 'Date#isAfter | 1999');
  equal(new Date(1998,2).isAfter(new Date(1998,1)), true, 'Date#isAfter | March, 1998');
  equal(new Date(1998,1,24).isAfter(new Date(1998,1,23)), true, 'Date#isAfter | February 24, 1998');
  equal(new Date(1998,1,23,12).isAfter(new Date(1998,1,23,11)), true, 'Date#isAfter | February 23, 1998 12pm');
  equal(new Date(1998,1,23,11,55).isAfter(new Date(1998,1,23,11,54)), true, 'Date#isAfter | February 23, 1998 11:55am');
  equal(new Date(1998,1,23,11,54,33).isAfter(new Date(1998,1,23,11,54,32)), true, 'Date#isAfter | February 23, 1998 11:54:33am');
  equal(new Date(1998,1,23,11,54,32,455).isAfter(new Date(1998,1,23,11,54,32,454)), true, 'Date#isAfter | February 23, 1998 11:54:32.455am');

  equal(new Date(1999,1).isAfter({ year: 1998 }), true, 'Date#isAfter | object | 1999');
  equal(new Date(1998,2).isAfter({ year: 1998, month: 1 }), true, 'Date#isAfter | object | March, 1998');
  equal(new Date(1998,1,24).isAfter({ year: 1998, month: 1, day: 23 }), true, 'Date#isAfter | object | February 24, 1998');
  equal(new Date(1998,1,23,12).isAfter({ year: 1998, month: 1, day: 23, hour: 11 }), true, 'Date#isAfter | object | February 23, 1998 12pm');
  equal(new Date(1998,1,23,11,55).isAfter({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }), true, 'Date#isAfter | object | February 23, 1998 11:55am');
  equal(new Date(1998,1,23,11,54,33).isAfter({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }), true, 'Date#isAfter | object | February 23, 1998 11:54:33am');
  equal(new Date(1998,1,23,11,54,32,455).isAfter({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }), true, 'Date#isAfter | object | February 23, 1998 11:54:32.455am');

  equal(new Date(1999,1).isAfter('1998'), true, 'Date#isAfter | string | 1998');
  equal(new Date(1998,2).isAfter('February, 1998'), true, 'Date#isAfter | string | February, 1998');
  equal(new Date(1998,1,24).isAfter('February 23, 1998'), true, 'Date#isAfter | string | February 23, 1998');
  equal(new Date(1998,1,23,12).isAfter('February 23, 1998 11am'), true, 'Date#isAfter | string | February 23, 1998 11pm');
  equal(new Date(1998,1,23,11,55).isAfter('February 23, 1998 11:54am'), true, 'Date#isAfter | string | February 23, 1998 11:54am');
  equal(new Date(1998,1,23,11,54,33).isAfter('February 23, 1998 11:54:32am'), true, 'Date#isAfter | string | February 23, 1998 11:54:32am');
  equal(new Date(1998,1,23,11,54,32,455).isAfter('February 23, 1998 11:54:32.454am'), true, 'Date#isAfter | string | February 23, 1998 11:54:32.454am');

  equal(new Date(1999,5).isAfter('1999'), true, 'Date#isAfter | June 1999 is after implied January 1999');
  equal(getRelativeDate(1).isAfter('tomorrow'), true, 'Date#isAfter | relative | next year');
  equal(getRelativeDate(null, 1).isAfter('tomorrow'), true, 'Date#isAfter | relative | next month');
  equal(getRelativeDate(null, null, 1).isAfter('tomorrow'), true, 'Date#isAfter | relative | tomorrow');

  equal(getDateWithWeekdayAndOffset(0).isAfter('monday'), false, 'Date#isAfter | relative | sunday');
  equal(getDateWithWeekdayAndOffset(2).isAfter('monday'), true, 'Date#isAfter | relative | tuesday');
  equal(getDateWithWeekdayAndOffset(0,7).isAfter('monday'), true, 'Date#isAfter | relative | next week sunday');
  equal(getDateWithWeekdayAndOffset(0,-7).isAfter('monday'), false, 'Date#isAfter | relative | last week sunday');
  equal(getDateWithWeekdayAndOffset(0).isAfter('the beginning of this week'), false, 'Date#isAfter | relative | the beginning of this week');
  equal(getDateWithWeekdayAndOffset(0).isAfter('the beginning of last week'), true, 'Date#isAfter | relative | the beginning of last week');
  equal(getDateWithWeekdayAndOffset(0).isAfter('the end of this week'), false, 'Date#isAfter | relative | the end of this week');

  equal(new Date(2001,1,23).isAfter(new Date(2000,1,24), 24 * 60 * 60 * 1000), true, 'Date#isAfter | buffers work');
  equal(new Date(1999,1).isAfter({ year: 1999 }), true, 'Date#isAfter | February 1999 is after implied January 1999');
  equal(new Date(1998,10).isAfter({ year: 1999 }, 90 * 24 * 60 * 60 * 1000), true, 'Date#isAfter | November 1998 is after implied January 1999 with 90 days of margin');



  equal(new Date(2001,1,23).isBefore(new Date(2000,1,23)), false, 'Date#isBefore | January 23, 2000');
  equal(new Date(2001,1,23).isBefore(new Date(2002,1,23)), true, 'Date#isBefore | January 23, 2002');

  equal(new Date(1999,0).isBefore(new Date(1998)), false, 'Date#isBefore | 1999');
  equal(new Date(1998,2).isBefore(new Date(1998,1)), false, 'Date#isBefore | March, 1998');
  equal(new Date(1998,1,24).isBefore(new Date(1998,1,23)), false, 'Date#isBefore | February 24, 1998');
  equal(new Date(1998,1,23,12).isBefore(new Date(1998,1,23,11)), false, 'Date#isBefore | February 23, 1998 12pm');
  equal(new Date(1998,1,23,11,55).isBefore(new Date(1998,1,23,11,54)), false, 'Date#isBefore | February 23, 1998 11:55am');
  equal(new Date(1998,1,23,11,54,33).isBefore(new Date(1998,1,23,11,54,34)), true, 'Date#isBefore | February 23, 1998 11:54:34am');
  equal(new Date(1998,1,23,11,54,32,455).isBefore(new Date(1998,1,23,11,54,32,454)), false, 'Date#isBefore | February 23, 1998 11:54:32.455am');

  equal(new Date(1999,1).isBefore({ year: 1998 }), false, 'Date#isBefore | object | 1999');
  equal(new Date(1998,2).isBefore({ year: 1998, month: 1 }), false, 'Date#isBefore | object | March, 1998');
  equal(new Date(1998,1,24).isBefore({ year: 1998, month: 1, day: 23 }), false, 'Date#isBefore | object | February 24, 1998');
  equal(new Date(1998,1,23,12).isBefore({ year: 1998, month: 1, day: 23, hour: 11 }), false, 'Date#isBefore | object | February 23, 1998 12pm');
  equal(new Date(1998,1,23,11,55).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }), false, 'Date#isBefore | object | February 23, 1998 11:55am');
  equal(new Date(1998,1,23,11,54,33).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }), false, 'Date#isBefore | object | February 23, 1998 11:54:33am');
  equal(new Date(1998,1,23,11,54,32,455).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }), false, 'Date#isBefore | object | February 23, 1998 11:54:32.455am');

  equal(new Date(1997,11,31,23,59,59,999).isBefore({ year: 1998 }), true, 'Date#isBefore | object | 1999');
  equal(new Date(1998,0).isBefore({ year: 1998, month: 1 }), true, 'Date#isBefore | object | March, 1998');
  equal(new Date(1998,1,22).isBefore({ year: 1998, month: 1, day: 23 }), true, 'Date#isBefore | object | February 24, 1998');
  equal(new Date(1998,1,23,10).isBefore({ year: 1998, month: 1, day: 23, hour: 11 }), true, 'Date#isBefore | object | February 23, 1998 12pm');
  equal(new Date(1998,1,23,11,53).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }), true, 'Date#isBefore | object | February 23, 1998 11:55am');
  equal(new Date(1998,1,23,11,54,31).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }), true, 'Date#isBefore | object | February 23, 1998 11:54:33am');
  equal(new Date(1998,1,23,11,54,32,453).isBefore({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }), true, 'Date#isBefore | object | February 23, 1998 11:54:32.455am');

  equal(new Date(1999,1).isBefore('1998'), false, 'Date#isBefore | string | 1998');
  equal(new Date(1998,2).isBefore('February, 1998'), false, 'Date#isBefore | string | February, 1998');
  equal(new Date(1998,1,24).isBefore('February 23, 1998'), false, 'Date#isBefore | string | February 23, 1998');
  equal(new Date(1998,1,23,12).isBefore('February 23, 1998 11am'), false, 'Date#isBefore | string | February 23, 1998 11pm');
  equal(new Date(1998,1,23,11,55).isBefore('February 23, 1998 11:54am'), false, 'Date#isBefore | string | February 23, 1998 11:54am');
  equal(new Date(1998,1,23,11,54,33).isBefore('February 23, 1998 11:54:32am'), false, 'Date#isBefore | string | February 23, 1998 11:54:32am');
  equal(new Date(1998,1,23,11,54,32,455).isBefore('February 23, 1998 11:54:32.454am'), false, 'Date#isBefore | string | February 23, 1998 11:54:32.454am');

  equal(new Date(1999,5).isBefore('1999'), false, 'Date#isBefore | June 1999 is not after 1999 in general');
  equal(getRelativeDate(1).isBefore('tomorrow'), false, 'Date#isBefore | relative | next year');
  equal(getRelativeDate(null, 1).isBefore('tomorrow'), false, 'Date#isBefore | relative | next month');
  equal(getRelativeDate(null, null, 1).isBefore('tomorrow'), false, 'Date#isBefore | relative | tomorrow');

  equal(getDateWithWeekdayAndOffset(0).isBefore('monday'), true, 'Date#isBefore | relative | sunday');
  equal(getDateWithWeekdayAndOffset(2).isBefore('monday'), false, 'Date#isBefore | relative | tuesday');
  equal(getDateWithWeekdayAndOffset(0,7).isBefore('monday'), false, 'Date#isBefore | relative | next week sunday');
  equal(getDateWithWeekdayAndOffset(0,-7).isBefore('monday'), true, 'Date#isBefore | relative | last week sunday');
  equal(getDateWithWeekdayAndOffset(0).isBefore('the beginning of this week'), false, 'Date#isBefore | relative | the beginning of this week');
  equal(getDateWithWeekdayAndOffset(0).isBefore('the beginning of last week'), false, 'Date#isBefore | relative | the beginning of last week');
  equal(getDateWithWeekdayAndOffset(0).isBefore('the end of this week'), true, 'Date#isBefore | relative | the end of this week');

  equal(new Date(2001,1,25).isBefore(new Date(2001,1,24), 48 * 60 * 60 * 1000), true, 'Date#isBefore | buffers work');






  equal(new Date(2001,1,23).isBetween(new Date(2000,1,23), new Date(2002,1,23)), true, 'Date#isBetween | January 23, 2001 is between January 23, 2000 and January 23, 2002');
  equal(new Date(2001,1,23).isBetween(new Date(2002,1,23), new Date(2000,1,23)), true, 'Date#isBetween | January 23, 2001 is between January 23, 2002 and January 23, 2000');
  equal(new Date(1999,1,23).isBetween(new Date(2002,1,23), new Date(2000,1,23)), false, 'Date#isBetween | January 23, 1999 is between January 23, 2002 and January 23, 2000');
  equal(new Date(2003,1,23).isBetween(new Date(2002,1,23), new Date(2000,1,23)), false, 'Date#isBetween | January 23, 2003 is between January 23, 2002 and January 23, 2000');

  equal(new Date(1998,2).isBetween(new Date(1998,1), new Date(1998, 3)), true, 'Date#isBetween | February, 1998 - April, 1998');
  equal(new Date(1998,2).isBetween(new Date(1998,1), new Date(1998, 0)), false, 'Date#isBetween | February, 1998 - January, 1998');
  equal(new Date(1998,2).isBetween(new Date(1998,5), new Date(1998, 3)), false, 'Date#isBetween | June, 1998 - April, 1998');

  equal(new Date(1998,1,23,11,54,32,455).isBetween(new Date(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,456)), true, 'Date#isBetween | February 23, 1998 11:54:32.454am - February 23, 1998 11:54:32:456am');
  equal(new Date(1998,1,23,11,54,32,455).isBetween(new Date(1998,1,23,11,54,32,456), new Date(1998,1,23,11,54,32,454)), true, 'Date#isBetween | February 23, 1998 11:54:32.456am - February 23, 1998 11:54:32:454am');
  equal(new Date(1998,1,23,11,54,32,455).isBetween(new Date(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,452)), false, 'Date#isBetween | February 23, 1998 11:54:32.454am - February 23, 1998 11:54:32:452am');
  equal(new Date(1998,1,23,11,54,32,455).isBetween(new Date(1998,1,23,11,54,32,456), new Date(1998,1,23,11,54,32,458)), false, 'Date#isBetween | February 23, 1998 11:54:32.456am - February 23, 1998 11:54:32:458am');

  equal(new Date(1998,1).isBetween({ year: 1998 }, { year: 1999 }), true, 'Date#isBetween | object | Feb 1998 is between 1998 - 1999');
  equal(new Date(1999,1).isBetween({ year: 1998 }, { year: 1999 }), false, 'Date#isBetween | object | Feb 1999 is between 1998 - 1999');
  equal(new Date(1999,1).isBetween({ year: 1998 }, { year: 1997 }), false, 'Date#isBetween | object | Feb 1999 is between 1998 - 1997');
  equal(new Date(1998,2).isBetween({ year: 1998, month: 1 }, { year: 1998, month: 3 }), true, 'Date#isBetween | object | March, 1998 is between February, 1998 and April, 1998');
  equal(new Date(1998,2).isBetween({ year: 1998, month: 0 }, { year: 1998, month: 1 }), false, 'Date#isBetween | object | March, 1998 is between January, 1998 and February, 1998');

  equal(new Date(1998,1).isBetween('1998', '1999'), true, 'Date#isBetween | string | Feb 1998 is between 1998 - 1999');
  equal(new Date(1999,1).isBetween('1998', '1999'), false, 'Date#isBetween | string | Feb 1999 is between 1998 - 1999');
  equal(new Date(1999,1).isBetween('1998', '1997'), false, 'Date#isBetween | string | Feb 1998 is between 1998 - 1997');
  equal(new Date(1998,2).isBetween('February, 1998', 'April, 1998'), true, 'Date#isBetween | string | March, 1998 is between February, 1998 and April, 1998');
  equal(new Date(1998,2).isBetween('January, 1998', 'February, 1998'), false, 'Date#isBetween | string | March, 1998 is not between January, 1998 and February, 1998');

  equal(new Date(1999,5).isBetween('1998','1999'), false, 'Date#isBetween | Ambiguous periods are hard coded to the ms, there is no "implied specificity" as with Date#is');
  equal(new Date().isBetween('yesterday','tomorrow'), true, 'Date#isBetween | relative | now is between today and tomorrow');
  equal(getRelativeDate(1).isBetween('yesterday','tomorrow'), false, 'Date#isBetween | relative | last year is between today and tomorrow');
  equal(getRelativeDate(null, 1).isBetween('yesterday','tomorrow'), false, 'Date#isBetween | relative | last month is between today and tomorrow');
  equal(getRelativeDate(null, null, 0).isBetween('today','tomorrow'), true, 'Date#isBetween | relative | right now is between today and tomorrow');
  equal(getRelativeDate(null, null, 1).isBetween('today','tomorrow'), false, 'Date#isBetween | relative | tomorrow is between today and tomorrow');

  equal(getDateWithWeekdayAndOffset(0).isBetween('monday', 'friday'), false, 'Date#isBetween | relative | sunday is between monday and friday');
  equal(getDateWithWeekdayAndOffset(2).isBetween('monday', 'friday'), true, 'Date#isBetween | relative | tuesday is between monday and friday');
  equal(getDateWithWeekdayAndOffset(0,7).isBetween('monday', 'friday'), false, 'Date#isBetween | relative | next week sunday is between monday and friday');
  equal(getDateWithWeekdayAndOffset(0,-7).isBetween('monday', 'friday'), false, 'Date#isBetween | relative | last week sunday is between monday and friday');
  equal(getDateWithWeekdayAndOffset(0).isBetween('the beginning of this week','the beginning of last week'), false, 'Date#isBetween | relative | sunday is between the beginning of this week and the beginning of last week');
  equal(getDateWithWeekdayAndOffset(0).isBetween('the beginning of this week','the beginning of next week'), false, 'Date#isBetween | relative | sunday is between the beginning of this week and the beginning of next week');
  equal(getDateWithWeekdayAndOffset(0).isBetween('the beginning of last week','the beginning of next week'), true, 'Date#isBetween | relative | sunday is between the beginning of last week and the beginning of next week');
  equal(getDateWithWeekdayAndOffset(0).isBetween('the beginning of last week','the end of this week'), true, 'Date#isBetween | relative | sunday is between the beginning of last week and the end of this week');


  equal(Date.create('yesterday').isBetween('yesterday', 'today'), false, 'Date#isBetween | today is between yesterday and today');
  equal(Date.create('yesterday').isBetween('yesterday', 'today', 5), true, 'Date#isBetween | today is between yesterday and today with a 5ms margin');
  equal(Date.create('tomorrow').isBetween('today', 'tomorrow'), false, 'Date#isBetween | tomrrow is between today and tomorrow');
  equal(Date.create('tomorrow').isBetween('today', 'tomorrow', 5), true, 'Date#isBetween | tomrrow is between today and tomorrow with a 5ms margin');

  dateEqual(Date.create().rewind((1).day()), new Date(new Date().getTime() - 86400000), 'Date#rewind | can rewind milliseconds');
  dateEqual(Date.create().advance((1).day()), new Date(new Date().getTime() + 86400000), 'Date#advance | can advance milliseconds');

  equal(Date.create().beginningOfWeek().isLastWeek(), false, 'Date#isLastWeek | the beginning of this week is not last week');

  dateEqual(Date.create().set(0), new Date(0), 'Date#set | handles timestamps');



  date1 = Date.create('July 4th, 1776');
  date2 = date1.clone().beginningOfYear();

  equal(date2.getMonth(), 0, 'Date#clone | cloned element is reset to January');
  equal(date1.getMonth(), 6, 'Date#clone | source element is reset to unchanged');

  date1 = Date.create('invalid');
  date2 = date1.clone();

  equal(date1.isValid(), false, 'Date#clone | source element is invalid');
  equal(date2.isValid(), false, 'Date#clone | cloned element is also invalid');


  // Date.addFormat
  Date.addFormat('(\\d+)\\^\\^(\\d+)%%(\\d+), but at the (beginning|end)', ['date','year','month','edge']);
  dateEqual(Date.create('25^^2008%%02, but at the end'), new Date(2008, 1, 25, 23, 59, 59, 999), 'Date.addFormat | make your own crazy format!');

  Date.addFormat('on ze (\\d+)th of (january|february|march|april|may) lavigne', ['date','month'], 'en');
  dateEqual(Date.create('on ze 18th of april lavigne', 'en'), new Date(thisYear, 3, 18), 'Date.addFormat | handles other formats');

  equal(typeof Date.getLocale(), 'object', 'Date Locale | current localization object is exposed in case needed');
  equal(Date.getLocale().code, 'en', 'Date Locale | adding the format did not change the current locale');




  // Date locale setup
  equal(new Date(2011, 5, 18).format('{Month} {date}, {yyyy}'), 'June 18, 2011', 'Date Locales | Non-initialized defaults to English formatting');
  equal(getRelativeDate(null, null, null, -1).relative(), '1 hour ago', 'Date Locales | Non-initialized relative formatting is also English');
  equal(Date.create('June 18, 2011').isValid(), true, 'Date Locales | English dates will also be properly parsed without being initialized or passing a locale code');


  Date.setLocale('fo');

  equal(Date.create('2011kupo', 'fo').isValid(), true, 'Date Locales | dates will parse if their locale is passed');
  equal(Date.create('２０１１年０６月１８日').isValid(), false, 'Date Locales | dates will not parse thereafter as the current locale is still en');

  equal(new Date(2011, 5, 6).format('{Month}'), 'La', 'Date.setLocale | june is La');

  raisesError(function(){ Date.setLocale(); }, 'Date.setLocale | no arguments raises error');
  equal(Date.getLocale().code, 'fo', 'Date.setLocale | setting locale with no arguments had no effect');
  equal(new Date(2011, 5, 6).format('{Month}'), 'La', 'Date.setLocale | will not change the locale if no argument passed');
  equal(new Date(2011, 5, 6).format('', 'en'), 'June 6, 2011 12:00am', 'Date#format | local locale should override global');
  equal(Date.create('5 months ago', 'en').relative('en'), '5 months ago', 'Date#relative | local locale should override global');

  raisesError(function(){ Date.setLocale(''); }, 'Date.setLocale | "" raises an invalid locale error');
  equal(new Date(2011, 5, 6).format('{Month}'), 'La', 'Date.setLocale | will not change the locale if blank string passed');
  dateEqual(Date.create('2010-Jan-25', 'fo'), new Date(2010, 0, 25), 'Date#create | Static input format always matches English months');

  raisesError(function(){ Date.setLocale('pink') }, 'Date.setLocale | Non-existent locales will raise an error');
  equal(Date.create('2010-Jan-25').format(), 'yeehaw', 'Date#create | will not set the current locale to an invalid locale');

  Date.setLocale('en');

  // If traversing into a new month don't reset the date if the date was also advanced

  d = new Date(2011, 0, 31);
  dateEqual(d.advance({ month: 1 }), new Date(2011, 1, 28), 'Date#create | basic month traversal will reset the date to the last day');

  d = new Date(2011, 0, 31);
  dateEqual(d.advance({ month: 1, day: 3 }), new Date(2011, 2, 3), 'Date#create | when the day is specified date reset will not happen');

  d = new Date(2011, 0, 31);
  dateEqual(d.set({ month: 1, day: 3 }), new Date(2011, 1, 3), 'Date#create | set will also not cause date traversal');



  // Advance also allows resetting.

  d = new Date(2011, 0, 31, 23, 40, 28, 500);
  dateEqual(d.clone().advance({ year: 1 }, true), new Date(2012, 0), 'Date#advance | with reset | year');
  dateEqual(d.clone().advance({ month: 1 }, true), new Date(2011, 1), 'Date#advance | with reset | month');
  dateEqual(d.clone().advance({ week: 1 }, true), new Date(2011, 1, 7), 'Date#advance | with reset | week');
  dateEqual(d.clone().advance({ date: 1 }, true), new Date(2011, 1, 1), 'Date#advance | with reset | date');
  dateEqual(d.clone().advance({ hour: 1 }, true), new Date(2011, 1, 1, 0), 'Date#advance | with reset | hour');
  dateEqual(d.clone().advance({ minute: 1 }, true), new Date(2011, 0, 31, 23, 41), 'Date#advance | with reset | minute');
  dateEqual(d.clone().advance({ second: 1 }, true), new Date(2011, 0, 31, 23, 40, 29), 'Date#advance | with reset | second');
  dateEqual(d.clone().advance({ millisecond: 1 }, true), new Date(2011, 0, 31, 23, 40, 28, 501), 'Date#advance | with reset | millisecond');

  // Advance also allows string methods

  d = new Date(2011, 0, 31, 23, 40, 28, 500);
  dateEqual(d.clone().advance('3 years'), new Date(2014, 0, 31, 23, 40, 28, 500), 'Date#advance | string input | year');
  dateEqual(d.clone().advance('3 months'), new Date(2011, 3, 30, 23, 40, 28, 500), 'Date#advance | string input | month');
  dateEqual(d.clone().advance('3 weeks'), new Date(2011, 1, 21, 23, 40, 28, 500), 'Date#advance | string input | week');
  dateEqual(d.clone().advance('3 days'), new Date(2011, 1, 3, 23, 40, 28, 500), 'Date#advance | string input | date');
  dateEqual(d.clone().advance('3 hours'), new Date(2011, 1, 1, 2, 40, 28, 500), 'Date#advance | string input | hour');
  dateEqual(d.clone().advance('3 minutes'), new Date(2011, 0, 31, 23, 43, 28, 500), 'Date#advance | string input | minute');
  dateEqual(d.clone().advance('3 seconds'), new Date(2011, 0, 31, 23, 40, 31, 500), 'Date#advance | string input | second');
  dateEqual(d.clone().advance('3 milliseconds'), new Date(2011, 0, 31, 23, 40, 28, 503), 'Date#advance | string input | millisecond');

  // Number methods

  equal((4).milliseconds(), 4, 'Number#milliseconds | 4');
  equal((3.25).milliseconds(), 3, 'Number#milliseconds | rounded');

  equal((0).seconds(), 0, 'Number#seconds | 0');
  equal((1).seconds(), 1000, 'Number#seconds | 1');
  equal((30).seconds(), 30000, 'Number#seconds | 30');
  equal((60).seconds(), 60000, 'Number#seconds | 60');


  equal((1).minutes(), 60000, 'Number#minutes | 1');
  equal((10).minutes(), 600000, 'Number#minutes | 10');
  equal((100).minutes(), 6000000, 'Number#minutes | 100');
  equal((0).minutes(), 0, 'Number#minutes | 0');
  equal((0.5).minutes(), 30000, 'Number#minutes | 0.5');
  equal((1).minutes(), (60).seconds(), 'Number#minutes | 1 minute is 60 seconds');

  equal((1).hours(), 3600000, 'Number#hours | 1');
  equal((10).hours(), 36000000, 'Number#hours | 10');
  equal((100).hours(), 360000000, 'Number#hours | 100');
  equal((0).hours(), 0, 'Number#hours | 0');
  equal((0.5).hours(), 1800000, 'Number#hours | 0.5');
  equal((1).hours(), (60).minutes(), 'Number#hours | 1 hour is 60 minutes');
  equal((1).hours(), (3600).seconds(), 'Number#hours | 1 hour is 3600 seconds');


  equal((1).days(), 86400000, 'Number#days | 1');
  equal((10).days(), 864000000, 'Number#days | 10');
  equal((100).days(), 8640000000, 'Number#days | 100');
  equal((0).days(), 0, 'Number#days | 0');
  equal((0.5).days(), 43200000, 'Number#days | 0.5');
  equal((1).days(), (24).hours(), 'Number#days | 1 day is 24 hours');
  equal((1).days(), (1440).minutes(), 'Number#days | 1 day is 1440 minutes');
  equal((1).days(), (86400).seconds(), 'Number#days | 1 day is 86400 seconds');


  equal((1).weeks(), 604800000, 'Number#weeks | 1');
  equal((0.5).weeks(), 302400000, 'Number#weeks | 0.5');
  equal((10).weeks(), 6048000000, 'Number#weeks | 10');
  equal((0).weeks(), 0, 'Number#weeks | 0');
  equal((1).weeks(), (7).days(), 'Number#weeks | 1 week is 7 days');
  equal((1).weeks(), (24 * 7).hours(), 'Number#weeks | 1 week is 24 * 7 hours');
  equal((1).weeks(), (60 * 24 * 7).minutes(), 'Number#weeks | 1 week is 60 * 24 * 7 minutes');
  equal((1).weeks(), (60 * 60 * 24 * 7).seconds(), 'Number#weeks | 1 week is 60 * 60 * 24 * 7 seconds');

  equal((1).months(), 2629800000, 'Number#months | 1 month');
  equal((0.5).months(), 1314900000, 'Number#months | 0.5 month');
  equal((10).months(), 26298000000, 'Number#months | 10 month');
  equal((0).months(), 0, 'Number#months | 0 months');
  equal((1).months(), (30.4375).days(), 'Number#months | 1 month is 30.4375 days');
  equal((1).months(), (24 * 30.4375).hours(), 'Number#months | 1 month is 24 * 30.4375 hours');
  equal((1).months(), (60 * 24 * 30.4375).minutes(), 'Number#months | 1 month is 60 * 24 * 30.4375 minutes');
  equal((1).months(), (60 * 60 * 24 * 30.4375).seconds(), 'Number#months | 1 month is 60 * 60 * 24 * 30.4375 seconds');

  equal((1).years(), 31557600000, 'Number#years | 1');
  equal((0.5).years(), 15778800000, 'Number#years | 0.5');
  equal((10).years(), 315576000000, 'Number#years | 10');
  equal((0).years(), 0, 'Number#years | 0');
  equal((1).years(), (365.25).days(), 'Number#years | 1 year is 365.25 days');
  equal((1).years(), (24 * 365.25).hours(), 'Number#years | 1 year is 24 * 365.25 hours');
  equal((1).years(), (60 * 24 * 365.25).minutes(), 'Number#years | 1 year is 60 * 24 * 365.25 minutes');
  equal((1).years(), (60 * 60 * 24 * 365.25).seconds(), 'Number#years | 1 year is 60 * 60 * 24 * 365.25 seconds');



  /* compatibility */

  equal((1).second(), 1000, 'Number#second | 1 second');
  equal((1).minute(), 60000, 'Number#minute | 1 minute');
  equal((1).hour(), 3600000, 'Number#hour | 1 hour');
  equal((1).day(), 86400000, 'Number#day | 1 day');
  equal((1).week(), 604800000, 'Number#week | 1 week');
  equal((1).month(), 2629800000, 'Number#month | 1 month');
  equal((1).year(), 31557600000, 'Number#year | 1 year');


  dateEqual((1).secondAfter(), 1000, 'Number#secondAfter | 1');
  dateEqual((5).secondsAfter(), 5000, 'Number#secondsAfter | 5');
  dateEqual((10).minutesAfter(), 600000, 'Number#minutesAfter | 10');

  dateEqual((1).secondFromNow(), 1000, 'Number#secondFromNow | 1');
  dateEqual((5).secondsFromNow(), 5000, 'Number#secondsFromNow | 5');
  dateEqual((10).minutesFromNow(), 600000, 'Number#minutesFromNow | 10');

  dateEqual((1).secondAgo(), -1000, 'Number#secondAgo | 1');
  dateEqual((5).secondsAgo(), -5000, 'Number#secondAgo | 5');
  dateEqual((10).secondsAgo(), -10000, 'Number#secondAgo | 10');

  dateEqual((1).secondBefore(), -1000, 'Number#secondBefore | 1');
  dateEqual((5).secondsBefore(), -5000, 'Number#secondBefore | 5');
  dateEqual((10).secondsBefore(), -10000, 'Number#secondBefore | 10');


  dateEqual((5).minutesAfter((5).minutesAgo()), 0, 'Number#minutesAfter | 5 minutes after 5 minutes ago');
  dateEqual((10).minutesAfter((5).minutesAgo()), 1000 * 60 * 5, 'Number#minutesAfter | 10 minutes after 5 minutes ago');

  dateEqual((5).minutesFromNow((5).minutesAgo()), 0, 'Number#minutesFromNow | 5 minutes from now 5 minutes ago');
  dateEqual((10).minutesFromNow((5).minutesAgo()), 1000 * 60 * 5, 'Number#minutesFromNow | 10 minutes from now 5 minutes ago');

  dateEqual((5).minutesAgo((5).minutesFromNow()), 0, 'Number#minutesAgo | 5 minutes ago 5 minutes from now');
  dateEqual((10).minutesAgo((5).minutesFromNow()), -(1000 * 60 * 5), 'Number#minutesAgo | 10 minutes ago 5 minutes from now');

  dateEqual((5).minutesBefore((5).minutesFromNow()), 0, 'Number#minutesBefore | 5 minutes before 5 minutes from now');
  dateEqual((10).minutesBefore((5).minutesFromNow()), -(1000 * 60 * 5), 'Number#minutesBefore | 10 minutes before 5 minutes from now');


  var christmas = new Date('December 25, 1972');

  dateEqual((5).minutesBefore(christmas), getRelativeDate.call(christmas, null, null, null, null, -5), 'Number#minutesBefore | 5 minutes before christmas');
  dateEqual((5).minutesAfter(christmas), getRelativeDate.call(christmas, null, null, null, null, 5), 'Number#minutesAfter | 5 minutes after christmas');

  dateEqual((5).hoursBefore(christmas), getRelativeDate.call(christmas, null, null, null, -5), 'Number#hoursBefore | 5 hours before christmas');
  dateEqual((5).hoursAfter(christmas), getRelativeDate.call(christmas, null, null, null, 5), 'Number#hoursAfter | 5 hours after christmas');

  dateEqual((5).daysBefore(christmas), getRelativeDate.call(christmas, null, null, -5), 'Number#daysBefore | 5 days before christmas');
  dateEqual((5).daysAfter(christmas), getRelativeDate.call(christmas, null, null, 5), 'Number#daysAfter | 5 days after christmas');

  dateEqual((5).weeksBefore(christmas), getRelativeDate.call(christmas, null, null, -35), 'Number#weeksBefore | 5 weeks before christmas');
  dateEqual((5).weeksAfter(christmas), getRelativeDate.call(christmas, null, null, 35), 'Number#weeksAfter | 5 weeks after christmas');

  dateEqual((5).monthsBefore(christmas), getRelativeDate.call(christmas, null, -5), 'Number#monthsBefore | 5 months before christmas');
  dateEqual((5).monthsAfter(christmas), getRelativeDate.call(christmas, null, 5), 'Number#monthsAfter | 5 months after christmas');

  dateEqual((5).yearsBefore(christmas), getRelativeDate.call(christmas, -5), 'Number#yearsBefore | 5 years before christmas');
  dateEqual((5).yearsAfter(christmas), getRelativeDate.call(christmas, 5), 'Number#yearsAfter | 5 years after christmas');

  dateEqual((5).hoursBefore(1972, 11, 25), getRelativeDate.call(christmas, null, null, null, -5), 'Number#hoursBefore | accepts numbers');

  // Hooking it all up!!

  // Try this in WinXP:
  // 1. Set timezone to Damascus
  // 2. var d = new Date(1998, 3, 3, 17); d.setHours(0); d.getHours();
  // 3. hours = 23
  // 4. PROFIT $$$

  dateEqual((5).minutesBefore('April 2rd, 1998'), new Date(1998, 3, 1, 23, 55), 'Number#minutesBefore | 5 minutes before April 3rd, 1998');
  dateEqual((5).minutesAfter('January 2nd, 2005'), new Date(2005, 0, 2, 0, 5), 'Number#minutesAfter | 5 minutes after January 2nd, 2005');
  dateEqual((5).hoursBefore('the first day of 2005'), new Date(2004, 11, 31, 19), 'Number#hoursBefore | 5 hours before the first day of 2005');
  dateEqual((5).hoursAfter('the last day of 2006'), new Date(2006, 11, 31, 5), 'Number#hoursAfter | 5 hours after the last day of 2006');
  dateEqual((5).hoursAfter('the end of 2006'), new Date(2007, 0, 1, 4, 59, 59, 999), 'Number#hoursAfter | 5 hours after the end of 2006');
  dateEqual((5).daysBefore('last week monday'), getDateWithWeekdayAndOffset(1, -7).rewind({ days: 5 }), 'Number#daysBefore | 5 days before last week monday');
  dateEqual((5).daysAfter('next tuesday'), getDateWithWeekdayAndOffset(2, 7).advance({ days: 5 }), 'Number#daysAfter | 5 days after next week tuesday');
  dateEqual((5).weeksBefore('today'), getRelativeDate(null, null, -35).set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), 'Number#weeksBefore | 5 weeks before today');
  dateEqual((5).weeksAfter('now'), getRelativeDate(null, null, 35), 'Number#weeksAfter | 5 weeks after now');
  dateEqual((5).monthsBefore('today'), getRelativeDate(null, -5).set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }), 'Number#monthsBefore | 5 months before today');
  dateEqual((5).monthsAfter('now'), getRelativeDate(null, 5), 'Number#monthsAfter | 5 months after now');



  // Date#getISOWeek

  equal(new Date(2011, 0, 1).getISOWeek(), 52, 'String#getISOWeek | January 1, 2011');
  equal(new Date(2011, 0, 2).getISOWeek(), 52, 'String#getISOWeek | January 2, 2011');
  equal(new Date(2011, 0, 3).getISOWeek(),  1, 'String#getISOWeek | January 3, 2011');
  equal(new Date(2011, 0, 4).getISOWeek(),  1, 'String#getISOWeek | January 4, 2011');

  equal(new Date(2011, 11, 25).getISOWeek(), 51, 'String#getISOWeek | December 25, 2011');
  equal(new Date(2011, 11, 26).getISOWeek(), 52, 'String#getISOWeek | December 26, 2011');
  equal(new Date(2011, 11, 27).getISOWeek(), 52, 'String#getISOWeek | December 27, 2011');

  equal(new Date(2011, 11, 31).getISOWeek(), 52, 'String#getISOWeek | December 31, 2011');
  equal(new Date(2012, 0, 1).getISOWeek(),   52, 'String#getISOWeek | January 1, 2012');
  equal(new Date(2012, 0, 2).getISOWeek(),    1, 'String#getISOWeek | January 2, 2012');

  equal(new Date(2013, 11, 28).getISOWeek(), 52, 'String#getISOWeek | December 28, 2013');
  equal(new Date(2013, 11, 29).getISOWeek(), 52, 'String#getISOWeek | December 29, 2013');
  equal(new Date(2013, 11, 30).getISOWeek(),  1, 'String#getISOWeek | December 30, 2013');
  equal(new Date(2013, 11, 31).getISOWeek(),  1, 'String#getISOWeek | December 31, 2013');
  equal(new Date(2014,  0,  1).getISOWeek(),  1, 'String#getISOWeek | January 01, 2014');
  equal(new Date(2014,  0,  2).getISOWeek(),  1, 'String#getISOWeek | January 02, 2014');
  equal(new Date(2014,  0,  5).getISOWeek(),  1, 'String#getISOWeek | January 05, 2014');
  equal(new Date(2014,  0,  6).getISOWeek(),  2, 'String#getISOWeek | January 06, 2014');


  // Date.restore may not exist in dates-only build.

  if(Date.restore) {
    Date.prototype.advance = undefined;
    equal(typeof Date.prototype.advance,  'undefined', 'Date#advance was removed');
    Date.restore('advance');
    equal(typeof Date.prototype.advance,  'function', 'Date#advance was restored');
  }


  // Issue #98: System time set to January 31st

  dateEqual(Date.create('2011-09-01T05:00:00Z'), getUTCDate(2011, 9, 1, 5), 'String#toDate | text format');


  // Number#duration

  Date.setLocale('en');

  equal((1).duration(), '1 millisecond', 'Number#duration | 1 millisecond');
  equal((2).duration(), '2 milliseconds', 'Number#duration | 2 milliseconds');
  equal((100).duration(), '100 milliseconds', 'Number#duration | 100 milliseconds');
  equal((500).duration(), '500 milliseconds', 'Number#duration | 500 milliseconds');
  equal((949).duration(), '949 milliseconds', 'Number#duration | 949 milliseconds');
  equal((950).duration(), '1 second', 'Number#duration | 950 milliseconds');
  equal((999).duration(), '1 second', 'Number#duration | 999 milliseconds');
  equal((1000).duration(), '1 second', 'Number#duration | 1 second');
  equal((1999).duration(), '2 seconds', 'Number#duration | 2 seconds');
  equal((5000).duration(), '5 seconds', 'Number#duration | 5 seconds');
  equal((55000).duration(), '55 seconds', 'Number#duration | 55 seconds');
  equal((56000).duration(), '56 seconds', 'Number#duration | 56 seconds');
  equal((57000).duration(), '1 minute', 'Number#duration | 57 seconds');
  equal((60000).duration(), '1 minute', 'Number#duration | 60 seconds');
  equal((3600000).duration(), '1 hour', 'Number#duration | 360000 seconds');
  equal((5).hours().duration(), '5 hours', 'Number#duration | 5 hours');
  equal((22).hours().duration(), '22 hours', 'Number#duration | 22 hours');
  equal((23).hours().duration(), '1 day', 'Number#duration | 23 hours');
  equal((6).days().duration(), '6 days', 'Number#duration | 6 days');
  equal((7).days().duration(), '1 week', 'Number#duration | 1 week');
  equal((28).days().duration(), '4 weeks', 'Number#duration | 30 days');
  equal((29).days().duration(), '1 month', 'Number#duration | 1 months');
  equal((11).months().duration(), '11 months', 'Number#duration | 11 months');
  equal((12).months().duration(), '1 year', 'Number#duration | 1 year');
  equal((2).years().duration(), '2 years', 'Number#duration | 2 years');
  equal((15).years().duration(), '15 years', 'Number#duration | 15 years');
  equal((1500).years().duration(), '1500 years', 'Number#duration | 1500 years');

  Date.setLocale('fo');

  equal((5).days().duration(), '5somomoney', 'Number#duration | Fake locale | 5 days');
  equal((150).days().duration(), '4timomoney', 'Number#duration | Fake locale | 150 days');
  equal((38000).seconds().duration(), '10famomoney', 'Number#duration | Fake locale | 38000 seconds');
  equal((38000).minutes().duration(), '3lamomoney', 'Number#duration | Fake locale | 38000 minutes');
  equal((38000).hours().duration(), '4domomoney', 'Number#duration | Fake locale | 38000 hours');


  // Duration without setting the locale code

  equal((5).days().duration('en'), '5 days', 'Number#duration | English | 5 days');
  equal((150).days().duration('en'), '4 months', 'Number#duration | English | 150 days');
  equal((38000).seconds().duration('en'), '10 hours', 'Number#duration | English | 38000 seconds');
  equal((38000).minutes().duration('en'), '3 weeks', 'Number#duration | English | 38000 minutes');
  equal((38000).hours().duration('en'), '4 years', 'Number#duration | English | 38000 hours');

  Date.setLocale('en');


  // Custom date formats
  // https://github.com/andrewplummer/Sugar/issues/119#issuecomment-4520966

  Date.addFormat('(\\d{2})(\\d{2})',['hour','minute']);
  dateEqual(Date.create('0615'), new Date().set({ hours: 6, minutes: 15 }, true), 'Date.addFormat | Overrides defined formats');

  // Not sure how nuts I want to get with this so for the sake of the tests just push the proper format back over the top...
  Date.addFormat('(\\d{4})', ['year']);

  // Issue #146 - These tests were failing when system time was set to Friday, June 1, 2012 PDT

  equal(Date.create('2010-01-20T20:00:00.000Z').iso(), '2010-01-20T20:00:00.000Z');
  equal(Date.create('2010-02-20T20:00:00.000Z').iso(), '2010-02-20T20:00:00.000Z');
  equal(Date.create('2010-03-20T20:00:00.000Z').iso(), '2010-03-20T20:00:00.000Z');
  equal(Date.create('2010-04-20T20:00:00.000Z').iso(), '2010-04-20T20:00:00.000Z');
  equal(Date.create('2010-05-20T20:00:00.000Z').iso(), '2010-05-20T20:00:00.000Z');
  equal(Date.create('2010-05-20T20:00:00.000Z').iso(), '2010-05-20T20:00:00.000Z');
  equal(Date.create('2010-06-20T20:00:00.000Z').iso(), '2010-06-20T20:00:00.000Z');
  equal(Date.create('2010-07-20T20:00:00.000Z').iso(), '2010-07-20T20:00:00.000Z');
  equal(Date.create('2010-08-20T20:00:00.000Z').iso(), '2010-08-20T20:00:00.000Z');
  equal(Date.create('2010-09-20T20:00:00.000Z').iso(), '2010-09-20T20:00:00.000Z');
  equal(Date.create('2010-10-20T20:00:00.000Z').iso(), '2010-10-20T20:00:00.000Z');
  equal(Date.create('2010-11-20T20:00:00.000Z').iso(), '2010-11-20T20:00:00.000Z');
  equal(Date.create('2010-12-20T20:00:00.000Z').iso(), '2010-12-20T20:00:00.000Z');

  equal(Date.create('Jan 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-01-20T20:00:00.000Z');
  equal(Date.create('Feb 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-02-20T20:00:00.000Z');
  equal(Date.create('Mar 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-03-20T20:00:00.000Z');
  equal(Date.create('Apr 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-04-20T20:00:00.000Z');
  equal(Date.create('May 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-05-20T20:00:00.000Z');
  equal(Date.create('Jun 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-06-20T20:00:00.000Z');
  equal(Date.create('Jul 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-07-20T20:00:00.000Z');
  equal(Date.create('Aug 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-08-20T20:00:00.000Z');
  equal(Date.create('Sep 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-09-20T20:00:00.000Z');
  equal(Date.create('Oct 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-10-20T20:00:00.000Z');
  equal(Date.create('Nov 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-11-20T20:00:00.000Z');
  equal(Date.create('Dec 20 2010 12:00:00 GMT-0800 (PST)').iso(), '2010-12-20T20:00:00.000Z');

  dateEqual(Date.create('Thursday of next week, 3:30pm'), getDateWithWeekdayAndOffset(4, 7, 15, 30), 'Date#create | Fuzzy Dates | thursday of next week, 3:30pm');


  // Issue #152 times should be allowed in front
  dateEqual(Date.create('3:45 2012-3-15'), new Date(2012, 2, 15, 3, 45), 'Date#create | time in the front');
  dateEqual(Date.create('3:45pm 2012-3-15'), new Date(2012, 2, 15, 15, 45), 'Date#create | big endian with time');
  dateEqual(Date.create('3:45pm 3/15/2012'), new Date(2012, 2, 15, 15, 45), 'Date#create | crazy endian slashes with time');
  dateEqual(Date.create('3:45pm 3/4/2012', 'en-GB'), new Date(2012, 3, 3, 15, 45), 'Date#create | little endian slashes with time');



  // Issue #144 various time/date formats
  dateEqual(Date.create('6/30/2012 3:00 PM'), new Date(2012, 5, 30, 15), 'Date#create | 6/30/2012 3:00 PM');
  dateEqual(Date.create('Thursday at 3:00 PM'), getDateWithWeekdayAndOffset(4).set({ hour: 15 }), 'Date#create | Thursday at 3:00 PM');
  dateEqual(Date.create('Thursday at 3:00PM'), getDateWithWeekdayAndOffset(4).set({ hour: 15 }), 'Date#create | Thursday at 3:00PM (no space)');



  // Issue #141 future/past preference

  var weekdayOffset = now.getWeekday();

  equal(Date.past('Sunday').isPast(),    true, 'Date#past | weekdays | Sunday');
  equal(Date.past('Monday').isPast(),    true, 'Date#past | weekdays | Monday');
  equal(Date.past('Tuesday').isPast(),   true, 'Date#past | weekdays | Tuesday');
  equal(Date.past('Wednesday').isPast(), true, 'Date#past | weekdays | Wednesday');
  equal(Date.past('Thursday').isPast(),  true, 'Date#past | weekdays | Thursday');
  equal(Date.past('Friday').isPast(),    true, 'Date#past | weekdays | Friday');
  equal(Date.past('Saturday').isPast(),  true, 'Date#past | weekdays | Saturday');

  equal(Date.future('Sunday').isFuture(),    true, 'Date#future | weekdays | Sunday');
  equal(Date.future('Monday').isFuture(),    true, 'Date#future | weekdays | Monday');
  equal(Date.future('Tuesday').isFuture(),   true, 'Date#future | weekdays | Tuesday');
  equal(Date.future('Wednesday').isFuture(), true, 'Date#future | weekdays | Wednesday');
  equal(Date.future('Thursday').isFuture(),  true, 'Date#future | weekdays | Thursday');
  equal(Date.future('Friday').isFuture(),    true, 'Date#future | weekdays | Friday');
  equal(Date.future('Saturday').isFuture(),  true, 'Date#future | weekdays | Saturday');

  equal(Date.past('January').isPast(),   true, 'Date#past | months | January');
  equal(Date.past('February').isPast(),  true, 'Date#past | months | February');
  equal(Date.past('March').isPast(),     true, 'Date#past | months | March');
  equal(Date.past('April').isPast(),     true, 'Date#past | months | April');
  equal(Date.past('May').isPast(),       true, 'Date#past | months | May');
  equal(Date.past('June').isPast(),      true, 'Date#past | months | June');
  equal(Date.past('July').isPast(),      true, 'Date#past | months | July');
  equal(Date.past('August').isPast(),    true, 'Date#past | months | August');
  equal(Date.past('September').isPast(), true, 'Date#past | months | September');
  equal(Date.past('October').isPast(),   true, 'Date#past | months | October');
  equal(Date.past('November').isPast(),  true, 'Date#past | months | November');
  equal(Date.past('December').isPast(),  true, 'Date#past | months | December');

  equal(Date.future('January').isFuture(),   true, 'Date#future | months | January');
  equal(Date.future('February').isFuture(),  true, 'Date#future | months | February');
  equal(Date.future('March').isFuture(),     true, 'Date#future | months | March');
  equal(Date.future('April').isFuture(),     true, 'Date#future | months | April');
  equal(Date.future('May').isFuture(),       true, 'Date#future | months | May');
  equal(Date.future('June').isFuture(),      true, 'Date#future | months | June');
  equal(Date.future('July').isFuture(),      true, 'Date#future | months | July');
  equal(Date.future('August').isFuture(),    true, 'Date#future | months | August');
  equal(Date.future('September').isFuture(), true, 'Date#future | months | September');
  equal(Date.future('October').isFuture(),   true, 'Date#future | months | October');
  equal(Date.future('November').isFuture(),  true, 'Date#future | months | November');
  equal(Date.future('December').isFuture(),  true, 'Date#future | months | December');

  // Ensure that dates don't traverse TOO far into the past/future
  equal(Date.future('January').monthsFromNow() > 12, false, 'Date#future | months | no more than 12 months from now');
  equal(Date.future('December').monthsFromNow() > 12, false, 'Date#future | months | no more than 12 months from now');


  dateEqual(Date.create('the 2nd Tuesday of June, 2012'), new Date(2012, 5, 12), 'Date#create | the 2nd tuesday of June');

  dateEqual(Date.create('the 1st Tuesday of November, 2012'), new Date(2012, 10, 6), 'Date#create | the 1st tuesday of November');
  dateEqual(Date.create('the 2nd Tuesday of November, 2012'), new Date(2012, 10, 13), 'Date#create | the 2nd tuesday of November');
  dateEqual(Date.create('the 3rd Tuesday of November, 2012'), new Date(2012, 10, 20), 'Date#create | the 3rd tuesday of November');
  dateEqual(Date.create('the 4th Tuesday of November, 2012'), new Date(2012, 10, 27), 'Date#create | the 4th tuesday of November');
  dateEqual(Date.create('the 5th Tuesday of November, 2012'), new Date(2012, 11, 4), 'Date#create | the 5th tuesday of November');
  dateEqual(Date.create('the 6th Tuesday of November, 2012'), new Date(2012, 11, 11), 'Date#create | the 6th tuesday of November');

  dateEqual(Date.create('the 1st Friday of February, 2012'), new Date(2012, 1, 3), 'Date#create | the 1st Friday of February');
  dateEqual(Date.create('the 2nd Friday of February, 2012'), new Date(2012, 1, 10), 'Date#create | the 2nd Friday of February');
  dateEqual(Date.create('the 3rd Friday of February, 2012'), new Date(2012, 1, 17), 'Date#create | the 3rd Friday of February');
  dateEqual(Date.create('the 4th Friday of February, 2012'), new Date(2012, 1, 24), 'Date#create | the 4th Friday of February');
  dateEqual(Date.create('the 5th Friday of February, 2012'), new Date(2012, 2, 2), 'Date#create | the 5th Friday of February');
  dateEqual(Date.create('the 6th Friday of February, 2012'), new Date(2012, 2, 9), 'Date#create | the 6th Friday of February');

  var firstFridayOfFeb = new Date(thisYear, 1);
  firstFridayOfFeb.setWeekday(5);
  if(firstFridayOfFeb.getMonth() < 1) {
    firstFridayOfFeb.add({ weeks: 1 });
  }

  equal(Date.create('the 1st Friday of February').getFullYear(), thisYear, 'Date#create | 1st friday of February should be this year');
  equal(Date.future('the 1st Friday of February').getFullYear(), now > firstFridayOfFeb ? thisYear + 1 : thisYear, 'Date#future | 1st friday of February should be this year or next');
  equal(Date.past('the 1st Friday of February').getFullYear(), now < firstFridayOfFeb ? thisYear - 1 : thisYear, 'Date#past | 1st friday of February should be this year or last');


  equal(Date.future('1:00am').isFuture(), true, 'Date#future | 1am should be the future');
  equal(Date.future('11:00pm').isFuture(), true, 'Date#future | 11pm should be the future');

  equal(Date.future('1:00am') < Date.create('1 day from now'), true, 'Date#future | 1am should be the future');
  equal(Date.future('11:00pm') < Date.create('1 day from now'), true, 'Date#future | 11pm should be the future');

  dateEqual(Date.create('in 60 seconds'), new Date().addMinutes(1), 'Date#create | in 60 seconds');
  dateEqual(Date.create('in 45 minutes'), new Date().addMinutes(45), 'Date#create | in 45 minutes');
  dateEqual(Date.create('in 5 hours'), new Date().addHours(5), 'Date#create | in 5 hours');
  dateEqual(Date.create('in 5 days'), new Date().addDays(5), 'Date#create | in 5 days');
  dateEqual(Date.create('in 5 weeks'), new Date().addWeeks(5), 'Date#create | in 5 weeks');
  dateEqual(Date.create('in 5 months'), new Date().addMonths(5), 'Date#create | in 5 months');
  dateEqual(Date.create('in 5 years'), new Date().addYears(5), 'Date#create | in 5 years');



  // Invalid dates should not return true or false

  equal(Date.create('my pants').isPast(), undefined, 'Date#isPast | invalid dates should return false');
  equal(Date.create('my pants').isFuture(), undefined, 'Date#isFuture | invalid dates should return false');
  equal(Date.create('my pants').isToday(), undefined, 'Date#isToday | invalid dates should return false');
  equal(Date.create('my pants').isTomorrow(), undefined, 'Date#isTomorrow | invalid dates should return false');
  equal(Date.create('my pants').is('today'), undefined, 'Date#is | invalid dates should return false');

  // Issue #160
  equal(Date.create('12/01/2013').is('November 2013'), false, 'Date#is | December 2013 is not November 2013');


  // Adding a locale

  Date.setLocale('en');
  Date.addLocale('foobar', { months: ['a','b','c'] });

  equal(Date.getLocale().code, Date.getLocale('en').code, 'Date.addLocale | adding a locale does not affect the current locale');
  equal(Date.getLocale('foobar').months[0], 'a', 'Date.addLocale | new locale has been added');
  dateEqual(Date.create('a', 'foobar'), Date.create('January'), 'Date.addLocale | formats have been recognized');



  // Date.create should clone a date

  date1 = new Date(5000);
  date2 = Date.create(date1);
  date1.setTime(10000);

  equal(date1.getTime() === date2.getTime(), false, 'Date.create | created date should not be affected');

  // Simple 12:00am

  equal(Date.create('12:00am').getHours(), 0, 'Date.create| 12:00am hours should be 0');
  equal(Date.create('12am').getHours(), 0, 'Date.create| 12am hours should be 0');


  // New handling of UTC dates

  date1 = Date.utc.create('2001-06-15', 'en');
  date2 = new Date(2001, 5, 15);

  dateEqual(date1, date2.addMinutes(-date2.getTimezoneOffset()), 'Date#create | utc | is equal to date with timezone subtracted');
  equal(date1._utc, false, 'Date#create | utc | does not set internal flag');


  d = new Date(2001, 5, 15).utc();

  equal(d._utc, true, 'Date#utc | sets internal flag');
  dateEqual(d, new Date(2001, 5, 15), 'Date#utc | does not change date');
  dateEqual(d.clone().beginningOfMonth(), new Date(Date.UTC(2001, 5, 1)), 'Date#beginningOfMonth | utc');
  dateEqual(d.clone().endOfMonth(), new Date(Date.UTC(2001, 5, 30, 23, 59, 59, 999)), 'Date#endOfMonth | utc');

  equal(Date.create('1 month ago').utc().isLastMonth(), true, 'Date#utc | isLastMonth');
  equal(d.minutesSince(Date.utc.create('2001-06-15', 'en')), d.getTimezoneOffset(), 'Date#utc | minutesSince is equal to the timezone offset');
  equal(d.hoursSince('2001-6-14'), 24, 'Date#utc | hoursSince | does not actually shift time');

  d = Date.utc.create('2001-06-15', 'en').utc(true);

  equal(d.iso(), '2001-06-15T00:00:00.000Z', 'Date#create | utc | will properly be output in UTC');
  equal(d.format('{tz}'), '+0000', 'Date#format | UTC date will have +0000 offset');
  equal(d.getUTCOffset(), '+0000', 'Date#getUTCOffset | utc');
  dateEqual(d.clone().advance('1 month'), new Date(Date.UTC(2001, 6, 15)), 'Date#advance | utc');

  equal(Date.utc.create('2010-02-01', 'en').utc().daysInMonth(), 28, 'Date#daysInMonth | utc | should find correct days in month');
  equal(Date.utc.create('2000-01', 'en').utc().isLeapYear(), true, 'Date#isLeapYear | accounts for utc dates');


  d = Date.utc.create('2000-02-18 11:00pm', 'en').utc(true);

  equal(d.is('Friday', null, true), true, 'Date#is | utc | friday');
  equal(d.isWeekday(true), true, 'Date#isWeekday | utc | friday');
  equal(d.is('2000-02-18', null, true), true, 'Date#is | utc | friday | full date');
  equal(d.isAfter(Date.utc.create('2000-02-18 10:00pm', 'en')), true, 'Date#isAfter | utc | friday | full date');
  equal(d.clone().reset(), new Date(Date.UTC(2000, 1, 18)), 'Date#reset | utc');


  d = Date.utc.create('2000-02-14', 'en').utc(true);

  equal(d.is('Monday', null, true), true, 'Date#is | utc | monday');
  equal(d.isWeekday(true), true, 'Date#isWeekday | utc | monday');
  equal(d.is('2000-02-14', null, true), true, 'Date#is | utc | monday | full date');


  equal(d.format(), 'February 14, 2000 12:00am', 'Date#format | from UTC time');
  equal(d.full(), 'Monday February 14, 2000 12:00:00am', 'Date#full | from UTC time');
  equal(d.long(), 'February 14, 2000 12:00am', 'Date#long | from UTC time');
  equal(d.short(), 'February 14, 2000', 'Date#short | from UTC time');

  // Relative dates are unaffected
  equal(Date.utc.create('1 minute ago', 'en').relative(), '1 minute ago', 'Date#relative | utc');


  d = new Date(2001, 5, 15).utc().utc(false);

  equal(d._utc, false, 'Date#utc | can turn off');

  d = new Date(2001, 5, 15);

  var hours = d.getHours() - (d.getTimezoneOffset() / 60);


  // Issue #203

  dateEqual(Date.create('The day after tomorrow 3:45pm', 'en'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 15, 45), 'Date#create | Fuzzy Dates | The day after tomorrow at 3:45pm');
  dateEqual(Date.create('The day before yesterday at 11:15am', 'en'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 11, 15), 'Date#create | Fuzzy Dates | the day before yesterday at 11:15am');


  dateEqual(Date.create('the 28th'), new Date().set({ date:28 }, true), 'Date#create | the 28th');
  dateEqual(Date.create('28th'), new Date().set({ date:28 }, true), 'Date#create | 28th');
  dateEqual(Date.create('the 28th of January'), new Date().set({ month: 0, date:28 }, true), 'Date#create | the 28th of January');
  dateEqual(Date.create('28th of January'), new Date().set({ month: 0, date:28 }, true), 'Date#create | 28th of January');

  // Issue #210

  equal(Date.future('Sunday at 3:00').getWeekday(), 0, 'Date.future | weekday should never be ambiguous');



  // Issue #219

  equal(Date.create('28:00').isValid(),  true,  'Date#create | hours may fall outside range');
  equal(Date.create('59:00').isValid(),  true,  'Date#create | no hours allowed outside range');
  equal(Date.create('139:00').isValid(), false, 'Date#create | 3 digits not supported');

  // These dates actually will parse out natively in V8
  // equal(Date.create('05:75').isValid(), false, 'Date#create | no minutes allowed outside range');
  // equal(Date.create('05:59:60').isValid(), false, 'Date#create | no seconds allowed outside range');
  equal(Date.create('05:59:59').isValid(), true, 'Date#create | seconds within range');


  // Issue #221

  dateEqual(new Date(2012, 0).addMonths(-13), new Date(2010, 11), 'Date#addMonths | Month traversal should not kick in when n < -12');

  // Issue #227

  dateEqual(Date.create('0 January'), new Date(now.getFullYear() - 1, 11, 31), 'Date#addMonths | 0 January');
  dateEqual(Date.create('1 January'), new Date(now.getFullYear(), 0, 1), 'Date#addMonths | 1 January');
  dateEqual(Date.create('01 January'), new Date(now.getFullYear(), 0, 1), 'Date#addMonths | 01 January');
  dateEqual(Date.create('15 January'), new Date(now.getFullYear(), 0, 15), 'Date#addMonths | 15 January');
  dateEqual(Date.create('31 January'), new Date(now.getFullYear(), 0, 31), 'Date#addMonths | 31 January');

  dateEqual(Date.create('1 Jan'), new Date(now.getFullYear(), 0, 1), 'Date#addMonths | 1 Jan');
  dateEqual(Date.create('01 Jan'), new Date(now.getFullYear(), 0, 1), 'Date#addMonths | 01 Jan');
  dateEqual(Date.create('15 Jan'), new Date(now.getFullYear(), 0, 15), 'Date#addMonths | 15 Jan');
  dateEqual(Date.create('31 Jan'), new Date(now.getFullYear(), 0, 31), 'Date#addMonths | 31 Jan');

  dateEqual(Date.create('0 July'), new Date(now.getFullYear(), 5, 30), 'Date#addMonths | 0 July');
  dateEqual(Date.create('1 July'), new Date(now.getFullYear(), 6, 1), 'Date#addMonths | 1 July');
  dateEqual(Date.create('01 July'), new Date(now.getFullYear(), 6, 1), 'Date#addMonths | 01 July');
  dateEqual(Date.create('15 July'), new Date(now.getFullYear(), 6, 15), 'Date#addMonths | 15 July');
  dateEqual(Date.create('31 July'), new Date(now.getFullYear(), 6, 31), 'Date#addMonths | 31 July');
  dateEqual(Date.create('32 July'), new Date(now.getFullYear(), 7, 1), 'Date#addMonths | 32 July');

  dateEqual(Date.create('1 Dec'), new Date(now.getFullYear(), 11, 1), 'Date#addMonths | 1 Dec');
  dateEqual(Date.create('01 Dec'), new Date(now.getFullYear(), 11, 1), 'Date#addMonths | 01 Dec');
  dateEqual(Date.create('15 Dec'), new Date(now.getFullYear(), 11, 15), 'Date#addMonths | 15 Dec');
  dateEqual(Date.create('31 Dec'), new Date(now.getFullYear(), 11, 31), 'Date#addMonths | 31 Dec');

  dateEqual(Date.create('1 December'), new Date(now.getFullYear(), 11, 1), 'Date#addMonths | 1 December');
  dateEqual(Date.create('01 December'), new Date(now.getFullYear(), 11, 1), 'Date#addMonths | 01 December');
  dateEqual(Date.create('15 December'), new Date(now.getFullYear(), 11, 15), 'Date#addMonths | 15 December');
  dateEqual(Date.create('31 December'), new Date(now.getFullYear(), 11, 31), 'Date#addMonths | 31 December');
  dateEqual(Date.create('32 December'), new Date(now.getFullYear() + 1, 0, 1), 'Date#addMonths | 32 December');

  dateEqual(Date.create('1 January 3pm'), new Date(now.getFullYear(), 0, 1, 15), 'Date#addMonths | 1 January 3pm');
  dateEqual(Date.create('1 January 3:45pm'), new Date(now.getFullYear(), 0, 1, 15, 45), 'Date#addMonths | 1 January 3:45pm');


  dateEqual(Date.create("'87"), new Date(1987, 0), "Date#create | '87");
  dateEqual(Date.create("May '87"), new Date(1987, 4), "Date#create | May '87");
  dateEqual(Date.create("14 May '87"), new Date(1987, 4, 14), "Date#create | 14 May '87");

  // Issue #235

  equal(Date.create().utc(true).clone().isUTC(), true, 'Date#clone | should preserve UTC');
  equal(new Date().clone()._utc, false, 'Date#clone | should never be UTC if flag not set');
  equal(Date.create(new Date().utc(true)).isUTC(), true, 'Date#create | should preserve UTC');
  equal(Date.create(new Date()).isUTC(), isCurrentlyGMT, 'Date#create | non utc date should not have UTC flag');


  // Issue #236
  equal((14).hoursFromNow().daysFromNow(), 0, 'Date#daysFromNow | should floor the number rather than round');

  // Issue #224
  equal(Date.create('').isValid(), false, 'Date.create | empty strings are not valid');


  // Issue #244

  dateEqual(Date.utc.create('0999'), new Date(Date.UTC(999, 0)), 'Date.utc.create | 3 digit year 999 should be equal to ISO8601');
  dateEqual(Date.utc.create('0123'), new Date(Date.UTC(123, 0)), 'Date.utc.create | 3 digit year 123 should be equal to ISO8601');

  // Issue #251


  equal(new Date(2013, 0).setISOWeek(1), new Date(2013, 0, 1).getTime(), 'Date#setISOWeek | Should follow ISO8601');
  equal(new Date(2013, 0, 6).setISOWeek(1), new Date(2013, 0, 6).getTime(), 'Date#setISOWeek | Sunday should remain at the end of the week as per ISO8601 standard');
  equal(new Date(2013, 0, 13).setISOWeek(1), new Date(2013, 0, 6).getTime(), 'Date#setISOWeek | Sunday one week ahead');
  equal(new Date(2013, 0, 7).setISOWeek(1), new Date(2012, 11, 31).getTime(), 'Date#setISOWeek | Monday should remain at the beginning of the week as per ISO8601 standard');
  equal(new Date(2013, 0, 14).setISOWeek(2), new Date(2013, 0, 7).getTime(), 'Date#setISOWeek | Monday one week ahead');
  dateEqual(Date.utc.create(2013, 0, 14).utc().set({ week: 1 }), Date.utc.create(2012, 11, 31), 'Date#set | utc dates should not throw errors on week set');


  // Issue #262
  equal(/\d+-/.test(new Date().format('{timezone}')), false, 'Date#format | Timezone format should not include hyphens')


  // Issue #264

  Date.setLocale('fo');
  equal(Date.create().isToday(), true, 'Date#isToday | should always work regardless of locale');
  equal(Date.create('yesterday', 'en').isYesterday(), true, 'Date#isYesterday | should always work regardless of locale');
  equal(Date.create('tomorrow', 'en').isTomorrow(), true, 'Date#isTomorrow | should always work regardless of locale');
  equal(Date.create('monday', 'en').isMonday(), true, 'Date#isMonday | should always work regardless of locale');
  equal(Date.create('tuesday', 'en').isTuesday(), true, 'Date#isTuesday | should always work regardless of locale');
  equal(Date.create('wednesday', 'en').isWednesday(), true, 'Date#isWednesday | should always work regardless of locale');
  equal(Date.create('thursday', 'en').isThursday(), true, 'Date#isThursday | should always work regardless of locale');
  equal(Date.create('friday', 'en').isFriday(), true, 'Date#isFriday | should always work regardless of locale');
  equal(Date.create('saturday', 'en').isSaturday(), true, 'Date#isSaturday | should always work regardless of locale');
  equal(Date.create('sunday', 'en').isSunday(), true, 'Date#isSunday | should always work regardless of locale');
  equal(Date.create('1 day ago', 'en').isPast(), true, 'Date#isPast | should always work regardless of locale');
  equal(Date.create('1 day from now', 'en').isFuture(), true, 'Date#isFuture | should always work regardless of locale');
  Date.setLocale('en');



  // Issue #267

  equal(new Date('Mar 01, 2013').daysUntil(new Date('Mar 28, 2013')), 27, 'Date#daysUntil | should not be phased by DST traversal');
  equal(new Date('Mar 10, 2013').daysUntil(new Date('Mar 11, 2013')), 1, 'Date#daysUntil | exact DST traversal point for CST/CDT');

  // Issue #310

  dateEqual(Date.create('6:30pm in 1 day'), getRelativeDate(null, null, 1).set({hours:18,minutes:30}, true), 'Date#create | 6:30pm in 1 day');
  dateEqual(Date.create('6:30pm in 3 days'), getRelativeDate(null, null, 3).set({hours:18,minutes:30}, true), 'Date#create | 6:30pm in 3 days');
  dateEqual(Date.create('6:30pm in -3 days'), getRelativeDate(null, null, -3).set({hours:18,minutes:30}, true), 'Date#create | 6:30pm in -3 days');

  dateEqual(Date.create('6:30pm 2 days ago'), getRelativeDate(null, null, -2).set({hours:18,minutes:30}, true), 'Date#create | 6:30pm in 2 days ago');

  dateEqual(Date.create('21:00 in 2 weeks'), getRelativeDate(null, null, 14).set({hours:21}, true), 'Date#create | 21:00pm in 2 weeks');
  dateEqual(Date.create('5:00am in a month'), getRelativeDate(null, 1).set({hours:5}, true), 'Date#create | 5:00am in a month');
  dateEqual(Date.create('5am in a month'), getRelativeDate(null, 1).set({hours:5}, true), 'Date#create | 5am in a month');
  dateEqual(Date.create('5:01am in a month'), getRelativeDate(null, 1).set({hours:5,minutes:1}, true), 'Date#create | 5:01am in a month');

  equal(Date.create('5am in an hour').isValid(), false, 'Date#create | 5am in an hour is invalid');
  equal(Date.create('5am in a minute').isValid(), false, 'Date#create | 5am in a minute is invalid');


  // Issue #326 begining/endOfISOWeek


  dateEqual(new Date(2013, 6, 8).beginningOfISOWeek(),  new Date(2013, 6, 8), 'Date#beginningOfISOWeek  | Mon');
  dateEqual(new Date(2013, 6, 9).beginningOfISOWeek(),  new Date(2013, 6, 8), 'Date#beginningOfISOWeek  | Tue');
  dateEqual(new Date(2013, 6, 10).beginningOfISOWeek(), new Date(2013, 6, 8), 'Date#beginningOfISOWeek  | Wed');
  dateEqual(new Date(2013, 6, 11).beginningOfISOWeek(), new Date(2013, 6, 8), 'Date#beginningOfISOWeek  | Thu');
  dateEqual(new Date(2013, 6, 12).beginningOfISOWeek(), new Date(2013, 6, 8), 'Date#beginningOfISOWeek  | Fri');
  dateEqual(new Date(2013, 6, 13).beginningOfISOWeek(), new Date(2013, 6, 8), 'Date#beginningOfISOWeek  | Sat');
  dateEqual(new Date(2013, 6, 14).beginningOfISOWeek(), new Date(2013, 6, 8), 'Date#beginningOfISOWeek  | Sun');
  dateEqual(new Date(2013, 6, 15).beginningOfISOWeek(), new Date(2013, 6, 15), 'Date#beginningOfISOWeek | next Mon');

  dateEqual(new Date(2013, 6, 8).endOfISOWeek(),  new Date(2013, 6, 14, 23, 59, 59, 999), 'Date#endOfISOWeek  | Mon');
  dateEqual(new Date(2013, 6, 9).endOfISOWeek(),  new Date(2013, 6, 14, 23, 59, 59, 999), 'Date#endOfISOWeek  | Tue');
  dateEqual(new Date(2013, 6, 10).endOfISOWeek(), new Date(2013, 6, 14, 23, 59, 59, 999), 'Date#endOfISOWeek  | Wed');
  dateEqual(new Date(2013, 6, 11).endOfISOWeek(), new Date(2013, 6, 14, 23, 59, 59, 999), 'Date#endOfISOWeek  | Thu');
  dateEqual(new Date(2013, 6, 12).endOfISOWeek(), new Date(2013, 6, 14, 23, 59, 59, 999), 'Date#endOfISOWeek  | Fri');
  dateEqual(new Date(2013, 6, 13).endOfISOWeek(), new Date(2013, 6, 14, 23, 59, 59, 999), 'Date#endOfISOWeek  | Sat');
  dateEqual(new Date(2013, 6, 14).endOfISOWeek(), new Date(2013, 6, 14, 23, 59, 59, 999), 'Date#endOfISOWeek  | Sun');
  dateEqual(new Date(2013, 6, 15).endOfISOWeek(), new Date(2013, 6, 21, 23, 59, 59, 999), 'Date#endOfISOWeek | next Mon');

  dateEqual(new Date(2013, 6, 10, 8, 30).beginningOfISOWeek(), new Date(2013, 6, 8), 'Date#beginningOfISOWeek  | resets time');
  dateEqual(new Date(2013, 6, 12, 8, 30).endOfISOWeek(), new Date(2013, 6, 14, 23, 59, 59, 999), 'Date#endOfISOWeek  | resets time');


  // Issue #342 handling offsets for comparison

  Date.SugarNewDate = function() {
    var d = new Date();
    d.addMinutes(d.getTimezoneOffset() - 600);
    // Honolulu time zone
    return d;
  };

  var offset = 600 - new Date().getTimezoneOffset();
  dateEqual(Date.create(), getRelativeDate(null, null, null, null, -offset), 'Date.create | simple create should respect global offset');
  dateEqual(Date.create('1 day ago'), getRelativeDate(null, null, -1, null, -offset), 'Date.create | relative date should respect global offset');
  equal(Date.past('4pm').getTime() < (new Date().getTime() + (-offset * 60 * 1000)), true, 'Date.past | repsects global offset');
  equal(Date.future('4pm').getTime() > (new Date().getTime() + (-offset * 60 * 1000)), true, 'Date.future | repsects global offset');

  d = new Date;
  d.addMinutes(d.getTimezoneOffset() + 60);

  equal(d.isFuture(), true, 'Date#isFuture | should respect global offset');
  equal(d.isPast(), false, 'Date#isPast | should respect global offset');

  // Issue #342 internal constructor override

  var AwesomeDate = function() {};
  AwesomeDate.prototype = new Date();
  AwesomeDate.prototype.getMinutes = function() {
  }

  Date.SugarNewDate = function() {
    return new AwesomeDate();
  }

  equal(Date.create() instanceof AwesomeDate, true, 'Date.SugarNewDate | Result should be use in Date.create');

  Date.SugarNewDate = null;


});

