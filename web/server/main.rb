require 'sinatra'

#--------
# routing
#--------

enable :static
set :public_dir, 'web'

get '/' do
  send_file File.join(settings.public_dir, 'index.html')
end
