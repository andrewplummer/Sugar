java -jar script/jsmin/compiler.jar --warning_level QUIET --js lib/sugar.js --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js | cat release/copyright.txt - | sed "s/VERSION/$1/" > release/sugar-$1.min.js
java -jar script/jsmin/compiler.jar --warning_level QUIET --js lib/sugar.js --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js --charset UTF-8 | cat release/copyright.txt - | sed "s/VERSION/$1/" | sed "s/  /\\\u2028\\\u2029/" > release/utf8/sugar-$1.min.js

cat release/copyright.txt lib/sugar.js | sed "s/VERSION/$1/" > release/sugar-$1.js