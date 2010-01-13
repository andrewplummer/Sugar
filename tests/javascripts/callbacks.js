



(function(){

  var suite = $('#suite');
  var module;
  var test;
  var assertions;
  var time;

  QUnit = {
    log: function(result, message, environment){
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

      module.append($('<li class="test '+css+'"></li>').attr('title', title).append(text));
    },

    moduleStart: function(name, environment){
      if(!time) time = new Date();
      module = $('<ul/>').addClass('module').addClass(name);
    },

    moduleDone: function(name, failures, total, environment){
      if(!module) return;
      $('#'+underscore(environment)).append(module);
      module = null;
    },

    done: function(failures, total, environment){
      var now = new Date();
      var runtime = new Date() - time;
      time = null;
      var stats = $('<p class="stats"/>');
      var fail
      stats.append($('<span class="failures">' + failures + ' ' + (failures == 1 ? 'failure' : 'failures') + '</span>'));
      stats.append($('<span class="assertions">' + total + ' ' + (total == 1 ? 'assertion' : 'assertions') + '</span>'));
      stats.append($('<span class="runtime">Completed in ' + runtime / 1000 + ' seconds</span>'));
      $('#'+underscore(environment)).append(stats);
      if(failures != 0){
        $('#'+underscore(environment)).addClass('fail');
      }
    }

  }

  registerEnvironment = function(name){
    environment = $('<li/>').addClass('environment');
    environment.attr('id', underscore(name));
    environment.append('<h3>'+name+'</h3>');
    $('#suite .environments').append(environment);
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
