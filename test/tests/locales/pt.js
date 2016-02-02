namespace('Date | Portuguese', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('pt');
  });

  method('create', function() {

    equal(testCreateDate('15 de maio 2011'), new Date(2011, 4, 15), 'basic Portuguese date');
    equal(testCreateDate('5 de janeiro de 2012'), new Date(2012, 0, 5), '2012-01-05');
    equal(testCreateDate('maio de 2011'), new Date(2011, 4), 'year and month');
    equal(testCreateDate('15 de maio'), new Date(now.getFullYear(), 4, 15), 'month and date');
    equal(testCreateDate('2011'), new Date(2011, 0), 'year');
    equal(testCreateDate('02 de fev de 2016'), new Date(2016, 1, 2), 'toLocaleDateString');

    equal(testCreateDate('maio'), new Date(now.getFullYear(), 4), 'month');
    equal(testCreateDate('segunda-feira'), getDateWithWeekdayAndOffset(1), 'Monday');

    equal(testCreateDate('5 de janeiro de 2012 3:45'), new Date(2012, 0, 5, 3, 45), '2012-01-05 3:45');
    equal(testCreateDate('5 de janeiro de 2012 3:45pm'), new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm');

    equal(testCreateDate('um milisegundo atrás'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    equal(testCreateDate('um segundo atrás'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    equal(testCreateDate('um minuto atrás'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    equal(testCreateDate('uma hora atrás'), getRelativeDate(null, null, null, -1), 'one hour ago');
    equal(testCreateDate('um dia atrás'), getRelativeDate(null, null, -1), 'one day ago');
    equal(testCreateDate('uma semana atrás'), getRelativeDate(null, null, -7), 'one week');
    equal(testCreateDate('há um mês'), getRelativeDate(null, -1), 'one month ago');
    equal(testCreateDate('há um ano'), getRelativeDate(-1), 'one year ago');

    equal(testCreateDate('daqui a 5 milisegundos'), getRelativeDate(null, null, null, null, null, null,5), 'five milliseconds from now');
    equal(testCreateDate('daqui a 5 segundos'), getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    equal(testCreateDate('daqui a 5 minutos'), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    equal(testCreateDate('daqui a 5 horas'), getRelativeDate(null, null, null, 5), 'five hours from now');
    equal(testCreateDate('daqui a 5 dias'), getRelativeDate(null, null, 5), 'five day from now');
    equal(testCreateDate('daqui a 5 semanas'), getRelativeDate(null, null, 35), 'five weeks from now');
    equal(testCreateDate('daqui a 5 mêses'), getRelativeDate(null, 5), 'five months from now | mêses');
    equal(testCreateDate('daqui a 5 anos'), getRelativeDate(5), 'five years from now');


    equal(testCreateDate('anteontem'), run(getRelativeDate(null, null, -2), 'reset'), 'the day before yesterday');
    equal(testCreateDate('ontem'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    equal(testCreateDate('hoje'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    equal(testCreateDate('amanhã'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');

    equal(testCreateDate('semana passada'), getRelativeDate(null, null, -7), 'Last week');
    equal(testCreateDate('próxima semana'), getRelativeDate(null, null, 7), 'Next week');

    equal(testCreateDate('mês passado'), getRelativeDate(null, -1), 'last month');
    equal(testCreateDate('próximo mês'), getRelativeDate(null, 1), 'Next month');

    equal(testCreateDate('ano passado'), getRelativeDate(-1), 'Last year');
    equal(testCreateDate('próximo ano'), getRelativeDate(1), 'Next year');

    equal(testCreateDate('próximo segunda-feira'), getDateWithWeekdayAndOffset(1,  7), 'next monday');
    equal(testCreateDate('passada segunda-feira'), getDateWithWeekdayAndOffset(1, -7), 'last monday');

    equal(testCreateDate('passada segunda-feira 3:45'), run(getDateWithWeekdayAndOffset(1, -7), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday 3:45');

    // no accents
    equal(testCreateDate('daqui a 5 meses'), getRelativeDate(null, 5), 'five months from now | meses');
    equal(testCreateDate('mes passado'), getRelativeDate(null, -1), 'last month');
    equal(testCreateDate('proximo ano'), getRelativeDate(1), 'Next year');
    equal(testCreateDate('uma hora atras'), getRelativeDate(null, null, null, -1), 'one hour ago');
    equal(testCreateDate('ha um ano'), getRelativeDate(-1), 'one year ago');
    equal(testCreateDate('amanha'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');

    equal(testCreateDate('amanhã às 3:30'), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');


    // Numbers

    equal(testCreateDate('zero anos atrás'),   getRelativeDate(0),   'zero years ago');
    equal(testCreateDate('um ano atrás'),      getRelativeDate(-1),  'one year ago');
    equal(testCreateDate('dois anos atrás'),   getRelativeDate(-2),  'two years ago');
    equal(testCreateDate('três anos atrás'),   getRelativeDate(-3),  'three years ago');
    equal(testCreateDate('quatro anos atrás'), getRelativeDate(-4),  'four years ago');
    equal(testCreateDate('cinco anos atrás'),  getRelativeDate(-5),  'five years ago');
    equal(testCreateDate('seis anos atrás'),   getRelativeDate(-6),  'six years ago');
    equal(testCreateDate('sete anos atrás'),   getRelativeDate(-7),  'seven years ago');
    equal(testCreateDate('oito anos atrás'),   getRelativeDate(-8),  'eight years ago');
    equal(testCreateDate('nove anos atrás'),   getRelativeDate(-9),  'nine years ago');
    equal(testCreateDate('dez anos atrás'),    getRelativeDate(-10), 'ten years ago');

  });

  method('format', function() {

    test(then, '5 de janeiro de 2010 15:52', 'default format');

    assertFormatShortcut(then, 'short', '05/01/2010');
    assertFormatShortcut(then, 'medium', '5 de janeiro de 2010');
    assertFormatShortcut(then, 'long', '5 de janeiro de 2010 15:52');
    assertFormatShortcut(then, 'full', 'terça-feira, 5 de janeiro de 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'ter 5 jan 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'ter 5 jan 2010 15:52', '%c stamp');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'dom', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'seg', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'ter', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'qua', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'qui', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'sex', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'sáb', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], 'jan', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'fev', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'mar', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'abr', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'mai', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'jun', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'jul', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'ago', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'set', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'out', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'nov', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'dez', 'Dec');

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

  method('beginning/end', function() {
    equal(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Portuguese', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['pt'], '5 horas', 'simple duration');
  });

});

