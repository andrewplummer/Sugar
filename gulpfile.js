
var fs      = require('fs'),
    gulp    = require('gulp'),
    path    = require('path'),
    args    = require('yargs').argv,
    gutil   = require('gulp-util');

// -------------- Tasks ----------------

gulp.task('default', showTasks);
gulp.task('help',    showTasks);
gulp.task('tasks',   showTasks);
gulp.task('more',    showMore);

gulp.task('build',       buildDefault);
gulp.task('build:dev',   buildDevelopment);
gulp.task('build:min',   buildMinified);

gulp.task('build:qml',     buildQml);
gulp.task('build:locales', buildLocales);

gulp.task('build:packages',       buildPackagesDefault);
gulp.task('build:packages:core',  buildPackagesCore);
gulp.task('build:packages:sugar', buildPackagesSugar);
gulp.task('build:packages:clean', buildPackagesClean);

gulp.task('build:release', buildRelease);

gulp.task('test',     testRunDefault);
gulp.task('test:npm', testRunNpm);
gulp.task('test:all', testRunAll);

gulp.task('test:watch',     testWatchDefault);
gulp.task('test:watch:npm', testWatchNpm);
gulp.task('test:watch:all', testWatchAll);

gulp.task('json:api',    buildJSONAPI);
gulp.task('json:docs',   buildJSONDocs);
gulp.task('json:source', buildJSONSource);

gulp.task('tsd', buildTypescriptDeclarations);

// -------------- Help ----------------

var MESSAGE_TASKS = `

     # Usage

       |gulp| [TASK] [OPTIONS]

     # Tasks

       |build|                          Create development and minified build.
       |build:dev|                      Create development build (concatenate files only).
       |build:min|                      Create minified build (closure compiler).

       |build:packages|                 Builds modularized packages (all by default).
       |build:packages:core|            Builds the "sugar-core" package.
       |build:packages:sugar|           Builds the "sugar" npm package.
       |build:packages:clean|           Cleans package output directory ("packages" by default).

       |build:qml|                      Creates a QML compatible build.
       |build:locales|                  Exports locale files to "dist" directory.

       |build:release|                  Create a release. Requires a version.

       |test|                           Run tests against distributed build (build:dev).
       |test:npm|                       Run tests against npm packages (build:npm:all).
       |test:all|                       Run tests against distributed and npm (build:dev, build:packages).

       |test:watch|                     Watch for changes and run "test".
       |test:watch:npm|                 Watch for changes and run "test:npm".
       |test:watch:all|                 Watch for changes and run "test:all".

       |json:api|                       Builds API method list as JSON.
       |json:docs|                      Builds full docs set as JSON.
       |json:source|                    Builds modularized source as JSON.

       |tsd|                            Builds typescript declarations (sugar.d.ts).
                                        Run "gulp more" for more options.

       |more|                           Show more help details.

     # Options

       |-m, --modules|                  Comma separated modules to include (dev/min tasks).
                                        Run "gulp more" for modules (non-default marked with *).

       |-l, --locales|                  Comma separated date locales to include (dev/min tasks).
                                        Run "gulp more" for locales. English packaged with date module.

       |-p, --packages|                 Comma separated packages to build ("packages" tasks).
                                        Run "gulp more" for packages.

       |-o, --output|                   Build output path (default is "dist/sugar.js" or "dist/sugar.min.js").
                                        Also output file for JSON tasks.

       |-v, --version|                  Version for "release" build.

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

       Bower packages contain only the builds in the "dist/" directory.
       As bower requires a public git endpoint, the result of these tasks
       will be identical to the modularized repos on Github. This also means
       that there is no separate "sugar" package for bower as it is identical
       to this repo.

     # Typescript Options

       By default the "tsd" task builds Typescript declarations for Sugar in
       extended mode, but without Object.prototype modifications. The task can
       be modified to change these defaults, or include/exclude methods or modules:


       |--no-extended-mode|             When this flag is present, declarations for extended mode
                                        (i.e. native objects) are not output.

       |--modules|                      Filter exported methods by module. This argument
                                        is required for non-default modules. Also accepts
                                        "all" or "default".
                                        --modules=String,Inflections

       |--include|                      Whitelist methods or namespaces to be included:
                                        --include=Array --include=Array:unique.

       |--exclude|                      Blacklist methods or namespaces to be excluded:
                                        --exclude=Array --exclude=Array:unique.
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

// -------------- Release ----------------

function buildRelease() {
  var version = getVersion(), run = true;
  if (!version.match(/^\d.\d+\.\d+$/)) {
    warn('Release requires a valid x.x.x version!');
    run = false;
  }
  if (!run) process.exit();
  return mergeStreams([
    buildDevelopment(),
    buildMinified(),
    buildPackagesDefault()
  ]);
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
    rewrite_polyfills: false,
    jscomp_off: ['globalThis', 'checkTypes'],
    output_wrapper: LICENSE + "\n(function(){'use strict';%output%}).call(this);",
    externs: 'lib/extras/externs.js'
  };
}

// -------------- File Util ----------------

function readFile(path) {
  return fs.readFileSync(path, 'utf-8');
}

function writeFile(outputPath, body) {
  require('mkdirp').sync(path.dirname(outputPath));
  fs.writeFileSync(outputPath, body, 'utf-8');
}

function outputJSON(outputPath, obj) {
  var filename = args.o || args.output || outputPath;
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
  return stream.pipe(require('through2').obj(function(file, enc, cb) {
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
    if (!obj.hasOwnProperty(key)) continue;
      if (fn(key, obj[key]) === false) {
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
  var result = strings.concat();
  for (var i = 1, j = 1; i < arguments.length; i++) {
    result.splice(j, 0, arguments[i]);
    j += 2;
  }
  return result.join('').replace(/^\n|\n$/gm, '');
}

// -------------- Build ----------------

var CORE_MIN_VERSION = '^2.0.0';

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
  'es6',
  'es7',
  'date',
  'string',
  'array',
  'object',
  'enumerable',
  'number',
  'function',
  'regexp',
  'range'
];

var ALL_MODULES = [
  'es5',
  'es6',
  'es7',
  'date',
  'string',
  'array',
  'object',
  'enumerable',
  'number',
  'function',
  'regexp',
  'range',
  'inflections',
  'language'
];

var SPLIT_MODULES = [
  'es5',
  'es6',
  'es7',
  'range'
];

var LICENSE = block`
/*
 *  Sugar ${getVersion(true)}
 *
 *  Freely distributable and licensed under the MIT-style license.
 *  Copyright (c) Andrew Plummer
 *  https://sugarjs.com/
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
  buildLocales();
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

function buildLocales() {
  copyLocales('all', path.join('dist', 'locales'));
}

function buildQml() {
  args.qml = true;
  notify('Creating QML Build: ' + getBuildPath());
  return logBuildResults(createDevelopmentBuild());
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

  var gulpFile = require('gulp-file');

  outputPath = outputPath || getBuildPath();
  var src = getSource(modules, locales);


  return gulpFile(path.basename(outputPath), src, { src: true })
    .pipe(gulp.dest(path.dirname(outputPath)));
}

function createMinifiedBuild(outputPath, modules, locales) {

  outputPath = outputPath || getBuildPath(true);

  try {
    fs.lstatSync(COMPILER_JAR_PATH);
  } catch(e) {
    gutil.log(gutil.colors.red('Closure compiler missing!'), 'Run', gutil.colors.yellow('npm install'));
    return;
  }

  // closure-compiler-stream does not handle direct input,
  // so need to write a temp file here to pass to compiler args.
  // Ensure unique path in case multiple streams are compiling
  // at the same time.
  var tmpPath = path.join(path.dirname(outputPath), path.basename(outputPath, '.min.js')) +  '.tmp.js';
  writeFile(tmpPath, stripDocs(getSource(modules, locales)));

  return gulp.src(tmpPath)
    .pipe(compileSingle(outputPath))
    .pipe(require('through2').obj(function(file, enc, cb) {
      fs.unlinkSync(tmpPath);
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
      content = content.replace(/\{VERSION\}/, getVersion());
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


// The closure compiler has issues with non-standard
// docs so strip all docs out here.
function stripDocs(str) {
  return str.replace(/\/\*\*\*[\s\S]+?\*\*\*\//gm, '');
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

function getVersion(v) {
  var ver = args.v || args.version || 'edge';
  if (v && ver.match(/^[\d.]+$/)) {
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
  return args.o || args.output || getDefaultBuildPath(min);
}

function getDefaultBuildPath(min) {
  var names = ['sugar'], dir = '';
  if (buildHasCustomModules() || buildHasCustomLocales()) {
    names.push('custom');
  } else {
    if (args.es5) {
      names.push('es5');
    }
    dir = 'dist/';
  }
  return dir + names.join('-') + (min ? '.min' : '') + '.js';
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
    return path.join('lib', 'locales', l.toLowerCase() + '.js');
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
  return require('glob').sync('lib/locales/*.js');
}

function buildHasCustomModules() {
  var moduleNames = getModuleNames().filter(function(n) {
    // Not counting ES5 module as being custom as it is
    // also used in the default build.
    return n !== 'es5';
  });
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
    modules: 'ES5,ES6,ES7,String,Number,Array,Enumerable,Object,Date,Locales,Range,Function,RegExp',
    keywords: ['date', 'time', 'polyfill']
  },
  'sugar-core': {
    modules: 'Core',
    description: 'Core module for the Sugar Javascript utility library.'
  },
  'sugar-es5': {
    modules: 'ES5',
    polyfill: true,
    description: 'ES5 polyfill module for the Sugar Javascript utility library.',
    keywords: ['polyfill']
  },
  'sugar-es6': {
    modules: 'ES6',
    polyfill: true,
    description: 'ES6 polyfill module for the Sugar Javascript utility library.',
    keywords: ['polyfill']
  },
  'sugar-string': {
    modules: 'ES6:String,String,Range:String',
    description: 'String module for the Sugar Javascript utility library.',
    keywords: ['string']
  },
  'sugar-number': {
    modules: 'ES6:Number,Number,Range:Number',
    description: 'Number module for the Sugar Javascript utility library.',
    keywords: ['number']
  },
  'sugar-enumerable': {
    modules: 'ES6:Array,ES6:String,ES7:Array,Enumerable',
    description: 'Enumerable module for the Sugar Javascript utility library.',
    keywords: ['array', 'object']
  },
  'sugar-array': {
    modules: 'ES6:Array,ES6:String,ES7:Array,Array',
    description: 'Array module for the Sugar Javascript utility library.',
    keywords: ['array']
  },
  'sugar-object': {
    modules: 'Object',
    extra: 'Object module.',
    description: 'Object module for the Sugar Javascript utility library.',
    keywords: ['object']
  },
  'sugar-date': {
    modules: 'Date,Locales,Range:Date',
    description: 'Date module for the Sugar Javascript utility library.',
    keywords: ['date','time']
  },
  'sugar-range': {
    modules: 'Range',
    description: 'Range module for the Sugar Javascript utility library.',
    keywords: ['range', 'number', 'string', 'date']
  },
  'sugar-function': {
    modules: 'Function',
    description: 'Function module for the Sugar Javascript utility library.',
    keywords: ['function']
  },
  'sugar-regexp': {
    modules: 'RegExp',
    description: 'RegExp module for the Sugar Javascript utility library.',
    keywords: ['regexp']
  },
  'sugar-inflections': {
    modules: 'Inflections',
    description: 'Inflections module for the Sugar Javascript utility library.',
    keywords: ['inflections']
  },
  'sugar-language': {
    modules: 'Language',
    description: 'Language module for the Sugar Javascript utility library.',
    keywords: ['language']
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

// -------------- Package Util ----------------

function getPackageDefinition(packageName) {
  var def = PACKAGE_DEFINITIONS[packageName];
  if (!def) {
    warn('Cannot find package ' + packageName + '!');
    warn('Exiting...');
    process.exit();
  }
  return def;
}

function copyPackageMeta(packageName, packageDir) {

  function copyMeta(srcPath) {
    writeFile(path.join(packageDir, path.basename(srcPath)), readFile(srcPath));
  }

  if (packageName === 'sugar-core') {
    copyMeta('lib/extras/core/README.md');
  } else if (packageName.match(/^sugar-/)) {
    buildModuleReadme(packageName, packageDir);
  } else {
    copyMeta('README.md');
  }

  if (packageName !== 'sugar-core') {
    copyMeta('CHANGELOG.md');
    copyMeta('CAUTION.md');
  }

  copyMeta('LICENSE');
  copyMeta('.npmignore');
}

function exportPackageDeclarations(packageName, packageDir) {
  var allowedModules;
  switch (packageName) {
    case 'sugar':
      allowedModules = 'all';
      break;
    case 'sugar-core':
      allowedModules = 'none';
      break;
    default:
      allowedModules = [packageName.replace(/^sugar-?/, '')];
  }
  exportTypescriptDeclarations(packageDir, allowedModules);
}

function copyLocales(l, dir) {
  require('mkdirp').sync(dir);
  getLocalePaths(l).forEach(function(src) {
    writeFile(path.join(dir, path.basename(src)), readFile(src));
  });
}

function buildPackageDist(packageName, packageDir) {

  var stream     = getEmptyStream();
  var definition = getPackageDefinition(packageName);
  var modules    = getPackageModules();

  buildDist(modules);
  if (!definition.polyfill) {
    buildDist(modules, true);
  }

  function getPackageModules() {
    return definition.modules.split(',').filter(function(m) {
      if (m === 'Locales') {
        copyLocales('all', path.join(packageDir, 'locales'));
        return false;
      }
      return true;
    });
  }

  function buildDist(modules, es5) {
    if (es5) {
      modules = ['ES5'].concat(modules);
    }
    modules = modules.join(',');
    var devFilename = path.join(packageDir, getDistFilename(packageName, es5));
    var minFilename = path.join(packageDir, getDistFilename(packageName, es5, true));
    addStream(stream, createDevelopmentBuild(devFilename, modules, ''));
    addStream(stream, createMinifiedBuild(minFilename, modules, ''));
    return stream;
  }

  return stream;
}

function getDistFilename(packageName, es5, min) {
  return packageName + (es5 ? '-es5' : '') + (min ? '.min' : '') + '.js';
}

function getPackageNames(p) {
  var packages = [];
  switch (p) {
    case 'all':
      iter(PACKAGE_DEFINITIONS, function(name) {
        packages.push(name);
      });
      break;
    case 'modular':
      iter(PACKAGE_DEFINITIONS, function(name) {
        if (name !== 'sugar-core') {
          packages.push(name);
        }
      });
      break;
    default:
      packages = p.split(',');
  }
  return packages;
}

function buildIgnoreFiles(packageName, packageDir) {
  var paths = ALL_MODULES.map(function(m) {
    return '/' + m;
  });
  paths.push('/common');
  paths.push('/polyfills');
  paths.push('/locales');
  paths.push('/index.js');

  // Ignore the package.json file as well as anything to be checked in to
  // a modularized repo should be for the sake of bower. Modularized npm
  // packages are built for now and should not exist in version control.
  paths.push('/package.json');
  paths.push('/node_modules');
  paths.push('/.npmignore');

  writeFile(path.join(packageDir, '.gitignore'), paths.join('\n'));
}

function buildPackageManagerJson(packageName, packageDir) {
  exportPackageJson(packageName, packageDir);
  if (packageName !== 'sugar') {
    // The npm package should be ignoring bower.json anyway, so this
    // check should not be necessary, but just a safety guard to make
    // clear the intent that the modularized "sugar" package should
    // be published only to npm, not bower, as it is the main repo.
    exportBowerJson(packageName, packageDir);
  }
}

function cloneJson(file) {
  var json = JSON.parse(JSON.stringify(require(file))), out = {};

  // This function is simply to get the "version", which is dynamically
  // generated, next to the "description" in package.json to make this
  // file slightly more user friendly.
  out.name = json.name;
  out.description = json.description;
  out.version = json.version;

  for (var key in json) {
    if (!json.hasOwnProperty(key) || out.hasOwnProperty(key)) continue;
    out[key] = json[key];
  };
  return out;
}

function getCommonJson(file, packageName, def) {
  var json = cloneJson(file);
  json.name = packageName;
  if (def.keywords) {
    json.keywords = json.keywords.concat(def.keywords);
  }
  if (def.description) {
    json.description = def.description;
  }
  delete json.files;
  delete json.scripts;
  delete json.devDependencies;
  return json;
}

function exportPackageJson(packageName, packageDir) {
  var def = getPackageDefinition(packageName);
  var json = getCommonJson('./package.json', packageName, def);

  json.version = getVersion();

  // Add sugar-core as a dependency
  if (packageName === 'sugar-core') {
    json.main = 'sugar-core.js';
  } else {
    json.main = 'index.js';
    json.dependencies = {
      'sugar-core': CORE_MIN_VERSION
    };
  }

  writeFile(path.join(packageDir, 'package.json'), JSON.stringify(json, null, 2));
}

function exportBowerJson(packageName, packageDir) {
  var def = getPackageDefinition(packageName);
  var json = getCommonJson('./bower.json', packageName, def);

  if (packageName === 'sugar-core') {
    json.main = 'sugar-core.js';
    json.ignore = [
      "**/*",
      "!README.md",
      "!LICENSE",
      "!*.map",
      "!*.js"
    ];
  } else {
    json.main = path.join('dist', packageName + '.js');
  }

  writeFile(path.join(packageDir, 'bower.json'), JSON.stringify(json, null, 2));
}

