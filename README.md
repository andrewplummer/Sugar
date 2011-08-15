Sugar
=====

A Javascript library for working with native objects.
http://sugarjs.com/





Unit Tests Node
===============

## Pre-requisites

node.js and npm

## Running the tests

Run all the tests by running the shell script:

./unit_tests/node.sh



Note about using Dates as a standalone module
=============================================

The Date module depends on a number of Sugar methods. It can be used on its own, but you will
have to keep the following dependencies in addition to this module. The Array Module's polyfill methods can be
skipped if you don't care about < IE8 or if you are using another library that provides them.


### Global private methods (at the top of the file)

 - extend
 - extendWithNativeCondition
 - wrapNative
 - defineProperty
 - iterateOverObject

### Object private methods

 - instance
 - typeMethods
 - buildTypeMethods

### Number instance methods

 - ordinalize
 - pad

### String private methods

 - padstring
 - NPCGMatch

### String instance methods

 - capitalize
 - first
 - from
 - repeat
 - to

### Array instance methods (polyfill)

 - indexOf
 - filter
 - forEach
 - map
