
require 'rubygems'
require 'json'
require 'pp'

fileout  = ARGV[0] || '/Volumes/Andrew/Sites/sugarjs.com/public_html/javascripts/methods.js'

fileout_html  = File.open(fileout, 'r').read if File.exists?(fileout)

@modules = {}


def get_property(prop, s, multiline = false)
  if multiline
    r = Regexp.new('@'+prop.to_s+'[\s*]+\*\n(.+)\*\n', Regexp::MULTILINE)
    match = s.scan(r)
    match[0][0].split(/\n/) if match[0]
  else
    match = s.match(Regexp.new('@'+prop.to_s+' (.*)'))
    match[1] if match
  end
end

def get_html_parameters(str)
  return nil if !str
  str.gsub!(/<(.+?)>/, '<span class="required parameter">\1</span>')
  str.gsub!(/\[(.+?)\]/, '<span class="optional parameter">\1</span>')
  str.gsub!(/@date_format/, '<a target="_blank" href="/dates">dates</a>')
  str.gsub!(/extended objects/, '<a target="_blank" href="/objects#extended_objects">extended objects</a>')
  str.gsub!(/Object\.extend\(\)/, '<a target="_blank" href="/objects#object_sugar" class="monospace">Object.extend()</a>')
  str.gsub!(/%(.+?)%/, '<span class="code">\1</span>')
end

def get_method(s)
  raw = get_property(:method, s)
  match = raw.match(/(.+\.)?(.+)\((.+)?\)/)
  method = { :name => match[2] }
  if !!match[1]
    method[:class_method] = true
  end
  params = []
  accepts_unlimited_params = false
  if match[3]
    p = match[3].split(/,(?!')/)
    if p.last =~ /\.\.\./
      p.delete_at(-1)
      method[:accepts_unlimited_params] = true
    end
    params = p.to_enum(:each_with_index).map do |f,i|
      required = !!f.match(/<.+>/)
      name = f.match(/[<\[](.+)[>\]]/)[1]
      default = f.match(/ = (.+)/)
      css = ''
      css << 'required ' if required
      css << 'parameter'
      if default
        d = default[1]
        if d =~ /['"].*['"]/
          type = :string
          d.gsub!(/(['"])(.+)(['"])/, '\\1<span class="monospace">\\2</span>\\3')
        elsif d =~ /\d+/
          type = :number
        elsif d =~ /\/.+\//
          type = :regexp
        elsif d =~ /^null$/
          type = :null
        elsif d =~ /true|false/
          type = :boolean
        elsif d =~ /\{\}/
          type = :object
        end
        d = '<span class="' + type.to_s + ' monospace value">' + d + '</span>'
      end
      {
        :name => name,
        :type => type,
        :required => required,
        :default => default ? default[1] : nil
      }
    end
  else
    params = []
  end
  method[:params] = params
  method
end

def get_examples(s, name)
  lines = get_property(:example, s, true)
  return nil if !lines
  examples = []
  func = ''
  force_result = false
  lines.each do |l|
    l.gsub!(/^[\s*]+/, '')
    l.gsub!(/\s+->.+$/, '')
    if l =~ /^\s*\+/
      force_result = true
      l.gsub!(/\+/, '')
    end
    if l =~ /function/ && l !~ /isFunction/
      func << l
    elsif l =~ /\);$/
      func << l.gsub(/\s+->.+$/, '').gsub(/\}/, '\n}')
      func.gsub!(/(['"]).+?(\1)/) do |s|
        s.gsub(/\\n/, '_NL_')
      end
      examples << { :multi_line => true, :force_result => force_result, :html => func }
      func = ''
    elsif func.length > 0
      func << '\n' + l
    elsif !l.empty?
      examples << {
        :multi_line => false,
        :force_result => force_result,
        :html => l.gsub(/\s+->.+$/, '').gsub(/\\n/, '_NL_')
      }
    end
  end
  examples.each do |ex|
    clean(ex)
  end
  examples
end

def clean(m)
  m.each do |key, value|
    if value.nil? || value == false
      m.delete(key)
    end
  end
end


def extract_docs(package)
  File.open("lib/#{package}.js", 'r') do |f|
    i = 0
    pos = 0
    f.read.scan(/\*\*\*.+?(?:\*\*\*\/|(?=\*\*\*))/m) do |b|
      if mod = b.match(/(\w+) module/)
        name = mod[1]
        if !@modules[name]
          @modules[name] = []
        end
        @current_module = @modules[name]
        @current_module_name = name
      else
        method = get_method(b)
        method[:package] = package
        method[:returns] = get_property(:returns, b)
        method[:short] = get_property(:short, b)
        method[:set] = get_property(:set, b)
        method[:extra] = get_property(:extra, b)
        method[:examples] = get_examples(b, method[:name])
        method[:alias] = get_property(:alias, b)
        method[:module] = @current_module_name
        get_html_parameters(method[:short])
        get_html_parameters(method[:extra])
        @current_module << method
        if method[:name] == 'stripTags' || method[:name] == 'removeTags' || method[:name] == 'escapeHTML' || method[:name] == 'unescapeHTML'
          method[:escape_html] = true
        end
        if method[:alias]
          method.delete_if { |k,v| v.nil? || (v.is_a?(Array) && v.empty?) }
          method[:short] = "Alias for <span class=\"code\">#{method[:alias]}</span>."
        end
        if method[:set]
          method[:pos] = pos
          pos += 1
        else
          pos = 0
        end
        if method[:name] =~ /\[/
          method[:set_base] = method[:name].gsub(/\w*\[(\w+?)\]\w*/, '\1')
          method[:name].gsub!(/[\[\]]/, '')
        end
        clean(method)
        #if current_module[:name] == 'Object' && method[:name] != 'create'
        #  instance_version = method.dup
        #  instance_version[:class_method] = false
        #  instance_version[:short].gsub!(/<span class=".*?">obj<\/span>/, 'the object')
        #  if method[:name] == 'merge'
        #    instance_version[:short].gsub!(/the first/, 'itself')
        #  end
        #  if method[:name] == 'equals'
        #    instance_version[:short].gsub!(/(<span class=".*?">a<\/span>).+are equal/, 'the object is equal to \\1')
        #  end
        #  instance_version[:params].delete_if { |p| p[:name] == 'obj' || p[:name] == 'a' }
        #  instance_version[:short] << ' This method is only available on objects created with the alternate constructor <span class="code">Object.create</span>.'
        #  current_module[:methods] << instance_version
        #end
      end
    end
  end
end

#puts pp @modules

extract_docs(:core)
extract_docs(:dates)
extract_docs(:inflections)

@modules.each do |name, mod|
  mod.sort! do |a,b|
    if a[:class_method] == b[:class_method]
      a[:name] <=> b[:name]
    else
      a[:class_method] ? -1 : 1
    end
  end
end

File.open(fileout, 'w') do |f|
  f.puts "SugarModules = #{@modules.to_json};"
end
