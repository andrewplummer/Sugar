'use strict';

namespace('Date', function () {
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

  describeInstance('isValid', function (isValid) {
    it('should be valid for valid dates', () => {
      assertTrue(isValid(new Date()));
    });

    it('should be invalid for valid dates', () => {
      assertFalse(isValid(new Date(NaN)));
    });

    it('should handle irregular input', () => {
      assertError(() => {
        isValid();
      });
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
      assertDateEqual(
        set(new Date(2020, 0), { month: 1 }),
        new Date(2020, 1)
      );
      assertDateEqual(
        set(new Date(2020, 0), { month: 11 }),
        new Date(2020, 11)
      );
      assertDateEqual(
        set(new Date(2020, 0), { month: 21 }),
        new Date(2021, 9)
      );
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
      assertDateEqual(
        set(new Date(2020, 0), { day: 7 }),
        new Date(2020, 0, 5)
      );
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
        set(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { year: 2021 },
          true
        ),
        new Date(2021, 0)
      );
      assertDateEqual(
        set(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { month: 0 },
          true
        ),
        new Date(2020, 0)
      );
      assertDateEqual(
        set(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { date: 1 },
          true
        ),
        new Date(2020, 2, 1)
      );
      assertDateEqual(
        set(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { day: 5 },
          true
        ),
        new Date(2020, 3, 3)
      );
      assertDateEqual(
        set(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { weekday: 5 },
          true
        ),
        new Date(2020, 3, 3)
      );
      assertDateEqual(
        set(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { hours: 20 },
          true
        ),
        new Date(2020, 2, 31, 20)
      );
      assertDateEqual(
        set(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { minutes: 30 },
          true
        ),
        new Date(2020, 2, 31, 11, 30)
      );
      assertDateEqual(
        set(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { seconds: 30 },
          true
        ),
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
        set(
          new Date(2020, 0),
          { date: 15, day: 1 },
          true
        ),
        new Date(2020, 0, 15)
      );
      assertDateEqual(
        set(
          new Date(2020, 0),
          { day: 1, date: 15 },
          true
        ),
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
        set(new Date(2020, 11, 31, 23, 59, 59, 999), {
          year: 2010,
          minutes: 30,
        }, true),
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
        set(new Date(2010, 0, 31), {
          month: 1,
        }, true),
        new Date(2010, 1),
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
        set(new Date(2010, 11, 9, 17), {
          year: 1998,
          month: 3,
          day: 3,
        }, true),
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
        advance(new Date(2020, 0), { year: 1 }),
        new Date(2021, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { year: 10 }),
        new Date(2030, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { year: -5 }),
        new Date(2015, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { year: 0 }),
        new Date(2020, 0)
      );
    });

    it('should advance the month', () => {
      assertDateEqual(
        advance(new Date(2020, 1), { month: 1 }),
        new Date(2020, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { month: 11 }),
        new Date(2021, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { month: 21 }),
        new Date(2021, 10)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { month: -1 }),
        new Date(2020, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { month: -4 }),
        new Date(2019, 9)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { month: 0 }),
        new Date(2020, 1)
      );
    });

    it('should advance the week', () => {
      assertDateEqual(
        advance(new Date(2020, 0), { week: 1 }),
        new Date(2020, 0, 8)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { week: 2 }),
        new Date(2020, 0, 15)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { week: -1 }),
        new Date(2019, 11, 25)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { week: -2 }),
        new Date(2019, 11, 18)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { week: 0 }),
        new Date(2020, 0)
      );
    });

    it('should advance the date', () => {
      assertDateEqual(
        advance(new Date(2020, 0), { date: 2 }),
        new Date(2020, 0, 3)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { date: 14 }),
        new Date(2020, 0, 15)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { date: 31 }),
        new Date(2020, 1, 1)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { date: 37 }),
        new Date(2020, 1, 7)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { date: 0 }),
        new Date(2020, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { date: -1 }),
        new Date(2019, 11, 31)
      );
    });

    it('should advance by day as an alias for date', () => {
      assertDateEqual(
        advance(new Date(2020, 0), { day: 2 }),
        new Date(2020, 0, 3)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { day: 14 }),
        new Date(2020, 0, 15)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { day: 31 }),
        new Date(2020, 1, 1)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { day: 37 }),
        new Date(2020, 1, 7)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { day: 0 }),
        new Date(2020, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { day: -1 }),
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
        advance(new Date(2020, 0), { years: 1 }),
        new Date(2021, 0)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { months: 1 }),
        new Date(2020, 1)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { weeks: 1 }),
        new Date(2020, 0, 8)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { weekday: 1 }),
        new Date(2020, 0, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 0), { days: 1 }),
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
        advance(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { year: 1 },
          true
        ),
        new Date(2021, 0)
      );
      assertDateEqual(
        advance(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { month: 1 },
          true
        ),
        new Date(2020, 3)
      );
      assertDateEqual(
        advance(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { date: 1 },
          true
        ),
        new Date(2020, 3, 1)
      );
      assertDateEqual(
        advance(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { day: 5 },
          true
        ),
        new Date(2020, 3, 5)
      );
      assertDateEqual(
        advance(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { weekday: 5 },
          true
        ),
        new Date(2020, 3, 5)
      );
      assertDateEqual(
        advance(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { hours: 20 },
          true
        ),
        new Date(2020, 3, 1, 7)
      );
      assertDateEqual(
        advance(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { minutes: 30 },
          true
        ),
        new Date(2020, 2, 31, 12, 29)
      );
      assertDateEqual(
        advance(
          new Date(2020, 2, 31, 11, 59, 59, 999),
          { seconds: 30 },
          true
        ),
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
        advance(
          new Date(2020, 0),
          { date: 5, day: 7 },
          true
        ),
        new Date(2020, 0, 6)
      );
      assertDateEqual(
        advance(
          new Date(2020, 0),
          { day: 7, date: 5 },
          true
        ),
        new Date(2020, 0, 6)
      );
    });

    it('should handle non-contiguous units', () => {
      assertDateEqual(
        advance(new Date(2020, 1), {
          year: 2,
          minutes: 30,
        }),
        new Date(2022, 1, 1, 0, 30)
      );
      assertDateEqual(
        advance(new Date(2020, 1), {
          year: 2,
          minutes: -30,
        }),
        new Date(2022, 0, 31, 23, 30)
      );
      assertDateEqual(
        advance(new Date(2020, 11, 31, 23, 59, 59, 999), {
          year: 2,
          minutes: 30,
        }),
        new Date(2023, 0, 1, 0, 29, 59, 999)
      );
      assertDateEqual(
        advance(new Date(2020, 11, 31, 23, 59, 59, 999), {
          year: 2,
          minutes: 30,
        }, true),
        new Date(2023, 0, 1, 0, 29)
      );
    });

    it('should handle complex cases', () => {
      assertDateEqual(
        advance(new Date(2020, 1), {
          year: 2,
          month: 7,
          date: 5,
          hours: 3,
          minutes: 40,
          seconds: 12,
        }),
        new Date(2022, 8, 6, 3, 40, 12)
      );
      assertDateEqual(
        advance(new Date(2010, 7, 25, 11, 45, 20), {
          year: 1,
          month: -3,
          days: 2,
          hours: 8,
          minutes: 12,
          seconds: -2,
          milliseconds: 44
        }),
        new Date(2011, 4, 27, 19, 57, 18, 44)
      );
    });

    it('should allow a string shortcut', () => {
      assertDateEqual(
        advance(new Date(2020, 0), '3 years'),
        new Date(2023, 0)
      );
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
      assertDateEqual(
        advance(new Date(2020, 0), '1 year'),
        new Date(2021, 0)
      );
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
          year: 2,
          month: 14,
          minutes: 140,
          seconds: 140,
        }),
        new Date(2023, 3, 1, 2, 22, 20)
      );
      assertDateEqual(
        advance(new Date(2020, 1), {
          seconds: 140,
          minutes: 140,
          month: 14,
          year: 2,
        }),
        new Date(2023, 3, 1, 2, 22, 20)
      );
    });

    it('should allow advancing from a numeric timestamp', () => {
      assertDateEqual(advance(new Date(2020, 0), 24 * 60 * 60 * 1000), new Date(2020, 0, 2));
      assertDateEqual(advance(new Date(2020, 0), 29 * 60 * 60 * 1000, true), new Date(2020, 0, 2, 5));
    });

    it('should not traverse into different month when not enough days', () => {
      assertDateEqual(
        advance(new Date(2011, 0, 31), {
          month: 1,
        }),
        new Date(2011, 1, 28)
      );
    });

    it('should still advance days after month traversal prevented', () => {
      assertDateEqual(
        advance(new Date(2011, 0, 31), {
          month: 1,
          days: 3,
        }),
        new Date(2011, 2, 3),
      );
    });

    it('should not accidentally traverse into different month', () => {
      assertDateEqual(
        advance(new Date(2011, 0, 15), { month: 1, date: 2 }),
        new Date(2011, 1, 17)
      );
      assertDateEqual(
        advance(new Date(2011, 0, 15), { date: 2, month: 1 }),
        new Date(2011, 1, 17)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { month: 0, date: 15 }),
        new Date(2020, 1, 16)
      );
      assertDateEqual(
        advance(new Date(2020, 1), { date: 15, month: 0 }),
        new Date(2020, 1, 16)
      );
    });

    it('should not accidentally traverse into different month on reset', () => {
      assertDateEqual(
        advance(new Date(2010, 0, 31), {
          month: 1,
        }, true),
        new Date(2010, 1),
      );
    });

    it('should not accidentally traverse into a different time during DST shift', () => {
      assertDateEqual(
        advance(new Date(2020, 2, 8), { date: -1, hours: 2 }),
        new Date(2020, 2, 7, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 8), { hours: 2, date: -1 }),
        new Date(2020, 2, 7, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 8), { hours: 2, month: -1 }),
        new Date(2020, 1, 8, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 2, 8), { month: -1, hours: 2 }),
        new Date(2020, 1, 8, 2)
      );
      assertDateEqual(
        advance(new Date(2020, 11, 9, 17), {
          year: 2,
          month: 3,
          day: 31,
        }, true),
        new Date(2023, 3, 8)
      );
    });

    it('should throw an error on unknown keys', () => {
      assertError(() => {
        advance(new Date(2020, 0), { foo: 300 });
      }, TypeError);
    });

    it('should throw an error on invalid values', () => {
      assertError(() => {
        advance(new Date(2020, 0), { year: 'invalid' });
      }, TypeError);
      assertError(() => {
        advance(new Date(2020, 0), { year: NaN });
      }, TypeError);
      assertError(() => {
        advance(new Date(2020, 0), { year: null });
      }, TypeError);
      assertError(() => {
        advance(new Date(2020, 0), { year: '2020' });
      }, TypeError);
      assertError(() => {
        advance(new Date(2020, 0), { year: 2020.5 });
      }, TypeError);
      assertError(() => {
        advance(new Date(2020, 0), { week: null });
      }, TypeError);
    });

  });

});
