java -jar script/jsmin/compiler.jar --warning_level QUIET --js lib/sugar.js --compilation_level ADVANCED_OPTIMIZATIONS --externs script/externs.js | cat release/copyright.txt - | sed "s/VERSION/$1/" > release/sugar-$1.min.js
#java -jar script/jsmin/compiler.jar --warning_level QUIET --js lib/sugar.js | cat release/copyright.txt - | sed "s/VERSION/$1/" > release/sugar-$1.min.js
#java -jar script/jsmin/compiler.jar --warning_level QUIET --charset UTF-8 --js lib/sugar.js | cat release/copyright.txt - | sed "s/VERSION/$1/" | sed "s/  /\\\u2028\\\u2029/" > release/utf8/sugar-$1.min.js

