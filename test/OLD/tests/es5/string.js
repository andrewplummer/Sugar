namespace('String', function () {
  'use strict';

  group('trim', function() {
    var whiteSpace = '\u0009\u000B\u000C\u0020\u00A0\uFEFF\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000';
    var lineTerminators = '\u000A\u000D\u2028\u2029';

    equal(String.prototype.trim.length, 0, 'should have argument length of 1');

    equal(whiteSpace.trim(), '', 'should trim all WhiteSpace characters defined in 7.2 and Unicode "space, separator and Unicode "space, separator""');
    equal(lineTerminators.trim(), '', 'should trim all LineTerminator characters defined in 7.3');


    equal('   wasabi   '.trim(), 'wasabi', 'should trim both left and right whitespace');
    equal(''.trim(), '', 'blank');
    equal(' wasabi '.trim(), 'wasabi', 'wasabi with whitespace');

    equal(String.prototype.trim.call([1]), '1', 'should handle objects as well');

  });

});
