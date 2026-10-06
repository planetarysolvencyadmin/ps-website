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

# Note: the "wdm" gem is deliberately not used. 0.1.1 is abandoned and will not
# compile on Ruby 3.4+, and Jekyll's file watcher works fine without it on Windows.

# webrick is required for Ruby >= 3.0 to run `jekyll serve`
gem "webrick", "~> 1.8"
