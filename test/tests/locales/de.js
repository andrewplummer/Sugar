namespace('Date | German', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('de');
  });

  method('create', function() {

    assertDateParsed('15. Mai 2011', new Date(2011, 4, 15));
    assertDateParsed('Donnerstag, 5. Januar 2012', new Date(2012, 0, 5));
    assertDateParsed('Mai 2011', new Date(2011, 4));
    assertDateParsed('15. Mai', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011', new Date(2011, 0));
    assertDateParsed('02. Feb. 2016', new Date(2016, 1, 2));

    assertDateParsed('Donnerstag, 5. Januar 2012 3:45', new Date(2012, 0, 5, 3, 45));
    assertDateParsed('Donnerstag, 5. Januar 2012 3:45pm', new Date(2012, 0, 5, 15, 45));

    assertDateParsed('Januar',    new Date(now.getFullYear(), 0));
    assertDateParsed('Februar',   new Date(now.getFullYear(), 1));
    assertDateParsed('Marz',      new Date(now.getFullYear(), 2));
    assertDateParsed('März',      new Date(now.getFullYear(), 2));
    assertDateParsed('April',     new Date(now.getFullYear(), 3));
    assertDateParsed('Mai',       new Date(now.getFullYear(), 4));
    assertDateParsed('Juni',      new Date(now.getFullYear(), 5));
    assertDateParsed('Juli',      new Date(now.getFullYear(), 6));
    assertDateParsed('August',    new Date(now.getFullYear(), 7));
    assertDateParsed('September', new Date(now.getFullYear(), 8));
    assertDateParsed('Oktober',   new Date(now.getFullYear(), 9));
    assertDateParsed('November',  new Date(now.getFullYear(), 10));
    assertDateParsed('Dezember',  new Date(now.getFullYear(), 11));


    assertDateParsed('Sonntag',    testGetWeekday(0));
    assertDateParsed('Montag',     testGetWeekday(1));
    assertDateParsed('Dienstag',   testGetWeekday(2));
    assertDateParsed('Mittwoch',   testGetWeekday(3));
    assertDateParsed('Donnerstag', testGetWeekday(4));
    assertDateParsed('Freitag',    testGetWeekday(5));
    assertDateParsed('Samstag',    testGetWeekday(6));

    assertDateParsed('einer Millisekunde vorher', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('eine Sekunde vorher',       getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('einer Minute vorher',       getRelativeDate(0,0,0,0,-1));
    assertDateParsed('einer Stunde vorher',       getRelativeDate(0,0,0,-1));
    assertDateParsed('einen Tag vorher',          getRelativeDate(0,0,-1));
    assertDateParsed('eine Woche vorher',         getRelativeDate(0,0,-7));
    assertDateParsed('einen Monat vorher',        getRelativeDate(0,-1));
    assertDateParsed('ein Jahr vorher',           getRelativeDate(-1));

    assertDateParsed('vor einer Millisekunde', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('vor einer Sekunde',      getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('vor einer Minute',       getRelativeDate(0,0,0,0,-1));
    assertDateParsed('vor einer Stunde',       getRelativeDate(0,0,0,-1));
    assertDateParsed('vor einem Tag',          getRelativeDate(0,0,-1));
    assertDateParsed('vor einer Woche',        getRelativeDate(0,0,-7));
    assertDateParsed('vor einem Monat',        getRelativeDate(0,-1));
    assertDateParsed('vor einem Jahr',         getRelativeDate(-1));


    assertDateParsed('in 5 Millisekunden', getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('in 5 Sekunden',      getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('in 5 Minuten',       getRelativeDate(0,0,0,0,5));
    assertDateParsed('in 5 Stunden',       getRelativeDate(0,0,0,5));
    assertDateParsed('in 5 Tagen',         getRelativeDate(0,0,5));
    assertDateParsed('in 5 Wochen',        getRelativeDate(0,0,35));
    assertDateParsed('in 5 Monaten',       getRelativeDate(0,5));
    assertDateParsed('in 5 Jahren',        getRelativeDate(5));


    assertDateParsed('vorgestern', getRelativeDateReset(0,0,-2));
    assertDateParsed('gestern',    getRelativeDateReset(0,0,-1));
    assertDateParsed('heute',      getRelativeDateReset(0,0,0));
    assertDateParsed('morgen',     getRelativeDateReset(0,0,1));
    assertDateParsed('übermorgen', getRelativeDateReset(0,0,2));

    assertDateParsed('letzte Woche',  getRelativeDate(0,0,-7));
    assertDateParsed('nächste Woche', getRelativeDate(0,0,7));

    assertDateParsed('letzter Monat',  getRelativeDate(0,-1));
    assertDateParsed('letzten Monat',  getRelativeDate(0,-1));
    assertDateParsed('nächster Monat', getRelativeDate(0,1));
    assertDateParsed('nächsten Monat', getRelativeDate(0,1));

    assertDateParsed('letztes Jahr',  getRelativeDate(-1));
    assertDateParsed('nächstes Jahr', getRelativeDate(1));


    assertDateParsed('kommenden Montag',    testGetWeekday(1, 1));
    assertDateParsed('nächster Montag',     testGetWeekday(1, 1));
    assertDateParsed('letztes Montag',      testGetWeekday(1, -1));
    assertDateParsed('letztes Montag 3:45', testGetWeekday(1,-1,3,45));

    // no accents
    assertDateParsed('ubermorgen',  getRelativeDateReset(0,0,2));
    assertDateParsed('uebermorgen', getRelativeDateReset(0,0,2));

    assertDateParsed('naechster Monat', getRelativeDate(0,1));
    assertDateParsed('naechster Monat', getRelativeDate(0,1));
    assertDateParsed('naechsten Monat', getRelativeDate(0,1));
    assertDateParsed('naechstes Jahr',  getRelativeDate(1));

    assertDateParsed('3:45 15. Mai 2011', new Date(2011, 4, 15, 3, 45));
    assertDateParsed('3:45 nächster Montag', testGetWeekday(1, 1, 3, 45));

    assertDateParsed('morgen um 3:30', testDateSet(getRelativeDateReset(0,0,1),{hour:3,minute:30}));

    // Numbers

    assertDateParsed('vor null Jahre',    getRelativeDate(0));
    assertDateParsed('vor einem Jahr',    getRelativeDate(-1));
    assertDateParsed('vor zwei Jahren',   getRelativeDate(-2));
    assertDateParsed('vor drei Jahren',   getRelativeDate(-3));
    assertDateParsed('vor vier Jahren',   getRelativeDate(-4));
    assertDateParsed('vor fuenf Jahren',  getRelativeDate(-5));
    assertDateParsed('vor sechs Jahren',  getRelativeDate(-6));
    assertDateParsed('vor sieben Jahren', getRelativeDate(-7));
    assertDateParsed('vor acht Jahren',   getRelativeDate(-8));
    assertDateParsed('vor neun Jahren',   getRelativeDate(-9));
    assertDateParsed('vor zehn Jahren',   getRelativeDate(-10));

  });


  method('format', function() {

    test(then, '5. Januar 2010 15:52', 'default format');

    assertFormatShortcut(then, 'short', '05.01.2010');
    assertFormatShortcut(then, 'medium', '5. Januar 2010');
    assertFormatShortcut(then, 'long', '5. Januar 2010 15:52');
    assertFormatShortcut(then, 'full', 'Dienstag, 5. Januar 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'Di 5 Jan 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'Di 5 Jan 2010 15:52', '%c stamp');

    test(then, ['%A'], 'Dienstag', 'full weekday');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'So', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'Mo', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'Di', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'Mi', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'Do', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'Fr', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'Sa', 'Sat');
    test(new Date(2015, 0, 1),  ['{Mon}'], 'Jan', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'Feb', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'März', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'Apr', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'Mai', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'Juni', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'Juli', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'Aug', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'Sept', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'Okt', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'Nov', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'Dez', 'Dec');

    // Issue #489
    equal(run(then, 'format', ['{dow}']), 'di', 'dow token should be 2 characters');
    equal(run(then, 'format', ['{Dow}']), 'Di', 'Dow token should be 2 characters');
    equal(run(then, 'format', ['%a']), 'Di', 'strftime token should be 2 characters');

  });


  method('relative', function() {
    assertRelative('1 second ago', 'vor 1 Sekunde');
    assertRelative('1 minute ago', 'vor 1 Minute');
    assertRelative('1 hour ago',   'vor 1 Stunde');
    assertRelative('1 day ago',    'vor 1 Tag');
    assertRelative('1 week ago',   'vor 1 Woche');
    assertRelative('1 month ago',  'vor 1 Monat');
    assertRelative('1 year ago',   'vor 1 Jahr');

    assertRelative('5 seconds ago', 'vor 5 Sekunden');
    assertRelative('5 minutes ago', 'vor 5 Minuten');
    assertRelative('5 hours ago',   'vor 5 Stunden');
    assertRelative('5 days ago',    'vor 5 Tagen');
    assertRelative('5 weeks ago',   'vor 1 Monat');
    assertRelative('5 months ago',  'vor 5 Monaten');
    assertRelative('5 years ago',   'vor 5 Jahren');

    assertRelative('1 second from now', 'in 1 Sekunde');
    assertRelative('1 minute from now', 'in 1 Minute');
    assertRelative('1 hour from now',   'in 1 Stunde');
    assertRelative('1 day from now',    'in 1 Tag');
    assertRelative('1 week from now',   'in 1 Woche');
    assertRelative('1 year from now',   'in 1 Jahr');

    assertRelative('5 second from now', 'in 5 Sekunden');
    assertRelative('5 minutes from now','in 5 Minuten');
    assertRelative('5 hour from now',   'in 5 Stunden');
    assertRelative('5 day from now',    'in 5 Tagen');
    assertRelative('5 week from now',   'in 1 Monat');
    assertRelative('5 year from now',   'in 5 Jahren');
  });

  method('beginning/end', function() {
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | German', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['de'], '5 Stunden', 'simple duration');
  });

});