function buildModuleReadme(packageName, packageDir) {
  var moduleName = packageName.replace(/^sugar-/, '');
  var moduleCaps = getCapitalizedModuleName(moduleName);

  var src = [
    '# Sugar',
    '',
    '[![Build Status](https://secure.travis-ci.org/andrewplummer/Sugar.png)](http://travis-ci.org/andrewplummer/Sugar)',
    '',
    'A Javascript library for working with native objects.',
    '',
    '## %MODULE% Module',
    '',
    'Note that this build includes only the "%MODULE_LOWER%" module. This repo is a modularized build of the main [Sugar](https://github.com/andrewplummer/Sugar) repo. Please post all issues there.',
    '',
    '## Install',
    '',
    '#### `npm install sugar-%MODULE_LOWER%`',
    '#### `bower install sugar-%MODULE_LOWER%`',
    '',
    '## Getting Started',
    '',
    '#### [https://sugarjs.com/quickstart/](https://sugarjs.com/quickstart/)',
    '',
    '## Documentation',
    '',
    '#### [https://sugarjs.com/docs/](https://sugarjs.com/docs/)'
  ].join('\n');
  src = src.replace(/%MODULE%/g, moduleCaps);
  src = src.replace(/%MODULE_LOWER%/g, moduleName);
  writeFile(path.join(packageDir, 'README.md'), src);
}

function getCapitalizedModuleName(moduleName) {
  if (moduleName.match(/^ES\d/i)) {
    return moduleName.toUpperCase();
  } else if (moduleName === 'regexp') {
    return 'RegExp';
  } else {
    return moduleName.slice(0, 1).toUpperCase() + moduleName.slice(1);
  }
}

// ------------ Dependency Tree --------------

/*
 * This function modularizes the source code into packages. These packages are
 * used to create the public npm packages as well as the custom download tool.
 * Source packages consist of top level functions and vars, Sugar methods
 * including polyfills, and "prototype" packages for defining methods on other
 * types like Range, which aren't native classes but are modularized as well.
 * In order for modularization to work, the source code follows a few rules:
 *
 * 1. Any function or variable declared in the top scope will become a source
 *    package. Variables declared with the same "var" keyword will become a
 *    single package whose name will be taken from the comment node immediately
 *    before it.
 *
 * 2. Sugar methods must be defined using the aliases such as "defineInstance",
 *    both on the top level and in build functions (more below).
 *
 * 3. No function may call any Sugar method directly, as this dependency will
 *    not be found. For example a function cannot call Sugar.Array.unique().
 *    If such a dependency is required, instead refactor "arrayUnique" into a
 *    top level function and have both functions call that instead. This also
 *    includes modularized prototype methods such as those defined on Range
 *    using "defineOnPrototype".
 *
 * 4. No Sugar method may go through the Sugar global in any way, including
 *    using the shortcuts "sugarNumber", etc. Refactor any reference to the
 *    Sugar global into a top level function instead.
 *
 * 5. Any function that is also called in the top scope is considered a "build"
 *    function. Build functions have one of three purposes. First, they build
 *    up variables that are declared but not assigned in the top scope. Second,
 *    they define methods, either by the Sugar define aliases such as
 *    "defineInstance" or using "defineOnPrototype" for "prototype" methods
 *    (see above). Third, they can be "set___ChainableConstructor" which has
 *    a special purpose of mapping the namespace "create" method to the chainable
 *    constructor to allow extra functionality. If a build method call is found
 *    it will add itself as a dependency to the build method package. This
 *    ensures that the build method will always be called, however it creates a
 *    circular dependency. See below for more.
 *
 * 6. Build functions that define methods must list out the methods that they
 *    define in the comment block directly before the build function using the
 *    @method or @set keyword. See the source for examples.
 *
 * 7. Any build function ending in "fix" allows overriding of behavior based on
 *    feature detects. Unlike normal build methods, which find global variable
 *    assignments and make themselves dependencies of the variable package, "fix"
 *    functions will instead take assigned global variables and add them to
 *    "postAssigns". The npm tasks can then consume this to override the defined
 *    method after the build function has been called. Note that this will only
 *    work when variables are bundled together in multiple exports, as it needs
 *    to be able to mutate the exported object.
 *
 * 8. Top level variables may never be reassigned, except when they are
 *    declared a single time and assigned later from a build function.
 *
 * 9. Modularized source packages may have circular dependencies! This is not
 *    handled here and should be handled by the final consumer of this function.
 *    For example, npm modules cannot have circular dependencies so they will
 *    bundle them together into a single module where the custom download tool
 *    simply includes all packages in a circular dependency chain.
 *
 */
