test('Dates | Japanese', function () {

  var now  = new Date();
  var then = new Date(2011, 7, 25, 15, 45, 50);

  Date.setLocale('ja');

  dateEqual(Date.create('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | basic Japanese date');
  dateEqual(Date.create('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | once a language has been initialized it will always be recognized');

  dateEqual(Date.create('2011年5月'), new Date(2011, 4), 'Date#create | Japanese | year and month');
  dateEqual(Date.create('5月15日'), new Date(now.getFullYear(), 4, 15), 'Date#create | Japanese | month and date');
  dateEqual(Date.create('2011年'), new Date(2011, 0), 'Date#create | Japanese | year');
  dateEqual(Date.create('5月'), new Date(now.getFullYear(), 4), 'Date#create | Japanese | month');
  dateEqual(Date.create('15日'), new Date(now.getFullYear(), now.getMonth(), 15), 'Date#create | Japanese | date');
  dateEqual(Date.create('月曜日'), getDateWithWeekdayAndOffset(1), 'Date#create | Japanese | Monday');
  dateEqual(Date.create('九日'), new Date(now.getFullYear(), now.getMonth(), 9), 'Date#create | Japanese | the 9th');
  dateEqual(Date.create('二十五日'), new Date(now.getFullYear(), now.getMonth(), 25), 'Date#create | Japanese | the 25th');
  dateEqual(Date.create('3時45分'), new Date().set({ hour: 3, minute: 45 }, true), 'Date#create | Japanese | just time');



  dateEqual(Date.create('一ミリ秒前'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Japanese | one millisecond ago');
  dateEqual(Date.create('一秒前'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Japanese | one second ago');
  dateEqual(Date.create('一分前'), getRelativeDate(null, null, null, null, -1), 'Date#create | Japanese | one minute ago');
  dateEqual(Date.create('一時間前'), getRelativeDate(null, null, null, -1), 'Date#create | Japanese | one hour ago');
  dateEqual(Date.create('一日前'), getRelativeDate(null, null, -1), 'Date#create | Japanese | one day ago');
  dateEqual(Date.create('一週間前'), getRelativeDate(null, null, -7), 'Date#create | Japanese | one week ago');
  dateEqual(Date.create('一ヶ月前'), getRelativeDate(null, -1), 'Date#create | Japanese | one month ago ヵ');
  dateEqual(Date.create('一ヵ月前'), getRelativeDate(null, -1), 'Date#create | Japanese | one month ago ヶ');
  dateEqual(Date.create('一年前'), getRelativeDate(-1), 'Date#create | Japanese | one year ago');


  dateEqual(Date.create('2ミリ秒前'), getRelativeDate(null, null, null, null, null, null,-2), 'Date#create | Japanese | two millisecond ago');
  dateEqual(Date.create('2秒前'), getRelativeDate(null, null, null, null, null, -2), 'Date#create | Japanese | two second ago');
  dateEqual(Date.create('2分前'), getRelativeDate(null, null, null, null, -2), 'Date#create | Japanese | two minute ago');
  dateEqual(Date.create('2時間前'), getRelativeDate(null, null, null, -2), 'Date#create | Japanese | two hour ago');
  dateEqual(Date.create('2日前'), getRelativeDate(null, null, -2), 'Date#create | Japanese | two day ago');
  dateEqual(Date.create('2週間前'), getRelativeDate(null, null, -14), 'Date#create | Japanese | two weeks ago');
  dateEqual(Date.create('2ヶ月前'), getRelativeDate(null, -2), 'Date#create | Japanese | two month ago ヵ');
  dateEqual(Date.create('2ヵ月前'), getRelativeDate(null, -2), 'Date#create | Japanese | two month ago ヶ');
  dateEqual(Date.create('2年前'), getRelativeDate(-2), 'Date#create | Japanese | two years ago');

  dateEqual(Date.create('5ミリ秒後'), getRelativeDate(null, null, null, null, null, null, 5), 'Date#create | Japanese | five millisecond from now');
  dateEqual(Date.create('5秒後'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Japanese | five second from now');
  dateEqual(Date.create('5分後'), getRelativeDate(null, null, null, null, 5), 'Date#create | Japanese | five minute from now');
  dateEqual(Date.create('5時間後'), getRelativeDate(null, null, null, 5), 'Date#create | Japanese | five hour from now');
  dateEqual(Date.create('5日後'), getRelativeDate(null, null, 5), 'Date#create | Japanese | five day from now');
  dateEqual(Date.create('5週間後'), getRelativeDate(null, null, 35), 'Date#create | Japanese | five weeks from now');
  dateEqual(Date.create('5ヶ月後'), getRelativeDate(null, 5), 'Date#create | Japanese | five month from now ヵ');
  dateEqual(Date.create('5ヵ月後'), getRelativeDate(null, 5), 'Date#create | Japanese | five month from now ヶ');
  dateEqual(Date.create('5年後'), getRelativeDate(5), 'Date#create | Japanese | five years from now');

  dateEqual(Date.create('２０１１年５月２５日'), new Date(2011, 4, 25), 'Date#create | Japanese | full-width chars');

  dateEqual(Date.create('５ミリ秒後'), getRelativeDate(null, null, null, null, null, null, 5), 'Date#create | Japanese full-width | five millisecond from now');
  dateEqual(Date.create('５秒後'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Japanese full-width | five second from now');
  dateEqual(Date.create('５分後'), getRelativeDate(null, null, null, null, 5), 'Date#create | Japanese full-width | five minute from now');
  dateEqual(Date.create('５時間後'), getRelativeDate(null, null, null, 5), 'Date#create | Japanese full-width | five hour from now');
  dateEqual(Date.create('５日後'), getRelativeDate(null, null, 5), 'Date#create | Japanese full-width | five day from now');
  dateEqual(Date.create('５週間後'), getRelativeDate(null, null, 35), 'Date#create | Japanese full-width | five weeks from now');
  dateEqual(Date.create('５ヶ月後'), getRelativeDate(null, 5), 'Date#create | Japanese full-width | five month from now ヵ');
  dateEqual(Date.create('５ヵ月後'), getRelativeDate(null, 5), 'Date#create | Japanese full-width | five month from now ヶ');
  dateEqual(Date.create('５年後'), getRelativeDate(5), 'Date#create | Japanese full-width | five years from now');


  dateEqual(Date.create('一昨日'), getRelativeDate(null, null, -2).reset(), 'Date#create | Japanese | 一昨日');
  dateEqual(Date.create('昨日'), getRelativeDate(null, null, -1).reset(), 'Date#create | Japanese | yesterday');
  dateEqual(Date.create('今日'), getRelativeDate(null, null, 0).reset(), 'Date#create | Japanese | today');
  dateEqual(Date.create('明日'), getRelativeDate(null, null, 1).reset(), 'Date#create | Japanese | tomorrow');
  dateEqual(Date.create('明後日'), getRelativeDate(null, null, 2).reset(), 'Date#create | Japanese | 明後日');

  dateEqual(Date.create('先週'), getRelativeDate(null, null, -7), 'Date#create | Japanese | Last week');
  dateEqual(Date.create('来週'), getRelativeDate(null, null, 7), 'Date#create | Japanese | Next week');

  dateEqual(Date.create('先月'), getRelativeDate(null, -1), 'Date#create | Japanese | Next month');
  dateEqual(Date.create('来月'), getRelativeDate(null, 1), 'Date#create | Japanese | Next month');

  dateEqual(Date.create('去年'), getRelativeDate(-1), 'Date#create | Japanese | Last year');
  dateEqual(Date.create('来年'), getRelativeDate(1), 'Date#create | Japanese | Next year');


  dateEqual(Date.create('先週水曜日'), getDateWithWeekdayAndOffset(3, -7), 'Date#create | Japanese | Last wednesday');
  dateEqual(Date.create('来週金曜日'), getDateWithWeekdayAndOffset(5, 7), 'Date#create | Japanese | Next friday');

  equal(then.format(), '2011年8月25日 15時45分', 'Date#create | Japanese | default format');
  equal(then.format('long'), '2011年8月25日 15時45分', 'Date#create | Japanese | long format');
  equal(then.format('full'), '2011年8月25日 木曜日 15時45分50秒', 'Date#create | Japanese | full formatting');
  equal(then.full(), '2011年8月25日 木曜日 15時45分50秒', 'Date#create | Japanese | full shortcut');
  equal(then.full('en'), 'Thursday August 25, 2011 3:45:50pm', 'Date#create | Japanese | full locale override');
  equal(then.format('long'), '2011年8月25日 15時45分', 'Date#create | Japanese | long formatting');
  equal(then.long(), '2011年8月25日 15時45分', 'Date#create | Japanese | long shortcut');
  equal(then.long('en'), 'August 25, 2011 3:45pm', 'Date#create | Japanese | long locale override');
  equal(then.format('short'), '2011年8月25日', 'Date#create | Japanese | short formatting');
  equal(then.short(), '2011年8月25日', 'Date#create | Japanese | short shortcut');
  equal(then.short('en'), 'August 25, 2011', 'Date#create | Japanese | short locale override');
  equal(then.format('{yyyy}年{MM}月{dd}日'), '2011年08月25日', 'Date#create | Japanese | custom format');

  equal(Date.create('1 second ago', 'en').relative(), '1秒前', 'Date#create | Japanese | relative format past');
  equal(Date.create('1 minute ago', 'en').relative(), '1分前',  'Date#create | Japanese | relative format past');
  equal(Date.create('1 hour ago', 'en').relative(),   '1時間前',     'Date#create | Japanese | relative format past');
  equal(Date.create('1 day ago', 'en').relative(),    '1日前',    'Date#create | Japanese | relative format past');
  equal(Date.create('1 week ago', 'en').relative(),   '1週間前',  'Date#create | Japanese | relative format past');
  equal(Date.create('1 month ago', 'en').relative(),  '1ヶ月前',   'Date#create | Japanese | relative format past');
  equal(Date.create('1 year ago', 'en').relative(),   '1年前',     'Date#create | Japanese | relative format past');

  equal(Date.create('2 seconds ago', 'en').relative(), '2秒前', 'Date#create | Japanese | relative format past');
  equal(Date.create('2 minutes ago', 'en').relative(), '2分前',  'Date#create | Japanese | relative format past');
  equal(Date.create('2 hours ago', 'en').relative(),   '2時間前',     'Date#create | Japanese | relative format past');
  equal(Date.create('2 days ago', 'en').relative(),    '2日前',    'Date#create | Japanese | relative format past');
  equal(Date.create('2 weeks ago', 'en').relative(),   '2週間前',  'Date#create | Japanese | relative format past');
  equal(Date.create('2 months ago', 'en').relative(),  '2ヶ月前',   'Date#create | Japanese | relative format past');
  equal(Date.create('2 years ago', 'en').relative(),   '2年前',     'Date#create | Japanese | relative format past');

  equal(Date.create('1 second from now', 'en').relative(), '1秒後', 'Date#create | Japanese | relative format future');
  equal(Date.create('1 minute from now', 'en').relative(), '1分後',  'Date#create | Japanese | relative format future');
  equal(Date.create('1 hour from now', 'en').relative(),   '1時間後',     'Date#create | Japanese | relative format future');
  equal(Date.create('1 day from now', 'en').relative(),    '1日後',    'Date#create | Japanese | relative format future');
  equal(Date.create('1 week from now', 'en').relative(),   '1週間後',  'Date#create | Japanese | relative format future');
  equal(Date.create('1 month from now', 'en').relative(),  '1ヶ月後',   'Date#create | Japanese | relative format future');
  equal(Date.create('1 year from now', 'en').relative(),   '1年後',     'Date#create | Japanese | relative format future');

  equal(Date.create('5 second from now', 'en').relative(), '5秒後', 'Date#create | Japanese | relative format future');
  equal(Date.create('5 minute from now', 'en').relative(), '5分後',  'Date#create | Japanese | relative format future');
  equal(Date.create('5 hour from now', 'en').relative(),   '5時間後',     'Date#create | Japanese | relative format future');
  equal(Date.create('5 day from now', 'en').relative(),    '5日後',    'Date#create | Japanese | relative format future');
  equal(Date.create('5 week from now', 'en').relative(),   '1ヶ月後',  'Date#create | Japanese | relative format future');
  equal(Date.create('5 month from now', 'en').relative(),  '5ヶ月後',   'Date#create | Japanese | relative format future');
  equal(Date.create('5 year from now', 'en').relative(),   '5年後',     'Date#create | Japanese | relative format future');

  dateEqual(Date.create('2011年5月15日 3:45:59'), new Date(2011, 4, 15, 3, 45, 59), 'Date#create | Japanese | full date with time');
  dateEqual(Date.create('2011年5月15日 3時45分'), new Date(2011, 4, 15, 3, 45, 0), 'Date#create | Japanese | full date with kanji markers');
  dateEqual(Date.create('2011年5月15日 3時45分59秒'), new Date(2011, 4, 15, 3, 45, 59), 'Date#create | Japanese | full date with kanji markers');
  dateEqual(Date.create('2011年5月15日 午前3時45分'), new Date(2011, 4, 15, 3, 45), 'Date#create | Japanese | full date with gozen');
  dateEqual(Date.create('2011年5月15日 午後3時45分'), new Date(2011, 4, 15, 15, 45), 'Date#create | Japanese | full date with gogo');
  dateEqual(Date.create('２０１１年５月１５日　３時４５分'), new Date(2011, 4, 15, 3, 45), 'Date#create | Japanese | full date with zenkaku');
  dateEqual(Date.create('２０１１年５月１５日　午後３時４５分'), new Date(2011, 4, 15, 15, 45), 'Date#create | Japanese | full date with zenkaku and gogo');

  dateEqual(Date.create('二千十一年五月十五日　午後三時四十五分'), new Date(2011, 4, 15, 15, 45), 'Date#create | Japanese | full date with full kanji and full markers');

  dateEqual(Date.create('2011年5月15日 午後3:45'), new Date(2011, 4, 15, 15, 45), 'Date#create | Japanese | pm still works');


  dateEqual(Date.create('5月15日 3:45:59'), new Date(now.getFullYear(), 4, 15, 3, 45, 59), 'Date#create | Japanese | mm-dd format with time');
  dateEqual(Date.create('15日 3:45:59'), new Date(now.getFullYear(), now.getMonth(), 15, 3, 45, 59), 'Date#create | Japanese | dd format with time');
  dateEqual(Date.create('先週水曜日 5:15'), getDateWithWeekdayAndOffset(3, -7).set({ hour: 5, minute: 15 }), 'Date#create | Japanese | Last wednesday with time');


  // Issue #148 various Japanese dates

  dateEqual(Date.create('来週火曜日午後3:00'), getDateWithWeekdayAndOffset(2, 7).set({ hours: 15 }), 'Date#create | Japanese | next Tuesday at 3:00pm');
  dateEqual(Date.create('火曜日3:00'), getDateWithWeekdayAndOffset(2, 0).set({ hours: 3 }), 'Date.create | Japanese | Tuesday at 3:00am');
  dateEqual(Date.create('火曜日午後3:00'), getDateWithWeekdayAndOffset(2, 0).set({ hours: 15 }), 'Date.create | Japanese | Tuesday at 3:00pm');
  dateEqual(Date.create('2012年6月5日3:00'), new Date(2012, 5, 5, 3), 'Date.create | Japanese | June 5th at 3:00pm');

  equal((5).hours().duration('ja'),   '5時間',     'Date#create | Japanese | simple duration');

});
