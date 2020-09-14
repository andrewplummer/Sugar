'use strict';

fnamespace('Date', function () {
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
        new Date(2020, 1, 1)
      );
      assertDateEqual(
        set(new Date(2020, 0), { month: 11 }),
        new Date(2020, 11, 1)
      );
      assertDateEqual(
        set(new Date(2020, 0), { month: 21 }),
        new Date(2021, 9, 1)
      );
      assertDateEqual(
        set(new Date(2020, 0), { month: -1 }),
        new Date(2019, 11, 1)
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

    it('should set the hour', () => {
      assertDateEqual(
        set(new Date(2020, 0), { hour: 5 }),
        new Date(2020, 0, 1, 5)
      );
      assertDateEqual(
        set(new Date(2020, 0), { hour: 13 }),
        new Date(2020, 0, 1, 13)
      );
      assertDateEqual(
        set(new Date(2020, 0), { hour: 24 }),
        new Date(2020, 0, 2, 0)
      );
      assertDateEqual(
        set(new Date(2020, 0), { hour: 29 }),
        new Date(2020, 0, 2, 5)
      );
    });

    it('should set the minute', () => {
      assertDateEqual(
        set(new Date(2020, 0), { minute: 10 }),
        new Date(2020, 0, 1, 0, 10)
      );
      assertDateEqual(
        set(new Date(2020, 0), { minute: 30 }),
        new Date(2020, 0, 1, 0, 30)
      );
      assertDateEqual(
        set(new Date(2020, 0), { minute: 60 }),
        new Date(2020, 0, 1, 1, 0)
      );
      assertDateEqual(
        set(new Date(2020, 0), { minute: 90 }),
        new Date(2020, 0, 1, 1, 30)
      );
    });

    it('should set the second', () => {
      assertDateEqual(
        set(new Date(2020, 0), { second: 10 }),
        new Date(2020, 0, 1, 0, 0, 10)
      );
      assertDateEqual(
        set(new Date(2020, 0), { second: 30 }),
        new Date(2020, 0, 1, 0, 0, 30)
      );
      assertDateEqual(
        set(new Date(2020, 0), { second: 60 }),
        new Date(2020, 0, 1, 0, 1, 0)
      );
      assertDateEqual(
        set(new Date(2020, 0), { second: 90 }),
        new Date(2020, 0, 1, 0, 1, 30)
      );
    });

    it('should set the millisecond', () => {
      assertDateEqual(
        set(new Date(2020, 0), { millisecond: 300 }),
        new Date(2020, 0, 1, 0, 0, 0, 300)
      );
      assertDateEqual(
        set(new Date(2020, 0), { millisecond: 900 }),
        new Date(2020, 0, 1, 0, 0, 0, 900)
      );
      assertDateEqual(
        set(new Date(2020, 0), { millisecond: 1200 }),
        new Date(2020, 0, 1, 0, 0, 1, 200)
      );
    });

    it('should allow aliases', () => {
      assertDateEqual(
        set(new Date(2020, 0), { weekday: 1 }),
        new Date(2019, 11, 30)
      );
      assertDateEqual(
        set(new Date(2020, 0), { hours: 5 }),
        new Date(2020, 0, 1, 5)
      );
      assertDateEqual(
        set(new Date(2020, 0), { minutes: 10 }),
        new Date(2020, 0, 1, 0, 10)
      );
      assertDateEqual(
        set(new Date(2020, 0), { seconds: 10 }),
        new Date(2020, 0, 1, 0, 0, 10)
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
          minute: 30,
        }),
        new Date(2010, 1, 1, 0, 30)
      );
      assertDateEqual(
        set(new Date(2020, 11, 31, 23, 59, 59, 999), {
          year: 2010,
          minute: 30,
        }),
        new Date(2010, 11, 31, 23, 30, 59, 999)
      );
      assertDateEqual(
        set(new Date(2020, 11, 31, 23, 59, 59, 999), {
          year: 2010,
          minute: 30,
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
          hour: 3,
          minute: 40,
          second: 12,
        }),
        new Date(2010, 7, 25, 3, 40, 12)
      );
    });

    it('should allow setting from a numeric timestamp', () => {
      assertDateEqual(set(new Date(2020, 0), Date.now()), new Date());
      assertDateEqual(set(new Date(2020, 0), Date.now(), true), new Date());
    });

    it('should traverse into different month when not enough days', () => {
      assertDateEqual(
        set(new Date(2011, 0, 31), {
          month: 1,
        }),
        new Date(2011, 2, 3)
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
        set(new Date(2020, 2, 8), { date: 7, hour: 2 }),
        new Date(2020, 2, 7, 2)
      );
      assertDateEqual(
        set(new Date(2020, 2, 8), { hour: 2, date: 7 }),
        new Date(2020, 2, 7, 2)
      );
      assertDateEqual(
        set(new Date(2020, 2, 8), { hour: 2, month: 1 }),
        new Date(2020, 1, 8, 2)
      );
      assertDateEqual(
        set(new Date(2020, 2, 8), { month: 1, hour: 2 }),
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

  });

});
