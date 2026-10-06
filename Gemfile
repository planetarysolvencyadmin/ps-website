source "https://rubygems.org"

gem "jekyll", "~> 4.3"

group :jekyll_plugins do
  gem "jekyll-sitemap"
  gem "jekyll-feed"
end

# Windows and JRuby does not include zoneinfo files
platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# webrick is required for Ruby >= 3.0 to run `jekyll serve`
gem "webrick", "~> 1.8"
