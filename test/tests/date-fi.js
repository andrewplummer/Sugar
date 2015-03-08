package('Dates Finnish', function () {
  "use strict";

  var now;
  var then;

  setup(function() {
    now = new Date();
    then = new Date(2011, 7, 25, 15, 45, 50);
    testSetLocale('fi');
  });

  method('relative', function() {
    assertRelative('1 hour ago', 'tunti sitten');
    assertRelative('2 hours ago', '2 tuntia sitten');
    assertRelative('1 hour from now', 'tunnin päästä');
    assertRelative('2 hours from now', '2 tunnin päästä');
    assertRelative('12 hours ago', '12 tuntia sitten');
    assertRelative('12 hours from now', '12 tunnin päästä');

    assertRelative('125 years ago', '125 vuotta sitten');
    //test(testCreateDate('125 years from now', '125 vuoden päästä', '125 years from now');
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
