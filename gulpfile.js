
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
gulp.task('more',    showMore);

gulp.task('build',       buildDefault);
gulp.task('build:dev',   buildDevelopment);
gulp.task('build:min',   buildMinified);
gulp.task('build:qml',   buildQml);
gulp.task('build:clean', buildClean);

gulp.task('build:npm',       buildNpmDefault);
gulp.task('build:npm:core',  buildNpmCore);
gulp.task('build:npm:all',   buildNpmAll);
gulp.task('build:npm:clean', buildNpmClean);

gulp.task('build:bower',       buildBowerDefault);
gulp.task('build:bower:clean', buildBowerClean);
gulp.task('build:bower:core',  buildBowerCore);
gulp.task('build:bower:all',   buildBowerAll);

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


// -------------- Help ----------------

var MESSAGE_TASKS = `

     # Usage

       |gulp| [TASK] [OPTIONS]

     # Tasks

       |build|                          Create development and minified build.
       |build:dev|                      Create development build (concatenate files only).
       |build:min|                      Create minified build (closure compiler).

       |build:npm|                      Builds modularized npm packages ("sugar" by default).
       |build:npm:core|                 Builds "sugar-core" npm package.
       |build:npm:all|                  Builds all npm packages (slow).
       |build:npm:clean|                Cleans npm package output directory ("release/npm" by default).

       |build:bower|                    Builds bower packages (none by default).
       |build:bower:all|                Builds all bower packages (slow).
       |build:bower:clean|              Cleans bower package output directory ("release/bower" by default).

       |build:qml|                      Creates a QML compatible build.

       |build:release|                  Create a release. Requires a version.

       |test|                           Run tests against distributed build (build:dev).
       |test:npm|                       Run tests against npm packages (build:npm:all).
       |test:all|                       Run tests against distributed and npm (build:dev, build:npm:all).

       |test:watch|                     Watch for changes and run "test".
       |test:watch:npm|                 Watch for changes and run "test:npm".
       |test:watch:all|                 Watch for changes and run "test:all".

       |json:api|                       Builds API method list as JSON.
       |json:docs|                      Builds full docs set as JSON.
       |json:source|                    Builds modularized source as JSON.

       |more|                           Show more help details.

     # Options

       |-m, --modules|                  Comma separated modules to include (dev/min tasks).
                                        Run "gulp more" for modules (non-default marked with *).

       |-l, --locales|                  Comma separated date locales to include (dev/min tasks).
                                        Run "gulp more" for locales. English packaged with date module.

       |-p, --packages|                 Comma separated packages to build (npm/bower tasks).
                                        Run "gulp more" for packages.

       |-o, --output|                   Build output path (default is "sugar.js" or "sugar.min.js").
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

// -------------- Release ----------------

function buildRelease() {
  var version = getVersion(), run = true;
  if (!version.match(/^\d.\d+\.\d+$/)) {
    warn('Release requires a valid x.x.x version!');
    run = false;
  }
  if (typeof args.b !== 'string') {
    warn('Release requires an explicit bower output directory (use -b).');
    run = false;
  }
  if (!run) process.exit();
  return mergeStreams([
    buildDevelopment(),
    buildMinified(),
    buildBowerAll(),
    buildNpmAll()
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

function buildClean() {
  buildNpmClean();
  buildBowerClean();
}

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

function createDevelopmentBuild(outputPath, moduleNames, localeCodes) {

  var concat  = require('gulp-concat-util');
  var replace = require('gulp-replace');

  var filename = outputPath || getBuildPath();
  var wrapper  = getWrapper(args.qml);

  var modules = getModules(moduleNames);
  var locales = getLocales(localeCodes);

  return gulp.src(modules.concat(locales))
    .pipe(concat(path.basename(filename), { newLine: '' }))
    .pipe(replace(/^'use strict';\n/gm, ''))
    .pipe(replace(/^(?=.)/gm, '  '))
    .pipe(replace(/^([\s\S]+)$/m, wrapper))
    .pipe(replace(/edge/, getVersion()))
    .pipe(gulp.dest(path.dirname(filename)));
}

function createMinifiedBuild(outputPath, moduleNames, localeCodes) {

  var filename = outputPath || getBuildPath(true);

  var modules = getModules(moduleNames);
  var locales = getLocales(localeCodes);

  try {
    fs.lstatSync(COMPILER_JAR_PATH);
  } catch(e) {
    gutil.log(gutil.colors.red('Closure compiler missing!'), 'Run', gutil.colors.yellow('bower install'));
    return;
  }
  return gulp.src(modules.concat(locales))
    .pipe(compileSingle(filename))
    .pipe(through.obj(function(file, enc, cb) {
      setTimeout(function() {
        // Extremely hacky way of replacing the version in the compiler output
        // due to the fact that closure-compiler-stream doesn't return a reference
        // to the final writeStream.
        writeFile(file.path, readFile(file.path).replace(/edge/, getVersion()));
      }, 100);
      cb();
    }));
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
  var ver = args.v || args.version || 'edge', hasCustomModules, hasCustomLocales;
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

  var names = (m || args.m || args.modules || 'default').split(',');

  function alias(name, modules) {
    var index = names.indexOf(name);
    if (index !== -1) {
      names.splice.apply(names, [index, 1].concat(modules));
    }
  }

  alias('all', ALL_MODULES);
  alias('default', DEFAULT_MODULES);

  if (args.es5) {
    names.unshift('es5');
  }

  if (args.polyfills === false) {
    names = names.filter(function(n) {
      return !n.match(/^es[567]$/);
    });
  }
  return names;
}

function getModules(m) {

  var names = getModuleNames(m);

  function getPath(name) {
    return path.join('lib', name.toLowerCase() + '.js');
  }

  names.forEach(function(n) {
    try {
      fs.lstatSync(getPath(n));
    } catch(e) {
      warn('Cannot find module ' + n + '!');
      warn('Exiting...');
      process.exit();
    }
  });

  if (!names.length || names[0] !== 'core') {
    names.unshift('common');
  }
  names.unshift('core');
  return uniq(names).map(getPath);
}

function getLocaleCodes(l) {
  var names = typeof l === 'string' ? l : args.l || args.locales;
  if (names === 'all') {
    names = getAllLocales().map(function(p) {
      return p.match(/([\w-]+)\.js/)[1];
    });
  } else if (names) {
    names = names.split(',');
  }
  return names || [];
}

function getLocales(l) {

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
    bower: false, // Same as main repo
    modules: 'ES6,ES7,String,Number,Array,Enumerable,Object,Date,Locales,Range,Function,RegExp',
    description: 'This build includes default Sugar modules and optional date locales.'
  },
  'sugar-core': {
    modules: 'Core',
    description: 'This build is the core module, which allows custom methods to be defined and extended later.'
  },
  'sugar-es5': {
    modules: 'ES5',
    description: 'This build includes all ES5 polyfills not included in the default build.'
  },
  'sugar-es6': {
    modules: 'ES6',
    description: 'This build includes all ES6 polyfills bundled with Sugar. Currently this is String#includes, String#startsWith, String#endsWith, String#repeat, Number.isNaN, Array#find, Array#findIndex, and Array.from.'
  },
  'sugar-es7': {
    modules: 'ES7',
    description: 'This build includes all ES7 polyfills bundled with Sugar. Currently this is only Array#includes.'
  },
  'sugar-string': {
    modules: 'ES6,String,Range',
    description: 'This build includes methods for string manipulation, escaping, encoding, truncation, and conversion.'
  },
  'sugar-number': {
    modules: 'ES6,Number,Range',
    description: 'This build includes methods for number formatting, rounding (with precision), and aliases to Math methods.'
  },
  'sugar-enumerable': {
    modules: 'ES6,ES7,Enumerable',
    description: 'This build includes methods common to arrays and objects, such as matching elements/properties, mapping, counting, and averaging. Also included are polyfills for methods that enhance arrays: Array#find, Array#findIndex, Array#includes.'
  },
  'sugar-array': {
    modules: 'ES6,ES7,Array',
    description: 'This build includes methods for array manipulation, grouping, randomizing, and alphanumeric sorting and collation.'
  },
  'sugar-object': {
    modules: 'Object',
    description: 'This build includes methods for object creation, manipulation, comparison, and type checking. Note that Object.prototype is not extended by default. See the README for more.'
  },
  'sugar-date': {
    modules: 'Date,Locales,Range',
    description: 'This build includes methods for date parsing and formatting, relative formats like "1 minute ago", number methods like "daysAgo", and optional date locales.'
  },
  'sugar-range': {
    modules: 'Range',
    description: 'This build includes number, string, and date ranges. Ranges can be iterated over, compared, and manipulated.'
  },
  'sugar-function': {
    modules: 'Function',
    description: 'This build includes methods for lazy, throttled, and memoized functions, delayed functions, timers, and argument currying.'
  },
  'sugar-regexp': {
    modules: 'RegExp',
    description: 'This build includes methods for escaping regexes and manipulating their flags.'
  },
  'sugar-inflections': {
    modules: 'Inflections',
    description: 'This build includes methods for pluralization similar to ActiveSupport including uncountable words and acronyms, humanized and URL-friendly strings.'
  },
  'sugar-language': {
    modules: 'Language',
    description: 'This build includes helpers for detecting language by character block, full-width <-> half-width character conversion, and Hiragana and Katakana conversions.'
  }
};

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

function copyPackageMeta(packageDir) {

  function copyMeta(srcPath) {
    writeFile(path.join(packageDir, path.basename(srcPath)), readFile(srcPath));
  }

  copyMeta('LICENSE');
  copyMeta('README.md');
  copyMeta('CHANGELOG.md');
  copyMeta('CAUTION.md');
}

function copyLocales(l, dir) {
  mkdirp.sync(dir);
  getLocales(l).forEach(function(src) {
    writeFile(path.join(dir, path.basename(src)), readFile(src));
  });
}

function buildPackageDist(packageName, packageDir) {

  var definition = getPackageDefinition(packageName);

  function write(modules) {
    var stream = getEmptyStream();
    var devFilename = path.join(packageDir, getDistFilename(packageName));
    var minFilename = path.join(packageDir, getDistFilename(packageName, true));
    addStream(stream, createDevelopmentBuild(devFilename, modules, ''));
    addStream(stream, createMinifiedBuild(minFilename, modules, ''));
    return stream;
  }

  function getFilteredModules(modules) {
    return modules.split(',').filter(function(m) {
      if (m === 'Locales') {
        copyLocales('all', path.join(packageDir, 'locales'));
        return false;
      }
      return true;
    }).join(',');
  }

  return write(getFilteredModules(definition.modules));
}

function getDistFilename(packageName, min) {
  return packageName + (min ? '.min' : '') + '.js';
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

function getKeywords(name, keywords) {
  if (name !== 'sugar' && name !== 'sugar-date') {
    keywords = keywords.filter(function(k) {
      return k !== 'date' && k !== 'time';
    });
  }
  return keywords;
}

function exportPackageJson(packageName, packageDir) {

  var def = getPackageDefinition(packageName);
  var json = JSON.parse(JSON.stringify(require('./package.json')));
  json.version = getVersion();
  json.name = packageName;
  json.keywords = getKeywords(packageName, json.keywords);
  json.description += ' ' + def.description;
  delete json.files;
  delete json.scripts;
  delete json.devDependencies;

  // Add sugar-core as a dependency
  if (packageName === 'sugar-core') {
    json.main = 'sugar-core.js';
  } else {
    json.main = 'index.js';
    json.dependencies = {
      'sugar-core': '^' + json.version
    };
  }
  writeFile(path.join(packageDir, 'package.json'), JSON.stringify(json, null, 2));
}

function exportBowerJson(packageName, packageDir) {
  var def = getPackageDefinition(packageName);
  var json = JSON.parse(JSON.stringify(require('./bower.json')));
  json.name = packageName;
  json.main = packageName + '.js';
  // Bower throws a warning if "ignore" isn't defined.
  json.ignore = [];
  json.keywords = getKeywords(packageName, json.keywords);
  json.description += ' ' + def.description;
  delete json.devDependencies;
  writeFile(path.join(packageDir, 'bower.json'), JSON.stringify(json, null, 2));
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
    setupCachedFind('findByDependentPackage', findByDependentPackage);
    setupCachedFind('findByDependencyName', findByDependencyName);
  }

  function setupCachedFind(methodName, fn) {
    var cache = {};
    sourcePackages[methodName] = function(obj) {
      var token = getTokenForObject(obj);
      if (token in cache) {
        return cache[token];
      }
      return cache[token] = this.find(function(p) {
        return fn(p, obj);
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

  function findByDependentPackage(p, ap) {
    if (ap.type === 'locale') {
      return p.namespace === 'Date' && p.name === 'addLocale';
    } else if (ap.type === 'alias') {
      return p.name === ap.alias && p.module === ap.module && p.namespace === ap.namespace;
    }
  }

  function findByDependencyName(p, dependencyName) {
    return p.name === dependencyName && sourcePackageIsDependency(p);
  }

  function sourcePackageIsDependency(p) {
    return p.type === 'var' || p.type === 'build' || p.type === 'internal';
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

      if (sp.comments && type !== 'alias') {
        // Method comments are indented by 3, so just a hack to
        // make sure the resulting source is the same.
        sp.comments = '  ' + sp.comments;
        sp.bodyWithComments = '  ' + sp.bodyWithComments;
      }
    }

    function addSugarBuiltMethod(name, buildFn, type, opts) {
      var sp = addSourcePackage(name, buildFn.node, type, opts);

      sp.namespace    = getNamespaceForNode(buildFn.node);
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
          if (!comment.text.match(/@(module|namespace)/)) {
            return '\/*' + comment.text + '*\/';
          }
        }
      }
      return '';
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
            static: /@static/.test(block)
          };
          var setMatch = block.match(/@set([^@\/]+)/);
          if (setMatch) {
            methodBlock.set = setMatch[1].replace(/^[\s*]*|[\s*]*$/g, '').replace(/[\s*]+/g, ',').split(',');
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
             !!node.expression.callee.name.match(/^define(Static|Instance(AndStatic)?)(WithArguments)?$/);
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

    function processFunctionDeclaration(node) {
      addSourcePackage(node.id.name, node, 'internal');
    }

    function processVariableDeclaration(node) {
      addVarPackage(node);
    }

    function processMethodBlock(node) {
      processDefineBlock(node, 'method');
    }

    function processPolyfillBlock(node) {
      processDefineBlock(node, 'polyfill');
    }

    // Define block example: defineInstance(sugarDate, { ... }, [FLAG]);
    function processDefineBlock(node, type) {
      var defineMethod, sugarNamespace, methods, deps = [], opts = {};

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

      deps.push(defineMethod);
      deps.push(sugarNamespace);

      opts.defineMethod = defineMethod;
      opts.blockStart   = defineMethod + '(' + sugarNamespace + ', {';
      opts.blockEnd     = getBlockEnd();
      opts.static       = /static/i.test(defineMethod);

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
      opts.static     = /static/i.test(defineMethod);

      methods.forEach(function(node) {
        addSugarMethod(node.key.value, node, 'prototype', deps, opts);
      });
    }

    function processAliasExpression(node) {
      var methodName, aliasedMethod, opts = {};

      methodName     = node.expression.arguments[1].value;
      aliasedMethod  = node.expression.arguments[2].value;

      opts.alias = aliasedMethod;
      opts.methodDependencies = [aliasedMethod];
      opts.static = getMethodBlocksInPreviousComment(node)[0].static;

      addSugarMethod(methodName, node, 'alias', [], opts);
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
        var opts = {}, methodBlocks, hasPrototypeBlock, type;

        methodBlocks = getMethodBlocksInPreviousComment(fnPackage.node);

        fnPackage.node.body.body.some(function(node) {
          if (isPrototypeBlock(node)) {
            hasPrototypeBlock = true;
            opts.target = node.expression.arguments[0].name;
          }
          return hasPrototypeBlock;
        });

        // If the build method has "defineOnPrototype", then the methods are
        // directly defined on the prototype (Range, etc), otherwise they are
        // standard Sugar method defines.
        type = hasPrototypeBlock ? 'prototype' : 'method';

        methodBlocks.forEach(function(block) {
          opts.static = block.static;
          if (block.set) {
            opts.set     = block.set;
            opts.setName = block.name;
            block.set.forEach(function(methodName) {
              addSugarBuiltMethod(methodName, fnPackage, type, opts);
            });
          } else {
            delete opts.set;
            delete opts.setName;
            addSugarBuiltMethod(block.name, fnPackage, type, opts);
          }

        });
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

// -------------- npm ----------------

function buildNpmClean() {
  cleanDir(args.o || args.output || 'release/npm');
}

function buildNpmDefault() {
  return buildNpmPackages(args.p || args.packages || 'sugar');
}

function buildNpmCore() {
  return buildNpmPackages('sugar-core');
}

function buildNpmAll() {
  return buildNpmPackages('all');
}

function buildNpmPackages(p, rebuild) {

  var PUBLIC_TYPES = ['method', 'polyfill', 'prototype', 'locale', 'alias', 'fix'];

  var sourcePackages;
  var baseDir = args.o || args.output || 'release/npm';
  var stream = getEmptyStream();

  buildAllPackages(p);

  function buildAllPackages() {
    getPackageNames(p).forEach(buildPackage);
  }

  function buildPackage(packageName) {
    var packageDir = path.join(baseDir, packageName), isModular;

    isModular = packageName !== 'sugar-core';

    if (isModular && !sourcePackages) {
      notify('Getting source packages');
      sourcePackages = getModularSource().packages;
      mergeMethodDependencies();
      bundleCircularDependencies();
    }

    notify('Building npm ' + packageName);

    if (isModular) {
      buildModularPackage(packageName, packageDir);
    }

    if (!rebuild) {
      var distDir = isModular ? path.join(packageDir, 'dist') : packageDir;
      addStream(stream, buildPackageDist(packageName, distDir));
      exportPackageJson(packageName, packageDir);
      copyPackageMeta(packageDir);
    }

  }

  function buildModularPackage(packageName, packageDir) {

    var TAB = '  ';
    var DTAB = TAB + TAB;
    var STRICT = "'use strict';";
    var DIRECT_REQUIRES_REG = /(Call|Fix)$/;

    exportAllModules();

    // --- Exporting ---

    function exportAllModules() {
      var def = getPackageDefinition(packageName);
      var moduleNames = def.modules.split(',');
      moduleNames.forEach(function(m) {
        exportModule(m);
      });
      createEntryPoint(moduleNames.map(function(m) {
        return './' + m.toLowerCase();
      }));
    }

    function exportModule(moduleName) {
      var dependencies = [], methodPaths = [], moduleLower = moduleName.toLowerCase();

      exportPublicPackages();
      exportDependencies();
      createEntryPoint(methodPaths, moduleLower);

      function exportPublicPackages() {
        sourcePackages.forEach(function(p) {
          if (p.module === moduleName && sourcePackageIsPublic(p)) {
            exportPackage(p);
            addDependencies(p);
            methodPaths.push(getRelativePath(p.path, moduleLower, true));
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
      switch(p.type) {
        case 'method':
        case 'polyfill':
          compileDefinedMethod(p);
          break;
        case 'alias':
          compileAliasedMethod(p);
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
      } else if (p.type === 'polyfill') {
        return path.join('polyfills', p.namespace.toLowerCase(), p.name);
      } else if (p.type === 'fix') {
        return path.join(p.module.toLowerCase(), 'fixes', p.name);
      } else if (p.type === 'method' || p.type === 'alias' || p.type === 'prototype') {
        return path.join(p.namespace.toLowerCase(), p.name);
      } else if (p.type === 'locale') {
        return path.join(p.module.toLowerCase(), p.code);
      } else {
        return path.join(p.module.toLowerCase(), p.type, p.name);
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
      if (p.type === 'polyfill') {
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
      } else if (p.type === 'method' || p.type === 'alias') {
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
        // Build calls do not export themselves, so don't export unless they have
        // explicit vars (caught above). No comment as this is internal.
        exports = p.name;
      }
      return exports ? 'module.exports = ' + exports + ';' : '';
    }

    // --- Entry Point ---

    function createEntryPoint(requirePaths, subPath) {
      var outputPath = path.join(packageDir, subPath || '', 'index.js');
      var requires = requirePaths.map(function(p) {
        return "require('"+ p +"');";
      });
      var exports = "module.exports = require('sugar-core');";
      var outputBody = [STRICT, requires.join('\n'), exports].join('\n\n');
      writeFile(outputPath, outputBody);
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

  function sourcePackageIsPublic(p) {
    return PUBLIC_TYPES.indexOf(p.type) !== -1;
  }

  return stream;
}

// -------------- bower ----------------


function buildBowerClean() {
  cleanDir(args.o || args.output || 'release/bower');
}

function buildBowerDefault() {
  return buildBowerPackages(args.p || args.packages || 'sugar', true);
}

function buildBowerCore() {
  return buildBowerPackages('sugar-core', true);
}

function buildBowerAll() {
  return buildBowerPackages('all', true);
}


function buildBowerPackages(p) {

  var stream = getEmptyStream();
  var packageNames = getPackageNames(p);
  var baseDir = args.b || args.o || args.output || 'release/bower';

  function exportPackage(packageName) {
    var def = getPackageDefinition(packageName);
    if (def.bower === false) {
      return;
    }
    var packageDir = path.join(baseDir, packageName);
    notify('Building bower ' + packageName);
    exportBowerJson(packageName, packageDir);
    copyPackageMeta(packageDir);
    addStream(stream, buildPackageDist(packageName, packageDir));
  }

  packageNames.forEach(exportPackage);

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
    'extending': '#/Extending',
    'object methods': '#/ObjectMethods',
    'enhanced matching': '#/EnhancedMatching',
    'enhanced methods': '#/EnhancedMethods',
    'enhanced method': '#/EnhancedMethods',
    'enhances': '#/EnhancedMethods',
    'deep properties': '#/DeepProperties',
    'date locales': '#/DateLocales',
    'date input formats': '#/DateInputFormats',
    'date output formats': '#/DateOutputFormats',
    'polyfill': '#/Polyfills',
    'extending natives': '/natives',
    'ranges': '#/Ranges',
    'append': '#/Array/append',
    'insert': '#/Array/insert',
    'each': '#/Array/each',
    'add': '#/Array/add'
  };

  var POLYFILL_HTML = getReplacements('This method is provided as a `polyfill`.');
  var ENHANCED_HTML = getReplacements('This method is also provided as a `polyfill` in the MOD module.');

  var POLYFILL_REPLACE_REG = /This method is .* provided as a .*polyfill.*\./;

  var docs = {
    namespaces: []
  };

  var currentNamespace;
  var currentModuleName;
  var modules = getModules('all');
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
        obj['extra'] = (obj['extra'] || '') + getPolyfill(obj, getTextField(value));
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

  function getPolyfill(method, mod) {
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
    var result = [];
    var lines = getMultiline(str, true);

    function getLine() {
      var line = lines.shift();
      return line ? line.replace(/\s*->.+$/, '') : '';
    }

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

  function getBraceLevel(str) {
    var open = str.match(/{/g);
    var close = str.match(/}/g);
    return (open && open.length || 0) - (close && close.length || 0);
  }

  function processMethod(block, lines) {
    var match = block.match(/@method ([\w\[\]]+)\((.*)\)$/m);
    if (match) {
      var method = {};
      var name = match[1].replace(/(\w*)\[(\w+)\](\w*)/, function(full, left, mid, right) {
        method['name_html'] = left + '<span class="docs-method__set">' + mid + '</span>' + right;
        return left + mid + right;
      });
      var args = match[2].split(', ').filter(function(a) {
        return a;
      });

      method.name = name;
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
    var reg = RegExp('@method ' + methodName + '\\b');
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

  function sortAll() {
    docs.namespaces.forEach(function(ns) {
      ns.methods.sort(methodCollate);
    });
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

  function methodCollate(a, b) {
    var aVal = a.type;
    var bVal = b.type;
    if (aVal === bVal) {
      aVal = a.name;
      bVal = b.name;
    }
    return aVal === bVal ? 0 : aVal < bVal ? -1 : 1;
  }

  function getMethodType(method) {
    switch (true) {
      case method.global &&
           method.namespace: return 1;
      case method.global:    return 2;
      case method.namespace: return 3;
      case method.static:    return 4;
      case method.accessor:  return 6;
      default:               return 5;
    }
  }

  sortAll(docs);

  return docs;
}

// --- JSON Source ---

function buildJSONSource() {

  var data = getModularSource();

  addCorePackage();
  bundleSetPackages();
  prepareData();
  writeJSON(data, 'source.json');

  function addCorePackage() {
    data.modules.unshift({
      name: 'Core',
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
            name: p.setName.replace(/[\[\]]/g, ''),
            sample: p.set.slice(0, 2).concat('...').join(', '),
            type: p.type,
            module: p.module,
            static: p.static,
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

    data.packages = packages;
  }

  function prepareData() {
    data.modules.forEach(function(m) {
      indentField(m, 'comment');
    });
    data.packages.forEach(function(p) {

      // Pre-indenting all packages rather than doing it on compile to
      // save some cycles and also correctly calculate the package size.
      indentField(p, 'blockStart');
      indentField(p, 'blockEnd');
      indentField(p, 'bodyWithComments');

      cleanSourcePackage(p);
    });
  }

  function indentField(p, field) {
    if (p[field]) {
      p[field] = p[field].replace(/^(?=.)/gm, '  ');
    }
  }

  function cleanSourcePackage(p) {
    delete p.vars;
    delete p.type;
    delete p.body;
    delete p.path;
    delete p.assigns;
    delete p.comments;
    delete p.varDependencies;
    compactField(p, 'static');
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

// -------------- Tests ----------------

function testWatch(runTests, rebuildDist, rebuildNpm) {

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
    if (rebuildNpm) {
      addStream(stream, buildNpmPackages('modular', true));
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
  notify('Running tests');
  require('./test/node');
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
