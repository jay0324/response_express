(function ($, document, window) {
	//物件Follow定位功能 (跟屁蟲)
    $.fn.JResFollowObj = function(options) {
        var defaults = {
            state: true,
            position: 'absolute',
            pos: {
                top: 0,
                left: 0
            },
            z: 1000,
            delay: 2000,
            hide: 800
        };
        options = $.extend(defaults, options);
        var obj = $(this);
        var state = options.state;
        var position = options.position;
        var pos = options.pos;
        var posY = 0;
        var delay = options.delay;
        var z = options.z;
        var hide = options.hide;

        //使用
        if (state && $(obj).length > 0) {
            if ($(window).width() > hide) {
                //定義物件
                $(obj).addClass("JResFollowObj");

                //定位類型
                $(obj).css({'position':position,'z-index':z});

                //定位初始位置
                if(!$.isEmptyObject(pos)){
                    for (var init in pos) {
                        $(obj).css(init,pos[init]);
                        if (init == "top"){
                            posY = pos[init];
                        }
                    }
                }

                //加入控制
                if (position == "fixed"){
                    $(obj).css({top:($(this).scrollTop()+posY)+'px'});
                }else{
                    $(window).scrollEnd(function(){
                        $(obj).animate({top:($(this).scrollTop()+posY)+'px'},delay);
                    }, 100);
                }
            }
        }
    }
}(jQuery, document, window));