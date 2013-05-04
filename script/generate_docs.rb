#! /usr/bin/env ruby

require 'rubygems'
require 'json'
require 'pp'

require_relative 'docs'
require_relative 'size'

fileout  = ARGV[0] || ENV['SUGAR_SITE_PATH'] + '/javascripts/packages.js'

@locales_preamble = <<TEXT
  /***
   * @package Date Locales
   * @dependency date
   * @description Locale definitions French (fr), Italian (it), Spanish (es), Portuguese (pt), German (de), Russian (ru), Polish (pl), Swedish (sv), Japanese (ja), Korean (ko), Simplified Chinese (zh-CN), and Traditional Chinese (zh-TW). Locales can also be included individually. See @date_locales for more.
   *
   ***/
TEXT

fileout_html  = File.open(fileout, 'r').read if File.exists?(fileout)

@packages = {}
@default_packages = [:core,:es5,:array,:object,:date,:range,:function,:number,:regexp,:string]

def create_locale_package
  file = 'lib/date_locales.js'
  locales = `cat lib/locales/*`
  File.open(file, 'w').write(@locales_preamble + locales)
end

def cleanup
  `rm lib/date_locales.js`
end

def extract_package(package)
  @packages[package] ||= {
    :size => get_full_size("lib/#{package}.js"),
    :minified_size => get_minified_size("release/precompiled/minified/#{package}.js", package),
    :extra => !@default_packages.include?(package),
    :modules => {}
  }
  extract_methods("lib/#{package}.js", @packages[package])
end

def extract_main_docs
  extract_package(:core)
  extract_package(:es5)
  extract_package(:array)
  extract_package(:object)
  extract_package(:date)
  extract_package(:date_locales)
  extract_package(:range)
  extract_package(:function)
  extract_package(:number)
  extract_package(:regexp)
  extract_package(:string)
  extract_package(:inflections)
  extract_package(:language)
end

create_locale_package
extract_main_docs

cleanup
puts 'Done!'

File.open(fileout, 'w') do |f|
  f.puts "SugarPackages = #{@packages.to_json};"
  end
