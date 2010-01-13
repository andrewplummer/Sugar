



Qunit





/*
 *
var tests = $('#suite');
var currentTest;
var testNumber = 1;

QUnit.log = function(result, message){
  var pass = result ? '.' : 'F';
  console.info(currentTest);
  console.info($('#'+currentTest+' .assertions'));
  $('#'+currentTest+' .assertions').append('<span title="'+message+'">'+pass+'</span>');
}

QUnit.testStart = function(name){
  currentTest = 'test_' + testNumber;
  testNumber++;
  tests.append('<div id="'+currentTest+'" class="test"><h2>'+name+'</h2><div class="assertions"></div></div>');
}

QUnit.testDone = function(name, failures, total){
  console.info(window.parent);
  var test = $('#'+currentTest);
  if(failures == 0){
    test.addClass('pass');
    test.attr('title', 'Test Passed. '+total+' assertions.');
  } else {
    test.addClass('fail');
    test.attr('title', 'Test Failed. '+failures+' failures out of '+total+' assertions.');
  }
}

*/
