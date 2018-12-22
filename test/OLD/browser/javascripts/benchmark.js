
runPerformanceTest = function(name, fn, arg, iterations) {
  var start, i = 0, ms;
  start = new Date();
  while(i < iterations) {
    fn(arg);
    i++;
  }
  ms = new Date() - start;
  console.info(name + ': ' + iterations + ' iterations finished in ' + ms + ' milliseconds');
  return ms;
}

function runMultipleTestsWithArgumentAndAverage(name, fn, arg, iterations, times) {
  var sum = 0;
  for (var i = 0; i < times; i += 1) {
    sum += runPerformanceTest(name, fn, arg, iterations);
  };
  return Math.round(sum / times);
}

