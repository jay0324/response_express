(function ($, document, window) {
	$.fn.JResWrapper = function(options) {
        //make img with enlarge formate
        var defaults = {
            activeWidth: 1000,
            type: 'left',
            btnW: 20,
            btnOrder: 1,
            pos: 50,
            end: 0,
            fx: 'swing',
            duration: 200
        };
        options = $.extend(defaults, options);

        var target = $(this);
        var activeWidth = options.activeWidth;
        var type = options.type;
        var pos = options.pos;
        var end = options.end;
        var fx = options.fx;
        var duration = options.duration;
        var btnW = options.btnW;
        var btnOrder = options.btnOrder;

        //init
        if ($(window).width() < activeWidth) {
            $(target).addClass('JResWrapper');
            $(target).append('<div class="resWrapperSwitch" width="'+btnW+'px">');
            $(target).css({"width":pos+"%"});
            $(">.resWrapperSwitch", target).addClass("show " + type);
            fnClose(type,pos,fx,duration,end);
        }

        //action
        $(">.resWrapperSwitch", target).on('click',function(){
            if (!$(this).hasClass("active")) {
                fnOpen(type,pos,fx,duration,end);
            }else{
                fnClose(type,pos,fx,duration,end);
            }
            $(".JResWrapper").css({"z-index":"1"});
            $(this).toggleClass("active");
        })

        function fnOpen(type,pos,fx,duration,end){
            $(target).css({"z-index":"3"});
            switch(type){
                case "right":
                    $(target).animate({"right":end+"%"},duration,fx);
                break;
                default:
                    $(target).animate({"left":end+"%"},duration,fx);
                break;
            }
            
        }

        function fnClose(type,pos,fx,duration,end){
            $(".JResWrapper").css({"z-index":"1"});
            switch(type){
                case "right":
                    $(target).animate({"right":-(pos-end)+"%"},duration,fx);
                break;
                default:
                    $(target).animate({"left":-(pos-end)+"%"},duration,fx);
                break;
            }
            
        }

    }
}(jQuery, document, window));