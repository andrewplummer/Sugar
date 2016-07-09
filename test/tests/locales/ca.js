namespace('Date | Catalan', function () {
  'use strict';

  var now, then;

  setup(function() {
    now = new Date();
    then = new Date(2010, 0, 5, 15, 52);
    testSetLocale('ca');
  });

  method('create', function() {

    assertDateParsed('02 febr. 2016', new Date(2016, 1, 2));

    // TODO: write me!

  });

  method('format', function() {

    test(then, '5 gener 2010 15:52', 'default');
    assertFormatShortcut(then, 'short',  '05/01/2010');
    assertFormatShortcut(then, 'medium', '5 gener 2010');
    assertFormatShortcut(then, 'long',   '5 gener 2010 15:52');
    assertFormatShortcut(then, 'full',   'dimarts 5 gener 2010 15:52');
    test(then, ['{time}'], '15:52', 'preferred time');
    test(then, ['{stamp}'], 'dt 5 gen 2010 15:52', 'preferred stamp');
    test(then, ['%c'], 'dt 5 gen 2010 15:52', '%c stamp');

    test(new Date(2015, 10, 8),  ['{Dow}'], 'dg', 'Sun');
    test(new Date(2015, 10, 9),  ['{Dow}'], 'dl', 'Mon');
    test(new Date(2015, 10, 10), ['{Dow}'], 'dt', 'Tue');
    test(new Date(2015, 10, 11), ['{Dow}'], 'dc', 'Wed');
    test(new Date(2015, 10, 12), ['{Dow}'], 'dj', 'Thu');
    test(new Date(2015, 10, 13), ['{Dow}'], 'dv', 'Fri');
    test(new Date(2015, 10, 14), ['{Dow}'], 'ds', 'Sat');

    test(new Date(2015, 0, 1),  ['{Mon}'], 'gen', 'Jan');
    test(new Date(2015, 1, 1),  ['{Mon}'], 'febr', 'Feb');
    test(new Date(2015, 2, 1),  ['{Mon}'], 'mar', 'Mar');
    test(new Date(2015, 3, 1),  ['{Mon}'], 'abr', 'Apr');
    test(new Date(2015, 4, 1),  ['{Mon}'], 'mai', 'May');
    test(new Date(2015, 5, 1),  ['{Mon}'], 'jun', 'Jun');
    test(new Date(2015, 6, 1),  ['{Mon}'], 'jul', 'Jul');
    test(new Date(2015, 7, 1),  ['{Mon}'], 'ag',  'Aug');
    test(new Date(2015, 8, 1),  ['{Mon}'], 'set', 'Sep');
    test(new Date(2015, 9, 1),  ['{Mon}'], 'oct', 'Oct');
    test(new Date(2015, 10, 1), ['{Mon}'], 'nov', 'Nov');
    test(new Date(2015, 11, 1), ['{Mon}'], 'des', 'Dec');


    // TODO: write more!
  });

  method('relative', function() {
    // TODO: write me!
  });

  method('beginning/end', function() {
    // TODO: write me!
  });

});

namespace('Number | Catalan', function () {
  method('duration', function() {
    // TODO: write me!
  });
});
