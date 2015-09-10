package('Date', function () {
  "use strict";

  var now;
  var then;

  setup(function() {
    now = new Date();
    then = new Date(2011, 7, 25, 15, 45, 50);
    testSetLocale('fi');
  });

  method('relative', function() {
    test(testCreateDate('1 hour ago', 'en'), 'tunti sitten', 'relative format past');
    test(testCreateDate('2 hours ago', 'en'), '2 tuntia sitten', 'relative format past');
    test(testCreateDate('1 hour from now', 'en'), 'tunnin päästä', 'relative format future');
    test(testCreateDate('2 hours from now', 'en'), '2 tunnin päästä', 'relative format future');
    test(testCreateDate('12 hours ago', 'en'), '12 tuntia sitten', '22 hours ago');
    test(testCreateDate('12 hours from now', 'en'), '12 tunnin päästä', '22 hours from now');

    test(testCreateDate('125 years ago', 'en'), '125 vuotta sitten', '125 years ago');
    //test(testCreateDate('125 years from now', 'en'), '125 vuoden päästä', '125 years from now');
  });

});

package('Number | Russian Dates', function () {

  method('duration', function() {
    test(run(1, 'year'), ['fi'], 'vuosi', '1 year');
    test(run(10, 'years'), ['fi'], '10 vuotta', '10 years');
    test(run(1, 'month'), ['fi'], 'kuukausi', '1 month');
    test(run(10, 'months'), ['fi'], '10 kuukautta', '10 months');
    test(run(1, 'week'), ['fi'], 'viikko', '1 week');
    test(run(3, 'weeks'), ['fi'], '3 viikkoa', '3 weeks');
    test(run(1, 'day'), ['fi'], 'päivä', '1 day');
    test(run(3, 'days'), ['fi'], '3 päivää', '3 days');
    test(run(1, 'hour'), ['fi'], 'tunti', '1 hour');
    test(run(10, 'hours'), ['fi'], '10 tuntia', '10 hours');
    test(run(1, 'minute'), ['fi'], 'minuutti', '1 minute');
    test(run(10, 'minutes'), ['fi'], '10 minuuttia', '10 minutes');
    test(run(1, 'second'), ['fi'], 'sekunti', '1 second');
    test(run(10, 'seconds'), ['fi'], '10 sekuntia', '10 seconds');
  });

});
