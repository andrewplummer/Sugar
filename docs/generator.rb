
require 'rubygems'
require 'json'

fileout  = ARGV[0] || '/Volumes/Andrew/Sites/sugarjs.com/public_html/methods.php'

fileout_html  = File.open(fileout, 'r').read

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
  str.gsub!(/%(.+)%/, '<span class="code">\1</span>')
end

def get_method(s)
  raw = get_property(:method, s)
  match = raw.match(/(.+\.)?(.+)\((.+)?\)/)
  params = []
  full_html = "<span class=\"name\">#{match[1]}</span><span class=\"parenthesis\">(</span>"
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
      full_html << "<span class=\"#{css}\">#{name}</span>"
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
        end
        d = '<span class="' + type.to_s + ' value">' + d + '</span>'
        full_html << "<span class=\"default\"><span class=\"equals\">=</span> #{d}</span>" if default
      end
      full_html << '<span class="comma">,</span>' if i < p.length - 1
      {
        :name => name,
        :type => type,
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
    :name => match[2],
    :class_method => !!match[1],
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
      func << l + '\n&nbsp;&nbsp;'
    elsif l =~ /\}\);$/
      func << l.gsub(/\s+->.+$/, '')
      examples << { :multi_line => true, :html => func }
      func = ''
    elsif func.length > 0
      func << '\n' + l + '\n&nbsp;&nbsp;'
    elsif !l.empty?
      examples << {
        :multi_line => false,
        :html => l.gsub(/\s+->.+$/, '')
      }
    end
  end
  examples
end


File.open('lib/sugar.js', 'r') do |f|
  i = 0
  f.read.scan(/\/\*\*\*.*?\*\*\*/m) do |b|
    if mod = b.match(/(\w+) module/)
      if current_module
        modules << current_module
      end
      current_module = { :name => mod[1], :methods => [] }
    else
      method = get_method(b)
      method[:returns] = get_property(:returns, b)
      method[:description] = get_property(:description, b)
      method[:examples] = get_examples(b)
      method[:module] = current_module[:name]
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

File.open(fileout, 'w') do |f|
  f.puts fileout_html.gsub(/SugarModules = .+/, "SugarModules = #{modules.to_json};")
end
