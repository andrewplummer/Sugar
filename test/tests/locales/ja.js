package('Dates Japanese', function () {
  "use strict";

  var now, then;

  setup(function() {
    now  = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('ja');
  });

  method('create', function() {
    dateEqual(testCreateDate('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | basic Japanese date');
    dateEqual(testCreateDate('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | once a language has been initialized it will always be recognized');

    dateEqual(testCreateDate('2011年5月'), new Date(2011, 4), 'year and month');
    dateEqual(testCreateDate('5月15日'), new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011年'), new Date(2011, 0), 'year');
    dateEqual(testCreateDate('5月'), new Date(now.getFullYear(), 4), 'month');
    dateEqual(testCreateDate('15日'), new Date(now.getFullYear(), now.getMonth(), 15), 'date');
    dateEqual(testCreateDate('月曜日'), getDateWithWeekdayAndOffset(1), 'Monday');
    dateEqual(testCreateDate('九日'), new Date(now.getFullYear(), now.getMonth(), 9), 'the 9th');
    dateEqual(testCreateDate('二十五日'), new Date(now.getFullYear(), now.getMonth(), 25), 'the 25th');
    dateEqual(testCreateDate('3時45分'), run(new Date(), 'set', [{ hour: 3, minute: 45 }, true]), 'just time');

    dateEqual(testCreateDate('一ミリ秒前'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('一秒前'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('一分前'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('一時間前'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('一日前'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('一週間前'), getRelativeDate(null, null, -7), 'one week ago');
    dateEqual(testCreateDate('一ヶ月前'), getRelativeDate(null, -1), 'one month ago ヵ');
    dateEqual(testCreateDate('一ヵ月前'), getRelativeDate(null, -1), 'one month ago ヶ');
    dateEqual(testCreateDate('一年前'), getRelativeDate(-1), 'one year ago');


    dateEqual(testCreateDate('2ミリ秒前'), getRelativeDate(null, null, null, null, null, null,-2), 'two millisecond ago');
    dateEqual(testCreateDate('2秒前'), getRelativeDate(null, null, null, null, null, -2), 'two second ago');
    dateEqual(testCreateDate('2分前'), getRelativeDate(null, null, null, null, -2), 'two minute ago');
    dateEqual(testCreateDate('2時間前'), getRelativeDate(null, null, null, -2), 'two hour ago');
    dateEqual(testCreateDate('2日前'), getRelativeDate(null, null, -2), 'two day ago');
    dateEqual(testCreateDate('2週間前'), getRelativeDate(null, null, -14), 'two weeks ago');
    dateEqual(testCreateDate('2ヶ月前'), getRelativeDate(null, -2), 'two month ago ヵ');
    dateEqual(testCreateDate('2ヵ月前'), getRelativeDate(null, -2), 'two month ago ヶ');
    dateEqual(testCreateDate('2年前'), getRelativeDate(-2), 'two years ago');

    dateEqual(testCreateDate('5ミリ秒後'), getRelativeDate(null, null, null, null, null, null, 5), 'five millisecond from now');
    dateEqual(testCreateDate('5秒後'), getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    dateEqual(testCreateDate('5分後'), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    dateEqual(testCreateDate('5時間後'), getRelativeDate(null, null, null, 5), 'five hour from now');
    dateEqual(testCreateDate('5日後'), getRelativeDate(null, null, 5), 'five day from now');
    dateEqual(testCreateDate('5週間後'), getRelativeDate(null, null, 35), 'five weeks from now');
    dateEqual(testCreateDate('5ヶ月後'), getRelativeDate(null, 5), 'five month from now ヵ');
    dateEqual(testCreateDate('5ヵ月後'), getRelativeDate(null, 5), 'five month from now ヶ');
    dateEqual(testCreateDate('5年後'), getRelativeDate(5), 'five years from now');

    dateEqual(testCreateDate('２０１１年５月２５日'), new Date(2011, 4, 25), 'full-width chars');

    dateEqual(testCreateDate('５ミリ秒後'), getRelativeDate(null, null, null, null, null, null, 5), 'five millisecond from now');
    dateEqual(testCreateDate('５秒後'), getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    dateEqual(testCreateDate('５分後'), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    dateEqual(testCreateDate('５時間後'), getRelativeDate(null, null, null, 5), 'five hour from now');
    dateEqual(testCreateDate('５日後'), getRelativeDate(null, null, 5), 'five day from now');
    dateEqual(testCreateDate('５週間後'), getRelativeDate(null, null, 35), 'five weeks from now');
    dateEqual(testCreateDate('５ヶ月後'), getRelativeDate(null, 5), 'five month from now ヵ');
    dateEqual(testCreateDate('５ヵ月後'), getRelativeDate(null, 5), 'five month from now ヶ');
    dateEqual(testCreateDate('５年後'), getRelativeDate(5), 'five years from now');


    dateEqual(testCreateDate('おととい'), run(getRelativeDate(null, null, -2), 'reset'), 'おととい');
    dateEqual(testCreateDate('一昨日'), run(getRelativeDate(null, null, -2), 'reset'), '一昨日');
    dateEqual(testCreateDate('昨日'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('今日'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('明日'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('明後日'), run(getRelativeDate(null, null, 2), 'reset'), '明後日');
    dateEqual(testCreateDate('明々後日'), run(getRelativeDate(null, null, 3), 'reset'), '明々後日');


    dateEqual(testCreateDate('先週'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('来週'), getRelativeDate(null, null, 7), 'Next week');

    dateEqual(testCreateDate('先月'), getRelativeDate(null, -1), 'Next month');
    dateEqual(testCreateDate('来月'), getRelativeDate(null, 1), 'Next month');

    dateEqual(testCreateDate('去年'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('来年'), getRelativeDate(1), 'Next year');


    dateEqual(testCreateDate('先週水曜日'), getDateWithWeekdayAndOffset(3, -7), 'Last wednesday');
    dateEqual(testCreateDate('来週金曜日'), getDateWithWeekdayAndOffset(5, 7), 'Next friday');

    dateEqual(testCreateDate('2011年5月15日 3:45:59'), new Date(2011, 4, 15, 3, 45, 59), 'full date with time');
    dateEqual(testCreateDate('2011年5月15日 3時45分'), new Date(2011, 4, 15, 3, 45, 0), 'full date with kanji markers');
    dateEqual(testCreateDate('2011年5月15日 3時45分59秒'), new Date(2011, 4, 15, 3, 45, 59), 'full date with kanji markers');
    dateEqual(testCreateDate('2011年5月15日 午前3時45分'), new Date(2011, 4, 15, 3, 45), 'full date with gozen');
    dateEqual(testCreateDate('2011年5月15日 午後3時45分'), new Date(2011, 4, 15, 15, 45), 'full date with gogo');
    dateEqual(testCreateDate('２０１１年５月１５日　３時４５分'), new Date(2011, 4, 15, 3, 45), 'full date with zenkaku');
    dateEqual(testCreateDate('２０１１年５月１５日　午後３時４５分'), new Date(2011, 4, 15, 15, 45), 'full date with zenkaku and gogo');

    dateEqual(testCreateDate('二千十一年五月十五日　午後三時四十五分'), new Date(2011, 4, 15, 15, 45), 'full date with full kanji and full markers');

    dateEqual(testCreateDate('2011年5月15日 午後3:45'), new Date(2011, 4, 15, 15, 45), 'pm still works');

    dateEqual(testCreateDate('5月15日 3:45:59'), new Date(now.getFullYear(), 4, 15, 3, 45, 59), 'mm-dd format with time');
    dateEqual(testCreateDate('15日 3:45:59'), new Date(now.getFullYear(), now.getMonth(), 15, 3, 45, 59), 'dd format with time');
    dateEqual(testCreateDate('先週水曜日 5:15'), run(getDateWithWeekdayAndOffset(3, -7), 'set', [{ hour: 5, minute: 15 }]), 'Last wednesday with time');

    // Issue #148 various Japanese dates

    dateEqual(testCreateDate('来週火曜日午後3:00'), run(getDateWithWeekdayAndOffset(2, 7), 'set', [{ hours: 15 }]), 'next Tuesday at 3:00pm');
    dateEqual(testCreateDate('火曜日3:00'), run(getDateWithWeekdayAndOffset(2, 0), 'set', [{ hours: 3 }]), 'Date.create | Japanese | Tuesday at 3:00am');
    dateEqual(testCreateDate('火曜日午後3:00'), run(getDateWithWeekdayAndOffset(2, 0), 'set', [{ hours: 15 }]), 'Date.create | Japanese | Tuesday at 3:00pm');
    dateEqual(testCreateDate('2012年6月5日3:00'), new Date(2012, 5, 5, 3), 'Date.create | Japanese | June 5th at 3:00pm');

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
    dateEqual(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 27), 'beginningOfWeek');
    dateEqual(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 2, 23, 59, 59, 999), 'endOfWeek');
  });

});

package('Number | Japanese Dates', function() {

  method('duration', function() {
    test(run(5, 'hours'), ['ja'], '5時間', 'simple duration');
  });

});

