test('Dates | Japanese', function () {

  var now = new Date();
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


  dateEqual(Date.create('一昨日'), getRelativeDate(null, null, -2).resetTime(), 'Date#create | Japanese | 一昨日');
  dateEqual(Date.create('昨日'), getRelativeDate(null, null, -1).resetTime(), 'Date#create | Japanese | yesterday');
  dateEqual(Date.create('今日'), getRelativeDate(null, null, 0).resetTime(), 'Date#create | Japanese | today');
  dateEqual(Date.create('明日'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | Japanese | tomorrow');
  dateEqual(Date.create('明後日'), getRelativeDate(null, null, 2).resetTime(), 'Date#create | Japanese | 明後日');

  dateEqual(Date.create('先週'), getRelativeDate(null, null, -7), 'Date#create | Japanese | Last week');
  dateEqual(Date.create('来週'), getRelativeDate(null, null, 7), 'Date#create | Japanese | Next week');

  dateEqual(Date.create('先月'), getRelativeDate(null, -1), 'Date#create | Japanese | Next month');
  dateEqual(Date.create('来月'), getRelativeDate(null, 1), 'Date#create | Japanese | Next month');

  dateEqual(Date.create('去年'), getRelativeDate(-1), 'Date#create | Japanese | Last year');
  dateEqual(Date.create('来年'), getRelativeDate(1), 'Date#create | Japanese | Next year');


  dateEqual(Date.create('先週水曜日'), getDateWithWeekdayAndOffset(3, -7), 'Date#create | Japanese | Last wednesday');
  dateEqual(Date.create('来週金曜日'), getDateWithWeekdayAndOffset(5, 7), 'Date#create | Japanese | Next friday');

  equal(Date.create('2011-08-25').format(), '2011年8月25日', 'Date#create | Japanese | standard format');
  equal(Date.create('2011-08-25').format('{yyyy}年{MM}月{dd}日'), '2011年08月25日', 'Date#create | Japanese | format');

  equal(Date.create('1 second ago').relative(), '1秒前', 'Date#create | Japanese | relative format past');
  equal(Date.create('1 minute ago').relative(), '1分前',  'Date#create | Japanese | relative format past');
  equal(Date.create('1 hour ago').relative(),   '1時間前',     'Date#create | Japanese | relative format past');
  equal(Date.create('1 day ago').relative(),    '1日前',    'Date#create | Japanese | relative format past');
  equal(Date.create('1 week ago').relative(),   '1週間前',  'Date#create | Japanese | relative format past');
  equal(Date.create('1 month ago').relative(),  '1ヶ月前',   'Date#create | Japanese | relative format past');
  equal(Date.create('1 year ago').relative(),   '1年前',     'Date#create | Japanese | relative format past');

  equal(Date.create('2 seconds ago').relative(), '2秒前', 'Date#create | Japanese | relative format past');
  equal(Date.create('2 minutes ago').relative(), '2分前',  'Date#create | Japanese | relative format past');
  equal(Date.create('2 hours ago').relative(),   '2時間前',     'Date#create | Japanese | relative format past');
  equal(Date.create('2 days ago').relative(),    '2日前',    'Date#create | Japanese | relative format past');
  equal(Date.create('2 weeks ago').relative(),   '2週間前',  'Date#create | Japanese | relative format past');
  equal(Date.create('2 months ago').relative(),  '2ヶ月前',   'Date#create | Japanese | relative format past');
  equal(Date.create('2 years ago').relative(),   '2年前',     'Date#create | Japanese | relative format past');

  equal(Date.create('1 second from now').relative(), '1秒後', 'Date#create | Japanese | relative format future');
  equal(Date.create('1 minute from now').relative(), '1分後',  'Date#create | Japanese | relative format future');
  equal(Date.create('1 hour from now').relative(),   '1時間後',     'Date#create | Japanese | relative format future');
  equal(Date.create('1 day from now').relative(),    '1日後',    'Date#create | Japanese | relative format future');
  equal(Date.create('1 week from now').relative(),   '1週間後',  'Date#create | Japanese | relative format future');
  equal(Date.create('1 month from now').relative(),  '1ヶ月後',   'Date#create | Japanese | relative format future');
  equal(Date.create('1 year from now').relative(),   '1年後',     'Date#create | Japanese | relative format future');

  equal(Date.create('5 second from now').relative(), '5秒後', 'Date#create | Japanese | relative format future');
  equal(Date.create('5 minute from now').relative(), '5分後',  'Date#create | Japanese | relative format future');
  equal(Date.create('5 hour from now').relative(),   '5時間後',     'Date#create | Japanese | relative format future');
  equal(Date.create('5 day from now').relative(),    '5日後',    'Date#create | Japanese | relative format future');
  equal(Date.create('5 week from now').relative(),   '1ヶ月後',  'Date#create | Japanese | relative format future');
  equal(Date.create('5 month from now').relative(),  '5ヶ月後',   'Date#create | Japanese | relative format future');
  equal(Date.create('5 year from now').relative(),   '5年後',     'Date#create | Japanese | relative format future');

});


