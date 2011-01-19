
require 'cgi'

fileout  = ARGV[0] || 'docs/output/docs.html'
template = 'docs/template.html'

def get_property(property, source)
  match = source.match(Regexp.new('@' + property.to_s + '(.*)$'))
  #replace = match ? CGI.escapeHTML(match[1]) : ''
  replace = match ? match[1].strip : nil
end


html = ''
row_reg = /\s*<tr class="method">.*?<\/tr>/m
fileout_html  = File.open(fileout, 'r').read
template_html = File.open(template, 'r').read
row_html = template_html.match(row_reg)[0]

modules = []
current_module = nil




File.open('lib/sugar.js', 'r') do |f|
  f.read.scan(/\/\*\*.*?\*\//m) do |b|
    #h = row_html
    mod = get_property(:module, b)
    m = {
      :method => get_property(:method, b),
      :parameters => get_property(:parameters, b),
      :returns => get_property(:returns, b),
      :description => get_property(:description, b)
    }
    if(mod)
      if(current_module)
        modules << current_module
      end
      current_module = { :name => mod, :methods => [] }
    elsif(current_module && m.values.all? { |s| !s.nil? })
      current_module[:methods] << m
    end
   # html += h
  end
end

modules << current_module


modules.each do |mod|
  mod[:methods] = mod[:methods].sort_by { |m| m[:method] }
  mod[:methods].each do |m|
    h = row_html.dup
    h.gsub!(/\{MODULE\}/, mod[:name])
    m.each do |k,v|
      h.gsub!(Regexp.new("\\{#{k.to_s.upcase}\\}"), v)
    end
    html << h
  end
end


File.open(fileout, 'w') do |f|
  f.puts fileout_html.gsub(/<tbody>.*?<\/tbody>/m, "<tbody>  " + html + "\n  </tbody>")
end
