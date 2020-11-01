namespace('Date', function () {
  'use strict';

  var now = new Date();
  var thisYear = now.getFullYear();

  group('Create | Invalid Dates', function() {

    testCreateFakeLocale('fo');

    equal(run(testCreateDate('my pants'), 'isToday'), undefined, 'isToday | invalid dates should return false');
    equal(run(testCreateDate('my pants'), 'isTomorrow'), undefined, 'isTomorrow | invalid dates should return false');
    equal(run(testCreateDate('my pants'), 'is', ['today']), undefined, 'is | invalid dates should return false');

    // Issue #264

    testSetLocale('fo');
    equal(run(testCreateDate(), 'isToday'), true, 'isToday should always work regardless of locale');
    equal(run(testCreateDate('yesterday', 'en'), 'isYesterday'), true, 'isYesterday should always work regardless of locale');
    equal(run(testCreateDate('tomorrow', 'en'), 'isTomorrow'), true, 'isTomorrow should always work regardless of locale');
    equal(run(testCreateDate('monday', 'en'), 'isMonday'), true, 'isMonday should always work regardless of locale');
    equal(run(testCreateDate('tuesday', 'en'), 'isTuesday'), true, 'isTuesday should always work regardless of locale');
    equal(run(testCreateDate('wednesday', 'en'), 'isWednesday'), true, 'isWednesday should always work regardless of locale');
    equal(run(testCreateDate('thursday', 'en'), 'isThursday'), true, 'isThursday should always work regardless of locale');
    equal(run(testCreateDate('friday', 'en'), 'isFriday'), true, 'isFriday should always work regardless of locale');
    equal(run(testCreateDate('saturday', 'en'), 'isSaturday'), true, 'isSaturday should always work regardless of locale');
    equal(run(testCreateDate('sunday', 'en'), 'isSunday'), true, 'isSunday should always work regardless of locale');
    testSetLocale('en');

  });


  // TODO: handle this
  // Issue #141 future/past preference

  method('get', function() {
    var d = new Date('August 25, 2010 11:45:20');

    test(d, ['next week'], new Date('September 1, 2010 11:45:20'), 'next week');
    test(d, ['next monday'], new Date('August 30, 2010'), 'next monday');

    test(d, ['5 milliseconds ago'], new Date(2010, 7, 25, 11, 45, 19, 995), '5 milliseconds ago');
    test(d, ['5 seconds ago'], new Date('August 25, 2010 11:45:15'), '5 seconds ago');
    test(d, ['5 minutes ago'], new Date('August 25, 2010 11:40:20'), '5 minutes ago');
    test(d, ['5 hours ago'], new Date('August 25, 2010 6:45:20'), '5 hours ago');
    test(d, ['5 days ago'], new Date('August 20, 2010 11:45:20'), '5 days ago');
    test(d, ['5 weeks ago'], new Date('July 21, 2010 11:45:20'), '5 weeks ago');
    test(d, ['5 months ago'], new Date('March 25, 2010 11:45:20'), '5 months ago');
    test(d, ['5 years ago'], new Date('August 25, 2005 11:45:20'), '5 years ago');
    test(d, ['5 years before'], new Date('August 25, 2005 11:45:20'), '5 years before');

    test(d, ['5 milliseconds from now'], new Date(2010, 7, 25, 11, 45, 20, 5), '5 milliseconds from now');
    test(d, ['5 seconds from now'], new Date('August 25, 2010 11:45:25'), '5 seconds from now');
    test(d, ['5 minutes from now'], new Date('August 25, 2010 11:50:20'), '5 minutes from now');
    test(d, ['5 hours from now'], new Date('August 25, 2010 16:45:20'), '5 hours from now');
    test(d, ['5 days from now'], new Date('August 30, 2010 11:45:20'), '5 days from now');
    test(d, ['5 weeks from now'], new Date('September 29, 2010 11:45:20'), '5 weeks from now');
    test(d, ['5 months from now'], new Date('January 25, 2011 11:45:20'), '5 months from now');
    test(d, ['5 years from now'], new Date('August 25, 2015 11:45:20'), '5 years from now');
    test(d, ['5 years after'], new Date('August 25, 2015 11:45:20'), '5 years after');

    var d1 = run(new Date(Date.UTC(2010, 7, 25)), 'setUTC', [true]);
    var d2 = run(d1, 'get', ['tomorrow']);
    equal(d2, new Date(Date.UTC(2010, 7, 26)), 'date should be taken as UTC');
    equal(testIsUTC(d2), true, 'utc flag should be preserved');

    var d1 = run(new Date(Date.UTC(2010, 7, 25)), 'setUTC', [true]);
    var d2 = run(d1, 'get', ['tomorrow', { fromUTC: false, setUTC: false }]);
    // d1 may be Aug 24th or Aug 25th depending on the timezone.
    equal(d2, new Date(2010, 7, d1.getDate() + 1), 'fromUTC can override utc preservation');
    equal(testIsUTC(d2), false, 'setUTC can override utc preservation');

    // Issue #620 - Get with preference
    test(new Date(1833, 11, 1), ['December', { past: true }], new Date(1832, 11, 1), 'Preference option should work');
    test(new Date(2017, 7, 14), ['Saturday', { past: true }], new Date(2017, 7, 12), 'Preference option should work');
  });

  method('getUTCOffset', function() {
    var d = new Date('August 5, 2010 04:03:02');
    test(d, getExpectedTimezoneOffset(d), 'no colon');
    test(d, [true], getExpectedTimezoneOffset(d, true), 'colon');
  });

  method('relativeTo', function() {

    testCreateFakeLocale('fo');

    var d = new Date(2016,3,14,22,47,52,500);

    assertRelativeTo(d, [new Date(2015,3,14,22,47,52,500)], '1 year');
    assertRelativeTo(d, [new Date(2016,2,14,22,47,52,500)], '1 month');
    assertRelativeTo(d, [new Date(2016,3,13,22,47,52,500)], '1 day');
    assertRelativeTo(d, [new Date(2016,3,14,21,47,52,500)], '1 hour');
    assertRelativeTo(d, [new Date(2016,3,14,22,46,52,500)], '1 minute');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,51,500)], '1 second');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,51,499)], '1 second');

    assertRelativeTo(d, [new Date(2017,3,14,22,47,52,500)], '1 year');
    assertRelativeTo(d, [new Date(2016,4,14,22,47,52,500)], '1 month');
    assertRelativeTo(d, [new Date(2016,3,15,22,47,52,500)], '1 day');
    assertRelativeTo(d, [new Date(2016,3,14,23,47,52,500)], '1 hour');
    assertRelativeTo(d, [new Date(2016,3,14,22,48,52,500)], '1 minute');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,53,500)], '1 second');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,51,501)], '1 second');

    assertRelativeTo(d, [new Date(2017,0)], '8 months');
    assertRelativeTo(d, [new Date(2000,0)], '16 years');

    assertRelativeTo(d, [new Date(2017,3,14,22,47,52,500), 'fo'], '1domomoney');
    assertRelativeTo(d, [new Date(2016,4,14,22,47,52,500), 'fo'], '1timomoney');
    assertRelativeTo(d, [new Date(2016,3,15,22,47,52,500), 'fo'], '1somomoney');
    assertRelativeTo(d, [new Date(2016,3,14,23,47,52,500), 'fo'], '1famomoney');
    assertRelativeTo(d, [new Date(2016,3,14,22,48,52,500), 'fo'], '1mimomoney');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,53,500), 'fo'], '1remomoney');
    assertRelativeTo(d, [new Date(2016,3,14,22,47,51,501), 'fo'], '1remomoney');

    assertRelativeTo(new Date(2010,0,18), ['The first day of January, 2010'], '2 weeks');
    assertRelativeTo(new Date(2010,0),    ['August 10, 2010'], '7 months');

    assertRelativeTo(new Date(), ['last week'],  '1 week',  true);
    assertRelativeTo(new Date(), ['last month'], '1 month', true);
    assertRelativeTo(new Date(), ['last year'],  '1 year',  true);

    assertRelativeTo(new Date(), ['next week'],  '1 week');
    assertRelativeTo(new Date(), ['next month'], '1 month');
    assertRelativeTo(new Date(), ['next year'],  '1 year');

    raisesError(function(){ test(new Date(NaN)); }, 'Invalid date raises error', TypeError);

  });

  method('is', function() {

    var d = new Date(2010,7,5,13,45,2,542);

    test(d, ['nonsense'], false, 'nonsense');
    test(d, ['August'], true, 'August');
    test(d, ['August 5th, 2010'], true, 'August 5th, 2010');
    test(d, ['August 5th, 2010 13:45'], true, 'August 5th, 2010, 13:45');
    test(d, ['August 5th, 2010 13:45:02'], true, 'August 5th 2010, 13:45:02');
    test(d, ['August 5th, 2010 13:45:02.542'], true, 'August 5th 2010, 13:45:02:542');
    test(d, ['September'], false, 'September');
    test(d, ['August 6th, 2010'], false, 'August 6th, 2010');
    test(d, ['August 5th, 2010 13:46'], false, 'August 5th, 2010, 13:46');
    test(d, ['August 5th, 2010 13:45:03'], false, 'August 5th 2010, 13:45:03');
    test(d, ['August 5th, 2010 13:45:03.543'], false, 'August 5th 2010, 13:45:03:543');
    test(d, ['July'], false, 'July');
    test(d, ['August 4th, 2010'], false, 'August 4th, 2010');
    test(d, ['August 5th, 2010 13:44'], false, 'August 5th, 2010, 13:44');
    test(d, ['August 5th, 2010 13:45:01'], false, 'August 5th 2010, 13:45:01');
    test(d, ['August 5th, 2010 13:45:03.541'], false, 'August 5th 2010, 13:45:03:541');
    test(d, ['2010'], true, '2010');
    test(d, ['today'], false, 'today');
    test(d, ['now'], false, 'now');
    test(d, ['weekday'], true, 'weekday');
    test(d, ['weekend'], false, 'weekend');
    test(d, ['Thursday'], true, 'Thursday');
    test(d, ['Friday'], false, 'Friday');

    test(d, [d], true, 'self is true');
    test(d, [new Date(2010,7,5,13,45,2,542)], true, 'equal date is true');
    test(d, [new Date()], false, 'other dates are not true');
    test(d, [1281015902542 + (d.getTimezoneOffset() * 60 * 1000)], true, 'timestamps also accepted');

    test(new Date(), ['now', 10], true, 'now is now');
    test(new Date(2010,7,5,13,42,42,324), ['August 5th, 2010 13:42:42.324'], true, 'August 5th, 2010 13:42:42.324');
    test(new Date(2010,7,5,13,42,42,324), ['August 5th, 2010 13:42:42.319'], false, 'August 5th, 2010 13:42:42.319');
    test(new Date(2010,7,5,13,42,42,324), ['August 5th, 2010 13:42:42.325'], false, 'August 5th, 2010 13:42:42.325');
    test(new Date(2010,7,5,13,42,42,324), ['August 5th, 2010 13:42:42.323'], false, 'August 5th, 2010 13:42:42.323');

    test(new Date(2001, 0), ['the beginning of 2001'], true, 'the beginning of 2001');
    test(new Date(now.getFullYear(), 2), ['the beginning of March'], true, 'the beginning of March');
    test(new Date(2001, 11, 31, 23, 59, 59, 999), ['the end of 2001'], true, 'the end of 2001');
    test(new Date(now.getFullYear(), 2, 31, 23, 59, 59, 999), ['the end of March'], true, 'the end of March');
    test(new Date(2001, 11, 31), ['the last day of 2001'], true, 'the last day of 2001');
    test(new Date(now.getFullYear(), 2, 31), ['the last day of March'], true, 'the last day of March');

    test(testCreateDate('the beginning of the week'), ['the beginning of the week'], true, 'the beginning of the week is the beginning of the week');
    test(testCreateDate('the end of the week'), ['the end of the week'], true, 'the end of the week is the end of the week');
    test(testCreateDate('tuesday'), ['the beginning of the week'], false, 'tuesday is the beginning of the week');
    test(testCreateDate('tuesday'), ['the end of the week'], false, 'tuesday is the end of the week');

    test(testCreateDate('sunday'), ['the beginning of the week'], true, 'sunday is the beginning of the week');

    test(testCreateDate('tuesday'), ['tuesday'], true, 'tuesday is tuesday');
    test(testCreateDate('sunday'), ['sunday'], true, 'sunday is sunday');
    test(testCreateDate('saturday'), ['saturday'], true, 'saturday is saturday');

    test(testGetWeekday(0), ['the beginning of the week'], true, 'the beginning of the week');
    test(testGetWeekday(6, 0, 23, 59, 59, 999), ['the end of the week'], true, 'the end of the week');

    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,431)], false, 'accuracy | accurate to millisecond by default | 431');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432)], true, 'accuracy |  accurate to millisecond by default | 432');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,433)], false, 'accuracy | accurate to millisecond by default | 433');

    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,431), 2], true, 'accuracy | accuracy can be overridden | 431');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432), 2], true, 'accuracy | accuracy can be overridden | 432');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,433), 2], true, 'accuracy | accuracy can be overridden | 433');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,429), 2], false, 'accuracy | accuracy can be overridden but still is constrained');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,435), 2], false, 'accuracy | accuracy can be overridden but still is constrained');


    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,431), -500], false, 'accuracy | negative accuracy reverts to zero');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432), -500], true, 'accuracy | negative accuracy reverts to zero');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,433), -500], false, 'accuracy | negative accuracy reverts to zero');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,429), -500], false, 'accuracy | negative accuracy reverts to zero');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,435), -500], false, 'accuracy | negative accuracy reverts to zero');


    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432), 86400000], true, 'accuracy | accurate to a day');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,23,3,1,432), 86400000], true, 'accuracy | accurate to a day');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,21,3,1,432), 86400000], true, 'accuracy | accurate to a day');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,14,22,3,1,432), 86400000], true, 'accuracy | accurate to a day');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,16,22,3,1,432), 86400000], true, 'accuracy | accurate to a day');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,14,22,3,1,431), 86400000], false, 'accuracy | accurate to a day is still contstrained');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,16,22,3,1,433), 86400000], false, 'accuracy | accurate to a day is still contstrained');

    test(new Date(1970,4,15,22,3,1,432), [new Date(1969,4,14,22,3,2,432), 31536000000], false, 'accuracy | 1969 accurate to a year is still contstrained');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1969,4,15,22,3,1,432), 31536000000], true, 'accuracy | 1969 accurate to a year');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432), 31536000000], true, 'accuracy | 1970 accurate to a year');

    // Indianapolis went off DST during this year, so this test is also a good
    // measurement of DST traversal that can happen between years.
    test(new Date(1970,4,15,22,3,1,432), [new Date(1971,4,15,22,3,1,432), 31536000000], true, 'accuracy | 1971 accurate to a year');
    test(new Date(1971,4,15,22,3,1,432), [new Date(1970,4,15,22,3,1,432), 31536000000], true, 'accuracy | 1971 accurate to a year');
    test(new Date(1970,4,15,22,3,1,432), [new Date(1971,4,15,22,3,1,433), 31536000000], false, 'accuracy | 1971 accurate to a year');
    test(new Date(1971,4,15,22,3,1,433), [new Date(1970,4,15,22,3,1,432), 31536000000], false, 'accuracy | 1971 accurate to a year');

    test(new Date(1970,4,15,22,3,1,432), [new Date(1971,4,16,22,3,1,432), 31536000000], false, 'accuracy | 1971 accurate to a year is still contstrained');


    // Note that relative #is formats can only be considered to be accurate to within a few milliseconds
    // to avoid complications rising from the date being created momentarily after the function is called.
    test(getRelativeDate(0,0,0,0,0,0, -5), ['3 milliseconds ago'], false, '3 milliseconds ago is accurate to milliseconds');
    test(getRelativeDate(0,0,0,0,0,0, -5), ['5 milliseconds ago', 5], true, '5 milliseconds ago is accurate to milliseconds');
    test(getRelativeDate(0,0,0,0,0,0, -5), ['7 milliseconds ago'], false, '7 milliseconds ago is accurate to milliseconds');

    test(getRelativeDate(0,0,0,0,0,-5), ['4 seconds ago'], false, '4 seconds ago is not 5 seconds ago');
    test(getRelativeDate(0,0,0,0,0,-5), ['5 seconds ago'], true, '5 seconds ago is 5 seconds ago');
    test(getRelativeDate(0,0,0,0,0,-5), ['6 seconds ago'], false, '6 seconds ago is not 5 seconds ago');
    test(getRelativeDate(0,0,0,0,0,-5), ['7 seconds ago'], false, '7 seconds ago is not 5 seconds ago');

    test(getRelativeDate(0,0,0,0,-5), ['4 minutes ago'], false, '4 minutes ago is not 5 minutes ago');
    test(getRelativeDate(0,0,0,0,-5), ['5 minutes ago'], true, '5 minutes ago is 5 minutes ago');
    test(getRelativeDate(0,0,0,0,-5), ['6 minutes ago'], false, '6 minutes ago is not 5 minutes ago');
    test(getRelativeDate(0,0,0,0,-5), ['7 minutes ago'], false, '7 minutes ago is not 5 minutes ago');

    test(getRelativeDate(0,0,0,-5), ['4 hours ago'], false, '4 hours ago is not 5 hours ago');
    test(getRelativeDate(0,0,0,-5), ['5 hours ago'], true, '5 hours ago is 5 hours ago');
    test(getRelativeDate(0,0,0,-4, -45), ['5 hours ago'], true, '4:45 hours ago is still 5 hours ago');
    test(getRelativeDate(0,0,0,-5), ['6 hours ago'], false, '6 hours ago is not 5 hours ago');
    test(getRelativeDate(0,0,0,-5), ['7 hours ago'], false, '7 hours ago is not 5 hours ago');

    test(getRelativeDate(0,0,-5), ['4 days ago'], false, '4 days ago is not 5 days ago');
    test(getRelativeDate(0,0,-5), ['5 days ago'], true, '5 days ago is 5 hours ago');
    test(getRelativeDate(0,0,-5), ['6 days ago'], false, '6 days ago is not 5 days ago');
    test(getRelativeDate(0,0,-5), ['7 days ago'], false, '7 days ago is not 5 days ago');

    test(getRelativeDate(0,-5), ['4 months ago'], false, '4 months ago is not 5 months ago');
    test(getRelativeDate(0,-5), ['5 months ago'], true, '5 months ago is 5 months ago');
    test(getRelativeDate(0,-5), ['6 months ago'], false, '6 months ago is not 5 months ago');
    test(getRelativeDate(0,-5), ['7 months ago'], false, '7 months ago is accurate to months');

    test(getRelativeDate(-5), ['4 years ago'], false, '4 years ago is not 5 years ago');
    test(getRelativeDate(-5), ['5 years ago'], true, '5 years ago is 5 years ago');
    test(getRelativeDate(-5), ['6 years ago'], false, '6 years ago is not 5 years ago');
    test(getRelativeDate(-5), ['7 years ago'], false, '7 years ago is not 5 years ago');

    test(testCreateDate('tomorrow'), ['future'], true, 'tomorrow is the future');
    test(testCreateDate('tomorrow'), ['past'], false, 'tomorrow is not the past');

    // Note: not testing "now is not the past" as it can be affected by CPU lag
    test(new Date(), ['future'], false, 'now is not the future');

    // test(new Date(), ['past'], false, 'now is the past');

    test(testCreateDate('yesterday'), ['future'], false, 'yesterday is not the future');
    test(testCreateDate('yesterday'), ['past'], true, 'yesterday is the past');

    test(testCreateDate('monday'), ['weekday'], true, 'monday is a weekday');
    test(testCreateDate('monday'), ['weekend'], false, 'monday is not a weekend');

    test(testCreateDate('friday'), ['weekday'], true, 'friday is a weekday');
    test(testCreateDate('friday'), ['weekend'], false, 'friday is not a weekend');

    test(testCreateDate('saturday'), ['weekday'], false, 'saturday is not a weekday');
    test(testCreateDate('saturday'), ['weekend'], true, 'saturday is a weekend');

    test(testCreateDate('sunday'), ['weekday'], false, 'sunday is not a weekday');
    test(testCreateDate('sunday'), ['weekend'], true, 'sunday is a weekend');

    test(new Date(2001,5,4,12,22,34,445), [new Date(2001,5,4,12,22,34,445)], true, 'straight dates passed in are accurate to the millisecond');
    test(new Date(2001,5,4,12,22,34,445), [new Date(2001,5,4,12,22,34,444)], false, 'straight dates passed in are accurate to the millisecond');
    test(new Date(2001,5,4,12,22,34,445), [new Date(2001,5,4,12,22,34,446)], false, 'straight dates passed in are accurate to the millisecond');

    test(testCreateDate('3 hours ago'), ['now', 'bloopie'], false, 'does not die on string-based precision');

    test(new Date(2001, 5, 4), [{ year: 2001 }], true, 'is 2001 by object');

    // Issue #160
    test(testCreateDate('12/01/2013'), ['November 2013'], false, 'December 2013 is not November 2013');

  });

  group('Since/Until', function() {

    var d = new Date(2010,7,5,13,45,2,542);

    equal(run(new Date(2010,7,5,13,45,2,543),  'millisecondsSince', [d]), 1, '1 milliseconds since');
    equal(run(new Date(2010,7,5,13,45,2,541),  'millisecondsUntil', [d]), 1, '1 milliseconds until');
    equal(run(new Date(2010,7,5,13,45,3,542),  'secondsSince', [d]), 1, '1 seconds since');
    equal(run(new Date(2010,7,5,13,45,1,542),  'secondsUntil', [d]), 1, '1 seconds until');
    equal(run(new Date(2010,7,5,13,46,2,542),  'minutesSince', [d]), 1, '1 minutes since');
    equal(run(new Date(2010,7,5,13,44,2,542),  'minutesUntil', [d]), 1, '1 minutes until');
    equal(run(new Date(2010,7,5,14,45,2,542),  'hoursSince', [d]), 1, '1 hours since');
    equal(run(new Date(2010,7,5,12,45,2,542),  'hoursUntil', [d]), 1, '1 hours until');
    equal(run(new Date(2010,7,6,13,45,2,542),  'daysSince', [d]), 1, '1 days since');
    equal(run(new Date(2010,7,4,13,45,2,542),  'daysUntil', [d]), 1, '1 days until');
    equal(run(new Date(2010,7,12,13,45,2,542), 'weeksSince', [d]), 1, '1 weeks since');
    equal(run(new Date(2010,6,29,13,45,2,542), 'weeksUntil', [d]), 1, '1 weeks until');
    equal(run(new Date(2010,8,5,13,45,2,542),  'monthsSince', [d]), 1, '1 months since');
    equal(run(new Date(2010,6,5,13,45,2,542),  'monthsUntil', [d]), 1, '1 months until');
    equal(run(new Date(2011,7,5,13,45,2,542),  'yearsSince', [d]), 1, '1 years since');
    equal(run(new Date(2009,7,5,13,45,2,542),  'yearsUntil', [d]), 1, '1 years until');

    var shift = testGetTimezoneDiff(d, new Date(2011,7,5,13,45,2,542));

    equal(run(new Date(2011,7,5,13,45,2,542), 'millisecondsSince', [d]), 31536000000 + shift, 'milliseconds since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'millisecondsUntil', [d]), -31536000000 - shift, 'milliseconds until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'secondsSince', [d]), 31536000 + (shift / 1000), 'seconds since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'secondsUntil', [d]), -31536000 - (shift / 1000), 'seconds until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'minutesSince', [d]), 525600 + (shift / 1000 / 60), 'minutes since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'minutesUntil', [d]), -525600 - (shift / 1000 / 60), 'minutes until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'hoursSince', [d]), 8760 + (shift / 1000 / 60 / 60), 'hours since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'hoursUntil', [d]), -8760 - (shift / 1000 / 60 / 60), 'hours until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'daysSince', [d]), 365, 'days since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'daysUntil', [d]), -365, 'days until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'weeksSince', [d]), 52, 'weeks since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'weeksUntil', [d]), -52, 'weeks until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'monthsSince', [d]), 12, 'months since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'monthsUntil', [d]), -12, 'months until a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'yearsSince', [d]), 1, 'years since a year before');
    equal(run(new Date(2011,7,5,13,45,2,542), 'yearsUntil', [d]), -1, 'years until a year before');



    equal(run(new Date(2010,7, 5,13,45,2,543), 'millisecondsFromNow', [d]), 1, '| FromNow alias | milliseconds');
    equal(run(new Date(2010,7, 5,13,45,2,541), 'millisecondsAgo', [d]), 1, 'om now alias | milliseconds');
    equal(run(new Date(2010,7, 5,13,45,3,542), 'secondsFromNow', [d]), 1, '| FromNow alias | seconds');
    equal(run(new Date(2010,7, 5,13,45,1,542), 'secondsAgo', [d]), 1, 'o alias | seconds');
    equal(run(new Date(2010,7, 5,13,46,2,542), 'minutesFromNow', [d]), 1, '| FromNow alias | minutes');
    equal(run(new Date(2010,7, 5,13,44,2,542), 'minutesAgo', [d]), 1, 'o alias | minutes');
    equal(run(new Date(2010,7, 5,14,45,2,542), 'hoursFromNow', [d]), 1, '| FromNow alias | hours');
    equal(run(new Date(2010,7, 5,12,45,2,542), 'hoursAgo', [d]), 1, 'o alias | hours');
    equal(run(new Date(2010,7, 6,13,45,2,542), 'daysFromNow', [d]), 1, '| FromNow alias | days');
    equal(run(new Date(2010,7, 4,13,45,2,542), 'daysAgo', [d]), 1, 'o alias | days');
    equal(run(new Date(2010,7,12,13,45,2,542), 'weeksFromNow', [d]), 1, '| FromNow alias | weeks');
    equal(run(new Date(2010,6,29,13,45,2,542), 'weeksAgo', [d]), 1, 'o alias | weeks');
    equal(run(new Date(2010,8, 5,13,45,2,542), 'monthsFromNow', [d]), 1, '| FromNow alias | months');
    equal(run(new Date(2010,6, 5,13,45,2,542), 'monthsAgo', [d]), 1, 'o alias | months');
    equal(run(new Date(2011,7, 5,13,45,2,542), 'yearsFromNow', [d]), 1, '| FromNow alias | years');
    equal(run(new Date(2009,7, 5,13,45,2,542), 'yearsAgo', [d]), 1, 'o alias | years');

    var shift = testGetTimezoneDiff(new Date(2011, 11, 31), d);

    // Works with Date.create?
    equal(run(d, 'millisecondsSince', ['the last day of 2011']), -44273697458 + shift, 'milliseconds since the last day of 2011');
    equal(run(d, 'millisecondsUntil', ['the last day of 2011']), 44273697458 - shift, 'milliseconds until the last day of 2011');
    equal(run(d, 'secondsSince', ['the last day of 2011']), -44273697 + (shift / 1000), 'seconds since the last day of 2011');
    equal(run(d, 'secondsUntil', ['the last day of 2011']), 44273697 - (shift / 1000), 'seconds until the last day of 2011');
    equal(run(d, 'minutesSince', ['the last day of 2011']), -737894 + (shift / 60 / 1000), 'minutes since the last day of 2011');
    equal(run(d, 'minutesUntil', ['the last day of 2011']), 737894 - (shift / 60 / 1000), 'minutes until the last day of 2011');
    equal(run(d, 'hoursSince', ['the last day of 2011']), -12298 + (shift / 60 / 60 / 1000), 'hours since the last day of 2011');
    equal(run(d, 'hoursUntil', ['the last day of 2011']), 12298 - (shift / 60 / 60 / 1000), 'hours until the last day of 2011');
    equal(run(d, 'daysSince', ['the last day of 2011']), -512, 'days since the last day of 2011');
    equal(run(d, 'daysUntil', ['the last day of 2011']), 512, 'days until the last day of 2011');
    equal(run(d, 'weeksSince', ['the last day of 2011']), -73, 'weeks since the last day of 2011');
    equal(run(d, 'weeksUntil', ['the last day of 2011']), 73, 'weeks until the last day of 2011');
    equal(run(d, 'monthsSince', ['the last day of 2011']), -16, 'months since the last day of 2011');
    equal(run(d, 'monthsUntil', ['the last day of 2011']), 16, 'months until the last day of 2011');
    equal(run(d, 'yearsSince', ['the last day of 2011']), -1, 'years since the last day of 2011');
    equal(run(d, 'yearsUntil', ['the last day of 2011']), 1, 'years until the last day of 2011');


    var d = new Date(2010, 10);
    var years = Math.floor((new Date() - d) / 1000 / 60 / 60 / 24 / 365.25);
    equal(run(d, 'yearsUntil', ['Thursday']), years, 'Relative dates should not be influenced by other input');

    var d = new Date();
    var offset = d.getTime() - getRelativeDate(0, 0, -7).getTime();
    var since, until;

    // I'm occasionally seeing some REALLY big lags with IE here (up to 500ms), so giving a 1s buffer here.

    var msSince = run(d, 'millisecondsSince', ['last week']);
    var msUntil = run(d, 'millisecondsUntil', ['last week']);
    var actualMsSince = Math.round(offset);
    var actualMsUntil = Math.round(-offset);

    equal((msSince <= actualMsSince + 1000) && (msSince >= actualMsSince - 1000), true, 'milliseconds since last week');
    equal((msUntil <= actualMsUntil + 1000) && (msUntil >= actualMsUntil - 1000), true, 'milliseconds until last week');

    var secSince = run(d, 'secondsSince', ['last week']);
    var secUntil = run(d, 'secondsUntil', ['last week']);
    var actualSecSince = Math.round(offset / 1000);
    var actualSecUntil = Math.round(-offset / 1000);

    equal((secSince <= actualSecSince + 5) && (secSince >= actualSecSince - 5), true, 'seconds since last week');
    equal((secUntil <= actualSecUntil + 5) && (secUntil >= actualSecUntil - 5), true, 'seconds until last week');

    function fromLastWeek(method) {
      return run(new Date(), method, ['last week'])
    }

    equalWithMargin(fromLastWeek('minutesSince'), Math.round(offset / 1000 / 60), 1, 'minutes since last week');
    equalWithMargin(fromLastWeek('minutesUntil'), Math.round(-offset / 1000 / 60), 1, 'minutes until last week');
    equalWithMargin(fromLastWeek('hoursSince'),   Math.round(offset / 1000 / 60 / 60), 1, 'hours since last week');
    equalWithMargin(fromLastWeek('hoursUntil'),   Math.round(-offset / 1000 / 60 / 60), 1, 'hours until last week');
    equalWithMargin(fromLastWeek('daysSince'),    Math.round(offset / 1000 / 60 / 60 / 24), 1, 'days since last week');
    equalWithMargin(fromLastWeek('daysUntil'),    Math.round(-offset / 1000 / 60 / 60 / 24), 1, 'days until last week');
    equalWithMargin(fromLastWeek('weeksSince'),   Math.round(offset / 1000 / 60 / 60 / 24 / 7), 1, 'weeks since last week');
    equalWithMargin(fromLastWeek('weeksUntil'),   Math.round(-offset / 1000 / 60 / 60 / 24 / 7), 1, 'weeks until last week');

    equal(fromLastWeek('monthsSince'),   0, 'months since last week');
    equal(fromLastWeek('monthsUntil'),  -0, 'months until last week');
    equal(fromLastWeek('yearsSince'),    0, 'years since last week');
    equal(fromLastWeek('yearsUntil'),   -0, 'years until last week');

    // Issue #236
    var d = getRelativeDate(0, 0, 0, 14);
    equal(run(d, 'daysFromNow'), 0, 'should floor the number rather than round');

    // Issue #267
    equal(run(new Date('Mar 01, 2013'), 'daysUntil', [new Date('Mar 28, 2013')]), 27, 'should not be phased by DST traversal');
    equal(run(new Date('Mar 10, 2013'), 'daysUntil', [new Date('Mar 11, 2013')]), 1, 'exact DST traversal point for CST/CDT');

    // Issue #474
    var daysUntil9pm = run(new Date('11/10/2014 21:00:00'), 'daysSince', [new Date('7/1/2014')]);
    var daysUntil10pm = run(new Date('11/10/2014 22:00:00'), 'daysSince', [new Date('7/1/2014')]);
    equal(daysUntil9pm, daysUntil10pm, 'daysSince should not traverse between 21:00 and 22:00');

    // Issue #474
    // "1 month from now" can be forced back when there are not enough days in a month.
    // In these cases "relative()" should return "4 weeks from now" instead of "1 month from now".
    equal(run(testCreateDate('11/10/2014 21:00:00'), 'daysSince', ['7/1/2014']), 132, 'daysSince should be 132 at 9pm');
    equal(run(testCreateDate('11/10/2014 22:00:00'), 'daysSince', ['7/1/2014']), 132, 'daysSince should be 132 at 10pm');

    // Traversing over February

    equal(run(new Date(2015, 0, 31), 'monthsUntil', [new Date(2015, 1, 28)]),  1, 'Jan 31st is  1 months until Feb 28th');
    equal(run(new Date(2015, 0, 31), 'monthsSince', [new Date(2015, 1, 28)]), -1, 'Jan 31st is -1 months since Feb 28th');
    equal(run(new Date(2015, 1, 28), 'monthsUntil', [new Date(2015, 0, 31)]), -1, 'Feb 28th is -1 months until Jan 31st');
    equal(run(new Date(2015, 1, 28), 'monthsSince', [new Date(2015, 0, 31)]),  1, 'Feb 28th is  1 months since Jan 31st');

    equal(run(new Date(2015, 0, 31), 'monthsUntil', [new Date(2015, 2, 31)]),  2, 'Jan 31st is  2 months until Mar 31st');
    equal(run(new Date(2015, 0, 31), 'monthsSince', [new Date(2015, 2, 31)]), -2, 'Jan 31st is -2 months since Mar 31st');
    equal(run(new Date(2015, 2, 31), 'monthsUntil', [new Date(2015, 0, 31)]), -2, 'Mar 31st is -2 months until Jan 31st');
    equal(run(new Date(2015, 2, 31), 'monthsSince', [new Date(2015, 0, 31)]),  2, 'Mar 31st is  2 months since Jan 31st');

  });

  group('isMethods', function() {

    equal(run(now, 'isYesterday'), false, 'isYesterday');
    equal(run(now, 'isToday'), true, 'isToday');
    equal(run(now, 'isTomorrow'), false, 'isTomorrow');

    var d = new Date('February 29, 2008 22:15:42');

    equal(run(d, 'isYesterday'), false, 'isYesterday | February 29, 2008');
    equal(run(d, 'isToday'), false, 'isToday | February 29, 2008');
    equal(run(d, 'isTomorrow'), false, 'isTomorrow | February 29, 2008');

    d.setFullYear(thisYear + 2);

    equal(run(d, 'isYesterday'), false, 'isYesterday | 2 years from now');
    equal(run(d, 'isToday'), false, 'isToday | 2 years from now');
    equal(run(d, 'isTomorrow'), false, 'isTomorrow | 2 years from now');

    equal(run(now, 'isLastWeek'), false, 'isLastWeek | now');
    equal(run(now, 'isThisWeek'), true,  'isThisWeek | now');
    equal(run(now, 'isNextWeek'), false, 'isNextWeek | now');

    equal(run(now, 'isLastMonth'), false, 'isLastMonth | now');
    equal(run(now, 'isThisMonth'), true,  'isThisMonth | now');
    equal(run(now, 'isNextMonth'), false, 'isNextMonth | now');

    equal(run(now, 'isLastYear'), false, 'isLastYear | now');
    equal(run(now, 'isThisYear'), true,  'isThisYear | now');
    equal(run(now, 'isNextYear'), false, 'isNextYear | now');

    equal(run(getRelativeDate(0,0,-7), 'isLastWeek'), true,  'last week');
    equal(run(getRelativeDate(0,0,-7), 'isThisWeek'), false, 'last week');
    equal(run(getRelativeDate(0,0,-7), 'isNextWeek'), false, 'last week');

    equal(run(getRelativeDate(0,0,7), 'isLastWeek'), false, 'next week');
    equal(run(getRelativeDate(0,0,7), 'isThisWeek'), false, 'next week');
    equal(run(getRelativeDate(0,0,7), 'isNextWeek'), true,  'next week');

    equal(run(testGetWeekday(0), 'isLastWeek'), false, 'sunday is not last week');
    equal(run(testGetWeekday(0), 'isThisWeek'), true,  'sunday is this week');
    equal(run(testGetWeekday(0), 'isNextWeek'), false, 'sunday is not next week');

    equal(run(testGetWeekday(5), 'isLastWeek'), false, 'friday is not last week');
    equal(run(testGetWeekday(5), 'isThisWeek'), true,  'friday is this week');
    equal(run(testGetWeekday(5), 'isNextWeek'), false, 'friday is not next week');

    equal(run(testGetWeekday(6), 'isLastWeek'), false, 'satuday is not last week');
    equal(run(testGetWeekday(6), 'isThisWeek'), true,  'satuday is this week');
    equal(run(testGetWeekday(6), 'isNextWeek'), false, 'satuday is not next week');

    equal(run(testCreateDate('last sunday'), 'isLastWeek'), true,  'last sunday is last week');
    equal(run(testCreateDate('last sunday'), 'isThisWeek'), false, 'last sunday is not this week');
    equal(run(testCreateDate('last sunday'), 'isNextWeek'), false, 'last sunday is not next week');

    equal(run(testCreateDate('next sunday'), 'isLastWeek'), false, 'next sunday is not last week');
    equal(run(testCreateDate('next sunday'), 'isThisWeek'), false, 'next sunday is not this week');
    equal(run(testCreateDate('next sunday'), 'isNextWeek'), true,  'next sunday is next week');

    equal(run(testCreateDate('last monday'), 'isLastWeek'), true,  'last monday is last week');
    equal(run(testCreateDate('last monday'), 'isThisWeek'), false, 'last monday is not this week');
    equal(run(testCreateDate('last monday'), 'isNextWeek'), false, 'last monday is not next week');

    equal(run(testCreateDate('next monday'), 'isLastWeek'), false, 'next monday is not last week');
    equal(run(testCreateDate('next monday'), 'isThisWeek'), false, 'next monday is not this week');
    equal(run(testCreateDate('next monday'), 'isNextWeek'), true,  'next monday is next week');

    equal(run(testCreateDate('last friday'), 'isLastWeek'), true,  'last friday is last week');
    equal(run(testCreateDate('last friday'), 'isThisWeek'), false, 'last friday is not this week');
    equal(run(testCreateDate('last friday'), 'isNextWeek'), false, 'last friday is not next week');

    equal(run(testCreateDate('next friday'), 'isLastWeek'), false, 'next friday is not last week');
    equal(run(testCreateDate('next friday'), 'isThisWeek'), false, 'next friday is not this week');
    equal(run(testCreateDate('next friday'), 'isNextWeek'), true,  'next friday is next week');

    equal(run(testCreateDate('last saturday'), 'isLastWeek'), true,  'last saturday is last week');
    equal(run(testCreateDate('last saturday'), 'isThisWeek'), false, 'last saturday is not this week');
    equal(run(testCreateDate('last saturday'), 'isNextWeek'), false, 'last saturday is not next week');

    equal(run(testCreateDate('next saturday'), 'isLastWeek'), false, 'next saturday is not last week');
    equal(run(testCreateDate('next saturday'), 'isThisWeek'), false, 'next saturday is not this week');
    equal(run(testCreateDate('next saturday'), 'isNextWeek'), true,  'next saturday is next week');

    equal(run(testCreateDate('the beginning of the week'), 'isLastWeek'), false, 'the beginning of the week is not last week');
    equal(run(testCreateDate('the beginning of the week'), 'isThisWeek'), true, 'the beginning of the week is this week');
    equal(run(testCreateDate('the beginning of the week'), 'isNextWeek'), false, 'the beginning of the week is not next weeek');


    var d = testCreateDate('the beginning of the week');
    run(d, 'addMinutes', [-1]);

    equal(run(d, 'isLastWeek'), true, 'isLastWeek | the beginning of the week - 1 minute');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the beginning of the week - 1 minute');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the beginning of the week - 1 minute');


    var d = testCreateDate('the end of the week');

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the end of the week');
    equal(run(d, 'isThisWeek'), true, 'isThisWeek | the end of the week');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the end of the week');


    var d = testCreateDate('the end of the week');
    run(d, 'addMinutes', [1]);

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the end of the week + 1 minute');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the end of the week + 1 minute');
    equal(run(d, 'isNextWeek'), true, 'isNextWeek | the end of the week + 1 minute');


    var d = testCreateDate('the beginning of last week');

    equal(run(d, 'isLastWeek'), true, 'isLastWeek | the beginning of last week');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the beginning of last week');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the beginning of last week');


    var d = testCreateDate('the beginning of last week');
    run(d, 'addMinutes', [-1]);

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the beginning of last week - 1 minute');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the beginning of last week - 1 minute');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the beginning of last week - 1 minute');


    var d = testCreateDate('the end of next week');

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the end of next week');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the end of next week');
    equal(run(d, 'isNextWeek'), true, 'isNextWeek | the end of next week');


    var d = testCreateDate('the end of next week');
    run(d, 'addMinutes', [1]);

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the end of next week + 1 minute');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the end of next week + 1 minute');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the end of next week + 1 minute');


    var d = testCreateDate('the end of last week');

    equal(run(d, 'isLastWeek'), true, 'isLastWeek | the end of last week');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the end of last week');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the end of last week');


    var d = testCreateDate('the end of last week');
    run(d, 'addMinutes', [1]);

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the end of last week + 1 minute');
    equal(run(d, 'isThisWeek'), true, 'isThisWeek | the end of last week + 1 minute');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the end of last week + 1 minute');


    var d = testCreateDate('the beginning of next week');

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the beginning of next week');
    equal(run(d, 'isThisWeek'), false, 'isThisWeek | the beginning of next week');
    equal(run(d, 'isNextWeek'), true, 'isNextWeek | the beginning of next week');


    var d = testCreateDate('the beginning of next week');
    run(d, 'addMinutes', [-1]);

    equal(run(d, 'isLastWeek'), false, 'isLastWeek | the beginning of next week - 1 minute');
    equal(run(d, 'isThisWeek'), true, 'isThisWeek | the beginning of next week - 1 minute');
    equal(run(d, 'isNextWeek'), false, 'isNextWeek | the beginning of next week - 1 minute');


    equal(run(getRelativeDate(0, -1), 'isLastWeek'), false, 'isLastWeek | last month');
    equal(run(getRelativeDate(0, -1), 'isThisWeek'), false, 'isThisWeek | last month');
    equal(run(getRelativeDate(0, -1), 'isNextWeek'), false, 'isNextWeek | last month');
    equal(run(getRelativeDate(0, -1), 'isLastMonth'), true, 'isLastMonth | last month');
    equal(run(getRelativeDate(0, -1), 'isThisMonth'), false, 'isThisMonth | last month');
    equal(run(getRelativeDate(0, -1), 'isNextMonth'), false, 'isNextMonth | last month');

    equal(run(getRelativeDate(0, 1), 'isLastWeek'), false, 'isLastWeek | next month');
    equal(run(getRelativeDate(0, 1), 'isThisWeek'), false, 'isThisWeek | next month');
    equal(run(getRelativeDate(0, 1), 'isNextWeek'), false, 'isNextWeek | next month');
    equal(run(getRelativeDate(0, 1), 'isLastMonth'), false, 'isLastMonth | next month');
    equal(run(getRelativeDate(0, 1), 'isThisMonth'), false, 'isThisMonth | next month');
    equal(run(getRelativeDate(0, 1), 'isNextMonth'), true, 'isNextMonth | next month');

    equal(run(getRelativeDate(-1), 'isLastWeek'), false, 'isLastWeek | last year');
    equal(run(getRelativeDate(-1), 'isThisWeek'), false, 'isThisWeek | last year');
    equal(run(getRelativeDate(-1), 'isNextWeek'), false, 'isNextWeek | last year');
    equal(run(getRelativeDate(-1), 'isLastMonth'), false, 'isLastMonth | last year');
    equal(run(getRelativeDate(-1), 'isThisMonth'), false, 'isThisMonth | last year');
    equal(run(getRelativeDate(-1), 'isNextMonth'), false, 'isNextMonth | last year');
    equal(run(getRelativeDate(-1), 'isLastYear'), true, 'isLastYear | last year');
    equal(run(getRelativeDate(-1), 'isThisYear'), false, 'isThisYear | last year');
    equal(run(getRelativeDate(-1), 'isNextYear'), false, 'isNextYear | last year');

    equal(run(getRelativeDate(1), 'isLastWeek'), false, 'isLastWeek | next year');
    equal(run(getRelativeDate(1), 'isThisWeek'), false, 'isThisWeek | next year');
    equal(run(getRelativeDate(1), 'isNextWeek'), false, 'isNextWeek | next year');
    equal(run(getRelativeDate(1), 'isLastMonth'), false, 'isLastMonth | next year');
    equal(run(getRelativeDate(1), 'isThisMonth'), false, 'isThisMonth | next year');
    equal(run(getRelativeDate(1), 'isNextMonth'), false, 'isNextMonth | next year');
    equal(run(getRelativeDate(1), 'isLastYear'), false, 'isLastYear | next year');
    equal(run(getRelativeDate(1), 'isThisYear'), false, 'isThisYear | next year');
    equal(run(getRelativeDate(1), 'isNextYear'), true, 'isNextYear | next year');

    equal(run(run(new Date, 'beginningOfWeek'), 'isLastWeek'), false, 'the beginning of this week is not last week');

    // en-GB defines Monday as the beginning of the week. This means however that
    // depending on what day it is, "Sunday" could be last week or it could be this week.

    var isSunday = new Date().getDay() === 0;

    equal(run(testGetWeekday(0), 'isLastWeek', ['en-GB']), isSunday ? false : true,  'en-GB | sunday could be last week');
    equal(run(testGetWeekday(0), 'isThisWeek', ['en-GB']), isSunday ? true : false, 'en-GB | sunday could be this week');
    equal(run(testGetWeekday(0), 'isNextWeek', ['en-GB']), false, 'en-GB | sunday is not next week');

    equal(run(testGetWeekday(0,-1), 'isLastWeek', ['en-GB']), isSunday ? true : false, 'en-GB | last sunday could be last week');
    equal(run(testGetWeekday(0,-1), 'isThisWeek', ['en-GB']), false, 'en-GB | last sunday is not this week');
    equal(run(testGetWeekday(0,-1), 'isNextWeek', ['en-GB']), false, 'en-GB | last sunday is not next week');

    equal(run(testGetWeekday(0, 1), 'isLastWeek', ['en-GB']), false, 'en-GB | next sunday is not last week');
    equal(run(testGetWeekday(0, 1), 'isThisWeek', ['en-GB']), isSunday ? false : true,  'en-GB | next sunday could be this week');
    equal(run(testGetWeekday(0, 1), 'isNextWeek', ['en-GB']), isSunday ? true : false, 'en-GB | next sunday could be next week');

  });

  method('isAfter', function() {

    dateTest(new Date(2001,1,23), [new Date(2000,1,23)], true, 'January 23, 2000');
    dateTest(new Date(2001,1,23), [new Date(2002,1,23)], false, 'January 23, 2002');

    dateTest(new Date(1999,0), [new Date(1998)], true, '1999');
    dateTest(new Date(1998,2), [new Date(1998,1)], true, 'March, 1998');
    dateTest(new Date(1998,1,24), [new Date(1998,1,23)], true, 'February 24, 1998');
    dateTest(new Date(1998,1,23,12), [new Date(1998,1,23,11)], true, 'February 23, 1998 12pm');
    dateTest(new Date(1998,1,23,11,55), [new Date(1998,1,23,11,54)], true, 'February 23, 1998 11:55am');
    dateTest(new Date(1998,1,23,11,54,33), [new Date(1998,1,23,11,54,32)], true, 'February 23, 1998 11:54:33am');
    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,454)], true, 'February 23, 1998 11:54:32.455am');

    dateTest(new Date(1999,1), [{ year: 1998 }], true, 'object | 1999');
    dateTest(new Date(1998,2), [{ year: 1998, month: 1 }], true, 'object | March, 1998');
    dateTest(new Date(1998,1,24), [{ year: 1998, month: 1, day: 23 }], true, 'object | February 24, 1998');
    dateTest(new Date(1998,1,23,12), [{ year: 1998, month: 1, day: 23, hour: 11 }], true, 'object | February 23, 1998 12pm');
    dateTest(new Date(1998,1,23,11,55), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }], true, 'object | February 23, 1998 11:55am');
    dateTest(new Date(1998,1,23,11,54,33), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }], true, 'object | February 23, 1998 11:54:33am');
    dateTest(new Date(1998,1,23,11,54,32,455), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }], true, 'object | February 23, 1998 11:54:32.455am');

    dateTest(new Date(1999,1), ['1998'], true, 'string | 1998');
    dateTest(new Date(1998,2), ['February, 1998'], true, 'string | February, 1998');
    dateTest(new Date(1998,1,24), ['February 23, 1998'], true, 'string | February 23, 1998');
    dateTest(new Date(1998,1,23,12), ['February 23, 1998 11am'], true, 'string | February 23, 1998 11pm');
    dateTest(new Date(1998,1,23,11,55), ['February 23, 1998 11:54am'], true, 'string | February 23, 1998 11:54am');
    dateTest(new Date(1998,1,23,11,54,33), ['February 23, 1998 11:54:32am'], true, 'string | February 23, 1998 11:54:32am');
    dateTest(new Date(1998,1,23,11,54,32,455), ['February 23, 1998 11:54:32.454am'], true, 'string | February 23, 1998 11:54:32.454am');

    dateTest(new Date(1999,5), ['1999'], true, 'June 1999 is after implied January 1999');
    dateTest(getRelativeDate(1), ['tomorrow'], true, 'relative | next year');
    dateTest(getRelativeDate(0, 1), ['tomorrow'], true, 'relative | next month');
    dateTest(getRelativeDate(0, 0, 1), ['tomorrow'], true, 'relative | tomorrow');

    dateTest(testGetWeekday(0),    ['monday'], false, 'relative | sunday');
    dateTest(testGetWeekday(2),    ['monday'], true, 'relative | tuesday');
    dateTest(testGetWeekday(0, 1), ['monday'], true, 'relative | next week sunday');
    dateTest(testGetWeekday(0,-1), ['monday'], false, 'relative | last week sunday');
    dateTest(testGetWeekday(0),    ['the beginning of this week'], false, 'relative | the beginning of this week');
    dateTest(testGetWeekday(0),    ['the beginning of last week'], true, 'relative | the beginning of last week');
    dateTest(testGetWeekday(0),    ['the end of this week'], false, 'relative | the end of this week');

    dateTest(new Date(2001,1,23), [new Date(2000,1,24), 24 * 60 * 60 * 1000], true, 'buffers work');
    dateTest(new Date(1999,1), [{ year: 1999 }], true, 'February 1999 is after implied January 1999');
    dateTest(new Date(1998,10), [{ year: 1999 }, 90 * 24 * 60 * 60 * 1000], true, 'November 1998 is after implied January 1999 with 90 days of margin');

  });

  method('isBefore', function() {

    dateTest(new Date(2001,1,23), [new Date(2000,1,23)], false, 'January 23, 2000');
    dateTest(new Date(2001,1,23), [new Date(2002,1,23)], true, 'January 23, 2002');

    dateTest(new Date(1999,0), [new Date(1998)], false, '1999');
    dateTest(new Date(1998,2), [new Date(1998,1)], false, 'March, 1998');
    dateTest(new Date(1998,1,24), [new Date(1998,1,23)], false, 'February 24, 1998');
    dateTest(new Date(1998,1,23,12), [new Date(1998,1,23,11)], false, 'February 23, 1998 12pm');
    dateTest(new Date(1998,1,23,11,55), [new Date(1998,1,23,11,54)], false, 'February 23, 1998 11:55am');
    dateTest(new Date(1998,1,23,11,54,33), [new Date(1998,1,23,11,54,34)], true, 'February 23, 1998 11:54:34am');
    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,454)], false, 'February 23, 1998 11:54:32.455am');

    dateTest(new Date(1999,1), [{ year: 1998 }], false, 'object | 1999');
    dateTest(new Date(1998,2), [{ year: 1998, month: 1 }], false, 'object | March, 1998');
    dateTest(new Date(1998,1,24), [{ year: 1998, month: 1, day: 23 }], false, 'object | February 24, 1998');
    dateTest(new Date(1998,1,23,12), [{ year: 1998, month: 1, day: 23, hour: 11 }], false, 'object | February 23, 1998 12pm');
    dateTest(new Date(1998,1,23,11,55), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }], false, 'object | February 23, 1998 11:55am');
    dateTest(new Date(1998,1,23,11,54,33), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }], false, 'object | February 23, 1998 11:54:33am');
    dateTest(new Date(1998,1,23,11,54,32,455), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }], false, 'object | February 23, 1998 11:54:32.455am');

    dateTest(new Date(1997,11,31,23,59,59,999), [{ year: 1998 }], true, 'object | 1999');
    dateTest(new Date(1998,0), [{ year: 1998, month: 1 }], true, 'object | March, 1998');
    dateTest(new Date(1998,1,22), [{ year: 1998, month: 1, day: 23 }], true, 'object | February 24, 1998');
    dateTest(new Date(1998,1,23,10), [{ year: 1998, month: 1, day: 23, hour: 11 }], true, 'object | February 23, 1998 12pm');
    dateTest(new Date(1998,1,23,11,53), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54 }], true, 'object | February 23, 1998 11:55am');
    dateTest(new Date(1998,1,23,11,54,31), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32 }], true, 'object | February 23, 1998 11:54:33am');
    dateTest(new Date(1998,1,23,11,54,32,453), [{ year: 1998, month: 1, day: 23, hour: 11, minutes: 54, seconds: 32, milliseconds: 454 }], true, 'object | February 23, 1998 11:54:32.455am');

    dateTest(new Date(1999,1), ['1998'], false, 'string | 1998');
    dateTest(new Date(1998,2), ['February, 1998'], false, 'string | February, 1998');
    dateTest(new Date(1998,1,24), ['February 23, 1998'], false, 'string | February 23, 1998');
    dateTest(new Date(1998,1,23,12), ['February 23, 1998 11am'], false, 'string | February 23, 1998 11pm');
    dateTest(new Date(1998,1,23,11,55), ['February 23, 1998 11:54am'], false, 'string | February 23, 1998 11:54am');
    dateTest(new Date(1998,1,23,11,54,33), ['February 23, 1998 11:54:32am'], false, 'string | February 23, 1998 11:54:32am');
    dateTest(new Date(1998,1,23,11,54,32,455), ['February 23, 1998 11:54:32.454am'], false, 'string | February 23, 1998 11:54:32.454am');

    dateTest(new Date(1999,5), ['1999'], false, 'June 1999 is not after 1999 in general');
    dateTest(getRelativeDate(1), ['tomorrow'], false, 'relative | next year');
    dateTest(getRelativeDate(0, 1), ['tomorrow'], false, 'relative | next month');
    dateTest(getRelativeDate(0, 0, 1), ['tomorrow'], false, 'relative | tomorrow');

    dateTest(testGetWeekday(0),    ['monday'], true, 'relative | sunday');
    dateTest(testGetWeekday(2),    ['monday'], false, 'relative | tuesday');
    dateTest(testGetWeekday(0, 1), ['monday'], false, 'relative | next week sunday');
    dateTest(testGetWeekday(0,-1), ['monday'], true, 'relative | last week sunday');
    dateTest(testGetWeekday(0),    ['the beginning of this week'], false, 'relative | the beginning of this week');
    dateTest(testGetWeekday(0),    ['the beginning of last week'], false, 'relative | the beginning of last week');
    dateTest(testGetWeekday(0),    ['the end of this week'], true, 'relative | the end of this week');

    dateTest(new Date(2001,1,25), [new Date(2001,1,24), 48 * 60 * 60 * 1000], true, 'buffers work');

  });

  method('isBetween', function() {

    dateTest(new Date(2001,1,23), [new Date(2000,1,23), new Date(2002,1,23)], true, 'January 23, 2001 is between January 23, 2000 and January 23, 2002');
    dateTest(new Date(2001,1,23), [new Date(2002,1,23), new Date(2000,1,23)], true, 'January 23, 2001 is between January 23, 2002 and January 23, 2000');
    dateTest(new Date(1999,1,23), [new Date(2002,1,23), new Date(2000,1,23)], false, 'January 23, 1999 is between January 23, 2002 and January 23, 2000');
    dateTest(new Date(2003,1,23), [new Date(2002,1,23), new Date(2000,1,23)], false, 'January 23, 2003 is between January 23, 2002 and January 23, 2000');

    dateTest(new Date(1998,2), [new Date(1998,1), new Date(1998, 3)], true, 'February, 1998 - April, 1998');
    dateTest(new Date(1998,2), [new Date(1998,1), new Date(1998, 0)], false, 'February, 1998 - January, 1998');
    dateTest(new Date(1998,2), [new Date(1998,5), new Date(1998, 3)], false, 'June, 1998 - April, 1998');

    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,456)], true, 'February 23, 1998 11:54:32.454am - February 23, 1998 11:54:32:456am');
    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,456), new Date(1998,1,23,11,54,32,454)], true, 'February 23, 1998 11:54:32.456am - February 23, 1998 11:54:32:454am');
    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,454), new Date(1998,1,23,11,54,32,452)], false, 'February 23, 1998 11:54:32.454am - February 23, 1998 11:54:32:452am');
    dateTest(new Date(1998,1,23,11,54,32,455), [new Date(1998,1,23,11,54,32,456), new Date(1998,1,23,11,54,32,458)], false, 'February 23, 1998 11:54:32.456am - February 23, 1998 11:54:32:458am');

    dateTest(new Date(1998,1), [{ year: 1998 }, { year: 1999 }], true, 'object | Feb 1998 is between 1998 - 1999');
    dateTest(new Date(1999,1), [{ year: 1998 }, { year: 1999 }], false, 'object | Feb 1999 is between 1998 - 1999');
    dateTest(new Date(1999,1), [{ year: 1998 }, { year: 1997 }], false, 'object | Feb 1999 is between 1998 - 1997');
    dateTest(new Date(1998,2), [{ year: 1998, month: 1 }, { year: 1998, month: 3 }], true, 'object | March, 1998 is between February, 1998 and April, 1998');
    dateTest(new Date(1998,2), [{ year: 1998, month: 0 }, { year: 1998, month: 1 }], false, 'object | March, 1998 is between January, 1998 and February, 1998');

    dateTest(new Date(1998,1), ['1998', '1999'], true, 'string | Feb 1998 is between 1998 - 1999');
    dateTest(new Date(1999,1), ['1998', '1999'], false, 'string | Feb 1999 is between 1998 - 1999');
    dateTest(new Date(1999,1), ['1998', '1997'], false, 'string | Feb 1998 is between 1998 - 1997');
    dateTest(new Date(1998,2), ['February, 1998', 'April, 1998'], true, 'string | March, 1998 is between February, 1998 and April, 1998');
    dateTest(new Date(1998,2), ['January, 1998', 'February, 1998'], false, 'string | March, 1998 is not between January, 1998 and February, 1998');

    dateTest(new Date(1999,5), ['1998','1999'], false, 'Ambiguous periods are hard coded to the ms, there is no "implied specificity" as with Date#is');

    dateTest(new Date(), ['yesterday','tomorrow'], true, 'relative | now is between today and tomorrow');
    dateTest(getRelativeDate(1), ['yesterday','tomorrow'], false, 'relative | last year is between today and tomorrow');
    dateTest(getRelativeDate(0, 1), ['yesterday','tomorrow'], false, 'relative | last month is between today and tomorrow');
    dateTest(getRelativeDate(0, 0, 0), ['today','tomorrow'], true, 'relative | right now is between today and tomorrow');
    dateTest(getRelativeDate(0, 0, 1), ['today','tomorrow'], false, 'relative | tomorrow is between today and tomorrow');

    dateTest(testGetWeekday(0),    ['monday', 'friday'], false, 'relative | sunday is between monday and friday');
    dateTest(testGetWeekday(2),    ['monday', 'friday'], true, 'relative | tuesday is between monday and friday');
    dateTest(testGetWeekday(0, 1), ['monday', 'friday'], false, 'relative | next week sunday is between monday and friday');
    dateTest(testGetWeekday(0,-1), ['monday', 'friday'], false, 'relative | last week sunday is between monday and friday');
    dateTest(testGetWeekday(0),    ['the beginning of this week','the beginning of last week'], true, 'relative | sunday is between the beginning of this week and the beginning of last week');
    dateTest(testGetWeekday(0),    ['the beginning of this week','the beginning of next week'], true, 'relative | sunday is between the beginning of this week and the beginning of next week');
    dateTest(testGetWeekday(0),    ['the beginning of last week','the beginning of next week'], true, 'relative | sunday is between the beginning of last week and the beginning of next week');
    dateTest(testGetWeekday(0),    ['the beginning of last week','the end of this week'], true, 'relative | sunday is between the beginning of last week and the end of this week');

    dateTest(testCreateDate('yesterday'), ['yesterday', 'today'], true, 'today is between yesterday and today');
    dateTest(testCreateDate('tomorrow'), ['today', 'tomorrow'], true, 'tomrrow is between today and tomorrow');

  });

  group('Date Locales', function() {

    testCreateFakeLocale('fo');

    equal(run(new Date(2011, 5, 18), 'format', ['{Month} {date}, {yyyy}']), 'June 18, 2011', 'Non-initialized defaults to English formatting');
    equal(run(getRelativeDate(0, 0, 0, -1), 'relative'), '1 hour ago', 'Non-initialized relative formatting is also English');
    equal(run(testCreateDate('June 18, 2011'), 'isValid'), true, 'English dates will also be properly parsed without being initialized or passing a locale code');


    testSetLocale('fo');

    equal(run(testCreateDate('2011kupo', 'fo'), 'isValid'), true, 'dates will parse if their locale is passed');
    equal(run(testCreateDate('２０１１年０６月１８日'), 'isValid'), false, 'dates will not parse thereafter as the current locale is still en');

    equal(run(new Date(2011, 5, 6), 'format', ['{Month}']), 'La', 'june is La');

    raisesError(function(){ testSetLocale(); }, 'no arguments raises error');
    equal(Sugar.Date.getLocale().code, 'fo', 'setting locale with no arguments had no effect');

    equal(run(new Date(2011, 5, 6), 'format', ['{Month}']), 'La', 'will not change the locale if no argument passed');
    equal(run(new Date(2011, 5, 6), 'format', ['', 'en']), 'June 6, 2011 12:00 AM', 'local locale should override global');
    equal(run(testCreateDate('5 months ago', 'en'), 'relative', ['en']), '5 months ago', 'local locale should override global');

    raisesError(function(){ testSetLocale(''); }, '"" raises an invalid locale error');
    equal(run(new Date(2011, 5, 6), 'format', ['{Month}']), 'La', 'will not change the locale if blank string passed');

    raisesError(function(){ testSetLocale('pink'); }, 'Non-existent locales will raise an error');
    equal(run(testCreateDate('2011kupo'), 'format'), 'yeehaw', 'will not set the current locale to an invalid locale');

  });

  group('Custom Formats', function() {
    testSetLocale('en');

    Sugar.Date.getLocale('en').addFormat('!{month}!{year}!');
    assertDateParsed('!March!2015!', new Date(2015, 2));

    Sugar.Date.getLocale('en').addRawFormat('(\\d+)\\^\\^(\\d+)%%(\\d+), but at the (beginning|end)', ['date','year','month','edge']);
    assertDateParsed('25^^2008%%02, but at the end', new Date(2008, 1, 25, 23, 59, 59, 999));

    Sugar.Date.getLocale('en').addRawFormat('on ze (\\d+)th of (january|february|march|april|may) lavigne', ['date','month']);
    assertDateParsed('on ze 18th of april lavigne', 'en', new Date(thisYear, 3, 18));

    equal(typeof Sugar.Date.getLocale(), 'object', 'current locale object is exposed in case needed');
    equal(Sugar.Date.getLocale().code, 'en', 'adding the format did not change the current locale');


    // Issue #119
    Sugar.Date.getLocale('en').addRawFormat('(\\d{2})(\\d{2})', ['hour','minute']);
    assertDateParsed('0615', testCreateDate('06:15'));

    // Not sure how nuts I want to get with this so for the sake of the tests just push the proper format back over the top...
    Sugar.Date.getLocale('en').addRawFormat('(\\d{4})', ['year']);

  });

  // TODO: handle this:
  // Issue #146 - These tests were failing when system time was set to Friday, June 1, 2012 PDT

  method('getAllLocales', function() {
    var all = run(Date, 'getAllLocales');
    equal(typeof all, 'object', 'Result should be an object');
    equal(all['en'].code, 'en', 'English should be set');
  });

  method('getAllLocaleCodes', function() {
    var all = run(Date, 'getAllLocaleCodes');
    equal(testIsArray(all), true, 'Result should be an array');
    equal(all[0], 'en', 'English should be the first');
  });

  group('Adding locales', function() {

    testSetLocale('en');
    Sugar.Date.addLocale('bar', {
      months: ['a','b','c'],
      parse: ['{month}']
    });

    equal(Sugar.Date.getLocale().code, Sugar.Date.getLocale('en').code, 'adding a locale does not affect the current locale');
    equal(Sugar.Date.getLocale('bar').months[0], 'a', 'new locale has been added');
    assertDateParsed('a', 'bar', testCreateDate('January'));

    Sugar.Date.addLocale({
      code: 'barbar',
      months: ['d','e','f'],
      parse: ['{month}']
    });
    assertDateParsed('f', 'barbar', testCreateDate('March'));

    testSetLocale('bar');
    Sugar.Date.removeLocale('bar');
    equal(Sugar.Date.getLocale('bar'), undefined, 'should have removed the locale');
    equal(Sugar.Date.getLocale() === Sugar.Date.getLocale('en'), true, 'current locale should be reset to English');

  });

  method('newDateInternal', function() {

    // Issue #342 handling offsets for comparison

    Sugar.Date.setOption('newDateInternal', function() {
      var d = new Date();
      // Honolulu time zone GMT-10:00
      var offset = (d.getTimezoneOffset() - (10 * 60)) * 60 * 1000;
      d.setTime(d.getTime() + offset);
      return d;
    });

    var offset = 600 - new Date().getTimezoneOffset();

    var d = testCreateDate();
    var expected = new Date();
    expected.setTime(expected.getTime() - (offset * 60 * 1000));
    equal(d, expected, 'now | offset was respected');

    var d = testCreateDate('1 day ago');
    var expected = new Date();
    // Need to set the timezone BEFORE setting the date as that's how
    // our newDateInternal method is working. Otherwise the date may
    // traverse across a DST boundary which could affect the offset.
    expected.setTime(expected.getTime() - (offset * 60 * 1000));
    expected.setDate(expected.getDate() - 1);
    equal(d, expected, '1 day ago | offset was respected');

    equal(testCreatePastDate('4pm').getTime() < (new Date().getTime() + (-offset * 60 * 1000)), true, 'past repsects global offset');
    equal(testCreateFutureDate('4pm').getTime() > (new Date().getTime() + (-offset * 60 * 1000)), true, 'future repsects global offset');

    // Relative formatting with newDateInternal

    Sugar.Date.setOption('newDateInternal', function() {
      return new Date(1963, 11, 22);
    });

    equal(run(new Date(1963, 5, 20), 'relative'), '6 months ago', 'relative should respect newDateInternal as well');

    // Issue #342 internal constructor override

    var AwesomeDate = function() {};
    AwesomeDate.prototype = new Date();
    AwesomeDate.prototype.getMinutes = function() {};

    Sugar.Date.setOption('newDateInternal', function() {
      return new AwesomeDate();
    });

    equal(testCreateDate() instanceof AwesomeDate, true, 'Result should be use in Date.create');

    Sugar.Date.setOption('newDateInternal', null);
    equal(testCreateDate() instanceof AwesomeDate, false, 'Internal function should have been reset');

  });

  group('Month traversal issues', function() {

    // If traversing into a new month don't reset the date if the date was also advanced

    equal(run(new Date(2011, 2, 31), 'rewind', [{ month: 1 }]), new Date(2011, 1, 28), 'rewind by month will land on last day if the day does not exist');
    equal(run(new Date(2011, 2, 31), 'rewind', [{ month: 1, day: 3 }]), new Date(2011, 1, 25), 'can still rewind days after reset');
  });

  group('DST Issues', function() {

    // These tests are meant to be run in a North American timezone with DST (PDT, MDT, etc)

    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 1, 45), 'addHours', 1, 'Spring DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 2), 'addHours', -1, 'Spring DST | Reverse');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 1, 1, 45), 'addHours', 15, 'Fall DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 2), 'addHours', -15, 'Fall DST | Reverse');

    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 1, 45), 'addMinutes', 15, 'Spring DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 2), 'addMinutes', -15, 'Spring DST | Reverse');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 1, 1, 45), 'addMinutes', 15, 'Fall DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 2), 'addMinutes', -15, 'Fall DST | Reverse');

    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 1, 59, 59), 'addSeconds', 10, 'Spring DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 2), 'addSeconds', -10, 'Spring DST | Reverse');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 1, 1, 59, 59), 'addSeconds', 10, 'Fall DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 2), 'addSeconds', -10, 'Fall DST | Reverse');

    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 1, 59, 59, 950), 'addMilliseconds', 100, 'Spring DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 2, 8, 2), 'addMilliseconds', -100, 'Spring DST | Reverse');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 1, 1, 59, 59, 950), 'addMilliseconds', 100, 'Fall DST | Forward');
    assertAddUnitIsNumericallyEqual(new Date(2015, 10, 2), 'addMilliseconds', -100, 'Fall DST | Reverse');

    var d1 = new Date(2015, 2, 8);
    var d2 = run(new Date(d1), 'addDays', [1]);
    var t1 = d1.getTimezoneOffset();
    var t2 = d2.getTimezoneOffset();
    equal(d2 - d1, (24 * 60 * 60 * 1000) + ((t2 - t1) * 60 * 1000), 'adding a day should be equal to 24 hours + whatever change in timezone offset that may have occurred');

  });

});

