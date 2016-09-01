$(function() {
	//response setup
	$.JResponsive({
	    defaultMenuObj: "#nav",
	    res_langSwitch: false
	});

	$.JRes_autoRefresh({ state: false })

	$(".ui-dialog-titlebar-close").append('<i class="fa fa-times" aria-hidden="true"></i>');
	

 })