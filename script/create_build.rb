#!/usr/bin/env ruby

require 'optparse'
require 'fileutils'
require_relative 'compile'

PACKAGES = ['core','common','es5','array','date','range','function','number','object','regexp','string','inflections','language','locales']
DEFAULT_PACKAGES = PACKAGES.values_at(0,1,2,3,4,5,6,7,8,9,10)
PACKAGE_DELIMTER = 'console.info("-----BREAK-----");'

PRECOMPILED_NOTICE = <<NOTICE
Note that the files in this directory are not prodution ready. They are
intended to be concatenated together and wrapped with a closure.
NOTICE


PARENT_DIR = "release"
PRECOMPILED_DIR = PARENT_DIR     + "/precompiled"
PRECOMPILED_MIN_DIR = PARENT_DIR + "/precompiled/minified"
PRECOMPILED_DEV_DIR = PARENT_DIR + "/precompiled/development"

TMP_DIR = 'tmp'
TMP_COMPILED_FILE = TMP_DIR + '/compiled.js'
TMP_UNCOMPILED_FILE = TMP_DIR + '/uncompiled.js'

CORE_PATH = 'lib/core'

options = {}

optparse = OptionParser.new do |opts|

  # Set a banner, displayed at the top
  # of the help screen.

  opts.banner =<<-BANNER

  This script creates a build of Sugar.

  Usage:
    create_build [OPTIONS]

  Options:
  BANNER

  opts.on('-p PACKAGES', '--packages PACKAGES', 'Comma separated packages to include. Defaults listed below.') do |packages|
    options[:packages] = packages.split(',')
  end

  opts.on('-r RELEASE', '--release RELEASE', 'Release name. Default: "custom".') do |release|
    options[:release] = release
  end

  opts.on('-n', '--no-conflict', 'Build with no conflict flag on. See readme for more.') do
    options[:no_conflict] = true
  end

  opts.on('-h', '--help', 'Show this message.') do
    puts optparse
    exit
  end

  opts.separator <<-OTHER

  Default Packages:
    Array
    Date
    ES5
    Function
    Number
    Object
    Range
    RegExp
    String

  Extra Packages:
    Inflections
    Language
    Locales (Date locales)

    OTHER


end

optparse.parse!

@release = options[:release]
@custom_packages = options[:packages] || []
@no_conflict = options[:no_conflict] || false

if !@custom_packages.empty?
  @custom_packages.unshift('common')
  @custom_packages.unshift('core')
  @custom_packages.uniq!
  @release ||= 'custom'
end

if !@release
  puts optparse
  exit
end

if @release =~ /[\d.]+/
  @copyright = File.open('release/copyright.txt').read.gsub(/VERSION/, @release)
else
  @copyright = File.open('release/copyright.txt').read.gsub(/vVERSION/, @release)
end


def prep_temp_directories
  FileUtils.mkdir_p TMP_DIR
  FileUtils.mkdir_p PRECOMPILED_DIR
  FileUtils.mkdir_p PRECOMPILED_MIN_DIR
  FileUtils.mkdir_p PRECOMPILED_DEV_DIR
end

def concat
  File.open(TMP_UNCOMPILED_FILE, 'w') do |file|
    PACKAGES.each do |p|
      content = get_content(p)
      file.puts content + PACKAGE_DELIMTER
    end
  end
end

def get_content(package)
  if package == 'locales'
    `cat lib/locales/*`
  else
    content = File.open(get_file_path(package)).read
    content.gsub!(/'use strict';/, '')
    if package == 'core' && @no_conflict
      content.gsub!(/var noConflict = .+$/, 'var noConflict = true;')
    end
    content
  end
end

def get_file_path(package)
  if (package == 'core')
    path = 'core/' + package
  else
    path = package
  end
  "lib/#{path}.js"
end

def create_all_development
  if !@custom_packages.empty?
    create_development(@custom_packages, 'custom')
  else
    create_development(DEFAULT_PACKAGES, 'default')
    create_development(PACKAGES, 'full')
  end
end

def create_development(packages, type)
  filename = if type == 'default'
    "/sugar.dev.js"
  else
    "/sugar-#{type}.dev.js"
  end
  full_content = ''
  packages.each do |p|
    content = get_content(p)
    content.gsub!(/^\s*'use strict';\n/, '')
    # don't think I need to store this
    File.open(PRECOMPILED_DEV_DIR + "/#{p}.js", 'w').write(content)
    full_content << content
  end
  filename = PARENT_DIR + filename
  File.open(filename, 'w').write(@copyright + wrap(full_content))
  puts "CREATED: #{filename}"
end

def split_compiled
  contents = File.open(TMP_COMPILED_FILE, 'r').read.split(PACKAGE_DELIMTER)
  PACKAGES.each_with_index do |name, index|
    File.open(PRECOMPILED_MIN_DIR + "/#{name}.js", 'w') do |f|
      f.puts contents[index].gsub(/\A\n+/, '')
    end
  end
  `echo "#{PRECOMPILED_NOTICE}" > #{PRECOMPILED_MIN_DIR}/readme.txt`
end

def create_all_minified
  if !@custom_packages.empty?
    create_minified('custom', @custom_packages)
  else
    create_minified('default', DEFAULT_PACKAGES)
    create_minified('full', PACKAGES)
  end
end

def create_minified(name, arr)
  contents = ''
  arr.each do |s|
    contents << File.open(PRECOMPILED_MIN_DIR + "/#{s}.js").read
  end
  contents = @copyright + wrap_minified(contents.sub(/\n+\Z/m, ''))
  ext = name == 'default' ? '' : '-' + name
  filename = PARENT_DIR + "/sugar#{ext}.min.js"
  File.open(filename, 'w').write(contents)
  puts "CREATED: #{filename}"
end

def create_core_standalone
  File.open(CORE_PATH + "/core.dev.js", 'w') do |f|
    f.write wrap(File.open(PRECOMPILED_DEV_DIR + "/core.js").read)
  end
  File.open(CORE_PATH + "/core.min.js", 'w') do |f|
    f.write wrap_minified(File.open(PRECOMPILED_MIN_DIR + "/core.js").read.strip)
  end
end

def wrap_minified(js)
  "(function(){'use strict';#{js}})();"
end

def wrap(js)
  <<-EOT
(function(){
  'use strict';
#{js}
})();
  EOT
end

def cleanup
  `rm #{TMP_COMPILED_FILE}`
  `rm #{TMP_UNCOMPILED_FILE}`
end

prep_temp_directories
concat
compile(TMP_UNCOMPILED_FILE, TMP_COMPILED_FILE)
puts ""
split_compiled
create_all_minified
create_all_development
create_core_standalone if @release != 'custom'
cleanup