function getModularSource() {

  var WHITELISTED = ['arguments', 'undefined', 'NaN', 'btoa', 'atob'];

  var sourcePackages = [], modules = [];

  setupFindMethods();
  parseAllModules();
  transposeVarDependencies();
  addLocalePackages();
  cleanNodes();

  // --- Find Methods ---

  function setupFindMethods() {
    setupCachedFind('findByVarName', findByVarName);
    setupCachedFind('findByMethodName', findByMethodName);
    setupCachedFind('findByDependentPackage', findByDependentPackage);
    setupCachedFind('findByDependencyName', findByDependencyName);
  }

  function setupCachedFind(methodName, fn) {
    var cache = {};
    sourcePackages[methodName] = function() {
      var cacheKey = '', args = Array.from(arguments);
      for (var i = 0; i < args.length; i++) {
        cacheKey += getTokenForObject(args[i]);
      }
      if (cacheKey in cache) {
        return cache[cacheKey];
      }
      return cache[cacheKey] = this.find(function(p) {
        return fn.apply(null, [p].concat(args));
      });
    };
  }

  function getTokenForObject(obj) {
    if (typeof obj === 'object' && obj.module && obj.name) {
      // Assume a source package;
      obj = obj.module + (obj.namespace || '') + obj.name;
    }
    return obj;
  }

  function findByVarName(p, varName) {
    return p.vars && p.vars.indexOf(varName) !== -1;
  }

  function findByDependentPackage(p, dp) {
    if (dp.type === 'locale') {
      return p.namespace === 'Date' && p.name === 'addLocale';
    } else if (dp.alias) {
      return p.name === dp.alias && p.module === dp.module && p.namespace === dp.namespace;
    }
  }

  function findByMethodName(p, methodName, namespaceName, moduleName) {
    return p.name === methodName && p.namespace === namespaceName && p.module === moduleName;
  }

  function findByDependencyName(p, dependencyName) {
    return p.name === dependencyName && sourcePackageIsDependency(p);
  }

  // --- Parsing ---

  function parseAllModules() {
    ['common'].concat(ALL_MODULES).forEach(parseModule);
  }

  function parseModule(moduleLower) {

    var moduleName;

    var commentsByEndLine = {}, namespaceRanges = [], currentNamespaceRange;

    var filePath = 'lib/' + moduleLower + '.js';
    var source = readFile(filePath);

    parseTopLevelNodes();


    // --- Top Level Nodes ---

    function parseTopLevelNodes() {
      var acorn = require('acorn');
      var output = acorn.parse(source, {
        locations: true,
        sourceFile: filePath,
        onComment: onComment
      });

      namespaceBoundary();

      output.body.forEach(function(node) {
        processTopLevelNode(node);
      });
    }

    function processTopLevelNode(node) {
      switch (true) {
        case isUseStrict(node):           return;
        case isMethodBlock(node):         return processMethodBlock(node);
        case isPolyfillBlock(node):       return processPolyfillBlock(node);
        case isPrototypeBlock(node):      return processPrototypeBlock(node);
        case isVariableDeclaration(node): return processVariableDeclaration(node);
        case isFunctionDeclaration(node): return processFunctionDeclaration(node);
        case isAliasExpression(node):     return processAliasExpression(node);
        case isFunctionCall(node):        return processBuildExpression(node);
        default:
          console.log(node);
          throw new Error('Unknown Top Level Node: ' + node.type);
      }
    }

    // --- Source Packages ---

    function addSourcePackage(name, node, type, opts) {
      var comments, sourcePackage;
      sourcePackage = {
        node: node,
        name: name,
        type: type,
        body: getNodeBody(node, true),
        module: moduleName,
        dependencies: getDependencies(node, name)
      };
      merge(sourcePackage, opts);
      comments = getLastCommentForNode(node, 1);
      if (comments) {
        sourcePackage.comments = comments;
        sourcePackage.bodyWithComments = comments + '\n' + sourcePackage.body;
      } else {
        sourcePackage.bodyWithComments = sourcePackage.body;
      }
      sourcePackages.push(sourcePackage);
      return sourcePackage;
    }

    function addSugarMethod(name, node, type, deps, opts) {
      var sp = addSourcePackage(name, node, type, opts);

      sp.namespace    = getNamespaceForNode(node);
      sp.dependencies = sp.dependencies.concat(deps || []);

      if (sp.comments && !sp.alias) {
        // Method comments are indented by 3, so just a hack to
        // make sure the resulting source is the same.
        sp.comments = '  ' + sp.comments;
        sp.bodyWithComments = '  ' + sp.bodyWithComments;
      }
    }

    function addSugarBuiltMethod(name, buildFn, type, opts) {
      var sp = addSourcePackage(name, buildFn.node, type, opts);

      sp.namespace = opts.namespace || getNamespaceForNode(buildFn.node);

      sp.dependencies = [buildFn.name];

      // Built methods are essentially null. They don't have any body
      // or add to the source code. They simply require that the build
      // function be present and called.
      sp.body = '';
      sp.comments = '';
      sp.bodyWithComments = '';
    }

    function addSugarFix(name, buildFn) {
      var sp = addSourcePackage(name, buildFn.node, 'fix');

      var comment = getLastCommentForNode(buildFn.node, 1);
      sp.description = comment.match(/@short (.+)$/m)[1];

      sp.dependencies = [buildFn.name];

      // Like built methods, fixes are wrappers around build functions,
      // so they don't have any body themselves, just requiring that the
      // build function is called.
      sp.body = '';
      sp.comments = '';
      sp.bodyWithComments = '';
    }

    function addVarPackage(node) {
      var name = getVarPackageName(node), sp;
      sp = addSourcePackage(name, node, 'var');
      sp.assigns = {};
      sp.vars = node.declarations.map(function(node) {
        var name = node.id.name;
        if (node.init) {
          sp.assigns[name] = getNodeBody(node.init);
        }
        return name;
      });
      checkPackageForBuiltMethods(sp);
    }

    function getVarPackageName(node) {
      var first = node.declarations[0].id.name, comment;
      if (node.declarations.length === 1) {
        return first;
      }
      comment = getLastCommentForNode(node, 1).replace(/^[\s\/]+/, '');
      if (/^[A-Z]/.test(first)) {
        // ConstantPackage
        comment = comment.charAt(0).toUpperCase() + comment.slice(1);
      } else {
        // varPackage
        comment = comment.charAt(0).toLowerCase() + comment.slice(1);
      }
      return comment.replace(/\s(\w)/g, function(m, letter) {
        return letter.toUpperCase();
      }).replace(/\W/g, '');
    }

    // --- Namespaces ---

    function namespaceBoundary(namespace, line) {
      // Demarcate a namespace "boundary" to build up an array of namespace line
      // "ranges" to be able to find which namespace a piece of code belongs to.
      if (currentNamespaceRange) {
        namespaceRanges.push(currentNamespaceRange);
      }
      if (namespace) {
        currentNamespaceRange = {
          name: namespace,
          line: line
        };
      }
    }

    function getNamespaceForNode(node) {
      var line = node.loc.start.line, namespace;
      namespaceRanges.forEach(function(r) {
        if (r.line < line) {
          namespace = r.name;
        }
      });
      return namespace;
    }

    // --- Comments ---

    function onComment(block, text, start, stop, startLoc, endLoc) {
      var match;
      commentsByEndLine[endLoc.line] = {
        text: text,
        block: block
      };
      match = text.match(/@module (\w+)/);
      if (match) {
        moduleName = match[1];
        modules.push({
          name: moduleName,
          comment: '/*' + text + '*/\n'
        });
      }
      // Both @module and @namespace may be defined in the same comment block.
      match = text.match(/@(namespace|module) \w+/g);
      if (match) {
        if (text.match(/@method/)) {
          // Don't allow temporary namespace renamings
          // in method block.
          return;
        }
        var namespace = match[match.length - 1].match(/@(namespace|module) (\w+)/)[2];
        namespaceBoundary(namespace, endLoc.line);
      }
    }

    function getLastCommentForNode(node, limit) {
      var line = node.loc.start.line, count = 0, comment;
      while (!comment && line > 0) {
        comment = commentsByEndLine[--line];
        count++;
        if (limit && count == limit) {
          break;
        }
      }
      if (comment) {
        if (!comment.block) {
          var lines = [comment.text];
          while (comment = commentsByEndLine[--line]) {
            if (!comment.block) {
              lines.unshift(comment.text);
            }
          }
          return lines.map(function(l) {
            return '\/\/' + l;
          }).join('\n');
        } else {
          if (!comment.text.match(/@(module|namespace)/) || comment.text.match(/@method/)) {
            return '\/*' + comment.text + '*\/';
          }
        }
      }
      return '';
    }

    function checkPackageForBuiltMethods(package, type, opts) {
      var methodBlocks = getMethodBlocksInPreviousComment(package.node);

      if (!methodBlocks.length) {
        return;
      }

      opts = opts || {};
      type = type || 'instance';

      methodBlocks.forEach(function(block) {

        if (block.namespace) {
          opts.namespace = block.namespace;
        }

        if (block.static) {
          type = 'static';
        } else if (block.accessor) {
          type = 'accessor';
        }

        if (block.set) {
          opts.set     = block.set;
          opts.setName = block.name;
          block.set.forEach(function(methodName) {
            addSugarBuiltMethod(methodName, package, type, opts);
          });
        } else {
          delete opts.set;
          delete opts.setName;
          addSugarBuiltMethod(block.name, package, type, opts);
        }
      });
    }

    function getMethodBlocksInPreviousComment(node) {
      var methodBlocks = [];
      var comment = getLastCommentForNode(node, 1);
      var blocks = comment.split('***');
      blocks.forEach(function(block) {
        var methodMatch = block.match(/@method ([\[\]\w]+)/);
        if (methodMatch) {
          var methodBlock = {
            name: methodMatch[1],
            static: /@static/.test(block),
            accessor: /@accessor/.test(block)
          };
          var setMatch = block.match(/@set([^@\/]+)/);
          if (setMatch) {
            methodBlock.set = setMatch[1].replace(/^[\s*]*|[\s*]*$/g, '').replace(/[\s*]+/g, ',').split(',');
          }
          var namespaceMatch = block.match(/@namespace (\w+)/);
          if (namespaceMatch) {
            methodBlock.namespace = namespaceMatch[1];
          }
          methodBlocks.push(methodBlock);
        }
      });
      return methodBlocks;
    }

    // --- Nodes ---

    function getNodeBody(node, line) {
      // Subtract the column to offset the first line's whitespace as well.
      return node ? source.slice(node.start - (line ? node.loc.start.column : 0), node.end) : '';
    }

    function isUseStrict(node) {
      return node.type === 'ExpressionStatement' && node.expression.value === 'use strict';
    }

    function isVariableDeclaration(node) {
      return node.type === 'VariableDeclaration';
    }

    function isFunctionDeclaration(node) {
      return node.type === 'FunctionDeclaration';
    }

    function isMethodBlock(node) {
      return node.type === 'ExpressionStatement' &&
             node.expression.type === 'CallExpression' &&
             node.expression.callee.name &&
             !!node.expression.callee.name.match(/^define(Static|Instance(AndStatic)?)(Similar|WithArguments)?$/);
    }

    function isPolyfillBlock(node) {
      return node.type === 'ExpressionStatement' &&
             node.expression.type === 'CallExpression' &&
             node.expression.callee.name &&
             !!node.expression.callee.name.match(/^define(Static|Instance)Polyfill$/);
    }

    function isPrototypeBlock(node) {
      return node.type === 'ExpressionStatement' &&
             node.expression.type === 'CallExpression' &&
             node.expression.callee.name &&
             !!node.expression.callee.name.match(/defineOnPrototype/);
    }

    function isAliasExpression(node) {
      return node.type === 'ExpressionStatement' &&
             node.expression.type === 'CallExpression' &&
             node.expression.callee.name === 'alias';
    }

    function isFunctionCall(node) {
      return node.type === 'ExpressionStatement' &&
             node.expression.type === 'CallExpression';
    }

    function isVarAssignment(node) {
      return node.type === 'ExpressionStatement' &&
             node.expression.type === 'AssignmentExpression' &&
             node.expression.left.type === 'Identifier';
    }

    // --- Processing Nodes ---

    function hasStaticToken(str) {
      return /static/i.test(str);
    }

    function hasPolyfillToken(str) {
      return /polyfill/i.test(str);
    }

    function processFunctionDeclaration(node) {
      addSourcePackage(node.id.name, node, 'internal');
    }

    function processVariableDeclaration(node) {
      addVarPackage(node);
    }

    function processMethodBlock(node) {
      processDefineBlock(node);
    }

    function processPolyfillBlock(node) {
      processDefineBlock(node);
    }

    // Define block example: defineInstance(sugarDate, { ... }, [FLAG]);
    function processDefineBlock(node) {
      var defineMethod, sugarNamespace, methods, type, deps = [], opts = {};

      function getBlockEnd() {
        var arg3 = node.expression.arguments[2], end = '}';
        if (arg3) {
          deps = deps.concat(getDependencies(arg3));
          end += ', ' + getNodeBody(arg3);
        }
        end += ');';
        return end;
      }

      defineMethod   = node.expression.callee.name;
      sugarNamespace = node.expression.arguments[0].name;
      methods        = node.expression.arguments[1].properties;

      type = hasStaticToken(defineMethod) ? 'static' : 'instance';
      opts.polyfill = hasPolyfillToken(defineMethod);

      deps.push(defineMethod);
      deps.push(sugarNamespace);

      opts.defineMethod = defineMethod;
      opts.blockStart   = defineMethod + '(' + sugarNamespace + ', {';
      opts.blockEnd     = getBlockEnd();

      methods.forEach(function(node) {
        addSugarMethod(node.key.value, node, type, deps, opts);
      });
    }

    function processPrototypeBlock(node) {
      var target, methods, defineMethod, deps = [], opts = {};

      defineMethod = node.expression.callee.name;
      target       = node.expression.arguments[0].name;
      methods      = node.expression.arguments[1].properties;

      deps = [defineMethod, target];

      opts.target     = target;
      opts.blockStart = defineMethod + '(' + target + ', {';
      opts.blockEnd   = '});';

      methods.forEach(function(node) {
        addSugarMethod(node.key.value, node, 'prototype', deps, opts);
      });
    }

    function processAliasExpression(node) {
      var methodName, aliasedMethod, namespace, type, opts = {};

      methodName     = node.expression.arguments[1].value;
      aliasedMethod  = node.expression.arguments[2].value;

      opts.alias = aliasedMethod;
      opts.methodDependencies = [aliasedMethod];

      namespace = getNamespaceForNode(node);
      type = sourcePackages.findByMethodName(aliasedMethod, namespace, moduleName).type;

      addSugarMethod(methodName, node, type, [], opts);
    }

    function processBuildExpression(node) {

      var fnName     = node.expression.callee.name;
      var fnCallName = fnName + 'Call';
      var fnPackage  = sourcePackages.findByDependencyName(fnName);

      addSourcePackage(fnCallName, node, 'build');

      bundleVarAssignments();
      addBuiltMethods();
      addChainableConstructors();
      addFixes();
      transposeDependencies();

      function findVarAssignments(nodes, allowIf, assignments) {
        assignments = assignments || [];
        nodes.forEach(function(node) {
          if (isVarAssignment(node)) {
            var varName = node.expression.left.name, varPackage;
            if (fnPackage.dependencies.indexOf(varName) === -1) {

              // Other non-related var assignments may exist,
              // but if our package doesn't depend on them then ignore.
              return;
            }
            varPackage = sourcePackages.findByVarName(varName);
            if (varPackage.dependencies.indexOf(fnCallName) === -1) {
              assignments.push({
                name: varName,
                package: varPackage
              });
            }
          } else if (allowIf && node.type === 'IfStatement') {
            findVarAssignments(node.consequent.body, false, assignments);
          }
        });
        return assignments;
      }

      function bundleVarAssignments() {
        findVarAssignments(fnPackage.node.body.body).forEach(function(assignment) {
          // Add the call method as a dependency of the variable.
          // Note that this will create circular dependencies:
          // someVar -> buildFunctionCall -> buildFunction -> someVar
          // This is acceptable because other circular dependencies
          // exist and this is not an issue when modularizing for the
          // sake of re-creating the source, however these need to be
          // addressed when modularizing for the sake of a package
          // manager like npm.
          assignment.package.dependencies.push(fnCallName);
        });
      }

      // A build function may define methods which involve complex or
      // optimized ways of defining sets of methods (date units, etc),
      // so instead of attempting to analyze the build function, we are
      // saying that any set methods must be defined in the comment block
      // directly above the build method.
      function addBuiltMethods() {
        var opts = {}, type;

        fnPackage.node.body.body.forEach(function(node) {
          if (isPrototypeBlock(node)) {
            type = 'prototype';
            opts.target = node.expression.arguments[0].name;
          }
          if (isMethodBlock(node) && hasStaticToken(node.expression.callee.name)) {
            type = 'static';
          }
        });

        // If no special types were defined, then the
        // build function is simply defining instance types.
        if (!type) {
          type = 'instance';
        }

        checkPackageForBuiltMethods(fnPackage, type, opts);
      }

      // set___ChainableConstructor is a special type of build method that
      // hands the chainable constructor off to a Sugar "create" method so
      // that chainables can have enhanced functionality beyond wrapping a
      // primitive, for example "new Sugar.Date('today')". When modularizing,
      // the "create" method simply needs to know that it depends on this build
      // so that the link can be created.
      function addChainableConstructors() {
        var match = fnPackage.name.match(/^set(\w+)ChainableConstructor$/);
        if (match) {
          var namespace = match[1];
          var createPackage = sourcePackages.find(function(p) {
            return p.name === 'create' && p.namespace === namespace;
          });
          createPackage.dependencies.push(fnPackage.name);
        }
      }

      // Fixes are special types of build methods that fix broken behavior but
      // are not polyfills or attached to a specific method, so need to be
      // handled differently.
      function addFixes() {
        var match = fnPackage.name.match(/^build(\w+)Fix$/);
        if (match) {
          addSugarFix(match[1], fnPackage);
          fnPackage.dependencies.push(fnCallName);
          fnPackage.postAssigns = findVarAssignments(fnPackage.node.body.body, true);
        }
      }

      // Step through all source packages and transpose dependencies on the
      // build function to be dependent on the function call instead, ensuring
      // that the function is finally called. Although we could simply push the
      // call body into the build package, this way allows the source to be
      // faithfully rebuilt no matter where the build call occurs.
      function transposeDependencies() {
        sourcePackages.forEach(function(p) {
          if (p.name === fnCallName) {
            // Do not transpose the call package itself. After this loop
            // there should be only one dependency on the build function anymore.
            return;
          }
          var index = p.dependencies.indexOf(fnName);
          if (index !== -1) {
            p.dependencies.splice(index, 1, fnCallName);
          }
        });
      }

    }

    // --- Dependencies ---

    function getDependencies(node, name, locals) {
      var deps = [];

      if (!locals) {
        locals = [];
      }

      function log() {
        if (name === 'xxx') {
          console.log.apply(null, [name + ':'].concat(Array.prototype.slice.call(arguments, 0)));
        }
      }

      function pushLocal(loc) {
        if (locals.indexOf(loc) === -1) {
          log('PUSHING LOCAL', loc);
          locals.push(loc);
        }
      }

      function pushDependency(dep) {
        if (deps.indexOf(dep) === -1) {
          log('PUSHING DEPENDENCY', dep);
          deps.push(dep);
        }
      }

      function pushDependencies(arr) {
        arr.forEach(pushDependency);
      }

      function getLocals(nodes) {
        return nodes.map(function(id) {
          return id.name;
        });
      }

      function walk(nodes) {
        if (!nodes) {
          return;
        }
        if (nodes.type) nodes = [nodes];
        nodes.forEach(processNode);
      }

      function processNode(node) {
        log('PROCESSING:', node.type);
        switch(node.type) {
          case 'Identifier':
            pushDependency(node.name);
            return;
          case 'VariableDeclarator':
            pushLocal(node.id.name);
            walk(node.init);
            return;
          case 'FunctionDeclaration':
            pushLocal(node.id.name);
            // Recursively get this function's local dependencies.
            // so that flat locals don't clobber them.
            pushDependencies(getDependencies(node.body, name, getLocals(node.params)));
            return;
          case 'FunctionExpression':
            // Recursively get this function's local dependencies.
            // so that flat locals don't clobber them.
            pushDependencies(getDependencies(node.body, name, getLocals(node.params)));
            return;
          case 'CatchClause':
            pushLocal(node.param);
            walk(node.body);
            return;
          case 'MemberExpression':
            walk(node.object);
            // If the MemberExpression is computed syntax (a[b]) then
            // the property value may be a depencency, so step in.
            if (node.computed) walk(node.property);
            return;
          case 'ExpressionStatement':
            walk(node.expression);
            return;
          case 'SequenceExpression':
            walk(node.expressions);
            return;
          case 'SwitchStatement':
            walk(node.discriminant);
            walk(node.cases);
            return;
          case 'ObjectExpression':
            walk(node.properties);
            return;
          case 'ArrayExpression':
            walk(node.elements);
            return;
          case 'TryStatement':
            walk(node.block);
            walk(node.handler);
            walk(node.finalizer);
            return;
          case 'BlockStatement':
            walk(node.body);
            return;
          case 'ForStatement':
            walk(node.init);
            walk(node.test);
            walk(node.update);
            walk(node.body);
            return;
          case 'ForInStatement':
            walk(node.left);
            walk(node.right);
            walk(node.body);
            return;
          case 'WhileStatement':
            walk(node.test);
            walk(node.body);
            return;
          case 'DoWhileStatement':
            walk(node.body);
            walk(node.test);
            return;
          case 'VariableDeclaration':
            walk(node.declarations);
            return;
          case 'Property':
            walk(node.value);
            return;
          case 'NewExpression':
          case 'CallExpression':
            walk(node.callee);
            walk(node.arguments);
            return;
          case 'SwitchCase':
          case 'IfStatement':
          case 'ConditionalExpression':
            walk(node.test);
            walk(node.consequent);
            walk(node.alternate);
            return;
          case 'BinaryExpression':
          case 'LogicalExpression':
          case 'AssignmentExpression':
            walk(node.left);
            walk(node.right);
            return;
          case 'ThrowStatement':
          case 'ReturnStatement':
          case 'UnaryExpression':
          case 'UpdateExpression':
            walk(node.argument);
            return;
          case 'Literal':
          case 'EmptyStatement':
          case 'ThisExpression':
          case 'BreakStatement':
          case 'ContinueStatement':
            // Pass on literals, {}, this, break, continue
            return;
          default:
            console.log(node);
            throw new Error('Unknown Node: ' + node.type);
        }
      }

      function isValidDependency(d) {
        // Remove any local variables, whitelisted tokens like "arguments" or "NaN",
        // and anything in the global scope. Cheating a bit here by using the node
        // global scope instead of a ton of whitelisted tokens.
        return locals.indexOf(d) === -1 && !global[d] && WHITELISTED.indexOf(d) === -1;
      }

      walk(node);
      return deps.filter(isValidDependency);
    }

  }

  // Find packages depending on specific vars and transpose the dependency to
  // the bundled var package instead. However keep the references as
  // "varDependencies" for later consumption.
  function transposeVarDependencies() {
    var map = {};
    sourcePackages.forEach(function(p) {
      if (p.vars) {
        p.vars.forEach(function(v) {
          map[v] = p.name;
        });
      }
    });
    sourcePackages.forEach(function(p) {
      var deps = [];
      var varDeps = [];
      p.dependencies.forEach(function(d) {
        var normalized = map[d] || d;
        if (deps.indexOf(normalized) === -1) {
          deps.push(normalized);
        }
        if (d in map) {
          varDeps.push(d);
        }
      });
      p.dependencies = deps;
      if (varDeps.length) {
        p.varDependencies = varDeps;
      }
    });
  }

  function cleanNodes() {
    sourcePackages.forEach(function(p) {
      delete p.node;
    });
  }

  // --- Locales ---

  function addLocalePackages() {
    var di = modules.findIndex(function(m) {
      return m.name === 'Date';
    });
    modules.splice(di + 1, 0, {
      name: 'Locales',
      comment: LOCALES_MODULE_COMMENT
    });
    getAllLocales().forEach(function(filePath) {
      var code = path.basename(filePath, '.js');
      var body = readFile(filePath);
      var name = body.match(/\s+([^*]+) locale definition/)[1];
      sourcePackages.push({
        name: name,
        code: code,
        body: body,
        type: 'locale',
        module: 'Locales',
        bodyWithComments: body,
        methodDependencies: ['addLocale']
      });
    });
  }

  return {
    modules: modules,
    packages: sourcePackages
  };

}

