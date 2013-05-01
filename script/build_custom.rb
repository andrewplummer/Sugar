#! /usr/bin/env ruby

# This script may be broken!

require 'json'

if ARGV.size == 0
  puts "No packages specified!"
  exit
end

def get_current_version
  package = JSON.parse(File.open('package.json', 'r').read)
  @version = package['version'].sub(/\.0$/, '')
end

get_current_version

`ruby script/create_release.rb #{@version} #{ARGV.join(' ')}`

puts "\n"
puts "\n"
puts "--------------------------------------------------------------------------------"
puts "\n"
puts "    Your custom build is available at releases/#{@version}/sugar-#{@version}-custom.min.js"
puts "\n"
puts "--------------------------------------------------------------------------------"
