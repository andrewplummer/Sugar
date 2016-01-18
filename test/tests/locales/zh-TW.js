namespace('Dates Traditional Chinese', function () {
  'use strict';

  var now;
  var then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('zh-TW');
  });


  method('create', function() {
    equal(testCreateDate('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | basic Traditional Chinese date');
    equal(testCreateDate('2011年5月'), new Date(2011, 4), 'year and month');
    equal(testCreateDate('5月15日'), new Date(now.getFullYear(), 4, 15), 'month and date');
    equal(testCreateDate('2011年'), new Date(2011, 0), 'year');
    equal(testCreateDate('5月'), new Date(now.getFullYear(), 4), 'month');
    equal(testCreateDate('15日'), new Date(now.getFullYear(), now.getMonth(), 15), 'date');
    equal(testCreateDate('星期一'), getDateWithWeekdayAndOffset(1), 'Monday');
    equal(testCreateDate('星期天'), getDateWithWeekdayAndOffset(0), 'Sunday');
    equal(testCreateDate('九日'), new Date(now.getFullYear(), now.getMonth(), 9), 'the 9th');
    equal(testCreateDate('二十五日'), new Date(now.getFullYear(), now.getMonth(), 25), 'the 25th');
    equal(testCreateDate('二十五號'), new Date(now.getFullYear(), now.getMonth(), 25), '號 should be understood as well');

    equal(testCreateDate('2011年5月15日 3:45'), new Date(2011, 4, 15, 3, 45), 'Date#create | basic Traditional Chinese date 3:45');
    equal(testCreateDate('2011年5月15日 下午3:45'), new Date(2011, 4, 15, 15, 45), 'Date#create | basic Traditional Chinese date 3:45pm');
    equal(testCreateDate('2011年5月15日 3點45分鐘'), new Date(2011, 4, 15, 3, 45), 'Date#create | basic Traditional Chinese date 3:45pm kanji');
    equal(testCreateDate('2011年5月15日 下午3點45分鐘'), new Date(2011, 4, 15, 15, 45), 'Date#create | basic Traditional Chinese date 3:45pm kanji afternoon');

    equal(testCreateDate('一毫秒前'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    equal(testCreateDate('一秒鐘前'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    equal(testCreateDate('一分鐘前'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    equal(testCreateDate('一小時前'), getRelativeDate(null, null, null, -1), 'one hour ago');
    equal(testCreateDate('一天前'), getRelativeDate(null, null, -1), 'one day ago');
    equal(testCreateDate('一週前'), getRelativeDate(null, null, -7), 'one week 週');
    equal(testCreateDate('一個星期前'), getRelativeDate(null, null, -7), 'one week 個星期');
    equal(testCreateDate('一個月前'), getRelativeDate(null, -1), 'one month ago');
    equal(testCreateDate('一年前'), getRelativeDate(-1), 'one year ago');

    equal(testCreateDate('5毫秒後'), getRelativeDate(null, null, null, null, null, null, 5), 'five millisecond from now');
    equal(testCreateDate('5秒鐘後'), getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    equal(testCreateDate('5分鐘後'), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    equal(testCreateDate('5小時後'), getRelativeDate(null, null, null, 5), 'five hour from now');
    equal(testCreateDate('5天後'), getRelativeDate(null, null, 5), 'five day from now');
    equal(testCreateDate('5週後'), getRelativeDate(null, null, 35), 'five weeks from now 週');
    equal(testCreateDate('5個星期後'), getRelativeDate(null, null, 35), 'five weeks from now 個星期');
    equal(testCreateDate('5個月後'), getRelativeDate(null, 5), 'five months');
    equal(testCreateDate('5年後'), getRelativeDate(5), 'five years from now');

    equal(testCreateDate('２０１１年'), new Date(2011, 0), 'full-width year');

    equal(testCreateDate('大前天'), run(getRelativeDate(null, null, -3), 'reset'), 'day before day before yesterday');
    equal(testCreateDate('前天'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    equal(testCreateDate('昨天'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    equal(testCreateDate('今天'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    equal(testCreateDate('明天'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    equal(testCreateDate('後天'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');
    equal(testCreateDate('大後天'), run(getRelativeDate(null, null, 3), 'reset'), 'day after day after tomorrow');

    equal(testCreateDate('上週'), getRelativeDate(null, null, -7), 'Last week');
    equal(testCreateDate('這週'), getRelativeDate(null, null, 0),  'This week');
    equal(testCreateDate('下週'), getRelativeDate(null, null, 7),  'Next week');

    equal(testCreateDate('上個月'), getRelativeDate(null, -1), 'last month');
    equal(testCreateDate('這個月'), getRelativeDate(null, 0), 'this month');
    equal(testCreateDate('下個月'), getRelativeDate(null, 1), 'Next month');

    equal(testCreateDate('去年'), getRelativeDate(-1), 'Last year');
    equal(testCreateDate('明年'), getRelativeDate(1), 'Next year');

    equal(testCreateDate('上週三'), getDateWithWeekdayAndOffset(3, -7), 'Last wednesday');
    equal(testCreateDate('這個月'), getRelativeDate(null, 0), 'this month');
    equal(testCreateDate('下週五'), getDateWithWeekdayAndOffset(5, 7), 'Next friday');

    equal(testCreateDate('18:00', 'zh-TW').getHours(), 18, 'hour:minute only');

  });

  method('format', function() {

    test(then, '2010年1月5日下午3點52分', 'default format');

    assertFormatShortcut(then, 'short', '2010/01/05');
    assertFormatShortcut(then, 'medium', '2010年1月5日');
    assertFormatShortcut(then, 'long', '2010年1月5日下午3點52分');
    assertFormatShortcut(then, 'full', '2010年1月5日星期二下午3點52分');
    test(then, ['{time}'], '下午3點52分', 'preferred time');
    test(then, ['{stamp}'], '2010年1月5日15:52二', 'preferred stamp');
    test(then, ['%c'], '2010年1月5日15:52二', '%c stamp');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], '日', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], '一', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], '二', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], '三', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], '四', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], '五', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], '六', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], '1月', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], '2月', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], '3月', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], '4月', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], '5月', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], '6月', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], '7月', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], '8月', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], '9月', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], '10月', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], '11月', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], '12月', 'Dec');

  });


  method('relative', function() {
    assertRelative('1 second ago', '1秒鐘前');
    assertRelative('1 minute ago', '1分鐘前');
    assertRelative('1 hour ago',   '1小時前');
    assertRelative('1 day ago',    '1天前');
    assertRelative('1 week ago',   '1個星期前');
    assertRelative('1 month ago',  '1個月前');
    assertRelative('1 year ago',   '1年前');

    assertRelative('2 seconds ago', '2秒鐘前');
    assertRelative('2 minutes ago', '2分鐘前');
    assertRelative('2 hours ago',   '2小時前');
    assertRelative('2 days ago',    '2天前');
    assertRelative('2 weeks ago',   '2個星期前');
    assertRelative('2 months ago',  '2個月前');
    assertRelative('2 years ago',   '2年前');

    assertRelative('1 second from now', '1秒鐘後');
    assertRelative('1 minute from now', '1分鐘後');
    assertRelative('1 hour from now',   '1小時後');
    assertRelative('1 day from now',    '1天後');
    assertRelative('1 week from now',   '1個星期後');
    assertRelative('1 year from now',   '1年後');

    assertRelative('5 second from now', '5秒鐘後');
    assertRelative('5 minute from now', '5分鐘後');
    assertRelative('5 hour from now',   '5小時後');
    assertRelative('5 day from now',    '5天後');
    assertRelative('5 week from now',   '1個月後');
    assertRelative('5 year from now',   '5年後');
  });

  method('beginning/end', function() {
    equal(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Chinese (Simplified) Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['zh-TW'], '5小時', 'simple duration');
  });

});

