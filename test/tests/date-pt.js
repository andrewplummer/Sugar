package('Dates Portuguese', function () {
  "use strict";

  var now;

  setup(function() {
    now = new Date();
    testSetLocale('pt');
  });

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
    assertRelative('1 second ago', '1 segundo atrás');
    assertRelative('1 minute ago', '1 minuto atrás');
    assertRelative('1 hour ago', '1 hora atrás');
    assertRelative('1 day ago', '1 dia atrás');
    assertRelative('1 week ago', '1 semana atrás');
    assertRelative('1 month ago', '1 mês atrás');
    assertRelative('1 year ago', '1 ano atrás');

    assertRelative('2 seconds ago', '2 segundos atrás');
    assertRelative('2 minutes ago', '2 minutos atrás');
    assertRelative('2 hours ago', '2 horas atrás');
    assertRelative('2 days ago', '2 dias atrás');
    assertRelative('2 weeks ago', '2 semanas atrás');
    assertRelative('2 months ago', '2 mêses atrás');
    assertRelative('2 years ago', '2 anos atrás');

    assertRelative('1 second from now', 'daqui a 1 segundo');
    assertRelative('1 minute from now', 'daqui a 1 minuto');
    assertRelative('1 hour from now', 'daqui a 1 hora');
    assertRelative('1 day from now', 'daqui a 1 dia');
    assertRelative('1 week from now', 'daqui a 1 semana');
    assertRelative('1 year from now', 'daqui a 1 ano');

    assertRelative('5 second from now', 'daqui a 5 segundos');
    assertRelative('5 minute from now', 'daqui a 5 minutos');
    assertRelative('5 hour from now', 'daqui a 5 horas');
    assertRelative('5 day from now', 'daqui a 5 dias');
    assertRelative('5 week from now', 'daqui a 1 mês');
    assertRelative('5 year from now', 'daqui a 5 anos');
  });


});

package('Number | Portuguese Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['pt'], '5 horas', 'simple duration');
  });

});

