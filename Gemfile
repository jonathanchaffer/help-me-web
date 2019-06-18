source "https://rubygems.org"

ruby "2.4.2"

# Bundle edge Rails instead: gem "rails", github: "rails/rails"
gem "rails", "~> 5.1"
# Use postgresql as the database for Active Record
gem "pg", "~> 0.18"
# Use Puma as the app server
gem "puma", "~> 3.0"

# Authentication
gem "devise_token_auth"
gem "omniauth"

gem "active_model_serializers"
gem "interactor"

group :development, :test do
  gem "rspec-rails"
  gem "pry-rails"
end

group :development do
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
end

group :test do
  gem "database_cleaner"
  gem "factory_girl_rails"
  gem "shoulda-matchers"
  gem "timecop"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem 'rack-cors', require: 'rack/cors'

#  Provide stopword support for when we are looking for similar questions
gem "stopwords-filter", require: 'stopwords'
