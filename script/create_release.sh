#!/bin/bash

DIR=`dirname $0`
VERSION=$1

source $DIR/gcc_compile.sh

create_minified_script()
{
  file="lib/$1.js"
  gcc_compile $file false
  mv tmp/compiled.js release/$VERSION/minified/sugar-$VERSION-$1.min.js
  cp $file release/$VERSION/development/sugar-$VERSION-$1.development.js
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

create_minified_script 'core'
create_minified_script 'dates'
create_minified_script 'inflections'


strip_license "minified" "dates" | cat $(fullname "minified" "core") - > $(fullname "minified")
cat $(fullname "development" "core") $(fullname "development" "dates") > $(fullname "development")

