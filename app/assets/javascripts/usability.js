$(document).on("click", "#hide-map-btn", function(e){
	e.preventDefault()
	var btn = e.target
	var map_wrapper = document.querySelector("#map_wrapper")
	var table_wrapper = document.querySelector("#table_wrapper")
	// display and hide map btns
	if (map_wrapper.style.display == "none") {
		table_wrapper.style.width = table_wrapper.dataset.width
		map_wrapper.style.display = "block"
		btn.innerHTML = '<i class="fa fa-angle-double-right"></i>' + " " + "隱藏地圖"
	} else {
		table_wrapper.dataset.width = table_wrapper.offsetWidth - 1 + "px"
		map_wrapper.style.display = "none"
		table_wrapper.style.width = "100%"
		btn.innerHTML = '<i class="fa fa-angle-double-left"></i>' + " " + "顯示地圖"
	}
})
$(window).on("turbolinks:load", function(){
	Split(["#table_wrapper", "#map_wrapper"], {sizes: [50,50], direction: "horizontal"})
})
$(document).on("change", ".hide-column-btn input", function(){
	window.data_table.column( $(this).data("column") ).visible( $(this).is(":checked") );
})
$(window).on("turbolinks:load resize", function(){
	if (window.innerWidth < 992) {
		document.querySelector("#table_wrapper").style.height = window.innerHeight - document.querySelector("#map_wrapper").offsetHeight - 15 + "px"
	} else {
		document.querySelector("#table_wrapper").style.height = window.innerHeight - 15 + "px"
	}
})