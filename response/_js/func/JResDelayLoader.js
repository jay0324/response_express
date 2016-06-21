(function ($, document, window) {
	//延遲載入功能
    $.fn.JResDelayLoader = function(options) {
        var defaults = {
            state: true,
            loadObj: '',
            delay: 200,
            transition: 500,
            eventPos: 100,
            onLoad: false
        };
        options = $.extend(defaults, options);
        var obj = $(this);
        var loadObj = options.loadObj;
        var delay = options.delay;
        var transition = options.transition;
        var state = options.state;
        var eventPos = options.eventPos;
        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "scroll" //FF doesn't recognize mousewheel as of FF3.x
        
        //如果是啟用且有物件才執行
        if (state && $(obj).length > 0) {
      
                if (loadObj != '') {
                    //如果有設定欲執行延遲載入的子物件，則執行預設載入動作
                    if (options.onLoad != false) {
                        $(loadObj,obj).css({visibility:'hidden'}); //客制效果使用visibility來隱藏
                    }else{
                        $(loadObj,obj).css({opacity: '0'});
                    }
                }

                $(window).on(mousewheelevt, function(e){
                    //if scroll to the end of page, then show all hidden items
                    if($(window).scrollTop() + $(window).height() == $(document).height()) {
                        fnTrggleEffect();
                    }

                    //init triggle when half browser height hit the scroll obj
                    var trigglePos = $(window).scrollTop() + Math.round(($(window).height()/2)+eventPos);
                    if ($(obj).position().top < trigglePos){
                        fnTrggleEffect();
                    }
                })

                //當文件載入時,先行偵測目前卷軸位置,並進行動作
                $(window).on('load', function(){
                    //init triggle when half browser height hit the scroll obj
                    var trigglePos = $(window).scrollTop() + Math.round(($(window).height()/2)+eventPos);
                    if ($(obj).position().top < trigglePos){
                         fnTrggleEffect();
                    }

                    //if scroll to the end of page, then show all hidden items
                    if($(window).scrollTop() + $(window).height() == $(document).height()) {
                        fnTrggleEffect();
                    }
                })
        }

        //載入效果
        function fnTrggleEffect(){
            if (loadObj != '') {
                if ($(loadObj,obj).attr("load") != "complete") {
                    var maxAmt = $(loadObj,obj).length;
                    var delayAmt = 0;
                    var targetObj;
                    for (var i = 0; i<maxAmt; i++ ){
                        delayAmt+=delay;
                        targetObj = $(loadObj+":eq("+i+")",obj); //執行動作物件

                        if (options.onLoad != false) {
                            $(targetObj).css({visibility:'visible'}); //將物件設為visible再進行效果
                            options.onLoad.call($(targetObj)); //執行其他客製的動作

                        }else{
                            $(targetObj).delay(delayAmt).animate({
                                opacity: '1'
                            },transition);
                        }

                        //加入載入完成標記
                        $(targetObj).attr("load","complete");

                    }
                }
            }
        }
    }
}(jQuery, document, window));