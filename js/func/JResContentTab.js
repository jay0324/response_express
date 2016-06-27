(function ($, document, window) {
	//tab功能
    $.fn.JResContentTab = function(options) {
        var defaults = {
            init: 0,
            fx: 'slide',
            transitTime: 300,
            createTabs: {},
            onClick: false
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

        //檢查是否有js寫入
        if(!$.isEmptyObject(tabsObj)){
            for (var tabs in tabsObj) {
                tabsBtn += '<li><a href="#'+tabsObj[tabs]['id']+'" class="tabsBtn">'+tabsObj[tabs]['text']+'</a></li>';
                tabsContent += '<li id="'+tabsObj[tabs]['id']+'" class="tabsContent">'+tabsObj[tabs]['content']+'</li>';
            }
            $(this).html('<ul class="tabs">'+tabsBtn+'</ul>'+'<ul class="tabs_content">'+tabsContent+'</ul>');
        }

        var targetObj = $(".tabsBtn:eq("+tabInit+")", tabObj).attr("href");

        $(".tabsContent").append("<div class='clear'></div>");
        //init
        $(".tabsBtn:eq("+tabInit+")", tabObj).addClass("active");
        $(".tabsContent"+targetObj, tabObj).css("display","block");

        //event
        $(tabObj).on('click','.tabsBtn', function(){
            if (!$(this).hasClass("noTab")) {
                if (!$(this).hasClass("active")){
                    fnFx($(".tabsContent", tabObj), fx, 'hide', transitTime);
                    $(".tabsBtn", tabObj).removeClass("active");
                    var targetObj = $(this).attr("href");
                    //console.log(tabObj);
                    fnFx($(targetObj, tabObj), fx, 'show', transitTime);
                    $(this).addClass("active");

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
            switch(fx){
                case 'fade': 
                    if (evt == 'show'){
                        $(obj).fadeIn(transitTime);
                    }else{
                        $(obj).fadeOut(transitTime);
                    }
                break;
                case 'slide': 
                    if (evt == 'show'){
                        $(obj).slideDown(transitTime);
                    }else{
                        $(obj).slideUp(transitTime);
                    }
                break;
                default:
                    if (evt == 'show'){
                        $(obj).show(transitTime);
                    }else{
                        $(obj).hide(transitTime);
                    }
                break;
            }
           

        }
    };

}(jQuery, document, window));