test('Dates | Portuguese', function () {

  var now = new Date();
  Date.setLanguage('pt');

  dateEqual(Date.create('15 de maio 2011'), new Date(2011, 4, 15), 'Date#create | basic Portuguese date');
  dateEqual(Date.create('5 de janeiro de 2012'), new Date(2012, 0, 5), 'Date#create | Portuguese | 2012-01-05');
  dateEqual(Date.create('maio de 2011'), new Date(2011, 4), 'Date#create | Portuguese | year and month');
  dateEqual(Date.create('15 de maio'), new Date(now.getFullYear(), 4, 15), 'Date#create | Portuguese | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | Portuguese | year');
  dateEqual(Date.create('maio'), new Date(now.getFullYear(), 4), 'Date#create | Portuguese | month');
  dateEqual(Date.create('segunda-feira'), getDateWithWeekdayAndOffset(1), 'Date#create | Portuguese | Monday');


  dateEqual(Date.create('um milisegundo atrás'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Portuguese | one millisecond ago');
  dateEqual(Date.create('um segundo atrás'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Portuguese | one second ago');
  dateEqual(Date.create('um minuto atrás'), getRelativeDate(null, null, null, null, -1), 'Date#create | Portuguese | one minute ago');
  dateEqual(Date.create('uma hora atrás'), getRelativeDate(null, null, null, -1), 'Date#create | Portuguese | one hour ago');
  dateEqual(Date.create('um dia atrás'), getRelativeDate(null, null, -1), 'Date#create | Portuguese | one day ago');
  dateEqual(Date.create('uma semana atrás'), getRelativeDate(null, null, -7), 'Date#create | Portuguese | one week');
  dateEqual(Date.create('há um mês'), getRelativeDate(null, -1), 'Date#create | Portuguese | one month ago');
  dateEqual(Date.create('há um ano'), getRelativeDate(-1), 'Date#create | Portuguese | one year ago');


  dateEqual(Date.create('daqui a 5 milisegundos'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Portuguese | five milliseconds from now');
  dateEqual(Date.create('daqui a 5 segundos'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Portuguese | five second from now');
  dateEqual(Date.create('daqui a 5 minutos'), getRelativeDate(null, null, null, null, 5), 'Date#create | Portuguese | five minute from now');
  dateEqual(Date.create('daqui a 5 horas'), getRelativeDate(null, null, null, 5), 'Date#create | Portuguese | five hour from now');
  dateEqual(Date.create('daqui a 5 dias'), getRelativeDate(null, null, 5), 'Date#create | Portuguese | five day from now');
  dateEqual(Date.create('daqui a 5 semanas'), getRelativeDate(null, null, 35), 'Date#create | Portuguese | five weeks from now');
  dateEqual(Date.create('daqui a 5 mêses'), getRelativeDate(null, 5), 'Date#create | Portuguese | five months from now');
  dateEqual(Date.create('daqui a 5 anos'), getRelativeDate(5), 'Date#create | Portuguese | five years from now');


  dateEqual(Date.create('anteontem'), getRelativeDate(null, null, -2).resetTime(), 'Date#create | Portuguese | the day before yesterday');
  dateEqual(Date.create('ontem'), getRelativeDate(null, null, -1).resetTime(), 'Date#create | Portuguese | yesterday');
  dateEqual(Date.create('hoje'), getRelativeDate(null, null, 0).resetTime(), 'Date#create | Portuguese | today');
  dateEqual(Date.create('amanhã'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | Portuguese | tomorrow');

  dateEqual(Date.create('semana passada'), getRelativeDate(null, null, -7), 'Date#create | Portuguese | Last week');
  dateEqual(Date.create('próxima semana'), getRelativeDate(null, null, 7), 'Date#create | Portuguese | Next week');

  dateEqual(Date.create('mês passado'), getRelativeDate(null, -1), 'Date#create | Portuguese | last month');
  dateEqual(Date.create('próximo mês'), getRelativeDate(null, 1), 'Date#create | Portuguese | Next month');

  dateEqual(Date.create('ano passado'), getRelativeDate(-1), 'Date#create | Portuguese | Last year');
  dateEqual(Date.create('próximo ano'), getRelativeDate(1), 'Date#create | Portuguese | Next year');

  equal(Date.create('2011-08-25').format('{dd} de {month} {yyyy}'), '25 de agosto 2011', 'Date#create | Portuguese | format');
  equal(Date.create('5 hours ago').relative(), '5 horas atrás', 'Date#create | Portuguese | relative format past');
  equal(Date.create('5 hours from now').relative(), 'daqui a 5 horas', 'Date#create | Portuguese | relative format future');



});
