var fs       = require('fs'),
    gulp     = require('gulp'),
    args     = require('yargs').argv,
    util     = require('gulp-util'),
    merge    = require('merge-stream'),
    concat   = require('gulp-concat'),
    replace  = require('gulp-replace'),
    compiler = require('gulp-closure-compiler');

var COMPIER_JAR_PATH = 'bower_components/closure-compiler/compiler.jar';

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

function outputWithCopyright(packages, ext, fn) {
  var filename,
      release = args.r || args.release || 'custom',
      packages = packages || args.p || args.packages || 'default';
  switch(packages) {
    case 'default':
      filename = 'sugar' + ext;
      break;
    case 'all':
      filename = 'sugar-full' + ext;
      break;
    default:
      filename = 'sugar-custom' + ext;
  }

  var copyrightStream = gulp.src('release/copyright.txt')
    .pipe(replace(/VERSION/, release.match(/[\d.]+/) ? 'v' + release : release))
    .pipe(replace(/YEAR/, new Date().getFullYear()));

  var fileStream = fn(getFileStream(packages), packages);

  return merge(copyrightStream, fileStream)
    .pipe(concat(filename, { newLine: '' }))
    .pipe(gulp.dest('release'));
}

function getFileStream(packages) {
  switch(packages) {
    case 'default':
      packages = DEFAULT_PACKAGES;
      break;
    case 'all':
      packages = ALL_PACKAGES;
      break;
    default:
      packages = packages.split(',');
  }
  return gulp.src(['lib/core/core.js', 'lib/common.js'].concat(packages.map(function(p) {
    return 'lib/' + (p === 'locales' ? 'locales/*.js' : p.toLowerCase() + '.js');
  })));
}

function buildDevelopment(packages) {
  var wrapper = [
    '(function() {',
      "  'use strict';",
      '$1',
    '})();'
  ].join('\n');

  return outputWithCopyright(packages, '.dev.js', function(fileStream, p) {
    util.log(util.colors.yellow('Concatenating', p));
    return fileStream
    .pipe(replace(/'use strict';/g, ''))
    .pipe(concat('tmp', { newLine: '' }))
    .pipe(replace(/^([\s\S]+)$/m, wrapper));
  });
}

function buildMinified(packages) {
  try {
    fs.lstatSync(COMPIER_JAR_PATH);
  } catch(e) {
    util.log(util.colors.red('Closure compiler missing!'), 'Run', util.colors.yellow('bower install'));
    return;
  }
  return outputWithCopyright(packages, '.min.js', function(fileStream, p) {
    util.log(util.colors.yellow('Minifying', p));
    return fileStream
      .pipe(
        compiler({
          compilerPath: COMPIER_JAR_PATH,
          fileName: 'tmp.js',
          compilerFlags: {
            compilation_level: 'ADVANCED_OPTIMIZATIONS',
            externs: [
              'script/jsmin/externs.js'
            ],
            output_wrapper: "(function(){'use strict';%output%}).call(window);",
            warning_level: 'QUIET'
          }
        })
      );
  });
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

gulp.task('default', showHelpMessage);

gulp.task('help', showHelpMessage);

gulp.task('dev', function() {
  buildDevelopment();
});

gulp.task('min', function() {
  buildMinified();
});

// Multiple minification can't be parallel because the compiler is
// looking for files on disk, so build them up sequentially here.
// TODO: Gulp 4 solves this problem.

gulp.task('release:default', ['dev'], function() {
  return buildMinified('default');
});

gulp.task('release:dev:all', ['release:default'], function() {
  return buildDevelopment('all');
});

gulp.task('release', ['release:dev:all'], function() {
  return buildMinified('all');
});

