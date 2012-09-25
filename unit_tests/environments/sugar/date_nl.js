test('Dates | Dutch', function () {

  var now = new Date();
  var then = new Date(2011, 7, 25, 15, 45, 50);
  Date.setLocale('nl');



  dateEqual(Date.create('15 mei 2011'), new Date(2011, 4, 15), 'Date#create | basic Dutch date');
  dateEqual(Date.create('Dinsdag, 5 Januari 2012'), new Date(2012, 0, 5), 'Date#create | Dutch | 2012-01-05');
  dateEqual(Date.create('Mei 2011'), new Date(2011, 4), 'Date#create | Dutch | year and month');
  dateEqual(Date.create('15 Mei'), new Date(now.getFullYear(), 4, 15), 'Date#create | Dutch | month and date');
  dateEqual(Date.create('2011'), new Date(2011, 0), 'Date#create | Dutch | year');
  dateEqual(Date.create('Mei'), new Date(now.getFullYear(), 4), 'Date#create | Dutch | month');
  dateEqual(Date.create('maandag'), getDateWithWeekdayAndOffset(1), 'Date#create | Dutch | Monday');
  dateEqual(Date.create('Ma'), getDateWithWeekdayAndOffset(1), 'Date#create | Dutch | Monday abbreviated');

  dateEqual(Date.create('Dinsdag, 5 Januari 2012 3:45'), new Date(2012, 0, 5, 3, 45), 'Date#create | Dutch | 2012-01-05 3:45');
  equal(Date.create('Dinsdag, 5 Januari 2012 3:45pm').isValid(), false, 'Date#create | Dutch | does not support am/pm');

  dateEqual(Date.create('een milliseconde geleden'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Dutch | one millisecond ago');
  dateEqual(Date.create('een seconde geleden'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Dutch | one second ago');
  dateEqual(Date.create('een minuut geleden'), getRelativeDate(null, null, null, null, -1), 'Date#create | Dutch | one minuto ago');
  dateEqual(Date.create("een uur geleden"), getRelativeDate(null, null, null, -1), 'Date#create | Dutch | one hour ago');
  dateEqual(Date.create('een dag geleden'), getRelativeDate(null, null, -1), 'Date#create | Dutch | one day ago');
  dateEqual(Date.create('een week geleden'), getRelativeDate(null, null, -7), 'Date#create | Dutch | one week ago');
  dateEqual(Date.create('een maand geleden'), getRelativeDate(null, -1), 'Date#create | Dutch | one month ago');
  dateEqual(Date.create('een jaar geleden'), getRelativeDate(-1), 'Date#create | Dutch | one year ago');


  dateEqual(Date.create('5 milliseconden vanaf nu'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Dutch | danni | five milliseconds from now');
  dateEqual(Date.create('5 seconden vanaf nu'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Dutch | danni | five second from now');
  dateEqual(Date.create('5 minuten vanaf nu'), getRelativeDate(null, null, null, null, 5), 'Date#create | Dutch | danni | five minuto from now');
  dateEqual(Date.create('5 uur vanaf nu'), getRelativeDate(null, null, null, 5), 'Date#create | Dutch | danni | five hour from now');
  dateEqual(Date.create('5 dagen vanaf nu'), getRelativeDate(null, null, 5), 'Date#create | Dutch | danni | five day from now');
  dateEqual(Date.create('5 weken vanaf nu'), getRelativeDate(null, null, 35), 'Date#create | Dutch | danni | five weeks from now');
  dateEqual(Date.create('5 maanden vanaf nu'), getRelativeDate(null, 5), 'Date#create | Dutch | danni | five months from now');
  dateEqual(Date.create('5 jaar vanaf nu'), getRelativeDate(5), 'Date#create | Dutch | danni | five years from now');


  dateEqual(Date.create('gisteren'), getRelativeDate(null, null, -1).reset(), 'Date#create | Dutch | yesterday');
  dateEqual(Date.create('vandaag'), getRelativeDate(null, null, 0).reset(), 'Date#create | Dutch | today');
  dateEqual(Date.create('morgen'), getRelativeDate(null, null, 1).reset(), 'Date#create | Dutch | tomorrow');
  dateEqual(Date.create('overmorgen'), getRelativeDate(null, null, 2).reset(), 'Date#create | Dutch | day after tomorrow');

  dateEqual(Date.create('laatste week'), getRelativeDate(null, null, -7), 'Date#create | Dutch | Last week');
  dateEqual(Date.create('volgende week'), getRelativeDate(null, null, 7), 'Date#create | Dutch | Next week');

  dateEqual(Date.create('vorige maand'), getRelativeDate(null, -1), 'Date#create | Dutch | last month');
  dateEqual(Date.create('volgende maand'), getRelativeDate(null, 1), 'Date#create | Dutch | Next month');

  dateEqual(Date.create("afgelopen jaar"), getRelativeDate(-1), 'Date#create | Dutch | Last year');
  dateEqual(Date.create("volgend jaar"), getRelativeDate(1), 'Date#create | Dutch | Next year');

  dateEqual(Date.create("volgende maandag"), getDateWithWeekdayAndOffset(1, 7), 'Date#create | Dutch | next monday');
  dateEqual(Date.create("afgelopen maandag"), getDateWithWeekdayAndOffset(1, -7), 'Date#create | Dutch | last monday');

  dateEqual(Date.create("afgelopen maandag 3:45"), getDateWithWeekdayAndOffset(1, -7).set({ hour: 3, minute: 45 }, true), 'Date#create | Dutch | last monday 3:45');

  equal(then.format(), '25 Augustus 2011 15:45', 'Date#create | Dutch | format');
  equal(then.format('{dd} {Month} {yyyy}'), '25 Augustus 2011', 'Date#create | Dutch | format');

  // Format shortcuts
  equal(then.format('long'), '25 Augustus 2011 15:45', 'Date#create | Dutch | long format');
  equal(then.long(), '25 Augustus 2011 15:45', 'Date#create | Dutch | long shortcut');
  equal(then.format('full'), 'Donderdag 25 Augustus 2011 15:45:50', 'Date#create | Dutch | full format');
  equal(then.full(), 'Donderdag 25 Augustus 2011 15:45:50', 'Date#create | Dutch | full shortcut');
  equal(then.format('short'), '25 Augustus 2011', 'Date#create | Dutch | short format');
  equal(then.short(), '25 Augustus 2011', 'Date#create | Dutch | short shortcut');


  equal(Date.create('1 second ago', 'en').relative(), '1 seconde geleden', 'Date#create | Dutch | relative format past');
  equal(Date.create('1 minute ago', 'en').relative(), '1 minuut geleden',  'Date#create | Dutch | relative format past');
  equal(Date.create('1 hour ago', 'en').relative(),   '1 uur geleden',     'Date#create | Dutch | relative format past');
  equal(Date.create('1 day ago', 'en').relative(),    '1 dag geleden',    'Date#create | Dutch | relative format past');
  equal(Date.create('1 week ago', 'en').relative(),   '1 week geleden',  'Date#create | Dutch | relative format past');
  equal(Date.create('1 month ago', 'en').relative(),  '1 maand geleden',   'Date#create | Dutch | relative format past');
  equal(Date.create('1 year ago', 'en').relative(),   '1 jaar geleden',     'Date#create | Dutch | relative format past');

  equal(Date.create('2 seconds ago', 'en').relative(), '2 seconden geleden', 'Date#create | Dutch | relative format past');
  equal(Date.create('2 minutes ago', 'en').relative(), '2 minuten geleden',  'Date#create | Dutch | relative format past');
  equal(Date.create('2 hours ago', 'en').relative(),   '2 uur geleden',     'Date#create | Dutch | relative format past');
  equal(Date.create('2 days ago', 'en').relative(),    '2 dagen geleden',    'Date#create | Dutch | relative format past');
  equal(Date.create('2 weeks ago', 'en').relative(),   '2 weken geleden',  'Date#create | Dutch | relative format past');
  equal(Date.create('2 months ago', 'en').relative(),  '2 maanden geleden',   'Date#create | Dutch | relative format past');
  equal(Date.create('2 years ago', 'en').relative(),   '2 jaar geleden',     'Date#create | Dutch | relative format past');

  equal(Date.create('1 second from now', 'en').relative(), '1 seconde vanaf nu', 'Date#create | Dutch | relative format future');
  equal(Date.create('1 minute from now', 'en').relative(), '1 minuut vanaf nu',  'Date#create | Dutch | relative format future');
  equal(Date.create('1 hour from now', 'en').relative(),   '1 uur vanaf nu',     'Date#create | Dutch | relative format future');
  equal(Date.create('1 day from now', 'en').relative(),    '1 dag vanaf nu',    'Date#create | Dutch | relative format future');
  equal(Date.create('1 week from now', 'en').relative(),   '1 week vanaf nu',  'Date#create | Dutch | relative format future');
  equal(Date.create('1 month from now', 'en').relative(),  '1 maand vanaf nu',   'Date#create | Dutch | relative format future');
  equal(Date.create('1 year from now', 'en').relative(),   '1 jaar vanaf nu',     'Date#create | Dutch | relative format future');

  equal(Date.create('5 second from now', 'en').relative(), '5 seconden vanaf nu', 'Date#create | Dutch | relative format future');
  equal(Date.create('5 minutes from now', 'en').relative(),'5 minuten vanaf nu',  'Date#create | Dutch | relative format future');
  equal(Date.create('5 hour from now', 'en').relative(),   '5 uur vanaf nu',     'Date#create | Dutch | relative format future');
  equal(Date.create('5 day from now', 'en').relative(),    '5 dagen vanaf nu',    'Date#create | Dutch | relative format future');
  equal(Date.create('5 week from now', 'en').relative(),   '1 maand vanaf nu',  'Date#create | Dutch | relative format future');
  equal(Date.create('5 month from now', 'en').relative(),  '5 maanden vanaf nu',   'Date#create | Dutch | relative format future');
  equal(Date.create('5 year from now', 'en').relative(),   '5 jaar vanaf nu',     'Date#create | Dutch | relative format future');

  // Issue #152 Dutch should not use a variant in any format
  dateEqual(Date.create('15/3/2012 12:45'), new Date(2012, 2, 15, 12, 45), 'Date#create | Dutch | slash format with time');
  dateEqual(Date.create('12:45 15/3/2012'), new Date(2012, 2, 15, 12, 45), 'Date#create | Dutch | slash format with time front');

  // Issue #150 Fully qualified ISO codes should be allowed
  dateEqual(Date.create('7 januari 2012', 'nl_NL'), new Date(2012, 0, 7), 'Date#create | Dutch | nl_NL');
  dateEqual(Date.create('7 januari 2012', 'nl-NL'), new Date(2012, 0, 7), 'Date#create | Dutch | nl-NL');

  // Issue #150 Unrecognized locales will result in invalid dates, but will not throw an error
  // Update: Now it will fall back to the current locale.
  equal(Date.create('7 januari 2012', 'ux_UX').isValid(), true, 'Date#create | Dutch | unknown locale code');
  equal(Date.create('2012/08/25', 'ux_UX').isValid(), true, 'Date#create | Dutch | System intelligible formats are still parsed');

  dateEqual(Date.create('17:32 18 augustus'), new Date(now.getFullYear(), 7, 18, 17, 32), 'Date#create | Dutch | August 18, 17:32');

  dateEqual(Date.create('morgen \'s 3:30'), getRelativeDate(null, null, 1).set({hours:3,minutes:30}, true), 'Date#create | Dutch | tomorrow at 3:30');

  equal((5).hours().duration('nl'), '5 uur', 'Date#create | Dutch | simple duration');

  equal(new Date().format('{tt}'), '', 'Date#format | Dutch | am/pm token should not raise an error');

});
