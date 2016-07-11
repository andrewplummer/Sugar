
var fs      = require('fs'),
    gulp    = require('gulp'),
    path    = require('path'),
    args    = require('yargs').argv,
    gutil   = require('gulp-util'),
    mkdirp  = require('mkdirp'),
    through = require('through2');

// -------------- Tasks ----------------

gulp.task('default', showTasks);
gulp.task('help',    showTasks);
gulp.task('tasks',   showTasks);

gulp.task('build',       buildDefault);
gulp.task('build:dev',   buildDevelopment);
gulp.task('build:min',   buildMinified);

gulp.task('json:docs',   buildJSONDocs);


// -------------- Help ----------------

var MESSAGE_TASKS = `

     # Usage

       |gulp| [TASK] [OPTIONS]

     # Tasks

       |build|                          Create development and minified build.
       |build:dev|                      Create development build (concatenate files only).
       |build:min|                      Create minified build (closure compiler).

       |json:docs|                      Builds full docs set as JSON.

     # Options

       |-m, --modules|                  Comma separated modules to include (dev/min tasks).
                                        Run "gulp more" for modules (non-default marked with *).

       |-o, --output|                   Build output path (default is "sugar.js" or "sugar.min.js").
                                        Also output file for JSON tasks.

       |--es5|                          Include ES5 module in build (dev/min tasks).

       |--no-polyfill|                  Exclude ES6/ES7 modules from build (dev/min tasks).

       |--charset|                      Charset flag to pass to the compiler. Note that although "utf-8"
                                        produces smaller output, default build is smaller after gzip.

       |--source-map|                   Compiler source map filename. Default is "sugar.min.map".

       |--no-source-map|                Do not output a source map.

`;

var MESSAGE_EXTRA = `
     # Modules

       |es5 *|                          Full ES5 polyfill suite (adds IE6-8 support).
       |es6|                            Partial ES6 polyfills, mostly for String/Array support.
       |es7|                            Partial ES7 polyfills. Currently only Array#includes.
       |date|                           Date parsing, manipulation, formatting, and locale support.
       |string|                         String encoding, truncating, formatting, and more.
       |array|                          Array sorting, uniquing, randomizing, and more.
       |object|                         Object merging, manipulating, type checks, and more.
       |enumerable|                     Traversing, mapping, finding, etc. Shared by Array and Object.
       |function|                       Function throttling, memoizing, partial functions, and more.
       |number|                         Number formatting, rounding, math aliases, and more.
       |regexp|                         RegExp escaping and flag manipulation methods.
       |range|                          Date, Number, and String ranges.
       |language *|                     Script detection, half/full width conversion, kana.
       |inflections *|                  Pluralizing and special character normalization.

       |* Not included in default builds|

     # Packages

       |sugar-core|                     Core method defining functionality. Dependency for all other packages.
       |sugar|                          All default modules and optional date locales.

       |sugar-es5|                      ES5 polyfill methods only.
       |sugar-es6|                      ES6 polyfill methods only.
       |sugar-es7|                      ES7 polyfill methods only.
       |sugar-string|                   String module and ES6 polyfills.
       |sugar-number|                   Number module and ES6 polyfills.
       |sugar-enumerable|               Enumerable module and ES6/ES7 polyfills.
       |sugar-date|                     Date module and optional locales.
       |sugar-array|                    Array module.
       |sugar-object|                   Object module.
       |sugar-function|                 Function module.
       |sugar-regexp|                   RegExp module.
       |sugar-range|                    Range module.
       |sugar-language|                 Language module.
       |sugar-inflections|              Inflections module.

     # Locales

       |Bundled:|

       |en|                             Alias to "en-US" (sorry).
       |en-US: American English|        mm/dd/yyyy preferred, Sunday starts week.
       |en-GB: British English|         Slightly different output formats.
       |en-CA: Canadian English|        Slightly different output formats.
       |en-AU: Australian English|      Alias to "en-GB" for now.

       |Optional:|

       LOCALE_LIST

     # Modular Builds

       The npm build tasks split out all methods and dependencies in the
       source code so that they can be consumed individually. The result
       of these tasks will be identical to the packages hosted on npm.
       For more information on how to include them, see the README.

       Bower packages contain only the bundles in the "dist/" directory.
       As bower requires a public git endpoint, the result of these tasks
       will be identical to the repos on Github. This also means that there
       is no "sugar" package for bower as it is identical to the main repo.

`;

