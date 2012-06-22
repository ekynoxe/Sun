require 'rubygems'
require 'sinatra'
require 'erb'
require 'yaml'

# application settings
SETTINGS = YAML.load_file('sun.yml')

get '/' do
    erb :index
end

not_found do
  @title = "Not found"
  erb :'partials/_404'
end