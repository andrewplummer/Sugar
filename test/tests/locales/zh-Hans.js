'use strict';

describe('zh-Hans', () => {

  beforeAll(() => {
    // Set system time to 2020-01-01
    setSystemTime(new Date(2020, 0));
    Intl.DateTimeFormat.mockDefaultLocale('en-US');
  });

  describeNamespace('Date', () => {

    describeStatic('create', (create) => {

      it('should parse basic dates', () => {
        assertDateEqual(create('2011年5月15日', 'zh-Hans'), new Date(2011, 4, 15));
        assertDateEqual(create('2016年2月2日', 'zh-Hans'), new Date(2016, 1, 2));
        assertDateEqual(create('2011年5月', 'zh-Hans'), new Date(2011, 4));
        assertDateEqual(create('5月15日', 'zh-Hans'), new Date(2020, 4, 15));
      });

      it('should parse basic times', () => {
        assertDateEqual(create('3点45分', 'zh-Hans'), new Date(2020, 0, 1, 3, 45));
        assertDateEqual(create('下午10点', 'zh-Hans'), new Date(2020, 0, 1, 22));
      });

      it('should parse dates with time', () => {
        assertDateEqual(create('2011年5月15日 3:45:59', 'zh-Hans'), new Date(2011, 4, 15, 3, 45, 59));
        assertDateEqual(create('2011年5月15日 3点45分', 'zh-Hans'), new Date(2011, 4, 15, 3, 45, 0));
        assertDateEqual(create('2011年5月15日 3点45分59秒', 'zh-Hans'), new Date(2011, 4, 15, 3, 45, 59));
        assertDateEqual(create('2011年5月15日 上午3点45分', 'zh-Hans'), new Date(2011, 4, 15, 3, 45));
        assertDateEqual(create('2011年5月15日 下午3点45分', 'zh-Hans'), new Date(2011, 4, 15, 15, 45));
        assertDateEqual(create('2011年5月15日 下午3:45', 'zh-Hans'), new Date(2011, 4, 15, 15, 45));
        assertDateEqual(create('上周 星期三 5:15', 'zh-Hans'), new Date(2019, 11, 25, 5, 15));
        assertDateEqual(create('星期一 3点45分', 'zh-Hans'), new Date(2019, 11, 30, 3, 45));
        assertDateEqual(create('15日 3:45:59', 'zh-Hans'), new Date(2020, 0, 15, 3, 45, 59));
        assertDateEqual(create('5月15日 3:45:59', 'zh-Hans'), new Date(2020, 4, 15, 3, 45, 59));
      });

      it('should parse standalone units', () => {
        assertDateEqual(create('2011年', 'zh-Hans'), new Date(2011, 0));
        assertDateEqual(create('15日', 'zh-Hans'), new Date(2020, 0, 15));
        assertDateEqual(create('5月', 'zh-Hans'), new Date(2020, 4));
        assertDateEqual(create('星期一', 'zh-Hans'), new Date(2019, 11, 30));
      });

      it('should parse units ago', () => {
        assertDateEqual(create('一秒钟前', 'zh-Hans'), new Date(2019, 11, 31, 23, 59, 59));
        assertDateEqual(create('一分钟前', 'zh-Hans'), new Date(2019, 11, 31, 23, 59));
        assertDateEqual(create('一小时前', 'zh-Hans'), new Date(2019, 11, 31, 23));
        assertDateEqual(create('一天前', 'zh-Hans'), new Date(2019, 11, 31));
        assertDateEqual(create('一周前', 'zh-Hans'), new Date(2019, 11, 25));
        assertDateEqual(create('一个月前', 'zh-Hans'), new Date(2019, 11));
        assertDateEqual(create('一年前', 'zh-Hans'), new Date(2019, 0));

        assertDateEqual(create('5秒钟前', 'zh-Hans'), new Date(2019, 11, 31, 23, 59, 55));
        assertDateEqual(create('5分钟前', 'zh-Hans'), new Date(2019, 11, 31, 23, 55));
        assertDateEqual(create('5小时前', 'zh-Hans'), new Date(2019, 11, 31, 19));
        assertDateEqual(create('5天前', 'zh-Hans'), new Date(2019, 11, 27));
        assertDateEqual(create('5周前', 'zh-Hans'), new Date(2019, 10, 27));
        assertDateEqual(create('5个月前', 'zh-Hans'), new Date(2019, 7));
        assertDateEqual(create('5年前', 'zh-Hans'), new Date(2015, 0));
      });

      it('should parse units from now', () => {
        assertDateEqual(create('1秒钟后', 'zh-Hans'), new Date(2020, 0, 1, 0, 0, 1));
        assertDateEqual(create('1分钟后', 'zh-Hans'), new Date(2020, 0, 1, 0, 1));
        assertDateEqual(create('1小时后', 'zh-Hans'), new Date(2020, 0, 1, 1));
        assertDateEqual(create('1天后', 'zh-Hans'), new Date(2020, 0, 2));
        assertDateEqual(create('1周后', 'zh-Hans'), new Date(2020, 0, 8));
        assertDateEqual(create('1个月后', 'zh-Hans'), new Date(2020, 1));
        assertDateEqual(create('1年后', 'zh-Hans'), new Date(2021, 0));

        assertDateEqual(create('5秒钟后', 'zh-Hans'), new Date(2020, 0, 1, 0, 0, 5));
        assertDateEqual(create('5分钟后', 'zh-Hans'), new Date(2020, 0, 1, 0, 5));
        assertDateEqual(create('5小时后', 'zh-Hans'), new Date(2020, 0, 1, 5));

        assertDateEqual(create('5天后', 'zh-Hans'), new Date(2020, 0, 6));
        assertDateEqual(create('5周后', 'zh-Hans'), new Date(2020, 1, 5));
        assertDateEqual(create('5个月后', 'zh-Hans'), new Date(2020, 5));
        assertDateEqual(create('5年后', 'zh-Hans'), new Date(2025, 0));
      });

      it('should parse relative phrases', () => {
        assertDateEqual(create('现在', 'zh-Hans'), new Date(2020, 0));

        assertDateEqual(create('前天', 'zh-Hans'), new Date(2019, 11, 30));
        assertDateEqual(create('昨天', 'zh-Hans'), new Date(2019, 11, 31));
        assertDateEqual(create('今天', 'zh-Hans'), new Date(2020, 0, 1));
        assertDateEqual(create('明天', 'zh-Hans'), new Date(2020, 0, 2));
        assertDateEqual(create('后天', 'zh-Hans'), new Date(2020, 0, 3));

        assertDateEqual(create('上周', 'zh-Hans'), new Date(2019, 11, 25));
        assertDateEqual(create('本周', 'zh-Hans'), new Date(2020, 0, 1));
        assertDateEqual(create('下周', 'zh-Hans'), new Date(2020, 0, 8));

        assertDateEqual(create('上个月', 'zh-Hans'), new Date(2019, 11));
        assertDateEqual(create('本月', 'zh-Hans'), new Date(2020, 0));
        assertDateEqual(create('下个月', 'zh-Hans'), new Date(2020, 1));

        assertDateEqual(create('去年', 'zh-Hans'), new Date(2019, 0));
        assertDateEqual(create('今年', 'zh-Hans'), new Date(2020, 0));
        assertDateEqual(create('明年', 'zh-Hans'), new Date(2021, 0));

      });

      it('should parse weekdays', () => {
        assertDateEqual(create('星期日', 'zh-Hans'), new Date(2019, 11, 29));
        assertDateEqual(create('星期一', 'zh-Hans'), new Date(2019, 11, 30));
        assertDateEqual(create('星期二', 'zh-Hans'), new Date(2019, 11, 31));
        assertDateEqual(create('星期三', 'zh-Hans'), new Date(2020, 0, 1));
        assertDateEqual(create('星期四', 'zh-Hans'), new Date(2020, 0, 2));
        assertDateEqual(create('星期五', 'zh-Hans'), new Date(2020, 0, 3));
        assertDateEqual(create('星期六', 'zh-Hans'), new Date(2020, 0, 4));
      });

      it('should parse compound relative phrases', () => {
        assertDateEqual(create('下个月25日', 'zh-Hans'), new Date(2020, 1, 25));
        assertDateEqual(create('明年3月', 'zh-Hans'), new Date(2021, 2));
        assertDateEqual(create('明年3月25日', 'zh-Hans'), new Date(2021, 2, 25));
      });

      it('should parse relative units with time', () => {
        assertDateEqual(create('明天 3:45', 'zh-Hans'), new Date(2020, 0, 2, 3, 45));
        assertDateEqual(create('明天 下午3:45', 'zh-Hans'), new Date(2020, 0, 2, 15, 45));
        assertDateEqual(create('星期五 3:45', 'zh-Hans'), new Date(2020, 0, 3, 3, 45));
      });

      it('should parse relative week with weekday', () => {
        assertDateEqual(create('上周 星期三', 'zh-Hans'), new Date(2019, 11, 25));
        assertDateEqual(create('下周 星期五', 'zh-Hans'), new Date(2020, 0, 10));
        assertDateEqual(create('下周 星期三 15:35', 'zh-Hans'), new Date(2020, 0, 8, 15, 35));
      });

      it('should handle Issue #148', () => {
        assertDateEqual(create('星期日 下午2:00', 'zh-Hans'), new Date(2019, 11, 29, 14));
        assertDateEqual(create('下星期六 3点12分', 'zh-Hans'), new Date(2020, 0, 11, 3, 12));

        assertDateEqual(create('上午3点12分', 'zh-Hans'), new Date(2020, 0, 1, 3, 12));
        assertDateEqual(create('上午3点', 'zh-Hans'), new Date(2020, 0, 1, 3));
      });

    });

    describeInstance('format', (format) => {

      it('should correctly format date with built-in aliases', () => {
        assertEqual(
          format(new Date(), Sugar.Date.DATE_FULL, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATE_LONG, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATE_MEDIUM, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATE_SHORT, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }).format(new Date()),
        );
      });

      it('should correctly format time with built-in aliases', () => {
        assertEqual(
          format(new Date(), Sugar.Date.TIME_FULL, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'long',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.TIME_LONG, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.TIME_MEDIUM, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.TIME_SHORT, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date()),
        );
      });

      it('should correctly format datetime with built-in aliases', () => {
        assertEqual(
          format(new Date(), Sugar.Date.DATETIME_FULL, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            weekday: 'long',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATETIME_LONG, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATETIME_MEDIUM, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date()),
        );
        assertEqual(
          format(new Date(), Sugar.Date.DATETIME_SHORT, 'zh-Hans'),
          new Intl.DateTimeFormat('zh-Hans', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date()),
        );
      });

      it('should correctly format month tokens', () => {
        assertEqual(format(new Date(2020, 0), 'M月', 'zh-Hans'), '1月');
        assertEqual(format(new Date(2020, 1), 'M月', 'zh-Hans'), '2月');
        assertEqual(format(new Date(2020, 2), 'M月', 'zh-Hans'), '3月');
        assertEqual(format(new Date(2020, 3), 'M月', 'zh-Hans'), '4月');
        assertEqual(format(new Date(2020, 4), 'M月', 'zh-Hans'), '5月');
        assertEqual(format(new Date(2020, 5), 'M月', 'zh-Hans'), '6月');
        assertEqual(format(new Date(2020, 6), 'M月', 'zh-Hans'), '7月');
        assertEqual(format(new Date(2020, 7), 'M月', 'zh-Hans'), '8月');
        assertEqual(format(new Date(2020, 8), 'M月', 'zh-Hans'), '9月');
        assertEqual(format(new Date(2020, 9), 'M月', 'zh-Hans'), '10月');
        assertEqual(format(new Date(2020, 10), 'M月', 'zh-Hans'), '11月');
        assertEqual(format(new Date(2020, 11), 'M月', 'zh-Hans'), '12月');
      });

      it('should correctly format month token alternates', () => {
        assertEqual(format(new Date(2020, 0), 'M', 'zh-Hans'), '1');
        assertEqual(format(new Date(2020, 0), 'MM', 'zh-Hans'), '01');
        assertEqual(format(new Date(2020, 0), 'MMM', 'zh-Hans'), '1月');
        assertEqual(format(new Date(2020, 0), 'MMMM', 'zh-Hans'), '1月');
        assertEqual(format(new Date(2020, 0), 'MMMMM', 'zh-Hans'), '1月');
        assertEqual(format(new Date(2020, 0), 'L', 'zh-Hans'), '1月');
        assertEqual(format(new Date(2020, 0), 'LL', 'zh-Hans'), '01月');
        assertEqual(format(new Date(2020, 0), 'LLL', 'zh-Hans'), '1月');
        assertEqual(format(new Date(2020, 0), 'LLLL', 'zh-Hans'), '一月');
        assertEqual(format(new Date(2020, 0), 'LLLLL', 'zh-Hans'), '1');
      });

      it('should correctly format weekday tokens', () => {
        assertEqual(format(new Date(2019, 11, 29), 'E', 'zh-Hans'), '周日');
        assertEqual(format(new Date(2019, 11, 30), 'E', 'zh-Hans'), '周一');
        assertEqual(format(new Date(2019, 11, 31), 'E', 'zh-Hans'), '周二');
        assertEqual(format(new Date(2020, 0, 1), 'E', 'zh-Hans'), '周三');
        assertEqual(format(new Date(2020, 0, 2), 'E', 'zh-Hans'), '周四');
        assertEqual(format(new Date(2020, 0, 3), 'E', 'zh-Hans'), '周五');
        assertEqual(format(new Date(2020, 0, 4), 'E', 'zh-Hans'), '周六');
      });

      it('should correctly format weekday token alternates', () => {
        assertEqual(format(new Date(2020, 0), 'E', 'zh-Hans'), '周三');
        assertEqual(format(new Date(2020, 0), 'EE', 'zh-Hans'), '周三');
        assertEqual(format(new Date(2020, 0), 'EEE', 'zh-Hans'), '周三');
        assertEqual(format(new Date(2020, 0), 'EEEE', 'zh-Hans'), '星期三');
        assertEqual(format(new Date(2020, 0), 'EEEEE', 'zh-Hans'), '三');
        assertEqual(format(new Date(2020, 0), 'c', 'zh-Hans'), '周三');
        assertEqual(format(new Date(2020, 0), 'cc', 'zh-Hans'), '周三');
        assertEqual(format(new Date(2020, 0), 'ccc', 'zh-Hans'), '周三');
        assertEqual(format(new Date(2020, 0), 'cccc', 'zh-Hans'), '星期三');
        assertEqual(format(new Date(2020, 0), 'ccccc', 'zh-Hans'), '三');
      });

      it('should be able to format more formats with token formatter', () => {
        const date = new Date(2020, 0, 1, 15, 52);
        assertEqual(
          format(date, 'yyyy年M月d日aah点mm分', 'zh-Hans'),
          '2020年1月1日下午3点52分'
        );
        assertEqual(
          format(date, 'yyyy年M月d日aah点mm分 EEEE', 'zh-Hans'),
          '2020年1月1日下午3点52分 星期三'
        );
        assertEqual(
          format(date, 'yyyy年M月d日 HH:mm E', 'zh-Hans'),
          '2020年1月1日 15:52 周三'
        );
      });

    });

    describeInstance('relative', (relative) => {

      it('should format relative time ago', () => {
        assertEqual(relative(new Date(2019, 11, 31, 23, 59, 59), 'zh-Hans'), '1秒钟前');
        assertEqual(relative(new Date(2019, 11, 31, 23, 59), 'zh-Hans'), '1分钟前');
        assertEqual(relative(new Date(2019, 11, 31, 23), 'zh-Hans'), '1小时前');
        assertEqual(relative(new Date(2019, 11, 31), 'zh-Hans'), '1天前');
        assertEqual(relative(new Date(2019, 11, 25), 'zh-Hans'), '1周前');
        assertEqual(relative(new Date(2019, 11), 'zh-Hans'), '1个月前');
        assertEqual(relative(new Date(2019, 0), 'zh-Hans'), '1年前');
      });

      it('should format relative time from now', () => {
        assertEqual(relative(new Date(2020, 0, 1, 0, 0, 1), 'zh-Hans'), '1秒钟后');
        assertEqual(relative(new Date(2020, 0, 1, 0, 1), 'zh-Hans'), '1分钟后');
        assertEqual(relative(new Date(2020, 0, 1, 1), 'zh-Hans'), '1小时后');
        assertEqual(relative(new Date(2020, 0, 2), 'zh-Hans'), '1天后');
        assertEqual(relative(new Date(2020, 0, 8), 'zh-Hans'), '1周后');
        assertEqual(relative(new Date(2020, 1), 'zh-Hans'), '1个月后');
        assertEqual(relative(new Date(2021, 0), 'zh-Hans'), '1年后');
      });

      it('should format relative time with compare date', () => {
        const compare = new Date(2021, 1);

        assertEqual(
          relative(new Date(2022, 1), {
            compare,
            locale: 'zh-Hans',
          }),
          '1年',
        );
        assertEqual(
          relative(new Date(2021, 2), {
            compare,
            locale: 'zh-Hans',
          }),
          '1个月',
        );
        assertEqual(
          relative(new Date(2021, 1, 8), {
            compare,
            locale: 'zh-Hans',
          }),
          '1周',
        );
        assertEqual(
          relative(new Date(2021, 1, 2), {
            compare,
            locale: 'zh-Hans',
          }),
          '1天',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 1), {
            compare,
            locale: 'zh-Hans',
          }),
          '1小时',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 0, 1), {
            compare,
            locale: 'zh-Hans',
          }),
          '1分钟',
        );
        assertEqual(
          relative(new Date(2021, 1, 1, 0, 0, 1), {
            compare,
            locale: 'zh-Hans',
          }),
          '1秒钟',
        );
      });

    });

  });

  describeNamespace('Number', () => {

    describeInstance('duration', (duration) => {

      it('should format duration', () => {
        assertEqual(duration(365.25 * 24 * 60 * 60 * 1000, 'zh-Hans'), '1年');
        assertEqual(duration(31 * 24 * 60 * 60 * 1000, 'zh-Hans'), '1个月');
        assertEqual(duration(7 * 24 * 60 * 60 * 1000, 'zh-Hans'), '1周');
        assertEqual(duration(24 * 60 * 60 * 1000, 'zh-Hans'), '1天');
        assertEqual(duration(60 * 60 * 1000, 'zh-Hans'), '1小时');
        assertEqual(duration(60 * 1000, 'zh-Hans'), '1分钟');
        assertEqual(duration(1000, 'zh-Hans'), '1秒钟');
      });

    });

  });

});
