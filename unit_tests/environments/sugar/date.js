test('Date', function () {


  // Mootools over-stepping itself here with the "create" method implemented as a Function instance method,
  // which interferes with class methods as classes themselves are functions. Taking back this class method
  // for the sake of the tests.
  if(Object.isFunction(Date.create())) {
    Date.sugar('create');
  };


  var day, d, o;
  var timezoneOffset = new Date().getTimezoneOffset();
  var staticWinterTimezoneOffset = new Date(2011, 0, 1).getTimezoneOffset();
  var staticJanDateNumber = 1000 * 60 * 60 * 24 * 14975; // 2011-01-01 00:00:00 
  var staticSummerTimezoneOffset = new Date(2011, 8, 1).getTimezoneOffset();
  var now = new Date();
  var thisYear = now.getFullYear();

  // Invalid date
  equal(new Date('a fridge too far').isValid(), false, 'Date#isValid | new Date invalid');
  equal(new Date().isValid(), true, 'Date#isValid | new Date valid');

  equal(Date.create().isValid(), true, 'Date#isValid | created date is valid');
  equal(Date.create('a fridge too far').isValid(), false, 'Date#isValid | Date#create invalid');


  equal(new Date().isUTC(), timezoneOffset === 0 ? true : false, 'Date#isUTC | UTC is true if the current timezone has no offset');
  // UTC is not if there is a timezone offset, even if the time is reset to the intended utc equivalent, as timezones can never be changed
  equal(new Date(now.getTime()).addMinutes(timezoneOffset).isUTC(), timezoneOffset === 0 ? true : false, 'Date#isUTC | UTC cannot be forced');

  dateEqual(Date.create(), new Date(), 'Date#create | empty');



  // All date modifications are clones

  d = Date.create('1998');

  dateEqual(d.toUTC(), Date.create('1998').addMinutes(timezoneOffset).addMilliseconds(-Date.DSTOffset), 'Date#toUTC | should not affect original date');
  dateEqual(d.toUTC(), Date.create('1998').addMinutes(timezoneOffset).addMilliseconds(-Date.DSTOffset), 'Date#toUTC | should not affect original date');
  dateEqual(d.toUTC().toUTC(), Date.create('1998').addMinutes(timezoneOffset).addMilliseconds(-Date.DSTOffset), 'Date#toUTC | cannot be chained');
  equal(Date.create().toUTC().isUTC(), true, 'Date#isUTC | can be set by toUTC');


  // Date constructor accepts enumerated parameters

  dateEqual(Date.create(1998), new Date(1998), 'Date#create | enumerated | 1998');
  dateEqual(Date.create(1998,1), new Date(1998,1), 'Date#create | enumerated | January, 1998');
  dateEqual(Date.create(1998,1,23), new Date(1998,1,23), 'Date#create | enumerated | January 23, 1998');
  dateEqual(Date.create(1998,1,23,11), new Date(1998,1,23,11), 'Date#create | enumerated | January 23, 1998 11am');
  dateEqual(Date.create(1998,1,23,11,54), new Date(1998,1,23,11,54), 'Date#create | enumerated | January 23, 1998 11:54am');
  dateEqual(Date.create(1998,1,23,11,54,32), new Date(1998,1,23,11,54,32), 'Date#create | enumerated | January 23, 1998 11:54:32');
  dateEqual(Date.create(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,454), 'Date#create | enumerated | January 23, 1998 11:54:32.454');

  dateEqual(Date.create('1998', true), new Date(1998, 0), 'Date#create | will not choke on a boolean as second param');

  // Date constructor accepts an object

  dateEqual(Date.create({ year: 1998 }), new Date(1998, 0), 'Date#create | object | 1998');
  dateEqual(Date.create({ year: 1998, month: 1 }), new Date(1998,1), 'Date#create | object | January, 1998');
  dateEqual(Date.create({ year: 1998, month: 1, day: 23 }), new Date(1998,1,23), 'Date#create | object | January 23, 1998');
  dateEqual(Date.create({ year: 1998, month: 1, day: 23, hour: 11 }), new Date(1998,1,23,11), 'Date#create | object | January 23, 1998 11am');
  dateEqual(Date.create({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }), new Date(1998,1,23,11,54), 'Date#create | object | January 23, 1998 11:54am');
  dateEqual(Date.create({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }), new Date(1998,1,23,11,54,32), 'Date#create | object | January 23, 1998 11:54:32');
  dateEqual(Date.create({ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }), new Date(1998,1,23,11,54,32,454), 'Date#create | object | January 23, 1998 11:54:32.454');


  // DST Offset is properly set
  equal(Date.DSTOffset, (new Date(2001, 6, 1).getTimezoneOffset() - new Date(2000, 0, 1).getTimezoneOffset()) * 60 * 1000, 'Date#DSTOffset | is the correct offset');

  dateEqual(new Date(new Date(2008, 6, 22)), new Date(2008, 6, 22), 'Date | date accepts itself as a constructor');

  dateEqual(Date.create(staticJanDateNumber), new Date(2011, 0, 1, 0, -staticWinterTimezoneOffset) , 'Date#create | Accepts numbers');
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
  dateEqual(Date.create('08/25/0001'), new Date(-62115206400000).toUTC(), 'Date#create | American style slashes | mm/dd/0001');

  // Dashes (American style)
  dateEqual(Date.create('08-25-1978'), new Date(1978, 7, 25), 'Date#create | American style dashes | mm-dd-yyyy');
  dateEqual(Date.create('8-25-1978'), new Date(1978, 7, 25), 'Date#create | American style dashes | m-dd-yyyy');


  // dd-dd-dd is NOT American style as it is a reserved ISO8601 date format
  dateEqual(Date.create('08-05-05'), new Date(2008, 4, 5), 'Date#create | dd-dd-dd is an ISO8601 format');

  // Dots (American style)
  dateEqual(Date.create('08.25.1978'), new Date(1978, 7, 25), 'Date#create | American style dots | mm.dd.yyyy');
  dateEqual(Date.create('8.25.1978'), new Date(1978, 7, 25), 'Date#create | American style dots | m.dd.yyyy');






  // Abbreviated reverse slash format yy/mm/dd cannot exist because it clashes with forward
  // slash format dd/mm/yy (with european variant). This rule however, doesn't follow for dashes,
  // which is abbreviated ISO8601 format: yy-mm-dd
  dateEqual(Date.create('01/02/03'), new Date(2003, 0, 2), 'Date#create | Ambiguous 2 digit format mm/dd/yy');


  Date.allowVariant = true;

  dateEqual(Date.create('08/10'), new Date(thisYear, 9, 8), 'Date#create | European style slashes | dd/mm');
  // Slashes (European style)
  dateEqual(Date.create('8/10'), new Date(thisYear, 9, 8), 'Date#create | European style slashes | d/mm');
  dateEqual(Date.create('08/10/1978'), new Date(1978, 9, 8), 'Date#create | European style slashes | dd/mm/yyyy');
  dateEqual(Date.create('8/10/1978'), new Date(1978, 9, 8), 'Date#create | European style slashes | d/mm/yyyy');
  dateEqual(Date.create('8/10/78'), new Date(1978, 9, 8), 'Date#create | European style slashes | d/mm/yy');
  dateEqual(Date.create('08/10/78'), new Date(1978, 9, 8), 'Date#create | European style slashes | dd/mm/yy');
  dateEqual(Date.create('8/10/01'), new Date(2001, 9, 8), 'Date#create | European style slashes | d/mm/01');
  dateEqual(Date.create('8/10/49'), new Date(2049, 9, 8), 'Date#create | European style slashes | d/mm/49');
  dateEqual(Date.create('8/10/50'), new Date(1950, 9, 8), 'Date#create | European style slashes | d/mm/50');

  // Dashes (European style)
  dateEqual(Date.create('08-10-1978'), new Date(1978, 9, 8), 'Date#create | European style dashes | dd-dd-dd is an ISO8601 format');

  // Dots (European style)
  dateEqual(Date.create('08.10.1978'), new Date(1978, 9, 8), 'Date#create | European style dots | dd.mm.yyyy');
  dateEqual(Date.create('8.10.1978'), new Date(1978, 9, 8), 'Date#create | European style dots | d.mm.yyyy');
  dateEqual(Date.create('08-05-05'), new Date(2008, 4, 5), 'Date#create | dd-dd-dd is an ISO8601 format');



  // Reverse slashes
  dateEqual(Date.create('1978/08/25'), new Date(1978, 7, 25), 'Date#create | Reverse slashes | yyyy/mm/dd');
  dateEqual(Date.create('1978/8/25'), new Date(1978, 7, 25), 'Date#create | Reverse slashes | yyyy/m/dd');
  dateEqual(Date.create('1978/08'), new Date(1978, 7), 'Date#create | Reverse slashes | yyyy/mm');
  dateEqual(Date.create('1978/8'), new Date(1978, 7), 'Date#create | Reverse slashes | yyyy/m');

  // Reverse dashes
  dateEqual(Date.create('1978-08-25'), new Date(1978, 7, 25), 'Date#create | Reverse dashes | yyyy-mm-dd');
  dateEqual(Date.create('1978-08'), new Date(1978, 7), 'Date#create | Reverse dashes | yyyy-mm');
  dateEqual(Date.create('1978-8'), new Date(1978, 7), 'Date#create | Reverse dashes | yyyy-m');

  // Reverse dots
  dateEqual(Date.create('1978.08.25'), new Date(1978, 7, 25), 'Date#create | Reverse dots | yyyy.mm.dd');
  dateEqual(Date.create('1978.08'), new Date(1978, 7), 'Date#create | Reverse dots | yyyy.mm');
  dateEqual(Date.create('1978.8'), new Date(1978, 7), 'Date#create | Reverse dots | yyyy.m');

  dateEqual(Date.create('01-02-03'), new Date(2001, 1, 3), 'Date#create | Ambiguous 2 digit ISO variant yy-mm-dd');

  dateEqual(Date.create('01/02/03'), new Date(2003, 1, 1), 'Date#create | Ambiguous 2 digit European variant dd/mm/yy');
  dateEqual(Date.create('01-02-03'), new Date(2001, 1, 3), 'Date#create | Ambiguous 2 digit ISO variant has NO European variant of its own');
  Date.allowVariant = false;


  // Text based formats
  dateEqual(Date.create('June 2008'), new Date(2008, 5), 'Date#create | Full text | Month yyyy');
  dateEqual(Date.create('June-2008'), new Date(2008, 5), 'Date#create | Full text | Month-yyyy');
  dateEqual(Date.create('June.2008'), new Date(2008, 5), 'Date#create | Full text | Month.yyyy');
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


  dateEqual(Date.create('May-09-78'), new Date(1978, 4, 9), 'Date#create | Abbreviated | Mon.-dd-yy');
  dateEqual(Date.create('Wednesday July 3rd, 2008'), new Date(2008, 6, 3), 'Date#create | Full Text | With day of week');
  dateEqual(Date.create('Wed July 3rd, 2008'), new Date(2008, 6, 3), 'Date#create | Full Text | With day of week');
  dateEqual(Date.create('Wed. July 3rd, 2008'), new Date(2008, 6, 3), 'Date#create | Full Text | With day of week');




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

  dateEqual(Date.create('08-25-1978 12pm'), new Date(1978, 7, 25, 12), 'Date#create | Date/Time | with meridian');
  dateEqual(Date.create('08-25-1978 12:42pm'), new Date(1978, 7, 25, 12, 42), 'Date#create | Date/Time | with minutes and meridian');
  dateEqual(Date.create('08-25-1978 12:42:32pm'), new Date(1978, 7, 25, 12, 42, 32), 'Date#create | Date/Time | with seconds and meridian');
  dateEqual(Date.create('08-25-1978 12:42:32.488pm'), new Date(1978, 7, 25, 12, 42, 32, 488), 'Date#create | Date/Time | with seconds and meridian');

  dateEqual(Date.create('08-25-1978 00:00am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with zero am');
  dateEqual(Date.create('08-25-1978 00:00:00am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with seconds and zero am');
  dateEqual(Date.create('08-25-1978 00:00:00.000am'), new Date(1978, 7, 25, 0, 0, 0, 0), 'Date#create | Date/Time | with milliseconds and zero am');

  dateEqual(Date.create('08-25-1978 1pm'), new Date(1978, 7, 25, 13), 'Date#create | Date/Time | 1pm meridian');
  dateEqual(Date.create('08-25-1978 1:42pm'), new Date(1978, 7, 25, 13, 42), 'Date#create | Date/Time | 1pm minutes and meridian');
  dateEqual(Date.create('08-25-1978 1:42:32pm'), new Date(1978, 7, 25, 13, 42, 32), 'Date#create | Date/Time | 1pm seconds and meridian');
  dateEqual(Date.create('08-25-1978 1:42:32.488pm'), new Date(1978, 7, 25, 13, 42, 32, 488), 'Date#create | Date/Time | 1pm seconds and meridian');

  dateEqual(Date.create('08-25-1978 1am'), new Date(1978, 7, 25, 1), 'Date#create | Date/Time | 1am meridian');
  dateEqual(Date.create('08-25-1978 1:42am'), new Date(1978, 7, 25, 1, 42), 'Date#create | Date/Time | 1am minutes and meridian');
  dateEqual(Date.create('08-25-1978 1:42:32am'), new Date(1978, 7, 25, 1, 42, 32), 'Date#create | Date/Time | 1am seconds and meridian');
  dateEqual(Date.create('08-25-1978 1:42:32.488am'), new Date(1978, 7, 25, 1, 42, 32, 488), 'Date#create | Date/Time | 1am seconds and meridian');

  dateEqual(Date.create('08-25-1978 11pm'), new Date(1978, 7, 25, 23), 'Date#create | Date/Time | 11pm meridian');
  dateEqual(Date.create('08-25-1978 11:42pm'), new Date(1978, 7, 25, 23, 42), 'Date#create | Date/Time | 11pm minutes and meridian');
  dateEqual(Date.create('08-25-1978 11:42:32pm'), new Date(1978, 7, 25, 23, 42, 32), 'Date#create | Date/Time | 11pm seconds and meridian');
  dateEqual(Date.create('08-25-1978 11:42:32.488pm'), new Date(1978, 7, 25, 23, 42, 32, 488), 'Date#create | Date/Time | 11pm seconds and meridian');

  dateEqual(Date.create('08-25-1978 11am'), new Date(1978, 7, 25, 11), 'Date#create | Date/Time | 11am meridian');
  dateEqual(Date.create('08-25-1978 11:42am'), new Date(1978, 7, 25, 11, 42), 'Date#create | Date/Time | 11am minutes and meridian');
  dateEqual(Date.create('08-25-1978 11:42:32am'), new Date(1978, 7, 25, 11, 42, 32), 'Date#create | Date/Time | 11am seconds and meridian');
  dateEqual(Date.create('08-25-1978 11:42:32.488am'), new Date(1978, 7, 25, 11, 42, 32, 488), 'Date#create | Date/Time | 11am seconds and meridian');


  dateEqual(Date.create('2010-11-22T22:59Z'), getUTCDate(2010,11,22,22,59), 'Date#create | ISO8601 | full with UTC timezone');
  dateEqual(Date.create('1997-07-16T19:20+01:00'), getUTCDate(1997, 7, 16, 18, 20), 'Date#create | ISO8601 | minutes with timezone');
  dateEqual(Date.create('1997-07-16T19:20:30+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30), 'Date#create | ISO8601 | seconds with timezone');
  dateEqual(Date.create('1997-07-16T19:20:30.45+01:00'), getUTCDate(1997, 7, 16, 18, 20, 30, 450), 'Date#create | ISO8601 | milliseconds with timezone');
  dateEqual(Date.create('1994-11-05T08:15:30-05:00'), getUTCDate(1994, 11, 5, 13, 15, 30), 'Date#create | ISO8601 | Full example 1');
  dateEqual(Date.create('1994-11-05T13:15:30Z'), getUTCDate(1994, 11, 5, 13, 15, 30), 'Date#create | ISO8601 | Full example 1');

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


  // These are all the same moment...
  dateEqual(Date.create('2001-04-03T18:30Z'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 1');
  dateEqual(Date.create('2001-04-03T22:30+04'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 2');
  dateEqual(Date.create('2001-04-03T1130-0700'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 3');
  dateEqual(Date.create('2001-04-03T15:00-03:30'), getUTCDate(2001,4,3,18,30), 'Date#create | ISO8601 | Synonymous dates with timezone 4');




  // Fuzzy dates
  dateEqual(Date.create('now'), new Date(), 'Date#create | Fuzzy Dates | Now');
  dateEqual(Date.create('today'), new Date(now.getFullYear(), now.getMonth(), now.getDate()), 'Date#create | Fuzzy Dates | Today');
  dateEqual(Date.create('yesterday'), new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), 'Date#create | Fuzzy Dates | Yesterday');
  dateEqual(Date.create('tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), 'Date#create | Fuzzy Dates | Tomorrow');
  dateEqual(Date.create('today at 4pm'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16), 'Date#create | Fuzzy Dates | Today at 4pm');

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

  dateEqual(Date.create('Monday'), getDateWithWeekdayAndOffset(1), 'Date#create | Fuzzy Dates | Monday');
  dateEqual(Date.create('The day after Monday'), getDateWithWeekdayAndOffset(2), 'Date#create | Fuzzy Dates | The day after Monday');
  dateEqual(Date.create('The day before Monday'), getDateWithWeekdayAndOffset(0), 'Date#create | Fuzzy Dates | The day before Monday');
  dateEqual(Date.create('2 days after monday'), getDateWithWeekdayAndOffset(3), 'Date#create | Fuzzy Dates | 2 days after monday');
  dateEqual(Date.create('2 days before monday'), getDateWithWeekdayAndOffset(6, -7), 'Date#create | Fuzzy Dates | 2 days before monday');

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

  dateEqual(Date.create('the beginning of the year'), new Date(now.getFullYear(), 0), 'Date#create | Fuzzy Dates | the beginning of the year');
  dateEqual(Date.create('the beginning of this year'), new Date(now.getFullYear(), 0), 'Date#create | Fuzzy Dates | the beginning of this year');
  dateEqual(Date.create('the beginning of next year'), new Date(now.getFullYear() + 1, 0), 'Date#create | Fuzzy Dates | the beginning of next year');
  dateEqual(Date.create('the beginning of last year'), new Date(now.getFullYear() - 1, 0), 'Date#create | Fuzzy Dates | the beginning of last year');
  dateEqual(Date.create('the end of next year'), new Date(now.getFullYear() + 1, 11, 31, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | the end of next year');
  dateEqual(Date.create('the end of last year'), new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999), 'Date#create | Fuzzy Dates | the end of last year');

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
  dateEqual(Date.create('Midnight tonight'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), 'Date#create | Fuzzy Dates | Midnight tonight');
  dateEqual(Date.create('Noon tomorrow'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12), 'Date#create | Fuzzy Dates | Noon tomorrow');
  dateEqual(Date.create('midnight'), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), 'Date#create | Fuzzy Dates | midnight');
  dateEqual(Date.create('noon'), new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12), 'Date#create | Fuzzy Dates | noon');
  dateEqual(Date.create('midnight wednesday'), getDateWithWeekdayAndOffset(4, 0), 'Date#create | Fuzzy Dates | midnight wednesday');
  dateEqual(Date.create('midnight saturday'), getDateWithWeekdayAndOffset(0, 7), 'Date#create | Fuzzy Dates | midnight saturday');


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
  equal(d.getMonth(), 0, 'Date#set | reset | month');
  equal(d.getDate(), 1, 'Date#set | reset | date');
  equal(d.getHours(), 4, 'Date#set | reset | hours');
  equal(d.getMinutes(), 0, 'Date#set | reset | minutes');
  equal(d.getSeconds(), 0, 'Date#set | reset | seconds');
  equal(d.getMilliseconds(), 0, 'Date#set | reset | milliseconds');


  d = new Date('August 25, 2010 11:45:20');
  d.setUTC({ years: 2008, hours: 4 }, true);

  equal(d.getFullYear(), d.getTimezoneOffset() > 240 ? 2007 : 2008, 'Date#set | reset utc | year');
  equal(d.getMonth(), d.getTimezoneOffset() > 240 ? 11 : 0, 'Date#set | reset utc | month');
  equal(d.getDate(), d.getTimezoneOffset() > 240 ? 31 : 1, 'Date#set | reset utc | date');
  equal(d.getHours(), getHours(4 - (d.getTimezoneOffset() / 60)), 'Date#set | reset utc | hours');
  equal(d.getMinutes(), d.getTimezoneOffset() % 60, 'Date#set | reset utc | minutes');
  equal(d.getSeconds(), 0, 'Date#set | reset utc | seconds');
  equal(d.getMilliseconds(), 0, 'Date#set | reset utc | milliseconds');


  d = new Date('August 25, 2010 11:45:20');
  d.setUTC({ years: 2005, hours: 2 }, false);

  equal(d.getFullYear(), 2005, 'Date#set | no reset utc | year');
  equal(d.getMonth(), 7, 'Date#set | no reset utc | month');
  equal(d.getDate(), d.getTimezoneOffset() >= 135 ? 24 : 25, 'Date#set | no reset utc | date');
  equal(d.getHours(), getHours(2 - (d.getTimezoneOffset() / 60)), 'Date#set | no reset utc | hours');
  equal(d.getMinutes(), 45, 'Date#set | no reset utc | minutes');
  equal(d.getSeconds(), 20, 'Date#set | no reset utc | seconds');
  equal(d.getMilliseconds(), 0, 'Date#set | no reset utc | milliseconds');


  d = new Date('August 25, 2010 11:45:20');
  d.setUTC({ years: 2005, hours: 2 }, false);

  equal(d.getFullYear(), 2005, 'Date#setUTC | no reset | year');
  equal(d.getMonth(), 7, 'Date#setUTC | no reset | month');
  equal(d.getDate(), d.getTimezoneOffset() >= 135 ? 24 : 25, 'Date#setUTC | no reset | date');
  equal(d.getHours(), getHours(2 - (d.getTimezoneOffset() / 60)), 'Date#setUTC | no reset | hours');
  equal(d.getMinutes(), 45, 'Date#setUTC | no reset | minutes');
  equal(d.getSeconds(), 20, 'Date#setUTC | no reset | seconds');
  equal(d.getMilliseconds(), 0, 'Date#setUTC | no reset | milliseconds');


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


  d = new Date('August 25, 2010 11:45:20');

  equal(d.getUTCWeekday(), 3, 'Date#getUTCWeekday | wednesday');

  d.setUTCWeekday(0);
  equal(d.getDate(), 22, 'Date#setUTCWeekday | sunday');
  d.setUTCWeekday(1);
  equal(d.getDate(), 23, 'Date#setUTCWeekday | monday');
  d.setUTCWeekday(2);
  equal(d.getDate(), 24, 'Date#setUTCWeekday | tuesday');
  d.setUTCWeekday(3);
  equal(d.getDate(), 25, 'Date#setUTCWeekday | wednesday');
  d.setUTCWeekday(4);
  equal(d.getDate(), 26, 'Date#setUTCWeekday | thursday');
  d.setUTCWeekday(5);
  equal(d.getDate(), 27, 'Date#setUTCWeekday | friday');
  d.setUTCWeekday(6);
  equal(d.getDate(), 28, 'Date#setUTCWeekday | saturday');


  d.setDate(12);
  equal(d.getWeekday(), 4, 'Date#getWeekday | Thursday');
  equal(d.getUTCWeekday(), 4, 'Date#setUTCWeekday | Thursday');

  d.setDate(13);
  equal(d.getWeekday(), 5, 'Date#getWeekday | Friday');
  equal(d.getUTCWeekday(), 5, 'Date#setUTCWeekday | Friday');

  d.setDate(14);
  equal(d.getWeekday(), 6, 'Date#getWeekday | Saturday');
  equal(d.getUTCWeekday(), 6, 'Date#setUTCWeekday | Saturday');

  d.setDate(15);
  equal(d.getWeekday(), 0, 'Date#getWeekday | Sunday');
  equal(d.getUTCWeekday(), 0, 'Date#setUTCWeekday | Sunday');

  d.setDate(16);
  equal(d.getWeekday(), 1, 'Date#getWeekday | Monday');
  equal(d.getUTCWeekday(), 1, 'Date#setUTCWeekday | Monday');

  d.setDate(17);
  equal(d.getWeekday(), 2, 'Date#getWeekday | Tuesday');
  equal(d.getUTCWeekday(), 2, 'Date#setUTCWeekday | Tuesday');

  d.setDate(18);
  equal(d.getWeekday(), 3, 'Date#getWeekday | Wednesday');
  equal(d.getUTCWeekday(), 3, 'Date#setUTCWeekday | Wednesday');


  dateEqual(new Date().advance({ weekday: 7 }), new Date(), 'Date#advance | cannot advance by weekdays');
  dateEqual(new Date().rewind({ weekday: 7 }), new Date(), 'Date#advance | cannot rewind by weekdays');


  var d = new Date(2010, 11, 31, 24, 59, 59);

  equal(d.getWeekday(), d.getDay(), 'Date#getWeekday | equal to getDay');
  equal(d.getUTCWeekday(), d.getUTCDay(), 'Date#getUTCWeekday | equal to getUTCDay');


  d = new Date('August 25, 2010 11:45:20');

  equal(d.getUTCWeekday(), 3, 'Date#getUTCWeekday | wednesday');

  d.setUTCWeekday(0);
  equal(d.getDate(), 22, 'Date#setUTCWeekday | sunday');
  d.setUTCWeekday(1);
  equal(d.getDate(), 23, 'Date#setUTCWeekday | monday');
  d.setUTCWeekday(2);
  equal(d.getDate(), 24, 'Date#setUTCWeekday | tuesday');
  d.setUTCWeekday(3);
  equal(d.getDate(), 25, 'Date#setUTCWeekday | wednesday');
  d.setUTCWeekday(4);
  equal(d.getDate(), 26, 'Date#setUTCWeekday | thursday');
  d.setUTCWeekday(5);
  equal(d.getDate(), 27, 'Date#setUTCWeekday | friday');
  d.setUTCWeekday(6);
  equal(d.getDate(), 28, 'Date#setUTCWeekday | saturday');

  d.setUTCWeekday();
  equal(d.getDate(), 28, 'Date#setUTCWeekday | undefined');


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




  d = new Date('August 25, 2010 11:45:20');
  d.setWeek(1);
  dateEqual(d, new Date(2010,0,8,11,45,20), 'Date#setWeek | week 1');
  d.setWeek(15);
  dateEqual(d, new Date(2010,3,16,11,45,20), 'Date#setWeek | week 15');
  d.setWeek(27);
  dateEqual(d, new Date(2010,6,9,11,45,20), 'Date#setWeek | week 27');
  d.setWeek(52);
  dateEqual(d, new Date(2010,11,31,11,45,20), 'Date#setWeek | week 52');
  d.setWeek();
  dateEqual(d, new Date(2010,11,31,11,45,20), 'Date#setWeek | week stays set');


  // Date formatting. Much thanks to inspiration taken from Date.js here.
  // I quite like the formatting patterns in Date.js, however there are a few
  // notable limitations. One example is a format such as 4m23s which would have
  // to be formatted as mmss and wouldn't parse at all without special massaging.
  // Going to take a different tack here with a format that's more explicit and
  // easy to remember, if not quite as terse and elegant.


  d = new Date('August 5, 2010 13:45:02');


  equal(d.format('{ms}'), '000', 'Date#format | custom formats | ms');
  equal(d.format('{millisec}'), '0', 'Date#format | custom formats | millisec');
  equal(d.format('{millisecond}'), '0', 'Date#format | custom formats | millisecond');
  equal(d.format('{milliseconds}'), '0', 'Date#format | custom formats | milliseconds');
  equal(d.format('{s}'), '2', 'Date#format | custom formats | s');
  equal(d.format('{ss}'), '02', 'Date#format | custom formats | ss');
  equal(d.format('{sec}'), '2', 'Date#format | custom formats | sec');
  equal(d.format('{second}'), '2', 'Date#format | custom formats | second');
  equal(d.format('{seconds}'), '2', 'Date#format | custom formats | seconds');
  equal(d.format('{m}'), '45', 'Date#format | custom formats | m');
  equal(d.format('{mm}'), '45', 'Date#format | custom formats | mm');
  equal(d.format('{min}'), '45', 'Date#format | custom formats | min');
  equal(d.format('{minute}'), '45', 'Date#format | custom formats | minute');
  equal(d.format('{minutes}'), '45', 'Date#format | custom formats | minutes');
  equal(d.format('{h}'), '13', 'Date#format | custom formats | h');
  equal(d.format('{hh}'), '13', 'Date#format | custom formats | hh');
  equal(d.format('{hour}'), '13', 'Date#format | custom formats | hour');
  equal(d.format('{hours}'), '13', 'Date#format | custom formats | hours');
  equal(d.format('{24hr}'), '13', 'Date#format | custom formats | 24hr');
  equal(d.format('{12hr}'), '1', 'Date#format | custom formats | 12hr');
  equal(d.format('{d}'), '5', 'Date#format | custom formats | d');
  equal(d.format('{dd}'), '05', 'Date#format | custom formats | dd');
  equal(d.format('{date}'), '5', 'Date#format | custom formats | date');
  equal(d.format('{day}'), '5', 'Date#format | custom formats | day');
  equal(d.format('{days}'), '5', 'Date#format | custom formats | days');
  equal(d.format('{dow}'), 'thu', 'Date#format | custom formats | dow');
  equal(d.format('{Dow}'), 'Thu', 'Date#format | custom formats | Dow');
  equal(d.format('{weekday short}'), 'thu', 'Date#format | custom formats | weekday short');
  equal(d.format('{weekday short}'), 'thu', 'Date#format | custom formats | weekday short');
  equal(d.format('{weekday}'), 'thursday', 'Date#format | custom formats | weekday');
  equal(d.format('{Weekday short}'), 'Thu', 'Date#format | custom formats | Weekday short');
  equal(d.format('{Weekday}'), 'Thursday', 'Date#format | custom formats | Weekday');
  equal(d.format('{M}'), '8', 'Date#format | custom formats | M');
  equal(d.format('{MM}'), '08', 'Date#format | custom formats | MM');
  equal(d.format('{Month short}'), 'Aug', 'Date#format | custom formats | Month short');
  equal(d.format('{month short}'), 'aug', 'Date#format | custom formats | month short');
  equal(d.format('{month}'), 'august', 'Date#format | custom formats | month');
  equal(d.format('{Month short}'), 'Aug', 'Date#format | custom formats | Month short');
  equal(d.format('{Mon}'), 'Aug', 'Date#format | custom formats | Mon');
  equal(d.format('{Month}'), 'August', 'Date#format | custom formats | Month');
  equal(d.format('{yy}'), '10', 'Date#format | custom formats | yy');
  equal(d.format('{yyyy}'), '2010', 'Date#format | custom formats | yyyy');
  equal(d.format('{year}'), '2010', 'Date#format | custom formats | year');
  equal(d.format('{Year}'), '2010', 'Date#format | custom formats | Year');
  equal(d.format('{t}'), 'p', 'Date#format | custom formats | t');
  equal(d.format('{T}'), 'P', 'Date#format | custom formats | T');
  equal(d.format('{tt}'), 'pm', 'Date#format | custom formats | tt');
  equal(d.format('{TT}'), 'PM', 'Date#format | custom formats | TT');
  equal(d.format('{ord}'), '5th', 'Date#format | custom formats | ord');


  d = new Date('August 5, 2010 04:03:02');

  equal(d.format('{min pad}'), '03', 'Date#format | custom formats | min pad');
  equal(d.format('{m pad}'), '03', 'Date#format | custom formats | m pad');
  equal(d.format('{d pad}'), '05', 'Date#format | custom formats | d pad');
  equal(d.format('{date pad}'), '05', 'Date#format | custom formats | days pad');
  equal(d.format('{h pad}'), '04', 'Date#format | custom formats | h pad');
  equal(d.format('{hours pad}'), '04', 'Date#format | custom formats | hours pad');
  equal(d.format('{s pad}'), '02', 'Date#format | custom formats | s pad');
  equal(d.format('{sec pad}'), '02', 'Date#format | custom formats | sec pad');
  equal(d.format('{seconds pad}'), '02', 'Date#format | custom formats | seconds pad');


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


  // Be VERY careful here. Timezone offset is NOT always guaranteed to be the same for a given timezone,
  // as DST may come into play.
  var offset = d.getTimezoneOffset();
  var isotzd = Math.round(-offset / 60).pad(2, true) + ':' + (offset % 60).pad(2);
  var tzd = isotzd.replace(/:/, '');
  if(d.isUTC()) {
    isotzd = 'Z';
    tzd = '+0000';
  }

  equal(d.getUTCOffset(), tzd, 'Date#getUTCOffset | no colon');
  equal(d.getUTCOffset(true), isotzd, 'Date#getUTCOffset | colon');

  equal(d.format(Date.INTERNATIONAL_TIME), '4:03:02', 'Date#format | constants | INTERNATIONAL_TIME');
  equal(d.format(Date.ISO8601_DATE), '2010-08-05', 'Date#format | constants | ISO8601_DATE');
  equal(d.format(Date.ISO8601_DATETIME), '2010-08-05T04:03:02.000'+isotzd, 'Date#format | constants | ISO8601_DATETIME');


  equal(d.format('INTERNATIONAL_TIME'), '4:03:02', 'Date#format | string constants | INTERNATIONAL_TIME');
  equal(d.format('ISO8601_DATE'), '2010-08-05', 'Date#format | string constants | ISO8601_DATE');
  equal(d.format('ISO8601_DATETIME'), '2010-08-05T04:03:02.000'+isotzd, 'Date#format | constants | ISO8601_DATETIME');

  var iso = d.getUTCFullYear()+'-'+(d.getUTCMonth()+1).pad(2)+'-'+d.getUTCDate().pad(2)+'T'+d.getUTCHours().pad(2)+':'+d.getUTCMinutes().pad(2)+':'+d.getUTCSeconds().pad(2)+'.'+d.getUTCMilliseconds().pad(3)+'Z';

  equal(d.toUTC().format(Date.ISO8601_DATETIME), iso, 'Date#format | constants | ISO8601_DATETIME UTC HOLY');
  equal(d.toUTC().format(Date.ISO8601), iso, 'Date#format | constants | ISO8601 UTC');
  equal(d.toUTC().format('ISO8601_DATETIME'), iso, 'Date#format | string constants | ISO8601_DATETIME UTC');
  equal(d.toUTC().format('ISO8601'), iso, 'Date#format | string constants | ISO8601 UTC');


  var rfc1123 = getWeekdayFromDate(d).to(3).capitalize()+', '+d.getDate().pad(2)+' '+getMonthFromDate(d).to(3).capitalize()+' '+d.getFullYear()+' '+d.getHours().pad(2)+':'+d.getMinutes().pad(2)+':'+d.getSeconds().pad(2)+' GMT'+d.getUTCOffset();
  var rfc1036 = getWeekdayFromDate(d).capitalize()+', '+d.getDate().pad(2)+'-'+getMonthFromDate(d).to(3).capitalize()+'-'+d.getFullYear().toString().slice(2)+' '+d.getHours().pad(2)+':'+d.getMinutes().pad(2)+':'+d.getSeconds().pad(2)+' GMT'+d.getUTCOffset();
  equal(d.format(Date.RFC1123), rfc1123, 'Date#format | constants | RFC1123');
  equal(d.format(Date.RFC1036), rfc1036, 'Date#format | constants | RFC1036');
  equal(d.format('RFC1123'), rfc1123, 'Date#format | string constants | RFC1123');
  equal(d.format('RFC1036'), rfc1036, 'Date#format | string constants | RFC1036');


  rfc1123 = getWeekdayFromDate(d,true).to(3).capitalize()+', '+d.getUTCDate().pad(2)+' '+getMonthFromDate(d,true).to(3).capitalize()+' '+d.getUTCFullYear()+' '+d.getUTCHours().pad(2)+':'+d.getUTCMinutes().pad(2)+':'+d.getUTCSeconds().pad(2)+' GMT+0000';
  rfc1036 = getWeekdayFromDate(d,true).capitalize()+', '+d.getUTCDate().pad(2)+'-'+getMonthFromDate(d,true).to(3).capitalize()+'-'+d.getUTCFullYear().toString().slice(2)+' '+d.getUTCHours().pad(2)+':'+d.getUTCMinutes().pad(2)+':'+d.getUTCSeconds().pad(2)+' GMT+0000';
  equal(d.toUTC().format('RFC1123'), rfc1123, 'Date#format | string constants | RFC1123 UTC');
  equal(d.toUTC().format('RFC1036'), rfc1036, 'Date#format | string constants | RFC1036 UTC');


  raisesError(function(){ Date.create('totally invalid').format(); }, 'Date#format | null format raises a type error');
  equal(Date.create('totally invalid').format(Date.ISO8601_DATETIME), 'Invalid Date', 'Date#format | invalid');



  // ISO format

  equal(d.toISOString(), d.toUTC().format(Date.ISO8601_DATETIME), 'Date#toISOString is an alias for the ISO8601_DATETIME format in UTC');
  equal(d.iso(), d.toUTC().format(Date.ISO8601_DATETIME), 'Date#iso is an alias for the ISO8601_DATETIME format in UTC');




  // relative time formatting

  equal(Date.create().format('relative'), '1 second ago', 'Date#format | relative | now');
  equal(Date.create('234 milliseconds ago').format('relative'), '1 second ago', 'Date#format | relative | 234 milliseconds');
  equal(Date.create('6234 milliseconds ago').format('relative'), '6 seconds ago', 'Date#format | relative | 6 milliseconds');
  equal(Date.create('6 seconds ago').format('relative'), '6 seconds ago', 'Date#format | relative | 6 seconds');
  equal(Date.create('360 seconds ago').format('relative'), '6 minutes ago', 'Date#format | relative | 360 seconds');
  equal(Date.create('360 minutes ago').format('relative'), '6 hours ago', 'Date#format | relative | minutes');
  equal(Date.create('360 hours ago').format('relative'), '2 weeks ago', 'Date#format | relative | hours');
  equal(Date.create('360 days ago').format('relative'), '11 months ago', 'Date#format | relative | days');
  equal(Date.create('360 weeks ago').format('relative'), '6 years ago', 'Date#format | relative | weeks');
  equal(Date.create('360 months ago').format('relative'), '30 years ago', 'Date#format | relative | months');
  equal(Date.create('360 years ago').format('relative'), '360 years ago', 'Date#format | relative | years');
  equal(Date.create('12 months ago').format('relative'), '1 year ago', 'Date#format | relative | 12 months ago');

  equal(Date.create('6234 milliseconds from now').format('relative'), '6 seconds from now', 'Date#format | relative future | 6 milliseconds');
  equal(Date.create('361 seconds from now').format('relative'), '6 minutes from now', 'Date#format | relative future | 360 seconds');
  equal(Date.create('361 minutes from now').format('relative'), '6 hours from now', 'Date#format | relative future | minutes');
  equal(Date.create('360 hours from now').format('relative'), '2 weeks from now', 'Date#format | relative future | hours');
  equal(Date.create('360 days from now').format('relative'), '11 months from now', 'Date#format | relative future | days');
  equal(Date.create('360 weeks from now').format('relative'), '6 years from now', 'Date#format | relative future | weeks');
  equal(Date.create('360 months from now').format('relative'), '30 years from now', 'Date#format | relative future | months');
  equal(Date.create('360 years from now').format('relative'), '360 years from now', 'Date#format | relative future | years');
  equal(Date.create('13 months from now').format('relative'), '1 year from now', 'Date#format | relative future | 12 months ago');


  skipEnvironments(['mootools'], function() {

    var dyn = function(value, unit, ms, dir) {
      if(ms > (1).year()) {
      return '{Month} {date}, {year}';
    } else {
      return 'relative';
    }
  }

  equal(Date.create('5 minutes ago').format(dyn), '5 minutes ago', 'Date#format | relative fn | 5 minutes should stay relative');
  equal(Date.create('13 months ago').format(dyn), Date.create('13 months ago').format('{Month} {date}, {year}'), 'Date#format | relative fn | higher reverts to absolute');

  // globalize system with plurals

  var strings = {
    second: '秒',
    seconds: '秒達',
    minute: '分',
    minutes: '分達',
    hour: '時間',
    hours: '時間達',
    day: '日',
    days: '日達',
    week: '週間',
    weeks: '週間達',
    month: '月',
    months: '月達',
    year: '年',
    years: '年達'
  }

  dyn = function(value, unit, ms, dir) {
    equal(value, 5, 'Date#format | relative fn | 5 minutes ago | value is the closest relevant value');
    equal(unit, 'minutes', 'Date#format | relative fn | 5 minutes ago | unit is the closest relevant unit');
    equalWithMargin(ms, 300000, 10, 'Date#format | relative fn | 5 minutes ago | ms is the offset in ms');
    equal(dir, -1, 'Date#format | relative fn | 5 minutes ago | dir indicates the offset from "now", negative if in the past');
    return value + strings[unit] + (dir < 0 ? '前' : '後');
  }

  equal(Date.create('5 minutes ago').format(dyn), '5分達前', 'Date#format | relative fn | 5 minutes ago');


  dyn = function(value, unit, ms, dir) {
    equal(value, 1, 'Date#format | relative fn | 1 minute from now | value is the closest relevant value');
    equal(unit, 'minute', 'Date#format | relative fn | 1 minute from now | unit is the closest relevant unit');
    equalWithMargin(ms, 61000, 5, 'Date#format | relative fn | 1 minute from now | ms is the offset in ms');
    equal(dir, 1, 'Date#format | relative fn | 1 minute from now | dir indicates the offset from "now", negative if in the past');
    return value + strings[unit] + (dir < 0 ? '前' : '後');
  }

  equal(Date.create('61 seconds from now').format(dyn), '1分後', 'Date#format | relative fn | 1 minute from now');



  dyn = function(value, unit, ms, dir) {
    equal(value, 4, 'Date#format | relative fn | 4 hours ago | value is the closest relevant value');
    equal(unit, 'hours', 'Date#format | relative fn | 4 hours ago | unit is the closest relevant unit');
    equalWithMargin(ms, 14400000, 10, 'Date#format | relative fn | 4 hours ago | ms is the offset in ms');
    equal(dir, -1, 'Date#format | relative fn | 4 hours ago | dir indicates the offset from "now", negative if in the past');
    return value + strings[unit] + (dir < 0 ? '前' : '後');
  }

  equal(Date.create('240 minutes ago').format(dyn), '4時間達前', 'Date#format | relative fn | 4 hours ago');

  Date.create('223 milliseconds ago').format(function(value, unit) {
    equalWithMargin(value, 223, 10, 'Date format | relative fn | still passes < 1 second');
    equal(unit, 'milliseconds', 'Date format | relative fn | still passes "millisecond"');
  });

  equal(Date.create('300 minutes ago').format(function() {}), '5 hours ago', 'Date#format | function that returns undefined defaults to "relative"');

  });


  equal(Date.create('6234 milliseconds ago').relative(), '6 seconds ago', 'Date#relative | relative | 6 milliseconds');
  equal(Date.create('6 seconds ago').relative(), '6 seconds ago', 'Date#relative | relative | 6 seconds');
  equal(Date.create('360 seconds ago').relative(), '6 minutes ago', 'Date#relative | relative | 360 seconds');
  equal(Date.create('360 minutes ago').relative(), '6 hours ago', 'Date#relative | relative | minutes');
  equal(Date.create('360 hours ago').relative(), '2 weeks ago', 'Date#relative | relative | hours');
  equal(Date.create('360 days ago').relative(), '11 months ago', 'Date#relative | relative | days');
  equal(Date.create('360 weeks ago').relative(), '6 years ago', 'Date#relative | relative | weeks');
  equal(Date.create('360 months ago').relative(), '30 years ago', 'Date#relative | relative | months');
  equal(Date.create('360 years ago').relative(), '360 years ago', 'Date#relative | relative | years');
  equal(Date.create('12 months ago').relative(), '1 year ago', 'Date#relative | relative | 12 months ago');

  equal(Date.create('6234 milliseconds from now').relative(), '6 seconds from now', 'Date#relative | relative future | 6 milliseconds');
  equal(Date.create('361 seconds from now').relative(), '6 minutes from now', 'Date#relative | relative future | 360 seconds');
  equal(Date.create('361 minutes from now').relative(), '6 hours from now', 'Date#relative | relative future | minutes');
  equal(Date.create('360 hours from now').relative(), '2 weeks from now', 'Date#relative | relative future | hours');
  equal(Date.create('360 days from now').relative(), '11 months from now', 'Date#relative | relative future | days');
  equal(Date.create('360 weeks from now').relative(), '6 years from now', 'Date#relative | relative future | weeks');
  equal(Date.create('360 months from now').relative(), '30 years from now', 'Date#relative | relative future | months');
  equal(Date.create('360 years from now').relative(), '360 years from now', 'Date#relative | relative future | years');
  equal(Date.create('13 months from now').relative(), '1 year from now', 'Date#relative | relative future | 12 months ago');


  equal(Date.create('13 months from now').relative(function(value, unit) {
    return value + ' ' + unit;
  }), '1 year', 'Date#relative | relative future | 12 months ago');


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
  equal(Date.create('tuesday').is('the beginning of the week'), false, 'Date#is | tuesday is the end of the week');
  equal(Date.create('tuesday').is('the end of the week'), false, 'Date#is | tuesday is the end of the week');

  equal(Date.create('sunday').is('the beginning of the week'), true, 'Date#is | sunday is the beginning of the week');
  equal(Date.create('sunday').is('the beginning of the week'), true, 'Date#is | sunday is the beginning of the week');

  equal(Date.create('tuesday').is('tuesday'), true, 'Date#is | tuesday is tuesday');
  equal(Date.create('sunday').is('sunday'), true, 'Date#is | sunday is sunday');
  equal(Date.create('saturday').is('saturday'), true, 'Date#is | saturday is saturday');

  equal(getDateWithWeekdayAndOffset(0).is('the beginning of the week'), true, 'Date#is | the beginning of the week');
  equal(getDateWithWeekdayAndOffset(6, 0, 23, 59, 59, 999).is('the end of the week'), true, 'Date#is | the end of the week');

  equal(new Date(2011, 0, 1, 0, -staticWinterTimezoneOffset).is(staticJanDateNumber), true, 'Date#is | Accepts numbers');



  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,431)), false, 'Date#is | accuracy | accurate to millisecond by default');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432)), true, 'Date#is | accuracy |  accurate to millisecond by default');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,433)), false, 'Date#is | accuracy | accurate to millisecond by default');

  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,431), 2), true, 'Date#is | accuracy | accuracy can be overridden');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 2), true, 'Date#is | accuracy | accuracy can be overridden');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,433), 2), true, 'Date#is | accuracy | accuracy can be overridden');
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

  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1971,4,15,22,3,1,432), 31536000000), true, 'Date#is | accuracy | accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,14,22,3,2,432), 31536000000), false, 'Date#is | accuracy | accurate to a year is still contstrained');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1971,4,16,22,3,1,432), 31536000000), false, 'Date#is | accuracy | accurate to a year is still contstrained');



  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 'day'), true, 'Date#is | string accuracy | accurate to a day');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,23,3,1,432), 'day'), true, 'Date#is | string accuracy | accurate to a day');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,21,3,1,432), 'day'), true, 'Date#is | string accuracy | accurate to a day');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,14,22,3,1,432), 'day'), true, 'Date#is | string accuracy | accurate to a day');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,16,22,3,1,432), 'day'), true, 'Date#is | string accuracy | accurate to a day');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,14,22,3,1,431), 'day'), false, 'Date#is | string accuracy | accurate to a day is still contstrained');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,16,22,3,1,433), 'day'), false, 'Date#is | string accuracy | accurate to a day is still contstrained');

  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 'year'), true, 'Date#is | string accuracy | accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,15,22,3,1,432), 'year'), true, 'Date#is | string accuracy | accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1970,4,15,22,3,1,432), 'year'), true, 'Date#is | string accuracy | accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,15,22,3,1,432), 'year'), true, 'Date#is | string accuracy | accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1971,4,15,22,3,1,432), 'year'), true, 'Date#is | string accuracy | accurate to a year');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1969,4,14,22,3,2,432), 'year'), false, 'Date#is | string accuracy | accurate to a year is still contstrained');
  equal(new Date(1970,4,15,22,3,1,432).is(new Date(1971,4,16,22,3,1,432), 'year'), false, 'Date#is | string accuracy | accurate to a year is still contstrained');









  // Note that relative #is formats can only be considered to be accurate to within a few milliseconds
  // to avoid complications rising from the date being created momentarily after the function is called.
  equal(getRelativeDate(null,null,null,null,null,null, -5).is('3 milliseconds ago'), false, 'Date#is | 3 milliseconds ago is accurate to milliseconds');
  equal(getRelativeDate(null,null,null,null,null,null, -5).is('5 milliseconds ago', 5), true, 'Date#is | 5 milliseconds ago is accurate to milliseconds');
  equal(getRelativeDate(null,null,null,null,null,null, -5).is('7 milliseconds ago'), false, 'Date#is | 7 milliseconds ago is accurate to milliseconds');

  equal(getRelativeDate(null,null,null,null,null,-5).is('4 seconds ago'), false, 'Date#is | 4 seconds ago is accurate to seconds');
  equal(getRelativeDate(null,null,null,null,null,-5).is('5 seconds ago'), true, 'Date#is | 5 seconds ago is accurate to seconds');
  equal(getRelativeDate(null,null,null,null,null,-5).is('6 seconds ago'), false, 'Date#is | 6 seconds ago is accurate to seconds');

  equal(getRelativeDate(null,null,null,null,-5).is('4 minutes ago'), false, 'Date#is | 4 minutes ago is accurate to minutes');
  equal(getRelativeDate(null,null,null,null,-5).is('5 minutes ago'), true, 'Date#is | 5 minutes ago is accurate to minutes');
  equal(getRelativeDate(null,null,null,null,-5).is('6 minutes ago'), false, 'Date#is | 6 minutes ago is accurate to minutes');

  equal(getRelativeDate(null,null,null,-5).is('4 hours ago'), false, 'Date#is | 4 hours ago is accurate to hours');
  equal(getRelativeDate(null,null,null,-5).is('5 hours ago'), true, 'Date#is | 5 hours ago is accurate to hours');
  equal(getRelativeDate(null,null,null,-5).is('6 hours ago'), false, 'Date#is | 6 hours ago is accurate to hours');

  equal(getRelativeDate(null,null,-5).is('4 days ago'), false, 'Date#is | 4 days ago is accurate to days');
  equal(getRelativeDate(null,null,-5).is('5 days ago'), true, 'Date#is | 5 days ago is accurate to days');
  equal(getRelativeDate(null,null,-5).is('6 days ago'), false, 'Date#is | 6 days ago is accurate to days');

  equal(getRelativeDate(null,-5).is('4 months ago'), false, 'Date#is | 4 months ago is accurate to months');
  equal(getRelativeDate(null,-5).is('5 months ago'), true, 'Date#is | 5 months ago is accurate to months');
  equal(getRelativeDate(null,-5).is('6 months ago'), false, 'Date#is | 6 months ago is accurate to months');

  equal(getRelativeDate(-5).is('4 years ago'), false, 'Date#is | 4 years ago is accurate to years');
  equal(getRelativeDate(-5).is('5 years ago'), true, 'Date#is | 5 years ago is accurate to years');
  equal(getRelativeDate(-5).is('6 years ago'), false, 'Date#is | 6 years ago is accurate to years');



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

  equal(Date.create('3 hours ago').is('now', 'day'), true, 'Date#is | accepts string precision');
  equal(Date.create('3 hours ago').is('now', 'bloopie'), false, 'Date#is | does not die on bad string-based precision');


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

  equal(d.getWeek(), 31, 'Date#getWeek | basic');
  equal(getDST(d).getUTCWeek(), staticSummerTimezoneOffset > 615 ? 32 : 31, 'Date#getUTCWeek | basic');

  equal(new Date(2010, 0, 1).getWeek(), 1, 'Date#getWeek | January 1st');
  equal(new Date(2010, 0, 1).getUTCWeek(), staticWinterTimezoneOffset >= 0 ? 1 : 53, 'Date#getUTCWeek | January 1st UTC is actually 2009');
  equal(new Date(2010, 0, 6).getWeek(), 1, 'Date#getWeek | January 6th');
  equal(new Date(2010, 0, 6).getUTCWeek(), 1, 'Date#getUTCWeek | January 6th');
  equal(new Date(2010, 0, 7).getWeek(), 1, 'Date#getWeek | January 7th');
  equal(new Date(2010, 0, 7).getUTCWeek(), 1, 'Date#getUTCWeek | January 7th');
  equal(new Date(2010, 0, 7, 23, 59, 59, 999).getWeek(), 1, 'Date#getWeek | January 7th 23:59:59.999');
  equal(new Date(2010, 0, 7, 23, 59, 59, 999).getUTCWeek(), staticWinterTimezoneOffset > 0 ? 2 : 1, 'Date#getUTCWeek | January 7th 23:59:59.999');
  equal(new Date(2010, 0, 8).getWeek(), 2, 'Date#getWeek | January 8th');
  equal(new Date(2010, 0, 8).getUTCWeek(), staticWinterTimezoneOffset >= 0 ? 2 : 1, 'Date#getUTCWeek | January 8th');
  equal(new Date(2010, 3, 15).getWeek(), 15, 'Date#getWeek | April 15th');
  equal(new Date(2010, 3, 15).getUTCWeek(), 15, 'Date#getUTCWeek | April 15th');




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


  // Works with Date.create?
  equal(getDST(d).millisecondsSince('the last day of 2011'), -44273697458, 'Date#millisecondsSince | milliseconds since the last day of 2011');
  equal(getDST(d).millisecondsUntil('the last day of 2011'), 44273697458, 'Date#millisecondsUntil | milliseconds until the last day of 2011');
  equal(getDST(d).secondsSince('the last day of 2011'), -44273697, 'Date#secondsSince | seconds since the last day of 2011');
  equal(getDST(d).secondsUntil('the last day of 2011'), 44273697, 'Date#secondsUntil | seconds until the last day of 2011');
  equal(getDST(d).minutesSince('the last day of 2011'), -737895, 'Date#minutesSince | minutes since the last day of 2011');
  equal(getDST(d).minutesUntil('the last day of 2011'), 737895, 'Date#minutesUntil | minutes until the last day of 2011');
  equal(getDST(d).hoursSince('the last day of 2011'), -12298, 'Date#hoursSince | hours since the last day of 2011');
  equal(getDST(d).hoursUntil('the last day of 2011'), 12298, 'Date#hoursUntil | hours until the last day of 2011');
  equal(getDST(d).daysSince('the last day of 2011'), -512, 'Date#daysSince | days since the last day of 2011');
  equal(getDST(d).daysUntil('the last day of 2011'), 512, 'Date#daysUntil | days until the last day of 2011');
  equal(getDST(d).weeksSince('the last day of 2011'), -73, 'Date#weeksSince | weeks since the last day of 2011');
  equal(getDST(d).weeksUntil('the last day of 2011'), 73, 'Date#weeksUntil | weeks until the last day of 2011');
  equal(getDST(d).monthsSince('the last day of 2011'), -17, 'Date#monthsSince | months since the last day of 2011');
  equal(getDST(d).monthsUntil('the last day of 2011'), 17, 'Date#monthsUntil | months until the last day of 2011');
  equal(getDST(d).yearsSince('the last day of 2011'), -1, 'Date#yearsSince | years since the last day of 2011');
  equal(getDST(d).yearsUntil('the last day of 2011'), 1, 'Date#yearsUntil | years until the last day of 2011');



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

  equal((secSince <= actualSecSince + 1) && (secSince >= actualSecSince - 1), true, 'Date#secondsSince | seconds since last week');
  equal((secUntil <= actualSecUntil + 1) && (secUntil >= actualSecUntil - 1), true, 'Date#secondsUntil | seconds until last week');

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


  dateEqual(new Date(d).beginningOfDay(false), new Date(2012, 1, 29, 0, 0, 0), 'Date#beginningOfDay | no time reset on day level makes no sense');
  dateEqual(new Date(d).beginningOfWeek(false), new Date(2012, 1, 26, 22, 15, 42), 'Date#beginningOfWeek | do not reset time | February 29, 2012');
  dateEqual(new Date(d).beginningOfMonth(false), new Date(2012, 1, 1, 22, 15, 42), 'Date#beginningOfMonth | do not reset time | February 29, 2012');
  dateEqual(new Date(d).beginningOfYear(false), new Date(2012, 0, 1, 22, 15, 42), 'Date#beginningOfYear | do not reset time | February 29, 2012');

  dateEqual(new Date(d).endOfDay(false), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfDay | no time reset on day level makes no sense');
  dateEqual(new Date(d).endOfWeek(false), new Date(2012, 2, 3, 22, 15, 42), 'Date#endOfWeek | do not reset time | February 29, 2012');
  dateEqual(new Date(d).endOfMonth(false), new Date(2012, 1, 29, 22, 15, 42), 'Date#endOfMonth | do not reset time | February 29, 2012');
  dateEqual(new Date(d).endOfYear(false), new Date(2012, 11, 31, 22, 15, 42), 'Date#endOfYear | do not reset time | February 29, 2012');


  dateEqual(new Date(d).beginningOfDay(true), new Date(2012, 1, 29), 'Date#beginningOfDay | reset if true | February 29, 2012');
  dateEqual(new Date(d).beginningOfWeek(true), new Date(2012, 1, 26), 'Date#beginningOfWeek | reset if true | February 29, 2012');
  dateEqual(new Date(d).beginningOfMonth(true), new Date(2012, 1), 'Date#beginningOfMonth | reset if true | February 29, 2012');
  dateEqual(new Date(d).beginningOfYear(true), new Date(2012, 0), 'Date#beginningOfYear | reset if true | February 29, 2012');

  dateEqual(new Date(d).endOfDay(true), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfDay | reset if true | February 29, 2012');
  dateEqual(new Date(d).endOfWeek(true), new Date(2012, 2, 3, 23, 59, 59, 999), 'Date#endOfWeek | reset if true | February 29, 2012');
  dateEqual(new Date(d).endOfMonth(true), new Date(2012, 1, 29, 23, 59, 59, 999), 'Date#endOfMonth | reset if true | February 29, 2012');
  dateEqual(new Date(d).endOfYear(true), new Date(2012, 11, 31, 23, 59, 59, 999), 'Date#endOfYear | reset if true | February 29, 2012');



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


  d = new Date('February 29, 2012 22:15:42');

  dUTC = new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000));

  dateEqual(d.toUTC(), dUTC, 'Date#utc');




  d = new Date('February 29, 2012 22:15:42');

  dateEqual(d.resetTime(), new Date(2012, 1, 29), 'Date#resetTime | Clears time');


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
  equal(d.isWeekday(), true, 'Date#isWeekday | 2 years from now');
  equal(d.isWeekend(), false, 'Date#isWeekend | 2 years from now');
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

  equal(getDateWithWeekdayAndOffset(0).isLastWeek(), false, 'Date#isLastWeek | this week sunday');
  equal(getDateWithWeekdayAndOffset(0).isThisWeek(), true, 'Date#isThisWeek | this week sunday');
  equal(getDateWithWeekdayAndOffset(0).isNextWeek(), false, 'Date#isNextWeek | this week sunday');

  equal(getDateWithWeekdayAndOffset(6).isLastWeek(), false, 'Date#isLastWeek | this week friday');
  equal(getDateWithWeekdayAndOffset(6).isThisWeek(), true, 'Date#isThisWeek | this week friday');
  equal(getDateWithWeekdayAndOffset(6).isNextWeek(), false, 'Date#isNextWeek | this week friday');

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

  equal(new Date(1999,5).isAfter('1999'), false, 'Date#isAfter | June 1999 is not after 1999 in general');
  equal(getRelativeDate(1).isAfter('tomorrow'), true, 'Date#isAfter | relative | next year');
  equal(getRelativeDate(null, 1).isAfter('tomorrow'), true, 'Date#isAfter | relative | next month');
  equal(getRelativeDate(null, null, 1).isAfter('tomorrow'), false, 'Date#isAfter | relative | tomorrow');

  equal(getDateWithWeekdayAndOffset(0).isAfter('monday'), false, 'Date#isAfter | relative | sunday');
  equal(getDateWithWeekdayAndOffset(2).isAfter('monday'), true, 'Date#isAfter | relative | tuesday');
  equal(getDateWithWeekdayAndOffset(0,7).isAfter('monday'), true, 'Date#isAfter | relative | next week sunday');
  equal(getDateWithWeekdayAndOffset(0,-7).isAfter('monday'), false, 'Date#isAfter | relative | last week sunday');
  equal(getDateWithWeekdayAndOffset(0).isAfter('the beginning of this week'), false, 'Date#isAfter | relative | the beginning of this week');
  equal(getDateWithWeekdayAndOffset(0).isAfter('the beginning of last week'), true, 'Date#isAfter | relative | the beginning of last week');
  equal(getDateWithWeekdayAndOffset(0).isAfter('the end of this week'), false, 'Date#isAfter | relative | the end of this week');

  equal(new Date(2001,1,23).isAfter(new Date(2000,1,24), 24 * 60 * 60 * 1000), true, 'Date#isAfter | buffers work');
  equal(new Date(1999,1).isAfter({ year: 1999 }), false, 'Date#isAfter | February 1999 should not be after 1999 in general');



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

  equal(new Date(1999,1).isBetween({ year: 1998 }, { year: 1999 }), true, 'Date#isBetween | object | 1998 - 1999');
  equal(new Date(1999,1).isBetween({ year: 1998 }, { year: 1997 }), false, 'Date#isBetween | object | 1998 - 1997');
  equal(new Date(1998,2).isBetween({ year: 1998, month: 1 }, { year: 1998, month: 3 }), true, 'Date#isBetween | object | March, 1998 is between February, 1998 and April, 1998');
  equal(new Date(1998,2).isBetween({ year: 1998, month: 0 }, { year: 1998, month: 1 }), false, 'Date#isBetween | object | March, 1998 is between January, 1998 and February, 1998');

  equal(new Date(1999,1).isBetween('1998', '1999'), true, 'Date#isBetween | string | 1998 - 1999');
  equal(new Date(1999,1).isBetween('1998', '1997'), false, 'Date#isBetween | string | 1998 - 1997');
  equal(new Date(1998,2).isBetween('February, 1998', 'April, 1998'), true, 'Date#isBetween | string | March, 1998 is between February, 1998 and April, 1998');
  equal(new Date(1998,2).isBetween('January, 1998', 'February, 1998'), false, 'Date#isBetween | string | March, 1998 is not between January, 1998 and February, 1998');

  equal(new Date(1999,5).isBetween('1998','1999'), true, 'Date#isBetween | Any ambiguous period "reaches" as much as it can.');
  equal(new Date().isBetween('yesterday','tomorrow'), true, 'Date#isBetween | relative | now is between today and tomorrow');
  equal(getRelativeDate(1).isBetween('yesterday','tomorrow'), false, 'Date#isBetween | relative | last year is between today and tomorrow');
  equal(getRelativeDate(null, 1).isBetween('yesterday','tomorrow'), false, 'Date#isBetween | relative | last month is between today and tomorrow');
  equal(getRelativeDate(null, null, 1).isBetween('today','tomorrow'), true, 'Date#isBetween | relative | tomorrow is between today and tomorrow');

  equal(getDateWithWeekdayAndOffset(0).isBetween('monday', 'friday'), false, 'Date#isBetween | relative | sunday is between monday and friday');
  equal(getDateWithWeekdayAndOffset(2).isBetween('monday', 'friday'), true, 'Date#isBetween | relative | tuesday is between monday and friday');
  equal(getDateWithWeekdayAndOffset(0,7).isBetween('monday', 'friday'), false, 'Date#isBetween | relative | next week sunday is between monday and friday');
  equal(getDateWithWeekdayAndOffset(0,-7).isBetween('monday', 'friday'), false, 'Date#isBetween | relative | last week sunday is between monday and friday');
  equal(getDateWithWeekdayAndOffset(0).isBetween('the beginning of this week','the beginning of last week'), false, 'Date#isBetween | relative | sunday is between the beginning of this week and the beginning of last week');
  equal(getDateWithWeekdayAndOffset(0).isBetween('the beginning of this week','the beginning of next week'), false, 'Date#isBetween | relative | sunday is between the beginning of this week and the beginning of next week');
  equal(getDateWithWeekdayAndOffset(0).isBetween('the beginning of last week','the beginning of next week'), true, 'Date#isBetween | relative | sunday is between the beginning of last week and the beginning of next week');
  equal(getDateWithWeekdayAndOffset(0).isBetween('the beginning of last week','the end of this week'), true, 'Date#isBetween | relative | sunday is between the beginning of last week and the end of this week');



  dateEqual(Date.create().rewind((1).day()), new Date(new Date().getTime() - 86400000), 'Date#rewind | can rewind milliseconds');
  dateEqual(Date.create().advance((1).day()), new Date(new Date().getTime() + 86400000), 'Date#advance | can advance milliseconds');

  equal(Date.create().beginningOfWeek().isLastWeek(), false, 'Date#isLastWeek | the beginning of this week is not last week');

  dateEqual(Date.create().set(0), new Date(0), 'Date#set | handles timestamps');



  var date1 = Date.create('July 4th, 1776');
  var date2 = date1.clone().beginningOfYear();

  equal(date2.getMonth(), 0, 'Date#clone | cloned element is reset to January');
  equal(date1.getMonth(), 6, 'Date#clone | source element is reset to unchanged');

  date1 = Date.create('invalid');
  date2 = date1.clone();

  equal(date1.isValid(), false, 'Date#clone | source element is invalid');
  equal(date2.isValid(), false, 'Date#clone | cloned element is also invalid');

});
