#!/bin/bash

gcc_compile()
{
  if $2; then
    utf8="--charset UTF-8"
  else
    utf8=""
  fi
  # Delete the first and last lines to prevent an extra closure being added by GCC
  last=`awk 'END {print NR-0}' $1`
  sed -e '1,2 d' -e "$last,$ d" $1 | java -jar script/jsmin/compiler.jar --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js $utf8 --output_wrapper "(function(){%output%})();" | cat release/copyright.txt - | sed "s/VERSION/$VERSION/" > tmp/compiled.js
}

