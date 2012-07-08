
@version  = ARGV[0]
@packages = ['core','es5','array','date','date_ranges','function','number','object','regexp','string','inflections']

if !@version
  puts "No version specified!"
  exit
end

`mkdir release/#{@version}`
`mkdir release/#{@version}/minified`
`mkdir release/#{@version}/development`
`mkdir release/#{@version}/precompiled`


def compile
  command = "java -jar script/jsmin/compiler.jar --warning_level QUIET --compilation_level ADVANCED_OPTIMIZATIONS --externs lib/externs.js --variable_map_output_file tmp/variable_map --property_map_output_file tmp/property_map #{@packages.map { |p| " --js lib/" + p + ".js" }} --js_output_file tmp/compiled.js"
  puts "EXECUTING: #{command}"
  `#{command}`
end

def split_compiled
  file = 'tmp/compiled.js'
  contents = File.open(file, 'r').read.split('console.info("-----BREAK-----");')
  @packages.each_with_index do |name, index|
    File.open("tmp/#{name}", 'w') do |f|
      puts contents[index]
      f.puts contents[index]
    end
  end
end

#File.open('/tmp/ruby-write-test.txt', 'w') do |f|
#2.
#f.puts 'test started at #{Time.now}'
#3.
## ... do something
#4.
#f.puts 'test ended at #{Time.now}'
#5.


#end

compile
split_compiled

#DIR=`dirname $0`
#VERSION=$1

#source $DIR/gcc_compile.sh

#create_minified_script()
#{
  #file="lib/$1.js"
  #gcc_compile $file false "tmp/variable_map" "tmp/property_map"
  ##mv tmp/compiled.js release/$VERSION/minified/sugar-$VERSION-$1.min.js
  ##cp $file release/$VERSION/development/sugar-$VERSION-$1.development.js
#}

#fullname()
#{
  #path="release/$VERSION/$1/sugar-$VERSION"
  #if [ $2 ]; then
    #path="${path}-$2"
  #fi
  #if [ "$1" = "minified" ]; then
    #path="${path}.min.js"
  #else
    #path="${path}.development.js"
  #fi
  #echo $path
#}

#strip_license()
#{
  #path=$(fullname $1 $2)
  #echo "`sed "1,8 d" $path`"
#}

#create_output_map


##create_minified_script 'core'
##create_minified_script 'dates'
##create_minified_script 'inflections'
##create_minified_script 'dates-only'


##strip_license "minified" "dates" | cat $(fullname "minified" "core") - > $(fullname "minified")
##cat $(fullname "development" "core") $(fullname "development" "dates") > $(fullname "development")