// -------------- Packages ----------------


function buildPackagesDefault() {
  return buildPackages(args.p || args.package || args.packages || 'all');
}

function buildPackagesCore() {
  return buildPackages('sugar-core');
}

function buildPackagesSugar() {
  return buildPackages('sugar');
}

function buildPackagesClean() {
  cleanDir(args.o || args.output || 'packages');
}

function buildPackages(p, rebuild) {

  var sourcePackages;
  var baseDir = args.o || args.output || 'packages';
  var stream = getEmptyStream();

  buildAllPackages(p);

  function buildAllPackages() {
    getPackageNames(p).forEach(buildPackage);
  }

  function buildPackage(packageName) {
    var packageDir = path.join(baseDir, packageName), isModular;

    isModular = packageName !== 'sugar-core';

    cleanDir(path.join(packageDir, '*'));

    if (isModular && !sourcePackages) {
      notify('Getting source packages');
      sourcePackages = getModularSource().packages;
      mergeMethodDependencies();
      bundleCircularDependencies();
    }

    notify('Building ' + packageName);

    if (isModular) {
      buildModularPackage(packageName, packageDir);
    }

    if (!rebuild) {
      var distDir = isModular ? path.join(packageDir, 'dist') : packageDir;
      addStream(stream, buildPackageDist(packageName, distDir));
      buildPackageManagerJson(packageName, packageDir);
      buildIgnoreFiles(packageName, packageDir);
      copyPackageMeta(packageName, packageDir);
      exportPackageDeclarations(packageName, packageDir);
    }

  }

  function buildModularPackage(packageName, packageDir) {

    var TAB = '  ';
    var DTAB = TAB + TAB;
    var STRICT = "'use strict';";
    var DIRECT_REQUIRES_REG = /(Call|Fix)$/;

    exportAllModules();

    // --- Exporting ---


    function getModuleDefinitions(modules) {
      return modules.split(',').map(function(md) {
        var split = md.split(':'), name, path, type;
        name = split[0];
        path = './' + name.toLowerCase();
        if (name === 'Locales') {
          type = 'locales';
        } else if (moduleIsPolyfill(name)) {
          type = 'polyfill';
        } else {
          type = 'module';
        }
        return {
          name: name,
          path: path,
          type: type,
          namespace: split[1]
        };
      });
    }

    function createPackageEntryPoints(moduleDefinitions, packageDefinition) {
      createPackageMainEntryPoint(moduleDefinitions, packageDefinition);
      if (!packageDefinition.polyfill) {
        createPackagePolyfillEntryPoint(moduleDefinitions, /^ES[567]/, 'polyfills');
        createPackagePolyfillEntryPoint(moduleDefinitions, /^ES5/, 'polyfills', 'es5');
        createPackagePolyfillEntryPoint(moduleDefinitions, /^ES6/, 'polyfills', 'es6');
        createPackagePolyfillEntryPoint(moduleDefinitions, /^ES7/, 'polyfills', 'es7');
      }
    }

    function createPackageMainEntryPoint(moduleDefinitions, packageDefinition) {
      // Filtering out polyfills in main entry point
      // except for packages that only define polyfills.
      var paths = moduleDefinitions.filter(function(md) {
        return md.type === 'module' || (md.type === 'polyfill' && packageDefinition.polyfill);
      }).map(function(md) {
        return md.path;
      });
      createEntryPoint(paths);
    }

    function createPackagePolyfillEntryPoint(moduleDefinitions, match, subPath, entryPointName) {
      var paths = moduleDefinitions.filter(function(md) {
        return md.type === 'polyfill' && match.test(md.name);
      }).map(function(md) {
        return path.join('..', md.path);
      });
      if (paths.length) {
        createEntryPoint(paths, subPath, entryPointName);
      }
    }

    function exportAllModules() {
      var packageDefinition = getPackageDefinition(packageName);
      var moduleDefinitions = getModuleDefinitions(packageDefinition.modules);
      moduleDefinitions.forEach(function(m) {
        exportModule(m.name, m.namespace);
      });
      createPackageEntryPoints(moduleDefinitions, packageDefinition);
    }

    function exportModule(moduleName, restrictedNamespace) {
      var dependencies = [], methodPaths = [], moduleLower = moduleName.toLowerCase();

      exportPublicPackages();
      exportDependencies();
      createEntryPoint(groupBy(methodPaths, 'type'), moduleLower);

      function packageIsNamespaceRestricted(p) {
        if (p.namespace === 'Range') {
          // Don't restrict range methods
          return false;
        }
        return restrictedNamespace && p.namespace && p.namespace !== restrictedNamespace;
      }

      function canExportPublicPackage(p) {
        return p.module === moduleName &&
               sourcePackageIsListed(p) &&
               !packageIsNamespaceRestricted(p);
      }

      function exportPublicPackages() {
        sourcePackages.forEach(function(p) {
          if (canExportPublicPackage(p)) {
            exportPackage(p);
            addDependencies(p);
            methodPaths.push({
              type: getEntryPointTypeForPackage(p),
              path: getRelativePath(p.path, moduleLower, true)
            });
          }
        });
      }

      function exportDependencies() {
        uniq(dependencies).forEach(function(dep) {
          if (dep.name !== 'core') {
            exportPackage(dep);
          }
        });
      }

      function addDependencies(p) {
        p.dependencies.forEach(function(d) {
          var dep = findDependency(d, p);
          if (dep) {
            dependencies.push(dep);
            addDependencies(dep);
          }
        });
      }

    }

    function exportPackage(p) {
      if (!p.compiledBody) {
        compilePackage(p);
      }
      var outputPath = path.join(packageDir, p.path + '.js');
      var outputBody = p.compiledBody;
      writeFile(outputPath, outputBody);
    }

    // --- Compiling ---

    function compilePackage(p) {
      compileForType(p);
      p.path = getPackagePath(p);
      p.compiledBody = compact([
        STRICT,
        getRequires(p),
        getDirectRequires(p),
        getAssigns(p),
        p.body,
        getPostAssigns(p),
        getExports(p)
      ]).join('\n\n');
    }

    function compileForType(p) {
      if (p.alias) {
        compileAliasedMethod(p);
        return;
      }
      switch(p.type) {
        case 'static':
        case 'instance':
          compileDefinedMethod(p);
          break;
        case 'accessor':
          compileAccessorMethod(p);
          break;
        case 'prototype':
          compilePrototypeMethod(p);
          break;
        case 'var':
          compileVarPackage(p);
          break;
        case 'locale':
          compileLocalePackage(p);
          break;
      }
    }

    function compileAccessorMethod(p) {
      p.dependencies.push('Sugar');
    }

    function compileDefinedMethod(p) {
      p.dependencies.push('Sugar');
      // Built methods may not have a defineBlock
      if (p.defineMethod) {
        // Wrap the naked method definition body with a direct call to the global
        // define method, and remove dependencies on the definition/namespace aliases.
        var blockStart = ['Sugar', p.namespace, p.defineMethod].join('.') + '({';
        removeVarDependency(p, p.defineMethod);
        removeVarDependency(p, 'sugar' + p.namespace);
        p.body = compact([blockStart, p.body, p.blockEnd]).join('\n\n');
      }
    }

    function compileAliasedMethod(p) {
      p.dependencies.push('Sugar');
      removeVarDependency(p, 'alias');
      removeVarDependency(p, 'sugar' + p.namespace);
      p.body = ['Sugar', p.namespace, 'alias'].join('.') + "('" + p.name + "', '" + p.alias + "');";
    }

    function compilePrototypeMethod(p) {
      p.body = compact([p.blockStart, p.body, p.blockEnd]).join('\n\n');
    }

    function compileVarPackage(p) {
      var varName, varAssigns;
      for (var i = 0; i < p.vars.length; i++) {
        varName = p.vars[0];
        varAssigns = p.assigns[varName];
        // If any of the variables is declared but not immediately assigned,
        // or if any of the assigns are spread over multiple lines, then the
        // package is probably complex, so bail and don't allow direct exports.
        if (!varAssigns || /\n/.test(varAssigns)) {
          return;
        }
        p.exportsDirectly = true;
        p.body = '';
      }
    }

    function compileLocalePackage(p) {
      p.body = p.body.replace(/Sugar\.Date\.(?=addLocale)/, '');
    }

    function removeVarDependency(p, name) {
      var varPackage = sourcePackages.findByVarName(name);
      p.dependencies = p.dependencies.filter(function(d) {
        return d !== varPackage.name;
      });
    }

    // --- Compile Helpers ---

    function getPackagePath(p) {
      if (p.path) {
        return p.path;
      } else if (p.polyfill) {
        return path.join('polyfills', p.namespace.toLowerCase(), p.name);
      } else if (p.type === 'fix') {
        return path.join(p.module.toLowerCase(), 'fixes', p.name);
      } else if (p.type === 'locale') {
        return path.join(p.module.toLowerCase(), p.code);
      } else if (sourcePackageIsDependency(p)) {
        return path.join(p.module.toLowerCase(), p.type, p.name);
      } else {
        return path.join(p.namespace.toLowerCase(), p.name);
      }
    }

    function getPackageRelativePath(toPackage, fromPackage) {
      return getRelativePath(getPackagePath(toPackage), getPackagePath(fromPackage));
    }

    function getRelativePath(toPath, fromPath, index) {
      if (index) {
        fromPath += '/index';
      }
      var relDir  = path.relative(path.dirname(fromPath), path.dirname(toPath));
      var relPath = path.join(relDir, path.basename(toPath));
      if (relPath.charAt(0) !== '.') {
        relPath = './' + relPath;
      }
      return relPath;
    }

    function getDependencyPath(d, p) {
      if (d === 'Sugar') {
        return 'sugar-core';
      }
      return getPackageRelativePath(findDependency(d, p), p);
    }

    function getRequires(p) {
      if (!p.dependencies.length) {
        return '';
      }

      var ALL_CAPS   = /^[A-Z_]+$/;
      var FIRST_CAPS = /^[A-Z]/;

      function getRequiresSorted() {
        var deps = p.dependencies.concat().filter(function(d) {
          return !DIRECT_REQUIRES_REG.test(d);
        });
        if (!deps.length) {
          return '';
        }
        deps.sort(function(a, b) {
          var aRank = getRequireRanking(a);
          var bRank = getRequireRanking(b);
          return aRank === bRank ? a.length - b.length : aRank - bRank;
        });

        var requires = deps.map(function(d) {
          var path = getDependencyPath(d, p);
          return d + " = require('"+ path +"')";
        });
        return 'var ' + requires.join(',\n' + DTAB) + ';';
      }

      function getRequireRanking(r) {
        if (r === 'Sugar') {
          return 0;
        } else if (ALL_CAPS.test(r)) {
          return 1;
        } else if (FIRST_CAPS.test(r)) {
          return 2;
        } else {
          return 3;
        }
      }

      return getRequiresSorted();
    }

    // Any build method calls don't require a reference and can be simply
    // required directly, so output them here.
    function getDirectRequires(p) {
      return p.dependencies.filter(function(d) {
        return DIRECT_REQUIRES_REG.test(d);
      }).map(function(d) {
        return "require('"+ getDependencyPath(d, p) +"');";
      }).join('\n');
    }

    function getAssigns(p) {
      var assigns = [];
      p.dependencies.forEach(function(d) {
        var dep = findDependency(d, p);
        if (dep && dep.vars && dep.vars.length > 1) {
          dep.vars.forEach(function(v) {
            if (p.varDependencies && p.varDependencies.indexOf(v) !== -1) {
              assigns.push(v + ' = ' + dep.name + '.' + v);
            }
          });
        }
      });
      if (!assigns.length) {
        return '';
      }
      return 'var ' + assigns.join(',\n' + DTAB) + ';';
    }

    function getPostAssigns(p) {
      if (p.postAssigns && p.postAssigns.length) {
        var assigns = p.postAssigns.map(function(a) {
          return a.package.name + '.' + a.name + ' = ' + a.name + ';';
        });
        return assigns.join('\n');
      }
      return '';
    }

    function getExports(p) {
      var exports;
      if (p.polyfill) {
        return [
          '// This package does not export anything as it is mapping a',
          '// polyfill to '+ p.namespace +'.prototype which cannot be called statically.'
        ].join('\n');
      } else if (p.type === 'prototype') {
        return [
          '// This package does not export anything as it is',
          '// simply defining "'+ p.name +'" on '+ p.target +'.prototype.'
        ].join('\n');
      } else if (p.type === 'locale') {
        return [
          '// This package does not export anything as it is',
          '// simply registering the "'+ p.code +'" locale.'
        ].join('\n');
      } else if (p.type === 'fix') {
        return [
          '// This package does not export anything as it is',
          '// simply fixing existing behavior.'
        ].join('\n');
      } else if (sourcePackageExportsMethod(p)) {
        exports = ['Sugar', p.namespace, p.name].join('.');
      } else if (p.vars && p.vars.length > 1) {
        var lines = p.vars.map(function(v) {
          return v + ': ' + (p.exportsDirectly ? p.assigns[v] : v);
        });
        exports = ['{', TAB + lines.join(',\n' + TAB), '}'].join('\n');
      } else if (p.exportsDirectly) {
        // Single line direct export
        exports = p.assigns[p.vars[0]];
      } else if (p.type !== 'build') {
        exports = p.name;
      }
      // Build calls do not export themselves, so don't export unless they have
      // explicit vars (caught above). No comment as this is internal.
      return exports ? 'module.exports = ' + exports + ';' : '';
    }

    // --- Entry Point ---

    function createEntryPoint(paths, subPath, name) {
      var outputPath = path.join(packageDir, subPath || '', (name || 'index') + '.js'), requires;
      requires = Array.isArray(paths) ? getRequiresForArray(paths) : getRequiresForGroup(paths);
      var exports = "module.exports = require('sugar-core');";
      var outputBody = [STRICT, requires, exports].join('\n\n');
      writeFile(outputPath, outputBody);
    }

    function getRequiresForArray(arr) {
      return arr.map(function(p) {
        return "require('"+ p +"');";
      }).join('\n');
    }

    function getRequiresForGroup(group) {
      var blocks = [];
      iter(group, function(type, entries) {
        var comment = getCommentForEntryPointType(type), requires;
        entries = entries.map(function(entry) {
          return entry.path;
        });
        entries.sort();
        requires = compact([comment, getRequiresForArray(entries)]).join('\n');
        blocks.push({
          type: type,
          requires: requires
        });
      });
      blocks.sort(function(a, b) {
        var aRank = getRankForEntryPointType(a.type);
        var bRank = getRankForEntryPointType(b.type);
        return aRank - bRank;
      });
      return blocks.map(function(b) {
        return b.requires;
      }).join('\n\n');
    }

    function getRankForEntryPointType(type) {
      switch (type) {
        case 'polyfill':  return 1;
        case 'module':    return 2;
        case 'static':    return 3;
        case 'instance':  return 4;
        case 'prototype': return 5;
        case 'alias':     return 6;
        case 'accessor':  return 7;
      }
    }

    function getCommentForEntryPointType(type) {
      if (type === 'polyfill') {
        return '// Polyfills';
      } else if (type === 'alias') {
        return '// Aliases';
      } else if (type === 'accessor') {
        return '// Accessors';
      } else if (type === 'fix') {
        return '// Fixes';
      } else if (type === 'static') {
        return '// Static Methods';
      } else if (type === 'instance') {
        return '// Instance Methods';
      } else if (type === 'prototype') {
        return '// Prototype Methods';
      } else if (type === 'module') {
        return '// Modules';
      }
    }

    function getEntryPointTypeForPackage(p) {
      if (p.alias) {
        return 'alias';
      } else {
        return p.type;
      }
    }

  }

  function mergeMethodDependencies() {
    sourcePackages.forEach(function(sp) {
      var deps = sp.dependencies, mdeps = sp.methodDependencies;
      sp.dependencies = (deps || []).concat(mdeps || []);
    });
  }

  // Circular dependencies are not necessarily a problem for Javascript at
  // execution time due to having different code paths, however they don't work
  // for npm packages, so they must be bundled together. This isn't too fancy so
  // more complicated dependencies should be refactored. First in the source
  // will be the target package for the bundle.
  function bundleCircularDependencies() {

    function findCircular(deps, chain) {
      for (var i = 0, startIndex, c, p; i < deps.length; i++) {
        // Only top level dependencies will be included in the chain.
        p = sourcePackages.findByDependencyName(deps[i]);
        if (!p) {
          continue;
        }
        startIndex = chain.indexOf(p.name);
        if (startIndex !== -1) {
          return chain.slice(startIndex);
        } else {
          c = findCircular(p.dependencies, chain.concat(p.name));
          if (c) {
            return c;
          }
        }
      }
    }

    function bundleCircular(chain) {

      // Sort the chain so that all packages are
      // bundled into the first found in the source.
      chain = sortChain(chain);

      var target = sourcePackages.findByDependencyName(chain[0]);
      delete target.comments;
      chain.slice(1).forEach(function(n) {
        var src = sourcePackages.findByDependencyName(n);
        target.body += '\n\n' + src.body;
        target.bodyWithComments += '\n\n' + src.bodyWithComments;
        bundleArray(target, src, 'dependencies', true);
        bundleArray(target, src, 'varDependencies', true);
        bundleArray(target, src, 'vars');
        bundleMap(target, src, 'assigns');
        updateExternalDependencies(src.name, target.name);

        if (src.type === 'build' && (!target.vars || !target.vars.length)) {
          // A build function that is having it's call block being bundled
          // into it can also take on the type "build". This generally means
          // that it has no exports. However don't do this if the function is
          // building up variables, in which case it will have a "vars".
          target.type = 'build';
        }

        removePackage(src);
      });

    }

    function sortChain(chain) {
      return chain.sort(function(a, b) {
        return getPackageIndexByName(a) - getPackageIndexByName(b);
      });
    }

    function getPackageIndexByName(name) {
      return sourcePackages.findIndex(function(p) {
        return p.name === name;
      });
    }

    // Bundle all dependencies from the source into the target,
    // but only after removing the circular dependency itself.
    function bundleArray(target, src, name, notSelf) {
      var srcValues, targetValues;
      if (src[name]) {
        srcValues = src[name] || [];
        targetValues = target[name] || [];
        target[name] = uniq(targetValues.concat(srcValues.filter(function(d) {
          return !notSelf || d !== target.name;
        })));
      }
    }

    function bundleMap(target, src, name) {
      if (src[name]) {
        target[name] = target[name] || {};
        merge(target[name], src[name]);
      }
    }

    // Update all packages pointing to the old package.
    function updateExternalDependencies(oldName, newName) {
      sourcePackages.forEach(function(p) {
        var index = p.dependencies.indexOf(oldName);
        if (index !== -1) {
          if (p.name === newName || p.dependencies.indexOf(newName) !== -1) {
            // If the package has the same name as the one we are trying to
            // update to, then we are trying to update the package to point
            // to itself as a dependency, which isn't possible so just remove
            // the old dependency. Alternatively, if the package already has
            // the new name, then we can simply remove the old one and move on.
            p.dependencies.splice(index, 1);
          } else {
            // If the package is NOT trying to update to itself and does NOT
            // have the new dependency already, then add it in place of the
            // old one.
            p.dependencies.splice(index, 1, newName);
          }
        }
      });
    }

    function removePackage(p) {
      var index = sourcePackages.indexOf(p);
      sourcePackages.splice(index, 1);
    }

    sourcePackages.forEach(function(p) {
      var chain = findCircular(p.dependencies, []);
      if (chain) {
        bundleCircular(chain);
      }
    });
  }

  // Find a package that is being depended on. Dependencies are usually top level
  // functions or variables that are in the main scope, however aliases are
  // dependent on the methods they alias to, so if no top level member is found
  // then fall back to methods using a second pass. Note that only Sugar methods
  // as opposed to polyfills are considered dependencies. This effectively means
  // that alias('all', 'every') will always refer to the Sugar enhanced method,
  // NOT the polyfill. The reason for this is to prevent confusion if the "all"
  // method's functionality were to suddenly change depending on whether the
  // enhanced "every" method was present or not. Additionally, generally native
  // functionality should use it's proper name, so aliases should always be
  // referring to something beyond that.
  function findDependency(name, p) {
    return sourcePackages.findByDependencyName(name) || sourcePackages.findByDependentPackage(p);
  }

  return stream;
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
          name: m.name,
          module: m.module
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

  outputJSON('api.json', data);
}

