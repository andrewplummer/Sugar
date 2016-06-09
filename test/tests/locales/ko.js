namespace('Date | Korean', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('ko');
  });

  method('create', function() {

    equal(testCreateDate('2011년5월15일'), new Date(2011, 4, 15), '2011-4-15');
    equal(testCreateDate('2011년5월'), new Date(2011, 4), 'year and month');
    equal(testCreateDate('5월15일'), new Date(now.getFullYear(), 4, 15), 'month and date');
    equal(testCreateDate('2011년'), new Date(2011, 0), 'year');
    equal(testCreateDate('2016년 2월 02일'), new Date(2016, 1, 2), 'toLocaleDateString');

    equal(testCreateDate('5월'), new Date(now.getFullYear(), 4), 'month');
    equal(testCreateDate('15일'), new Date(now.getFullYear(), now.getMonth(), 15), 'date');
    equal(testCreateDate('월요일'), testGetWeekday(1), 'Monday');
    equal(testCreateDate('구일'), new Date(now.getFullYear(), now.getMonth(), 9), 'the 9th');
    equal(testCreateDate('이십오일'), new Date(now.getFullYear(), now.getMonth(), 25), 'the 25th');
    equal(testCreateDate('한달 전'), getRelativeDate(0,-1), 'one month ago 달');

    equal(testCreateDate('2011년5월15일 3:45'), new Date(2011, 4, 15, 3, 45), '3:45');
    equal(testCreateDate('2011년5월15일 오후3:45'), new Date(2011, 4, 15, 15, 45), '3:45pm');
    equal(testCreateDate('2011년5월15일 오후 3시 45분'), new Date(2011, 4, 15, 15, 45), 'full korean letters');

    equal(testCreateDate('1밀리초 전'), getRelativeDate(0,0,0,0,0,0,-1), 'one millisecond ago');
    equal(testCreateDate('1초 전'),     getRelativeDate(0,0,0,0,0,-1), 'one second ago');
    equal(testCreateDate('1분 전'),     getRelativeDate(0,0,0,0,-1), 'one minute ago');
    equal(testCreateDate('1시간 전'),   getRelativeDate(0,0,0,-1), 'one hour ago');
    equal(testCreateDate('1일 전'),     getRelativeDate(0,0,-1), 'one day ago');
    equal(testCreateDate('1주 전'),     getRelativeDate(0,0,-7), 'one week');
    equal(testCreateDate('1개월 전'),   getRelativeDate(0,-1), 'one month ago 개월');
    equal(testCreateDate('1년 전'),     getRelativeDate(-1), 'one year ago');

    equal(testCreateDate('5밀리초 후'), getRelativeDate(0,0,0,0,0,0,5), 'five millisecond from now');
    equal(testCreateDate('5초 후'),     getRelativeDate(0,0,0,0,0,5), 'five second from now');
    equal(testCreateDate('5분 후'),     getRelativeDate(0,0,0,0,5), 'five minute from now');
    equal(testCreateDate('5시간 후'),   getRelativeDate(0,0,0,5), 'five hour from now');
    equal(testCreateDate('5일 후'),     getRelativeDate(0,0,5), 'five day from now');
    equal(testCreateDate('5주 후'),     getRelativeDate(0,0,35), 'five weeks from now');
    equal(testCreateDate('5개월 후'),   getRelativeDate(0,5), 'five months 개월');
    equal(testCreateDate('5년 후'),     getRelativeDate(5), 'five years from now');

    equal(testCreateDate('그저께'), run(getRelativeDate(0,0,-2), 'reset'), '그저께');
    equal(testCreateDate('어제'),   run(getRelativeDate(0,0,-1), 'reset'), 'yesterday');
    equal(testCreateDate('오늘'),   run(getRelativeDate(0,0,0), 'reset'), 'today');
    equal(testCreateDate('내일'),   run(getRelativeDate(0,0,1), 'reset'), 'tomorrow');
    equal(testCreateDate('모레'),   run(getRelativeDate(0,0,2), 'reset'), '모레');

    equal(testCreateDate('내일 3:45'),     run(getRelativeDate(0,0,1), 'set', [{ hours: 3, minutes: 45 }, true]), 'tomorrow with time 3:45');
    equal(testCreateDate('내일 오후3:45'), run(getRelativeDate(0,0,1), 'set', [{ hours: 15, minutes: 45 }, true]), 'tomorrow with time 3:45pm');
    equal(testCreateDate('수요일 3:45'),   run(testGetWeekday(3), 'set', [{ hours: 3, minutes: 45 }, true]), 'wednesday with time 3:45');

    equal(testCreateDate('지난 주'), getRelativeDate(0,0,-7), 'Last week');
    equal(testCreateDate('이번 주'), getRelativeDate(0,0,0), 'this week');
    equal(testCreateDate('다음 주'), getRelativeDate(0,0,7), 'Next week');

    equal(testCreateDate('지난 달'), getRelativeDate(0,-1), 'last month');
    equal(testCreateDate('이번 달'), getRelativeDate(0,0), 'this month');
    equal(testCreateDate('다음 달'), getRelativeDate(0,1), 'Next month');

    equal(testCreateDate('작년'),    getRelativeDate(-1), 'Last year');
    equal(testCreateDate('내년'),    getRelativeDate(1), 'Next year');
    equal(testCreateDate('지난 해'), getRelativeDate(-1), 'Last year');
    equal(testCreateDate('올해'),    getRelativeDate(0), 'this year');
    equal(testCreateDate('다음 해'), getRelativeDate(1), 'Next year');


    equal(testCreateDate('지난 주 수요일'), testGetWeekday(3, -1), 'Last wednesday');
    equal(testCreateDate('이번 일요일'),    testGetWeekday(0), 'this sunday');
    equal(testCreateDate('다음 주 금요일'), testGetWeekday(5, 1), 'Next friday');

    // Numbers

    equal(testCreateDate('영년 전'), getRelativeDate(0),   'zero years ago');
    equal(testCreateDate('일년 전'), getRelativeDate(-1),  'one year ago');
    equal(testCreateDate('이년 전'), getRelativeDate(-2),  'two years ago');
    equal(testCreateDate('삼년 전'), getRelativeDate(-3),  'three years ago');
    equal(testCreateDate('사년 전'), getRelativeDate(-4),  'four years ago');
    equal(testCreateDate('오년 전'), getRelativeDate(-5),  'five years ago');
    equal(testCreateDate('육년 전'), getRelativeDate(-6),  'six years ago');
    equal(testCreateDate('칠년 전'), getRelativeDate(-7),  'seven years ago');
    equal(testCreateDate('팔년 전'), getRelativeDate(-8),  'eight years ago');
    equal(testCreateDate('구년 전'), getRelativeDate(-9),  'nine years ago');
    equal(testCreateDate('십년 전'), getRelativeDate(-10), 'ten years ago');


    // Issue #524
    equal(testCreateDate('2015년 11월 24일'), new Date(2015, 10, 24), 'spaced out');
    equal(testCreateDate('2015년 11월 24일 화요일'), new Date(2015, 10, 24), 'spaced out with weekday');

  });

  method('format', function() {

    test(then, '2010년 1월 5일 오후 3시 52분', 'default format');

    assertFormatShortcut(then, 'short', '2010.01.05');
    assertFormatShortcut(then, 'medium', '2010년 1월 5일');
    assertFormatShortcut(then, 'long', '2010년 1월 5일 오후 3시 52분');
    assertFormatShortcut(then, 'full', '2010년 1월 5일 화요일 오후 3시 52분');
    test(then, ['{time}'], '오후 3시 52분', 'preferred time');
    test(then, ['{stamp}'], '2010년 1월 5일 15:52 화', 'preferred stamp');
    test(then, ['%c'], '2010년 1월 5일 15:52 화', '%c stamp');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], '일', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], '월', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], '화', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], '수', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], '목', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], '금', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], '토', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], '1월', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], '2월', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], '3월', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], '4월', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], '5월', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], '6월', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], '7월', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], '8월', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], '9월', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], '10월', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], '11월', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], '12월', 'Dec');

  });


  method('relative', function() {
    assertRelative('1 second ago', '1초 전');
    assertRelative('1 minute ago', '1분 전');
    assertRelative('1 hour ago', '1시간 전');
    assertRelative('1 day ago', '1일 전');
    assertRelative('1 week ago', '1주 전');
    assertRelative('1 month ago', '1개월 전');
    assertRelative('1 year ago', '1년 전');

    assertRelative('2 seconds ago', '2초 전');
    assertRelative('2 minutes ago', '2분 전');
    assertRelative('2 hours ago', '2시간 전');
    assertRelative('2 days ago', '2일 전');
    assertRelative('2 weeks ago', '2주 전');
    assertRelative('2 months ago', '2개월 전');
    assertRelative('2 years ago', '2년 전');

    assertRelative('1 second from now', '1초 후');
    assertRelative('1 minute from now', '1분 후');
    assertRelative('1 hour from now', '1시간 후');
    assertRelative('1 day from now', '1일 후');
    assertRelative('1 week from now', '1주 후');
    assertRelative('1 year from now', '1년 후');

    assertRelative('5 seconds from now', '5초 후');
    assertRelative('5 minutes from now', '5분 후');
    assertRelative('5 hours from now', '5시간 후');
    assertRelative('5 days from now', '5일 후');
    assertRelative('5 weeks from now', '1개월 후');
    assertRelative('5 years from now', '5년 후');
  });

  method('beginning/end', function() {
    equal(dateRun(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(dateRun(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Korean', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['ko'], '5시간', 'simple duration');
  });

});

