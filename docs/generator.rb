
require 'cgi'
require 'pp'
require 'rubygems'
require 'json'

fileout  = ARGV[0] || '/Volumes/Andrew/Sites/sugarjs.com/public_html/methods.php'
template = 'docs/template.html'

#def get_property(property, source, defaults = {})
#  if property == :name
#    property = :method
#    name = true
#  end
#  match = source.match(Regexp.new('@' + property.to_s + '(.*)$', (property == :example ? Regexp::MULTILINE : nil)))
#  #replace = match ? CGI.escapeHTML(match[1]) : ''
#  replace = match ? match[1].strip : nil
#  if replace
#    if property == :method && !name
#      #replace.gsub!(/[<>]/, '|')
#      #replace.gsub!(/\|(.+?)\|/, '<span class="parameter">\\1</span>')
#      get_parameter_html(replace, defaults)
#      replace.gsub!(/,/, '<span class="comma small">,</span>')
#      replace.gsub!(/\.\.\./, '<span class="ellipsis small">...</span>')
#      replace.gsub!(/(.*)\((.*)\)/, '<span class="name">\\1</span><span class="parenthesis small">(</span>\\2<span class="parenthesis small">)</span>')
#    end
#    if property == :description
#      get_parameter_html(replace, defaults, false)
#      replace.gsub!(/\[(.+?)\]/, '<span class="optional parameter">\\1</span>')
#    end
#    if property == :defaults
#      replace.gsub!(/<(.*?)> = ([^\s*?])/, '<span class="parameter">\\1</span> = <span class="default">\\2</span>')
#    end
#    if property == :example
#      result = ''
#      multi = false
#      replace.lines do |l|
#        l.gsub!(/\s*?\*(\/)?(\s\s\s)?/, '')
#        l.gsub!(/^\s+$/, '')
#        next if l.empty?
#        if l =~ /function\s?\(.*?\)\s*\{\s*\n/
#          multi = true
#          l.gsub!(/\n/, '<br/>')
#          l = '<div class="example"><pre class="statement sh_javascript">' + l
#        elsif l =~ /->/ && !multi
#        #  l.gsub!(/->(\s*.*?)$/, '<span class=\"split\">-&gt;</span><span class=\"result\">\\1</span>')
#          l.gsub!(/\n?(.*?\s*)->(\s*.*?)$/, "\n              <div class=\"example\"><pre class=\"statement sh_javascript\">\\1</pre><span class=\"monospace result\"><span class=\"split\">-&gt;</span>\\2</span></div>")
#        elsif l =~ /^\s*\}\);/
#          multi = false
#          l.gsub!(/\n/, '<br/>')
#          l = l + '</pre></div>'
#        else
#          l.gsub!(/\s*(.*?);$/, "\n              <div class=\"example\"><pre class=\"statement sh_javascript\">\\1;</pre>")
#        end
#        result << l
#      end
#      replace = result
#    end
#  end
#  replace
#end
#
#
#def get_parameter_html(source, defaults, include_defaults = true)
#  source.gsub!(/<.+?>/) do |param|
#    param.gsub!(/[<>]/, '')
#    default = defaults[param]
#    default = defaults[param]
#    if default =~ /['"].*['"]/
#      type = :string
#    elsif default =~ /\d+/
#      type = :number
#    elsif default =~ /^null$/
#      type = :null
#    end
#    result = '<span class="parameter small">'+param+'</span>'
#    if default && include_defaults
#      default = '<span class="' + type.to_s + ' value">' + CGI::escapeHTML(default || '') + '</span>'
#      result += '<span class="default small"><span class="equals small">=</span>'+default+'</span>'
#    end
#    result
#  end
#  source.gsub!(/\[.+?\]/) do |param|
#    param.gsub!(/[\[\]]/, '')
#    default = defaults[param]
#    if default =~ /['"].*['"]/
#      type = :string
#    elsif default =~ /\d+/
#      type = :number
#    elsif default =~ /^null$/
#      type = :null
#    end
#    result = '<span class="optional parameter small">'+param+'</span>'
#    if default && include_defaults
#      default = '<span class="' + type.to_s + ' value">' + CGI::escapeHTML(default || '') + '</span>'
#      result += '<span class="default small"><span class="equals small">=</span>'+default+'</span>' if include_defaults
#    end
#    result
#  end
#end
#
#def get_defaults(source)
#  d = {}
#  match = source.match(/@defaults (.+?)$/)
#  if match
#    match[1].split(/,(?!')/).each do |f|
#      s = f.split(' = ')
#      key = s[0].gsub(/[<>\[\]]/, '').strip
#      value = s[1].strip
#      d[key] = value
#    end
#  end
#  d
#end

