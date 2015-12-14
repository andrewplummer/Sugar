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
  console.log(msg);
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

function modularize() {

  var TAB = '  ';
  var NPM_DESTINATION = 'release/npm/sugar';
  var WHITELISTED = ['arguments', 'undefined', 'NaN', 'btoa', 'atob'];
  var BLOCK_DELIMITER = '\n\n';
  var USE_STRICT = '"use strict";';

  var acorn = require('acorn');

  var topLevel = {
    'Sugar': {
      type: 'core',
      name: 'Sugar',
      path: getSugarCorePath(),
    }
  };
  var sugarMethods = {};
  var modulePackages = [];


  // --- Utility ---

  function iter(obj, fn) {
    for (var key in obj) {
      if(!obj.hasOwnProperty(key)) continue;
        if(fn(key, obj[key]) === false) {
          break;
        }
    };
  }

  // --- Packages ---


  function getSugarCorePath(package) {
    // TODO: temporary until the core package is created.
    //return 'sugar-core';
    var base = package ? path.relative(path.dirname(package.path)) : '';
    return path.join(base, '../../../lib', 'core');
  }

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

  function getRequirePath(from, to) {
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

  function parseModule(module, polyfill) {
    var commentsByEndLine = {}, namespaceRanges = [], currentNamespaceRange;

    var filePath = 'lib/' + module + '.js'
    var source = fs.readFileSync(filePath, 'utf-8')

    // --- Comments ---

    function onComment(block, text, start, stop, startLoc, endLoc) {
      var matches;
      commentsByEndLine[endLoc.line] = {
        text: text,
        block: block
      }
      // Both @package and @namespace may be defined in the same comment block.
      matches = text.match(/@(namespace|package) \w+/g);
      if (matches) {
        var namespace = matches[matches.length - 1].match(/@(namespace|package) (\w+)/)[2];
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

    function getFullMethodKeyForNode(node, name) {
      return getFullMethodKey(getNamespaceForNode(node), name);
    }

    function getFullMethodKey(namespace, name) {
      return module + '|' + namespace + '|' + name;
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
      var methodKey = getFullMethodKeyForNode(node, name);
      var namespace = getNamespaceForNode(node);
      var package = sugarMethods[methodKey] = {
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
      }
      if (opts.define) {
        var init = ['Sugar', namespace, opts.define].join('.');
        var body = [init + '({', '', getNodeBody(node), '', '});' ].join('\n');
        appendBody(package, body);
      } else if (opts.body) {
        appendBody(package, getNodeBody(node));
      }
    }

    function addSugarMethod(name, node, define) {
      addSugarPackage(name, node, {
        deps: true,
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
        requires: getFullMethodKeyForNode(node, sourceName),
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
        case isMemberAssignment(node):    return processTopLevelMemberAssignment(node); // TODO might not need this after moving Hash out
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
      processDefineBlock(node, function(pNode, defineName) {
        addSugarMethod(pNode.key.value, pNode, defineName);
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
      var mainPackage, fnPackage, fnCall, assignedVars;

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

      fnCall = getNodeBody(node);
      fnPackage = topLevel[node.expression.callee.name];
      assignedVars = [];

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
        if (isMethodBlock(node)) {
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
          var sugarMethodName = getFullMethodKeyForNode(node, sourceName);
          addSugarBuiltMethod(name, node, mainPackage);
          appendRequires(mainPackage, sugarMethodName);
        }
      });
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

    if (module !== 'common') {
      exportModulePackage(module, polyfill);
    }

  }

  // --- Exporting ---

  function cleanBuild() {
    var rimraf = require('rimraf');
    rimraf.sync(NPM_DESTINATION);
  }

  function exportInternal() {
    // Two passes seems to be enough to find all hanging deps.
    iter(topLevel, bundleSingleDependencies);
    iter(topLevel, bundleSingleDependencies);
    writePackages(topLevel);
  }

  function exportSugarMethods() {
    writePackages(sugarMethods);
  }

  function exportLocales() {
    glob.sync('lib/locales/*.js').forEach(function(l) {
      writePackage({
        path: path.join('locales', path.basename(l, '.js')),
        body: fs.readFileSync(l, 'utf-8').replace(/^Sugar\.Date\./gm, ''),
        dependencies: ['date|Date|addLocale'],
      });
    });
  }

  function exportModulePackage(module, polyfill) {
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
        return a.name < b.name ? -1 : 1;
      } else if (aLocal) {
        return -1;
      } else if (bLocal) {
        return 1;
      }
    });
    var modulePackage = {
      path: path.join(module, 'index'),
      polyfill: polyfill,
      exports: 'core',
    };
    modulePackage.body = packages.map(function(p) {
      return getRequireStatement(modulePackage, p, true);
    }).join('\n');
    writePackage(modulePackage);
    modulePackages.push(modulePackage);
  }

  function exportMainPackage() {
    modulePackages.sort(function(a, b) {
      if (a.polyfill === b.polyfill) {
        return a.name < b.name ? -1 : 1;
      } else if (a.polyfill) {
        return -1;
      } else if (b.polyfill) {
        return 1;
      }
    });
    var mainPackage = {
      path: 'index',
      exports: 'core',
    };
    appendBody(mainPackage, modulePackages.map(function(p) {
      return getRequireStatement(mainPackage, p, true);
    }).join('\n'));
    writePackage(mainPackage);
  }

  function writePackages(packages) {
    iter(packages, function(name, package) {
      writePackage(package);
    });
  }

  function writePackage(package) {

    if (package.alias || package.type === 'core') {
      // Don't export alias packages or core.
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

        function packageByLength(a, b) {
          return a.name.length - b.name.length;
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
            return packageByLength(a, b);
          }
          return bLiteral - aLiteral;
        });

        vars.sort(packageByLength);
        internal.sort(packageByLength);

        var chunks = [];
        addChunk(chunks, first);
        addChunk(chunks, constants);
        addChunk(chunks, vars);
        addChunk(chunks, internal);
        return chunks.join(',\n\n' + TAB + TAB);
      }

      var inner = attemptToChunk();

      if (!inner) {
        packageNames.sort(function(a, b) {
          return a.length - b.length;
        });
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

    function getPackageOrAlias(name) {
      var package = topLevel[name] || sugarMethods[name];
      if (package.alias) {
        package = topLevel[package.alias];
      }
      return package;
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
        // Replace token "core" with either the sugar-core package
        // or its local path.
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

    var outputPath = path.join(NPM_DESTINATION, package.path + '.js');
    var outputBody = getOutputBody();
    mkdirp.sync(path.dirname(outputPath));
    fs.writeFileSync(outputPath, outputBody, 'utf-8');
  }

  cleanBuild();

  parseModule('common', false);
  parseModule('regexp');
  parseModule('number');
  parseModule('range');
  parseModule('function');
  parseModule('string');
  parseModule('inflections');
  parseModule('language');
  parseModule('array');
  parseModule('object');
  parseModule('date');

  parseModule('es5', true);
  parseModule('es6', true);

  exportLocales();
  exportInternal();
  exportSugarMethods();
  exportMainPackage();

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
