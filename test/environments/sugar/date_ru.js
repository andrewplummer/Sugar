package('Date | Russian', function () {

  var now = new Date();
  testSetLocale('ru');

  method('create', function() {
    dateEqual(testCreateDate('15 мая 2011'), new Date(2011, 4, 15), 'basic Russian date');
    dateEqual(testCreateDate('2 мая 1989 года'), new Date(1989, 4, 2), 'format with year');
    dateEqual(testCreateDate('5 января 2012'), new Date(2012, 0, 5), '2012-01-05');
    dateEqual(testCreateDate('Май 2011'), new Date(2011, 4), 'year and month');
    dateEqual(testCreateDate('15 мая'), new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011'), new Date(2011, 0), 'year');
    dateEqual(testCreateDate('Май'), new Date(now.getFullYear(), 4), 'month');
    dateEqual(testCreateDate('понедельник'), getDateWithWeekdayAndOffset(1), 'Monday');

    dateEqual(testCreateDate('15 мая 2011 3:45'), new Date(2011, 4, 15, 3, 45), 'basic Russian date 3:45');
    dateEqual(testCreateDate('15 мая 2011 3:45 вечера'), new Date(2011, 4, 15, 15, 45), 'basic Russian date 3:45pm');

    dateEqual(testCreateDate('одну миллисекунду назад'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('одну секунду назад'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('одну минуту назад'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('один час назад'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('один день назад'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('одну неделю назад'), getRelativeDate(null, null, -7), 'one week ago');
    dateEqual(testCreateDate('один месяц назад'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('один год назад'), getRelativeDate(-1), 'one year ago');

    dateEqual(testCreateDate('две миллисекунды назад'), getRelativeDate(null, null, null, null, null, null,-2), 'two milliseconds ago');
    dateEqual(testCreateDate('две секунды назад'), getRelativeDate(null, null, null, null, null, -2), 'two seconds ago');
    dateEqual(testCreateDate('две минуты назад'), getRelativeDate(null, null, null, null, -2), 'two minutes ago');
    dateEqual(testCreateDate('два часа назад'), getRelativeDate(null, null, null, -2), 'two hours ago');
    dateEqual(testCreateDate('Два дня назад'), getRelativeDate(null, null, -2), 'two days ago');
    dateEqual(testCreateDate('две недели назад'), getRelativeDate(null, null, -14), 'two weeks ago');
    dateEqual(testCreateDate('два месяца назад'), getRelativeDate(null, -2), 'two months ago');
    dateEqual(testCreateDate('два года назад'), getRelativeDate(-2), 'two years ago');

    dateEqual(testCreateDate('восемь миллисекунд назад'), getRelativeDate(null, null, null, null, null, null,-8), 'eight milliseconds ago');
    dateEqual(testCreateDate('восемь секунд назад'), getRelativeDate(null, null, null, null, null, -8), 'eight seconds ago');
    dateEqual(testCreateDate('восемь минут назад'), getRelativeDate(null, null, null, null, -8), 'eight minutes ago');
    dateEqual(testCreateDate('восемь часов назад'), getRelativeDate(null, null, null, -8), 'eight hours ago');
    dateEqual(testCreateDate('восемь дней назад'), getRelativeDate(null, null, -8), 'eight days ago');
    dateEqual(testCreateDate('восемь недель назад'), getRelativeDate(null, null, -56), 'eight weeks ago');
    dateEqual(testCreateDate('восемь месяцев назад'), getRelativeDate(null, -8), 'eight months ago');
    dateEqual(testCreateDate('восемь лет назад'), getRelativeDate(-8), 'eight years ago');

    dateEqual(testCreateDate('через 5 миллисекунд'), getRelativeDate(null, null, null, null, null, null,5), 'five milliseconds from now');
    dateEqual(testCreateDate('через 5 секунд'), getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    dateEqual(testCreateDate('через 5 минут'), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    dateEqual(testCreateDate('через 5 часов'), getRelativeDate(null, null, null, 5), 'five hour from now');
    dateEqual(testCreateDate('через 5 дней'), getRelativeDate(null, null, 5), 'five days from now');
    dateEqual(testCreateDate('через 5 недель'), getRelativeDate(null, null, 35), 'five weeks from now');
    dateEqual(testCreateDate('через 5 месяцев'), getRelativeDate(null, 5), 'five months from now');
    dateEqual(testCreateDate('через 5 лет'), getRelativeDate(5), 'five years from now');

    dateEqual(testCreateDate('позавчера'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('Вчера'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('Сегодня'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('Завтра'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('послезавтра'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');

    dateEqual(testCreateDate('на прошлой неделе'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('на следующей неделе'), getRelativeDate(null, null, 7), 'Next week');

    dateEqual(testCreateDate('в прошлом месяце'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('в следующем месяце'), getRelativeDate(null, 1), 'Next month');

    dateEqual(testCreateDate('в прошлом году'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('в следующем году'), getRelativeDate(1), 'Next year');


    dateEqual(testCreateDate('следующий понедельник'), getDateWithWeekdayAndOffset(1,  7), 'next monday');
    dateEqual(testCreateDate('в прошлый вторник'), getDateWithWeekdayAndOffset(2, -7), 'last tuesday');

    dateEqual(testCreateDate('следующий понедельник 3:45 вечера'), run(getDateWithWeekdayAndOffset(1,7), 'set', [{ hour: 15, minute: 45 }, true]), 'next monday');

    dateEqual(testCreateDate('Завтра в 3:30 утра'), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');

  });

  method('format', function() {
    var then = new Date(2011, 7, 25, 15, 45, 50);
    test(then, '25 августа 2011 года 15:45', 'standard format');
    test(then, '25 августа 2011 года 15:45', 'standard format');
    test(then, ['{dd} {month} {yyyy}'], '25 августа 2011', 'format');
    test(then, ['{dd} {month2} {yyyy}'], '25 август 2011', 'format allows alternates');

    // Format shortcuts

    equal(run(then, 'format', ['full']), 'Четверг 25 августа 2011 года 15:45:50', 'full format');
    equal(run(then, 'full'), 'Четверг 25 августа 2011 года 15:45:50', 'full format');
    equal(run(then, 'format', ['long']), '25 августа 2011 года 15:45', 'long format');
    equal(run(then, 'long'), '25 августа 2011 года 15:45', 'long shortcut');
    equal(run(then, 'format', ['short']), '25 августа 2011 года', 'short format');
    equal(run(then, 'short'), '25 августа 2011 года', 'short shortcut');
  });


  method('relative', function() {
    test(testCreateDate('1 second ago', 'en'), '1 секунду назад');
    test(testCreateDate('1 minute ago', 'en'), '1 минуту назад');
    test(testCreateDate('1 hour ago', 'en'),   '1 час назад');
    test(testCreateDate('1 day ago', 'en'),    '1 день назад');
    test(testCreateDate('1 week ago', 'en'),   '1 неделю назад');
    test(testCreateDate('1 month ago', 'en'),  '1 месяц назад');
    test(testCreateDate('1 year ago', 'en'),   '1 год назад');

    test(testCreateDate('2 seconds ago', 'en'), '2 секунды назад');
    test(testCreateDate('2 minutes ago', 'en'), '2 минуты назад');
    test(testCreateDate('2 hours ago', 'en'),   '2 часа назад');
    test(testCreateDate('2 days ago', 'en'),    '2 дня назад');
    test(testCreateDate('2 weeks ago', 'en'),   '2 недели назад');
    test(testCreateDate('2 months ago', 'en'),  '2 месяца назад');
    test(testCreateDate('2 years ago', 'en'),   '2 года назад');

    test(testCreateDate('3 seconds ago', 'en'), '3 секунды назад');
    test(testCreateDate('3 minutes ago', 'en'), '3 минуты назад');
    test(testCreateDate('3 hours ago', 'en'),   '3 часа назад');
    test(testCreateDate('3 days ago', 'en'),    '3 дня назад');
    test(testCreateDate('3 weeks ago', 'en'),   '3 недели назад');
    test(testCreateDate('3 months ago', 'en'),  '3 месяца назад');
    test(testCreateDate('3 years ago', 'en'),   '3 года назад');

    test(testCreateDate('4 seconds ago', 'en'), '4 секунды назад');
    test(testCreateDate('4 minutes ago', 'en'), '4 минуты назад');
    test(testCreateDate('4 hours ago', 'en'),   '4 часа назад');
    test(testCreateDate('4 days ago', 'en'),    '4 дня назад');
    test(testCreateDate('4 months ago', 'en'),  '4 месяца назад');
    test(testCreateDate('4 years ago', 'en'),   '4 года назад');

    test(testCreateDate('5 seconds ago', 'en'), '5 секунд назад');
    test(testCreateDate('5 minutes ago', 'en'), '5 минут назад');
    test(testCreateDate('5 hours ago', 'en'),   '5 часов назад');
    test(testCreateDate('5 days ago', 'en'),    '5 дней назад');
    test(testCreateDate('5 weeks ago', 'en'),   '1 месяц назад');
    test(testCreateDate('5 months ago', 'en'),  '5 месяцев назад');
    test(testCreateDate('5 years ago', 'en'),   '5 лет назад');

    test(testCreateDate('7 seconds ago', 'en'), '7 секунд назад');
    test(testCreateDate('7 minutes ago', 'en'), '7 минут назад');
    test(testCreateDate('7 hours ago', 'en'),   '7 часов назад');
    test(testCreateDate('7 days ago', 'en'),    '1 неделю назад');
    test(testCreateDate('7 weeks ago', 'en'),   '1 месяц назад');
    test(testCreateDate('7 months ago', 'en'),  '7 месяцев назад');
    test(testCreateDate('7 years ago', 'en'),   '7 лет назад');

    test(testCreateDate('21 seconds ago', 'en'), '21 секунду назад');
    test(testCreateDate('21 minutes ago', 'en'), '21 минуту назад');
    test(testCreateDate('21 hours ago', 'en'),   '21 час назад');
    test(testCreateDate('21 days ago', 'en'),    '3 недели назад');
    test(testCreateDate('21 years ago', 'en'),   '21 год назад');

    test(testCreateDate('22 seconds ago', 'en'), '22 секунды назад');
    test(testCreateDate('22 minutes ago', 'en'), '22 минуты назад');
    test(testCreateDate('22 hours ago', 'en'),   '22 часа назад');
    test(testCreateDate('22 days ago', 'en'),    '3 недели назад');
    test(testCreateDate('22 years ago', 'en'),   '22 года назад');

    test(testCreateDate('25 seconds ago', 'en'), '25 секунд назад');
    test(testCreateDate('25 minutes ago', 'en'), '25 минут назад');
    test(testCreateDate('25 hours ago', 'en'),   '1 день назад');
    test(testCreateDate('25 days ago', 'en'),    '3 недели назад');
    test(testCreateDate('25 years ago', 'en'),   '25 лет назад');

    test(testCreateDate('1 second ago', 'en'), '1 секунду назад');
    test(testCreateDate('1 minute ago', 'en'), '1 минуту назад');
    test(testCreateDate('1 hour ago', 'en'),   '1 час назад');
    test(testCreateDate('1 day ago', 'en'),    '1 день назад');
    test(testCreateDate('1 week ago', 'en'),   '1 неделю назад');
    test(testCreateDate('1 month ago', 'en'),  '1 месяц назад');
    test(testCreateDate('1 year ago', 'en'),   '1 год назад');


    test(testCreateDate('1 second from now', 'en'), 'через 1 секунду');
    test(testCreateDate('1 minute from now', 'en'), 'через 1 минуту');
    test(testCreateDate('1 hour from now', 'en'),   'через 1 час');
    test(testCreateDate('1 day from now', 'en'),    'через 1 день');
    test(testCreateDate('1 week from now', 'en'),   'через 1 неделю');
    testMonthsFromNow(1, 'через 1 месяц',           'через 4 недели');
    test(testCreateDate('1 year from now', 'en'),   'через 1 год');

    test(testCreateDate('2 seconds from now', 'en'), 'через 2 секунды');
    test(testCreateDate('2 minutes from now', 'en'), 'через 2 минуты');
    test(testCreateDate('2 hours from now', 'en'),   'через 2 часа');
    test(testCreateDate('2 days from now', 'en'),    'через 2 дня');
    test(testCreateDate('2 weeks from now', 'en'),   'через 2 недели');
    testMonthsFromNow(2, 'через 2 месяца',           'через 1 месяц');
    test(testCreateDate('2 years from now', 'en'),   'через 2 года');

    test(testCreateDate('5 seconds from now', 'en'), 'через 5 секунд');
    test(testCreateDate('5 minutes from now', 'en'), 'через 5 минут');
    test(testCreateDate('5 hours from now', 'en'),   'через 5 часов');
    test(testCreateDate('5 days from now', 'en'),    'через 5 дней');
    test(testCreateDate('5 weeks from now', 'en'),   'через 1 месяц');
    testMonthsFromNow(5, 'через 5 месяцев',          'через 4 месяца');
    test(testCreateDate('5 years from now', 'en'),   'через 5 лет');

    test(testCreateDate('11 hours ago', 'en'), '11 часов назад');
    test(testCreateDate('12 hours ago', 'en'), '12 часов назад');
    test(testCreateDate('13 hours ago', 'en'), '13 часов назад');
    test(testCreateDate('14 hours ago', 'en'), '14 часов назад');
    test(testCreateDate('15 hours ago', 'en'), '15 часов назад');
    test(testCreateDate('16 hours ago', 'en'), '16 часов назад');
    test(testCreateDate('17 hours ago', 'en'), '17 часов назад');
    test(testCreateDate('18 hours ago', 'en'), '18 часов назад');
    test(testCreateDate('19 hours ago', 'en'), '19 часов назад');
    test(testCreateDate('20 hours ago', 'en'), '20 часов назад');

    test(testCreateDate('21 hours ago', 'en'), '21 час назад');
    test(testCreateDate('22 hours ago', 'en'), '22 часа назад');

    test(testCreateDate('11 hours from now', 'en'), 'через 11 часов');
    test(testCreateDate('12 hours from now', 'en'), 'через 12 часов');
    test(testCreateDate('13 hours from now', 'en'), 'через 13 часов');
    test(testCreateDate('14 hours from now', 'en'), 'через 14 часов');
    test(testCreateDate('15 hours from now', 'en'), 'через 15 часов');
    test(testCreateDate('16 hours from now', 'en'), 'через 16 часов');
    test(testCreateDate('17 hours from now', 'en'), 'через 17 часов');
    test(testCreateDate('18 hours from now', 'en'), 'через 18 часов');
    test(testCreateDate('19 hours from now', 'en'), 'через 19 часов');
    test(testCreateDate('20 hours from now', 'en'), 'через 20 часов');

    test(testCreateDate('21 hours from now', 'en'), 'через 21 час');
    test(testCreateDate('22 hours from now', 'en'), 'через 22 часа');
  });

});

package('Number | Russian Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['ru'], '5 часов', 'simple duration');
  });

});