html = ''
row_reg = /\s*<li class="method" id="">.*?<\/li>/m
fileout_html  = File.open(fileout, 'r').read
template_html = File.open(template, 'r').read
row_html = template_html.match(row_reg)[0]

modules = []
current_module = nil


def get_property(prop, s, multiline = false)
  if multiline
    r = Regexp.new('@'+prop.to_s+'[\s*]+\*\n(.+)\*\n', Regexp::MULTILINE)
    s.scan(r)[0][0].split(/\n/)
  else
    match = s.match(Regexp.new('@'+prop.to_s+' (.*)'))
    match[1]
  end
end

def get_html_parameters(str)
  str.gsub!(/<(.+?)>/, '<span class="required parameter">\1</span>')
  str.gsub!(/\[(.+?)\]/, '<span class="optional parameter">\1</span>')
end

def get_method(s)
  raw = get_property(:method, s)
  match = raw.match(/(.+)\((.+)?\)/)
  params = []
  full_html = "<span class=\"name\">#{match[1]}</span><span class=\"parenthesis\">(</span>"
  accepts_unlimited_params = false
  if match[2]
    p = match[2].split(/,(?!')/)
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
      full_html << "<span class=\"#{css}\">#{name}</span>"
      if default
        d = default[1]
        if d =~ /['"].*['"]/
          type = :string
          d.gsub!(/(['"])(.+)(['"])/, '\\1<span class="monospace">\\2</span>\\3')
        elsif d =~ /\d+/
          type = :number
        elsif d =~ /^null$/
          type = :null
        elsif d =~ /true|false/
          type = :boolean
        end
        d = '<span class="' + type.to_s + ' value">' + d + '</span>'
        full_html << "<span class=\"default\"><span class=\"equals\">=</span> #{d}</span>" if default
      end
      full_html << '<span class="comma">,</span>' if i < p.length - 1
      {
        :name => name,
        :required => required,
        :default => default ? default[1] : nil
      }
    end
    full_html << '<span class="ellipsis">, ...</span>' if accepts_unlimited_params
  else
    params = []
  end
  full_html << '<span class="parenthesis">)</span>'
  {
    :full_raw => raw,
    :full_html => full_html,
    :name => match[1],
    :params => params,
    :accepts_unlimited_params => accepts_unlimited_params
  }
end

def get_examples(s)
  lines = get_property(:example, s, true)
  examples = []
  func = ''
  lines.each do |l|
    l.gsub!(/^[\s*]+/, '')
    if l =~ /function/
      func << l + '_BR_'
    elsif l =~ /\}\);$/
      func << l.gsub(/\s+->.+$/, '')
      examples << func
      func = ''
    elsif func.length > 0
      func << '  ' + l + '_BR_'
    elsif !l.empty?
      examples << l.gsub(/\s+->.+$/, '')
    end
  end
  examples
end


File.open('lib/sugar.js', 'r') do |f|
  i = 0
  f.read.scan(/\/\*\*\*.*?\*\*\*/m) do |b|
    #h = row_html
    if mod = b.match(/(\w+) module/)
      if current_module
        modules << current_module
      end
      current_module = { :name => mod[1], :methods => [] }
    else
      method = get_method(b)
      method[:class_method] = !!method[:name].match(Regexp.new("^#{current_module[:name]}\."))
      method[:returns] = get_property(:returns, b)
      method[:description] = get_property(:description, b)
      method[:examples] = get_examples(b)
      get_html_parameters(method[:description])
      current_module[:methods] << method
    end
  end
end

puts modules.to_json


modules.each do |mod|
  mod[:methods].sort! do |a,b|
    if a[:class_method] == b[:class_method]
      a[:name] <=> b[:name]
    else
      a[:class_method] ? 1 : -1
    end
  end
end
#modules << current_module
#
#methods = []
#
#modules.each do |mod|
#  #mod[:methods] = mod[:methods].sort_by { |m| m[:method] }
#  mod[:methods].each do |method|
#    method[:module] = mod[:name]
#    methods << method
#  end
#end
#
#methods.sort_by{ |method| method[:name] }.each do |method|
#  h = row_html.dup
#  h.gsub!(/\{MODULE\}/, method[:module])
#  id = method[:name].downcase.gsub(/\(.*?\)/, '').gsub(/\./, '_')
#  h.gsub!(/id=""/, "id=\"#{id}\"")
#  method.each do |k,v|
#    h.gsub!(Regexp.new("\\{#{k.to_s.upcase}\\}"), v || '')
#  end
#  html << h
#end
#
#
File.open(fileout, 'w') do |f|
  f.puts fileout_html.gsub(/SugarModules = .+/, "SugarModules = #{modules.to_json};")
end
