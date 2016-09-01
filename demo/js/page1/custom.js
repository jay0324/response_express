$(function() {
	$.JResponsive({
		defaultMenuObj: "#nav",
		defaultLangMenuObj: "#languageSelect",
		menuCollapse: "#resPrimery",
	});

	$("#nav,#footer_nav,#lang").JResMenu({
		view: 'horizontal',
	});

	$("#slideshow").JSlideImg({
		transitStyle: "animate",
				thumb: {						//小圖切換按鈕
					state: true,				//是否使用(預設false)
					amount: 'auto',					//一次顯示數量, 'auto':自動偵測數量
					width:10,					//小圖寬度
					height:10,					//小圖高度
					type: 'horizontal'
				}
	})

	$("#myItemSlider").JResContentSlider({
		listAmt: 3,
		setupResposive: {
			640:{
				listAmt: 2
			},
			420:{
				listAmt: 1
			}
		}
	})

 })