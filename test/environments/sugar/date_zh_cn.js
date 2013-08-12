test('Dates | Simplified Chinese', function () {

  var now = new Date();
  var then = new Date(2011, 7, 25, 15, 45, 50);
  Date.setLocale('zh-CN');

  dateEqual(Date.create('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | basic Simplified Chinese date');
  dateEqual(Date.create('2011年5月'), new Date(2011, 4), 'Date#create | Simplified Chinese | year and month');
  dateEqual(Date.create('5月15日'), new Date(now.getFullYear(), 4, 15), 'Date#create | Simplified Chinese | month and date');
  dateEqual(Date.create('2011年'), new Date(2011, 0), 'Date#create | Simplified Chinese | year');
  dateEqual(Date.create('5月'), new Date(now.getFullYear(), 4), 'Date#create | Simplified Chinese | month');
  dateEqual(Date.create('15日'), new Date(now.getFullYear(), now.getMonth(), 15), 'Date#create | Simplified Chinese | date');
  dateEqual(Date.create('星期一'), getDateWithWeekdayAndOffset(1), 'Date#create | Simplified Chinese | Monday');
  dateEqual(Date.create('九日'), new Date(now.getFullYear(), now.getMonth(), 9), 'Date#create | Simplified Chinese | the 9th');
  dateEqual(Date.create('二十五日'), new Date(now.getFullYear(), now.getMonth(), 25), 'Date#create | Simplified Chinese | the 25th');
  dateEqual(Date.create('二十五号'), new Date(now.getFullYear(), now.getMonth(), 25), 'Date#create | Simplified Chinese | 号 should be understood as well');
  dateEqual(Date.create('九月二十五号'), new Date(now.getFullYear(), 8, 25), 'Date#create | Simplified Chinese | 9.25');

  dateEqual(Date.create('2011年5月15日 3:45'), new Date(2011, 4, 15, 3, 45), 'Date#create | basic Simplified Chinese date 3:45');
  dateEqual(Date.create('2011年5月15日 下午3:45'), new Date(2011, 4, 15, 15, 45), 'Date#create | basic Simplified Chinese date 3:45pm');
  dateEqual(Date.create('2011年5月15日 3点45分钟'), new Date(2011, 4, 15, 3, 45), 'Date#create | basic Simplified Chinese date 3:45pm kanji');
  dateEqual(Date.create('2011年5月15日 下午3点45分钟'), new Date(2011, 4, 15, 15, 45), 'Date#create | basic Simplified Chinese date 3:45pm kanji afternoon');

  dateEqual(Date.create('一毫秒前'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Simplified Chinese | one millisecond ago');
  dateEqual(Date.create('一秒钟前'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Simplified Chinese | one second ago');
  dateEqual(Date.create('一分钟前'), getRelativeDate(null, null, null, null, -1), 'Date#create | Simplified Chinese | one minute ago');
  dateEqual(Date.create('一小时前'), getRelativeDate(null, null, null, -1), 'Date#create | Simplified Chinese | one hour ago');
  dateEqual(Date.create('一天前'), getRelativeDate(null, null, -1), 'Date#create | Simplified Chinese | one day ago');
  dateEqual(Date.create('一周前'), getRelativeDate(null, null, -7), 'Date#create | Simplified Chinese | one week 周');
  dateEqual(Date.create('一个星期前'), getRelativeDate(null, null, -7), 'Date#create | Simplified Chinese | one week 个星期');
  dateEqual(Date.create('一个月前'), getRelativeDate(null, -1), 'Date#create | Simplified Chinese | one month ago');
  dateEqual(Date.create('一年前'), getRelativeDate(-1), 'Date#create | Simplified Chinese | one year ago');


  dateEqual(Date.create('5毫秒后'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Simplified Chinese | five millisecond from now');
  dateEqual(Date.create('5秒钟后'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Simplified Chinese | five second from now');
  dateEqual(Date.create('5分钟后'), getRelativeDate(null, null, null, null, 5), 'Date#create | Simplified Chinese | five minute from now');
  dateEqual(Date.create('5小时后'), getRelativeDate(null, null, null, 5), 'Date#create | Simplified Chinese | five hour from now');
  dateEqual(Date.create('5天后'), getRelativeDate(null, null, 5), 'Date#create | Simplified Chinese | five day from now');
  dateEqual(Date.create('5周后'), getRelativeDate(null, null, 35), 'Date#create | Simplified Chinese | five weeks from now 周');
  dateEqual(Date.create('5个星期后'), getRelativeDate(null, null, 35), 'Date#create | Simplified Chinese | five weeks from now 个星期');
  dateEqual(Date.create('5个月后'), getRelativeDate(null, 5), 'Date#create | Simplified Chinese | five months');
  dateEqual(Date.create('5年后'), getRelativeDate(5), 'Date#create | Simplified Chinese | five years from now');

  dateEqual(Date.create('２０１１年'), new Date(2011, 0), 'Date#create | Simplified Chinese | full-width year');
  dateEqual(Date.create('星期三'), getDateWithWeekdayAndOffset(3, 0), 'Date#create | Simplified Chinese | 星期 Wednesday');

  dateEqual(Date.create('前天'), getRelativeDate(null, null, -2).reset(), 'Date#create | Simplified Chinese | 一昨日');
  dateEqual(Date.create('昨天'), getRelativeDate(null, null, -1).reset(), 'Date#create | Simplified Chinese | yesterday');
  dateEqual(Date.create('今天'), getRelativeDate(null, null, 0).reset(), 'Date#create | Simplified Chinese | today');
  dateEqual(Date.create('明天'), getRelativeDate(null, null, 1).reset(), 'Date#create | Simplified Chinese | tomorrow');
  dateEqual(Date.create('后天'), getRelativeDate(null, null, 2).reset(), 'Date#create | Simplified Chinese | tomorrow');

  dateEqual(Date.create('上周'), getRelativeDate(null, null, -7), 'Date#create | Simplified Chinese | Last week');
  dateEqual(Date.create('这周'), getRelativeDate(null, null, 0), 'Date#create | Simplified Chinese | This week');
  dateEqual(Date.create('下周'), getRelativeDate(null, null, 7), 'Date#create | Simplified Chinese | Next week');

  dateEqual(Date.create('上个月'), getRelativeDate(null, -1), 'Date#create | Simplified Chinese | last month');
  dateEqual(Date.create('这个月'), getRelativeDate(null, 0), 'Date#create | Simplified Chinese | this month');
  dateEqual(Date.create('下个月'), getRelativeDate(null, 1), 'Date#create | Simplified Chinese | Next month');

  dateEqual(Date.create('去年'), getRelativeDate(-1), 'Date#create | Simplified Chinese | Last year');
  dateEqual(Date.create('明年'), getRelativeDate(1), 'Date#create | Simplified Chinese | Next year');

  dateEqual(Date.create('上周三'), getDateWithWeekdayAndOffset(3, -7), 'Date#create | Simplified Chinese | Last wednesday');
  dateEqual(Date.create('这周六'), getDateWithWeekdayAndOffset(6), 'Date#create | Simplified Chinese | this Saturday');
  dateEqual(Date.create('下周五'), getDateWithWeekdayAndOffset(5, 7), 'Date#create | Simplified Chinese | Next friday');

  equal(then.format(), '2011年8月25日 下午3:45', 'Date#create | Simplified Chinese | standard format');
  equal(then.format('{yyyy}年{MM}月{dd}日'), '2011年08月25日', 'Date#create | Simplified Chinese | format');

  // Format shortcuts
  equal(then.format('long'), '2011年8月25日 下午3:45', 'Date#create | Simplified Chinese | long format');
  equal(then.long(), '2011年8月25日 下午3:45', 'Date#create | Simplified Chinese | long shortcut');
  equal(then.format('full'), '2011年8月25日 星期四 下午3:45:50', 'Date#create | Simplified Chinese | full format');
  equal(then.full(), '2011年8月25日 星期四 下午3:45:50', 'Date#create | Simplified Chinese | full format');
  equal(then.format('short'), '2011年8月25日', 'Date#create | Simplified Chinese | short format');
  equal(then.short(), '2011年8月25日', 'Date#create | Simplified Chinese | short format');

  equal(Date.create('1 second ago', 'en').relative(), '1秒钟前', 'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('1 minute ago', 'en').relative(), '1分钟前',  'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('1 hour ago', 'en').relative(),   '1小时前',     'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('1 day ago', 'en').relative(),    '1天前',    'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('1 week ago', 'en').relative(),   '1个星期前',  'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('1 month ago', 'en').relative(),  '1个月前',   'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('1 year ago', 'en').relative(),   '1年前',     'Date#create | Simplified Chinese | relative format past');

  equal(Date.create('2 seconds ago', 'en').relative(), '2秒钟前', 'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('2 minutes ago', 'en').relative(), '2分钟前',  'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('2 hours ago', 'en').relative(),   '2小时前',     'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('2 days ago', 'en').relative(),    '2天前',    'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('2 weeks ago', 'en').relative(),   '2个星期前',  'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('2 months ago', 'en').relative(),  '2个月前',   'Date#create | Simplified Chinese | relative format past');
  equal(Date.create('2 years ago', 'en').relative(),   '2年前',     'Date#create | Simplified Chinese | relative format past');

  equal(Date.create('1 second from now', 'en').relative(), '1秒钟后', 'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('1 minute from now', 'en').relative(), '1分钟后',  'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('1 hour from now', 'en').relative(),   '1小时后',     'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('1 day from now', 'en').relative(),    '1天后',    'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('1 week from now', 'en').relative(),   '1个星期后',  'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('1 month from now', 'en').relative(),  '1个月后',   'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('1 year from now', 'en').relative(),   '1年后',     'Date#create | Simplified Chinese | relative format future');

  equal(Date.create('5 second from now', 'en').relative(), '5秒钟后', 'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('5 minute from now', 'en').relative(), '5分钟后',  'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('5 hour from now', 'en').relative(),   '5小时后',     'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('5 day from now', 'en').relative(),    '5天后',    'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('5 week from now', 'en').relative(),   '1个月后',  'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('5 month from now', 'en').relative(),  '5个月后',   'Date#create | Simplified Chinese | relative format future');
  equal(Date.create('5 year from now', 'en').relative(),   '5年后',     'Date#create | Simplified Chinese | relative format future');


  dateEqual(Date.create('2011年5月15日 下午3:45'), new Date(2011, 4, 15, 15, 45), 'Date#create | Simplified Chinese | pm still works');

  dateEqual(Date.create('2011年5月15日 3:45:59'), new Date(2011, 4, 15, 3, 45, 59), 'Date#create | Simplified Chinese | full date with time');
  dateEqual(Date.create('2011年5月15日 3点45分'), new Date(2011, 4, 15, 3, 45, 0), 'Date#create | Simplified Chinese | full date with kanji markers');

  dateEqual(Date.create('二〇〇八年十一月十四日 三点四十五分'), new Date(2008, 10, 14, 3, 45), 'Date#create | Simplified Chinese | full date with full kanji');
  dateEqual(Date.create('二〇〇八年十一月十四日 三点四十五分钟'), new Date(2008, 10, 14, 3, 45), 'Date#create | Simplified Chinese | full date with full kanji and zhong');

  dateEqual(Date.create('二〇〇八年十一月十四日 三点四十五分钟'), new Date(2008, 10, 14, 3, 45), 'Date#create | Simplified Chinese | full date with full kanji and zhong');



  // Kanji conversion tests

  dateEqual(Date.create('二〇一二年五月'), new Date(2012, 4), 'Date#create | Simplified Chinese | 二〇一二年五月');
  dateEqual(Date.create('二〇一二年'), new Date(2012, 0), 'Date#create | Simplified Chinese | 二〇一二年');
  dateEqual(Date.create('五月'), new Date(now.getFullYear(), 4), 'Date#create | Simplified Chinese | 五月');
  dateEqual(Date.create('十二月'), new Date(now.getFullYear(), 11), 'Date#create | Simplified Chinese | 十二月');
  dateEqual(Date.create('十一月'), new Date(now.getFullYear(), 10), 'Date#create | Simplified Chinese | 十一月');
  dateEqual(Date.create('十月'), new Date(now.getFullYear(), 9), 'Date#create | Simplified Chinese | 十月');
  dateEqual(Date.create('二〇一二年'), new Date(2012, 0), 'Date#create | Simplified Chinese | 二〇一二年');

  dateEqual(Date.create('二千二百二十二年'), new Date(2222, 0), 'Date#create | Simplified Chinese | 二千二百二十二年');
  dateEqual(Date.create('二千二十二年'), new Date(2022, 0), 'Date#create | Simplified Chinese | 二千二十二年');
  dateEqual(Date.create('二千二年'), new Date(2002, 0), 'Date#create | Simplified Chinese | 二千二年');
  dateEqual(Date.create('二千年'), new Date(2000, 0), 'Date#create | Simplified Chinese | 二千年');
  dateEqual(Date.create('千年'), new Date(1000, 0), 'Date#create | Simplified Chinese | 千年');

  dateEqual(Date.create('二千二百二十年'), new Date(2220, 0), 'Date#create | Simplified Chinese | 二千二百二十年');
  dateEqual(Date.create('二千二百年'), new Date(2200, 0), 'Date#create | Simplified Chinese | 二千二百年');
  dateEqual(Date.create('二千二年'), new Date(2002, 0), 'Date#create | Simplified Chinese | 二千二年');

  dateEqual(Date.create('千二百二十二年'), new Date(1222, 0), 'Date#create | Simplified Chinese | 千二百二十二年');
  dateEqual(Date.create('千二百二十二年'), new Date(1222, 0), 'Date#create | Simplified Chinese | 千二百二十二年');
  dateEqual(Date.create('千百二十二年'), new Date(1122, 0), 'Date#create | Simplified Chinese | 千百二十二年');
  dateEqual(Date.create('千二十二年'), new Date(1022, 0), 'Date#create | Simplified Chinese | 千二十二年');
  dateEqual(Date.create('千十二年'), new Date(1012, 0), 'Date#create | Simplified Chinese | 千十二年');

  dateEqual(Date.create('二〇二一年'), new Date(2021, 0), 'Date#create | Simplified Chinese | 二〇二一年');
  dateEqual(Date.create('二三二一年'), new Date(2321, 0), 'Date#create | Simplified Chinese | 二三二一年');
  dateEqual(Date.create('四三二一年'), new Date(4321, 0), 'Date#create | Simplified Chinese | 四三二一年');

  dateEqual(Date.create('1/2/13'), new Date(2013, 0, 2), 'Date#create | Simplified Chinese | uses American style ambiguity');

  // Issue #148 various Chinese dates

  dateEqual(Date.create('星期日 下午2:00'), getDateWithWeekdayAndOffset(0).set({ hour: 14 }), 'Date#create | Simplified Chinese | 星期日 2:00pm');
  dateEqual(Date.create('12/31/2012'), new Date(2012, 11, 31), 'Date#create | Simplified Chinese | 12/31/2012');
  dateEqual(Date.create('下星期六 3点12分'), getDateWithWeekdayAndOffset(6, 7, 3, 12), 'Date#create | Simplified Chinese | Saturday 3:12');

  dateEqual(Date.create('上午3点12分'), new Date().set({ hour: 3, minute: 12 }, true), 'Date#create | Simplified Chinese | 3:12am');
  dateEqual(Date.create('上午3点'), new Date().set({ hour: 3 }, true), 'Date#create | Simplified Chinese | 3am');

  dateEqual(Date.create('上午3时12分'), new Date().set({ hour: 3, minute: 12 }, true), 'Date#create | Simplified Chinese | 时 | 3:12am');
  dateEqual(Date.create('上午3时'), new Date().set({ hour: 3 }, true), 'Date#create | Simplified Chinese | 时 | 3am');

  equal((5).hours().duration('zh-CN'),   '5小时',     'Date#create | Simplified Chinese | simple duration');

  equal(Date.create('18:00', 'zh-CN').getHours(), 18, 'Date#create | Simplified Chinese | hour:minute only');

});

