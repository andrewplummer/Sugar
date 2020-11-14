'use strict';

describe('ko-KR', () => {

  beforeAll(() => {
    // Set system time to 2020-01-01
    setSystemTime(new Date(2020, 0));
    Intl.DateTimeFormat.mockDefaultLocale('en-US');
  });

  describeNamespace('Date', () => {

    describeStatic('create', (create) => {

      it('should parse basic dates', () => {
        assertDateEqual(create('2011년 5월 15일', 'ko'), new Date(2011, 4, 15));
        assertDateEqual(create('2016년 2월 02일', 'ko'), new Date(2016, 1, 2));
        assertDateEqual(create('2011년 5월', 'ko'), new Date(2011, 4));
        assertDateEqual(create('5월 15일', 'ko'), new Date(2020, 4, 15));
      });

      it('should parse basic times', () => {
        assertDateEqual(create('3시45분', 'ko'), new Date(2020, 0, 1, 3, 45));
        assertDateEqual(create('오후10시', 'ko'), new Date(2020, 0, 1, 22));
      });

      it('should parse dates with time', () => {
        assertDateEqual(create('2011년 5월 15일 3:45:59', 'ko'), new Date(2011, 4, 15, 3, 45, 59));
        assertDateEqual(create('2011년 5월 15일 3시45분', 'ko'), new Date(2011, 4, 15, 3, 45, 0));
        assertDateEqual(create('2011년 5월 15일 3시45분59초', 'ko'), new Date(2011, 4, 15, 3, 45, 59));
        assertDateEqual(create('2011년 5월 15일 오전3시45분', 'ko'), new Date(2011, 4, 15, 3, 45));
        assertDateEqual(create('2011년 5월 15일 오후3시45분', 'ko'), new Date(2011, 4, 15, 15, 45));
        assertDateEqual(create('2011년 5월 15일 오후3:45', 'ko'), new Date(2011, 4, 15, 15, 45));
        assertDateEqual(create('지난주 수요일 5:15', 'ko'), new Date(2019, 11, 25, 5, 15));
        assertDateEqual(create('월요일3시45분', 'ko'), new Date(2019, 11, 30, 3, 45));
        assertDateEqual(create('15일 3:45:59', 'ko'), new Date(2020, 0, 15, 3, 45, 59));
        assertDateEqual(create('5월 15일 3:45:59', 'ko'), new Date(2020, 4, 15, 3, 45, 59));
      });

      it('should parse standalone units', () => {
        assertDateEqual(create('2011년', 'ko'), new Date(2011, 0));
        assertDateEqual(create('15일', 'ko'), new Date(2020, 0, 15));
        assertDateEqual(create('5월', 'ko'), new Date(2020, 4));
        assertDateEqual(create('월요일', 'ko'), new Date(2019, 11, 30));
      });

      it('should parse units ago', () => {
        assertDateEqual(create('1초 전', 'ko'), new Date(2019, 11, 31, 23, 59, 59));
        assertDateEqual(create('1분 전', 'ko'), new Date(2019, 11, 31, 23, 59));
        assertDateEqual(create('1시간 전', 'ko'), new Date(2019, 11, 31, 23));
        assertDateEqual(create('1일 전', 'ko'), new Date(2019, 11, 31));
        assertDateEqual(create('1주 전', 'ko'), new Date(2019, 11, 25));
        assertDateEqual(create('1개월 전', 'ko'), new Date(2019, 11));
        assertDateEqual(create('1년 전', 'ko'), new Date(2019, 0));

        assertDateEqual(create('5초 전', 'ko'), new Date(2019, 11, 31, 23, 59, 55));
        assertDateEqual(create('5분 전', 'ko'), new Date(2019, 11, 31, 23, 55));
        assertDateEqual(create('5시간 전', 'ko'), new Date(2019, 11, 31, 19));
        assertDateEqual(create('5일 전', 'ko'), new Date(2019, 11, 27));
        assertDateEqual(create('5주 전', 'ko'), new Date(2019, 10, 27));
        assertDateEqual(create('5개월 전', 'ko'), new Date(2019, 7));
        assertDateEqual(create('5년 전', 'ko'), new Date(2015, 0));
      });

      it('should parse units from now', () => {
        assertDateEqual(create('1초 후', 'ko'), new Date(2020, 0, 1, 0, 0, 1));
        assertDateEqual(create('1분 후', 'ko'), new Date(2020, 0, 1, 0, 1));
        assertDateEqual(create('1시간 후', 'ko'), new Date(2020, 0, 1, 1));
        assertDateEqual(create('1일 후', 'ko'), new Date(2020, 0, 2));
        assertDateEqual(create('1주 후', 'ko'), new Date(2020, 0, 8));
        assertDateEqual(create('1개월 후', 'ko'), new Date(2020, 1));
        assertDateEqual(create('1년 후', 'ko'), new Date(2021, 0));

        assertDateEqual(create('5초 후', 'ko'), new Date(2020, 0, 1, 0, 0, 5));
        assertDateEqual(create('5분 후', 'ko'), new Date(2020, 0, 1, 0, 5));
        assertDateEqual(create('5시간 후', 'ko'), new Date(2020, 0, 1, 5));
        assertDateEqual(create('5일 후', 'ko'), new Date(2020, 0, 6));
        assertDateEqual(create('5주 후', 'ko'), new Date(2020, 1, 5));
        assertDateEqual(create('5개월 후', 'ko'), new Date(2020, 5));
        assertDateEqual(create('5년 후', 'ko'), new Date(2025, 0));
      });

      it('should parse relative phrases', () => {
        assertDateEqual(create('지금', 'ko'), new Date(2020, 0));

        assertDateEqual(create('그저께', 'ko'), new Date(2019, 11, 30));
        assertDateEqual(create('어제', 'ko'), new Date(2019, 11, 31));
        assertDateEqual(create('오늘', 'ko'), new Date(2020, 0, 1));
        assertDateEqual(create('내일', 'ko'), new Date(2020, 0, 2));
        assertDateEqual(create('모레', 'ko'), new Date(2020, 0, 3));

        assertDateEqual(create('지난 주', 'ko'), new Date(2019, 11, 25));
        assertDateEqual(create('이번 주', 'ko'), new Date(2020, 0, 1));
        assertDateEqual(create('다음 주', 'ko'), new Date(2020, 0, 8));

        assertDateEqual(create('지난 달', 'ko'), new Date(2019, 11));
        assertDateEqual(create('이번 달', 'ko'), new Date(2020, 0));
        assertDateEqual(create('다음 달', 'ko'), new Date(2020, 1));

        assertDateEqual(create('작년', 'ko'), new Date(2019, 0));
        assertDateEqual(create('올해', 'ko'), new Date(2020, 0));
        assertDateEqual(create('내년', 'ko'), new Date(2021, 0));

      });

      it('should parse weekdays', () => {
        assertDateEqual(create('일요일', 'ko'), new Date(2019, 11, 29));
        assertDateEqual(create('월요일', 'ko'), new Date(2019, 11, 30));
        assertDateEqual(create('화요일', 'ko'), new Date(2019, 11, 31));
        assertDateEqual(create('수요일', 'ko'), new Date(2020, 0, 1));
        assertDateEqual(create('목요일', 'ko'), new Date(2020, 0, 2));
        assertDateEqual(create('금요일', 'ko'), new Date(2020, 0, 3));
        assertDateEqual(create('토요일', 'ko'), new Date(2020, 0, 4));
      });

      it('should parse relative units', () => {
        assertDateEqual(create('다음 달 25일', 'ko'), new Date(2020, 1, 25));
        assertDateEqual(create('내년 3월', 'ko'), new Date(2021, 2));
        assertDateEqual(create('내년 3월 25일', 'ko'), new Date(2021, 2, 25));
      });

      it('should parse relative units with time', () => {
        assertDateEqual(create('내일 3:45', 'ko'), new Date(2020, 0, 2, 3, 45));
        assertDateEqual(create('내일 오후3:45', 'ko'), new Date(2020, 0, 2, 15, 45));
        assertDateEqual(create('금요일 3:45', 'ko'), new Date(2020, 0, 3, 3, 45));
      });

      it('should parse relative week with weekday', () => {
        assertDateEqual(create('지난 주 수요일', 'ko'), new Date(2019, 11, 25));
        assertDateEqual(create('다음 주 금요일', 'ko'), new Date(2020, 0, 10));
        assertDateEqual(create('다음 주 수요일 15:35', 'ko'), new Date(2020, 0, 8, 15, 35));
      });

      it('should handle Issue #524', () => {
        assertDateEqual(create('2015년 11월 24일', 'ko'), new Date(2015, 10, 24));
        assertDateEqual(create('2015년 11월 24일 화요일', 'ko'), new Date(2015, 10, 24));
      });

    });

    describeInstance('format', (format) => {

      it('should correctly format date with built-in aliases', () => {
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATE_FULL, 'ko'),
          '2020년 1월 1일 수요일'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATE_LONG, 'ko'),
          '2020년 1월 1일'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATE_MEDIUM, 'ko'),
          '2020년 1월 1일'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATE_SHORT, 'ko'),
          '2020. 1. 1.'
        );
      });

      it('should correctly format time with built-in aliases', () => {
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.TIME_FULL, 'ko'),
          '오전 12시 0분 0초 일본 표준시'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.TIME_LONG, 'ko'),
          '오전 12시 0분 0초 GMT+9'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.TIME_MEDIUM, 'ko'),
          '오전 12:00:00'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.TIME_SHORT, 'ko'),
          '오전 12:00'
        );
      });

      it('should correctly format datetime with built-in aliases', () => {
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATETIME_FULL, 'ko'),
          '2020년 1월 1일 수요일 오전 12:00'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATETIME_LONG, 'ko'),
          '2020년 1월 1일 오전 12:00'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATETIME_MEDIUM, 'ko'),
          '2020년 1월 1일 오전 12:00'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATETIME_SHORT, 'ko'),
          '2020. 1. 1. 오전 12:00'
        );
      });

      it('should correctly format month tokens', () => {
        assertEqual(format(new Date(2020, 0), 'M월', 'ko'), '1월');
        assertEqual(format(new Date(2020, 1), 'M월', 'ko'), '2월');
        assertEqual(format(new Date(2020, 2), 'M월', 'ko'), '3월');
        assertEqual(format(new Date(2020, 3), 'M월', 'ko'), '4월');
        assertEqual(format(new Date(2020, 4), 'M월', 'ko'), '5월');
        assertEqual(format(new Date(2020, 5), 'M월', 'ko'), '6월');
        assertEqual(format(new Date(2020, 6), 'M월', 'ko'), '7월');
        assertEqual(format(new Date(2020, 7), 'M월', 'ko'), '8월');
        assertEqual(format(new Date(2020, 8), 'M월', 'ko'), '9월');
        assertEqual(format(new Date(2020, 9), 'M월', 'ko'), '10월');
        assertEqual(format(new Date(2020, 10), 'M월', 'ko'), '11월');
        assertEqual(format(new Date(2020, 11), 'M월', 'ko'), '12월');
      });

      it('should correctly format month token alternates', () => {
        assertEqual(format(new Date(2020, 0), 'M', 'ko'), '1');
        assertEqual(format(new Date(2020, 0), 'MM', 'ko'), '01');
        assertEqual(format(new Date(2020, 0), 'MMM', 'ko'), '1월');
        assertEqual(format(new Date(2020, 0), 'MMMM', 'ko'), '1월');
        assertEqual(format(new Date(2020, 0), 'MMMMM', 'ko'), '1월');
        assertEqual(format(new Date(2020, 0), 'L', 'ko'), '1');
        assertEqual(format(new Date(2020, 0), 'LL', 'ko'), '01');
        assertEqual(format(new Date(2020, 0), 'LLL', 'ko'), '1월');
        assertEqual(format(new Date(2020, 0), 'LLLL', 'ko'), '1월');
        assertEqual(format(new Date(2020, 0), 'LLLLL', 'ko'), '1월');
      });

      it('should correctly format weekday tokens', () => {
        assertEqual(format(new Date(2019, 11, 29), 'E', 'ko'), '일');
        assertEqual(format(new Date(2019, 11, 30), 'E', 'ko'), '월');
        assertEqual(format(new Date(2019, 11, 31), 'E', 'ko'), '화');
        assertEqual(format(new Date(2020, 0, 1), 'E', 'ko'), '수');
        assertEqual(format(new Date(2020, 0, 2), 'E', 'ko'), '목');
        assertEqual(format(new Date(2020, 0, 3), 'E', 'ko'), '금');
        assertEqual(format(new Date(2020, 0, 4), 'E', 'ko'), '토');
      });

      it('should correctly format weekday token alternates', () => {
        assertEqual(format(new Date(2020, 0), 'E', 'ko'), '수');
        assertEqual(format(new Date(2020, 0), 'EE', 'ko'), '수');
        assertEqual(format(new Date(2020, 0), 'EEE', 'ko'), '수');
        assertEqual(format(new Date(2020, 0), 'EEEE', 'ko'), '수요일');
        assertEqual(format(new Date(2020, 0), 'EEEEE', 'ko'), '수');
        assertEqual(format(new Date(2020, 0), 'c', 'ko'), '수');
        assertEqual(format(new Date(2020, 0), 'cc', 'ko'), '수');
        assertEqual(format(new Date(2020, 0), 'ccc', 'ko'), '수');
        assertEqual(format(new Date(2020, 0), 'cccc', 'ko'), '수요일');
        assertEqual(format(new Date(2020, 0), 'ccccc', 'ko'), '수');
      });

      it('should be able to format more formats with token formatter', () => {
        const date = new Date(2020, 0, 1, 15, 52);
        assertEqual(
          format(date, 'yyyy년M월d일aah시mm분', 'ko'),
          '2020년1월1일오후3시52분'
        );
        assertEqual(
          format(date, 'yyyy년M월d일aah시mm분 EEEE', 'ko'),
          '2020년1월1일오후3시52분 수요일'
        );
        assertEqual(
          format(date, 'yyyy년M월d일 HH:mm E', 'ko'),
          '2020년1월1일 15:52 수'
        );
      });

    });

    describeInstance('relative', (relative) => {

      it('should format relative time ago', () => {
        assertEqual(relative(new Date(2019, 11, 31, 23, 59, 59), 'ko'), '1초 전');
        assertEqual(relative(new Date(2019, 11, 31, 23, 59), 'ko'), '1분 전');
        assertEqual(relative(new Date(2019, 11, 31, 23), 'ko'), '1시간 전');
        assertEqual(relative(new Date(2019, 11, 31), 'ko'), '1일 전');
        assertEqual(relative(new Date(2019, 11, 25), 'ko'), '1주 전');
        assertEqual(relative(new Date(2019, 11), 'ko'), '1개월 전');
        assertEqual(relative(new Date(2019, 0), 'ko'), '1년 전');
      });

      it('should format relative time from now', () => {
        assertEqual(relative(new Date(2020, 0, 1, 0, 0, 1), 'ko'), '1초 후');
        assertEqual(relative(new Date(2020, 0, 1, 0, 1), 'ko'), '1분 후');
        assertEqual(relative(new Date(2020, 0, 1, 1), 'ko'), '1시간 후');
        assertEqual(relative(new Date(2020, 0, 2), 'ko'), '1일 후');
        assertEqual(relative(new Date(2020, 0, 8), 'ko'), '1주 후');
        assertEqual(relative(new Date(2020, 1), 'ko'), '1개월 후');
        assertEqual(relative(new Date(2021, 0), 'ko'), '1년 후');
      });

      it('should format relative time with compare date', () => {
        const compare = new Date(2021, 1);

        assertEqual(
          relative(new Date(2022, 1), {
            compare,
            locale: 'ko',
          }),
          '1년',
        );
        assertEqual(
          relative(new Date(2021, 2), {
            compare,
            locale: 'ko',
          }),
          '1개월',
        );
        assertEqual(
          relative(new Date(2021, 1, 8), {
            compare,
            locale: 'ko',
          }),
          '1주',
        );
        assertEqual(
          relative(new Date(2021, 1, 2), {
            compare,
            locale: 'ko',
          }),
          '1일',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 1), {
            compare,
            locale: 'ko',
          }),
          '1시간',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 0, 1), {
            compare,
            locale: 'ko',
          }),
          '1분',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 0, 0, 1), {
            compare,
            locale: 'ko',
          }),
          '1초',
        );
      });

    });

  });

  describeNamespace('Number', () => {

    describeInstance('duration', (duration) => {

      it('should format duration', () => {
        assertEqual(duration(365.25 * 24 * 60 * 60 * 1000, 'ko'), '1년');
        assertEqual(duration(31 * 24 * 60 * 60 * 1000, 'ko'), '1개월');
        assertEqual(duration(7 * 24 * 60 * 60 * 1000, 'ko'), '1주');
        assertEqual(duration(24 * 60 * 60 * 1000, 'ko'), '1일');
        assertEqual(duration(60 * 60 * 1000, 'ko'), '1시간');
        assertEqual(duration(60 * 1000, 'ko'), '1분');
        assertEqual(duration(1000, 'ko'), '1초');
      });

    });

  });

});
