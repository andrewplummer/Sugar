var fs       = require('fs'),
    gulp     = require('gulp'),
    glob     = require('glob'),
    path     = require('path'),
    args     = require('yargs').argv,
    util     = require('gulp-util'),
    mkdirp   = require('mkdirp'),
    merge    = require('merge-stream'),
    concat   = require('gulp-concat-util'),
    replace  = require('gulp-replace');


// -------------- Tasks ----------------

gulp.task('default', showHelpMessage);
gulp.task('help',    showHelpMessage);
gulp.task('docs',    buildDocs);
gulp.task('release', buildRelease);

gulp.task('dev', buildDevelopment);
gulp.task('min', buildMinified);

gulp.task('build',       buildDefault);
gulp.task('build:dev',   buildDevelopment);
gulp.task('build:min',   buildMinified);
gulp.task('build:all',   buildAll);
gulp.task('build:clean', buildClean);

gulp.task('build:npm',       buildNpmDefault);
gulp.task('build:npm:clean', buildNpmClean);
gulp.task('build:npm:core',  buildNpmCore);
gulp.task('build:npm:all',   buildNpmAll);

gulp.task('build:bower',       buildBowerDefault);
gulp.task('build:bower:clean', buildBowerClean);
gulp.task('build:bower:core',  buildBowerCore);
gulp.task('build:bower:all',   buildBowerAll);

gulp.task('precompile:dev', precompileDev);
gulp.task('precompile:min', precompileMin);

gulp.task('test',      testRunDefault);
gulp.task('test:all',  testRunAll);

gulp.task('watch',     testWatchDefault);
gulp.task('watch:all', testWatchAll);

// -------------- Release ----------------

function buildRelease() {
  var version = getVersion(), run = true;
  if (!version.match(/^\d.\d+\.\d+$/)) {
    util.log(util.colors.red('Release requires a valid x.x.x version!'));
    run = false;
  }
  if (typeof args.b !== 'string') {
    util.log(util.colors.red('Release requires an explicit bower output directory (use -b).'));
    run = false;
  }
  if (!run) process.exit();
  return buildAll();
}

// -------------- help ----------------

var HELP_MESSAGE = [
  '',
  '    %Usage%',
  '',
  '      |gulp| [TASK] [OPTIONS]',
  '',
  '    %Tasks%',
  '',
  '      |build|                          Create development and minified build.',
  '      |build:dev|                      Create development build (concatenate files only).',
  '      |build:min|                      Create minified build (closure compiler).',
  '      |build:all|                      Runs "build" and creates all npm/bower packages.',
  '',
  '      |build:npm|                      Builds npm packages ("sugar" by default).',
  '      |build:npm:core|                 Builds "sugar-core" npm package.',
  '      |build:npm:all|                  Builds all npm packages (slow).',
  '      |build:npm:clean|                Cleans npm package output directory ("release/npm" by default).',
  '',
  '      |build:bower|                    Builds bower packages (none by default).',
  '      |build:bower:all|                Builds all bower packages (slow).',
  '      |build:bower:clean|              Cleans bower package output directory ("release/bower" by default).',
  '',
  '      |test|                           Run default test suite.',
  '      |test:all|                       Run all tests.',
  '',
  '      |watch|                          Watch for changes and reload default test suite.',
  '      |watch:all|                      Watch for changes and reload all tests.',
  '',
  '      |dev|                            Shortcut for build:dev',
  '      |min|                            Shortcut for build:min',
  '',
  '      |release|                        Create a release. Same as "build:all" but requires a version.',
  '',
  '      |docs|                           Builds docs as JSON.',
  '',
  '      |help|                           Show this message.',
  '',
  '    %Options%',
  '',
  '      -m, --modules                  Comma separated modules to include (dev,min tasks only).',
  '                                     Modules below (non-default marked with *).',
  '',
  '      -l, --locales                  Comma separated date locales to include (dev,min tasks only).',
  '                                     English is included in the date module by default.',
  '',
  '      -p, --packages                 Comma separated packages to build (npm,bower tasks only).',
  '                                     Same as modules with "sugar-" prefixed, plus "sugar-core".',
  '',
  '      -s, --source_map               Compiler source map file. Default is "sugar.min.map".',
  '',
  '      -n, --no_source_map            Do not output a source map.',
  '',
  '      -o, --output                   Output path (default is "sugar.js" or "sugar.min.js").',
  '',
  '      -v, --version                  Version token to be exported into bundles.',
  '',
  '    %Modules%',
  '',
  '      es5 *',
  '      es6',
  '      es7',
  '      array',
  '      date',
  '      function',
  '      number',
  '      object',
  '      range',
  '      regexp',
  '      string',
  '      language *',
  '      inflections *',
  '',
  '    %Locales%',
  '',
  '      %LOCALE_LIST%',
  '',
  '      Note that locales are included in the "sugar" and "sugar-date" packages',
  '      individually, but bundled together with the main files. If you have',
  '      specific locales you want to pre-package together, use the --locales',
  '      option to include them in your build.',
  '',
  '    %Custom Builds%',
  '',
  '      The npm build tasks split out all methods and dependencies in the',
  '      source code so that they can be consumed individually. The result',
  '      of these tasks will be identical to the packages hosted on npm.',
  '      For more information on how to include them, see the README.',
  '',
  '      Bower packages contain just the bundled scripts in the "dist/" directory.',
  '      As bower requires a public git endpoint, the result of these tasks will be',
  '      identical to the modularized repos hosted on Github. This also means that',
  '      there is no "sugar" package for bower as it is identical to the main repo.',
  '',
  '    %Notes%',
  '',
  '      The es5 module is no longer default in Sugar builds. It should be',
  '      added if ES5 compatibility is required in environments where it',
  '      does not exist (most commonly IE8 and below).',
  '',
  '      The es6/es7 modules are default and include minimal polyfills required',
  '      by Sugar. They can be removed if support can be guaranteed, either',
  '      natively or through a polyfill library.',
  '',
].join('\n');

function showHelpMessage() {
  var msg = HELP_MESSAGE
    .replace(/%LOCALE_LIST%/g, function(match) {
      return getAllLocales().map(function(l) {
        var code = l.match(/([\w-]+)\.js$/)[1];
        var name = readFile(l).match(/\* (.+) locale definition/i)[1];
        return code + ': ' + name;
      }).join('\n      ');
    })
    .replace(/\[\w+\]/g, function(match) {
      return util.colors.dim(match);
    })
    .replace(/%.+%/g, function(match) {
      return util.colors.underline(match.replace(/%/g, ''));
    })
    .replace(/-\w, --\w+/g, function(match) {
      return util.colors.yellow(match);
    })
    .replace(/\|.+\|/g, function(match) {
      return util.colors.yellow(match.replace(/\|/g, ''));
    });
  console.log(msg);
}

// -------------- npm,bower pakcage definitions ----------------

