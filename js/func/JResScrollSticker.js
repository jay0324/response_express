(function ($, document, window) {

	//卷軸固定物件
    $.fn.JResScrollSticker = function(options) {
        var defaults = {
            position: {
               'top':'0' 
            }
        };
        options = $.extend(defaults, options);
        var targetObj = $(this);
        var position = options.position;
        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "scroll"; //FF doesn't recognize mousewheel as of FF3.x
        var tragglePos = $(targetObj).position().top+$(targetObj).height();

        $(window).on(mousewheelevt, function(e){
            //console.log($(this).scrollTop()+','+tragglePos);
            if($(this).scrollTop() < tragglePos){
                $(targetObj).css({
                    "position":"relative",
                    "z-index":"1",
                    "top":"0"
                });
            }else{
                $(targetObj).css({
                    "position":"fixed",
                    "z-index":"1000",
                    "top":"auto",
                    "bottom":"auto"
                }).css(position);
            }
        })
    }

}(jQuery, document, window));