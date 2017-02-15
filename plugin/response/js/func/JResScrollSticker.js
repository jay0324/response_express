(function ($, document, window) {

	//卷軸固定物件
    $.fn.JResScrollSticker = function(options) {
        var defaults = {
            delay: 500,
            disableBy: 800
        };
        options = $.extend(defaults, options);
        var targetObj = $(this);
        var delay = options.delay;
        var disableBy = options.disableBy;
        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "scroll"; //FF doesn't recognize mousewheel as of FF3.x
        
        if ($(window).width() > disableBy) {
            $(targetObj).each(function(){
                var d = new Date();
                var setID = 'stickTop_'+Math.floor(d.getTime()+Math.random());
                $("body").append('<div id="'+setID+'" class="scrollSticker">');
                $("#"+setID).append($(this).clone());

                $(this).addClass('stickTopObj').attr('stick-target',setID);
            })
        }

        $(window).on(mousewheelevt, function(e){
            //console.log($(this).scrollTop()+','+tragglePos);
            var winScroll = $(this).scrollTop();

            $(".stickTopObj").each(function(){
                var tragglePos = $(this).position().top+$(this).height();
                var target = $(this).attr("stick-target");
                if(winScroll < tragglePos){
                    $("#"+target).fadeOut(delay);
                }else{
                    $("#"+target).fadeIn(delay);
                }
            })
        })
    }

}(jQuery, document, window));