var PACKAGE_DEFINITIONS = {
  'sugar': {
    locales: true,
    modules: 'es6,es7,string,number,array,enumerable,object,date,range,function,regexp',
    description: 'This build includes default Sugar modules and optional date locales.',
    bower: false, // Same as main repo
  },
  'sugar-core': {
    modules: 'core',
    description: 'This build is the core module, which allows custom methods to be defined and extended later.',
  },
  'sugar-es5': {
    modules: 'es5',
    description: 'This build includes all ES5 polyfills not included in the default build.',
  },
  'sugar-es6': {
    modules: 'es6',
    description: 'This build includes all ES6 polyfills bundled with Sugar. Currently this is String#includes, String#startsWith, String#endsWith, String#repeat, Number.isNaN, Array#find, Array#findIndex, and Array.from.',
  },
  'sugar-es7': {
    modules: 'es7',
    description: 'This build includes all ES7 polyfills bundled with Sugar. Currently this is only Array#includes.',
  },
  'sugar-string': {
    modules: 'es6,string,range',
    description: 'This build includes methods for string manipulation, escaping, encoding, truncation, and conversion.',
  },
  'sugar-number': {
    modules: 'es6,number,range',
    description: 'This build includes methods for number formatting, rounding (with precision), and aliases to Math methods.',
  },
  'sugar-enumerable': {
    modules: 'es6,es7,enumerable',
    description: 'This build includes methods common to arrays and objects, such as matching elements/properties, mapping, counting, and averaging. Also included are polyfills for methods that enhance arrays: Array#find, Array#findIndex, Array#includes.',
  },
  'sugar-array': {
    modules: 'array',
    description: 'This build includes methods for array manipulation, grouping, randomizing, and alphanumeric sorting and collation.',
  },
  'sugar-object': {
    modules: 'object',
    description: 'This build includes methods for object manipulation, type checking (isNumber, isString, etc) and extended objects with hash-like methods. Note that Object.prototype is not extended by default. See the README for more.',
  },
  'sugar-date': {
    locales: true,
    modules: 'date,range',
    description: 'This build includes methods for date parsing and formatting, relative formats like "1 minute ago", number methods like "daysAgo", and optional date locales.',
  },
  'sugar-range': {
    modules: 'range',
    description: 'This build includes number, string, and date ranges. Ranges can be iterated over, compared, and manipulated.',
  },
  'sugar-function': {
    modules: 'function',
    description: 'This build includes methods for lazy, throttled, and memoized functions, delayed functions, timers, and argument currying.',
  },
  'sugar-regexp': {
    modules: 'regexp',
    description: 'This build includes methods for escaping regexes and manipulating their flags.',
  },
  'sugar-inflections': {
    modules: 'inflections',
    description: 'This build includes methods for pluralization similar to ActiveSupport including uncountable words and acronyms, humanized and URL-friendly strings.',
  },
  'sugar-language': {
    modules: 'language',
    description: 'This build includes helpers for detecting language by character block, full-width <-> half-width character conversion, and Hiragana and Katakana conversions.',
  }
};

// -------------- Compiler ----------------

var COMPILER_JAR_PATH = 'bower_components/closure-compiler/compiler.jar';

function compileModules(modules, path) {
  var compiler = require('closure-compiler-stream');
  var flags = getDefaultFlags();
  flags.module = modules;
  flags.module_output_path_prefix = path;
  return compiler(flags);
}

function compileSingle(path) {
  var compiler = require('closure-compiler-stream');
  var flags = getDefaultFlags();
  flags.js_output_file = path;
  if (!args.no_source_map) {
    flags.create_source_map = args.s || args.source_map || path.replace(/\.js/, '.map');
  }
  return compiler(flags);
}

function getDefaultFlags() {
  return {
    jar: COMPILER_JAR_PATH,
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    jscomp_off: ['globalThis', 'misplacedTypeAnnotation', 'checkTypes'],
    output_wrapper: getLicense() + "\n(function(){'use strict';%output%}).call(this);",
    externs: 'lib/extras/externs.js',
  }
}

// -------------- Util ----------------

function readFile(path) {
  return fs.readFileSync(path, 'utf-8');
}

function writeFile(outputPath, body) {
  mkdirp.sync(path.dirname(outputPath));
  fs.writeFileSync(outputPath, body, 'utf-8');
}

function notify(text) {
  util.log(util.colors.yellow(text + '...'));
}

function uniq(arr) {
  var result = [];
  arr.forEach(function(el) {
    if (result.indexOf(el) === -1) {
      result.push(el);
    }
  });
  return result;
}

function iter(obj, fn) {
  for (var key in obj) {
    if(!obj.hasOwnProperty(key)) continue;
      if(fn(key, obj[key]) === false) {
        break;
      }
  };
}

// -------------- Build ----------------

var COPYRIGHT = [
  '/*',
  ' *  Sugar Library edge',
  ' *',
  ' *  Freely distributable and licensed under the MIT-style license.',
  ' *  Copyright (c) YEAR Andrew Plummer',
  ' *  http://sugarjs.com/',
  ' *',
  ' * ---------------------------- */'
].join('\n');

var DEFAULT_MODULES = [
  'es6',
  'es7',
  'date',
  'range',
  'number',
  'function',
  'enumerable',
  'array',
  'object',
  'regexp',
  'string'
];

var ALL_MODULES = [
  'es5',
  'es6',
  'es7',
  'date',
  'range',
  'number',
  'function',
  'array',
  'object',
  'enumerable',
  'regexp',
  'string',
  'inflections',
  'language'
];

function buildDefault() {
  return merge(buildDevelopment(), buildMinified());
}

function buildAll() {
  return merge(
    buildDevelopment(),
    buildMinified(),
    buildBowerAll(),
    buildNpmAll()
  );
}

function buildClean() {
  buildNpmClean();
  buildBowerClean();
}

function buildDevelopment() {
  var filename = args.o || args.output || 'sugar.js';
  var modules = args.m || args.modules || 'default';
  var locales = args.l || args.locales;
  notify('Exporting ' + getBuildMessage(filename, modules, locales));
  return createDevelopmentBuild(filename, modules, locales);
}

function buildMinified() {
  var filename = args.o || args.output || 'sugar.min.js';
  var modules = args.m || args.modules || 'default';
  var locales = args.l || args.locales;
  notify('Minifying: ' + getBuildMessage(filename, modules, locales));
  return createMinifiedBuild(filename, modules, locales);
}

function getBuildMessage(filename, modules, locales) {
  var message = filename;
  if (locales) {
    message += ' with locales ' + locales;
  }
  return message;
}

function createDevelopmentBuild(outputPath, p, l) {
  var filename = path.basename(outputPath);
  var modules  = getModuleNames(p);
  var locales  = getLocales(l);
  var template = [
    getLicense(),
    '(function() {',
      "  'use strict';",
      '$1',
    '}).call(this);'
  ].join('\n');
  return gulp.src(modules.concat(locales))
    .pipe(concat(filename, { newLine: '' }))
    .pipe(replace(/^\s*'use strict';\n/g, ''))
    .pipe(replace(/^(?=.)/gm, '  '))
    .pipe(replace(/^([\s\S]+)$/m, template))
    .pipe(replace(/edge/, getVersion()))
    .pipe(gulp.dest(path.dirname(outputPath)));
}

