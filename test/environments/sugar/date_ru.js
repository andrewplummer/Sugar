test('Dates | Russian', function () {

  var now = new Date();
  var then = new Date(2011, 7, 25, 15, 45, 50);
  Date.setLocale('ru');

  dateEqual(Date.create('15 мая 2011'), new Date(2011, 4, 15), 'Date#create | basic Russian date');
  dateEqual(Date.create('2 мая 1989 года'), new Date(1989, 4, 2), 'Date#create | Russian | format with year');
  dateEqual(Date.create('5 января 2012'), new Date(2012, 0, 5), 'Date#create | Russian | 2012-01-05');
  dateEqual(Date.create('Май 2011'), new Date(2011, 4), 'Date#create | Russian | year and month');
  dateEqual(Date.create('15 мая'), new Date(now.getFullYear(), 4, 15), 'Date#create | Russian | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | Russian | year');
  dateEqual(Date.create('Май'), new Date(now.getFullYear(), 4), 'Date#create | Russian | month');
  dateEqual(Date.create('понедельник'), getDateWithWeekdayAndOffset(1), 'Date#create | Russian | Monday');

  dateEqual(Date.create('15 мая 2011 3:45'), new Date(2011, 4, 15, 3, 45), 'Date#create | basic Russian date 3:45');
  dateEqual(Date.create('15 мая 2011 3:45 вечера'), new Date(2011, 4, 15, 15, 45), 'Date#create | basic Russian date 3:45pm');

  dateEqual(Date.create('одну миллисекунду назад'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Russian | one millisecond ago');
  dateEqual(Date.create('одну секунду назад'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Russian | one second ago');
  dateEqual(Date.create('одну минуту назад'), getRelativeDate(null, null, null, null, -1), 'Date#create | Russian | one minute ago');
  dateEqual(Date.create('один час назад'), getRelativeDate(null, null, null, -1), 'Date#create | Russian | one hour ago');
  dateEqual(Date.create('один день назад'), getRelativeDate(null, null, -1), 'Date#create | Russian | one day ago');
  dateEqual(Date.create('одну неделю назад'), getRelativeDate(null, null, -7), 'Date#create | Russian | one week ago');
  dateEqual(Date.create('один месяц назад'), getRelativeDate(null, -1), 'Date#create | Russian | one month ago');
  dateEqual(Date.create('один год назад'), getRelativeDate(-1), 'Date#create | Russian | one year ago');

  dateEqual(Date.create('две миллисекунды назад'), getRelativeDate(null, null, null, null, null, null,-2), 'Date#create | Russian | two milliseconds ago');
  dateEqual(Date.create('две секунды назад'), getRelativeDate(null, null, null, null, null, -2), 'Date#create | Russian | two seconds ago');
  dateEqual(Date.create('две минуты назад'), getRelativeDate(null, null, null, null, -2), 'Date#create | Russian | two minutes ago');
  dateEqual(Date.create('два часа назад'), getRelativeDate(null, null, null, -2), 'Date#create | Russian | two hours ago');
  dateEqual(Date.create('Два дня назад'), getRelativeDate(null, null, -2), 'Date#create | Russian | two days ago');
  dateEqual(Date.create('две недели назад'), getRelativeDate(null, null, -14), 'Date#create | Russian | two weeks ago');
  dateEqual(Date.create('два месяца назад'), getRelativeDate(null, -2), 'Date#create | Russian | two months ago');
  dateEqual(Date.create('два года назад'), getRelativeDate(-2), 'Date#create | Russian | two years ago');

  dateEqual(Date.create('восемь миллисекунд назад'), getRelativeDate(null, null, null, null, null, null,-8), 'Date#create | Russian | eight milliseconds ago');
  dateEqual(Date.create('восемь секунд назад'), getRelativeDate(null, null, null, null, null, -8), 'Date#create | Russian | eight seconds ago');
  dateEqual(Date.create('восемь минут назад'), getRelativeDate(null, null, null, null, -8), 'Date#create | Russian | eight minutes ago');
  dateEqual(Date.create('восемь часов назад'), getRelativeDate(null, null, null, -8), 'Date#create | Russian | eight hours ago');
  dateEqual(Date.create('восемь дней назад'), getRelativeDate(null, null, -8), 'Date#create | Russian | eight days ago');
  dateEqual(Date.create('восемь недель назад'), getRelativeDate(null, null, -56), 'Date#create | Russian | eight weeks ago');
  dateEqual(Date.create('восемь месяцев назад'), getRelativeDate(null, -8), 'Date#create | Russian | eight months ago');
  dateEqual(Date.create('восемь лет назад'), getRelativeDate(-8), 'Date#create | Russian | eight years ago');

  dateEqual(Date.create('через 5 миллисекунд'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Russian | five milliseconds from now');
  dateEqual(Date.create('через 5 секунд'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Russian | five second from now');
  dateEqual(Date.create('через 5 минут'), getRelativeDate(null, null, null, null, 5), 'Date#create | Russian | five minute from now');
  dateEqual(Date.create('через 5 часов'), getRelativeDate(null, null, null, 5), 'Date#create | Russian | five hour from now');
  dateEqual(Date.create('через 5 дней'), getRelativeDate(null, null, 5), 'Date#create | Russian | five days from now');
  dateEqual(Date.create('через 5 недель'), getRelativeDate(null, null, 35), 'Date#create | Russian | five weeks from now');
  dateEqual(Date.create('через 5 месяцев'), getRelativeDate(null, 5), 'Date#create | Russian | five months from now');
  dateEqual(Date.create('через 5 лет'), getRelativeDate(5), 'Date#create | Russian | five years from now');

  dateEqual(Date.create('позавчера'), getRelativeDate(null, null, -2).reset(), 'Date#create | Russian | day before yesterday');
  dateEqual(Date.create('Вчера'), getRelativeDate(null, null, -1).reset(), 'Date#create | Russian | yesterday');
  dateEqual(Date.create('Сегодня'), getRelativeDate(null, null, 0).reset(), 'Date#create | Russian | today');
  dateEqual(Date.create('Завтра'), getRelativeDate(null, null, 1).reset(), 'Date#create | Russian | tomorrow');
  dateEqual(Date.create('послезавтра'), getRelativeDate(null, null, 2).reset(), 'Date#create | Russian | day after tomorrow');

  dateEqual(Date.create('на прошлой неделе'), getRelativeDate(null, null, -7), 'Date#create | Russian | Last week');
  dateEqual(Date.create('на следующей неделе'), getRelativeDate(null, null, 7), 'Date#create | Russian | Next week');

  dateEqual(Date.create('в прошлом месяце'), getRelativeDate(null, -1), 'Date#create | Russian | last month');
  dateEqual(Date.create('в следующем месяце'), getRelativeDate(null, 1), 'Date#create | Russian | Next month');

  dateEqual(Date.create('в прошлом году'), getRelativeDate(-1), 'Date#create | Russian | Last year');
  dateEqual(Date.create('в следующем году'), getRelativeDate(1), 'Date#create | Russian | Next year');


  dateEqual(Date.create('следующий понедельник'), getDateWithWeekdayAndOffset(1,  7), 'Date#create | Russian | next monday');
  dateEqual(Date.create('в прошлый вторник'), getDateWithWeekdayAndOffset(2, -7), 'Date#create | Russian | last tuesday');

  dateEqual(Date.create('следующий понедельник 3:45 вечера'), getDateWithWeekdayAndOffset(1,7).set({ hour: 15, minute: 45 }, true), 'Date#create | Russian | next monday');

  equal(then.format(), '25 августа 2011 года 15:45', 'Date#create | Russian | standard format');
  equal(then.format(), '25 августа 2011 года 15:45', 'Date#create | Russian | standard format');
  equal(then.format('{dd} {month} {yyyy}'), '25 августа 2011', 'Date#create | Russian | format');
  equal(then.format('{dd} {month2} {yyyy}'), '25 август 2011', 'Date#create | Russian | format allows alternates');


  // Format shortcuts

  equal(then.format('full'), 'Четверг 25 августа 2011 года 15:45:50', 'Date#create | Russian | full format');
  equal(then.full(), 'Четверг 25 августа 2011 года 15:45:50', 'Date#create | Russian | full format');
  equal(then.format('long'), '25 августа 2011 года 15:45', 'Date#create | Russian | long format');
  equal(then.long(), '25 августа 2011 года 15:45', 'Date#create | Russian | long shortcut');
  equal(then.format('short'), '25 августа 2011 года', 'Date#create | Russian | short format');
  equal(then.short(), '25 августа 2011 года', 'Date#create | Russian | short shortcut');


  equal(Date.create('1 second ago', 'en').relative(), '1 секунду назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('1 minute ago', 'en').relative(), '1 минуту назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('1 hour ago', 'en').relative(),   '1 час назад',     'Date#relative | Russian | relative format past');
  equal(Date.create('1 day ago', 'en').relative(),    '1 день назад',    'Date#relative | Russian | relative format past');
  equal(Date.create('1 week ago', 'en').relative(),   '1 неделю назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('1 month ago', 'en').relative(),  '1 месяц назад',   'Date#relative | Russian | relative format past');
  equal(Date.create('1 year ago', 'en').relative(),   '1 год назад',     'Date#relative | Russian | relative format past');

  equal(Date.create('2 seconds ago', 'en').relative(), '2 секунды назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('2 minutes ago', 'en').relative(), '2 минуты назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('2 hours ago', 'en').relative(),   '2 часа назад',     'Date#relative | Russian | relative format past');
  equal(Date.create('2 days ago', 'en').relative(),    '2 дня назад',    'Date#relative | Russian | relative format past');
  equal(Date.create('2 weeks ago', 'en').relative(),   '2 недели назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('2 months ago', 'en').relative(),  '2 месяца назад',   'Date#relative | Russian | relative format past');
  equal(Date.create('2 years ago', 'en').relative(),   '2 года назад',     'Date#relative | Russian | relative format past');

  equal(Date.create('3 seconds ago', 'en').relative(), '3 секунды назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('3 minutes ago', 'en').relative(), '3 минуты назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('3 hours ago', 'en').relative(),   '3 часа назад',     'Date#relative | Russian | relative format past');
  equal(Date.create('3 days ago', 'en').relative(),    '3 дня назад',    'Date#relative | Russian | relative format past');
  equal(Date.create('3 weeks ago', 'en').relative(),   '3 недели назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('3 months ago', 'en').relative(),  '3 месяца назад',   'Date#relative | Russian | relative format past');
  equal(Date.create('3 years ago', 'en').relative(),   '3 года назад',     'Date#relative | Russian | relative format past');

  equal(Date.create('4 seconds ago', 'en').relative(), '4 секунды назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('4 minutes ago', 'en').relative(), '4 минуты назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('4 hours ago', 'en').relative(),   '4 часа назад',     'Date#relative | Russian | relative format past');
  equal(Date.create('4 days ago', 'en').relative(),    '4 дня назад',    'Date#relative | Russian | relative format past');
  equal(Date.create('4 weeks ago', 'en').relative(),   '4 недели назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('4 months ago', 'en').relative(),  '4 месяца назад',   'Date#relative | Russian | relative format past');
  equal(Date.create('4 years ago', 'en').relative(),   '4 года назад',     'Date#relative | Russian | relative format past');

  equal(Date.create('5 seconds ago', 'en').relative(), '5 секунд назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('5 minutes ago', 'en').relative(), '5 минут назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('5 hours ago', 'en').relative(),   '5 часов назад',     'Date#relative | Russian | relative format past');
  equal(Date.create('5 days ago', 'en').relative(),    '5 дней назад',    'Date#relative | Russian | relative format past');
  equal(Date.create('5 weeks ago', 'en').relative(),   '1 месяц назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('5 months ago', 'en').relative(),  '5 месяцев назад',   'Date#relative | Russian | relative format past');
  equal(Date.create('5 years ago', 'en').relative(),   '5 лет назад',     'Date#relative | Russian | relative format past');

  equal(Date.create('7 seconds ago', 'en').relative(), '7 секунд назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('7 minutes ago', 'en').relative(), '7 минут назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('7 hours ago', 'en').relative(),   '7 часов назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('7 days ago', 'en').relative(),    '1 неделю назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('7 weeks ago', 'en').relative(),   '1 месяц назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('7 months ago', 'en').relative(),  '7 месяцев назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('7 years ago', 'en').relative(),   '7 лет назад', 'Date#relative | Russian | relative format past');

  equal(Date.create('21 seconds ago', 'en').relative(), '21 секунду назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('21 minutes ago', 'en').relative(), '21 минуту назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('21 hours ago', 'en').relative(),   '21 час назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('21 days ago', 'en').relative(),    '3 недели назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('21 years ago', 'en').relative(),   '21 год назад', 'Date#relative | Russian | relative format past');

  equal(Date.create('22 seconds ago', 'en').relative(), '22 секунды назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('22 minutes ago', 'en').relative(), '22 минуты назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('22 hours ago', 'en').relative(),   '22 часа назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('22 days ago', 'en').relative(),    '3 недели назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('22 years ago', 'en').relative(),   '22 года назад', 'Date#relative | Russian | relative format past');

  equal(Date.create('25 seconds ago', 'en').relative(), '25 секунд назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('25 minutes ago', 'en').relative(), '25 минут назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('25 hours ago', 'en').relative(),   '1 день назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('25 days ago', 'en').relative(),    '3 недели назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('25 years ago', 'en').relative(),   '25 лет назад', 'Date#relative | Russian | relative format past');

  equal(Date.create('1 second ago', 'en').relative(), '1 секунду назад', 'Date#relative | Russian | relative format past');
  equal(Date.create('1 minute ago', 'en').relative(), '1 минуту назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('1 hour ago', 'en').relative(),   '1 час назад',     'Date#relative | Russian | relative format past');
  equal(Date.create('1 day ago', 'en').relative(),    '1 день назад',    'Date#relative | Russian | relative format past');
  equal(Date.create('1 week ago', 'en').relative(),   '1 неделю назад',  'Date#relative | Russian | relative format past');
  equal(Date.create('1 month ago', 'en').relative(),  '1 месяц назад',   'Date#relative | Russian | relative format past');
  equal(Date.create('1 year ago', 'en').relative(),   '1 год назад',     'Date#relative | Russian | relative format past');


  equal(Date.create('1 second from now', 'en').relative(), 'через 1 секунду', 'Date#relative | Russian | relative format future');
  equal(Date.create('1 minute from now', 'en').relative(), 'через 1 минуту',  'Date#relative | Russian | relative format future');
  equal(Date.create('1 hour from now', 'en').relative(),   'через 1 час',     'Date#relative | Russian | relative format future');
  equal(Date.create('1 day from now', 'en').relative(),    'через 1 день',    'Date#relative | Russian | relative format future');
  equal(Date.create('1 week from now', 'en').relative(),   'через 1 неделю',  'Date#relative | Russian | relative format future');
  equal(Date.create('1 month from now', 'en').relative(),  'через 1 месяц',   'Date#relative | Russian | relative format future');
  equal(Date.create('1 year from now', 'en').relative(),   'через 1 год',     'Date#relative | Russian | relative format future');

  equal(Date.create('2 seconds from now', 'en').relative(), 'через 2 секунды', 'Date#relative | Russian | relative format future');
  equal(Date.create('2 minutes from now', 'en').relative(), 'через 2 минуты',  'Date#relative | Russian | relative format future');
  equal(Date.create('2 hours from now', 'en').relative(),   'через 2 часа',     'Date#relative | Russian | relative format future');
  equal(Date.create('2 days from now', 'en').relative(),    'через 2 дня',    'Date#relative | Russian | relative format future');
  equal(Date.create('2 weeks from now', 'en').relative(),   'через 2 недели',  'Date#relative | Russian | relative format future');
  equal(Date.create('2 months from now', 'en').relative(),  'через 2 месяца',   'Date#relative | Russian | relative format future');
  equal(Date.create('2 years from now', 'en').relative(),   'через 2 года',     'Date#relative | Russian | relative format future');

  equal(Date.create('5 seconds from now', 'en').relative(), 'через 5 секунд', 'Date#relative | Russian | relative format future');
  equal(Date.create('5 minutes from now', 'en').relative(), 'через 5 минут',  'Date#relative | Russian | relative format future');
  equal(Date.create('5 hours from now', 'en').relative(),   'через 5 часов',     'Date#relative | Russian | relative format future');
  equal(Date.create('5 days from now', 'en').relative(),    'через 5 дней',    'Date#relative | Russian | relative format future');
  equal(Date.create('5 weeks from now', 'en').relative(),   'через 1 месяц',  'Date#relative | Russian | relative format future');
  equal(Date.create('5 months from now', 'en').relative(),  'через 5 месяцев',   'Date#relative | Russian | relative format future');
  equal(Date.create('5 years from now', 'en').relative(),   'через 5 лет',     'Date#relative | Russian | relative format future');

  dateEqual(Date.create('Завтра в 3:30 утра'), getRelativeDate(null, null, 1).set({hours:3,minutes:30}, true), 'Date#create | Russian | tomorrow at 3:30');

  equal((5).hours().duration('ru'), '5 часов', 'Date#create | Russian | simple duration');


  equal(Date.create('11 hours ago', 'en').relative(), '11 часов назад', 'Date#relative | Russian | 11 hours ago');
  equal(Date.create('12 hours ago', 'en').relative(), '12 часов назад', 'Date#relative | Russian | 12 hours ago');
  equal(Date.create('13 hours ago', 'en').relative(), '13 часов назад', 'Date#relative | Russian | 13 hours ago');
  equal(Date.create('14 hours ago', 'en').relative(), '14 часов назад', 'Date#relative | Russian | 14 hours ago');
  equal(Date.create('15 hours ago', 'en').relative(), '15 часов назад', 'Date#relative | Russian | 15 hours ago');
  equal(Date.create('16 hours ago', 'en').relative(), '16 часов назад', 'Date#relative | Russian | 16 hours ago');
  equal(Date.create('17 hours ago', 'en').relative(), '17 часов назад', 'Date#relative | Russian | 17 hours ago');
  equal(Date.create('18 hours ago', 'en').relative(), '18 часов назад', 'Date#relative | Russian | 18 hours ago');
  equal(Date.create('19 hours ago', 'en').relative(), '19 часов назад', 'Date#relative | Russian | 19 hours ago');
  equal(Date.create('20 hours ago', 'en').relative(), '20 часов назад', 'Date#relative | Russian | 20 hours ago');

  equal(Date.create('21 hours ago', 'en').relative(), '21 час назад', 'Date#relative | Russian | 21 hours ago');
  equal(Date.create('22 hours ago', 'en').relative(), '22 часа назад', 'Date#relative | Russian | 22 hours ago');

  equal(Date.create('11 hours from now', 'en').relative(), 'через 11 часов', 'Date#relative | Russian | 11 hours ago');
  equal(Date.create('12 hours from now', 'en').relative(), 'через 12 часов', 'Date#relative | Russian | 12 hours ago');
  equal(Date.create('13 hours from now', 'en').relative(), 'через 13 часов', 'Date#relative | Russian | 13 hours ago');
  equal(Date.create('14 hours from now', 'en').relative(), 'через 14 часов', 'Date#relative | Russian | 14 hours ago');
  equal(Date.create('15 hours from now', 'en').relative(), 'через 15 часов', 'Date#relative | Russian | 15 hours ago');
  equal(Date.create('16 hours from now', 'en').relative(), 'через 16 часов', 'Date#relative | Russian | 16 hours ago');
  equal(Date.create('17 hours from now', 'en').relative(), 'через 17 часов', 'Date#relative | Russian | 17 hours ago');
  equal(Date.create('18 hours from now', 'en').relative(), 'через 18 часов', 'Date#relative | Russian | 18 hours ago');
  equal(Date.create('19 hours from now', 'en').relative(), 'через 19 часов', 'Date#relative | Russian | 19 hours ago');
  equal(Date.create('20 hours from now', 'en').relative(), 'через 20 часов', 'Date#relative | Russian | 20 hours ago');

  equal(Date.create('21 hours from now', 'en').relative(), 'через 21 час', 'Date#relative | Russian | 21 hours ago');
  equal(Date.create('22 hours from now', 'en').relative(), 'через 22 часа', 'Date#relative | Russian | 22 hours ago');

});
