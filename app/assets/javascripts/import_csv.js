$(document).on("change", "#file", function(){
	'use strict'
	window.provinces = { "HeiLongJiang": 0, "JiLin": 0, "LiaoNing": 0, "HeBei": 0, "ShanDong": 0, "JiangSu": 0, "ZheJiang": 0,
		"AnHui": 0, "HeNan": 0, "ShanXi": 0, "ShaanXi": 0, "GanSu": 0, "HuBei": 0, "JiangXi": 0, "HuNan": 0, "GuiZhou": 0, "SiChuan": 0,
		"Yunnan": 0, "QingHai": 0, "Hainan": 0, "ChongQing": 0, "TianJin": 0, "BeiJing": 0, "NingXia": 0, "NeiMengGu": 0, "GuangXi": 0,
		"XinJiang": 0, "XiZang": 0, "Taiwan": 0, "GuangDong": 0, "FuJian": 0, "ShangHai": 0, "HongKong": 0 }
	Papa.parse(document.querySelector("#file").files[0], {
		error: function(){
			console.warn("failed")
		},
		complete: function(res){
			window.datas = res
			// { data: [["map_index","省份", "人口"],["HeNan","河南", "10725"],["ShanDong","山东", "9079"],["GuangDong","广东", "8642"],
			// ["SiChuan","四川", "8329"],["JiangSu","江苏", "7438"],["HeBei","河北", "6744"],["HuNan","湖南", "6440"],["HuBei","湖北", "6028"],
			// ["AnHui","安徽", "5986"],["ZheJiang","浙江", "4677"],["GuangXi","广西", "4489"],["Yunnan","云南", "4288"],["LiaoNing","辽宁", "4238"],
			// ["JiangXi","江西", "4140"],["HeiLongJiang","黑龙江", "3689"],["ShaanXi","陕西", "3605"],["GuiZhou","贵州", "3525"],["FuJian","福建", "3471"],
			// ["ShanXi","山西", "3297"],["ChongQing","重庆", "3090"],["JiLin","吉林", "2728"],["GanSu","甘肃", "2562"],["NeiMengGu","内蒙古", "2376"],
			// ["XinJiang","新疆", "1925"],["ShangHai","上海", "1674"],["BeiJing","北京", "1382"],["TianJin","天津", "1001"],["Hainan","海南", "787"],
			// ["NingXia","宁夏", "562"],["QingHai","青海", "518"],["XiZang","西藏", "262"]] }
			var title_row = window.datas.data[0]
			var column_number = window.datas.data[0].length
			title_row.forEach(function(title, index) {
				if (!title.includes("map_index")) {
					var th = document.createElement("TH")
					th.innerHTML = " " + title // + ' <i class="fa fa-sort"></i>'
					document.querySelector("#my-table thead tr").appendChild(th)
				} else {
					window.map_index_column = index
				}
			})
			window.datas.data.shift() // Drop titles row
			window.number_columns = []
			window.regex = new RegExp(',', 'g');
			var first_data_row = window.datas.data[0]
			first_data_row.forEach(function(cell, column_index){
				var no_comma_cell = cell.replace(window.regex, "")
				var numbered_cell = parseInt(no_comma_cell)
				if (no_comma_cell == numbered_cell) { // "192333" == 192333
					window.number_columns.push(column_index) // [1, 4, 5, 6, 7]
				}
			})
			window.sums = {}
			window.number_columns.forEach(function(number_column_index){
				window.sums[title_row[number_column_index]] = 0 // window.sums["2015地區名次"] = 0
			})
			window.province_sums = jQuery.extend(true, {}, window.sums);
			for (var sum_name in window.province_sums) {
				window.province_sums[sum_name] = jQuery.extend(true, {}, window.provinces)
			}
			//
			window.datas.data.forEach(function(row) {
				var tr = document.createElement("TR")
				document.querySelector("#my-table tbody").appendChild(tr)
				row.forEach(function(cell, index){
					if (index != window.map_index_column) {
						if (window.number_columns.includes(index)) { // if [1, 4, 5, 6, 7].includes(1)
							var numbered_cell = parseInt(cell.replace(window.regex, ""))
							// 取代所有 "," 並轉成整數；如果取代完 "," 都沒有數字的話，會是 NaN
							// parseInt((" wofjwoif ").replace(window.regex, "")) -> NaN
							if (!isNaN(numbered_cell)){
								window.sums[title_row[index]] += numbered_cell // [0, 387, 0, 0, 1429320, 2942842, 39480240, 2840924]
								window.province_sums[title_row[index]][row[window.map_index_column]] += numbered_cell
							}
						}
						var td = document.createElement("TD")
						td.innerHTML = cell
						document.querySelector("#my-table tbody tr:last-child").appendChild(td)
					}
				})
			})
			//
			window.color_bounds = jQuery.extend(true, {}, window.sums) // { "2015amount": 13132, "2015money": 14343242, "2016amount": 23423, "2016money": 1313134 }
			for (var sum_name in window.color_bounds) {
				var values = []
				// console.log(Object.keys(window.province_sums[sum_name]))
				Object.keys(window.province_sums[sum_name]).forEach(function(key){
					values.push(window.province_sums[sum_name][key])
				})
				window.color_bounds[sum_name] = {
					max: Math.max.apply(null, values),
					min: Math.min.apply(null, values)
				}
			}
			//
			window.province_colors = jQuery.extend(true, {}, window.province_sums)
			window.start_color = "00ff00"
			window.end_color = "ff0000"
			var total_color = 512 // Math.abs( parseInt("ff", 16) - parseInt("00",16) )
			Object.keys(window.province_sums).forEach(function(sum_name){
		    var max = window.color_bounds[sum_name].max
		    var min = window.color_bounds[sum_name].min
		    Object.keys(window.province_sums[sum_name]).forEach(function(province){
		    	var color_decimal = Math.round((window.province_sums[sum_name][province] - min) / (max - min) * total_color)
		    	// console.log(color_decimal)
		    	if (color_decimal > (total_color / 2)) {
		    		console.log(sum_name + "->" + province + ":" + color_decimal)
		    		var color2digits = pad(((512 - color_decimal)).toString(16), 2)
		    		window.province_colors[sum_name][province] = "ff" + color2digits + "00"
		    	} else {
		    		console.log(sum_name + "->" + province + ":" + color_decimal)
		    		var color2digits = pad((color_decimal).toString(16), 2)
		    		window.province_colors[sum_name][province] = color2digits + "ff00"
		    	}
		    })
			})
			var input = document.createElement("input")
			input.type = "checkbox"
			input.classList.add("form-check-input")
			for (var sum_name in window.sums) {
				//
				var check_box = document.createElement("label")
				check_box.classList.add("form-check-label")
				check_box.innerHTML = " " + sum_name
				//
				var input = document.createElement("input")
				input.type = "radio"
				input.name = "colorMapOptions"
				input.classList.add("form-check-input")
				input.classList.add("show-color-btn")
				input.dataset.sumName = sum_name
				//
				document.querySelector("#map_wrapper").append(check_box)
				check_box.prepend(input)
			}
			// for (var sum_name in window.province_colors) {
				// Object.keys(window.province_sums[" 求和项:2015含税金额 "]).forEach(function(province){
				// 	document.querySelector("#" + province).style.fill = window.province_colors[" 求和项:2015含税金额 "][province]
				// })
			// }
			//
			window.data_table = $('#my-table').DataTable({
				"pageLength": 10
			})
			var input = document.createElement("input")
			input.type = "checkbox"
			input.classList.add("form-check-input")
			document.querySelectorAll('#my-table thead tr th').forEach(function(th, index){
				//
				var check_box = document.createElement("label")
				check_box.classList.add("form-check-label")
				check_box.classList.add("hide-column-btn")
				check_box.innerHTML = th.innerHTML
				//
				var input = document.createElement("input")
				input.type = "checkbox"
				input.dataset.column = index
				input.checked = true
				input.classList.add("form-check-input")
				//
				var hide_column_btns = document.querySelector(".hide-column-btns")
				hide_column_btns.appendChild(check_box)
				hide_column_btns.style.display = "block"
				document.querySelector(".hide-column-btn:last-child").prepend(input)
				//
				document.querySelector("#file-wrapper").style.display = "none" // 移到開始匯入並顯示載入中提示
			})
		}
	})
})

function sortProperties(obj)
{
  // convert object into array
    var sortable=[];
    for(var key in obj)
      if(obj.hasOwnProperty(key))
        sortable.push([key, obj[key]]); // each item is an array in format [key, value]

    // sort items by value
    sortable.sort(function(a, b)
    {
      return a[1]-b[1]; // compare numbers
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function reset_map() {
	for (var province in window.provinces) {
		document.querySelector("#" + province).style.fill = "#808080"
	}
}