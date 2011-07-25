test('RegExp', function () {

  var r, n;

  equals(RegExp.escape('test regexp'), 'test regexp', 'RegExp#escape');
  equals(RegExp.escape('test reg|exp'), 'test reg\\|exp', 'RegExp#escape');
  equals(RegExp.escape('hey there (budday)'), 'hey there \\(budday\\)', 'RegExp#escape');
  equals(RegExp.escape('what a day...'), 'what a day\\.\\.\\.', 'RegExp#escape');
  equals(RegExp.escape('.'), '\\.', 'RegExp#escape');
  equals(RegExp.escape('*.+[]{}()?|/'), '\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/', 'RegExp#escape');

  r = /foobar/;
  n = r.setFlags('gim');

  equals(n.global, true, 'RegExp#setFlags');
  equals(n.ignoreCase, true, 'RegExp#setFlags');
  equals(n.multiline, true, 'RegExp#setFlags');

  equals(r.global, false, 'RegExp#setFlags | initial regex is untouched');
  equals(r.ignoreCase, false, 'RegExp#setFlags | initial regex is untouched');
  equals(r.multiline, false, 'RegExp#setFlags | initial regex is untouched');

  n = r.addFlag('g');

  equals(n.global, true, 'RegExp#addFlag');
  equals(n.ignoreCase, false, 'RegExp#addFlag');
  equals(n.multiline, false, 'RegExp#addFlag');

  equals(r.global, false, 'RegExp#addFlag | initial regex is untouched');
  equals(r.ignoreCase, false, 'RegExp#addFlag | initial regex is untouched');
  equals(r.multiline, false, 'RegExp#addFlag | initial regex is untouched');


  r = /foobar/gim;
  n = r.removeFlag('g');

  equals(n.global, false, 'RegExp#removeFlag');
  equals(n.ignoreCase, true, 'RegExp#removeFlag');
  equals(n.multiline, true, 'RegExp#removeFlag');

  equals(r.global, true, 'RegExp#removeFlag | initial regex is untouched');
  equals(r.ignoreCase, true, 'RegExp#removeFlag | initial regex is untouched');
  equals(r.multiline, true, 'RegExp#removeFlag | initial regex is untouched');
});

