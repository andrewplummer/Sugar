
runPerformanceTest = function() {
  var iterations, fn, start, i = 0, ms;
  var passedArg = arguments[2];
  if(arguments.length == 1) {
    iterations = 10000;
    fn = arguments[0];
  } else {
    iterations = arguments[0];
    fn = arguments[1];
  }
  start = new Date();
  while(i < iterations) {
    fn(passedArg);
    i++;
  }
  ms = new Date() - start
  console.info(iterations + ' iterations finished in ' + ms + ' milliseconds');
  return ms;
}

function runMultipleTestsWithArgumentAndAverage(test, arg, iterationsEach, times) {
  var sum = 0;
  for (var i = 0; i < times; i += 1) {
    sum += runPerformanceTest(iterationsEach, test, arg);
  };
  return Math.round(sum / times);
}

