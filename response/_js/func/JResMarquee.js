(function ($, document, window) {
	//JMarquee 文字跑馬燈
    $.fn.JResMarquee = function(options) {
        var defaults = {
            objWidth: "auto",
            fontSize: 30,
            position: -1,
            speed: 30
        };
        options = $.extend(defaults, options);
        if ($.JRes_getCookie() == "true" || $.JRes_getCookie() == null || $.JRes_getCookie() == "") {
            $(this).addClass("resMarquee");
            $(this).wrapInner("<span>");
            var marContainer = "#" + $(this).attr("id");
            var marObj = marContainer + ">span";
            var fontSize = options.fontSize;
            var position = options.position;
            var speed = options.speed;
            var objWidth = options.objWidth;
            var documentW = $(window).width() - 20;
            var resMarqueeContainerW = Math.min($(marContainer).width(), documentW);
            if (objWidth != "auto") {
                resMarqueeW = Number(objWidth);
            } else {
                var resChineseCharW = fontSize + 1;
                var resCharW = fontSize - 1;
                var resChar = $(marObj).text().split("");
                var resNumberChar = resChar.length;
                var resMarqueeW = 0;
                //resNumberChar*resChineseCharW;
                for (var i = 0; i < resNumberChar; i++) {
                    resMarqueeW += Number(checkCharacterWidth(fontSize, resChar[i]));
                }
            }
            $(marObj).width(resMarqueeW);
            if (resMarqueeContainerW < resMarqueeW) {
                JResLoopMarquee({
                    marContainer: marContainer,
                    marObj: marObj,
                    position: position,
                    speed: speed,
                    resMarqueeContainerW: resMarqueeContainerW
                });
            } else {
                $(marObj).width("auto");
            }
        }
        //check character width fontSize:int, chr:string
        function checkCharacterWidth(fontSize, chr) {
            if (chr.search(/[0-9]/g) != -1) {
                //alert("[0-9]");
                return fontSize;
            } else if (chr.search(/[A-Z]/g) != -1) {
                //alert("[A-Z]");
                return fontSize + 3;
            } else if (chr.search(/[a-z]/g) != -1) {
                //alert("[a-z]");
                return fontSize - 2;
            } else if (chr.search(/\s]/g) != -1) {
                //alert("[\s]");
                return fontSize;
            } else if (chr.search(/[,.()?!:;]/g) != -1) {
                //alert("[\W]:"+chr);
                return fontSize - 8;
            } else {
                //alert("other");
                return fontSize + 2;
            }
        }
    };

    //resLoader 控制載入動畫
    JResLoader = function(options) {
        var defaults = {
            dom: '#resLoader',
            state: 'hide',
            speed: 200
        };
        options = $.extend(defaults, options);
        //console.log(options.dom);
        switch(options.state) {
            case 'show':
                $(options.dom).fadeIn(options.speed);
            break;
            default:
                $(options.dom).fadeOut(options.speed);
            break;
        }
    };

    //JMarquee 跑馬燈結束
    //JMarquee looping animation
    JResLoopMarquee = function(options) {
        var defaults = {
            marContainer: "",
            marObj: "",
            position: 1,
            speed: 20,
            resMarqueeContainerW: 0
        };
        options = $.extend(defaults, options);
        var marContainer = options.marContainer;
        var marObj = options.marObj;
        var position = options.position;
        var speed = options.speed;
        var resMarqueeContainerW = options.resMarqueeContainerW;
        $(marContainer).css("text-align", "left");
        var currentPos = Number($(marObj).css("margin-left").replace("px", ""));
        var maxPos = $(marObj).width() * position;
        switch (position) {
          case 1:
            if (currentPos < resMarqueeContainerW) {
                $(marObj).css({
                    "margin-left": currentPos + position + "px"
                });
            } else {
                $(marObj).css("margin-left", maxPos * -1 + "px");
            }
            break;

          default:
            if (currentPos > maxPos) {
                $(marObj).css({
                    "margin-left": currentPos + position + "px"
                });
            } else {
                $(marObj).css("margin-left", resMarqueeContainerW + "px");
            }
            break;
        }
        setTimeout("JResLoopMarquee({marContainer:'" + marContainer + "',marObj:'" + marObj + "',position:" + position + ",speed:" + speed + ",resMarqueeContainerW:" + resMarqueeContainerW + "})", speed);
    };
    //JMarquee looping animation

}(jQuery, document, window));