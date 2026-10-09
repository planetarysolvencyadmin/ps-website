#!/usr/bin/env ruby
# Checks the site's content and data for the mistakes people (and AI tools) most often make.
#
#   ruby scripts/validate-site.rb
#
# It reads files only: no network, no gems beyond Ruby itself. Run it before opening a pull request
# (CI runs it on every pull request). Exit code 1 means at least one error; warnings never fail the run.
# What it checks: every _data/*.yml file parses; reports, team, partners, images, navigation and posts have
# the fields the templates need; links are https; image ids and cover ids exist; menu anchors exist on their pages.

require 'yaml'
require 'date'
require 'uri'

Encoding.default_external = Encoding::UTF_8
ROOT = File.expand_path('..', __dir__)
Dir.chdir(ROOT)

@errors = []
@warnings = []
def err(where, msg)  = @errors << "#{where}: #{msg}"
def warn_(where, msg) = @warnings << "#{where}: #{msg}"

def load_yaml(path)
  YAML.safe_load(File.read(path), permitted_classes: [Date, Time], aliases: false)
rescue Psych::Exception => e
  err(path, "does not parse as YAML (#{e.message.lines.first.strip}). Check indentation and quote any value containing a colon.")
  nil
end

def blank?(v) = v.nil? || v.to_s.strip.empty?
def https?(v) = v.to_s.start_with?('https://')

def check_url(where, label, v, required: false)
  if blank?(v)
    err(where, "#{label} is missing") if required
  elsif !https?(v)
    err(where, "#{label} must start with https:// (got #{v.inspect})")
  elsif v.to_s =~ /\s/
    err(where, "#{label} contains a space (#{v.inspect})")
  end
end

data = {}
Dir['_data/*.yml'].sort.each { |f| data[File.basename(f, '.yml')] = load_yaml(f) }

# --- Reports
reports = data['reports']
if reports.is_a?(Array)
  covers = data['cover_files'] || {}
  reports.each_with_index do |r, i|
    w = "_data/reports.yml, entry #{i + 1} (#{r.is_a?(Hash) ? r['title'] : '?'})"
    unless r.is_a?(Hash) then err(w, 'is not a set of fields'); next end
    %w[year title url question summary].each { |k| err(w, "#{k} is missing") if blank?(r[k]) }
    err(w, "year should be a four-digit number (got #{r['year'].inspect})") unless r['year'].to_s =~ /\A\d{4}\z/
    check_url(w, 'url', r['url'])
    check_url(w, 'pdf', r['pdf'])
    if r['cover'].nil? then warn_(w, 'has no cover, so the grid shows a year placeholder')
    elsif !covers.key?(r['cover'])
      err(w, "cover \"#{r['cover']}\" has no processed files. Put the image in _uploads/ and run: node scripts/process-covers.mjs")
    end
    err(w, 'uses the old `image:` field; use `cover:` (see IMAGES.md, Report covers)') if r.key?('image')
  end
else
  err('_data/reports.yml', 'should be a list of reports') unless reports.nil?
end

# --- Team
team = data['team']
if team.is_a?(Array)
  team.each_with_index do |p, i|
    w = "_data/team.yml, entry #{i + 1} (#{p.is_a?(Hash) ? p['name'] : '?'})"
    unless p.is_a?(Hash) then err(w, 'is not a set of fields'); next end
    %w[name role].each { |k| err(w, "#{k} is missing") if blank?(p[k]) }
    if !p['bio'].is_a?(Array) then err(w, 'bio must be a list of paragraphs (each starting with "- ")')
    elsif p['bio'].empty? then warn_(w, 'has no bio, so the page shows "Biography to follow"')
    end
    warn_(w, 'role says "to be confirmed"') if p['role'].to_s =~ /to be confirmed/i
    check_url(w, 'linkedin', p['linkedin']) unless blank?(p['linkedin'])
    err(w, "photo \"#{p['photo']}\" has no processed files. Put the original in _uploads/team/ and run: node scripts/process-team-photos.mjs") if !blank?(p['photo']) && !File.exist?("assets/images/team/#{p['photo']}-320.jpg")
  end
  names = team.filter_map { |p| p['name'] if p.is_a?(Hash) }
  (names.select { |n| names.count(n) > 1 }.uniq).each { |n| err('_data/team.yml', "#{n} appears more than once") }
end

