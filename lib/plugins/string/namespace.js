/***
 * @method namespace([init] = global)
 * @author andrewplummer
 * @returns Mixed
 * @short Finds the namespace or property indicated by the string.
 * @extra [init] can be passed to provide a starting context, otherwise the global context will be used. If any level returns a falsy value, that will be the final result.
 * @dependencies ES5
 * @example
 *
 *   'Path.To.Namespace'.namespace() -> Path.To.Namespace
 *   '$.fn'.namespace()              -> $.fn
 *
 ***/

(function(global) {

  String.extend({

    'namespace': function(context) {
      context = context || global;
      this.split('.').every(function(s, i) {
        return !!(context = context[s]);
      });
      return context;
    }

  });

})(this);
