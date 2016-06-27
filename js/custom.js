$(function() {
	$.JResponsive({
		defaultMenuObj: "#nav",
		defaultLangMenuObj: "#languageSelect",
		menuCollapse: "#resPrimery, #sidebar_btn_pannelContent .menuList",
		additionalBtn: [
	            	[
	            		"sidebar_btn",
	            		"#",
	            		"sidebar",
	            		"pannel",
		            	[
		            		"left_under",
		            		$("#sidebar").html()
		            	]
	        		]
	    ]
	});

	$("#nav,#footer_nav,#lang").JResMenu({
		view: 'horizontal',
	});

	$("#sidebar").JResMenu();

	$("#myTabs").JResContentTab();

	$(".resEnlargeObj").JResEnlarge({
		enlargeSize: 'auto',
		paddingAmt: 0
	});

	$("table").JResOverflow({
		paddingAmt: 40
	});
	

 })