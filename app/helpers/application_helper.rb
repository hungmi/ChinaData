module ApplicationHelper
	def render_svg(file_name, html_options = {})
		svg_file = File.read "#{Rails.root}/app/assets/images/#{file_name}"
		doc = Nokogiri::HTML::DocumentFragment.parse svg_file
	  svg = doc.at_css 'svg'
	  if html_options.present?
	  	html_options.each do |k,v|
	    	svg[k] = v
	    end
	  end
	  doc.to_html.html_safe
	end

end
