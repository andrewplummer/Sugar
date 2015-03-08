package('Dates Danish', function () {
  "use strict";

  var now;

  setup(function() {
    now = new Date();
    testSetLocale('da');
  });

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
    assertRelative('1 second ago', '1 sekund siden');
    assertRelative('1 minute ago', '1 minut siden');
    assertRelative('1 hour ago', '1 time siden');
    assertRelative('1 day ago', '1 dag siden');
    assertRelative('1 week ago', '1 uge siden');
    assertRelative('1 month ago', '1 måned siden');
    assertRelative('1 year ago', '1 år siden');

    assertRelative('5 seconds ago', '5 sekunder siden');
    assertRelative('5 minutes ago', '5 minutter siden');
    assertRelative('5 hours ago', '5 timer siden');
    assertRelative('5 days ago', '5 dage siden');
    assertRelative('3 weeks ago', '3 uger siden');
    assertRelative('5 weeks ago', '1 måned siden');
    assertRelative('5 months ago', '5 måneder siden');
    assertRelative('5 years ago', '5 år siden');

    assertRelative('1 second from now', 'om 1 sekund');
    assertRelative('1 minute from now', 'om 1 minut');
    assertRelative('1 hour from now', 'om 1 time');
    assertRelative('1 day from now', 'om 1 dag');
    assertRelative('1 week from now', 'om 1 uge');
    assertRelative('1 year from now', 'om 1 år');

    assertRelative('5 second from now', 'om 5 sekunder')
    assertRelative('5 minutes from now', 'om 5 minutter');
    assertRelative('5 hour from now', 'om 5 timer');
    assertRelative('5 day from now', 'om 5 dage');
    assertRelative('3 weeks from now', 'om 3 uger');
    assertRelative('5 weeks from now', 'om 1 måned');
    assertRelative('5 year from now', 'om 5 år');
  });
});

package('Number | Danish Dates', function () {
  method('duration', function() {
    test(run(5, 'hours'), ['da'], '5 timer', 'simple duration');
  });
});
