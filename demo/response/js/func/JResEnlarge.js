(function ($, document, window) {
    //JResEnlarge 放大圖功能
    $.fn.JResEnlarge = function(options) {
        //make img with enlarge formate
        var defaults = {
            enlargeSize: "100%",
            scalePx: 20,
            paddingAmt: 0,
            extraSource: "",
            setUILoadWidth: 800,
            popupMode: false,
            enablePluginMode: false
        };
        options = $.extend(defaults, options);
        var setUILoadWidth = options.setUILoadWidth;
        var popupMode = options.popupMode;
        var enablePluginMode = options.enablePluginMode;
        var desktopMouseDownMove = false;

        if (($.JRes_getCookie() == "true" || $.JRes_getCookie() == null || $.JRes_getCookie() == "")) {
            if ($(window).width() <= setUILoadWidth) {
                var enlargeSize = options.enlargeSize;
                var scalePx = options.scalePx;
                var paddingAmt = options.paddingAmt;
                var touchOrangal, updateOrangal = 0;

                $(this).each(function() {  
                    //var documentW = $(window).width() - paddingAmt;
                    //螢幕寬與上層容器取得其最小值來作為最大寬度
                    var documentW = Math.min(($(window).width() - paddingAmt), ($(this).parent().width() - paddingAmt));
                    if (documentW <= 100) documentW = $(window).width() - paddingAmt;
                    var enablePluginModeSource = "";
                    $(this).addClass("resEnlargeImg");
                        //先檢查class
                        if (!$(this).hasClass("resUnlarger")) {
                            //再檢查是否有設定onclick event
                            if (!$(this).attr("onclick")) {
                                //檢查圖片是否有usemap的attribute設定值，如果沒有才包覆此功能
                                if ($(this).attr("usemap") == undefined) {
                                    //再檢查是否被a包覆，如果有則不使用此功能
                                    switch ($(this).parent("a").prop("tagName")) {
                                        case "A":
                                            if (enablePluginMode && fnCheckFormat($(this).parent("a").attr("href").toLowerCase())){
                                                var doUsed = true;
                                                enablePluginModeSource = $(this).parent("a").attr('href');
                                                $(this).unwrap('a');
                                            }else{
                                                var doUsed = false;
                                            }
                                        break;
                                        default:
                                            enablePluginModeSource = $(this).attr('src');
                                            var doUsed = true;
                                        break;
                                    }
                                }else{
                                    var doUsed = false;
                                }
                            } else {
                                var doUsed = false;
                            }
                
                            if (doUsed) {
                                $(this).one('load', function() {
                                    var objW,objH = 0;
                                    var wrapH = 'height:auto';
                                    var d = new Date();
                                    var thisID = "resEnlarge_" + Math.floor(d.getTime()); //因為亂數會重複所以改成毫秒
                                    
                                    //若圖片尺寸取不到,則以100%的方式取得上層容器的尺寸
                                    $(this).css({width: "auto",height: "auto"});
                                    objW = $(this).width();
                                    objH = $(this).height();
                                    

                                    //如果在寫入時該物件為隱藏物件，會導致物件無法偵測到尺寸，此時把該物件的寬度設定為預設外框的寬度，高度auto,設定在物件的樣式中
                                    
                                    if (objW == 0) {
                                        objW = documentW;
                                        $(this).css({
                                            width: objW+"px",
                                            height: "auto",
                                            float: "none"
                                        });
                                    }else{
                                        if (objW >= documentW) {
                                            objH = (documentW/objW)*objH;
                                            objW = documentW;
                                        }
                                        $(this).css({
                                            width: objW+"px",
                                            height: objH+"px",
                                            float: "none"
                                        });
                                        wrapH = 'height:' + objH + 'px;';
                                    }
                                    
                                    //console.log(documentW+','+objW+','+objH);

                                    var extraSource = options.extraSource != "" ? options.extraSource : ($(this).attr("toggle-src") != undefined) ? $(this).attr("toggle-src") : $(this).attr("src");
                                    extraSource = (enablePluginMode) ? enablePluginModeSource : extraSource;
                                    
                                    //建立wrap內容
                                    $(this).wrap('<div id="' + thisID + '" class="resEnlarge" style="width:' + objW + 'px;' + wrapH + '" enlarge-action="open" enlarge-scale="'+scalePx+'" enlarge-size="'+enlargeSize+'" enlarge-source="'+extraSource+'">');

                                    $(window).resize(function(){
                                        $("#"+thisID).css({
                                            width:'auto',
                                            height:'auto'
                                        });

                                        $("#"+thisID+'>.resEnlargeImg').css({
                                            width:'auto',
                                            height:'auto'
                                        })
                                    })

                                }).each(function(){
                                  if(this.complete) {
                                    $(this).trigger('load');
                                    //console.log(this.complete);
                                  }
                                });
                            }
                        }

                });
            }else{
                $(this).each(function() {
                    if (popupMode){
                        if (!$(this).hasClass("resUnlarger")) {
                            //再檢查是否有設定onclick event
                            if (!$(this).attr("onclick")) {
                                //再檢查是否被a包覆，如果有則不使用此功能
                                switch ($(this).parent("a").prop("tagName")) {
                                    case "A":
                                        if (enablePluginMode && fnCheckFormat($(this).parent("a").attr("href").toLowerCase())){
                                            var doUsed = true;
                                            options.extraSource = $(this).parent("a").attr('href');
                                            var extraSource = options.extraSource;
                                            $(this).unwrap('a');
                                        }else{
                                            var doUsed = false;
                                        }
                                    break;
                                    default:
                                        var extraSource = options.extraSource != "" ? options.extraSource : ($(this).attr("toggle-src") != undefined) ? $(this).attr("toggle-src") : $(this).attr("src");
                                        var doUsed = true;
                                    break;
                                }
                            } else {
                                var doUsed = false;
                            }
                        }

                        if (doUsed) {
                            $(this).each(function() {
                                $(this).addClass("resPopupBox").wrap('<div class="resPopupModeObj">');
                                $(this).attr("source",extraSource);
                            })
                        }
                    }
                })
            }
        }

        //event
        var previousPressPOSX = 0;
        var previousPressPOSY = 0;
                $(document).on('click','.resEnlargeCloseIcon',function(){
                    JResEnlargeControl({
                        id: $(this).attr("toggle"),
                        action:'close',
                        scalePx: scalePx
                    });
                    return false;
                }).on('click','.resEnlargeFitIcon',function(){
                    JResEnlargeControl({
                        id: $(this).attr("toggle"),
                        action:'fit',
                        scalePx: scalePx
                    });
                    return false;
                }).on('click','.resEnlargeOraginalIcon',function(){
                    JResEnlargeControl({
                        id: $(this).attr("toggle"),
                        action:'oraginal',
                        scalePx: scalePx
                    });
                    return false;
                }).on('click','.resEnlargePlusIcon',function(){
                    JResEnlargeControl({
                        id: $(this).attr("toggle"),
                        action:'plus',
                        scalePx: scalePx
                    });
                    return false;
                }).on('click','.resEnlargeDisIcon',function(){
                    JResEnlargeControl({
                        id: $(this).attr("toggle"),
                        action:'dis',
                        scalePx: scalePx
                    });
                    return false;
                }).on('touchstart','.resEnlargeContent',function(e){
                    if (($("meta[name='viewport']").attr("content").search('user-scalable=1') == -1) || ($("meta[name='viewport']").attr("content").search('user-scalable=yes') == -1)){
                        var touch1 = e.originalEvent.touches[0];
                        var touch2 = e.originalEvent.touches[1];
                        if (!(touch1 == undefined || touch2 == undefined)){
                            touchOrangal = fnGetDistance(touch1.pageX,touch2.pageX,touch1.pageY,touch2.pageY);
                        }
                    }
                    //alert(touchOrangal);
                }).on('touchmove','.resEnlargeContent',function(e){
                    if (($("meta[name='viewport']").attr("content").search('user-scalable=1') == -1) || ($("meta[name='viewport']").attr("content").search('user-scalable=yes') == -1)){
                        var touch1 = e.originalEvent.touches[0];
                        var touch2 = e.originalEvent.touches[1];
                        if (!(touch1 == undefined || touch2 == undefined)){
                            updateOrangal = fnGetDistance(touch1.pageX,touch2.pageX,touch1.pageY,touch2.pageY);
                            JResEnlargeControl({
                                id: $(this).attr("toggle"),
                                action:'plus',
                                scalePx: Math.round((touchOrangal - updateOrangal)*-1)
                            });
                            touchOrangal = updateOrangal; //更新touch間距
                        }
                    }
                    //alert(touchOrangal - updateOrangal);
                }).on('click','.resPopupBox',function(){
                    $(this).JResPopupBox({
                        type:'img',
                        action:'open'
                    });
                }).on('click','.resPopupBoxCloseBtn',function(){
                    $(this).JResPopupBox({
                        action:'close'
                    });
                }).on('click','.resPopupBoxMinusBtn',function(){
                    $(this).JResPopupBox({
                        action:'dis'
                    });
                }).on('click','.resPopupBoxPlusBtn',function(){
                    $(this).JResPopupBox({
                        action:'plus'
                    });
                }).on('click','.resEnlarge',function(){
                    var id = $(this).attr('id');
                    var action = $(this).attr('enlarge-action');
                    var scale = $(this).attr('enlarge-scale');
                    var enlargeSize = $(this).attr('enlarge-size');
                    var extraSource = $(this).attr('enlarge-source');

                    JResEnlargeControl({
                        id: id,
                        action: action,
                        scalePx: scale,
                        enlargeSize: enlargeSize,
                        extraSource: extraSource
                    });

                    return false;
                }).on('mousedown touchstart','.resPopupBoxContentArea',function(e){
                    if (!$.JRes_isMobile()) {
                        e.preventDefault();
                        desktopMouseDownMove = true;
                        previousPressPOSX = e.pageX;
                        previousPressPOSY = (e.pageY-window.pageYOffset-50);
                        $(this).addClass('movehand');
                    }else{
                        $(this).addClass('touchmove');
                    }
                }).on('mousemove','.resPopupBoxContentArea',function(e){
                    if (!$.JRes_isMobile()) {
                        if (desktopMouseDownMove){
                            var movePOSX = previousPressPOSX - e.pageX;
                            var movePOSY = previousPressPOSY - (e.pageY-window.pageYOffset-50);
                            //console.log('x:'+movePOSX+' / y:'+movePOSY);
                            previousPressPOSX = e.pageX;
                            previousPressPOSY = (e.pageY-window.pageYOffset-50);
                            $(this).scrollLeft($(this).scrollLeft()+movePOSX);
                            $(this).scrollTop($(this).scrollTop()+movePOSY);
                        }
                    }
                }).on('mouseup touchend','.resPopupBoxContentArea',function(e){
                    if (!$.JRes_isMobile()) {
                        desktopMouseDownMove = false;
                        $(this).removeClass('movehand');
                    }else{
                        $(this).removeClass('touchmove');
                    }
                }).on('mousewheel','.resPopupBoxContentArea',function(e){
                    if (!$.JRes_isMobile()) {
                        //other browser
                        if(e.originalEvent.wheelDelta /120 > 0) {
                            $(">.resPopupTargetImg",this).JResPopupBox({
                                action:'plus'
                            });
                            //console.log('scrolling up !');
                        }else{
                            $(">.resPopupTargetImg",this).JResPopupBox({
                                action:'dis'
                            });
                            //console.log('scrolling down !');
                        }
                    }
                }).on('DOMMouseScroll','.resPopupBoxContentArea',function(e){
                    if (!$.JRes_isMobile()) {
                        //firefox
                        if(e.originalEvent.detail < 0) {
                            $(">.resPopupTargetImg",this).JResPopupBox({
                                action:'plus'
                            });
                            //console.log('scrolling up !');
                        }else{
                            $(">.resPopupTargetImg",this).JResPopupBox({
                                action:'dis'
                            });
                            //console.log('scrolling down !');
                        }
                    }
                }).on('touchstart','.resPopupBoxContentArea',function(e){
                    if ($.JRes_isMobile()) {
                        if (($("meta[name='viewport']").attr("content").search('user-scalable=1') == -1) || ($("meta[name='viewport']").attr("content").search('user-scalable=yes') == -1)){
                            var touch1 = e.originalEvent.touches[0];
                            var touch2 = e.originalEvent.touches[1];
                            if (!(touch1 == undefined || touch2 == undefined)){
                                touchOrangal = fnGetDistance(touch1.pageX,touch2.pageX,touch1.pageY,touch2.pageY);
                            }
                        }
                        //alert(touchOrangal);
                    }
                }).on('touchmove','.resPopupBoxContentArea',function(e){
                    if ($.JRes_isMobile()) {
                        if (($("meta[name='viewport']").attr("content").search('user-scalable=1') == -1) || ($("meta[name='viewport']").attr("content").search('user-scalable=yes') == -1)){
                            var touch1 = e.originalEvent.touches[0];
                            var touch2 = e.originalEvent.touches[1];
                            if (!(touch1 == undefined || touch2 == undefined)){
                                updateOrangal = fnGetDistance(touch1.pageX,touch2.pageX,touch1.pageY,touch2.pageY);
                                $(">.resPopupTargetImg",this).JResPopupBox({
                                    action:'plus',
                                    scalePx: Math.round((touchOrangal - updateOrangal)*-1)
                                });
                                touchOrangal = updateOrangal; //更新touch間距
                            }
                        }
                        //alert(touchOrangal - updateOrangal);
                    }
                });

        //計算兩點間距離
        function fnGetDistance(x1,x2,y1,y2){
            x1 = eval(x1);
            x2 = eval(x2);
            y1 = eval(y1);
            y2 = eval(y2);
            var xd = x2 - x1;
            var yd = y2 - y1;
            return Math.pow((xd * xd + yd * yd), 0.5);
        }

        //檢查圖片尺寸
        function fnCheckFormat(searchStr){
            if (searchStr.indexOf('.jpg') != -1) {
                checkFormat = true;
            }else if (searchStr.indexOf('.jpeg') != -1) {
                checkFormat = true;
            }else if (searchStr.indexOf('.gif') != -1) {
                checkFormat = true;
            }else if (searchStr.indexOf('.png') != -1) {
                checkFormat = true;
            }else{
                checkFormat = false;
            }
            return checkFormat;
        }
    };

    //mobile enlarge control
    $(function(){$('body').append('<div id="resEnlargePopupWrap">');})
    JResEnlargeControl = function(options) {
        var defaults = {
            id: "",
            action: "",
            scalePx: 20,
            enlargeSize: 'auto',
            extraSource: ''
        };
        options = $.extend(defaults, options);

        var container = "#resEnlargePopupWrap";
        var id = options.id;
        var action = options.action;
        var scalePx = options.scalePx;
        var enlargeSize = options.enlargeSize;
        var extraSource = options.extraSource;
        //console.log($("#"+id+">.resEnlargeContent").get(0).outerHTML);
        if (action == 'open') {



            if (enlargeSize == "auto") {
                var FitIconVal = 'style="display:none"';
                var OrangIconVal = "";
            } else {
                var FitIconVal = "";
                var OrangIconVal = 'style="display:none"';
            }


            
                                    var resEnlargeControl = '<div class="resEnlargeCloseIcon" toggle="' + id + '" onclick=""></div>' +
                                                             '<div class="resEnlargeFitIcon" toggle="' + id + '" ' + FitIconVal + ' onclick=""></div>' + 
                                                             '<div class="resEnlargeOraginalIcon" toggle="' + id + '" ' + OrangIconVal + ' onclick=""></div>' + 
                                                             '<div class="resEnlargePlusIcon" toggle="' + id + '" onclick=""></div>' + 
                                                             '<div class="resEnlargeDisIcon" toggle="' + id + '" onclick=""></div>';
                                    
                                    var resEnlargeContent = '<div class="resEnlargeContent" toggle="' + id + '">' + 
                                                            '<div class="resEnlargeControlBar">' + resEnlargeControl + "</div>" + 
                                                            '<img id="' + id + '_enObj" src="' + extraSource + '" style="width:' + enlargeSize + ';height:auto;" />' + "</div>";


            $(container).html(resEnlargeContent);
        }

        switch (action) {
          //打開視窗
            case "open":
                $(container).fadeIn(200);
                if ($("#mobile_nav_bottom").attr("resState") != "notUsed") {
                    $("#mobile_nav_bottom").fadeOut(100);
                }
                if ($("#mobile_nav").attr("resState") != "notUsed") {
                    $("#mobile_nav").fadeOut(100);
                }
                if(!$("#resMainWrap").hasClass('resPannelOpen')){
                    $("html").addClass("resHtmlOverflow");
                }
            
            break;

          //關閉視窗
            case "close":
                $(container).fadeOut(200);
                if ($("#mobile_nav_bottom").attr("resState") != "notUsed") {
                    $("#mobile_nav_bottom").fadeIn(100);
                }
                if ($("#mobile_nav").attr("resState") != "notUsed") {
                    $("#mobile_nav").fadeIn(100);
                }
                if(!$("#resMainWrap").hasClass('resPannelOpen')){
                    $("html").removeClass("resHtmlOverflow");
                }
            break;

          //符合尺寸
            case "fit":
                if ($(container + " .resEnlargeOraginalIcon").css("display") == "none") {
                    $(container + " .resEnlargeFitIcon").hide();
                    $(container + " .resEnlargeOraginalIcon").show();
                    $(container + ">.resEnlargeContent>img").attr("style", "width:auto !important");
                }
            break;

          //原始大小
            case "oraginal":
                if ($(container + " .resEnlargeFitIcon").css("display") == "none") {
                    $(container + " .resEnlargeFitIcon").show();
                    $(container + " .resEnlargeOraginalIcon").hide();
                    $(container + ">.resEnlargeContent>img").attr("style", "width:100% !important");
                }
            break;

          //放大
            case "plus":
                $(container + ">.resEnlargeContent>img").attr("style", "width:" + ($(container + ">.resEnlargeContent>img").width() + scalePx) + "px !important");
                var targetFrame = $(container + ">.resEnlargeContent");
                if ($(container + ">.resEnlargeContent>img").width() > $(window).width()) {
                    targetFrame.scrollLeft(targetFrame.scrollLeft()+((scalePx)/2));
                }

                if ($(container + ">.resEnlargeContent>img").height() > $(window).height()) {
                    targetFrame.scrollTop(targetFrame.scrollTop()+((scalePx)/2));
                }
            break;

          //縮小
            case "dis":
                $(container + ">.resEnlargeContent>img").attr("style", "width:" + ($(container + ">.resEnlargeContent>img").width() - scalePx) + "px !important");

                var targetFrame = $(container + ">.resEnlargeContent");
                if ($(container + ">.resEnlargeContent>img").width() > $(window).width()) {
                    targetFrame.scrollLeft(targetFrame.scrollLeft()-((scalePx)/2));
                }

                if ($(container + ">.resEnlargeContent>img").height() > $(window).height()) {
                    targetFrame.scrollTop(targetFrame.scrollTop()-((scalePx)/2));
                }
            break;
        }
    };

    //resPopup box
    $(function(){$('body').append('<div class="resPopupBoxWrap">');})
    $.fn.JResPopupBox = function(options) {
        var defaults = {
            type: 'img',
            action: 'open',
            scalePx: 20
        };
        options = $.extend(defaults, options);
        var obj = $(this);
        var type = options.type;
        var action = options.action;
        var scalePx = options.scalePx;
        var content = "";
        var setStyle = 'style="width:auto;height:auto;"';

        //effect
        switch (action) {
          //打開視窗
            case "open":
                //建立pupup up物件
                var popupBox = '<div class="resPopupBoxContent">'+
                                    '<div class="resPopupBoxControl">'+
                                        '<div class="resPopupBoxCloseBtn resPopupBoxBtnGroup"></div>'+
                                        '<div class="resPopupBoxMinusBtn resPopupBoxBtnGroup"></div>'+
                                        '<div class="resPopupBoxPlusBtn resPopupBoxBtnGroup"></div>'+
                                    '</div>'+
                                    '<div class="resPopupBoxContentArea"></div>'+
                                '</div>';
                //將popup物件寫入
                $(".resPopupBoxWrap").html(popupBox);

                //判斷要開啟的物件
                switch(type){
                    case "img":
                    default:
                        var defaultW,defaultH;
                        var imgW,imgH;
                        var source = $(this).attr("source"); //先取得我們要放大的圖

                        $('body').append('<img class="resTmpImgObj" src="'+source+'" />'); //建立放大物件已取得尺寸
                        $(".resTmpImgObj").one('load', function() {
                            defaultW = $(this).css('width');
                            defaultH = $(this).css('height');
                            $(this).css({width: "auto",height: "auto"}); //先還原圖片
                            imgW = $(this).width(); 
                            imgH = $(this).height(); 
                            $(this).css({width: defaultW, height: defaultH});//在復原原設定

                            //console.log('W:'+imgW+', H:'+imgH+' WinW:'+$(window).width()+' WinH:'+$(window).height());

                             if (imgH > imgW){
                                //如果圖片是直的
                                if (imgH > $(window).height()) {
                                    setStyle = 'style="width:auto;height:'+($(window).height()-100)+'px;"';
                                }
                             }else{
                                //如果圖片是橫的或方的
                                if (imgW >= $(window).width()) {
                                    setStyle = 'style="width:'+($(window).width()-100)+'px;height:auto;"';
                                }else if (imgH >= $(window).height()) {
                                    setStyle = 'style="width:auto;height:'+($(window).height()-100)+'px;"';
                                }
                             }
                                
                             content = '<img src="'+source+'" class="resPopupTargetImg" '+setStyle+' />';

                             $(this).remove(); //取得尺寸後移除
                             $(".resPopupBoxContentArea").append(content); //將內容寫入

                        }).each(function(){
                          if(this.complete) {
                            $(this).trigger('load');
                          }
                        });
                        
                    break;
                }

                $(".resPopupBoxWrap").fadeIn(500); 
                if(!$("#resMainWrap").hasClass('resPannelOpen')){
                    $("html").addClass("resHtmlOverflow");
                }
            
            break;

          //關閉視窗
            case "close":
                $(".resPopupBoxWrap").fadeOut(500);
                if(!$("#resMainWrap").hasClass('resPannelOpen')){
                    $("html").removeClass("resHtmlOverflow");
                }
            break;

          //放大
            case "plus":
                $(".resPopupTargetImg").attr("style", "width:" + ($(".resPopupTargetImg").width() + scalePx) + "px !important");
                var targetFrame = $(".resPopupBoxContentArea");
                if ($(".resPopupTargetImg").width() > $(window).width()) {
                    targetFrame.scrollLeft(targetFrame.scrollLeft()+((scalePx)/2));
                }

                if ($(".resPopupTargetImg").height() > $(window).height()) {
                    targetFrame.scrollTop(targetFrame.scrollTop()+((scalePx)/2));
                }

            break;

          //縮小
            case "dis":
                $(".resPopupTargetImg").attr("style", "width:" + ($(".resPopupTargetImg").width() - scalePx) + "px !important");
                var targetFrame = $(".resPopupBoxContentArea");
                if ($(".resPopupTargetImg").width() > $(window).width()) {
                    targetFrame.scrollLeft(targetFrame.scrollLeft()-((scalePx)/2));
                }

                if ($(".resPopupTargetImg").height() > $(window).height()) {
                    targetFrame.scrollTop(targetFrame.scrollTop()-((scalePx)/2));
                }
            break;
        }

    }

}(jQuery, document, window));