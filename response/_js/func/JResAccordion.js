(function ($, document, window) {
    $.fn.JResAccordion = function(options) {
        //make img with enlarge formate
        var defaults = {
            height: 300,
            amount: 4,
            openW: 52,
            headingW: 40,
            contentW: 60,
            delay: 1000,
            fx:'linear',
            type: 'horizontal'
        };
        options = $.extend(defaults, options);

        //param
        var target = $(this);
        var amount = options.amount;
        var openW = options.openW; (100-(closeW*3));
        var closeW = ((100-openW)/(amount-1));
        var evenW = (100/amount);
        var headingW = options.headingW;
        var contentW = options.contentW;
        var delayTime = options.delay;
        var fx = options.fx;
        var setH = options.height;
        var type = options.type;

        //initialized
        if (type == 'vertical') {
            //直向排列
            $(target).addClass("resAccordionVertical").append('<div class="clear">');
            $(">li",target).height(evenW+"%");
            $(target).height(setH*amount);
        }else{
            //預設橫向排列
            $(target).addClass("resAccordion").append('<div class="clear">');
            $(">li",target).width(evenW+"%");
            $(target).height(setH);
            $(">li",target).height(setH);
            $(">li .heading",target).height(setH);
            $(">li .content",target).height(setH);  
        }

        //action
        $(">li",target).on("click",function(e){
            var current = $(this);
            if(e.currentTarget.nodeName == "LI" && $(current).hasClass("active")) {
                if (type == 'vertical') {
                    $(">li",target).animate({'height':evenW+"%"},{ duration: delayTime, queue: false },fx).removeClass("active");
                    $(">li .heading",target).animate({'height':"100%"},{ duration: delayTime, queue: false },fx);
                    $(">li .content",target).animate({'height':"0"},{ duration: delayTime, queue: false },fx);
                }else{
                    $(">li",target).animate({'width':evenW+"%"},{ duration: delayTime, queue: false },fx).removeClass("active");
                    $(">li .heading",target).animate({'width':"100%"},{ duration: delayTime, queue: false },fx);
                    $(">li .content",target).animate({'width':"0"},{ duration: delayTime, queue: false },fx);
                }
            }else{
                if (type == 'vertical') {
                    $(">li",target).each(function(){
                        if ($(current).index() == $(this).index()) {
                            $(this).animate({'height':openW+"%"},{duration: delayTime,queue: false},fx).addClass("active");
                            $(".heading",this).animate({'height':headingW+"%"},{duration: delayTime,queue: false},fx);
                            $(".content",this).animate({'height':contentW+"%"},{duration: delayTime,queue: false},fx);
                        }else{
                            $(this).animate({'height':closeW+"%"},{duration: delayTime,queue: false},fx).removeClass("active");
                            $(".heading",this).animate({'height':"100%"},{ duration: delayTime, queue: false },fx);
                            $(".content",this).animate({'height':"0"},{ duration: delayTime, queue: false },fx);
                        }
                    })

                }else{
                    $(">li",target).each(function(){
                        if ($(current).index() == $(this).index()) {
                            $(this).animate({'width':openW+"%"},{duration: delayTime,queue: false},fx).addClass("active");
                            $(".heading",this).animate({'width':headingW+"%"},{duration: delayTime,queue: false},fx);
                            $(".content",this).animate({'width':contentW+"%"},{duration: delayTime,queue: false},fx);
                        }else{
                            $(this).animate({'width':closeW+"%"},{duration: delayTime,queue: false},fx).removeClass("active");
                            $(".heading",this).animate({'width':"100%"},{ duration: delayTime, queue: false },fx);
                            $(".content",this).animate({'width':"0"},{ duration: delayTime, queue: false },fx);
                        }
                    })
                }
            }
        })

        $(target).on("mouseleave",function(){
                if (type == 'vertical') {
                    $(">li",target).animate({'height':evenW+"%"},{ duration: delayTime, queue: false },fx).removeClass("active");
                    $(">li .heading",target).animate({'height':"100%"},{ duration: delayTime, queue: false },fx);
                    $(">li .content",target).animate({'height':"0"},{ duration: delayTime, queue: false },fx);
                }else{
                    $(">li",target).animate({'width':evenW+"%"},{ duration: delayTime, queue: false },fx).removeClass("active");
                    $(">li .heading",target).animate({'width':"100%"},{ duration: delayTime, queue: false },fx);
                    $(">li .content",target).animate({'width':"0"},{ duration: delayTime, queue: false },fx);
                }
        })

    }
}(jQuery, document, window));