function buildJSONDocs() {
  outputJSON('docs.json', getJSONDocs());
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
    'enhanced matching': '#/ArrayMatching',
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

  var POLYFILL_HTML = getReplacements('This method is provided as a `polyfill`.');
  var ENHANCED_HTML = getReplacements('This method is also provided as a `polyfill` in the MOD module.');

  var POLYFILL_REPLACE_REG = /This method is (also )?provided as a .*polyfill.*\./;

  var JSDOC_PARAM_REG = /\{([\w<>|\[\]]+)\} (\[)?(\w+)\]?(?: - (.+))?[\s\*]*$/;
  var JSDOC_SIGNATURE_REG = /([\w\[\]]+)\((.*)\)$/m;

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
      } else if (field === 'param') {
        mapParamType(value, obj);
        return;
      } else if (field === 'callbackParam') {
        mapCallbackParamType(value, obj);
        return;
      } else if (field === 'callbackReturns') {
        mapCallbackReturnType(value, obj);
        return;
      } else if (field === 'option') {
        mapOptionType(value, obj['options']);
        return;
      } else if (field === 'returns') {
        value = getSingleline(value);
      } else if (field === 'signature') {
        field = 'signatures';
        value = pushSignature(getSingleline(value), obj[field]);
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
    var params = [];
    getMultiline(str, true).forEach(function(line) {
      var match = line.match(/^(\w+)\s{2,}(.+)$/);
      if (match) {
        params.push({
          name: match[1],
          description: getReplacements(match[2])
        });
      } else {
        params[params.length - 1].description += ' ' + getReplacements(line);
      }
    });
    callbacks.push({
      name: callbackName,
      params: params
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

  function getSingleline(str) {
    return getMultiline(str, true)[0];
  }

  function getMultiline(str, clean) {

    var lines = str.split('\n').map(function(line) {
      return line.replace(/^[\s*]*|[\s*]*$/g, '');
    });
    if (clean) {
      lines = lines.join('\n').replace(/^\n+|\n+$/g, '').split('\n');
    }
    return lines;
  }

  function getParamMatch(str) {
    var match = str.match(JSDOC_PARAM_REG);
    return {
      type: match[1],
      name: match[3],
      required: !match[2],
      description: match[4]
    };
  }

  function mapParamType(str, method) {

    var param = getParamMatch(str);


    function map(signature) {
      signature.forEach(function(p) {
        if (p.name === param.name) {
          p.type = param.type;
          p.description = param.description;
        }
      });
    }

    map(method.params);
    if (method.signatures) {
      method.signatures.forEach(map);
    }
  }

  function mapCallbackParamType(str, method) {
    var param = getParamMatch(str);
    method.callbacks.forEach(function(callback) {
      callback.params.forEach(function(p) {
        if (p.name === param.name) {
          p.type = param.type;
          p.required = param.required;
        }
      });
    });
  }

  function mapCallbackReturnType(str, method) {
    var returns = getParamMatch(str);
    method.callbacks.forEach(function(callback) {
      if (callback.name === returns.name) {
        callback.returns = returns.type;
      }
    });
  }

  function pushSignature(str, signatures) {
    var match = str.match(JSDOC_SIGNATURE_REG);
    var signature = getParams(match[2]);
    if (!signatures) {
      signatures = [];
    }
    signatures.push(signature);
    return signatures;
  }

  function mapOptionType(str, options) {
    var match = str.match(JSDOC_PARAM_REG);

    var optionType = match[1];
    var optionName = match[3];
    var required  = !match[2];

    var option = options.find(function(o) {
      return o.name === optionName;
    });
    option.type = optionType;
    option.required = required;
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
        } else if (line == '') {
          lines.splice(i, 1);
          i--;
          continue;
        }
        if (line.match(/^(var )?\w+ = /) && !line.match(/->/) && nextLine && nextLine.trim()) {
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

      method.name = nameClean;
      method.module = currentModuleName;
      method.params = getParams(match[2]);

      setAllFields(method, block);

      method.line = getLineNumber(name, lines);
      method.type = getMethodType(method);

      checkAlias(method, name);
      currentNamespace.methods.push(method);
    }
  }

  function getParams(str) {
    var params = str && str.split(', ').filter(function(a) {
      return !!a;
    });

    if (!params) {
      params = [];
    }

    return params.map(function(p) {
      var s = p.split(' = ');
      var m = s[0].match(/(\[)?(\w+)\]?|(\.\.\.)/);
      var param = {};
      if (m[2]) {
        param.name = m[2];
        param.required = !m[1];
      }
      if (m[3]) {
        param.glob = true;
        param.name = '...';
      }
      if (s[1]) {
        param.default = s[1];
      }
      return param;
    });
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
      case method.namespace === 'Sugar':          return 'global';
      case method.namespace === 'SugarNamespace': return 'namespace';
      case method.static:    return 'static';
      case method.accessor:  return 'accessor';
      default:               return 'instance';
    }
  }

  sortNamespaces(docs);

  return docs;
}