# --- Social links
social = data['social']
if social.is_a?(Array)
  social.each_with_index do |l, i|
    w = "_data/social.yml, entry #{i + 1} (#{l.is_a?(Hash) ? l['name'] : '?'})"
    unless l.is_a?(Hash) then err(w, 'is not a set of fields'); next end
    err(w, 'name is missing') if blank?(l['name'])
    check_url(w, 'url', l['url'], required: true)
    err(w, '`show` must be true or false') unless [true, false].include?(l['show'])
  end
end

# --- Analytics
an = data['analytics']
if an.is_a?(Hash) && an['enabled']
  err('_data/analytics.yml', 'measurement_id must look like G-XXXXXXXXXX') unless an['measurement_id'].to_s =~ /\AG-[A-Z0-9]+\z/
end

# --- Partners
partners = data['partners']
if partners.is_a?(Array)
  seen = []
  partners.each_with_index do |g, i|
    w = "_data/partners.yml, group #{i + 1} (#{g.is_a?(Hash) ? g['group'] : '?'})"
    unless g.is_a?(Hash) && g['partners'].is_a?(Array) then err(w, 'needs `group:` and a `partners:` list'); next end
    err(w, 'group name is missing') if blank?(g['group'])
    g['partners'].each do |p|
      name = p.is_a?(Hash) ? p['name'] : p
      err(w, "partner #{p.inspect} must be written as `- name: ...` (with an optional `url:`), not a bare name") unless p.is_a?(Hash)
      err(w, "a partner has no name (#{p.inspect})") if blank?(name)
      check_url(w + " > #{name}", 'url', p['url']) if p.is_a?(Hash)
      err(w, "#{name}: logo \"#{p['logo']}\" is not in assets/images/partners/") if p.is_a?(Hash) && !blank?(p['logo']) && !File.exist?(File.join('assets/images/partners', p['logo'].to_s))
      warn_(w, "#{name} is listed more than once") if seen.include?(name.to_s.downcase)
      seen << name.to_s.downcase
    end
  end
end

# --- Image library
images = data['images'] || {}
files = data['image_files'] || {}
images.each do |id, meta|
  w = "_data/images.yml, #{id}"
  err(w, 'is not a set of fields') && next unless meta.is_a?(Hash)
  err(w, 'alt text is missing') unless meta.key?('alt') && !blank?(meta['alt'])
  %w[credit licence].each { |k| err(w, "#{k} is missing") if blank?(meta[k]) }
  warn_(w, 'credit or licence still says TO CONFIRM') if "#{meta['credit']} #{meta['licence']}" =~ /TO CONFIRM/i
  err(w, 'has no processed files. Run: node scripts/process-images.mjs') unless files.key?(id)
end
Array(data['hero_images']).each { |id| err('_data/hero_images.yml', "\"#{id}\" is not in images.yml") unless images.key?(id) }
Array(data['home_sections']).each do |s|
  err('_data/home_sections.yml', "image \"#{s['image']}\" is not in images.yml") if s['image'] && !images.key?(s['image'])
end

# --- Menu anchors must exist on their page
Array(data['navigation']).each do |sec|
  page = "#{sec['url'].to_s.gsub('/', '')}.md"
  unless File.exist?(page) then err('_data/navigation.yml', "#{sec['title']}: no page #{page} for #{sec['url']}"); next end
  text = File.read(page)
  Array(sec['items']).each do |it|
    a = it['anchor']
    next if blank?(a)
    err('_data/navigation.yml', "#{sec['title']} > #{it['title']}: no #{a} anchor in #{page}") unless text.match?(/\{[^}\n]*##{Regexp.escape(a)}(?![\w-])/)
  end
end
Array(data['home_sections']).each do |s|
  err('_data/home_sections.yml', "#{s['url']} is not in the menu (navigation.yml)") unless Array(data['navigation']).any? { |n| n['url'] == s['url'] }
end

# --- Pages and posts: front matter
def front_matter(path)
  text = File.read(path)
  return nil unless text.start_with?("---")
  yml = text.split(/^---\s*$/, 3)[1]
  YAML.safe_load(yml.to_s, permitted_classes: [Date, Time], aliases: false) || {}
rescue Psych::Exception => e
  err(path, "front matter does not parse (#{e.message.lines.first.strip}). Quote any value containing a colon.")
  nil
end

Dir['*.md'].reject { |f| %w[README.md EDITING.md IMAGES.md AGENTS.md CLAUDE.md GEMINI.md].include?(f) }.sort.each do |f|
  fm = front_matter(f)
  if fm.nil? then err(f, 'has no front matter (the lines between --- at the top), so the site will not build it as a page'); next end
  err(f, 'title is missing') if blank?(fm['title'])
  err(f, 'layout is missing') if blank?(fm['layout'])
  err(f, 'description is missing (used by search engines)') if blank?(fm['description']) && fm['layout'] == 'page' && f != '404.md'
  File.read(f).scan(/\]\((http:\/\/[^)\s]+)\)/) { |m| err(f, "link uses http://, use https:// (#{m[0]})") }
  File.read(f).scan(/<(?!a |\/a>|br|\/?em|\/?strong)[a-z][^>]*>/i) { |m| warn_(f, "contains HTML (#{m.strip[0, 40]}). EDITING.md asks for the markdown patterns instead") } unless f == '404.md'
