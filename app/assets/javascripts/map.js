$("#map_svg path").on("mouseover", function(){
	$("tr." + $(this).attr("id")).addClass("bg-success")
	$(this).attr("fill", "blue")
})
$("#map_svg path").on("mouseleave", function(){
	$("tr." + $(this).attr("id")).removeClass("bg-success")
	$(this).attr("fill", "#808080")
})
$(document).on("change", "input.show-color-btn", function(){
	var	$btn = $(this)
	if ( $btn.is(":checked") ){
		var $sumName = $btn.data("sum-name")
		Object.keys(window.province_sums[$sumName]).forEach(function(province){
			var province_svg = document.querySelector("#" + province)
			province_svg.style.fill = "#808080"
			province_svg.style.fill = window.province_colors[$sumName][province]
		})
	}
})