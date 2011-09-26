test('Dates - Chinese', function () {

  dateEqual(Date.create('2011年5月15日', 'zh-Hans'), new Date(2011, 4, 15), 'Date#create | basic Chinese date');
  /*
  dateEqual(Date.create('2011年5月'), new Date(2011, 4), 'Date#create | Chinese | year and month');
  dateEqual(Date.create('5月15日'), new Date(now.getFullYear(), 4, 15), 'Date#create | Chinese | month and date');
  dateEqual(Date.create('2011年'), new Date(2011, 0), 'Date#create | Chinese | year');
  dateEqual(Date.create('5月'), new Date(now.getFullYear(), 4), 'Date#create | Chinese | month');
  dateEqual(Date.create('15日'), new Date(now.getFullYear(), now.getMonth(), 15), 'Date#create | Chinese | date');
  dateEqual(Date.create('星期一'), getDateWithWeekdayAndOffset(1), 'Date#create | Chinese | Monday');
  */


});