function showTasks() {
  if (args.help) {
    showMore();
  } else {
    showMessage(MESSAGE_TASKS);
  }
}

function showMore() {
  showMessage(MESSAGE_TASKS + MESSAGE_EXTRA);
}

function showMessage(message) {
  var msg = message.replace(/LOCALE_LIST/g, function() {
      return getAllLocales().map(function(l) {
        var code = l.match(/([\w-]+)\.js$/)[1];
        var name = readFile(l).match(/\* (.+) locale definition/i)[1];
        return gutil.colors.yellow(code + ': ' + name);
      }).join('\n       ');
    })
    .replace(/\[\w+\]/g, function(match) {
      return gutil.colors.dim(match);
    })
    .replace(/# [\w ]+$/gm, function(match) {
      return gutil.colors.underline(match.replace(/^# /g, ''));
    })
    .replace(/\|.+?\|/g, function(match) {
      return gutil.colors.yellow(match.replace(/\|/g, ''));
    })
    .replace(/^\s{30,}/gm, function(match) {
      return match.slice(2);
    });
  console.log(msg);
}

// -------------- Compiler ----------------

var COMPILER_JAR_PATH = 'node_modules/google-closure-compiler/compiler.jar';

function compileSingle(path) {
  var compiler = require('closure-compiler-stream');
  var flags = getDefaultFlags();
  flags.js_output_file = path;
  if (args.sourceMap !== false) {
    flags.create_source_map = args.sourceMap || path.replace(/\.js/, '.map');
  }
  if (args.charset) {
    flags.charset = args.charset;
  }
  return compiler(flags);
}

function getDefaultFlags() {
  return {
    jar: COMPILER_JAR_PATH,
    compilation_level: 'ADVANCED',
    assume_function_wrapper: true,
    jscomp_off: ['globalThis', 'misplacedTypeAnnotation', 'checkTypes'],
    output_wrapper: LICENSE + "\n(function(){'use strict';%output%}).call(this);",
    externs: 'lib/extras/externs.js'
  };
}

// -------------- File Util ----------------

function readFile(path) {
  return fs.readFileSync(path, 'utf-8');
}

function writeFile(outputPath, body) {
  mkdirp.sync(path.dirname(outputPath));
  fs.writeFileSync(outputPath, body, 'utf-8');
}

function writeJSON(obj, f) {
  var filename = args.o || args.output || f;
  writeFile(filename, JSON.stringify(obj));
  notify('Wrote: ' + filename, false);
}

function cleanDir(dir) {
  require('rimraf').sync(dir);
}

// -------------- Stream Util ----------------

function getEmptyStream() {
  return require('merge-stream')();
}

function mergeStreams(streams) {
  return require('merge-stream')(streams);
}

function addStream(target, src) {
  if (!src.isEmpty || !src.isEmpty()) {
    target.add(src);
  }
  return target;
}

function onStreamEnd(stream, fn) {
  if (stream.isEmpty()) {
    return fn();
  }
  return stream.pipe(through.obj(function(file, enc, cb) {
    fn();
    cb();
  }));
}

// -------------- Logging Util ----------------

function notify(text, ellipsis, block) {
  log(gutil.colors.yellow(text + (ellipsis !== false ? '...' : '')), block);
}

function warn(text, block) {
  log(gutil.colors.red(text), block);
}

function log(text, block) {
  if (block) {
    console.log(text);
  } else {
    gutil.log(text);
  }
}

// -------------- Core Util ----------------

function uniq(arr) {
  var result = [];
  arr.forEach(function(el) {
    if (result.indexOf(el) === -1) {
      result.push(el);
    }
  });
  return result;
}

function merge(obj1, obj2) {
  iter(obj2, function(key, val) {
    obj1[key] = val;
  });
}

function groupBy(arr, field) {
  var groups = {};
  arr.forEach(function(el) {
    var val = el[field];
    if (!groups[val]) {
      groups[val] = [];
    }
    groups[val].push(el);
  });
  return groups;
}

function compact(arr) {
  return arr.filter(function(el) {
    return el;
  });
}

function iter(obj, fn) {
  for (var key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
      if(fn(key, obj[key]) === false) {
        break;
      }
  }
}

function padNumber(n, place) {
  var str = String(n);
  while (str.length < place) {
    str = '0' + str;
  }
  return str;
}

// Template tag
function block(strings) {
  var result = Array.from(strings);
  for (var i = 1, j = 1; i < arguments.length; i++) {
    result.splice(j, 0, arguments[i]);
    j += 2;
  }
  return result.join('').replace(/^\n|\n$/gm, '');
}

// -------------- Build ----------------

var CLOSURE_WRAPPER = block`
(function() {
  'use strict';
$1
}).call(this);
`;

var QML_WRAPPER = block`
.pragma library
var Sugar = (function() {
  'use strict';
$1
  return Sugar;
}).call(this);
`;

var DEFAULT_MODULES = [
  'es5',
  'date',
  'string',
  'array',
  'object',
  'number',
  'function',
  'regexp',
  'range'
];

var ALL_MODULES = [
  'es5',
  'date',
  'string',
  'array',
  'object',
  'number',
  'function',
  'regexp',
  'range',
  'inflections',
  'language'
];

var SPLIT_MODULES = [];

var LICENSE = block`
/*
 *  Sugar ${getVersion()}
 *
 *  Freely distributable and licensed under the MIT-style license.
 *  Copyright (c) Andrew Plummer
 *  http://sugarjs.com/
 *
 * ---------------------------- */
`;

var LOCALES_MODULE_COMMENT = block`
/***
 * @module Locales
 * @description Locale files for the Sugar Date module.
 *
 ***/
`;

function buildDefault() {
  notify('Exporting: ' + getBuildPath());
  notify('Minifying: ' + getBuildPath(true));
  return logBuildResults(mergeStreams([createDevelopmentBuild(), createMinifiedBuild()]));
}

function buildDevelopment() {
  notify('Exporting: ' + getBuildPath());
  return logBuildResults(createDevelopmentBuild());
}

function buildMinified() {
  notify('Minifying: ' + getBuildPath(true));
  return logBuildResults(createMinifiedBuild());
}

function getWrapper(qml) {
  return qml ? getQmlWrapper() : getStandardWrapper();
}

function getStandardWrapper() {
  return [LICENSE, CLOSURE_WRAPPER].join('\n');
}

function getQmlWrapper() {
  return [LICENSE, QML_WRAPPER].join('\n');
}

function createDevelopmentBuild(outputPath, modules, locales) {

  outputPath = outputPath || getBuildPath();
  var src = getSource(modules, locales);

  return file(path.basename(outputPath), src, { src: true })
    .pipe(gulp.dest(path.dirname(outputPath)));
}

function createMinifiedBuild(outputPath, modules, locales) {

  outputPath = outputPath || getBuildPath(true);

  try {
    fs.lstatSync(COMPILER_JAR_PATH);
  } catch(e) {
    gutil.log(gutil.colors.red('Closure compiler missing!'), 'Run', gutil.colors.yellow('bower install'));
    return;
  }

  // closure-compiler-stream does not handle direct input,
  // so need to write a temp file here to pass to compiler args.
  // Ensure unique path in case multiple streams are compiling
  // at the same time.
  var tmpPath = path.join(path.dirname(outputPath), path.basename(outputPath, '.min.js')) +  '.tmp.js';
  writeFile(tmpPath, getSource(modules, locales));

  return gulp.src(tmpPath)
    .pipe(compileSingle(outputPath))
    .pipe(through.obj(function(file, enc, cb) {
      fs.unlink(tmpPath);
      cb();
    }));
}

function getSource(m, l) {

  // When the source is modularized variables defined in the core
  // will be lost so they need to be redefined in common, however
  // these re-defines aren't necessary when the core is bundled
  // together, so we can strip them out.
  var CORE_REDEFINES = [
    'Core utility aliases',
    'Internal reference to check if an object can be serialized.'
  ];

  function replaceCoreRedefine(block, comment) {
    if (CORE_REDEFINES.indexOf(comment) !== -1) {
      block = '';
    }
    return block;
  }

  var src = '';

  var modulePaths = getModulePaths(m);
  var localePaths = getLocalePaths(l);

  var namespaceConstraints = getNamespaceConstraints();

  modulePaths.forEach(function(p) {
    var content = readFile(p);
    var moduleName = path.basename(p, '.js');
    var constraints = namespaceConstraints[moduleName];
    if (moduleName === 'core') {
      content = content.replace(/edge/, getVersion());
    } else if (constraints) {
      content = getSplitModule(content, constraints);
    }
    src += content;
  });
  localePaths.forEach(function(p) {
    src += readFile(p);
  });

  src = src.replace(/^'use strict';\n/gm, '');
  src = src.replace(/^(?=.)/gm, '  ');
  src = src.replace(/^([\s\S]+)$/m, getWrapper(args.qml));
  src = src.replace(/^  \/\/ ([\w .]+)[\s\S]+?\n$\n/gm, replaceCoreRedefine);

  // Allowing namespace constraints such as
  // ES6:String to only build for that namespace.
  function getNamespaceConstraints() {
    var map = {};
    getModuleNames(m).forEach(function(n) {
      var split = n.split(':');
      var moduleName = split[0];
      var namespaceName = split[1];
      if (namespaceName) {
        if (SPLIT_MODULES.indexOf(moduleName) === -1) {
          warn('Module ' + moduleName + ' is not ready to be split!');
          warn('Exiting...');
          process.exit();
        }
        var constraints = map[moduleName] || {};
        constraints[namespaceName] = true;
        map[moduleName] = constraints;
      }
    });
    return map;
  }

  // Split the module into namespaces here and match on the allowed one.
  function getSplitModule(content, constraints) {
    var src = '', lastIdx = 0, currentNamespace;
    content.replace(/\/\*\*\* @namespace (\w+) \*\*\*\/\n|$/g, function(match, nextNamespace, idx) {
      if (!currentNamespace || constraints[currentNamespace]) {
        src += content.slice(lastIdx, idx);
      }
      currentNamespace = (nextNamespace || '').toLowerCase();
      lastIdx = idx;
    });
    return src;
  }

  return src;
}

function logBuildResults(stream) {
  stream.on('end', function() {
    if (args.skipBuildResults) {
      return;
    }
    var moduleNames = getModuleNames();
    var localeCodes = getLocaleCodes();
    if (moduleNames.indexOf('date') !== -1) {
      localeCodes.unshift('en','en-US','en-GB','en-CA','en-AU');
    }
    notify('Done! Build info:', false);
    notify('', false);
    notify('Modules: ' + moduleNames.join(','), false);
    if (localeCodes.length) {
      notify('Locales: ' + localeCodes.join(','), false);
    }
    notify('', false);
  });
  return stream;
}

function getVersion() {
  var ver = args.v || args.version || 'edge';
  if (ver && ver.match(/^[\d.]+$/)) {
    ver = 'v' + ver;
  }
  if (buildHasCustomModules() || buildHasCustomLocales()) {
    var d = new Date();
    var df = [d.getFullYear(), padNumber(d.getMonth() + 1, 2), padNumber(d.getDate(), 2)].join('.');
    ver = 'Custom ' + df;
  }
  return ver;
}

function getBuildPath(min) {
  return args.o || args.output || 'sugar' + (min ? '.min' : '') + '.js';
}

function getModuleNames(m) {

  var moduleNames, sortedModuleNames;

  moduleNames = (m || args.m || args.module || args.modules || 'default').toLowerCase().split(',');

  function alias(name, modules) {
    var index = moduleNames.indexOf(name);
    if (index !== -1) {
      moduleNames.splice.apply(moduleNames, [index, 1].concat(modules));
    }
  }

  function nameRank(moduleName) {
    var rank = moduleIsPolyfill(moduleName) ? 0 : 10;
    rank += moduleNames.indexOf(moduleName);
    return rank;
  }

  alias('all', ALL_MODULES);
  alias('default', DEFAULT_MODULES);

  if (args.es5) {
    moduleNames.unshift('es5');
  }

  if (args.polyfills === false) {
    moduleNames = moduleNames.filter(function(moduleName) {
      return !moduleIsPolyfill(moduleName);
    });
  }

  // Keeping the names sorted as input except to push
  // polyfill modules to the top where they need to be.
  sortedModuleNames = moduleNames.concat();

  sortedModuleNames.sort(function(a, b) {
    var aRank = nameRank(a);
    var bRank = nameRank(b);
    return aRank - bRank;
  });

  return sortedModuleNames;
}

function getModulePaths(m) {

  var names = getModuleNames(m);

  function getPath(name) {
    return path.join('lib', name.toLowerCase() + '.js');
  }

  names = names.map(function(n) {

    var moduleName = n.split(':')[0];
    try {
      fs.lstatSync(getPath(moduleName));
    } catch(e) {
      warn('Cannot find module ' + moduleName + '!');
      warn('Exiting...');
      process.exit();
    }
    return moduleName;
  });

  if (!names.length || names[0] !== 'core') {
    names.unshift('common');
  }
  names.unshift('core');

  return uniq(names).map(getPath);
}

function getLocaleCodes(l) {
  var names = typeof l === 'string' ? l : args.l || args.locale || args.locales;
  if (names === 'all') {
    names = getAllLocales().map(function(p) {
      return p.match(/([\w-]+)\.js/)[1];
    });
  } else if (names) {
    names = names.split(',');
  }
  return names || [];
}

function getLocalePaths(l) {

  var codes = getLocaleCodes(l);

  function getPath(l) {
    return path.join('locales', l.toLowerCase() + '.js');
  }

  codes.forEach(function(n) {
    try {
      fs.lstatSync(getPath(n));
    } catch(e) {
      warn('Cannot find locale ' + n + '!');
      warn('Exiting...');
      process.exit();
    }
  });

  return codes.map(getPath);
}

function getAllLocales() {
  return require('glob').sync('locales/*.js');
}

function buildHasCustomModules() {
  var moduleNames = getModuleNames();
  var hasNonDefault = moduleNames.some(function(n) {
    return DEFAULT_MODULES.indexOf(n) === -1;
  });
  return moduleNames.length !== DEFAULT_MODULES.length || hasNonDefault;
}

function buildHasCustomLocales() {
  return getLocaleCodes().length !== 0;
}

// -------------- Package Definitions ----------------

var PACKAGE_DEFINITIONS = {
  'sugar': {
    bower: false, // Same as distributed build
    es5_dist: true,
    modules: 'ES5,ES6,ES7,String,Number,Array,Enumerable,Object,Date,Locales,Range,Function,RegExp',
    description: 'This build includes default Sugar modules, polyfills, and optional date locales.'
  },
  'sugar-core': {
    modules: 'Core',
    es5_dist: true,
    description: 'This build is the core module, which allows custom methods to be defined and extended later.'
  },
  'sugar-es5': {
    modules: 'ES5',
    polyfill: true,
    description: 'This build includes all ES5 polyfills not included in the default build.'
  },
  'sugar-es6': {
    modules: 'ES6',
    polyfill: true,
    description: 'This build includes all ES6 polyfills bundled with Sugar. Currently this is String#includes, String#startsWith, String#endsWith, String#repeat, Number.isNaN, Array#find, Array#findIndex, and Array.from.'
  },
  'sugar-string': {
    modules: 'ES6:String,String,Range:String',
    es5_dist: true,
    description: 'This build includes methods for string manipulation, escaping, encoding, truncation, and conversion.'
  },
  'sugar-number': {
    modules: 'ES6:Number,Number,Range:Number',
    es5_dist: true,
    description: 'This build includes methods for number formatting, rounding (with precision), and aliases to Math methods.'
  },
  'sugar-enumerable': {
    modules: 'ES6:Array,ES7:Array,Enumerable',
    es5_dist: true,
    description: 'This build includes methods common to arrays and objects, such as matching elements/properties, mapping, counting, and averaging. Also included are polyfills for methods that enhance arrays: Array#find, Array#findIndex, Array#includes, as well as Object.keys.'
  },
  'sugar-array': {
    modules: 'ES6:Array,ES7:Array,Array',
    es5_dist: true,
    description: 'This build includes methods for array manipulation, grouping, randomizing, and alphanumeric sorting and collation.'
  },
  'sugar-object': {
    modules: 'Object',
    es5_dist: true,
    description: 'This build includes methods for object creation, manipulation, comparison, and type checking. Note that Object.prototype is not extended by default. See the README for more.'
  },
  'sugar-date': {
    modules: 'Date,Locales,Range:Date',
    es5_dist: true,
    description: 'This build includes methods for date parsing and formatting, relative formats like "1 minute ago", number methods like "daysAgo", and optional date locales.'
  },
  'sugar-range': {
    modules: 'Range',
    es5_dist: true,
    description: 'This build includes number, string, and date ranges. Ranges can be iterated over, compared, and manipulated.'
  },
  'sugar-function': {
    modules: 'Function',
    es5_dist: true,
    description: 'This build includes methods for lazy, throttled, and memoized functions, delayed functions, timers, and argument currying.'
  },
  'sugar-regexp': {
    modules: 'RegExp',
    es5_dist: true,
    description: 'This build includes methods for escaping regexes and manipulating their flags.'
  },
  'sugar-inflections': {
    modules: 'Inflections',
    es5_dist: true,
    description: 'This build includes methods for pluralization similar to ActiveSupport including uncountable words and acronyms, humanized and URL-friendly strings.'
  },
  'sugar-language': {
    modules: 'Language',
    es5_dist: true,
    description: 'This build includes helpers for detecting language by character block, full-width <-> half-width character conversion, and Hiragana and Katakana conversions.'
  }
};

// -------------- Source Package Identities ----------------

var SOURCE_PACKAGE_LISTED_TYPES = [
  'static',
  'instance',
  'prototype',
  'accessor',
  'global',
  'namespace',
  'locale',
  'fix'
];

var SOURCE_PACKAGE_DEPENDENCY_TYPES = [
  'internal',
  'build',
  'var'
];

function sourcePackageIsDependency(p) {
  return SOURCE_PACKAGE_DEPENDENCY_TYPES.indexOf(p.type) !== -1;
}

function sourcePackageIsListed(p) {
  return SOURCE_PACKAGE_LISTED_TYPES.indexOf(p.type) !== -1;
}

function sourcePackageExportsMethod(p) {
  return p.type === 'static' || p.type === 'instance' || p.type === 'alias' || p.type === 'accessor';
}

function moduleIsPolyfill(moduleName) {
  return /^ES[567]/i.test(moduleName);
}


// -------------- JSON Docs ----------------

function buildJSONAPI() {

  var SINGULAR_UNITS_REG = /^(year|month|week|day|hour|minute|second|millisecond)(?!s)/;

  var docs = getJSONDocs(), data = {};

  data.namespaces = docs.namespaces.map(function(ns) {
    return {
      name: ns.name,
      methods: ns.methods.map(function(m) {
        var p = {
          name: m.name
        };
        if (m.set) {
          p.set = m.set.filter(function(name) {
            return !SINGULAR_UNITS_REG.test(name);
          });
        }
        return p;
      })
    };
  });

  writeJSON(data, 'api.json');
}

function buildJSONDocs() {
  writeJSON(getJSONDocs(), 'docs.json');
}

function getJSONDocs() {

  var ALIAS_FIELDS = [
    'args',
    'returns',
    'short',
    'extra',
    'callbacks',
    'examples'
  ];

  var LINKED_TOKENS = {
    'MOD': '#/Modules',
    'default build': '#/Modules',
    'extending': '#/Extending',
    'object methods': '#/ObjectMethods',
    'enhanced matching': '#/EnhancedMatching',
    'enhanced methods': '#/EnhancedMethods',
    'enhanced method': '#/EnhancedMethods',
    'enhances': '#/EnhancedMethods',
    'deep properties': '#/DeepProperties',
    'deep property': '#/DeepProperties',
    'date locales': '#/DateLocales',
    'date parsing': '#/DateParsing',
    'date formatting': '#/DateFormatting',
    'polyfill': '#/Polyfills',
    'extending natives': '/natives',
    'ranges': '#/Ranges',
    'sortIgnore': '#/Array/setOption',
    'exclude': '#/Array/exclude',
    'remove': '#/Array/remove',
    'append': '#/Array/append',
    'insert': '#/Array/insert',
    'each': '#/Array/each',
    'add': '#/Array/add',
    'merge': '#/Object/merge',
    'create': '#/Date/create',
    'unitsAgo': '#/Date/unitsAgo',
    'Date#relative': '#/Date/relative',
    'unitsFromNow': '#/Date/unitsFromNow',
    'thousands': '#/Number/thousands',
    'decimal': '#/Number/decimal',
    'metric': '#/Number/metric',
    'log': '#/Number/log',
    'addHuman': '#/String/addHuman',
    'addPlural': '#/String/addPlural',
    'removeAll': '#/String/removeAll',
    'extend': '#/Sugar/extend',
    'defineStatic': '#/Sugar/defineStatic',
    'defineInstance': '#/Sugar/defineInstance',
    'defineInstanceWithArguments': '#/Sugar/defineInstanceWithArguments',
    'defineStaticWithArguments': '#/Sugar/defineStaticWithArguments'
  };

  var POLYFILL_HTML    = getReplacements('This method is provided as a `polyfill`.');
  var ENHANCED_HTML    = getReplacements('This method is also provided as a `polyfill` in the MOD module.');

  var POLYFILL_REPLACE_REG = /This method is (also )?provided as a .*polyfill.*\./;

  var docs = {
    namespaces: []
  };

  var currentNamespace;
  var currentModuleName;
  var modules = getModulePaths('all');
  var modulePathMap = {};

  function getNamespaceForModuleName(name) {
    if (name === 'Core') {
      return 'Sugar';
    }
    return name.match(/Core|Object|Number|String|Array|Date|RegExp|Function|Range/) ? name : null;
  }

  function setCurrentNamespace(name) {
    if (!name) {
      return;
    }
    var namespace = docs.namespaces.find(function(ns) {
      return ns.name === name;
    });
    if (namespace) {
      currentNamespace = namespace;
    } else {
      currentNamespace = {
        name: name,
        methods: []
      };
      docs.namespaces.push(currentNamespace);
    }
  }

  function processModule(block, path) {
    var match = block.match(/@module (\w+)/);
    if (match) {
      var name = match[1];
      setCurrentNamespace(getNamespaceForModuleName(name));
      modulePathMap[path] = { name: name };
      setAllFields(modulePathMap[path], block);
      currentModuleName = name;
    }
  }

  function processNamespace(block) {
    var match = block.match(/@namespace (\w+)/);
    if (match) {
      setCurrentNamespace(match[1]);
    }
  }

  function setAllFields(obj, block) {
    block.replace(/@(\w+)\s?([\s\S]+?)(?=@|$)/g, function(match, field, value) {
      if (field === 'method' || field === 'module') return;
      if (!value) {
        value = true;
      } else if (field === 'polyfill') {
        obj['extra'] = (obj['extra'] || '') + getPolyfillNote(obj, getTextField(value));
        return;
      } else if (field === 'example') {
        field = 'examples';
        value = getExamples(value);
      } else if (field === 'options') {
        value = getOptions(value);
      } else if (field === 'callback') {
        field = 'callbacks';
        value = getCallback(value, obj[field]);
      } else if (field === 'set') {
        value = getMultiline(value, true);
      } else {
        value = getTextField(value);
        if (field === 'extra' && obj[field]) {
          value += ' ' + obj[field];
        }
      }
      obj[field] = value;
    });
  }

  function getPolyfillNote(method, mod) {
    if (/^ES[567]$/i.test(method.module)) {
      return POLYFILL_HTML;
    } else {
      return ENHANCED_HTML.replace(/MOD/, mod);
    }
  }

  function getOptions(str) {
    var lines = getMultiline(str), lineBuffer = [];
    var options = [];
    lines.forEach(function(line) {
      if (!line && lineBuffer.length) {
        var buffer = lineBuffer.join(' ');
        var match = buffer.match(/^(\w+)\s+(.+)$/);
        options.push({
          name: match[1],
          description: getReplacements(match[2])
        });
        lineBuffer = [];
      } else if (line) {
        lineBuffer.push(line);
      }
    });
    return options;
  }

  function getCallback(str, callbacks) {
    var callbackName;
    if (!callbacks) {
      callbacks = [];
    }
    str = str.replace(/(\w+)$/m, function(all, match) {
      callbackName = match;
      return '';
    });
    var args = [];
    getMultiline(str, true).forEach(function(line) {
      var match = line.match(/^(\w+)\s{2,}(.+)$/);
      if (match) {
        args.push({
          name: match[1],
          description: getReplacements(match[2])
        });
      } else {
        args[args.length - 1].description += ' ' + getReplacements(line);
      }
    });
    callbacks.push({
      name: callbackName,
      args: args
    });
    return callbacks;
  }

  function getTextField(str) {
    var text = getReplacements(getMultiline(str).join('\n'));
    return text ? text : true;
  }

  function getReplacements(str) {
    return str.replace(/([<\[])(\w+?)([>\]])/g, function(all, open, token) {
      if (open === '<') {
        return '<code class="docs-required-argument">' + token + '</code>';
      } else if (open === '[') {
        return '<code class="docs-optional-argument">' + token + '</code>';
      }
    }).replace(/^#(.+)$/m, '<span class="docs-method-body-header">$1</span>')
      .replace(/\n+$/, '')
      .replace(/\n+/g, function(nl) {
        var result = ' ';
        if (nl.length > 1) {
          result += new Array(nl.length).join('<br><br>');
        }
        return result;
    }).replace(/`([^`]+)`/g, function(all, token) {
      if (LINKED_TOKENS[token]) {
        return '<a jump-link href="'+ LINKED_TOKENS[token] +'">' + token + '</a>';
      } else {
        return '<code>' + token + '</code>';
      }
    });
  }

  function getMultiline(str, clean) {

    var lines = str.split('\n').map(function(line) {
      return line.replace(/^[\s*]*|[\s*]*$/g, '');
    });
    if (clean) {
      lines = lines.filter(function(l) {
        return l;
      });
    }
    return lines;
  }

  function getExamples(str) {
    var lines = getMultiline(str, true);

    function getLine() {
      var line = lines.shift();
      return line ? line.replace(/\s*->.+$/, '') : '';
    }

    function groupLines() {
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var nextLine = lines[i + 1];
        if (line.match(/{$/)) {
          break;
        }
        if (line.match(/^\w+ = /) && !line.match(/->/) && nextLine && nextLine.trim()) {
          while (nextLine) {
            lines[i] += '\n' + nextLine;
            lines.splice(i + 1, 1);
            nextLine = lines[i + 1];
          }
        }
      }
    }

    function getLines() {
      var result = [];
      for (var line; line = getLine();) {
        var braceLevel = getBraceLevel(line);
        while (braceLevel > 0) {
          var nextLine = getLine();
          var nextBraceLevel = braceLevel + getBraceLevel(nextLine);
          var indent = '  '.repeat(nextBraceLevel > braceLevel ? braceLevel : nextBraceLevel);
          line += '\n' + indent  + nextLine;
          braceLevel = nextBraceLevel;
        }
        result.push(line);
      }
      return result;
    }

    groupLines();

    return getLines();
  }

  function getBraceLevel(str) {
    var open = str.match(/{/g);
    var close = str.match(/}/g);
    return (open && open.length || 0) - (close && close.length || 0);
  }

  function processMethod(block, lines) {
    var match = block.match(/@method ([\w\[\]]+)\((.*)\)$/m);
    if (match) {
      var method = {};
      var name = match[1];
      var nameClean = match[1].replace(/(\w*)\[(\w+)\](\w*)/, function(full, left, mid, right) {
        method['name_html'] = left + '<span class="docs-method__set">' + mid + '</span>' + right;
        return left + mid + right;
      });
      var args = match[2].split(', ').filter(function(a) {
        return a;
      });

      method.name = nameClean;
      method.module = currentModuleName;

      setAllFields(method, block);

      method.line = getLineNumber(name, lines);
      method.type = getMethodType(method);

      if (args.length) {
        method['args'] = args.map(function(a) {
          var s = a.split(' = ');
          var m = s[0].match(/([<\[])(\w+)[>\]]|(\.\.\.)/);
          var arg = {};
          if (m[2]) {
            arg.name = m[2];
            arg.required = m[1] === '<';
          }
          if (m[3]) {
            arg.glob = true;
            arg.name = '...';
          }
          if (s[1]) {
            arg.default = s[1];
          }
          return arg;
        });
      }
      checkAlias(method, name);
      currentNamespace.methods.push(method);
    }
  }

  function checkAlias(method, name) {
    if (method.alias && !method.short) {
      var srcMethod = currentNamespace.methods.find(function(m) {
        return m.name === method.alias;
      });
      var reg = RegExp('\\.' + method.alias, 'g');
      iter(srcMethod, function(field, value) {
        if (ALIAS_FIELDS.indexOf(field) !== -1) {
          if (field === 'examples') {
            value = value.map(function(l) {
              return l.replace(reg, '.' + name);
            });
          } else if (typeof value === 'string') {
            value = value.replace(reg, '.' + name);
          }
          if (field === 'extra') {
            value = value.replace(POLYFILL_REPLACE_REG, '');
          }
          method[field] = value;
        }
      });
      method.short = 'Alias for <code>' + method.alias + '</code>. ' + method.short;
      delete method.alias;
    }
  }

  function getLineNumber(methodName, lines) {
    var lineNum;
    var src = methodName.replace(/(\[|\])/g, '\\$1');
    var reg = RegExp('@method ' + src);
    lines.some(function(l, i) {
      if (l.match(reg)) {
        lineNum = i + 1;
        return true;
      }
    });
    return lineNum;
  }

  modules.forEach(function(p) {
    var content = fs.readFileSync(p, 'utf-8');
    var lines = content.split('\n');
    content.replace(/\*\*\*[\s\S]+?(?=\*\*\*)/gm, function(block) {
      processModule(block, p);
      processNamespace(block);
      processMethod(block, lines);
    });
  });

  function sortNamespaces() {
    docs.namespaces.sort(namespaceCollate);
  }

  function namespaceCollate(a, b) {
    var aName = a.name;
    var bName = b.name;
    if (aName === 'Sugar') {
      return 1;
    }
    return aName === bName ? 0 : aName < bName ? -1 : 1;
  }

  function getMethodType(method) {
    switch (true) {
      case method.global:    return 'global';
      case method.namespace: return 'namespace';
      case method.static:    return 'static';
      case method.accessor:  return 'accessor';
      default:               return 'instance';
    }
  }

  sortNamespaces(docs);

  return docs;
}

