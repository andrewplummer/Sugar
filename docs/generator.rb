
require 'cgi'
require 'pp'

fileout  = ARGV[0] || 'docs/output/docs.html'
template = 'docs/template.html'

def get_property(property, source, defaults = {})
  match = source.match(Regexp.new('@' + property.to_s + '(.*)$', (property == :example ? Regexp::MULTILINE : nil)))
  #replace = match ? CGI.escapeHTML(match[1]) : ''
  replace = match ? match[1].strip : nil
  if replace
    if property == :method
      #replace.gsub!(/[<>]/, '|')
      #replace.gsub!(/\|(.+?)\|/, '<span class="parameter">\\1</span>')
      get_parameter_html(replace, defaults)
      replace.gsub!(/,/, '<span class="comma small">,</span>')
      replace.gsub!(/(.*)\((.*)\)/, '<span class="name">\\1</span><span class="parenthesis small">(</span>\\2<span class="parenthesis small">)</span>')
    end
    if property == :description
      get_parameter_html(replace, defaults, false)
      replace.gsub!(/\[(.+?)\]/, '<span class="optional parameter">\\1</span>')
    end
    if property == :defaults
      replace.gsub!(/<(.*?)> = ([^\s*?])/, '<span class="parameter">\\1</span> = <span class="default">\\2</span>')
    end
    if property == :example
      result = ''
      multi = false
      replace.lines do |l|
        l.gsub!(/\s*?\*(\/)?(\s\s\s)?/, '')
        next if l.empty?
        if l =~ /function\s?\(.*?\)/
          multi = true
          l.gsub!(/\n/, '<br/>')
          l = '<div class="example"><pre class="statement sh_javascript">' + l
        elsif l =~ /->/ && !multi
        #  l.gsub!(/->(\s*.*?)$/, '<span class=\"split\">-&gt;</span><span class=\"result\">\\1</span>')
          l.gsub!(/\n?(.*?\s*)->(\s*.*?)$/, "\n              <div class=\"example\"><pre class=\"statement sh_javascript\">\\1</pre><span class=\"split\">-&gt;</span><span class=\"result\">\\2</span></div>")
        elsif l =~ /;/
          multi = false
          l.gsub!(/\n/, '<br/>')
          l = l + '</pre></div>'
        end
        result << l
      end
      replace = result
    end
  end
  replace
end


def get_parameter_html(source, defaults, include_defaults = true)
  source.gsub!(/<.+?>/) do |param|
    param.gsub!(/[<>]/, '')
    default = defaults[param]
    default = defaults[param]
    if default =~ /['"].*['"]/
      type = :string
    elsif default =~ /\d+/
      type = :number
    elsif default =~ /^null$/
      type = :null
    else
      type = ''
    end
    default = '<span class="' + type.to_s + ' value">' + CGI::escapeHTML(default || '') + '</span>'
#    title = default ? ' title="Default: '+CGI::escapeHTML(default)+'"' : ''
    result = '<span class="parameter small">'+param+'</span>'
    result += '<span class="default small"><span class="equals small">=</span>'+default+'</span>' if include_defaults
    result
  end
  source.gsub!(/\[.+?\]/) do |param|
    param.gsub!(/[\[\]]/, '')
    default = defaults[param]
    if default =~ /['"].*['"]/
      type = :string
    elsif default =~ /\d+/
      type = :number
    elsif default =~ /^null$/
      type = :null
    else
      type = ''
    end
    default = '<span class="' + type.to_s + ' value">' + CGI::escapeHTML(default || '') + '</span>'
#    title = default ? ' title="Optional. Default: '+CGI::escapeHTML(default)+'"' : ' title="Optional."'
#    '<span class="optional parameter"'+title+'>'+param+'</span>'
    result = '<span class="optional parameter small">'+param+'</span>'
    result += '<span class="default small"><span class="equals small">=</span>'+default+'</span>' if include_defaults
    result
  end
end

def get_module(source)
  match = source.match(/(\w+) module/)
  return match ? match[1] : nil
end

def get_defaults(source)
  d = {}
  match = source.match(/@defaults (.+?)$/)
  if match
    match[1].split(',').each do |f|
      s = f.split(' = ')
      key = s[0].gsub(/[<>\[\]]/, '').strip
      value = s[1].strip
      d[key] = value
    end
  end
  d
end

html = ''
row_reg = /\s*<li class="method">.*?<\/li>/m
fileout_html  = File.open(fileout, 'r').read
template_html = File.open(template, 'r').read
row_html = template_html.match(row_reg)[0]

modules = []
current_module = nil




File.open('lib/sugar.js', 'r') do |f|
  f.read.scan(/\/\*\*.*?\*\//m) do |b|
    #h = row_html
    mod = get_module(b)
    defaults = get_defaults(b)
    m = {
      :method => get_property(:method, b, defaults),
      :description => get_property(:description, b, defaults),
      :returns => get_property(:returns, b),
      :extra => get_property(:extra, b),
      :example => get_property(:example, b)
    }
    if mod
      if current_module
        modules << current_module
      end
      current_module = { :name => mod, :methods => [] }
    elsif current_module
#      puts m.inspect
      current_module[:methods] << m
    end
   # html += h
  end
end

modules << current_module

methods = []

modules.each do |mod|
  #mod[:methods] = mod[:methods].sort_by { |m| m[:method] }
  mod[:methods].each do |method|
    method[:module] = mod[:name]
    methods << method
  end
end

methods.sort_by{ |method| method[:method] }.each do |method|
  h = row_html.dup
  h.gsub!(/\{MODULE\}/, method[:module])
  method.each do |k,v|
    h.gsub!(Regexp.new("\\{#{k.to_s.upcase}\\}"), v || '')
  end
  html << h
end


File.open(fileout, 'w') do |f|
  f.puts fileout_html.gsub(/<ul class="method_list">.*?<\/ul>/m, '<ul class="method_list">  ' + html + "\n  </ul>")
end
