namespace('Date | Portuguese', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('pt');
  });

  method('create', function() {

    assertDateParsed('15 de maio 2011', new Date(2011, 4, 15));
    assertDateParsed('5 de janeiro de 2012', new Date(2012, 0, 5));
    assertDateParsed('maio de 2011', new Date(2011, 4));
    assertDateParsed('15 de maio', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011', new Date(2011, 0));
    assertDateParsed('02 de fev de 2016', new Date(2016, 1, 2));

    assertDateParsed('segunda-feira', testGetWeekday(1));

    assertDateParsed('janeiro',   new Date(now.getFullYear(), 0));
    assertDateParsed('fevereiro', new Date(now.getFullYear(), 1));
    assertDateParsed('março',     new Date(now.getFullYear(), 2));
    assertDateParsed('abril',     new Date(now.getFullYear(), 3));
    assertDateParsed('maio',      new Date(now.getFullYear(), 4));
    assertDateParsed('junho',     new Date(now.getFullYear(), 5));
    assertDateParsed('julho',     new Date(now.getFullYear(), 6));
    assertDateParsed('agosto',    new Date(now.getFullYear(), 7));
    assertDateParsed('setembro',  new Date(now.getFullYear(), 8));
    assertDateParsed('outubro',   new Date(now.getFullYear(), 9));
    assertDateParsed('novembro',  new Date(now.getFullYear(), 10));
    assertDateParsed('dezembro',  new Date(now.getFullYear(), 11));

    assertDateParsed('5 de janeiro de 2012 3:45', new Date(2012, 0, 5, 3, 45));
    assertDateParsed('5 de janeiro de 2012 3:45pm', new Date(2012, 0, 5, 15, 45));

    assertDateParsed('um milisegundo atrás', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('um segundo atrás',     getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('um minuto atrás',      getRelativeDate(0,0,0,0,-1));
    assertDateParsed('uma hora atrás',       getRelativeDate(0,0,0,-1));
    assertDateParsed('um dia atrás',         getRelativeDate(0,0,-1));
    assertDateParsed('uma semana atrás',     getRelativeDate(0,0,-7));
    assertDateParsed('há um mês',            getRelativeDate(0,-1));
    assertDateParsed('há um ano',            getRelativeDate(-1));

    assertDateParsed('daqui a 5 milisegundos', getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('daqui a 5 segundos',     getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('daqui a 5 minutos',      getRelativeDate(0,0,0,0,5));
    assertDateParsed('daqui a 5 horas',        getRelativeDate(0,0,0,5));
    assertDateParsed('daqui a 5 dias',         getRelativeDate(0,0,5));
    assertDateParsed('daqui a 5 semanas',      getRelativeDate(0,0,35));
    assertDateParsed('daqui a 5 mêses',        getRelativeDate(0,5));
    assertDateParsed('daqui a 5 anos',         getRelativeDate(5));


    assertDateParsed('anteontem', getRelativeDateReset(0,0,-2));
    assertDateParsed('ontem',     getRelativeDateReset(0,0,-1));
    assertDateParsed('hoje',      getRelativeDateReset(0,0,0));
    assertDateParsed('amanhã',    getRelativeDateReset(0,0,1));

    assertDateParsed('semana passada', getRelativeDate(0,0,-7));
    assertDateParsed('próxima semana', getRelativeDate(0,0,7));

    assertDateParsed('mês passado', getRelativeDate(0,-1));
    assertDateParsed('próximo mês', getRelativeDate(0,1));

    assertDateParsed('ano passado', getRelativeDate(-1));
    assertDateParsed('próximo ano', getRelativeDate(1));

    assertDateParsed('próximo segunda-feira', testGetWeekday(1, 1));
    assertDateParsed('passada segunda-feira', testGetWeekday(1,-1));

    assertDateParsed('passada segunda-feira 3:45', testGetWeekday(1, -1, 3, 45));

    // no accents
    assertDateParsed('daqui a 5 meses', getRelativeDate(0,5));
    assertDateParsed('mes passado',     getRelativeDate(0,-1));
    assertDateParsed('proximo ano',     getRelativeDate(1));
    assertDateParsed('uma hora atras',  getRelativeDate(0,0,0,-1));
    assertDateParsed('ha um ano',       getRelativeDate(-1));
    assertDateParsed('amanha',          getRelativeDateReset(0,0,1));

    assertDateParsed('amanhã às 3:30', testDateSet(getRelativeDateReset(0,0,1), {hour:3,minute:30}));

    assertDateParsed('17:32 15 de maio', new Date(now.getFullYear(), 4, 15, 17, 32));
    assertDateParsed('17:32 próximo segunda-feira', testGetWeekday(1, 1, 17, 32));


    // Numbers

    assertDateParsed('zero anos atrás',   getRelativeDate(0));
    assertDateParsed('um ano atrás',      getRelativeDate(-1));
    assertDateParsed('dois anos atrás',   getRelativeDate(-2));
    assertDateParsed('três anos atrás',   getRelativeDate(-3));
    assertDateParsed('quatro anos atrás', getRelativeDate(-4));
    assertDateParsed('cinco anos atrás',  getRelativeDate(-5));
    assertDateParsed('seis anos atrás',   getRelativeDate(-6));
    assertDateParsed('sete anos atrás',   getRelativeDate(-7));
    assertDateParsed('oito anos atrás',   getRelativeDate(-8));
    assertDateParsed('nove anos atrás',   getRelativeDate(-9));
    assertDateParsed('dez anos atrás',    getRelativeDate(-10));

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
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Portuguese', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['pt'], '5 horas', 'simple duration');
  });

});