end

Dir['_posts/*'].sort.each do |f|
  fm = front_matter(f)
  next err(f, 'has no front matter') if fm.nil?
  err(f, 'filename should look like 2026-10-08-short-title.md') unless File.basename(f) =~ /\A\d{4}-\d{2}-\d{2}-.+\.(md|markdown)\z/
  err(f, 'title is missing') if blank?(fm['title'])
  err(f, 'date is missing') if blank?(fm['date'])
  err(f, "kind must be news or commentary (got #{fm['kind'].inspect})") if fm.key?('kind') && !%w[news commentary].include?(fm['kind'])
  check_url(f, 'link', fm['link'])
  err(f, 'a post that links to an outside article should also name the outlet in `source`') if !blank?(fm['link']) && blank?(fm['source'])
end


# --- Pages CMS configuration (.pages.yml) must agree with the files it edits
if File.exist?('.pages.yml')
  cfg = load_yaml('.pages.yml')
  if cfg.is_a?(Hash)
    field_names = lambda do |fields|
      Array(fields).flat_map { |f| f.is_a?(Hash) ? [f['name']] : [] }
    end
    keys_ok = lambda do |where, record, fields|
      next unless record.is_a?(Hash) && fields.is_a?(Array)
      known = field_names.call(fields)
      (record.keys - known).each { |k| err(where, "has a `#{k}` field that .pages.yml does not list, so Pages CMS would drop it when saving. Add it to .pages.yml (or remove it here).") }
      fields.each do |f|
        next unless f.is_a?(Hash) && f['type'] == 'object' && record[f['name']]
        Array(record[f['name']]).each { |sub| keys_ok.call("#{where} > #{f['name']}", sub, f['fields']) }
      end
    end
    walk = lambda do |items|
      Array(items).each do |c|
        next unless c.is_a?(Hash)
        walk.call(c['items']) if c['type'] == 'group'
        w = ".pages.yml, #{c['name']}"
        case c['type']
        when 'file'
          unless File.exist?(c['path'].to_s) then err(w, "path #{c['path']} does not exist"); next end
          next unless c['fields'].is_a?(Array) && c['format'].to_s == 'yaml'
          content = load_yaml(c['path'])
          if c['list'] == true
            err(w, "#{c['path']} should be a list (each entry starting with \"- \") because `list: true` is set") unless content.is_a?(Array)
            Array(content).each_with_index { |rec, i| keys_ok.call("#{c['path']}, entry #{i + 1}", rec, c['fields']) }
          else
            keys_ok.call(c['path'], content, c['fields'])
          end
        when 'collection'
          err(w, "folder #{c['path']} does not exist") unless Dir.exist?(c['path'].to_s)
          next unless c['fields'].is_a?(Array)
          Dir["#{c['path']}/*"].sort.each do |f|
            fm = front_matter(f)
            keys_ok.call(f, fm.reject { |k, _| k == 'body' }, c['fields']) if fm
          end
        end
      end
    end
    walk.call(cfg['content'])
  end
end

# --- Uploads referenced but unused or missing
Dir['_uploads/*'].each { |f| warn_(f, 'is not used by any report cover') if File.file?(f) && !(reports || []).any? { |r| r.is_a?(Hash) && r['cover'] == File.basename(f, '.*').downcase.gsub(/[^a-z0-9]+/, '-') } }

puts "Warnings (#{@warnings.size}):" unless @warnings.empty?
@warnings.each { |m| puts "  - #{m}" }
puts "Errors (#{@errors.size}):" unless @errors.empty?
@errors.each { |m| puts "  - #{m}" }
puts "validate-site: #{@errors.empty? ? 'OK' : 'FAILED'} (#{@errors.size} errors, #{@warnings.size} warnings)"
exit(@errors.empty? ? 0 : 1)
