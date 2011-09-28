test('Dates | Simplified Chinese', function () {

  var now = new Date();
  Date.setLanguage('zh-Hans');


  dateEqual(Date.create('2011年5月15日'), new Date(2011, 4, 15), 'Date#create | basic Simplified Chinese date');
  dateEqual(Date.create('2011年5月'), new Date(2011, 4), 'Date#create | Simplified Chinese | year and month');
  dateEqual(Date.create('5月15日'), new Date(now.getFullYear(), 4, 15), 'Date#create | Simplified Chinese | month and date');
  dateEqual(Date.create('2011年'), new Date(2011, 0), 'Date#create | Simplified Chinese | year');
  dateEqual(Date.create('5月'), new Date(now.getFullYear(), 4), 'Date#create | Simplified Chinese | month');
  dateEqual(Date.create('15日'), new Date(now.getFullYear(), now.getMonth(), 15), 'Date#create | Simplified Chinese | date');
  dateEqual(Date.create('星期一'), getDateWithWeekdayAndOffset(1), 'Date#create | Simplified Chinese | Monday');


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

  dateEqual(Date.create('前天'), getRelativeDate(null, null, -2).resetTime(), 'Date#create | Simplified Chinese | 一昨日');
  dateEqual(Date.create('昨天'), getRelativeDate(null, null, -1).resetTime(), 'Date#create | Simplified Chinese | yesterday');
  dateEqual(Date.create('今天'), getRelativeDate(null, null, 0).resetTime(), 'Date#create | Simplified Chinese | today');
  dateEqual(Date.create('明天'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | Simplified Chinese | tomorrow');
  dateEqual(Date.create('后天'), getRelativeDate(null, null, 2).resetTime(), 'Date#create | Simplified Chinese | 明後日');

  dateEqual(Date.create('上周'), getRelativeDate(null, null, -7), 'Date#create | Simplified Chinese | Last week');
  dateEqual(Date.create('下周'), getRelativeDate(null, null, 7), 'Date#create | Simplified Chinese | Next week');

  dateEqual(Date.create('上个月'), getRelativeDate(null, -1), 'Date#create | Simplified Chinese | last month');
  dateEqual(Date.create('下个月'), getRelativeDate(null, 1), 'Date#create | Simplified Chinese | Next month');

  dateEqual(Date.create('去年'), getRelativeDate(-1), 'Date#create | Simplified Chinese | Last year');
  dateEqual(Date.create('明年'), getRelativeDate(1), 'Date#create | Simplified Chinese | Next year');

  equal(Date.create('2011-08-25').format('{yyyy}年{MM}月{dd}日'), '2011年08月25日', 'Date#create | Simplified Chinese | format');
  equal(Date.create('5 hours ago').relative(), '5小时前', 'Date#create | Simplified Chinese | relative format');



});
