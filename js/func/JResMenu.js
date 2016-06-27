(function ($, document, window) {
	//選單功能功能
    $.fn.JResMenu = function(options) {
        var defaults = {
            view: 'vertical',
            action: 'click',
            fx: true
        };
        options = $.extend(defaults, options);
        $(this).each(function(){
            var obj = $(this);
            var view = options.view;
            var action = options.action;
            var fx = options.fx;

            //如針對目前在操作中的menu，將其z-index設為上層
            $(obj).on('mouseenter',function(){
                $(this).css("z-index","2");
            }).on('mouseleave',function(){
                $(this).css("z-index","1");
            });

            //將所有的ul後面加入clear
            $("ul",obj).each(function(){
                $(this).after("<div class='clear'></div>");
            });
            //將有子層級的按鈕加入class
            $("li",obj).each(function(){
                if ($(this).children('ul').length > 0) {
                    $('>a',this).addClass('hasChild');
                }
            });

            //判斷view類型
            switch (view){
                case 'horizontal':
                    //add style
                    $(obj).addClass("resMenu2");

                    //如果要使用收合動作效果
                    if (fx || fx == 'mixed') {
                        //add event
                        if (action == 'hover') {
                            //hover event
                            $(obj).on('mouseenter','li',function(e){
                                $(">ul",this).slideDown(10);
                            }).on('mouseleave','li',function(e){
                                $(this).parent().children().each(function(){
                                    $(this).children('ul').slideUp(10);
                                })
                            })
                        }else{
                            //click event
                            $(obj).on('click','li',function(e){
                                //取得點選物件
                                var targetClick = e.target;
                                if (!$(targetClick).is('a')) targetClick = $(e.target).parent('a.hasChild');
                                
                                if ($(targetClick).hasClass("hasChild") && !(fx == 'mixed' && $(targetClick).attr("href") != "#") ) {
                                    //偵測同層目錄下的物件就收起來
                                    $(this).parent().children().each(function(){
                                        $(this).children('ul').slideUp(200);
                                    })

                                    //偵測目前點擊的物件是否有子目錄，有的話就開啟
                                    if($(">ul",this).length > 0){
                                        if ($(">ul",this).css('display') == 'none') {
                                            $(">ul",this).slideDown(200);
                                        }else{
                                            $(">ul",this).slideUp(200);
                                        }
                                        return false;
                                    }

                                    //只偵測到目前的物件
                                    e.stopPropagation(); 

                                }

                                
                            }).on('mouseleave',function(){
                                $('li>ul',this).slideUp(200);
                            });
                        }
                    }

                break;
                case 'vertical':
                    //add style
                    $(obj).addClass("resMenu");

                    //如果要使用收合動作效果
                    if (fx || fx == 'mixed') {
                        //add event
                        if (action == 'hover') {
                            //hover event
                            $(obj).on('mouseenter','li',function(e){
                                $(">ul",this).slideDown(500);
                            }).on('mouseleave','li',function(e){
                                //偵測同層目錄下的物件是否有active,沒有的話就收起來
                                $(this).parent().children().each(function(){
                                    if(!$(this).hasClass('active')){
                                        $(this).children('ul').slideUp(500);
                                    }
                                })
                            })
                        }else{
                            //click event
                            $(obj).on('click','li',function(e){
                                //取得點選物件
                                var targetClick = e.target;
                                if (!$(targetClick).is('a')) targetClick = $(e.target).parent('a.hasChild');

                                //偵測同層目錄下的物件是否有active,沒有的話就收起來
                                if ($(targetClick).hasClass("hasChild") && !(fx == 'mixed' && $(targetClick).attr("href") != "#") ) {
                                    $(this).parent().children().each(function(){
                                        if(!$(this).hasClass('active')){
                                            $(this).children('ul').slideUp(200);
                                        }
                                    })

                                    //偵測目前點擊的物件是否有子目錄，有的話就開啟
                                    if($(">ul",this).length > 0){
                                        if ($(">ul",this).css('display') == 'none') {
                                            $(">ul",this).slideDown(200);
                                        }else{
                                            $(">ul",this).slideUp(200);
                                        }
                                        return false;
                                    }

                                    //只偵測到目前的物件
                                    //console.log($(e.target).hasClass("hasChild"));
                                    e.stopPropagation();
                                }
                            })
                        }
                    }
                    
                break;
            }

        });
    }

}(jQuery, document, window));