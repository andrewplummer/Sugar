if (typeof globalFailures === 'undefined') {
  globalFailures = 0;
}

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

logResults = function(runtime, results, testName) {
  var i, j, failure, totalAssertions = 0, totalFailures = 0, totalSkipped = 0;
  for (i = 0; i < results.length; i += 1) {
    totalAssertions += results[i].assertions;
    totalFailures += results[i].failures.length;
    totalSkipped += results[i].skipped.length;
    for(j = 0; j < results[i].failures.length; j++) {
      failure = results[i].failures[j];
      logLine();
      logRed('Failure:');
      logRed(failure.message);
      try {
        logRed('Expected: ' + logStringify(failure.expected) + ' but was: ' + logStringify(failure.actual));
      } catch(e) {
        if (e instanceof TypeError) {
          // Sugar.Date has a "toJSON" method which means if it or the Sugar
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
  var assertions = formatNumber(totalAssertions);
  var failures   = formatNumber(totalFailures);
  var skipped   = formatNumber(totalSkipped);
  if (totalFailures === 0) {
    logGreen(testName);
    skipped = totalSkipped ? skipped + ' skipped, ' : '';
    logGreen(assertions + ' assertions, ' + failures + ' failures, ' + skipped + time + 's');
  } else {
    logRed(testName);
    skipped = totalSkipped ? skipped + ' skipped, ' : '';
    logRed(assertions + ' assertions, ' + failures + ' failures, ' + skipped + time + 's');
  }
  globalFailures += totalFailures;
}

function logStringify(obj) {
  if (typeof JSON !== 'undefined') {
    return JSON.stringify(obj);
  }
  return String(obj);
}

function formatNumber(n) {
  var str = n.toFixed();
  if (str.length > 3) {
    str = str.slice(0, -3) + ',' + str.slice(-3);
  }
  return str;
}
