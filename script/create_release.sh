# Delete the first and last lines to prevent an extra closure being added by GCC

release=$1

strip_first_and_last_lines()
{
  last=`awk 'END {print NR-0}' $1`
  sed -e '1,2 d' -e "$last,$ d" $1 > release/tmp.js
}

gcc_compile()
{
  if $1; then
    utf8="--charset UTF-8"
  else
    utf8=""
  fi
  `java -jar script/jsmin/compiler.jar --warning_level QUIET --js release/tmp.js --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js $utf8 --output_wrapper "(function(){%output%})();" --js_output_file release/tmp.js`
  if $1; then
    sed "s/VERSION/$release/" release/tmp.js > release/tmp.js
  fi
  #| cat release/copyright.txt - | sed "s/VERSION/$release/" > release/sugar-$release.min.js`
}

#java -jar script/jsmin/compiler.jar --warning_level QUIET --js release/tmp.js --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js --charset UTF-8 --output_wrapper "(function(){%output%})();" | cat release/copyright.txt - | sed "s/VERSION/$1/" | sed "s/  /\\\u2028\\\u2029/" > release/utf8/sugar-$1.min.js

#cat release/copyright.txt lib/sugar.js | sed "s/VERSION/$1 (Development)/" > release/development/sugar-$1.development.js

#rm release/tmp.js
