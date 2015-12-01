// TODO: require on demand??
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
    jscomp_off: ['globalThis', 'misplacedTypeAnnotation', 'checkTypes'],
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


// -------------- Modularize ----------------


var NPM_PACKAGE_TEMPLATE = ['%requires%', '', '%body%', '', '%exports%'].join('\n');


function modularize() {

  var TAB = '  ';
  var NPM_DESTINATION = 'release/modularized';
  var WHITELISTED = ['Math', 'Object', 'Array', 'RegExp', 'arguments', 'isFinite', 'TypeError', 'RangeError'];

  var acorn = require('acorn');

  var topLevel = {};
  var sugarMethods = {};
  var hasOwn = Object.prototype.hasOwnProperty;

  function iter(obj, fn) {
    for (var key in obj) {
      if(!hasOwn.call(obj, key)) continue;
      fn(key, obj[key]);
    };
  }

  function getDependencies(name, n) {
    var deps = [], locals = [];

    function log() {
      if (name === '') {
        console.log.apply(null, [name + ':'].concat(Array.prototype.slice.call(arguments, 0)));
      }
    }

    function pushLocal(loc) {
      if (locals.indexOf(loc) === -1) {
        log("PUSHING LOCAL", loc);
        locals.push(loc);
      }
    }

    function pushLocals(nodes) {
      nodes.forEach(function(id) {
        pushLocal(id.name);
      });
    }

    function pushDependency(dep) {
      if (deps.indexOf(dep) === -1) {
        log("PUSHING DEPENDENCY", dep);
        deps.push(dep);
      }
    }

    function walk(n) {
      if (!n) {
        return;
      }
      if (n.type) n = [n];
      n.forEach(processNode);
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
          pushLocals(node.params);
          walk(node.body);
          return;
        case 'FunctionExpression':
          pushLocals(node.params);
          walk(node.body.body);
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
          // Left is always assignment
          walk(node.right);
          walk(node.body);
          return;
        case 'WhileStatement':
          walk(node.test);
          walk(node.body);
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
          console.info(node);
          throw new Error("Unknown Node: " + node.type);
      }
    }

    function isValidDependency(d) {
      return d !== name && locals.indexOf(d) === -1 && WHITELISTED.indexOf(d) === -1;
    }

    walk(n);
    return deps.filter(isValidDependency);
  }

  function parseModule(module) {
    var path = 'lib/' + module + '.js', commentsByEndLine = {}, counter = 1, currentNamespace, source, output, options;

    function onComment(block, text, start, stop, startLoc, endLoc) {
      var match;
      commentsByEndLine[endLoc.line] = {
        text: text,
        block: block
      }
      if (match = text.match(/@(package|namespace) (\w+)/)) {
        currentNamespace = match[2];
      }
    }

    function processTopLevelNode(node) {
      switch (true) {
        case isVariableDeclaration(node): return addVars(node);
        case isFunctionDeclaration(node): return addInternal(node);
        case isMethodBlock(node):         return processMethodBlock(node);
        case isBuildExpression(node):     return groupBuildExpression(node);
      }
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
             !!node.expression.callee.name.match(/^define(Static|Instance)/);
    }

    function isBuildExpression(node) {
      return node.type === 'ExpressionStatement' &&
             node.expression.type === 'CallExpression' &&
             !!node.expression.callee.name.match(/^build/);
    }

    function getNodeBody(node) {
      // Subtract the column to include the first line's whitespace as well.
      return source.slice(node.start - node.loc.start.column, node.end);
    }

    function addTopLevel(name, node, type) {
      topLevel[name] = {
        type: type,
        module: module,
        body: getNodeBody(node),
        dependencies: getDependencies(name, node)
      }
      return topLevel[name];
    }

    function addVars(node) {
      if (node.declarations.length > 1) {
        processMultiVarDeclaration(node);
      } else {
        processSingleVarDeclaration(node);
      }
    }

    function addInternal(node) {
      addTopLevel(node.id.name, node, 'internal')
    }

    function addSugarMethod(name, node, define) {
      var define = ['Sugar', currentNamespace, define].join('.');
      var body = [define + '({', '', getNodeBody(node), '', '});'].join('\n');
      var deps = ['Sugar'].concat(getDependencies(name, node));
      sugarMethods[name] = {
        body: body,
        module: module,
        dependencies: deps,
        exports: 'Sugar'
      }
      return sugarMethods[name];
    }

    function getGroupName(loc) {
      var prevLineComment = commentsByEndLine[loc.start.line - 1];
      if (prevLineComment) {
        return prevLineComment.text.replace(/^\s+/, '').replace(/\s/g, '_').toLowerCase();
      } else {
        return getFallbackGroupName();
      }
    }

    function getFallbackGroupName() {
      return 'group-' + counter++;
    }

    function processSingleVarDeclaration(node) {
      var name = node.declarations[0].id.name;
      var type = /^[A-Z_]+$/.test(name) ? 'constants' : 'vars';
      var tl = addTopLevel(name, node, type);
    }

    function processMultiVarDeclaration(node) {
      var tl = addTopLevel(getGroupName(node.loc), node, 'vars');
      tl.names = [];
      node.declarations.forEach(function(declaration) {
        tl.names.push(declaration.id.name);
      });
    }

    function processMethodBlock(node) {
      var define = node.expression.callee.name;
      var methods = node.expression.arguments[1].properties;
      methods.forEach(function(node) {
        addSugarMethod(node.key.value, node, define);
      });
    }

    function groupBuildExpression(node) {
      var body;
      var fnName = node.expression.callee.name;
      var fnPackage = topLevel[fnName];

      var groupName = fnName.replace(/^build/, '');
      var groupReg = RegExp('^' + groupName, 'i');

      var names = [];
      var blocks = [];
      var deps = fnPackage.dependencies;

      iter(topLevel, function(key, tl) {
        if (groupReg.test(key)) {
          var i = deps.indexOf(key);
          deps.splice(i, 1);
          tl.alias = groupName;
          names.push(key);
          blocks.push(tl.body);
        }
      });
      body = blocks.concat(fnPackage.body).join('\n')
      topLevel[groupName] = {
        body: body,
        type: 'vars',
        exports: names,
        module: module,
        dependencies: deps
      };
      // The build function is neither depended on nor should
      // be output, so delete from the hash.
      delete topLevel[fnName];
    }

    source = fs.readFileSync(path, 'utf-8')

    output = acorn.parse(source, {
      locations: true,
      sourceFile: path,
      onComment: onComment
    });

    output.body.forEach(function(node) {
      processTopLevelNode(node);
    });

  }

  function writePackage(packageName, package) {

    if (package.alias) {
      // Don't export alias packages.
      return;
    }

    var deps = package.dependencies;

    // If no explicit exports, then the
    // package should simply export itself.
    var exports = package.exports || packageName;

    function getRequires() {
      if (deps.length === 0) {
        return '';
      }
      var requires = deps.map(function(dep) {
        return dep + " = require('" + getPackageForDependency(dep) + "')";
      });
      return 'var ' + requires.join(',\n' + TAB + TAB) + ';';
    }

    function getExports() {
      var compiled, mapped;
      if (typeof exports === 'string') {
        compiled = exports;
      } else {
        mapped = exports.map(function(e) {
          return "'"+ e +"':" + e;
        });
        compiled = ['{', mapped, '}'].join(',\n' + TAB);
      }
      return 'module.exports = ' + compiled + ';';
    }

    function getPackageForDependency(dep) {
      if (dep === 'Sugar') {
        return '../../../lib/core';
        // TODO: temporary until the core package is created.
        //return 'sugar-core';
      }
      // TODO: temporary until we map core vars into common
      if (!hasOwn.call(topLevel, dep)) {
        return '???????????????';
      }
      var depPackage = topLevel[dep], module = depPackage.module;
      var basePath = module === package.module ? './' : '../' + module;
      return path.join(basePath, depPackage.type, dep);
    }

    var outputPath = path.join(NPM_DESTINATION, package.module, package.type || '');
    var outputFilePath = path.join(outputPath, packageName + '.js');
    var outputBody = NPM_PACKAGE_TEMPLATE
      .replace(/%requires%/, getRequires())
      .replace(/%exports%/, getExports())
      .replace(/%body%/, package.body);
    mkdirp.sync(outputPath);
    fs.writeFileSync(outputFilePath, outputBody, 'utf-8');
  }

  parseModule('common');
  parseModule('regexp');

  iter(topLevel, writePackage);
  iter(sugarMethods, writePackage);

}

gulp.task('modularize', function() {
  modularize();
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
