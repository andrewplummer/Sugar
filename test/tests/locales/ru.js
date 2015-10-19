package('Dates Russian', function () {
  "use strict";

  var now;

  setup(function() {
    now = new Date();
    testSetLocale('ru');
  });

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
    assertRelative('1 second ago', '1 секунду назад');
    assertRelative('1 minute ago', '1 минуту назад');
    assertRelative('1 hour ago',   '1 час назад');
    assertRelative('1 day ago',    '1 день назад');
    assertRelative('1 week ago',   '1 неделю назад');
    assertRelative('1 month ago',  '1 месяц назад');
    assertRelative('1 year ago',   '1 год назад');

    assertRelative('2 seconds ago', '2 секунды назад');
    assertRelative('2 minutes ago', '2 минуты назад');
    assertRelative('2 hours ago',   '2 часа назад');
    assertRelative('2 days ago',    '2 дня назад');
    assertRelative('2 weeks ago',   '2 недели назад');
    assertRelative('2 months ago',  '2 месяца назад');
    assertRelative('2 years ago',   '2 года назад');

    assertRelative('3 seconds ago', '3 секунды назад');
    assertRelative('3 minutes ago', '3 минуты назад');
    assertRelative('3 hours ago',   '3 часа назад');
    assertRelative('3 days ago',    '3 дня назад');
    assertRelative('3 weeks ago',   '3 недели назад');
    assertRelative('3 months ago',  '3 месяца назад');
    assertRelative('3 years ago',   '3 года назад');

    assertRelative('4 seconds ago', '4 секунды назад');
    assertRelative('4 minutes ago', '4 минуты назад');
    assertRelative('4 hours ago',   '4 часа назад');
    assertRelative('4 days ago',    '4 дня назад');
    assertRelative('4 months ago',  '4 месяца назад');
    assertRelative('4 years ago',   '4 года назад');

    assertRelative('5 seconds ago', '5 секунд назад');
    assertRelative('5 minutes ago', '5 минут назад');
    assertRelative('5 hours ago',   '5 часов назад');
    assertRelative('5 days ago',    '5 дней назад');
    assertRelative('5 weeks ago',   '1 месяц назад');
    assertRelative('5 months ago',  '5 месяцев назад');
    assertRelative('5 years ago',   '5 лет назад');

    assertRelative('7 seconds ago', '7 секунд назад');
    assertRelative('7 minutes ago', '7 минут назад');
    assertRelative('7 hours ago',   '7 часов назад');
    assertRelative('7 days ago',    '1 неделю назад');
    assertRelative('7 weeks ago',   '1 месяц назад');
    assertRelative('7 months ago',  '7 месяцев назад');
    assertRelative('7 years ago',   '7 лет назад');

    assertRelative('21 seconds ago', '21 секунду назад');
    assertRelative('21 minutes ago', '21 минуту назад');
    assertRelative('21 hours ago',   '21 час назад');
    assertRelative('21 days ago',    '3 недели назад');
    assertRelative('21 years ago',   '21 год назад');

    assertRelative('22 seconds ago', '22 секунды назад');
    assertRelative('22 minutes ago', '22 минуты назад');
    assertRelative('22 hours ago',   '22 часа назад');
    assertRelative('22 days ago',    '3 недели назад');
    assertRelative('22 years ago',   '22 года назад');

    assertRelative('25 seconds ago', '25 секунд назад');
    assertRelative('25 minutes ago', '25 минут назад');
    assertRelative('25 hours ago',   '1 день назад');
    assertRelative('25 days ago',    '3 недели назад');
    assertRelative('25 years ago',   '25 лет назад');

    assertRelative('1 second ago', '1 секунду назад');
    assertRelative('1 minute ago', '1 минуту назад');
    assertRelative('1 hour ago',   '1 час назад');
    assertRelative('1 day ago',    '1 день назад');
    assertRelative('1 week ago',   '1 неделю назад');
    assertRelative('1 month ago',  '1 месяц назад');
    assertRelative('1 year ago',   '1 год назад');


    assertRelative('1 second from now', 'через 1 секунду');
    assertRelative('1 minute from now', 'через 1 минуту');
    assertRelative('1 hour from now',   'через 1 час');
    assertRelative('1 day from now',    'через 1 день');
    assertRelative('1 week from now',   'через 1 неделю');
    assertRelative('1 year from now',   'через 1 год');

    assertRelative('2 seconds from now', 'через 2 секунды');
    assertRelative('2 minutes from now', 'через 2 минуты');
    assertRelative('2 hours from now',   'через 2 часа');
    assertRelative('2 days from now',    'через 2 дня');
    assertRelative('2 weeks from now',   'через 2 недели');
    assertRelative('2 years from now',   'через 2 года');

    assertRelative('5 seconds from now', 'через 5 секунд');
    assertRelative('5 minutes from now', 'через 5 минут');
    assertRelative('5 hours from now',   'через 5 часов');
    assertRelative('5 days from now',    'через 5 дней');
    assertRelative('5 weeks from now',   'через 1 месяц');
    assertRelative('5 years from now',   'через 5 лет');

    assertRelative('11 hours ago', '11 часов назад');
    assertRelative('12 hours ago', '12 часов назад');
    assertRelative('13 hours ago', '13 часов назад');
    assertRelative('14 hours ago', '14 часов назад');
    assertRelative('15 hours ago', '15 часов назад');
    assertRelative('16 hours ago', '16 часов назад');
    assertRelative('17 hours ago', '17 часов назад');
    assertRelative('18 hours ago', '18 часов назад');
    assertRelative('19 hours ago', '19 часов назад');
    assertRelative('20 hours ago', '20 часов назад');

    assertRelative('21 hours ago', '21 час назад');
    assertRelative('22 hours ago', '22 часа назад');

    assertRelative('11 hours from now', 'через 11 часов');
    assertRelative('12 hours from now', 'через 12 часов');
    assertRelative('13 hours from now', 'через 13 часов');
    assertRelative('14 hours from now', 'через 14 часов');
    assertRelative('15 hours from now', 'через 15 часов');
    assertRelative('16 hours from now', 'через 16 часов');
    assertRelative('17 hours from now', 'через 17 часов');
    assertRelative('18 hours from now', 'через 18 часов');
    assertRelative('19 hours from now', 'через 19 часов');
    assertRelative('20 hours from now', 'через 20 часов');

    assertRelative('21 hours from now', 'через 21 час');
    assertRelative('22 hours from now', 'через 22 часа');
  });

});

package('Number | Russian Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['ru'], '5 часов', 'simple duration');
  });

});
