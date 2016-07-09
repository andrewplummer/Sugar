namespace('Date | Simplified Chinese', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('zh-CN');
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
    assertDateParsed('二十五号', new Date(now.getFullYear(), now.getMonth(), 25));
    assertDateParsed('九月二十五号', new Date(now.getFullYear(), 8, 25));

    assertDateParsed('2011年5月15日 3:45', new Date(2011, 4, 15, 3, 45));
    assertDateParsed('2011年5月15日 下午3:45', new Date(2011, 4, 15, 15, 45));
    assertDateParsed('2011年5月15日 3点45分钟', new Date(2011, 4, 15, 3, 45));
    assertDateParsed('2011年5月15日 下午3点45分钟', new Date(2011, 4, 15, 15, 45));

    assertDateParsed('2011年5月15日下午3:45', new Date(2011, 4, 15, 15, 45));

    assertDateParsed('一毫秒前',   getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('一秒钟前',   getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('一分钟前',   getRelativeDate(0,0,0,0,-1));
    assertDateParsed('一小时前',   getRelativeDate(0,0,0,-1));
    assertDateParsed('一天前',     getRelativeDate(0,0,-1));
    assertDateParsed('一周前',     getRelativeDate(0,0,-7));
    assertDateParsed('一个星期前', getRelativeDate(0,0,-7));
    assertDateParsed('一个月前',   getRelativeDate(0,-1));
    assertDateParsed('一年前',     getRelativeDate(-1));


    assertDateParsed('5毫秒后',   getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('5秒钟后',   getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('5分钟后',   getRelativeDate(0,0,0,0,5));
    assertDateParsed('5小时后',   getRelativeDate(0,0,0,5));
    assertDateParsed('5天后',     getRelativeDate(0,0,5));
    assertDateParsed('5周后',     getRelativeDate(0,0,35));
    assertDateParsed('5个星期后', getRelativeDate(0,0,35));
    assertDateParsed('5个月后',   getRelativeDate(0,5));
    assertDateParsed('5年后',     getRelativeDate(5));

    assertDateParsed('２０１１年', new Date(2011, 0));
    assertDateParsed('星期三', testGetWeekday(3));

    assertDateParsed('前天',   getRelativeDateReset(0,0,-2));
    assertDateParsed('大前天', getRelativeDateReset(0,0,-3));
    assertDateParsed('昨天',   getRelativeDateReset(0,0,-1));
    assertDateParsed('今天',   getRelativeDateReset(0,0,0));
    assertDateParsed('明天',   getRelativeDateReset(0,0,1));
    assertDateParsed('后天',   getRelativeDateReset(0,0,2));
    assertDateParsed('大后天', getRelativeDateReset(0,0,3));

    assertDateParsed('上周', getRelativeDate(0,0,-7));
    assertDateParsed('这周', getRelativeDate(0,0,0));
    assertDateParsed('下周', getRelativeDate(0,0,7));

    assertDateParsed('上个月', getRelativeDate(0,-1));
    assertDateParsed('这个月', getRelativeDate(0,0));
    assertDateParsed('下个月', getRelativeDate(0,1));

    assertDateParsed('去年', getRelativeDate(-1));
    assertDateParsed('明年', getRelativeDate(1));

    assertDateParsed('上周三', testGetWeekday(3, -1));
    assertDateParsed('这周六', testGetWeekday(6));
    assertDateParsed('下周五', testGetWeekday(5, 1));

    assertDateParsed('2011年5月15日 下午3:45', new Date(2011, 4, 15, 15, 45));

    assertDateParsed('2011年5月15日 3:45:59', new Date(2011, 4, 15, 3, 45, 59));
    assertDateParsed('2011年5月15日 3点45分', new Date(2011, 4, 15, 3, 45, 0));

    assertDateParsed('二〇〇八年十一月十四日 三点四十五分', new Date(2008, 10, 14, 3, 45));
    assertDateParsed('二〇〇八年十一月十四日 三点四十五分钟', new Date(2008, 10, 14, 3, 45));

    assertDateParsed('二〇〇八年十一月十四日 三点四十五分钟', new Date(2008, 10, 14, 3, 45));

    equal(testCreateDate('18:00', 'zh-CN').getHours(), 18, 'hour:minute only');

  });

  method('format', function() {

    test(then, '2010年1月5日下午3点52分', 'default format');

    assertFormatShortcut(then, 'short', '2010-01-05');
    assertFormatShortcut(then, 'medium', '2010年1月5日');
    assertFormatShortcut(then, 'long', '2010年1月5日下午3点52分');
    assertFormatShortcut(then, 'full', '2010年1月5日星期二下午3点52分');
    test(then, ['{time}'], '下午3点52分', 'preferred time');
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
    assertRelative('1 second ago', '1秒钟前');
    assertRelative('1 minute ago', '1分钟前');
    assertRelative('1 hour ago',   '1小时前');
    assertRelative('1 day ago',    '1天前');
    assertRelative('1 week ago',   '1个星期前');
    assertRelative('1 month ago',  '1个月前');
    assertRelative('1 year ago',   '1年前');

    assertRelative('2 seconds ago', '2秒钟前');
    assertRelative('2 minutes ago', '2分钟前');
    assertRelative('2 hours ago',   '2小时前');
    assertRelative('2 days ago',    '2天前');
    assertRelative('2 weeks ago',   '2个星期前');
    assertRelative('2 months ago',  '2个月前');
    assertRelative('2 years ago',   '2年前');

    assertRelative('1 second from now', '1秒钟后');
    assertRelative('1 minute from now', '1分钟后');
    assertRelative('1 hour from now',   '1小时后');
    assertRelative('1 day from now',    '1天后');
    assertRelative('1 week from now',   '1个星期后');
    assertRelative('1 year from now',   '1年后');

    assertRelative('5 seconds from now', '5秒钟后');
    assertRelative('5 minutes from now', '5分钟后');
    assertRelative('5 hours from now',   '5小时后');
    assertRelative('5 days from now',    '5天后');
    assertRelative('5 weeks from now',   '1个月后');
    assertRelative('5 years from now',   '5年后');
  });


  group('Hanzi', function() {
    assertDateParsed('二〇一二年五月', new Date(2012, 4));
    assertDateParsed('二〇一二年', new Date(2012, 0));
    assertDateParsed('五月', new Date(now.getFullYear(), 4));
    assertDateParsed('十二月', new Date(now.getFullYear(), 11));
    assertDateParsed('十一月', new Date(now.getFullYear(), 10));
    assertDateParsed('十月', new Date(now.getFullYear(), 9));
    assertDateParsed('二〇一二年', new Date(2012, 0));

    assertDateParsed('二千二百二十二年', new Date(2222, 0));
    assertDateParsed('二千二十二年', new Date(2022, 0));
    assertDateParsed('二千二年', new Date(2002, 0));
    assertDateParsed('二千年', new Date(2000, 0));
    assertDateParsed('千年', new Date(1000, 0));

    assertDateParsed('二千二百二十年', new Date(2220, 0));
    assertDateParsed('二千二百年', new Date(2200, 0));
    assertDateParsed('二千二年', new Date(2002, 0));

    assertDateParsed('千二百二十二年', new Date(1222, 0));
    assertDateParsed('千二百二十二年', new Date(1222, 0));
    assertDateParsed('千百二十二年', new Date(1122, 0));
    assertDateParsed('千二十二年', new Date(1022, 0));
    assertDateParsed('千十二年', new Date(1012, 0));

    assertDateParsed('二〇二一年', new Date(2021, 0));
    assertDateParsed('二三二一年', new Date(2321, 0));
    assertDateParsed('四三二一年', new Date(4321, 0));

    // Issue #148 various Chinese dates

    assertDateParsed('星期日 下午2:00', testGetWeekday(0,0,14));
    assertDateParsed('下星期六 3点12分', testGetWeekday(6, 1, 3, 12));

    assertDateParsed('上午3点12分', testDateSet(getRelativeDateReset(0,0,0), {hour:3,minute:12}));
    assertDateParsed('上午3点', testDateSet(getRelativeDateReset(0,0,0), {hour:3}));

    assertDateParsed('上午3时12分', testDateSet(getRelativeDateReset(0,0,0), {hour:3,minute:12}));
    assertDateParsed('上午3时', testDateSet(getRelativeDateReset(0,0,0), {hour:3}));;

  });

  method('beginning/end', function() {
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Simplified Chinese', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['zh-CN'], '5小时', 'simple duration');
  });

});
