'use strict';

describe('ja-JP', () => {

  beforeAll(() => {
    // Set system time to 2020-01-01
    setSystemTime(new Date(2020, 0));
    Intl.DateTimeFormat.mockDefaultLocale('en-US');
  });

  describeNamespace('Date', () => {

    describeStatic('create', (create) => {

      it('should parse basic dates', () => {
        assertDateEqual(create('2011年5月15日', 'ja'), new Date(2011, 4, 15));
        assertDateEqual(create('2016年2月02日', 'ja'), new Date(2016, 1, 2));
        assertDateEqual(create('2011年5月', 'ja'), new Date(2011, 4));
        assertDateEqual(create('5月15日', 'ja'), new Date(2020, 4, 15));
      });

      it('should parse basic times', () => {
        assertDateEqual(create('3時45分', 'ja'), new Date(2020, 0, 1, 3, 45));
        assertDateEqual(create('午後10時', 'ja'), new Date(2020, 0, 1, 22));
      });

      it('should parse dates with time', () => {
        assertDateEqual(create('2011年5月15日 3:45:59', 'ja'), new Date(2011, 4, 15, 3, 45, 59));
        assertDateEqual(create('2011年5月15日 3時45分', 'ja'), new Date(2011, 4, 15, 3, 45, 0));
        assertDateEqual(create('2011年5月15日 3時45分59秒', 'ja'), new Date(2011, 4, 15, 3, 45, 59));
        assertDateEqual(create('2011年5月15日 午前3時45分', 'ja'), new Date(2011, 4, 15, 3, 45));
        assertDateEqual(create('2011年5月15日 午後3時45分', 'ja'), new Date(2011, 4, 15, 15, 45));
        assertDateEqual(create('2011年5月15日 午後3:45', 'ja'), new Date(2011, 4, 15, 15, 45));
        assertDateEqual(create('先週水曜日 5:15', 'ja'), new Date(2019, 11, 25, 5, 15));
        assertDateEqual(create('月曜日3時45分', 'ja'), new Date(2019, 11, 30, 3, 45));
        assertDateEqual(create('15日 3:45:59', 'ja'), new Date(2020, 0, 15, 3, 45, 59));
        assertDateEqual(create('5月15日 3:45:59', 'ja'), new Date(2020, 4, 15, 3, 45, 59));
      });

      it('should parse weekdays', () => {
        assertDateEqual(create('日曜日', 'ja'), new Date(2019, 11, 29));
        assertDateEqual(create('月曜日', 'ja'), new Date(2019, 11, 30));
        assertDateEqual(create('火曜日', 'ja'), new Date(2019, 11, 31));
        assertDateEqual(create('水曜日', 'ja'), new Date(2020, 0, 1));
        assertDateEqual(create('木曜日', 'ja'), new Date(2020, 0, 2));
        assertDateEqual(create('金曜日', 'ja'), new Date(2020, 0, 3));
        assertDateEqual(create('土曜日', 'ja'), new Date(2020, 0, 4));
      });

      it('should parse standalone units', () => {
        assertDateEqual(create('2011年', 'ja'), new Date(2011, 0));
        assertDateEqual(create('15日', 'ja'), new Date(2020, 0, 15));
        assertDateEqual(create('5月', 'ja'), new Date(2020, 4));
        assertDateEqual(create('月曜日', 'ja'), new Date(2019, 11, 30));
      });

      it('should parse kabuki-cho', () => {
        assertDateEqual(create('29時', 'ja'), new Date(2020, 0, 2, 5));
      });

      it('should parse hanidec years ', () => {
        assertDateEqual(create('千九百三十七年', 'ja'), new Date(1937, 0));
        assertDateEqual(create('二千十三年', 'ja'), new Date(2013, 0));
        assertDateEqual(create('一九九五年', 'ja'), new Date(1995, 0));
        assertDateEqual(create('二千三年', 'ja'), new Date(2003, 0));
        assertDateEqual(create('二千年', 'ja'), new Date(2000, 0));
      });

      it('should parse hanidec months ', () => {
        assertDateEqual(create('一月', 'ja'), new Date(2020, 0));
        assertDateEqual(create('二月', 'ja'), new Date(2020, 1));
        assertDateEqual(create('三月', 'ja'), new Date(2020, 2));
        assertDateEqual(create('四月', 'ja'), new Date(2020, 3));
        assertDateEqual(create('五月', 'ja'), new Date(2020, 4));
        assertDateEqual(create('六月', 'ja'), new Date(2020, 5));
        assertDateEqual(create('七月', 'ja'), new Date(2020, 6));
        assertDateEqual(create('八月', 'ja'), new Date(2020, 7));
        assertDateEqual(create('九月', 'ja'), new Date(2020, 8));
        assertDateEqual(create('十月', 'ja'), new Date(2020, 9));
        assertDateEqual(create('十一月', 'ja'), new Date(2020, 10));
        assertDateEqual(create('十二月', 'ja'), new Date(2020, 11));
      });

      it('should parse hanidec dates', () => {
        assertDateEqual(create('一日', 'ja'), new Date(2020, 0, 1));
        assertDateEqual(create('二日', 'ja'), new Date(2020, 0, 2));
        assertDateEqual(create('三日', 'ja'), new Date(2020, 0, 3));
        assertDateEqual(create('四日', 'ja'), new Date(2020, 0, 4));
        assertDateEqual(create('五日', 'ja'), new Date(2020, 0, 5));
        assertDateEqual(create('六日', 'ja'), new Date(2020, 0, 6));
        assertDateEqual(create('七日', 'ja'), new Date(2020, 0, 7));
        assertDateEqual(create('八日', 'ja'), new Date(2020, 0, 8));
        assertDateEqual(create('九日', 'ja'), new Date(2020, 0, 9));
        assertDateEqual(create('十日', 'ja'), new Date(2020, 0, 10));
        assertDateEqual(create('十五日', 'ja'), new Date(2020, 0, 15));
        assertDateEqual(create('二十五日', 'ja'), new Date(2020, 0, 25));
      });

      it('should parse full hanidec datetime', () => {
        assertDateEqual(create('二千十一年五月十五日　午後三時四十五分', 'ja'), new Date(2011, 4, 15, 15, 45));
      });

      it('should parse units ago', () => {
        assertDateEqual(create('1秒前', 'ja'), new Date(2019, 11, 31, 23, 59, 59));
        assertDateEqual(create('1分前', 'ja'), new Date(2019, 11, 31, 23, 59));
        assertDateEqual(create('1時間前', 'ja'), new Date(2019, 11, 31, 23));
        assertDateEqual(create('1日前', 'ja'), new Date(2019, 11, 31));
        assertDateEqual(create('1週間前', 'ja'), new Date(2019, 11, 25));
        assertDateEqual(create('1か月前', 'ja'), new Date(2019, 11));
        assertDateEqual(create('1ヶ月前', 'ja'), new Date(2019, 11));
        assertDateEqual(create('1ヵ月前', 'ja'), new Date(2019, 11));
        assertDateEqual(create('1年前', 'ja'), new Date(2019, 0));

        assertDateEqual(create('5秒前', 'ja'), new Date(2019, 11, 31, 23, 59, 55));
        assertDateEqual(create('5分前', 'ja'), new Date(2019, 11, 31, 23, 55));
        assertDateEqual(create('5時間前', 'ja'), new Date(2019, 11, 31, 19));
        assertDateEqual(create('5日前', 'ja'), new Date(2019, 11, 27));
        assertDateEqual(create('5週間前', 'ja'), new Date(2019, 10, 27));
        assertDateEqual(create('5か月前', 'ja'), new Date(2019, 7));
        assertDateEqual(create('5ヶ月前', 'ja'), new Date(2019, 7));
        assertDateEqual(create('5ヵ月前', 'ja'), new Date(2019, 7));
        assertDateEqual(create('5年前', 'ja'), new Date(2015, 0));
      });

      it('should parse units from now', () => {
        assertDateEqual(create('1秒後', 'ja'), new Date(2020, 0, 1, 0, 0, 1));
        assertDateEqual(create('1分後', 'ja'), new Date(2020, 0, 1, 0, 1));
        assertDateEqual(create('1時間後', 'ja'), new Date(2020, 0, 1, 1));
        assertDateEqual(create('1日後', 'ja'), new Date(2020, 0, 2));
        assertDateEqual(create('1週間後', 'ja'), new Date(2020, 0, 8));
        assertDateEqual(create('1か月後', 'ja'), new Date(2020, 1));
        assertDateEqual(create('1ヶ月後', 'ja'), new Date(2020, 1));
        assertDateEqual(create('1ヵ月後', 'ja'), new Date(2020, 1));
        assertDateEqual(create('1年後', 'ja'), new Date(2021, 0));

        assertDateEqual(create('5秒後', 'ja'), new Date(2020, 0, 1, 0, 0, 5));
        assertDateEqual(create('5分後', 'ja'), new Date(2020, 0, 1, 0, 5));
        assertDateEqual(create('5時間後', 'ja'), new Date(2020, 0, 1, 5));
        assertDateEqual(create('5日後', 'ja'), new Date(2020, 0, 6));
        assertDateEqual(create('5週間後', 'ja'), new Date(2020, 1, 5));
        assertDateEqual(create('5か月後', 'ja'), new Date(2020, 5));
        assertDateEqual(create('5ヶ月後', 'ja'), new Date(2020, 5));
        assertDateEqual(create('5ヵ月後', 'ja'), new Date(2020, 5));
        assertDateEqual(create('5年後', 'ja'), new Date(2025, 0));
      });

      it('should parse relative phrases', () => {
        assertDateEqual(create('今', 'ja'), new Date(2020, 0));

        assertDateEqual(create('一昨日', 'ja'), new Date(2019, 11, 30));
        assertDateEqual(create('昨日', 'ja'), new Date(2019, 11, 31));
        assertDateEqual(create('今日', 'ja'), new Date(2020, 0, 1));
        assertDateEqual(create('明日', 'ja'), new Date(2020, 0, 2));
        assertDateEqual(create('明後日', 'ja'), new Date(2020, 0, 3));

        assertDateEqual(create('先週', 'ja'), new Date(2019, 11, 25));
        assertDateEqual(create('今週', 'ja'), new Date(2020, 0, 1));
        assertDateEqual(create('来週', 'ja'), new Date(2020, 0, 8));

        assertDateEqual(create('先月', 'ja'), new Date(2019, 11));
        assertDateEqual(create('今月', 'ja'), new Date(2020, 0));
        assertDateEqual(create('来月', 'ja'), new Date(2020, 1));

        assertDateEqual(create('昨年', 'ja'), new Date(2019, 0));
        assertDateEqual(create('今年', 'ja'), new Date(2020, 0));
        assertDateEqual(create('来年', 'ja'), new Date(2021, 0));
      });

      it('should parse hanidec numerals', () => {
        assertDateEqual(create('一秒後', 'ja'), new Date(2020, 0, 1, 0, 0, 1));
        assertDateEqual(create('二分後', 'ja'), new Date(2020, 0, 1, 0, 2));
        assertDateEqual(create('三時間後', 'ja'), new Date(2020, 0, 1, 3));
        assertDateEqual(create('四日後', 'ja'), new Date(2020, 0, 5));
        assertDateEqual(create('五週間後', 'ja'), new Date(2020, 1, 5));
        assertDateEqual(create('六か月後', 'ja'), new Date(2020, 6));
        assertDateEqual(create('七ヶ月後', 'ja'), new Date(2020, 7));
        assertDateEqual(create('八ヵ月後', 'ja'), new Date(2020, 8));
        assertDateEqual(create('九年後', 'ja'), new Date(2029, 0));
      });

      it('should parse fullwidth numerals', () => {
        assertDateEqual(create('１秒後', 'ja'), new Date(2020, 0, 1, 0, 0, 1));
        assertDateEqual(create('２分後', 'ja'), new Date(2020, 0, 1, 0, 2));
        assertDateEqual(create('３時間後', 'ja'), new Date(2020, 0, 1, 3));
        assertDateEqual(create('４日後', 'ja'), new Date(2020, 0, 5));
        assertDateEqual(create('５週間後', 'ja'), new Date(2020, 1, 5));
        assertDateEqual(create('６か月後', 'ja'), new Date(2020, 6));
        assertDateEqual(create('７ヶ月後', 'ja'), new Date(2020, 7));
        assertDateEqual(create('８ヵ月後', 'ja'), new Date(2020, 8));
        assertDateEqual(create('９年後', 'ja'), new Date(2029, 0));

        assertDateEqual(create('２０１１年５月２５日', 'ja'), new Date(2011, 4, 25));
        assertDateEqual(create('２０１１年５月', 'ja'), new Date(2011, 4));
        assertDateEqual(create('２０１１年', 'ja'), new Date(2011, 0));
        assertDateEqual(create('２０１１年５月１５日　３時４５分', 'ja'), new Date(2011, 4, 15, 3, 45));
        assertDateEqual(create('２０１１年５月１５日　午後３時４５分', 'ja'), new Date(2011, 4, 15, 15, 45));
      });

      it('should parse relative units', () => {
        assertDateEqual(create('来月２５日', 'ja'), new Date(2020, 1, 25));
        assertDateEqual(create('来年３月', 'ja'), new Date(2021, 2));
        assertDateEqual(create('来年３月２５日', 'ja'), new Date(2021, 2, 25));
      });

      it('should parse relative week with weekday', () => {
        assertDateEqual(create('先週水曜日', 'ja'), new Date(2019, 11, 25));
        assertDateEqual(create('来週金曜日', 'ja'), new Date(2020, 0, 10));
        assertDateEqual(create('来週水曜日15:35', 'ja'), new Date(2020, 0, 8, 15, 35));
      });

      it('should handle Issue #148', function() {
        assertDateEqual(create('火曜日3:00', 'ja'), new Date(2019, 11, 31, 3));
        assertDateEqual(create('火曜日午後3:00', 'ja'), new Date(2019, 11, 31, 15));
        assertDateEqual(create('来週火曜日午後3:00', 'ja'), new Date(2020, 0, 7, 15));
        assertDateEqual(create('2012年6月5日3:00', 'ja'), new Date(2012, 5, 5, 3));
      });

    });

    describeInstance('format', (format) => {

      it('should correctly format date with built-in aliases', () => {
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATE_FULL, 'ja'),
          '2020年1月1日水曜日'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATE_LONG, 'ja'),
          '2020年1月1日'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATE_MEDIUM, 'ja'),
          '2020年1月1日'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATE_SHORT, 'ja'),
          '2020/1/1'
        );
      });

      it('should correctly format time with built-in aliases', () => {
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.TIME_FULL, 'ja'),
          '0時00分00秒 日本標準時'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.TIME_LONG, 'ja'),
          '0:00:00 JST'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.TIME_MEDIUM, 'ja'),
          '0:00:00'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.TIME_SHORT, 'ja'),
          '0:00'
        );
      });

      it('should correctly format datetime with built-in aliases', () => {
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATETIME_FULL, 'ja'),
          '2020年1月1日水曜日 0:00'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATETIME_LONG, 'ja'),
          '2020年1月1日 0:00'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATETIME_MEDIUM, 'ja'),
          '2020年1月1日 0:00'
        );
        assertEqual(
          format(new Date(2020, 0), Sugar.Date.DATETIME_SHORT, 'ja'),
          '2020/1/1 0:00'
        );
      });

      it('should correctly format month tokens', () => {
        assertEqual(format(new Date(2020, 0), 'M月', 'ja'), '1月');
        assertEqual(format(new Date(2020, 1), 'M月', 'ja'), '2月');
        assertEqual(format(new Date(2020, 2), 'M月', 'ja'), '3月');
        assertEqual(format(new Date(2020, 3), 'M月', 'ja'), '4月');
        assertEqual(format(new Date(2020, 4), 'M月', 'ja'), '5月');
        assertEqual(format(new Date(2020, 5), 'M月', 'ja'), '6月');
        assertEqual(format(new Date(2020, 6), 'M月', 'ja'), '7月');
        assertEqual(format(new Date(2020, 7), 'M月', 'ja'), '8月');
        assertEqual(format(new Date(2020, 8), 'M月', 'ja'), '9月');
        assertEqual(format(new Date(2020, 9), 'M月', 'ja'), '10月');
        assertEqual(format(new Date(2020, 10), 'M月', 'ja'), '11月');
        assertEqual(format(new Date(2020, 11), 'M月', 'ja'), '12月');
      });

      it('should correctly format month token alternates', () => {
        assertEqual(format(new Date(2020, 0), 'M月', 'ja'), '1月');
        assertEqual(format(new Date(2020, 0), 'MM月', 'ja'), '01月');
        assertEqual(format(new Date(2020, 0), 'MMM月', 'ja'), '1月');
        assertEqual(format(new Date(2020, 0), 'MMMM月', 'ja'), '1月');
        assertEqual(format(new Date(2020, 0), 'MMMMM月', 'ja'), '1月');
        assertEqual(format(new Date(2020, 0), 'L月', 'ja'), '1月');
        assertEqual(format(new Date(2020, 0), 'LL月', 'ja'), '01月');
        assertEqual(format(new Date(2020, 0), 'LLL月', 'ja'), '1月');
        assertEqual(format(new Date(2020, 0), 'LLLL月', 'ja'), '1月');
        assertEqual(format(new Date(2020, 0), 'LLLLL月', 'ja'), '1月');
      });

      it('should correctly format weekday tokens', () => {
        assertEqual(format(new Date(2019, 11, 29), 'E', 'ja'), '日');
        assertEqual(format(new Date(2019, 11, 30), 'E', 'ja'), '月');
        assertEqual(format(new Date(2019, 11, 31), 'E', 'ja'), '火');
        assertEqual(format(new Date(2020, 0, 1), 'E', 'ja'), '水');
        assertEqual(format(new Date(2020, 0, 2), 'E', 'ja'), '木');
        assertEqual(format(new Date(2020, 0, 3), 'E', 'ja'), '金');
        assertEqual(format(new Date(2020, 0, 4), 'E', 'ja'), '土');
      });

      it('should correctly format weekday token alternates', () => {
        assertEqual(format(new Date(2020, 0), 'E', 'ja'), '水');
        assertEqual(format(new Date(2020, 0), 'EE', 'ja'), '水');
        assertEqual(format(new Date(2020, 0), 'EEE', 'ja'), '水');
        assertEqual(format(new Date(2020, 0), 'EEEE', 'ja'), '水曜日');
        assertEqual(format(new Date(2020, 0), 'EEEEE', 'ja'), '水');
        assertEqual(format(new Date(2020, 0), 'c', 'ja'), '水');
        assertEqual(format(new Date(2020, 0), 'cc', 'ja'), '水');
        assertEqual(format(new Date(2020, 0), 'ccc', 'ja'), '水');
        assertEqual(format(new Date(2020, 0), 'cccc', 'ja'), '水曜日');
        assertEqual(format(new Date(2020, 0), 'ccccc', 'ja'), '水');
      });

      it('should be able to format more formats with token formatter', () => {
        const date = new Date(2020, 0, 1, 15, 52);
        assertEqual(
          format(date, 'yyyy年M月d日aah時mm分', 'ja'),
          '2020年1月1日午後3時52分'
        );
        assertEqual(
          format(date, 'yyyy年M月d日aah時mm分 EEEE', 'ja'),
          '2020年1月1日午後3時52分 水曜日'
        );
        assertEqual(
          format(date, 'yyyy年M月d日 HH:mm E', 'ja'),
          '2020年1月1日 15:52 水'
        );
      });

    });

    describeInstance('relative', (relative) => {

      it('should format relative time ago', () => {
        assertEqual(relative(new Date(2019, 11, 31, 23, 59, 59), 'ja'), '1 秒前');
        assertEqual(relative(new Date(2019, 11, 31, 23, 59), 'ja'), '1 分前');
        assertEqual(relative(new Date(2019, 11, 31, 23), 'ja'), '1 時間前');
        assertEqual(relative(new Date(2019, 11, 31), 'ja'), '1 日前');
        assertEqual(relative(new Date(2019, 11, 25), 'ja'), '1 週間前');
        assertEqual(relative(new Date(2019, 11), 'ja'), '1 か月前');
        assertEqual(relative(new Date(2019, 0), 'ja'), '1 年前');
      });

      it('should format relative time from now', () => {
        assertEqual(relative(new Date(2020, 0, 1, 0, 0, 1), 'ja'), '1 秒後');
        assertEqual(relative(new Date(2020, 0, 1, 0, 1), 'ja'), '1 分後');
        assertEqual(relative(new Date(2020, 0, 1, 1), 'ja'), '1 時間後');
        assertEqual(relative(new Date(2020, 0, 2), 'ja'), '1 日後');
        assertEqual(relative(new Date(2020, 0, 8), 'ja'), '1 週間後');
        assertEqual(relative(new Date(2020, 1), 'ja'), '1 か月後');
        assertEqual(relative(new Date(2021, 0), 'ja'), '1 年後');
      });

      it('should format relative time with compare date', () => {
        const compare = new Date(2021, 1);

        assertEqual(
          relative(new Date(2022, 1), {
            compare,
            locale: 'ja',
          }),
          '1 年',
        );
        assertEqual(
          relative(new Date(2021, 2), {
            compare,
            locale: 'ja',
          }),
          '1 か月',
        );
        assertEqual(
          relative(new Date(2021, 1, 8), {
            compare,
            locale: 'ja',
          }),
          '1 週間',
        );
        assertEqual(
          relative(new Date(2021, 1, 2), {
            compare,
            locale: 'ja',
          }),
          '1 日',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 1), {
            compare,
            locale: 'ja',
          }),
          '1 時間',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 0, 1), {
            compare,
            locale: 'ja',
          }),
          '1 分',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 0, 0, 1), {
            compare,
            locale: 'ja',
          }),
          '1 秒',
        );
      });

    });

  });

  describeNamespace('Number', () => {

    describeInstance('duration', (duration) => {

      it('should format duration', () => {
        assertEqual(duration(365.25 * 24 * 60 * 60 * 1000, 'ja'), '1 年');
        assertEqual(duration(31 * 24 * 60 * 60 * 1000, 'ja'), '1 か月');
        assertEqual(duration(7 * 24 * 60 * 60 * 1000, 'ja'), '1 週間');
        assertEqual(duration(24 * 60 * 60 * 1000, 'ja'), '1 日');
        assertEqual(duration(60 * 60 * 1000, 'ja'), '1 時間');
        assertEqual(duration(60 * 1000, 'ja'), '1 分');
        assertEqual(duration(1000, 'ja'), '1 秒');
      });

    });

  });

});
