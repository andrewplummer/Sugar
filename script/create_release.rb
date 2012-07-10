
require 'pp'

@version  = ARGV[0]

if !@version
  puts "No version specified!"
  exit
end

@packages = ['core','es5','array','date','date_ranges','function','number','object','regexp','string','inflections']
@default_package = @packages.values_at(0,1,2,3,5,6,7,8,9)
@delimiter = 'console.info("-----BREAK-----");'
@full_path = "release/#{@version}"
@copyright = File.open('release/copyright.txt').read.gsub(/VERSION/, @version)

@precompiled_notice = <<NOTICE
Note that the files in this directory are not prodution ready. They are
intended to be concatenated together and wrapped with a closure.
NOTICE

`mkdir release/#{@version}`
`mkdir release/#{@version}/minified`
`mkdir release/#{@version}/development`
`mkdir release/#{@version}/precompiled`


def concat
  File.open('tmp/uncompiled.js', 'w') do |file|
    @packages.each do |p|
      file.puts content = File.open("lib/#{p}.js").read + @delimiter
    end
  end
end

def create_development
  content = ''
  @packages.each do |p|
    content << File.open("lib/#{p}.js").read
  end
  File.open("release/#{@version}/development/sugar-#{@version}.development.js", 'w').write(@copyright + wrap(content))
end

def compile
  command = "java -jar script/jsmin/compiler.jar --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --externs script/jsmin/externs.js --js tmp/uncompiled.js --js_output_file tmp/compiled.js"
  puts "EXECUTING: #{command}"
  `#{command}`
end

def split_compiled
  contents = File.open('tmp/compiled.js', 'r').read.split(@delimiter)
  @packages.each_with_index do |name, index|
    File.open("#{@full_path}/precompiled/#{name}.js", 'w') do |f|
      f.puts contents[index].gsub(/\A\n+/, '')
    end
  end
  `echo "#{@precompiled_notice}" > release/#{@version}/precompiled/readme.txt`
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
  contents = @copyright + wrap(contents.sub(/\n+\Z/m, ''))
  File.open("#{@full_path}/minified/sugar-#{@version}-#{name}.min.js", 'w').write(contents)
end

def wrap(js)
  "(function(){#{js}})();"
end

def cleanup
  #`rm tmp/compiled.js`
  #`rm tmp/uncompiled.js`
  #`rm release/development.js`
  #`ln -s #{@version}/development/sugar-#{@version}.development.js release/development.js`
end

concat
compile
split_compiled
create_packages
create_development
cleanup

