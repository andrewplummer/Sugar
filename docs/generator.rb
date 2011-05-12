
require 'cgi'
require 'pp'

fileout  = ARGV[0] || 'docs/output/docs.html'
template = 'docs/template.html'

def get_property(property, source)
  match = source.match(Regexp.new('@' + property.to_s + '(.*)$', (property == :example ? Regexp::MULTILINE : nil)))
  #replace = match ? CGI.escapeHTML(match[1]) : ''
  replace = match ? match[1].strip : nil
  if replace
    if property == :method
      #replace.gsub!(/[<>]/, '|')
      #replace.gsub!(/\|(.+?)\|/, '<span class="parameter">\\1</span>')
      get_parameter_html(replace)
      replace.gsub!(/\((.*)\)/, '<span class="parameters">(\\1)</span>')
    end
    if property == :description
      get_parameter_html(replace)
      replace.gsub!(/\[(.+?)\]/, '<span class="optional parameter">\\1</span>')
    end
    if property == :defaults
      replace.gsub!(/<(.*?)> = (.+?),?/, '<li><span class="parameter">\\1:</span> <span class="default">\\2</span></li>')
      replace.gsub!(/\[(.*?)\] = ([^,]+),?/, '<li><span class="optional parameter">\\1:</span> <span class="default">\\2</span></li>')
      replace = "<div class=\"defaults\"><h6 class=\"label\">Defaults:</h6><ul>#{replace}</ul></div>"
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


def get_parameter_html(source)
  source.gsub!(/<.+?>/) do |param|
    param.gsub!(/[<>]/, '')
    '<span class="parameter">'+param+'</span>'
  end
  source.gsub!(/\[.+?\]/) do |param|
    param.gsub!(/[\[\]]/, '')
    '<span class="optional parameter">'+param+'</span>'
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
    #defaults = get_defaults(b)
    m = {
      :method => get_property(:method, b),
      :description => get_property(:description, b),
      :defaults => get_property(:defaults, b),
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