// --- JSON Source ---

function buildJSONSource() {

  var data = getModularSource();

  addCorePackage();
  prepareData();
  outputJSON('source.json', data);

  function addCorePackage() {
    data.modules.unshift({
      name: 'Core'
    });
    data.packages.unshift({
      name: 'Sugar',
      type: 'core',
      module: 'Core',
      dependencies: [],
      bodyWithComments: readFile('lib/core.js').trim()
    });
  }

  function bundleSetPackages() {
    var packages = [], handledSets = {}, p;

    for (var i = 0; i < data.packages.length; i++) {
      p = data.packages[i];
      if (p.set) {
        // If the package has been handled already then just skip.
        if (!handledSets[p.namespace + p.setName]) {
          packages.push({
            setName: p.setName,
            name: p.setName.replace(/[\[\]]/g, ''),
            sample: p.set.slice(0, 3).concat('...').join(', '),
            type: p.type,
            alias: p.alias,
            module: p.module,
            namespace: p.namespace,
            dependencies: p.dependencies,
            bodyWithComments: p.bodyWithComments
          });
          handledSets[p.namespace + p.setName] = true;
        }
      } else {
        packages.push(p);
      }
    }

    return packages;
  }

  function prepareData() {
    var bundledPackages = bundleSetPackages();
    data.modules.forEach(function(m) {
      indentField(m, 'comment');
    });
    bundledPackages.forEach(function(p) {

      // Pre-indenting all packages rather than doing it on compile to
      // save some cycles and also correctly calculate the package size.
      indentField(p, 'blockStart');
      indentField(p, 'blockEnd');
      indentField(p, 'bodyWithComments');

      cleanSourcePackage(p);
    });
    data.packages = bundledPackages;
  }

  function indentField(p, field) {
    if (p[field]) {
      p[field] = p[field].replace(/^(?=.)/gm, '  ');
    }
  }

  function cleanSourcePackage(p) {
    if (sourcePackageIsDependency(p)) {
      delete p.type;
    }
    delete p.vars;
    delete p.target;
    delete p.body;
    delete p.path;
    delete p.assigns;
    delete p.comments;
    delete p.defineMethod;
    delete p.varDependencies;
    compactField(p, 'bodyWithComments');
    compactField(p, 'dependencies');
  }

  function compactField(p, field) {
    var val = p[field];
    if (!val || (Array.isArray(val) && !val.length)) {
      delete p[field];
    }
  }

}

// -------------- Typescript Declarations ----------------


var TS_LICENSE = block`
// Type definitions for Sugar ${getVersion(true)}
// Project: https://sugarjs.com/
// Definitions by: Andrew Plummer <plummer.andrew@gmail.com>
`;

var TS_EXTENDED_LICENSE = block`
// Extended type definitions for Sugar ${getVersion(true)}
// Project: https://sugarjs.com/
// Definitions by: Andrew Plummer <plummer.andrew@gmail.com>
`;

function buildTypescriptDeclarations() {
  var basePath = args.o || args.output || '';
  var moduleNames = getModuleNames();
  exportTypescriptDeclarations(basePath, moduleNames, args.include, args.exclude);
}

