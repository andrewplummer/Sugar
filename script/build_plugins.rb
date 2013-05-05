#! /usr/bin/env ruby

require 'json'
require 'pp'

require_relative 'compile'
require_relative 'size'
require_relative 'docs'

@output_path = ARGV[0] || './tmp'
@output_path = @output_path.gsub(/\/$/, '')

@json_path = "#{@output_path}/javascripts/plugins.js"
@file_path = "#{@output_path}/release/plugins"

@plugins = {}

def build_plugin_docs
  @current_module = nil
  Dir['lib/plugins/**/*.js'].each do |path|

    module_name = path.match(/(\w+)\/\w+\.js$/)[1].gsub(/^./) { |c| c.upcase }

    # Weird setup, I know...
    @current_module = {}
    extract_methods(path, nil)
    mod = @current_module[@current_name]
    mod[:module] = module_name
    mod[:size] = get_full_size(path)
    mod[:minified_size] = get_minified_size(path)
    @plugins[@current_name] = mod
  end


  File.open(@json_path, 'w') do |f|
    f.puts "SugarPlugins  = #{@plugins.to_json};"
  end

  puts "Wrote plugins.js to #{@json_path}"

end


def copy_plugins
  Dir['lib/plugins/**/*.js'].each do |path|
   filename = path.match(/\w+.js$/)
   `cp #{path} #{@file_path}/development/#{filename}`
   compile(path, "#{@file_path}/minified/#{filename}")
  end
end

def concat_minified
  content = ''
  Dir["#{@file_path}/minified/*.js"].each do |path|
    content << File.open(path, 'r').read
  end
  File.open("#{@file_path}/all.js", 'w').write(content)
end

copy_plugins
build_plugin_docs
concat_minified
puts 'Done!'

