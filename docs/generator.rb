
require 'rubygems'
require 'json'
require 'pp'

fileout  = ARGV[0] || '/Volumes/Andrew/Sites/sugarjs.com/public_html/methods.php'

fileout_html  = File.open(fileout, 'r').read if File.exists?(fileout)

modules = []
@current_module = nil


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
  str.gsub!(/%(.+?)%/, '<span class="code">\1</span>')
end

def get_method(s)
  raw = get_property(:method, s)
  match = raw.match(/(.+\.)?(.+)\((.+)?\)/)
  params = []
  accepts_unlimited_params = false
  if match[3]
    p = match[3].split(/,(?!')/)
    if p.last =~ /\.\.\./
      p.delete_at(-1)
      accepts_unlimited_params = true
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
  {
    :name => match[2],
    :class_method => !!match[1],
    :params => params,
    :accepts_unlimited_params => accepts_unlimited_params
  }
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
      examples << { :multi_line => true, :force_result => force_result, :html => func }
      func = ''
    elsif func.length > 0
      func << '\n' + l
    elsif !l.empty?
      examples << {
        :multi_line => false,
        :force_result => force_result,
        :html => l.gsub(/\s+->.+$/, '')
      }
    end
  end
  examples
end


File.open('lib/sugar.js', 'r') do |f|
  i = 0
  f.read.scan(/\*\*\*.+?(?:\*\*\*\/|(?=\*\*\*))/m) do |b|
    if mod = b.match(/(\w+) module/)
      if @current_module
        modules << @current_module
      end
      @current_module = { :name => mod[1], :methods => [] }
    else
      method = get_method(b)
      method[:returns] = get_property(:returns, b)
      method[:short] = get_property(:short, b)
      method[:extra] = get_property(:extra, b)
      method[:examples] = get_examples(b, method[:name])
      method[:alias] = get_property(:alias, b)
      method[:module] = @current_module[:name]
      get_html_parameters(method[:short])
      get_html_parameters(method[:extra])
      @current_module[:methods] << method
      if method[:name] == 'stripTags' || method[:name] == 'removeTags'
        method[:escape_html] = true
      end
      if method[:alias]
        method.delete_if { |k,v| v.nil? || (v.is_a?(Array) && v.empty?) }
        href = "#{method[:module].downcase}_#{method[:alias]}"
        method[:short] = "Alias for <a class=\"alias\" href=\"##{href}\">#{method[:alias]}</a>."
      end
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
  modules << @current_module
end

#puts pp modules


modules.each do |mod|
  mod[:methods].sort! do |a,b|
    if a[:class_method] == b[:class_method]
      a[:name] <=> b[:name]
    else
      a[:class_method] ? -1 : 1
    end
  end
end

if File.exists?(fileout)
  File.open(fileout, 'w') do |f|
    f.puts fileout_html.gsub(/SugarModules = .+/, "SugarModules = #{modules.to_json};")
  end
end
