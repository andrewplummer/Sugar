
var environment;

(function(){


  forwardCallback('log');
  forwardCallback('testStart');
  forwardCallback('testDone');
  forwardCallback('moduleStart');
  forwardCallback('moduleDone');
  forwardCallback('done');

  function forwardCallback(name){
    if(!window.parent || window == window.parent || !window.parent.QUnit || !window.parent.QUnit[name]) return;
    QUnit[name] = function(){
      var args = [];
      for(var i=0;i<arguments.length;i++){ if(typeof arguments[i] != 'undefined') args.push(arguments[i]); }
      args.push(environment);
      window.parent.QUnit[name].apply(this, args);
    }
  }

  registerEnvironment = function(){
    if(window.parent && window != window.parent && window.parent.registerEnvironment){
      environment = arguments[0];
      window.parent.registerEnvironment.apply(this, arguments);
    }
  }

})();

function equalsWithException(actual, expected, exception, message){
  if(exception.environment == environment && !override){
    equals(actual, exception.result, message);
  } else {
    equals(actual, expected, message);
  }
}
