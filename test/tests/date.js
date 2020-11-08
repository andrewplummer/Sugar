'use strict';

describeNamespace('Date', () => {

  beforeAll(() => {
    // Set system time to 2020-01-01
    setSystemTime(new Date(2020, 0));
    Intl.DateTimeFormat.mockDefaultLocale('en-US');
  });

  afterEach(() => {
    resetTimeZone();
    resetSystemTime();
  });

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

    it('should be able to create from DateProps object', () => {
      assertDateEqual(
        new Sugar.Date({ year: 2022, month: 6 }).raw,
        new Date(2022, 6)
      );
    });

    it('should enhance chainable with date parsing', () => {
      assertDateEqual(new Sugar.Date('tomorrow').raw, new Date(2020, 0, 2));
    });

    it('should be able to pass a locale code', () => {
      assertDateEqual(
        new Sugar.Date('8/10', 'en-US').raw,
        new Date(2020, 7, 10)
      );
      assertDateEqual(
        new Sugar.Date('8/10', 'en-GB').raw,
        new Date(2020, 9, 8)
      );
    });

  });

  describeStatic('create', (create) => {

    describe('Numeric formats', () => {

      describe('ISO-8601', () => {

        it('should parse various levels of specificity', () => {
          assertDateEqual(create('2010'), new Date(2010, 0));
          assertDateEqual(create('2010-11'), new Date(2010, 10));
          assertDateEqual(create('2010-11-22'), new Date(2010, 10, 22));
          assertDateEqual(create('2010-11-22T22'), new Date(2010, 10, 22, 22));
          assertDateEqual(
            create('2010-11-22T22:59'),
            new Date(2010, 10, 22, 22, 59)
          );
          assertDateEqual(
            create('2010-11-22T22:59:55'),
            new Date(2010, 10, 22, 22, 59, 55)
          );
          assertDateEqual(
            create('2010-11-22T22:59:55.400'),
            new Date(2010, 10, 22, 22, 59, 55, 400)
          );

          assertDateEqual(create('2001-1-1'), new Date(2001, 0, 1));
          assertDateEqual(create('2001-01-1'), new Date(2001, 0, 1));
          assertDateEqual(create('2001-01-01'), new Date(2001, 0, 1));
          assertDateEqual(create('2010-11-22'), new Date(2010, 10, 22));

          assertDateEqual(create('2012-05-31'), new Date(2012, 4, 31));
        });

        it('should parse without timezone offset', () => {
          assertDateEqual(
            create('2011-10-10T14:48:00'),
            new Date(2011, 9, 10, 14, 48)
          );
        });

        it('should parse with timezone offset', () => {
          mockTimeZone(-540); // GMT+09:00
          assertDateEqual(
            create('2011-10-10T14:48:00+09:00'),
            new Date(2011, 9, 10, 14, 48)
          );
          assertDateEqual(
            create('2011-10-10T14:48:00+02:00'),
            new Date(2011, 9, 10, 21, 48)
          );
          assertDateEqual(
            create('2011-10-10T14:48:00+00:00'),
            new Date(2011, 9, 10, 23, 48)
          );
          assertDateEqual(
            create('2011-10-10T14:48:00-05:00'),
            new Date(2011, 9, 11, 4, 48)
          );

          mockTimeZone(300); // GMT-05:00
          assertDateEqual(
            create('2011-10-10T14:48:00+09:00'),
            new Date(2011, 9, 10, 0, 48)
          );
          assertDateEqual(
            create('2011-10-10T14:48:00+02:00'),
            new Date(2011, 9, 10, 7, 48)
          );
          assertDateEqual(
            create('2011-10-10T14:48:00+00:00'),
            new Date(2011, 9, 10, 9, 48)
          );
          assertDateEqual(
            create('2011-10-10T14:48:00-05:00'),
            new Date(2011, 9, 10, 14, 48)
          );

          assertDateEqual(
            create('1997-07-16T19:20+00:00'),
            new Date(1997, 6, 16, 14, 20)
          );
          assertDateEqual(
            create('1997-07-16T19:20+01:00'),
            new Date(1997, 6, 16, 13, 20)
          );
          assertDateEqual(
            create('1997-07-16T19:20:30+01:00'),
            new Date(1997, 6, 16, 13, 20, 30)
          );
          assertDateEqual(
            create('1997-07-16T19:20:30.45+01:00'),
            new Date(1997, 6, 16, 13, 20, 30, 450)
          );
          assertDateEqual(
            create('1994-11-05T08:15:30-05:00'),
            new Date(1994, 10, 5, 8, 15, 30)
          );
          assertDateEqual(
            create('1994-11-05T08:15:30-05:00'),
            new Date(1994, 10, 5, 8, 15, 30)
          );
          assertDateEqual(
            create('1776-05-23T02:45:08-08:30'),
            new Date(1776, 4, 23, 5, 15, 8)
          );
          assertDateEqual(
            create('1776-05-23T02:45:08+08:30'),
            new Date(1776, 4, 22, 13, 15, 8)
          );
          assertDateEqual(
            create('2001-04-03T15:00-03:30'),
            new Date(2001, 3, 3, 12, 30)
          );
        });

        it('should parse with hour only timezone offset', () => {
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(
            create('2001-04-03T22:30+04'),
            new Date(2001, 3, 3, 13, 30)
          );
          assertDateEqual(create('2001-04-03T22+04'), new Date(2001, 3, 3, 13));
        });

        it('should parse ISO8601 format with zulu offset', () => {
          mockTimeZone(-540); // GMT+09:00
          assertDateEqual(
            create('2000-01-02T12:34:56Z'),
            new Date(2000, 0, 2, 21, 34, 56)
          );
          assertDateEqual(
            create('2000-01-02T12:34:56.789Z'),
            new Date(2000, 0, 2, 21, 34, 56, 789)
          );
          assertDateEqual(
            create('2000-01-02T12:34:56.789012Z'),
            new Date(2000, 0, 2, 21, 34, 56, 789)
          );

          mockTimeZone(300); // GMT-05:00
          assertDateEqual(
            create('2000-01-02T12:34:56Z'),
            new Date(2000, 0, 2, 7, 34, 56)
          );
          assertDateEqual(
            create('2000-01-02T12:34:56.789Z'),
            new Date(2000, 0, 2, 7, 34, 56, 789)
          );
          assertDateEqual(
            create('2000-01-02T12:34:56.789012Z'),
            new Date(2000, 0, 2, 7, 34, 56, 789)
          );

          assertDateEqual(create('2010Z'), new Date(2009, 11, 31, 19));
          assertDateEqual(create('2010-11Z'), new Date(2010, 9, 31, 19));
          assertDateEqual(create('2010-11-22Z'), new Date(2010, 10, 21, 19));

          assertDateEqual(create('2010-11-22T22Z'), new Date(2010, 10, 22, 17));
          assertDateEqual(
            create('2010-11-22T22:59Z'),
            new Date(2010, 10, 22, 17, 59)
          );
          assertDateEqual(
            create('2010-11-22T22:59:55Z'),
            new Date(2010, 10, 22, 17, 59, 55)
          );
          assertDateEqual(
            create('2010-11-22T22:59:55.400Z'),
            new Date(2010, 10, 22, 17, 59, 55, 400)
          );

          assertDateEqual(
            create('1994-11-05T13:15:30Z'),
            new Date(1994, 10, 5, 8, 15, 30)
          );
          assertDateEqual(
            create('2001-04-03T18:30Z'),
            new Date(2001, 3, 3, 13, 30)
          );

          assertDateEqual(
            create('1994-11-05T13:15:30Z'),
            new Date(1994, 10, 5, 8, 15, 30)
          );
        });

        it('should parse basic format', () => {
          assertDateEqual(create('1776'), new Date(1776, 0));
          assertDateEqual(create('177605'), new Date(1776, 4));
          assertDateEqual(create('17760523'), new Date(1776, 4, 23));
          assertDateEqual(create('17760523T02'), new Date(1776, 4, 23, 2));
          assertDateEqual(
            create('17760523T0245'),
            new Date(1776, 4, 23, 2, 45)
          );
          assertDateEqual(
            create('17760523T024508'),
            new Date(1776, 4, 23, 2, 45, 8)
          );
          assertDateEqual(create('20101122'), new Date(2010, 10, 22));

          mockTimeZone(300); // GMT-05:00
          assertDateEqual(
            create('17760523T024508+0830'),
            new Date(1776, 4, 22, 13, 15, 8)
          );
          assertDateEqual(
            create('1776-05-23T02:45:08-0830'),
            new Date(1776, 4, 23, 5, 15, 8)
          );
          assertDateEqual(
            create('1776-05-23T02:45:08+0830'),
            new Date(1776, 4, 22, 13, 15, 8)
          );
          assertDateEqual(
            create('2001-04-03T1130-0700'),
            new Date(2001, 3, 3, 13, 30)
          );
        });

        it('should handle U+2212 MINUS SIGN for offset', () => {
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(
            create('1994-11-05T08:15:30−05:00'),
            new Date(1994, 10, 5, 8, 15, 30)
          );
        });

        it('should allow up to 6 decimal points in fractional seconds', () => {
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(
            create('1997-07-16T19:20:30.4+01:00'),
            new Date(1997, 6, 16, 13, 20, 30, 400)
          );
          assertDateEqual(
            create('1997-07-16T19:20:30.46+01:00'),
            new Date(1997, 6, 16, 13, 20, 30, 460)
          );
          assertDateEqual(
            create('1997-07-16T19:20:30.462+01:00'),
            new Date(1997, 6, 16, 13, 20, 30, 462)
          );
          assertDateEqual(
            create('1997-07-16T19:20:30.4628+01:00'),
            new Date(1997, 6, 16, 13, 20, 30, 463)
          );
          assertDateEqual(
            create('1997-07-16T19:20:30.46284+01:00'),
            new Date(1997, 6, 16, 13, 20, 30, 463)
          );
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
          assertDateEqual(
            create('2012-04-23T07:58:42.7940000z'),
            new Date(2012, 3, 23, 2, 58, 42, 794)
          );
        });

        it('should handle decimals in lowest order time elements', () => {
          assertDateEqual(
            create('1997-07-16T14:30:40.5'),
            new Date(1997, 6, 16, 14, 30, 40, 500)
          );
          assertDateEqual(
            create('1997-07-16T14:30.5'),
            new Date(1997, 6, 16, 14, 30, 30)
          );
          assertDateEqual(
            create('1997-07-16T14.5'),
            new Date(1997, 6, 16, 14, 30)
          );
        });

        it('should handle comma decimals in lowest order time elements', () => {
          assertDateEqual(
            create('1997-07-16T14:30:40,5'),
            new Date(1997, 6, 16, 14, 30, 40, 500)
          );
          assertDateEqual(
            create('1997-07-16T14:30,5'),
            new Date(1997, 6, 16, 14, 30, 30)
          );
          assertDateEqual(
            create('1997-07-16T14,5'),
            new Date(1997, 6, 16, 14, 30)
          );
        });

        it('should parse 24 hours', () => {
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(
            create('2012-05-03T24:00:00Z'),
            new Date(2012, 4, 3, 19)
          );
        });

        it('should parse leap seconds', () => {
          // The ISO-8601 spec allows for leap seconds, however ECMAScript does not.
          // However, date set methods are still allowed to overshoot, so allow this
          // format to be parsed.
          mockTimeZone(0); // GMT+00:00
          assertDateEqual(create('1998-12-31T23:59:60Z'), new Date(1999, 0));
        });

        it('should handle Issue #146', () => {
          mockTimeZone(0); // GMT+00:00
          assertDateEqual(create('2010-01-20T20:00:00.000Z'), new Date(2010, 0, 20, 20));
          assertDateEqual(create('2010-02-20T20:00:00.000Z'), new Date(2010, 1, 20, 20));
          assertDateEqual(create('2010-03-20T20:00:00.000Z'), new Date(2010, 2, 20, 20));
          assertDateEqual(create('2010-12-20T20:00:00.000Z'), new Date(2010, 11, 20, 20));
        });

      });

      describe('Year First', () => {

        it('should parse hyphen format', () => {
          assertDateEqual(create('2009-7-12'), new Date(2009, 6, 12));
          assertDateEqual(create('2009-07-12'), new Date(2009, 6, 12));
          assertDateEqual(
            create('2009-07-12 12:34'),
            new Date(2009, 6, 12, 12, 34)
          );
          assertDateEqual(
            create('2009-07-12 12:34:56'),
            new Date(2009, 6, 12, 12, 34, 56)
          );
          assertDateEqual(create('1978-08-25'), new Date(1978, 7, 25));
          assertDateEqual(create('1978-08'), new Date(1978, 7));
          assertDateEqual(create('1978-8'), new Date(1978, 7));
        });

        it('should parse slash format', () => {
          assertDateEqual(create('2009/07/12'), new Date(2009, 6, 12));
          assertDateEqual(create('2009/7/12'), new Date(2009, 6, 12));
          assertDateEqual(
            create('2009/07/12 12:34'),
            new Date(2009, 6, 12, 12, 34)
          );
          assertDateEqual(
            create('2009/07/12 12:34:56'),
            new Date(2009, 6, 12, 12, 34, 56)
          );
          assertDateEqual(
            create('2009/07/12 12:34:56.789'),
            new Date(2009, 6, 12, 12, 34, 56, 789)
          );
          assertDateEqual(create('1978/08/25'), new Date(1978, 7, 25));
          assertDateEqual(create('1978/8/25'), new Date(1978, 7, 25));
          assertDateEqual(create('1978/08'), new Date(1978, 7));
          assertDateEqual(create('1978/8'), new Date(1978, 7));
          assertDateEqual(
            create('1978/08/25 12:04'),
            new Date(1978, 7, 25, 12, 4)
          );
        });

        it('should parse period format', () => {
          assertDateEqual(create('1978.08.25'), new Date(1978, 7, 25));
          assertDateEqual(create('1978.08'), new Date(1978, 7));
          assertDateEqual(create('1978.8'), new Date(1978, 7));
        });
      });

      describe('Year Last', () => {

        it('should parse hyphen format', () => {
          assertDateEqual(create('1-1-2012'), new Date(2012, 0, 1));
          assertDateEqual(create('1-1-12'), new Date(2012, 0, 1));
          assertDateEqual(create('1/1/12'), new Date(2012, 0, 1));
          assertDateEqual(create('1-1-12 11:12'), new Date(2012, 0, 1, 11, 12));
          assertDateEqual(create('1/1/12 11:12'), new Date(2012, 0, 1, 11, 12));
          assertDateEqual(
            create('1-1-12 11:12:34.567'),
            new Date(2012, 0, 1, 11, 12, 34, 567)
          );
          assertDateEqual(
            create('1/1/12 11:12:34.567'),
            new Date(2012, 0, 1, 11, 12, 34, 567)
          );

          assertDateEqual(
            create('08-25-1978 12:04:57'),
            new Date(1978, 7, 25, 12, 4, 57)
          );
          assertDateEqual(
            create('08-25-1978 12:04:57.322'),
            new Date(1978, 7, 25, 12, 4, 57, 322)
          );

          assertDateEqual(create('08-25-1978 12pm'), new Date(1978, 7, 25, 12));
          assertDateEqual(
            create('08-25-1978 12:42pm'),
            new Date(1978, 7, 25, 12, 42)
          );
          assertDateEqual(
            create('08-25-1978 12:42:32pm'),
            new Date(1978, 7, 25, 12, 42, 32)
          );
          assertDateEqual(
            create('08-25-1978 12:42:32.488pm'),
            new Date(1978, 7, 25, 12, 42, 32, 488)
          );

          assertDateEqual(
            create('08-25-1978 00:00am'),
            new Date(1978, 7, 25, 0, 0, 0, 0)
          );
          assertDateEqual(
            create('08-25-1978 00:00:00am'),
            new Date(1978, 7, 25, 0, 0, 0, 0)
          );
          assertDateEqual(
            create('08-25-1978 00:00:00.000am'),
            new Date(1978, 7, 25, 0, 0, 0, 0)
          );

          assertDateEqual(create('08-25-1978 1pm'), new Date(1978, 7, 25, 13));
          assertDateEqual(
            create('08-25-1978 1:42pm'),
            new Date(1978, 7, 25, 13, 42)
          );
          assertDateEqual(
            create('08-25-1978 1:42:32pm'),
            new Date(1978, 7, 25, 13, 42, 32)
          );
          assertDateEqual(
            create('08-25-1978 1:42:32.488pm'),
            new Date(1978, 7, 25, 13, 42, 32, 488)
          );

          assertDateEqual(create('08-25-1978 1am'), new Date(1978, 7, 25, 1));
          assertDateEqual(
            create('08-25-1978 1:42am'),
            new Date(1978, 7, 25, 1, 42)
          );
          assertDateEqual(
            create('08-25-1978 1:42:32am'),
            new Date(1978, 7, 25, 1, 42, 32)
          );
          assertDateEqual(
            create('08-25-1978 1:42:32.488am'),
            new Date(1978, 7, 25, 1, 42, 32, 488)
          );

          assertDateEqual(create('08-25-1978 11pm'), new Date(1978, 7, 25, 23));
          assertDateEqual(
            create('08-25-1978 11:42pm'),
            new Date(1978, 7, 25, 23, 42)
          );
          assertDateEqual(
            create('08-25-1978 11:42:32pm'),
            new Date(1978, 7, 25, 23, 42, 32)
          );
          assertDateEqual(
            create('08-25-1978 11:42:32.488pm'),
            new Date(1978, 7, 25, 23, 42, 32, 488)
          );

          assertDateEqual(create('08-25-1978 11am'), new Date(1978, 7, 25, 11));
          assertDateEqual(
            create('08-25-1978 11:42am'),
            new Date(1978, 7, 25, 11, 42)
          );
          assertDateEqual(
            create('08-25-1978 11:42:32am'),
            new Date(1978, 7, 25, 11, 42, 32)
          );
          assertDateEqual(
            create('08-25-1978 11:42:32.488am'),
            new Date(1978, 7, 25, 11, 42, 32, 488)
          );

          assertDateEqual(
            create('1998-02-23 11:54:32'),
            new Date(1998, 1, 23, 11, 54, 32)
          );
          assertDateEqual(
            create('08-25-1978 11:42:32.488am'),
            new Date(1978, 7, 25, 11, 42, 32, 488)
          );
        });

        it('should parse slash format', () => {
          assertDateEqual(create('07/12/2009'), new Date(2009, 6, 12));
          assertDateEqual(create('7/12/2009'), new Date(2009, 6, 12));
          assertDateEqual(
            create('07/12/2009 12:34'),
            new Date(2009, 6, 12, 12, 34)
          );
          assertDateEqual(
            create('07/12/2009 12:34:56'),
            new Date(2009, 6, 12, 12, 34, 56)
          );
          assertDateEqual(
            create('07/12/2009 12:34:56.789'),
            new Date(2009, 6, 12, 12, 34, 56, 789)
          );
          assertDateEqual(
            create('08/25/1978 12:04'),
            new Date(1978, 7, 25, 12, 4)
          );
          assertDateEqual(
            create('08-25-1978 12:04'),
            new Date(1978, 7, 25, 12, 4)
          );
        });

        it('should parse period format', () => {
          assertDateEqual(create('4.15.2016'), new Date(2016, 3, 15));
        });
      });

      describe('Other', () => {

        it('should parse IETF format', () => {
          // Most browsers will parse this format
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(
            create('Mon 05 Sep 2011 12:30:00 GMT-0700 (PDT)'),
            new Date(2011, 8, 5, 14, 30)
          );
          assertDateEqual(
            create('Sat, 28 Aug 2004 08:15:38 GMT'),
            new Date(2004, 7, 28, 3, 15, 38)
          );
          assertDateEqual(
            create('Sat, 28 Aug 2004 08:15:38 GMT-0500 (EASST)'),
            new Date(2004, 7, 28, 8, 15, 38)
          );
          assertDateEqual(
            create('Wed 22 Jun 2016 21:43 GMT+0300 (Jordan Daylight Time)'),
            new Date(2016, 5, 22, 13, 43)
          );
        });

        it('should parse .NET JSON format', () => {
          assertDateEqual(
            create('\\/Date(628318530718)\\/'),
            new Date(628318530718)
          );
          assertDateEqual(
            create('\\/Date(1318287600+0100)\\/'),
            new Date(1318287600)
          );
          assertDateEqual(
            create('\\/Date(1318287600-0700)\\/'),
            new Date(1318287600)
          );
        });

        it('should parse month and date', () => {
          assertDateEqual(create('1/2'), new Date(2020, 0, 2));
          assertDateEqual(create('1-2'), new Date(2020, 0, 2));
        });

        it('should parse ISO8601 format regardless of locale', () => {
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(
            create('2020-01-01T00:00:00', 'ja-JP'),
            new Date(2020, 0, 1)
          );
          assertDateEqual(
            create('2020-01-01T00:00:00Z', 'ja-JP'),
            new Date(2019, 11, 31, 19)
          );
          assertDateEqual(
            create('2020-01-01T00:00:00-10:00', 'ja-JP'),
            new Date(2020, 0, 1, 5)
          );
        });

        it('should handle Issue #219', () => {
          assertDateEqual(create('23:00'), new Date(2020, 0, 1, 23));
          assertDateEqual(create('24:00'), new Date(2020, 0, 2, 0));
          assertDateEqual(create('25:00'), new Date(2020, 0, 2, 1));
          assertDateEqual(create('29:00'), new Date(2020, 0, 2, 5));
          assertDateEqual(create('05:59:59'), new Date(2020, 0, 1, 5, 59, 59));
          assertNull(create('30:00'));
          assertNull(create('139:00'));
        });

        it('should handle Issue #98', () => {
          mockTimeZone(300); // GMT-05:00
          assertDateEqual(create('2011-09-01T05:00:00Z'), new Date(2011, 8, 1));
        });
      });
    });

    describe('DateTime Formats', () => {

      it('should parse basic date with time', () => {
        assertDateEqual(
          create('June 1, 2020 10:00 AM'),
          new Date(2020, 5, 1, 10)
        );
        assertDateEqual(
          create('June 1, 2020 8:00pm'),
          new Date(2020, 5, 1, 20)
        );
        assertDateEqual(create('May 23 2020 16:00'), new Date(2020, 4, 23, 16));
      });

      it('should parse long month with date and year', () => {
        assertDateEqual(create('June 1, 2020'), new Date(2020, 5));
      });

      it('should parse long month with initial date and year', () => {
        assertDateEqual(create('15 July, 2008'), new Date(2008, 6, 15));
        assertDateEqual(create('15 July 2008'), new Date(2008, 6, 15));
      });

      it('should parse date with English ordinal suffix', () => {
        assertDateEqual(create('June 1st, 2008'), new Date(2008, 5, 1));
        assertDateEqual(create('June 2nd, 2008'), new Date(2008, 5, 2));
        assertDateEqual(create('June 3rd, 2008'), new Date(2008, 5, 3));
        assertDateEqual(create('June 4th, 2008'), new Date(2008, 5, 4));
        assertDateEqual(create('June 15th, 2008'), new Date(2008, 5, 15));
        assertDateEqual(create('June 1st 2008'), new Date(2008, 5, 1));
        assertDateEqual(create('June 2nd 2008'), new Date(2008, 5, 2));
        assertDateEqual(create('June 3rd 2008'), new Date(2008, 5, 3));
        assertDateEqual(create('June 4th 2008'), new Date(2008, 5, 4));
        assertDateEqual(create('June 15, 2008'), new Date(2008, 5, 15));
        assertDateEqual(create('June 15 2008'), new Date(2008, 5, 15));
      });

      it('should parse weekday with date and English ordinal suffix', () => {
        assertDateEqual(
          create('Monday January 16th 2012'),
          new Date(2012, 0, 16)
        );
        assertDateEqual(
          create('Monday, January 16th 2012'),
          new Date(2012, 0, 16)
        );
        assertDateEqual(
          create('Monday, January, 16th 2012'),
          new Date(2012, 0, 16)
        );
        assertDateEqual(
          create('Monday January, 16th 2012'),
          new Date(2012, 0, 16)
        );
        assertDateEqual(
          create('Monday January 16th, 2012'),
          new Date(2012, 0, 16)
        );
        assertDateEqual(
          create('Monday January, 16th, 2012'),
          new Date(2012, 0, 16)
        );
        assertDateEqual(
          create('Monday, January, 16th, 2012'),
          new Date(2012, 0, 16)
        );
        assertDateEqual(
          create('Thursday July 3rd, 2008'),
          new Date(2008, 6, 3)
        );
        assertDateEqual(create('Thu July 3rd, 2008'), new Date(2008, 6, 3));
        assertDateEqual(create('Thu. July 3rd, 2008'), new Date(2008, 6, 3));
      });

      it('should parse short weekday with long month and year', () => {
        assertDateEqual(create('Mon January 16, 2012'), new Date(2012, 0, 16));
        assertDateEqual(create('Mon. January 16, 2012'), new Date(2012, 0, 16));
        assertDateEqual(
          create('Mon. January, 16, 2012'),
          new Date(2012, 0, 16)
        );
        assertDateEqual(
          create('Mon., January, 16, 2012'),
          new Date(2012, 0, 16)
        );
        assertDateEqual(create('Dec 1st, 2008'), new Date(2008, 11, 1));
        assertDateEqual(create('Dec. 1st, 2008'), new Date(2008, 11, 1));
        assertDateEqual(create('1 Dec. 2008'), new Date(2008, 11, 1));
        assertDateEqual(create('1 Dec., 2008'), new Date(2008, 11, 1));
        assertDateEqual(create('1 Dec, 2008'), new Date(2008, 11, 1));
        assertDateEqual(
          create('June 1st, 2008 12:04'),
          new Date(2008, 5, 1, 12, 4)
        );
        assertDateEqual(
          create('February 29, 2012 22:15:42'),
          new Date(2012, 1, 29, 22, 15, 42)
        );
      });

      it('should parse short weekday with short month and year', () => {
        assertDateEqual(create('Mon Jan 16, 2012'), new Date(2012, 0, 16));
        assertDateEqual(create('Mon. Jan. 16, 2012'), new Date(2012, 0, 16));
        assertDateEqual(create('Mon. Jan., 16, 2012'), new Date(2012, 0, 16));
        assertDateEqual(create('Mon., Jan., 16, 2012'), new Date(2012, 0, 16));
      });

      it('should parse hyphenated with text month', () => {
        assertDateEqual(create('09-May-78'), new Date(1978, 4, 9));
        assertDateEqual(create('09-May-1978'), new Date(1978, 4, 9));
        assertDateEqual(
          create('09-May-1978 3:45pm'),
          new Date(1978, 4, 9, 15, 45)
        );
      });

      it('should parse standalone year', () => {
        assertDateEqual(create('1999'), new Date(1999, 0));
      });

      it('should parse standalone year with era', () => {
        assertDateEqual(create('1999 BC'), new Date(-1999, 0));
      });

      it('should parse long month and year', () => {
        assertDateEqual(create('June 2008'), new Date(2008, 5));
        assertDateEqual(create('February, 1998'), new Date(1998, 1));
      });

      it('should parse a standalone date', () => {
        assertDateEqual(create('the 15th'), new Date(2020, 0, 15));
        assertDateEqual(create('the 15th of the month'), new Date(2020, 0, 15));
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
        assertDateEqual(create('January 15'), new Date(2020, 0, 15));
        assertDateEqual(create('February 15'), new Date(2020, 1, 15));
        assertDateEqual(create('March 15'), new Date(2020, 2, 15));
        assertDateEqual(create('April 15'), new Date(2020, 3, 15));
        assertDateEqual(create('May 15'), new Date(2020, 4, 15));
        assertDateEqual(create('June 15'), new Date(2020, 5, 15));
        assertDateEqual(create('July 15'), new Date(2020, 6, 15));
        assertDateEqual(create('August 15'), new Date(2020, 7, 15));
        assertDateEqual(create('September 15'), new Date(2020, 8, 15));
        assertDateEqual(create('October 15'), new Date(2020, 9, 15));
        assertDateEqual(create('November 15'), new Date(2020, 10, 15));
        assertDateEqual(create('December 15'), new Date(2020, 11, 15));
      });

      it('should parse long month and date with ordinal', () => {
        assertDateEqual(create('January 5th'), new Date(2020, 0, 5));
        assertDateEqual(create('February 10th'), new Date(2020, 1, 10));
        assertDateEqual(create('March 11th'), new Date(2020, 2, 11));
        assertDateEqual(create('April 12th'), new Date(2020, 3, 12));
        assertDateEqual(create('May 13th'), new Date(2020, 4, 13));
        assertDateEqual(create('June 14th'), new Date(2020, 5, 14));
        assertDateEqual(create('July 15th'), new Date(2020, 6, 15));
        assertDateEqual(create('August 21st'), new Date(2020, 7, 21));
        assertDateEqual(create('September 22nd'), new Date(2020, 8, 22));
        assertDateEqual(create('October 23rd'), new Date(2020, 9, 23));
        assertDateEqual(create('November 24th'), new Date(2020, 10, 24));
        assertDateEqual(create('December 30th'), new Date(2020, 11, 30));
      });

      it('should parse long month, ordinal date, and year', () => {
        assertDateEqual(create('January 1st, 2016'), new Date(2016, 0, 1));
        assertDateEqual(create('January 2nd, 2016'), new Date(2016, 0, 2));
        assertDateEqual(create('January 3rd, 2016'), new Date(2016, 0, 3));
        assertDateEqual(create('January 4th, 2016'), new Date(2016, 0, 4));
        assertDateEqual(create('January 5th, 2016'), new Date(2016, 0, 5));
        assertDateEqual(create('January 6th, 2016'), new Date(2016, 0, 6));
        assertDateEqual(create('January 7th, 2016'), new Date(2016, 0, 7));
        assertDateEqual(create('January 8th, 2016'), new Date(2016, 0, 8));
        assertDateEqual(create('January 9th, 2016'), new Date(2016, 0, 9));
        assertDateEqual(create('January 10th, 2016'), new Date(2016, 0, 10));
        assertDateEqual(create('January 11th, 2016'), new Date(2016, 0, 11));
        assertDateEqual(create('January 12th, 2016'), new Date(2016, 0, 12));
        assertDateEqual(create('January 13th, 2016'), new Date(2016, 0, 13));
        assertDateEqual(create('January 14th, 2016'), new Date(2016, 0, 14));
        assertDateEqual(create('January 15th, 2016'), new Date(2016, 0, 15));
        assertDateEqual(create('January 16th, 2016'), new Date(2016, 0, 16));
        assertDateEqual(create('January 17th, 2016'), new Date(2016, 0, 17));
        assertDateEqual(create('January 18th, 2016'), new Date(2016, 0, 18));
        assertDateEqual(create('January 19th, 2016'), new Date(2016, 0, 19));
        assertDateEqual(create('January 20th, 2016'), new Date(2016, 0, 20));
        assertDateEqual(create('January 21st, 2016'), new Date(2016, 0, 21));
        assertDateEqual(create('January 22nd, 2016'), new Date(2016, 0, 22));
        assertDateEqual(create('January 23rd, 2016'), new Date(2016, 0, 23));
        assertDateEqual(create('January 24th, 2016'), new Date(2016, 0, 24));
        assertDateEqual(create('January 25th, 2016'), new Date(2016, 0, 25));
        assertDateEqual(create('January 26th, 2016'), new Date(2016, 0, 26));
        assertDateEqual(create('January 27th, 2016'), new Date(2016, 0, 27));
        assertDateEqual(create('January 28th, 2016'), new Date(2016, 0, 28));
        assertDateEqual(create('January 29th, 2016'), new Date(2016, 0, 29));
        assertDateEqual(create('January 30th, 2016'), new Date(2016, 0, 30));
        assertDateEqual(create('January 31st, 2016'), new Date(2016, 0, 31));
      });

      it('should not parse ordinal out of range', () => {
        assertNull(create('January 32nd, 2016'));
        assertNull(create('January 40th, 2016'));
      });

      it('should not parse invalid ordinals', () => {
        assertNull(create('January 1nd, 2016'));
        assertNull(create('January 1rd, 2016'));
        assertNull(create('January 1th, 2016'));

        assertNull(create('January 2st, 2016'));
        assertNull(create('January 2rd, 2016'));
        assertNull(create('January 2th, 2016'));

        assertNull(create('January 3st, 2016'));
        assertNull(create('January 3nd, 2016'));
        assertNull(create('January 3th, 2016'));

        assertNull(create('January 4st, 2016'));
        assertNull(create('January 4nd, 2016'));
        assertNull(create('January 4rd, 2016'));

        assertNull(create('January 5st, 2016'));
        assertNull(create('January 5nd, 2016'));
        assertNull(create('January 5rd, 2016'));

        assertNull(create('January 10st, 2016'));
        assertNull(create('January 10nd, 2016'));
        assertNull(create('January 10rd, 2016'));

        assertNull(create('January 11st, 2016'));
        assertNull(create('January 11nd, 2016'));
        assertNull(create('January 11rd, 2016'));

        assertNull(create('January 12st, 2016'));
        assertNull(create('January 12nd, 2016'));
        assertNull(create('January 12rd, 2016'));
      });

      it('should parse long weekday with time', () => {
        assertDateEqual(create('Saturday 8am'), new Date(2020, 0, 4, 8));
        assertDateEqual(create('Saturday at 8am'), new Date(2020, 0, 4, 8));
        assertDateEqual(create('8am Saturday'), new Date(2020, 0, 4, 8));
        assertDateEqual(create('8am on Saturday'), new Date(2020, 0, 4, 8));
      });

      it('should parse relative date and time', () => {
        assertDateEqual(create('Monday at noon'), new Date(2019, 11, 30, 12));
        assertDateEqual(
          create('next Saturday at noon'),
          new Date(2020, 0, 11, 12)
        );
        assertDateEqual(
          create('last Tuesday at noon'),
          new Date(2019, 11, 24, 12)
        );
        assertDateEqual(create('Monday at midnight'), new Date(2019, 11, 31));
        assertDateEqual(
          create('next Saturday at midnight'),
          new Date(2020, 0, 12)
        );
        assertDateEqual(
          create('last Tuesday at midnight'),
          new Date(2019, 11, 25)
        );
      });

      it('should parse offset weekday and month', () => {
        assertDateEqual(
          create('the 1st Tuesday of June'),
          new Date(2020, 5, 2)
        );
        assertDateEqual(
          create('the 3rd Friday of November'),
          new Date(2020, 10, 20)
        );
        assertDateEqual(
          create('the 1st Friday of February'),
          new Date(2020, 1, 7)
        );
      });

      it('should parse offset weekday month, and year', () => {
        assertDateEqual(
          create('the 1st Tuesday of June, 2012'),
          new Date(2012, 5, 5)
        );
        assertDateEqual(
          create('the 2nd Tuesday of June, 2012'),
          new Date(2012, 5, 12)
        );

        assertDateEqual(
          create('the 1st Tuesday of November, 2012'),
          new Date(2012, 10, 6)
        );
        assertDateEqual(
          create('the 2nd Tuesday of November, 2012'),
          new Date(2012, 10, 13)
        );
        assertDateEqual(
          create('the 3rd Tuesday of November, 2012'),
          new Date(2012, 10, 20)
        );
        assertDateEqual(
          create('the 4th Tuesday of November, 2012'),
          new Date(2012, 10, 27)
        );
        assertDateEqual(
          create('the 5th Tuesday of November, 2012'),
          new Date(2012, 11, 4)
        );
        assertDateEqual(
          create('the 6th Tuesday of November, 2012'),
          new Date(2012, 11, 11)
        );

        assertDateEqual(
          create('the 1st Friday of February, 2012'),
          new Date(2012, 1, 3)
        );
        assertDateEqual(
          create('the 2nd Friday of February, 2012'),
          new Date(2012, 1, 10)
        );
        assertDateEqual(
          create('the 3rd Friday of February, 2012'),
          new Date(2012, 1, 17)
        );
        assertDateEqual(
          create('the 4th Friday of February, 2012'),
          new Date(2012, 1, 24)
        );
        assertDateEqual(
          create('the 5th Friday of February, 2012'),
          new Date(2012, 2, 2)
        );
        assertDateEqual(
          create('the 6th Friday of February, 2012'),
          new Date(2012, 2, 9)
        );
      });

      it('should parse edge tokens for current unit', () => {
        setSystemTime(new Date(2020, 0, 15, 8, 55, 30));

        assertDateEqual(create('the beginning of the year'), new Date(2020, 0));
        assertDateEqual(
          create('the beginning of this year'),
          new Date(2020, 0)
        );
        assertDateEqual(create('beginning of this year'), new Date(2020, 0));
        assertDateEqual(
          create('the end of the year'),
          new Date(2020, 11, 31, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('the end of this year'),
          new Date(2020, 11, 31, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('end of this year'),
          new Date(2020, 11, 31, 23, 59, 59, 999)
        );

        assertDateEqual(
          create('the beginning of the month'),
          new Date(2020, 0)
        );
        assertDateEqual(
          create('the beginning of this month'),
          new Date(2020, 0)
        );
        assertDateEqual(create('beginning of this month'), new Date(2020, 0));
        assertDateEqual(
          create('the end of the month'),
          new Date(2020, 0, 31, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('the end of this month'),
          new Date(2020, 0, 31, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('end of this month'),
          new Date(2020, 0, 31, 23, 59, 59, 999)
        );

        assertDateEqual(
          create('the beginning of the week'),
          new Date(2020, 0, 12)
        );
        assertDateEqual(
          create('the beginning of this week'),
          new Date(2020, 0, 12)
        );
        assertDateEqual(
          create('beginning of this week'),
          new Date(2020, 0, 12)
        );
        assertDateEqual(
          create('the end of the week'),
          new Date(2020, 0, 18, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('the end of this week'),
          new Date(2020, 0, 18, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('end of this week'),
          new Date(2020, 0, 18, 23, 59, 59, 999)
        );

        assertDateEqual(
          create('the beginning of the day'),
          new Date(2020, 0, 15)
        );
        assertDateEqual(create('beginning of the day'), new Date(2020, 0, 15));
        assertDateEqual(
          create('the end of the day'),
          new Date(2020, 0, 15, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('end of the day'),
          new Date(2020, 0, 15, 23, 59, 59, 999)
        );

        assertNull(create('the end of -5 days ago'));
      });

      it('should parse edge tokens for adjacent units', () => {
        setSystemTime(new Date(2020, 0, 15, 8, 55, 30));

        assertDateEqual(
          create('the beginning of last year'),
          new Date(2019, 0)
        );
        assertDateEqual(
          create('the end of last year'),
          new Date(2019, 11, 31, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('the beginning of next year'),
          new Date(2021, 0)
        );
        assertDateEqual(
          create('the end of next year'),
          new Date(2021, 11, 31, 23, 59, 59, 999)
        );

        assertDateEqual(
          create('the beginning of last month'),
          new Date(2019, 11)
        );
        assertDateEqual(
          create('the end of last month'),
          new Date(2019, 11, 31, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('the beginning of next month'),
          new Date(2020, 1)
        );
        assertDateEqual(
          create('the end of next month'),
          new Date(2020, 1, 29, 23, 59, 59, 999)
        );

        assertDateEqual(
          create('the beginning of last week'),
          new Date(2020, 0, 5)
        );
        assertDateEqual(
          create('the end of last week'),
          new Date(2020, 0, 11, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('the beginning of next week'),
          new Date(2020, 0, 19)
        );
        assertDateEqual(
          create('the end of next week'),
          new Date(2020, 0, 25, 23, 59, 59, 999)
        );
      });

      it('should parse short year with apostrophe', () => {
        assertDateEqual(create("May '78"), new Date(1978, 4));
      });

      it('should parse year first hyphen with text month', () => {
        assertDateEqual(create('1978-May-09'), new Date(1978, 4, 9));
        assertDateEqual(
          create('1978-May-09 3:45pm'),
          new Date(1978, 4, 9, 15, 45)
        );
      });

      it('should parse year with era', () => {
        assertDateEqual(create('February 1, 1000 BC'), new Date(-1000, 1));
      });

      it('should override an incorrect weekday', () => {
        assertDateEqual(create('Sunday July 3rd, 2008'), new Date(2008, 6, 3));
      });

      it('should not parse tokenized ordinals in date', () => {
        assertDateEqual(create('the second of January'), new Date(2020, 0, 2));
        assertDateEqual(create('the first of January'), new Date(2020, 0, 1));
        assertDateEqual(create('the second of January'), new Date(2020, 0, 2));
        assertDateEqual(create('the third of January'), new Date(2020, 0, 3));
        assertDateEqual(create('the fourth of January'), new Date(2020, 0, 4));
        assertDateEqual(create('the fifth of January'), new Date(2020, 0, 5));
        assertDateEqual(create('the sixth of January'), new Date(2020, 0, 6));
        assertDateEqual(create('the seventh of January'), new Date(2020, 0, 7));
        assertDateEqual(create('the eighth of January'), new Date(2020, 0, 8));
        assertDateEqual(create('the ninth of January'), new Date(2020, 0, 9));
        assertDateEqual(create('the tenth of January'), new Date(2020, 0, 10));

        assertDateEqual(create('the fifth of January'), new Date(2020, 0, 5));
        assertDateEqual(create('the fifth of February'), new Date(2020, 1, 5));
        assertDateEqual(create('the fifth of March'), new Date(2020, 2, 5));
        assertDateEqual(create('the fifth of April'), new Date(2020, 3, 5));
        assertDateEqual(create('the fifth of May'), new Date(2020, 4, 5));
        assertDateEqual(create('the fifth of June'), new Date(2020, 5, 5));
        assertDateEqual(create('the fifth of July'), new Date(2020, 6, 5));
        assertDateEqual(create('the fifth of August'), new Date(2020, 7, 5));
        assertDateEqual(create('the fifth of September'), new Date(2020, 8, 5));
        assertDateEqual(create('the fifth of October'), new Date(2020, 9, 5));
        assertDateEqual(create('the fifth of November'), new Date(2020, 10, 5));
        assertDateEqual(create('the fifth of December'), new Date(2020, 11, 5));

        assertDateEqual(create('the first of June'), new Date(2020, 5, 1));
        assertDateEqual(create('the second of June'), new Date(2020, 5, 2));
        assertDateEqual(create('the third of June'), new Date(2020, 5, 3));
        assertDateEqual(create('the fourth of June'), new Date(2020, 5, 4));
        assertDateEqual(create('the fifth of June'), new Date(2020, 5, 5));
        assertDateEqual(create('the sixth of June'), new Date(2020, 5, 6));
        assertDateEqual(create('the seventh of June'), new Date(2020, 5, 7));
        assertDateEqual(create('the eighth of June'), new Date(2020, 5, 8));
        assertDateEqual(create('the ninth of June'), new Date(2020, 5, 9));
        assertDateEqual(create('the tenth of June'), new Date(2020, 5, 10));
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

      it('should handle Issue #227', () => {
        assertDateEqual(create('0 January'), new Date(2019, 11, 31));
        assertDateEqual(create('1 January'), new Date(2020, 0, 1));
        assertDateEqual(create('01 January'), new Date(2020, 0, 1));
        assertDateEqual(create('15 January'), new Date(2020, 0, 15));
        assertDateEqual(create('31 January'), new Date(2020, 0, 31));

        assertDateEqual(create('1 Jan'), new Date(2020, 0, 1));
        assertDateEqual(create('01 Jan'), new Date(2020, 0, 1));
        assertDateEqual(create('15 Jan'), new Date(2020, 0, 15));
        assertDateEqual(create('31 Jan'), new Date(2020, 0, 31));

        assertDateEqual(create('0 July'), new Date(2020, 5, 30));
        assertDateEqual(create('1 July'), new Date(2020, 6, 1));
        assertDateEqual(create('01 July'), new Date(2020, 6, 1));
        assertDateEqual(create('15 July'), new Date(2020, 6, 15));
        assertDateEqual(create('31 July'), new Date(2020, 6, 31));
        assertDateEqual(create('32 July'), new Date(2020, 7, 1));

        assertDateEqual(create('1 Dec'), new Date(2020, 11, 1));
        assertDateEqual(create('01 Dec'), new Date(2020, 11, 1));
        assertDateEqual(create('15 Dec'), new Date(2020, 11, 15));
        assertDateEqual(create('31 Dec'), new Date(2020, 11, 31));

        assertDateEqual(create('1 December'), new Date(2020, 11, 1));
        assertDateEqual(create('01 December'), new Date(2020, 11, 1));
        assertDateEqual(create('15 December'), new Date(2020, 11, 15));
        assertDateEqual(create('31 December'), new Date(2020, 11, 31));
        assertDateEqual(create('32 December'), new Date(2020 + 1, 0, 1));

        assertDateEqual(create('1 January 3pm'), new Date(2020, 0, 1, 15));
        assertDateEqual(
          create('1 January 3:45pm'),
          new Date(2020, 0, 1, 15, 45)
        );

        assertDateEqual(create("'87"), new Date(1987, 0));
        assertDateEqual(create("May '87"), new Date(1987, 4));
        assertDateEqual(create("14 May '87"), new Date(1987, 4, 14));
      });

      it('should handle Issue #144', () => {
        assertDateEqual(create('6/30/2012 3:00 PM'), new Date(2012, 5, 30, 15));
        assertDateEqual(
          create('Thursday at 3:00 PM'),
          new Date(2020, 0, 2, 15)
        );
        assertDateEqual(create('Thursday at 3:00PM'), new Date(2020, 0, 2, 15));
      });

      it('should handle Issue #152', () => {
        assertDateEqual(create('3:45 2012-3-15'), new Date(2012, 2, 15, 3, 45));
        assertDateEqual(
          create('3:45pm 2012-3-15'),
          new Date(2012, 2, 15, 15, 45)
        );
        assertDateEqual(
          create('3:45pm 3/15/2012'),
          new Date(2012, 2, 15, 15, 45)
        );
        assertDateEqual(
          create('3:45pm 3/4/2012', 'en-GB'),
          new Date(2012, 3, 3, 15, 45)
        );
      });

      it('should handle Issue #244', () => {
        assertDateEqual(create('0999'), new Date(999, 0));
        assertDateEqual(create('0123'), new Date(123, 0));
      });

      it('should handle Issue #636', () => {
        // Dates are absolutely allowed to overshoot for
        // their given locale, as this mirrors the Date API.

        assertDateEqual(create('19/6/2018'), new Date(2019, 6, 6));
        assertDateEqual(create('13/6/2018'), new Date(2019, 0, 6));
        assertDateEqual(create('0/6/2018'), new Date(2017, 11, 6));

        assertDateEqual(create('1/0/2018'), new Date(2017, 11, 31));
        assertDateEqual(create('1/32/2018'), new Date(2018, 1));
        assertDateEqual(create('1/0/2018'), new Date(2017, 11, 31));
        assertDateEqual(create('1/00/2018'), new Date(2017, 11, 31));

        // Years up to 6 digits should be parsed.

        assertDateEqual(create('1/1/10000'), new Date(10000, 0, 1));
        assertDateEqual(create('1/1/100000'), new Date(100000, 0, 1));
        assertNull(create('1/1/1000000'));

        // Hours from 24-29 may be locale dependent and are allowed.
        assertDateEqual(create('25:00'), new Date(2020, 0, 2, 1));
        assertDateEqual(create('29:59'), new Date(2020, 0, 2, 5, 59));
        assertNull(create('30:00'));

        // Unreasonable hours are not allowed.
        assertNull(create('125:00'));
        assertNull(create('00:00:125.999'));

        // To allow for app-specific logic you can use the "explain" option
        // to discover the parsed month. If it is greater than 11 perform
        // error handling, etc.

        const { absProps } = create('19/6/2018', {
          cache: false,
          explain: true,
        });

        assertObjectEqual(absProps, {
          month: 18,
          date: 6,
          year: 2018,
        });
      });
    });

    describe('Time Formats', () => {

      it('should parse time with hours only', () => {
        assertDateEqual(create('10 AM'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10 PM'), new Date(2020, 0, 1, 22));
        assertDateEqual(create('10 am'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10 pm'), new Date(2020, 0, 1, 22));
        assertDateEqual(create('10am'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10pm'), new Date(2020, 0, 1, 22));
        assertDateEqual(create('1pm'), new Date(2020, 0, 1, 13));
      });

      it('should parse 12:00am correctly', () => {
        assertDateEqual(create('12:00am'), new Date(2020, 0));
        assertDateEqual(create('12am'), new Date(2020, 0));
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
        assertDateEqual(create('1:30pm'), new Date(2020, 0, 1, 13, 30));
      });

      it('should parse time with optional seconds and milliseconds', () => {
        assertDateEqual(create('1:30:22pm'), new Date(2020, 0, 1, 13, 30, 22));
        assertDateEqual(
          create('1:30:22.432pm'),
          new Date(2020, 0, 1, 13, 30, 22, 432)
        );
        assertDateEqual(
          create('17:48:03.947'),
          new Date(2020, 0, 1, 17, 48, 3, 947)
        );
      });

      it('should parse day period without space', () => {
        assertDateEqual(create('10:00am'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10:00pm'), new Date(2020, 0, 1, 22));
      });

      it('should parse day period with periods', () => {
        assertDateEqual(create('10:00 a.m.'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10:00 p.m.'), new Date(2020, 0, 1, 22));
      });

      it('should parse day period short format', () => {
        assertDateEqual(create('10:00a'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10:00p'), new Date(2020, 0, 1, 22));
      });

      it('should parse day period short format with period', () => {
        assertDateEqual(create('10:00a.'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10:00p.'), new Date(2020, 0, 1, 22));
      });

      it('should not parse a standalone integer', () => {
        assertNull(create('10'));
      });

      it('should handle Issue #634', () => {
        assertDateEqual(create('10:'), new Date(2020, 0, 1, 10));
      });
    });

    describe('Relative formats', () => {

      it('should parse relative year and month', () => {
        assertDateEqual(create('January of last year'), new Date(2019, 0));
        assertDateEqual(create('February of last year'), new Date(2019, 1));
        assertDateEqual(create('January of next year'), new Date(2021, 0));
        assertDateEqual(create('February of next year'), new Date(2021, 1));
        assertDateEqual(create('January last year'), new Date(2019, 0));
        assertDateEqual(create('February last year'), new Date(2019, 1));
      });

      it('should parse relative year with month and date', () => {
        assertDateEqual(
          create('January 30th of last year'),
          new Date(2019, 0, 30)
        );
      });

      it('should parse relative month and date', () => {
        assertDateEqual(
          create('the 15th of last month'),
          new Date(2019, 11, 15)
        );
        assertDateEqual(
          create('the 15th of last month at 2:30pm'),
          new Date(2019, 11, 15, 14, 30)
        );
      });

      it('should parse units ago', () => {
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
        assertDateEqual(
          create('2 minutes ago'),
          new Date(2019, 11, 31, 23, 58)
        );
        assertDateEqual(
          create('5 minutes ago'),
          new Date(2019, 11, 31, 23, 55)
        );
        assertDateEqual(create('0 minutes ago'), new Date(2020, 0));

        assertDateEqual(
          create('1 second ago'),
          new Date(2019, 11, 31, 23, 59, 59)
        );
        assertDateEqual(
          create('2 seconds ago'),
          new Date(2019, 11, 31, 23, 59, 58)
        );
        assertDateEqual(
          create('5 seconds ago'),
          new Date(2019, 11, 31, 23, 59, 55)
        );
        assertDateEqual(create('0 seconds ago'), new Date(2020, 0));
      });

      it('should parse token numerals in relative format', () => {
        assertDateEqual(create('one day ago'), new Date(2019, 11, 31));
        assertDateEqual(create('two days ago'), new Date(2019, 11, 30));
        assertDateEqual(create('three days ago'), new Date(2019, 11, 29));
        assertDateEqual(create('four days ago'), new Date(2019, 11, 28));
        assertDateEqual(create('five days ago'), new Date(2019, 11, 27));
        assertDateEqual(create('six days ago'), new Date(2019, 11, 26));
        assertDateEqual(create('seven days ago'), new Date(2019, 11, 25));
        assertDateEqual(create('eight days ago'), new Date(2019, 11, 24));
        assertDateEqual(create('nine days ago'), new Date(2019, 11, 23));
        assertDateEqual(create('ten days ago'), new Date(2019, 11, 22));

        assertDateEqual(create('one day from now'), new Date(2020, 0, 2));
        assertDateEqual(create('two days from now'), new Date(2020, 0, 3));
        assertDateEqual(create('three days from now'), new Date(2020, 0, 4));
        assertDateEqual(create('four days from now'), new Date(2020, 0, 5));
        assertDateEqual(create('five days from now'), new Date(2020, 0, 6));
        assertDateEqual(create('six days from now'), new Date(2020, 0, 7));
        assertDateEqual(create('seven days from now'), new Date(2020, 0, 8));
        assertDateEqual(create('eight days from now'), new Date(2020, 0, 9));
        assertDateEqual(create('nine days from now'), new Date(2020, 0, 10));
        assertDateEqual(create('ten days from now'), new Date(2020, 0, 11));
      });

      it('should handle articles', () => {
        assertDateEqual(create('an hour ago'), new Date(2019, 11, 31, 23));
        assertDateEqual(create('an hour from now'), new Date(2020, 0, 1, 1));
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
        assertDateEqual(create('in 60 seconds'), new Date(2020, 0, 1, 0, 1));
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

        assertDateEqual(
          create('1 minute from now'),
          new Date(2020, 0, 1, 0, 1)
        );
        assertDateEqual(
          create('2 minutes from now'),
          new Date(2020, 0, 1, 0, 2)
        );
        assertDateEqual(
          create('5 minutes from now'),
          new Date(2020, 0, 1, 0, 5)
        );
        assertDateEqual(create('0 minutes from now'), new Date(2020, 0));

        assertDateEqual(
          create('1 second from now'),
          new Date(2020, 0, 1, 0, 0, 1)
        );
        assertDateEqual(
          create('2 seconds from now'),
          new Date(2020, 0, 1, 0, 0, 2)
        );
        assertDateEqual(
          create('5 seconds from now'),
          new Date(2020, 0, 1, 0, 0, 5)
        );
        assertDateEqual(create('0 seconds from now'), new Date(2020, 0));
        assertDateEqual(
          create('60 seconds from now'),
          new Date(2020, 0, 1, 0, 1)
        );
      });

      it('should handle negative integers in relative formats', () => {
        assertDateEqual(
          create('-2 hours from now'),
          new Date(2019, 11, 31, 22)
        );
        assertDateEqual(create('in -2 hours'), new Date(2019, 11, 31, 22));
        assertDateEqual(create('-2 hours ago'), new Date(2020, 0, 1, 2));
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

        assertDateEqual(
          create('3:00pm 5 days ago'),
          new Date(2019, 11, 27, 15)
        );
        assertDateEqual(create('3:00pm in 5 days'), new Date(2020, 0, 6, 15));
        assertDateEqual(
          create('3:00pm 5 days from now'),
          new Date(2020, 0, 6, 15)
        );
      });

      it('should parse relative date and time', () => {
        assertDateEqual(create('today at 9pm'), new Date(2020, 0, 1, 21));
        assertDateEqual(create('tomorrow at 10am'), new Date(2020, 0, 2, 10));

        assertDateEqual(
          create('tomorrow at 10:00am'),
          new Date(2020, 0, 2, 10)
        );
        assertDateEqual(
          create('tomorrow at 12:00pm'),
          new Date(2020, 0, 2, 12)
        );
        assertDateEqual(create('tomorrow at 9:00pm'), new Date(2020, 0, 2, 21));
        assertDateEqual(create('tomorrow at 02:00'), new Date(2020, 0, 2, 2));
        assertDateEqual(create('tomorrow at 23:00'), new Date(2020, 0, 2, 23));

        assertDateEqual(create('today at 3:00pm'), new Date(2020, 0, 1, 15));
        assertDateEqual(create('today at 3:00 pm'), new Date(2020, 0, 1, 15));
        assertDateEqual(create('today at 3:00 p.m.'), new Date(2020, 0, 1, 15));
        assertDateEqual(
          create('yesterday at 3:00pm'),
          new Date(2019, 11, 31, 15)
        );

        assertDateEqual(
          create('5 days ago at 3:00pm'),
          new Date(2019, 11, 27, 15)
        );
        assertDateEqual(
          create('in 5 days at 3:00pm'),
          new Date(2020, 0, 6, 15)
        );
        assertDateEqual(
          create('5 days from now at 3:00pm'),
          new Date(2020, 0, 6, 15)
        );
      });

      it('should parse explicit dayPeriod', () => {
        assertDateEqual(create('midnight'), new Date(2020, 0, 2));
        assertDateEqual(create('tomorrow at midnight'), new Date(2020, 0, 3));
        assertDateEqual(create('midnight Tuesday'), new Date(2020, 0));
        assertDateEqual(create('midnight on Tuesday'), new Date(2020, 0));
        assertDateEqual(
          create('10am in the morning'),
          new Date(2020, 0, 1, 10)
        );
      });

      it('should shift the hours when an implied dayPeriod is not supplied', () => {
        assertDateEqual(create('10 in the morning'), new Date(2020, 0, 1, 10));
        assertDateEqual(create('10 in the evening'), new Date(2020, 0, 1, 22));
        assertDateEqual(create('10 at night'), new Date(2020, 0, 1, 22));
        assertDateEqual(create('11 at night'), new Date(2020, 0, 1, 23));
        assertDateEqual(create('12 in the morning'), new Date(2020, 0, 1));
        assertDateEqual(create('12 in the evening'), new Date(2020, 0, 1));
        assertDateEqual(create('3 in the afternoon'), new Date(2020, 0, 1, 15));
        assertDateEqual(create('4 in the evening'), new Date(2020, 0, 1, 16));
      });

      it('should not override the implied dayPeriod', () => {
        // This is unavoidable as when dealing with compound dayPeriods the last
        // one must win, otherwise a state machine is required to determine which
        // was set first. This format is ambiguous at best so refusing to override.
        assertDateEqual(
          create('10am in the evening'),
          new Date(2020, 0, 1, 22)
        );
      });

      it('should parse relative week with weekday', () => {
        assertDateEqual(create('this week Tuesday'), new Date(2019, 11, 31));
        assertDateEqual(
          create('this week Tuesday at 5pm'),
          new Date(2019, 11, 31, 17)
        );
        assertDateEqual(create('last week Sunday'), new Date(2019, 11, 22));
        assertDateEqual(create('next week Monday'), new Date(2020, 0, 6));
        assertDateEqual(create('next week Thursday'), new Date(2020, 0, 9));
        assertDateEqual(create('last week Monday'), new Date(2019, 11, 23));
        assertDateEqual(create('last week Thursday'), new Date(2019, 11, 26));
        assertDateEqual(create('this week Monday'), new Date(2019, 11, 30));
        assertDateEqual(create('this week Thursday'), new Date(2020, 0, 2));
      });

      it('should parse relative week short format with weekday', () => {
        assertDateEqual(create('Next Monday'), new Date(2020, 0, 6));
        assertDateEqual(create('next Friday'), new Date(2020, 0, 10));
        assertDateEqual(create('last Monday'), new Date(2019, 11, 23));
        assertDateEqual(create('last Friday'), new Date(2019, 11, 27));
        assertDateEqual(create('this Monday'), new Date(2019, 11, 30));
        assertDateEqual(create('this Friday'), new Date(2020, 0, 3));
        assertDateEqual(
          create('last Monday at 4pm'),
          new Date(2019, 11, 23, 16)
        );
      });

      it('should parse relative week with weekday first', () => {
        assertDateEqual(create('Monday of last week'), new Date(2019, 11, 23));
        assertDateEqual(create('Saturday of next week'), new Date(2020, 0, 11));
        assertDateEqual(create('Monday last week'), new Date(2019, 11, 23));
        assertDateEqual(create('Saturday next week'), new Date(2020, 0, 11));
        assertDateEqual(create('Monday of this week'), new Date(2019, 11, 30));
        assertDateEqual(create('Saturday of this week'), new Date(2020, 0, 4));
        assertDateEqual(create('Monday this week'), new Date(2019, 11, 30));
        assertDateEqual(create('Saturday this week'), new Date(2020, 0, 4));
        assertDateEqual(create('Tue of last week'), new Date(2019, 11, 24));
        assertDateEqual(
          create('Thursday of next week, 3:30pm'),
          new Date(2020, 0, 9, 15, 30)
        );
      });

      it('should parse offset weekday and relative month', () => {
        assertDateEqual(
          create('the 1st Sunday of last month'),
          new Date(2019, 11, 1)
        );
        assertDateEqual(
          create('the 1st Monday of last month'),
          new Date(2019, 11, 2)
        );
        assertDateEqual(
          create('the 1st Tuesday of last month'),
          new Date(2019, 11, 3)
        );
        assertDateEqual(
          create('the 1st Wednesday of last month'),
          new Date(2019, 11, 4)
        );
        assertDateEqual(
          create('the 1st Thursday of last month'),
          new Date(2019, 11, 5)
        );
        assertDateEqual(
          create('the 1st Friday of last month'),
          new Date(2019, 11, 6)
        );
        assertDateEqual(
          create('the 1st Saturday of last month'),
          new Date(2019, 11, 7)
        );

        assertDateEqual(
          create('the 1st Sunday of next month'),
          new Date(2020, 1, 2)
        );
        assertDateEqual(
          create('the 1st Monday of next month'),
          new Date(2020, 1, 3)
        );
        assertDateEqual(
          create('the 1st Tuesday of next month'),
          new Date(2020, 1, 4)
        );
        assertDateEqual(
          create('the 1st Wednesday of next month'),
          new Date(2020, 1, 5)
        );
        assertDateEqual(
          create('the 1st Thursday of next month'),
          new Date(2020, 1, 6)
        );
        assertDateEqual(
          create('the 1st Friday of next month'),
          new Date(2020, 1, 7)
        );
        assertDateEqual(
          create('the 1st Saturday of next month'),
          new Date(2020, 1, 1)
        );

        assertDateEqual(
          create('the 1st Sunday of last month'),
          new Date(2019, 11, 1)
        );
        assertDateEqual(
          create('the 2nd Sunday of last month'),
          new Date(2019, 11, 8)
        );
        assertDateEqual(
          create('the 3rd Sunday of last month'),
          new Date(2019, 11, 15)
        );
        assertDateEqual(
          create('the 4th Sunday of last month'),
          new Date(2019, 11, 22)
        );

        assertDateEqual(
          create('the 1st Sunday of next month'),
          new Date(2020, 1, 2)
        );
        assertDateEqual(
          create('the 2nd Sunday of next month'),
          new Date(2020, 1, 9)
        );
        assertDateEqual(
          create('the 3rd Sunday of next month'),
          new Date(2020, 1, 16)
        );
        assertDateEqual(
          create('the 4th Sunday of next month'),
          new Date(2020, 1, 23)
        );

        assertDateEqual(
          create('the 1st Friday of last month'),
          new Date(2019, 11, 6)
        );
        assertDateEqual(
          create('the 2nd Friday of last month'),
          new Date(2019, 11, 13)
        );
        assertDateEqual(
          create('the 3rd Friday of last month'),
          new Date(2019, 11, 20)
        );
        assertDateEqual(
          create('the 4th Friday of last month'),
          new Date(2019, 11, 27)
        );

        assertDateEqual(
          create('the 1st Friday of next month'),
          new Date(2020, 1, 7)
        );
        assertDateEqual(
          create('the 2nd Friday of next month'),
          new Date(2020, 1, 14)
        );
        assertDateEqual(
          create('the 3rd Friday of next month'),
          new Date(2020, 1, 21)
        );
        assertDateEqual(
          create('the 4th Friday of next month'),
          new Date(2020, 1, 28)
        );
      });

      it('should parse relative day with day offset', () => {
        assertDateEqual(
          create('Two days before yesterday'),
          new Date(2019, 11, 29)
        );
        assertDateEqual(
          create('Two days before today'),
          new Date(2019, 11, 30)
        );
        assertDateEqual(
          create('The day before yesterday'),
          new Date(2019, 11, 30)
        );
        assertDateEqual(
          create('One day before yesterday'),
          new Date(2019, 11, 30)
        );
        assertDateEqual(create('The day after tomorrow'), new Date(2020, 0, 3));
        assertDateEqual(create('One day after tomorrow'), new Date(2020, 0, 3));
        assertDateEqual(create('Two days after today'), new Date(2020, 0, 3));
        assertDateEqual(create('Two days from today'), new Date(2020, 0, 3));
        assertDateEqual(
          create('Two days after tomorrow'),
          new Date(2020, 0, 4)
        );
        assertDateEqual(
          create('tWo dAyS after toMoRRoW'),
          new Date(2020, 0, 4)
        );
        assertDateEqual(create('2 days after tomorrow'), new Date(2020, 0, 4));
        assertDateEqual(create('2 day after tomorrow'), new Date(2020, 0, 4));
        assertDateEqual(
          create('18 days after tomorrow'),
          new Date(2020, 0, 20)
        );
        assertDateEqual(create('18 day after tomorrow'), new Date(2020, 0, 20));
      });

      it('should parse relative unit with weekday', () => {
        assertDateEqual(create('The day after Monday'), new Date(2019, 11, 31));
        assertDateEqual(
          create('The day before Monday'),
          new Date(2019, 11, 29)
        );
        assertDateEqual(create('2 days after monday'), new Date(2020, 0, 1));
        assertDateEqual(create('2 days before monday'), new Date(2019, 11, 28));
        assertDateEqual(create('2 weeks after monday'), new Date(2020, 0, 13));
      });

      it('should parse weekday with day offset', () => {
        assertDateEqual(
          create('Two days before Monday'),
          new Date(2019, 11, 28)
        );
      });

      it('should parse weekday with day offset', () => {
        assertDateEqual(
          create('Two weeks before today'),
          new Date(2019, 11, 18)
        );
      });

      it('should parse edge tokens with shifted months', () => {
        assertDateEqual(
          create('the beginning of last June'),
          new Date(2019, 5)
        );
        assertDateEqual(
          create('the end of last June'),
          new Date(2019, 5, 30, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('the beginning of next February'),
          new Date(2021, 1)
        );
        assertDateEqual(
          create('the end of next February'),
          new Date(2021, 1, 28, 23, 59, 59, 999)
        );
      });

      it('should parse edge tokens with weekdays', () => {
        assertDateEqual(
          create('the beginning of Friday'),
          new Date(2020, 0, 3)
        );
        assertDateEqual(
          create('beginning of day Friday'),
          new Date(2020, 0, 3)
        );
        assertDateEqual(create('beginning of Friday'), new Date(2020, 0, 3));

        assertDateEqual(
          create('the end of Friday'),
          new Date(2020, 0, 3, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('end of day Friday'),
          new Date(2020, 0, 3, 23, 59, 59, 999)
        );
        assertDateEqual(
          create('end of Friday'),
          new Date(2020, 0, 3, 23, 59, 59, 999)
        );
      });

      it('should parse edge tokens with months', () => {
        assertDateEqual(
          create('the end of March'),
          new Date(2020, 2, 31, 23, 59, 59, 999)
        );
        assertDateEqual(create('beginning of March'), new Date(2020, 2));
        assertDateEqual(create('the first day of March'), new Date(2020, 2));
        assertDateEqual(create('the last day of March'), new Date(2020, 2, 31));

        assertDateEqual(
          create('the last day of March 2010'),
          new Date(2010, 2, 31)
        );
        assertDateEqual(
          create('the last day of March, 2012'),
          new Date(2012, 2, 31)
        );
        assertDateEqual(
          create('end of march, 2005'),
          new Date(2005, 2, 31, 23, 59, 59, 999)
        );

        assertDateEqual(create('the first day of May'), new Date(2020, 4));
        assertDateEqual(create('the last day of May'), new Date(2020, 4, 31));

        assertDateEqual(create('first day of May'), new Date(2020, 4));
        assertDateEqual(create('last day of May'), new Date(2020, 4, 31));
      });

      it('should parse edge tokens with relative month', () => {
        assertDateEqual(
          create('the first day of last month'),
          new Date(2019, 11)
        );
        assertDateEqual(
          create('the last day of last month'),
          new Date(2019, 11, 31)
        );

        assertDateEqual(
          create('the first day of next month'),
          new Date(2020, 1)
        );
        assertDateEqual(
          create('the last day of next month'),
          new Date(2020, 1, 29)
        );
      });

      it('should parse edge tokens with years', () => {
        assertDateEqual(create('beginning of 1998'), new Date(1998, 0));
        assertDateEqual(
          create('end of 1998'),
          new Date(1998, 11, 31, 23, 59, 59, 999)
        );
        assertDateEqual(create('the first day of 1998'), new Date(1998, 0));
        assertDateEqual(create('the last day of 1998'), new Date(1998, 11, 31));
      });

      it('should parse odd fractions in relative units', () => {
        assertDateEqual(create('.25 years ago'), new Date(2019, 9));
        assertDateEqual(create('.75 years ago'), new Date(2019, 3));
        assertDateEqual(
          create('.333 years ago'),
          new Date(2019, 8, 3, 2, 41, 16, 800)
        );
      });

      it('should not correctly set the end of a year with leap seconds', () => {
        // ECMAScript does not allow for leap seconds, so ensure
        // that parsed year edge is not overshooting the date.
        assertDateEqual(
          create('end of 1998'),
          new Date(1998, 11, 31, 23, 59, 59, 999)
        );
      });

      it('should not parse irregular input', () => {
        assertNull(create('foo of next week'));
      });

      it('should handle now token', () => {
        setSystemTime(new Date(2020, 5, 15, 23, 59, 59, 999));
        assertDateEqual(create('now'), new Date(2020, 5, 15, 23, 59, 59, 999));
      });

      it('should handle Issue #203', () => {
        assertDateEqual(create('tomorrow at 15:00'), new Date(2020, 0, 2, 15));
        assertDateEqual(create('tomorrow at 3pm'), new Date(2020, 0, 2, 15));
        assertDateEqual(
          create('tomorrow at 3:45pm'),
          new Date(2020, 0, 2, 15, 45)
        );
        assertDateEqual(create('tomorrow 15:00'), new Date(2020, 0, 2, 15));
        assertDateEqual(create('tomorrow 3pm'), new Date(2020, 0, 2, 15));

        assertDateEqual(
          create('the day after tomorrow at 15:00'),
          new Date(2020, 0, 3, 15)
        );
        assertDateEqual(
          create('the day after tomorrow at 3pm'),
          new Date(2020, 0, 3, 15)
        );
        assertDateEqual(
          create('the day after tomorrow 15:00'),
          new Date(2020, 0, 3, 15)
        );
        assertDateEqual(
          create('the day after tomorrow 3pm'),
          new Date(2020, 0, 3, 15)
        );
        assertDateEqual(
          create('the day after tomorrow 3:45pm'),
          new Date(2020, 0, 3, 15, 45)
        );

        assertDateEqual(
          create('the day before yesterday at 11:15'),
          new Date(2019, 11, 30, 11, 15)
        );
        assertDateEqual(
          create('the day before yesterday at 11am'),
          new Date(2019, 11, 30, 11)
        );
        assertDateEqual(
          create('the day before yesterday 11:15'),
          new Date(2019, 11, 30, 11, 15)
        );
        assertDateEqual(
          create('the day before yesterday 11am'),
          new Date(2019, 11, 30, 11)
        );
        assertDateEqual(
          create('the day before yesterday 11:15am'),
          new Date(2019, 11, 30, 11, 15)
        );

        assertDateEqual(
          create('the 28th at 5:30pm'),
          new Date(2020, 0, 28, 17, 30)
        );
        assertDateEqual(
          create('the 28th of March at 5:30pm'),
          new Date(2020, 2, 28, 17, 30)
        );
      });

      it('should handle Issue #310', () => {
        assertDateEqual(
          create('6:30pm in 1 day'),
          new Date(2020, 0, 2, 18, 30)
        );
        assertDateEqual(
          create('6:30pm in 3 days'),
          new Date(2020, 0, 4, 18, 30)
        );
        assertDateEqual(
          create('6:30pm 2 days ago'),
          new Date(2019, 11, 30, 18, 30)
        );
        assertDateEqual(
          create('6:30pm in -3 days'),
          new Date(2019, 11, 29, 18, 30)
        );
      });

      it('should not handle Issue #203 time with no date', () => {
        assertNull(create('next week 3pm'));
        assertNull(create('next week at 3pm'));
        assertNull(create('next week 3:45pm'));
        assertNull(create('next week at 3:45pm'));
      });

      it('should not handle Issue #203 time with no date', () => {
        assertNull(create('21:00 in 2 weeks'));
        assertNull(create('5:00am in a month'));
        assertNull(create('5am in a month'));
        assertNull(create('5:01am in a month'));
        assertNull(create('5:30am in an hour'));
        assertNull(create('5am in a minute'));
      });

      it('should handle Issue #375', () => {
        assertDateEqual(
          create('beginning of yesterday'),
          new Date(2019, 11, 31)
        );
        assertDateEqual(
          create('end of yesterday'),
          new Date(2019, 11, 31, 23, 59, 59, 999)
        );
        assertDateEqual(create('beginning of today'), new Date(2020, 0));
        assertDateEqual(
          create('end of today'),
          new Date(2020, 0, 1, 23, 59, 59, 999)
        );
        assertDateEqual(create('beginning of tomorrow'), new Date(2020, 0, 2));
        assertDateEqual(
          create('end of tomorrow'),
          new Date(2020, 0, 2, 23, 59, 59, 999)
        );
      });

      it('should handle Issue #431', () => {
        assertDateEqual(
          create('ten minutes ago'),
          new Date(2019, 11, 31, 23, 50)
        );
        assertDateEqual(
          create('ten minutes from now'),
          new Date(2020, 0, 1, 0, 10)
        );
      });

      it('should handle Issue #509', () => {
        assertDateEqual(create('yesterday at 3p'), new Date(2019, 11, 31, 15));
        assertDateEqual(create('yesterday at 3a'), new Date(2019, 11, 31, 3));
        assertDateEqual(
          create('yesterday at 3:00p'),
          new Date(2019, 11, 31, 15)
        );
        assertDateEqual(
          create('yesterday at 3:00a'),
          new Date(2019, 11, 31, 3)
        );
      });

      it('should handle Issue #453', () => {
        assertDateEqual(create('noon'), new Date(2020, 0, 1, 12));
        assertDateEqual(create('tomorrow at noon'), new Date(2020, 0, 2, 12));
      });

      it('should handle Issue #455', () => {
        assertDateEqual(create('3a.m.'), new Date(2020, 0, 1, 3));
        assertDateEqual(create('3p.m.'), new Date(2020, 0, 1, 15));
        assertDateEqual(create('3 a.m.'), new Date(2020, 0, 1, 3));
        assertDateEqual(create('3 p.m.'), new Date(2020, 0, 1, 15));
      });

      it('should handle Issue #455', () => {
        assertDateEqual(create('a week from Tuesday'), new Date(2020, 0, 7));

        assertDateEqual(create('first of the month'), new Date(2020, 0));
        assertDateEqual(create('the first of the month'), new Date(2020, 0));

        assertDateEqual(
          create('the first Friday of February, 2012'),
          new Date(2012, 1, 3)
        );
        assertDateEqual(
          create('the second Friday of February, 2012'),
          new Date(2012, 1, 10)
        );
        assertDateEqual(
          create('the third Friday of February, 2012'),
          new Date(2012, 1, 17)
        );
        assertDateEqual(
          create('the fourth Friday of February, 2012'),
          new Date(2012, 1, 24)
        );
        assertDateEqual(
          create('the fifth Friday of February, 2012'),
          new Date(2012, 2, 2)
        );
        assertDateEqual(
          create('the sixth Friday of February, 2012'),
          new Date(2012, 2, 9)
        );

        assertDateEqual(
          create('the 3rd Tuesday in November, 2012'),
          new Date(2012, 10, 20)
        );

        assertDateEqual(
          create('the second Sunday in June, 2016'),
          new Date(2016, 5, 12)
        );
        assertDateEqual(
          create('the second Monday in June, 2016'),
          new Date(2016, 5, 13)
        );
        assertDateEqual(
          create('the second Tuesday in June, 2016'),
          new Date(2016, 5, 14)
        );
        assertDateEqual(
          create('the second Wednesday in June, 2016'),
          new Date(2016, 5, 8)
        );
        assertDateEqual(
          create('the second Thursday in June, 2016'),
          new Date(2016, 5, 9)
        );
        assertDateEqual(
          create('the second Friday in June, 2016'),
          new Date(2016, 5, 10)
        );
        assertDateEqual(
          create('the second Saturday in June, 2016'),
          new Date(2016, 5, 11)
        );

        assertDateEqual(
          create('the last Sunday in November, 2012'),
          new Date(2012, 10, 25)
        );
        assertDateEqual(
          create('the last Monday in November, 2012'),
          new Date(2012, 10, 26)
        );
        assertDateEqual(
          create('the last Tuesday in November, 2012'),
          new Date(2012, 10, 27)
        );
        assertDateEqual(
          create('the last Wednesday in November, 2012'),
          new Date(2012, 10, 28)
        );
        assertDateEqual(
          create('the last Thursday in November, 2012'),
          new Date(2012, 10, 29)
        );
        assertDateEqual(
          create('the last Friday in November, 2012'),
          new Date(2012, 10, 30)
        );
        assertDateEqual(
          create('the last Saturday in November, 2012'),
          new Date(2012, 10, 24)
        );

        assertDateEqual(create('next weekend'), new Date(2020, 0, 11));
        assertDateEqual(
          create('the second weekend of August, 2011'),
          new Date(2011, 7, 13)
        );
        assertDateEqual(
          create('the last weekend of January, 1985'),
          new Date(1985, 0, 26)
        );

        // Not parsing this as a non-grammatical format
        assertNull(create('week from Tuesday'));
      });

      it('should handle half in Issue #455', () => {
        assertDateEqual(
          create('half hour ago'),
          new Date(2019, 11, 31, 23, 30)
        );
        assertDateEqual(
          create('half an hour ago'),
          new Date(2019, 11, 31, 23, 30)
        );
        assertDateEqual(
          create('a half hour ago'),
          new Date(2019, 11, 31, 23, 30)
        );

        assertDateEqual(
          create('half hour from now'),
          new Date(2020, 0, 1, 0, 30)
        );
        assertDateEqual(
          create('half an hour from now'),
          new Date(2020, 0, 1, 0, 30)
        );
        assertDateEqual(
          create('a half hour from now'),
          new Date(2020, 0, 1, 0, 30)
        );

        assertDateEqual(create('in half an hour'), new Date(2020, 0, 1, 0, 30));
        assertDateEqual(create('in a half hour'), new Date(2020, 0, 1, 0, 30));

        assertDateEqual(create('half a day ago'), new Date(2019, 11, 31, 12));

        assertDateEqual(create('half a week ago'), new Date(2019, 11, 28, 12));
        assertDateEqual(
          create('half a week from now'),
          new Date(2020, 0, 4, 12)
        );

        assertDateEqual(create('half a month ago'), new Date(2019, 11, 18));

        assertDateEqual(create('half year ago'), new Date(2019, 6));
        assertDateEqual(create('half a year ago'), new Date(2019, 6));
      });

      it('should correctly explain half parsing in Issue #455', () => {
        const { absProps, relProps } = create('half a week ago', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(absProps, {});
        assertObjectEqual(relProps, {
          week: -0,
          day: -3,
          hour: -12,
        });
      });

      it('should handle Issue #342', () => {
        setSystemTime(new Date(2020, 2, 15));
        assertDateEqual(create('2 weeks ago'), new Date(2020, 2, 1));
      });

    });

    describe('Preferences', () => {

      function createPast(input) {
        return create(input, {
          past: true,
        });
      }

      function createFuture(input) {
        return create(input, {
          future: true,
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
        setSystemTime(new Date(2020, 5));
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
        setSystemTime(new Date(2020, 5));
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
        setSystemTime(new Date(2020, 0, 15));
        assertDateEqual(createPast('the 15th'), new Date(2019, 11, 15));
        setSystemTime(new Date(2020, 0, 16));
        assertDateEqual(createPast('the 15th'), new Date(2020, 0, 15));
      });

      it('should parse ambiguous date with future preference', () => {
        assertDateEqual(createFuture('the 15th'), new Date(2020, 0, 15));
        setSystemTime(new Date(2020, 0, 15));
        assertDateEqual(createFuture('the 15th'), new Date(2020, 1, 15));
        setSystemTime(new Date(2020, 0, 16));
        assertDateEqual(createFuture('the 15th'), new Date(2020, 1, 15));
      });

      it('should parse ambiguous month and date with past preference', () => {
        setSystemTime(new Date(2020, 5));
        assertDateEqual(createPast('March 15th'), new Date(2020, 2, 15));
        assertDateEqual(createPast('July 15th'), new Date(2019, 6, 15));
      });

      it('should parse ambiguous month and date with future preference', () => {
        setSystemTime(new Date(2020, 5));
        assertDateEqual(createFuture('March 15th'), new Date(2021, 2, 15));
        assertDateEqual(createFuture('July 15th'), new Date(2020, 6, 15));
      });

      it('should parse ambiguous time with past preference', () => {
        setSystemTime(new Date(2020, 0, 1, 12));
        assertDateEqual(createPast('11am'), new Date(2020, 0, 1, 11));
        assertDateEqual(createPast('12pm'), new Date(2019, 11, 31, 12));
        assertDateEqual(createPast('1pm'), new Date(2019, 11, 31, 13));
      });

      it('should parse ambiguous time with future preference', () => {
        setSystemTime(new Date(2020, 0, 1, 12));
        assertDateEqual(createFuture('11am'), new Date(2020, 0, 2, 11));
        assertDateEqual(createFuture('12pm'), new Date(2020, 0, 2, 12));
        assertDateEqual(createFuture('1pm'), new Date(2020, 0, 1, 13));
      });

      it('should parse ambiguous year with offset weekday', () => {
        setSystemTime(new Date(2020, 5, 2));
        assertDateEqual(
          createPast('the 2nd Friday of February'),
          new Date(2020, 1, 14)
        );
        assertDateEqual(
          createPast('the 2nd Friday of October'),
          new Date(2019, 9, 11)
        );
        assertDateEqual(
          createFuture('the 2nd Friday of February'),
          new Date(2021, 1, 12)
        );
        assertDateEqual(
          createFuture('the 2nd Friday of October'),
          new Date(2020, 9, 9)
        );
      });

      it('should not apply preferences to date and relative month', () => {
        assertDateEqual(
          createPast('the 15th of next month'),
          new Date(2020, 1, 15)
        );
      });

      it('should not apply preference to weekday with relative week', () => {
        assertDateEqual(createPast('this week Sunday'), new Date(2019, 11, 29));
        assertDateEqual(createPast('next week Sunday'), new Date(2020, 0, 5));
        assertDateEqual(
          createPast('this week Wednesday'),
          new Date(2020, 0, 1)
        );
        assertDateEqual(
          createPast('next week Wednesday'),
          new Date(2020, 0, 8)
        );
        assertDateEqual(createPast('this week Friday'), new Date(2020, 0, 3));
        assertDateEqual(createPast('next week Friday'), new Date(2020, 0, 10));
      });

      it('should not apply preference to month with relative year', () => {
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
        assertDateEqual(createPast('1998-12-25'), new Date(1998, 11, 25));
      });

      it('should handle Issue #572', () => {
        assertDateEqual(
          createFuture('this week tuesday at 5pm'),
          new Date(2019, 11, 31, 17)
        );
        assertDateEqual(createFuture('today at 5pm'), new Date(2020, 0, 1, 17));
      });

      it('should handle Issue #210', () => {
        assertDateEqual(
          createFuture('Sunday at 3:00'),
          new Date(2020, 0, 5, 3)
        );
      });

      it('should handle Issue #383', () => {
        assertDateEqual(createPast('12/20/30'), new Date(1930, 11, 20));
        assertDateEqual(createFuture('12/20/98'), new Date(2098, 11, 20));
      });
    });

    describe('Time zones', () => {

      it('should be able to parse as another time zone', () => {
        mockTimeZone(-540); // GMT+09:00
        assertDateEqual(
          create('2020-01-01', {
            timeZone: 'America/New_York',
          }),
          new Date(2020, 0, 1, 14)
        );
      });

      it('should be able to parse a basic date as UTC', () => {
        mockTimeZone(300); // GMT-05:00
        assertDateEqual(
          create('2020-01-01', {
            timeZone: 'America/New_York',
          }),
          new Date(2020, 0)
        );
      });

      it('should ignore timeZone when ISO-8601 zulu offset is set', () => {
        mockTimeZone(300); // GMT-05:00
        assertDateEqual(
          create('2020-01-01Z', {
            timeZone: 'America/New_York',
          }),
          new Date(2019, 11, 31, 19)
        );
      });

      it('should set a UTC timezone from a relative time', () => {
        mockTimeZone(300); // GMT-05:00
        assertDateEqual(
          create('tomorrow', {
            timeZone: 'UTC',
          }),
          new Date(2020, 0, 1, 19)
        );
      });

      it('should handle Issue #582', () => {
        mockTimeZone(300); // GMT-05:00
        setSystemTime(new Date(2020, 5, 15, 23, 59, 59, 999));
        assertDateEqual(
          create('now', {
            timeZone: 'UTC',
          }),
          new Date(2020, 5, 15, 18, 59, 59, 999)
        );
      });

      it('should handle Issue #342', () => {
        mockTimeZone(300); // GMT-05:00
        assertDateEqual(
          create('4pm', {
            timeZone: 'Pacific/Honolulu',
          }),
          new Date(2020, 0, 1, 21),
        );
        assertDateEqual(
          create('4pm', {
            past: true,
            timeZone: 'Pacific/Honolulu',
          }),
          new Date(2019, 11, 31, 21),
        );
        assertDateEqual(
          create('4pm', {
            future: true,
            timeZone: 'Pacific/Honolulu',
          }),
          new Date(2020, 0, 1, 21),
        );
        mockTimeZone(-540); // GMT+09:00
        assertDateEqual(
          create('4pm', {
            timeZone: 'Pacific/Honolulu',
          }),
          new Date(2020, 0, 2, 11),
        );
        assertDateEqual(
          create('4pm', {
            past: true,
            timeZone: 'Pacific/Honolulu',
          }),
          new Date(2019, 11, 31, 11),
        );
        assertDateEqual(
          create('4pm', {
            future: true,
            timeZone: 'Pacific/Honolulu',
          }),
          new Date(2020, 0, 2, 11),
        );
      });

    });

    describe('Custom DateTime Formats', () => {

      it('should be able to add basic parts', () => {
        assertDateEqual(
          create('2020x05x23', {
            cache: false,
            dateTimeFormats: ['<year>x<month>x<day>'],
          }),
          new Date(2020, 4, 23)
        );
      });

      it('should be able to add optional parts', () => {
        assertDateEqual(
          create('2020x05x23', {
            cache: false,
            dateTimeFormats: ['<year>x<month>x?<day?>'],
          }),
          new Date(2020, 4, 23)
        );
        assertDateEqual(
          create('2020x05', {
            cache: false,
            dateTimeFormats: ['<year>x<month>x?<day?>'],
          }),
          new Date(2020, 4)
        );
      });

      it('should be able to add long components with a capital', () => {
        assertDateEqual(
          create('2020xAugxTuex25', {
            cache: false,
            dateTimeFormats: ['<year>x<Month>x<Weekday>x<day>'],
          }),
          new Date(2020, 7, 25)
        );
      });

      it('should be able to add time part', () => {
        assertDateEqual(
          create('2020x05x12:25', {
            cache: false,
            dateTimeFormats: ['<year>x<month>x<time>'],
          }),
          new Date(2020, 4, 1, 12, 25)
        );
      });

      it('should throw an error when unknown part is passed', () => {
        assertError(() => {
          create('foo', {
            cache: false,
            dateTimeFormats: ['<date>'],
          });
        });
      });

      it('should be able to add a fractionalSecond part', () => {
        assertDateEqual(
          create('foo:12.400', {
            cache: false,
            dateTimeFormats: ['foo:<fractionalSecond>'],
          }),
          new Date(2020, 0, 1, 0, 0, 12, 400)
        );
      });

      it('should be able to add a timeZoneName part', () => {
        mockTimeZone(300); // GMT-05:00
        assertDateEqual(
          create('foo:GMT+9', {
            cache: false,
            dateTimeFormats: ['foo:<timeZoneName>'],
          }),
          new Date(2019, 11, 31, 10)
        );
      });

      it('should be able to add an era part', () => {
        assertDateEqual(
          create('5000xBC', {
            cache: false,
            dateTimeFormats: ['<year>x<era>'],
          }),
          new Date(-5000, 0)
        );
      });

      it('should allow special characters with long month and year', () => {
        assertDateEqual(
          create('!March!2015!', {
            cache: false,
            dateTimeFormats: ['!<Month>!<year>!'],
          }),
          new Date(2015, 2)
        );
      });

      it('should allow hour, minute, and second parts', () => {
        assertDateEqual(
          create('12x12x12', {
            cache: false,
            dateTimeFormats: ['<second>x<minute>x<hour>'],
          }),
          new Date(2020, 0, 1, 12, 12, 12)
        );
      });

      it('should support non-BMP characters', () => {
        assertDateEqual(
          create('2010🙂05🙂23', {
            cache: false,
            dateTimeFormats: ['<year>🙂<month>🙂<day>'],
          }),
          new Date(2010, 4, 23)
        );
      });

      it('should not handle Issue #119', () => {
        // This format is incompatible as without distinguishable
        // tokens it collides with a full 4 digit year.
        assertDateEqual(
          create('0615', {
            cache: false,
            dateTimeFormats: ['<hour><minute>'],
          }),
          new Date(615, 0),
        );
      });

    });

    describe('Custom Relative Formats', () => {

      it('should be able to add a numeric relative format', () => {
        assertDateEqual(
          create('5 days into the future!', {
            cache: false,
            relativeFormats: [
              {
                format: (value, unit) => {
                  if (value > 0) {
                    const s = value !== 1 ? 's' : '';
                    return `${value} ${unit}${s} into the future!`;
                  }
                },
              },
            ],
          }),
          new Date(2020, 0, 6)
        );
      });

      it('should be able to add a non-numeric relative format', () => {
        assertDateEqual(
          create('the day before yesterday', {
            cache: false,
            relativeFormats: [
              {
                format: (value, unit) => {
                  if (unit === 'day' && value === -2) {
                    return 'the day before yesterday';
                  }
                },
              },
            ],
          }),
          new Date(2019, 11, 30)
        );
      });
    });

    describe('Explaining', () => {

      it('should return a parsing result when explain flag is set', () => {
        const { format, parser, ...rest } = create('January 1, 2020', {
          cache: false,
          explain: true,
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
          const { specificity } = create(input, {
            cache: false,
            explain: true,
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
        const { absProps } = create('2020-01-01T00:00+05:00', {
          cache: false,
          explain: true,
        });
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
        assertNull(
          create('bad date', {
            cache: false,
            explain: true,
          })
        );
      });

      it('should correctly explain props when using an offset with relative day', () => {
        const { absProps, relProps } = create('two days before yesterday', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(absProps, {});
        assertObjectEqual(relProps, { day: -3 });
      });

      it('should correctly explain props when using parsing an offset weekday', () => {
        const { absProps, relProps } = create('two days before Monday', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(absProps, { day: 1 });
        assertObjectEqual(relProps, { day: -2 });
      });

      it('should correctly explain props when parsing an ending edge', () => {
        const { absProps, relProps } = create('the start of the week', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(absProps, {
          day: 0,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });
        assertObjectEqual(relProps, {
          week: 0,
        });
      });

      it('should correctly explain props when parsing an ending edge', () => {
        const { absProps, relProps } = create('the end of next week', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(absProps, {
          day: 6,
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
        });
        assertObjectEqual(relProps, {
          week: 1,
        });
      });

      it('should correctly explain props when parsing an edge with last day', () => {
        const { absProps, relProps } = create('the last day of next month', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(absProps, {
          date: 29,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });
        assertObjectEqual(relProps, {
          month: 1,
        });
      });

      it('should correctly explain negative years when parsing an era', () => {
        const { absProps, relProps } = create('January 1st, 2000 bc', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(absProps, {
          year: -2000,
          month: 0,
          date: 1,
        });
        assertObjectEqual(relProps, {});
      });

      it('should correctly explain hours in explicit dayPeriod', () => {
        const { absProps, relProps } = create('Monday at noon', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(absProps, {
          day: 1,
          hour: 12,
        });
        assertObjectEqual(relProps, {});
      });

      it('should provide insight to parsing precision', () => {
        let result;

        result = create('tomorrow at 8:00pm', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(result.specificity, {
          unit: 'minute',
          index: 5,
        });

        result = create('tomorrow at noon', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(result.specificity, {
          unit: 'hour',
          index: 4,
        });

        result = create('the end of february', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(result.specificity, {
          unit: 'millisecond',
          index: 7,
        });
      });

      it('should handle Issue #545', () => {
        const { absProps } = create('January 13th, 2016', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(absProps, {
          year: 2016,
          month: 0,
          date: 13,
        });
      });

      it('should handle Issue #569', () => {
        const { absProps, relProps, specificity } = create('yesterday at 2:30pm', {
          cache: false,
          explain: true,
        });
        assertObjectEqual(absProps, {
          hour: 14,
          minute: 30,
        });
        assertObjectEqual(relProps, {
          day: -1,
        });
        assertObjectEqual(specificity, {
          unit: 'minute',
          index: 5,
        });
      });

    });

    describe('From Object', () => {

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
        assertDateEqual(
          create({ minutes: 20.5 }),
          new Date(2020, 0, 1, 0, 20, 30)
        );
        assertDateEqual(
          create({ seconds: 20.5 }),
          new Date(2020, 0, 1, 0, 0, 20, 500)
        );
      });

      it('should round fractions in milliseconds', () => {
        assertDateEqual(
          create({ milliseconds: 300.5 }),
          new Date(2020, 0, 1, 0, 0, 0, 301)
        );
      });

      it('should error on fractions in higher units', () => {
        assertError(() => {
          create({ month: 5.5 });
        });
        assertError(() => {
          create({ year: 5.5 });
        });
      });

      it('should be able to pass a reference date', () => {
        assertDateEqual(
          create({
            month: 6,
          }, {
            from: new Date(2025, 0),
          }),
          new Date(2025, 6),
        );
      });

      it('should be able to pass a timeZone to modify an object', () => {
        mockTimeZone(240); // GMT-04:00
        assertDateEqual(
          create({
            month: 6,
          }, {
            timeZone: 'America/New_York',
          }),
          new Date(2020, 6, 1),
        );
      });

      it('should be able to pass the timezone', () => {
        mockTimeZone(300); // GMT-05:00
        assertDateEqual(
          create({
            year: 2020,
            month: 0,
            date: 1,
          }, {
            timeZone: 'UTC',
          }),
          new Date(2019, 11, 31, 19)
        );
      });

    });

    describe('Other', () => {

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

      it('should be able to pass a reference date', () => {
        assertDateEqual(
          create('next week Friday', {
            from: new Date(2025, 0),
          }),
          new Date(2025, 0, 10),
        );
      });

      it('should trim whitespace', () => {
        assertDateEqual(create('   1987-07-04    '), new Date(1987, 6, 4));
      });

      it('should be case insensitive', () => {
        assertDateEqual(create('juNe 1St 2008'), new Date(2008, 5));
      });

      it('should be able to create a date in a time zone with no other props', () => {
        mockTimeZone(300); // GMT-05:00
        assertDateEqual(
          create(null, {
            timeZone: 'UTC',
          }),
          new Date(2019, 11, 31, 19)
        );
      });

      it('should handle irregular input', () => {
        assertDateEqual(create({}), new Date());

        assertError(() => {
          create();
        }, TypeError);
        assertError(() => {
          create(null);
        }, TypeError);
        assertError(() => {
          create(undefined);
        }, TypeError);
        assertNull(create('blah'));
        assertError(() => {
          create('today', '1234');
        }, RangeError);
      });

      it('should cache formats', () => {
        let counts = {};
        const nativeMatch = String.prototype.match;

        // Spy on the .match function to determine how many
        // times a particular string has been match against.
        String.prototype.match = function () {
          if (counts[this] == null) {
            counts[this] = 0;
          }
          counts[this] += 1;
          return nativeMatch.apply(this, arguments);
        };

        function assertCached(input) {
          input = input.toLowerCase();
          create(input);
          counts = {};
          create(input);
          assertEqual(counts[input], 1);
        }

        assertCached('January 1, 2020');
        assertCached('Next week');

        String.prototype.match = nativeMatch;
      });

      it('should handle Issue #224', () => {
        assertNull(create(''));
      });

      it('should handle Issue #387', () => {
        assertError(() => {
          create(null);
        });
      });
    });
  });

  describeInstance('isValid', (isValid) => {

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

  describeInstance('isYesterday', (isYesterday) => {

    it('should be false for the day before yesterday', () => {
      assertFalse(isYesterday(new Date(2019, 11, 30)));
      assertFalse(isYesterday(new Date(2019, 11, 30, 1)));
      assertFalse(isYesterday(new Date(2019, 11, 30, 23, 59, 59, 999)));
    });

    it('should be true for yesterday', () => {
      assertTrue(isYesterday(new Date(2019, 11, 31, 0)));
      assertTrue(isYesterday(new Date(2019, 11, 31, 1)));
      assertTrue(isYesterday(new Date(2019, 11, 31, 12)));
      assertTrue(isYesterday(new Date(2019, 11, 31, 22)));
      assertTrue(isYesterday(new Date(2019, 11, 31, 23, 59, 59, 999)));
    });

    it('should be false for today', () => {
      assertFalse(isYesterday(new Date(2020, 0, 1)));
      assertFalse(isYesterday(new Date(2020, 0, 1, 1)));
      assertFalse(isYesterday(new Date(2020, 0, 1, 23, 59, 59, 999)));
    });

    it('should handle irregular input', () => {
      assertFalse(isYesterday(new Date('invalid')));
      assertError(() => {
        isYesterday();
      });
      assertError(() => {
        isYesterday(null);
      });
      assertError(() => {
        isYesterday(0);
      });
    });
  });

  describeInstance('isToday', (isToday) => {

    it('should be false for yesterday', () => {
      assertFalse(isToday(new Date(2019, 11, 31)));
      assertFalse(isToday(new Date(2019, 11, 31, 1)));
      assertFalse(isToday(new Date(2019, 11, 31, 23, 59, 59, 999)));
    });

    it('should be true for today', () => {
      assertTrue(isToday(new Date(2020, 0, 1, 0)));
      assertTrue(isToday(new Date(2020, 0, 1, 1)));
      assertTrue(isToday(new Date(2020, 0, 1, 12)));
      assertTrue(isToday(new Date(2020, 0, 1, 22)));
      assertTrue(isToday(new Date(2020, 0, 1, 23, 59, 59, 999)));
    });

    it('should be false for tomorrow', () => {
      assertFalse(isToday(new Date(2020, 0, 2)));
      assertFalse(isToday(new Date(2020, 0, 2, 1)));
      assertFalse(isToday(new Date(2020, 0, 2, 23, 59, 59, 999)));
    });

    it('should handle irregular input', () => {
      assertFalse(isToday(new Date('invalid')));
      assertError(() => {
        isToday();
      });
      assertError(() => {
        isToday(null);
      });
      assertError(() => {
        isToday(0);
      });
    });
  });

  describeInstance('isTomorrow', (isTomorrow) => {

    it('should be false for today', () => {
      assertFalse(isTomorrow(new Date(2020, 0, 1)));
      assertFalse(isTomorrow(new Date(2020, 0, 1, 1)));
      assertFalse(isTomorrow(new Date(2020, 0, 1, 23, 59, 59, 999)));
    });

    it('should be true for tomorrow', () => {
      assertTrue(isTomorrow(new Date(2020, 0, 2, 0)));
      assertTrue(isTomorrow(new Date(2020, 0, 2, 1)));
      assertTrue(isTomorrow(new Date(2020, 0, 2, 12)));
      assertTrue(isTomorrow(new Date(2020, 0, 2, 22)));
      assertTrue(isTomorrow(new Date(2020, 0, 2, 23, 59, 59, 999)));
    });

    it('should be false for the day after tomorrow', () => {
      assertFalse(isTomorrow(new Date(2020, 0, 3)));
      assertFalse(isTomorrow(new Date(2020, 0, 3, 1)));
      assertFalse(isTomorrow(new Date(2020, 0, 3, 23, 59, 59, 999)));
    });

    it('should handle irregular input', () => {
      assertFalse(isTomorrow(new Date('invalid')));
      assertError(() => {
        isTomorrow();
      });
      assertError(() => {
        isTomorrow(null);
      });
      assertError(() => {
        isTomorrow(0);
      });
    });
  });

  describeInstance('isLastWeek', (isLastWeek) => {

    it('should be false for the week before last', () => {
      assertFalse(isLastWeek(new Date(2019, 11, 15)));
      assertFalse(isLastWeek(new Date(2019, 11, 18)));
      assertFalse(isLastWeek(new Date(2019, 11, 21, 23, 59, 59, 999)));
    });

    it('should be true for last week', () => {
      assertTrue(isLastWeek(new Date(2019, 11, 22)));
      assertTrue(isLastWeek(new Date(2019, 11, 25)));
      assertTrue(isLastWeek(new Date(2019, 11, 28, 23, 59, 59, 999)));
    });

    it('should be false for this week', () => {
      assertFalse(isLastWeek(new Date(2019, 11, 29)));
      assertFalse(isLastWeek(new Date(2020, 0, 1)));
      assertFalse(isLastWeek(new Date(2020, 0, 4, 23, 59, 59, 999)));
    });

    it('should be correct when first day is Monday', () => {
      assertFalse(isLastWeek(new Date(2019, 11, 22), 1));
      assertTrue(isLastWeek(new Date(2019, 11, 23), 1));
      assertTrue(isLastWeek(new Date(2019, 11, 29), 1));
      assertFalse(isLastWeek(new Date(2019, 11, 30), 1));
    });

    it('should be correct when first day is Saturday', () => {
      assertFalse(isLastWeek(new Date(2019, 11, 20), 6));
      assertTrue(isLastWeek(new Date(2019, 11, 21), 6));
      assertTrue(isLastWeek(new Date(2019, 11, 27), 6));
      assertFalse(isLastWeek(new Date(2019, 11, 28), 6));
    });

    it('should be correct for unlikely use cases', () => {
      assertTrue(isLastWeek(new Date(2019, 11, 22), 0));
      assertFalse(isLastWeek(new Date(2019, 11, 22), 1));
      assertFalse(isLastWeek(new Date(2019, 11, 22), 2));
      assertFalse(isLastWeek(new Date(2019, 11, 22), 3));
      assertTrue(isLastWeek(new Date(2019, 11, 22), 4));
      assertTrue(isLastWeek(new Date(2019, 11, 22), 5));
      assertTrue(isLastWeek(new Date(2019, 11, 22), 6));
      assertTrue(isLastWeek(new Date(2019, 11, 22), 7));
      assertFalse(isLastWeek(new Date(2019, 11, 22), 8));
    });

    it('should handle irregular input', () => {
      assertFalse(isLastWeek(new Date('invalid')));
      assertError(() => {
        isLastWeek();
      });
      assertError(() => {
        isLastWeek(null);
      });
      assertError(() => {
        isLastWeek(0);
      });
    });
  });

  describeInstance('isThisWeek', (isThisWeek) => {

    it('should be false for last week', () => {
      assertFalse(isThisWeek(new Date(2019, 11, 22)));
      assertFalse(isThisWeek(new Date(2019, 11, 25)));
      assertFalse(isThisWeek(new Date(2019, 11, 28, 23, 59, 59, 999)));
    });

    it('should be true for this week', () => {
      assertTrue(isThisWeek(new Date(2019, 11, 29)));
      assertTrue(isThisWeek(new Date(2020, 0, 1)));
      assertTrue(isThisWeek(new Date(2020, 0, 4, 23, 59, 59, 999)));
    });

    it('should be false for next week', () => {
      assertFalse(isThisWeek(new Date(2020, 0, 5)));
      assertFalse(isThisWeek(new Date(2020, 0, 8)));
      assertFalse(isThisWeek(new Date(2020, 0, 11, 23, 59, 59, 999)));
    });

    it('should be correct when first day is Monday', () => {
      assertFalse(isThisWeek(new Date(2019, 11, 29), 1));
      assertTrue(isThisWeek(new Date(2019, 11, 30), 1));
      assertTrue(isThisWeek(new Date(2020, 0, 5), 1));
      assertFalse(isThisWeek(new Date(2020, 0, 6), 1));
    });

    it('should be correct when first day is Saturday', () => {
      assertFalse(isThisWeek(new Date(2019, 11, 27), 6));
      assertTrue(isThisWeek(new Date(2019, 11, 28), 6));
      assertTrue(isThisWeek(new Date(2020, 0, 3), 6));
      assertFalse(isThisWeek(new Date(2020, 0, 4), 6));
    });

    it('should be correct for unlikely use cases', () => {
      assertTrue(isThisWeek(new Date(2019, 11, 29), 0));
      assertFalse(isThisWeek(new Date(2019, 11, 29), 1));
      assertFalse(isThisWeek(new Date(2019, 11, 29), 2));
      assertFalse(isThisWeek(new Date(2019, 11, 29), 3));
      assertTrue(isThisWeek(new Date(2019, 11, 29), 4));
      assertTrue(isThisWeek(new Date(2019, 11, 29), 5));
      assertTrue(isThisWeek(new Date(2019, 11, 29), 6));
      assertTrue(isThisWeek(new Date(2019, 11, 29), 7));
      assertFalse(isThisWeek(new Date(2019, 11, 29), 8));
    });

    it('should handle irregular input', () => {
      assertFalse(isThisWeek(new Date('invalid')));
      assertError(() => {
        isThisWeek();
      });
      assertError(() => {
        isThisWeek(null);
      });
      assertError(() => {
        isThisWeek(0);
      });
    });
  });

  describeInstance('isNextWeek', (isNextWeek) => {

    it('should be false for this week', () => {
      assertFalse(isNextWeek(new Date(2019, 11, 29)));
      assertFalse(isNextWeek(new Date(2020, 0, 1)));
      assertFalse(isNextWeek(new Date(2020, 0, 4, 23, 59, 59, 999)));
    });

    it('should be true for next week', () => {
      assertTrue(isNextWeek(new Date(2020, 0, 5)));
      assertTrue(isNextWeek(new Date(2020, 0, 8)));
      assertTrue(isNextWeek(new Date(2020, 0, 11, 23, 59, 59, 999)));
    });

    it('should be false for the week after next', () => {
      assertFalse(isNextWeek(new Date(2020, 0, 12)));
      assertFalse(isNextWeek(new Date(2020, 0, 15)));
      assertFalse(isNextWeek(new Date(2020, 0, 18, 23, 59, 59, 999)));
    });

    it('should be correct when first day is Monday', () => {
      assertFalse(isNextWeek(new Date(2020, 0, 5), 1));
      assertTrue(isNextWeek(new Date(2020, 0, 6), 1));
      assertTrue(isNextWeek(new Date(2020, 0, 12), 1));
      assertFalse(isNextWeek(new Date(2020, 0, 13), 1));
    });

    it('should be correct when first day is Saturday', () => {
      assertFalse(isNextWeek(new Date(2020, 0, 3), 6));
      assertTrue(isNextWeek(new Date(2020, 0, 4), 6));
      assertTrue(isNextWeek(new Date(2020, 0, 10), 6));
      assertFalse(isNextWeek(new Date(2020, 0, 11), 6));
    });

    it('should be correct for unlikely use cases', () => {
      assertTrue(isNextWeek(new Date(2020, 0, 5), 0));
      assertFalse(isNextWeek(new Date(2020, 0, 5), 1));
      assertFalse(isNextWeek(new Date(2020, 0, 5), 2));
      assertFalse(isNextWeek(new Date(2020, 0, 5), 3));
      assertTrue(isNextWeek(new Date(2020, 0, 5), 4));
      assertTrue(isNextWeek(new Date(2020, 0, 5), 5));
      assertTrue(isNextWeek(new Date(2020, 0, 5), 6));
      assertTrue(isNextWeek(new Date(2020, 0, 5), 7));
      assertFalse(isNextWeek(new Date(2020, 0, 5), 8));
    });

    it('should handle irregular input', () => {
      assertFalse(isNextWeek(new Date('invalid')));
      assertError(() => {
        isNextWeek();
      });
      assertError(() => {
        isNextWeek(null);
      });
      assertError(() => {
        isNextWeek(0);
      });
    });
  });

  describeInstance('isLastMonth', (isLastMonth) => {

    it('should be false for the month before last', () => {
      assertFalse(isLastMonth(new Date(2019, 10)));
      assertFalse(isLastMonth(new Date(2019, 10, 15)));
      assertFalse(isLastMonth(new Date(2019, 10, 30, 23, 59, 59, 999)));
    });

    it('should be true for last month', () => {
      assertTrue(isLastMonth(new Date(2019, 11)));
      assertTrue(isLastMonth(new Date(2019, 11, 15)));
      assertTrue(isLastMonth(new Date(2019, 11, 31, 23, 59, 59, 999)));
    });

    it('should be false for this month', () => {
      assertFalse(isLastMonth(new Date(2020, 0)));
      assertFalse(isLastMonth(new Date(2020, 0, 15)));
      assertFalse(isLastMonth(new Date(2020, 0, 31, 23, 59, 59, 999)));
    });

    it('should report correctly when current time is in February', () => {
      setSystemTime(new Date(2020, 1, 15));
      assertFalse(isLastMonth(new Date(2019, 11, 31, 23, 59, 59, 999)));
      assertTrue(isLastMonth(new Date(2020, 0)));
      assertTrue(isLastMonth(new Date(2020, 0, 31, 23, 59, 59, 999)));
      assertFalse(isLastMonth(new Date(2020, 1)));
    });

    it('should report correctly when the last month is in February', () => {
      setSystemTime(new Date(2020, 2, 15));
      assertFalse(isLastMonth(new Date(2020, 0, 31, 23, 59, 59, 999)));
      assertTrue(isLastMonth(new Date(2020, 1)));
      assertTrue(isLastMonth(new Date(2020, 1, 29, 23, 59, 59, 999)));
      assertFalse(isLastMonth(new Date(2020, 2)));
    });

    it('should not shift when in the last moment of March', () => {
      setSystemTime(new Date(2020, 2, 31, 23, 59, 59, 999));
      assertFalse(isLastMonth(new Date(2020, 0, 31, 23, 59, 59, 999)));
      assertTrue(isLastMonth(new Date(2020, 1)));
      assertTrue(isLastMonth(new Date(2020, 1, 29, 23, 59, 59, 999)));
      assertFalse(isLastMonth(new Date(2020, 2)));
    });

    it('should handle irregular input', () => {
      assertFalse(isLastMonth(new Date('invalid')));
      assertError(() => {
        isLastMonth();
      });
      assertError(() => {
        isLastMonth(null);
      });
      assertError(() => {
        isLastMonth(0);
      });
    });
  });

  describeInstance('isThisMonth', (isThisMonth) => {

    it('should be false for last month', () => {
      assertFalse(isThisMonth(new Date(2019, 11)));
      assertFalse(isThisMonth(new Date(2019, 11, 15)));
      assertFalse(isThisMonth(new Date(2019, 11, 31, 23, 59, 59, 999)));
    });

    it('should be true for this month', () => {
      assertTrue(isThisMonth(new Date(2020, 0)));
      assertTrue(isThisMonth(new Date(2020, 0, 15)));
      assertTrue(isThisMonth(new Date(2020, 0, 31, 23, 59, 59, 999)));
    });

    it('should be false for next month', () => {
      assertFalse(isThisMonth(new Date(2020, 1)));
      assertFalse(isThisMonth(new Date(2020, 1, 15)));
      assertFalse(isThisMonth(new Date(2020, 1, 29, 23, 59, 59, 999)));
    });

    it('should report correctly when current time is in February', () => {
      setSystemTime(new Date(2020, 1, 15));
      assertFalse(isThisMonth(new Date(2020, 0, 31, 23, 59, 59, 999)));
      assertTrue(isThisMonth(new Date(2020, 1)));
      assertTrue(isThisMonth(new Date(2020, 1, 29, 23, 59, 59, 999)));
      assertFalse(isThisMonth(new Date(2020, 2)));
    });

    it('should handle irregular input', () => {
      assertFalse(isThisMonth(new Date('invalid')));
      assertError(() => {
        isThisMonth();
      });
      assertError(() => {
        isThisMonth(null);
      });
      assertError(() => {
        isThisMonth(0);
      });
    });
  });

  describeInstance('isNextMonth', (isNextMonth) => {

    it('should be false this month', () => {
      assertFalse(isNextMonth(new Date(2020, 0)));
      assertFalse(isNextMonth(new Date(2020, 0, 15)));
      assertFalse(isNextMonth(new Date(2020, 0, 31, 23, 59, 59, 999)));
    });

    it('should be true for next month', () => {
      assertTrue(isNextMonth(new Date(2020, 1)));
      assertTrue(isNextMonth(new Date(2020, 1, 15)));
      assertTrue(isNextMonth(new Date(2020, 1, 29, 23, 59, 59, 999)));
    });

    it('should be false for the month after next', () => {
      assertFalse(isNextMonth(new Date(2020, 2)));
      assertFalse(isNextMonth(new Date(2020, 2, 15)));
      assertFalse(isNextMonth(new Date(2020, 2, 31, 23, 59, 59, 999)));
    });

    it('should report correctly when current time is in February', () => {
      setSystemTime(new Date(2020, 1, 15));
      assertFalse(isNextMonth(new Date(2020, 1, 29, 23, 59, 59, 999)));
      assertTrue(isNextMonth(new Date(2020, 2)));
      assertTrue(isNextMonth(new Date(2020, 2, 31, 23, 59, 59, 999)));
      assertFalse(isNextMonth(new Date(2020, 3)));
    });

    it('should not shift when in the last moment of January', () => {
      setSystemTime(new Date(2020, 0, 31, 23, 59, 59, 999));
      assertFalse(isNextMonth(new Date(2020, 0, 31, 23, 59, 59, 999)));
      assertTrue(isNextMonth(new Date(2020, 1)));
      assertTrue(isNextMonth(new Date(2020, 1, 29, 23, 59, 59, 999)));
      assertFalse(isNextMonth(new Date(2020, 2)));
    });

    it('should handle irregular input', () => {
      assertFalse(isNextMonth(new Date('invalid')));
      assertError(() => {
        isNextMonth();
      });
      assertError(() => {
        isNextMonth(null);
      });
      assertError(() => {
        isNextMonth(0);
      });
    });
  });

  describeInstance('isLastYear', (isLastYear) => {

    it('should be false for year before last', () => {
      assertFalse(isLastYear(new Date(2018, 0)));
      assertFalse(isLastYear(new Date(2018, 6)));
      assertFalse(isLastYear(new Date(2018, 11, 31, 23, 59, 59, 999)));
    });

    it('should be true for last year', () => {
      assertTrue(isLastYear(new Date(2019, 1)));
      assertTrue(isLastYear(new Date(2019, 6)));
      assertTrue(isLastYear(new Date(2019, 11, 31, 23, 59, 59, 999)));
    });

    it('should be false for this year', () => {
      assertFalse(isLastYear(new Date(2020, 0)));
      assertFalse(isLastYear(new Date(2020, 6, 15)));
      assertFalse(isLastYear(new Date(2020, 11, 31, 23, 59, 59, 999)));
    });

    it('should handle irregular input', () => {
      assertFalse(isLastYear(new Date('invalid')));
      assertError(() => {
        isLastYear();
      });
      assertError(() => {
        isLastYear(null);
      });
      assertError(() => {
        isLastYear(0);
      });
    });
  });

  describeInstance('isThisYear', (isThisYear) => {

    it('should be false for last year', () => {
      assertFalse(isThisYear(new Date(2019, 0)));
      assertFalse(isThisYear(new Date(2019, 6)));
      assertFalse(isThisYear(new Date(2019, 11, 31, 23, 59, 59, 999)));
    });

    it('should be true for this year', () => {
      assertTrue(isThisYear(new Date(2020, 1)));
      assertTrue(isThisYear(new Date(2020, 6)));
      assertTrue(isThisYear(new Date(2020, 11, 31, 23, 59, 59, 999)));
    });

    it('should be false for next year', () => {
      assertFalse(isThisYear(new Date(2021, 0)));
      assertFalse(isThisYear(new Date(2021, 6, 15)));
      assertFalse(isThisYear(new Date(2021, 11, 31, 23, 59, 59, 999)));
    });

    it('should handle irregular input', () => {
      assertFalse(isThisYear(new Date('invalid')));
      assertError(() => {
        isThisYear();
      });
      assertError(() => {
        isThisYear(null);
      });
      assertError(() => {
        isThisYear(0);
      });
    });
  });

  describeInstance('isNextYear', (isNextYear) => {

    it('should be false for this year', () => {
      assertFalse(isNextYear(new Date(2020, 0)));
      assertFalse(isNextYear(new Date(2020, 6)));
      assertFalse(isNextYear(new Date(2020, 11, 31, 23, 59, 59, 999)));
    });

    it('should be true for next year', () => {
      assertTrue(isNextYear(new Date(2021, 1)));
      assertTrue(isNextYear(new Date(2021, 6)));
      assertTrue(isNextYear(new Date(2021, 11, 31, 23, 59, 59, 999)));
    });

    it('should be false for the year after next', () => {
      assertFalse(isNextYear(new Date(2022, 0)));
      assertFalse(isNextYear(new Date(2022, 6, 15)));
      assertFalse(isNextYear(new Date(2022, 11, 31, 23, 59, 59, 999)));
    });

    it('should handle irregular input', () => {
      assertFalse(isNextYear(new Date('invalid')));
      assertError(() => {
        isNextYear();
      });
      assertError(() => {
        isNextYear(null);
      });
      assertError(() => {
        isNextYear(0);
      });
    });
  });
  describeInstance('isFuture', (isFuture) => {

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

  describeInstance('isPast', (isPast) => {

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

  describeInstance('set', (set) => {

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
        set(new Date(2010, 0, 31), { month: 1 }, true),
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

  describeInstance('advance', (advance) => {

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

    it('handle DST issues', () => {
      assertDateEqual(
        advance(new Date(2015, 2, 8, 1), { hours: 1 }),
        new Date(2015, 2, 8, 2)
      );
      assertDateEqual(
        advance(new Date(2015, 2, 8, 2), { hours: -1 }),
        new Date(2015, 2, 8, 1)
      );

      // The following two dates cannot be created with a normal
      // date constructor as two points in time marked 2:00am exist
      // in timezones following DST, so assert the time value instead.
      let date, expected;

      date = new Date(2015, 10, 1, 1, 45);
      expected = date.getTime() + 1 * 60 * 60 * 1000;
      advance(date, { hours: 1 });
      assertEqual(date.getTime(), expected);

      date = new Date(2015, 10, 1, 1, 45);
      expected = date.getTime() - 1 * 60 * 60 * 1000;
      advance(date, { hours: -1 });
      assertEqual(date.getTime(), expected);

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

  describeInstance('rewind', (rewind) => {

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

    it('should handle DST issues', () => {
      assertDateEqual(
        rewind(new Date(2015, 2, 8, 2), { hours: 1 }),
        new Date(2015, 2, 8, 1)
      );
      assertDateEqual(
        rewind(new Date(2015, 2, 8, 1), { hours: -1 }),
        new Date(2015, 2, 8, 2)
      );

      // The following two dates cannot be created with a normal
      // date constructor as two points in time marked 2:00am exist
      // in timezones following DST, so assert the time value instead.
      let date, expected;

      date = new Date(2015, 10, 1, 1, 45);
      expected = date.getTime() - 1 * 60 * 60 * 1000;
      rewind(date, { hours: 1 });
      assertEqual(date.getTime(), expected);

      date = new Date(2015, 10, 1, 1, 45);
      expected = date.getTime() + 1 * 60 * 60 * 1000;
      rewind(date, { hours: -1 });
      assertEqual(date.getTime(), expected);

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

    it('should handle Issue #492', () => {
      assertDateEqual(
        rewind(new Date(2010, 7, 25, 11, 45, 20), { weeks: 1, days: 1 }),
        new Date(2010, 7, 17, 11, 45, 20)
      );
    });
  });

  describeInstance('addYears', (addYears) => {

    it('should function as an alias for advance', () => {
      assertDateEqual(addYears(new Date(2020, 0), 1), new Date(2021, 0));
      assertDateEqual(addYears(new Date(2020, 0), 10), new Date(2030, 0));
      assertDateEqual(addYears(new Date(2020, 0), -5), new Date(2015, 0));
      assertDateEqual(addYears(new Date(2020, 0), 0), new Date(2020, 0));
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

  describeInstance('addMonths', (addMonths) => {

    it('should function as an alias for advance', () => {
      assertDateEqual(addMonths(new Date(2020, 0), 1), new Date(2020, 1));
      assertDateEqual(addMonths(new Date(2020, 0), 10), new Date(2020, 10));
      assertDateEqual(addMonths(new Date(2020, 0), -5), new Date(2019, 7));
      assertDateEqual(addMonths(new Date(2020, 0), 0), new Date(2020, 0));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        addMonths(new Date(2020, 0));
      }, TypeError);
      assertError(() => {
        addMonths();
      }, TypeError);
    });

    it('should handle Issue #221', () => {
      assertDateEqual(
        addMonths(new Date(2012, 0), -13),
        addMonths(addMonths(new Date(2012, 0), -10), -3)
      );
    });
  });

  describeInstance('addWeeks', (addWeeks) => {

    it('should function as an alias for advance', () => {
      assertDateEqual(addWeeks(new Date(2020, 0), 1), new Date(2020, 0, 8));
      assertDateEqual(addWeeks(new Date(2020, 0), 10), new Date(2020, 2, 11));
      assertDateEqual(addWeeks(new Date(2020, 0), -5), new Date(2019, 10, 27));
      assertDateEqual(addWeeks(new Date(2020, 0), 0), new Date(2020, 0));
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

  describeInstance('addDays', (addDays) => {

    it('should function as an alias for advance', () => {
      assertDateEqual(addDays(new Date(2020, 0), 1), new Date(2020, 0, 2));
      assertDateEqual(addDays(new Date(2020, 0), 10), new Date(2020, 0, 11));
      assertDateEqual(addDays(new Date(2020, 0), -5), new Date(2019, 11, 27));
      assertDateEqual(addDays(new Date(2020, 0), 0), new Date(2020, 0));
    });

    it('should have expected numeric offset during a DST jump forward', () => {
      const d1 = new Date(2020, 2, 8);
      const d2 = addDays(new Date(2020, 2, 8), 1);

      const t1 = d1.getTime();
      const t2 = d2.getTime();

      const o1 = d1.getTimezoneOffset() * 60 * 1000;
      const o2 = d2.getTimezoneOffset() * 60 * 1000;

      assertEqual(t2 - t1, (24 * 60 * 60 * 1000) + (o2 - o1));
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

  describeInstance('addHours', (addHours) => {

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

    it('should handle DST issues', () => {
      assertDateEqual(
        addHours(new Date(2015, 2, 8, 1, 45), 1),
        new Date(2015, 2, 8, 2, 45)
      );
      assertDateEqual(
        addHours(new Date(2015, 2, 8, 2), -1),
        new Date(2015, 2, 8, 1)
      );

      // The following two dates cannot be created with a normal
      // date constructor as two points in time marked 2:00am exist
      // in timezones following DST, so assert the time value instead.
      let date, expected;

      date = new Date(2015, 10, 1, 1, 45);
      expected = date.getTime() + 1 * 60 * 60 * 1000;
      addHours(date, 1);
      assertEqual(date.getTime(), expected);

      date = new Date(2015, 10, 1, 1, 45);
      expected = date.getTime() - 1 * 60 * 60 * 1000;
      addHours(date, -1);
      assertEqual(date.getTime(), expected);

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

  describeInstance('addMinutes', (addMinutes) => {

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
      assertDateEqual(addMinutes(new Date(2020, 0), 0), new Date(2020, 0));
    });

    it('should handle DST issues', () => {
      assertDateEqual(
        addMinutes(new Date(2015, 2, 8, 1, 45), 15),
        new Date(2015, 2, 8, 2)
      );
      assertDateEqual(
        addMinutes(new Date(2015, 2, 8, 2), -15),
        new Date(2015, 2, 8, 1, 45)
      );

      // The following two dates cannot be created with a normal
      // date constructor as two points in time marked 2:00am exist
      // in timezones following DST, so assert the time value instead.
      let date, expected;

      date = new Date(2015, 10, 1, 1, 45);
      expected = date.getTime() + 15 * 60 * 1000;
      addMinutes(date, 15);

      assertEqual(date.getTime(), expected);
      date = new Date(2015, 10, 1, 1, 45);
      expected = date.getTime() - 15 * 60 * 1000;
      addMinutes(date, -15);
      assertEqual(date.getTime(), expected);

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

  describeInstance('addSeconds', (addSeconds) => {

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
      assertDateEqual(addSeconds(new Date(2020, 0), 0), new Date(2020, 0));
    });

    it('should handle DST issues', () => {
      assertDateEqual(
        addSeconds(new Date(2015, 2, 8, 1, 59, 30), 30),
        new Date(2015, 2, 8, 2)
      );
      assertDateEqual(
        addSeconds(new Date(2015, 2, 8, 2), -30),
        new Date(2015, 2, 8, 1, 59, 30)
      );

      // The following two dates cannot be created with a normal
      // date constructor as two points in time marked 2:00am exist
      // in timezones following DST, so assert the time value instead.
      let date, expected;

      date = new Date(2015, 10, 1, 1, 59, 30);
      expected = date.getTime() + 30 * 1000;
      addSeconds(date, 30);
      assertEqual(date.getTime(), expected);

      date = new Date(2015, 10, 1, 1, 59, 30);
      expected = date.getTime() - 30 * 1000;
      addSeconds(date, -30);
      assertEqual(date.getTime(), expected);
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

  describeInstance('addMilliseconds', (addMilliseconds) => {

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
      assertDateEqual(addMilliseconds(new Date(2020, 0), 0), new Date(2020, 0));
    });

    it('should handle DST issues', () => {
      assertDateEqual(
        addMilliseconds(new Date(2015, 2, 8, 1, 59, 59, 500), 500),
        new Date(2015, 2, 8, 2)
      );
      assertDateEqual(
        addMilliseconds(new Date(2015, 2, 8, 2), -500),
        new Date(2015, 2, 8, 1, 59, 59, 500)
      );

      // The following two dates cannot be created with a normal
      // date constructor as two points in time marked 2:00am exist
      // in timezones following DST, so assert the time value instead.
      let date, expected;

      date = new Date(2015, 10, 1, 1, 59, 59, 500);
      expected = date.getTime() + 500;
      addMilliseconds(date, 500);
      assertEqual(date.getTime(), expected);

      date = new Date(2015, 10, 1, 1, 59, 50, 500);
      expected = date.getTime() - 500;
      addMilliseconds(date, -500);
      assertEqual(date.getTime(), expected);
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

  describeInstance('yearsAgo', (yearsAgo) => {

    it('should return basic offset', () => {
      assertEqual(yearsAgo(new Date(2019, 0)), 1);
      assertEqual(yearsAgo(new Date(2015, 0)), 5);
      assertEqual(yearsAgo(new Date(2020, 0)), 0);
      assertEqual(yearsAgo(new Date(2021, 0)), -1);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(yearsAgo(new Date(2019, 0, 2)), 0);
      assertEqual(yearsAgo(new Date(2020, 11, 31)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        yearsAgo();
      }, TypeError);
    });

  });

  describeInstance('monthsAgo', (monthsAgo) => {

    it('should return basic offset', () => {
      assertEqual(monthsAgo(new Date(2019, 11)), 1);
      assertEqual(monthsAgo(new Date(2020, 1)), -1);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(monthsAgo(new Date(2019, 11, 2)), 0);
      assertEqual(monthsAgo(new Date(2020, 0, 31)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        monthsAgo();
      }, TypeError);
    });
  });

  describeInstance('weeksAgo', (weeksAgo) => {

    it('should return basic offset', () => {
      assertEqual(weeksAgo(new Date(2019, 11, 18)), 2);
      assertEqual(weeksAgo(new Date(2019, 11, 25)), 1);
      assertEqual(weeksAgo(new Date(2020, 0, 1)), 0);
      assertEqual(weeksAgo(new Date(2020, 0, 8)), -1);
      assertEqual(weeksAgo(new Date(2020, 0, 15)), -2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(weeksAgo(new Date(2019, 11, 25)), 1);
      assertEqual(weeksAgo(new Date(2019, 11, 26)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        weeksAgo();
      }, TypeError);
    });
  });

  describeInstance('daysAgo', (daysAgo) => {

    it('should return basic offset', () => {
      assertEqual(daysAgo(new Date(2019, 11, 30)), 2);
      assertEqual(daysAgo(new Date(2019, 11, 31)), 1);
      assertEqual(daysAgo(new Date(2020, 0, 1)), 0);
      assertEqual(daysAgo(new Date(2020, 0, 2)), -1);
      assertEqual(daysAgo(new Date(2020, 0, 3)), -2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(daysAgo(new Date(2019, 11, 31, 1)), 0);
      assertEqual(daysAgo(new Date(2020, 0, 1, 23)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        daysAgo();
      }, TypeError);
    });

  });

  describeInstance('hoursAgo', (hoursAgo) => {

    it('should return basic offset', () => {
      assertEqual(hoursAgo(new Date(2019, 11, 31, 22)), 2);
      assertEqual(hoursAgo(new Date(2019, 11, 31, 23)), 1);
      assertEqual(hoursAgo(new Date(2020, 0, 1)), 0);
      assertEqual(hoursAgo(new Date(2020, 0, 1, 1)), -1);
      assertEqual(hoursAgo(new Date(2020, 0, 1, 2)), -2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(hoursAgo(new Date(2019, 11, 31, 23, 1)), 0);
      assertEqual(hoursAgo(new Date(2020, 0, 1, 0, 59)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        hoursAgo();
      }, TypeError);
    });

  });

  describeInstance('minutesAgo', (minutesAgo) => {

    it('should return basic offset', () => {
      assertEqual(minutesAgo(new Date(2019, 11, 31, 23, 58)), 2);
      assertEqual(minutesAgo(new Date(2019, 11, 31, 23, 59)), 1);
      assertEqual(minutesAgo(new Date(2020, 0, 1)), 0);
      assertEqual(minutesAgo(new Date(2020, 0, 1, 0, 1)), -1);
      assertEqual(minutesAgo(new Date(2020, 0, 1, 0, 2)), -2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(minutesAgo(new Date(2019, 11, 31, 23, 59, 1)), 0);
      assertEqual(minutesAgo(new Date(2020, 0, 1, 0, 0, 59)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        minutesAgo();
      }, TypeError);
    });

  });

  describeInstance('secondsAgo', (secondsAgo) => {

    it('should return basic offset', () => {
      assertEqual(secondsAgo(new Date(2019, 11, 31, 23, 59, 58)), 2);
      assertEqual(secondsAgo(new Date(2019, 11, 31, 23, 59, 59)), 1);
      assertEqual(secondsAgo(new Date(2020, 0, 1)), 0);
      assertEqual(secondsAgo(new Date(2020, 0, 1, 0, 0, 1)), -1);
      assertEqual(secondsAgo(new Date(2020, 0, 1, 0, 0, 2)), -2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(secondsAgo(new Date(2019, 11, 31, 23, 59, 59, 1)), 0);
      assertEqual(secondsAgo(new Date(2020, 0, 1, 0, 0, 0, 999)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        secondsAgo();
      }, TypeError);
    });

  });

  describeInstance('millisecondsAgo', (millisecondsAgo) => {

    it('should return basic offset', () => {
      assertEqual(millisecondsAgo(new Date(2019, 11, 31, 23, 59, 59, 995)), 5);
      assertEqual(millisecondsAgo(new Date(2019, 11, 31, 23, 59, 59, 999)), 1);
      assertEqual(millisecondsAgo(new Date(2020, 0, 1)), 0);
      assertEqual(millisecondsAgo(new Date(2020, 0, 1, 0, 0, 0, 1)), -1);
      assertEqual(millisecondsAgo(new Date(2020, 0, 1, 0, 0, 0, 5)), -5);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        millisecondsAgo();
      }, TypeError);
    });

  });

  describeInstance('yearsFromNow', (yearsFromNow) => {

    it('should return basic offset', () => {
      assertEqual(yearsFromNow(new Date(2019, 0)), -1);
      assertEqual(yearsFromNow(new Date(2015, 0)), -5);
      assertEqual(yearsFromNow(new Date(2020, 0)), 0);
      assertEqual(yearsFromNow(new Date(2021, 0)), 1);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(yearsFromNow(new Date(2019, 0, 2)), 0);
      assertEqual(yearsFromNow(new Date(2020, 11, 31)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        yearsFromNow();
      }, TypeError);
    });
  });

  describeInstance('monthsFromNow', (monthsFromNow) => {

    it('should return basic offset', () => {
      assertEqual(monthsFromNow(new Date(2019, 11)), -1);
      assertEqual(monthsFromNow(new Date(2020, 1)), 1);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(monthsFromNow(new Date(2019, 11, 2)), 0);
      assertEqual(monthsFromNow(new Date(2020, 0, 31)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        monthsFromNow();
      }, TypeError);
    });
  });

  describeInstance('weeksFromNow', (weeksFromNow) => {

    it('should return basic offset', () => {
      assertEqual(weeksFromNow(new Date(2019, 11, 18)), -2);
      assertEqual(weeksFromNow(new Date(2019, 11, 25)), -1);
      assertEqual(weeksFromNow(new Date(2020, 0, 1)), 0);
      assertEqual(weeksFromNow(new Date(2020, 0, 8)), 1);
      assertEqual(weeksFromNow(new Date(2020, 0, 15)), 2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(weeksFromNow(new Date(2019, 11, 25)), -1);
      assertEqual(weeksFromNow(new Date(2019, 11, 26)), 0);
      assertEqual(weeksFromNow(new Date(2020, 0, 8)), 1);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        weeksFromNow();
      }, TypeError);
    });
  });

  describeInstance('daysFromNow', (daysFromNow) => {

    it('should return basic offset', () => {
      assertEqual(daysFromNow(new Date(2019, 11, 30)), -2);
      assertEqual(daysFromNow(new Date(2019, 11, 31)), -1);
      assertEqual(daysFromNow(new Date(2020, 0, 1)), 0);
      assertEqual(daysFromNow(new Date(2020, 0, 2)), 1);
      assertEqual(daysFromNow(new Date(2020, 0, 3)), 2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(daysFromNow(new Date(2019, 11, 31, 1)), 0);
      assertEqual(daysFromNow(new Date(2020, 0, 1, 23)), 0);
    });

    it('should handle Issue #236', () => {
      setSystemTime(new Date(2012, 10, 12, 2, 29, 20));
      assertEqual(daysFromNow(new Date(2012, 10, 12, 23, 50)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        daysFromNow();
      }, TypeError);
    });

  });

  describeInstance('hoursFromNow', (hoursFromNow) => {

    it('should return basic offset', () => {
      assertEqual(hoursFromNow(new Date(2019, 11, 31, 22)), -2);
      assertEqual(hoursFromNow(new Date(2019, 11, 31, 23)), -1);
      assertEqual(hoursFromNow(new Date(2020, 0, 1)), 0);
      assertEqual(hoursFromNow(new Date(2020, 0, 1, 1)), 1);
      assertEqual(hoursFromNow(new Date(2020, 0, 1, 2)), 2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(hoursFromNow(new Date(2019, 11, 31, 23, 1)), 0);
      assertEqual(hoursFromNow(new Date(2020, 0, 1, 0, 59)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        hoursFromNow();
      }, TypeError);
    });

  });

  describeInstance('minutesFromNow', (minutesFromNow) => {

    it('should return basic offset', () => {
      assertEqual(minutesFromNow(new Date(2019, 11, 31, 23, 58)), -2);
      assertEqual(minutesFromNow(new Date(2019, 11, 31, 23, 59)), -1);
      assertEqual(minutesFromNow(new Date(2020, 0, 1)), 0);
      assertEqual(minutesFromNow(new Date(2020, 0, 1, 0, 1)), 1);
      assertEqual(minutesFromNow(new Date(2020, 0, 1, 0, 2)), 2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(minutesFromNow(new Date(2019, 11, 31, 23, 59, 1)), 0);
      assertEqual(minutesFromNow(new Date(2020, 0, 1, 0, 0, 59)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        minutesFromNow();
      }, TypeError);
    });

  });

  describeInstance('secondsFromNow', (secondsFromNow) => {

    it('should return basic offset', () => {
      assertEqual(secondsFromNow(new Date(2019, 11, 31, 23, 59, 58)), -2);
      assertEqual(secondsFromNow(new Date(2019, 11, 31, 23, 59, 59)), -1);
      assertEqual(secondsFromNow(new Date(2020, 0, 1)), 0);
      assertEqual(secondsFromNow(new Date(2020, 0, 1, 0, 0, 1)), 1);
      assertEqual(secondsFromNow(new Date(2020, 0, 1, 0, 0, 2)), 2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(secondsFromNow(new Date(2019, 11, 31, 23, 59, 59, 1)), 0);
      assertEqual(secondsFromNow(new Date(2020, 0, 1, 0, 0, 0, 999)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        secondsFromNow();
      }, TypeError);
    });

  });

  describeInstance('millisecondsFromNow', (millisecondsFromNow) => {

    it('should return basic offset', () => {
      assertEqual(millisecondsFromNow(new Date(2019, 11, 31, 23, 59, 59, 995)), -5);
      assertEqual(millisecondsFromNow(new Date(2019, 11, 31, 23, 59, 59, 999)), -1);
      assertEqual(millisecondsFromNow(new Date(2020, 0, 1)), 0);
      assertEqual(millisecondsFromNow(new Date(2020, 0, 1, 0, 0, 0, 1)), 1);
      assertEqual(millisecondsFromNow(new Date(2020, 0, 1, 0, 0, 0, 5)), 5);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        millisecondsFromNow();
      }, TypeError);
    });

  });

  describeInstance('yearsBefore', (yearsBefore) => {

    it('should return basic offset', () => {
      assertEqual(yearsBefore(new Date(2019, 0), new Date(2020, 0)), 1);
      assertEqual(yearsBefore(new Date(2015, 0), new Date(2020, 0)), 5);
      assertEqual(yearsBefore(new Date(2020, 0), new Date(2020, 0)), 0);
      assertEqual(yearsBefore(new Date(2021, 0), new Date(2020, 0)), -1);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(yearsBefore(new Date(2019, 0, 2), new Date(2020, 0)), 0);
      assertEqual(yearsBefore(new Date(2020, 11, 31), new Date(2020, 0)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        yearsBefore();
      }, TypeError);
    });

  });

  describeInstance('monthsBefore', (monthsBefore) => {

    it('should return basic offset', () => {
      assertEqual(monthsBefore(new Date(2019, 11), new Date(2020, 0)), 1);
      assertEqual(monthsBefore(new Date(2020, 1), new Date(2020, 0)), -1);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(monthsBefore(new Date(2019, 11, 2), new Date(2020, 0)), 0);
      assertEqual(monthsBefore(new Date(2020, 0, 31), new Date(2020, 0)), 0);
    });

    it('should traverse over February by month', () => {
      assertEqual(monthsBefore(new Date(2015, 0, 31), new Date(2015, 1, 28)),  1);
      assertEqual(monthsBefore(new Date(2015, 0, 31), new Date(2015, 2, 31)),  2);
      assertEqual(monthsBefore(new Date(2015, 2, 31), new Date(2015, 0, 31)),  -2);
      assertEqual(monthsBefore(new Date(2015, 1, 28), new Date(2015, 0, 31)),  -1);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        monthsBefore();
      }, TypeError);
    });

  });

  describeInstance('weeksBefore', (weeksBefore) => {

    it('should return basic offset', () => {
      assertEqual(weeksBefore(new Date(2019, 11, 18), new Date(2020, 0)), 2);
      assertEqual(weeksBefore(new Date(2019, 11, 25), new Date(2020, 0)), 1);
      assertEqual(weeksBefore(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(weeksBefore(new Date(2020, 0, 8), new Date(2020, 0)), -1);
      assertEqual(weeksBefore(new Date(2020, 0, 15), new Date(2020, 0)), -2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(weeksBefore(new Date(2019, 11, 25), new Date(2020, 0)), 1);
      assertEqual(weeksBefore(new Date(2019, 11, 26), new Date(2020, 0)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        weeksBefore();
      }, TypeError);
    });
  });

  describeInstance('daysBefore', (daysBefore) => {

    it('should return basic offset', () => {
      assertEqual(daysBefore(new Date(2019, 11, 30), new Date(2020, 0)), 2);
      assertEqual(daysBefore(new Date(2019, 11, 31), new Date(2020, 0)), 1);
      assertEqual(daysBefore(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(daysBefore(new Date(2020, 0, 2), new Date(2020, 0)), -1);
      assertEqual(daysBefore(new Date(2020, 0, 3), new Date(2020, 0)), -2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(daysBefore(new Date(2019, 11, 31, 1), new Date(2020, 0)), 0);
      assertEqual(daysBefore(new Date(2020, 0, 1, 23), new Date(2020, 0)), 0);
    });

    it('should handle Issue #267', () => {
      assertEqual(daysBefore(new Date(2013, 2), new Date(2013, 2, 28)), 27);
      assertEqual(daysBefore(new Date(2013, 2, 10), new Date(2013, 2, 11)), 1);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        daysBefore();
      }, TypeError);
    });

  });

  describeInstance('hoursBefore', (hoursBefore) => {

    it('should return basic offset', () => {
      assertEqual(hoursBefore(new Date(2019, 11, 31, 22), new Date(2020, 0)), 2);
      assertEqual(hoursBefore(new Date(2019, 11, 31, 23), new Date(2020, 0)), 1);
      assertEqual(hoursBefore(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(hoursBefore(new Date(2020, 0, 1, 1), new Date(2020, 0)), -1);
      assertEqual(hoursBefore(new Date(2020, 0, 1, 2), new Date(2020, 0)), -2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(hoursBefore(new Date(2019, 11, 31, 23, 1), new Date(2020, 0)), 0);
      assertEqual(hoursBefore(new Date(2020, 0, 1, 0, 59), new Date(2020, 0)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        hoursBefore();
      }, TypeError);
    });

  });

  describeInstance('minutesBefore', (minutesBefore) => {

    it('should return basic offset', () => {
      assertEqual(minutesBefore(new Date(2019, 11, 31, 23, 58), new Date(2020, 0)), 2);
      assertEqual(minutesBefore(new Date(2019, 11, 31, 23, 59), new Date(2020, 0)), 1);
      assertEqual(minutesBefore(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(minutesBefore(new Date(2020, 0, 1, 0, 1), new Date(2020, 0)), -1);
      assertEqual(minutesBefore(new Date(2020, 0, 1, 0, 2), new Date(2020, 0)), -2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(minutesBefore(new Date(2019, 11, 31, 23, 59, 1), new Date(2020, 0)), 0);
      assertEqual(minutesBefore(new Date(2020, 0, 1, 0, 0, 59), new Date(2020, 0)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        minutesBefore();
      }, TypeError);
    });

  });

  describeInstance('secondsBefore', (secondsBefore) => {

    it('should return basic offset', () => {
      assertEqual(secondsBefore(new Date(2019, 11, 31, 23, 59, 58), new Date(2020, 0)), 2);
      assertEqual(secondsBefore(new Date(2019, 11, 31, 23, 59, 59), new Date(2020, 0)), 1);
      assertEqual(secondsBefore(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(secondsBefore(new Date(2020, 0, 1, 0, 0, 1), new Date(2020, 0)), -1);
      assertEqual(secondsBefore(new Date(2020, 0, 1, 0, 0, 2), new Date(2020, 0)), -2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(secondsBefore(new Date(2019, 11, 31, 23, 59, 59, 1), new Date(2020, 0)), 0);
      assertEqual(secondsBefore(new Date(2020, 0, 1, 0, 0, 0, 999), new Date(2020, 0)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        secondsBefore();
      }, TypeError);
    });

  });

  describeInstance('millisecondsBefore', (millisecondsBefore) => {

    it('should return basic offset', () => {
      assertEqual(millisecondsBefore(new Date(2019, 11, 31, 23, 59, 59, 995), new Date(2020, 0)), 5);
      assertEqual(millisecondsBefore(new Date(2019, 11, 31, 23, 59, 59, 999), new Date(2020, 0)), 1);
      assertEqual(millisecondsBefore(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(millisecondsBefore(new Date(2020, 0, 1, 0, 0, 0, 1), new Date(2020, 0)), -1);
      assertEqual(millisecondsBefore(new Date(2020, 0, 1, 0, 0, 0, 5), new Date(2020, 0)), -5);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        millisecondsBefore();
      }, TypeError);
    });

  });

  describeInstance('yearsAfter', (yearsAfter) => {

    it('should return basic offset', () => {
      assertEqual(yearsAfter(new Date(2019, 0), new Date(2020, 0)), -1);
      assertEqual(yearsAfter(new Date(2015, 0), new Date(2020, 0)), -5);
      assertEqual(yearsAfter(new Date(2020, 0), new Date(2020, 0)), 0);
      assertEqual(yearsAfter(new Date(2021, 0), new Date(2020, 0)), 1);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(yearsAfter(new Date(2019, 0, 2), new Date(2020, 0)), 0);
      assertEqual(yearsAfter(new Date(2020, 11, 31), new Date(2020, 0)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        yearsAfter();
      }, TypeError);
    });
  });

  describeInstance('monthsAfter', (monthsAfter) => {

    it('should return basic offset', () => {
      assertEqual(monthsAfter(new Date(2019, 11), new Date(2020, 0)), -1);
      assertEqual(monthsAfter(new Date(2020, 1), new Date(2020, 0)), 1);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(monthsAfter(new Date(2019, 11, 2), new Date(2020, 0)), 0);
      assertEqual(monthsAfter(new Date(2020, 0, 31), new Date(2020, 0)), 0);
    });

    it('should traverse over February by month', () => {
      assertEqual(monthsAfter(new Date(2015, 0, 31), new Date(2015, 1, 28)), -1);
      assertEqual(monthsAfter(new Date(2015, 1, 28), new Date(2015, 0, 31)),  1);
      assertEqual(monthsAfter(new Date(2015, 0, 31), new Date(2015, 2, 31)), -2);
      assertEqual(monthsAfter(new Date(2015, 2, 31), new Date(2015, 0, 31)),  2);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        monthsAfter();
      }, TypeError);
    });
  });

  describeInstance('weeksAfter', (weeksAfter) => {

    it('should return basic offset', () => {
      assertEqual(weeksAfter(new Date(2019, 11, 18), new Date(2020, 0)), -2);
      assertEqual(weeksAfter(new Date(2019, 11, 25), new Date(2020, 0)), -1);
      assertEqual(weeksAfter(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(weeksAfter(new Date(2020, 0, 8), new Date(2020, 0)), 1);
      assertEqual(weeksAfter(new Date(2020, 0, 15), new Date(2020, 0)), 2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(weeksAfter(new Date(2019, 11, 25), new Date(2020, 0)), -1);
      assertEqual(weeksAfter(new Date(2019, 11, 26), new Date(2020, 0)), 0);
      assertEqual(weeksAfter(new Date(2020, 0, 8), new Date(2020, 0)), 1);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        weeksAfter();
      }, TypeError);
    });
  });

  describeInstance('daysAfter', (daysAfter) => {

    it('should return basic offset', () => {
      assertEqual(daysAfter(new Date(2019, 11, 30), new Date(2020, 0)), -2);
      assertEqual(daysAfter(new Date(2019, 11, 31), new Date(2020, 0)), -1);
      assertEqual(daysAfter(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(daysAfter(new Date(2020, 0, 2), new Date(2020, 0)), 1);
      assertEqual(daysAfter(new Date(2020, 0, 3), new Date(2020, 0)), 2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(daysAfter(new Date(2019, 11, 31, 1), new Date(2020, 0)), 0);
      assertEqual(daysAfter(new Date(2020, 0, 1, 23), new Date(2020, 0)), 0);
    });

    it('should handle Issue #474', () => {
      assertEqual(
        daysAfter(new Date(2014, 10, 10, 21), new Date(2014, 6)),
        daysAfter(new Date(2014, 10, 10, 22), new Date(2014, 6)),
      );
    });

    it('should handle irregular input', () => {
      assertError(() => {
        daysAfter();
      }, TypeError);
    });

  });

  describeInstance('hoursAfter', (hoursAfter) => {

    it('should return basic offset', () => {
      assertEqual(hoursAfter(new Date(2019, 11, 31, 22), new Date(2020, 0)), -2);
      assertEqual(hoursAfter(new Date(2019, 11, 31, 23), new Date(2020, 0)), -1);
      assertEqual(hoursAfter(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(hoursAfter(new Date(2020, 0, 1, 1), new Date(2020, 0)), 1);
      assertEqual(hoursAfter(new Date(2020, 0, 1, 2), new Date(2020, 0)), 2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(hoursAfter(new Date(2019, 11, 31, 23, 1), new Date(2020, 0)), 0);
      assertEqual(hoursAfter(new Date(2020, 0, 1, 0, 59), new Date(2020, 0)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        hoursAfter();
      }, TypeError);
    });

  });

  describeInstance('minutesAfter', (minutesAfter) => {

    it('should return basic offset', () => {
      assertEqual(minutesAfter(new Date(2019, 11, 31, 23, 58), new Date(2020, 0)), -2);
      assertEqual(minutesAfter(new Date(2019, 11, 31, 23, 59), new Date(2020, 0)), -1);
      assertEqual(minutesAfter(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(minutesAfter(new Date(2020, 0, 1, 0, 1), new Date(2020, 0)), 1);
      assertEqual(minutesAfter(new Date(2020, 0, 1, 0, 2), new Date(2020, 0)), 2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(minutesAfter(new Date(2019, 11, 31, 23, 59, 1), new Date(2020, 0)), 0);
      assertEqual(minutesAfter(new Date(2020, 0, 1, 0, 0, 59), new Date(2020, 0)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        minutesAfter();
      }, TypeError);
    });

  });

  describeInstance('secondsAfter', (secondsAfter) => {

    it('should return basic offset', () => {
      assertEqual(secondsAfter(new Date(2019, 11, 31, 23, 59, 58), new Date(2020, 0)), -2);
      assertEqual(secondsAfter(new Date(2019, 11, 31, 23, 59, 59), new Date(2020, 0)), -1);
      assertEqual(secondsAfter(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(secondsAfter(new Date(2020, 0, 1, 0, 0, 1), new Date(2020, 0)), 1);
      assertEqual(secondsAfter(new Date(2020, 0, 1, 0, 0, 2), new Date(2020, 0)), 2);
    });

    it('should not count until threshold crossed', () => {
      assertEqual(secondsAfter(new Date(2019, 11, 31, 23, 59, 59, 1), new Date(2020, 0)), 0);
      assertEqual(secondsAfter(new Date(2020, 0, 1, 0, 0, 0, 999), new Date(2020, 0)), 0);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        secondsAfter();
      }, TypeError);
    });

  });

  describeInstance('millisecondsAfter', (millisecondsAfter) => {

    it('should return basic offset', () => {
      assertEqual(millisecondsAfter(new Date(2019, 11, 31, 23, 59, 59, 995), new Date(2020, 0)), -5);
      assertEqual(millisecondsAfter(new Date(2019, 11, 31, 23, 59, 59, 999), new Date(2020, 0)), -1);
      assertEqual(millisecondsAfter(new Date(2020, 0, 1), new Date(2020, 0)), 0);
      assertEqual(millisecondsAfter(new Date(2020, 0, 1, 0, 0, 0, 1), new Date(2020, 0)), 1);
      assertEqual(millisecondsAfter(new Date(2020, 0, 1, 0, 0, 0, 5), new Date(2020, 0)), 5);
    });

    it('should handle irregular input', () => {
      assertError(() => {
        millisecondsAfter();
      }, TypeError);
    });

  });

  describeInstance('getISOWeek', (getISOWeek) => {

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

  describeInstance('setISOWeek', (setISOWeek) => {

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
      assertEqual(
        setISOWeek(new Date(2020, 0), 3),
        new Date(2020, 0, 15).getTime()
      );
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

    it('should handle Issue #251', () => {
      const date = new Date(2013, 0, 6);
      setISOWeek(date, 1);
      assertDateEqual(date, new Date(2013, 0, 6));
    });
  });

  describeInstance('setDay,setWeekday', (setWeekday) => {

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
      assertEqual(
        setWeekday(new Date(2020, 0), 6),
        new Date(2020, 0, 4).getTime()
      );
    });

    it('should handle irregular input', () => {
      assertNaN(setWeekday(new Date(2020, 0)));
      assertError(() => {
        setWeekday();
      });
    });
  });

  describeInstance('getWeekday', (getWeekday) => {

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

  describeInstance('getDaysInMonth', (getDaysInMonth) => {

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

  describeInstance('isLeapYear', (isLeapYear) => {

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

  describeInstance('startOfYear', (startOfYear) => {

    it('should correctly reset the year', () => {
      assertDateEqual(startOfYear(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(startOfYear(new Date(2020, 0, 2)), new Date(2020, 0));
      assertDateEqual(startOfYear(new Date(2020, 1, 15)), new Date(2020, 0));
      assertDateEqual(startOfYear(new Date(2020, 11, 31)), new Date(2020, 0));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(
        startOfYear(new Date(2020, 3, 3, 23, 59, 59, 999)),
        new Date(2020, 0)
      );
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

  describeInstance('startOfMonth', (startOfMonth) => {

    it('should correctly reset the month', () => {
      assertDateEqual(startOfMonth(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(startOfMonth(new Date(2020, 1)), new Date(2020, 1));
      assertDateEqual(startOfMonth(new Date(2020, 1, 15)), new Date(2020, 1));
      assertDateEqual(startOfMonth(new Date(2020, 11, 31)), new Date(2020, 11));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(
        startOfMonth(new Date(2020, 1, 3, 23, 59, 59, 999)),
        new Date(2020, 1)
      );
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

  describeInstance('startOfWeek', (startOfWeek) => {

    it('should correctly reset the week to Sunday', () => {
      assertDateEqual(
        startOfWeek(new Date(2019, 11, 30)),
        new Date(2019, 11, 29)
      );
      assertDateEqual(
        startOfWeek(new Date(2019, 11, 31)),
        new Date(2019, 11, 29)
      );
      assertDateEqual(
        startOfWeek(new Date(2020, 0, 1)),
        new Date(2019, 11, 29)
      );
      assertDateEqual(
        startOfWeek(new Date(2020, 0, 2)),
        new Date(2019, 11, 29)
      );
      assertDateEqual(
        startOfWeek(new Date(2020, 0, 3)),
        new Date(2019, 11, 29)
      );
      assertDateEqual(
        startOfWeek(new Date(2020, 0, 4)),
        new Date(2019, 11, 29)
      );
      assertDateEqual(startOfWeek(new Date(2020, 0, 5)), new Date(2020, 0, 5));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(
        startOfWeek(new Date(2020, 0, 3, 23, 59, 59, 999)),
        new Date(2019, 11, 29)
      );
    });

    it('should be able to specify a different start of the week', () => {
      assertDateEqual(
        startOfWeek(new Date(2020, 0), 1),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        startOfWeek(new Date(2020, 0), 6),
        new Date(2019, 11, 28)
      );
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

  describeInstance('startOfISOWeek', (startOfISOWeek) => {

    it('should correctly reset the week to Sunday', () => {
      assertDateEqual(
        startOfISOWeek(new Date(2019, 11, 29)),
        new Date(2019, 11, 23)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2019, 11, 30)),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2019, 11, 31)),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2020, 0, 1)),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2020, 0, 2)),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2020, 0, 3)),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2020, 0, 4)),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2020, 0, 5)),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2020, 0, 6)),
        new Date(2020, 0, 6)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2020, 0, 7)),
        new Date(2020, 0, 6)
      );
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(
        startOfISOWeek(new Date(2020, 0, 3, 23, 59, 59, 999)),
        new Date(2019, 11, 30)
      );
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

    it('should handle Issue #326', () => {
      assertDateEqual(
        startOfISOWeek(new Date(2013, 6, 8)),
        new Date(2013, 6, 8)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2013, 6, 9)),
        new Date(2013, 6, 8)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2013, 6, 10)),
        new Date(2013, 6, 8)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2013, 6, 11)),
        new Date(2013, 6, 8)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2013, 6, 12)),
        new Date(2013, 6, 8)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2013, 6, 13)),
        new Date(2013, 6, 8)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2013, 6, 14)),
        new Date(2013, 6, 8)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2013, 6, 15)),
        new Date(2013, 6, 15)
      );
      assertDateEqual(
        startOfISOWeek(new Date(2013, 6, 10, 8, 30)),
        new Date(2013, 6, 8)
      );
    });
  });

  describeInstance('startOfDay', (startOfDay) => {

    it('should correctly reset the date', () => {
      assertDateEqual(startOfDay(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(startOfDay(new Date(2020, 0, 1, 1)), new Date(2020, 0));
      assertDateEqual(startOfDay(new Date(2020, 0, 1, 23)), new Date(2020, 0));
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(
        startOfDay(new Date(2020, 0, 1, 23, 59, 59, 999)),
        new Date(2020, 0, 1)
      );
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

  describeInstance('startOfHour', (startOfHour) => {

    it('should correctly reset the hour', () => {
      assertDateEqual(startOfHour(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(
        startOfHour(new Date(2020, 0, 1, 0, 30)),
        new Date(2020, 0)
      );
      assertDateEqual(
        startOfHour(new Date(2020, 0, 1, 0, 59)),
        new Date(2020, 0)
      );
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(
        startOfHour(new Date(2020, 0, 1, 23, 59, 59, 999)),
        new Date(2020, 0, 1, 23)
      );
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

  describeInstance('startOfMinute', (startOfMinute) => {

    it('should correctly reset the minute', () => {
      assertDateEqual(startOfMinute(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(
        startOfMinute(new Date(2020, 0, 1, 0, 0, 30)),
        new Date(2020, 0)
      );
      assertDateEqual(
        startOfMinute(new Date(2020, 0, 1, 0, 0, 59)),
        new Date(2020, 0)
      );
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(
        startOfMinute(new Date(2020, 0, 1, 23, 59, 59, 999)),
        new Date(2020, 0, 1, 23, 59)
      );
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

  describeInstance('startOfSecond', (startOfSecond) => {

    it('should correctly reset the secon', () => {
      assertDateEqual(startOfSecond(new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(
        startOfSecond(new Date(2020, 0, 1, 0, 0, 0, 500)),
        new Date(2020, 0)
      );
      assertDateEqual(
        startOfSecond(new Date(2020, 0, 1, 0, 0, 0, 999)),
        new Date(2020, 0)
      );
    });

    it('should correctly reset lower units', () => {
      assertDateEqual(
        startOfSecond(new Date(2020, 0, 1, 23, 59, 59, 999)),
        new Date(2020, 0, 1, 23, 59, 59)
      );
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

  describeInstance('endOfYear', (endOfYear) => {

    it('should correctly set to the end of the year', () => {
      assertDateEqual(
        endOfYear(new Date(2020, 0)),
        new Date(2020, 11, 31, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfYear(new Date(2020, 5)),
        new Date(2020, 11, 31, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfYear(new Date(2021, 5)),
        new Date(2021, 11, 31, 23, 59, 59, 999)
      );
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

  describeInstance('endOfMonth', (endOfMonth) => {

    it('should correctly set to the end of the month', () => {
      assertDateEqual(
        endOfMonth(new Date(2020, 0)),
        new Date(2020, 0, 31, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfMonth(new Date(2020, 1)),
        new Date(2020, 1, 29, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfMonth(new Date(2020, 1, 15)),
        new Date(2020, 1, 29, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfMonth(new Date(2020, 11, 12)),
        new Date(2020, 11, 31, 23, 59, 59, 999)
      );
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

  describeInstance('endOfWeek', (endOfWeek) => {

    it('should correctly set to end of Saturday', () => {
      assertDateEqual(
        endOfWeek(new Date(2019, 11, 30)),
        new Date(2020, 0, 4, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfWeek(new Date(2019, 11, 31)),
        new Date(2020, 0, 4, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfWeek(new Date(2020, 0, 1)),
        new Date(2020, 0, 4, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfWeek(new Date(2020, 0, 2)),
        new Date(2020, 0, 4, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfWeek(new Date(2020, 0, 3)),
        new Date(2020, 0, 4, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfWeek(new Date(2020, 0, 4)),
        new Date(2020, 0, 4, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfWeek(new Date(2020, 0, 5)),
        new Date(2020, 0, 11, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfWeek(new Date(2020, 0, 6)),
        new Date(2020, 0, 11, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfWeek(new Date(2020, 0, 7)),
        new Date(2020, 0, 11, 23, 59, 59, 999)
      );
    });

    it('should be able to specify a different end of the week', () => {
      assertDateEqual(
        endOfWeek(new Date(2020, 0), 1),
        new Date(2020, 0, 5, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfWeek(new Date(2020, 0), 6),
        new Date(2020, 0, 3, 23, 59, 59, 999)
      );
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

  describeInstance('endOfISOWeek', (endOfISOWeek) => {

    it('should correctly set end of Sunday', () => {
      assertDateEqual(
        endOfISOWeek(new Date(2019, 11, 30)),
        new Date(2020, 0, 5, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfISOWeek(new Date(2019, 11, 31)),
        new Date(2020, 0, 5, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfISOWeek(new Date(2020, 0, 1)),
        new Date(2020, 0, 5, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfISOWeek(new Date(2020, 0, 2)),
        new Date(2020, 0, 5, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfISOWeek(new Date(2020, 0, 3)),
        new Date(2020, 0, 5, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfISOWeek(new Date(2020, 0, 4)),
        new Date(2020, 0, 5, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfISOWeek(new Date(2020, 0, 5)),
        new Date(2020, 0, 5, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfISOWeek(new Date(2020, 0, 6)),
        new Date(2020, 0, 12, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfISOWeek(new Date(2020, 0, 7)),
        new Date(2020, 0, 12, 23, 59, 59, 999)
      );
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

  describeInstance('endOfDay', (endOfDay) => {

    it('should correctly set to the end of the day', () => {
      assertDateEqual(
        endOfDay(new Date(2020, 0)),
        new Date(2020, 0, 1, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfDay(new Date(2020, 0, 1, 1)),
        new Date(2020, 0, 1, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfDay(new Date(2020, 0, 1, 12)),
        new Date(2020, 0, 1, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfDay(new Date(2020, 0, 1, 23)),
        new Date(2020, 0, 1, 23, 59, 59, 999)
      );
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

  describeInstance('endOfHour', (endOfHour) => {

    it('should correctly set to the end of the hour', () => {
      assertDateEqual(
        endOfHour(new Date(2020, 0)),
        new Date(2020, 0, 1, 0, 59, 59, 999)
      );
      assertDateEqual(
        endOfHour(new Date(2020, 0, 1, 5)),
        new Date(2020, 0, 1, 5, 59, 59, 999)
      );
      assertDateEqual(
        endOfHour(new Date(2020, 0, 1, 5, 30)),
        new Date(2020, 0, 1, 5, 59, 59, 999)
      );
      assertDateEqual(
        endOfHour(new Date(2020, 0, 1, 23)),
        new Date(2020, 0, 1, 23, 59, 59, 999)
      );
      assertDateEqual(
        endOfHour(new Date(2020, 0, 1, 23, 30)),
        new Date(2020, 0, 1, 23, 59, 59, 999)
      );
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

  describeInstance('endOfMinute', (endOfMinute) => {

    it('should correctly set the minute', () => {
      assertDateEqual(
        endOfMinute(new Date(2020, 0)),
        new Date(2020, 0, 1, 0, 0, 59, 999)
      );
      assertDateEqual(
        endOfMinute(new Date(2020, 0, 1, 12, 5)),
        new Date(2020, 0, 1, 12, 5, 59, 999)
      );
      assertDateEqual(
        endOfMinute(new Date(2020, 0, 1, 12, 5, 30)),
        new Date(2020, 0, 1, 12, 5, 59, 999)
      );
      assertDateEqual(
        endOfMinute(new Date(2020, 0, 1, 12, 30)),
        new Date(2020, 0, 1, 12, 30, 59, 999)
      );
      assertDateEqual(
        endOfMinute(new Date(2020, 0, 1, 12, 30, 30)),
        new Date(2020, 0, 1, 12, 30, 59, 999)
      );
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

  describeInstance('endOfSecond', (endOfSecond) => {

    it('should correctly set the secon', () => {
      assertDateEqual(
        endOfSecond(new Date(2020, 0)),
        new Date(2020, 0, 1, 0, 0, 0, 999)
      );
      assertDateEqual(
        endOfSecond(new Date(2020, 0, 1, 12, 30, 5)),
        new Date(2020, 0, 1, 12, 30, 5, 999)
      );
      assertDateEqual(
        endOfSecond(new Date(2020, 0, 1, 12, 30, 5, 30)),
        new Date(2020, 0, 1, 12, 30, 5, 999)
      );
      assertDateEqual(
        endOfSecond(new Date(2020, 0, 1, 12, 30, 30)),
        new Date(2020, 0, 1, 12, 30, 30, 999)
      );
      assertDateEqual(
        endOfSecond(new Date(2020, 0, 1, 12, 30, 30, 30)),
        new Date(2020, 0, 1, 12, 30, 30, 999)
      );
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

  describeInstance('clone', (clone) => {

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

  describeInstance('isWeekday', (isWeekday) => {

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

  describeInstance('isWeekend', (isWeekend) => {

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

  describeInstance('relative', (relative) => {

    it('should format past relative dates', () => {
      assertEqual(relative(new Date(2019, 11, 31, 23, 59, 59)), '1 second ago');
      assertEqual(
        relative(new Date(2019, 11, 31, 23, 59, 58)),
        '2 seconds ago'
      );
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
      assertEqual(
        relative(new Date(2019, 11, 31, 23, 59, 59, 1)),
        '0 seconds ago'
      );
      assertEqual(
        relative(new Date(2019, 11, 31, 23, 59, 59, 500)),
        '0 seconds ago'
      );
      assertEqual(
        relative(new Date(2019, 11, 31, 23, 59, 59, 999)),
        '0 seconds ago'
      );
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

      assertEqual(
        relative(new Date(2019, 11, 31, 23, 59, 59, 1), 'ja'),
        getFormatted(-0, 'second')
      );
      assertEqual(
        relative(new Date(2019, 11, 31, 23, 59, 59), 'ja'),
        getFormatted(-1, 'second')
      );
      assertEqual(
        relative(new Date(2019, 11, 31, 23, 59), 'ja'),
        getFormatted(-1, 'minute')
      );
      assertEqual(
        relative(new Date(2019, 11, 31, 23), 'ja'),
        getFormatted(-1, 'hour')
      );
      assertEqual(
        relative(new Date(2019, 11, 31), 'ja'),
        getFormatted(-1, 'day')
      );
      assertEqual(
        relative(new Date(2019, 11, 25), 'ja'),
        getFormatted(-1, 'week')
      );
      assertEqual(
        relative(new Date(2019, 11), 'ja'),
        getFormatted(-1, 'month')
      );
      assertEqual(relative(new Date(2019, 6), 'ja'), getFormatted(-6, 'month'));
      assertEqual(relative(new Date(2019, 0), 'ja'), getFormatted(-1, 'year'));
      assertEqual(relative(new Date(2015, 0), 'ja'), getFormatted(-5, 'year'));
      assertEqual(relative(new Date(2010, 0), 'ja'), getFormatted(-10, 'year'));
      assertEqual(
        relative(new Date(1920, 0), 'ja'),
        getFormatted(-100, 'year')
      );
      assertEqual(
        relative(new Date(1020, 0), 'ja'),
        getFormatted(-1000, 'year')
      );

      assertEqual(
        relative(new Date(2020, 0, 1, 0, 0, 0, 1), 'ja'),
        getFormatted(0, 'second')
      );
      assertEqual(
        relative(new Date(2020, 0, 1, 0, 0, 1), 'ja'),
        getFormatted(1, 'second')
      );
      assertEqual(
        relative(new Date(2020, 0, 1, 0, 1), 'ja'),
        getFormatted(1, 'minute')
      );
      assertEqual(
        relative(new Date(2020, 0, 1, 1), 'ja'),
        getFormatted(1, 'hour')
      );
      assertEqual(relative(new Date(2020, 0, 2), 'ja'), getFormatted(1, 'day'));
      assertEqual(
        relative(new Date(2020, 0, 8), 'ja'),
        getFormatted(1, 'week')
      );
      assertEqual(
        relative(new Date(2020, 1, 1), 'ja'),
        getFormatted(1, 'month')
      );
      assertEqual(relative(new Date(2021, 0), 'ja'), getFormatted(1, 'year'));
      assertEqual(relative(new Date(2025, 0), 'ja'), getFormatted(5, 'year'));
      assertEqual(relative(new Date(2030, 0), 'ja'), getFormatted(10, 'year'));
      assertEqual(relative(new Date(2120, 0), 'ja'), getFormatted(100, 'year'));
      assertEqual(
        relative(new Date(3020, 0), 'ja'),
        getFormatted(1000, 'year')
      );
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
      assertEqual(
        relative(new Date(2019, 0), resolve),
        new Date(2019, 0).toISOString()
      );
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
      };
      assertEqual(relative(new Date(2021, 0, 2), options), '明日');
      assertEqual(relative(new Date(2021, 0, 15), options), '2週間後');
      assertEqual(
        relative(new Date(2021, 3), options),
        new Date(2021, 3).toISOString()
      );
      assertEqual(
        relative(new Date(2022, 0), options),
        new Date(2022, 0).toISOString()
      );
    });

    it('should allow a custom formatter object', () => {
      const options = {
        formatter: {
          format: (value, unit) => {
            return `${value} of your "${unit}s"`;
          },
        },
      };
      assertEqual(
        relative(new Date(2020, 0, 1, 0, 1), options),
        '1 of your "minutes"'
      );
      assertEqual(relative(new Date(2020, 0, 3), options), '2 of your "days"');
      assertEqual(relative(new Date(2025, 0), options), '5 of your "years"');
    });

    it('should format correctly for negative years', () => {
      assertEqual(relative(new Date(-1980, 0)), '4,000 years ago');
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

    it('should handle Issue #474', () => {
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

  describeInstance('format', (format) => {

    it('should use datetime long format with no arguments', () => {
      assertEqual(format(new Date(2020, 0)), 'January 1, 2020, 12:00 AM');
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
            '12:00:00 AM'
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_MEDIUM),
            '1:00:00 PM'
          );
        });

        it('should correctly apply short time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_SHORT),
            '12:00 AM'
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_SHORT),
            '1:00 PM'
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
            '00:00:00'
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_24_MEDIUM),
            '13:00:00'
          );
        });

        it('should correctly apply short time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.TIME_24_SHORT),
            '00:00'
          );
          assertEqual(
            format(new Date(2020, 0, 1, 13), Sugar.Date.TIME_24_SHORT),
            '13:00'
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
            'January 1, 2020, 12:00 AM'
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_LONG),
            'July 14, 2020, 1:00 PM'
          );
        });

        it('should correctly apply medium time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_MEDIUM),
            'Jan 1, 2020, 12:00 AM'
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_MEDIUM),
            'Jul 14, 2020, 1:00 PM'
          );
        });

        it('should correctly apply short time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_SHORT),
            '1/1/2020, 12:00 AM'
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_SHORT),
            '7/14/2020, 1:00 PM'
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
            'January 1, 2020, 00:00'
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_24_LONG),
            'July 14, 2020, 13:00'
          );
        });

        it('should correctly apply medium time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_24_MEDIUM),
            'Jan 1, 2020, 00:00'
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_24_MEDIUM),
            'Jul 14, 2020, 13:00'
          );
        });

        it('should correctly apply short time format', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_24_SHORT),
            '1/1/2020, 00:00'
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_24_SHORT),
            '7/14/2020, 13:00'
          );
        });
      });

      describe('datetime with zone', () => {

        it('should correctly apply datetime with zone', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_WITH_ZONE),
            `January 1, 2020, 12:00 AM ${getLocalTimeZoneName('short')}`
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_WITH_ZONE),
            `July 14, 2020, 1:00 PM ${getLocalTimeZoneName('short', true)}`
          );
        });

        it('should correctly apply datetime with long zone', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_WITH_LONG_ZONE),
            `January 1, 2020, 12:00 AM ${getLocalTimeZoneName('long')}`
          );
          assertEqual(
            format(
              new Date(2020, 6, 14, 13),
              Sugar.Date.DATETIME_WITH_LONG_ZONE
            ),
            `July 14, 2020, 1:00 PM ${getLocalTimeZoneName('long', true)}`
          );
        });

        it('should correctly apply 24-hour datetime with zone', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_24_WITH_ZONE),
            `January 1, 2020, 00:00 ${getLocalTimeZoneName('short')}`
          );
          assertEqual(
            format(new Date(2020, 6, 14, 13), Sugar.Date.DATETIME_24_WITH_ZONE),
            `July 14, 2020, 13:00 ${getLocalTimeZoneName('short', true)}`
          );
        });

        it('should correctly apply 24-hour datetime with long zone', () => {
          assertEqual(
            format(new Date(2020, 0), Sugar.Date.DATETIME_24_WITH_LONG_ZONE),
            `January 1, 2020, 00:00 ${getLocalTimeZoneName('long')}`
          );
          assertEqual(
            format(
              new Date(2020, 6, 14, 13),
              Sugar.Date.DATETIME_24_WITH_LONG_ZONE
            ),
            `July 14, 2020, 13:00 ${getLocalTimeZoneName('long', true)}`
          );
        });
      });

    });

    describe('formatting with a token string', () => {

      function getDateForYear(year) {
        const date = new Date(2020, 0);
        date.setFullYear(year);
        return date;
      }

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
        assertEqual(format(getDateForYear(2), 'y'), '2');
        assertEqual(format(getDateForYear(20), 'y'), '20');
        assertEqual(format(getDateForYear(200), 'y'), '200');
        assertEqual(format(getDateForYear(2000), 'y'), '2000');

        assertEqual(format(getDateForYear(2),    'yy'), '02');
        assertEqual(format(getDateForYear(2020), 'yy'), '20');
        assertEqual(format(getDateForYear(2050), 'yy'), '50');
        assertEqual(format(getDateForYear(2099), 'yy'), '99');
        assertEqual(format(getDateForYear(2100), 'yy'), '00');

        assertEqual(format(getDateForYear(2), 'yyy'), '002');
        assertEqual(format(getDateForYear(20), 'yyy'), '020');
        assertEqual(format(getDateForYear(200), 'yyy'), '200');
        assertEqual(format(getDateForYear(2000), 'yyy'), '2000');

        assertEqual(format(getDateForYear(2), 'yyyy'), '0002');
        assertEqual(format(getDateForYear(20), 'yyyy'), '0020');
        assertEqual(format(getDateForYear(200), 'yyyy'), '0200');
        assertEqual(format(getDateForYear(2000), 'yyyy'), '2000');

        assertEqual(format(getDateForYear(2), 'yyyyy'), '00002');
        assertEqual(format(getDateForYear(20), 'yyyyy'), '00020');
        assertEqual(format(getDateForYear(200), 'yyyyy'), '00200');
        assertEqual(format(getDateForYear(2000), 'yyyyy'), '02000');
      });

      it('should correctly format ISO week-numbering year token', () => {
        assertEqual(format(new Date(2005, 11, 31), 'Y'), '2005');
        assertEqual(format(new Date(2006, 0, 1),   'Y'), '2005');
        assertEqual(format(new Date(2019, 11, 31), 'Y'), '2020');
        assertEqual(format(new Date(2020, 0, 1),   'Y'), '2020');

        assertEqual(format(new Date(2005, 11, 31), 'YY'), '05');
        assertEqual(format(new Date(2006, 0, 1),   'YY'), '05');
        assertEqual(format(new Date(2019, 11, 31), 'YY'), '20');
        assertEqual(format(new Date(2020, 0, 1),   'YY'), '20');

        assertEqual(format(new Date(2005, 11, 31), 'YYY'), '2005');
        assertEqual(format(new Date(2006, 0, 1),   'YYY'), '2005');
        assertEqual(format(new Date(2019, 11, 31), 'YYY'), '2020');
        assertEqual(format(new Date(2020, 0, 1),   'YYY'), '2020');

        assertEqual(format(new Date(2005, 11, 31), 'YYYY'), '2005');
        assertEqual(format(new Date(2006, 0, 1),   'YYYY'), '2005');
        assertEqual(format(new Date(2019, 11, 31), 'YYYY'), '2020');
        assertEqual(format(new Date(2020, 0, 1),   'YYYY'), '2020');

        assertEqual(format(new Date(2005, 11, 31), 'YYYYY'), '02005');
        assertEqual(format(new Date(2006, 0, 1),   'YYYYY'), '02005');
        assertEqual(format(new Date(2019, 11, 31), 'YYYYY'), '02020');
        assertEqual(format(new Date(2020, 0, 1),   'YYYYY'), '02020');

        assertEqual(format(getDateForYear(1), 'Y'), '0');
        assertEqual(format(getDateForYear(1), 'YY'), '00');
        assertEqual(format(getDateForYear(1), 'YYY'), '000');
        assertEqual(format(getDateForYear(1), 'YYYY'), '0000');
        assertEqual(format(getDateForYear(1), 'YYYYY'), '00000');
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

        assertEqual(
          format(new Date(2020, 7), {
            format: 'MMMM',
            locale: 'ru',
          }),
          'августа'
        );

        assertEqual(
          format(new Date(2020, 7), {
            format: 'MMMM月',
            locale: 'ja',
          }),
          '8月'
        );
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

        assertEqual(
          format(new Date(2020, 7), {
            format: 'LLLL',
            locale: 'ru',
          }),
          'август'
        );

        assertEqual(
          format(new Date(2020, 7), {
            format: 'LLLL月',
            locale: 'ja',
          }),
          '8月'
        );

        assertEqual(
          format(new Date(2020, 7), {
            format: 'LLLLL',
            locale: 'ko',
          }),
          '8월'
        );
      });

      it('should correctly format ISO week-numbering week token', () => {
        assertEqual(format(new Date(2005, 11, 31), 'w'), '52');
        assertEqual(format(new Date(2006, 0, 1),   'w'), '52');
        assertEqual(format(new Date(2020, 11, 31), 'w'), '53');
        assertEqual(format(new Date(2019, 11, 31), 'w'), '1');
        assertEqual(format(new Date(2020, 0, 1),   'w'), '1');

        assertEqual(format(new Date(2005, 11, 31), 'ww'), '52');
        assertEqual(format(new Date(2006, 0, 1),   'ww'), '52');
        assertEqual(format(new Date(2020, 11, 31), 'ww'), '53');
        assertEqual(format(new Date(2019, 11, 31), 'ww'), '01');
        assertEqual(format(new Date(2020, 0, 1),   'ww'), '01');
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

        assertEqual(
          format(new Date(2020, 0), {
            format: 'EEEE',
            locale: 'fi',
          }),
          'keskiviikkona'
        );
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

        assertEqual(
          format(new Date(2020, 0), {
            format: 'cccc',
            locale: 'fi',
          }),
          'keskiviikko'
        );
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
          assertEqual(
            format(new Date(2020, 0), 'zzzz'),
            'Eastern Daylight Time'
          );
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
        assertEqual(
          format(new Date(2020, 0), 'd MMMM, yyyy'),
          '1 January, 2020'
        );
        assertEqual(
          format(new Date(2020, 0), 'MMMM d, yyyy'),
          'January 1, 2020'
        );
        assertEqual(format(new Date(2020, 0), 'dd-MM-yyyy'), '01-01-2020');
        assertEqual(format(new Date(2020, 0), 'MMMMyyyy'), 'January2020');
      });
    });

    describe('complex formatting with an options object', () => {

      it('should accept a locale option', () => {
        assertEqual(
          format(new Date(2020, 0), {
            locale: 'ja',
          }),
          new Intl.DateTimeFormat('ja').format(new Date(2020, 0))
        );
      });

      it('should accept a formatOptions object', () => {
        assertEqual(
          format(new Date(2020, 0), {
            formatOptions: {
              year: 'numeric',
              month: 'long',
            },
          }),
          'January 2020'
        );
      });

      it('should accept locale and formatOptions together', () => {
        assertEqual(
          format(new Date(2020, 0), {
            locale: 'ja',
            formatOptions: {
              year: 'numeric',
              month: 'long',
            },
          }),
          '2020年1月'
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
          'Wednesday, 12 AM'
        );
      });

      it('should accept format shorcuts with an overriding locale', () => {
        assertEqual(
          format(new Date(2020, 0), {
            locale: 'ja',
            formatOptions: Sugar.Date.DATE_FULL,
          }),
          '2020年1月1日水曜日'
        );
      });

      it('should be equivalent to toLocaleString with locale and shortcut', () => {
        assertEqual(
          format(new Date(2020, 0), {
            locale: 'ja',
            formatOptions: Sugar.Date.DATE_FULL,
          }),
          new Date(2020, 0).toLocaleString('ja', Sugar.Date.DATE_FULL)
        );
      });

      it('should be able to tokenize with an overriding locale', () => {
        assertEqual(
          format(new Date(2020, 0), {
            locale: 'ja',
            format: 'MMMM月',
          }),
          '1月'
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
          '１月'
        );
        assertEqual(
          format(new Date(2020, 0), {
            format: 'MMMM月',
            formatter: new Intl.DateTimeFormat('ja', {
              numberingSystem: 'hanidec',
            }),
          }),
          '一月'
        );
      });

      it('should throw an error when attempting to tokenize without a DateTimeFormat', () => {
        assertError(() => {
          format(new Date(2020, 0), {
            format: 'yyyy',
            formatter: {
              format: () => {
                return 'foo';
              },
            },
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

  describeInstance('isBefore', (isBefore) => {

    it('should test by timestamp when passing a date', () => {
      assertTrue(isBefore(new Date(2020, 0), new Date(2021, 0)));
      assertFalse(isBefore(new Date(2020, 0), new Date(2019, 0)));
    });

    it('should not be true when dates are equal', () => {
      assertFalse(isBefore(new Date(2020, 0), new Date(2020, 0)));
    });

    it('should not be true for invalid dates', () => {
      assertFalse(isBefore(new Date('invalid'), new Date('invalid')));
    });

    it('should accept a string to parse the date for comparison', () => {
      assertTrue(isBefore(new Date(2020, 0), 'January 15th'));
      assertTrue(isBefore(new Date(2020, 0), 'tomorrow'));
      assertTrue(isBefore(new Date(2020, 0), 'the end of the week'));
      assertFalse(isBefore(new Date(2020, 0), 'today'));
    });

    it('should throw an error for input that cannot be parsed', () => {
      assertError(() => {
        isBefore(new Date(2020, 0), 'invalid');
      });
    });

    it('should accept a DateProps object', () => {
      assertTrue(isBefore(new Date(2020, 0), { year: 2021 }));
      assertFalse(isBefore(new Date(2020, 0), { year: 2019 }));
    });

    it('should accept a rolled up date create object', () => {
      assertTrue(isBefore(
        new Date(2020, 0), {
          input: 'Monday',
          future: true,
        }
      ));
      assertFalse(isBefore(
        new Date(2020, 0), {
          input: 'Monday',
          past: true,
        }
      ));
    });

    it('should throw an error when explain option passed', () => {
      assertError(() => {
        isBefore(new Date(2020, 0), { input: 'tomorrow', explain: true });
      });
    });

    it('should handle irregular input', () => {
      assertError(() => {
        isBefore();
      });
      assertError(() => {
        isBefore(null);
      });
      assertError(() => {
        isBefore(1);
      });
      assertError(() => {
        isBefore(new Date());
      });
      assertError(() => {
        isBefore(new Date(), null);
      });
    });

  });

  describeInstance('isAfter', (isAfter) => {

    it('should test by timestamp when passing a date', () => {
      assertFalse(isAfter(new Date(2020, 0), new Date(2021, 0)));
      assertTrue(isAfter(new Date(2020, 0), new Date(2019, 0)));
    });

    it('should not be true when dates are equal', () => {
      assertFalse(isAfter(new Date(2020, 0), new Date(2020, 0)));
    });

    it('should not be true for invalid dates', () => {
      assertFalse(isAfter(new Date('invalid'), new Date('invalid')));
    });

    it('should accept a string to parse the date for comparison', () => {
      assertTrue(isAfter(new Date(2020, 5), 'January 15th'));
      assertTrue(isAfter(new Date(2020, 0), 'yesterday'));
      assertTrue(isAfter(new Date(2020, 0), 'the end of last week'));
      assertFalse(isAfter(new Date(2020, 0), 'tomorrow'));
      assertFalse(isAfter(new Date(2020, 0), 'today'));
    });

    it('should throw an error for input that cannot be parsed', () => {
      assertError(() => {
        isAfter(new Date(2020, 0), 'invalid');
      });
    });

    it('should accept a DateProps object', () => {
      assertFalse(isAfter(new Date(2020, 0), { year: 2021 }));
      assertTrue(isAfter(new Date(2020, 0), { year: 2019 }));
    });

    it('should accept a rolled up date create object', () => {
      assertFalse(isAfter(
        new Date(2020, 0), {
          input: 'Monday',
          future: true,
        }
      ));
      assertTrue(isAfter(
        new Date(2020, 0), {
          input: 'Monday',
          past: true,
        }
      ));
    });

    it('should throw an error when explain option passed', () => {
      assertError(() => {
        isAfter(new Date(2020, 0), { input: 'tomorrow', explain: true });
      });
    });

    it('should handle irregular input', () => {
      assertError(() => {
        isAfter();
      });
      assertError(() => {
        isAfter(null);
      });
      assertError(() => {
        isAfter(1);
      });
      assertError(() => {
        isAfter(new Date());
      });
      assertError(() => {
        isAfter(new Date(), null);
      });
    });

  });

  describeInstance('isBetween', (isBetween) => {

    it('should test by timestamp when passing a date', () => {
      assertFalse(isBetween(
        new Date(2020, 0),
        new Date(2021, 0),
        new Date(2022, 0)
      ));
      assertTrue(isBetween(
        new Date(2020, 0),
        new Date(2019, 0),
        new Date(2021, 0)
      ));
    });

    it('should be true when date is on the edge', () => {
      assertTrue(isBetween(
        new Date(2020, 0),
        new Date(2020, 0),
        new Date(2021, 0)
      ));
      assertTrue(isBetween(
        new Date(2021, 0),
        new Date(2020, 0),
        new Date(2021, 0)
      ));
    });

    it('should be true when order is reversed', () => {
      assertTrue(isBetween(
        new Date(2020, 0),
        new Date(2019, 0),
        new Date(2021, 0)
      ));
      assertTrue(isBetween(
        new Date(2020, 0),
        new Date(2021, 0),
        new Date(2020, 0)
      ));
    });

    it('should not be true for invalid dates', () => {
      assertFalse(isBetween(
        new Date('invalid'),
        new Date(2021, 0),
        new Date(2020, 0),
      ));
      assertFalse(isBetween(
        new Date(2020, 0),
        new Date('invalid'),
        new Date(2020, 0)
      ));
      assertFalse(isBetween(
        new Date(2020, 0),
        new Date(2021, 0),
        new Date('invalid'),
      ));
      assertFalse(isBetween(
        new Date('invalid'),
        new Date('invalid'),
        new Date('invalid'),
      ));
    });

    it('should accept a string to parse the date for comparison', () => {
      assertTrue(isBetween(new Date(2020, 0), 'yesterday', 'tomorrow'));
      assertFalse(isBetween(new Date(2020, 0), 'February', 'July'));
      assertTrue(isBetween(new Date(2020, 0), '2019', '2021'));
    });

    it('should report weekdays correctly', () => {
      assertFalse(isBetween(new Date(2019, 11, 29), 'monday', 'friday'));
      assertTrue(isBetween(new Date(2019, 11, 30), 'monday', 'friday'));
      assertTrue(isBetween(new Date(2019, 11, 31), 'monday', 'friday'));
      assertTrue(isBetween(new Date(2020, 0, 1), 'monday', 'friday'));
      assertTrue(isBetween(new Date(2020, 0, 2), 'monday', 'friday'));
      assertTrue(isBetween(new Date(2020, 0, 3), 'monday', 'friday'));
      assertFalse(isBetween(new Date(2020, 0, 4), 'monday', 'friday'));
    });

    it('should accept a margin of error', () => {
      assertTrue(isBetween(
        new Date(2020, 0),
        '1 hour from now',
        '5 hours from now',
        60 * 60 * 1000,
      ));
    });

    it('should report edges correctly', () => {
      assertTrue(isBetween(
        new Date(2020, 0),
        'the beginning of the week',
        'the end of the week',
      ));
    });

    it('should accept DateProps objects', () => {
      assertFalse(isBetween(
        new Date(2020, 0),
        { year: 2021, month: 0 },
        { year: 2022, month: 0 },
      ));
      assertTrue(isBetween(
        new Date(2020, 0),
        { year: 2019, month: 0 },
        { year: 2021, month: 0 },
      ));
    });

    it('should accept a rolled up date create object', () => {
      assertTrue(isBetween(
        new Date(2020, 0), {
          input: 'Monday',
          past: true,
        }, {
          input: 'Monday',
          future: true,
        }
      ));
    });

    it('should throw an error when explain option passed', () => {
      assertError(() => {
        isBetween(
          new Date(2020, 0),
          { input: 'yesterday', explain: true },
          { input: 'tomorrow', explain: true },
        );
      });
    });

    it('should handle irregular input', () => {
      assertError(() => {
        isBetween();
      });
      assertError(() => {
        isBetween(null);
      });
      assertError(() => {
        isBetween(1);
      });
      assertError(() => {
        isBetween(new Date());
      });
      assertError(() => {
        isBetween(new Date(), null);
      });
    });

  });

  describeInstance('is', (is) => {

    it('should compare two dates', () => {
      assertTrue(is(new Date(), new Date()));
    });

    it('should compare date to a number', () => {
      assertTrue(is(new Date(), new Date().getTime()));
    });

    it('should compare date to parsed input', () => {
      assertTrue(is(new Date(), 'now'));
      assertTrue(is(new Date(), 'today'));
      assertFalse(is(new Date(), 'tomorrow'));
      assertFalse(is(new Date(2020, 5), 'July'));
      assertTrue(is(new Date(2020, 6), 'July'));
      assertFalse(is(new Date(2020, 7), 'July'));
      assertTrue(is(new Date(2020, 1, 29), 'the last day of February'));
    });

    it('should compare relative times', () => {
      assertFalse(is(new Date(2020, 0, 1, 0, 4, 59), '5 minutes from now'));
      assertTrue(is(new Date(2020, 0, 1, 0, 5), '5 minutes from now'));
      assertTrue(is(new Date(2020, 0, 1, 0, 5, 59), '5 minutes from now'));
      assertFalse(is(new Date(2020, 0, 1, 0, 6), '5 minutes from now'));
    });

    it('should allow an optional margin of error', () => {
      assertTrue(is(new Date(2020, 5, 30, 23), 'July', 60 * 60 * 1000));
      assertFalse(is(new Date(2020, 5, 30, 22), 'July', 60 * 60 * 1000));
      assertTrue(is(new Date(2020, 7), 'July', 1000));
      assertTrue(is(new Date(2020, 7, 1, 0, 0, 0, 999), 'July', 1000));
      assertFalse(is(new Date(2020, 7, 1, 0, 0, 1), 'July', 1000));
    });

    it('should allow a DateProps object', () => {
      assertTrue(is(
        new Date(2020, 0),
        { year: 2020 },
      ));
      assertTrue(is(
        new Date(2020, 11, 31, 23, 59, 59, 999),
        { year: 2020 },
      ));
      assertTrue(is(
        new Date(2020, 11, 31, 23, 59, 59, 999),
        { year: 2020, month: 11 },
      ));
      assertFalse(is(
        new Date(2020, 11, 31, 23, 59, 59, 999),
        { year: 2020, month: 10 },
      ));
    });

    it('should allow a rolled up options object', () => {
      assertTrue(is(
        new Date(2020, 7, 10),
        { input: '10/8', locale: 'en-GB' },
      ));
      assertTrue(is(
        new Date(2020, 7, 10, 23, 59, 59, 999),
        { input: '10/8', locale: 'en-GB' },
      ));
      assertFalse(is(
        new Date(2020, 7, 11),
        { input: '10/8', locale: 'en-GB' },
      ));
    });

    it('should handle irregular input', () => {
      assertFalse(is(new Date('invalid'), new Date('invalid')));
      assertFalse(is(new Date(2020, 0), new Date('invalid')));
      assertFalse(is(new Date('invalid'), new Date(2020, 0)));
      assertError(() => {
        is(new Date());
      });
      assertError(() => {
        is();
      });
      assertError(() => {
        is(null);
      });
    });

    it('should handle Issue #160', () => {
      assertFalse(is(new Date(2013, 11), 'November 2013'));
      assertTrue(is(new Date(2013, 10), 'November 2013'));
    });

  });

  describeInstance('get', (get) => {

    it('should be able to get a date relative to another', () => {
      assertDateEqual(get(new Date(2020, 6), 'Monday'), new Date(2020, 5, 29));
      assertDateEqual(get(new Date(2020, 0), 'December'), new Date(2020, 11));
      assertDateEqual(get(new Date(2020, 1), 'next Tuesday'), new Date(2020, 1, 4));
      assertDateEqual(get(new Date(2020, 9), '2 weeks ago'), new Date(2020, 8, 17));
      assertDateEqual(get(new Date(2020, 0), '2 hours ago'), new Date(2019, 11, 31, 22));
      assertDateEqual(get(new Date(2020, 0), '2 minutes ago'), new Date(2019, 11, 31, 23, 58));
      assertDateEqual(get(new Date(2020, 0), '2 seconds ago'), new Date(2019, 11, 31, 23, 59, 58));
    });

    it('should return null if input could not be parsed', () => {
      assertNull(get(new Date(2020, 0), 'invalid'));
    });

    it('should return a second date if passed directly', () => {
      assertDateEqual(get(new Date(2020, 6), new Date(2021, 9)), new Date(2021, 9));
    });

    it('should return a second date if passed directly', () => {
      assertDateEqual(get(new Date(2020, 6), new Date(2021, 9)), new Date(2021, 9));
    });

    it('should return reference date if no second argument', () => {
      assertDateEqual(get(new Date(2020, 0)), new Date(2020, 0));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        get();
      });
      assertError(() => {
        get(null);
      });
    });

    it('should handle Issue #620', () => {
      assertDateEqual(get(
        new Date(1833, 0), 'December'),
        new Date(1833, 11),
      );
      assertDateEqual(get(
        new Date(1833, 0), {
          input: 'December',
          past: true,
        }),
        new Date(1832, 11),
      );
      assertDateEqual(get(
        new Date(1833, 0), 'Saturday'),
        new Date(1833, 0, 5),
      );
      assertDateEqual(get(
        new Date(1833, 0), {
          input: 'Saturday',
          past: true,
        }),
        new Date(1832, 11, 29),
      );
    });

  });

});

describeNamespace('Number', () => {

  beforeAll(() => {
    // Set system time to 2020-01-01
    setSystemTime(new Date(2020, 0));
  });

  describeInstance('year,years', (years) => {

    it('should get the correct number of milliseconds for years', () => {
      assertEqual(years(1), 31556952000);
      assertEqual(years(-1), -31556952000);
      assertEqual(years(5), 5 * 31556952000);
      assertEqual(years(0), 0);
    });

    it('should have singular alias', () => {
      assertEqual(Sugar.Number.year(1), 31556952000);
    });

    it('should handle irregular input', () => {
      assertEqual(years(null), 0);
      assertEqual(years('1'), 31556952000);
      assertNaN(years({}));
      assertNaN(years(undefined));
      assertNaN(years());
    });
  });

  describeInstance('month,months', (months) => {

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

  describeInstance('week,weeks', (weeks) => {

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

  describeInstance('day,days', (days) => {

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

  describeInstance('hour,hours', (hours) => {

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

  describeInstance('minute,minutes', (minutes) => {

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

  describeInstance('second,seconds', (seconds) => {

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

  describeInstance('yearAgo,yearsAgo', (yearsAgo) => {

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

  describeInstance('monthAgo,monthsAgo', (monthsAgo) => {

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

  describeInstance('weekAgo,weeksAgo', (weeksAgo) => {

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

  describeInstance('dayAgo,daysAgo', (daysAgo) => {

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

  describeInstance('hourAgo,hoursAgo', (hoursAgo) => {

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

  describeInstance('minuteAgo,minutesAgo', (minutesAgo) => {

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

  describeInstance('secondAgo,secondsAgo', (secondsAgo) => {

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

  describeInstance('millisecondAgo,millisecondsAgo', (millisecondsAgo) => {

    it('should get the correct date', () => {
      assertDateEqual(millisecondsAgo(0), new Date(2020, 0));
      assertDateEqual(
        millisecondsAgo(1),
        new Date(2019, 11, 31, 23, 59, 59, 999)
      );
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

  describeInstance('yearFromNow,yearsFromNow', (yearsFromNow) => {

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

  describeInstance('monthFromNow,monthsFromNow', (monthsFromNow) => {

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

  describeInstance('weekFromNow,weeksFromNow', (weeksFromNow) => {

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

  describeInstance('dayFromNow,daysFromNow', (daysFromNow) => {

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

  describeInstance('hourFromNow,hoursFromNow', (hoursFromNow) => {

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

  describeInstance('minuteFromNow,minutesFromNow', (minutesFromNow) => {

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

  describeInstance('secondFromNow,secondsFromNow', (secondsFromNow) => {

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

  describeInstance('millisecondFromNow,millisecondsFromNow', (msFromNow) => {

      it('should get the correct date', () => {
        assertDateEqual(msFromNow(0), new Date(2020, 0));
        assertDateEqual(
          msFromNow(1),
          new Date(2020, 0, 1, 0, 0, 0, 1)
        );
        assertDateEqual(
          msFromNow(-1),
          new Date(2019, 11, 31, 23, 59, 59, 999)
        );
      });

      it('should handle irregular input', () => {
        assertError(() => {
          msFromNow();
        });
        assertError(() => {
          msFromNow(NaN);
        });
        assertError(() => {
          msFromNow(null);
        });
      });
    }
  );

  describeInstance('yearBefore,yearsBefore', (yearsBefore) => {

    it('should get the correct date', () => {
      assertDateEqual(yearsBefore(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(yearsBefore(1, new Date(2020, 0)), new Date(2019, 0));
      assertDateEqual(yearsBefore(-1, new Date(2020, 0)), new Date(2021, 0));
    });

    it('should parse a string', () => {
      assertDateEqual(yearsBefore(5, '2008'), new Date(2003, 0));
    });

    it('should not modify the input date', () => {
      const date = new Date(2020, 0);
      yearsBefore(5, date);
      assertDateEqual(date, new Date(2020, 0));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        yearsBefore();
      });
      assertError(() => {
        yearsBefore(NaN);
      });
      assertError(() => {
        yearsBefore(null);
      });
    });
  });

  describeInstance('monthBefore,monthsBefore', (monthsBefore) => {

    it('should get the correct date', () => {
      assertDateEqual(monthsBefore(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(monthsBefore(1, new Date(2020, 0)), new Date(2019, 11));
      assertDateEqual(monthsBefore(-1, new Date(2020, 0)), new Date(2020, 1));
    });

    it('should parse a string', () => {
      assertDateEqual(monthsBefore(3, 'June'), new Date(2020, 2));
      assertDateEqual(monthsBefore(5, 'today'), new Date(2019, 7, 1));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        monthsBefore();
      });
      assertError(() => {
        monthsBefore(NaN);
      });
      assertError(() => {
        monthsBefore(null);
      });
    });
  });

  describeInstance('weekBefore,weeksBefore', (weeksBefore) => {

    it('should get the correct date', () => {
      assertDateEqual(weeksBefore(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(weeksBefore(1, new Date(2020, 0)), new Date(2019, 11, 25));
      assertDateEqual(weeksBefore(-1, new Date(2020, 0)), new Date(2020, 0, 8));
    });

    it('should parse a string', () => {
      assertDateEqual(weeksBefore(2, 'Monday'), new Date(2019, 11, 16));
      assertDateEqual(weeksBefore(5, 'today'), new Date(2019, 10, 27));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        weeksBefore();
      });
      assertError(() => {
        weeksBefore(NaN);
      });
      assertError(() => {
        weeksBefore(null);
      });
    });
  });

  describeInstance('dayBefore,daysBefore', (daysBefore) => {

    it('should get the correct date', () => {
      assertDateEqual(daysBefore(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(daysBefore(1, new Date(2020, 0)), new Date(2019, 11, 31));
      assertDateEqual(daysBefore(-1, new Date(2020, 0)), new Date(2020, 0, 2));
    });

    it('should parse a string', () => {
      assertDateEqual(daysBefore(2, 'Monday'), new Date(2019, 11, 28));
      assertDateEqual(daysBefore(5, 'last week monday'), new Date(2019, 11, 18));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        daysBefore();
      });
      assertError(() => {
        daysBefore(NaN);
      });
      assertError(() => {
        daysBefore(null);
      });
    });
  });

  describeInstance('hourBefore,hoursBefore', (hoursBefore) => {

    it('should get the correct date', () => {
      assertDateEqual(hoursBefore(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(hoursBefore(1, new Date(2020, 0)), new Date(2019, 11, 31, 23));
      assertDateEqual(hoursBefore(-1, new Date(2020, 0)), new Date(2020, 0, 1, 1));
    });

    it('should parse a string', () => {
      assertDateEqual(hoursBefore(2, 'Monday'), new Date(2019, 11, 29, 22));
      assertDateEqual(hoursBefore(5, 'the first day of 2005'), new Date(2004, 11, 31, 19));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        hoursBefore();
      });
      assertError(() => {
        hoursBefore(NaN);
      });
      assertError(() => {
        hoursBefore(null);
      });
    });
  });

  describeInstance('minuteBefore,minutesBefore', (minutesBefore) => {

    it('should get the correct date', () => {
      assertDateEqual(minutesBefore(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(minutesBefore(1, new Date(2020, 0)), new Date(2019, 11, 31, 23, 59));
      assertDateEqual(minutesBefore(-1, new Date(2020, 0)), new Date(2020, 0, 1, 0, 1));
    });

    it('should parse a string', () => {
      assertDateEqual(minutesBefore(2, 'Monday'), new Date(2019, 11, 29, 23, 58));
      assertDateEqual(minutesBefore(5, 'April 2nd, 1998'), new Date(1998, 3, 1, 23, 55));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        minutesBefore();
      });
      assertError(() => {
        minutesBefore(NaN);
      });
      assertError(() => {
        minutesBefore(null);
      });
    });
  });

  describeInstance('secondBefore,secondsBefore', (secondsBefore) => {

    it('should get the correct date', () => {
      assertDateEqual(secondsBefore(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(secondsBefore(1, new Date(2020, 0)), new Date(2019, 11, 31, 23, 59, 59));
      assertDateEqual(secondsBefore(-1, new Date(2020, 0)), new Date(2020, 0, 1, 0, 0, 1));
    });

    it('should parse a string', () => {
      assertDateEqual(secondsBefore(2, 'Monday'), new Date(2019, 11, 29, 23, 59, 58));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        secondsBefore();
      });
      assertError(() => {
        secondsBefore(NaN);
      });
      assertError(() => {
        secondsBefore(null);
      });
    });
  });

  describeInstance('millisecondBefore,millisecondsBefore', (millisecondsBefore) => {

    it('should get the correct date', () => {
      assertDateEqual(millisecondsBefore(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(
        millisecondsBefore(1, new Date(2020, 0)),
        new Date(2019, 11, 31, 23, 59, 59, 999)
      );
      assertDateEqual(millisecondsBefore(-1, new Date(2020, 0)), new Date(2020, 0, 1, 0, 0, 0, 1));
    });

    it('should parse a string', () => {
      assertDateEqual(millisecondsBefore(2, 'Monday'), new Date(2019, 11, 29, 23, 59, 59, 998));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        millisecondsBefore();
      });
      assertError(() => {
        millisecondsBefore(NaN);
      });
      assertError(() => {
        millisecondsBefore(null);
      });
    });
  });

  describeInstance('yearAfter,yearsAfter', (yearsAfter) => {

    it('should get the correct date', () => {
      assertDateEqual(yearsAfter(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(yearsAfter(1, new Date(2020, 0)), new Date(2021, 0));
      assertDateEqual(yearsAfter(-1, new Date(2020, 0)), new Date(2019, 0));
    });

    it('should parse a string', () => {
      assertDateEqual(yearsAfter(2, '2008'), new Date(2010, 0));
    });

    it('should not modify the input date', () => {
      const date = new Date(2020, 0);
      yearsAfter(5, date);
      assertDateEqual(date, new Date(2020, 0));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        yearsAfter();
      });
      assertError(() => {
        yearsAfter(NaN);
      });
      assertError(() => {
        yearsAfter(null);
      });
    });
  });

  describeInstance('monthAfter,monthsAfter', (monthsAfter) => {

    it('should get the correct date', () => {
      assertDateEqual(monthsAfter(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(monthsAfter(1, new Date(2020, 0)), new Date(2020, 1));
      assertDateEqual(monthsAfter(-1, new Date(2020, 0)), new Date(2019, 11));
    });

    it('should parse a string', () => {
      assertDateEqual(monthsAfter(2, 'June'), new Date(2020, 7));
      assertDateEqual(monthsAfter(5, 'now'), new Date(2020, 5));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        monthsAfter();
      });
      assertError(() => {
        monthsAfter(NaN);
      });
      assertError(() => {
        monthsAfter(null);
      });
    });
  });

  describeInstance('weekAfter,weeksAfter', (weeksAfter) => {

    it('should get the correct date', () => {
      assertDateEqual(weeksAfter(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(weeksAfter(1, new Date(2020, 0)), new Date(2020, 0, 8));
      assertDateEqual(weeksAfter(-1, new Date(2020, 0)), new Date(2019, 11, 25));
    });

    it('should parse a string', () => {
      assertDateEqual(weeksAfter(5, 'now'), new Date(2020, 1, 5));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        weeksAfter();
      });
      assertError(() => {
        weeksAfter(NaN);
      });
      assertError(() => {
        weeksAfter(null);
      });
    });
  });

  describeInstance('dayAfter,daysAfter', (daysAfter) => {

    it('should get the correct date', () => {
      assertDateEqual(daysAfter(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(daysAfter(1, new Date(2020, 0)), new Date(2020, 0, 2));
      assertDateEqual(daysAfter(-1, new Date(2020, 0)), new Date(2019, 11, 31));
    });

    it('should parse a string', () => {
      assertDateEqual(daysAfter(2, 'Friday'), new Date(2020, 0, 5));
      assertDateEqual(daysAfter(5, 'next tuesday'), new Date(2020, 0, 12));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        daysAfter();
      });
      assertError(() => {
        daysAfter(NaN);
      });
      assertError(() => {
        daysAfter(null);
      });
    });
  });

  describeInstance('hourAfter,hoursAfter', (hoursAfter) => {

    it('should get the correct date', () => {
      assertDateEqual(hoursAfter(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(hoursAfter(1, new Date(2020, 0)), new Date(2020, 0, 1, 1));
      assertDateEqual(hoursAfter(-1, new Date(2020, 0)), new Date(2019, 11, 31, 23));
    });

    it('should parse a string', () => {
      assertDateEqual(hoursAfter(2, 'Friday'), new Date(2020, 0, 3, 2));
      assertDateEqual(hoursAfter(5, 'the last day of 2006'), new Date(2006, 11, 31, 5));
      assertDateEqual(hoursAfter(5, 'the end of 2006'), new Date(2007, 0, 1, 4, 59, 59, 999));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        hoursAfter();
      });
      assertError(() => {
        hoursAfter(NaN);
      });
      assertError(() => {
        hoursAfter(null);
      });
    });
  });

  describeInstance('minuteAfter,minutesAfter', (minutesAfter) => {

    it('should get the correct date', () => {
      assertDateEqual(minutesAfter(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(minutesAfter(1, new Date(2020, 0)), new Date(2020, 0, 1, 0, 1));
      assertDateEqual(minutesAfter(-1, new Date(2020, 0)), new Date(2019, 11, 31, 23, 59));
    });

    it('should parse a string', () => {
      assertDateEqual(minutesAfter(2, 'Friday'), new Date(2020, 0, 3, 0, 2));
      assertDateEqual(minutesAfter(5, 'January 2nd, 2005'), new Date(2005, 0, 2, 0, 5));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        minutesAfter();
      });
      assertError(() => {
        minutesAfter(NaN);
      });
      assertError(() => {
        minutesAfter(null);
      });
    });
  });

  describeInstance('secondAfter,secondsAfter', (secondsAfter) => {

    it('should get the correct date', () => {
      assertDateEqual(secondsAfter(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(secondsAfter(1, new Date(2020, 0)), new Date(2020, 0, 1, 0, 0, 1));
      assertDateEqual(secondsAfter(-1, new Date(2020, 0)), new Date(2019, 11, 31, 23, 59, 59));
    });

    it('should parse a string', () => {
      assertDateEqual(secondsAfter(2, 'Friday'), new Date(2020, 0, 3, 0, 0, 2));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        secondsAfter();
      });
      assertError(() => {
        secondsAfter(NaN);
      });
      assertError(() => {
        secondsAfter(null);
      });
    });
  });

  describeInstance('millisecondAfter,millisecondsAfter', (msAfter) => {

    it('should get the correct date', () => {
      assertDateEqual(msAfter(0, new Date(2020, 0)), new Date(2020, 0));
      assertDateEqual(
        msAfter(1, new Date(2020, 0)),
        new Date(2020, 0, 1, 0, 0, 0, 1)
      );
      assertDateEqual(
        msAfter(-1, new Date(2020, 0)),
        new Date(2019, 11, 31, 23, 59, 59, 999)
      );
    });

    it('should parse a string', () => {
      assertDateEqual(msAfter(2, 'Friday'), new Date(2020, 0, 3, 0, 0, 0, 2));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        msAfter();
      });
      assertError(() => {
        msAfter(NaN);
      });
      assertError(() => {
        msAfter(null);
      });
    });

  });

  describeInstance('duration', (duration) => {

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
      assertEqual(
        duration(1000 * 365.2425 * 24 * 60 * 60 * 1000),
        '1,000 years'
      );
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
      assertEqual(duration(0, 'ja'), '0 ミリ秒');
      assertEqual(duration(1000, 'ja'), '1 秒');
      assertEqual(duration(60 * 1000, 'ja'), '1 分');
      assertEqual(duration(60 * 60 * 1000, 'ja'), '1 時間');
      assertEqual(duration(24 * 60 * 60 * 1000, 'ja'), '1 日');
      assertEqual(duration(7 * 24 * 60 * 60 * 1000, 'ja'), '1 週間');
      assertEqual(duration(31 * 24 * 60 * 60 * 1000, 'ja'), '1 か月');
      assertEqual(duration(365.2425 * 24 * 60 * 60 * 1000, 'ja'), '1 年');
    });

    it('should handle irregular input', () => {
      assertEqual(duration(NaN), 'NaN milliseconds');
      assertError(() => {
        duration();
      });
    });
  });

});

describe('Interop', () => {

  it('should be able to pass a chainable into isBefore', () => {
    const d1 = new Sugar.Date(2020, 0);
    const d2 = new Sugar.Date(2020, 1);
    assertTrue(d1.isBefore(d2));
  })

});
