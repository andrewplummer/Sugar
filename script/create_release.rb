
require 'pp'

@version  = ARGV[0]
@packages = ['core','es5','array','date','date_ranges','function','number','object','regexp','string','inflections']
@default_package = @packages.values_at(0,1,2,3,5,6,7,8,9)
@delimiter = 'console.info("-----BREAK-----");'
@full_path = "release/#{@version}"

if !@version
  puts "No version specified!"
  exit
end

`mkdir release/#{@version}`
`mkdir release/#{@version}/minified`
`mkdir release/#{@version}/development`
`mkdir release/#{@version}/precompiled`


def concat
  file = File.open('tmp/uncompiled.js', 'w')
  @packages.each do |p|
    file.puts content = File.open("lib/#{p}.js").read + @delimiter
  end
end

def compile
  command = "java -jar script/jsmin/compiler.jar --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js --variable_map_output_file tmp/variable_map --property_map_output_file tmp/property_map --js tmp/uncompiled.js --js_output_file tmp/compiled.js"
  puts "EXECUTING: #{command}"
  `#{command}`
end

def split_compiled
  contents = File.open('tmp/compiled.js', 'r').read.split('console.info("-----BREAK-----");')
  @packages.each_with_index do |name, index|
    File.open("#{@full_path}/precompiled/#{name}.js", 'w') do |f|
      f.puts contents[index]
    end
  end
end

def create_packages
  create_package('full', @packages)
  create_package('default', @default_package)
end

def create_package(name, arr)
  contents = ''
  arr.each do |s|
    contents << File.open("#{@full_path}/precompiled/#{s}.js").read
  end
  with_wrapper = "(function(){#{contents.sub(/\n+\Z/m, '')}})();"
  File.open("#{@full_path}/minified/sugar-#{@version}-#{name}.min.js", 'w').write(with_wrapper)
end

def cleanup
  `rm tmp/variable_map`
  `rm tmp/property_map`
  `rm tmp/compiled`
  `rm tmp/uncompiled`
end

concat
compile
split_compiled
create_packages

