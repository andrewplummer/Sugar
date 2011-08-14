#!/bin/bash

# Assuming you are running from the project root
QUNIT="./node_modules/qunit/bin/cli.js"
SUGAR="./lib/sugar.js"
SETUP="./unit_tests/sugar/node-setup.js"
CODE_PATH="./unit_tests/sugar/"

test=( "array.js" "date.js" "number.js" "object.js" "regexp.js" "string.js" "es5.js" "function.js" )
for i in "${test[@]}"
do
    echo `$QUNIT -c $SUGAR -d $SETUP -t $CODE_PATH$i --cov false`
done