function exportTypescriptDeclarations(basePath, allowedModules, include, exclude) {

  var optionInterfaceNamespaces = {};
  var moduleCallbackGenerics = {};
  var moduleOptionsGenerics = {};

  var whitelist = getMethodList(include);
  var blacklist = getMethodList(exclude);

  var TYPE_REG = /is(Boolean|Number|String|Date|RegExp|Function|Array|Error|Set|Map)$/;

  var TYPE_GUARD_GENERICS = {
    Array: ['any'],
    Map: ['any', 'any'],
    Set: ['any']
  }

  var CHAINABLE_RAW_TYPE = 'RawValue';

  var CHAINABLE_NATIVE_METHODS = {

    Array: [
      'toLocaleString(): string;',
      'push(...items: T[]): number;',
      'pop(): T | undefined;',
      'concat(...items: T[][]): T[];',
      'concat(...items: (T | T[])[]): T[];',
      'join(separator?: string): string;',
      'reverse(): T[];',
      'shift(): T | undefined;',
      'slice(start?: number, end?: number): T[];',
      'sort(compareFn?: (a: T, b: T) => number): this;',
      'splice(start: number): T[];',
      'splice(start: number, deleteCount: number, ...items: T[]): T[];',
      'unshift(...items: T[]): number;',
      'indexOf(searchElement: T, fromIndex?: number): number;',
      'lastIndexOf(searchElement: T, fromIndex?: number): number;',
      'every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;',
      'some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;',
      'forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;',
      'map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];',
      'filter(callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any): T[];',
      'reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T;',
      'reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;',
      'reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T;',
      'reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;',

      // ES6
      'find(predicate: (value: T, index: number, obj: Array<T>) => boolean, thisArg?: any): T | undefined;',
      'findIndex(predicate: (value: T, index: number, obj: Array<T>) => boolean, thisArg?: any): number;',
      'fill(value: T, start?: number, end?: number): this;',
      'copyWithin(target: number, start: number, end?: number): this;',

    ],

    Date: [
      'toDateString(): string;',
      'toTimeString(): string;',
      'toLocaleString(): string;',
      'toLocaleDateString(): string;',
      'toLocaleTimeString(): string;',
      'getTime(): number;',
      'getFullYear(): number;',
      'getUTCFullYear(): number;',
      'getMonth(): number;',
      'getUTCMonth(): number;',
      'getDate(): number;',
      'getUTCDate(): number;',
      'getDay(): number;',
      'getUTCDay(): number;',
      'getHours(): number;',
      'getUTCHours(): number;',
      'getMinutes(): number;',
      'getUTCMinutes(): number;',
      'getSeconds(): number;',
      'getUTCSeconds(): number;',
      'getMilliseconds(): number;',
      'getUTCMilliseconds(): number;',
      'getTimezoneOffset(): number;',
      'setTime(time: number): number;',
      'setMilliseconds(ms: number): number;',
      'setUTCMilliseconds(ms: number): number;',
      'setSeconds(sec: number, ms?: number): number;',
      'setUTCSeconds(sec: number, ms?: number): number;',
      'setMinutes(min: number, sec?: number, ms?: number): number;',
      'setUTCMinutes(min: number, sec?: number, ms?: number): number;',
      'setHours(hours: number, min?: number, sec?: number, ms?: number): number;',
      'setUTCHours(hours: number, min?: number, sec?: number, ms?: number): number;',
      'setDate(date: number): number;',
      'setUTCDate(date: number): number;',
      'setMonth(month: number, date?: number): number;',
      'setUTCMonth(month: number, date?: number): number;',
      'setFullYear(year: number, month?: number, date?: number): number;',
      'setUTCFullYear(year: number, month?: number, date?: number): number;',
      'toUTCString(): string;',
      'toISOString(): string;',
      'toJSON(key?: any): string;',

      // ES6
      'toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;',
      'toLocaleDateString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;',
      'toLocaleTimeString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string;',

    ],

    String: [
      'charAt(pos: number): string;',
      'charCodeAt(index: number): number;',
      'concat(...strings: string[]): string;',
      'indexOf(searchString: string, position?: number): number;',
      'lastIndexOf(searchString: string, position?: number): number;',
      'localeCompare(that: string): number;',
      'match(regexp: string): RegExpMatchArray | null;',
      'match(regexp: RegExp): RegExpMatchArray | null;',
      'replace(searchValue: string, replaceValue: string): string;',
      'replace(searchValue: string, replacer: (substring: string, ...args: any[]) => string): string;',
      'replace(searchValue: RegExp, replaceValue: string): string;',
      'replace(searchValue: RegExp, replacer: (substring: string, ...args: any[]) => string): string;',
      'search(regexp: string): number;',
      'search(regexp: RegExp): number;',
      'slice(start?: number, end?: number): string;',
      'split(separator: string, limit?: number): string[];',
      'split(separator: RegExp, limit?: number): string[];',
      'substring(start: number, end?: number): string;',
      'toLowerCase(): string;',
      'toLocaleLowerCase(): string;',
      'toUpperCase(): string;',
      'toLocaleUpperCase(): string;',
      'trim(): string;',
      'substr(from: number, length?: number): string;',

      // ES6
      'localeCompare(that: string, locales?: string | string[], options?: Intl.CollatorOptions): number;',
      'codePointAt(pos: number): number | undefined;',
      'includes(searchString: string, position?: number): boolean;',
      'endsWith(searchString: string, endPosition?: number): boolean;',
      'normalize(form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;',
      'normalize(form?: string): string;',
      'repeat(count: number): string;',
      'startsWith(searchString: string, position?: number): boolean;',
      'anchor(name: string): string;',
      'big(): string;',
      'blink(): string;',
      'bold(): string;',
      'fixed(): string;',
      'fontcolor(color: string): string;',
      'fontsize(size: number): string;',
      'fontsize(size: string): string;',
      'italics(): string;',
      'link(url: string): string;',
      'small(): string;',
      'strike(): string;',
      'sub(): string;',
      'sup(): string;',
    ],

    Number: [
      'toFixed(fractionDigits?: number): string;',
      'toExponential(fractionDigits?: number): string;',
      'toPrecision(precision?: number): string;',

      // ES6
      'toLocaleString(locales?: string | string[], options?: Intl.NumberFormatOptions): string;',
    ],

    Function: [
      'apply(thisArg: any, argArray?: any): any;',
      'call(thisArg: any, ...argArray: any[]): any;',
      'bind(thisArg: any, ...argArray: any[]): any;',
    ],

    RegExp: [
      'exec(string: string): RegExpExecArray | null;',
      'test(string: string): boolean;',
    ]

  };

  var LOCALE_METHODS = [
    'getMonthName(n: number): string;',
    'getWeekdayName(n: number): string;',
    'getDuration(ms: number): string;',
    'getFirstDayOfWeek(): number;',
    'getFirstDayOfWeekYear(): number;',
    'addFormat(src:string, to?: Array<string>): void;'
  ];


  /* ------------ Declared Module -------------- */

  function getDeclaredModuleSource() {
    var body = [
      'const Sugar: sugarjs.Sugar;',
      'export = Sugar;'
    ].join('\n');
    return [
      'declare module "sugar" {',
        indent(body, 1),
      '}'
    ].join('\n');
  }

  /* ------------ Declared Namespace -------------- */

  function getDeclaredNamespace(name) {
    return {
      name: name,
      types: [],
      namespaces: [],
      interfaces: []
    }
  }

  function getDeclaredNamespaceSource(module, top) {
    var blocks = [];

    function addBlock(arr, sep, map) {
      if (arr.length) {
        arr = compact(arr);
        if (map) {
          arr = arr.map(map);
        }
        blocks.push(indent(arr.join(sep), 1));
      }
    }

    function mapType(type) {
      return 'type ' + type.name + (type.generics || '') + ' = ' + type.type + ';'
    }

    addBlock(module.types, '\n'.repeat(top ? 2 : 1), mapType);
    addBlock(module.interfaces, '\n\n');
    addBlock(module.namespaces, '\n\n');

    blocks.unshift((top ? 'declare ' : '') + 'namespace ' + module.name + ' {');
    blocks.push('}');
    return blocks.join('\n\n');
  }

  function getInterfaceBlocks(interfaces) {
    return interfaces.filter(function(interface) {
      return interface;
    }).join('\n\n');
  }

  /* ------------ Interfaces -------------- */

  function getConstructorInterface(namespace, module) {

    var methods = [];


    // Add the main chainable type.

    var chainableGenerics = getChainableBaseGenerics(namespace.name)
    var chainableType = 'ChainableBase' + chainableGenerics;

    if (namespace.name !== 'Object') {
      chainableType += ' & Object.ChainableBase' + getChainableBaseGenerics('Object');
    }
    module.types.push({
      name: 'Chainable' + chainableGenerics,
      type: chainableType
    });


    // Set up constructor methods.

    var rawType = getRawType(namespace.name);

    var constructorMethod = {
      name: 'new',
      type: 'constructor',
      module: namespace.name,
      generics: getNamespaceBaseGenerics(namespace.name),
      returns: 'Chainable' + getChainableInstanceGenerics(namespace.name),
      params: [{
        name: 'raw',
        type: rawType
      }]
    };

    var createMethod = namespace.methods.find(function(method) {
      return method.name === 'create';
    });

    if (createMethod) {
      // If the namespace has a "create" method, then it will be mapped
      // to the chainable constructor, so accomodate for that here.
      constructorMethod.params = createMethod.params;
      constructorMethod.params[0].required = false;
    }

    var factoryMethod = clone(constructorMethod);
    factoryMethod.name = '';

    methods.push(constructorMethod);
    methods.push(factoryMethod);


    // Set up all remaining methods.

    namespace.methods.forEach(function(method) {
      var instanceParam = {
        name: 'instance',
        required: true,
        type: getInstanceParamType(method, rawType)
      };
      var method = clone(method);
      if (method.type === 'instance') {
        method.params.unshift(instanceParam);
        if (method.signatures) {
          method.signatures.forEach(function(signature) {
            signature.unshift(instanceParam);
          });
        }
        if (namespace.name === 'Array') {
          method.generics = ['T'];
        }
      }
      methods.push(method);
    });

    methods = buildMethods(methods, namespace, 'static');
    return getInterfaceSource('Constructor', methods.join('\n'), null, 'SugarNamespace');
  }

  function getChainableBaseInterface(namespace) {
    var methods, existing = {};

    // Add native methods that are aliased onto the chainable prototype.
    methods = getRawMethods(CHAINABLE_NATIVE_METHODS[namespace.name], namespace.name, true);

    // Add all instance methods.
    namespace.methods.forEach(function(method) {
      if (method.type === 'instance') {
        existing[method.name] = true;
        methods.push(method);
      }
    });

    methods = buildMethods(methods, namespace, 'chainable');

    var chainableDefaults = [
      'raw: ' + CHAINABLE_RAW_TYPE + ';',
      'valueOf: () => ' + CHAINABLE_RAW_TYPE + ';',
      'toString: () => string;'
    ];

    var src = chainableDefaults.concat(methods).join('\n');
    return getInterfaceSource('ChainableBase', src, getChainableBaseGenerics(namespace.name));
  }

  function getExtendedConstructorInterface(namespace) {
    var methods = getExtendedMethods(namespace, 'static');

    // Add object instance methods as static, i.e.
    // Object.forEach, etc.
    if (namespace.name === 'Object') {
      var objectInstanceMethods = getExtendedMethods(namespace, 'instance');
      getExtendedMethods(namespace, 'instance').forEach(function(method) {
        var objectInstanceParam = {
          name: 'instance',
          type: getInstanceParamType(method, 'Object'),
          required: true
        };
        method = clone(method);
        method.params.unshift(objectInstanceParam);
        if (method.signatures) {
          method.signatures.forEach(function(signature) {
            signature.unshift(objectInstanceParam);
          });
        }
        methods.push(method);
      });
    }

    methods = buildMethods(methods, namespace, 'extended');
    return getInterfaceSource(namespace.name + 'Constructor', methods.join('\n'));
  }

  function getExtendedInstanceInterface(namespace) {
    var methods = buildMethods(getExtendedMethods(namespace, 'instance'), namespace, 'extended');
    var generics = getGenericSource(getNamespaceBaseGenerics(namespace.name));
    return getInterfaceSource(namespace.name, methods.join('\n'), generics);
  }

  function getExtendedMethods(namespace, findType) {
    return namespace.methods.filter(function(method) {
      return method.type === findType;
    });
  }

  function getSugarInterface(namespace, namespaces) {

    var extendAlias = clone(namespace.methods.find(function(method) {
      return method.name === 'extend';
    }));
    extendAlias.name = '';

    var methods;
    methods = [extendAlias].concat(namespace.methods);
    methods = buildMethods(methods, namespace, 'standard');

    namespaces = namespaces.filter(function(namespace) {
      return !namespace.name.match(/^Sugar/) && namespace.name !== 'Range';
    }).map(function(namespace) {
      return namespace.name + ': ' + namespace.name + '.Constructor;';
    });

    var src = [methods.join('\n'), namespaces.join('\n')].join('\n');
    return getInterfaceSource(namespace.name, src);
  }

  function getSugarNamespaceInterface(namespace) {
    methods = buildMethods(namespace.methods, namespace, 'namespace');
    return getInterfaceSource(namespace.name, methods.join('\n'));
  }

  function getRangeInterface(namespace) {
    var methods = buildMethods(namespace.methods, namespace, 'extended');
    return getInterfaceSource('Range', methods.join('\n'));
  }

  function getLocaleInterface(namespaces) {
    var namespace = namespaces.find(function(namespace) {
      return namespace.name === 'Date';
    });
    var methods = buildMethods(getRawMethods(LOCALE_METHODS, 'Date'), namespace);
    return getInterfaceSource('Locale', methods.join('\n'));
  }

  function getInterfaceSource(interfaceName, src, generics, ext) {
    if (!src) {
      return '';
    }
    ext = ext ? ' extends ' + ext : '';
    return [
      'interface ' + interfaceName + (generics || '') + ext + ' {',
        indent(src, 1),
      '}'
    ].join('\n');
  }

  /* ------------ Types -------------- */

  function getType(type, method) {
    var generics = [];
    switch (type) {
      case 'Array':
        type = 'T[]';
        generics.push('T');
        break;
      case 'New Array':
        type = 'U[]';
        generics.push('T');
        generics.push('U');
        break;
      case 'ArrayElement':
        type = 'T';
        generics.push('T');
        break;
      case 'Mixed':
        type = 'T';
        generics.push('T');
        break;
      case 'Property':
        type = 'T';
        generics.push('T');
        break;
      case 'NewArrayElement':
        type = 'U';
        generics.push('T');
        generics.push('U');
        break;
      case 'NewProperty':
        type = 'U';
        generics.push('T');
        generics.push('U');
        break;
      case 'RangeElement':
        type = 'T';
        generics.push('T');
        break;
      case 'String':
      case 'Number':
      case 'Boolean':
        type = type.toLowerCase();
        break;
    }
    if (method && generics) {
      addMethodGenerics(method, generics);
    }
    return type;
  }

  function getRawType(nativeName) {
    var type = nativeName;
    if (type && type.match(/^(string|number|boolean)$/i)) {
      type = type.toLowerCase();
    } else if (type === 'Array') {
      type = 'T[]';
    }
    return type;
  }

  /* ------------ Generics -------------- */

  function getNamespaceBaseGenerics(namespaceName) {
    var generics = [];
    if (namespaceName === 'Array') {
      generics.push('T');
    }
    return generics;
  }

  function getChainableBaseGenerics(namespaceName, wrappedGeneric, arrayGeneric) {
    var generics = [wrappedGeneric || CHAINABLE_RAW_TYPE];
    if (namespaceName === 'Array') {
      generics.unshift(arrayGeneric || 'T');
    }
    return getGenericSource(generics);
  }

  function getChainableInstanceGenerics(namespaceName) {
    return getChainableBaseGenerics(namespaceName, getType(namespaceName));
  }

  function getGenericSource(generic) {
    if (generic instanceof Array) {
      generic = getUniqueGenerics(generic).join(', ');
    }
    if (!generic) {
      return '';
    } else if (generic.charAt(0) !== '<') {
      return '<' + generic + '>';
    }
    return generic;
  }

  function getUniqueGenerics(generics) {
    var result = [];
    generics.forEach(function(g) {
      if (g === 'any' || result.indexOf(g) === -1) {
        result.push(g);
      }
    });
    return result;
  }

  function addMethodGenerics(method, generics) {
    generics = generics || [];
    if (typeof generics === 'string') {
      generics = [generics];
    }

    // Initialize generics array
    method.generics = method.generics || [];

    generics.forEach(function(g) {
      if (method.generics.indexOf(g) === -1) {
        method.generics.push(g);
      }
    });
  }

  /* ------------ Methods -------------- */

  function isTypeCheck(method) {
    return method.name.match(TYPE_REG);
  }

  function getInstanceParamType(method, type) {
    return isTypeCheck(method) ? 'any' : type;
  }

  function buildMethods(methods, namespace, mode) {
    methods.sort(collateMethods);
    methods = methods.map(function(method) {
      return getMethod(method, namespace, mode);
    });
    return compact(methods);
  }

  function getParams(params, method, namespace, mode) {
    var result = [];

    function getFunctionSource(obj) {
      var returns = getReturns(obj.returns, method, namespace, mode);
      return '('+  getParams(obj.params, method, namespace, mode) +') => ' + returns;
    }

    (params || []).forEach(function(param, i) {
      if (param.glob) {
        for (var j = i - 1, p; j >= 0; j--) {
          p = params[j];
          if (p.name.match(/\d$/)) {
            result.splice(j, 1);
          }
        }
        result.push('...args: any[]');
      } else {
        var src = param.name + (param.required ? '' : '?') + ': ';
        if (param.params) {
          src += getFunctionSource(param);
        } else {
          src += (param.type || '').split('|').map(function(type) {
            type = getType(type, method) || 'undefined';
            if (type.match(/Fn$/)) {
              var callback = method.callbacks.find(function(callback) {
                return callback.name === type;
              });
              if (param.type.indexOf('|') === -1) {
                // If a callback is the ONLY type allowed for this parameter
                // (no alternates), then it can be inlined directly into the
                // definition, so do that here. Otherwise it needs to be moved
                // out into a named type and referenced.
                type = getFunctionSource(callback);
              } else {
                if (mode === 'extended') {
                  // If we are in extended mode and referencing a callback interface,
                  // then it needs to have its fully qualified namespace.
                  type = ['sugarjs', namespace.name, type].join('.');
                }
                var generics = moduleCallbackGenerics[namespace.name + ':' + callback.name];
                if (generics) {
                  addMethodGenerics(method, generics);
                  type += getGenericSource(generics);
                }
              }
            } else if (type.match(/Options$/)) {
              var optionsNamespace = optionInterfaceNamespaces[type];
              var generics = moduleOptionsGenerics[namespace.name + ':' + type];
              type += getGenericSource(generics);
              addMethodGenerics(method, generics);
              if (mode === 'extended') {
                // If we are in extended mode and referencing an options inteface,
                // then it needs to have its fully qualified namespace.
                type = ['sugarjs', optionsNamespace, type].join('.');
              } else if (optionsNamespace && optionsNamespace !== namespace.name) {
                // Options interfaces can be referenced across namespaces, so
                // qualify them when necessary.
                type = [optionsNamespace, type].join('.');
              }
            } else if (mode === 'extended' && (type === 'Range' || type === 'Locale')) {
              // Ranges exist inside the sugarjs module, so qualify them
              // as well when beind referenced in extended mode.
              type = ['sugarjs', type].join('.');
            }
            return type;
          }).join('|');
        }
        result.push(src);
      }
    });
    return result.join(', ');
  }

  function getReturns(returns, method, namespace, mode) {

    function referencesExternal(src) {
      return mode === 'extended' &&
             (src === 'Range' || src === 'Locale');
    }

    function requiresTypeGuard() {
      return isTypeCheck(method) &&
             (mode === 'static' || mode === 'extended');
    }

    function getTypeGuard(type) {
      if (type.match(/^String|Number|Boolean$/)) {
        type = type.toLowerCase();
      }
      return 'instance is ' + type;
    }

    var src = getType(returns, method) || 'void', match;
    if (src === 'SugarNamespace' && mode === 'constructor') {
      src = 'Sugar' + namespace.name + 'Constructor';
    } else if (src === 'SugarNamespace' && mode === 'namespace') {
      src = 'this';
    } else if (referencesExternal(src)) {
      src = ['sugarjs', src].join('.');
    } else if (mode === 'chainable') {
      src = 'SugarDefaultChainable<' + src + '>';
    } else if (requiresTypeGuard()) {
      var type = method.name.replace(/^is/, '');
      var generics = TYPE_GUARD_GENERICS[type];
      if (generics) {
        type += getGenericSource(generics);
      }
      src = getTypeGuard(type);
    } else if ((match = src.match(/Array<(.+)>/))) {
      src = 'Array<' + getReturns(match[1], method, namespace, mode) + '>';
    }
    return src;
  }

  function getMethod(method, namespace, mode) {

    if (methodIsBlacklisted(namespace.name, method)) {
      return;
    }

    if (method.raw) {
      return method.raw;
    }

    function getSignature(signature, returns) {
      var params = getParams(signature, method, namespace, mode);
      var generics = getMethodGenerics();
      return method.name + generics + '(' +  params + '): ' + returns + ';';
    }

    function getMethodGenerics() {
      var generics = method.generics;
      if (mode !== 'static' && method.type === 'instance' && namespace.name === 'Array') {
        generics = generics.filter(function(g) {
          return g !== 'T';
        });
      }
      return getGenericSource(generics);
    }

    var returns = getReturns(method.returns, method, namespace, mode);

    return [method.params].concat(method.signatures || []).map(function(signature) {
      return getSignature(signature, returns);
    }).join('\n');

  }

  function getRawMethods(methods, module, nativeChainable) {
    return (methods || []).map(function(src) {
      var match = src.match(/(\w+)(<.+>)?\((.*)\): (.+);$/);
      var name = match[1];
      var generic = match[2] || src.match(/\bU\b/) ? '<U>' : '';
      var returns = match[4];
      if (nativeChainable) {
        returns = 'SugarDefaultChainable<' + returns + '>';
      }
      var raw = name + generic + '(' + match[3] + '): '+ returns + ';';
      return {
        raw: raw,
        name: name,
        module: module,
        native: nativeChainable
      }
    });
  }

  /* ------------ Sorting -------------- */

  function collateNamespaces(a, b) {
    if (a.name === 'Sugar') {
      return -1;
    } else if (b.name === 'Sugar') {
      return 1;
    }
    return 0;
  }

  function collateMethods(a, b) {
    var aVal = getMethodCollateValue(a);
    var bVal = getMethodCollateValue(b);
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  }

  function getMethodCollateValue(method) {
    return getMethodRankForType(method) + method.name;
  }

  function getMethodRankForType(method) {
    switch (method.type) {
      case 'constructor': return 0;
      case 'namespace':   return 1;
      case 'static':      return 2;
      case 'instance':    return 3;
      case 'accessor':    return 4;
      default:            return 5;
    }
  }

  /* ------------ Util -------------- */

  function indent(str, level) {
    return str.replace(/^(?=.)/gm, '  '.repeat(level));
  }

  function clone(src) {
    var target = src instanceof Array ? [] : {};
    for (var key in src) {
      if(src.hasOwnProperty(key)) {
        var val = src[key];
        if (val && typeof val === 'object') {
          val = clone(val);
        }
        target[key] = val;
      }
    };
    return target;
  }

  // Expands method sets and merges declaration supplements.
  function unpackMethodSets(methods) {
    var result = [];

    methods.forEach(function(method) {
      if (method.set) {
        method.set.forEach(function(name) {
          var setMethod = clone(method);
          setMethod.name = name;
          result.push(setMethod);
        });
      } else {
        result.push(method);
      }
    });
    return result;
  }

  /* ------------ Options -------------- */

  function getMethodList(obj) {
    var arr = obj && typeof obj === 'string' ? [obj] : obj, list;
    if (arr) {
      list = {};
      arr.forEach(function(item) {
        list[item.toLowerCase()] = true;
      });
    }
    return list;
  }

  function methodIsBlacklisted(namespaceName, method) {
    var key;

    // Normalize
    namespaceName = namespaceName.toLowerCase();
    moduleName    = method.module.toLowerCase();
    methodName    = method.name.toLowerCase();

    key = namespaceName + ':' + methodName;

    if (namespaceName && namespaceName.match(/^sugar/) || method.native) {
      // Core methods are always output
      return false;
    }
    if (moduleIsBlacklisted(moduleName)) {
      return true;
    }
    if (whitelist && !whitelist[namespaceName] && !whitelist[key]) {
      return true;
    }
    if (blacklist && (blacklist[namespaceName] || blacklist[key])) {
      return true;
    }
    return false;
  }

  function moduleIsBlacklisted(moduleName) {
    if (allowedModules === 'all') {
      return false;
    } else if (allowedModules === 'none') {
      return true;
    }
    return !allowedModules.some(function(name) {
      return name.toLowerCase() === moduleName.toLowerCase();
    });
  }

  /* ------------ Exporting -------------- */

  function exportDeclarations() {

    var docs = getJSONDocs();
    var sugarjs = getDeclaredNamespace('sugarjs');

    var extendedInterfaces = [], nativeNames = [];

    function getNamespaceTypesMerged(num, suffixVal, join, supplementary) {
      var types = nativeNames.concat(supplementary || []);
      var indent = ' '.repeat(num);
      return types.map(function(type) {
        var suffix = typeof suffixVal === 'function' ? suffixVal(type) : suffixVal;
        return type + suffix;
      }).join(' ' + join + '\n' + indent);
    }

    function getChainableNameExternal(type) {
      return '.Chainable' + getChainableBaseGenerics(type, CHAINABLE_RAW_TYPE, 'any');
    }

    function writeDeclarations(filename, declarations) {
      declarations = compact(declarations);
      var hasNoDeclarations = declarations.every(function(dec) {
        return /^\/\//.test(dec);
      });
      if (hasNoDeclarations) {
        return;
      }
      writeFile(path.join(basePath || '', filename), compact(declarations).join('\n\n'));
    }

    sugarjs.interfaces.push(getLocaleInterface(docs.namespaces));

    // Sort namespaces for Sugar to come before SugarNamespace
    // as it has ExtendOptions which are defined first.
    docs.namespaces.sort(collateNamespaces);

    docs.namespaces.forEach(function(namespace) {

      function addExtras(module) {
        addCallbackTypes(module);
        addOptionsInterfaces(module);
      }

      function addCallbackTypes(module) {

        // If the param has multiple types, then move callbacks into the
        // module as named types. Only do this if there are multiple
        // types, otherwise the callback signature can be inlined into
        // the method declaration.
        function getAlternateTypes(method) {
          var types = [];

          function process(arr) {
            if (arr) {
              arr.forEach(function(obj) {
                if (obj.type) {
                  var split = obj.type.split('|');
                  if (split.length > 1) {
                    types = types.concat(split);
                  }
                }
              });
            }
          }

          process(method.params);
          process(method.options);

          return types;
        }

        function addModuleCallbackType(method, callback) {
          var typeExists = module.types.some(function(t) {
            return t.name === callback.name;
          });
          if (!typeExists) {
            var signature = getCallbackSignature(callback, method, namespace);
            if (method.generics) {
              moduleCallbackGenerics[namespace.name + ':' + callback.name] = method.generics;
            }
            module.types.push({
              name: callback.name,
              generics: getGenericSource(callback.generics),
              type: signature
            });
          }
        }

        namespace.methods.forEach(function(method) {
          if (!method.callbacks || methodIsBlacklisted(namespace.name, method)) {
            return;
          }
          getAlternateTypes(method).forEach(function(type) {
            if (type.match(/Fn$/)) {
              var callback = findMethodCallbackByName(method, type);
              addModuleCallbackType(method, callback);
            }
          });
        });

      }

      function addOptionsInterfaces(module) {
        namespace.methods.forEach(function(method) {
          if (!method.options || methodIsBlacklisted(namespace.name, method)) {
            return;
          }

          var params = method.params;
          (method.signatures || []).forEach(function(signature) {
            params = params.concat(signature);
          })

          var optionsParam = params.find(function(param) {
            return param.type.match(/Options$/);
          });

          var optionsGenerics = [];

          var src = method.options.map(function(option) {
            var types = option.type.split('|');
            types = types.map(function(type) {
              if (type.match(/Fn$/)) {
                var callback = findMethodCallbackByName(method, type);
                if (types.length === 1 && type.match(/Fn$/)) {
                  // Inline a callback delcaration
                  type = getCallbackSignature(callback, method, namespace);
                } else {
                  // Refer to callback externally
                  type += getGenericSource(moduleCallbackGenerics[namespace.name + ':' + callback.name]);
                }
                optionsGenerics = optionsGenerics.concat(callback.generics);
              }
              return type;
            });
            return option.name + (option.required ? '' : '?') + ': ' + types.join('|') + ';';
          }).join('\n');

          // Store references to the namespaces that option interfaces exist in
          // so that we can reference them externally later.
          if (!namespace.name.match(/^Sugar/)) {
            optionInterfaceNamespaces[optionsParam.type] = namespace.name;
          }

          moduleOptionsGenerics[namespace.name + ':' + optionsParam.type] = optionsGenerics;
          var name = optionsParam.type + getGenericSource(optionsGenerics);
          module.interfaces.push(getInterfaceSource(name, src));
        });
      }

      function getCallbackSignature(callback, method, namespace) {
        var genericsLength = method.generic && method.generics.length || 0, gen;
        var params = getParams(callback.params, method, namespace);
        var returns = callback.returns ? getType(callback.returns, method) : 'void';
        // Slightly convoluted way of getting generics for the callback by
        // subtracting method generics from what they were previously.
        callback.generics = method.generics.slice(genericsLength);
        return '(' + params + ') => ' + returns;
      }

      function findMethodCallbackByName(method, name) {
        return method.callbacks.find(function(callback) {
          return callback.name === name;
        });
      }


      // Exclude polyfills
      namespace.methods = namespace.methods.filter(function(method) {
        return !method.module.match(/ES[5-7]/);
      });

      // Unpack sets like "[unit]FromNow"
      namespace.methods = unpackMethodSets(namespace.methods);

      if (namespace.name === 'Sugar') {
        addExtras(sugarjs);
        sugarjs.interfaces.push(getSugarInterface(namespace, docs.namespaces));
      } else if (namespace.name === 'SugarNamespace') {
        // The generic "SugarNamespace" interface is required for the
        // "createNamespace" method that needs to return an as-yet undefined
        // type. For existing namespaces, the methods here will instead be
        // mixed into each individual interface. This is required, as each
        // namespace returns a reference to itself, and so (it would appear)
        // cannot use extend.
        addExtras(sugarjs);
        sugarjs.interfaces.push(getSugarNamespaceInterface(namespace));
      } else if (namespace.name === 'Range') {
        sugarjs.interfaces.push(getRangeInterface(namespace));
      } else {
        var module = getDeclaredNamespace(namespace.name);
        addExtras(module);
        module.interfaces.push(getConstructorInterface(namespace, module));
        module.interfaces.push(getChainableBaseInterface(namespace));


        // Export extended interfaces unless opting out.
        if (args['extended-mode'] !== false) {
          extendedInterfaces.push(getExtendedConstructorInterface(namespace));

          // Note: due to Typescript quirkiness about incompatible interfaces,
          // Object.prototype mode cannot be supported here for now.
          if (namespace.name !== 'Object') {
            extendedInterfaces.push(getExtendedInstanceInterface(namespace));
          }
        }

        sugarjs.namespaces.push(getDeclaredNamespaceSource(module));
        nativeNames.push(namespace.name);
      }

    });

    var wrappedGeneric = getGenericSource(CHAINABLE_RAW_TYPE);
    sugarjs.types.push({
      name: 'SugarDefaultChainable' + wrappedGeneric,
      type: getNamespaceTypesMerged(39, getChainableNameExternal, '&'),
    });

    sugarjs.types.push({
      name: 'NativeConstructor',
      type: getNamespaceTypesMerged(25, 'Constructor', '|', ['Boolean', 'Error']),
    });


    var baseDeclarations = [];
    baseDeclarations.push(TS_LICENSE);
    baseDeclarations.push(getDeclaredNamespaceSource(sugarjs, true));
    baseDeclarations.push(getDeclaredModuleSource());
    baseDeclarations.push('declare var Sugar: sugarjs.Sugar;');

    var extendedDeclarations = [];
    extendedDeclarations.push(TS_EXTENDED_LICENSE);
    extendedDeclarations.push('/// <reference path="sugar.d.ts" />');
    extendedDeclarations.push(getInterfaceBlocks(extendedInterfaces));

    writeDeclarations('sugar.d.ts', baseDeclarations);
    writeDeclarations('sugar-extended.d.ts', extendedDeclarations);
  }

  exportDeclarations();
}

