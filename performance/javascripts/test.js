
runPerformanceTest = function() {
  var iterations, fn, start, i = 0;
  if(arguments.length == 1) {
    iterations = 10000;
    fn = arguments[0];
  } else {
    iterations = arguments[0];
    fn = arguments[1];
  }
  start = new Date();
  while(i < iterations) {
    fn();
    i++;
  }
  console.info(iterations + ' iterations finished in ' + (new Date() - start) + ' milliseconds');
}

