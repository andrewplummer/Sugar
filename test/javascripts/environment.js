
var modules;
var allResults = [];
var current;

registerEnvironment = function(name, mod) {
  environment = name;
  modules = mod;
}

startTests = function() {
  trigger('suite.started', [environment, modules]);
  nextModule();
}

testsFinishedCallback = function(r, time) {
  if(!current) console.info(r, time);
  var data = { module: current.name, results: r, time: time };
  trigger('suite.module_finished', data);
  allResults.push(data);
  nextModule();
}

var nextModule = function() {
  current = modules.shift();
  if(current) {
    loadScripts(current);
  } else {
    modulesFinished();
  }
}

var modulesFinished = function() {
  trigger('suite.finished', [environment, allResults]);
}

var loadScripts = function(module) {
  var loaded = 0, i;
  for(i = 0; i < module.tests.length; i++){
    jQuery.getScript((module.path || '') + module.tests[i], function() {
      loaded++;
      if(loaded == module.tests.length){
        syncTestsFinished();
      }
    }).fail(function(jqxhr, state, err) {
      throw err;
    });
  }
}

var trigger = function(name, data) {
  var win = getWindow();
  win.jQuery(win.document).trigger(name, data);
}

var getWindow = function() {
  return window.parent !== window && window.parent.jQuery ? window.parent : window;
}
