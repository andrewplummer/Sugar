'use strict';

namespace('Date', function () {

  beforeAll(() => {
    // Set system time to 2020-01-01
    clock.setSystemTime(1577804400000);
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
      assertNaN(getDaysInMonth(new Date('invalid')));
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
