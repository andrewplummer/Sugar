var fs       = require('fs'),
    gulp     = require('gulp'),
    glob     = require('glob'),
    args     = require('yargs').argv,
    util     = require('gulp-util'),
    merge    = require('merge-stream'),
    concat   = require('gulp-concat-util'),
    replace  = require('gulp-replace'),
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
  '      |dev|                          Non-minified (concatenate files only).',
  '      |min|                          Minified release.',
  '      |help|                         Show this message.',
  '',
  '    %Options%',
  '',
  '      -p, --packages PACKAGES      Comma separated packages to include. Packages listed below (non-default marked with |*|).',
  '      -r, --release RELEASE        Release name. Default: "custom".',
  '',
  '    %Packages%',
  '',
  '      array',
  '      date',
  '      es5',
  '      function',
  '      number',
  '      object',
  '      range',
  '      regexp',
  '      string',
  '      locales |*|',
  '      language |*|',
  '      inflections |*|',
  ''
].join('\n');

var DEFAULT_PACKAGES = [
  'es5',
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
  'es5',
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

function getFiles(packages) {
  var arr, files = [];
  switch(packages) {
    case 'default':
      arr = DEFAULT_PACKAGES;
    break;
    case 'all':
      arr = ALL_PACKAGES;
    break;
    default:
      arr = packages.split(',');
  }
  arr.forEach(function(p) {
    if (p === 'locales') {
      files = files.concat(glob.sync('lib/locales/*.js'));
    } else {
      files.push('lib/' + p + '.js');
    }
  });
  return ['lib/core/core.js', 'lib/common.js'].concat(files);
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

function getFilename(packages, ext) {
  switch(packages) {
    case 'default':
      return 'sugar.' + ext + '.js';
    case 'all':
      return 'sugar-full.' + ext + '.js';
    default:
      return 'sugar-custom.' + ext + '.js';
  }
}

function getLicense() {
  var release = args.r || args.release || 'custom';
  return fs.readFileSync('release/copyright.txt', 'utf-8')
    .replace(/VERSION/, release.match(/[\d.]+/) ? 'v' + release : release)
    .replace(/YEAR/, new Date().getFullYear())
    .replace(/\n$/, '');
}

function buildDevelopment(packages) {
  var wrapper = [
    getLicense(),
    '(function() {',
      "  'use strict';",
      '$1',
    '})();'
  ].join('\n');
  var filename = getFilename(packages, 'dev');
  var files = getFiles(packages);
  util.log(util.colors.yellow('Building:', packages));
  return gulp.src(files)
    .pipe(concat(filename, { newLine: '' }))
    .pipe(replace(/'use strict';/g, ''))
    .pipe(replace(/^([\s\S]+)$/m, wrapper))
    .pipe(gulp.dest('release'));
}

function buildMinified(packages) {
  try {
    fs.lstatSync(COMPIER_JAR_PATH);
  } catch(e) {
    util.log(util.colors.red('Closure compiler missing!'), 'Run', util.colors.yellow('bower install'));
    return;
  }
  var filename = getFilename(packages, 'min');
  var files = getFiles(packages);
  util.log(util.colors.yellow('Minifying:', packages));
  return gulp.src(files).pipe(compileSingle('release/' + filename));
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
    output_wrapper: getLicense() + "\n(function(){'use strict';%output%}).call(window);",
    externs: 'script/jsmin/externs.js',
  }
}

// -------------- Tasks ----------------

gulp.task('default', showHelpMessage);

gulp.task('help', showHelpMessage);

gulp.task('dev', function() {
  return buildDevelopment(getPackages());
});

gulp.task('min', function(done) {
  return buildMinified(getPackages());
});

gulp.task('release', function() {
  return merge(buildDevelopment('default'), buildMinified('default'), buildDevelopment('all'), buildMinified('all'));
});

gulp.task('precompile:dev', function() {
  var files = getFiles('all').filter(function(path) {
    return !path.match(/locales/);
  });
  return merge(gulp.src(files), gulp.src('lib/locales/*.js')
      .pipe(concat('locales.js', { newLine: '' })))
    .pipe(replace(/'use strict';/g, ''))
    .pipe(gulp.dest(PRECOMPILED_DEV_DIR));
});

gulp.task('precompile:min', function() {
  var files = getFiles('all');
  var modules = getModules(files);
  return gulp.src(files).pipe(compileModules(modules));
});

