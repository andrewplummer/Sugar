'use strict';

namespace('Date', function () {

  beforeAll(() => {
    // Set system time to 2020-01-01
    setSystemTime(new Date(2020, 0));
    Intl.DateTimeFormat.mockDefaultLocale('en-US');
  });

  afterEach(() => {
    resetTimeZone();
    resetSystemTime();
  });

  const WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  describe('Enhanced Chainable', () => {

    it('should default to current date', () => {
      assertDateEqual(new Sugar.Date().raw, new Date());
    });

    it('should pass irregular input to constructor', () => {
      assertDateEqual(new Sugar.Date(null).raw, new Date(null));
      assertDateEqual(new Sugar.Date(undefined).raw, new Date(undefined));
      assertDateEqual(new Sugar.Date(NaN).raw, new Date(NaN));
    });

    it('should be able to create from timestamp', () => {
      assertDateEqual(new Sugar.Date(Date.now()).raw, new Date(2020, 0));
    });

    it('should be able to create from enumerated arguments', () => {
      assertDateEqual(
        new Sugar.Date(2019, 1, 5, 23, 59, 59, 999).raw,
        new Date(2019, 1, 5, 23, 59, 59, 999)
      );
    });

    it('should enhance chainable with date parsing', () => {
      assertDateEqual(new Sugar.Date('tomorrow').raw, new Date(2020, 0, 2));
    });

    it('should be able to pass a locale code', () => {
      assertDateEqual(new Sugar.Date('8/10', 'en-US').raw, new Date(2020, 7, 10));
      assertDateEqual(new Sugar.Date('8/10', 'en-GB').raw, new Date(2020, 9, 8));
    });

  });

  describeStatic('create', function (create) {

    describe('Numeric formats', () => {

      describe('ISO-8601', () => {

        it('should parse various levels of specificity', () => {
          assertDateEqual(create('2010'), new Date(2010, 0));
          assertDateEqual(create('2010-11'), new Date(2010, 10));
          assertDateEqual(create('2010-11-22'), new Date(2010, 10, 22));
          assertDateEqual(create('2010-11-22T22'), new Date(2010, 10, 22, 22));
          assertDateEqual(create('2010-11-22T22:59'), new Date(2010, 10, 22, 22, 59));
          assertDateEqual(create('2010-11-22T22:59:55'), new Date(2010, 10, 22, 22, 59, 55));
          assertDateEqual(create('2010-11-22T22:59:55.400'), new Date(2010, 10, 22, 22, 59, 55, 400));

          assertDateEqual(create('2001-1-1'),    new Date(2001, 0, 1));
          assertDateEqual(create('2001-01-1'),   new Date(2001, 0, 1));
          assertDateEqual(create('2001-01-01'),  new Date(2001, 0, 1));
          assertDateEqual(create('2010-11-22'),  new Date(2010, 10, 22));
        });

        it('should parse without timezone offset', () => {
          assertDateEqual(create('2011-10-10T14:48:00'), new Date(2011, 9, 10, 14, 48));
        });

        it('should parse with timezone offset', () => {

          mockTimeZone(-540); // GMT+09:00
          assertDateEqual(create('2011-10-10T14:48:00+09:00'), new Date(2011, 9, 10, 14, 48));
          assertDateEqual(create('2011-10-10T14:48:00+02:00'), new Date(2011, 9, 10, 21, 48));
          assertDateEqual(create('2011-10-10T14:48:00+00:00'), new Date(2011, 9, 10, 23, 48));
          assertDateEqual(create('2011-10-10T14:48:00-05:00'), new Date(2011, 9, 11, 4, 48));

          mockTimeZone(300); // GMT-05:00
          assertDateEqual(create('2011-10-10T14:48:00+09:00'), new Date(2011, 9, 10, 0, 48));
          assertDateEqual(create('2011-10-10T14:48:00+02:00'), new Date(2011, 9, 10, 7, 48));
          assertDateEqual(create('2011-10-10T14:48:00+00:00'), new Date(2011, 9, 10, 9, 48));
          assertDateEqual(create('2011-10-10T14:48:00-05:00'), new Date(2011, 9, 10, 14, 48));

          assertDateEqual(create('1997-07-16T19:20+00:00'), new Date(1997, 6, 16, 14, 20));
          assertDateEqual(create('1997-07-16T19:20+01:00'), new Date(1997, 6, 16, 13, 20));
          assertDateEqual(create('1997-07-16T19:20:30+01:00'), new Date(1997, 6, 16, 13, 20, 30));
          assertDateEqual(create('1997-07-16T19:20:30.45+01:00'), new Date(1997, 6, 16, 13, 20, 30, 450));
          assertDateEqual(create('1994-11-05T08:15:30-05:00'), new Date(1994, 10, 5, 8, 15, 30));
          assertDateEqual(create('1994-11-05T08:15:30-05:00'), new Date(1994, 10, 5, 8, 15, 30));
          assertDateEqual(create('1776-05-23T02:45:08-08:30'), new Date(1776, 4, 23, 5, 15, 8));
          assertDateEqual(create('1776-05-23T02:45:08+08:30'), new Date(1776, 4, 22, 13, 15, 8));
          assertDateEqual(create('2001-04-03T15:00-03:30'), new Date(2001, 3, 3, 12, 30));
        });

        it('should parse with hour only timezone offset', () => {
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(create('2001-04-03T22:30+04'), new Date(2001, 3, 3, 13, 30));
          assertDateEqual(create('2001-04-03T22+04'), new Date(2001, 3, 3, 13));
        });

        it('should parse ISO8601 format with zulu offset', () => {
          mockTimeZone(-540); // GMT+09:00
          assertDateEqual(create('2000-01-02T12:34:56Z'), new Date(2000, 0, 2, 21, 34, 56));
          assertDateEqual(create('2000-01-02T12:34:56.789Z'), new Date(2000, 0, 2, 21, 34, 56, 789));
          assertDateEqual(create('2000-01-02T12:34:56.789012Z'), new Date(2000, 0, 2, 21, 34, 56, 789));

          mockTimeZone(300); // GMT-05:00
          assertDateEqual(create('2000-01-02T12:34:56Z'), new Date(2000, 0, 2, 7, 34, 56));
          assertDateEqual(create('2000-01-02T12:34:56.789Z'), new Date(2000, 0, 2, 7, 34, 56, 789));
          assertDateEqual(create('2000-01-02T12:34:56.789012Z'), new Date(2000, 0, 2, 7, 34, 56, 789));

          assertDateEqual(create('2010Z'), new Date(2009, 11, 31, 19));
          assertDateEqual(create('2010-11Z'), new Date(2010, 9, 31, 19));
          assertDateEqual(create('2010-11-22Z'), new Date(2010, 10, 21, 19));

          assertDateEqual(create('2010-11-22T22Z'), new Date(2010, 10, 22, 17));
          assertDateEqual(create('2010-11-22T22:59Z'), new Date(2010, 10, 22, 17, 59));
          assertDateEqual(create('2010-11-22T22:59:55Z'), new Date(2010, 10, 22, 17, 59, 55));
          assertDateEqual(create('2010-11-22T22:59:55.400Z'), new Date(2010, 10, 22, 17, 59, 55, 400));

          assertDateEqual(create('1994-11-05T13:15:30Z'), new Date(1994, 10, 5, 8, 15, 30));
          assertDateEqual(create('2001-04-03T18:30Z'), new Date(2001, 3, 3, 13, 30));
        });

        it('should parse basic format', () => {
          assertDateEqual(create('1776'), new Date(1776, 0));
          assertDateEqual(create('177605'), new Date(1776, 4));
          assertDateEqual(create('17760523'), new Date(1776, 4, 23));
          assertDateEqual(create('17760523T02'), new Date(1776, 4, 23, 2));
          assertDateEqual(create('17760523T0245'), new Date(1776, 4, 23, 2, 45));
          assertDateEqual(create('17760523T024508'), new Date(1776, 4, 23, 2, 45, 8));
          assertDateEqual(create('20101122'), new Date(2010, 10, 22));

          mockTimeZone(300); // GMT-05:00
          assertDateEqual(create('17760523T024508+0830'), new Date(1776, 4, 22, 13, 15, 8));
          assertDateEqual(create('1776-05-23T02:45:08-0830'), new Date(1776, 4, 23, 5, 15, 8));
          assertDateEqual(create('1776-05-23T02:45:08+0830'), new Date(1776, 4, 22, 13, 15, 8));
          assertDateEqual(create('2001-04-03T1130-0700'), new Date(2001, 3, 3, 13, 30));
        });

        it('should handle U+2212 MINUS SIGN for offset', () => {
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(create('1994-11-05T08:15:30−05:00'), new Date(1994, 10, 5, 8, 15, 30));
        });

        it('should allow up to 6 decimal points in fractional seconds', () => {
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(create('1997-07-16T19:20:30.4+01:00'), new Date(1997, 6, 16, 13, 20, 30, 400));
          assertDateEqual(create('1997-07-16T19:20:30.46+01:00'), new Date(1997, 6, 16, 13, 20, 30, 460));
          assertDateEqual(create('1997-07-16T19:20:30.462+01:00'), new Date(1997, 6, 16, 13, 20, 30, 462));
          assertDateEqual(create('1997-07-16T19:20:30.4628+01:00'), new Date(1997, 6, 16, 13, 20, 30, 463));
          assertDateEqual(create('1997-07-16T19:20:30.46284+01:00'), new Date(1997, 6, 16, 13, 20, 30, 463));
        });

        it('should sign in years', () => {
          assertDateEqual(create('-0002-07-26'), new Date(-2, 6, 26));
          assertDateEqual(create('+1978-04-17'), new Date(1978, 3, 17));
        });

        it('should allow years up to 6 digits', () => {
          assertDateEqual(create('-10000-05-05'), new Date(-10000, 4, 5));
          assertDateEqual(create('+10000-05-05'), new Date(10000, 4, 5));

          assertDateEqual(create('-100000-05-05'), new Date(-100000, 4, 5));
          assertDateEqual(create('+100000-05-05'), new Date(100000, 4, 5));
        });

        it('should handle .NET format', () => {
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(create('2012-04-23T07:58:42.7940000z'), new Date(2012, 3, 23, 2, 58, 42, 794));
        });

        it('should handle decimals in lowest order time elements', () => {
          assertDateEqual(create('1997-07-16T14:30:40.5'), new Date(1997, 6, 16, 14, 30, 40, 500));
          assertDateEqual(create('1997-07-16T14:30.5'),    new Date(1997, 6, 16, 14, 30, 30));
          assertDateEqual(create('1997-07-16T14.5'), new Date(1997, 6, 16, 14, 30));
        });

        it('should handle comma decimals in lowest order time elements', () => {
          assertDateEqual(create('1997-07-16T14:30:40,5'), new Date(1997, 6, 16, 14, 30, 40, 500));
          assertDateEqual(create('1997-07-16T14:30,5'),    new Date(1997, 6, 16, 14, 30, 30));
          assertDateEqual(create('1997-07-16T14,5'), new Date(1997, 6, 16, 14, 30));
        });

        it('should parse 24 hours', () => {
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(create('2012-05-03T24:00:00Z'), new Date(2012, 4, 3, 19));
        });

        it('should parse leap seconds', () => {
          // The ISO-8601 spec allows for leap seconds, however ECMAScript does not.
          // However, date set methods are still allowed to overshoot, so allow this
          // format to be parsed.
          mockTimeZone(0); // GMT+00:00
          assertDateEqual(create('1998-12-31T23:59:60Z'), new Date(1999, 0));
        });

      });

      it('should parse year last slash format', () => {
        assertDateEqual(create('07/12/2009'), new Date(2009, 6, 12));
        assertDateEqual(create('7/12/2009'), new Date(2009, 6, 12));
        assertDateEqual(create('07/12/2009 12:34'), new Date(2009, 6, 12, 12, 34));
        assertDateEqual(create('07/12/2009 12:34:56'), new Date(2009, 6, 12, 12, 34, 56));
        assertDateEqual(create('07/12/2009 12:34:56.789'), new Date(2009, 6, 12, 12, 34, 56, 789));
        assertDateEqual(create('08/25/1978 12:04'), new Date(1978, 7, 25, 12, 4));
        assertDateEqual(create('08-25-1978 12:04'), new Date(1978, 7, 25, 12, 4));
      });

      it('should parse year first hyphen format', () => {
        assertDateEqual(create('2009-7-12'), new Date(2009, 6, 12));
        assertDateEqual(create('2009-07-12'), new Date(2009, 6, 12));
        assertDateEqual(create('2009-07-12 12:34'), new Date(2009, 6, 12, 12, 34));
        assertDateEqual(create('2009-07-12 12:34:56'), new Date(2009, 6, 12, 12, 34, 56));
        assertDateEqual(create('1978-08-25'), new Date(1978, 7, 25));
        assertDateEqual(create('1978-08'), new Date(1978, 7));
        assertDateEqual(create('1978-8'), new Date(1978, 7));
      });

      it('should parse year first slash format', () => {
        assertDateEqual(create('2009/07/12'), new Date(2009, 6, 12));
        assertDateEqual(create('2009/7/12'), new Date(2009, 6, 12));
        assertDateEqual(create('2009/07/12 12:34'), new Date(2009, 6, 12, 12, 34));
        assertDateEqual(create('2009/07/12 12:34:56'), new Date(2009, 6, 12, 12, 34, 56));
        assertDateEqual(create('2009/07/12 12:34:56.789'), new Date(2009, 6, 12, 12, 34, 56, 789));
        assertDateEqual(create('1978/08/25'), new Date(1978, 7, 25));
        assertDateEqual(create('1978/8/25'), new Date(1978, 7, 25));
        assertDateEqual(create('1978/08'), new Date(1978, 7));
        assertDateEqual(create('1978/8'), new Date(1978, 7));
        assertDateEqual(create('1978/08/25 12:04'), new Date(1978, 7, 25, 12, 4));
      });

      it('should parse year first period format', () => {
        assertDateEqual(create('1978.08.25'), new Date(1978, 7, 25));
        assertDateEqual(create('1978.08'), new Date(1978, 7));
        assertDateEqual(create('1978.8'), new Date(1978, 7));
      });

      it('should parse year last period format', () => {
        assertDateEqual(create('4.15.2016'), new Date(2016, 3, 15));
      });

      it('should parse year last hyphen format', () => {
        assertDateEqual(create('1-1-2012'), new Date(2012, 0, 1));
        assertDateEqual(create('1-1-12'), new Date(2012, 0, 1));
        assertDateEqual(create('1/1/12'), new Date(2012, 0, 1));
        assertDateEqual(create('1-1-12 11:12'), new Date(2012, 0, 1, 11, 12));
        assertDateEqual(create('1/1/12 11:12'), new Date(2012, 0, 1, 11, 12));
        assertDateEqual(create('1-1-12 11:12:34.567'), new Date(2012, 0, 1, 11, 12, 34, 567));
        assertDateEqual(create('1/1/12 11:12:34.567'), new Date(2012, 0, 1, 11, 12, 34, 567));

        assertDateEqual(create('08-25-1978 12:04:57'), new Date(1978, 7, 25, 12, 4, 57));
        assertDateEqual(create('08-25-1978 12:04:57.322'), new Date(1978, 7, 25, 12, 4, 57, 322));

        assertDateEqual(create('08-25-1978 12pm'), new Date(1978, 7, 25, 12));
        assertDateEqual(create('08-25-1978 12:42pm'), new Date(1978, 7, 25, 12, 42));
        assertDateEqual(create('08-25-1978 12:42:32pm'), new Date(1978, 7, 25, 12, 42, 32));
        assertDateEqual(create('08-25-1978 12:42:32.488pm'), new Date(1978, 7, 25, 12, 42, 32, 488));

        assertDateEqual(create('08-25-1978 00:00am'), new Date(1978, 7, 25, 0, 0, 0, 0));
        assertDateEqual(create('08-25-1978 00:00:00am'), new Date(1978, 7, 25, 0, 0, 0, 0));
        assertDateEqual(create('08-25-1978 00:00:00.000am'), new Date(1978, 7, 25, 0, 0, 0, 0));

        assertDateEqual(create('08-25-1978 1pm'), new Date(1978, 7, 25, 13));
        assertDateEqual(create('08-25-1978 1:42pm'), new Date(1978, 7, 25, 13, 42));
        assertDateEqual(create('08-25-1978 1:42:32pm'), new Date(1978, 7, 25, 13, 42, 32));
        assertDateEqual(create('08-25-1978 1:42:32.488pm'), new Date(1978, 7, 25, 13, 42, 32, 488));

        assertDateEqual(create('08-25-1978 1am'), new Date(1978, 7, 25, 1));
        assertDateEqual(create('08-25-1978 1:42am'), new Date(1978, 7, 25, 1, 42));
        assertDateEqual(create('08-25-1978 1:42:32am'), new Date(1978, 7, 25, 1, 42, 32));
        assertDateEqual(create('08-25-1978 1:42:32.488am'), new Date(1978, 7, 25, 1, 42, 32, 488));

        assertDateEqual(create('08-25-1978 11pm'), new Date(1978, 7, 25, 23));
        assertDateEqual(create('08-25-1978 11:42pm'), new Date(1978, 7, 25, 23, 42));
        assertDateEqual(create('08-25-1978 11:42:32pm'), new Date(1978, 7, 25, 23, 42, 32));
        assertDateEqual(create('08-25-1978 11:42:32.488pm'), new Date(1978, 7, 25, 23, 42, 32, 488));

        assertDateEqual(create('08-25-1978 11am'), new Date(1978, 7, 25, 11));
        assertDateEqual(create('08-25-1978 11:42am'), new Date(1978, 7, 25, 11, 42));
        assertDateEqual(create('08-25-1978 11:42:32am'), new Date(1978, 7, 25, 11, 42, 32));
        assertDateEqual(create('08-25-1978 11:42:32.488am'), new Date(1978, 7, 25, 11, 42, 32, 488));
      });

      it('should parse month and date', () => {
        assertDateEqual(create('1/2'), new Date(2020, 0, 2));
        assertDateEqual(create('1-2'), new Date(2020, 0, 2));
      });

      it('should parse ISO8601 format regardless of locale', () => {
        mockTimeZone(300); // GMT-05:00
        assertDateEqual(create('2020-01-01T00:00:00', 'ja-JP'), new Date(2020, 0, 1));
        assertDateEqual(create('2020-01-01T00:00:00Z', 'ja-JP'), new Date(2019, 11, 31, 19));
        assertDateEqual(create('2020-01-01T00:00:00-10:00', 'ja-JP'), new Date(2020, 0, 1, 5));
      });

      it('should handle Issue #219', () => {
        assertDateEqual(create('23:00'), new Date(2020, 0, 1, 23));
        assertDateEqual(create('24:00'), new Date(2020, 0, 2, 0));
        assertDateEqual(create('25:00'), new Date(2020, 0, 2, 1));
        assertDateEqual(create('29:00'), new Date(2020, 0, 2, 5));
        assertDateEqual(create('05:59:59'), new Date(2020, 0, 1, 5, 59, 59));
        assertUndefined(create('30:00'));
        assertUndefined(create('139:00'));
      });

    });

    describe('DateTime formats', () => {

      it('should parse basic date with time', () => {
        assertDateEqual(create('June 1, 2020 10:00 AM'), new Date(2020, 5, 1, 10));
        assertDateEqual(create('June 1, 2020 8:00pm'), new Date(2020, 5, 1, 20));
        assertDateEqual(create('May 23 2020 16:00'), new Date(2020, 4, 23, 16));
        assertDateEqual(create('January 13th, 2016'), new Date(2016, 0, 13));
      });

      it('should parse time with hours only', () => {
        assertDateEqual(create('10 AM'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10 PM'), new Date(2020, 0, 1, 22));
        assertDateEqual(create('10 am'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10 pm'), new Date(2020, 0, 1, 22));
        assertDateEqual(create('10am'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10pm'), new Date(2020, 0, 1, 22));
      });

      it('should parse 24-hour time with minutes', () => {
        assertDateEqual(create('10:00'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('22:00'), new Date(2020, 0, 1, 22));
      });

      it('should parse 12-hour time with minutes and day period', () => {
        assertDateEqual(create('10:00 AM'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10:00 PM'), new Date(2020, 0, 1, 22));
        assertDateEqual(create('10:00 am'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10:00 pm'), new Date(2020, 0, 1, 22));
        assertDateEqual(create('10:00am'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10:00pm'), new Date(2020, 0, 1, 22));
      });

      it('should parse long month', () => {
        assertDateEqual(create('January'), new Date(2020, 0));
        assertDateEqual(create('February'), new Date(2020, 1));
        assertDateEqual(create('March'), new Date(2020, 2));
        assertDateEqual(create('April'), new Date(2020, 3));
        assertDateEqual(create('May'), new Date(2020, 4));
        assertDateEqual(create('June'), new Date(2020, 5));
        assertDateEqual(create('July'), new Date(2020, 6));
        assertDateEqual(create('August'), new Date(2020, 7));
        assertDateEqual(create('September'), new Date(2020, 8));
        assertDateEqual(create('October'), new Date(2020, 9));
        assertDateEqual(create('November'), new Date(2020, 10));
        assertDateEqual(create('December'), new Date(2020, 11));
      });

      it('should parse long month and date', () => {
        assertDateEqual(create('January 15th'), new Date(2020, 0, 15));
        assertDateEqual(create('February 15th'), new Date(2020, 1, 15));
        assertDateEqual(create('March 15th'), new Date(2020, 2, 15));
        assertDateEqual(create('April 15th'), new Date(2020, 3, 15));
        assertDateEqual(create('May 15th'), new Date(2020, 4, 15));
        assertDateEqual(create('June 15th'), new Date(2020, 5, 15));
        assertDateEqual(create('July 15th'), new Date(2020, 6, 15));
        assertDateEqual(create('August 15th'), new Date(2020, 7, 15));
        assertDateEqual(create('September 15th'), new Date(2020, 8, 15));
        assertDateEqual(create('October 15th'), new Date(2020, 9, 15));
        assertDateEqual(create('November 15th'), new Date(2020, 10, 15));
        assertDateEqual(create('December 15th'), new Date(2020, 11, 15));
      });

      it('should parse long weekday', () => {
        assertDateEqual(create('Sunday'), new Date(2019, 11, 29));
        assertDateEqual(create('Monday'), new Date(2019, 11, 30));
        assertDateEqual(create('Tuesday'), new Date(2019, 11, 31));
        assertDateEqual(create('Wednesday'), new Date(2020, 0, 1));
        assertDateEqual(create('Thursday'), new Date(2020, 0, 2));
        assertDateEqual(create('Friday'), new Date(2020, 0, 3));
        assertDateEqual(create('Saturday'), new Date(2020, 0, 4));
      });

      it('should parse a standalone date', () => {
        assertDateEqual(create('the 15th'), new Date(2020, 0, 15));
        assertDateEqual(create('the 15th of the month'), new Date(2020, 0, 15));
      });

      it('should parse long month and year', () => {
        assertDateEqual(create('June 2008'), new Date(2008, 5));
        assertDateEqual(create('February, 1998'),  new Date(1998, 1));
      });

      it('should parse long month with date and year', () => {
        assertDateEqual(create('June 1, 2020'), new Date(2020, 5));
      });

      it('should parse long month with initial date and year', () => {
        assertDateEqual(create('15 July, 2008'),   new Date(2008, 6, 15));
        assertDateEqual(create('15 July 2008'),    new Date(2008, 6, 15));
      });

      it('should parse date with English ordinal suffix', () => {
        assertDateEqual(create('June 1st, 2008'),  new Date(2008, 5, 1));
        assertDateEqual(create('June 2nd, 2008'),  new Date(2008, 5, 2));
        assertDateEqual(create('June 3rd, 2008'),  new Date(2008, 5, 3));
        assertDateEqual(create('June 4th, 2008'),  new Date(2008, 5, 4));
        assertDateEqual(create('June 15th, 2008'), new Date(2008, 5, 15));
        assertDateEqual(create('June 1st 2008'),   new Date(2008, 5, 1));
        assertDateEqual(create('June 2nd 2008'),   new Date(2008, 5, 2));
        assertDateEqual(create('June 3rd 2008'),   new Date(2008, 5, 3));
        assertDateEqual(create('June 4th 2008'),   new Date(2008, 5, 4));
        assertDateEqual(create('June 15, 2008'),   new Date(2008, 5, 15));
        assertDateEqual(create('June 15 2008'),    new Date(2008, 5, 15));
      });

      it('should parse weekday with date and English ordinal suffix', () => {
        assertDateEqual(create('Monday January 16th 2012'),   new Date(2012, 0, 16));
        assertDateEqual(create('Monday, January 16th 2012'),  new Date(2012, 0, 16));
        assertDateEqual(create('Monday, January, 16th 2012'), new Date(2012, 0, 16));
        assertDateEqual(create('Monday January, 16th 2012'),  new Date(2012, 0, 16));
        assertDateEqual(create('Monday January 16th, 2012'),   new Date(2012, 0, 16));
        assertDateEqual(create('Monday January, 16th, 2012'),  new Date(2012, 0, 16));
        assertDateEqual(create('Monday, January, 16th, 2012'), new Date(2012, 0, 16));
        assertDateEqual(create('Thursday July 3rd, 2008'), new Date(2008, 6, 3));
        assertDateEqual(create('Thu July 3rd, 2008'), new Date(2008, 6, 3));
        assertDateEqual(create('Thu. July 3rd, 2008'), new Date(2008, 6, 3));
      });

      it('should override an incorrect weekday', () => {
        assertDateEqual(create('Sunday July 3rd, 2008'), new Date(2008, 6, 3));
      });

      it('should parse short weekday with long month and year', () => {
        assertDateEqual(create('Mon January 16, 2012'),   new Date(2012, 0, 16));
        assertDateEqual(create('Mon. January 16, 2012'),   new Date(2012, 0, 16));
        assertDateEqual(create('Mon. January, 16, 2012'),  new Date(2012, 0, 16));
        assertDateEqual(create('Mon., January, 16, 2012'), new Date(2012, 0, 16));
        assertDateEqual(create('Dec 1st, 2008'),  new Date(2008, 11, 1));
        assertDateEqual(create('Dec. 1st, 2008'), new Date(2008, 11, 1));
        assertDateEqual(create('1 Dec. 2008'),    new Date(2008, 11, 1));
        assertDateEqual(create('1 Dec., 2008'),   new Date(2008, 11, 1));
        assertDateEqual(create('1 Dec, 2008'),    new Date(2008, 11, 1));
        assertDateEqual(create('June 1st, 2008 12:04'), new Date(2008, 5, 1, 12, 4));
      });

      it('should parse short weekday with short month and year', () => {
        assertDateEqual(create('Mon Jan 16, 2012'),   new Date(2012, 0, 16));
        assertDateEqual(create('Mon. Jan. 16, 2012'),   new Date(2012, 0, 16));
        assertDateEqual(create('Mon. Jan., 16, 2012'),  new Date(2012, 0, 16));
        assertDateEqual(create('Mon., Jan., 16, 2012'), new Date(2012, 0, 16));
      });

      it('should parse hyphenated with text month', () => {
        assertDateEqual(create('09-May-78'), new Date(1978, 4, 9));
        assertDateEqual(create('09-May-1978'), new Date(1978, 4, 9));
        assertDateEqual(create('09-May-1978 3:45pm'), new Date(1978, 4, 9, 15, 45));
      });

      it('should parse short year with apostrophe', () => {
        assertDateEqual(create("May '78"), new Date(1978, 4));
      });

      it('should parse year first hyphen with text month', () => {
        assertDateEqual(create('1978-May-09'), new Date(1978, 4, 9));
        assertDateEqual(create('1978-May-09 3:45pm'), new Date(1978, 4, 9, 15, 45));
      });

      it('should parse year with era', () => {
        assertDateEqual(create('February 1, 1000 BC'), new Date(-1000, 1));
      });

      it('should handle Issue #630', () => {
        assertDateEqual(create('Mar-03'), new Date(2020, 2, 3));
        assertDateEqual(create('Mar-3'), new Date(2020, 2, 3));
        assertDateEqual(create('03-Mar'), new Date(2020, 2, 3));
        assertDateEqual(create('3-Mar'), new Date(2020, 2, 3));
      });

      it('should handle Issue #507', () => {
        assertDateEqual(create('Sept 2015'), new Date(2015, 8));
        assertDateEqual(create('tues'), new Date(2019, 11, 31));
        assertDateEqual(create('thurs'), new Date(2020, 0, 2));
      });

    });

    describe('Preference', () => {

      function createPast(input) {
        return create({
          past: true,
          input,
        });
      }

      function createFuture(input) {
        return create({
          future: true,
          input,
        });
      }

      it('should parse ambiguous weekday with past preference', () => {
        assertDateEqual(createPast('Sunday'), new Date(2019, 11, 29));
        assertDateEqual(createPast('Monday'), new Date(2019, 11, 30));
        assertDateEqual(createPast('Tuesday'), new Date(2019, 11, 31));
        assertDateEqual(createPast('Wednesday'), new Date(2019, 11, 25));
        assertDateEqual(createPast('Thursday'), new Date(2019, 11, 26));
        assertDateEqual(createPast('Friday'), new Date(2019, 11, 27));
        assertDateEqual(createPast('Saturday'), new Date(2019, 11, 28));
      });

      it('should parse ambiguous weekday with future preference', () => {
        assertDateEqual(createFuture('Sunday'), new Date(2020, 0, 5));
        assertDateEqual(createFuture('Monday'), new Date(2020, 0, 6));
        assertDateEqual(createFuture('Tuesday'), new Date(2020, 0, 7));
        assertDateEqual(createFuture('Wednesday'), new Date(2020, 0, 8));
        assertDateEqual(createFuture('Thursday'), new Date(2020, 0, 2));
        assertDateEqual(createFuture('Friday'), new Date(2020, 0, 3));
        assertDateEqual(createFuture('Saturday'), new Date(2020, 0, 4));
      });

      it('should parse ambiguous month with past preference', () => {
        clock.setSystemTime(new Date(2020, 5));
        assertDateEqual(createPast('January'), new Date(2020, 0));
        assertDateEqual(createPast('February'), new Date(2020, 1));
        assertDateEqual(createPast('March'), new Date(2020, 2));
        assertDateEqual(createPast('April'), new Date(2020, 3));
        assertDateEqual(createPast('May'), new Date(2020, 4));
        assertDateEqual(createPast('June'), new Date(2019, 5));
        assertDateEqual(createPast('July'), new Date(2019, 6));
        assertDateEqual(createPast('August'), new Date(2019, 7));
        assertDateEqual(createPast('September'), new Date(2019, 8));
        assertDateEqual(createPast('October'), new Date(2019, 9));
        assertDateEqual(createPast('November'), new Date(2019, 10));
        assertDateEqual(createPast('December'), new Date(2019, 11));
      });

      it('should parse ambiguous month with future preference', () => {
        clock.setSystemTime(new Date(2020, 5));
        assertDateEqual(createFuture('January'), new Date(2021, 0));
        assertDateEqual(createFuture('February'), new Date(2021, 1));
        assertDateEqual(createFuture('March'), new Date(2021, 2));
        assertDateEqual(createFuture('April'), new Date(2021, 3));
        assertDateEqual(createFuture('May'), new Date(2021, 4));
        assertDateEqual(createFuture('June'), new Date(2021, 5));
        assertDateEqual(createFuture('July'), new Date(2020, 6));
        assertDateEqual(createFuture('August'), new Date(2020, 7));
        assertDateEqual(createFuture('September'), new Date(2020, 8));
        assertDateEqual(createFuture('October'), new Date(2020, 9));
        assertDateEqual(createFuture('November'), new Date(2020, 10));
        assertDateEqual(createFuture('December'), new Date(2020, 11));
      });

      it('should parse ambiguous date with past preference', () => {
        assertDateEqual(createPast('the 15th'), new Date(2019, 11, 15));
        clock.setSystemTime(new Date(2020, 0, 15));
        assertDateEqual(createPast('the 15th'), new Date(2019, 11, 15));
        clock.setSystemTime(new Date(2020, 0, 16));
        assertDateEqual(createPast('the 15th'), new Date(2020, 0, 15));
      });

      it('should parse ambiguous date with future preference', () => {
        assertDateEqual(createFuture('the 15th'), new Date(2020, 0, 15));
        clock.setSystemTime(new Date(2020, 0, 15));
        assertDateEqual(createFuture('the 15th'), new Date(2020, 1, 15));
        clock.setSystemTime(new Date(2020, 0, 16));
        assertDateEqual(createFuture('the 15th'), new Date(2020, 1, 15));
      });

      it('should parse ambiguous month and date with past preference', () => {
        clock.setSystemTime(new Date(2020, 5));
        assertDateEqual(createPast('March 15th'), new Date(2020, 2, 15));
        assertDateEqual(createPast('July 15th'), new Date(2019, 6, 15));
      });

      it('should parse ambiguous month and date with future preference', () => {
        clock.setSystemTime(new Date(2020, 5));
        assertDateEqual(createFuture('March 15th'), new Date(2021, 2, 15));
        assertDateEqual(createFuture('July 15th'), new Date(2020, 6, 15));
      });

      it('should parse ambiguous time with past preference', () => {
        clock.setSystemTime(new Date(2020, 0, 1, 12));
        assertDateEqual(createPast('11am'), new Date(2020, 0, 1, 11));
        assertDateEqual(createPast('12pm'), new Date(2019, 11, 31, 12));
        assertDateEqual(createPast('1pm'), new Date(2019, 11, 31, 13));
      });

      it('should parse ambiguous time with future preference', () => {
        clock.setSystemTime(new Date(2020, 0, 1, 12));
        assertDateEqual(createFuture('11am'), new Date(2020, 0, 2, 11));
        assertDateEqual(createFuture('12pm'), new Date(2020, 0, 2, 12));
        assertDateEqual(createFuture('1pm'), new Date(2020, 0, 1, 13));
      });

      it('should not apply preferences to date and relative month', () => {
        assertDateEqual(createPast('the 15th of next month'), new Date(2020, 1, 15));
      });

      it('should not apply preference to weekday with relative week', () => {
        assertDateEqual(createPast('this week Sunday'), new Date(2019, 11, 29));
        assertDateEqual(createPast('next week Sunday'), new Date(2020, 0, 5));
        assertDateEqual(createPast('this week Wednesday'), new Date(2020, 0, 1));
        assertDateEqual(createPast('next week Wednesday'), new Date(2020, 0, 8));
        assertDateEqual(createPast('this week Friday'), new Date(2020, 0, 3));
        assertDateEqual(createPast('next week Friday'), new Date(2020, 0, 10));
      });

      it('should not apply preference to weekday with relative week', () => {
        assertDateEqual(createPast('January of next year'), new Date(2021, 0));
        assertDateEqual(createFuture('April last year'), new Date(2019, 3));
      });

      it('should not apply preference to relative weeks', () => {
        assertDateEqual(createPast('last week'), new Date(2019, 11, 25));
        assertDateEqual(createPast('this week'), new Date(2020, 0, 1));
        assertDateEqual(createPast('next week'), new Date(2020, 0, 8));
      });

      it('should not apply preference to years', () => {
        assertDateEqual(createPast('2021'), new Date(2021, 0));
      });

      it('should handle Issue #572', () => {
        assertDateEqual(createFuture('this week tuesday at 5pm'), new Date(2019, 11, 31, 17));
        assertDateEqual(createFuture('today at 5pm'), new Date(2020, 0, 1, 17));
      });

    });

    describe('Locales', () => {

      it('should parse alternate formats correctly for en-GB', () => {
        assertDateEqual(create('15 Oct. 2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('15 October, 2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('15 October, 2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('15/10/2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('15/10/2020 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('15-10-2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('15-10-2020 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('15-Oct-2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('15-Oct-2020 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('2020/10/15', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('2020/10/15 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('2020-10-15', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('2020-10-15 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('2020-Oct-15', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('2020-Oct-15 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('8/10', 'en-GB'), new Date(2020, 9, 8));
        assertDateEqual(create('Mar-03', 'en-GB'), new Date(2020, 2, 3));
        assertDateEqual(create('Mar-3', 'en-GB'), new Date(2020, 2, 3));
        assertDateEqual(create('03-Mar', 'en-GB'), new Date(2020, 2, 3));
        assertDateEqual(create('3-Mar', 'en-GB'), new Date(2020, 2, 3));
        assertDateEqual(create('15 July, 2008', 'en-GB'), new Date(2008, 6, 15));
        assertDateEqual(create('15 July 2008', 'en-GB'), new Date(2008, 6, 15));
        assertDateEqual(create('09-May-78', 'en-GB'), new Date(1978, 4, 9));
        assertDateEqual(create('09-May-1978', 'en-GB'), new Date(1978, 4, 9));
        assertDateEqual(create('09-May-1978 3:45pm', 'en-GB'), new Date(1978, 4, 9, 15, 45));
        assertDateEqual(create('March 15th', 'en-GB'), new Date(2020, 2, 15));
        assertDateEqual(create('the 15th of March', 'en-GB'), new Date(2020, 2, 15));
        assertDateEqual(create('01/02/03', 'en-GB'), new Date(2003, 1, 1));
        assertDateEqual(create('01-02-03', 'en-GB'), new Date(2003, 1, 1));
        assertDateEqual(create('8/10/50', 'en-GB'), new Date(1950, 9, 8));
      });

      it('should parse alternate formats correctly for en-CA', () => {
        // Format is ambiguous in Canada where UK style and
        // American style are mixed, so these should not be parseable.
        assertUndefined(create('01/01/2020', 'en-CA'));
        assertUndefined(create('01-01-2020', 'en-CA'));

        assertDateEqual(create('15 Oct. 2020', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('15 October, 2020', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('15 October, 2020', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('15-Oct-2020', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('15-Oct-2020 5:15pm', 'en-CA'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('2020/10/15', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('2020/10/15 5:15pm', 'en-CA'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('2020-10-15', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('2020-10-15 5:15pm', 'en-CA'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('2020-Oct-15', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('2020-Oct-15 5:15pm', 'en-CA'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('8/10', 'en-CA'), new Date(2020, 7, 10));
        assertDateEqual(create('Mar-03', 'en-CA'), new Date(2020, 2, 3));
        assertDateEqual(create('Mar-3', 'en-CA'), new Date(2020, 2, 3));
        assertDateEqual(create('03-Mar', 'en-CA'), new Date(2020, 2, 3));
        assertDateEqual(create('3-Mar', 'en-CA'), new Date(2020, 2, 3));
        assertDateEqual(create('15 July, 2008', 'en-CA'), new Date(2008, 6, 15));
        assertDateEqual(create('15 July 2008', 'en-CA'), new Date(2008, 6, 15));
        assertDateEqual(create('09-May-78', 'en-CA'), new Date(1978, 4, 9));
        assertDateEqual(create('09-May-1978', 'en-CA'), new Date(1978, 4, 9));
        assertDateEqual(create('09-May-1978 3:45pm', 'en-CA'), new Date(1978, 4, 9, 15, 45));
        assertDateEqual(create('March 15th', 'en-CA'), new Date(2020, 2, 15));
        assertDateEqual(create('the 15th of March', 'en-CA'), new Date(2020, 2, 15));
      });

    });

    describe('Relative formats', () => {

      it('should parse relative year and month', () => {
        assertDateEqual(create('January of last year'), new Date(2019, 0));
        assertDateEqual(create('February of last year'), new Date(2019, 1));
        assertDateEqual(create('January of next year'),  new Date(2021, 0));
        assertDateEqual(create('February of next year'), new Date(2021, 1));
        assertDateEqual(create('January last year'), new Date(2019, 0));
        assertDateEqual(create('February last year'), new Date(2019, 1));
      });

      it('should parse relative month and date', () => {
        assertDateEqual(create('the 15th of last month'), new Date(2019, 11, 15));
      });

      it('should parse past date', () => {
        assertDateEqual(create('1 year ago'), new Date(2019, 0));
        assertDateEqual(create('2 years ago'), new Date(2018, 0));
        assertDateEqual(create('5 years ago'), new Date(2015, 0));
        assertDateEqual(create('0 years ago'), new Date(2020, 0));

        assertDateEqual(create('1 month ago'), new Date(2019, 11, 1));
        assertDateEqual(create('2 months ago'), new Date(2019, 10, 1));
        assertDateEqual(create('5 months ago'), new Date(2019, 7, 1));
        assertDateEqual(create('0 months ago'), new Date(2020, 0));

        assertDateEqual(create('1 week ago'), new Date(2019, 11, 25));
        assertDateEqual(create('2 weeks ago'), new Date(2019, 11, 18));
        assertDateEqual(create('5 weeks ago'), new Date(2019, 10, 27));
        assertDateEqual(create('0 weeks ago'), new Date(2020, 0));

        assertDateEqual(create('1 day ago'), new Date(2019, 11, 31));
        assertDateEqual(create('2 days ago'), new Date(2019, 11, 30));
        assertDateEqual(create('5 days ago'), new Date(2019, 11, 27));
        assertDateEqual(create('0 days ago'), new Date(2020, 0));

        assertDateEqual(create('1 hour ago'), new Date(2019, 11, 31, 23));
        assertDateEqual(create('2 hours ago'), new Date(2019, 11, 31, 22));
        assertDateEqual(create('5 hours ago'), new Date(2019, 11, 31, 19));
        assertDateEqual(create('0 hours ago'), new Date(2020, 0));

        assertDateEqual(create('1 minute ago'), new Date(2019, 11, 31, 23, 59));
        assertDateEqual(create('2 minutes ago'), new Date(2019, 11, 31, 23, 58));
        assertDateEqual(create('5 minutes ago'), new Date(2019, 11, 31, 23, 55));
        assertDateEqual(create('0 minutes ago'), new Date(2020, 0));

        assertDateEqual(create('1 second ago'), new Date(2019, 11, 31, 23, 59, 59));
        assertDateEqual(create('2 seconds ago'), new Date(2019, 11, 31, 23, 59, 58));
        assertDateEqual(create('5 seconds ago'), new Date(2019, 11, 31, 23, 59, 55));
        assertDateEqual(create('0 seconds ago'), new Date(2020, 0));
      });

      it('should parse future date', () => {
        assertDateEqual(create('in 1 year'), new Date(2021, 0));
        assertDateEqual(create('in 2 years'), new Date(2022, 0));
        assertDateEqual(create('in 5 years'), new Date(2025, 0));
        assertDateEqual(create('in 0 years'), new Date(2020, 0));

        assertDateEqual(create('in 1 month'), new Date(2020, 1, 1));
        assertDateEqual(create('in 2 months'), new Date(2020, 2, 1));
        assertDateEqual(create('in 5 months'), new Date(2020, 5, 1));
        assertDateEqual(create('in 0 months'), new Date(2020, 0));

        assertDateEqual(create('in 1 week'), new Date(2020, 0, 8));
        assertDateEqual(create('in 2 weeks'), new Date(2020, 0, 15));
        assertDateEqual(create('in 5 weeks'), new Date(2020, 1, 5));
        assertDateEqual(create('in 0 weeks'), new Date(2020, 0));

        assertDateEqual(create('in 1 day'), new Date(2020, 0, 2));
        assertDateEqual(create('in 2 days'), new Date(2020, 0, 3));
        assertDateEqual(create('in 5 days'), new Date(2020, 0, 6));
        assertDateEqual(create('in 0 days'), new Date(2020, 0));

        assertDateEqual(create('in 1 hour'), new Date(2020, 0, 1, 1));
        assertDateEqual(create('in 2 hours'), new Date(2020, 0, 1, 2));
        assertDateEqual(create('in 5 hours'), new Date(2020, 0, 1, 5));
        assertDateEqual(create('in 0 hours'), new Date(2020, 0));

        assertDateEqual(create('in 1 minute'), new Date(2020, 0, 1, 0, 1));
        assertDateEqual(create('in 2 minutes'), new Date(2020, 0, 1, 0, 2));
        assertDateEqual(create('in 5 minutes'), new Date(2020, 0, 1, 0, 5));
        assertDateEqual(create('in 0 minutes'), new Date(2020, 0));

        assertDateEqual(create('in 1 second'), new Date(2020, 0, 1, 0, 0, 1));
        assertDateEqual(create('in 2 seconds'), new Date(2020, 0, 1, 0, 0, 2));
        assertDateEqual(create('in 5 seconds'), new Date(2020, 0, 1, 0, 0, 5));
        assertDateEqual(create('in 0 seconds'), new Date(2020, 0));
      });

      it('should parse future date alternate', () => {
        assertDateEqual(create('1 year from now'), new Date(2021, 0));
        assertDateEqual(create('2 years from now'), new Date(2022, 0));
        assertDateEqual(create('5 years from now'), new Date(2025, 0));
        assertDateEqual(create('0 years from now'), new Date(2020, 0));

        assertDateEqual(create('1 month from now'), new Date(2020, 1, 1));
        assertDateEqual(create('2 months from now'), new Date(2020, 2, 1));
        assertDateEqual(create('5 months from now'), new Date(2020, 5, 1));
        assertDateEqual(create('0 months from now'), new Date(2020, 0));

        assertDateEqual(create('1 week from now'), new Date(2020, 0, 8));
        assertDateEqual(create('2 weeks from now'), new Date(2020, 0, 15));
        assertDateEqual(create('5 weeks from now'), new Date(2020, 1, 5));
        assertDateEqual(create('0 weeks from now'), new Date(2020, 0));

        assertDateEqual(create('1 day from now'), new Date(2020, 0, 2));
        assertDateEqual(create('2 days from now'), new Date(2020, 0, 3));
        assertDateEqual(create('5 days from now'), new Date(2020, 0, 6));
        assertDateEqual(create('0 days from now'), new Date(2020, 0));

        assertDateEqual(create('1 hour from now'), new Date(2020, 0, 1, 1));
        assertDateEqual(create('2 hours from now'), new Date(2020, 0, 1, 2));
        assertDateEqual(create('5 hours from now'), new Date(2020, 0, 1, 5));
        assertDateEqual(create('0 hours from now'), new Date(2020, 0));

        assertDateEqual(create('1 minute from now'), new Date(2020, 0, 1, 0, 1));
        assertDateEqual(create('2 minutes from now'), new Date(2020, 0, 1, 0, 2));
        assertDateEqual(create('5 minutes from now'), new Date(2020, 0, 1, 0, 5));
        assertDateEqual(create('0 minutes from now'), new Date(2020, 0));

        assertDateEqual(create('1 second from now'), new Date(2020, 0, 1, 0, 0, 1));
        assertDateEqual(create('2 seconds from now'), new Date(2020, 0, 1, 0, 0, 2));
        assertDateEqual(create('5 seconds from now'), new Date(2020, 0, 1, 0, 0, 5));
        assertDateEqual(create('0 seconds from now'), new Date(2020, 0));
      });

      it('should parse non-numeric relative formats', () => {
        assertDateEqual(create('last year'), new Date(2019, 0));
        assertDateEqual(create('this year'), new Date(2020, 0));
        assertDateEqual(create('next year'), new Date(2021, 0));

        assertDateEqual(create('last month'), new Date(2019, 11, 1));
        assertDateEqual(create('this month'), new Date(2020, 0, 1));
        assertDateEqual(create('next month'), new Date(2020, 1, 1));

        assertDateEqual(create('last week'), new Date(2019, 11, 25));
        assertDateEqual(create('this week'), new Date(2020, 0, 1));
        assertDateEqual(create('next week'), new Date(2020, 0, 8));

        assertDateEqual(create('yesterday'), new Date(2019, 11, 31));
        assertDateEqual(create('today'), new Date(2020, 0, 1));
        assertDateEqual(create('tomorrow'), new Date(2020, 0, 2));

        assertDateEqual(create('now'), new Date(2020, 0));
      });

      it('should parse time and relative date', () => {
        assertDateEqual(create('9pm today'), new Date(2020, 0, 1, 21));
        assertDateEqual(create('10am tomorrow'), new Date(2020, 0, 2, 10));

        assertDateEqual(create('10:00am tomorrow'), new Date(2020, 0, 2, 10));
        assertDateEqual(create('12:00pm tomorrow'), new Date(2020, 0, 2, 12));
        assertDateEqual(create('9:00pm tomorrow'), new Date(2020, 0, 2, 21));
        assertDateEqual(create('02:00 tomorrow'), new Date(2020, 0, 2, 2));
        assertDateEqual(create('23:00 tomorrow'), new Date(2020, 0, 2, 23));

        assertDateEqual(create('3:00pm today'), new Date(2020, 0, 1, 15));
        assertDateEqual(create('3:00pm yesterday'), new Date(2019, 11, 31, 15));

        assertDateEqual(create('3:00pm 5 days ago'), new Date(2019, 11, 27, 15));
        assertDateEqual(create('3:00pm in 5 days'), new Date(2020, 0, 6, 15));
        assertDateEqual(create('3:00pm 5 days from now'), new Date(2020, 0, 6, 15));
      });

      it('should relative date and time', () => {
        assertDateEqual(create('today at 9pm'), new Date(2020, 0, 1, 21));
        assertDateEqual(create('tomorrow at 10am'), new Date(2020, 0, 2, 10));

        assertDateEqual(create('tomorrow at 10:00am'), new Date(2020, 0, 2, 10));
        assertDateEqual(create('tomorrow at 12:00pm'), new Date(2020, 0, 2, 12));
        assertDateEqual(create('tomorrow at 9:00pm'), new Date(2020, 0, 2, 21));
        assertDateEqual(create('tomorrow at 02:00'), new Date(2020, 0, 2, 2));
        assertDateEqual(create('tomorrow at 23:00'), new Date(2020, 0, 2, 23));

        assertDateEqual(create('today at 3:00pm'), new Date(2020, 0, 1, 15));
        assertDateEqual(create('yesterday at 3:00pm'), new Date(2019, 11, 31, 15));

        assertDateEqual(create('5 days ago at 3:00pm'), new Date(2019, 11, 27, 15));
        assertDateEqual(create('in 5 days at 3:00pm'), new Date(2020, 0, 6, 15));
        assertDateEqual(create('5 days from now at 3:00pm'), new Date(2020, 0, 6, 15));
      });

      it('should parse relative week with weekday', () => {
        assertDateEqual(create('this week tuesday'), new Date(2019, 11, 31));
        assertDateEqual(create('this week tuesday at 5pm'), new Date(2019, 11, 31, 17));
      });

      it('should parse non-numeric relative formats', () => {
        assertDateEqual(create('last week Sunday'), new Date(2019, 11, 22));
      });

      it('should parse non-numeric relative formats', () => {
        assertDateEqual(create('the 1st Sunday of last month'),    new Date(2019, 11, 1));
        assertDateEqual(create('the 1st Monday of last month'),    new Date(2019, 11, 2));
        assertDateEqual(create('the 1st Tuesday of last month'),   new Date(2019, 11, 3));
        assertDateEqual(create('the 1st Wednesday of last month'), new Date(2019, 11, 4));
        assertDateEqual(create('the 1st Thursday of last month'),  new Date(2019, 11, 5));
        assertDateEqual(create('the 1st Friday of last month'),    new Date(2019, 11, 6));
        assertDateEqual(create('the 1st Saturday of last month'),  new Date(2019, 11, 7));

        assertDateEqual(create('the 2nd Sunday of last month'),  new Date(2019, 11, 8));
        assertDateEqual(create('the 3rd Sunday of last month'),  new Date(2019, 11, 15));
        assertDateEqual(create('the 4th Sunday of last month'),  new Date(2019, 11, 22));

        assertDateEqual(create('the 1st Sunday of next month'),    new Date(2020, 1, 2));
        assertDateEqual(create('the 1st Monday of next month'),    new Date(2020, 1, 3));
        assertDateEqual(create('the 1st Tuesday of next month'),   new Date(2020, 1, 4));
        assertDateEqual(create('the 1st Wednesday of next month'), new Date(2020, 1, 5));
        assertDateEqual(create('the 1st Thursday of next month'),  new Date(2020, 1, 6));
        assertDateEqual(create('the 1st Friday of next month'),    new Date(2020, 1, 7));
        assertDateEqual(create('the 1st Saturday of next month'),  new Date(2020, 1, 1));

        assertDateEqual(create('the 2nd Sunday of next month'),  new Date(2020, 1, 9));
        assertDateEqual(create('the 3rd Sunday of next month'),  new Date(2020, 1, 16));
        assertDateEqual(create('the 4th Sunday of next month'),  new Date(2020, 1, 23));
      });

    });

    describe('Time zones', () => {

      it('should be able to parse a basic date as UTC', () => {
        mockTimeZone(-540); // GMT+09:00
        assertDateEqual(
          create({
            input: '2020-01-01',
            timeZone: 'America/New_York',
          }),
          new Date(2020, 0, 1, 14)
        );
      });

      it('should be able to parse a basic date as UTC', () => {
        mockTimeZone(300); // GMT-05:00
        assertDateEqual(
          create({
            input: '2020-01-01',
            timeZone: 'America/New_York',
          }),
          new Date(2020, 0)
        );
      });

      it('should ignore timeZone when ISO-8601 zulu offset is set', () => {
        mockTimeZone(300); // GMT-05:00
        assertDateEqual(
          create({
            input: '2020-01-01Z',
            timeZone: 'America/New_York',
          }),
          new Date(2019, 11, 31, 19)
        );
      });

      it('should handle Issue #582', () => {
        mockTimeZone(300); // GMT-05:00
        clock.setSystemTime(new Date(2020, 5, 15, 23, 59, 59, 999));
        assertDateEqual(
          create({
            input: 'now',
            timeZone: 'UTC',
          }),
          new Date(2020, 5, 15, 18, 59, 59, 999)
        );
      });

    });

    describe('Adding custom DateTime formats', () => {

      it('should be able to add basic parts', () => {
        assertDateEqual(
          create({
            cache: false,
            input: '2020x05x23',
            dateTimeFormats: [
              '<year>x<month>x<day>'
            ],
          }),
          new Date(2020, 4, 23)
        );
      });

      it('should be able to add optional parts', () => {
        assertDateEqual(
          create({
            cache: false,
            input: '2020x05x23',
            dateTimeFormats: [
              '<year>x<month>x?<day?>'
            ],
          }),
          new Date(2020, 4, 23)
        );
        assertDateEqual(
          create({
            cache: false,
            input: '2020x05',
            dateTimeFormats: [
              '<year>x<month>x?<day?>'
            ],
          }),
          new Date(2020, 4)
        );
      });

      it('should be able to add long components with a capital', () => {
        assertDateEqual(
          create({
            cache: false,
            input: '2020xAugxTuex25',
            dateTimeFormats: [
              '<year>x<Month>x<Weekday>x<day>'
            ],
          }),
          new Date(2020, 7, 25)
        );
      });

      it('should be able to add time part', () => {
        assertDateEqual(
          create({
            cache: false,
            input: '2020x05x12:25',
            dateTimeFormats: [
              '<year>x<month>x<time>'
            ],
          }),
          new Date(2020, 4, 1, 12, 25)
        );
      });

      it('should throw an error when unknown part is passed', () => {
        assertError(() => {
          create({
            cache: false,
            input: 'foo',
            dateTimeFormats: [
              '<date>'
            ],
          });
        });
      });

      it('should be able to add a fractionalSecond part', () => {
        assertDateEqual(
          create({
            cache: false,
            input: 'foo:12.400',
            dateTimeFormats: [
              'foo:<fractionalSecond>'
            ],
          }),
          new Date(2020, 0, 1, 0, 0, 12, 400)
        );
      });

      it('should be able to add a timeZoneName part', () => {
        mockTimeZone(300); // GMT-05:00
        assertDateEqual(
          create({
            cache: false,
            input: 'foo:GMT+9',
            dateTimeFormats: [
              'foo:<timeZoneName>'
            ],
          }),
          new Date(2019, 11, 31, 10)
        );
      });

      it('should be able to add an era part', () => {
        assertDateEqual(
          create({
            cache: false,
            input: '5000xBC',
            dateTimeFormats: [
              '<year>x<era>'
            ],
          }),
          new Date(-5000, 0)
        );
      });

      it('should allow hour, minute, and second parts', () => {
        assertDateEqual(
          create({
            cache: false,
            input: '12x12x12',
            dateTimeFormats: [
              '<second>x<minute>x<hour>'
            ],
          }),
          new Date(2020, 0, 1, 12, 12, 12)
        );
      });

      it('should support non-BMP characters', () => {
        assertDateEqual(
          create({
            cache: false,
            input: '2010🙂05🙂23',
            dateTimeFormats: [
              '<year>🙂<month>🙂<day>'
            ],
          }),
          new Date(2010, 4, 23)
        );
      });

    });

    describe('Adding custom Relative formats', () => {

      it('should be able to add a numeric relative format', () => {
        assertDateEqual(
          create({
            cache: false,
            input: '5 days into the future!',
            relativeFormats: [
              {
                format: (value, unit) => {
                  if (value > 0) {
                    const s = value !== 1 ? 's' : '';
                    return `${value} ${unit}${s} into the future!`;
                  }
                }
              }
            ],
          }),
          new Date(2020, 0, 6)
        );
      });

      it('should be able to add a non-numeric relative format', () => {
        assertDateEqual(
          create({
            cache: false,
            input: 'the day before yesterday',
            relativeFormats: [
              {
                format: (value, unit) => {
                  if (unit === 'day' && value === -2) {
                    return 'the day before yesterday';
                  }
                }
              }
            ],
          }),
          new Date(2019, 11, 30)
        );
      });

    });

    describe('Explain', () => {

      it('should return a parsing result when explain flag is set', () => {
        const { format, parser, ...rest } = create({
          cache: false,
          explain: true,
          input: 'January 1, 2020',
        });
        assertEqual(parser.locale, 'en-US');
        assertInstanceOf(format.reg, RegExp);
        assertInstanceOf(format.groups, Array);
        assertObjectEqual(rest, {
          date: new Date(2020, 0),
          specificity: {
            unit: 'date',
            index: 3,
          },
          absProps: {
            year: 2020,
            month: 0,
            date: 1,
          },
          relProps: {},
        });
      });

      it('should have correct specificity for parsed date', () => {

        function assertParsedSpecificity(input, obj) {
          const { specificity } = create({
            cache: false,
            explain: true,
            input,
          });
          assertObjectEqual(specificity, obj);
        }

        assertParsedSpecificity('2020', {
          unit: 'year',
          index: 0,
        });

        assertParsedSpecificity('January', {
          unit: 'month',
          index: 1,
        });

        assertParsedSpecificity('next week', {
          unit: 'week',
          index: 2,
        });

        assertParsedSpecificity('Wednesday January 1, 2020', {
          unit: 'date',
          index: 3,
        });

        assertParsedSpecificity('January 1st', {
          unit: 'date',
          index: 3,
        });

        assertParsedSpecificity('Wednesday', {
          unit: 'day',
          index: 3,
        });

        assertParsedSpecificity('January 1st at 10pm', {
          unit: 'hour',
          index: 4,
        });

        assertParsedSpecificity('January 1st at 10:00pm', {
          unit: 'minute',
          index: 5,
        });

        assertParsedSpecificity('January 1st at 10:00:00pm', {
          unit: 'second',
          index: 6,
        });

        assertParsedSpecificity('January 1st at 10:00:00.000pm', {
          unit: 'millisecond',
          index: 7,
        });

      });

      it('should have timeZoneOffset on absProps when offset is parsed', () => {
        const { absProps } = create({
          cache: false,
          explain: true,
          input: '2020-01-01T00:00+05:00'
        })
        assertObjectEqual(absProps, {
          year: 2020,
          month: 0,
          date: 1,
          hour: 0,
          minute: 0,
          timeZoneOffset: -300,
        });
      });

      it('should not return a parsing result when date cannot be parsed', () => {
        assertUndefined(create({
          cache: false,
          explain: true,
          input: 'bad date'
        }));
      });

      it('should handle Issue #545', () => {
        const { absProps } = create({
          cache: false,
          explain: true,
          input: 'January 13th, 2016',
        });
        assertObjectEqual(absProps, {
          year: 2016,
          month: 0,
          date: 13,
        });
      });

    });

    describe('Creation with DateProps', () => {

      it('should be able to create a date from unit props', () => {
        assertDateEqual(
          create({
            year: 1998,
          }),
          new Date(1998, 0)
        );
        assertDateEqual(
          create({
            year: 1998,
            month: 1,
          }),
          new Date(1998, 1)
        );
        assertDateEqual(
          create({
            year: 1998,
            month: 1,
            date: 23,
          }),
          new Date(1998, 1, 23)
        );
        assertDateEqual(
          create({
            year: 1998,
            month: 1,
            date: 23,
            hour: 11,
          }),
          new Date(1998, 1, 23, 11)
        );
        assertDateEqual(
          create({
            year: 1998,
            month: 1,
            date: 23,
            hour: 11,
            minutes: 54,
          }),
          new Date(1998, 1, 23, 11, 54)
        );
        assertDateEqual(
          create({
            year: 1998,
            month: 1,
            date: 23,
            hour: 11,
            minutes: 54,
            seconds: 32,
          }),
          new Date(1998, 1, 23, 11, 54, 32)
        );
        assertDateEqual(
          create({
            year: 1998,
            month: 1,
            date: 23,
            hour: 11,
            minutes: 54,
            seconds: 32,
            milliseconds: 454,
          }),
          new Date(1998, 1, 23, 11, 54, 32, 454)
        );
      });

      it('should not modify passed date props', () => {
        const props = { year: 1998 };
        create(props);
        assertObjectEqual(props, { year: 1998 });
      });

      it('should allow fractions in lower units', () => {
        assertDateEqual(create({ day: 5.5 }), new Date(2020, 0, 3, 12));
        assertDateEqual(create({ date: 5.5 }), new Date(2020, 0, 5, 12));
        assertDateEqual(create({ hours: 20.5 }), new Date(2020, 0, 1, 20, 30));
        assertDateEqual(create({ minutes: 20.5 }), new Date(2020, 0, 1, 0, 20, 30));
        assertDateEqual(create({ seconds: 20.5 }), new Date(2020, 0, 1, 0, 0, 20, 500));
      });

      it('should round fractions in milliseconds', () => {
        assertDateEqual(create({ milliseconds: 300.5 }), new Date(2020, 0, 1, 0, 0, 0, 301));
      });

      it('should error on fractions in higher units', () => {
        assertError(() => {
          create({ month: 5.5 });
        });
        assertError(() => {
          create({ year: 5.5 });
        });
      });

    });

    describe('Other', () => {

      it('should handle now token', () => {
        clock.setSystemTime(new Date(2020, 5, 15, 23, 59, 59, 999));
        assertDateEqual(create('now'), new Date(2020, 5, 15, 23, 59, 59, 999));
      });

      it('should create a date from a timestamp', () => {
        assertDateEqual(create(Date.now()), new Date());
        assertDateEqual(create(1293980400000), new Date(1293980400000));
      });

      it('should clone a date when passed', () => {
        const date1 = new Date();
        const date2 = create(date1);
        assertFalse(date1 === date2);
        assertDateEqual(date1, date2);
      });

      it('should ignore passed locale when using options object', () => {
        const date = create({
          input: 'next week',
          locale: 'en',
        }, 'ja');
        assertDateEqual(date, new Date(2020, 0, 8));
      });

      it('should trim whitespace', () => {
        assertDateEqual(create('   1987-07-04    '), new Date(1987, 6, 4));
      });

      it('should be case insensitive', () => {
        assertDateEqual(create('juNe 1St 2008'),   new Date(2008, 5));
      });

      it('should handle irregular input', () => {
        assertError(() => {
          create();
        }, TypeError);
      });

    });

  });

  describeInstance('isValid', function (isValid) {

    it('should be valid for valid dates', () => {
      assertTrue(isValid(new Date()));
    });

    it('should be invalid for valid dates', () => {
      assertFalse(isValid(new Date(NaN)));
    });

    it('should handle irregular input', () => {
      assertFalse(isValid());
    });
  });

  describeInstance('isFuture', function (isFuture) {
    it('should be true for dates in the future', () => {
      assertTrue(isFuture(new Date(Date.now() + 1000)));
    });

    it('should be false for dates in the past', () => {
      assertFalse(isFuture(new Date(Date.now() - 1000)));
    });

    it('should be false for the present date', () => {
      assertFalse(isFuture(new Date()));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        isFuture();
      });
    });
  });

  describeInstance('isPast', function (isPast) {
    it('should be false for dates in the future', () => {
      assertFalse(isPast(new Date(Date.now() + 1000)));
    });

    it('should be false for dates in the past', () => {
      assertTrue(isPast(new Date(Date.now() - 1000)));
    });

    it('should be false for the present date', () => {
      assertFalse(isPast(new Date()));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        isPast();
      });
    });
  });

  describeInstance(
    WEEKDAYS.map((day) => `is${day}`),
    function (isDay, i) {
      it('should be true for the correct day', () => {
        assertEqual(isDay(new Date(2020, 0, 5)), i === 0);
        assertEqual(isDay(new Date(2020, 0, 6)), i === 1);
        assertEqual(isDay(new Date(2020, 0, 7)), i === 2);
        assertEqual(isDay(new Date(2020, 0, 8)), i === 3);
        assertEqual(isDay(new Date(2020, 0, 9)), i === 4);
        assertEqual(isDay(new Date(2020, 0, 10)), i === 5);
        assertEqual(isDay(new Date(2020, 0, 11)), i === 6);
      });

      it('should handle irregular input', () => {
        assertError(() => {
          isDay();
        });
      });
    }
  );

  describeInstance(
    MONTHS.map((month) => `is${month}`),
    function (isMonth, i) {
      it('should be true for the correct month', () => {
        assertEqual(isMonth(new Date(2020, 0)), i === 0);
        assertEqual(isMonth(new Date(2020, 1)), i === 1);
        assertEqual(isMonth(new Date(2020, 2)), i === 2);
        assertEqual(isMonth(new Date(2020, 3)), i === 3);
        assertEqual(isMonth(new Date(2020, 4)), i === 4);
        assertEqual(isMonth(new Date(2020, 5)), i === 5);
        assertEqual(isMonth(new Date(2020, 6)), i === 6);
        assertEqual(isMonth(new Date(2020, 7)), i === 7);
        assertEqual(isMonth(new Date(2020, 8)), i === 8);
        assertEqual(isMonth(new Date(2020, 9)), i === 9);
        assertEqual(isMonth(new Date(2020, 10)), i === 10);
        assertEqual(isMonth(new Date(2020, 11)), i === 11);
      });

      it('should handle irregular input', () => {
        assertError(() => {
          isMonth();
        });
      });
    }
  );

  describeInstance('set', function (set) {
    it('should set the year', () => {
      assertDateEqual(
        set(new Date(2020, 0), { year: 2010 }),
        new Date(2010, 0, 1)
      );
      assertDateEqual(
        set(new Date(2020, 0), { year: 2015 }),
        new Date(2015, 0, 1)
      );
      assertDateEqual(
        set(new Date(2020, 0), { year: 2025 }),
        new Date(2025, 0, 1)
      );
    });

    it('should set the month', () => {
      assertDateEqual(set(new Date(2020, 0), { month: 1 }), new Date(2020, 1));
      assertDateEqual(
        set(new Date(2020, 0), { month: 11 }),
        new Date(2020, 11)
      );
      assertDateEqual(set(new Date(2020, 0), { month: 21 }), new Date(2021, 9));
      assertDateEqual(
        set(new Date(2020, 0), { month: -1 }),
        new Date(2019, 11)
      );
    });

    it('should set the date', () => {
      assertDateEqual(
        set(new Date(2020, 0), { date: 2 }),
        new Date(2020, 0, 2)
      );
      assertDateEqual(
        set(new Date(2020, 0), { date: 14 }),
        new Date(2020, 0, 14)
      );
      assertDateEqual(
        set(new Date(2020, 0), { date: 31 }),
        new Date(2020, 0, 31)
      );
      assertDateEqual(
        set(new Date(2020, 0), { date: 32 }),
        new Date(2020, 1, 1)
      );
      assertDateEqual(
        set(new Date(2020, 0), { date: 0 }),
        new Date(2019, 11, 31)
      );
      assertDateEqual(
        set(new Date(2020, 0), { date: -1 }),
        new Date(2019, 11, 30)
      );
    });

    it('should set the day of the week', () => {
      assertDateEqual(
        set(new Date(2020, 0), { day: 0 }),
        new Date(2019, 11, 29)
      );
      assertDateEqual(
        set(new Date(2020, 0), { day: 1 }),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        set(new Date(2020, 0), { day: 2 }),
        new Date(2019, 11, 31)
      );
      assertDateEqual(
        set(new Date(2020, 0), { day: -1 }),
        new Date(2019, 11, 28)
      );
      assertDateEqual(set(new Date(2020, 0), { day: 7 }), new Date(2020, 0, 5));
      assertDateEqual(set(new Date(2020, 0), { day: 3 }), new Date(2020, 0, 1));
      assertDateEqual(set(new Date(2020, 0), { day: 4 }), new Date(2020, 0, 2));
      assertDateEqual(set(new Date(2020, 0), { day: 5 }), new Date(2020, 0, 3));
      assertDateEqual(set(new Date(2020, 0), { day: 6 }), new Date(2020, 0, 4));
    });

    it('should set the hours', () => {
      assertDateEqual(
        set(new Date(2020, 0), { hours: 5 }),
        new Date(2020, 0, 1, 5)
      );
      assertDateEqual(
        set(new Date(2020, 0), { hours: 13 }),
        new Date(2020, 0, 1, 13)
      );
      assertDateEqual(
        set(new Date(2020, 0), { hours: 24 }),
        new Date(2020, 0, 2, 0)
      );
      assertDateEqual(
        set(new Date(2020, 0), { hours: 29 }),
        new Date(2020, 0, 2, 5)
      );
    });

    it('should set the minutes', () => {
      assertDateEqual(
        set(new Date(2020, 0), { minutes: 10 }),
        new Date(2020, 0, 1, 0, 10)
      );
      assertDateEqual(
        set(new Date(2020, 0), { minutes: 30 }),
        new Date(2020, 0, 1, 0, 30)
      );
      assertDateEqual(
        set(new Date(2020, 0), { minutes: 60 }),
        new Date(2020, 0, 1, 1, 0)
      );
      assertDateEqual(
        set(new Date(2020, 0), { minutes: 90 }),
        new Date(2020, 0, 1, 1, 30)
      );
    });

    it('should set the seconds', () => {
      assertDateEqual(
        set(new Date(2020, 0), { seconds: 10 }),
        new Date(2020, 0, 1, 0, 0, 10)
      );
      assertDateEqual(
        set(new Date(2020, 0), { seconds: 30 }),
        new Date(2020, 0, 1, 0, 0, 30)
      );
      assertDateEqual(
        set(new Date(2020, 0), { seconds: 60 }),
        new Date(2020, 0, 1, 0, 1, 0)
      );
      assertDateEqual(
        set(new Date(2020, 0), { seconds: 90 }),
        new Date(2020, 0, 1, 0, 1, 30)
      );
    });

    it('should set the milliseconds', () => {
      assertDateEqual(
        set(new Date(2020, 0), { milliseconds: 300 }),
        new Date(2020, 0, 1, 0, 0, 0, 300)
      );
      assertDateEqual(
        set(new Date(2020, 0), { milliseconds: 900 }),
        new Date(2020, 0, 1, 0, 0, 0, 900)
      );
      assertDateEqual(
        set(new Date(2020, 0), { milliseconds: 1200 }),
        new Date(2020, 0, 1, 0, 0, 1, 200)
      );
    });

    it('should allow aliases', () => {
      assertDateEqual(
        set(new Date(2020, 0), { weekday: 1 }),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        set(new Date(2020, 0), { hour: 5 }),
        new Date(2020, 0, 1, 5)
      );
      assertDateEqual(
        set(new Date(2020, 0), { minute: 10 }),
        new Date(2020, 0, 1, 0, 10)
      );
      assertDateEqual(
        set(new Date(2020, 0), { second: 10 }),
        new Date(2020, 0, 1, 0, 0, 10)
      );
      assertDateEqual(
        set(new Date(2020, 0), { millisecond: 300 }),
        new Date(2020, 0, 1, 0, 0, 0, 300)
      );
      assertDateEqual(
        set(new Date(2020, 0), { ms: 300 }),
        new Date(2020, 0, 1, 0, 0, 0, 300)
      );
    });

    it('should reset the date by specificity', () => {
      assertDateEqual(
        set(new Date(2020, 2, 31, 11, 59, 59, 999), { year: 2021 }, true),
        new Date(2021, 0)
      );
      assertDateEqual(
        set(new Date(2020, 2, 31, 11, 59, 59, 999), { month: 0 }, true),
        new Date(2020, 0)
      );
      assertDateEqual(
        set(new Date(2020, 2, 31, 11, 59, 59, 999), { date: 1 }, true),
        new Date(2020, 2, 1)
      );
      assertDateEqual(
        set(new Date(2020, 2, 31, 11, 59, 59, 999), { day: 5 }, true),
        new Date(2020, 3, 3)
      );
      assertDateEqual(
        set(new Date(2020, 2, 31, 11, 59, 59, 999), { weekday: 5 }, true),
        new Date(2020, 3, 3)
      );
      assertDateEqual(
        set(new Date(2020, 2, 31, 11, 59, 59, 999), { hours: 20 }, true),
        new Date(2020, 2, 31, 20)
      );
      assertDateEqual(
        set(new Date(2020, 2, 31, 11, 59, 59, 999), { minutes: 30 }, true),
        new Date(2020, 2, 31, 11, 30)
      );
      assertDateEqual(
        set(new Date(2020, 2, 31, 11, 59, 59, 999), { seconds: 30 }, true),
        new Date(2020, 2, 31, 11, 59, 30)
      );
      assertDateEqual(
        set(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { milliseconds: 300 },
          true
        ),
        new Date(2020, 2, 31, 11, 59, 59, 300)
      );
    });

    it('should ignore day when date is set', () => {
      assertDateEqual(
        set(new Date(2020, 0), { date: 15, days: 1 }, true),
        new Date(2020, 0, 15)
      );
      assertDateEqual(
        set(new Date(2020, 0), { days: 1, date: 15 }, true),
        new Date(2020, 0, 15)
      );
    });

    it('should handle non-contiguous units', () => {
      assertDateEqual(
        set(new Date(2020, 1), {
          year: 2010,
          minutes: 30,
        }),
        new Date(2010, 1, 1, 0, 30)
      );
      assertDateEqual(
        set(new Date(2020, 11, 31, 23, 59, 59, 999), {
          year: 2010,
          minutes: 30,
        }),
        new Date(2010, 11, 31, 23, 30, 59, 999)
      );
      assertDateEqual(
        set(
          new Date(2020, 11, 31, 23, 59, 59, 999),
          {
            year: 2010,
            minutes: 30,
          },
          true
        ),
        new Date(2010, 11, 31, 23, 30)
      );
    });

    it('should handle complex cases', () => {
      assertDateEqual(
        set(new Date(2020, 1), {
          year: 2010,
          month: 7,
          date: 25,
          hours: 3,
          minutes: 40,
          seconds: 12,
        }),
        new Date(2010, 7, 25, 3, 40, 12)
      );
    });

    it('should allow setting from a numeric timestamp', () => {
      assertDateEqual(set(new Date(2020, 0), Date.now()), new Date());
      assertDateEqual(set(new Date(2020, 0), Date.now(), true), new Date());
    });

    it('should not traverse into different month when not enough days', () => {
      assertDateEqual(
        set(new Date(2011, 0, 31), {
          month: 1,
        }),
        new Date(2011, 1, 28)
      );
    });

    it('should not accidentally traverse into different month', () => {
      assertDateEqual(
        set(new Date(2011, 0, 31), { month: 1, date: 15 }),
        new Date(2011, 1, 15)
      );
      assertDateEqual(
        set(new Date(2011, 0, 31), { date: 15, month: 1 }),
        new Date(2011, 1, 15)
      );
      assertDateEqual(
        set(new Date(2020, 1), { month: 0, date: 31 }),
        new Date(2020, 0, 31)
      );
      assertDateEqual(
        set(new Date(2020, 1), { date: 31, month: 0 }),
        new Date(2020, 0, 31)
      );
    });

    it('should not accidentally traverse into different month on reset', () => {
      assertDateEqual(
        set(
          new Date(2010, 0, 31),
          {
            month: 1,
          },
          true
        ),
        new Date(2010, 1)
      );
    });

    it('should not accidentally traverse into a different time during DST shift', () => {
      assertDateEqual(
        set(new Date(2020, 2, 8), { date: 7, hours: 2 }),
        new Date(2020, 2, 7, 2)
      );
      assertDateEqual(
        set(new Date(2020, 2, 8), { hours: 2, date: 7 }),
        new Date(2020, 2, 7, 2)
      );
      assertDateEqual(
        set(new Date(2020, 2, 8), { hours: 2, month: 1 }),
        new Date(2020, 1, 8, 2)
      );
      assertDateEqual(
        set(new Date(2020, 2, 8), { month: 1, hours: 2 }),
        new Date(2020, 1, 8, 2)
      );
      assertDateEqual(
        set(
          new Date(2010, 11, 9, 17),
          {
            year: 1998,
            month: 3,
            day: 3,
          },
          true
        ),
        new Date(1998, 3, 8)
      );
    });

    it('should throw an error on unknown keys', () => {
      assertError(() => {
        set(new Date(2020, 0), { foo: 300 });
      }, TypeError);
    });

    it('should throw an error on invalid values', () => {
      assertError(() => {
        set(new Date(2020, 0), { year: 'invalid' });
      }, TypeError);
      assertError(() => {
        set(new Date(2020, 0), { year: NaN });
      }, TypeError);
      assertError(() => {
        set(new Date(2020, 0), { year: null });
      }, TypeError);
      assertError(() => {
        set(new Date(2020, 0), { year: '2020' });
      }, TypeError);
      assertError(() => {
        set(new Date(2020, 0), { year: 2020.5 });
      }, TypeError);
    });
  });

  describeInstance('advance', function (advance) {

    it('should advance the year', () => {
      assertDateEqual(
        advance(new Date(2020, 0), { years: 1 }),
        new Date(2021, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { years: 10 }),
        new Date(2030, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { years: -5 }),
        new Date(2015, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { years: 0 }),
        new Date(2020, 0)
      );
    });

    it('should advance the month', () => {
      assertDateEqual(
        advance(new Date(2020, 1), { months: 1 }),
        new Date(2020, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { months: 11 }),
        new Date(2021, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { months: 21 }),
        new Date(2021, 10)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { months: -1 }),
        new Date(2020, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { months: -4 }),
        new Date(2019, 9)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { months: 0 }),
        new Date(2020, 1)
      );
    });

    it('should advance the week', () => {
      assertDateEqual(
        advance(new Date(2020, 0), { weeks: 1 }),
        new Date(2020, 0, 8)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { weeks: 2 }),
        new Date(2020, 0, 15)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { weeks: -1 }),
        new Date(2019, 11, 25)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { weeks: -2 }),
        new Date(2019, 11, 18)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { weeks: 0 }),
        new Date(2020, 0)
      );
    });

    it('should advance the date', () => {
      assertDateEqual(
        advance(new Date(2020, 0), { days: 2 }),
        new Date(2020, 0, 3)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { days: 14 }),
        new Date(2020, 0, 15)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { days: 31 }),
        new Date(2020, 1, 1)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { days: 37 }),
        new Date(2020, 1, 7)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { days: 0 }),
        new Date(2020, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { days: -1 }),
        new Date(2019, 11, 31)
      );
    });

    it('should advance the hours', () => {
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12), { hours: 5 }),
        new Date(2020, 0, 1, 17)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12), { hours: 12 }),
        new Date(2020, 0, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12), { hours: 13 }),
        new Date(2020, 0, 2, 1)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12), { hours: 24 }),
        new Date(2020, 0, 2, 12)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12), { hours: 29 }),
        new Date(2020, 0, 2, 17)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12), { hours: -5 }),
        new Date(2020, 0, 1, 7)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12), { hours: -12 }),
        new Date(2020, 0, 1)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12), { hours: -24 }),
        new Date(2019, 11, 31, 12)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12), { hours: 0 }),
        new Date(2020, 0, 1, 12)
      );
    });

    it('should advance the minutes', () => {
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30), { minutes: 10 }),
        new Date(2020, 0, 1, 12, 40)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30), { minutes: 30 }),
        new Date(2020, 0, 1, 13)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30), { minutes: 90 }),
        new Date(2020, 0, 1, 14)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30), { minutes: -30 }),
        new Date(2020, 0, 1, 12)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30), { minutes: -90 }),
        new Date(2020, 0, 1, 11)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30), { minutes: 0 }),
        new Date(2020, 0, 1, 12, 30)
      );
    });

    it('should advance the seconds', () => {
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30, 30), { seconds: 10 }),
        new Date(2020, 0, 1, 12, 30, 40)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30, 30), { seconds: 30 }),
        new Date(2020, 0, 1, 12, 31)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30, 30), { seconds: 90 }),
        new Date(2020, 0, 1, 12, 32)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30, 30), { seconds: -30 }),
        new Date(2020, 0, 1, 12, 30)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30, 30), { seconds: -90 }),
        new Date(2020, 0, 1, 12, 29)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30, 30), { seconds: 0 }),
        new Date(2020, 0, 1, 12, 30, 30)
      );
    });

    it('should advance the milliseconds', () => {
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30, 30, 300), { milliseconds: 300 }),
        new Date(2020, 0, 1, 12, 30, 30, 600)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30, 30, 300), { milliseconds: 1200 }),
        new Date(2020, 0, 1, 12, 30, 31, 500)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30, 30, 300), { milliseconds: -300 }),
        new Date(2020, 0, 1, 12, 30, 30)
      );
      assertDateEqual(
        advance(new Date(2020, 0, 1, 12, 30, 30, 300), { milliseconds: -1200 }),
        new Date(2020, 0, 1, 12, 30, 29, 100)
      );
    });

    it('should allow aliases', () => {
      assertDateEqual(
        advance(new Date(2020, 0), { year: 1 }),
        new Date(2021, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { month: 1 }),
        new Date(2020, 1)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { week: 1 }),
        new Date(2020, 0, 8)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { date: 1 }),
        new Date(2020, 0, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { day: 1 }),
        new Date(2020, 0, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { weekday: 1 }),
        new Date(2020, 0, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { hour: 5 }),
        new Date(2020, 0, 1, 5)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { minute: 10 }),
        new Date(2020, 0, 1, 0, 10)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { second: 10 }),
        new Date(2020, 0, 1, 0, 0, 10)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { millisecond: 300 }),
        new Date(2020, 0, 1, 0, 0, 0, 300)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { ms: 300 }),
        new Date(2020, 0, 1, 0, 0, 0, 300)
      );
    });

    it('should reset the date by specificity', () => {
      assertDateEqual(
        advance(new Date(2020, 2, 31, 11, 59, 59, 999), { years: 1 }, true),
        new Date(2021, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 31, 11, 59, 59, 999), { months: 1 }, true),
        new Date(2020, 3)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 31, 11, 59, 59, 999), { days: 1 }, true),
        new Date(2020, 3, 1)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 31, 11, 59, 59, 999), { days: 5 }, true),
        new Date(2020, 3, 5)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 31, 11, 59, 59, 999), { hours: 20 }, true),
        new Date(2020, 3, 1, 7)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 31, 11, 59, 59, 999), { minutes: 30 }, true),
        new Date(2020, 2, 31, 12, 29)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 31, 11, 59, 59, 999), { seconds: 30 }, true),
        new Date(2020, 2, 31, 12, 0, 29)
      );
      assertDateEqual(
        advance(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { milliseconds: 300 },
          true
        ),
        new Date(2020, 2, 31, 12, 0, 0, 299)
      );
    });

    it('should ignore day when date is set', () => {
      assertDateEqual(
        advance(new Date(2020, 0), { date: 5, days: 7 }, true),
        new Date(2020, 0, 6)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { days: 7, date: 5 }, true),
        new Date(2020, 0, 6)
      );
    });

    it('should handle non-contiguous units', () => {
      assertDateEqual(
        advance(new Date(2020, 1), {
          years: 2,
          minutes: 30,
        }),
        new Date(2022, 1, 1, 0, 30)
      );
      assertDateEqual(
        advance(new Date(2020, 1), {
          years: 2,
          minutes: -30,
        }),
        new Date(2022, 0, 31, 23, 30)
      );
      assertDateEqual(
        advance(new Date(2020, 11, 31, 23, 59, 59, 999), {
          years: 2,
          minutes: 30,
        }),
        new Date(2023, 0, 1, 0, 29, 59, 999)
      );
      assertDateEqual(
        advance(
          new Date(2020, 11, 31, 23, 59, 59, 999),
          {
            years: 2,
            minutes: 30,
          },
          true
        ),
        new Date(2023, 0, 1, 0, 29)
      );
    });

    it('should handle complex cases', () => {
      assertDateEqual(
        advance(new Date(2020, 1), {
          years: 2,
          months: 7,
          days: 5,
          hours: 3,
          minutes: 40,
          seconds: 12,
        }),
        new Date(2022, 8, 6, 3, 40, 12)
      );
      assertDateEqual(
        advance(new Date(2010, 7, 25, 11, 45, 20), {
          years: 1,
          months: -3,
          days: 2,
          hours: 8,
          minutes: 12,
          seconds: -2,
          milliseconds: 44,
        }),
        new Date(2011, 4, 27, 19, 57, 18, 44)
      );
    });

    it('should allow a string shortcut', () => {
      assertDateEqual(advance(new Date(2020, 0), '3 years'), new Date(2023, 0));
      assertDateEqual(
        advance(new Date(2020, 0), '3 months'),
        new Date(2020, 3)
      );
      assertDateEqual(
        advance(new Date(2020, 0), '3 weeks'),
        new Date(2020, 0, 22)
      );
      assertDateEqual(
        advance(new Date(2020, 0), '3 days'),
        new Date(2020, 0, 4)
      );
      assertDateEqual(
        advance(new Date(2020, 0), '3 hours'),
        new Date(2020, 0, 1, 3)
      );
      assertDateEqual(
        advance(new Date(2020, 0), '3 minutes'),
        new Date(2020, 0, 1, 0, 3)
      );
      assertDateEqual(
        advance(new Date(2020, 0), '3 seconds'),
        new Date(2020, 0, 1, 0, 0, 3)
      );
      assertDateEqual(
        advance(new Date(2020, 0), '3 milliseconds'),
        new Date(2020, 0, 1, 0, 0, 0, 3)
      );
    });

    it('should allow irregular string forms', () => {
      assertDateEqual(advance(new Date(2020, 0), '1 year'), new Date(2021, 0));
      assertDateEqual(
        advance(new Date(2020, 0), '-3 years'),
        new Date(2017, 0)
      );
    });

    it('should error on invalid string forms', () => {
      assertError(() => {
        advance(new Date(2020, 0), 'invalid');
      });
      assertError(() => {
        advance(new Date(2020, 0), '1year');
      });
      assertError(() => {
        advance(new Date(2020, 0), '3 yearz');
      });
      assertError(() => {
        advance(new Date(2020, 0), ' 3 years ');
      });
    });

    it('should allow fractions in specific string forms', () => {
      // Issue #549 - Fractions in string units
      // Notably leaving off higher order units here to avoid ambiguity.
      assertDateEqual(
        advance(new Date(2016, 0, 5, 12), '10.33 minutes'),
        new Date(2016, 0, 5, 12, 10, 20)
      );
      assertDateEqual(
        advance(new Date(2016, 0, 5, 12), '2.25 hours'),
        new Date(2016, 0, 5, 14, 15)
      );
      assertDateEqual(
        advance(new Date(2016, 0, 5, 12), '11.5 days'),
        new Date(2016, 0, 17)
      );
      assertDateEqual(
        advance(new Date(2016, 0, 5, 12), '-2.25 hours'),
        new Date(2016, 0, 5, 9, 45)
      );
    });

    it('should not produce different results for different object order', () => {
      // Intentionally avoid date/hours which have special handling
      assertDateEqual(
        advance(new Date(2020, 1), {
          years: 2,
          months: 14,
          minutes: 140,
          seconds: 140,
        }),
        new Date(2023, 3, 1, 2, 22, 20)
      );
      assertDateEqual(
        advance(new Date(2020, 1), {
          seconds: 140,
          minutes: 140,
          months: 14,
          years: 2,
        }),
        new Date(2023, 3, 1, 2, 22, 20)
      );
    });

    it('should allow advancing from a numeric timestamp', () => {
      assertDateEqual(
        advance(new Date(2020, 0), 24 * 60 * 60 * 1000),
        new Date(2020, 0, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 0), 29 * 60 * 60 * 1000, true),
        new Date(2020, 0, 2, 5)
      );
    });

    it('should not traverse into different month when not enough days', () => {
      assertDateEqual(
        advance(new Date(2011, 0, 31), {
          months: 1,
        }),
        new Date(2011, 1, 28)
      );
    });

    it('should still advance days after month traversal prevented', () => {
      assertDateEqual(
        advance(new Date(2011, 0, 31), {
          months: 1,
          days: 3,
        }),
        new Date(2011, 2, 3)
      );
    });

    it('should not accidentally traverse into different month', () => {
      assertDateEqual(
        advance(new Date(2011, 0, 15), { months: 1, days: 2 }),
        new Date(2011, 1, 17)
      );
      assertDateEqual(
        advance(new Date(2011, 0, 15), { days: 2, months: 1 }),
        new Date(2011, 1, 17)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { months: 0, days: 15 }),
        new Date(2020, 1, 16)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { days: 15, months: 0 }),
        new Date(2020, 1, 16)
      );
    });

    it('should not accidentally traverse into different month on reset', () => {
      assertDateEqual(
        advance(
          new Date(2010, 0, 31),
          {
            months: 1,
          },
          true
        ),
        new Date(2010, 1)
      );
    });

    it('should not accidentally traverse into a different time during DST shift', () => {
      assertDateEqual(
        advance(new Date(2020, 2, 8), { days: -1, hours: 2 }),
        new Date(2020, 2, 7, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 8), { hours: 2, days: -1 }),
        new Date(2020, 2, 7, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 8), { hours: 2, months: -1 }),
        new Date(2020, 1, 8, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 8), { months: -1, hours: 2 }),
        new Date(2020, 1, 8, 2)
      );
      assertDateEqual(
        advance(
          new Date(2020, 11, 9, 17),
          {
            years: 2,
            months: 3,
            days: 31,
          },
          true
        ),
        new Date(2023, 3, 9)
      );
    });

    it('should throw an error on unknown keys', () => {
      assertError(() => {
        advance(new Date(2020, 0), { foo: 300 });
      }, TypeError);
    });

    it('should throw an error on invalid values', () => {
      assertError(() => {
        advance(new Date(2020, 0), { years: 'invalid' });
      }, TypeError);
      assertError(() => {
        advance(new Date(2020, 0), { years: NaN });
      }, TypeError);
      assertError(() => {
        advance(new Date(2020, 0), { years: null });
      }, TypeError);
      assertError(() => {
        advance(new Date(2020, 0), { years: '2020' });
      }, TypeError);
      assertError(() => {
        advance(new Date(2020, 0), { years: 2020.5 });
      }, TypeError);
      assertError(() => {
        advance(new Date(2020, 0), { weeks: null });
      }, TypeError);
    });
  });

  describeInstance('rewind', function (rewind) {
    it('should rewind the year', () => {
      assertDateEqual(
        rewind(new Date(2020, 0), { years: 1 }),
        new Date(2019, 0)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { years: 10 }),
        new Date(2010, 0)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { years: -5 }),
        new Date(2025, 0)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { years: 0 }),
        new Date(2020, 0)
      );
    });

    it('should rewind the month', () => {
      assertDateEqual(
        rewind(new Date(2020, 1), { months: 1 }),
        new Date(2020, 0)
      );
      assertDateEqual(
        rewind(new Date(2020, 1), { months: 11 }),
        new Date(2019, 2)
      );
      assertDateEqual(
        rewind(new Date(2020, 1), { months: 21 }),
        new Date(2018, 4)
      );
      assertDateEqual(
        rewind(new Date(2020, 1), { months: -1 }),
        new Date(2020, 2)
      );
      assertDateEqual(
        rewind(new Date(2020, 1), { months: -4 }),
        new Date(2020, 5)
      );
      assertDateEqual(
        rewind(new Date(2020, 1), { months: 0 }),
        new Date(2020, 1)
      );
    });

    it('should rewind the week', () => {
      assertDateEqual(
        rewind(new Date(2020, 0), { weeks: 1 }),
        new Date(2019, 11, 25)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { weeks: 2 }),
        new Date(2019, 11, 18)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { weeks: -1 }),
        new Date(2020, 0, 8)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { weeks: -2 }),
        new Date(2020, 0, 15)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { weeks: 0 }),
        new Date(2020, 0)
      );
    });

    it('should rewind the date', () => {
      assertDateEqual(
        rewind(new Date(2020, 0), { days: 2 }),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { days: 14 }),
        new Date(2019, 11, 18)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { days: 31 }),
        new Date(2019, 11, 1)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { days: 37 }),
        new Date(2019, 10, 25)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { days: 0 }),
        new Date(2020, 0)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { days: -1 }),
        new Date(2020, 0, 2)
      );
    });

    it('should rewind the hours', () => {
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12), { hours: 5 }),
        new Date(2020, 0, 1, 7)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12), { hours: 12 }),
        new Date(2020, 0, 1)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12), { hours: 13 }),
        new Date(2019, 11, 31, 23)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12), { hours: 24 }),
        new Date(2019, 11, 31, 12)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12), { hours: 29 }),
        new Date(2019, 11, 31, 7)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12), { hours: -5 }),
        new Date(2020, 0, 1, 17)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12), { hours: -12 }),
        new Date(2020, 0, 2)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12), { hours: -24 }),
        new Date(2020, 0, 2, 12)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12), { hours: 0 }),
        new Date(2020, 0, 1, 12)
      );
    });

    it('should rewind the minutes', () => {
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30), { minutes: 10 }),
        new Date(2020, 0, 1, 12, 20)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30), { minutes: 30 }),
        new Date(2020, 0, 1, 12)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30), { minutes: 90 }),
        new Date(2020, 0, 1, 11)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30), { minutes: -30 }),
        new Date(2020, 0, 1, 13)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30), { minutes: -90 }),
        new Date(2020, 0, 1, 14)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30), { minutes: 0 }),
        new Date(2020, 0, 1, 12, 30)
      );
    });

    it('should rewind the seconds', () => {
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30, 30), { seconds: 10 }),
        new Date(2020, 0, 1, 12, 30, 20)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30, 30), { seconds: 30 }),
        new Date(2020, 0, 1, 12, 30)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30, 30), { seconds: 90 }),
        new Date(2020, 0, 1, 12, 29)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30, 30), { seconds: -30 }),
        new Date(2020, 0, 1, 12, 31)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30, 30), { seconds: -90 }),
        new Date(2020, 0, 1, 12, 32)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30, 30), { seconds: 0 }),
        new Date(2020, 0, 1, 12, 30, 30)
      );
    });

    it('should rewind the milliseconds', () => {
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30, 30, 300), { milliseconds: 300 }),
        new Date(2020, 0, 1, 12, 30, 30)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30, 30, 300), { milliseconds: 1200 }),
        new Date(2020, 0, 1, 12, 30, 29, 100)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30, 30, 300), { milliseconds: -300 }),
        new Date(2020, 0, 1, 12, 30, 30, 600)
      );
      assertDateEqual(
        rewind(new Date(2020, 0, 1, 12, 30, 30, 300), { milliseconds: -1200 }),
        new Date(2020, 0, 1, 12, 30, 31, 500)
      );
    });

    it('should allow aliases', () => {
      assertDateEqual(
        rewind(new Date(2020, 0), { years: 1 }),
        new Date(2019, 0)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { months: 1 }),
        new Date(2019, 11)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { weeks: 1 }),
        new Date(2019, 11, 25)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { date: 1 }),
        new Date(2019, 11, 31)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { day: 1 }),
        new Date(2019, 11, 31)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { weekday: 1 }),
        new Date(2019, 11, 31)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { hour: 5 }),
        new Date(2019, 11, 31, 19)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { minute: 10 }),
        new Date(2019, 11, 31, 23, 50)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { second: 10 }),
        new Date(2019, 11, 31, 23, 59, 50)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { millisecond: 300 }),
        new Date(2019, 11, 31, 23, 59, 59, 700)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { ms: 300 }),
        new Date(2019, 11, 31, 23, 59, 59, 700)
      );
    });

    it('should reset the date by specificity', () => {
      assertDateEqual(
        rewind(new Date(2020, 2, 31, 11, 59, 59, 999), { years: 1 }, true),
        new Date(2019, 0)
      );
      assertDateEqual(
        rewind(new Date(2020, 2, 31, 11, 59, 59, 999), { months: 1 }, true),
        new Date(2020, 1)
      );
      assertDateEqual(
        rewind(new Date(2020, 2, 31, 11, 59, 59, 999), { days: 1 }, true),
        new Date(2020, 2, 30)
      );
      assertDateEqual(
        rewind(new Date(2020, 2, 31, 11, 59, 59, 999), { days: 5 }, true),
        new Date(2020, 2, 26)
      );
      assertDateEqual(
        rewind(new Date(2020, 2, 31, 11, 59, 59, 999), { hours: 20 }, true),
        new Date(2020, 2, 30, 15)
      );
      assertDateEqual(
        rewind(new Date(2020, 2, 31, 11, 59, 59, 999), { minutes: 30 }, true),
        new Date(2020, 2, 31, 11, 29)
      );
      assertDateEqual(
        rewind(new Date(2020, 2, 31, 11, 59, 59, 999), { seconds: 30 }, true),
        new Date(2020, 2, 31, 11, 59, 29)
      );
      assertDateEqual(
        rewind(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { milliseconds: 300 },
          true
        ),
        new Date(2020, 2, 31, 11, 59, 59, 699)
      );
    });

    it('should ignore days when date is set', () => {
      assertDateEqual(
        rewind(new Date(2020, 0), { date: 5, days: 7 }, true),
        new Date(2019, 11, 27)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), { days: 7, date: 5 }, true),
        new Date(2019, 11, 27)
      );
    });

    it('should handle non-contiguous units', () => {
      assertDateEqual(
        rewind(new Date(2020, 1), {
          years: 2,
          minutes: 30,
        }),
        new Date(2018, 0, 31, 23, 30)
      );
      assertDateEqual(
        rewind(new Date(2020, 1), {
          years: 2,
          minutes: -30,
        }),
        new Date(2018, 1, 1, 0, 30)
      );
      assertDateEqual(
        rewind(new Date(2020, 11, 31, 23, 59, 59, 999), {
          years: 2,
          minutes: 30,
        }),
        new Date(2018, 11, 31, 23, 29, 59, 999)
      );
      assertDateEqual(
        rewind(
          new Date(2020, 11, 31, 23, 59, 59, 999),
          {
            years: 2,
            minutes: 30,
          },
          true
        ),
        new Date(2018, 11, 31, 23, 29)
      );
    });

    it('should handle complex cases', () => {
      assertDateEqual(
        rewind(new Date(2020, 1), {
          years: 2,
          months: 7,
          days: 5,
          hours: 3,
          minutes: 40,
          seconds: 12,
        }),
        new Date(2017, 5, 25, 20, 19, 48)
      );
      assertDateEqual(
        rewind(new Date(2010, 7, 25, 11, 45, 20), {
          years: 1,
          months: -3,
          days: 2,
          hours: 8,
          minutes: 12,
          seconds: -2,
          milliseconds: 44,
        }),
        new Date(2009, 10, 23, 3, 33, 21, 956)
      );
    });

    it('should allow a string shortcut', () => {
      assertDateEqual(rewind(new Date(2020, 0), '3 years'), new Date(2017, 0));
      assertDateEqual(rewind(new Date(2020, 0), '3 months'), new Date(2019, 9));
      assertDateEqual(
        rewind(new Date(2020, 0), '3 weeks'),
        new Date(2019, 11, 11)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), '3 days'),
        new Date(2019, 11, 29)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), '3 hours'),
        new Date(2019, 11, 31, 21)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), '3 minutes'),
        new Date(2019, 11, 31, 23, 57)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), '3 seconds'),
        new Date(2019, 11, 31, 23, 59, 57)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), '3 milliseconds'),
        new Date(2019, 11, 31, 23, 59, 59, 997)
      );
    });

    it('should allow irregular string forms', () => {
      assertDateEqual(rewind(new Date(2020, 0), '1 year'), new Date(2019, 0));
      assertDateEqual(rewind(new Date(2020, 0), '-3 years'), new Date(2023, 0));
    });

    it('should error on invalid string forms', () => {
      assertError(() => {
        rewind(new Date(2020, 0), 'invalid');
      });
      assertError(() => {
        rewind(new Date(2020, 0), '1year');
      });
      assertError(() => {
        rewind(new Date(2020, 0), '3 yearz');
      });
      assertError(() => {
        rewind(new Date(2020, 0), ' 3 years ');
      });
    });

    it('should allow fractions in specific string forms', () => {
      // Issue #549 - Fractions in string units
      // Notably leaving off higher order units here to avoid ambiguity.
      assertDateEqual(
        rewind(new Date(2016, 0, 5, 12), '10.33 minutes'),
        new Date(2016, 0, 5, 11, 49, 40)
      );
      assertDateEqual(
        rewind(new Date(2016, 0, 5, 12), '2.25 hours'),
        new Date(2016, 0, 5, 9, 45)
      );
      assertDateEqual(
        rewind(new Date(2016, 0, 5, 12), '11.5 days'),
        new Date(2015, 11, 25)
      );
      assertDateEqual(
        rewind(new Date(2016, 0, 5, 12), '-2.25 hours'),
        new Date(2016, 0, 5, 14, 15)
      );
    });

    it('should not produce different results for different object order', () => {
      // Intentionally avoid date/hours which have special handling
      assertDateEqual(
        rewind(new Date(2020, 1), {
          years: 2,
          months: 14,
          minutes: 140,
          seconds: 140,
        }),
        new Date(2016, 10, 30, 21, 37, 40)
      );
      assertDateEqual(
        rewind(new Date(2020, 1), {
          seconds: 140,
          minutes: 140,
          months: 14,
          years: 2,
        }),
        new Date(2016, 10, 30, 21, 37, 40)
      );
    });

    it('should allow advancing from a numeric timestamp', () => {
      assertDateEqual(
        rewind(new Date(2020, 0), 24 * 60 * 60 * 1000),
        new Date(2019, 11, 31)
      );
      assertDateEqual(
        rewind(new Date(2020, 0), 29 * 60 * 60 * 1000, true),
        new Date(2019, 11, 30, 19)
      );
    });

    it('should not traverse into different month when not enough days', () => {
      assertDateEqual(
        rewind(new Date(2011, 2, 31), {
          months: 1,
        }),
        new Date(2011, 1, 28)
      );
    });

    it('should still rewind days after month traversal prevented', () => {
      assertDateEqual(
        rewind(new Date(2011, 2, 31), {
          months: 1,
          days: 3,
        }),
        new Date(2011, 1, 25)
      );
    });

    it('should not accidentally traverse into different month', () => {
      assertDateEqual(
        rewind(new Date(2011, 2, 15), { months: 1, days: 2 }),
        new Date(2011, 1, 13)
      );
      assertDateEqual(
        rewind(new Date(2011, 2, 15), { days: 2, months: 1 }),
        new Date(2011, 1, 13)
      );
      assertDateEqual(
        rewind(new Date(2020, 1, 28), { months: 0, days: 15 }),
        new Date(2020, 1, 13)
      );
      assertDateEqual(
        rewind(new Date(2020, 1, 28), { days: 15, months: 0 }),
        new Date(2020, 1, 13)
      );
    });

    it('should not accidentally traverse into different month on reset', () => {
      assertDateEqual(
        rewind(
          new Date(2010, 2, 31),
          {
            months: 1,
          },
          true
        ),
        new Date(2010, 1)
      );
    });

    it('should not accidentally traverse into a different time during DST shift', () => {
      assertDateEqual(
        rewind(new Date(2020, 2, 8, 4), { days: 1, hours: 2 }),
        new Date(2020, 2, 7, 2)
      );
      assertDateEqual(
        rewind(new Date(2020, 2, 8, 4), { hours: 2, days: 1 }),
        new Date(2020, 2, 7, 2)
      );
      assertDateEqual(
        rewind(new Date(2020, 2, 8, 4), { hours: 2, months: 1 }),
        new Date(2020, 1, 8, 2)
      );
      assertDateEqual(
        rewind(new Date(2020, 2, 8, 4), { months: 1, hours: 2 }),
        new Date(2020, 1, 8, 2)
      );
      assertDateEqual(
        rewind(
          new Date(2020, 11, 9, 17),
          {
            years: 2,
            months: 11,
            days: 8,
          },
          true
        ),
        new Date(2018, 0)
      );
    });

    it('should throw an error on unknown keys', () => {
      assertError(() => {
        rewind(new Date(2020, 0), { foo: 300 });
      }, TypeError);
    });

    it('should throw an error on invalid values', () => {
      assertError(() => {
        rewind(new Date(2020, 0), { years: 'invalid' });
      }, TypeError);
      assertError(() => {
        rewind(new Date(2020, 0), { years: NaN });
      }, TypeError);
      assertError(() => {
        rewind(new Date(2020, 0), { years: null });
      }, TypeError);
      assertError(() => {
        rewind(new Date(2020, 0), { years: '2020' });
      }, TypeError);
      assertError(() => {
        rewind(new Date(2020, 0), { years: 2020.5 });
      }, TypeError);
      assertError(() => {
        rewind(new Date(2020, 0), { weeks: null });
      }, TypeError);
    });

    it('should handle issue #492', () => {
      assertDateEqual(
        rewind(new Date(2010, 7, 25, 11, 45, 20), { weeks: 1, days: 1 }),
        new Date(2010, 7, 17, 11, 45, 20)
      );
    });

  });

  describeInstance('addYears', function (addYears) {

    it('should function as an alias for advance', () => {
      assertDateEqual(
        addYears(new Date(2020, 0), 1),
        new Date(2021, 0)
      );
      assertDateEqual(
        addYears(new Date(2020, 0), 10),
        new Date(2030, 0)
      );
      assertDateEqual(
        addYears(new Date(2020, 0), -5),
        new Date(2015, 0)
      );
      assertDateEqual(
        addYears(new Date(2020, 0), 0),
        new Date(2020, 0)
      );
    });

    it('should handle irregular input', () => {
      assertError(() => {
        addYears(new Date(2020, 0));
      }, TypeError);
      assertError(() => {
        addYears();
      }, TypeError);
    });

  });

  describeInstance('addMonths', function (addMonths) {

    it('should function as an alias for advance', () => {
      assertDateEqual(
        addMonths(new Date(2020, 0), 1),
        new Date(2020, 1)
      );
      assertDateEqual(
        addMonths(new Date(2020, 0), 10),
        new Date(2020, 10)
      );
      assertDateEqual(
        addMonths(new Date(2020, 0), -5),
        new Date(2019, 7)
      );
      assertDateEqual(
        addMonths(new Date(2020, 0), 0),
        new Date(2020, 0)
      );
    });

    it('should handle irregular input', () => {
      assertError(() => {
        addMonths(new Date(2020, 0));
      }, TypeError);
      assertError(() => {
        addMonths();
      }, TypeError);
    });

    it('should handle issue #221', () => {
      assertDateEqual(
        addMonths(new Date(2012, 0), -13),
        addMonths(addMonths(new Date(2012, 0), -10), -3),
      );
    });

  });

  describeInstance('addWeeks', function (addWeeks) {

    it('should function as an alias for advance', () => {
      assertDateEqual(
        addWeeks(new Date(2020, 0), 1),
        new Date(2020, 0, 8)
      );
      assertDateEqual(
        addWeeks(new Date(2020, 0), 10),
        new Date(2020, 2, 11)
      );
      assertDateEqual(
        addWeeks(new Date(2020, 0), -5),
        new Date(2019, 10, 27)
      );
      assertDateEqual(
        addWeeks(new Date(2020, 0), 0),
        new Date(2020, 0)
      );
    });

    it('should handle irregular input', () => {
      assertError(() => {
        addWeeks(new Date(2020, 0));
      }, TypeError);
      assertError(() => {
        addWeeks();
      }, TypeError);
    });

  });

  describeInstance('addDays', function (addDays) {

    it('should function as an alias for advance', () => {
      assertDateEqual(
        addDays(new Date(2020, 0), 1),
        new Date(2020, 0, 2)
      );
      assertDateEqual(
        addDays(new Date(2020, 0), 10),
        new Date(2020, 0, 11)
      );
      assertDateEqual(
        addDays(new Date(2020, 0), -5),
        new Date(2019, 11, 27)
      );
      assertDateEqual(
        addDays(new Date(2020, 0), 0),
        new Date(2020, 0)
      );
    });

    it('should handle irregular input', () => {
      assertError(() => {
        addDays(new Date(2020, 0));
      }, TypeError);
      assertError(() => {
        addDays();
      }, TypeError);
    });

  });

  describeInstance('addHours', function (addHours) {

    it('should function as an alias for advance', () => {
      assertDateEqual(
        addHours(new Date(2020, 0), 1),
        new Date(2020, 0, 1, 1)
      );
      assertDateEqual(
        addHours(new Date(2020, 0), 10),
        new Date(2020, 0, 1, 10)
      );
      assertDateEqual(
        addHours(new Date(2020, 0), -5),
        new Date(2019, 11, 31, 19)
      );
      assertDateEqual(
        addHours(new Date(2020, 0), 0),
        new Date(2020, 0)
      );
    });

    it('should handle irregular input', () => {
      assertError(() => {
        addHours(new Date(2020, 0));
      }, TypeError);
      assertError(() => {
        addHours();
      }, TypeError);
    });

  });

  describeInstance('addMinutes', function (addMinutes) {

    it('should function as an alias for advance', () => {
      assertDateEqual(
        addMinutes(new Date(2020, 0), 1),
        new Date(2020, 0, 1, 0, 1)
      );
      assertDateEqual(
        addMinutes(new Date(2020, 0), 10),
        new Date(2020, 0, 1, 0, 10)
      );
      assertDateEqual(
        addMinutes(new Date(2020, 0), -5),
        new Date(2019, 11, 31, 23, 55)
      );
      assertDateEqual(
        addMinutes(new Date(2020, 0), 0),
        new Date(2020, 0)
      );
    });

    it('should handle irregular input', () => {
      assertError(() => {
        addMinutes(new Date(2020, 0));
      }, TypeError);
      assertError(() => {
        addMinutes();
      }, TypeError);
    });

  });

  describeInstance('addSeconds', function (addSeconds) {

    it('should function as an alias for advance', () => {
      assertDateEqual(
        addSeconds(new Date(2020, 0), 1),
        new Date(2020, 0, 1, 0, 0, 1)
      );
      assertDateEqual(
        addSeconds(new Date(2020, 0), 10),
        new Date(2020, 0, 1, 0, 0, 10)
      );
      assertDateEqual(
        addSeconds(new Date(2020, 0), -5),
        new Date(2019, 11, 31, 23, 59, 55)
      );
      assertDateEqual(
        addSeconds(new Date(2020, 0), 0),
        new Date(2020, 0)
      );
    });

    it('should handle irregular input', () => {
      assertError(() => {
        addSeconds(new Date(2020, 0));
      }, TypeError);
      assertError(() => {
        addSeconds();
      }, TypeError);
    });

  });

  describeInstance('addMilliseconds', function (addMilliseconds) {

    it('should function as an alias for advance', () => {
      assertDateEqual(
        addMilliseconds(new Date(2020, 0), 1),
        new Date(2020, 0, 1, 0, 0, 0, 1)
      );
      assertDateEqual(
        addMilliseconds(new Date(2020, 0), 10),
        new Date(2020, 0, 1, 0, 0, 0, 10)
      );
      assertDateEqual(
        addMilliseconds(new Date(2020, 0), -5),
        new Date(2019, 11, 31, 23, 59, 59, 995)
      );
      assertDateEqual(
        addMilliseconds(new Date(2020, 0), 0),
        new Date(2020, 0)
      );
    });

    it('should handle irregular input', () => {
      assertError(() => {
        addMilliseconds(new Date(2020, 0));
      }, TypeError);
      assertError(() => {
        addMilliseconds();
      }, TypeError);
    });

  });

  describeInstance('getISOWeek', function (getISOWeek) {

    it('should provide the correct ISO week for 2020', () => {
      assertEqual(getISOWeek(new Date(2019, 11, 29)), 52);
      assertEqual(getISOWeek(new Date(2019, 11, 30)), 1);
      assertEqual(getISOWeek(new Date(2019, 11, 31)), 1);
      assertEqual(getISOWeek(new Date(2020, 0, 1)), 1);
      assertEqual(getISOWeek(new Date(2020, 0, 2)), 1);
      assertEqual(getISOWeek(new Date(2020, 0, 3)), 1);
      assertEqual(getISOWeek(new Date(2020, 0, 4)), 1);
      assertEqual(getISOWeek(new Date(2020, 0, 5)), 1);
      assertEqual(getISOWeek(new Date(2020, 0, 6)), 2);
      assertEqual(getISOWeek(new Date(2020, 1, 1)), 5);
      assertEqual(getISOWeek(new Date(2020, 2, 1)), 9);
      assertEqual(getISOWeek(new Date(2020, 3, 1)), 14);
      assertEqual(getISOWeek(new Date(2020, 4, 1)), 18);
      assertEqual(getISOWeek(new Date(2020, 5, 1)), 23);
      assertEqual(getISOWeek(new Date(2020, 6, 1)), 27);
      assertEqual(getISOWeek(new Date(2020, 7, 1)), 31);
      assertEqual(getISOWeek(new Date(2020, 8, 1)), 36);
      assertEqual(getISOWeek(new Date(2020, 9, 1)), 40);
      assertEqual(getISOWeek(new Date(2020, 10, 1)), 44);
      assertEqual(getISOWeek(new Date(2020, 11, 1)), 49);
      assertEqual(getISOWeek(new Date(2021, 0, 1)), 53);
      assertEqual(getISOWeek(new Date(2021, 0, 2)), 53);
      assertEqual(getISOWeek(new Date(2021, 0, 3)), 53);
      assertEqual(getISOWeek(new Date(2021, 0, 4)), 1);
      assertEqual(getISOWeek(new Date(2021, 0, 5)), 1);
      assertEqual(getISOWeek(new Date(2021, 0, 6)), 1);
    });

    it('should handle other edge cases', () => {
      assertEqual(getISOWeek(new Date(2005, 0, 1)), 53);
      assertEqual(getISOWeek(new Date(2005, 0, 2)), 53);
      assertEqual(getISOWeek(new Date(2005, 11, 31)), 52);
      assertEqual(getISOWeek(new Date(2006, 0, 1)), 52);
      assertEqual(getISOWeek(new Date(2006, 0, 2)), 1);
      assertEqual(getISOWeek(new Date(2006, 11, 31)), 52);
      assertEqual(getISOWeek(new Date(2007, 0, 1)), 1);
      assertEqual(getISOWeek(new Date(2007, 11, 30)), 52);
      assertEqual(getISOWeek(new Date(2007, 11, 31)), 1);
      assertEqual(getISOWeek(new Date(2008, 0, 1)), 1);
      assertEqual(getISOWeek(new Date(2008, 11, 28)), 52);
      assertEqual(getISOWeek(new Date(2008, 11, 29)), 1);
      assertEqual(getISOWeek(new Date(2008, 11, 30)), 1);
      assertEqual(getISOWeek(new Date(2008, 11, 31)), 1);
      assertEqual(getISOWeek(new Date(2009, 0, 1)), 1);
      assertEqual(getISOWeek(new Date(2009, 11, 31)), 53);
      assertEqual(getISOWeek(new Date(2010, 0, 1)), 53);
      assertEqual(getISOWeek(new Date(2010, 0, 2)), 53);
      assertEqual(getISOWeek(new Date(2010, 0, 3)), 53);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        getISOWeek();
      });
      assertError(() => {
        getISOWeek(null);
      });
      assertError(() => {
        getISOWeek(NaN);
      });
      assertError(() => {
        getISOWeek(5);
      });
    });
  });

  describeInstance('setISOWeek', function (setISOWeek) {

    it('should provide the correct ISO week for 2020', () => {
      const date = new Date(2020, 0);
      setISOWeek(date, 1);
      assertDateEqual(date, new Date(2020, 0));
      setISOWeek(date, 2);
      assertDateEqual(date, new Date(2020, 0, 8));
      setISOWeek(date, 3);
      assertDateEqual(date, new Date(2020, 0, 15));
      setISOWeek(date, 30);
      assertDateEqual(date, new Date(2020, 6, 22));
      setISOWeek(date, 50);
      assertDateEqual(date, new Date(2020, 11, 9));
      setISOWeek(date, 52);
      assertDateEqual(date, new Date(2020, 11, 23));
      setISOWeek(date, 53);
      assertDateEqual(date, new Date(2020, 11, 30));
    });

    it('should traverse into a new Gregorian year', () => {
      const date = new Date(2020, 0, 5);
      setISOWeek(date, 53);
      assertDateEqual(date, new Date(2021, 0, 3));
    });

    it('should return a timestamp for the updated date', () => {
      assertEqual(setISOWeek(new Date(2020, 0), 3), new Date(2020, 0, 15).getTime());
    });

    it('should handle irregular input', () => {
      assertNaN(setISOWeek(new Date()));
      assertError(() => {
        setISOWeek();
      });
      assertError(() => {
        setISOWeek(null);
      });
      assertError(() => {
        setISOWeek(NaN);
      });
      assertError(() => {
        setISOWeek(5);
      });
    });

    it('should handle issue #251', () => {
      const date = new Date(2013, 0, 6);
      setISOWeek(date, 1);
      assertDateEqual(date, new Date(2013, 0, 6));
    });

  });

  describeInstance('setDay,setWeekday', function (setWeekday) {

    it('should set the weekday', () => {
      const date = new Date(2020, 0);
      setWeekday(date, 0);
      assertDateEqual(date, new Date(2019, 11, 29));
      setWeekday(date, 1);
      assertDateEqual(date, new Date(2019, 11, 30));
      setWeekday(date, 2);
      assertDateEqual(date, new Date(2019, 11, 31));
      setWeekday(date, 3);
      assertDateEqual(date, new Date(2020, 0, 1));
      setWeekday(date, 4);
      assertDateEqual(date, new Date(2020, 0, 2));
      setWeekday(date, 5);
      assertDateEqual(date, new Date(2020, 0, 3));
      setWeekday(date, 6);
      assertDateEqual(date, new Date(2020, 0, 4));
    });

    it('should be able to overshoot boundaries', () => {
      const date = new Date(2020, 0);
      setWeekday(date, -1);
      assertDateEqual(date, new Date(2019, 11, 28));
      setWeekday(date, 14);
      assertDateEqual(date, new Date(2020, 0, 5));
    });

    it('should return a timestamp', () => {
      assertEqual(setWeekday(new Date(2020, 0), 6), new Date(2020, 0, 4).getTime());
    });

    it('should handle irregular input', () => {
      assertNaN(setWeekday(new Date(2020, 0)));
      assertError(() => {
        setWeekday();
      });
    });

  });

  describeInstance('getWeekday', function (getWeekday) {

    it('should be an alias for getDay', () => {
      assertEqual(getWeekday(new Date(2019, 11, 29)), 0);
      assertEqual(getWeekday(new Date(2019, 11, 30)), 1);
      assertEqual(getWeekday(new Date(2019, 11, 31)), 2);
      assertEqual(getWeekday(new Date(2020, 0, 1)), 3);
      assertEqual(getWeekday(new Date(2020, 0, 2)), 4);
      assertEqual(getWeekday(new Date(2020, 0, 3)), 5);
      assertEqual(getWeekday(new Date(2020, 0, 4)), 6);
    });

  });

  describeInstance('getDaysInMonth', function (getDaysInMonth) {

    it('should get the correct days in the month', () => {
      assertEqual(getDaysInMonth(new Date(2020, 0)), 31);
      assertEqual(getDaysInMonth(new Date(2020, 1)), 29);
      assertEqual(getDaysInMonth(new Date(2020, 2)), 31);
      assertEqual(getDaysInMonth(new Date(2020, 3)), 30);
      assertEqual(getDaysInMonth(new Date(2020, 4)), 31);
      assertEqual(getDaysInMonth(new Date(2020, 5)), 30);
      assertEqual(getDaysInMonth(new Date(2020, 6)), 31);
      assertEqual(getDaysInMonth(new Date(2020, 7)), 31);
      assertEqual(getDaysInMonth(new Date(2020, 8)), 30);
      assertEqual(getDaysInMonth(new Date(2020, 9)), 31);
      assertEqual(getDaysInMonth(new Date(2020, 10)), 30);
      assertEqual(getDaysInMonth(new Date(2020, 11)), 31);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        getDaysInMonth(new Date('invalid'));
      });
      assertError(() => {
        getDaysInMonth();
      });
    });
  });

  describeInstance('isLeapYear', function (isLeapYear) {

    it('should correctly determine leap years', () => {
      assertEqual(isLeapYear(new Date(2008, 0)), true);
      assertEqual(isLeapYear(new Date(2009, 0)), false);
      assertEqual(isLeapYear(new Date(2010, 0)), false);
      assertEqual(isLeapYear(new Date(2011, 0)), false);
      assertEqual(isLeapYear(new Date(2012, 0)), true);
      assertEqual(isLeapYear(new Date(2016, 0)), true);
      assertEqual(isLeapYear(new Date(2020, 0)), true);
      assertEqual(isLeapYear(new Date(2021, 0)), false);
      assertEqual(isLeapYear(new Date(1600, 0)), true);
      assertEqual(isLeapYear(new Date(1700, 0)), false);
      assertEqual(isLeapYear(new Date(1800, 0)), false);
      assertEqual(isLeapYear(new Date(1900, 0)), false);
      assertEqual(isLeapYear(new Date(2000, 0)), true);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        isLeapYear();
      });
      assertError(() => {
        isLeapYear(null);
      });
    });

  });

  describeInstance('startOfYear', function (startOfYear) {

    it('should correctly reset the year', () => {
      assertDateEqual(startOfYear(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(startOfYear(new Date(2020, 0, 2)), new Date(2020, 0));
      assertDateEqual(startOfYear(new Date(2020, 1, 15)), new Date(2020, 0));
      assertDateEqual(startOfYear(new Date(2020, 11, 31)), new Date(2020, 0));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(startOfYear(new Date(2020, 3, 3, 23, 59, 59, 999)), new Date(2020, 0));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 5);
      startOfYear(date);
      assertDateEqual(date, new Date(2020, 0));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        startOfYear();
      });
      assertError(() => {
        startOfYear(null);
      });
      assertError(() => {
        startOfYear(5);
      });
    });

  });

  describeInstance('startOfMonth', function (startOfMonth) {

    it('should correctly reset the month', () => {
      assertDateEqual(startOfMonth(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(startOfMonth(new Date(2020, 1)), new Date(2020, 1));
      assertDateEqual(startOfMonth(new Date(2020, 1, 15)), new Date(2020, 1));
      assertDateEqual(startOfMonth(new Date(2020, 11, 31)), new Date(2020, 11));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(startOfMonth(new Date(2020, 1, 3, 23, 59, 59, 999)), new Date(2020, 1));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 1, 5);
      startOfMonth(date);
      assertDateEqual(date, new Date(2020, 1));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        startOfMonth();
      });
      assertError(() => {
        startOfMonth(null);
      });
      assertError(() => {
        startOfMonth(5);
      });
    });

  });

  describeInstance('startOfWeek', function (startOfWeek) {

    it('should correctly reset the week to Sunday', () => {
      assertDateEqual(startOfWeek(new Date(2019, 11, 30)), new Date(2019, 11, 29));
      assertDateEqual(startOfWeek(new Date(2019, 11, 31)), new Date(2019, 11, 29));
      assertDateEqual(startOfWeek(new Date(2020, 0, 1)), new Date(2019, 11, 29));
      assertDateEqual(startOfWeek(new Date(2020, 0, 2)), new Date(2019, 11, 29));
      assertDateEqual(startOfWeek(new Date(2020, 0, 3)), new Date(2019, 11, 29));
      assertDateEqual(startOfWeek(new Date(2020, 0, 4)), new Date(2019, 11, 29));
      assertDateEqual(startOfWeek(new Date(2020, 0, 5)), new Date(2020, 0, 5));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(startOfWeek(new Date(2020, 0, 3, 23, 59, 59, 999)), new Date(2019, 11, 29));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 3);
      startOfWeek(date);
      assertDateEqual(date, new Date(2019, 11, 29));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        startOfWeek();
      });
      assertError(() => {
        startOfWeek(null);
      });
      assertError(() => {
        startOfWeek(5);
      });
    });

  });

  describeInstance('startOfISOWeek', function (startOfISOWeek) {

    it('should correctly reset the week to Sunday', () => {
      assertDateEqual(startOfISOWeek(new Date(2019, 11, 29)), new Date(2019, 11, 23));
      assertDateEqual(startOfISOWeek(new Date(2019, 11, 30)), new Date(2019, 11, 30));
      assertDateEqual(startOfISOWeek(new Date(2019, 11, 31)), new Date(2019, 11, 30));
      assertDateEqual(startOfISOWeek(new Date(2020, 0, 1)), new Date(2019, 11, 30));
      assertDateEqual(startOfISOWeek(new Date(2020, 0, 2)), new Date(2019, 11, 30));
      assertDateEqual(startOfISOWeek(new Date(2020, 0, 3)), new Date(2019, 11, 30));
      assertDateEqual(startOfISOWeek(new Date(2020, 0, 4)), new Date(2019, 11, 30));
      assertDateEqual(startOfISOWeek(new Date(2020, 0, 5)), new Date(2019, 11, 30));
      assertDateEqual(startOfISOWeek(new Date(2020, 0, 6)), new Date(2020, 0, 6));
      assertDateEqual(startOfISOWeek(new Date(2020, 0, 7)), new Date(2020, 0, 6));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(startOfISOWeek(new Date(2020, 0, 3, 23, 59, 59, 999)), new Date(2019, 11, 30));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 3);
      startOfISOWeek(date);
      assertDateEqual(date, new Date(2019, 11, 30));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        startOfISOWeek();
      });
      assertError(() => {
        startOfISOWeek(null);
      });
      assertError(() => {
        startOfISOWeek(5);
      });
    });

    it('should handle issue #326', () => {
      assertDateEqual(startOfISOWeek(new Date(2013, 6, 8)),  new Date(2013, 6, 8));
      assertDateEqual(startOfISOWeek(new Date(2013, 6, 9)),  new Date(2013, 6, 8));
      assertDateEqual(startOfISOWeek(new Date(2013, 6, 10)), new Date(2013, 6, 8));
      assertDateEqual(startOfISOWeek(new Date(2013, 6, 11)), new Date(2013, 6, 8));
      assertDateEqual(startOfISOWeek(new Date(2013, 6, 12)), new Date(2013, 6, 8));
      assertDateEqual(startOfISOWeek(new Date(2013, 6, 13)), new Date(2013, 6, 8));
      assertDateEqual(startOfISOWeek(new Date(2013, 6, 14)), new Date(2013, 6, 8));
      assertDateEqual(startOfISOWeek(new Date(2013, 6, 15)), new Date(2013, 6, 15));
      assertDateEqual(startOfISOWeek(new Date(2013, 6, 10, 8, 30)), new Date(2013, 6, 8));
    });

  });

  describeInstance('startOfDay', function (startOfDay) {

    it('should correctly reset the date', () => {
      assertDateEqual(startOfDay(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(startOfDay(new Date(2020, 0, 1, 1)), new Date(2020, 0));
      assertDateEqual(startOfDay(new Date(2020, 0, 1, 23)), new Date(2020, 0));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(startOfDay(new Date(2020, 0, 1, 23, 59, 59, 999)), new Date(2020, 0, 1));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 1, 12);
      startOfDay(date);
      assertDateEqual(date, new Date(2020, 0));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        startOfDay();
      });
      assertError(() => {
        startOfDay(null);
      });
      assertError(() => {
        startOfDay(5);
      });
    });

  });

  describeInstance('startOfHour', function (startOfHour) {

    it('should correctly reset the hour', () => {
      assertDateEqual(startOfHour(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(startOfHour(new Date(2020, 0, 1, 0, 30)), new Date(2020, 0));
      assertDateEqual(startOfHour(new Date(2020, 0, 1, 0, 59)), new Date(2020, 0));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(startOfHour(new Date(2020, 0, 1, 23, 59, 59, 999)), new Date(2020, 0, 1, 23));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 1, 12, 30);
      startOfHour(date);
      assertDateEqual(date, new Date(2020, 0, 1, 12));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        startOfHour();
      });
      assertError(() => {
        startOfHour(null);
      });
      assertError(() => {
        startOfHour(5);
      });
    });

  });

  describeInstance('startOfMinute', function (startOfMinute) {

    it('should correctly reset the minute', () => {
      assertDateEqual(startOfMinute(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(startOfMinute(new Date(2020, 0, 1, 0, 0, 30)), new Date(2020, 0));
      assertDateEqual(startOfMinute(new Date(2020, 0, 1, 0, 0, 59)), new Date(2020, 0));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(startOfMinute(new Date(2020, 0, 1, 23, 59, 59, 999)), new Date(2020, 0, 1, 23, 59));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 1, 0, 0, 30);
      startOfMinute(date);
      assertDateEqual(date, new Date(2020, 0));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        startOfMinute();
      });
      assertError(() => {
        startOfMinute(null);
      });
      assertError(() => {
        startOfMinute(5);
      });
    });

  });

  describeInstance('startOfSecond', function (startOfSecond) {

    it('should correctly reset the secon', () => {
      assertDateEqual(startOfSecond(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(startOfSecond(new Date(2020, 0, 1, 0, 0, 0, 500)), new Date(2020, 0));
      assertDateEqual(startOfSecond(new Date(2020, 0, 1, 0, 0, 0, 999)), new Date(2020, 0));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(startOfSecond(new Date(2020, 0, 1, 23, 59, 59, 999)), new Date(2020, 0, 1, 23, 59, 59));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 1, 0, 0, 0, 999);
      startOfSecond(date);
      assertDateEqual(date, new Date(2020, 0));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        startOfSecond();
      });
      assertError(() => {
        startOfSecond(null);
      });
      assertError(() => {
        startOfSecond(5);
      });
    });

  });

  describeInstance('endOfYear', function (endOfYear) {

    it('should correctly set to the end of the year', () => {
      assertDateEqual(endOfYear(new Date(2020, 0)), new Date(2020, 11, 31, 23, 59, 59, 999));
      assertDateEqual(endOfYear(new Date(2020, 5)), new Date(2020, 11, 31, 23, 59, 59, 999));
      assertDateEqual(endOfYear(new Date(2021, 5)), new Date(2021, 11, 31, 23, 59, 59, 999));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 5);
      endOfYear(date);
      assertDateEqual(date, new Date(2020, 11, 31, 23, 59, 59, 999));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        endOfYear();
      });
      assertError(() => {
        endOfYear(null);
      });
      assertError(() => {
        endOfYear(5);
      });
    });

  });

  describeInstance('endOfMonth', function (endOfMonth) {

    it('should correctly set to the end of the month', () => {
      assertDateEqual(endOfMonth(new Date(2020, 0)), new Date(2020, 0, 31, 23, 59, 59, 999));
      assertDateEqual(endOfMonth(new Date(2020, 1)), new Date(2020, 1, 29, 23, 59, 59, 999));
      assertDateEqual(endOfMonth(new Date(2020, 1, 15)), new Date(2020, 1, 29, 23, 59, 59, 999));
      assertDateEqual(endOfMonth(new Date(2020, 11, 12)), new Date(2020, 11, 31, 23, 59, 59, 999));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 1, 5);
      endOfMonth(date);
      assertDateEqual(date, new Date(2020, 1, 29, 23, 59, 59, 999));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        endOfMonth();
      });
      assertError(() => {
        endOfMonth(null);
      });
      assertError(() => {
        endOfMonth(5);
      });
    });

  });

  describeInstance('endOfWeek', function (endOfWeek) {

    it('should correctly set to end of Saturday', () => {
      assertDateEqual(endOfWeek(new Date(2019, 11, 30)), new Date(2020, 0, 4, 23, 59, 59, 999));
      assertDateEqual(endOfWeek(new Date(2019, 11, 31)), new Date(2020, 0, 4, 23, 59, 59, 999));
      assertDateEqual(endOfWeek(new Date(2020, 0, 1)), new Date(2020, 0, 4, 23, 59, 59, 999));
      assertDateEqual(endOfWeek(new Date(2020, 0, 2)), new Date(2020, 0, 4, 23, 59, 59, 999));
      assertDateEqual(endOfWeek(new Date(2020, 0, 3)), new Date(2020, 0, 4, 23, 59, 59, 999));
      assertDateEqual(endOfWeek(new Date(2020, 0, 4)), new Date(2020, 0, 4, 23, 59, 59, 999));
      assertDateEqual(endOfWeek(new Date(2020, 0, 5)), new Date(2020, 0, 11, 23, 59, 59, 999));
      assertDateEqual(endOfWeek(new Date(2020, 0, 6)), new Date(2020, 0, 11, 23, 59, 59, 999));
      assertDateEqual(endOfWeek(new Date(2020, 0, 7)), new Date(2020, 0, 11, 23, 59, 59, 999));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 3);
      endOfWeek(date);
      assertDateEqual(date, new Date(2020, 0, 4, 23, 59, 59, 999));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        endOfWeek();
      });
      assertError(() => {
        endOfWeek(null);
      });
      assertError(() => {
        endOfWeek(5);
      });
    });

  });

  describeInstance('endOfISOWeek', function (endOfISOWeek) {

    it('should correctly set end of Sunday', () => {
      assertDateEqual(endOfISOWeek(new Date(2019, 11, 30)), new Date(2020, 0, 5, 23, 59, 59, 999));
      assertDateEqual(endOfISOWeek(new Date(2019, 11, 31)), new Date(2020, 0, 5, 23, 59, 59, 999));
      assertDateEqual(endOfISOWeek(new Date(2020, 0, 1)), new Date(2020, 0, 5, 23, 59, 59, 999));
      assertDateEqual(endOfISOWeek(new Date(2020, 0, 2)), new Date(2020, 0, 5, 23, 59, 59, 999));
      assertDateEqual(endOfISOWeek(new Date(2020, 0, 3)), new Date(2020, 0, 5, 23, 59, 59, 999));
      assertDateEqual(endOfISOWeek(new Date(2020, 0, 4)), new Date(2020, 0, 5, 23, 59, 59, 999));
      assertDateEqual(endOfISOWeek(new Date(2020, 0, 5)), new Date(2020, 0, 5, 23, 59, 59, 999));
      assertDateEqual(endOfISOWeek(new Date(2020, 0, 6)), new Date(2020, 0, 12, 23, 59, 59, 999));
      assertDateEqual(endOfISOWeek(new Date(2020, 0, 7)), new Date(2020, 0, 12, 23, 59, 59, 999));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 3);
      endOfISOWeek(date);
      assertDateEqual(date, new Date(2020, 0, 5, 23, 59, 59, 999));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        endOfISOWeek();
      });
      assertError(() => {
        endOfISOWeek(null);
      });
      assertError(() => {
        endOfISOWeek(5);
      });
    });

  });

  describeInstance('endOfDay', function (endOfDay) {

    it('should correctly set to the end of the day', () => {
      assertDateEqual(endOfDay(new Date(2020, 0)), new Date(2020, 0, 1, 23, 59, 59, 999));
      assertDateEqual(endOfDay(new Date(2020, 0, 1, 1)), new Date(2020, 0, 1, 23, 59, 59, 999));
      assertDateEqual(endOfDay(new Date(2020, 0, 1, 12)), new Date(2020, 0, 1, 23, 59, 59, 999));
      assertDateEqual(endOfDay(new Date(2020, 0, 1, 23)), new Date(2020, 0, 1, 23, 59, 59, 999));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 1, 12);
      endOfDay(date);
      assertDateEqual(date, new Date(2020, 0, 1, 23, 59, 59, 999));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        endOfDay();
      });
      assertError(() => {
        endOfDay(null);
      });
      assertError(() => {
        endOfDay(5);
      });
    });

  });

  describeInstance('endOfHour', function (endOfHour) {

    it('should correctly set to the end of the hour', () => {
      assertDateEqual(endOfHour(new Date(2020, 0)), new Date(2020, 0, 1, 0, 59, 59, 999));
      assertDateEqual(endOfHour(new Date(2020, 0, 1, 5)), new Date(2020, 0, 1, 5, 59, 59, 999));
      assertDateEqual(endOfHour(new Date(2020, 0, 1, 5, 30)), new Date(2020, 0, 1, 5, 59, 59, 999));
      assertDateEqual(endOfHour(new Date(2020, 0, 1, 23)), new Date(2020, 0, 1, 23, 59, 59, 999));
      assertDateEqual(endOfHour(new Date(2020, 0, 1, 23, 30)), new Date(2020, 0, 1, 23, 59, 59, 999));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 1, 12, 30);
      endOfHour(date);
      assertDateEqual(date, new Date(2020, 0, 1, 12, 59, 59, 999));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        endOfHour();
      });
      assertError(() => {
        endOfHour(null);
      });
      assertError(() => {
        endOfHour(5);
      });
    });

  });

  describeInstance('endOfMinute', function (endOfMinute) {

    it('should correctly set the minute', () => {
      assertDateEqual(endOfMinute(new Date(2020, 0)), new Date(2020, 0, 1, 0, 0, 59, 999));
      assertDateEqual(endOfMinute(new Date(2020, 0, 1, 12, 5)), new Date(2020, 0, 1, 12, 5, 59, 999));
      assertDateEqual(endOfMinute(new Date(2020, 0, 1, 12, 5, 30)), new Date(2020, 0, 1, 12, 5, 59, 999));
      assertDateEqual(endOfMinute(new Date(2020, 0, 1, 12, 30)), new Date(2020, 0, 1, 12, 30, 59, 999));
      assertDateEqual(endOfMinute(new Date(2020, 0, 1, 12, 30, 30)), new Date(2020, 0, 1, 12, 30, 59, 999));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0, 1, 0, 0, 30);
      endOfMinute(date);
      assertDateEqual(date, new Date(2020, 0, 1, 0, 0, 59, 999));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        endOfMinute();
      });
      assertError(() => {
        endOfMinute(null);
      });
      assertError(() => {
        endOfMinute(5);
      });
    });

  });

  describeInstance('endOfSecond', function (endOfSecond) {

    it('should correctly set the secon', () => {
      assertDateEqual(endOfSecond(new Date(2020, 0)), new Date(2020, 0, 1, 0, 0, 0, 999));
      assertDateEqual(endOfSecond(new Date(2020, 0, 1, 12, 30, 5)), new Date(2020, 0, 1, 12, 30, 5, 999));
      assertDateEqual(endOfSecond(new Date(2020, 0, 1, 12, 30, 5, 30)), new Date(2020, 0, 1, 12, 30, 5, 999));
      assertDateEqual(endOfSecond(new Date(2020, 0, 1, 12, 30, 30)), new Date(2020, 0, 1, 12, 30, 30, 999));
      assertDateEqual(endOfSecond(new Date(2020, 0, 1, 12, 30, 30, 30)), new Date(2020, 0, 1, 12, 30, 30, 999));
    });

    it('should modify the date', () => {
      const date = new Date(2020, 0);
      endOfSecond(date);
      assertDateEqual(date, new Date(2020, 0, 1, 0, 0, 0, 999));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        endOfSecond();
      });
      assertError(() => {
        endOfSecond(null);
      });
      assertError(() => {
        endOfSecond(5);
      });
    });

  });

  describeInstance('clone', function (clone) {

    it('should create a copy of the date', () => {
      const date = new Date();
      assertFalse(date === clone(date));
    });

    it('should clone the date', () => {
      assertDateEqual(clone(new Date(2020, 0)), new Date(2020, 0));
    });

    it('should clone invalid dates', () => {
      assertNaN(clone(new Date('invalid')).getTime());
    });

    it('should handle invalid input', () => {
      assertError(() => {
        clone();
      });
      assertError(() => {
        clone(null);
      });
      assertError(() => {
        clone(NaN);
      });
      assertError(() => {
        clone(5);
      });
    });

  });

  describeInstance('isWeekday', function (isWeekday) {

    it('should correctly identify weekdays', () => {
      assertEqual(isWeekday(new Date(2020, 0, 1)), true);
      assertEqual(isWeekday(new Date(2020, 0, 2)), true);
      assertEqual(isWeekday(new Date(2020, 0, 3)), true);
      assertEqual(isWeekday(new Date(2020, 0, 4)), false);
      assertEqual(isWeekday(new Date(2020, 0, 5)), false);
      assertEqual(isWeekday(new Date(2020, 0, 7)), true);
      assertEqual(isWeekday(new Date(2020, 0, 8)), true);
    });

    it('should be false for invalid dates', () => {
      assertFalse(isWeekday(new Date('invalid')));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        isWeekday();
      });
      assertError(() => {
        isWeekday(null);
      });
      assertError(() => {
        isWeekday(NaN);
      });
      assertError(() => {
        isWeekday(5);
      });
    });
  });

  describeInstance('isWeekend', function (isWeekend) {

    it('should correctly identify weekdays', () => {
      assertEqual(isWeekend(new Date(2020, 0, 1)), false);
      assertEqual(isWeekend(new Date(2020, 0, 2)), false);
      assertEqual(isWeekend(new Date(2020, 0, 3)), false);
      assertEqual(isWeekend(new Date(2020, 0, 4)), true);
      assertEqual(isWeekend(new Date(2020, 0, 5)), true);
      assertEqual(isWeekend(new Date(2020, 0, 7)), false);
      assertEqual(isWeekend(new Date(2020, 0, 8)), false);
    });

    it('should be false for invalid dates', () => {
      assertFalse(isWeekend(new Date('invalid')));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        isWeekend();
      });
      assertError(() => {
        isWeekend(null);
      });
      assertError(() => {
        isWeekend(NaN);
      });
      assertError(() => {
        isWeekend(5);
      });
    });
  });

  describeInstance('relative', function (relative) {

    it('should format past relative dates', () => {
      assertEqual(relative(new Date(2019, 11, 31, 23, 59, 59)), '1 second ago');
      assertEqual(relative(new Date(2019, 11, 31, 23, 59, 58)), '2 seconds ago');
      assertEqual(relative(new Date(2019, 11, 31, 23, 59)), '1 minute ago');
      assertEqual(relative(new Date(2019, 11, 31, 23, 58)), '2 minutes ago');
      assertEqual(relative(new Date(2019, 11, 31, 23)), '1 hour ago');
      assertEqual(relative(new Date(2019, 11, 31, 22)), '2 hours ago');
      assertEqual(relative(new Date(2019, 11, 31, 12)), '12 hours ago');
      assertEqual(relative(new Date(2019, 11, 31)), '1 day ago');
      assertEqual(relative(new Date(2019, 11, 30)), '2 days ago');
      assertEqual(relative(new Date(2019, 11, 27)), '5 days ago');
      assertEqual(relative(new Date(2019, 11, 25)), '1 week ago');
      assertEqual(relative(new Date(2019, 11)), '1 month ago');
      assertEqual(relative(new Date(2019, 6)), '6 months ago');
      assertEqual(relative(new Date(2019, 0)), '1 year ago');
    });

    it('should format future relative dates', () => {
      assertEqual(relative(new Date(2020, 0, 1, 0, 0, 1)), 'in 1 second');
      assertEqual(relative(new Date(2020, 0, 1, 0, 0, 2)), 'in 2 seconds');
      assertEqual(relative(new Date(2020, 0, 1, 0, 1)), 'in 1 minute');
      assertEqual(relative(new Date(2020, 0, 1, 0, 2)), 'in 2 minutes');
      assertEqual(relative(new Date(2020, 0, 1, 1)), 'in 1 hour');
      assertEqual(relative(new Date(2020, 0, 1, 2)), 'in 2 hours');
      assertEqual(relative(new Date(2020, 0, 1, 12)), 'in 12 hours');
      assertEqual(relative(new Date(2020, 0, 2)), 'in 1 day');
      assertEqual(relative(new Date(2020, 0, 3)), 'in 2 days');
      assertEqual(relative(new Date(2020, 0, 6)), 'in 5 days');
      assertEqual(relative(new Date(2020, 0, 8)), 'in 1 week');
      assertEqual(relative(new Date(2020, 1, 1)), 'in 1 month');
      assertEqual(relative(new Date(2020, 6, 1)), 'in 6 months');
      assertEqual(relative(new Date(2021, 0)), 'in 1 year');
    });

    it('should format minimum unit as seconds', () => {
      assertEqual(relative(new Date(2019, 11, 31, 23, 59, 59, 1)), '0 seconds ago');
      assertEqual(relative(new Date(2019, 11, 31, 23, 59, 59, 500)), '0 seconds ago');
      assertEqual(relative(new Date(2019, 11, 31, 23, 59, 59, 999)), '0 seconds ago');
      assertEqual(relative(new Date(2020, 0, 1, 0, 0, 0, 1)), 'in 0 seconds');
      assertEqual(relative(new Date(2020, 0, 1, 0, 0, 0, 500)), 'in 0 seconds');
      assertEqual(relative(new Date(2020, 0, 1, 0, 0, 0, 999)), 'in 0 seconds');
    });

    it('should format maximum unit as years', () => {
      assertEqual(relative(new Date(2015, 0)), '5 years ago');
      assertEqual(relative(new Date(2010, 0)), '10 years ago');
      assertEqual(relative(new Date(1920, 0)), '100 years ago');
      assertEqual(relative(new Date(1020, 0)), '1,000 years ago');
      assertEqual(relative(new Date(-7980, 0)), '10,000 years ago');
      assertEqual(relative(new Date(2025, 0)), 'in 5 years');
      assertEqual(relative(new Date(2030, 0)), 'in 10 years');
      assertEqual(relative(new Date(2120, 0)), 'in 100 years');
      assertEqual(relative(new Date(3020, 0)), 'in 1,000 years');
      assertEqual(relative(new Date(12020, 0)), 'in 10,000 years');
    });

    it('should be able to pass a locale code to create a formatter', () => {
      function getFormatted(value, unit) {
        return new Intl.RelativeTimeFormat('ja').format(value, unit);
      }
      assertEqual(relative(new Date(2019, 11, 31, 23, 59, 59, 1), 'ja'), getFormatted(-0, 'second'));
      assertEqual(relative(new Date(2019, 11, 31, 23, 59, 59), 'ja'), getFormatted(-1, 'second'));
      assertEqual(relative(new Date(2019, 11, 31, 23, 59), 'ja'), getFormatted(-1, 'minute'));
      assertEqual(relative(new Date(2019, 11, 31, 23), 'ja'), getFormatted(-1, 'hour'));
      assertEqual(relative(new Date(2019, 11, 31), 'ja'), getFormatted(-1, 'day'));
      assertEqual(relative(new Date(2019, 11, 25), 'ja'), getFormatted(-1, 'week'));
      assertEqual(relative(new Date(2019, 11), 'ja'), getFormatted(-1, 'month'));
      assertEqual(relative(new Date(2019, 6), 'ja'), getFormatted(-6, 'month'));
      assertEqual(relative(new Date(2019, 0), 'ja'), getFormatted(-1, 'year'));
      assertEqual(relative(new Date(2015, 0), 'ja'), getFormatted(-5, 'year'));
      assertEqual(relative(new Date(2010, 0), 'ja'), getFormatted(-10, 'year'));
      assertEqual(relative(new Date(1920, 0), 'ja'), getFormatted(-100, 'year'));
      assertEqual(relative(new Date(1020, 0), 'ja'), getFormatted(-1000, 'year'));

      assertEqual(relative(new Date(2020, 0, 1, 0, 0, 0, 1), 'ja'), getFormatted(0, 'second'));
      assertEqual(relative(new Date(2020, 0, 1, 0, 0, 1), 'ja'), getFormatted(1, 'second'));
      assertEqual(relative(new Date(2020, 0, 1, 0, 1), 'ja'), getFormatted(1, 'minute'));
      assertEqual(relative(new Date(2020, 0, 1, 1), 'ja'), getFormatted(1, 'hour'));
      assertEqual(relative(new Date(2020, 0, 2), 'ja'), getFormatted(1, 'day'));
      assertEqual(relative(new Date(2020, 0, 8), 'ja'), getFormatted(1, 'week'));
      assertEqual(relative(new Date(2020, 1, 1), 'ja'), getFormatted(1, 'month'));
      assertEqual(relative(new Date(2021, 0), 'ja'), getFormatted(1, 'year'));
      assertEqual(relative(new Date(2025, 0), 'ja'), getFormatted(5, 'year'));
      assertEqual(relative(new Date(2030, 0), 'ja'), getFormatted(10, 'year'));
      assertEqual(relative(new Date(2120, 0), 'ja'), getFormatted(100, 'year'));
      assertEqual(relative(new Date(3020, 0), 'ja'), getFormatted(1000, 'year'));
    });

    it('should be able to pass a formatter', () => {
      const formatter = new Intl.RelativeTimeFormat('en', {
        numeric: 'auto',
      });
      assertEqual(relative(new Date(2019, 11, 31), formatter), 'yesterday');
      assertEqual(relative(new Date(2020, 0, 2), formatter), 'tomorrow');
    });

    it('should be able to pass a date to change the relative format', () => {
      assertEqual(relative(new Date(2020, 0), new Date(2020, 0)), '0 seconds');
      assertEqual(relative(new Date(2020, 0), new Date(2021, 0)), '1 year');
      assertEqual(relative(new Date(2020, 0), new Date(2019, 0)), '1 year');
    });

    it('should default to type numeric when compare option is passed', () => {
      assertEqual(
        relative(new Date(2015, 0), {
          compare: new Date(2017, 0),
        }),
        '2 years'
      );
    });

    it('should still be able to format as relative when explicitly set', () => {
      assertEqual(
        relative(new Date(2015, 0), {
          type: 'relative',
          compare: new Date(2017, 0),
        }),
        '2 years ago'
      );
    });

    it('should be able to pass a resolver function', () => {
      function resolve(value, unit, date) {
        if (unit !== 'hour' && unit !== 'minute' && unit !== 'second') {
          return date.toISOString();
        }
      }
      assertEqual(relative(new Date(2019, 11, 31, 23), resolve), '1 hour ago');
      assertEqual(relative(new Date(2019, 0), resolve), new Date(2019, 0).toISOString());
    });

    it('should pass correct arguments to the resolver function', () => {
      relative(new Date(2019, 11), (value, unit, date, options) => {
        assertEqual(value, -1);
        assertEqual(unit, 'month');
        assertDateEqual(date, new Date(2019, 11));
        assertDateEqual(options.compare, new Date());
        assertInstanceOf(options.formatter, Intl.RelativeTimeFormat);
        assertInstanceOf(options.resolve, Function);
      });
      const locale = 'ja';
      const compare = new Date(2019, 0);
      const formatter = new Intl.RelativeTimeFormat();
      const resolve = (value, unit, date, options) => {
        assertEqual(value, 2);
        assertEqual(unit, 'year');
        assertDateEqual(date, new Date(2021, 0));
        assertDateEqual(options.compare, new Date(2019, 0));
        assertEqual(options.locale, 'ja');
        assertEqual(options.resolve, resolve);
        assertEqual(options.formatter, formatter);
        return 'override';
      };
      const result = relative(new Date(2021, 0), {
        locale,
        compare,
        formatter,
        resolve,
      });
      assertEqual(result, 'override');
    });

    it('should allow empty strings to override the result', () => {
      assertEqual(
        relative(new Date(), {
          resolve: () => '',
        }),
        ''
      );
    });

    it('should allow complex options to override result', () => {
      const options = {
        compare: new Date(2021, 0, 1),
        formatter: new Intl.RelativeTimeFormat('ja', {
          style: 'narrow',
          numeric: 'auto',
        }),
        resolve: (value, unit, date) => {
          if (unit === 'month' || unit === 'year') {
            return date.toISOString();
          }
        },
      }
      assertEqual(relative(new Date(2021, 0, 2), options), '明日');
      assertEqual(relative(new Date(2021, 0, 15), options), '2週間後');
      assertEqual(relative(new Date(2021, 3), options), new Date(2021, 3).toISOString());
      assertEqual(relative(new Date(2022, 0), options), new Date(2022, 0).toISOString());
    });

    it('should allow a custom formatter object', () => {
      const options = {
        formatter: {
          format: (value, unit) => {
            return `${value} of your "${unit}s"`;
          }
        },
      }
      assertEqual(relative(new Date(2020, 0, 1, 0, 1), options), '1 of your "minutes"');
      assertEqual(relative(new Date(2020, 0, 3), options), '2 of your "days"');
      assertEqual(relative(new Date(2025, 0), options), '5 of your "years"');
    });

    it('should not modify options object', () => {
      const options = { locale: 'ja' };
      relative(new Date(2020, 0), options);
      assertObjectEqual(options, { locale: 'ja' });
    });

    it('should handle irregular input', () => {
      assertError(() => {
        relative();
      });
      assertError(() => {
        relative(null);
      });
      assertError(() => {
        relative(NaN);
      });
      assertError(() => {
        relative(new Date('invalid'));
      });
      assertError(() => {
        relative(new Date(), {
          compare: new Date('invalid'),
        });
      });
    });

    it('should handle issue #474', () => {
      assertEqual(
        relative(new Date(2020, 1), {
          compare: new Date(2020, 0),
        }),
        '1 month'
      );
      assertEqual(
        relative(new Date(2020, 2), {
          compare: new Date(2020, 1),
        }),
        '1 month'
      );
      assertEqual(
        relative(new Date(2020, 1, 29), {
          compare: new Date(2020, 1),
        }),
        '4 weeks'
      );
    });

  });

  describeInstance('format', function (format) {

    it('should use datetime long format with no arguments', () => {
      assertEqual(
        format(new Date(2020, 0)),
        'January 1, 2020, 12:00 AM'
      );
      assertEqual(
        format(new Date(2020, 6, 11, 23, 30, 30)),
        'July 11, 2020, 11:30 PM'
      );
    });

    describe('formatting with built-in aliases', () => {

      describe('date formats', () => {

        it('should correctly apply full date format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATE_FULL),
            'Wednesday, January 1, 2020'
          );
          assertEqual(
            format(new Date(2020, 6, 11, 23, 30, 30), Sugar.Date.DATE_FULL),
            'Saturday, July 11, 2020'
          );
        });

        it('should correctly apply long date format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATE_LONG),
            'January 1, 2020'
          );
          assertEqual(
            format(new Date(2020, 6, 11, 23, 30, 30), Sugar.Date.DATE_LONG),
            'July 11, 2020'
          );
        });

        it('should correctly apply medium date format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATE_MEDIUM),
            'Jan 1, 2020'
          );
          assertEqual(
            format(new Date(2020, 6, 11, 23, 30, 30), Sugar.Date.DATE_MEDIUM),
            'Jul 11, 2020'
          );
        });

        it('should correctly apply short date format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATE_SHORT),
            '1/1/2020'
          );
          assertEqual(
            format(new Date(2020, 6, 11, 23, 30, 30), Sugar.Date.DATE_SHORT),
            '7/11/2020'
          );
        });

      });

      describe('time formats', () => {

        it('should correctly apply full time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_FULL),
            `12:00:00 AM ${getLocalTimeZoneName('long')}`
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_FULL),
            `1:00:00 PM ${getLocalTimeZoneName('long')}`
          );
        });

        it('should correctly apply long time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_LONG),
            `12:00:00 AM ${getLocalTimeZoneName('short')}`
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_LONG),
            `1:00:00 PM ${getLocalTimeZoneName('short')}`
          );
        });

        it('should correctly apply medium time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_MEDIUM),
            '12:00:00 AM',
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_MEDIUM),
            '1:00:00 PM',
          );
        });

        it('should correctly apply short time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_SHORT),
            '12:00 AM',
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_SHORT),
            '1:00 PM',
          );
        });

      });

      describe('24 hour time formats', () => {

        it('should correctly apply full time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_24_FULL),
            `00:00:00 ${getLocalTimeZoneName('long')}`
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_24_FULL),
            `13:00:00 ${getLocalTimeZoneName('long')}`
          );
        });

        it('should correctly apply long time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_24_LONG),
            `00:00:00 ${getLocalTimeZoneName('short')}`
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_24_LONG),
            `13:00:00 ${getLocalTimeZoneName('short')}`
          );
        });

        it('should correctly apply medium time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_24_MEDIUM),
            '00:00:00',
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_24_MEDIUM),
            '13:00:00',
          );
        });

        it('should correctly apply short time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_24_SHORT),
            '00:00',
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_24_SHORT),
            '13:00',
          );
        });

      });

      describe('time with zone formats', () => {

        it('should correctly apply time with zone format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_WITH_ZONE),
            `12:00 AM ${getLocalTimeZoneName('short')}`
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_WITH_ZONE),
            `1:00 PM ${getLocalTimeZoneName('short')}`
          );
        });

        it('should correctly apply time with long zone format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_WITH_LONG_ZONE),
            `12:00 AM ${getLocalTimeZoneName('long')}`
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_WITH_LONG_ZONE),
            `1:00 PM ${getLocalTimeZoneName('long')}`
          );
        });

        it('should correctly apply time with zone format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_24_WITH_ZONE),
            `00:00 ${getLocalTimeZoneName('short')}`
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_24_WITH_ZONE),
            `13:00 ${getLocalTimeZoneName('short')}`
          );
        });

        it('should correctly apply time with long zone format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_24_WITH_LONG_ZONE),
            `00:00 ${getLocalTimeZoneName('long')}`
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_24_WITH_LONG_ZONE),
            `13:00 ${getLocalTimeZoneName('long')}`
          );
        });

      });

      describe('datetime formats', () => {

        it('should correctly apply full time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_FULL),
            'Wednesday, January 1, 2020, 12:00 AM'
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_FULL),
            'Tuesday, July 14, 2020, 1:00 PM'
          );
        });

        it('should correctly apply long time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_LONG),
            'January 1, 2020, 12:00 AM',
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_LONG),
            'July 14, 2020, 1:00 PM',
          );
        });

        it('should correctly apply medium time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_MEDIUM),
            'Jan 1, 2020, 12:00 AM',
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_MEDIUM),
            'Jul 14, 2020, 1:00 PM',
          );
        });

        it('should correctly apply short time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_SHORT),
            '1/1/2020, 12:00 AM',
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_SHORT),
            '7/14/2020, 1:00 PM',
          );
        });

      });

      describe('datetime 24-hour formats', () => {

        it('should correctly apply full time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_24_FULL),
            'Wednesday, January 1, 2020, 00:00'
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_24_FULL),
            'Tuesday, July 14, 2020, 13:00'
          );
        });

        it('should correctly apply long time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_24_LONG),
            'January 1, 2020, 00:00',
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_24_LONG),
            'July 14, 2020, 13:00',
          );
        });

        it('should correctly apply medium time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_24_MEDIUM),
            'Jan 1, 2020, 00:00',
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_24_MEDIUM),
            'Jul 14, 2020, 13:00',
          );
        });

        it('should correctly apply short time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_24_SHORT),
            '1/1/2020, 00:00',
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_24_SHORT),
            '7/14/2020, 13:00',
          );
        });

      });

      describe('datetime with zone', () => {

        it('should correctly apply datetime with zone', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_WITH_ZONE),
            `January 1, 2020, 12:00 AM ${getLocalTimeZoneName('short')}`,
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_WITH_ZONE),
            `July 14, 2020, 1:00 PM ${getLocalTimeZoneName('short')}`,
          );
        });

        it('should correctly apply datetime with long zone', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_WITH_LONG_ZONE),
            `January 1, 2020, 12:00 AM ${getLocalTimeZoneName('long')}`,
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_WITH_LONG_ZONE),
            `July 14, 2020, 1:00 PM ${getLocalTimeZoneName('long')}`,
          );
        });

        it('should correctly apply 24-hour datetime with zone', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_24_WITH_ZONE),
            `January 1, 2020, 00:00 ${getLocalTimeZoneName('short')}`,
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_24_WITH_ZONE),
            `July 14, 2020, 13:00 ${getLocalTimeZoneName('short')}`,
          );
        });

        it('should correctly apply 24-hour datetime with long zone', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_24_WITH_LONG_ZONE),
            `January 1, 2020, 00:00 ${getLocalTimeZoneName('long')}`,
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_24_WITH_LONG_ZONE),
            `July 14, 2020, 13:00 ${getLocalTimeZoneName('long')}`,
          );
        });

      });

    });

    describe('formatting with a token string', () => {

      it('should correctly format era token', () => {
        assertEqual(format(new Date(2020, 0), 'G'), 'AD');
        assertEqual(format(new Date(2020, 0), 'GG'), 'AD');
        assertEqual(format(new Date(2020, 0), 'GGG'), 'AD');
        assertEqual(format(new Date(2020, 0), 'GGGG'), 'Anno Domini');
        assertEqual(format(new Date(2020, 0), 'GGGGG'), 'A');

        assertEqual(format(new Date(-2020, 0), 'G'), 'BC');
        assertEqual(format(new Date(-2020, 0), 'GG'), 'BC');
        assertEqual(format(new Date(-2020, 0), 'GGG'), 'BC');
        assertEqual(format(new Date(-2020, 0), 'GGGG'), 'Before Christ');
        assertEqual(format(new Date(-2020, 0), 'GGGGG'), 'B');
      });

      it('should correctly format year token', () => {
        assertEqual(format(new Date('0002-01-01'), 'y'), '2');
        assertEqual(format(new Date('0020-01-01'), 'y'), '20');
        assertEqual(format(new Date('0200-01-01'), 'y'), '200');
        assertEqual(format(new Date('2000-01-01'), 'y'), '2000');

        assertEqual(format(new Date('0002-01-01'), 'yy'), '02');
        assertEqual(format(new Date('2020-01-01'), 'yy'), '20');
        assertEqual(format(new Date('2050-01-01'), 'yy'), '50');
        assertEqual(format(new Date('2099-01-01'), 'yy'), '99');
        assertEqual(format(new Date('2100-01-01'), 'yy'), '00');

        assertEqual(format(new Date('0002-01-01'), 'yyy'), '002');
        assertEqual(format(new Date('0020-01-01'), 'yyy'), '020');
        assertEqual(format(new Date('0200-01-01'), 'yyy'), '200');
        assertEqual(format(new Date('2000-01-01'), 'yyy'), '2000');

        assertEqual(format(new Date('0002-01-01'), 'yyyy'), '0002');
        assertEqual(format(new Date('0020-01-01'), 'yyyy'), '0020');
        assertEqual(format(new Date('0200-01-01'), 'yyyy'), '0200');
        assertEqual(format(new Date('2000-01-01'), 'yyyy'), '2000');

        assertEqual(format(new Date('0002-01-01'), 'yyyyy'), '00002');
        assertEqual(format(new Date('0020-01-01'), 'yyyyy'), '00020');
        assertEqual(format(new Date('0200-01-01'), 'yyyyy'), '00200');
        assertEqual(format(new Date('2000-01-01'), 'yyyyy'), '02000');
      });

      it('should correctly format ISO week-numbering year token', () => {
        assertEqual(format(new Date('0001-01-01'), 'Y'), '0');
        assertEqual(format(new Date('2005-12-31'), 'Y'), '2005');
        assertEqual(format(new Date('2006-01-01'), 'Y'), '2005');
        assertEqual(format(new Date('2019-12-31'), 'Y'), '2020');
        assertEqual(format(new Date('2020-01-01'), 'Y'), '2020');

        assertEqual(format(new Date('0001-01-01'), 'YY'), '00');
        assertEqual(format(new Date('2005-12-31'), 'YY'), '05');
        assertEqual(format(new Date('2006-01-01'), 'YY'), '05');
        assertEqual(format(new Date('2019-12-31'), 'YY'), '20');
        assertEqual(format(new Date('2020-01-01'), 'YY'), '20');

        assertEqual(format(new Date('0001-01-01'), 'YYY'), '000');
        assertEqual(format(new Date('2005-12-31'), 'YYY'), '2005');
        assertEqual(format(new Date('2006-01-01'), 'YYY'), '2005');
        assertEqual(format(new Date('2019-12-31'), 'YYY'), '2020');
        assertEqual(format(new Date('2020-01-01'), 'YYY'), '2020');

        assertEqual(format(new Date('0001-01-01'), 'YYYY'), '0000');
        assertEqual(format(new Date('2005-12-31'), 'YYYY'), '2005');
        assertEqual(format(new Date('2006-01-01'), 'YYYY'), '2005');
        assertEqual(format(new Date('2019-12-31'), 'YYYY'), '2020');
        assertEqual(format(new Date('2020-01-01'), 'YYYY'), '2020');

        assertEqual(format(new Date('0001-01-01'), 'YYYYY'), '00000');
        assertEqual(format(new Date('2005-12-31'), 'YYYYY'), '02005');
        assertEqual(format(new Date('2006-01-01'), 'YYYYY'), '02005');
        assertEqual(format(new Date('2019-12-31'), 'YYYYY'), '02020');
        assertEqual(format(new Date('2020-01-01'), 'YYYYY'), '02020');
      });

      it('should correctly format quarter token', () => {
        assertEqual(format(new Date(2020, 0, 1), 'Q'), '1');
        assertEqual(format(new Date(2020, 3, 1), 'Q'), '2');
        assertEqual(format(new Date(2020, 6, 1), 'Q'), '3');
        assertEqual(format(new Date(2020, 9, 1), 'Q'), '4');

        assertEqual(format(new Date(2020, 0, 1), 'QQ'), '01');
        assertEqual(format(new Date(2020, 3, 1), 'QQ'), '02');
        assertEqual(format(new Date(2020, 6, 1), 'QQ'), '03');
        assertEqual(format(new Date(2020, 9, 1), 'QQ'), '04');

        assertEqual(format(new Date(2020, 0, 1), 'QQQ'), 'Q1');
        assertEqual(format(new Date(2020, 3, 1), 'QQQ'), 'Q2');
        assertEqual(format(new Date(2020, 6, 1), 'QQQ'), 'Q3');
        assertEqual(format(new Date(2020, 9, 1), 'QQQ'), 'Q4');

        assertEqual(format(new Date(2020, 0, 1), 'QQQQ'), '1st quarter');
        assertEqual(format(new Date(2020, 3, 1), 'QQQQ'), '2nd quarter');
        assertEqual(format(new Date(2020, 6, 1), 'QQQQ'), '3rd quarter');
        assertEqual(format(new Date(2020, 9, 1), 'QQQQ'), '4th quarter');

        assertEqual(format(new Date(2020, 0, 1), 'QQQQQ'), '1');
        assertEqual(format(new Date(2020, 3, 1), 'QQQQQ'), '2');
        assertEqual(format(new Date(2020, 6, 1), 'QQQQQ'), '3');
        assertEqual(format(new Date(2020, 9, 1), 'QQQQQ'), '4');
      });

      it('should correctly format stand-alone quarter token', () => {
        assertEqual(format(new Date(2020, 0, 1), 'q'), '1');
        assertEqual(format(new Date(2020, 3, 1), 'q'), '2');
        assertEqual(format(new Date(2020, 6, 1), 'q'), '3');
        assertEqual(format(new Date(2020, 9, 1), 'q'), '4');

        assertEqual(format(new Date(2020, 0, 1), 'qq'), '01');
        assertEqual(format(new Date(2020, 3, 1), 'qq'), '02');
        assertEqual(format(new Date(2020, 6, 1), 'qq'), '03');
        assertEqual(format(new Date(2020, 9, 1), 'qq'), '04');

        assertEqual(format(new Date(2020, 0, 1), 'qqq'), 'Q1');
        assertEqual(format(new Date(2020, 3, 1), 'qqq'), 'Q2');
        assertEqual(format(new Date(2020, 6, 1), 'qqq'), 'Q3');
        assertEqual(format(new Date(2020, 9, 1), 'qqq'), 'Q4');

        assertEqual(format(new Date(2020, 0, 1), 'qqqq'), '1st quarter');
        assertEqual(format(new Date(2020, 3, 1), 'qqqq'), '2nd quarter');
        assertEqual(format(new Date(2020, 6, 1), 'qqqq'), '3rd quarter');
        assertEqual(format(new Date(2020, 9, 1), 'qqqq'), '4th quarter');

        assertEqual(format(new Date(2020, 0, 1), 'qqqqq'), '1');
        assertEqual(format(new Date(2020, 3, 1), 'qqqqq'), '2');
        assertEqual(format(new Date(2020, 6, 1), 'qqqqq'), '3');
        assertEqual(format(new Date(2020, 9, 1), 'qqqqq'), '4');
      });

      it('should correctly format format-style month token', () => {
        assertEqual(format(new Date(2020, 8, 1), 'M'), '9');
        assertEqual(format(new Date(2020, 11, 1), 'M'), '12');

        assertEqual(format(new Date(2020, 8, 1), 'MM'), '09');
        assertEqual(format(new Date(2020, 11, 1), 'MM'), '12');

        assertEqual(format(new Date(2020, 8, 1), 'MMM'), 'Sep');
        assertEqual(format(new Date(2020, 11, 1), 'MMM'), 'Dec');

        assertEqual(format(new Date(2020, 8, 1), 'MMMM'), 'September');
        assertEqual(format(new Date(2020, 11, 1), 'MMMM'), 'December');

        assertEqual(format(new Date(2020, 8, 1), 'MMMMM'), 'S');
        assertEqual(format(new Date(2020, 11, 1), 'MMMMM'), 'D');

        assertEqual(format(new Date(2020, 7), {
          format: 'MMMM',
          locale: 'ru',
        }), 'августа');

        assertEqual(format(new Date(2020, 7), {
          format: 'MMMM月',
          locale: 'ja',
        }), '8月');

      });

      it('should correctly format standalone month token', () => {
        assertEqual(format(new Date(2020, 8, 1), 'L'), '9');
        assertEqual(format(new Date(2020, 11, 1), 'L'), '12');

        assertEqual(format(new Date(2020, 8, 1), 'LL'), '09');
        assertEqual(format(new Date(2020, 11, 1), 'LL'), '12');

        assertEqual(format(new Date(2020, 8, 1), 'LLL'), 'Sep');
        assertEqual(format(new Date(2020, 11, 1), 'LLL'), 'Dec');

        assertEqual(format(new Date(2020, 8, 1), 'LLLL'), 'September');
        assertEqual(format(new Date(2020, 11, 1), 'LLLL'), 'December');

        assertEqual(format(new Date(2020, 8, 1), 'LLLLL'), 'S');
        assertEqual(format(new Date(2020, 11, 1), 'LLLLL'), 'D');

        assertEqual(format(new Date(2020, 7), {
          format: 'LLLL',
          locale: 'ru',
        }), 'август');

        assertEqual(format(new Date(2020, 7), {
          format: 'LLLL月',
          locale: 'ja',
        }), '8月');

        assertEqual(format(new Date(2020, 7), {
          format: 'LLLLL',
          locale: 'ko',
        }), '8월');
      });

      it('should correctly format ISO week-numbering week token', () => {
        assertEqual(format(new Date('2005-12-31'), 'w'), '52');
        assertEqual(format(new Date('2006-01-01'), 'w'), '52');
        assertEqual(format(new Date('2020-12-31'), 'w'), '53');
        assertEqual(format(new Date('2019-12-31'), 'w'), '1');
        assertEqual(format(new Date('2020-01-01'), 'w'), '1');

        assertEqual(format(new Date('2005-12-31'), 'ww'), '52');
        assertEqual(format(new Date('2006-01-01'), 'ww'), '52');
        assertEqual(format(new Date('2020-12-31'), 'ww'), '53');
        assertEqual(format(new Date('2019-12-31'), 'ww'), '01');
        assertEqual(format(new Date('2020-01-01'), 'ww'), '01');
      });

      it('should correctly format day of month token', () => {
        assertEqual(format(new Date(2020, 0, 1), 'd'), '1');
        assertEqual(format(new Date(2020, 0, 15), 'd'), '15');
        assertEqual(format(new Date(2020, 0, 30), 'd'), '30');

        assertEqual(format(new Date(2020, 0, 1), 'dd'), '01');
        assertEqual(format(new Date(2020, 0, 15), 'dd'), '15');
        assertEqual(format(new Date(2020, 0, 30), 'dd'), '30');
      });

      it('should correctly format day of year token', () => {
        assertEqual(format(new Date(2020, 0, 1), 'D'), '1');
        assertEqual(format(new Date(2020, 0, 10), 'D'), '10');
        assertEqual(format(new Date(2020, 7, 31), 'D'), '244');
        assertEqual(format(new Date(2020, 11, 31), 'D'), '366');

        assertEqual(format(new Date(2020, 0, 1), 'DD'), '01');
        assertEqual(format(new Date(2020, 0, 10), 'DD'), '10');
        assertEqual(format(new Date(2020, 7, 31), 'DD'), '244');
        assertEqual(format(new Date(2020, 11, 31), 'DD'), '366');

        assertEqual(format(new Date(2020, 0, 1), 'DDD'), '001');
        assertEqual(format(new Date(2020, 0, 10), 'DDD'), '010');
        assertEqual(format(new Date(2020, 7, 31), 'DDD'), '244');
        assertEqual(format(new Date(2020, 11, 31), 'DDD'), '366');
      });

      it('should correctly format day of week token', () => {
        assertEqual(format(new Date(2020, 0, 1), 'E'), 'Wed');
        assertEqual(format(new Date(2020, 0, 2), 'E'), 'Thu');
        assertEqual(format(new Date(2020, 0, 3), 'E'), 'Fri');

        assertEqual(format(new Date(2020, 0, 1), 'EE'), 'Wed');
        assertEqual(format(new Date(2020, 0, 2), 'EE'), 'Thu');
        assertEqual(format(new Date(2020, 0, 3), 'EE'), 'Fri');

        assertEqual(format(new Date(2020, 0, 1), 'EEE'), 'Wed');
        assertEqual(format(new Date(2020, 0, 2), 'EEE'), 'Thu');
        assertEqual(format(new Date(2020, 0, 3), 'EEE'), 'Fri');

        assertEqual(format(new Date(2020, 0, 1), 'EEEE'), 'Wednesday');
        assertEqual(format(new Date(2020, 0, 2), 'EEEE'), 'Thursday');
        assertEqual(format(new Date(2020, 0, 3), 'EEEE'), 'Friday');

        assertEqual(format(new Date(2020, 0, 1), 'EEEEE'), 'W');
        assertEqual(format(new Date(2020, 0, 2), 'EEEEE'), 'T');
        assertEqual(format(new Date(2020, 0, 3), 'EEEEE'), 'F');

        assertEqual(format(new Date(2020, 0), {
          format: 'EEEE',
          locale: 'fi',
        }), 'keskiviikkona');

      });

      it('should correctly format standalone day of week token', () => {
        assertEqual(format(new Date(2020, 0, 1), 'c'), 'Wed');
        assertEqual(format(new Date(2020, 0, 2), 'c'), 'Thu');
        assertEqual(format(new Date(2020, 0, 3), 'c'), 'Fri');

        assertEqual(format(new Date(2020, 0, 1), 'cc'), 'Wed');
        assertEqual(format(new Date(2020, 0, 2), 'cc'), 'Thu');
        assertEqual(format(new Date(2020, 0, 3), 'cc'), 'Fri');

        assertEqual(format(new Date(2020, 0, 1), 'ccc'), 'Wed');
        assertEqual(format(new Date(2020, 0, 2), 'ccc'), 'Thu');
        assertEqual(format(new Date(2020, 0, 3), 'ccc'), 'Fri');

        assertEqual(format(new Date(2020, 0, 1), 'cccc'), 'Wednesday');
        assertEqual(format(new Date(2020, 0, 2), 'cccc'), 'Thursday');
        assertEqual(format(new Date(2020, 0, 3), 'cccc'), 'Friday');

        assertEqual(format(new Date(2020, 0, 1), 'ccccc'), 'W');
        assertEqual(format(new Date(2020, 0, 2), 'ccccc'), 'T');
        assertEqual(format(new Date(2020, 0, 3), 'ccccc'), 'F');

        assertEqual(format(new Date(2020, 0), {
          format: 'cccc',
          locale: 'fi',
        }), 'keskiviikko');

      });

      it('should correctly format day period token', () => {
        assertEqual(format(new Date(2020, 0), 'a'), 'AM');
        assertEqual(format(new Date(2020, 0), 'aa'), 'am');
        assertEqual(format(new Date(2020, 0), 'aaa'), 'AM');
        assertEqual(format(new Date(2020, 0), 'aaaa'), 'AM');
        assertEqual(format(new Date(2020, 0), 'aaaaa'), 'A');
        assertEqual(format(new Date(2020, 0), 'aaaaaa'), 'a');
        assertEqual(format(new Date(2020, 0, 1, 12), 'a'), 'PM');
        assertEqual(format(new Date(2020, 0, 1, 12), 'aa'), 'pm');
        assertEqual(format(new Date(2020, 0, 1, 12), 'aaa'), 'PM');
        assertEqual(format(new Date(2020, 0, 1, 12), 'aaaa'), 'PM');
        assertEqual(format(new Date(2020, 0, 1, 12), 'aaaaa'), 'P');
        assertEqual(format(new Date(2020, 0, 1, 12), 'aaaaaa'), 'p');
      });

      it('should correctly format 12-hour token', () => {
        assertEqual(format(new Date(2020, 0, 1, 0), 'h'), '12');
        assertEqual(format(new Date(2020, 0, 1, 1), 'h'), '1');
        assertEqual(format(new Date(2020, 0, 1, 15), 'h'), '3');

        assertEqual(format(new Date(2020, 0, 1, 0), 'hh'), '12');
        assertEqual(format(new Date(2020, 0, 1, 1), 'hh'), '01');
        assertEqual(format(new Date(2020, 0, 1, 15), 'hh'), '03');
      });

      it('should correctly format 23-hour token', () => {
        assertEqual(format(new Date(2020, 0, 1, 0), 'H'), '0');
        assertEqual(format(new Date(2020, 0, 1, 1), 'H'), '1');
        assertEqual(format(new Date(2020, 0, 1, 15), 'H'), '15');

        assertEqual(format(new Date(2020, 0, 1, 0), 'HH'), '00');
        assertEqual(format(new Date(2020, 0, 1, 1), 'HH'), '01');
        assertEqual(format(new Date(2020, 0, 1, 15), 'HH'), '15');
      });

      it('should correctly format 24-hour token', () => {
        assertEqual(format(new Date(2020, 0, 1, 0), 'k'), '24');
        assertEqual(format(new Date(2020, 0, 1, 1), 'k'), '1');
        assertEqual(format(new Date(2020, 0, 1, 15), 'k'), '15');

        assertEqual(format(new Date(2020, 0, 1, 0), 'kk'), '24');
        assertEqual(format(new Date(2020, 0, 1, 1), 'kk'), '01');
        assertEqual(format(new Date(2020, 0, 1, 15), 'kk'), '15');
      });

      it('should correctly format 11-hour token', () => {
        assertEqual(format(new Date(2020, 0, 1, 0), 'K'), '0');
        assertEqual(format(new Date(2020, 0, 1, 1), 'K'), '1');
        assertEqual(format(new Date(2020, 0, 1, 15), 'K'), '3');

        assertEqual(format(new Date(2020, 0, 1, 0), 'KK'), '00');
        assertEqual(format(new Date(2020, 0, 1, 1), 'KK'), '01');
        assertEqual(format(new Date(2020, 0, 1, 15), 'KK'), '03');
      });

      it('should correctly format minutes token', () => {
        assertEqual(format(new Date(2020, 0, 1, 0, 0), 'm'), '0');
        assertEqual(format(new Date(2020, 0, 1, 0, 1), 'm'), '1');
        assertEqual(format(new Date(2020, 0, 1, 0, 59), 'm'), '59');

        assertEqual(format(new Date(2020, 0, 1, 0, 0), 'mm'), '0');
        assertEqual(format(new Date(2020, 0, 1, 0, 1), 'mm'), '1');
        assertEqual(format(new Date(2020, 0, 1, 0, 59), 'mm'), '59');
      });

      it('should correctly format seconds token', () => {
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 0), 's'), '0');
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 1), 's'), '1');
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 59), 's'), '59');

        assertEqual(format(new Date(2020, 0, 1, 0, 0, 0), 'ss'), '00');
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 1), 'ss'), '01');
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 59), 'ss'), '59');
      });

      it('should correctly format fractional seconds token', () => {
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 0, 0), 'S'), '0');
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 0, 1), 'S'), '1');
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 0, 999), 'S'), '999');

        assertEqual(format(new Date(2020, 0, 1, 0, 0, 0, 0), 'SS'), '00');
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 0, 1), 'SS'), '01');
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 0, 999), 'SS'), '999');

        assertEqual(format(new Date(2020, 0, 1, 0, 0, 0, 0), 'SSS'), '000');
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 0, 1), 'SSS'), '001');
        assertEqual(format(new Date(2020, 0, 1, 0, 0, 0, 999), 'SSS'), '999');
      });

      describe('timezone name tokens', () => {

        it('should correctly format timezone name token for EDT', () => {
          Intl.DateTimeFormat.mockTimeZoneNames({
            long: 'Eastern Daylight Time',
            short: 'EDT',
          });
          assertEqual(format(new Date(2020, 0), 'z'), 'EDT');
          assertEqual(format(new Date(2020, 0), 'zz'), 'EDT');
          assertEqual(format(new Date(2020, 0), 'zzz'), 'EDT');
          assertEqual(format(new Date(2020, 0), 'zzzz'), 'Eastern Daylight Time');
        });

        it('should correctly format timezone name token for JST', () => {
          Intl.DateTimeFormat.mockTimeZoneNames({
            long: 'Japan Standard Time',
            short: 'GMT+9',
          });
          assertEqual(format(new Date(2020, 0), 'z'), 'GMT+9');
          assertEqual(format(new Date(2020, 0), 'zz'), 'GMT+9');
          assertEqual(format(new Date(2020, 0), 'zzz'), 'GMT+9');
          assertEqual(format(new Date(2020, 0), 'zzzz'), 'Japan Standard Time');
        });

      });

      describe('timezone offset tokens', () => {

        it('should correctly format timezone offset token for EST', () => {
          mockTimeZone(240); // GMT-04:00
          assertEqual(format(new Date(2020, 0), 'Z'), '-0400');
          assertEqual(format(new Date(2020, 0), 'ZZ'), '-0400');
          assertEqual(format(new Date(2020, 0), 'ZZZ'), '-0400');
          assertEqual(format(new Date(2020, 0), 'ZZZZ'), 'GMT-04:00');
          assertEqual(format(new Date(2020, 0), 'ZZZZZ'), '-04:00');
          assertEqual(format(new Date(2020, 0), 'O'), 'GMT-4');
          assertEqual(format(new Date(2020, 0), 'OO'), 'OO');
          assertEqual(format(new Date(2020, 0), 'OOO'), 'OOO');
          assertEqual(format(new Date(2020, 0), 'OOOO'), 'GMT-04:00');
        });

        it('should correctly format timezone offset token for IST', () => {
          mockTimeZone(-330); // GMT+05:30
          assertEqual(format(new Date(2020, 0), 'Z'), '+0530');
          assertEqual(format(new Date(2020, 0), 'ZZ'), '+0530');
          assertEqual(format(new Date(2020, 0), 'ZZZ'), '+0530');
          assertEqual(format(new Date(2020, 0), 'ZZZZ'), 'GMT+05:30');
          assertEqual(format(new Date(2020, 0), 'ZZZZZ'), '+05:30');
          assertEqual(format(new Date(2020, 0), 'O'), 'GMT+5:30');
          assertEqual(format(new Date(2020, 0), 'OO'), 'OO');
          assertEqual(format(new Date(2020, 0), 'OOO'), 'OOO');
          assertEqual(format(new Date(2020, 0), 'OOOO'), 'GMT+05:30');
        });

        it('should correctly format timezone offset token for NPT', () => {
          mockTimeZone(-345); // GMT+05:45
          assertEqual(format(new Date(2020, 0), 'Z'), '+0545');
          assertEqual(format(new Date(2020, 0), 'ZZ'), '+0545');
          assertEqual(format(new Date(2020, 0), 'ZZZ'), '+0545');
          assertEqual(format(new Date(2020, 0), 'ZZZZ'), 'GMT+05:45');
          assertEqual(format(new Date(2020, 0), 'ZZZZZ'), '+05:45');
          assertEqual(format(new Date(2020, 0), 'O'), 'GMT+5:45');
          assertEqual(format(new Date(2020, 0), 'OO'), 'OO');
          assertEqual(format(new Date(2020, 0), 'OOO'), 'OOO');
          assertEqual(format(new Date(2020, 0), 'OOOO'), 'GMT+05:45');
        });

        it('should correctly format timezone offset token for JST', () => {
          mockTimeZone(-540); // GMT+09:00
          assertEqual(format(new Date(2020, 0), 'Z'), '+0900');
          assertEqual(format(new Date(2020, 0), 'ZZ'), '+0900');
          assertEqual(format(new Date(2020, 0), 'ZZZ'), '+0900');
          assertEqual(format(new Date(2020, 0), 'ZZZZ'), 'GMT+09:00');
          assertEqual(format(new Date(2020, 0), 'ZZZZZ'), '+09:00');
          assertEqual(format(new Date(2020, 0), 'O'), 'GMT+9');
          assertEqual(format(new Date(2020, 0), 'OO'), 'OO');
          assertEqual(format(new Date(2020, 0), 'OOO'), 'OOO');
          assertEqual(format(new Date(2020, 0), 'OOOO'), 'GMT+09:00');
        });

        it('should correctly format timezone offset token for GMT', () => {
          mockTimeZone(0); // GMT+00:00
          assertEqual(format(new Date(2020, 0), 'Z'), '+0000');
          assertEqual(format(new Date(2020, 0), 'ZZ'), '+0000');
          assertEqual(format(new Date(2020, 0), 'ZZZ'), '+0000');
          assertEqual(format(new Date(2020, 0), 'ZZZZ'), 'GMT+00:00');
          assertEqual(format(new Date(2020, 0), 'ZZZZZ'), 'Z');
          assertEqual(format(new Date(2020, 0), 'O'), 'GMT+0');
          assertEqual(format(new Date(2020, 0), 'OO'), 'OO');
          assertEqual(format(new Date(2020, 0), 'OOO'), 'OOO');
          assertEqual(format(new Date(2020, 0), 'OOOO'), 'GMT+00:00');
        });

      });

      it('should be able to escape strings', () => {
        assertEqual(
          format(new Date(2020, 0, 1, 15, 30), "HH 'hours and' mm 'minutes'"),
          '15 hours and 30 minutes'
        );
        assertEqual(
          format(new Date(2020, 0, 1, 15, 30), "yyyy.MM.dd 'at' HH:mm:ss"),
          '2020.01.01 at 15:30:00'
        );
        assertEqual(
          format(new Date(2020, 0, 1, 15, 30), "EEE, MMM d, ''yy"),
          "Wed, Jan 1, '20"
        );
        assertEqual(
          format(new Date(2020, 0, 1, 15, 30), "h 'o''clock' a"),
          "3 o'clock PM"
        );
      });

      it('should work with multiple token formats', () => {
        assertEqual(format(new Date(2020, 0), 'd MMMM, yyyy'), '1 January, 2020');
        assertEqual(format(new Date(2020, 0), 'MMMM d, yyyy'), 'January 1, 2020');
        assertEqual(format(new Date(2020, 0), 'dd-MM-yyyy'), '01-01-2020');
        assertEqual(format(new Date(2020, 0), 'MMMMyyyy'), 'January2020');
      });

    });

    describe('complex formatting with an options object', () => {

      it('should accept a locale option', () => {
        assertEqual(
          format(new Date(2020, 0), {
            locale: 'ja'
          }),
          new Intl.DateTimeFormat('ja').format(new Date(2020, 0)),
        );
      });

      it('should accept a formatOptions object', () => {
        assertEqual(
          format(new Date(2020, 0), {
            formatOptions: {
              year: 'numeric',
              month: 'long'
            }
          }),
          'January 2020',
        );
      });

      it('should accept locale and formatOptions together', () => {
        assertEqual(
          format(new Date(2020, 0), {
            locale: 'ja',
            formatOptions: {
              year: 'numeric',
              month: 'long'
            }
          }),
          '2020年1月',
        );
      });

      it('should accept a formatter option', () => {
        assertEqual(
          format(new Date(2020, 0), {
            formatter: new Intl.DateTimeFormat('en', {
              weekday: 'long',
              hour: 'numeric',
            }),
          }),
          'Wednesday, 12 AM',
        );
      });

      it('should accept format shorcuts with an overriding locale', () => {
        assertEqual(
          format(new Date(2020, 0), {
            locale: 'ja',
            formatOptions: Sugar.Date.DATE_FULL,
          }),
          '2020年1月1日水曜日',
        );
      });

      it('should be equivalent to toLocaleString with locale and shortcut', () => {
        assertEqual(
          format(new Date(2020, 0), {
            locale: 'ja',
            formatOptions: Sugar.Date.DATE_FULL,
          }),
          new Date(2020, 0).toLocaleString('ja', Sugar.Date.DATE_FULL),
        );
      });

      it('should be able to tokenize with an overriding locale', () => {
        assertEqual(
          format(new Date(2020, 0), {
            locale: 'ja',
            format: 'MMMM月',
          }),
          '1月',
        );
      });

      it('should allow a custom formatter to customize tokens further', () => {
        assertEqual(
          format(new Date(2020, 0), {
            format: 'MMMM月',
            formatter: new Intl.DateTimeFormat('ja', {
              numberingSystem: 'fullwide',
            }),
          }),
          '１月',
        );
        assertEqual(
          format(new Date(2020, 0), {
            format: 'MMMM月',
            formatter: new Intl.DateTimeFormat('ja', {
              numberingSystem: 'hanidec',
            }),
          }),
          '一月',
        );
      });

      it('should throw an error when attempting to tokenize without a DateTimeFormat', () => {
        assertError(() => {
          format(new Date(2020, 0), {
            format: 'yyyy',
            formatter: {
              format: () => {
                return 'foo';
              }
            }
          });
        }, TypeError);
      });

    });

    it('should not modify options object', () => {
      const options = {
        format: 'abc',
        locale: 'ja',
      };
      format(new Date(2020, 0), options);
      assertObjectEqual(options, {
        format: 'abc',
        locale: 'ja',
      });
    });

    it('should error on invalid dates', () => {
      assertError(() => {
        format(new Date('invalid'), 'yyyy');
      });
    });


  });

});

