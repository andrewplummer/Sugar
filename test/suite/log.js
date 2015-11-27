globalFailures = 0;

logGreen = function(message) {
  console.log('\x1b[32m', message || '','\x1b[0m');
}

logRed = function(message) {
  console.log('\x1b[31m', message || '','\x1b[0m');
}

logBlue = function(message) {
  console.log('\x1b[36m', message || '','\x1b[0m');
}

logYellow = function(message) {
  console.log('\x1b[33m', message || '','\x1b[0m');
}

logLine = function() {
  console.log();
}

logResults = function(runtime, results, testName, exitOnFail) {
  var i, j, failure, totalAssertions = 0, totalFailures = 0;
  for (i = 0; i < results.length; i += 1) {
    totalAssertions += results[i].assertions;
    totalFailures += results[i].failures.length;
    for(j = 0; j < results[i].failures.length; j++) {
      failure = results[i].failures[j];
      logLine();
      logRed('Failure:');
      logRed(failure.message);
      try {
        logRed('Expected: ' + JSON.stringify(failure.expected) + ' but was: ' + JSON.stringify(failure.actual));
      } catch(e) {
        if (e instanceof TypeError) {
          // Date has a "toJSON" method which means if it or the Sugar
          // global is stringified it will error. In most cases it's the global.
          logRed('Actual value was likely Sugar global object!');
        } else {
          throw e;
        }
      }
      logRed('File: ' + failure.file + ', Line: ' + failure.line, ' Col: ' + failure.col);
    }
  };
  var time = (runtime / 1000);
  logLine();
  if (totalFailures === 0) {
    logGreen(testName);
    logGreen(totalAssertions + ' assertions, ' + totalFailures + ' failures, ' + time + 's');
  } else {
    logRed(testName);
    logRed(totalAssertions + ' assertions, ' + totalFailures + ' failures, ' + time + 's');
    if (exitOnFail !== false) {
      if (typeof quit !== undefined) {
        quit();
      } else {
        process.exit(1);
      }
    }
  }
  globalFailures += totalFailures;
}



