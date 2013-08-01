
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

$.get('sample.json', function(obj) {
  jsonArray = obj.items;
});

normalDate = new Date();

zero           = 0;
smallInteger   = 85;
hugeNumber     = 893249283429;
floatingNumber = 463.34534533;



emptyString  = '';
normalString = 'abcdefg';
hugeString   = '';


emptyArray       = [];
smallNumberArray = [1,2,3];
smallStringArray = ['a','b','c'];

bigNumberArray = [];
bigStringArray = [];
bigDateArray   = [];

(function() {

  for(var i = 0; i < 10000; i++) {
    var rand = Math.floor(Math.random() * 1000);
    var char = String.fromCharCode(rand);
    bigNumberArray.push(rand);
    bigDateArray.push(new Date(rand));
    bigStringArray.push(char);
    hugeString += char;
  }

})();
