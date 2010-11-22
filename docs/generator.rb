
require 'cgi'

filein  = ARGV[0]
fileout = ARGV[1] || 'docs/output/docs.html'

def get_property(property, source, output)
  match = source.match(Regexp.new('@' + property.to_s + '(.*)$'))
  replace = match ? CGI.escapeHTML(match[1]) : ''
  output.gsub(Regexp.new("\\{#{property.to_s.upcase}\\}"), replace)
end


html = ''
row_reg = /\s*<tr class="method">.*<\/tr>/m
template_html = File.open('docs/template.html', 'r').read
row_html = template_html.match(row_reg)[0]

File.open(filein, 'r') do |f|
  f.read.scan(/\/\*\*.*?\*\//m) do |b|
    h = row_html
    h = get_property(:method, b, h)
    h = get_property(:parameters, b, h)
    h = get_property(:returns, b, h)
    h = get_property(:description, b, h)
    html += h
  end
end

result = template_html.gsub(row_reg, html)

puts result
File.open(fileout, 'w') do |f|
  f.write result
end
