test('Dates | Swedish', function () {

  var now = new Date();
  Date.setLocale('sv');


  dateEqual(Date.create('den 15 maj 2011'), new Date(2011, 4, 15), 'Date#create | basic Swedish date');
  dateEqual(Date.create('15 maj 2011'), new Date(2011, 4, 15), 'Date#create | basic Swedish date');
  dateEqual(Date.create('tisdag 5 januari 2012'), new Date(2012, 0, 5), 'Date#create | Swedish | 2012-01-05');
  dateEqual(Date.create('tisdag, 5 januari 2012'), new Date(2012, 0, 5), 'Date#create | Swedish | 2012-01-05');
  dateEqual(Date.create('maj 2011'), new Date(2011, 4), 'Date#create | Swedish | year and month');
  dateEqual(Date.create('15 maj'), new Date(now.getFullYear(), 4, 15), 'Date#create | Swedish | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | Swedish | year');
  dateEqual(Date.create('maj'), new Date(now.getFullYear(), 4), 'Date#create | Swedish | month');
  dateEqual(Date.create('måndag'), getDateWithWeekdayAndOffset(1), 'Date#create | Swedish | Monday');

  dateEqual(Date.create('15 maj 2011 3:45'), new Date(2011, 4, 15, 3, 45), 'Date#create | basic Swedish date 3:45');
  dateEqual(Date.create('15 maj 2011 3:45pm'), new Date(2011, 4, 15, 15, 45), 'Date#create | basic Swedish date 3:45pm');

  dateEqual(Date.create('för en millisekund sedan'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Swedish | one millisecond ago');
  dateEqual(Date.create('för en sekund sedan'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Swedish | one second ago');
  dateEqual(Date.create('för en minut sedan'), getRelativeDate(null, null, null, null, -1), 'Date#create | Swedish | one minute ago');
  dateEqual(Date.create('för en timme sedan'), getRelativeDate(null, null, null, -1), 'Date#create | Swedish | one hour ago');
  dateEqual(Date.create('för en dag sedan'), getRelativeDate(null, null, -1), 'Date#create | Swedish | one day ago');
  dateEqual(Date.create('för en vecka sedan'), getRelativeDate(null, null, -7), 'Date#create | Swedish | one week ago');
  dateEqual(Date.create('för en månad sedan'), getRelativeDate(null, -1), 'Date#create | Swedish | one month ago');
  dateEqual(Date.create('för ett år sedan'), getRelativeDate(-1), 'Date#create | Swedish | one year ago');
  dateEqual(Date.create('ett år sen'), getRelativeDate(-1), 'Date#create | Swedish | one year ago');
  
  dateEqual(Date.create('ett ar sen'), getRelativeDate(-1), 'Date#create | Swedish | one year ago');

  dateEqual(Date.create('om 5 millisekunder'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Swedish | dans | five milliseconds from now');
  dateEqual(Date.create('om 5 sekunder'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Swedish | dans | five second from now');
  dateEqual(Date.create('om 5 minuter'), getRelativeDate(null, null, null, null, 5), 'Date#create | Swedish | dans | five minute from now');
  dateEqual(Date.create('om 5 timmar'), getRelativeDate(null, null, null, 5), 'Date#create | Swedish | dans | five hour from now');
  dateEqual(Date.create('om 5 dagar'), getRelativeDate(null, null, 5), 'Date#create | Swedish | dans | five day from now');
  dateEqual(Date.create('om 5 veckor'), getRelativeDate(null, null, 35), 'Date#create | Swedish | dans | five weeks from now');
  dateEqual(Date.create('om 5 månader'), getRelativeDate(null, 5), 'Date#create | Swedish | dans | five months from now');
  dateEqual(Date.create('om 5 år'), getRelativeDate(5), 'Date#create | Swedish | dans | five years from now');


  dateEqual(Date.create('i förrgår'), getRelativeDate(null, null, -2).reset(), 'Date#create | Swedish | day before yesterday');
  dateEqual(Date.create('förrgår'), getRelativeDate(null, null, -2).reset(), 'Date#create | Swedish | day before yesterday');
  dateEqual(Date.create('i går'), getRelativeDate(null, null, -1).reset(), 'Date#create | Swedish | yesterday');
  dateEqual(Date.create('igår'), getRelativeDate(null, null, -1).reset(), 'Date#create | Swedish | yesterday');
  dateEqual(Date.create('i dag'), getRelativeDate(null, null, 0).reset(), 'Date#create | Swedish | today');
  dateEqual(Date.create('idag'), getRelativeDate(null, null, 0).reset(), 'Date#create | Swedish | today');
  dateEqual(Date.create('imorgon'), getRelativeDate(null, null, 1).reset(), 'Date#create | Swedish | tomorrow');
  dateEqual(Date.create('i morgon'), getRelativeDate(null, null, 1).reset(), 'Date#create | Swedish | tomorrow');
  dateEqual(Date.create('i övermorgon'), getRelativeDate(null, null, 2).reset(), 'Date#create | Swedish | day after tomorrow');
  dateEqual(Date.create('i över morgon'), getRelativeDate(null, null, 2).reset(), 'Date#create | Swedish | day after tomorrow');

  dateEqual(Date.create('förra veckan'), getRelativeDate(null, null, -7), 'Date#create | Swedish | Last week');
  dateEqual(Date.create('i förra veckan'), getRelativeDate(null, null, -7), 'Date#create | Swedish | Last week');
  dateEqual(Date.create('nästa vecka'), getRelativeDate(null, null, 7), 'Date#create | Swedish | Next week');
  dateEqual(Date.create('nasta vecka'), getRelativeDate(null, null, 7), 'Date#create | Swedish | Next week');

  dateEqual(Date.create('förra månaden'), getRelativeDate(null, -1), 'Date#create | Swedish | last month');
  dateEqual(Date.create('nästa månad'), getRelativeDate(null, 1), 'Date#create | Swedish | Next month');

  dateEqual(Date.create('förra året'), getRelativeDate(-1), 'Date#create | Swedish | Last year');
  dateEqual(Date.create('nästa år'), getRelativeDate(1), 'Date#create | Swedish | Next year');

  dateEqual(Date.create('förra måndagen'), getDateWithWeekdayAndOffset(1,  -7), 'Date#create | Swedish | last monday');
  dateEqual(Date.create('nästa måndag'), getDateWithWeekdayAndOffset(1, 7), 'Date#create | Swedish | next monday');


  // no accents
  dateEqual(Date.create('mandag'), getDateWithWeekdayAndOffset(1), 'Date#create | Swedish | Monday');
  dateEqual(Date.create('for en millisekund sedan'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Swedish | one millisecond ago');
  dateEqual(Date.create('for en sekund sedan'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Swedish | one second ago');
  dateEqual(Date.create('for en minut sedan'), getRelativeDate(null, null, null, null, -1), 'Date#create | Swedish | one minute ago');
  dateEqual(Date.create('for en timme sedan'), getRelativeDate(null, null, null, -1), 'Date#create | Swedish | one hour ago');
  dateEqual(Date.create('for en dag sedan'), getRelativeDate(null, null, -1), 'Date#create | Swedish | one day ago');
  dateEqual(Date.create('for en vecka sedan'), getRelativeDate(null, null, -7), 'Date#create | Swedish | one week ago');
  dateEqual(Date.create('for en manad sedan'), getRelativeDate(null, -1), 'Date#create | Swedish | one month ago');
  dateEqual(Date.create('for ett ar sedan'), getRelativeDate(-1), 'Date#create | Swedish | one year ago');
  dateEqual(Date.create('ett ar sen'), getRelativeDate(-1), 'Date#create | Swedish | one year ago');
  
  dateEqual(Date.create('om 5 manader'), getRelativeDate(null, 5), 'Date#create | Swedish | dans | five months from now');
  dateEqual(Date.create('om 5 ar'), getRelativeDate(5), 'Date#create | Swedish | dans | five years from now');
  
  dateEqual(Date.create('i forrgar'), getRelativeDate(null, null, -2).reset(), 'Date#create | Swedish | day before yesterday');
  dateEqual(Date.create('förrgår'), getRelativeDate(null, null, -2).reset(), 'Date#create | Swedish | day before yesterday');
  dateEqual(Date.create('i gar'), getRelativeDate(null, null, -1).reset(), 'Date#create | Swedish | yesterday');
  dateEqual(Date.create('igar'), getRelativeDate(null, null, -1).reset(), 'Date#create | Swedish | yesterday');
  dateEqual(Date.create('i overmorgon'), getRelativeDate(null, null, 2).reset(), 'Date#create | Swedish | day after tomorrow');
  dateEqual(Date.create('i over morgon'), getRelativeDate(null, null, 2).reset(), 'Date#create | Swedish | day after tomorrow');
  
  dateEqual(Date.create('forra veckan'), getRelativeDate(null, null, -7), 'Date#create | Swedish | Last week');
  dateEqual(Date.create('i forra veckan'), getRelativeDate(null, null, -7), 'Date#create | Swedish | Last week');
  dateEqual(Date.create('nasta vecka'), getRelativeDate(null, null, 7), 'Date#create | Swedish | Next week');
  dateEqual(Date.create('forra manaden'), getRelativeDate(null, -1), 'Date#create | Swedish | last month');
  dateEqual(Date.create('nasta manad'), getRelativeDate(null, 1), 'Date#create | Swedish | Next month');
  dateEqual(Date.create('forra aret'), getRelativeDate(-1), 'Date#create | Swedish | Last year');
  dateEqual(Date.create('nasta ar'), getRelativeDate(1), 'Date#create | Swedish | Next year');


  equal(Date.create('2001-06-14 3:45pm').format(), 'den 14 juni 2001 15:45', 'Date#create | Swedish | format');
  equal(Date.create('2011-08-25').format('{dd} {month} {yyyy}'), '25 augusti 2011', 'Date#create | Swedish | format');

  equal(Date.create('1 second ago', 'en').relative(), '1 sekund sedan', 'Date#create | Swedish | relative format past');
  equal(Date.create('1 minute ago', 'en').relative(), '1 minut sedan',  'Date#create | Swedish | relative format past');
  equal(Date.create('1 hour ago', 'en').relative(),   '1 timme sedan',     'Date#create | Swedish | relative format past');
  equal(Date.create('1 day ago', 'en').relative(),    '1 dag sedan',    'Date#create | Swedish | relative format past');
  equal(Date.create('1 week ago', 'en').relative(),   '1 vecka sedan',  'Date#create | Swedish | relative format past');
  equal(Date.create('1 month ago', 'en').relative(),  '1 månad sedan',   'Date#create | Swedish | relative format past');
  equal(Date.create('1 year ago', 'en').relative(),   '1 år sedan',     'Date#create | Swedish | relative format past');

  equal(Date.create('5 seconds ago', 'en').relative(), '5 sekunder sedan', 'Date#create | Swedish | relative format past');
  equal(Date.create('5 minutes ago', 'en').relative(), '5 minuter sedan',  'Date#create | Swedish | relative format past');
  equal(Date.create('5 hours ago', 'en').relative(),   '5 timmar sedan',     'Date#create | Swedish | relative format past');
  equal(Date.create('5 days ago', 'en').relative(),    '5 dagar sedan',    'Date#create | Swedish | relative format past');
  equal(Date.create('3 weeks ago', 'en').relative(),   '3 veckor sedan',  'Date#create | Swedish | relative format past');
  equal(Date.create('5 weeks ago', 'en').relative(),   '1 månad sedan',  'Date#create | Swedish | relative format past');
  equal(Date.create('5 months ago', 'en').relative(),  '5 månader sedan',   'Date#create | Swedish | relative format past');
  equal(Date.create('5 years ago', 'en').relative(),   '5 år sedan',     'Date#create | Swedish | relative format past');

  equal(Date.create('1 second from now', 'en').relative(), 'om 1 sekund', 'Date#create | Swedish | relative format future');
  equal(Date.create('1 minute from now', 'en').relative(), 'om 1 minut',  'Date#create | Swedish | relative format future');
  equal(Date.create('1 hour from now', 'en').relative(),   'om 1 timme',     'Date#create | Swedish | relative format future');
  equal(Date.create('1 day from now', 'en').relative(),    'om 1 dag',    'Date#create | Swedish | relative format future');
  equal(Date.create('1 week from now', 'en').relative(),   'om 1 vecka',  'Date#create | Swedish | relative format future');
  equal(Date.create('1 month from now', 'en').relative(),  'om 1 månad',   'Date#create | Swedish | relative format future');
  equal(Date.create('1 year from now', 'en').relative(),   'om 1 år',     'Date#create | Swedish | relative format future');

  equal(Date.create('5 second from now', 'en').relative(), 'om 5 sekunder', 'Date#create | Swedish | relative format future');
  equal(Date.create('5 minutes from now', 'en').relative(),'om 5 minuter',  'Date#create | Swedish | relative format future');
  equal(Date.create('5 hour from now', 'en').relative(),   'om 5 timmar',     'Date#create | Swedish | relative format future');
  equal(Date.create('5 day from now', 'en').relative(),    'om 5 dagar',    'Date#create | Swedish | relative format future');
  equal(Date.create('3 weeks from now', 'en').relative(),   'om 3 veckor',  'Date#create | Swedish | relative format future');
  equal(Date.create('5 weeks from now', 'en').relative(),   'om 1 månad',  'Date#create | Swedish | relative format future');
  equal(Date.create('5 month from now', 'en').relative(),  'om 5 månader',   'Date#create | Swedish | relative format future');
  equal(Date.create('5 year from now', 'en').relative(),   'om 5 år',     'Date#create | Swedish | relative format future');

  equal((5).hours().duration('sv'), '5 timmar', 'Date#create | Swedish | simple duration');

});
