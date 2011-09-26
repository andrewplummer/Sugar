test('Dates | Traditional Chinese', function () {

  var now = new Date();

  dateEqual(Date.create('2011年5月15日', 'zh-Hant'), new Date(2011, 4, 15), 'Date#create | basic Traditional Chinese date');
  dateEqual(Date.create('2011年5月'), new Date(2011, 4), 'Date#create | Traditional Chinese | year and month');
  dateEqual(Date.create('5月15日'), new Date(now.getFullYear(), 4, 15), 'Date#create | Traditional Chinese | month and date');
  dateEqual(Date.create('2011年'), new Date(2011, 0), 'Date#create | Traditional Chinese | year');
  dateEqual(Date.create('5月'), new Date(now.getFullYear(), 4), 'Date#create | Traditional Chinese | month');
  dateEqual(Date.create('15日'), new Date(now.getFullYear(), now.getMonth(), 15), 'Date#create | Traditional Chinese | date');
  dateEqual(Date.create('星期一'), getDateWithWeekdayAndOffset(1), 'Date#create | Traditional Chinese | Monday');

  dateEqual(Date.create('一毫秒前'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Traditional Chinese | one millisecond ago');
  dateEqual(Date.create('一秒鐘前'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Traditional Chinese | one second ago');
  dateEqual(Date.create('一分鐘前'), getRelativeDate(null, null, null, null, -1), 'Date#create | Traditional Chinese | one minute ago');
  dateEqual(Date.create('一小時前'), getRelativeDate(null, null, null, -1), 'Date#create | Traditional Chinese | one hour ago');
  dateEqual(Date.create('一天前'), getRelativeDate(null, null, -1), 'Date#create | Traditional Chinese | one day ago');
  dateEqual(Date.create('一週前'), getRelativeDate(null, null, -7), 'Date#create | Traditional Chinese | one week 週');
  dateEqual(Date.create('一個星期前'), getRelativeDate(null, null, -7), 'Date#create | Traditional Chinese | one week 個星期');
  dateEqual(Date.create('一個月前'), getRelativeDate(null, -1), 'Date#create | Traditional Chinese | one month ago');
  dateEqual(Date.create('一年前'), getRelativeDate(-1), 'Date#create | Traditional Chinese | one year ago');

  dateEqual(Date.create('5毫秒後'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Traditional Chinese | five millisecond from now');
  dateEqual(Date.create('5秒鐘後'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Traditional Chinese | five second from now');
  dateEqual(Date.create('5分鐘後'), getRelativeDate(null, null, null, null, 5), 'Date#create | Traditional Chinese | five minute from now');
  dateEqual(Date.create('5小時後'), getRelativeDate(null, null, null, 5), 'Date#create | Traditional Chinese | five hour from now');
  dateEqual(Date.create('5天後'), getRelativeDate(null, null, 5), 'Date#create | Traditional Chinese | five day from now');
  dateEqual(Date.create('5週後'), getRelativeDate(null, null, 35), 'Date#create | Traditional Chinese | five weeks from now 週');
  dateEqual(Date.create('5個星期後'), getRelativeDate(null, null, 35), 'Date#create | Traditional Chinese | five weeks from now 個星期');
  dateEqual(Date.create('5個月後'), getRelativeDate(null, 5), 'Date#create | Traditional Chinese | five months');
  dateEqual(Date.create('5年後'), getRelativeDate(5), 'Date#create | Traditional Chinese | five years from now');

  dateEqual(Date.create('２０１１年'), new Date(2011, 0), 'Date#create | Traditional Chinese | full-width year');

  dateEqual(Date.create('前天'), getRelativeDate(null, null, -2).resetTime(), 'Date#create | Traditional Chinese | 一昨日');
  dateEqual(Date.create('昨天'), getRelativeDate(null, null, -1).resetTime(), 'Date#create | Traditional Chinese | yesterday');
  dateEqual(Date.create('今天'), getRelativeDate(null, null, 0).resetTime(), 'Date#create | Traditional Chinese | today');
  dateEqual(Date.create('明天'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | Traditional Chinese | tomorrow');
  dateEqual(Date.create('後天'), getRelativeDate(null, null, 2).resetTime(), 'Date#create | Traditional Chinese | 明後日');

  dateEqual(Date.create('上週'), getRelativeDate(null, null, -7), 'Date#create | Traditional Chinese | Last week');
  dateEqual(Date.create('下週'), getRelativeDate(null, null, 7), 'Date#create | Traditional Chinese | Next week');

  dateEqual(Date.create('上個月'), getRelativeDate(null, -1), 'Date#create | Traditional Chinese | last month');
  dateEqual(Date.create('下個月'), getRelativeDate(null, 1), 'Date#create | Traditional Chinese | Next month');

  dateEqual(Date.create('去年'), getRelativeDate(-1), 'Date#create | Traditional Chinese | Last year');
  dateEqual(Date.create('明年'), getRelativeDate(1), 'Date#create | Traditional Chinese | Next year');


  equal(Date.create('2011-08-25').format('{yyyy}年{MM}月{dd}日'), '2011年08月25日', 'Date#create | Traditional Chinese | format');
  equal(Date.create('5 hours ago').relative(), '5小時前', 'Date#create | Traditional Chinese | relative format');


});
