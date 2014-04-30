/***
 * @method namespace([init] = global)
 * @author andrewplummer
 * @returns Mixed
 * @short Finds the namespace or property indicated by the string.
 * @extra [init] can be passed to provide a starting context, otherwise the global context will be used. If any level returns a falsy value, that will be the final result.
 * @example
 *
 *   'Path.To.Namespace'.namespace() -> Path.To.Namespace
 *   '$.fn'.namespace()              -> $.fn
 *
 ***/

(function() {

  var hasExports = typeof module !== 'undefined' && module.exports;

  if(hasExports) {
    Sugar = require('sugar-core');
  }

  Sugar.extend(String, {

    'namespace': function(context) {
      context = context || global;
      this.split('.').every(function(s, i) {
        return !!(context = context[s]);
      });
      return context;
    }

  });

  if(hasExports) {
    module.exports = Sugar.String.namespace;
  }

})();
