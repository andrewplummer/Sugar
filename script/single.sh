#!/bin/bash

DIR=`dirname $0`
VERSION=$2

source $DIR/gcc_compile.sh

gcc_compile $1
new=`basename $1 | sed "s/\.js/-compiled.js/"`
mv tmp/compiled.js tmp/$new
echo "Compiled file: tmp/$new"
