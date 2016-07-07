namespace('Number', function () {
  'use strict';

  group('now', function() {
    equal(Date.now.length, 0, 'should have argument length of 1');
    equalWithMargin(Date.now(), new Date().getTime(), 5, 'basic functionality');
  });

  group('toISOString', function() {
    equal(Date.prototype.toISOString.length, 0, 'should have argument length of 1');
    equal(new Date(Date.UTC(2000, 0, 1)).toISOString(), '2000-01-01T00:00:00.000Z', 'new millenium!');
    equal(new Date(Date.UTC(1978, 7, 25)).toISOString(), '1978-08-25T00:00:00.000Z', 'happy birthday!');
    equal(new Date(Date.UTC(1978, 7, 25, 11, 45, 33, 456)).toISOString(), '1978-08-25T11:45:33.456Z', 'with time');
  });


  group('toJSON', function() {
    equal(Date.prototype.toJSON.length, 1, 'should have argument length of 1');
    equal(new Date(2002, 7, 25).toJSON(), new Date(2002, 7, 25).toISOString(), 'output');
  });

});
