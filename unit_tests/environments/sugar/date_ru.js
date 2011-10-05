test('Dates | Russian', function () {

  var now = new Date();
  Date.setLanguage('ru');

  dateEqual(Date.create('15 мая 2011'), new Date(2011, 4, 15), 'Date#create | basic Russian date');
  dateEqual(Date.create('5 января 2012'), new Date(2012, 0, 5), 'Date#create | Russian | 2012-01-05');
  dateEqual(Date.create('Май 2011'), new Date(2011, 4), 'Date#create | Russian | year and month');
  dateEqual(Date.create('15 мая'), new Date(now.getFullYear(), 4, 15), 'Date#create | Russian | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | Russian | year');
  dateEqual(Date.create('Май'), new Date(now.getFullYear(), 4), 'Date#create | Russian | month');
  dateEqual(Date.create('понедельник'), getDateWithWeekdayAndOffset(1), 'Date#create | Russian | Monday');


  dateEqual(Date.create('одну миллисекунду назад'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Russian | one millisecond ago');
  dateEqual(Date.create('одну секунду назад'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Russian | one second ago');
  dateEqual(Date.create('одну минуту назад'), getRelativeDate(null, null, null, null, -1), 'Date#create | Russian | one minute ago');
  dateEqual(Date.create('один час назад'), getRelativeDate(null, null, null, -1), 'Date#create | Russian | one hour ago');
  dateEqual(Date.create('один день назад'), getRelativeDate(null, null, -1), 'Date#create | Russian | one day ago');
  dateEqual(Date.create('одну неделю назад'), getRelativeDate(null, null, -7), 'Date#create | Russian | one week ago');
  dateEqual(Date.create('один месяц назад'), getRelativeDate(null, -1), 'Date#create | Russian | one month ago');
  dateEqual(Date.create('один год назад'), getRelativeDate(-1), 'Date#create | Russian | one year ago');

  dateEqual(Date.create('две миллисекунды назад'), getRelativeDate(null, null, null, null, null, null,-2), 'Date#create | Russian | two millisecond ago');
  dateEqual(Date.create('две секунды назад'), getRelativeDate(null, null, null, null, null, -2), 'Date#create | Russian | two second ago');
  dateEqual(Date.create('две минуты назад'), getRelativeDate(null, null, null, null, -2), 'Date#create | Russian | two minute ago');
  dateEqual(Date.create('два часа назад'), getRelativeDate(null, null, null, -2), 'Date#create | Russian | two hour ago');
  dateEqual(Date.create('Два дня назад'), getRelativeDate(null, null, -2), 'Date#create | Russian | two day ago');
  dateEqual(Date.create('две недели назад'), getRelativeDate(null, null, -14), 'Date#create | Russian | two week ago');
  dateEqual(Date.create('два месяца назад'), getRelativeDate(null, -2), 'Date#create | Russian | two month ago');
  dateEqual(Date.create('два года назад'), getRelativeDate(-2), 'Date#create | Russian | two year ago');

  dateEqual(Date.create('восемь миллисекунд назад'), getRelativeDate(null, null, null, null, null, null,-8), 'Date#create | Russian | eight millisecond ago');
  dateEqual(Date.create('восемь секунд назад'), getRelativeDate(null, null, null, null, null, -8), 'Date#create | Russian | eight second ago');
  dateEqual(Date.create('восемь минут назад'), getRelativeDate(null, null, null, null, -8), 'Date#create | Russian | eight minute ago');
  dateEqual(Date.create('восемь часов назад'), getRelativeDate(null, null, null, -8), 'Date#create | Russian | eight hour ago');
  dateEqual(Date.create('восемь дней назад'), getRelativeDate(null, null, -8), 'Date#create | Russian | eight day ago');
  dateEqual(Date.create('восемь недель назад'), getRelativeDate(null, null, -56), 'Date#create | Russian | eight week ago');
  dateEqual(Date.create('восемь месяцев назад'), getRelativeDate(null, -8), 'Date#create | Russian | eight month ago');
  dateEqual(Date.create('восемь лет назад'), getRelativeDate(-8), 'Date#create | Russian | eight year ago');

  dateEqual(Date.create('через 5 миллисекунд'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Russian | five milliseconds from now');
  dateEqual(Date.create('через 5 секунд'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Russian | five second from now');
  dateEqual(Date.create('через 5 минут'), getRelativeDate(null, null, null, null, 5), 'Date#create | Russian | five minute from now');
  dateEqual(Date.create('через 5 часов'), getRelativeDate(null, null, null, 5), 'Date#create | Russian | five hour from now');
  dateEqual(Date.create('через 5 дней'), getRelativeDate(null, null, 5), 'Date#create | Russian | five days from now');
  dateEqual(Date.create('через 5 недель'), getRelativeDate(null, null, 35), 'Date#create | Russian | five weeks from now');
  dateEqual(Date.create('через 5 месяцев'), getRelativeDate(null, 5), 'Date#create | Russian | five months from now');
  dateEqual(Date.create('через 5 лет'), getRelativeDate(5), 'Date#create | Russian | five years from now');

  dateEqual(Date.create('позавчера'), getRelativeDate(null, null, -2).resetTime(), 'Date#create | Russian | day before yesterday');
  dateEqual(Date.create('Вчера'), getRelativeDate(null, null, -1).resetTime(), 'Date#create | Russian | yesterday');
  dateEqual(Date.create('Сегодня'), getRelativeDate(null, null, 0).resetTime(), 'Date#create | Russian | today');
  dateEqual(Date.create('Завтра'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | Russian | tomorrow');
  dateEqual(Date.create('послезавтра'), getRelativeDate(null, null, 2).resetTime(), 'Date#create | Russian | day after tomorrow');

  dateEqual(Date.create('на прошлой неделе'), getRelativeDate(null, null, -7), 'Date#create | Russian | Last week');
  dateEqual(Date.create('на следующей неделе'), getRelativeDate(null, null, 7), 'Date#create | Russian | Next week');

  dateEqual(Date.create('в прошлом месяце'), getRelativeDate(null, -1), 'Date#create | Russian | last month');
  dateEqual(Date.create('в следующем месяце'), getRelativeDate(null, 1), 'Date#create | Russian | Next month');

  dateEqual(Date.create('в прошлом году'), getRelativeDate(-1), 'Date#create | Russian | Last year');
  dateEqual(Date.create('в следующем году'), getRelativeDate(1), 'Date#create | Russian | Next year');

  equal(Date.create('2011-08-25').format('{dd} {month} {yyyy}'), '25 августа 2011', 'Date#create | Russian | format');

  equal(Date.create('1 second ago').relative(), '1 секунду назад', 'Date#create | Russian | relative format past');
  equal(Date.create('1 minute ago').relative(), '1 минуту назад',  'Date#create | Russian | relative format past');
  equal(Date.create('1 hour ago').relative(),   '1 час назад',     'Date#create | Russian | relative format past');
  equal(Date.create('1 day ago').relative(),    '1 день назад',    'Date#create | Russian | relative format past');
  equal(Date.create('1 week ago').relative(),   '1 неделю назад',  'Date#create | Russian | relative format past');
  equal(Date.create('1 month ago').relative(),  '1 месяц назад',   'Date#create | Russian | relative format past');
  equal(Date.create('1 year ago').relative(),   '1 год назад',     'Date#create | Russian | relative format past');

  equal(Date.create('7 seconds ago').relative(), '7 секунд назад', 'Date#create | Russian | relative format past');
  equal(Date.create('7 minutes ago').relative(), '7 минут назад', 'Date#create | Russian | relative format past');
  equal(Date.create('7 hours ago').relative(),   '7 часов назад', 'Date#create | Russian | relative format past');
  equal(Date.create('7 days ago').relative(),    '7 дней назад', 'Date#create | Russian | relative format past');
  equal(Date.create('7 weeks ago').relative(),   '7 недель назад', 'Date#create | Russian | relative format past');
  equal(Date.create('7 months ago').relative(),  '7 месяцев назад', 'Date#create | Russian | relative format past');
  equal(Date.create('7 years ago').relative(),   '7 лет назад', 'Date#create | Russian | relative format past');

  equal(Date.create('5 hours from now').relative(), 'через 5 часов', 'Date#create | Russian | relative format future');

//* 2 days after monday = 2 Tage nach Montag
//* 2 weeks from monday = 2 Wochen von Montag
//* last wednesday   = letzten Mittwoch (could be "letzter" with 'r' depending on context)
//* next friday    = kommender / naechster Freitag (could be kommenden/naechsten with n depending on context)
//* this week tuesday   = diese Woche Dienstag (ok when spoken, usually it is "Dienstag dieser Woche")
//* monday of this week  = diesen Montag / Montag dieser Woce
//* May 25th of this year  = 25. Mai diesen Jahres
//* the first day of the month  = der erste Tag des Monats
//* the last day of March  = der letzte Tag des Maerz ("im" Maerz is Ok too)
//* the 23rd of last month  = der 23te im letzten Monat
//* the beginning of this week  = der Anfang dieser Woche
//* the end of next month  = das Ende naechsten Monats




});
