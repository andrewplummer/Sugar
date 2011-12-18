S=`awk 'END {print NR-0}' lib/sugar.js`; sed -e '1,2 d' -e "$S,$ d" lib/sugar.js > release/tmp.js

java -jar script/jsmin/compiler.jar --warning_level QUIET --js release/tmp.js --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js --output_wrapper "(function(){%output%})();" | cat release/copyright.txt - | sed "s/VERSION/$1/" > release/sugar-$1.min.js

java -jar script/jsmin/compiler.jar --warning_level QUIET --js release/tmp.js --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js --charset UTF-8 --output_wrapper "(function(){%output%})();" | cat release/copyright.txt - | sed "s/VERSION/$1/" | sed "s/  /\\\u2028\\\u2029/" > release/utf8/sugar-$1.min.js

cat release/copyright.txt lib/sugar.js | sed "s/VERSION/$1 (Development)/" > release/development/sugar-$1.development.js

rm release/tmp.js
