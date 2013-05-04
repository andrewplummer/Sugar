
def get_full_size(path)
  File.size(path)
end

def get_minified_size(path, package = nil)
  tmp = "tmp/tmp.js"
  `cp #{path} #{tmp}`
  `gzip --best #{tmp}`
  size = File.size("#{tmp}.gz")
  # gzipping the packages together produces sizes
  # less than gzipping individually, so offset this
  # a bit... just eyeballin it
  size -= 210 if package && package != :regexp
  `rm #{tmp}.gz`
  size
end