namespace('Number', function () {

  group('Unit Before/After', function () {

    function assertBeforeAfter(ms, method, args, ems, message) {
      equal(run(ms, method, args), getRelativeDate(0, 0, 0, 0, 0, 0, ems), message);
    }
    assertBeforeAfter(1, 'secondAfter', [], 1000, 'secondAfter | 1');
    assertBeforeAfter(5, 'secondsAfter', [], 5000, 'secondsAfter | 5');
    assertBeforeAfter(10, 'minutesAfter', [], 600000, 'minutesAfter | 10');

    assertBeforeAfter(1, 'secondBefore', [], -1000, 'secondBefore | 1');
    assertBeforeAfter(5, 'secondsBefore', [], -5000, 'secondBefore | 5');
    assertBeforeAfter(10, 'secondsBefore', [], -10000, 'secondBefore | 10');

    assertBeforeAfter(5, 'minutesAfter', [run(5, 'minutesAgo')], 0, 'minutesAfter | 5 minutes after 5 minutes ago');
    assertBeforeAfter(10, 'minutesAfter', [run(5, 'minutesAgo')], 1000 * 60 * 5, 'minutesAfter | 10 minutes after 5 minutes ago');

    assertBeforeAfter(5, 'minutesBefore', [run(5, 'minutesFromNow')], 0, 'minutesBefore | 5 minutes before 5 minutes from now');
    assertBeforeAfter(10, 'minutesBefore', [run(5, 'minutesFromNow')], -(1000 * 60 * 5), 'minutesBefore | 10 minutes before 5 minutes from now');

    var christmas = new Date('December 25, 1972');

    equal(run(5, 'minutesBefore', [christmas]), getRelativeDate.call(christmas,0,0,0,0,-5), 'minutesBefore | 5 minutes before christmas');
    equal(run(5, 'minutesAfter', [christmas]), getRelativeDate.call(christmas,0,0,0,0,5), 'minutesAfter | 5 minutes after christmas');

    equal(run(5, 'hoursBefore', [christmas]), getRelativeDate.call(christmas,0,0,0,-5), 'hoursBefore | 5 hours before christmas');
    equal(run(5, 'hoursAfter', [christmas]), getRelativeDate.call(christmas,0,0,0,5), 'hoursAfter | 5 hours after christmas');

    equal(run(5, 'daysBefore', [christmas]), getRelativeDate.call(christmas,0,0,-5), 'daysBefore | 5 days before christmas');
    equal(run(5, 'daysAfter', [christmas]), getRelativeDate.call(christmas,0,0,5), 'daysAfter | 5 days after christmas');

    equal(run(5, 'weeksBefore', [christmas]), getRelativeDate.call(christmas,0,0, -35), 'weeksBefore | 5 weeks before christmas');
    equal(run(5, 'weeksAfter', [christmas]), getRelativeDate.call(christmas,0,0, 35), 'weeksAfter | 5 weeks after christmas');

    equal(run(5, 'monthsBefore', [christmas]), getRelativeDate.call(christmas,0,-5), 'monthsBefore | 5 months before christmas');
    equal(run(5, 'monthsAfter', [christmas]), getRelativeDate.call(christmas,0,5), 'monthsAfter | 5 months after christmas');

    equal(run(5, 'yearsBefore', [christmas]), getRelativeDate.call(christmas,-5), 'yearsBefore | 5 years before christmas');
    equal(run(5, 'yearsAfter', [christmas]), getRelativeDate.call(christmas,5), 'yearsAfter | 5 years after christmas');


    // Hooking it all up!!

    // Try this in WinXP:
    // 1. Set timezone to Damascus
    // 2. var d = new Date(1998, 3, 3, 17); d.setHours(0); d.getHours();
    // 3. hours = 23
    // 4. PROFIT $$$

    equal(run(5, 'minutesBefore', ['April 2rd, 1998']), new Date(1998, 3, 1, 23, 55), 'minutesBefore | 5 minutes before April 3rd, 1998');
    equal(run(5, 'minutesAfter', ['January 2nd, 2005']), new Date(2005, 0, 2, 0, 5), 'minutesAfter | 5 minutes after January 2nd, 2005');
    equal(run(5, 'hoursBefore', ['the first day of 2005']), new Date(2004, 11, 31, 19), 'hoursBefore | 5 hours before the first day of 2005');
    equal(run(5, 'hoursAfter', ['the last day of 2006']), new Date(2006, 11, 31, 5), 'hoursAfter | 5 hours after the last day of 2006');
    equal(run(5, 'hoursAfter', ['the end of 2006']), new Date(2007, 0, 1, 4, 59, 59, 999), 'hoursAfter | 5 hours after the end of 2006');


    var expected = testGetWeekday(1, -1);
    expected.setDate(expected.getDate() - 5);
    equal(run(5, 'daysBefore', ['last week monday']), expected, 'daysBefore | 5 days before last week monday');

    var expected = new Date(testGetWeekday(2, 1).getTime() + run(5, 'days'));
    equal(run(5, 'daysAfter', ['next tuesday']), expected, 'daysAfter | 5 days after next week tuesday');

    var expected = getRelativeDate(0, 0, -35);
    expected.setHours(0);
    expected.setMinutes(0);
    expected.setSeconds(0);
    expected.setMilliseconds(0);
    equal(run(5, 'weeksBefore', ['today']), expected, 'weeksBefore | 5 weeks before today');

    var expected = getRelativeDate(0, 0, 35);
    equal(run(5, 'weeksAfter', ['now']), expected, 'weeksAfter | 5 weeks after now');

    var expected = getRelativeDate(0, -5);
    expected.setHours(0);
    expected.setMinutes(0);
    expected.setSeconds(0);
    expected.setMilliseconds(0);
    equal(run(5, 'monthsBefore', ['today']), expected, 'monthsBefore | 5 months before today');

    var expected = getRelativeDate(0, 5);
    equal(run(5, 'monthsAfter', ['now']), expected, 'monthsAfter | 5 months after now');

  });

  group('Date Locales', function() {

    // Issue #415 locale object properties should be exported.
    var en = Sugar.Date.getLocale('en');
    var properties = [
      'code',
      'months', 'weekdays', 'units', 'numerals', 'placeholders',
      'articles', 'tokens', 'timeMarkers', 'ampm', 'timeSuffixes',
      'parse', 'timeParse', 'timeFrontParse', 'modifiers',
      'compiledFormats', 'parsingAliases', 'parsingTokens', 'numeralMap'
    ];

    for (var i = 0; i < properties.length; i++) {
      var p = properties[i];
      equal(!!en[p], true, 'property ' + p + ' should exist in the locale object');
    }

    var cf = en.compiledFormats[0];
    equal(cf.hasOwnProperty('reg'), true, 'compiled format should have a reg property');
    equal(cf.hasOwnProperty('to'), true, 'compiled format should have a to property');

  });

  group('Specificity', function() {
    var obj;

    obj = {};
    Sugar.Date.create('tomorrow at 8:00pm', { params: obj });
    // TODO: make these constants
    equal(obj.specificity, 2);

    obj = {};
    Sugar.Date.create('tomorrow at noon', { params: obj });
    equal(obj.specificity, 3);

    obj = {};
    Sugar.Date.create('the end of february', { params: obj });
    equal(obj.specificity, 4);
  });

});
