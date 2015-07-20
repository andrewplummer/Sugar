
def compile(input, output)
  command = "java -jar bower_components/closure-compiler/compiler.jar --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --externs script/jsmin/externs.js --js #{input} --js_output_file #{output}"
  puts "EXECUTING: #{command}"
  `#{command}`
end

