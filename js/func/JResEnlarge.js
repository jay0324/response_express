(function ($, document, window) {
    //JResEnlarge 放大圖功能
    $.fn.JResEnlarge = function(options) {
        //make img with enlarge formate
        var defaults = {
            enlargeSize: "100%",
            scalePx: 20,
            paddingAmt: 20,
            extraSource: "",
            setUILoadWidth: 800,
            popupMode: false,
            enablePluginMode: false
        };
        options = $.extend(defaults, options);
        var setUILoadWidth = options.setUILoadWidth;
        var popupMode = options.popupMode;
        var enablePluginMode = options.enablePluginMode;

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
                                    
                                    //建立wrap內容
                                    $(this).wrap('<div class="resEnlargeWraper"><div id="' + thisID + '" class="resEnlarge" style="width:' + objW + 'px;' + wrapH + '">');
                                    $(this).before('<div class="resEnlargeOpenIcon" onclick="JResEnlargeControl({id:\'' + thisID + "',action:'open',scalePx:" + scalePx + '});return false;"></div>');
                                    if (enlargeSize == "auto") {
                                        var FitIconVal = 'style="display:none"';
                                        var OrangIconVal = "";
                                    } else {
                                        var FitIconVal = "";
                                        var OrangIconVal = 'style="display:none"';
                                    }
                                    var resEnlargeControl = '<div class="resEnlargeCloseIcon" toggle="' + thisID + '" onclick=""></div>' +
                                                             '<div class="resEnlargeFitIcon" toggle="' + thisID + '" ' + FitIconVal + ' onclick=""></div>' + 
                                                             '<div class="resEnlargeOraginalIcon" toggle="' + thisID + '" ' + OrangIconVal + ' onclick=""></div>' + 
                                                             '<div class="resEnlargePlusIcon" toggle="' + thisID + '" onclick=""></div>' + 
                                                             '<div class="resEnlargeDisIcon" toggle="' + thisID + '" onclick=""></div>';
                                    var extraSource = options.extraSource != "" ? options.extraSource : ($(this).attr("toggle-src") != undefined) ? $(this).attr("toggle-src") : $(this).attr("src");
                                    extraSource = (enablePluginMode) ? enablePluginModeSource : extraSource;
                                    var resEnlargeContent = '<div class="resEnlargeContent" toggle="' + thisID + '">' + 
                                                            '<div class="resEnlargeControlBar">' + resEnlargeControl + "</div>" + 
                                                            '<img id="' + thisID + '_enObj" src="' + extraSource + '" style="width:' + enlargeSize + ';height:auto;" />' + "</div>";
                                    $(this).after(resEnlargeContent);

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
                                            $(this).unwrap('a');
                                        }else{
                                            var doUsed = false;
                                        }
                                    break;
                                    default:
                                        options.extraSource = ($(this).attr("toggle-src") != undefined) ? $(this).attr("toggle-src") : $(this).attr("src");
                                        var doUsed = true;
                                    break;
                                }
                            } else {
                                var doUsed = false;
                            }
                        }
                        if (doUsed) {
                            $(this).each(function() {
                                $(this).addClass("resPopupBox");
                                $(this).attr("source",options.extraSource);
                            })
                        }
                    }
                })
            }
        }

        //event
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
                }).on('click','.resPopupBoxCloseBtn, .resPopupBoxWrap',function(){
                    $(this).JResPopupBox({
                        action:'close'
                    });
                })
                

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
            scalePx: 20
        };
        options = $.extend(defaults, options);

        var container = "#resEnlargePopupWrap";
        var id = options.id;
        var action = options.action;
        var scalePx = options.scalePx;
        //console.log($("#"+id+">.resEnlargeContent").get(0).outerHTML);
        if (action == 'open') {
            $(container).html($("#"+id+">.resEnlargeContent").get(0).outerHTML);
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
            break;

          //縮小
            case "dis":
                $(container + ">.resEnlargeContent>img").attr("style", "width:" + ($(container + ">.resEnlargeContent>img").width() - scalePx) + "px !important");
            break;
        }
    };

    //resPopup box
    $(function(){$('body').append('<div class="resPopupBoxWrap">');})
    $.fn.JResPopupBox = function(options) {
        var defaults = {
            type: 'img',
            action: 'open'
        };
        options = $.extend(defaults, options);
        var obj = $(this);
        var type = options.type;
        var action = options.action;
        var content = "";
        var setStyle = 'style="width:auto;height:auto;"';

        //effect
        if (action == "open"){
            //建立pupup up物件
            var popupBox = '<div class="resPopupBoxContent">'+
                                '<div class="resPopupBoxCloseBtn"></div>'+
                                '<div class="resPopupBoxContentArea">'+
                                '</div>'+
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
                        $(this).css({width: defaultW,height: defaultH});//在復原原設定

                        //console.log('W:'+imgW+', H:'+imgH+' WinW:'+$(window).width()+' WinH:'+$(window).height());

                         if (imgH > imgW){
                            //如果圖片是直的
                            if (imgH > $(window).height()) {
                                setStyle = 'style="width:auto;height:'+($(window).height()-100)+'px;"';
                            }
                         }else{
                            //如果圖片是橫的或方的
                            if (imgW > $(window).width()) {
                                setStyle = 'style="width:'+($(window).width()-100)+'px;height:auto;"';
                            }else if (imgH > $(window).height()) {
                                setStyle = 'style="width:auto;height:'+($(window).height()-100)+'px;"';
                            }
                         }
                            
                         content = '<img src="'+source+'" '+setStyle+' />';

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
            
        }else{
            $(".resPopupBoxWrap").fadeOut(500);
            if(!$("#resMainWrap").hasClass('resPannelOpen')){
                $("html").removeClass("resHtmlOverflow");
            }
        }
    }

}(jQuery, document, window));