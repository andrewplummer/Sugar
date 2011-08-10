# Testing for Node

## Pre-requisites

You need to install both node.js and npm

And then you will need to install qunit

    npm install qunit

## Running the test

Assuming you installed qunit into the node_modules directory, run each individual tests like this:

    ./node_modules/qunit/bin/cli.js -c ./lib/sugar.js -t ./unit_tests/sugar/string.js -d ./unit_tests/sugar/node-setup.js --cov false
