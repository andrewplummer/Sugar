java -jar script/jsmin/compiler.jar --js lib/sugar.js --js_output_file release/tmp.js
cat release/copyright.txt release/tmp.js > release/sugar-$1.min.js
rm release/tmp.js
