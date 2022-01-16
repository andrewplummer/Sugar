'use strict';

xdescribe('zh-Hant', () => {

  beforeAll(() => {
    // Set system time to 2020-01-01
    setSystemTime(new Date(2020, 0));
    Intl.DateTimeFormat.mockDefaultLocale('en-US');
  });

  describeNamespace('Date', () => {

    describeStatic('create', (create) => {

      it('should parse basic dates', () => {
        assertDateEqual(create('2011年5月15日', 'zh-Hant'), new Date(2011, 4, 15));
        assertDateEqual(create('2016年2月2日', 'zh-Hant'), new Date(2016, 1, 2));
        assertDateEqual(create('2011年5月', 'zh-Hant'), new Date(2011, 4));
        assertDateEqual(create('5月15日', 'zh-Hant'), new Date(2020, 4, 15));
      });

      it('should parse basic times', () => {
        assertDateEqual(create('3點45分', 'zh-Hant'), new Date(2020, 0, 1, 3, 45));
        assertDateEqual(create('下午10點', 'zh-Hant'), new Date(2020, 0, 1, 22));
      });

      it('should parse dates with time', () => {
        assertDateEqual(create('2011年5月15日 3:45:59', 'zh-Hant'), new Date(2011, 4, 15, 3, 45, 59));
        assertDateEqual(create('2011年5月15日 3點45分', 'zh-Hant'), new Date(2011, 4, 15, 3, 45, 0));
        assertDateEqual(create('2011年5月15日 3點45分59秒', 'zh-Hant'), new Date(2011, 4, 15, 3, 45, 59));
        assertDateEqual(create('2011年5月15日 上午3點45分', 'zh-Hant'), new Date(2011, 4, 15, 3, 45));
        assertDateEqual(create('2011年5月15日 下午3點45分', 'zh-Hant'), new Date(2011, 4, 15, 15, 45));
        assertDateEqual(create('2011年5月15日 下午3:45', 'zh-Hant'), new Date(2011, 4, 15, 15, 45));
        assertDateEqual(create('上週 星期三 5:15', 'zh-Hant'), new Date(2019, 11, 25, 5, 15));
        assertDateEqual(create('星期一 3點45分', 'zh-Hant'), new Date(2019, 11, 30, 3, 45));
        assertDateEqual(create('15日 3:45:59', 'zh-Hant'), new Date(2020, 0, 15, 3, 45, 59));
        assertDateEqual(create('5月15日 3:45:59', 'zh-Hant'), new Date(2020, 4, 15, 3, 45, 59));
      });

      it('should parse standalone units', () => {
        assertDateEqual(create('2011年', 'zh-Hant'), new Date(2011, 0));
        assertDateEqual(create('15日', 'zh-Hant'), new Date(2020, 0, 15));
        assertDateEqual(create('5月', 'zh-Hant'), new Date(2020, 4));
        assertDateEqual(create('星期一', 'zh-Hant'), new Date(2019, 11, 30));
      });

      xit('should parse units ago', () => {
        assertDateEqual(create('一秒鐘前', 'zh-Hant'), new Date(2019, 11, 31, 23, 59, 59));
        assertDateEqual(create('一分鐘前', 'zh-Hant'), new Date(2019, 11, 31, 23, 59));
        assertDateEqual(create('一小時前', 'zh-Hant'), new Date(2019, 11, 31, 23));
        assertDateEqual(create('一天前', 'zh-Hant'), new Date(2019, 11, 31));
        assertDateEqual(create('一週前', 'zh-Hant'), new Date(2019, 11, 25));
        assertDateEqual(create('一個月前', 'zh-Hant'), new Date(2019, 11));
        assertDateEqual(create('一年前', 'zh-Hant'), new Date(2019, 0));

        assertDateEqual(create('5秒鐘前', 'zh-Hant'), new Date(2019, 11, 31, 23, 59, 55));
        assertDateEqual(create('5分鐘前', 'zh-Hant'), new Date(2019, 11, 31, 23, 55));
        assertDateEqual(create('5小時前', 'zh-Hant'), new Date(2019, 11, 31, 19));
        assertDateEqual(create('5天前', 'zh-Hant'), new Date(2019, 11, 27));
        assertDateEqual(create('5週前', 'zh-Hant'), new Date(2019, 10, 27));
        assertDateEqual(create('5個月前', 'zh-Hant'), new Date(2019, 7));
        assertDateEqual(create('5年前', 'zh-Hant'), new Date(2015, 0));
      });

      xit('should parse units from now', () => {
        assertDateEqual(create('1秒鐘後', 'zh-Hant'), new Date(2020, 0, 1, 0, 0, 1));
        assertDateEqual(create('1分鐘後', 'zh-Hant'), new Date(2020, 0, 1, 0, 1));
        assertDateEqual(create('1小時後', 'zh-Hant'), new Date(2020, 0, 1, 1));
        assertDateEqual(create('1天後', 'zh-Hant'), new Date(2020, 0, 2));
        assertDateEqual(create('1週後', 'zh-Hant'), new Date(2020, 0, 8));
        assertDateEqual(create('1個月後', 'zh-Hant'), new Date(2020, 1));
        assertDateEqual(create('1年後', 'zh-Hant'), new Date(2021, 0));

        assertDateEqual(create('5秒鐘後', 'zh-Hant'), new Date(2020, 0, 1, 0, 0, 5));
        assertDateEqual(create('5分鐘後', 'zh-Hant'), new Date(2020, 0, 1, 0, 5));
        assertDateEqual(create('5小時後', 'zh-Hant'), new Date(2020, 0, 1, 5));

        assertDateEqual(create('5天後', 'zh-Hant'), new Date(2020, 0, 6));
        assertDateEqual(create('5週後', 'zh-Hant'), new Date(2020, 1, 5));
        assertDateEqual(create('5個月後', 'zh-Hant'), new Date(2020, 5));
        assertDateEqual(create('5年後', 'zh-Hant'), new Date(2025, 0));
      });

      it('should parse relative phrases', () => {
        assertDateEqual(create('現在', 'zh-Hant'), new Date(2020, 0));

        assertDateEqual(create('前天', 'zh-Hant'), new Date(2019, 11, 30));
        assertDateEqual(create('昨天', 'zh-Hant'), new Date(2019, 11, 31));
        assertDateEqual(create('今天', 'zh-Hant'), new Date(2020, 0, 1));
        assertDateEqual(create('明天', 'zh-Hant'), new Date(2020, 0, 2));
        assertDateEqual(create('後天', 'zh-Hant'), new Date(2020, 0, 3));

        assertDateEqual(create('上週', 'zh-Hant'), new Date(2019, 11, 25));
        assertDateEqual(create('本週', 'zh-Hant'), new Date(2020, 0, 1));
        assertDateEqual(create('下週', 'zh-Hant'), new Date(2020, 0, 8));

        assertDateEqual(create('上個月', 'zh-Hant'), new Date(2019, 11));
        assertDateEqual(create('本月', 'zh-Hant'), new Date(2020, 0));
        assertDateEqual(create('下個月', 'zh-Hant'), new Date(2020, 1));

        assertDateEqual(create('去年', 'zh-Hant'), new Date(2019, 0));
        assertDateEqual(create('今年', 'zh-Hant'), new Date(2020, 0));
        assertDateEqual(create('明年', 'zh-Hant'), new Date(2021, 0));

      });

      it('should parse weekdays', () => {
        assertDateEqual(create('星期日', 'zh-Hant'), new Date(2019, 11, 29));
        assertDateEqual(create('星期一', 'zh-Hant'), new Date(2019, 11, 30));
        assertDateEqual(create('星期二', 'zh-Hant'), new Date(2019, 11, 31));
        assertDateEqual(create('星期三', 'zh-Hant'), new Date(2020, 0, 1));
        assertDateEqual(create('星期四', 'zh-Hant'), new Date(2020, 0, 2));
        assertDateEqual(create('星期五', 'zh-Hant'), new Date(2020, 0, 3));
        assertDateEqual(create('星期六', 'zh-Hant'), new Date(2020, 0, 4));
      });

      it('should parse compound relative phrases', () => {
        assertDateEqual(create('下個月25日', 'zh-Hant'), new Date(2020, 1, 25));
        assertDateEqual(create('明年3月', 'zh-Hant'), new Date(2021, 2));
        assertDateEqual(create('明年3月25日', 'zh-Hant'), new Date(2021, 2, 25));
      });

      it('should parse relative units with time', () => {
        assertDateEqual(create('明天 3:45', 'zh-Hant'), new Date(2020, 0, 2, 3, 45));
        assertDateEqual(create('明天 下午3:45', 'zh-Hant'), new Date(2020, 0, 2, 15, 45));
        assertDateEqual(create('星期五 3:45', 'zh-Hant'), new Date(2020, 0, 3, 3, 45));
      });

      it('should parse relative week with weekday', () => {
        assertDateEqual(create('上週 星期三', 'zh-Hant'), new Date(2019, 11, 25));
        assertDateEqual(create('下週 星期五', 'zh-Hant'), new Date(2020, 0, 10));
        assertDateEqual(create('下週 星期三 15:35', 'zh-Hant'), new Date(2020, 0, 8, 15, 35));
      });

    });

    describeInstance('format', (format) => {

      it('should correctly format date with built-in aliases', () => {
        assertEqual(
          format(new Date(), Sugar.Date.DATE_FULL, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATE_LONG, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATE_MEDIUM, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATE_SHORT, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }).format(new Date()),
        );
      });

      it('should correctly format time with built-in aliases', () => {
        assertEqual(
          format(new Date(), Sugar.Date.TIME_FULL, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'long',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.TIME_LONG, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.TIME_MEDIUM, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.TIME_SHORT, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date()),
        );
      });

      it('should correctly format datetime with built-in aliases', () => {
        assertEqual(
          format(new Date(), Sugar.Date.DATETIME_FULL, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            weekday: 'long',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATETIME_LONG, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATETIME_MEDIUM, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATETIME_SHORT, 'zh-Hant'),
          new Intl.DateTimeFormat('zh-Hant', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date()),
        );
      });

      it('should correctly format month tokens', () => {
        assertEqual(format(new Date(2020, 0), 'M月', 'zh-Hant'), '1月');
        assertEqual(format(new Date(2020, 1), 'M月', 'zh-Hant'), '2月');
        assertEqual(format(new Date(2020, 2), 'M月', 'zh-Hant'), '3月');
        assertEqual(format(new Date(2020, 3), 'M月', 'zh-Hant'), '4月');
        assertEqual(format(new Date(2020, 4), 'M月', 'zh-Hant'), '5月');
        assertEqual(format(new Date(2020, 5), 'M月', 'zh-Hant'), '6月');
        assertEqual(format(new Date(2020, 6), 'M月', 'zh-Hant'), '7月');
        assertEqual(format(new Date(2020, 7), 'M月', 'zh-Hant'), '8月');
        assertEqual(format(new Date(2020, 8), 'M月', 'zh-Hant'), '9月');
        assertEqual(format(new Date(2020, 9), 'M月', 'zh-Hant'), '10月');
        assertEqual(format(new Date(2020, 10), 'M月', 'zh-Hant'), '11月');
        assertEqual(format(new Date(2020, 11), 'M月', 'zh-Hant'), '12月');
      });

      it('should correctly format month token alternates', () => {
        assertEqual(format(new Date(2020, 0), 'M', 'zh-Hant'), '1');
        assertEqual(format(new Date(2020, 0), 'MM', 'zh-Hant'), '01');
        assertEqual(format(new Date(2020, 0), 'MMM', 'zh-Hant'), '1月');
        assertEqual(format(new Date(2020, 0), 'MMMM', 'zh-Hant'), '1月');
        assertEqual(format(new Date(2020, 0), 'MMMMM', 'zh-Hant'), '1月');
        assertEqual(format(new Date(2020, 0), 'L', 'zh-Hant'), '1月');
        assertEqual(format(new Date(2020, 0), 'LL', 'zh-Hant'), '01月');
        assertEqual(format(new Date(2020, 0), 'LLL', 'zh-Hant'), '1月');
        assertEqual(format(new Date(2020, 0), 'LLLL', 'zh-Hant'), '1月');
        assertEqual(format(new Date(2020, 0), 'LLLLL', 'zh-Hant'), '1');
      });

      it('should correctly format weekday tokens', () => {
        assertEqual(format(new Date(2019, 11, 29), 'E', 'zh-Hant'), '週日');
        assertEqual(format(new Date(2019, 11, 30), 'E', 'zh-Hant'), '週一');
        assertEqual(format(new Date(2019, 11, 31), 'E', 'zh-Hant'), '週二');
        assertEqual(format(new Date(2020, 0, 1), 'E', 'zh-Hant'), '週三');
        assertEqual(format(new Date(2020, 0, 2), 'E', 'zh-Hant'), '週四');
        assertEqual(format(new Date(2020, 0, 3), 'E', 'zh-Hant'), '週五');
        assertEqual(format(new Date(2020, 0, 4), 'E', 'zh-Hant'), '週六');
      });

      it('should correctly format weekday token alternates', () => {
        assertEqual(format(new Date(2020, 0), 'E', 'zh-Hant'), '週三');
        assertEqual(format(new Date(2020, 0), 'EE', 'zh-Hant'), '週三');
        assertEqual(format(new Date(2020, 0), 'EEE', 'zh-Hant'), '週三');
        assertEqual(format(new Date(2020, 0), 'EEEE', 'zh-Hant'), '星期三');
        assertEqual(format(new Date(2020, 0), 'EEEEE', 'zh-Hant'), '三');
        assertEqual(format(new Date(2020, 0), 'c', 'zh-Hant'), '週三');
        assertEqual(format(new Date(2020, 0), 'cc', 'zh-Hant'), '週三');
        assertEqual(format(new Date(2020, 0), 'ccc', 'zh-Hant'), '週三');
        assertEqual(format(new Date(2020, 0), 'cccc', 'zh-Hant'), '星期三');
        assertEqual(format(new Date(2020, 0), 'ccccc', 'zh-Hant'), '三');
      });

      it('should be able to format more formats with token formatter', () => {
        const date = new Date(2020, 0, 1, 15, 52);
        assertEqual(
          format(date, 'yyyy年M月d日aah點mm分', 'zh-Hant'),
          '2020年1月1日下午3點52分'
        );
        assertEqual(
          format(date, 'yyyy年M月d日aah點mm分 EEEE', 'zh-Hant'),
          '2020年1月1日下午3點52分 星期三'
        );
        assertEqual(
          format(date, 'yyyy年M月d日 HH:mm E', 'zh-Hant'),
          '2020年1月1日 15:52 週三'
        );
      });

    });

    describeInstance('relative', (relative) => {

      it('should format relative time ago', () => {
        assertEqual(relative(new Date(2019, 11, 31, 23, 59, 59), 'zh-Hant'), '1秒前');
        assertEqual(relative(new Date(2019, 11, 31, 23, 59), 'zh-Hant'), '1分鐘前');
        assertEqual(relative(new Date(2019, 11, 31, 23), 'zh-Hant'), '1小時前');
        assertEqual(relative(new Date(2019, 11, 31), 'zh-Hant'), '1天前');
        assertEqual(relative(new Date(2019, 11, 25), 'zh-Hant'), '1週前');
        assertEqual(relative(new Date(2019, 11), 'zh-Hant'), '1個月前');
        assertEqual(relative(new Date(2019, 0), 'zh-Hant'), '1年前');
      });

      it('should format relative time from now', () => {
        assertEqual(relative(new Date(2020, 0, 1, 0, 0, 1), 'zh-Hant'), '1秒後');
        assertEqual(relative(new Date(2020, 0, 1, 0, 1), 'zh-Hant'), '1分鐘後');
        assertEqual(relative(new Date(2020, 0, 1, 1), 'zh-Hant'), '1小時後');
        assertEqual(relative(new Date(2020, 0, 2), 'zh-Hant'), '1天後');
        assertEqual(relative(new Date(2020, 0, 8), 'zh-Hant'), '1週後');
        assertEqual(relative(new Date(2020, 1), 'zh-Hant'), '1個月後');
        assertEqual(relative(new Date(2021, 0), 'zh-Hant'), '1年後');
      });

      it('should format relative time with compare date', () => {
        const compare = new Date(2021, 1);

        assertEqual(
          relative(new Date(2022, 1), {
            compare,
            locale: 'zh-Hant',
          }),
          '1年',
        );
        assertEqual(
          relative(new Date(2021, 2), {
            compare,
            locale: 'zh-Hant',
          }),
          '1个個月',
        );
        assertEqual(
          relative(new Date(2021, 1, 8), {
            compare,
            locale: 'zh-Hant',
          }),
          '1週',
        );
        assertEqual(
          relative(new Date(2021, 1, 2), {
            compare,
            locale: 'zh-Hant',
          }),
          '1天',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 1), {
            compare,
            locale: 'zh-Hant',
          }),
          '1小時',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 0, 1), {
            compare,
            locale: 'zh-Hant',
          }),
          '1分鐘',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 0, 0, 1), {
            compare,
            locale: 'zh-Hant',
          }),
          '1秒鐘',
        );
      });

    });

  });

  describeNamespace('Number', () => {

    describeInstance('duration', (duration) => {

      it('should format duration', () => {
        assertEqual(duration(365.25 * 24 * 60 * 60 * 1000, 'zh-Hant'), '1年');
        assertEqual(duration(31 * 24 * 60 * 60 * 1000, 'zh-Hant'), '1个個月');
        assertEqual(duration(7 * 24 * 60 * 60 * 1000, 'zh-Hant'), '1週');
        assertEqual(duration(24 * 60 * 60 * 1000, 'zh-Hant'), '1天');
        assertEqual(duration(60 * 60 * 1000, 'zh-Hant'), '1小時');
        assertEqual(duration(60 * 1000, 'zh-Hant'), '1分鐘');
        assertEqual(duration(1000, 'zh-Hant'), '1秒鐘');
      });

    });

  });

});
