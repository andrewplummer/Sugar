namespace('Date | Japanese', function () {
  'use strict';

  var now, then;

  setup(function() {
    now  = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('ja');
  });

  method('create', function() {

    equal(testCreateDate('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | basic Japanese date');
    equal(testCreateDate('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | once a language has been initialized it will always be recognized');
    equal(testCreateDate('2016年2月02日'), new Date(2016, 1, 2), 'toLocaleDateString');

    equal(testCreateDate('2011年5月'), new Date(2011, 4), 'year and month');
    equal(testCreateDate('5月15日'), new Date(now.getFullYear(), 4, 15), 'month and date');
    equal(testCreateDate('2011年'), new Date(2011, 0), 'year');
    equal(testCreateDate('2011年度'), new Date(2011, 0), 'year variant');
    equal(testCreateDate('5月'), new Date(now.getFullYear(), 4), 'month');
    equal(testCreateDate('15日'), new Date(now.getFullYear(), now.getMonth(), 15), 'date');
    equal(testCreateDate('月曜日'), testGetWeekday(1), 'Monday');
    equal(testCreateDate('月曜'), testGetWeekday(1), 'Monday');
    equal(testCreateDate('九日'), new Date(now.getFullYear(), now.getMonth(), 9), 'the 9th');
    equal(testCreateDate('二十五日'), new Date(now.getFullYear(), now.getMonth(), 25), 'the 25th');
    equal(testCreateDate('3時45分'), run(new Date(), 'set', [{ hour: 3, minute: 45 }, true]), 'just time');

    equal(testCreateDate('一ミリ秒前'), getRelativeDate(0,0,0,0,0,0,-1), 'one millisecond ago');
    equal(testCreateDate('一秒前'),     getRelativeDate(0,0,0,0,0,-1), 'one second ago');
    equal(testCreateDate('一分前'),     getRelativeDate(0,0,0,0,-1), 'one minute ago');
    equal(testCreateDate('一時間前'),   getRelativeDate(0,0,0,-1), 'one hour ago');
    equal(testCreateDate('一日前'),     getRelativeDate(0,0,-1), 'one day ago');
    equal(testCreateDate('一週間前'),   getRelativeDate(0,0,-7), 'one week ago');
    equal(testCreateDate('一ヶ月前'),   getRelativeDate(0,-1), 'one month ago ヵ');
    equal(testCreateDate('一ヵ月前'),   getRelativeDate(0,-1), 'one month ago ヶ');
    equal(testCreateDate('一年前'),     getRelativeDate(-1), 'one year ago');

    equal(testCreateDate('2ミリ秒前'), getRelativeDate(0,0,0,0,0,0,-2), 'two millisecond ago');
    equal(testCreateDate('2秒前'),     getRelativeDate(0,0,0,0,0,-2), 'two second ago');
    equal(testCreateDate('2分前'),     getRelativeDate(0,0,0,0,-2), 'two minute ago');
    equal(testCreateDate('2時間前'),   getRelativeDate(0,0,0,-2), 'two hour ago');
    equal(testCreateDate('2日前'),     getRelativeDate(0,0,-2), 'two day ago');
    equal(testCreateDate('2週間前'),   getRelativeDate(0,0,-14), 'two weeks ago');
    equal(testCreateDate('2ヶ月前'),   getRelativeDate(0,-2), 'two month ago ヵ');
    equal(testCreateDate('2ヵ月前'),   getRelativeDate(0,-2), 'two month ago ヶ');
    equal(testCreateDate('2年前'),     getRelativeDate(-2), 'two years ago');

    equal(testCreateDate('5ミリ秒後'), getRelativeDate(0,0,0,0,0,0,5), 'five millisecond from now');
    equal(testCreateDate('5秒後'),     getRelativeDate(0,0,0,0,0,5), 'five second from now');
    equal(testCreateDate('5分後'),     getRelativeDate(0,0,0,0,5), 'five minute from now');
    equal(testCreateDate('5時間後'),   getRelativeDate(0,0,0,5), 'five hour from now');
    equal(testCreateDate('5日後'),     getRelativeDate(0,0,5), 'five day from now');
    equal(testCreateDate('5週間後'),   getRelativeDate(0,0,35), 'five weeks from now');
    equal(testCreateDate('5ヶ月後'),   getRelativeDate(0,5), 'five month from now ヵ');
    equal(testCreateDate('5ヵ月後'),   getRelativeDate(0,5), 'five month from now ヶ');
    equal(testCreateDate('5年後'),     getRelativeDate(5), 'five years from now');

    equal(testCreateDate('２０１１年５月２５日'), new Date(2011, 4, 25), 'full-width chars');

    equal(testCreateDate('５ミリ秒後'), getRelativeDate(0,0,0,0,0,0,5), 'five millisecond from now');
    equal(testCreateDate('５秒後'),     getRelativeDate(0,0,0,0,0,5), 'five second from now');
    equal(testCreateDate('５分後'),     getRelativeDate(0,0,0,0,5), 'five minute from now');
    equal(testCreateDate('５時間後'),   getRelativeDate(0,0,0,5), 'five hour from now');
    equal(testCreateDate('５日後'),     getRelativeDate(0,0,5), 'five day from now');
    equal(testCreateDate('５週間後'),   getRelativeDate(0,0,35), 'five weeks from now');
    equal(testCreateDate('５ヶ月後'),   getRelativeDate(0,5), 'five month from now ヵ');
    equal(testCreateDate('５ヵ月後'),   getRelativeDate(0,5), 'five month from now ヶ');
    equal(testCreateDate('５年後'),     getRelativeDate(5), 'five years from now');

    equal(testCreateDate('一昨々日'), getRelativeDateReset(0,0,-3), 'two days before yesterday 1');
    equal(testCreateDate('前々々日'), getRelativeDateReset(0,0,-3), 'two days before yesterday 2');
    equal(testCreateDate('おととい'), getRelativeDateReset(0,0,-2), 'the day before yesterday 1');
    equal(testCreateDate('一昨日'),   getRelativeDateReset(0,0,-2), 'the day before yesterday 2');
    equal(testCreateDate('前々日'),   getRelativeDateReset(0,0,-2), 'the day before yesterday 3');
    equal(testCreateDate('昨日'),     getRelativeDateReset(0,0,-1), 'yesterday 1');
    equal(testCreateDate('前日'),     getRelativeDateReset(0,0,-1), 'yesterday 2');
    equal(testCreateDate('今日'),     getRelativeDateReset(0,0,0), 'today 1');
    equal(testCreateDate('当日'),     getRelativeDateReset(0,0,0), 'today 2');
    equal(testCreateDate('本日'),     getRelativeDateReset(0,0,0), 'today 3');
    equal(testCreateDate('明日'),     getRelativeDateReset(0,0,1), 'tomorrow 1');
    equal(testCreateDate('翌日'),     getRelativeDateReset(0,0,1), 'tomorrow 2');
    equal(testCreateDate('次日'),     getRelativeDateReset(0,0,1), 'tomorrow 3');
    equal(testCreateDate('明後日'),   getRelativeDateReset(0,0,2), 'the day after tomorrow 1');
    equal(testCreateDate('翌々日'),   getRelativeDateReset(0,0,2), 'the day after tomorrow 2');
    equal(testCreateDate('明々後日'), getRelativeDateReset(0,0,3), 'two days after tomorrow 1');
    equal(testCreateDate('翌々々日'), getRelativeDateReset(0,0,3), 'two days after tomorrow 2');

    equal(testCreateDate('先週'),     getRelativeDate(0,0,-7), 'last week');
    equal(testCreateDate('来週'),     getRelativeDate(0,0,7), 'next week');

    equal(testCreateDate('先々月'),   getRelativeDate(0,-2), 'two months ago');
    equal(testCreateDate('先月'),     getRelativeDate(0,-1), 'last month 1');
    equal(testCreateDate('前月'),     getRelativeDate(0,-1), 'last month 2');
    equal(testCreateDate('今月'),     getRelativeDate(0,0), 'this month');
    equal(testCreateDate('本月'),     getRelativeDate(0,0), 'this month');
    equal(testCreateDate('来月'),     getRelativeDate(0,1), 'next month 1');
    equal(testCreateDate('次月'),     getRelativeDate(0,1), 'next month 2');
    equal(testCreateDate('再来月'),   getRelativeDate(0,2), 'two months from now');

    equal(testCreateDate('一昨々年'), getRelativeDate(-3), 'three years ago 1');
    equal(testCreateDate('前々々年'), getRelativeDate(-3), 'three years ago 2');
    equal(testCreateDate('一昨年'),   getRelativeDate(-2), 'two years ago 1');
    equal(testCreateDate('前々年'),   getRelativeDate(-2), 'two years ago 2');
    equal(testCreateDate('去年'),     getRelativeDate(-1), 'last year 1');
    equal(testCreateDate('先年'),     getRelativeDate(-1), 'last year 2');
    equal(testCreateDate('昨年'),     getRelativeDate(-1), 'last year 3');
    equal(testCreateDate('前年'),     getRelativeDate(-1), 'last year 3');
    equal(testCreateDate('今年'),     getRelativeDate( 0), 'this year 1');
    equal(testCreateDate('本年'),     getRelativeDate( 0), 'this year 2');
    equal(testCreateDate('来年'),     getRelativeDate( 1), 'next year 1');
    equal(testCreateDate('翌年'),     getRelativeDate( 1), 'next year 2');
    equal(testCreateDate('次年'),     getRelativeDate( 1), 'next year 3');
    equal(testCreateDate('再来年'),   getRelativeDate( 2), 'two years from now 1');
    equal(testCreateDate('さ来年'),   getRelativeDate( 2), 'two years from now 2');
    equal(testCreateDate('明後年'),   getRelativeDate( 2), 'two years from now 3');
    equal(testCreateDate('翌々年'),   getRelativeDate( 2), 'two years from now 4');
    equal(testCreateDate('次々年度'), getRelativeDate( 2), 'two years from now 5');
    equal(testCreateDate('明々後年'), getRelativeDate( 3), 'three years from now 1');
    equal(testCreateDate('翌々々年'), getRelativeDate( 3), 'three years from now 2');

    equal(testCreateDate('３月始'),   new Date(now.getFullYear(), 2), 'beginning of March 1');
    equal(testCreateDate('３月頭'),   new Date(now.getFullYear(), 2), 'beginning of March 2');
    equal(testCreateDate('３月初日'), new Date(now.getFullYear(), 2), 'first day of March');

    equal(testCreateDate('３月末'),   testGetEndOfMonth(now.getFullYear(), 2), 'end of March 1');
    equal(testCreateDate('３月尻'),   testGetEndOfMonth(now.getFullYear(), 2), 'end of March 2');
    equal(testCreateDate('３月末日'), new Date(now.getFullYear(), 2, 31), 'last day of March');

    equal(testCreateDate('来月末'),         testGetEndOfRelativeMonth(1), 'end of next month');
    equal(testCreateDate('来月２５日'),     new Date(now.getFullYear(), now.getMonth() + 1, 25), '25th of next month');
    equal(testCreateDate('来年３月'),       new Date(now.getFullYear() + 1, 2), 'March of next year');
    equal(testCreateDate('来年３月２５日'), new Date(now.getFullYear() + 1, 2, 25), 'March 25th of next year');
    equal(testCreateDate('来年３月末'),     new Date(now.getFullYear() + 1, 2, 31, 23, 59, 59, 999), 'end of March next year');

    equal(testCreateDate('先週水曜日'),      testGetWeekday(3, -1),        'Last wednesday');
    equal(testCreateDate('来週金曜日'),      testGetWeekday(5, 1),         'Next friday');
    equal(testCreateDate('来週水曜日15:35'), testGetWeekday(3, 1, 15, 35), 'next wednesday at 3:35pm');

    equal(testCreateDate('2011年5月15日 3:45:59'), new Date(2011, 4, 15, 3, 45, 59), 'full date with time');
    equal(testCreateDate('2011年5月15日 3時45分'), new Date(2011, 4, 15, 3, 45, 0), 'full date with kanji markers');
    equal(testCreateDate('2011年5月15日 3時45分59秒'), new Date(2011, 4, 15, 3, 45, 59), 'full date with kanji markers');
    equal(testCreateDate('2011年5月15日 午前3時45分'), new Date(2011, 4, 15, 3, 45), 'full date with gozen');
    equal(testCreateDate('2011年5月15日 午後3時45分'), new Date(2011, 4, 15, 15, 45), 'full date with gogo');
    equal(testCreateDate('２０１１年５月１５日　３時４５分'), new Date(2011, 4, 15, 3, 45), 'full date with zenkaku');
    equal(testCreateDate('２０１１年５月１５日　午後３時４５分'), new Date(2011, 4, 15, 15, 45), 'full date with zenkaku and gogo');

    equal(testCreateDate('二千十一年五月十五日　午後三時四十五分'), new Date(2011, 4, 15, 15, 45), 'full date with full kanji and full markers');

    equal(testCreateDate('2011年5月15日 午後3:45'), new Date(2011, 4, 15, 15, 45), 'pm still works');

    equal(testCreateDate('5月15日 3:45:59'), new Date(now.getFullYear(), 4, 15, 3, 45, 59), 'mm-dd format with time');
    equal(testCreateDate('15日 3:45:59'), new Date(now.getFullYear(), now.getMonth(), 15, 3, 45, 59), 'dd format with time');
    equal(testCreateDate('先週水曜日 5:15'), run(testGetWeekday(3, -1), 'set', [{ hour: 5, minute: 15 }]), 'Last wednesday with time');

    // Issue #148 various Japanese dates

    equal(testCreateDate('来週火曜日午後3:00'), run(testGetWeekday(2, 1), 'set', [{ hours: 15 }]), 'next Tuesday at 3:00pm');
    equal(testCreateDate('火曜日3:00'), run(testGetWeekday(2), 'set', [{ hours: 3 }]), 'Date.create | Japanese | Tuesday at 3:00am');
    equal(testCreateDate('火曜日午後3:00'), run(testGetWeekday(2), 'set', [{ hours: 15 }]), 'Date.create | Japanese | Tuesday at 3:00pm');
    equal(testCreateDate('2012年6月5日3:00'), new Date(2012, 5, 5, 3), 'Date.create | Japanese | June 5th at 3:00pm');

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

  method('beginning/end', function() {
    equal(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 27), 'beginningOfWeek');
    equal(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 2, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Japanese', function() {

  method('duration', function() {
    test(run(5, 'hours'), ['ja'], '5時間', 'simple duration');
  });

});

