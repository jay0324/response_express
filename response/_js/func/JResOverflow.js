(function ($, document, window) {
	//JResOverflow 橫向卷軸功能
    $.fn.JResOverflow = function(options) {
        //make move_overflow tag for image that width is larger than document width
        //if the image width is over the current page width, and wrap it with mobile_overflow   
        var defaults = {
            flow: true,
            paddingAmt: 25,
            setUILoadWidth: 800
        };
        options = $.extend(defaults, options);
        var setUILoadWidth = options.setUILoadWidth;

        if ($.JRes_getCookie() == "true" || $.JRes_getCookie() == null || $.JRes_getCookie() == "") {
            var overflow = options.flow;
            var objTag = $(this).prop("tagName");
            var paddingAmt = options.paddingAmt;
            var documentW = $(window).width() - paddingAmt;
            var d = new Date();
            var objWraperClass = "mobile_overflow_"+d.getTime();
            switch (objTag) {
              case "IMG":
                $(this).each(function() {
                    $(this).addClass('resIgnoreImgReSizer'); //加上class來避免res排版又再次處理物件
                    var objW = 0;
                    var objH = 0;
                    $(this).one('load', function() {
                        $(this).css({
                            width: "auto",
                            height: "auto"
                        });
                        objW = $(this).width();
                        objH = $(this).height();
                        
                    }).each(function(){
                      if(this.complete) {
                        $(this).trigger('load');
                      }
                    });

                    //處理物件
                    if (objW > (documentW-paddingAmt) && overflow == true) {
                        if (!$(this).hasClass("resUnwrap")) {
                            $(this).css({
                                width: "auto",
                                height: "auto"
                            });
                            $(this).wrap('<div class="'+objWraperClass+' mobile_overflow" style="text-align:center">');
                        }
                    } else {
                        //檢查看是否寬度偵測出來是0,如果是則直接包上overflow物件
                        if (objW == 0) {
                            $(this).wrap('<div class="'+objWraperClass+' mobile_overflow" style="text-align:center">');
                        }else{
                            if (objW > documentW) {
                                $(this).css({
                                    width: "100%",
                                    height: "auto"
                                });
                            }
                        }
                    }
                });
                break;

              case "TABLE":
                if (setUILoadWidth > documentW) {
                    var setWidth = "";
                    if (documentW > 600 && documentW <= 1000) {
                        setWidth = "1000px";
                    }else{
                        setWidth = "600px";
                    }

                    $(this).each(function() {
                        //console.log($(this).width());
                        //如果表格設置為100%或沒設置寬度則直接包覆
                        if (($(this).width() > (documentW-paddingAmt) || $(this).width() == 100 || $(this).width() == 0) && overflow == true) {
                            if (!$(this).hasClass("resUnwrap")) {
                                $(this).width(setWidth);
                                $(this).wrap('<div class="'+objWraperClass+' mobile_overflow">');
                            }
                        }
                    });
                }
                break;

              default:
                $(this).each(function() {
                    if ($(this).width() > (documentW-paddingAmt) && overflow == true) {
                        if (!$(this).hasClass("resUnwrap")) {
                            $(this).wrap('<div class="'+objWraperClass+' mobile_overflow">');
                        }
                    } else {
                        $(this).width("100%");
                    }
                });
                break;
            }

            //800以下在把外框加入設備寬
            //if ($(window).width() <= setUILoadWidth){
                //$("."+objWraperClass).css({"width":Math.round(documentW)+"px"});
            //}
        }
    };
}(jQuery, document, window));