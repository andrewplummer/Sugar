S=`awk 'END {print NR-0}' lib/dates.js`; sed -e '1,2 d' -e "$S,$ d" lib/dates.js > release/tmp.js

java -jar script/jsmin/compiler.jar --warning_level QUIET --js release/tmp.js --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js --output_wrapper "(function(){%output%})();" | cat release/copyright.txt - | sed "s/VERSION/$1 (Dates)/" > release/dates/sugar-$1-dates.min.js

rm release/tmp.js
