namespace('Dates Spanish', function () {
  "use strict";

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('es');
  });

  method('create', function() {
    equal(testCreateDate('la semana pasada'), getRelativeDate(null, null, -7), 'Last week');

    equal(testCreateDate('15 de mayo 2011'), new Date(2011, 4, 15), 'Date#create | basic Spanish date');
    equal(testCreateDate('5 de enero de 2012'), new Date(2012, 0, 5), '2012-01-05');
    equal(testCreateDate('mayo de 2011'), new Date(2011, 4), 'year and month');
    equal(testCreateDate('15 de mayo'), new Date(now.getFullYear(), 4, 15), 'month and date');
    equal(testCreateDate('2011'), new Date(2011, 0), 'year');
    equal(testCreateDate('mayo'), new Date(now.getFullYear(), 4), 'month');
    equal(testCreateDate('lunes'), getDateWithWeekdayAndOffset(1), 'Monday');

    equal(testCreateDate('5 de enero de 2012 3:45'), new Date(2012, 0, 5, 3, 45), '2012-01-05 3:45');
    equal(testCreateDate('5 de enero de 2012 3:45pm'), new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm');

    equal(testCreateDate('hace 1 milisegundo'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    equal(testCreateDate('hace 1 segundo'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    equal(testCreateDate('hace 1 minuto'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    equal(testCreateDate('hace 1 hora'), getRelativeDate(null, null, null, -1), 'one hour ago');
    equal(testCreateDate('hace 1 día'), getRelativeDate(null, null, -1), 'one day ago');
    equal(testCreateDate('hace 1 semana'), getRelativeDate(null, null, -7), 'one week');
    equal(testCreateDate('hace 1 mes'), getRelativeDate(null, -1), 'one month ago');
    equal(testCreateDate('hace 1 año'), getRelativeDate(-1), 'one year ago');


    equal(testCreateDate('dentro de 5 milisegundos'), getRelativeDate(null, null, null, null, null, null,5), 'five milliseconds from now');
    equal(testCreateDate('dentro de 5 segundos'), getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    equal(testCreateDate('dentro de 5 minutos'), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    equal(testCreateDate('dentro de 5 horas'), getRelativeDate(null, null, null, 5), 'five hour from now');
    equal(testCreateDate('dentro de 5 días'), getRelativeDate(null, null, 5), 'five day from now');
    equal(testCreateDate('dentro de 5 semanas'), getRelativeDate(null, null, 35), 'five weeks from now');
    equal(testCreateDate('dentro de 5 meses'), getRelativeDate(null, 5), 'five months from now');
    equal(testCreateDate('dentro de 5 años'), getRelativeDate(5), 'five years from now');


    equal(testCreateDate('anteayer'), run(getRelativeDate(null, null, -2), 'reset'), '一昨日');
    equal(testCreateDate('ayer'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    equal(testCreateDate('hoy'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    equal(testCreateDate('mañana'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');

    equal(testCreateDate('la semana pasada'), getRelativeDate(null, null, -7), 'Last week');
    equal(testCreateDate('la próxima semana'), getRelativeDate(null, null, 7), 'Next week');

    equal(testCreateDate('el mes pasado'), getRelativeDate(null, -1), 'last month');
    equal(testCreateDate('el próximo mes'), getRelativeDate(null, 1), 'Next month');

    equal(testCreateDate('proximo lunes'), testCreateDate('next monday', 'en'), 'next monday no accent');
    equal(testCreateDate('próximo lunes'), testCreateDate('next monday', 'en'), 'next monday accent');
    equal(testCreateDate('pasado lunes'), testCreateDate('last monday', 'en'), 'last monday front');
    equal(testCreateDate('lunes pasado'), testCreateDate('last monday', 'en'), 'last monday back');

    equal(testCreateDate('lunes pasado 3:45'), run(testCreateDate('last monday', 'en'), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday back 3:45');
    equal(testCreateDate('proximo lunes 3:45'), run(testCreateDate('next monday', 'en'), 'set', [{ hour: 3, minute: 45 }, true]), 'next monday no accent 3:45');

    equal(testCreateDate('el año pasado'), getRelativeDate(-1), 'Last year');
    equal(testCreateDate('el próximo año'), getRelativeDate(1), 'Next year');

    // no accents
    equal(testCreateDate('hace 1 dia'), getRelativeDate(null, null, -1), 'one day ago');
    equal(testCreateDate('proximo mes'), getRelativeDate(null, 1), 'Next month');
    equal(testCreateDate('proxima semana'), getRelativeDate(null, null, 7), 'Next week');
    equal(testCreateDate('manana'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    equal(testCreateDate('hace 1 ano'), getRelativeDate(-1), 'one year ago');

    equal(testCreateDate('mañana a las 3:30'), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');


    // Numbers

    equal(testCreateDate('hace cero años'),   getRelativeDate(0),   'zero years ago');
    equal(testCreateDate('hace uno año'),     getRelativeDate(-1),  'one year ago');
    equal(testCreateDate('hace dos años'),    getRelativeDate(-2),  'two years ago');
    equal(testCreateDate('hace tres años'),   getRelativeDate(-3),  'three years ago');
    equal(testCreateDate('hace cuatro años'), getRelativeDate(-4),  'four years ago');
    equal(testCreateDate('hace cinco años'),  getRelativeDate(-5),  'five years ago');
    equal(testCreateDate('hace seis años'),   getRelativeDate(-6),  'six years ago');
    equal(testCreateDate('hace siete años'),  getRelativeDate(-7),  'seven years ago');
    equal(testCreateDate('hace ocho años'),   getRelativeDate(-8),  'eight years ago');
    equal(testCreateDate('hace nueve años'),  getRelativeDate(-9),  'nine years ago');
    equal(testCreateDate('hace diez años'),   getRelativeDate(-10), 'ten years ago');

  });

  method('format', function() {

    test(then, '5 de enero de 2010 15:52', 'default format');

    assertFormatShortcut(then, 'short', '05/01/2010');
    assertFormatShortcut(then, 'medium', '5 de enero de 2010');
    assertFormatShortcut(then, 'long', '5 de enero de 2010 15:52');
    assertFormatShortcut(then, 'full', 'martes, 5 de enero de 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'mar 5 ene 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'mar 5 ene 2010 15:52', '%c stamp');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'dom', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'lun', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'mar', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'mié', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'jue', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'vie', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'sáb', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], 'ene', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'feb', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'mar', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'abr', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'may', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'jun', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'jul', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'ago', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'sep', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'oct', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'nov', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'dic', 'Dec');

  });

  method('relative', function() {
    assertRelative('1 second ago', 'hace 1 segundo');
    assertRelative('1 minute ago', 'hace 1 minuto');
    assertRelative('1 hour ago',   'hace 1 hora');
    assertRelative('1 day ago',    'hace 1 día');
    assertRelative('1 week ago',   'hace 1 semana');
    assertRelative('1 month ago',  'hace 1 mes');
    assertRelative('1 year ago',   'hace 1 año');

    assertRelative('2 seconds ago', 'hace 2 segundos');
    assertRelative('2 minutes ago', 'hace 2 minutos');
    assertRelative('2 hours ago',   'hace 2 horas');
    assertRelative('2 days ago',    'hace 2 días');
    assertRelative('2 weeks ago',   'hace 2 semanas');
    assertRelative('2 months ago',  'hace 2 meses');
    assertRelative('2 years ago',   'hace 2 años');

    assertRelative('1 second from now', 'dentro de 1 segundo');
    assertRelative('1 minute from now', 'dentro de 1 minuto');
    assertRelative('1 hour from now',   'dentro de 1 hora');
    assertRelative('1 day from now',    'dentro de 1 día');
    assertRelative('1 week from now',   'dentro de 1 semana');
    assertRelative('1 year from now',   'dentro de 1 año');

    assertRelative('5 second from now', 'dentro de 5 segundos');
    assertRelative('5 minute from now', 'dentro de 5 minutos');
    assertRelative('5 hour from now',   'dentro de 5 horas');
    assertRelative('5 day from now',    'dentro de 5 días');
    assertRelative('5 week from now',   'dentro de 1 mes');
    assertRelative('5 year from now',   'dentro de 5 años');
  });

  method('beginning/end', function() {
    equal(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Spanish Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['es'], '5 horas', 'Date#create | Spanish | simple duration');
  });

});

