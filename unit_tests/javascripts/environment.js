
var modules;
var allResults = [];
var current;

registerEnvironment = function(name, mod) {
  environment = name;
  modules = mod;
}

startTests = function() {
  nextModule();
}

testsFinishedCallback = function(r, time) {
  allResults.push({ module: current.name, results: r, time: time });
  nextModule();
}

var nextModule = function() {
  current = modules.shift();
  if(current) {
    loadScripts(current.tests);
  } else {
    modulesFinished();
  }
}

var modulesFinished = function() {
  if(window.parent && window != window.parent && window.parent.modulesFinishedCallback) {
    window.parent.modulesFinishedCallback(environment, allResults);
  }
}

var loadScripts = function(scripts) {
  var loaded = 0, i;
  for(i = 0; i < scripts.length; i++){
    jQuery.getScript(scripts[i], function(){
      loaded++;
      if(loaded == scripts.length){
        syncTestsFinished();
      }
    });
  }
}
