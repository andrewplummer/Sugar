namespace('Date | Italian', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('it');
  });

  method('create', function() {

    assertDateParsed('15 Maggio 2011', new Date(2011, 4, 15));
    assertDateParsed('Giovedì, 5 Gennaio 2012', new Date(2012, 0, 5));
    assertDateParsed('Maggio 2011', new Date(2011, 4));
    assertDateParsed('15 Maggio', new Date(now.getFullYear(), 4, 15));
    assertDateParsed('2011', new Date(2011, 0));
    assertDateParsed('02 feb 2016', new Date(2016, 1, 2));

    assertDateParsed('Maggio', new Date(now.getFullYear(), 4));
    assertDateParsed('Lunedì', testGetWeekday(1));
    assertDateParsed('Lun', testGetWeekday(1));

    assertDateParsed('Giovedì, 5 Gennaio 2012 3:45', new Date(2012, 0, 5, 3, 45));
    assertDateParsed('Giovedì, 5 Gennaio 2012 3:45pm', new Date(2012, 0, 5, 15, 45));

    assertDateParsed('un millisecondo fa', getRelativeDate(0,0,0,0,0,0,-1));
    assertDateParsed('un secondo fa',      getRelativeDate(0,0,0,0,0,-1));
    assertDateParsed('un minuto fa',       getRelativeDate(0,0,0,0,-1));
    assertDateParsed("un'ora fa",          getRelativeDate(0,0,0,-1));
    assertDateParsed('un giorno fa',       getRelativeDate(0,0,-1));
    assertDateParsed('una settimana fa',   getRelativeDate(0,0,-7));
    assertDateParsed('un mese fa',         getRelativeDate(0,-1));
    assertDateParsed('un anno fa',         getRelativeDate(-1));


    assertDateParsed('5 millisecondi da adesso', getRelativeDate(0,0,0,0,0,0,5));
    assertDateParsed('5 secondi da adesso',   getRelativeDate(0,0,0,0,0,5));
    assertDateParsed('5 minuti da adesso',    getRelativeDate(0,0,0,0,5));
    assertDateParsed('5 ore da adesso',       getRelativeDate(0,0,0,5));
    assertDateParsed('5 giorni da adesso',    getRelativeDate(0,0,5));
    assertDateParsed('5 settimane da adesso', getRelativeDate(0,0,35));
    assertDateParsed('5 mesi da adesso',      getRelativeDate(0,5));
    assertDateParsed('5 anni da adesso',      getRelativeDate(5));


    assertDateParsed('ieri',       getRelativeDateReset(0,0,-1));
    assertDateParsed('oggi',       getRelativeDateReset(0,0,0));
    assertDateParsed('domani',     getRelativeDateReset(0,0,1));
    assertDateParsed('dopodomani', getRelativeDateReset(0,0,2));

    assertDateParsed('la settimana scorsa',   getRelativeDate(0,0,-7));
    assertDateParsed('la settimana prossima', getRelativeDate(0,0,7));

    assertDateParsed('il mese scorso',   getRelativeDate(0,-1));
    assertDateParsed('il mese prossimo', getRelativeDate(0,1));

    assertDateParsed("l'anno scorso",   getRelativeDate(-1));
    assertDateParsed("l'anno prossimo", getRelativeDate(1));

    assertDateParsed('lunedì prossimo', testGetWeekday(1, 1));
    assertDateParsed('lunedì scorsa',   testGetWeekday(1, -1));

    assertDateNotParsed('prossimo lunedì');
    assertDateNotParsed('scorsa lunedì');

    assertDateParsed('lunedì scorsa 3:45', testGetWeekday(1, -1, 3, 45));

    // No accents
    assertDateParsed('Giovedì, 5 Gennaio 2012', new Date(2012, 0, 5));
    assertDateParsed('Lunedi', testGetWeekday(1));

    // Issue #152 Italian should not use a variant in any format
    assertDateParsed('15/3/2012 12:45', new Date(2012, 2, 15, 12, 45));
    assertDateParsed('12:45 15/3/2012', new Date(2012, 2, 15, 12, 45));

    // Issue #150 Fully qualified ISO codes should be allowed
    assertDateParsed('7 gennaio 2012', 'it_IT', new Date(2012, 0, 7));
    assertDateParsed('7 gennaio 2012', 'it-IT', new Date(2012, 0, 7));

    // Issue #150 Unrecognized locales will result in invalid dates, but will not throw an error
    // Update: Now it will fall back to the current locale.
    equal(run(testCreateDate('7 gennaio 2012', 'ux_UX'), 'isValid'), true, 'unknown locale code');
    equal(run(testCreateDate('2012/08/25', 'ux_UX'), 'isValid'), true, 'System intelligible formats are still parsed');

    assertDateParsed('17:32 18 agosto', new Date(now.getFullYear(), 7, 18, 17, 32));
    assertDateParsed('17:32 lunedì prossimo', testGetWeekday(1, 1, 17, 32));

    assertDateParsed('domani alle 3:30', testDateSet(getRelativeDateReset(0,0,1), {hour:3,minute:30}));


    // Numbers

    assertDateParsed('zero anni fa',    getRelativeDate(0));
    assertDateParsed('un anno fa',      getRelativeDate(-1));
    assertDateParsed('due anni fa',     getRelativeDate(-2));
    assertDateParsed('tre anni fa',     getRelativeDate(-3));
    assertDateParsed('quattro anni fa', getRelativeDate(-4));
    assertDateParsed('cinque anni fa',  getRelativeDate(-5));
    assertDateParsed('sei anni fa',     getRelativeDate(-6));
    assertDateParsed('sette anni fa',   getRelativeDate(-7));
    assertDateParsed('otto anni fa',    getRelativeDate(-8));
    assertDateParsed('nove anni fa',    getRelativeDate(-9));
    assertDateParsed('dieci anni fa',   getRelativeDate(-10));

  });


  method('format', function() {

    test(then, '5 gennaio 2010 15:52', 'default format');

    assertFormatShortcut(then, 'short', '05/01/2010');
    assertFormatShortcut(then, 'medium', '5 gennaio 2010');
    assertFormatShortcut(then, 'long', '5 gennaio 2010 15:52');
    assertFormatShortcut(then, 'full', 'martedì, 5 gennaio 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'mar 5 gen 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'mar 5 gen 2010 15:52', '%c stamp');

    test(new Date('January 3, 2010'), ['{w}'], '53', 'locale week number | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{ww}'], '53', 'locale week number padded | Jan 3 2010');
    test(new Date('January 3, 2010'), ['{wo}'], '53rd', 'locale week number ordinal | Jan 3 2010');
    test(new Date('January 4, 2010'), ['{w}'], '1', 'locale week number | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{ww}'], '01', 'locale week number padded | Jan 4 2010');
    test(new Date('January 4, 2010'), ['{wo}'], '1st', 'locale week number ordinal | Jan 4 2010');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'dom', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'lun', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'mar', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'mer', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'gio', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'ven', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'sab', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], 'gen', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'feb', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'mar', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'apr', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'mag', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'giu', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'lug', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'ago', 'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'set', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'ott', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'nov', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'dic', 'Dec');

  });


  method('relative', function() {
    assertRelative('1 second ago', '1 secondo fa');
    assertRelative('1 minute ago', '1 minuto fa');
    assertRelative('1 hour ago',   '1 ora fa');
    assertRelative('1 day ago',    '1 giorno fa');
    assertRelative('1 week ago',   '1 settimana fa');
    assertRelative('1 month ago',  '1 mese fa');
    assertRelative('1 year ago',   '1 anno fa');

    assertRelative('2 seconds ago', '2 secondi fa');
    assertRelative('2 minutes ago', '2 minuti fa');
    assertRelative('2 hours ago',   '2 ore fa');
    assertRelative('2 days ago',    '2 giorni fa');
    assertRelative('2 weeks ago',   '2 settimane fa');
    assertRelative('2 months ago',  '2 mesi fa');
    assertRelative('2 years ago',   '2 anni fa');

    assertRelative('1 second from now', '1 secondo da adesso');
    assertRelative('1 minute from now', '1 minuto da adesso');
    assertRelative('1 hour from now',   '1 ora da adesso');
    assertRelative('1 day from now',    '1 giorno da adesso');
    assertRelative('1 week from now',   '1 settimana da adesso');
    assertRelative('1 year from now',   '1 anno da adesso');

    assertRelative('5 second from now', '5 secondi da adesso');
    assertRelative('5 minutes from now','5 minuti da adesso');
    assertRelative('5 hour from now',   '5 ore da adesso');
    assertRelative('5 day from now',    '5 giorni da adesso');
    assertRelative('5 week from now',   '1 mese da adesso');
    assertRelative('5 year from now',   '5 anni da adesso');
  });

  method('beginning/end', function() {
    equal(run(new Date(2010, 0), 'beginningOfWeek'), new Date(2009, 11, 28), 'beginningOfWeek');
    equal(run(new Date(2010, 0), 'endOfWeek'), new Date(2010, 0, 3, 23, 59, 59, 999), 'endOfWeek');
  });

});

namespace('Number | Italian', function () {

  method('duration', function() {
    test(run(5, 'hours'), ['it'], '5 ore', 'simple duration');
  });

});

