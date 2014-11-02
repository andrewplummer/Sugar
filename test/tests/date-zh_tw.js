package('Dates Traditional Chinese', function () {
  "use strict";

  var now;
  var then;

  setup(function() {
    now = new Date();
    then = new Date(2011, 7, 25, 15, 45, 50);
    testSetLocale('zh-TW');
  });


  method('create', function() {
    dateEqual(testCreateDate('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | basic Traditional Chinese date');
    dateEqual(testCreateDate('2011年5月'), new Date(2011, 4), 'year and month');
    dateEqual(testCreateDate('5月15日'), new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011年'), new Date(2011, 0), 'year');
    dateEqual(testCreateDate('5月'), new Date(now.getFullYear(), 4), 'month');
    dateEqual(testCreateDate('15日'), new Date(now.getFullYear(), now.getMonth(), 15), 'date');
    dateEqual(testCreateDate('星期一'), getDateWithWeekdayAndOffset(1), 'Monday');
    dateEqual(testCreateDate('星期天'), getDateWithWeekdayAndOffset(0), 'Sunday');
    dateEqual(testCreateDate('九日'), new Date(now.getFullYear(), now.getMonth(), 9), 'the 9th');
    dateEqual(testCreateDate('二十五日'), new Date(now.getFullYear(), now.getMonth(), 25), 'the 25th');
    dateEqual(testCreateDate('二十五號'), new Date(now.getFullYear(), now.getMonth(), 25), '號 should be understood as well');

    dateEqual(testCreateDate('2011年5月15日 3:45'), new Date(2011, 4, 15, 3, 45), 'Date#create | basic Traditional Chinese date 3:45');
    dateEqual(testCreateDate('2011年5月15日 下午3:45'), new Date(2011, 4, 15, 15, 45), 'Date#create | basic Traditional Chinese date 3:45pm');
    dateEqual(testCreateDate('2011年5月15日 3點45分鐘'), new Date(2011, 4, 15, 3, 45), 'Date#create | basic Traditional Chinese date 3:45pm kanji');
    dateEqual(testCreateDate('2011年5月15日 下午3點45分鐘'), new Date(2011, 4, 15, 15, 45), 'Date#create | basic Traditional Chinese date 3:45pm kanji afternoon');

    dateEqual(testCreateDate('一毫秒前'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('一秒鐘前'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('一分鐘前'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('一小時前'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('一天前'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('一週前'), getRelativeDate(null, null, -7), 'one week 週');
    dateEqual(testCreateDate('一個星期前'), getRelativeDate(null, null, -7), 'one week 個星期');
    dateEqual(testCreateDate('一個月前'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('一年前'), getRelativeDate(-1), 'one year ago');

    dateEqual(testCreateDate('5毫秒後'), getRelativeDate(null, null, null, null, null, null, 5), 'five millisecond from now');
    dateEqual(testCreateDate('5秒鐘後'), getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    dateEqual(testCreateDate('5分鐘後'), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    dateEqual(testCreateDate('5小時後'), getRelativeDate(null, null, null, 5), 'five hour from now');
    dateEqual(testCreateDate('5天後'), getRelativeDate(null, null, 5), 'five day from now');
    dateEqual(testCreateDate('5週後'), getRelativeDate(null, null, 35), 'five weeks from now 週');
    dateEqual(testCreateDate('5個星期後'), getRelativeDate(null, null, 35), 'five weeks from now 個星期');
    dateEqual(testCreateDate('5個月後'), getRelativeDate(null, 5), 'five months');
    dateEqual(testCreateDate('5年後'), getRelativeDate(5), 'five years from now');

    dateEqual(testCreateDate('２０１１年'), new Date(2011, 0), 'full-width year');

    dateEqual(testCreateDate('大前天'), run(getRelativeDate(null, null, -3), 'reset'), 'day before day before yesterday');
    dateEqual(testCreateDate('前天'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('昨天'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('今天'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('明天'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('後天'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');
    dateEqual(testCreateDate('大後天'), run(getRelativeDate(null, null, 3), 'reset'), 'day after day after tomorrow');

    dateEqual(testCreateDate('上週'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('這週'), dstSafe(getRelativeDate(null, null, 0)), 'This week');
    dateEqual(testCreateDate('下週'), getRelativeDate(null, null, 7), 'Next week');

    dateEqual(testCreateDate('上個月'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('這個月'), getRelativeDate(null, 0), 'this month');
    dateEqual(testCreateDate('下個月'), getRelativeDate(null, 1), 'Next month');

    dateEqual(testCreateDate('去年'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('明年'), getRelativeDate(1), 'Next year');

    dateEqual(testCreateDate('上週三'), getDateWithWeekdayAndOffset(3, -7), 'Last wednesday');
    dateEqual(testCreateDate('這個月'), getRelativeDate(null, 0), 'this month');
    dateEqual(testCreateDate('下週五'), getDateWithWeekdayAndOffset(5, 7), 'Next friday');

    equal(testCreateDate('18:00', 'zh-TW').getHours(), 18, 'hour:minute only');

  });

  method('format', function() {
    test(then, '2011年8月25日 下午3:45', 'standard format');
    test(then, '2011年8月25日 下午3:45', 'standard format');
    test(then, ['{yyyy}年{MM}月{dd}日'], '2011年08月25日', 'format');

    // Format shortcuts
    equal(run(then, 'format', ['long']), '2011年8月25日 下午3:45', 'long format');
    equal(run(then, 'long'), '2011年8月25日 下午3:45', 'long shortcut');
    equal(run(then, 'format', ['full']), '2011年8月25日 星期四 下午3:45:50', 'full format');
    equal(run(then, 'full'), '2011年8月25日 星期四 下午3:45:50', 'full format');
    equal(run(then, 'format', ['short']), '2011年8月25日', 'short format');
    equal(run(then, 'short'), '2011年8月25日', 'short format');
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

});

package('Number | Chinese (Simplified) Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['zh-TW'], '5小時', 'simple duration');
  });

});

