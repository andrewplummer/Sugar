package('Date | Japanese', function () {

  var now  = new Date();

  testSetLocale('ja');

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


    dateEqual(testCreateDate('一昨日'), run(getRelativeDate(null, null, -2), 'reset'), '一昨日');
    dateEqual(testCreateDate('昨日'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('今日'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('明日'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('明後日'), run(getRelativeDate(null, null, 2), 'reset'), '明後日');

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
    var then = new Date(2011, 7, 25, 15, 45, 50);
    equal(run(then, 'format'), '2011年8月25日 15時45分', 'default format');
    equal(run(then, 'format', ['long']), '2011年8月25日 15時45分', 'long format');
    equal(run(then, 'format', ['full']), '2011年8月25日 木曜日 15時45分50秒', 'full formatting');
    equal(run(then, 'full'), '2011年8月25日 木曜日 15時45分50秒', 'full shortcut');
    equal(run(then, 'full', ['en']), 'Thursday August 25, 2011 3:45:50pm', 'full locale override');
    equal(run(then, 'format', ['long']), '2011年8月25日 15時45分', 'long formatting');
    equal(run(then, 'long'), '2011年8月25日 15時45分', 'long shortcut');
    equal(run(then, 'long', ['en']), 'August 25, 2011 3:45pm', 'long locale override');
    equal(run(then, 'format', ['short']), '2011年8月25日', 'short formatting');
    equal(run(then, 'short'), '2011年8月25日', 'short shortcut');
    equal(run(then, 'short', ['en']), 'August 25, 2011', 'short locale override');
    equal(run(then, 'format', ['{yyyy}年{MM}月{dd}日']), '2011年08月25日', 'custom format');

  });

  method('relative', function() {
    test(testCreateDate('1 second ago', 'en'), '1秒前', '1 second ago');
    test(testCreateDate('1 minute ago', 'en'), '1分前', '1 minute ago');
    test(testCreateDate('1 hour ago', 'en'), '1時間前', '1 hour ago');
    test(testCreateDate('1 day ago', 'en'), '1日前', '1 day ago');
    test(testCreateDate('1 week ago', 'en'), '1週間前', '1 week ago');
    test(testCreateDate('1 month ago', 'en'), '1ヶ月前', '1 month ago');
    test(testCreateDate('1 year ago', 'en'), '1年前', '1 year ago');

    test(testCreateDate('2 seconds ago', 'en'), '2秒前', '2 seconds ago');
    test(testCreateDate('2 minutes ago', 'en'), '2分前', '2 minutes ago');
    test(testCreateDate('2 hours ago', 'en'), '2時間前', '2 hours ago');
    test(testCreateDate('2 days ago', 'en'), '2日前', '2 days ago');
    test(testCreateDate('2 weeks ago', 'en'), '2週間前', '2 weeks ago');
    test(testCreateDate('2 months ago', 'en'), '2ヶ月前', '2 months ago');
    test(testCreateDate('2 years ago', 'en'), '2年前', '2 years ago');

    test(testCreateDate('1 second from now', 'en'), '1秒後', '1 second from now');
    test(testCreateDate('1 minute from now', 'en'), '1分後', '1 minute from now');
    test(testCreateDate('1 hour from now', 'en'), '1時間後', '1 hour from now');
    test(testCreateDate('1 day from now', 'en'), '1日後', '1 day from now');
    test(testCreateDate('1 week from now', 'en'), '1週間後', '1 week from now');
    testMonthsFromNow(1, '1ヶ月後', '4週間後');
    test(testCreateDate('1 year from now', 'en'), '1年後', '1 year from now');

    test(testCreateDate('5 seconds from now', 'en'), '5秒後', '5 seconds from now');
    test(testCreateDate('5 minutes from now', 'en'), '5分後', '5 minutes from now');
    test(testCreateDate('5 hours from now', 'en'), '5時間後', '5 hours from now');
    test(testCreateDate('5 days from now', 'en'), '5日後', '5 days from now');
    test(testCreateDate('5 weeks from now', 'en'), '1ヶ月後', '5 weeks from now');
    testMonthsFromNow(5, '5ヶ月後', '4ヶ月後');
    test(testCreateDate('5 years from now', 'en'), '5年後', '5 years from now');
  });

});

package('Number | Japanese Dates', function() {

  method('duration', function() {
    test(run(5, 'hours'), ['ja'], '5時間', 'simple duration');
  });

});

