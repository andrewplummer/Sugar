#!/bin/bash

DIR=`dirname $0`
VERSION=$1

source $DIR/gcc_compile.sh

create_output_map() {
  java -jar script/jsmin/compiler.jar --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js --variable_map_output_file tmp/variable_map --property_map_output_file tmp/property_map --js lib/core.js --js lib/es5.js --js lib/array.js --js lib/date.js --js lib/date_ranges.js --js lib/function.js --js lib/number.js --js lib/object.js --js lib/regexp.js --js lib/string.js --js lib/inflections.js --js_output_file tmp/compiled.js
}

create_minified_script()
{
  file="lib/$1.js"
  gcc_compile $file false "tmp/variable_map" "tmp/property_map"
  #mv tmp/compiled.js release/$VERSION/minified/sugar-$VERSION-$1.min.js
  #cp $file release/$VERSION/development/sugar-$VERSION-$1.development.js
}

fullname()
{
  path="release/$VERSION/$1/sugar-$VERSION"
  if [ $2 ]; then
    path="${path}-$2"
  fi
  if [ "$1" = "minified" ]; then
    path="${path}.min.js"
  else
    path="${path}.development.js"
  fi
  echo $path
}

strip_license()
{
  path=$(fullname $1 $2)
  echo "`sed "1,8 d" $path`"
}

mkdir release/$VERSION
mkdir release/$VERSION/minified
mkdir release/$VERSION/development
mkdir release/$VERSION/precompiled

create_output_map


#create_minified_script 'core'
#create_minified_script 'dates'
#create_minified_script 'inflections'
#create_minified_script 'dates-only'


#strip_license "minified" "dates" | cat $(fullname "minified" "core") - > $(fullname "minified")
#cat $(fullname "development" "core") $(fullname "development" "dates") > $(fullname "development")

