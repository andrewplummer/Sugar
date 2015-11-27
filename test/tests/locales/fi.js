package('Dates | Finnish', function () {
  "use string";

  var now;
  var then;

  setup(function() {
    now = new Date();
    then = new Date(2011, 7, 25, 15, 45, 50);
    testSetLocale('fi');
  });

  method('relative', function() {
    test(testCreateDate('1 hour ago', 'en'),   'tunti sitten',     'relative format past');
    test(testCreateDate('2 hours ago', 'en'),   '2 tuntia sitten',     'relative format past');
    test(testCreateDate('1 hour from now', 'en'),   'tunnin päästä',     'relative format future');
    test(testCreateDate('2 hours from now', 'en'),   '2 tunnin päästä',     'relative format future');
    test(testCreateDate('12 hours ago', 'en'), '12 tuntia sitten', '22 hours ago');
    test(testCreateDate('12 hours from now', 'en'), '12 tunnin päästä', '22 hours from now');

    test(testCreateDate('125 years ago', 'en'), '125 vuotta sitten', '125 years ago');
    test(testCreateDate('125 years from now', 'en'), '125 vuoden päästä', '125 years from now');
  });

});

