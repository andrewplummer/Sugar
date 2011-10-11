sed "s/VERSION/$1/" release/copyright.txt > release/tmp1.js
java -jar script/jsmin/compiler.jar --warning_level QUIET --charset UTF-8 --js lib/sugar.js --js_output_file release/tmp2.js
cat release/tmp1.js release/tmp2.js > release/sugar-$1.min.js
rm release/tmp1.js
rm release/tmp2.js
