/*
 *  Sugar ES6 Patch
 *
 *  This patch will restore Sugar methods that have been "underwritten"
 *  by new ES6 method implementations. This patch is only for versions
 *  below 1.4.0! If you are not sure if you need this, then it's likely
 *  you don't. Consider upgrading to 1.4.0 instead.
 *
 */
(function() {

  var SugarMethods = 'SugarMethods';

  function restoreMethods(klass, method) {
    var sugar   = klass[SugarMethods] && klass[SugarMethods][method];
    var current = klass.prototype[method];
    if(sugar && sugar !== current) {
      klass.prototype[method] = sugar['method'];
    }
  }

  restoreMethods(Array, 'find');
  restoreMethods(Array, 'findIndex');
  restoreMethods(String, 'repeat');
  restoreMethods(String, 'normalize');

})();
