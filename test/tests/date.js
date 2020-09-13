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

});
