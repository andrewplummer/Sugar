package('Date | Spanish', function () {

  var now = new Date();
  testSetLocale('es');

  method('create', function() {
    dateEqual(testCreateDate('la semana pasada'), getRelativeDate(null, null, -7), 'Last week');

    dateEqual(testCreateDate('15 de mayo 2011'), new Date(2011, 4, 15), 'Date#create | basic Spanish date');
    dateEqual(testCreateDate('5 de enero de 2012'), new Date(2012, 0, 5), '2012-01-05');
    dateEqual(testCreateDate('mayo de 2011'), new Date(2011, 4), 'year and month');
    dateEqual(testCreateDate('15 de mayo'), new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011'), new Date(2011, 0), 'year');
    dateEqual(testCreateDate('mayo'), new Date(now.getFullYear(), 4), 'month');
    dateEqual(testCreateDate('lunes'), getDateWithWeekdayAndOffset(1), 'Monday');

    dateEqual(testCreateDate('5 de enero de 2012 3:45'), new Date(2012, 0, 5, 3, 45), '2012-01-05 3:45');
    dateEqual(testCreateDate('5 de enero de 2012 3:45pm'), new Date(2012, 0, 5, 15, 45), '2012-01-05 3:45pm');

    dateEqual(testCreateDate('hace 1 milisegundo'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('hace 1 segundo'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('hace 1 minuto'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('hace 1 hora'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('hace 1 día'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('hace 1 semana'), getRelativeDate(null, null, -7), 'one week');
    dateEqual(testCreateDate('hace 1 mes'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('hace 1 año'), getRelativeDate(-1), 'one year ago');


    dateEqual(testCreateDate('dentro de 5 milisegundos'), getRelativeDate(null, null, null, null, null, null,5), 'five milliseconds from now');
    dateEqual(testCreateDate('dentro de 5 segundos'), getRelativeDate(null, null, null, null, null, 5), 'five second from now');
    dateEqual(testCreateDate('dentro de 5 minutos'), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    dateEqual(testCreateDate('dentro de 5 horas'), getRelativeDate(null, null, null, 5), 'five hour from now');
    dateEqual(testCreateDate('dentro de 5 días'), getRelativeDate(null, null, 5), 'five day from now');
    dateEqual(testCreateDate('dentro de 5 semanas'), getRelativeDate(null, null, 35), 'five weeks from now');
    dateEqual(testCreateDate('dentro de 5 meses'), getRelativeDate(null, 5), 'five months from now');
    dateEqual(testCreateDate('dentro de 5 años'), getRelativeDate(5), 'five years from now');


    dateEqual(testCreateDate('anteayer'), run(getRelativeDate(null, null, -2), 'reset'), '一昨日');
    dateEqual(testCreateDate('ayer'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('hoy'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('mañana'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');

    dateEqual(testCreateDate('la semana pasada'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('la próxima semana'), getRelativeDate(null, null, 7), 'Next week');

    dateEqual(testCreateDate('el mes pasado'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('el próximo mes'), getRelativeDate(null, 1), 'Next month');

    dateEqual(testCreateDate('proximo lunes'), testCreateDate('next monday', 'en'), 'next monday no accent');
    dateEqual(testCreateDate('próximo lunes'), testCreateDate('next monday', 'en'), 'next monday accent');
    dateEqual(testCreateDate('pasado lunes'), testCreateDate('last monday', 'en'), 'last monday front');
    dateEqual(testCreateDate('lunes pasado'), testCreateDate('last monday', 'en'), 'last monday back');

    dateEqual(testCreateDate('lunes pasado 3:45'), run(testCreateDate('last monday', 'en'), 'set', [{ hour: 3, minute: 45 }, true]), 'last monday back 3:45');
    dateEqual(testCreateDate('proximo lunes 3:45'), run(testCreateDate('next monday', 'en'), 'set', [{ hour: 3, minute: 45 }, true]), 'next monday no accent 3:45');

    dateEqual(testCreateDate('el año pasado'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('el próximo año'), getRelativeDate(1), 'Next year');

    // no accents
    dateEqual(testCreateDate('hace 1 dia'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('proximo mes'), getRelativeDate(null, 1), 'Next month');
    dateEqual(testCreateDate('proxima semana'), getRelativeDate(null, null, 7), 'Next week');
    dateEqual(testCreateDate('manana'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('hace 1 ano'), getRelativeDate(-1), 'one year ago');

    dateEqual(testCreateDate('mañana a las 3:30'), run(getRelativeDate(null, null, 1), 'set', [{hours:3,minutes:30}, true]), 'tomorrow at 3:30');

  });


  method('format', function() {
    var then = new Date(2011, 7, 25, 15, 45, 50);
    test(then, '25 agosto 2011 15:45', 'standard format');
    test(then, ['{dd} de {month} de {yyyy}'], '25 de agosto de 2011', 'format');

    // Format shortcuts
    equal(run(then, 'format', ['long']), '25 agosto 2011 15:45', 'long format');
    equal(run(then, 'long'), '25 agosto 2011 15:45', 'long shortcut');
    equal(run(then, 'format', ['full']), 'Jueves 25 agosto 2011 15:45:50', 'full format');
    equal(run(then, 'full'), 'Jueves 25 agosto 2011 15:45:50', 'full shortcut');
    equal(run(then, 'format', ['short']), '25 agosto 2011', 'short format');
    equal(run(then, 'short'), '25 agosto 2011', 'short shortcut');
  });

  method('relative', function() {
    test(testCreateDate('1 second ago', 'en'), 'hace 1 segundo');
    test(testCreateDate('1 minute ago', 'en'), 'hace 1 minuto');
    test(testCreateDate('1 hour ago', 'en'),   'hace 1 hora');
    test(testCreateDate('1 day ago', 'en'),    'hace 1 día');
    test(testCreateDate('1 week ago', 'en'),   'hace 1 semana');
    test(testCreateDate('1 month ago', 'en'),  'hace 1 mes');
    test(testCreateDate('1 year ago', 'en'),   'hace 1 año');

    test(testCreateDate('2 seconds ago', 'en'), 'hace 2 segundos');
    test(testCreateDate('2 minutes ago', 'en'), 'hace 2 minutos');
    test(testCreateDate('2 hours ago', 'en'),   'hace 2 horas');
    test(testCreateDate('2 days ago', 'en'),    'hace 2 días');
    test(testCreateDate('2 weeks ago', 'en'),   'hace 2 semanas');
    test(testCreateDate('2 months ago', 'en'),  'hace 2 meses');
    test(testCreateDate('2 years ago', 'en'),   'hace 2 años');

    test(testCreateDate('1 second from now', 'en'), 'dentro de 1 segundo');
    test(testCreateDate('1 minute from now', 'en'), 'dentro de 1 minuto');
    test(testCreateDate('1 hour from now', 'en'),   'dentro de 1 hora');
    test(testCreateDate('1 day from now', 'en'),    'dentro de 1 día');
    test(testCreateDate('1 week from now', 'en'),   'dentro de 1 semana');
    testMonthsFromNow(1, 'dentro de 1 mes', 'dentro de 4 semanas');
    test(testCreateDate('1 year from now', 'en'),   'dentro de 1 año');

    test(testCreateDate('5 second from now', 'en'), 'dentro de 5 segundos');
    test(testCreateDate('5 minute from now', 'en'), 'dentro de 5 minutos');
    test(testCreateDate('5 hour from now', 'en'),   'dentro de 5 horas');
    test(testCreateDate('5 day from now', 'en'),    'dentro de 5 días');
    test(testCreateDate('5 week from now', 'en'),   'dentro de 1 mes');
    testMonthsFromNow(5, 'dentro de 5 meses', 'dentro de 4 meses');
    test(testCreateDate('5 year from now', 'en'),   'dentro de 5 años');
  });


});

package('Number | Spanish Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['es'], '5 horas', 'Date#create | Spanish | simple duration');
  });

});

