test('Dates | Danish', function () {

  var now = new Date();
  Date.setLocale('da');

  dateEqual(
    Date.create('den 15. maj 2011'),
    new Date(2011, 4, 15),
    'Date#create | basic Danish date'
  );

  dateEqual(
    Date.create('15 maj 2011'),
    new Date(2011, 4, 15),
    'Date#create | basic Danish date'
  );

  dateEqual(Date.create('tirsdag 5 januar 2012'),
    new Date(2012, 0, 5),
    'Date#create | Danish | 2012-01-05'
  );

  dateEqual(
    Date.create('tirsdag, 5 januar 2012'),
    new Date(2012, 0, 5),
    'Date#create | Danish | 2012-01-05'
  );

  dateEqual(
    Date.create('maj 2011'),
    new Date(2011, 4),
    'Date#create | Danish | year and month'
  );

  dateEqual(
    Date.create('15 maj'),
    new Date(now.getFullYear(), 4, 15),
    'Date#create | Danish | month and date'
  );

  dateEqual(
    Date.create('2011'),
    new Date(2011, 0),
    'Date#create | Danish | year'
  );

  dateEqual(
    Date.create('maj'),
    new Date(now.getFullYear(), 4),
    'Date#create | Danish | month'
  );

  dateEqual(
    Date.create('mandag'),
    getDateWithWeekdayAndOffset(1),
    'Date#create | Danish | Monday'
  );

  dateEqual(
   Date.create('15 maj 2011 3:45'),
   new Date(2011, 4, 15, 3, 45),
   'Date#create | basic Danish date 3:45'
  );

  dateEqual(
    Date.create('15 maj 2011 3:45pm'),
    new Date(2011, 4, 15, 15, 45),
    'Date#create | basic Danish date 3:45pm'
  );

  dateEqual(
    Date.create('for et millisekund siden'),
    getRelativeDate(null, null, null, null, null, null,-1),
    'Date#create | Danish | one millisecond ago'
  );

  dateEqual(
    Date.create('for et sekund siden'),
    getRelativeDate(null, null, null, null, null, -1),
    'Date#create | Danish | one second ago'
  );

  dateEqual(
    Date.create('for et minut siden'),
    getRelativeDate(null, null, null, null, -1),
    'Date#create | Danish | one minute ago'
  );

  dateEqual(
    Date.create('for en time siden'),
    getRelativeDate(null, null, null, -1),
    'Date#create | Danish | one hour ago'
  );

  dateEqual(
    Date.create('for en dag siden'),
    getRelativeDate(null, null, -1),
    'Date#create | Danish | one day ago'
  );

  dateEqual(
    Date.create('for en uge siden'),
    getRelativeDate(null, null, -7),
    'Date#create | Danish | one week ago'
  );

  dateEqual(
    Date.create('for en måned siden'),
    getRelativeDate(null, -1),
    'Date#create | Danish | one month ago'
  );

  dateEqual(
    Date.create('for et år siden'),
    getRelativeDate(-1),
    'Date#create | Danish | one year ago'
  );

  dateEqual(
    Date.create('et år siden'),
    getRelativeDate(-1),
    'Date#create | Danish | one year ago'
  );

  dateEqual(
    Date.create('om 5 millisekunder'),
    getRelativeDate(null, null, null, null, null, null,5),
    'Date#create | Danish | five milliseconds from now'
  );

  dateEqual(
    Date.create('om 5 sekunder'),
    getRelativeDate(null, null, null, null, null, 5),
    'Date#create | Danish | five seconds from now'
  );

  dateEqual(
    Date.create('om 5 minutter'),
    getRelativeDate(null, null, null, null, 5),
    'Date#create | Danish | five minute from now'
  );

  dateEqual(
    Date.create('om 5 timer'),
    getRelativeDate(null, null, null, 5),
    'Date#create | Danish | five hour from now'
  );

  dateEqual(
    Date.create('om 5 dage'),
    getRelativeDate(null, null, 5),
    'Date#create | Danish | five day from now'
  );

  dateEqual(
    Date.create('om 5 uger'),
    getRelativeDate(null, null, 35),
    'Date#create | Danish | five weeks from now'
  );

  dateEqual(
    Date.create('om 5 måneder'),
    getRelativeDate(null, 5),
    'Date#create | Danish | five months from now'
  );

  dateEqual(
    Date.create('om 5 år'),
    getRelativeDate(5),
    'Date#create | Danish | five years from now'
  );

  dateEqual(
    Date.create('i forgårs'),
    getRelativeDate(null, null, -2).reset(),
    'Date#create | Danish | day before yesterday'
  );

  dateEqual(
    Date.create('forgårs'),
    getRelativeDate(null, null, -2).reset(),
    'Date#create | Danish | day before yesterday'
  );

  dateEqual(
    Date.create('i går'),
    getRelativeDate(null, null, -1).reset(),
    'Date#create | Danish | yesterday'
  );

  dateEqual(
    Date.create('i dag'),
    getRelativeDate(null, null, 0).reset(),
    'Date#create | Danish | today'
  );

  dateEqual(
    Date.create('idag'),
    getRelativeDate(null, null, 0).reset(),
    'Date#create | Danish | today'
  );

  dateEqual(
    Date.create('imorgen'),
    getRelativeDate(null, null, 1).reset(),
    'Date#create | Danish | tomorrow'
  );

  dateEqual(
    Date.create('i morgen'),
    getRelativeDate(null, null, 1).reset(),
    'Date#create | Danish | tomorrow'
  );

  dateEqual(
    Date.create('i overmorgen'),
    getRelativeDate(null, null, 2).reset(),
    'Date#create | Danish | day after tomorrow'
  );

  dateEqual(
    Date.create('i over morgen'),
    getRelativeDate(null, null, 2).reset(),
    'Date#create | Danish | day after tomorrow'
  );

  dateEqual(
    Date.create('sidste uge'),
    getRelativeDate(null, null, -7),
    'Date#create | Danish | Last week'
  );

  dateEqual(
    Date.create('i sidste uge'),
    getRelativeDate(null, null, -7),
    'Date#create | Danish | Last week'
  );

  dateEqual(
    Date.create('næste uge'),
    getRelativeDate(null, null, 7),
    'Date#create | Danish | Next week'
  );

  dateEqual(
    Date.create('naeste uge'),
    getRelativeDate(null, null, 7),
    'Date#create | Danish | Next week'
  );

  dateEqual(
    Date.create('sidste måned'),
    getRelativeDate(null, -1),
    'Date#create | Danish | last month'
  );

  dateEqual(
    Date.create('næste måned'),
    getRelativeDate(null, 1),
    'Date#create | Danish | Next month'
  );

  dateEqual(
    Date.create('sidste år'),
    getRelativeDate(-1),
    'Date#create | Danish | Last year'
  );

  dateEqual(
    Date.create('næste år'),
    getRelativeDate(1),
    'Date#create | Danish | Next year'
  );

  dateEqual(
    Date.create('sidste mandag'),
    getDateWithWeekdayAndOffset(1,  -7),
    'Date#create | Danish | last monday'
  );

  dateEqual(
    Date.create('næste mandag'),
    getDateWithWeekdayAndOffset(1, 7),
    'Date#create | Danish | next monday'
  );
  
  dateEqual(
    Date.create('i går'),
    getRelativeDate(null, null, -1).reset(),
    'Date#create | Danish | yesterday'
  );

  dateEqual(
    Date.create('i overmorgen'),
    getRelativeDate(null, null, 2).reset(),
    'Date#create | Danish | day after tomorrow'
  );

  dateEqual(
    Date.create('i over morgen'),
    getRelativeDate(null, null, 2).reset(),
    'Date#create | Danish | day after tomorrow'
  );

  
  dateEqual(
    Date.create('sidste uge'),
    getRelativeDate(null, null, -7),
    'Date#create | Danish | Last week'
  );

  dateEqual(
    Date.create('i sidste uge'),
    getRelativeDate(null, null, -7),
    'Date#create | Danish | Last week'
  );

  dateEqual(
    Date.create('sidste måned'),
    getRelativeDate(null, -1),
    'Date#create | Danish | last month'
  );

  dateEqual(
    Date.create('næste måned'),
    getRelativeDate(null, 1),
    'Date#create | Danish | Next month'
  );

  dateEqual(
    Date.create('sidste år'),
    getRelativeDate(-1),
    'Date#create | Danish | Last year'
  );

  dateEqual(
    Date.create('næste år'),
    getRelativeDate(1),
    'Date#create | Danish | Next year'
  );

  equal(
    Date.create('2001-06-14 3:45pm').format(),
    'den 14. juni 2001 15:45',
    'Date#create | Danish | format'
  );

  equal(
    Date.create('2011-08-25').format('{dd} {month} {yyyy}'),
    '25 august 2011',
    'Date#create | Danish | format'
  );

  equal(
    Date.create('1 second ago', 'en').relative(),
    '1 sekund siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('1 minute ago', 'en').relative(),
    '1 minut siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('1 hour ago', 'en').relative(),
    '1 time siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('1 day ago', 'en').relative(),
    '1 dag siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('1 week ago', 'en').relative(),
    '1 uge siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('1 month ago', 'en').relative(),
    '1 måned siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('1 year ago', 'en').relative(),
    '1 år siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('5 seconds ago', 'en').relative(),
    '5 sekunder siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('5 minutes ago', 'en').relative(),
    '5 minutter siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('5 hours ago', 'en').relative(),
    '5 timer siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('5 days ago', 'en').relative(),
    '5 dage siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('3 weeks ago', 'en').relative(),
    '3 uger siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('5 weeks ago', 'en').relative(),
    '1 måned siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('5 months ago', 'en').relative(),
    '5 måneder siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('5 years ago', 'en').relative(),
    '5 år siden',
    'Date#create | Danish | relative format past'
  );

  equal(
    Date.create('1 second from now', 'en').relative(),
    'om 1 sekund',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('1 minute from now', 'en').relative(),
    'om 1 minut',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('1 hour from now', 'en').relative(),
    'om 1 time',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('1 day from now', 'en').relative(),
    'om 1 dag',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('1 week from now', 'en').relative(),
    'om 1 uge',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('1 month from now', 'en').relative(),
    'om 1 måned',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('1 year from now', 'en').relative(),
    'om 1 år',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('5 second from now', 'en').relative(),
    'om 5 sekunder',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('5 minutes from now', 'en').relative(),
    'om 5 minutter',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('5 hour from now', 'en').relative(),
    'om 5 timer',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('5 day from now', 'en').relative(),
    'om 5 dage',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('3 weeks from now', 'en').relative(),
    'om 3 uger',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('5 weeks from now', 'en').relative(),
    'om 1 måned',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('5 month from now', 'en').relative(),
    'om 5 måneder',
    'Date#create | Danish | relative format future'
  );

  equal(
    Date.create('5 year from now', 'en').relative(),
    'om 5 år',
    'Date#create | Danish | relative format future'
  );

  equal(
    (5).hours().duration('da'),
    '5 timer',
    'Date#create | Danish | simple duration'
  );
});
