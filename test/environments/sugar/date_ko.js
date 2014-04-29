package('Date | Korean', function () {

  var now = new Date();
  testSetLocale('ko');

  method('create', function() {
    dateEqual(testCreateDate('2011년5월15일'), new Date(2011, 4, 15), 'Date#create | basic Korean date');
    dateEqual(testCreateDate('2011년5월'), new Date(2011, 4), 'Date#create | Korean | year and month');
    dateEqual(testCreateDate('5월15일'), new Date(now.getFullYear(), 4, 15), 'Date#create | Korean | month and date');
    dateEqual(testCreateDate('2011년'), new Date(2011, 0), 'Date#create | Korean | year');
    dateEqual(testCreateDate('5월'), new Date(now.getFullYear(), 4), 'Date#create | Korean | month');
    dateEqual(testCreateDate('15일'), new Date(now.getFullYear(), now.getMonth(), 15), 'Date#create | Korean | date');
    dateEqual(testCreateDate('월요일'), getDateWithWeekdayAndOffset(1), 'Date#create | Korean | Monday');
    dateEqual(testCreateDate('구일'), new Date(now.getFullYear(), now.getMonth(), 9), 'Date#create | Korean | the 9th');
    dateEqual(testCreateDate('이십오일'), new Date(now.getFullYear(), now.getMonth(), 25), 'Date#create | Korean | the 25th');
    dateEqual(testCreateDate('한달 전'), getRelativeDate(null, -1), 'Date#create | Korean | one month ago 달');


    dateEqual(testCreateDate('2011년5월15일 3:45'), new Date(2011, 4, 15, 3, 45), 'Date#create | basic Korean date 3:45');
    dateEqual(testCreateDate('2011년5월15일 오후3:45'), new Date(2011, 4, 15, 15, 45), 'Date#create | basic Korean date 3:45pm');
    dateEqual(testCreateDate('2011년5월15일 오후 3시 45분'), new Date(2011, 4, 15, 15, 45), 'Date#create | basic Korean date full korean letters');

    dateEqual(testCreateDate('1밀리초 전'), getRelativeDate(null, null, null, null, null, null,-1), 'Date#create | Korean | one millisecond ago');
    dateEqual(testCreateDate('1초 전'), getRelativeDate(null, null, null, null, null, -1), 'Date#create | Korean | one second ago');
    dateEqual(testCreateDate('1분 전'), getRelativeDate(null, null, null, null, -1), 'Date#create | Korean | one minute ago');
    dateEqual(testCreateDate('1시간 전'), getRelativeDate(null, null, null, -1), 'Date#create | Korean | one hour ago');
    dateEqual(testCreateDate('1일 전'), getRelativeDate(null, null, -1), 'Date#create | Korean | one day ago');
    dateEqual(testCreateDate('1주 전'), getRelativeDate(null, null, -7), 'Date#create | Korean | one week');
    dateEqual(testCreateDate('1개월 전'), getRelativeDate(null, -1), 'Date#create | Korean | one month ago 개월');
    dateEqual(testCreateDate('1년 전'), getRelativeDate(-1), 'Date#create | Korean | one year ago');


    dateEqual(testCreateDate('5밀리초 후'), getRelativeDate(null, null, null, null, null, null,5), 'Date#create | Korean | five millisecond from now');
    dateEqual(testCreateDate('5초 후'), getRelativeDate(null, null, null, null, null, 5), 'Date#create | Korean | five second from now');
    dateEqual(testCreateDate('5분 후'), getRelativeDate(null, null, null, null, 5), 'Date#create | Korean | five minute from now');
    dateEqual(testCreateDate('5시간 후'), getRelativeDate(null, null, null, 5), 'Date#create | Korean | five hour from now');
    dateEqual(testCreateDate('5일 후'), getRelativeDate(null, null, 5), 'Date#create | Korean | five day from now');
    dateEqual(testCreateDate('5주 후'), getRelativeDate(null, null, 35), 'Date#create | Korean | five weeks from now');
    dateEqual(testCreateDate('5개월 후'), getRelativeDate(null, 5), 'Date#create | Korean | five months 개월');
    dateEqual(testCreateDate('5년 후'), getRelativeDate(5), 'Date#create | Korean | five years from now');

    dateEqual(testCreateDate('그저께'), run(getRelativeDate(null, null, -2), 'reset'), 'Date#create | Korean | 그저께');
    dateEqual(testCreateDate('어제'), run(getRelativeDate(null, null, -1), 'reset'), 'Date#create | Korean | yesterday');
    dateEqual(testCreateDate('오늘'), run(getRelativeDate(null, null, 0), 'reset'), 'Date#create | Korean | today');
    dateEqual(testCreateDate('내일'), run(getRelativeDate(null, null, 1), 'reset'), 'Date#create | Korean | tomorrow');
    dateEqual(testCreateDate('모레'), run(getRelativeDate(null, null, 2), 'reset'), 'Date#create | Korean | 모레');

    dateEqual(testCreateDate('내일 3:45'), run(getRelativeDate(null, null, 1), 'set', [{ hours: 3, minutes: 45 }, true]), 'Date#create | Korean | tomorrow with time 3:45');
    dateEqual(testCreateDate('내일 오후3:45'), run(getRelativeDate(null, null, 1), 'set', [{ hours: 15, minutes: 45 }, true]), 'Date#create | Korean | tomorrow with time 3:45pm');
    dateEqual(testCreateDate('수요일 3:45'), run(getDateWithWeekdayAndOffset(3, 0), 'set', [{ hours: 3, minutes: 45 }, true]), 'Date#create | Korean | wednesday with time 3:45');

    dateEqual(testCreateDate('지난 주'), getRelativeDate(null, null, -7), 'Date#create | Korean | Last week');
    dateEqual(testCreateDate('이번 주'), getRelativeDate(null, null, 0), 'Date#create | Korean | this week');
    dateEqual(testCreateDate('다음 주'), getRelativeDate(null, null, 7), 'Date#create | Korean | Next week');

    dateEqual(testCreateDate('지난 달'), getRelativeDate(null, -1), 'Date#create | Korean | last month');
    dateEqual(testCreateDate('이번 달'), getRelativeDate(null, 0), 'Date#create | Korean | this month');
    dateEqual(testCreateDate('다음 달'), getRelativeDate(null, 1), 'Date#create | Korean | Next month');

    dateEqual(testCreateDate('작년'), getRelativeDate(-1), 'Date#create | Korean | Last year');
    dateEqual(testCreateDate('내년'), getRelativeDate(1), 'Date#create | Korean | Next year');
    dateEqual(testCreateDate('지난 해'), getRelativeDate(-1), 'Date#create | Korean | Last year');
    dateEqual(testCreateDate('올해'), getRelativeDate(0), 'Date#create | Korean | this year');
    dateEqual(testCreateDate('다음 해'), getRelativeDate(1), 'Date#create | Korean | Next year');


    dateEqual(testCreateDate('지난 주 수요일'), getDateWithWeekdayAndOffset(3, -7), 'Date#create | Korean | Last wednesday');
    dateEqual(testCreateDate('이번 일요일'), getDateWithWeekdayAndOffset(0), 'Date#create | Korean | this sunday');
    dateEqual(testCreateDate('다음 주 금요일'), getDateWithWeekdayAndOffset(5, 7), 'Date#create | Korean | Next friday');
  });

  method('format', function() {
    var then = new Date(2011, 7, 25, 15, 45, 50);
    test(then, '2011년8월25일 15시45분', 'Date#create | Korean | standard format');
    test(then, ['{yyyy}년{MM}월{dd}일'], '2011년08월25일', 'Date#create | Korean | format');

    // Format shortcuts
    equal(run(then, 'format', ['full']), '2011년8월25일 목요일 15시45분50초', 'Date#create | Korean | full format');
    equal(run(then, 'full'), '2011년8월25일 목요일 15시45분50초', 'Date#create | Korean | full shortcut');
    equal(run(then, 'format', ['long']), '2011년8월25일 15시45분', 'Date#create | Korean | long format');
    equal(run(then, 'long'), '2011년8월25일 15시45분', 'Date#create | Korean | long shortcut');
    equal(run(then, 'format', ['short']), '2011년8월25일', 'Date#create | Korean | short format');
    equal(run(then, 'short'), '2011년8월25일', 'Date#create | Korean | short shortcut');
  });


  method('relative', function() {
    test(testCreateDate('1 second ago', 'en'), '1초 전', 'Date#create | Korean | relative format past');
    test(testCreateDate('1 minute ago', 'en'), '1분 전',  'Date#create | Korean | relative format past');
    test(testCreateDate('1 hour ago', 'en'),   '1시간 전',     'Date#create | Korean | relative format past');
    test(testCreateDate('1 day ago', 'en'),    '1일 전',    'Date#create | Korean | relative format past');
    test(testCreateDate('1 week ago', 'en'),   '1주 전',  'Date#create | Korean | relative format past');
    test(testCreateDate('1 month ago', 'en'),  '1개월 전',   'Date#create | Korean | relative format past');
    test(testCreateDate('1 year ago', 'en'),   '1년 전',     'Date#create | Korean | relative format past');

    test(testCreateDate('2 seconds ago', 'en'), '2초 전', 'Date#create | Korean | relative format past');
    test(testCreateDate('2 minutes ago', 'en'), '2분 전',  'Date#create | Korean | relative format past');
    test(testCreateDate('2 hours ago', 'en'),   '2시간 전',     'Date#create | Korean | relative format past');
    test(testCreateDate('2 days ago', 'en'),    '2일 전',    'Date#create | Korean | relative format past');
    test(testCreateDate('2 weeks ago', 'en'),   '2주 전',  'Date#create | Korean | relative format past');
    test(testCreateDate('2 months ago', 'en'),  '2개월 전',   'Date#create | Korean | relative format past');
    test(testCreateDate('2 years ago', 'en'),   '2년 전',     'Date#create | Korean | relative format past');

    test(testCreateDate('1 second from now', 'en'), '1초 후', 'Date#create | Korean | relative format future');
    test(testCreateDate('1 minute from now', 'en'), '1분 후',  'Date#create | Korean | relative format future');
    test(testCreateDate('1 hour from now', 'en'),   '1시간 후',     'Date#create | Korean | relative format future');
    test(testCreateDate('1 day from now', 'en'),    '1일 후',    'Date#create | Korean | relative format future');
    test(testCreateDate('1 week from now', 'en'),   '1주 후',  'Date#create | Korean | relative format future');
    test(testCreateDate('1 month from now', 'en'),  '1개월 후',   'Date#create | Korean | relative format future');
    test(testCreateDate('1 year from now', 'en'),   '1년 후',     'Date#create | Korean | relative format future');

    test(testCreateDate('5 second from now', 'en'), '5초 후', 'Date#create | Korean | relative format future');
    test(testCreateDate('5 minute from now', 'en'), '5분 후',  'Date#create | Korean | relative format future');
    test(testCreateDate('5 hour from now', 'en'),   '5시간 후',     'Date#create | Korean | relative format future');
    test(testCreateDate('5 day from now', 'en'),    '5일 후',    'Date#create | Korean | relative format future');
    test(testCreateDate('5 week from now', 'en'),   '1개월 후',  'Date#create | Korean | relative format future');
    test(testCreateDate('5 month from now', 'en'),  '5개월 후',   'Date#create | Korean | relative format future');
    test(testCreateDate('5 year from now', 'en'),   '5년 후',     'Date#create | Korean | relative format future');
  });

});

package('Number | Korean Dates', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['ko'], '5시간', 'Date#create | Korean | simple duration');
  });

});

