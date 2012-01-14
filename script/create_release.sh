
ver=$1

gcc_compile()
{
  if $2; then
    utf8="--charset UTF-8"
  else
    utf8=""
  fi
  # Delete the first and last lines to prevent an extra closure being added by GCC
  last=`awk 'END {print NR-0}' $1`
  sed -e '1,2 d' -e "$last,$ d" $1 | java -jar script/jsmin/compiler.jar --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js $utf8 --output_wrapper "(function(){%output%})();" | cat release/copyright.txt - | sed "s/VERSION/$ver/" > tmp/compiled.js
}

create_minified_script()
{
  file="lib/$1.js"
  gcc_compile $file false
  mv tmp/compiled.js release/$ver/minified/sugar-$ver-$1.min.js
  cp $file release/$ver/development/sugar-$ver-$1.development.js
}

mkdir release/$ver
mkdir release/$ver/minified
mkdir release/$ver/development

create_minified_script 'core'
create_minified_script 'dates'
create_minified_script 'inflections'

cat release/$ver/minified/sugar-$ver-core.min.js release/$ver/minified/sugar-$ver-dates.min.js > release/$ver/minified/sugar-$ver.min.js
cat release/$ver/development/sugar-$ver-core.development.js release/$ver/development/sugar-$ver-dates.development.js > release/$ver/development/sugar-$ver.development.js

