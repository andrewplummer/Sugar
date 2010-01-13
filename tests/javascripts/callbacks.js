



(function(){

  var suite = $('#suite');
  var module;
  var test;
  var assertions;

  QUnit = {
    log: function(result, message){
      if(!result){
        assertions += '<p class="fail">'+message+'</p>';
      }
    },

    testStart: function(){
      test = $('<ul class="test"/>');
      assertions = '';
    },

    testDone: function(name, failures, total, environment){
      var text,css;
      var title = '<h4>' + name + '</h4>';
      if(failures == 0){
        text = '.';
        css = 'pass';
        title += '<p class="pass">Pass</p>';
      } else {
        text = 'F';
        css = 'fail';
        title += assertions;
      }

      console.info(module);
      module.append($('<li class="test '+css+'"></li>').attr('title', title).append(text));
    },

    moduleStart: function(name){
      console.info($('li', module));
      module = $('<ul/>').addClass('module');
    },

    moduleDone: function(name, failures, total, environment){
      console.info($('li', module));
      $('#'+underscore(environment)).append(module);
    }

  }

  registerEnvironment = function(name){
    console.info(module);
    environment = $('<li/>').addClass('environment');
    environment.attr('id', underscore(name));
    environment.append('<h2>'+name+'</h2>');
    $('#suite .environments').append(environment);
    console.info(module);
  }

  function underscore(s){
    return s.replace(/[ \.]/g, '_');
  }

})();



/*
 *
 var tests = $('#suite');
 var currentTest;
 var testNumber = 1;

 QUnit.log = function(result, message){
   var pass = result ? '.' : 'F';
   $('#'+currentTest+' .assertions').append('<span title="'+message+'">'+pass+'</span>');
 }

 QUnit.testStart = function(name){
   currentTest = 'test_' + testNumber;
   testNumber++;
   tests.append('<div id="'+currentTest+'" class="test"><h2>'+name+'</h2><div class="assertions"></div></div>');
 }

 QUnit.testDone = function(name, failures, total){
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
