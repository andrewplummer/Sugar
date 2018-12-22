namespace('Date | Traditional Chinese', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('zh-TW');
  });

  method('create', function() {

    assertDateParsed('2011年5月15日', new Date(2011, 4, 15));
    assertDateParsed('2011年5月', new Date(2011, 4));
    assertDateParsed('5月15日', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011年', new Date(2011, 0));
    assertDateParsed('2016年2月02日', new Date(2016, 1, 2));

    assertDateParsed('5月', new Date(now.getFullYear(), 4));
    assertDateParsed('15日', new Date(now.getFullYear(), now.getMonth(), 15));
    assertDateParsed('星期一', testGetWeekday(1));
    assertDateParsed('星期天', testGetWeekday(0));
    assertDateParsed('九日', new Date(now.getFullYear(), now.getMonth(), 9));
    assertDateParsed('二十五日', new Date(now.getFullYear(), now.getMonth(), 25));
    assertDateParsed('二十五號', new Date(now.getFullYear(), now.getMonth(), 25));

    assertDateParsed('2011年5月15日 3:45', new Date(2011, 4, 15, 3, 45));
    assertDateParsed('2011年5月15日 下午3:45', new Date(2011, 4, 15, 15, 45));
    assertDateParsed('2011年5月15日 3點45分鐘', new Date(2011, 4, 15, 3, 45));
    assertDateParsed('2011年5月15日 下午3點45分鐘', new Date(2011, 4, 15, 15, 45));

    assertDateParsed('2011年5月15日下午3點45分鐘', new Date(2011, 4, 15, 15, 45));

    assertDateParsed('一毫秒前',   getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('一秒鐘前',   getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('一分鐘前',   getRelativeDate(0,0,0,0,-1));
    assertDateParsed('一小時前',   getRelativeDate(0,0,0,-1));
    assertDateParsed('一天前',     getRelativeDate(0,0,-1));
    assertDateParsed('一週前',     getRelativeDate(0,0,-7));
    assertDateParsed('一個星期前', getRelativeDate(0,0,-7));
    assertDateParsed('一個月前',   getRelativeDate(0,-1));
    assertDateParsed('一年前',     getRelativeDate(-1));

    assertDateParsed('5毫秒後',   getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('5秒鐘後',   getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('5分鐘後',   getRelativeDate(0,0,0,0,5));
    assertDateParsed('5小時後',   getRelativeDate(0,0,0,5));
    assertDateParsed('5天後',     getRelativeDate(0,0,5));
    assertDateParsed('5週後',     getRelativeDate(0,0,35));
    assertDateParsed('5個星期後', getRelativeDate(0,0,35));
    assertDateParsed('5個月後',   getRelativeDate(0,5));
    assertDateParsed('5年後',     getRelativeDate(5));

    assertDateParsed('２０１１年', new Date(2011, 0));

    assertDateParsed('大前天', getRelativeDateReset(0,0,-3));
    assertDateParsed('前天',   getRelativeDateReset(0,0,-2));
    assertDateParsed('昨天',   getRelativeDateReset(0,0,-1));
    assertDateParsed('今天',   getRelativeDateReset(0,0,0));
    assertDateParsed('明天',   getRelativeDateReset(0,0,1));
    assertDateParsed('後天',   getRelativeDateReset(0,0,2));
    assertDateParsed('大後天', getRelativeDateReset(0,0,3));

    assertDateParsed('上週', getRelativeDate(0,0,-7));
    assertDateParsed('這週', getRelativeDate(0,0,0));
    assertDateParsed('下週', getRelativeDate(0,0,7));

    assertDateParsed('上個月', getRelativeDate(0,-1));
    assertDateParsed('這個月', getRelativeDate(0,0));
    assertDateParsed('下個月', getRelativeDate(0,1));

    assertDateParsed('去年', getRelativeDate(-1));
    assertDateParsed('明年', getRelativeDate(1));

    assertDateParsed('上週三', testGetWeekday(3,-1));
    assertDateParsed('這個月', getRelativeDate(0,0));
    assertDateParsed('下週五', testGetWeekday(5, 1));

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
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Traditional Chinese', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['zh-TW'], '5小時', 'simple duration');
  });

});

