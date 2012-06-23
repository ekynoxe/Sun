require 'rubygems'
require 'sinatra'
require 'erb'
require 'yaml'

# application settings
SETTINGS = YAML.load_file('sun.yml')

get '/' do
    erb :index
end

get '/playground' do
	erb_special(:playground, :'layouts/playground_layout')
end

not_found do
  @title = "Not found"
  erb :'partials/_404'
end

def erb_special(template, layout, options={})
  erb template, options.merge(:layout => layout)
end