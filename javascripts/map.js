$("#map_svg path, #map_svg g").on("mouseenter", function(){
	// $("tr." + $(this).attr("id")).addClass("bg-success")
	$(this).addClass("hover")
})
$("#map_svg path, #map_svg g").on("mouseleave", function(){
	// $("tr." + $(this).attr("id")).removeClass("bg-success")
	$(this).removeClass("hover")
})
$(document).on("change", "input.show-color-btn", function(){
	var	$btn = $(this)
	if ( $btn.is(":checked") ){
		reset_map()
		var $sumName = $btn.data("sum-name")
		Object.keys(window.province_sums[$sumName]).forEach(function(province){
			var province_svg = document.querySelector("#" + province)
			province_svg.style.fill = window.province_colors[$sumName][province]
		})
	}
})