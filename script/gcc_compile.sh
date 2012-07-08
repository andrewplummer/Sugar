#!/bin/bash

gcc_compile()
{
  if $2; then
    utf8="--charset UTF-8"
  else
    utf8=""
  fi
  if [[ -n "${3}" ]]; then
    variable_map="--variable_map_input_file $3"
  else
    variable_map=""
  fi
  if [[ -n "${4}" ]]; then
    property_map="--property_map_input_file $4"
  else
    property_map=""
  fi
  # Delete the first and last lines to prevent an extra closure being added by GCC
  #last=`awk 'END {print NR-0}' $1`
  #sed -e '1,2 d' -e "$last,$ d" $1 | 
  command="java -jar script/jsmin/compiler.jar --js $1 --js_output_file tmp/compiled.js --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js $utf8 $variable_map $property_map"
  echo "EXECUTING: $command"
  `$command`
  #(function(context){%output%})(this);" | cat release/copyright.txt - | sed "s/VERSION/$VERSION/" > tmp/compiled.js
}

