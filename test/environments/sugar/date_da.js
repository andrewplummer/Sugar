package('Date | Danish', function () {

  var now = new Date();
  testSetLocale('da');

  method('create', function() {
    dateEqual(testCreateDate('den 15. maj 2011'), new Date(2011, 4, 15), 'basic Danish date');
    dateEqual(testCreateDate('15 maj 2011'), new Date(2011, 4, 15), 'basic Danish date');
    dateEqual(testCreateDate('tirsdag 5 januar 2012'), new Date(2012, 0, 5), '2012-01-05'); 
    dateEqual(testCreateDate('tirsdag, 5 januar 2012'), new Date(2012, 0, 5), '2012-01-05');
    dateEqual(testCreateDate('maj 2011'), new Date(2011, 4), 'year and month');
    dateEqual(testCreateDate('15 maj'), new Date(now.getFullYear(), 4, 15), 'month and date');
    dateEqual(testCreateDate('2011'), new Date(2011, 0), 'year');
    dateEqual(testCreateDate('maj'), new Date(now.getFullYear(), 4), 'month');
    dateEqual(testCreateDate('mandag'), getDateWithWeekdayAndOffset(1), 'Monday');
    dateEqual(testCreateDate('15 maj 2011 3:45'), new Date(2011, 4, 15, 3, 45), 'basic Danish date 3:45');
    dateEqual(testCreateDate('15 maj 2011 3:45pm'), new Date(2011, 4, 15, 15, 45), 'basic Danish date 3:45pm');
    dateEqual(testCreateDate('for et millisekund siden'), getRelativeDate(null, null, null, null, null, null,-1), 'one millisecond ago');
    dateEqual(testCreateDate('for et sekund siden'), getRelativeDate(null, null, null, null, null, -1), 'one second ago');
    dateEqual(testCreateDate('for et minut siden'), getRelativeDate(null, null, null, null, -1), 'one minute ago');
    dateEqual(testCreateDate('for en time siden'), getRelativeDate(null, null, null, -1), 'one hour ago');
    dateEqual(testCreateDate('for en dag siden'), getRelativeDate(null, null, -1), 'one day ago');
    dateEqual(testCreateDate('for en uge siden'), getRelativeDate(null, null, -7), 'one week ago');
    dateEqual(testCreateDate('for en måned siden'), getRelativeDate(null, -1), 'one month ago');
    dateEqual(testCreateDate('for et år siden'), getRelativeDate(-1), 'one year ago');
    dateEqual(testCreateDate('et år siden'), getRelativeDate(-1), 'one year ago');
    dateEqual(testCreateDate('om 5 millisekunder'), getRelativeDate(null, null, null, null, null, null,5), 'five milliseconds from now');
    dateEqual(testCreateDate('om 5 sekunder'), getRelativeDate(null, null, null, null, null, 5), 'five seconds from now');
    dateEqual(testCreateDate('om 5 minutter'), getRelativeDate(null, null, null, null, 5), 'five minute from now');
    dateEqual(testCreateDate('om 5 timer'), getRelativeDate(null, null, null, 5), 'five hour from now');
    dateEqual(testCreateDate('om 5 dage'), getRelativeDate(null, null, 5), 'five day from now');
    dateEqual(testCreateDate('om 5 uger'), getRelativeDate(null, null, 35), 'five weeks from now');
    dateEqual(testCreateDate('om 5 måneder'), getRelativeDate(null, 5), 'five months from now');
    dateEqual(testCreateDate('om 5 år'), getRelativeDate(5), 'five years from now');
    dateEqual(testCreateDate('i forgårs'), run(getRelativeDate(null, null, -2), 'reset'), 'Danish | day before yesterday');
    dateEqual(testCreateDate('forgårs'), run(getRelativeDate(null, null, -2), 'reset'), 'day before yesterday');
    dateEqual(testCreateDate('i går'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('i dag'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('idag'), run(getRelativeDate(null, null, 0), 'reset'), 'today');
    dateEqual(testCreateDate('imorgen'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('i morgen'), run(getRelativeDate(null, null, 1), 'reset'), 'tomorrow');
    dateEqual(testCreateDate('i overmorgen'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');
    dateEqual(testCreateDate('i over morgen'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');
    dateEqual(testCreateDate('sidste uge'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('i sidste uge'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('næste uge'), getRelativeDate(null, null, 7), 'Next week');
    dateEqual(testCreateDate('naeste uge'), getRelativeDate(null, null, 7), 'Next week');
    dateEqual(testCreateDate('sidste måned'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('næste måned'), getRelativeDate(null, 1), 'Next month');
    dateEqual(testCreateDate('sidste år'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('næste år'), getRelativeDate(1), 'Next year');
    dateEqual(testCreateDate('sidste mandag'), getDateWithWeekdayAndOffset(1,  -7), 'last monday');
    dateEqual(testCreateDate('næste mandag'), getDateWithWeekdayAndOffset(1, 7), 'next monday');
    dateEqual(testCreateDate('i går'), run(getRelativeDate(null, null, -1), 'reset'), 'yesterday');
    dateEqual(testCreateDate('i overmorgen'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');
    dateEqual(testCreateDate('i over morgen'), run(getRelativeDate(null, null, 2), 'reset'), 'day after tomorrow');
    dateEqual(testCreateDate('sidste uge'), getRelativeDate(null, null, -7), 'Last week');
    dateEqual(testCreateDate('sidste måned'), getRelativeDate(null, -1), 'last month');
    dateEqual(testCreateDate('næste måned'), getRelativeDate(null, 1), 'Next month');
    dateEqual(testCreateDate('sidste år'), getRelativeDate(-1), 'Last year');
    dateEqual(testCreateDate('næste år'), getRelativeDate(1), 'Next year');
  });

  method('format', function() {
    test(testCreateDate('2001-06-14 3:45pm'), 'den 14. juni 2001 15:45', 'format');
    test(testCreateDate('2011-08-25'), ['{dd} {month} {yyyy}'], '25 august 2011', 'format');
  });

  method('relative', function() {
    test(testCreateDate('1 second ago', 'en'), '1 sekund siden');
    test(testCreateDate('1 minute ago', 'en'), '1 minut siden');
    test(testCreateDate('1 hour ago', 'en'), '1 time siden');
    test(testCreateDate('1 day ago', 'en'), '1 dag siden');
    test(testCreateDate('1 week ago', 'en'), '1 uge siden');
    test(testCreateDate('1 month ago', 'en'), '1 måned siden');
    test(testCreateDate('1 year ago', 'en'), '1 år siden');

    test(testCreateDate('5 seconds ago', 'en'), '5 sekunder siden');
    test(testCreateDate('5 minutes ago', 'en'), '5 minutter siden');
    test(testCreateDate('5 hours ago', 'en'), '5 timer siden');
    test(testCreateDate('5 days ago', 'en'), '5 dage siden');
    test(testCreateDate('3 weeks ago', 'en'), '3 uger siden');
    test(testCreateDate('5 weeks ago', 'en'), '1 måned siden');
    test(testCreateDate('5 months ago', 'en'), '5 måneder siden');
    test(testCreateDate('5 years ago', 'en'), '5 år siden');

    test(testCreateDate('1 second from now', 'en'), 'om 1 sekund');
    test(testCreateDate('1 minute from now', 'en'), 'om 1 minut');
    test(testCreateDate('1 hour from now', 'en'), 'om 1 time');
    test(testCreateDate('1 day from now', 'en'), 'om 1 dag');
    test(testCreateDate('1 week from now', 'en'), 'om 1 uge');
    testMonthsFromNow(1, 'om 1 måned', 'om 4 uger');
    test(testCreateDate('1 year from now', 'en'), 'om 1 år');

    test(testCreateDate('5 second from now', 'en'), 'om 5 sekunder')
    test(testCreateDate('5 minutes from now', 'en'), 'om 5 minutter');
    test(testCreateDate('5 hour from now', 'en'), 'om 5 timer');
    test(testCreateDate('5 day from now', 'en'), 'om 5 dage');
    test(testCreateDate('3 weeks from now', 'en'), 'om 3 uger');
    test(testCreateDate('5 weeks from now', 'en'), 'om 1 måned');
    testMonthsFromNow(5, 'om 5 måneder', 'om 4 måneder');
    test(testCreateDate('5 year from now', 'en'), 'om 5 år');
  });
});

package('Number | Danish Dates', function () {
  method('duration', function() {
    test(run(5, 'hours'), ['da'], '5 timer', 'simple duration');
  });
});
