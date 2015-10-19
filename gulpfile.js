var fs       = require('fs'),
    gulp     = require('gulp'),
    glob     = require('glob'),
    zlib     = require('zlib'),
    path     = require('path'),
    args     = require('yargs').argv,
    util     = require('gulp-util'),
    mkdirp   = require('mkdirp'),
    merge    = require('merge-stream'),
    concat   = require('gulp-concat-util'),
    replace  = require('gulp-replace'),
    through  = require('through2'),
    reload   = require('require-reload')(require),
    compiler = require('closure-compiler-stream');

var COMPIER_JAR_PATH = 'bower_components/closure-compiler/compiler.jar';
var PRECOMPILED_MIN_DIR = 'release/precompiled/minified/';
var PRECOMPILED_DEV_DIR = 'release/precompiled/development/';

var HELP_MESSAGE = [
  '',
  '    %Usage%',
  '',
  '      gulp [TASK] [OPTIONS]',
  '',
  '    %Tasks%',
  '',
  '      |dev|                          Non-minified build (concatenate files only).',
  '      |min|                          Minified build.',
  '      |help|                         Show this message.',
  '',
  '    %Options%',
  '',
  '      -p, --packages PACKAGES      Comma separated packages to include (optional). Packages below (non-default marked with |*|).',
  '      -v, --version VERSION        Version (optional).',
  '',
  '    %Packages%',
  '',
  '      es6',
  '      array',
  '      date',
  '      function',
  '      number',
  '      object',
  '      range',
  '      regexp',
  '      string',
  '      es5 |*|',
  '      locales |*|',
  '      language |*|',
  '      inflections |*|',
  '',
  '    %Notes%',
  '',
  '      ES5 package is no longer default in Sugar builds. It should be',
  '      added if ES5 compatibility is required in environments where it',
  '      does not exist (most commonly IE8 and below).',
  '',
  '      ES6 package is default and includes minimal ES6 polyfills required',
  '      by Sugar. This package can be removed if full ES6 support can be',
  '      guaranteed, either natively or through a polyfill library.',
  '',
].join('\n');

var COPYRIGHT = [
  '/*',
  ' *  Sugar Library VERSION',
  ' *',
  ' *  Freely distributable and licensed under the MIT-style license.',
  ' *  Copyright (c) YEAR Andrew Plummer',
  ' *  http://sugarjs.com/',
  ' *',
  ' * ---------------------------- */'
].join('\n');

var DEFAULT_PACKAGES = [
  'es6',
  'array',
  'date',
  'range',
  'function',
  'number',
  'object',
  'regexp',
  'string'
];

var ALL_PACKAGES = [
  'es6',
  'array',
  'date',
  'range',
  'function',
  'number',
  'object',
  'regexp',
  'string',
  'inflections',
  'language',
  'locales'
];

function getPackages() {
  return args.p || args.packages || 'default';
}

function getFiles(packages, skipLocales) {
  var arr, files = [];
  if (packages === 'core') {
    return ['lib/core.js'];
  }
  files.push('lib/core.js');
  files.push('lib/common.js');
  arr = packages.split(',');
  arr.forEach(function(name) {
    if (name === 'default') {
      Array.prototype.push.apply(arr, DEFAULT_PACKAGES);
    } else if (name === 'all') {
      Array.prototype.push.apply(arr, ALL_PACKAGES);
    }
  });
  arr.forEach(function(p) {
    if (p === 'locales' && !skipLocales) {
      files = files.concat(glob.sync('lib/locales/*.js'));
    } else {
      files.push('lib/' + p + '.js');
    }
  });
  return files;
}

