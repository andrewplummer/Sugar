#! /usr/bin/env ruby


analyzer_file = 'lib/analyzer.js'


prototype  = File.open('docs/libs/prototype.js', 'r').read
underscore = File.open('docs/libs/underscore.js', 'r').read

analyzer  = File.open(analyzer_file, 'r').read
output = prototype + underscore


analyzer.gsub!(/(BEGIN LIBS\n).*?(  \/\/ END LIBS)/m, "\\1#{output}\n\\2")



File.open(analyzer_file, 'w') do |f|
  f.puts analyzer
end
