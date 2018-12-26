assertFunctionIterated = function(fn, expected, exec) {
  var count = 0;
  exec(function() {
    count++;
    return fn.apply(this, arguments);
  });
  assertEqual(count, expected);
};
