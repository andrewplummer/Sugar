#! /usr/bin/env ruby

require 'pp'

@version  = ARGV[0]
@custom_packages = ARGV[1..-1]

if !@version
  $stderr.puts "No version specified!"
  exit false
end

@packages = ['core','es5','array','date','date_ranges','function','number','object','regexp','string','inflections','language','date_locales']
@default_packages = @packages.values_at(0,1,2,3,4,5,6,7,8,9)
@delimiter = 'console.info("-----BREAK-----");'
@copyright = File.open('release/copyright.txt').read.gsub(/VERSION/, @version)

@precompiled_notice = <<NOTICE
Note that the files in this directory are not prodution ready. They are
intended to be concatenated together and wrapped with a closure.
NOTICE


PARENT_DIR = "release"
PRECOMPILED_DIR = PARENT_DIR     + "/precompiled"
PRECOMPILED_MIN_DIR = PARENT_DIR + "/precompiled/minified"
PRECOMPILED_DEV_DIR = PARENT_DIR + "/precompiled/development"

`mkdir #{PRECOMPILED_DIR}`
`mkdir #{PRECOMPILED_MIN_DIR}`
`mkdir #{PRECOMPILED_DEV_DIR}`

def concat
  File.open('tmp/uncompiled.js', 'w') do |file|
    @packages.each do |p|
      content = get_content(p)
      file.puts content = content + @delimiter
    end
  end
end

def get_content(package)
  if package == 'date_locales'
    `cat lib/locales/*`
  else
    File.open("lib/#{package}.js").read
  end
end

def create_development
  full_content = ''
  if @custom_packages.length > 0
    packages = @custom_packages
    type = 'custom'
  else
    packages = @packages
    type = 'full'
  end
  packages.each do |p|
    content = get_content(p)
    # don't think I need to store this
    File.open(PRECOMPILED_DEV_DIR + "/#{p}.js", 'w').write(content)
    full_content << content
  end
  File.open(PARENT_DIR + "/sugar-#{type}.development.js", 'w').write(@copyright + wrap(full_content))
end

def compile
  command = "java -jar script/jsmin/compiler.jar --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --externs script/jsmin/externs.js --js tmp/uncompiled.js --js_output_file tmp/compiled.js"
  puts "EXECUTING: #{command}"
  `#{command}`
end

def split_compiled
  contents = File.open('tmp/compiled.js', 'r').read.split(@delimiter)
  @packages.each_with_index do |name, index|
    File.open(PRECOMPILED_MIN_DIR + "/#{name}.js", 'w') do |f|
      f.puts contents[index].gsub(/\A\n+/, '')
    end
  end
  `echo "#{@precompiled_notice}" > #{PRECOMPILED_MIN_DIR}/readme.txt`
end

def create_packages
  create_package('full', @packages)
  create_package('default', @default_packages)
  if @custom_packages.length > 0
    create_package('custom', @custom_packages)
  end
end

def create_package(name, arr)
  contents = ''
  arr.each do |s|
    contents << File.open(PRECOMPILED_MIN_DIR + "/#{s}.js").read
  end
  contents = @copyright + wrap(contents.sub(/\n+\Z/m, ''))
  ext = name == 'default' ? '' : '-' + name
  File.open(PARENT_DIR + "/sugar#{ext}.min.js", 'w').write(contents)
end

def wrap(js)
  "(function(){#{js}})();"
end

def cleanup
  `rm tmp/compiled.js`
  `rm tmp/uncompiled.js`
end

concat
compile
split_compiled
create_packages
create_development
cleanup

