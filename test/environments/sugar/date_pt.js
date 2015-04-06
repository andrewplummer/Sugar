package('Date | Portuguese', function () {

  var now = new Date();
  testSetLocale('pt');

  method('create', function() {
    dateEqual(testCreateDate('15 de maio 2011'), new Date(2011, 4, 15), 'basic Portuguese date');
    dateEqual(testCreateDate('5 de janeiro de 2012'), new Date(2012, 0, 5), '2012-01-05');
    dateEqual(testCreateDate('maio de 2011'), new Date(2011, 4), 'year and month');
    dateEqual(testCreateDate('15 de maio'), new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011'), new Date(2011, 0), 'year');
    dateEqual(testCreateDate('maio'), new Date(now.getFullYear(), 4), 'month');
    dateEqual(testCreateDate('segunda-feira'), getDateWithWeekdayAndOffset(1), 'Monday');

    dateEqual(testCreateDate('5 de janeiro de 2012 3:45'), new Date(2012, 0, 5, 3, 45), '2012-01-05 3:45');
    dateEqual(testCreateDate('5 de janeiro de 2012 3:45pm'), new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm');

    dateEqual(testCreateDate('um milisegundo atrás'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('um segundo atrás'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('um minuto atrás'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('uma hora atrás'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('um dia atrás'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('uma semana atrás'), getRelativeDate(null, null, -7), 'one week');
    dateEqual(testCreateDate('há um mês'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('há um ano'), getRelativeDate(-1), 'one year ago');

    dateEqual(testCreateDate('daqui a 5 milisegundos'), getRelativeDate(null, null, null, null, null, null,5), 'five milliseconds from now');
    dateEqual(testCreateDate('daqui a 5 segundos'), getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    dateEqual(testCreateDate('daqui a 5 minutos'), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    dateEqual(testCreateDate('daqui a 5 horas'), getRelativeDate(null, null, null, 5), 'five hours from now');
    dateEqual(testCreateDate('daqui a 5 dias'), getRelativeDate(null, null, 5), 'five day from now');
    dateEqual(testCreateDate('daqui a 5 semanas'), getRelativeDate(null, null, 35), 'five weeks from now');
    dateEqual(testCreateDate('daqui a 5 mêses'), getRelativeDate(null, 5), 'five months from now | mêses');
    dateEqual(testCreateDate('daqui a 5 anos'), getRelativeDate(5), 'five years from now');


    dateEqual(testCreateDate('anteontem'), run(getRelativeDate(null, null, -2), 'reset'), 'the day before yesterday');
    dateEqual(testCreateDate('ontem'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('hoje'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('amanhã'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');

    dateEqual(testCreateDate('semana passada'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('próxima semana'), getRelativeDate(null, null, 7), 'Next week');

    dateEqual(testCreateDate('mês passado'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('próximo mês'), getRelativeDate(null, 1), 'Next month');

    dateEqual(testCreateDate('ano passado'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('próximo ano'), getRelativeDate(1), 'Next year');

    dateEqual(testCreateDate('próximo segunda-feira'), getDateWithWeekdayAndOffset(1,  7), 'next monday');
    dateEqual(testCreateDate('passada segunda-feira'), getDateWithWeekdayAndOffset(1, -7), 'last monday');

    dateEqual(testCreateDate('passada segunda-feira 3:45'), run(getDateWithWeekdayAndOffset(1, -7), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday 3:45');

    // no accents
    dateEqual(testCreateDate('daqui a 5 meses'), getRelativeDate(null, 5), 'five months from now | meses');
    dateEqual(testCreateDate('mes passado'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('proximo ano'), getRelativeDate(1), 'Next year');
    dateEqual(testCreateDate('uma hora atras'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('ha um ano'), getRelativeDate(-1), 'one year ago');
    dateEqual(testCreateDate('amanha'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');

    dateEqual(testCreateDate('amanhã às 3:30'), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');


  });

  method('format', function() {
    var then = new Date(2011, 7, 25, 15, 45, 50);
    test(then, '25 de agosto de 2011 15:45', 'standard format');
    test(then, ['{dd} de {month} {yyyy}'], '25 de agosto 2011', 'format');

    // Format shortcuts
    equal(run(then, 'format', ['long']), '25 de agosto de 2011 15:45', 'long format');
    equal(run(then, 'long'), '25 de agosto de 2011 15:45', 'long shortcut');
    equal(run(then, 'format', ['full']), 'Quinta-feira, 25 de agosto de 2011 15:45:50', 'full format');
    equal(run(then, 'full'), 'Quinta-feira, 25 de agosto de 2011 15:45:50', 'full shortcut');
    equal(run(then, 'format', ['short']), '25 de agosto de 2011', 'short format');
    equal(run(then, 'short'), '25 de agosto de 2011', 'short shortcut');
  });

  method('relative', function() {
    test(testCreateDate('1 second ago', 'en'), '1 segundo atrás');
    test(testCreateDate('1 minute ago', 'en'), '1 minuto atrás');
    test(testCreateDate('1 hour ago', 'en'), '1 hora atrás');
    test(testCreateDate('1 day ago', 'en'), '1 dia atrás');
    test(testCreateDate('1 week ago', 'en'), '1 semana atrás');
    test(testCreateDate('1 month ago', 'en'), '1 mês atrás');
    test(testCreateDate('1 year ago', 'en'), '1 ano atrás');

    test(testCreateDate('2 seconds ago', 'en'), '2 segundos atrás');
    test(testCreateDate('2 minutes ago', 'en'), '2 minutos atrás');
    test(testCreateDate('2 hours ago', 'en'), '2 horas atrás');
    test(testCreateDate('2 days ago', 'en'), '2 dias atrás');
    test(testCreateDate('2 weeks ago', 'en'), '2 semanas atrás');
    test(testCreateDate('2 months ago', 'en'), '2 mêses atrás');
    test(testCreateDate('2 years ago', 'en'), '2 anos atrás');

    test(testCreateDate('1 second from now', 'en'), 'daqui a 1 segundo');
    test(testCreateDate('1 minute from now', 'en'), 'daqui a 1 minuto');
    test(testCreateDate('1 hour from now', 'en'), 'daqui a 1 hora');
    test(testCreateDate('1 day from now', 'en'), 'daqui a 1 dia');
    test(testCreateDate('1 week from now', 'en'), 'daqui a 1 semana');
    testMonthsFromNow(1, 'daqui a 1 mês', 'daqui a 4 semanas');
    test(testCreateDate('1 year from now', 'en'), 'daqui a 1 ano');

    test(testCreateDate('5 second from now', 'en'), 'daqui a 5 segundos');
    test(testCreateDate('5 minute from now', 'en'), 'daqui a 5 minutos');
    test(testCreateDate('5 hour from now', 'en'), 'daqui a 5 horas');
    test(testCreateDate('5 day from now', 'en'), 'daqui a 5 dias');
    test(testCreateDate('5 week from now', 'en'), 'daqui a 1 mês');
    testMonthsFromNow(5, 'daqui a 5 mêses', 'daqui a 4 mêses');
    test(testCreateDate('5 year from now', 'en'), 'daqui a 5 anos');
  });


});

package('Number | Portuguese Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['pt'], '5 horas', 'simple duration');
  });

});

