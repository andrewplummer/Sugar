namespace('Date | Japanese', function () {
  'use strict';

  var now, then;

  setup(function() {
    now  = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('ja');
  });

  method('create', function() {

    assertDateParsed('2011年5月15日', new Date(2011, 4, 15));
    assertDateParsed('2016年2月02日', new Date(2016, 1, 2));
    assertDateParsed('2011年5月', new Date(2011, 4));
    assertDateParsed('5月15日', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011年', new Date(2011, 0));
    assertDateParsed('2011年度', new Date(2011, 0));
    assertDateParsed('5月', new Date(now.getFullYear(), 4));
    assertDateParsed('15日', new Date(now.getFullYear(), now.getMonth(), 15));
    assertDateParsed('月曜日', testGetWeekday(1));
    assertDateParsed('月曜', testGetWeekday(1));
    assertDateParsed('3時45分', new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 45));
    assertDateParsed('月曜日3時45分', testGetWeekday(1,0,3,45));

    // Sorry Kabukicho
    assertDateNotParsed('29時');

    assertDateParsed('一月',   new Date(now.getFullYear(), 0));
    assertDateParsed('二月',   new Date(now.getFullYear(), 1));
    assertDateParsed('三月',   new Date(now.getFullYear(), 2));
    assertDateParsed('四月',   new Date(now.getFullYear(), 3));
    assertDateParsed('五月',   new Date(now.getFullYear(), 4));
    assertDateParsed('六月',   new Date(now.getFullYear(), 5));
    assertDateParsed('七月',   new Date(now.getFullYear(), 6));
    assertDateParsed('八月',   new Date(now.getFullYear(), 7));
    assertDateParsed('九月',   new Date(now.getFullYear(), 8));
    assertDateParsed('十月',   new Date(now.getFullYear(), 9));
    assertDateParsed('十一月', new Date(now.getFullYear(), 10));
    assertDateParsed('十二月', new Date(now.getFullYear(), 11));

    assertDateParsed('千九百三十七年', new Date(1937, 0));
    assertDateParsed('二千十三年', new Date(2013, 0));
    assertDateParsed('一九九五年', new Date(1995, 0));
    assertDateParsed('二千三年', new Date(2003, 0));
    assertDateParsed('二千年', new Date(2000, 0));

    assertDateParsed('一日',     new Date(now.getFullYear(), now.getMonth(), 1));
    assertDateParsed('二日',     new Date(now.getFullYear(), now.getMonth(), 2));
    assertDateParsed('三日',     new Date(now.getFullYear(), now.getMonth(), 3));
    assertDateParsed('四日',     new Date(now.getFullYear(), now.getMonth(), 4));
    assertDateParsed('五日',     new Date(now.getFullYear(), now.getMonth(), 5));
    assertDateParsed('六日',     new Date(now.getFullYear(), now.getMonth(), 6));
    assertDateParsed('七日',     new Date(now.getFullYear(), now.getMonth(), 7));
    assertDateParsed('八日',     new Date(now.getFullYear(), now.getMonth(), 8));
    assertDateParsed('九日',     new Date(now.getFullYear(), now.getMonth(), 9));
    assertDateParsed('十日',     new Date(now.getFullYear(), now.getMonth(), 10));
    assertDateParsed('十五日',   new Date(now.getFullYear(), now.getMonth(), 15));
    assertDateParsed('二十五日', new Date(now.getFullYear(), now.getMonth(), 25));

    assertDateParsed('一ミリ秒前', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('一秒前',     getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('一分前',     getRelativeDate(0,0,0,0,-1));
    assertDateParsed('一時間前',   getRelativeDate(0,0,0,-1));
    assertDateParsed('一日前',     getRelativeDate(0,0,-1));
    assertDateParsed('一週間前',   getRelativeDate(0,0,-7));
    assertDateParsed('一ヶ月前',   getRelativeDate(0,-1));
    assertDateParsed('一ヵ月前',   getRelativeDate(0,-1));
    assertDateParsed('一年前',     getRelativeDate(-1));

    assertDateParsed('2ミリ秒前', getRelativeDate(0,0,0,0,0,0,-2));
    assertDateParsed('2秒前',     getRelativeDate(0,0,0,0,0,-2));
    assertDateParsed('2分前',     getRelativeDate(0,0,0,0,-2));
    assertDateParsed('2時間前',   getRelativeDate(0,0,0,-2));
    assertDateParsed('2日前',     getRelativeDate(0,0,-2));
    assertDateParsed('2週間前',   getRelativeDate(0,0,-14));
    assertDateParsed('2ヶ月前',   getRelativeDate(0,-2));
    assertDateParsed('2ヵ月前',   getRelativeDate(0,-2));
    assertDateParsed('2年前',     getRelativeDate(-2));

    assertDateParsed('5ミリ秒後', getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('5秒後',     getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('5分後',     getRelativeDate(0,0,0,0,5));
    assertDateParsed('5時間後',   getRelativeDate(0,0,0,5));
    assertDateParsed('5日後',     getRelativeDate(0,0,5));
    assertDateParsed('5週間後',   getRelativeDate(0,0,35));
    assertDateParsed('5ヶ月後',   getRelativeDate(0,5));
    assertDateParsed('5ヵ月後',   getRelativeDate(0,5));
    assertDateParsed('5年後',     getRelativeDate(5));

    assertDateParsed('２０１１年５月２５日', new Date(2011, 4, 25));
    assertDateParsed('２０１１年５月', new Date(2011, 4));
    assertDateParsed('２０１１年', new Date(2011, 0));

    assertDateParsed('５ミリ秒後', getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('５秒後',     getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('５分後',     getRelativeDate(0,0,0,0,5));
    assertDateParsed('５時間後',   getRelativeDate(0,0,0,5));
    assertDateParsed('５日後',     getRelativeDate(0,0,5));
    assertDateParsed('５週間後',   getRelativeDate(0,0,35));
    assertDateParsed('５ヶ月後',   getRelativeDate(0,5));
    assertDateParsed('５ヵ月後',   getRelativeDate(0,5));
    assertDateParsed('５年後',     getRelativeDate(5));

    assertDateParsed('一昨々日', getRelativeDateReset(0,0,-3));
    assertDateParsed('前々々日', getRelativeDateReset(0,0,-3));
    assertDateParsed('おととい', getRelativeDateReset(0,0,-2));
    assertDateParsed('一昨日',   getRelativeDateReset(0,0,-2));
    assertDateParsed('前々日',   getRelativeDateReset(0,0,-2));
    assertDateParsed('昨日',     getRelativeDateReset(0,0,-1));
    assertDateParsed('前日',     getRelativeDateReset(0,0,-1));
    assertDateParsed('今日',     getRelativeDateReset(0,0,0));
    assertDateParsed('当日',     getRelativeDateReset(0,0,0));
    assertDateParsed('本日',     getRelativeDateReset(0,0,0));
    assertDateParsed('明日',     getRelativeDateReset(0,0,1));
    assertDateParsed('翌日',     getRelativeDateReset(0,0,1));
    assertDateParsed('次日',     getRelativeDateReset(0,0,1));
    assertDateParsed('明後日',   getRelativeDateReset(0,0,2));
    assertDateParsed('翌々日',   getRelativeDateReset(0,0,2));
    assertDateParsed('明々後日', getRelativeDateReset(0,0,3));
    assertDateParsed('翌々々日', getRelativeDateReset(0,0,3));

    assertDateParsed('先週',     getRelativeDate(0,0,-7));
    assertDateParsed('来週',     getRelativeDate(0,0,7));

    assertDateParsed('先々月',   getRelativeDate(0,-2));
    assertDateParsed('先月',     getRelativeDate(0,-1));
    assertDateParsed('前月',     getRelativeDate(0,-1));
    assertDateParsed('今月',     getRelativeDate(0,0));
    assertDateParsed('本月',     getRelativeDate(0,0));
    assertDateParsed('来月',     getRelativeDate(0,1));
    assertDateParsed('次月',     getRelativeDate(0,1));
    assertDateParsed('再来月',   getRelativeDate(0,2));

    assertDateParsed('一昨々年', getRelativeDate(-3));
    assertDateParsed('前々々年', getRelativeDate(-3));
    assertDateParsed('一昨年',   getRelativeDate(-2));
    assertDateParsed('前々年',   getRelativeDate(-2));
    assertDateParsed('去年',     getRelativeDate(-1));
    assertDateParsed('先年',     getRelativeDate(-1));
    assertDateParsed('昨年',     getRelativeDate(-1));
    assertDateParsed('前年',     getRelativeDate(-1));
    assertDateParsed('今年',     getRelativeDate( 0));
    assertDateParsed('本年',     getRelativeDate( 0));
    assertDateParsed('来年',     getRelativeDate( 1));
    assertDateParsed('翌年',     getRelativeDate( 1));
    assertDateParsed('次年',     getRelativeDate( 1));
    assertDateParsed('再来年',   getRelativeDate( 2));
    assertDateParsed('さ来年',   getRelativeDate( 2));
    assertDateParsed('明後年',   getRelativeDate( 2));
    assertDateParsed('翌々年',   getRelativeDate( 2));
    assertDateParsed('次々年度', getRelativeDate( 2));
    assertDateParsed('明々後年', getRelativeDate( 3));
    assertDateParsed('翌々々年', getRelativeDate( 3));

    assertDateParsed('３月始',   new Date(now.getFullYear(), 2));
    assertDateParsed('３月頭',   new Date(now.getFullYear(), 2));
    assertDateParsed('３月初日', new Date(now.getFullYear(), 2));

    assertDateParsed('３月末',   testGetEndOfMonth(now.getFullYear(), 2));
    assertDateParsed('３月尻',   testGetEndOfMonth(now.getFullYear(), 2));
    assertDateParsed('３月末日', new Date(now.getFullYear(), 2, 31));

    assertDateParsed('来月末',         testGetEndOfRelativeMonth(1));
    assertDateParsed('来月２５日',     new Date(now.getFullYear(), now.getMonth() + 1, 25));
    assertDateParsed('来年３月',       new Date(now.getFullYear() + 1, 2));
    assertDateParsed('来年３月２５日', new Date(now.getFullYear() + 1, 2, 25));
    assertDateParsed('来年３月末',     new Date(now.getFullYear() + 1, 2, 31, 23, 59, 59, 999));

    assertDateParsed('先週水曜日',      testGetWeekday(3,-1));
    assertDateParsed('来週金曜日',      testGetWeekday(5, 1));
    assertDateParsed('来週水曜日15:35', testGetWeekday(3, 1, 15, 35));

    assertDateParsed('2011年5月15日 3:45:59', new Date(2011, 4, 15, 3, 45, 59));
    assertDateParsed('2011年5月15日 3時45分', new Date(2011, 4, 15, 3, 45, 0));
    assertDateParsed('2011年5月15日 3時45分59秒', new Date(2011, 4, 15, 3, 45, 59));
    assertDateParsed('2011年5月15日 午前3時45分', new Date(2011, 4, 15, 3, 45));
    assertDateParsed('2011年5月15日 午後3時45分', new Date(2011, 4, 15, 15, 45));
    assertDateParsed('２０１１年５月１５日　３時４５分', new Date(2011, 4, 15, 3, 45));
    assertDateParsed('２０１１年５月１５日　午後３時４５分', new Date(2011, 4, 15, 15, 45));

    assertDateParsed('二千十一年五月十五日　午後三時四十五分', new Date(2011, 4, 15, 15, 45));

    assertDateParsed('2011年5月15日 午後3:45', new Date(2011, 4, 15, 15, 45));

    assertDateParsed('5月15日 3:45:59', new Date(now.getFullYear(), 4, 15, 3, 45, 59));
    assertDateParsed('15日 3:45:59', new Date(now.getFullYear(), now.getMonth(), 15, 3, 45, 59));
    assertDateParsed('先週水曜日 5:15', testGetWeekday(3,-1,5,15));

    // Issue #148 various Japanese dates

    assertDateParsed('火曜日3:00',         testGetWeekday(2,0,3));
    assertDateParsed('火曜日午後3:00',     testGetWeekday(2,0,15));
    assertDateParsed('来週火曜日午後3:00', testGetWeekday(2,1,15));
    assertDateParsed('2012年6月5日3:00', new Date(2012,5,5,3));

  });

  method('format', function() {

    test(then, '2010年1月5日午後3時52分', 'default format');

    assertFormatShortcut(then, 'short', '2010/01/05');
    assertFormatShortcut(then, 'medium', '2010年1月5日');
    assertFormatShortcut(then, 'long', '2010年1月5日午後3時52分');
    assertFormatShortcut(then, 'full', '2010年1月5日午後3時52分 火曜日');
    test(then, ['{time}'], '午後3時52分', 'preferred time');
    test(then, ['{stamp}'], '2010年1月5日 15:52 火', 'preferred stamp');
    test(then, ['%c'], '2010年1月5日 15:52 火', '%c stamp');

    test(new Date('December 26, 2009'), ['{w}'], '52', 'locale week number | Dec 26 2009');
    test(new Date('December 26, 2009'), ['{ww}'], '52', 'locale week number padded | Dec 26 2009');
    test(new Date('December 26, 2009'), ['{wo}'], '52nd', 'locale week number ordinal | Dec 26 2009');
    test(new Date('December 27, 2009'), ['{w}'], '1', 'locale week number | Dec 27 2009');
    test(new Date('December 27, 2009'), ['{ww}'], '01', 'locale week number padded | Dec 27 2009');
    test(new Date('December 27, 2009'), ['{wo}'], '1st', 'locale week number ordinal | Dec 27 2009');

    test(new Date(2015, 10, 8),  ['{Dow}'], '日', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], '月', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], '火', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], '水', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], '木', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], '金', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], '土', 'Sat');

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

    assertRelative('1 second ago', '1秒前');
    assertRelative('1 minute ago', '1分前');
    assertRelative('1 hour ago', '1時間前');
    assertRelative('1 day ago', '1日前');
    assertRelative('1 week ago', '1週間前');
    assertRelative('1 month ago', '1ヶ月前');
    assertRelative('1 year ago', '1年前');

    assertRelative('2 seconds ago', '2秒前');
    assertRelative('2 minutes ago', '2分前');
    assertRelative('2 hours ago', '2時間前');
    assertRelative('2 days ago', '2日前');
    assertRelative('2 weeks ago', '2週間前');
    assertRelative('2 months ago', '2ヶ月前');
    assertRelative('2 years ago', '2年前');

    assertRelative('1 second from now', '1秒後');
    assertRelative('1 minute from now', '1分後');
    assertRelative('1 hour from now', '1時間後');
    assertRelative('1 day from now', '1日後');
    assertRelative('1 week from now', '1週間後');
    assertRelative('1 year from now', '1年後');

    assertRelative('5 seconds from now', '5秒後');
    assertRelative('5 minutes from now', '5分後');
    assertRelative('5 hours from now', '5時間後');
    assertRelative('5 days from now', '5日後');
    assertRelative('5 weeks from now', '1ヶ月後');
    assertRelative('5 years from now', '5年後');

  });

  method('relativeTo', function() {

    var d = new Date(2016,3,14,22,47,52,500);

    assertRelativeTo(d, [new Date(2015,3,14,22,47,52,500)], '1年');
    assertRelativeTo(d, [new Date(2016,2,14,22,47,52,500)], '1ヶ月');
    assertRelativeTo(d, [new Date(2016,3,13,22,47,52,500)], '1日');
    assertRelativeTo(d, [new Date(2016,3,14,21,47,52,500)], '1時間');
    assertRelativeTo(d, [new Date(2016,3,14,22,46,52,500)], '1分');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,51,500)], '1秒');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,51,499)], '1秒');

    assertRelativeTo(d, [new Date(2017,3,14,22,47,52,500)], '1年');
    assertRelativeTo(d, [new Date(2016,4,14,22,47,52,500)], '1ヶ月');
    assertRelativeTo(d, [new Date(2016,3,15,22,47,52,500)], '1日');
    assertRelativeTo(d, [new Date(2016,3,14,23,47,52,500)], '1時間');
    assertRelativeTo(d, [new Date(2016,3,14,22,48,52,500)], '1分');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,53,500)], '1秒');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,51,501)], '1秒');

  });

  method('beginning/end', function() {
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 27), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 2, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Japanese', function() {

  method('duration', function() {
    test(run(5, 'hours'), ['ja'], '5時間', 'simple duration');
  });

});

