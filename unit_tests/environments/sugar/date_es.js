test('Dates | Spanish', function () {

  var now = new Date();
  Date.setLocale('es');


  dateEqual(Date.create('15 de mayo 2011'), new Date(2011, 4, 15), 'Date#create | basic Spanish date');
  dateEqual(Date.create('5 de enero de 2012'), new Date(2012, 0, 5), 'Date#create | Spanish | 2012-01-05');
  dateEqual(Date.create('mayo de 2011'), new Date(2011, 4), 'Date#create | Spanish | year and month');
  dateEqual(Date.create('15 de mayo'), new Date(now.getFullYear(), 4, 15), 'Date#create | Spanish | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | Spanish | year');
  dateEqual(Date.create('mayo'), new Date(now.getFullYear(), 4), 'Date#create | Spanish | month');
  dateEqual(Date.create('lunes'), getDateWithWeekdayAndOffset(1), 'Date#create | Spanish | Monday');


  dateEqual(Date.create('hace 1 milisegundo'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Spanish | one millisecond ago');
  dateEqual(Date.create('hace 1 segundo'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Spanish | one second ago');
  dateEqual(Date.create('hace 1 minuto'), getRelativeDate(null, null, null, null, -1), 'Date#create | Spanish | one minute ago');
  dateEqual(Date.create('hace 1 hora'), getRelativeDate(null, null, null, -1), 'Date#create | Spanish | one hour ago');
  dateEqual(Date.create('hace 1 día'), getRelativeDate(null, null, -1), 'Date#create | Spanish | one day ago');
  dateEqual(Date.create('hace 1 semana'), getRelativeDate(null, null, -7), 'Date#create | Spanish | one week');
  dateEqual(Date.create('hace 1 mes'), getRelativeDate(null, -1), 'Date#create | Spanish | one month ago');
  dateEqual(Date.create('hace 1 año'), getRelativeDate(-1), 'Date#create | Spanish | one year ago');


  dateEqual(Date.create('5 milisegundos de ahora'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Spanish | five milliseconds from now');
  dateEqual(Date.create('5 segundos de ahora'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Spanish | five second from now');
  dateEqual(Date.create('5 minutos de ahora'), getRelativeDate(null, null, null, null, 5), 'Date#create | Spanish | five minute from now');
  dateEqual(Date.create('5 horas de ahora'), getRelativeDate(null, null, null, 5), 'Date#create | Spanish | five hour from now');
  dateEqual(Date.create('5 días de ahora'), getRelativeDate(null, null, 5), 'Date#create | Spanish | five day from now');
  dateEqual(Date.create('5 semanas de ahora'), getRelativeDate(null, null, 35), 'Date#create | Spanish | five weeks from now');
  dateEqual(Date.create('5 meses de ahora'), getRelativeDate(null, 5), 'Date#create | Spanish | five months from now');
  dateEqual(Date.create('5 años de ahora'), getRelativeDate(5), 'Date#create | Spanish | five years from now');


  dateEqual(Date.create('anteayer'), getRelativeDate(null, null, -2).resetTime(), 'Date#create | Spanish | 一昨日');
  dateEqual(Date.create('ayer'), getRelativeDate(null, null, -1).resetTime(), 'Date#create | Spanish | yesterday');
  dateEqual(Date.create('hoy'), getRelativeDate(null, null, 0).resetTime(), 'Date#create | Spanish | today');
  dateEqual(Date.create('mañana'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | Spanish | tomorrow');

  dateEqual(Date.create('semana pasada'), getRelativeDate(null, null, -7), 'Date#create | Spanish | Last week');
  dateEqual(Date.create('semana próxima'), getRelativeDate(null, null, 7), 'Date#create | Spanish | Next week');

  dateEqual(Date.create('mes pasado'), getRelativeDate(null, -1), 'Date#create | Spanish | last month');
  dateEqual(Date.create('mes próximo'), getRelativeDate(null, 1), 'Date#create | Spanish | Next month');

  dateEqual(Date.create('el año pasado'), getRelativeDate(-1), 'Date#create | Spanish | Last year');
  dateEqual(Date.create('el próximo año'), getRelativeDate(1), 'Date#create | Spanish | Next year');

  // no accents
  dateEqual(Date.create('hace 1 dia'), getRelativeDate(null, null, -1), 'Date#create | Spanish | one day ago');
  dateEqual(Date.create('mes proximo'), getRelativeDate(null, 1), 'Date#create | Spanish | Next month');
  dateEqual(Date.create('semana proxima'), getRelativeDate(null, null, 7), 'Date#create | Spanish | Next week');
  dateEqual(Date.create('manana'), getRelativeDate(null, null, 1).resetTime(), 'Date#create | Spanish | tomorrow');
  dateEqual(Date.create('hace 1 ano'), getRelativeDate(-1), 'Date#create | Spanish | one year ago');

  equal(Date.create('2012-01-05').format(), '5 de enero de 2012', 'Date#create | Spanish | standard format');
  equal(Date.create('2011-08-25').format('{dd} de {month} {yyyy}'), '25 de agosto 2011', 'Date#create | Spanish | format');



  equal(Date.create('1 second ago').relative(), 'hace 1 segundo', 'Date#create | Spanish | relative format past');
  equal(Date.create('1 minute ago').relative(), 'hace 1 minuto',  'Date#create | Spanish | relative format past');
  equal(Date.create('1 hour ago').relative(),   'hace 1 hora',     'Date#create | Spanish | relative format past');
  equal(Date.create('1 day ago').relative(),    'hace 1 día',    'Date#create | Spanish | relative format past');
  equal(Date.create('1 week ago').relative(),   'hace 1 semana',  'Date#create | Spanish | relative format past');
  equal(Date.create('1 month ago').relative(),  'hace 1 mes',   'Date#create | Spanish | relative format past');
  equal(Date.create('1 year ago').relative(),   'hace 1 año',     'Date#create | Spanish | relative format past');

  equal(Date.create('2 seconds ago').relative(), 'hace 2 segundos', 'Date#create | Spanish | relative format past');
  equal(Date.create('2 minutes ago').relative(), 'hace 2 minutos',  'Date#create | Spanish | relative format past');
  equal(Date.create('2 hours ago').relative(),   'hace 2 horas',     'Date#create | Spanish | relative format past');
  equal(Date.create('2 days ago').relative(),    'hace 2 días',    'Date#create | Spanish | relative format past');
  equal(Date.create('2 weeks ago').relative(),   'hace 2 semanas',  'Date#create | Spanish | relative format past');
  equal(Date.create('2 months ago').relative(),  'hace 2 meses',   'Date#create | Spanish | relative format past');
  equal(Date.create('2 years ago').relative(),   'hace 2 años',     'Date#create | Spanish | relative format past');

  equal(Date.create('1 second from now').relative(), '1 segundo de ahora', 'Date#create | Spanish | relative format future');
  equal(Date.create('1 minute from now').relative(), '1 minuto de ahora',  'Date#create | Spanish | relative format future');
  equal(Date.create('1 hour from now').relative(),   '1 hora de ahora',     'Date#create | Spanish | relative format future');
  equal(Date.create('1 day from now').relative(),    '1 día de ahora',    'Date#create | Spanish | relative format future');
  equal(Date.create('1 week from now').relative(),   '1 semana de ahora',  'Date#create | Spanish | relative format future');
  equal(Date.create('1 month from now').relative(),  '1 mes de ahora',   'Date#create | Spanish | relative format future');
  equal(Date.create('1 year from now').relative(),   '1 año de ahora',     'Date#create | Spanish | relative format future');

  equal(Date.create('5 second from now').relative(), '5 segundos de ahora', 'Date#create | Spanish | relative format future');
  equal(Date.create('5 minute from now').relative(), '5 minutos de ahora',  'Date#create | Spanish | relative format future');
  equal(Date.create('5 hour from now').relative(),   '5 horas de ahora',     'Date#create | Spanish | relative format future');
  equal(Date.create('5 day from now').relative(),    '5 días de ahora',    'Date#create | Spanish | relative format future');
  equal(Date.create('5 week from now').relative(),   '1 mes de ahora',  'Date#create | Spanish | relative format future');
  equal(Date.create('5 month from now').relative(),  '5 meses de ahora',   'Date#create | Spanish | relative format future');
  equal(Date.create('5 year from now').relative(),   '5 años de ahora',     'Date#create | Spanish | relative format future');


});