// -------------- Tests ----------------

function testWatch(runTests, rebuildDist, rebuildMod) {

  function attemptTestRun() {
    try {
      runTests();
    } catch (e) {
      warn(e.stack, true);
    }
  }
  args.skipBuildResults = true;

  gulp.watch(['lib/**/*.js'], function() {
    var stream = getEmptyStream();
    notify('Rebuilding');
    if (rebuildDist) {
      addStream(stream, buildDevelopment());
    }
    if (rebuildMod) {
      addStream(stream, buildPackages('modular', true));
    }
    onStreamEnd(stream, function() {
      attemptTestRun();
      notify('Waiting');
    });
  });

  gulp.watch(['test/**/*.js'], function() {
    notify('Reloading tests');
    attemptTestRun();
    notify('Waiting');
  });

  setTimeout(function() {
    notify('Waiting');
  });

}

function testRunDefault() {
  var path = './test/node';
  if (args.test) {
    path += '/' + args.test;
  }
  notify('Running tests');
  require(path);
}

function testRunNpm() {
  notify('Running npm tests');
  require('./test/node/npm');
}

function testRunAll() {
  notify('Running all tests');
  require('./test/node/all');
}

function testWatchDefault() {
  testWatch(testRunDefault, true);
}

function testWatchNpm() {
  testWatch(testRunNpm, false, true);
}

function testWatchAll() {
  testWatch(testRunAll, true, true);
}