namespace('Number', function () {

  beforeAll(() => {
    // Set system time to 2020-01-01
    clock.setSystemTime(1577804400000);
  });

  describeInstance('second,seconds', function (seconds) {

    it('should get the correct number of milliseconds for seconds', () => {
      assertEqual(seconds(1), 1000);
      assertEqual(seconds(-1), -1000);
      assertEqual(seconds(60), 60000);
      assertEqual(seconds(0), 0);
    });

    it('should handle irregular input', () => {
      assertEqual(seconds(null), 0);
      assertEqual(seconds('1'), 1000);
      assertNaN(seconds({}));
      assertNaN(seconds(undefined));
      assertNaN(seconds());
    });

  });

  describeInstance('minute,minutes', function (minutes) {

    it('should get the correct number of milliseconds for minutes', () => {
      assertEqual(minutes(1), 60 * 1000);
      assertEqual(minutes(-1), -60 * 1000);
      assertEqual(minutes(60), 60 * 60 * 1000);
      assertEqual(minutes(0), 0);
    });

    it('should handle irregular input', () => {
      assertEqual(minutes(null), 0);
      assertEqual(minutes('1'), 60 * 1000);
      assertNaN(minutes({}));
      assertNaN(minutes(undefined));
      assertNaN(minutes());
    });

  });

  describeInstance('hour,hours', function (hours) {

    it('should get the correct number of milliseconds for hours', () => {
      assertEqual(hours(1), 60 * 60 * 1000);
      assertEqual(hours(-1), -60 * 60 * 1000);
      assertEqual(hours(24), 24 * 60 * 60 * 1000);
      assertEqual(hours(0), 0);
    });

    it('should handle irregular input', () => {
      assertEqual(hours(null), 0);
      assertEqual(hours('24'), 24 * 60 * 60 * 1000);
      assertNaN(hours({}));
      assertNaN(hours(undefined));
      assertNaN(hours());
    });

  });

  describeInstance('day,days', function (days) {

    it('should get the correct number of milliseconds for days', () => {
      assertEqual(days(1), 24 * 60 * 60 * 1000);
      assertEqual(days(-1), -24 * 60 * 60 * 1000);
      assertEqual(days(14), 14 * 24 * 60 * 60 * 1000);
      assertEqual(days(0), 0);
    });

    it('should handle irregular input', () => {
      assertEqual(days(null), 0);
      assertEqual(days('1'), 24 * 60 * 60 * 1000);
      assertNaN(days({}));
      assertNaN(days(undefined));
      assertNaN(days());
    });

  });

  describeInstance('week,weeks', function (weeks) {

    it('should get the correct number of milliseconds for weeks', () => {
      assertEqual(weeks(1), 7 * 24 * 60 * 60 * 1000);
      assertEqual(weeks(-1), -7 * 24 * 60 * 60 * 1000);
      assertEqual(weeks(4), 28 * 24 * 60 * 60 * 1000);
      assertEqual(weeks(0), 0);
    });

    it('should handle irregular input', () => {
      assertEqual(weeks(null), 0);
      assertEqual(weeks('1'), 7 * 24 * 60 * 60 * 1000);
      assertNaN(weeks({}));
      assertNaN(weeks(undefined));
      assertNaN(weeks());
    });

  });

  describeInstance('month,months', function (months) {

    it('should get the correct number of milliseconds for months', () => {
      assertEqual(months(1), 2629746000);
      assertEqual(months(-1), -2629746000);
      assertEqual(months(10), 10 * 2629746000);
      assertEqual(months(0), 0);
    });

    it('should handle irregular input', () => {
      assertEqual(months(null), 0);
      assertEqual(months('1'), 2629746000);
      assertNaN(months({}));
      assertNaN(months(undefined));
      assertNaN(months());
    });

  });

  describeInstance('year,years', function (years) {

    it('should get the correct number of milliseconds for years', () => {
      assertEqual(years(1), 31556952000);
      assertEqual(years(-1), -31556952000);
      assertEqual(years(5), 5 * 31556952000);
      assertEqual(years(0), 0);
    });

    it('should handle irregular input', () => {
      assertEqual(years(null), 0);
      assertEqual(years('1'), 31556952000);
      assertNaN(years({}));
      assertNaN(years(undefined));
      assertNaN(years());
    });

  });

  describeInstance('yearAgo,yearsAgo', function (yearsAgo) {

    it('should get the correct date', () => {
      assertDateEqual(yearsAgo(0), new Date(2020, 0));
      assertDateEqual(yearsAgo(1), new Date(2019, 0));
      assertDateEqual(yearsAgo(-1), new Date(2021, 0));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        yearsAgo();
      });
      assertError(() => {
        yearsAgo(NaN);
      });
      assertError(() => {
        yearsAgo(null);
      });
    });

  });

  describeInstance('monthAgo,monthsAgo', function (monthsAgo) {

    it('should get the correct date', () => {
      assertDateEqual(monthsAgo(0), new Date(2020, 0));
      assertDateEqual(monthsAgo(1), new Date(2019, 11));
      assertDateEqual(monthsAgo(-1), new Date(2020, 1));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        monthsAgo();
      });
      assertError(() => {
        monthsAgo(NaN);
      });
      assertError(() => {
        monthsAgo(null);
      });
    });

  });

  describeInstance('weekAgo,weeksAgo', function (weeksAgo) {

    it('should get the correct date', () => {
      assertDateEqual(weeksAgo(0), new Date(2020, 0));
      assertDateEqual(weeksAgo(1), new Date(2019, 11, 25));
      assertDateEqual(weeksAgo(-1), new Date(2020, 0, 8));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        weeksAgo();
      });
      assertError(() => {
        weeksAgo(NaN);
      });
      assertError(() => {
        weeksAgo(null);
      });
    });

  });

  describeInstance('dayAgo,daysAgo', function (daysAgo) {

    it('should get the correct date', () => {
      assertDateEqual(daysAgo(0), new Date(2020, 0));
      assertDateEqual(daysAgo(1), new Date(2019, 11, 31));
      assertDateEqual(daysAgo(-1), new Date(2020, 0, 2));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        daysAgo();
      });
      assertError(() => {
        daysAgo(NaN);
      });
      assertError(() => {
        daysAgo(null);
      });
    });

  });

  describeInstance('hourAgo,hoursAgo', function (hoursAgo) {

    it('should get the correct date', () => {
      assertDateEqual(hoursAgo(0), new Date(2020, 0));
      assertDateEqual(hoursAgo(1), new Date(2019, 11, 31, 23));
      assertDateEqual(hoursAgo(-1), new Date(2020, 0, 1, 1));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        hoursAgo();
      });
      assertError(() => {
        hoursAgo(NaN);
      });
      assertError(() => {
        hoursAgo(null);
      });
    });

  });

  describeInstance('minuteAgo,minutesAgo', function (minutesAgo) {

    it('should get the correct date', () => {
      assertDateEqual(minutesAgo(0), new Date(2020, 0));
      assertDateEqual(minutesAgo(1), new Date(2019, 11, 31, 23, 59));
      assertDateEqual(minutesAgo(-1), new Date(2020, 0, 1, 0, 1));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        minutesAgo();
      });
      assertError(() => {
        minutesAgo(NaN);
      });
      assertError(() => {
        minutesAgo(null);
      });
    });

  });

  describeInstance('secondAgo,secondsAgo', function (secondsAgo) {

    it('should get the correct date', () => {
      assertDateEqual(secondsAgo(0), new Date(2020, 0));
      assertDateEqual(secondsAgo(1), new Date(2019, 11, 31, 23, 59, 59));
      assertDateEqual(secondsAgo(-1), new Date(2020, 0, 1, 0, 0, 1));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        secondsAgo();
      });
      assertError(() => {
        secondsAgo(NaN);
      });
      assertError(() => {
        secondsAgo(null);
      });
    });

  });

  describeInstance('millisecondAgo,millisecondsAgo', function (millisecondsAgo) {

    it('should get the correct date', () => {
      assertDateEqual(millisecondsAgo(0), new Date(2020, 0));
      assertDateEqual(millisecondsAgo(1), new Date(2019, 11, 31, 23, 59, 59, 999));
      assertDateEqual(millisecondsAgo(-1), new Date(2020, 0, 1, 0, 0, 0, 1));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        millisecondsAgo();
      });
      assertError(() => {
        millisecondsAgo(NaN);
      });
      assertError(() => {
        millisecondsAgo(null);
      });
    });

  });

  describeInstance('yearFromNow,yearsFromNow', function (yearsFromNow) {

    it('should get the correct date', () => {
      assertDateEqual(yearsFromNow(0), new Date(2020, 0));
      assertDateEqual(yearsFromNow(1), new Date(2021, 0));
      assertDateEqual(yearsFromNow(-1), new Date(2019, 0));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        yearsFromNow();
      });
      assertError(() => {
        yearsFromNow(NaN);
      });
      assertError(() => {
        yearsFromNow(null);
      });
    });

  });

  describeInstance('monthFromNow,monthsFromNow', function (monthsFromNow) {

    it('should get the correct date', () => {
      assertDateEqual(monthsFromNow(0), new Date(2020, 0));
      assertDateEqual(monthsFromNow(1), new Date(2020, 1));
      assertDateEqual(monthsFromNow(-1), new Date(2019, 11));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        monthsFromNow();
      });
      assertError(() => {
        monthsFromNow(NaN);
      });
      assertError(() => {
        monthsFromNow(null);
      });
    });

  });

  describeInstance('weekFromNow,weeksFromNow', function (weeksFromNow) {

    it('should get the correct date', () => {
      assertDateEqual(weeksFromNow(0), new Date(2020, 0));
      assertDateEqual(weeksFromNow(1), new Date(2020, 0, 8));
      assertDateEqual(weeksFromNow(-1), new Date(2019, 11, 25));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        weeksFromNow();
      });
      assertError(() => {
        weeksFromNow(NaN);
      });
      assertError(() => {
        weeksFromNow(null);
      });
    });

  });

  describeInstance('dayFromNow,daysFromNow', function (daysFromNow) {

    it('should get the correct date', () => {
      assertDateEqual(daysFromNow(0), new Date(2020, 0));
      assertDateEqual(daysFromNow(1), new Date(2020, 0, 2));
      assertDateEqual(daysFromNow(-1), new Date(2019, 11, 31));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        daysFromNow();
      });
      assertError(() => {
        daysFromNow(NaN);
      });
      assertError(() => {
        daysFromNow(null);
      });
    });

  });

  describeInstance('hourFromNow,hoursFromNow', function (hoursFromNow) {

    it('should get the correct date', () => {
      assertDateEqual(hoursFromNow(0), new Date(2020, 0));
      assertDateEqual(hoursFromNow(1), new Date(2020, 0, 1, 1));
      assertDateEqual(hoursFromNow(-1), new Date(2019, 11, 31, 23));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        hoursFromNow();
      });
      assertError(() => {
        hoursFromNow(NaN);
      });
      assertError(() => {
        hoursFromNow(null);
      });
    });

  });

  describeInstance('minuteFromNow,minutesFromNow', function (minutesFromNow) {

    it('should get the correct date', () => {
      assertDateEqual(minutesFromNow(0), new Date(2020, 0));
      assertDateEqual(minutesFromNow(1), new Date(2020, 0, 1, 0, 1));
      assertDateEqual(minutesFromNow(-1), new Date(2019, 11, 31, 23, 59));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        minutesFromNow();
      });
      assertError(() => {
        minutesFromNow(NaN);
      });
      assertError(() => {
        minutesFromNow(null);
      });
    });

  });

  describeInstance('secondFromNow,secondsFromNow', function (secondsFromNow) {

    it('should get the correct date', () => {
      assertDateEqual(secondsFromNow(0), new Date(2020, 0));
      assertDateEqual(secondsFromNow(1), new Date(2020, 0, 1, 0, 0, 1));
      assertDateEqual(secondsFromNow(-1), new Date(2019, 11, 31, 23, 59, 59));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        secondsFromNow();
      });
      assertError(() => {
        secondsFromNow(NaN);
      });
      assertError(() => {
        secondsFromNow(null);
      });
    });

  });

  describeInstance('millisecondFromNow,millisecondsFromNow', function (millisecondsFromNow) {

    it('should get the correct date', () => {
      assertDateEqual(millisecondsFromNow(0), new Date(2020, 0));
      assertDateEqual(millisecondsFromNow(1), new Date(2020, 0, 1, 0, 0, 0, 1));
      assertDateEqual(millisecondsFromNow(-1), new Date(2019, 11, 31, 23, 59, 59, 999));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        millisecondsFromNow();
      });
      assertError(() => {
        millisecondsFromNow(NaN);
      });
      assertError(() => {
        millisecondsFromNow(null);
      });
    });

  });

  describeInstance('duration', function (duration) {

    it('should get the correct duration for milliseconds', async () => {
      assertEqual(duration(0), '0 milliseconds');
      assertEqual(duration(1), '1 millisecond');
      assertEqual(duration(2), '2 milliseconds');
      assertEqual(duration(100), '100 milliseconds');
      assertEqual(duration(500), '500 milliseconds');
      assertEqual(duration(950), '950 milliseconds');
      assertEqual(duration(999), '999 milliseconds');
    });

    it('should get the correct duration for seconds', async () => {
      assertEqual(duration(1000), '1 second');
      assertEqual(duration(1999), '1 second');
      assertEqual(duration(2000), '2 seconds');
      assertEqual(duration(2999), '2 seconds');
      assertEqual(duration(9999), '9 seconds');
      assertEqual(duration(10000), '10 seconds');
      assertEqual(duration(50000), '50 seconds');
      assertEqual(duration(59000), '59 seconds');
      assertEqual(duration(59999), '59 seconds');
    });

    it('should get the correct duration for minutes', async () => {
      assertEqual(duration(60 * 1000), '1 minute');
      assertEqual(duration(2 * 60 * 1000), '2 minutes');
      assertEqual(duration(10 * 60 * 1000), '10 minutes');
      assertEqual(duration(30 * 60 * 1000), '30 minutes');
      assertEqual(duration(59 * 60 * 1000), '59 minutes');
    });

    it('should get the correct duration for hours', async () => {
      assertEqual(duration(60 * 60 * 1000), '1 hour');
      assertEqual(duration(2 * 60 * 60 * 1000), '2 hours');
      assertEqual(duration(12 * 60 * 60 * 1000), '12 hours');
      assertEqual(duration(23 * 60 * 60 * 1000), '23 hours');
    });

    it('should get the correct duration for days', async () => {
      assertEqual(duration(24 * 60 * 60 * 1000), '1 day');
      assertEqual(duration(2 * 24 * 60 * 60 * 1000), '2 days');
      assertEqual(duration(5 * 24 * 60 * 60 * 1000), '5 days');
      assertEqual(duration(6 * 24 * 60 * 60 * 1000), '6 days');
    });

    it('should get the correct duration for days', async () => {
      assertEqual(duration(7 * 24 * 60 * 60 * 1000), '1 week');
      assertEqual(duration(2 * 7 * 24 * 60 * 60 * 1000), '2 weeks');
      assertEqual(duration(4 * 7 * 24 * 60 * 60 * 1000), '4 weeks');
    });

    it('should get the correct duration for days', async () => {
      assertEqual(duration(31 * 24 * 60 * 60 * 1000), '1 month');
      assertEqual(duration(2 * 31 * 24 * 60 * 60 * 1000), '2 months');
      assertEqual(duration(11 * 31 * 24 * 60 * 60 * 1000), '11 months');
    });

    it('should get the correct duration for years', async () => {
      assertEqual(duration(365.2425 * 24 * 60 * 60 * 1000), '1 year');
      assertEqual(duration(2 * 365.2425 * 24 * 60 * 60 * 1000), '2 years');
      assertEqual(duration(10 * 365.2425 * 24 * 60 * 60 * 1000), '10 years');
      assertEqual(duration(100 * 365.2425 * 24 * 60 * 60 * 1000), '100 years');
      assertEqual(duration(1000 * 365.2425 * 24 * 60 * 60 * 1000), '1,000 years');
    });

    it('should work for negative numbers', async () => {
      assertEqual(duration(-999), '-999 milliseconds');
      assertEqual(duration(-1000), '-1 second');
      assertEqual(duration(-1999), '-1 second');
      assertEqual(duration(-2000), '-2 seconds');
      assertEqual(duration(-60 * 1000), '-1 minute');
      assertEqual(duration(-60 * 60 * 1000), '-1 hour');
      assertEqual(duration(-24 * 60 * 60 * 1000), '-1 day');
      assertEqual(duration(-7 * 24 * 60 * 60 * 1000), '-1 week');
      assertEqual(duration(-31 * 24 * 60 * 60 * 1000), '-1 month');
      assertEqual(duration(-365.2425 * 24 * 60 * 60 * 1000), '-1 year');
    });

    it('should be able to pass a locale', async () => {
      function assertFormatted(ms, val, unit) {
        const formatter = new Intl.NumberFormat('ja', {
          unit,
          style: 'unit',
          unitDisplay: 'long',
        });
        const expected = formatter.format(val);
        assertEqual(duration(ms, 'ja'), expected);
      }
      assertFormatted(0, 0, 'millisecond');
      assertFormatted(1, 1, 'millisecond');
      assertFormatted(1000, 1, 'second');
      assertFormatted(60 * 1000, 1, 'minute');
      assertFormatted(60 * 60 * 1000, 1, 'hour');
      assertFormatted(24 * 60 * 60 * 1000, 1, 'day');
      assertFormatted(7 * 24 * 60 * 60 * 1000, 1, 'week');
      assertFormatted(31 * 24 * 60 * 60 * 1000, 1, 'month');
      assertFormatted(365.2425 * 24 * 60 * 60 * 1000, 1, 'year');
    });

    it('should handle irregular input', () => {
      assertEqual(duration(NaN), 'NaN milliseconds');
      assertError(() => {
        duration();
      });
    });

  });

});