function createMinifiedBuild(outputPath, p, l) {

  var through = require('through2');

  var modules  = getModuleNames(p);
  var locales  = getLocales(l);
  try {
    fs.lstatSync(COMPILER_JAR_PATH);
  } catch(e) {
    util.log(util.colors.red('Closure compiler missing!'), 'Run', util.colors.yellow('bower install'));
    return;
  }
  return gulp.src(modules.concat(locales))
    .pipe(compileSingle(outputPath))
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

function getModuleNames(p) {
  var names;
  switch (p) {
    case 'all':
      names = ALL_MODULES;
      break;
    case 'default':
      names = DEFAULT_MODULES;
      break;
    default:
      names = p.split(',');
  }
  if (!names.length || names[0] !== 'core') {
    names.unshift('common');
  }
  names.unshift('core');
  return uniq(names).map(function(name) {
    return path.join('lib', name.toLowerCase() + '.js');
  });
}

function getLocales(l) {
  if (l === 'all') {
    return getAllLocales();
  } else if (l) {
    return l.split(',').map(function(code) {
      return path.join('lib','locales', code.toLowerCase() + '.js');
    });
  }
  return [];
}

function getLicense() {
  return COPYRIGHT
    .replace(/YEAR/, new Date().getFullYear())
    .replace(/edge/, getVersion(true))
    .replace(/\n$/, '');
}

function getVersion(prefix) {
  var ver = args.v || args.version || 'edge';
  if (prefix && ver.match(/^[\d.]+$/)) {
    ver = 'v' + ver;
  }
  return ver;
}

function getAllLocales() {
  return glob.sync('locales/*.js');
}

// TODO: TRY TO REMOVE
/*
function getFiles(modules, skipLocales) {
  var arr, files = [];
  if (modules === 'core') {
    return ['lib/core.js'];
  }
  files.push('lib/core.js');
  files.push('lib/common.js');
  arr = modules.split(',');
  arr.forEach(function(name) {
    if (name === 'default') {
      Array.prototype.push.apply(arr, DEFAULT_MODULES);
    } else if (name === 'all') {
      Array.prototype.push.apply(arr, ALL_MODULES);
    }
  });
  arr.forEach(function(p) {
    if (p === 'locales' && !skipLocales) {
      files = files.concat(glob.sync('locales/*.js'));
    } else {
      files.push('lib/' + p + '.js');
    }
  });
  return files;
}
*/

function getCompilerModules(files) {
  var modules = [], locales = [];
  files.forEach(function(f) {
    var name = f.match(/(\w+)\.js/)[1];
    if (name === 'core') {
      modules.push(['core:1', f]);
    } else if (f.match(/locales/)) {
      locales.push(f);
    } else {
      modules.push([name + ':1:core', f]);
    }
  });
  if (locales.length) {
    modules.push(['locales:' + locales.length + ':core'].concat(locales));
  }
  return modules;
}

// -------------- precompile ----------------

var PRECOMPILED_MIN_DIR = 'release/precompiled/minified/';
var PRECOMPILED_DEV_DIR = 'release/precompiled/development/';

function precompileDev() {
  var files = getFiles('all').filter(function(path) {
    return !path.match(/locales/);
  });
  return merge(gulp.src(files), gulp.src('locales/*.js')
      .pipe(concat('locales.js', { newLine: '' })))
    .pipe(replace(/^\s*'use strict';\n/g, ''))
    .pipe(gulp.dest(PRECOMPILED_DEV_DIR));
}

function precompileMin() {
  var files = getFiles('all');
  var modules = getCompilerModules(files);
  return gulp.src(files).pipe(compileModules(modules, PRECOMPILED_MIN_DIR));
}

// -------------- package util ----------------

function copyPackageMeta(outputDir) {

  function copyMeta(srcPath) {
    writeFile(path.join(outputDir, path.basename(srcPath)), readFile(srcPath));
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

function buildPackageDist(packageName, outputDir) {

  var definition = PACKAGE_DEFINITIONS[packageName];

  function write(modules) {
    var streams = [];
    var devFilename = path.join(outputDir, getDistFilename(packageName));
    var minFilename = path.join(outputDir, getDistFilename(packageName, true));
    streams = streams.concat(createDevelopmentBuild(devFilename, modules));
    streams = streams.concat(createMinifiedBuild(minFilename, modules));
    return streams;
  }

  if (definition.locales) {
    copyLocales('all', path.join(outputDir, 'locales'));
  }

  return write(definition.modules);
}

function getDistFilename(packageName, min) {
  return packageName + (min ? '.min' : '') + '.js';
}

function getPackageNames(p) {
  var packages;
  switch (p) {
    case 'all':
      packages = [];
      iter(PACKAGE_DEFINITIONS, function(name) {
        packages.push(name);
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

function exportPackageJson(packageName, outputDir) {

  var def = PACKAGE_DEFINITIONS[packageName];
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
    }
  }
  writeFile(path.join(outputDir, 'package.json'), JSON.stringify(json, null, 2));
}

function exportBowerJson(packageName, outputDir) {
  var def = PACKAGE_DEFINITIONS[packageName];
  var json = JSON.parse(JSON.stringify(require('./bower.json')));
  json.name = packageName;
  json.main = packageName + '.js';
  // Bower throws a warning if "ignore" isn't defined.
  json.ignore = [];
  json.keywords = getKeywords(packageName, json.keywords);
  json.description += ' ' + def.description;
  delete json.devDependencies;
  writeFile(path.join(outputDir, 'bower.json'), JSON.stringify(json, null, 2));
}

// -------------- npm ----------------


function buildNpmClean() {
  var dir = args.o || args.output || 'release/npm';
  var rimraf = require('rimraf');
  rimraf.sync(dir);
}

function buildNpmDefault() {
  return buildNpmPackages(args.p || args.packages || 'sugar', true);
}

function buildNpmCore() {
  return buildNpmPackages('sugar-core', true);
}

function buildNpmAll() {
  return buildNpmPackages('all', true);
}

function buildNpmPackages(p, dist) {

  var streams = [];

  function getMethodKey(module, namespace, name) {
    return module + '|' + namespace + '|' + name;
  }

  function getSugarMethod(module, namespace, name) {
    return sugarMethods[getMethodKey(module, namespace, name)];
  }

  // Top level internal functions
  var topLevel = {

    // Change to relative path and "installed"
    // to false to use local core.

    'Sugar': {
      type: 'core',
      name: 'Sugar',
      path: 'sugar-core',
      installed: true,
    }
  };

  // Defined sugar methods
  var sugarMethods = {};

  // Module entry points
  var moduleEntryPoints = [];

  // All packages in a module by name
  var packagesByModuleName = {};

  //  Rules:
  //
  //  1.  This task will walk through the source code and create a dependency tree
  //      that is used to output separated packages for top level locals (function
  //      definitions and vars), individual Sugar methods, and module entry points
  //      that require all methods defined in that module. Finally, it will create
  //      one main entry point for default modules. Local variables whose first
  //      letter is capital are separated into "constants", those with a lowercase
  //      first letter are "vars", and function definitions are "internal".
  //
  //  2.  Any function call in the top scope is considered to be a "build function".
  //      These are used to define similar methods or programmatically build up
  //      other variables declared in the top scope. To "build" a variable, it must
  //      be declared in the top scope and reassigned in the build function.
  //
  //  3.  If a build function is used to build only a single variable, then it will
  //      add itself to that variable package and initialize itself before exporting.
  //
  //  4.  Build functions that do not reassign any top scope variables will have no
  //      exports, but may be required by Sugar method defining packages.
  //
  //  5.  Variables defined in the same "var" block will be bundled together into a
  //      single package exporting multiple variables. Dependencies will be aliased
  //      to this bundled package.
  //
  //  6.  Defining methods inside a build function must use the standard core methods
  //      "defineInstance", "defineStatic", etc. When using "defineInstanceSimilar",
  //      in order to properly build dependencies, the method names must either be a
  //      literal, comma separated string, or exist in the comment block immediately
  //      preceeding the build method, using either @method or (more commonly) @set.
  //      See the source code for more examples.
  //
  //  7.  Build methods may not call defined Sugar methods. Refactor to use a top
  //      level internal method instead.
  //
  //  8.  Packages only required in once place will be bundled together in a multi-
  //      pass bundling phase. This is designed to not only to simplify structure,
  //      but also to prevent circular dependencies to avoid race conditions (ie.
  //      "a" requires "b", "b" requires "a", but "b" is only required by "a" where
  //      "a" is also required elsewhere). However more complex circular dependences
  //      will break this system and should be refactored.
  //
  //  9.  Top level variables must be set once and never reassigned, as the
  //      reference will be broken when being required by different packages.
  //      Instead use closures or objects to hold references.
  //

  function buildDependencyTree() {

    var WHITELISTED = ['arguments', 'undefined', 'NaN', 'btoa', 'atob'];

    var acorn = require('acorn');

    // --- Packages ---


    function getPackageModifier(field, prepend) {

      function getArray(val) {
        if (!val) {
          val = [];
        } else if (typeof val === 'string') {
          val = [val];
        }
        return val;
      }

      return function(package, add) {
        if (!add || !add.length) {
          return;
        }
        add = getArray(add);
        current = getArray(package[field]);

        if (prepend) {
          package[field] = add.concat(current);
        } else {
          package[field] = current.concat(add);
        }
      }
    }

    var appendDeps     = getPackageModifier('dependencies');
    var appendRequires = getPackageModifier('requires');

    var appendBody     = getPackageModifier('body');
    var prependBody    = getPackageModifier('body', true);

    var appendInit     = getPackageModifier('init');
    var prependInit    = getPackageModifier('init', true);

    var appendExports  = getPackageModifier('exports');


    // --- Dependencies ---

    function getDependencies(name, node, locals) {
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
          log("PUSHING LOCAL", loc);
          locals.push(loc);
        }
      }

      function pushDependency(dep) {
        if (deps.indexOf(dep) === -1) {
          log("PUSHING DEPENDENCY", dep);
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
            pushDependencies(getDependencies(name, node.body, getLocals(node.params)));
            return;
          case 'FunctionExpression':
            // Recursively get this function's local dependencies.
            // so that flat locals don't clobber them.
            pushDependencies(getDependencies(name, node.body, getLocals(node.params)));
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
            throw new Error("Unknown Node: " + node.type);
        }
      }

      function isValidDependency(d) {
        // Remove any local variables, whitelisted tokens like "arguments" or "NaN",
        // and anything in the global scope. Cheating a bit here by using the node
        // global scope instead of more whitelisted tokens.
        return locals.indexOf(d) === -1 && !global[d] && WHITELISTED.indexOf(d) === -1;
      }

      walk(node);
      return deps.filter(isValidDependency);
    }

    function bundleSingleDependencies(name, targetPackage) {

      var bundlable = [];

      function bundleDependency(package) {
        var deps = targetPackage.dependencies;

        // First remove self from the target's dependencies,
        // then add source dependencies to the target.
        deps.splice(deps.indexOf(package.name), 1);
        package.dependencies.forEach(function(d) {
          if (d !== targetPackage.name && deps.indexOf(d) === -1) {
            appendDeps(targetPackage, d);
          }
        });

        // If there are any direct exports in the package to be
        // bundled, then they need to be forced into the body of the
        // target instead as variable assignments.
        var assigns = [];
        iter(package.directExports, function(name, statement) {
          assigns.push('var ' + name + ' = ' + statement + ';');
        });

        prependBody(targetPackage, assigns.join('\n'));
        prependBody(targetPackage, package.body);
        prependInit(targetPackage, package.init);

        delete topLevel[package.name];
      }

      function otherDependencyExists(packages, depName) {
        var exists = false;
        iter(packages, function(packageName, package) {
          var deps = package.dependencies;
          if (deps && deps.indexOf(depName) !== -1 && packageName !== targetPackage.name) {
            exists = true;
            return false;
          }
        });
        return exists;
      }

      function dependencyCanBeBundled(dep) {
        return !otherDependencyExists(topLevel, dep) &&
               !otherDependencyExists(sugarMethods, dep) &&
               !topLevel[dep].alias;
      }

      if (targetPackage.dependencies) {
        targetPackage.dependencies.forEach(function(dep) {
          if (dependencyCanBeBundled(dep)) {
            bundlable.push(topLevel[dep]);
          }
        });
      }

      // Bundle variable types in first.
      bundlable.sort(function(a, b) {
        if (a.type === b.type) {
          return 0;
        } else if (a.type === 'vars' || a.type === 'constants') {
          return -1;
        } else {
          return 1;
        }
      });

      bundlable.forEach(bundleDependency);
    }

    // --- Parsing ---

    function parseModule(module) {

      var commentsByEndLine = {}, namespaceRanges = [], currentNamespaceRange;

      var filePath = 'lib/' + module + '.js'
      var source = readFile(filePath)

      // --- Comments ---

      function onComment(block, text, start, stop, startLoc, endLoc) {
        var matches;
        commentsByEndLine[endLoc.line] = {
          text: text,
          block: block
        }
        // Both @module and @namespace may be defined in the same comment block.
        matches = text.match(/@(namespace|module) \w+/g);
        if (matches) {
          var namespace = matches[matches.length - 1].match(/@(namespace|module) (\w+)/)[2];
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
              return '\/\/ ' + l;
            }).join('\n');
          } else {
            return '\/*' + comment.text + '*\/';
          }
        }
      }

      function getAllMethodNamesInPreviousComment(node) {
        var names = [];
        var comment = getLastCommentForNode(node);
        var blocks = comment.split('***');
        blocks.forEach(function(block) {
          var match = block.match(/@set([^@\/]+)/);
          if (match) {
            var set = match[1];
            set = set.replace(/^[\s*]*|[\s*]*$/g, '').replace(/[\s*]+/g, ',');
            names = names.concat(set.split(','));
          } else {
            match = block.match(/@method (\w+)/);
            if (match) {
              names.push(match[1]);
            }
          }
        });
        return names;
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
          }
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

      // --- Packages ---

      function getMethodKeyForNode(node, name) {
        return getMethodKey(module, getNamespaceForNode(node), name);
      }

      function getBundleName(node, type) {
        var first, comment;
        comment = getLastCommentForNode(node).replace(/^[\s\/]+/, '');
        if (type === 'constants') {
          comment = comment.charAt(0).toUpperCase() + comment.slice(1);
        } else {
          comment = comment.charAt(0).toLowerCase() + comment.slice(1).toLowerCase();
        }
        return comment.replace(/\s(\w)/g, function(m, letter) {
          return letter.toUpperCase();
        }).replace(/\W/g, '');
      }

      function getVarBodyForNode(node) {
        return getVarBody(getInnerNodeBody(node).replace(/\s+=\s+/, ' = '));
      }

      function getVarBody(body) {
        return 'var ' + body + ';'
      }

      function getVarType(name) {
        return /^[A-Z]/.test(name) ? 'constants' : 'vars';
      }

      function addTopLevel(name, node, type, body) {
        var package = {
          node: node,
          name: name,
          type: type,
          body: body,
          exports: name,
          module: module,
          path: path.join(module, type, name),
          dependencies: getDependencies(name, node),
        };
        // "Top level" are all "globals", so no collisions
        // should occur by putting them in the same namespace.
        topLevel[name] = package;
      }

      function addVariablePackage(node) {
        var directExports;
        var name = node.id.name;
        var type = getVarType(name);
        var body = getVarBodyForNode(node);
        if (node.init && body.indexOf('\n') === -1) {
          // Directly export one-liners,
          // skipping the variable declaration.
          directExports = {};
          directExports[name] = getInnerNodeBody(node.init);
          body = null;
        }
        addTopLevel(name, node, type, body);
        topLevel[name].directExports = directExports;
      }

      function addFunctionPackage(node) {
        var name = node.id.name;
        var body = getNodeBody(node);
        addTopLevel(name, node, 'internal', body);
      }

      function addVariableBundle(node) {
        var unassignedVars = [];

        // Assume all types in the bundle same and just take the first.
        var type = getVarType(node.declarations[0].id.name);
        var name = getBundleName(node, type);

        var bundle = {
          name: name,
          node: node,
          type: type,
          directExports: {},
          path: path.join(module, type, name),
          dependencies: getDependencies(name, node),
        };

        node.declarations.forEach(function(node) {
          var name = node.id.name;
          type = getVarType(name);
          if (node.init) {
            bundle.directExports[name] = getInnerNodeBody(node.init);
          } else {
            unassignedVars.push(getInnerNodeBody(node));
          }
          appendExports(bundle, name);
          topLevel[name] = {
            name: name,
            node: node,
            alias: bundle.name,
          };
        });

        if (unassignedVars.length) {
          bundle.body = getVarBody(unassignedVars.join(', '));
        }

        topLevel[name] = bundle;
      }

      function addSugarPackage(name, node, opts) {
        var namespace = getNamespaceForNode(node);
        var package = {
          name: name,
          module: module,
          path: path.join(opts.path || '', namespace.toLowerCase(), name),
        };
        if (opts.requires) {
          appendRequires(package, opts.requires);
        }
        if (opts.export) {
          appendDeps(package, 'Sugar');
          appendExports(package, ['Sugar', namespace, name].join('.'));
        }
        if (opts.deps) {
          appendDeps(package, getDependencies(name, node));
          if (opts.flags) {
            appendDeps(package, opts.flags);
          }
        }
        if (opts.define) {
          appendBody(package, buildSugarDefineBlock(node, namespace, opts));
        } else if (opts.body) {
          appendBody(package, getNodeBody(node));
        }
        sugarMethods[getMethodKeyForNode(node, name)] = package;
      }

      function buildSugarDefineBlock(node, namespace, opts) {
        var init = ['Sugar', namespace, opts.define].join('.');
        if (opts.flags) {
          var flags = ['[', opts.flags.join(', '), ']'].join('');
          var close = ['}, ', flags, ');'].join('');
        } else {
          var close = '});'
        }
        return [init + '({', '', getNodeBody(node), '', close].join('\n');
      }

      function addSugarMethod(name, node, define, flags) {
        addSugarPackage(name, node, {
          deps: true,
          flags: flags,
          export: true,
          define: define,
        });
      }

      function addSugarPolyfill(name, node, define) {
        addSugarPackage(name, node, {
          deps: true,
          export: true,
          define: define,
          path: 'polyfills',
        });
      }

      function addSugarAlias(name, node, sourceName) {
        addSugarPackage(name, node, {
          deps: true,
          body: true,
          export: true,
          requires: getMethodKeyForNode(node, sourceName),
        });
      }

      function addSugarBuiltMethod(name, node, requirePackage) {
        addSugarPackage(name, node, {
          export: true,
          requires: requirePackage.name,
        });
      }

      // --- Nodes ---

      function getNodeBody(node) {
        // Subtract the column to offset the first line's whitespace as well.
        return source.slice(node.start - node.loc.start.column, node.end);
      }

      function getInnerNodeBody(node) {
        // Only get the exact node body, no leading whitespace.
        return source.slice(node.start, node.end);
      }

      function processTopLevelNode(node) {
        switch (true) {
          case isUseStrict(node):           return;
          case isMethodBlock(node):         return processMethodBlock(node);
          case isPolyfillBlock(node):       return processPolyfillBlock(node);
          case isVariableDeclaration(node): return processVariableDeclaration(node);
          case isFunctionDeclaration(node): return processFunctionDeclaration(node);
          case isMemberAssignment(node):    return processTopLevelMemberAssignment(node);
          case isAliasExpression(node):     return processAliasExpression(node);
          case isFunctionCall(node):        return processBuildExpression(node);
          default:
            console.log(node);
            throw new Error("Unknown Top Level Node: " + node.type);
        }
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

      function isMemberAssignment(node) {
        return node.type === 'ExpressionStatement' &&
               node.expression.type === 'AssignmentExpression' &&
               node.expression.left.type === 'MemberExpression';
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

      function isSimilarMethodBlock(node) {
        return node.type === 'ExpressionStatement' &&
               node.expression.type === 'CallExpression' &&
               node.expression.callee.name &&
               !!node.expression.callee.name.match(/^define(Static|Instance(AndStatic)?)Similar$/);
      }

      function isReassignment(node) {
        return node.type === 'ExpressionStatement' &&
               node.expression.type === 'AssignmentExpression' &&
               node.expression.left.type === 'Identifier';
      }

      function processVariableDeclaration(node) {
        if (node.declarations.length > 1) {
          addVariableBundle(node);
        } else {
          addVariablePackage(node.declarations[0]);
        }
      }

      function processFunctionDeclaration(node) {
        addFunctionPackage(node);
      }

      function processMethodBlock(node) {
        var flags = node.expression.arguments[2];
        if (flags) {
          flags = flags.elements.map(function(node) {
            return node.name;
          });
        }
        processDefineBlock(node, function(pNode, defineName) {
          addSugarMethod(pNode.key.value, pNode, defineName, flags);
        });
      }

      function processPolyfillBlock(node) {
        processDefineBlock(node, function(pNode, defineName) {
          addSugarPolyfill(pNode.key.value, pNode, defineName);
        });
      }

      function processDefineBlock(node, fn) {
        var defineName = node.expression.callee.name;
        var methods = node.expression.arguments[1].properties;
        methods.forEach(function(name) {
          fn(name, defineName);
        });
      }

      function processTopLevelMemberAssignment(node) {
        var propNode = node.expression.left, name;
        while (propNode.type === 'MemberExpression') {
          propNode = propNode.object;
        }
        name = propNode.name;
        var package = topLevel[name];
        var deps = getDependencies(name, node.expression.right).filter(function(d) {
          return d !== name;
        });
        package.dependencies = package.dependencies.concat(deps);
        appendBody(package, getNodeBody(node));
      }

      function processBuildExpression(node) {
        var mainPackage, fnPackage, fnCall, assignedVars, isHashBuild;

        // Build functions can be used in a few different ways. They can build
        // one or more variables for later use and can also define methods. The
        // general strategy here is to check for variable dependencies that get
        // reassigned in the build function and remove them from the dependency
        // list. Then depending on the number of reassigned variables, we can
        // make a decision about how to bundle the package together.

        function isReassignedDependency(node) {
          return isReassignment(node) &&
                 assignedVars.indexOf(node.expression.left.name) === -1 &&
                 fnPackage.dependencies.indexOf(node.expression.left.name) !== -1;
        }

        function isHashMethodWrap(node) {
          return node.type === 'ExpressionStatement' &&
                 node.expression.type === 'CallExpression' &&
                 node.expression.callee.name === 'wrapHashMethods';
        }

        fnCall = getNodeBody(node);
        fnPackage = topLevel[node.expression.callee.name];
        assignedVars = [];

        isHashBuild = /^buildHash/.test(fnPackage.name);

        fnPackage.node.body.body.forEach(function(node) {
          if (isReassignedDependency(node)) {
            assignedVars.push(node.expression.left.name);
          }
        });

        // Remove the assigned dependencies from the
        // package as they will be bundled together below.
        fnPackage.dependencies = fnPackage.dependencies.filter(function(name) {
          return assignedVars.indexOf(name) === -1;
        });

        if (assignedVars.length === 0) {

          // If there are no unassigned variables at all, then the build function
          // is simply defining methods which will be parsed below, so simply add
          // the initializing call to the package.

          mainPackage = fnPackage;
          appendInit(fnPackage, fnCall);

          // Nothing to export
          delete fnPackage.exports;

          // The build package will be required by any Sugar method it defines
          // so do not delete the reference here.

        } else if (assignedVars.length === 1) {

          // If there is only one assigned variable then the build function can
          // simply be merged into that variable package. When a function requires
          // that variable it will then be built.

          var varPackage = topLevel[assignedVars[0]];
          appendDeps(varPackage, fnPackage.dependencies);
          appendBody(varPackage, fnPackage.body);
          appendInit(varPackage, fnCall);

          mainPackage = varPackage;

          // no longer need the build package
          delete topLevel[fnPackage.name];

        } else if (assignedVars.length > 1) {

          // If there are multiple assigned variables then we are requiring that
          // they be part of a bundle (a single "var" block), so merge the build
          // function into the bundle.

          var bundle = topLevel[topLevel[assignedVars[0]].alias];

          if (!bundle) {
            throw new Error('Multiple assigns found without bundle:' + fnPackage.name);
          }

          appendDeps(bundle, fnPackage.dependencies);
          appendBody(bundle, fnPackage.body);
          appendInit(bundle, fnCall);

          mainPackage = bundle;

          // no longer need the build package
          delete topLevel[fnPackage.name];
        }

        // The build function may define methods, so step
        // into it and create method packages if necessary.
        fnPackage.node.body.body.forEach(function(node) {
          // This is a somewhat hacky way to ensure that if
          // Object.extend is required it will get all Hash
          // methods, even though they are split among packages.
          if (isHashBuild && isHashMethodWrap(node)) {
            var methods = node.expression.arguments[0].value.split(',');
            methods.map(function(name) {
              appendRequires(mainPackage, getMethodKeyForNode(node, name));
            });
          } else if (isMethodBlock(node)) {
            var methods = node.expression.arguments[1].properties;
            methods.forEach(function(node) {
              addSugarBuiltMethod(node.key.value, node, mainPackage);
            });
          } else if (isSimilarMethodBlock(node)) {
            var argNode = node.expression.arguments[1], methodNames;
            if (argNode.type === 'Literal' && argNode.value) {
              // If the argument to defineInstanceSimilar is a literal string,
              // then we can pull the method names directly out of that.
              methodNames = argNode.value.split(',');
            } else {
              // Otherwise, assume the method names appear in the previous
              // comment block and get them from there.
              methodNames = getAllMethodNamesInPreviousComment(node);
            }
            methodNames.forEach(function(name) {
              addSugarBuiltMethod(name, node, mainPackage);
            });
          } else if (isAliasExpression(node)) {
            var name = node.expression.arguments[1].value;
            var sourceName = node.expression.arguments[2].value;
            addSugarBuiltMethod(name, node, mainPackage);
            appendRequires(mainPackage, getMethodKeyForNode(node, sourceName));
          }
        });

        if (isHashBuild) {
          var extendedPackage = getSugarMethod('object', 'Object', 'extended');
          appendRequires(extendedPackage, fnPackage.name);
        }

      }

      function processAliasExpression(node) {
        var name = node.expression.arguments[1].value;
        var sourceName = node.expression.arguments[2].value;
        addSugarAlias(name, node, sourceName);
      }

      function parseModuleBody() {

        output = acorn.parse(source, {
          locations: true,
          sourceFile: filePath,
          onComment: onComment
        });

        namespaceBoundary();

        output.body.forEach(function(node) {
          processTopLevelNode(node);
        });
      }

      parseModuleBody();

    }

    function compilePackages(packages) {
      iter(packages, function(name, package) {
        compilePackage(package);
      });
    }

    function sortModuleEntryPoints() {
      moduleEntryPoints.sort(function(a, b) {
        if (a.polyfill === b.polyfill) {
          return a.module < b.module ? -1 : 1;
        } else if (a.polyfill) {
          return -1;
        } else if (b.polyfill) {
          return 1;
        }
      });
    }

    function optimizeInternal() {
      // Two passes seems to be enough to find all hanging deps.
      iter(topLevel, bundleSingleDependencies);
      iter(topLevel, bundleSingleDependencies);
    }

    function createModuleEntryPoint(module, polyfill) {
      var packages = [], body;
      iter(sugarMethods, function(name, sugarMethod) {
        if (sugarMethod.module === module) {
          packages.push(sugarMethod);
        }
      });
      packages.sort(function(a, b) {
        var aLocal = a.path.slice(0, module.length) === module;
        var bLocal = b.path.slice(0, module.length) === module;
        if (aLocal === bLocal) {
          return a.path < b.path ? -1 : 1;
        } else if (aLocal) {
          return -1;
        } else if (bLocal) {
          return 1;
        }
      });
      var package = {
        module: module,
        path: path.join(module, 'index'),
        polyfill: polyfill,
        exports: 'core',
      };
      package.body = packages.map(function(p) {
        return getRequireStatement(package, p, true);
      }).join('\n');
      moduleEntryPoints.push(package);
      return compilePackage(package);
    }

    function prepareModulePackages(module) {
      var packages = [];

      if (module !== 'common') {
        packages.push(createModuleEntryPoint(module, /^es[567]$/.test(module)));
      }

      function addPackage(p) {
        if (packages.indexOf(p) !== -1) {
          return;
        }
        packages.push(p);
        checkDeps(p.requires);
        checkDeps(p.dependencies);
      }

      function checkDeps(deps) {
        if (deps) {
          deps.forEach(function(name) {
            addPackage(getPackageOrAlias(name));
          });
        }
      }

      iter(sugarMethods, function(name, p) {
        if (p.module === module) {
          addPackage(p);
        }
      });

      packagesByModuleName[module] = packages;
    }

    var moduleNames = ['common'].concat(ALL_MODULES);

    // Parse all source files
    moduleNames.forEach(parseModule);

    optimizeInternal();
    compilePackages(topLevel);
    compilePackages(sugarMethods);

    // Need to do this last to allow dependency bundling to happen first.
    moduleNames.forEach(prepareModulePackages);

    // Last sort the entry points, polyfills first, then by name.
    sortModuleEntryPoints();

  }

  // --- Creating Local Packages ---

  function getPackageOrAlias(name) {
    var package = topLevel[name] || sugarMethods[name];
    if (package.alias) {
      package = topLevel[package.alias];
    }
    return package;
  }

  function getRequirePath(from, to) {
    if (to.installed) {
      return to.path;
    }
    var p = path.join(path.relative(path.dirname(from.path), path.dirname(to.path)), path.basename(to.path));
    if (p.charAt(0) !== '.') {
      p = './' + p;
    }
    p = p.replace(/\/index$/, '');
    return p;
  }

  function getRequireStatement(from, to, stop) {
    return "require('"+ getRequirePath(from, to) +"')" + (stop ? ';' : '');
  }

  function canExportPackage(package) {
    return !package.alias && package.type !== 'core';
  }

  function compilePackage(package) {

    var TAB = '  ';
    var USE_STRICT = "'use strict';";
    var BLOCK_DELIMITER = '\n\n';

    if (!canExportPackage(package)) {
      return;
    }

    // "dependencies" are named and need to be mapped to variables.
    // "requires" must be required but do not need to be mapped.
    var deps = getArray('dependencies'), requires = getArray('requires');

    function getRequires() {
      var blocks = [];
      if (deps && deps.length) {
        blocks.push(getNamedRequires());
      }
      if (requires && requires.length) {
        blocks.push(getUnnamedRequires());
      }
      return blocks.join(BLOCK_DELIMITER);
    }

    function getNamedRequires() {
      var packageNames = groupAliases(deps);

      function sortByLength(a, b) {
        a = a.name || a;
        b = b.name || b;
        // The core package is always the top dependency
        return a === 'Sugar' ? -1 : a.length - b.length;
      }

      function attemptToChunk() {
        var first = [], constants = [], vars = [], internal = []

        function hasMultiple(arr) {
          return arr.length > 1;
        }

        function canChunk() {
          return +hasMultiple(constants) + hasMultiple(vars) + hasMultiple(internal) > 1;
        }

        function joinRequires(arr) {
          return arr.map(function(p) {
            return getAssignName(p.name) + ' = ' + getRequireStatement(package, p);
          }).join(',\n' + TAB + TAB);
        }

        function addChunk(arr1, arr2) {
          if (arr2.length) {
            arr1.push(joinRequires(arr2));
          }
        }

        packageNames.forEach(function(d) {
          var p = getDependency(d);
          switch (p.type) {
            case 'core':      first.push(p); break;
            case 'constants': constants.push(p); break;
            case 'vars':      vars.push(p); break;
            case 'internal':  internal.push(p); break;
          }
        });

        if (!canChunk()) {
          return null;
        }

        constants.sort(function(a, b) {
          var aLiteral = +!!a.name.match(/^[A-Z_]+$/);
          var bLiteral = +!!b.name.match(/^[A-Z_]+$/);
          if (aLiteral === bLiteral) {
            return sortByLength(a, b);
          }
          return bLiteral - aLiteral;
        });

        vars.sort(sortByLength);
        internal.sort(sortByLength);

        var chunks = [];
        addChunk(chunks, first);
        addChunk(chunks, constants);
        addChunk(chunks, vars);
        addChunk(chunks, internal);
        return chunks.join(',\n\n' + TAB + TAB);
      }

      var inner = attemptToChunk();

      if (!inner) {
        packageNames.sort(sortByLength);
        inner = packageNames.map(function(dep) {
          return getAssignName(dep) + ' = ' + getDependencyRequire(dep);
        }).join(',\n' + TAB + TAB);
      }

      return 'var ' + inner + ';';
    }

    function getUnnamedRequires() {
      return requires.sort().map(function(dep) {
        return getDependencyRequire(dep, true);
      }).join('\n');
    }

    function getAssigns() {
      var assigns = [];
      if (deps && deps.length) {
        sortByLength(deps);
        deps.forEach(function(d) {
          var package = getPackageOrAlias(d);
          if (dependencyNeedsAssign(package, d)) {
            assigns.push([getAssignName(d), ' = ', package.name, '.', d].join(''));
          }
        });
        if (assigns.length) {
          return 'var ' + assigns.join(',\n' + TAB + TAB) + ';\n';
        }
      }
      return '';
    }

    function getAssignName(str) {
      return str.replace(/\w+\|/g, '');
    }

    function dependencyNeedsAssign(package, dependencyName) {
      var exports = package.exports;
      return typeof exports === 'object' && exports.length > 1 && exports.indexOf(dependencyName) !== -1;
    }

    function getExports() {
      var exports, directExports, compiled, mapped;

      exports = package.exports;
      directExports = package.directExports || {};

      function getExportExpression(e) {
        return directExports[e] || e;
      }

      if (!exports) {
        // Some packages simply define methods and do not export.
        return '';
      }

      if (exports === 'core') {
        exports = getDependencyRequire('Sugar');
      }

      if (typeof exports === 'string') {
        exports = [exports];
      }

      if (exports.length === 1) {
        compiled = getExportExpression(exports[0]);
      } else {
        mapped = exports.map(function(e) {
          return TAB + "'"+ e +"': " + getExportExpression(e);
        });
        sortByLength(mapped);
        compiled = ['{', mapped.join(',\n'), '}'].join('\n');
      }
      return 'module.exports = ' + compiled + ';';
    }

    function groupAliases(deps) {
      var aliases = [];
      deps = deps.filter(function(d) {
        var package = topLevel[d];
        if (package && package.alias) {
          if (aliases.indexOf(package.alias) === -1) {
            aliases.push(package.alias);
          }
          return false;
        }
        return true;
      });
      return deps.concat(aliases);
    }

    function sortByLength(arr) {
      arr.sort(function(a, b) {
        return a.length - b.length;
      });
    }

    function getDependency(dependencyName) {
      // Aliases may have dependencies on other sugar methods.
      var dep = getPackageOrAlias(dependencyName);
      if (!dep) {
        console.log(package, dependencyName, dep);
        throw new Error('Missing dependency: ' + dependencyName);
      }
      return dep;
    }

    function getDependencyPath(dependencyName) {
      return getRequirePath(package, getDependency(dependencyName));
    }

    function getDependencyRequire(dependencyName, stop) {
      return getRequireStatement(package, getDependency(dependencyName), stop);
    }

    function getArray(field) {
      var arr = package[field];
      if (!arr) {
        arr = [];
      } else if (typeof arr === 'string') {
        arr = [arr];
      }
      return arr;
    }

    function getText(field) {
      var val = package[field];
      if (!val) {
        val = '';
      } else if (val.join) {
        val = val.join(BLOCK_DELIMITER);
      }
      return val;
    }

    function getBody() {
      return getText('body');
    }

    function getInit() {
      return getText('init');
    }

    function getOutputBody() {
      return join([USE_STRICT, getRequires(), getAssigns(), getBody(), getInit(), getExports()]);
    }

    function join(blocks) {
      return blocks.filter(function(block) {
        return block;
      }).join(BLOCK_DELIMITER);
    }

    package.compiledBody = getOutputBody();
    return package;
  }

  function writePackage(package, dir) {
    if (!canExportPackage(package)) {
      return;
    }
    if (!package.compiledBody) {
      compilePackage(package);
    }
    var outputPath = path.join(dir, package.path + '.js');
    var outputBody = package.compiledBody;
    writeFile(outputPath, outputBody);
  }

  function needsDependencyTree(packageNames) {
    return packageNames.some(function(p) {
      return p !== 'sugar-core';
    });
  }

  function moduleIncludedInPackage(packageName, module, isEntryPoint) {
    var definition = PACKAGE_DEFINITIONS[packageName];
    if (!definition) {
      throw new Error('No package definition found for ' + packageName);
    }
    var modules = definition.modules.split(',');
    var extra = (definition.extra || '').split(',');
    return modules.indexOf(module) !== -1 || (extra.indexOf(module) !== -1 && !isEntryPoint);
  }

  function localesIncludedInPackage(packageName) {
    return !!PACKAGE_DEFINITIONS[packageName].locales;
  }

  function writeNpmLocales(packageName, dir) {
    if (!localesIncludedInPackage(packageName)) {
      return;
    }
    var entryPoint = {
      path: 'locales/index',
    };
    var entryPointBody = [];
    glob.sync('locales/*.js').forEach(function(l) {
      var package = {
        path: path.join('locales', path.basename(l, '.js')),
        body: readFile(l).replace(/^Sugar\.Date\./gm, ''),
        dependencies: ['date|Date|addLocale'],
      };
      writePackage(package, dir);
      entryPointBody.push(getRequireStatement(entryPoint, package, true));
    });
    var getAll = getSugarMethod('date', 'Date', 'getAllLocales');
    entryPoint.exports = getRequireStatement(entryPoint, getAll) + '()';
    entryPoint.body = entryPointBody.join('\n');
    writePackage(entryPoint, dir);
  }

  function createMainEntryPoint(packageName, dir) {
    var package = {
      path: 'index',
      exports: 'core',
    };
    package.body = moduleEntryPoints.filter(function(p) {
      return moduleIncludedInPackage(packageName, p.module, true);
    }).map(function(p) {
      return getRequireStatement(package, p, true);
    }).join('\n');
    writePackage(package, dir);
  }

  function buildCore(packageName) {

    var outputDir = path.join(baseDir, packageName);
    var devFilename = path.join(outputDir, getDistFilename(packageName));
    var minFilename = path.join(outputDir, getDistFilename(packageName, true));

    notify('Building npm ' + packageName);
    exportPackageJson(packageName, outputDir);
    copyPackageMeta(outputDir);
    streams.push(createDevelopmentBuild(devFilename, 'core'));

    if (dist) {
      streams.push(createMinifiedBuild(minFilename, 'core'));
    }
  }

  function exportPackage(packageName) {
    if (packageName === 'sugar-core') {
      buildCore(packageName);
      return;
    }
    var outputDir = path.join(baseDir, packageName)
    iter(packagesByModuleName, function(module, packages) {
      if (moduleIncludedInPackage(packageName, module)) {
        packages.forEach(function(p) {
          writePackage(p, outputDir);
        });
      }
    });
    notify('Building npm ' + packageName);
    createMainEntryPoint(packageName, outputDir);
    writeNpmLocales(packageName, outputDir);
    exportPackageJson(packageName, outputDir);
    copyPackageMeta(outputDir);

    if (dist) {
      streams.push(buildPackageDist(packageName, path.join(outputDir, 'dist')));
    }
  }

  var baseDir = args.o || args.output || 'release/npm';
  var packageNames = getPackageNames(p);

  if (needsDependencyTree(packageNames)) {
    notify('Building dependency tree');
    buildDependencyTree();
  }

  packageNames.forEach(exportPackage);

  return merge(streams);
}


// -------------- bower ----------------


function buildBowerClean() {
  var dir = args.o || args.output || 'release/bower';
  var rimraf = require('rimraf');
  rimraf.sync(dir);
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

  var streams = [];
  var packageNames = getPackageNames(p);
  var baseDir = args.b || args.o || args.output || 'release/bower';

  function exportPackage(packageName) {
    var def = PACKAGE_DEFINITIONS[packageName];
    if (def.bower === false) {
      return;
    }
    var outputDir = path.join(baseDir, packageName);
    notify('Building bower ' + packageName);
    exportBowerJson(packageName, outputDir);
    copyPackageMeta(outputDir);
    streams.push(buildPackageDist(packageName, outputDir));
  }

  packageNames.forEach(exportPackage);

  return merge(streams);
}

// -------------- Docs ----------------

function buildDocs() {

  var through  = require('through2');

  var files = getFiles('all', true), modules = {}, methodsByNamespace = {};
  var output = args.f || args.file || 'docs.json';
  var basename = path.basename(output);
  var dirname = path.dirname(output);

  return gulp.src(files)
    .pipe(through.obj(function(file, enc, cb) {
      var text, lines, currentNamespace, currentModule;

      text = file.contents.toString('utf-8')
      lines = text.split('\n');

      function extractMethodNameAndArgs(obj, str) {
        var match = str.match(/(\w+\.)?([^(]+)\(([^\)]*)\)/), args = [];
        var klass = match[1];
        var name  = match[2];

        match[3].split(',').forEach(function(a) {
          var o = a.split(' = '), arg = {};
          var required = true;
          var argName = o[0].trim().replace(/[<>]/g, '').replace(/[\[\]]/g, function(s) {
            required = false;
            return '';
          });
          if (!argName) {
            return;
          } else if (argName == '...') {
            obj['glob'] = true;
            return;
          }
          arg['name'] = argName;
          if (o[1]) {
            arg['default'] = o[1];
            arg['type'] = eval('typeof ' + o[1]);
          }
          if (!required) {
            arg['optional'] = true;
          }
          args.push(arg);
        });
        if (!klass) {
          obj['instance'] = true;
        }
        if (args.length) {
          obj['args'] = args;
        }
        return name;
      }

      function getLineNumber(name) {
        var lineNum;
        var reg = RegExp('@method ' + name + '\\b');
        lines.some(function(l, i) {
          if (l.match(reg)) {
            lineNum = i + 1;
            return true;
          }
        });
        return lineNum;
      }

      function switchNamespace(name) {
        currentNamespace = methodsByNamespace[name];
        if (!currentNamespace) {
          currentNamespace = methodsByNamespace[name] = {};
        }
      }

      function getMultiline(str) {
        var result = [], fOpen = false;
        str.split('\n').forEach(function(l) {
          l = l.replace(/^[\s*]+|[\s*]+$/g, '').replace(/\s+->.+$/, '');
          if (l) {
            if (fOpen) {
              result[result.length - 1] += '\n' + l;
            } else {
              result.push(l);
            }
          }
          if (l.match(/\{$/)) {
            fOpen = true;
          } else if (l.match(/^\}/)) {
            fOpen = false;
          }
        });
        return result;
      }

      function getFileSize(path) {
        return fs.statSync(path).size;
      }

      function getGzippedFileSize(path) {
        return require('zlib').gzipSync(readFile(path)).length;
      }

      function getModuleSize(module) {
        var name = module.replace(/\s/g, '_').toLowerCase();
        var dPath = PRECOMPILED_DEV_DIR + name + '.js';
        var mPath = PRECOMPILED_MIN_DIR + name + '.js';
        modules[module]['size'] = getFileSize(dPath);
        modules[module]['min_size'] = getGzippedFileSize(mPath);
      }

      text.replace(/\*\*\*([\s\S]+?)[\s\n*]*(?=\*\*\*)/gm, function(m, tags) {
        var obj = {};
        tags.replace(/@(\w+)\s?([^@]*)/g, function(all, key, val) {
          val = val.replace(/^[\s*]/gm, '').replace(/[\s*]+$/, '');
          switch(key) {
            case 'module':
              modules[val] = obj;
              currentModule = val;
              if (DEFAULT_MODULES.indexOf(val.toLowerCase()) !== -1) {
                obj['supplemental'] = true;
              }
              switchNamespace(val);
              getModuleSize(val);
              break;
            case 'namespace':
              switchNamespace(val);
              break;
            case 'method':
              var name = extractMethodNameAndArgs(obj, val);
              obj.line = getLineNumber(name);
              obj.module = currentModule;
              currentNamespace[name] = obj;
              break;
            case 'set':
              obj[key] = getMultiline(val);
              break;
            case 'example':
              obj[key] = getMultiline(val);
              break;
            default:
              obj[key] = val;
          }
        });
      });
      this.push(file);
      cb();
    }))
    .pipe(concat(basename, { newLine: '' }))
    .pipe(through.obj(function(file, enc, cb) {
      file.contents = new Buffer(JSON.stringify({
        modules: modules,
        methodsByNamespace: methodsByNamespace
      }), "utf8");
      this.push(file);
      cb();
    }))
    .pipe(gulp.dest(dirname));
}


// -------------- Test ----------------


function runTests(all) {
  var testPath = all ? './test/node/all' : './test/node';
  notify(['Running', all ? 'all' : 'default', 'tests'].join(' '));
  require(testPath);
}

function testWatch(all) {

  setTimeout(function() {
    notify('Waiting');
  });

  gulp.watch(['lib/**/*.js'], function() {
    notify('Rebuilding');
    buildDevelopment();
    buildNpmPackages(all ? 'all' : 'sugar,sugar-core,sugar-es6,sugar-es7');
    runTests(all);
    notify('Waiting');
  });
  gulp.watch(['test/**/*.js'], function() {
    notify('Reloading tests');
    runTests(all);
    notify('Waiting');
  });
}

function testRunDefault() {
  runTests();
}

function testRunAll() {
  runTests(true);
}

function testWatchDefault() {
  testWatch(false);
}

function testWatchAll() {
  testWatch(true);
}

