(function(global) {

  var defineProperty = function(target, name, method) {
    // defineProperty exists in IE8 but will error when trying to define a property on
    // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
    if(Object.defineProperty && Object.defineProperties){
      Object.defineProperty(target, name, { value: method, configurable: true, enumerable: false, writeable: true });
    } else {
      target[name] = method;
    }
  };

  var stored = {};


  var urlMatch = /((?:https?|file):[^:]+(?::\d{4})?[^:]+):(\d+)(?::(\d+))?/;
  var warned = [];

  var warn = function(message, stackLevel, skipMeta, docs, logLevel) {
    var stack, files, match, file, line;
    if(SUGAR_ANALYZER_UNIQUE_MESSAGES && hasBeenWarned(message)) {
      return;
    }
    stack = new Error().stack;
    message = message.replace(/\t/g, TS);
    if(stack) {
      files = stack.match(new RegExp(urlMatch.source, 'g'));
      file = files[stackLevel];
      if(!file || file.match(new RegExp('(' + baseExcludePackages.concat(SUGAR_ANALYZER_EXCLUDES).join('|') + ')[^\/]*\.js'))) {
        return;
      }
      match = file.match(urlMatch);
      if(!skipMeta) {
        message += '\n\n----------- File: ' + match[1] + ' ---------';
        if(match[2]) message += '\n----------- Line: ' + match[2] + ' --------------';
        if(match[3]) message += '\n----------- Char: ' + match[3] + ' --------------';
        if(docs){
          message += '\n----------- Docs: http://sugarjs.com/api/' + docs + ' ---------';
        }
      }
    }
    if(SUGAR_ANALYZER_FIRST_LINE_ONLY) {
      message = message.replace(/\n[\S\s]+$/gm, '');
    }
    warned.push(message);
    console[logLevel || globalLogLevel](message);
  };


  var hasBeenWarned = function(message) {
    var length = warned.length, i = 0;
    while(i < length) {
      if(warned[i] === message) {
        return true;
      }
      i += 1;
    }
    return false;
  }

  var wrapAll = function(all) {
    for (var i = 0; i < all.length; i += 1) {
      wrapModule(all[i]);
    }
  }

  var wrapModule = function(module){
    var namespace = this;
    if(module.namespace) {
      if(!namespace[module.namespace]) {
        namespace[module.namespace] = function(){};
      }
      namespace = namespace[module.namespace];
    }
    if(namespace && module.type == 'instance') namespace = namespace.prototype;
    for (var i = 0; i < module.methods.length; i++) {
      wrapMethod(namespace, module.methods[i])
    }
  }

  var wrapMethod = function(namespace, method) {
    var fn = namespace[method.name] || function(){};
    namespace[method.name] = function() {
      var level, text = method.live_notes || method.sugar_notes;
      if(!method.hasOwnProperty('conflict')) method.conflict = true;
      var result = method.conflict && method.conflict.apply ? method.conflict.apply(this, arguments) : method.conflict;
      var cond = result && result.length ? result[0] : result;
      if(!cond && typeof method.conflict != 'function' && SUGAR_ANALYZER_INFO) {
        level = 'info';
        cond = true;
      }
      if(cond) {
        text = supplant(text, result);
        if(method.original_code && SUGAR_ANALYZER_SHOW_EXAMPLES){
          text += '\n\n';
          text += '\n'+library+':    ' + method.original_code;
          text += '\nSugar:        ' + method.sugar_code;
          text += '\n';
        }
        warn(text, 2, false, method.ref, level);
      }
      if(fn === PrototypeHash) {
        return new fn(arguments);
      } else {
        return fn.apply(this, arguments);
      }
    }
  };

  function supplant(str, obj) {
    var val;
    return  str.replace(/\{(.+?)\}/g, function(m, d) {
      val = obj[d];
      return val !== undefined ? jsonify(val) : m;
    });
  }

  function jsonify(o){
    if(typeof JSON != 'undefined') {
      return JSON.stringify(o);
    } else {
      return o.toString();
    }
  }

  function setDefault(name, defaultValue) {
    if(global[name] === undefined) {
      global[name] = defaultValue;
    }
  }


  var initialize = function() {
    var welcome = '### Welcome to the Sugar analyzer script! ###\n\n';
    if(typeof _ != 'undefined') {
      library = 'Underscore';
      globalLogLevel = 'info';
      wrapAll(SugarUnderscoreMethods);
      welcome += "As your program calls various methods, it will show you the differences between Underscore and Sugar,\n" +
      'along with examples of the differing syntax and links to the Sugar docs.';
    } else if (typeof $A != 'undefined') {
      library = 'Prototype';
      globalLogLevel = 'warn';
      wrapAll(SugarPrototypeMethods);
      welcome += "As your program calls various methods, it will warn you about Prototype's incompatibilities with Sugar, and give\n" +
      'suggestions about how to refactor. You can run this before refactoring to get a general idea about what needs to change\n' +
      'or you can flip out Prototype for Sugar, let breakages happen, and fix as you go!';
    }
    welcome += '\n\nAnalyzer options (set these as globals):\n\n' + 
    'SUGAR_ANALYZER_UNIQUE_MESSAGES    = true/false       |  Display each message only once (default is true)\n' +
    'SUGAR_ANALYZER_FIRST_LINE_ONLY    = true/false       |  Only display the first line of the message (default is false)\n' +
    'SUGAR_ANALYZER_SHOW_EXAMPLES      = true/false       |  Show usage examples inline (default is true)\n' +
    "SUGAR_ANALYZER_EXCLUDES           = ['a', 'b', ...]  |  Array of filenames to exclude messages from (default is [], can be partial match, leave off .js at the end)\n";
    if(library == 'Prototype') {
      welcome += 'SUGAR_ANALYZER_INFO               = true/false       |  Display messages even when methods do not conflict (default is false)';
    }
    //welcome += '\n\n#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#';
    console.info(welcome + '\n\n\n');
    //console.info('-------------------------------------------------------------------------------------------------------------------');
  }

  var TS = '              ';
  var stackLevelOffset;
  var globalLogLevel;
  var library;
  var baseExcludePackages = ['prototype','underscore','analyzer'];
  var PrototypeHash = typeof Hash != 'undefined' ? Hash : null;

  setDefault('SUGAR_ANALYZER_FIRST_LINE_ONLY', false);
  setDefault('SUGAR_ANALYZER_SHOW_EXAMPLES', true);
  setDefault('SUGAR_ANALYZER_INFO', false);
  setDefault('SUGAR_ANALYZER_UNIQUE_MESSAGES', true);
  setDefault('SUGAR_ANALYZER_EXCLUDES', []);

  initialize();

})(this);