function getModules(files) {
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

function showHelpMessage() {
  var msg = HELP_MESSAGE
    .replace(/%\w+%/g, function(match) {
      return util.colors.underline(match.replace(/%/g, ''));
    })
  .replace(/\|.+\|/g, function(match) {
    if(match === '|*|') {
      return util.colors.yellow(match.replace(/\|/g, ''));
    } else {
      return util.colors.cyan(match.replace(/\|/g, ''));
    }
  });
  console.info(msg);
}

function getFilename(name, min) {
  return name + (min ? '.min' : '') + '.js';
}

function getVersion() {
  return args.v || args.version || '';
}

function getLicense() {
  var version = getVersion();
  return COPYRIGHT
    .replace(/VERSION/, version.match(/[\d.]+/) ? 'v' + version : version)
    .replace(/YEAR/, new Date().getFullYear())
    .replace(/\n$/, '');
}

function buildDevelopment(packages, path) {
  var template = [
    getLicense(),
    '(function() {',
      "  'use strict';",
      '$1',
    '}).call(this);'
  ].join('\n');
  var files = getFiles(packages);
  var filename = getFilename(path || 'sugar');
  util.log(util.colors.yellow('Building:', filename));
  return gulp.src(files)
    .pipe(concat(filename, { newLine: '' }))
    .pipe(replace(/^\s*'use strict';\n/g, ''))
    .pipe(replace(/^([\s\S]+)$/m, template))
    .pipe(gulp.dest('.'));
}

function buildMinified(packages, path) {
  try {
    fs.lstatSync(COMPIER_JAR_PATH);
  } catch(e) {
    util.log(util.colors.red('Closure compiler missing!'), 'Run', util.colors.yellow('bower install'));
    return;
  }
  var files = getFiles(packages);
  var filename = getFilename(path || 'sugar', true);
  util.log(util.colors.yellow('Minifying:', filename));
  return gulp.src(files).pipe(compileSingle(filename));
}

// -------------- Compiler ----------------

function compileModules(modules) {
  var flags = getDefaultFlags();
  flags.module = modules;
  flags.module_output_path_prefix = PRECOMPILED_MIN_DIR;
  return compiler(flags);
}

function compileSingle(path) {
  var flags = getDefaultFlags();
  flags.js_output_file = path;
  return compiler(flags);
}

function getDefaultFlags() {
  return {
    jar: COMPIER_JAR_PATH,
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    warning_level: 'QUIET',
    output_wrapper: getLicense() + "\n(function(){'use strict';%output%}).call(this);",
    externs: 'lib/extras/externs.js',
  }
}



// -------------- Build ----------------

gulp.task('default', showHelpMessage);

gulp.task('help', showHelpMessage);

gulp.task('dev', function() {
  return buildDevelopment(getPackages());
});

gulp.task('min', function(done) {
  return buildMinified(getPackages());
});

gulp.task('release', function() {
  util.log(util.colors.blue('-------------------------------'));
  util.log(util.colors.blue('Building release:', getVersion()));
  util.log(util.colors.blue('-------------------------------'));
  return merge(buildDevelopment('default'), buildMinified('default'));
});

gulp.task('precompile:dev', function() {
  var files = getFiles('all').filter(function(path) {
    return !path.match(/locales/);
  });
  return merge(gulp.src(files), gulp.src('lib/locales/*.js')
      .pipe(concat('locales.js', { newLine: '' })))
    .pipe(replace(/^\s*'use strict';\n/g, ''))
    .pipe(gulp.dest(PRECOMPILED_DEV_DIR));
});

gulp.task('precompile:min', function() {
  var files = getFiles('all');
  var modules = getModules(files);
  return gulp.src(files).pipe(compileModules(modules));
});


// -------------- npm ----------------

var NPM_MODULES = [
  {
    name: 'sugar-full',
    description: 'This build includes all Sugar packages including extra string helpers and all Date locales.',
    files: 'es6,all'
  },
  {
    name: 'sugar-core',
    description: 'This build is only the core module, which allows custom methods to be defined and extended later.',
    files: 'core'
  },
  {
    name: 'sugar-array',
    description: 'This build includes array manipulation and traversal, "fuzzy matching" against elements, alphanumeric sorting and collation, and enumerable methods on Object.',
    files: 'es6,array'
  },
  {
    name: 'sugar-date',
    description: 'This build includes date parsing and formatting, relative formats like "1 minute ago", number methods like "daysAgo", and localization support. This build includes English only. For other locales, see the sugar-date-locales module.',
    files: 'date'
  },
  {
    name: 'sugar-date-locales',
    description: 'This build includes date parsing and formatting, relative formats like "1 minute ago", number methods like "daysAgo", and localization support. This build includes all available locales.',
    files: 'date,locales'
  },
  {
    name: 'sugar-range',
    description: 'This build includes ranges which create spans of numbers, strings, or dates. They can enumerate over specific points within that range, and be manipulated and compared.',
    files: 'range'
  },
  {
    name: 'sugar-function',
    description: 'This build includes helpers for lazy, throttled, and memoized functions, delayed functions and handling of timers, and argument currying.',
    files: 'function'
  },
  {
    name: 'sugar-number',
    description: 'This build includes helpers for number formatting, rounding (with precision), and aliases to Math methods.',
    files: 'number'
  },
  {
    name: 'sugar-object',
    description: 'This build includes helpers for object manipulation, type checking (isNumber, isString, etc) and extended objects with hash-like methods. Note that Object.prototype is not extended by default. See the README for more.',
    files: 'object'
  },
  {
    name: 'sugar-regexp',
    description: 'This build includes helpers for escaping regexes and manipulating their flags.',
    files: 'regexp'
  },
  {
    name: 'sugar-string',
    description: 'This build includes helpers for string manupulation, escaping, encoding, truncation, and conversion.',
    files: 'es6,string'
  },
  {
    name: 'sugar-inflections',
    description: 'This build includes pluralization similar to ActiveSupport including uncountable words and acronyms, humanized and URL-friendly strings.',
    files: 'string,inflections'
  },
  {
    name: 'sugar-language',
    description: 'This build includes helpers for detecting language by character block, full-width <-> half-width character conversion, and Hiragana and Katakana conversions.',
    files: 'language'
  }
];

function getKeywords(name, keywords) {
  if (!name.match(/date|full/)) {
    keywords = keywords.filter(function(k) {
      return k !== 'date' && k !== 'time';
    });
  }
  return keywords;
}

function getModulePackage(module, mainPackage) {
  var package = JSON.parse(JSON.stringify(mainPackage));
  package.name = module.name;
  package.main = module.name + '.js';
  package.keywords = getKeywords(module.name, package.keywords);
  package.description += ' ' + module.description;
  delete package.files;
  delete package.scripts;
  delete package.devDependencies;
  return JSON.stringify(package, null, 2);
}

function getModuleBower(module, mainBower) {
  var bower = JSON.parse(JSON.stringify(mainBower));
  bower.name = module.name;
  bower.main = module.name + '.min.js';
  // Bower throws a warning if "ignore" isn't defined.
  bower.ignore = [];
  bower.keywords = getKeywords(module.name, bower.keywords);
  bower.description += ' ' + module.description;
  delete bower.devDependencies;
  return JSON.stringify(bower, null, 2);
}

gulp.task('npm', function() {
  var streams = [];
  var mainPackage = require('./package.json');
  var mainBower = require('./bower.json');
  for (var i = 0; i < NPM_MODULES.length; i++) {
    var module = NPM_MODULES[i];
    var path = 'release/npm/' + module.name + '/';
    mkdirp.sync(path);
    fs.writeFileSync(path + 'package.json', getModulePackage(module, mainPackage));
    fs.writeFileSync(path + 'bower.json', getModuleBower(module, mainBower));
    streams.push(buildDevelopment(module.files, path + module.name));
    streams.push(gulp.src(['LICENSE', 'README.md', 'CHANGELOG.md']).pipe(gulp.dest(path)));
  }
  return merge(streams);
});

gulp.task('npm:min', function() {
  var streams = [];
  for (var i = 0; i < NPM_MODULES.length; i++) {
    var module = NPM_MODULES[i];
    var path = 'release/npm/' + module.name + '/';
    mkdirp.sync(path);
    streams.push(buildMinified(module.files, path + module.name));
  }
  return merge(streams);
});



// -------------- Test ----------------


gulp.task('test', function(cb) {
  reload('./test/node/watch.js');
  cb();
});

gulp.task('test-build', ['dev', 'npm'], function(cb) {
  reload('./test/node/watch.js');
  cb();
});

gulp.task('test:watch', function() {
  gulp.watch(['lib/**/*.js'], ['test-build']);
  gulp.watch(['test/**/*.js'], ['test']);
});


// -------------- Docs ----------------

gulp.task('docs', function() {
  var files = getFiles('all', true), packages = {}, methodsByNamespace = {};
  var output = args.f || args.file || 'docs.json';
  var basename = path.basename(output);
  var dirname = path.dirname(output);

  return gulp.src(files)
    .pipe(through.obj(function(file, enc, cb) {
      var text, lines, currentNamespace, currentPackage;

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
        return zlib.gzipSync(fs.readFileSync(path, 'utf-8')).length;
      }

      function getPackageSize(package) {
        var name = package.replace(/\s/g, '_').toLowerCase();
        var dPath = PRECOMPILED_DEV_DIR + name + '.js';
        var mPath = PRECOMPILED_MIN_DIR + name + '.js';
        packages[package]['size'] = getFileSize(dPath);
        packages[package]['min_size'] = getGzippedFileSize(mPath);
      }

      text.replace(/\*\*\*([\s\S]+?)[\s\n*]*(?=\*\*\*)/gm, function(m, tags) {
        var obj = {};
        tags.replace(/@(\w+)\s?([^@]*)/g, function(all, key, val) {
          val = val.replace(/^[\s*]/gm, '').replace(/[\s*]+$/, '');
          switch(key) {
            case 'package':
              packages[val] = obj;
              currentPackage = val;
              if (DEFAULT_PACKAGES.indexOf(val.toLowerCase()) !== -1) {
                obj['supplemental'] = true;
              }
              switchNamespace(val);
              getPackageSize(val);
              break;
            case 'namespace':
              switchNamespace(val);
              break;
            case 'method':
              var name = extractMethodNameAndArgs(obj, val);
              obj.line = getLineNumber(name);
              obj.package = currentPackage;
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
        packages: packages,
        methodsByNamespace: methodsByNamespace
      }), "utf8");
      this.push(file);
      cb();
    }))
    .pipe(gulp.dest(dirname));
});
