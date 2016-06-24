namespace('Date | Spanish', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('es');
  });

  method('create', function() {

    assertDateParsed('la semana pasada', getRelativeDate(0, 0, -7));

    assertDateParsed('15 de mayo 2011', new Date(2011, 4, 15));
    assertDateParsed('5 de enero de 2012', new Date(2012, 0, 5));
    assertDateParsed('mayo de 2011', new Date(2011, 4));
    assertDateParsed('15 de mayo', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011', new Date(2011, 0));
    assertDateParsed('02 de feb. de 2016', new Date(2016, 1, 2));

    assertDateParsed('mayo', new Date(now.getFullYear(), 4));
    assertDateParsed('lunes', testGetWeekday(1));

    assertDateParsed('5 de enero de 2012 3:45',   new Date(2012, 0, 5, 3, 45));
    assertDateParsed('5 de enero de 2012 3:45pm', new Date(2012, 0, 5, 15, 45));

    assertDateParsed('hace 1 milisegundo', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('hace 1 segundo',     getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('hace 1 minuto',      getRelativeDate(0,0,0,0,-1));
    assertDateParsed('hace 1 hora',        getRelativeDate(0,0,0,-1));
    assertDateParsed('hace 1 día',         getRelativeDate(0,0,-1));
    assertDateParsed('hace 1 semana',      getRelativeDate(0,0,-7));
    assertDateParsed('hace 1 mes',         getRelativeDate(0,-1));
    assertDateParsed('hace 1 año',         getRelativeDate(-1));


    assertDateParsed('dentro de 5 milisegundos', getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('dentro de 5 segundos',     getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('dentro de 5 minutos',      getRelativeDate(0,0,0,0,5));
    assertDateParsed('dentro de 5 horas',        getRelativeDate(0,0,0,5));
    assertDateParsed('dentro de 5 días',         getRelativeDate(0,0,5));
    assertDateParsed('dentro de 5 semanas',      getRelativeDate(0,0,35));
    assertDateParsed('dentro de 5 meses',        getRelativeDate(0,5));
    assertDateParsed('dentro de 5 años',         getRelativeDate(5));


    assertDateParsed('anteayer', getRelativeDateReset(0,0,-2));
    assertDateParsed('ayer',     getRelativeDateReset(0,0,-1));
    assertDateParsed('hoy',      getRelativeDateReset(0,0,0));
    assertDateParsed('mañana',   getRelativeDateReset(0,0,1));

    assertDateParsed('la semana pasada',  getRelativeDate(0,0,-7));
    assertDateParsed('la próxima semana', getRelativeDate(0,0,7));

    assertDateParsed('el mes pasado',  getRelativeDate(0,-1));
    assertDateParsed('el próximo mes', getRelativeDate(0,1));

    assertDateParsed('proximo lunes', testCreateDate('next monday', 'en'));
    assertDateParsed('próximo lunes', testCreateDate('next monday', 'en'));
    assertDateParsed('pasado lunes',  testCreateDate('last monday', 'en'));
    assertDateParsed('lunes pasado',  testCreateDate('last monday', 'en'));

    assertDateParsed('lunes pasado 3:45',  testGetWeekday(1,-1,3,45));
    assertDateParsed('proximo lunes 3:45', testGetWeekday(1,1,3,45));

    assertDateParsed('el año pasado',  getRelativeDate(-1));
    assertDateParsed('el próximo año', getRelativeDate(1));

    assertDateParsed('3:45 15 de mayo 2011', new Date(2011, 4, 15, 3, 45));
    assertDateParsed('3:45 próximo lunes',   testGetWeekday(1, 1, 3, 45));
    assertDateParsed('3:45 lunes pasado',    testGetWeekday(1, -1, 3, 45));


    // No accents

    assertDateParsed('hace 1 dia',     getRelativeDate(0,0,-1));
    assertDateParsed('proximo mes',    getRelativeDate(0,1));
    assertDateParsed('proxima semana', getRelativeDate(0,0,7));
    assertDateParsed('manana',         getRelativeDateReset(0,0,1));
    assertDateParsed('hace 1 ano',     getRelativeDate(-1));

    assertDateParsed('mañana a las 3:30', testDateSet(getRelativeDateReset(0,0,1),{hour:3,minute:30}));


    // Numbers

    assertDateParsed('hace cero años',   getRelativeDate(0));
    assertDateParsed('hace uno año',     getRelativeDate(-1));
    assertDateParsed('hace dos años',    getRelativeDate(-2));
    assertDateParsed('hace tres años',   getRelativeDate(-3));
    assertDateParsed('hace cuatro años', getRelativeDate(-4));
    assertDateParsed('hace cinco años',  getRelativeDate(-5));
    assertDateParsed('hace seis años',   getRelativeDate(-6));
    assertDateParsed('hace siete años',  getRelativeDate(-7));
    assertDateParsed('hace ocho años',   getRelativeDate(-8));
    assertDateParsed('hace nueve años',  getRelativeDate(-9));
    assertDateParsed('hace diez años',   getRelativeDate(-10));

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
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Spanish', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['es'], '5 horas', 'Date#create | Spanish | simple duration');
  });

});

