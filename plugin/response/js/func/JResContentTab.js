(function ($, document, window) {
	//tab功能
    $.fn.JResContentTab = function(options) {
        var defaults = {
            init: 0,
            fx: 'slide',
            transitTime: 300,
            createTabs: {},
            onClick: false,
            resMode: '',
            resModeActiveWidth: 604
        };
        options = $.extend(defaults, options);
        var tabObj = $(this);
        var targetTab = (window.location.hash != "#")?window.location.hash:"";
        var getHashIndex = $(targetTab,tabObj).index(); //取得網址參數
        var tabInit = (getHashIndex != -1)?getHashIndex:options.init;
        var fx = options.fx;
        var transitTime = options.transitTime;
        var tabsObj = options.createTabs;
        var tabsBtn = '';
        var tabsContent = '';
        var resMode = options.resMode;
        var resModeActiveWidth = options.resModeActiveWidth;

        //檢查是否由js寫入
        if(!$.isEmptyObject(tabsObj)){
            for (var tabs in tabsObj) {
                tabsBtn += '<li><a href="#'+tabsObj[tabs]['id']+'" class="tabsBtn">'+tabsObj[tabs]['text']+'</a></li>';
                tabsContent += '<li id="'+tabsObj[tabs]['id']+'" class="tabsContent">'+tabsObj[tabs]['content']+'</li>';
            }
            $(this).html('<ul class="tabs">'+tabsBtn+'</ul>'+'<ul class="tabs_content">'+tabsContent+'</ul>');
        }

        $(".tabsContent", tabObj).append("<div class='clear'></div>");

        //init
        var targetObj = $(".tabsBtn:eq("+tabInit+")", tabObj).attr("href");
        $(".tabsBtn:eq("+tabInit+")", tabObj).addClass("active");
        $(".tabsContent"+targetObj, tabObj).css("display","block");

        //響應式模式
        switch (resMode) {
            case 'expend':
                //展開模式
                $(tabObj).addClass("resContentTab_append");
                $(".tabsContent", tabObj).each(function(){
                    var target = $(this).index();
                    var target_id = $(this).attr('id')+'_tabTitle';
                    var target_link = $(".tabs li:eq("+target+")", tabObj).text();
                    $(this).wrapInner('<div class="expend_content_wrapper">');
                    $(this).prepend('<div id="'+target_id+'" class="expend_title">'+target_link+'</div>');
                })
            break;
            case 'collapse':
                //展開模式
                $(tabObj).addClass("resContentTab_collapse");
                $(".tabsContent", tabObj).each(function(){
                    var target = $(this).index();
                    var target_id = $(this).attr('id')+'_tabTitle';
                    var target_link = $(".tabs li:eq("+target+")", tabObj).html();
                    $(this).wrapInner('<div class="expend_content_wrapper">');
                    $(this).prepend('<div id="'+target_id+'" class="expend_title">'+target_link+'</div>');
                })
                var targetObj = $(".tabsContent:eq("+tabInit+") .tabsBtn", tabObj).attr("href");
                $(".tabsContent"+targetObj+" .tabsBtn", tabObj).addClass("active");
                $(".tabsContent"+targetObj+" .expend_content_wrapper", tabObj).css("display","block");
            break;
        }

        //event
        $(tabObj).on('click','.tabsBtn', function(){
            if (!$(this).hasClass("noTab")) {
                if (!$(this).hasClass("active")){
                    if ($(window).width() <= resModeActiveWidth) {
                        //小於預設尺寸才判斷要使用的tab動作
                        switch (resMode) {
                            case 'expend':
                                //展開模式
                                return false;
                            break;
                            case 'collapse':
                                //展開模式
                                fnFx($(".expend_content_wrapper", tabObj), fx, 'hide', transitTime);
                                $(".tabsBtn", tabObj).removeClass("active");
                                var targetObj = $(this).attr("href");
                                fnFx($(targetObj+' .expend_content_wrapper', tabObj), fx, 'show', transitTime);
                                $(this).addClass("active");

                            break;
                            default:
                                fnFx($(".tabsContent", tabObj), fx, 'hide', transitTime);
                                $(".tabsBtn", tabObj).removeClass("active");
                                var targetObj = $(this).attr("href");
                                fnFx($(targetObj, tabObj), fx, 'show', transitTime);
                                $(this).addClass("active");
                            break;
                        }
                    }else{
                        //大於預設尺寸只做原本tab的動作
                        fnFx($(".tabsContent", tabObj), fx, 'hide', transitTime);
                        $(".tabsBtn", tabObj).removeClass("active");
                        var targetObj = $(this).attr("href");
                        fnFx($(targetObj, tabObj), fx, 'show', transitTime);
                        $(this).addClass("active");
                    }

                    //執行客製動作
                    if (options.onClick != false) {
                        options.onClick.call( $(tabObj) );
                    }

                }
                return false;
            }
        })

        //轉場效果
        function fnFx(obj, fx, evt, transitTime){
            var padding = $("#mobile_nav").height();

            switch(fx){
                case 'fade': 
                    if (evt == 'show'){
                        $(obj).fadeIn(transitTime,function(){
                            fnScrollPos(obj, padding, transitTime);
                        });
                    }else{
                        $(obj).fadeOut(transitTime);
                    }
                break;
                case 'slide': 
                    if (evt == 'show'){
                        $(obj).slideDown(transitTime,function(){
                            fnScrollPos(obj, padding, transitTime);
                        });
                    }else{
                        $(obj).slideUp(transitTime);
                    }
                break;
                default:
                    if (evt == 'show'){
                        $(obj).show(transitTime,function(){
                            fnScrollPos(obj, padding, transitTime);
                        });
                    }else{
                        $(obj).hide(transitTime);
                    }
                break;
            }
           

        }

        //定位
        function fnScrollPos(obj, padding, speed){
            if (resMode == 'collapse') {
                if ($(window).width() <= resModeActiveWidth) {
                    $("html, body").animate({
                        scrollTop: $(obj).offset().top - padding
                    }, speed);
                }
            }
        }
    };

}(jQuery, document, window));