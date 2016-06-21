(function ($, document, window) {
	//JSlideImg 功能
    $.fn.JSlideImg = function(options) {
        var defaults = {
            disObj: this,
            childTag: "img",
            transitTime: 1,
            transitStyle: '',
            holdTime: 4,
            paddingAmt: 0,
            layout: "clear",
            touchSwipAmt: 100,
            thumb: {
                state: false,
                amount: 4,
                width:100,
                height:100,
                type: 'horizontal',
                position: 'bottom:0;left:0;'
            },
            slideBtn:{
                state: false,
                trigger: 'click',
                width: 100,
                height: 100,
                type: 'horizontal'
            },
            autoPlay: true,
            setupResposive: {},
            onTrans: false,
            onHold: false
        };
        options = $.extend(defaults, options);

        //預設先置入loader mask
        $(this).addClass("resJSlideImg");

        $(this).ready(function(){
            $(options.disObj).append('<div class="loader"></div>');
        })

        //查看是否有使用，或是隱藏的狀態下就不執行
        if ($("#" + options.disObj.attr("id")).length > 0 && $("#" + options.disObj.attr("id")).css("display") != "none") {
            if (options.childTag.toLowerCase() == "img") $(options.childTag, this).addClass("resUnlarger");
            //禁止resEnlarge使用
            //設定排版方式
            switch (options.layout.toLowerCase()) {
              case "left":
                $(this).css({
                    "float": "left"
                });
                break;

              case "right":
                $(this).css({
                    "float": "right"
                });
                break;

              case "center":
                $(this).css({
                    clear: "both",
                    "margin-right": "auto",
                    "margin-left": "auto"
                });
                break;

              default:
                $(this).css({
                    clear: "both"
                });
                break;
            }
            //if ($.JRes_getCookie() == "true" || $.JRes_getCookie() == null || $.JRes_getCookie() == "") {
            var paddingAmt = options.paddingAmt;
            var maxAmt = $(">"+options.childTag.toLowerCase(), this).length - 1;
            var maxAmtThumb = $(">"+options.childTag.toLowerCase(), this).length;
            var resJSlideWidth, resJSlideHeight;
            var resContainer = $(this);
            var autoPlay = options.autoPlay;
            var thumb = options.thumb;
            var slideBtn = options.slideBtn;
            var setupResposive = options.setupResposive;
            var curr = 0;
            var prev = -1;
            var begin = true;
            var loop;
            var swipToNextPOS = 0;
            var swipToPrevPOS = 0;
            var trackSwipEvent = false;
            var touchSwipAmt = options.touchSwipAmt;

            //螢幕寬與上層容器取得其最小值來作為最大寬度
            var maxJSlideWidth = Math.min(($(window).width() - paddingAmt), ($(resContainer).parent().width() - paddingAmt));
            var maxJSlideHeight;
            if (maxJSlideWidth == 0) maxJSlideWidth = $(window).width() - paddingAmt;

            //如果物件是連結,則抓取子物件img來判斷長寬
            var getChildImg = (options.childTag.toLowerCase() == 'a')?">img":"";

            $(options.childTag.toLowerCase() + ":eq(0)" + getChildImg, this).one('load', function() {
                resJSlideWidth = $(this).width();
                resJSlideHeight = $(this).height();

                //檢查圖片長寬比例
                if (resJSlideWidth >= maxJSlideWidth) {
                    resJSlideHeight = resJSlideHeight * (maxJSlideWidth / resJSlideWidth);
                    resJSlideWidth = maxJSlideWidth;
                }

                resContainer.width(resJSlideWidth);
                resContainer.height(resJSlideHeight);
                maxJSlideHeight = resJSlideHeight;
                $(options.childTag.toLowerCase(), resContainer).css("width", "100%");
            }).each(function(){
              if(this.complete) {
                $(this).trigger('load');
              }
            });

            //如果slideshow物件非img則取得容器寬高
            if (resJSlideWidth == undefined) resJSlideWidth = $(options.disObj).width();
            if (resJSlideHeight == undefined) resJSlideHeight = $(options.disObj).height();

            //設定物件內容長寬
            $(options.childTag.toLowerCase() + getChildImg, this).each(function(){
                $(this).one('load', function() {
                    resJSlideWidth_item = $(this).width();
                    resJSlideHeight_item = $(this).height();

                    //檢查圖片長寬比例
                    if (resJSlideWidth_item < resJSlideHeight_item) {
                        //如果圖片是直的
                        if (resJSlideHeight_item >= maxJSlideHeight) {
                            resJSlideWidth_item = resJSlideWidth_item * (maxJSlideHeight / resJSlideHeight_item);
                            resJSlideHeight_item = maxJSlideHeight;
                        }
                    }else if (resJSlideWidth_item > resJSlideHeight_item) {
                        //如果圖片是橫的
                        if (resJSlideWidth_item >= maxJSlideWidth) {
                            resJSlideHeight_item = resJSlideHeight_item * (maxJSlideWidth / resJSlideWidth_item);
                            resJSlideWidth_item = maxJSlideWidth;
                        }
                    }else{
                        //如果圖片是方的
                        if (resJSlideWidth_item > maxJSlideWidth) {
                            resJSlideHeight_item = resJSlideHeight_item * (maxJSlideWidth / resJSlideWidth_item);
                            resJSlideWidth_item = maxJSlideWidth;
                        }else{
                            resJSlideWidth_item = resJSlideWidth_item * (maxJSlideHeight / resJSlideHeight_item);
                            resJSlideHeight_item = maxJSlideHeight;
                        }
                    }
                    //console.log(maxJSlideHeight+','+resJSlideWidth_item+','+resJSlideHeight_item);

                    $(this).width(resJSlideWidth_item);
                    $(this).height(resJSlideHeight_item);

                }).each(function(){
                  if(this.complete) {
                    $(this).trigger('load');
                  }
                });
            })

            //檢查是否有響應式設定
            fnCheckResponsiveSetup();

            //取得物件小圖設定值
            if(!$.isEmptyObject(thumb)){
                if(thumb['state']) {
                    var ThumbScroller = (maxAmtThumb <= thumb['amount']) ? false : true;
                    if (thumb['type'] == 'vertical') {
                        var btnW = (thumb['width']+12);
                        var btnH = (ThumbScroller) ? 20 : 0;
                        var positionPrev = "top:0;";
                        var positionNext = "bottom:0;";
                        var positionTrack = "top:"+btnH+"px;";
                        var thumbW = (thumb['width']+12);
                        var thumbH = (((thumb['height']+12) * thumb['amount']) + (btnH*2));
                        var maxThumbTrack = (((maxAmtThumb/thumb['amount'])-1)*thumbH)-((btnH*2)+(10*thumb['amount']));
                        var thumbWUL = (thumb['width']+12) + 'px';
                        var thumbHUL = "auto";
                        if (thumb['position'] === 'auto'){
                            var posH = (resJSlideHeight - thumbH)/2; 
                            var thumbPos = 'left:10px;top:'+posH+'px;';
                        }else{
                            var thumbPos = thumb['position'];
                        }
                     }else{
                        var btnW = (ThumbScroller) ? 20 : 0;
                        var btnH = (thumb['height']+12);
                        var positionPrev = "left:0;";
                        var positionNext = "right:0;";
                        var positionTrack = "left:"+btnW+"px;";
                        var thumbW = (((thumb['width']+12) * thumb['amount']) + (btnW*2));
                        var thumbH = (thumb['height']+12);
                        var maxThumbTrack = (((maxAmtThumb/thumb['amount'])-1)*thumbW)-((btnW*2)+(10*thumb['amount']));
                        var thumbWUL = 'auto';
                        var thumbHUL = (thumb['height']+12) + 'px';
                        if (thumb['position'] === 'auto'){
                            var posW = (resJSlideWidth - thumbW)/2; 
                            var thumbPos = 'left:'+posW+'px;bottom:10px;';
                        }else{
                            var thumbPos = thumb['position'];
                        }
                     } 

                    var thumbDom = '<div class="resJSlideImgThumb resJSlideImgController" style="'+thumbPos+'width:'+thumbW+'px;height:'+thumbH+'px">'+
                    '<a class="resJSlideImgThumbPrev end" href="#" style="'+positionPrev+'width:'+btnW+'px;height:'+btnH+'px"></a>'+
                    '<ul class="resJSlideImgThumbTrack" style="'+positionTrack+'width:'+thumbWUL+';height:'+thumbHUL+'">';
                    $("#" + options.disObj.attr("id") + ">" + options.childTag.toLowerCase()).each(function(){
                        var getDefaultTitle = (options.childTag.toLowerCase() == "img")?($(this).attr('alt') == undefined || $(this).attr('alt') == "")?"":$(this).attr('alt'):($(this).attr('title') == undefined || $(this).attr('title') == "")?"":$(this).attr('title');
                        var source = ($(this).attr('toggle-thumb-source') == undefined || $(this).attr('toggle-thumb-source') == "") ? $(this).attr('src') : $(this).attr('toggle-thumb-source');
                        var title = ($(this).attr('toggle-thumb-title') == undefined || $(this).attr('toggle-thumb-title') == "") ? getDefaultTitle : $(this).attr('toggle-thumb-title');
                        var setStyleForThumbImg = (title == undefined || title == "") ? ' resThumbFit ' : '';
                        thumbDom += '<li class="resJSlideImgThumbItem'+setStyleForThumbImg+'" style="width:'+thumb['width']+'px;height:'+thumb['height']+'px;">'+
                            '<img src="'+source+'" />'+
                            '<span>'+title+'</span>'+
                        '</li>';
                    })
                    thumbDom += '</ul><a class="resJSlideImgThumbNext" href="#" style="'+positionNext+'width:'+btnW+'px;height:'+btnH+'px"></a></div>';
                    $(options.disObj).append(thumbDom);
                }
            }

            //取得前後項目切換按鈕
            if(!$.isEmptyObject(slideBtn)){
                if(slideBtn['state']) {
                    if (slideBtn['type'] == 'vertical') {
                        var setSlideBtnContainerPos = 'left:' + ((resJSlideWidth - slideBtn['width'])/2) + 'px;';
                        var setSlideBtnContainerWidth = (slideBtn['width'] === 'auto')?'100%':slideBtn['width']+'px';
                        var setSlideBtnContainerHeight = resJSlideHeight;
                        var setSlideBtnWidth = (slideBtn['width'] === 'auto')?'100%':slideBtn['width']+'px';
                        var setSlideBtnHeight = (slideBtn['height'] === 'auto')?'100%':slideBtn['height']+'px';
                        var setSlideBtnPrevPos = 'top:0;';
                        var setSlideBtnNextPos = 'bottom:0;';
                        var setSlideBtnTriggleEvent = (slideBtn['trigger'] === undefined) ? 'click':slideBtn['trigger'];
                    }else{
                        var setSlideBtnContainerPos = 'top:' + ((resJSlideHeight - slideBtn['height'])/2) + 'px;';
                        var setSlideBtnContainerWidth = resJSlideWidth;
                        var setSlideBtnContainerHeight = (slideBtn['height'] === 'auto')?'100%':slideBtn['height']+'px';
                        var setSlideBtnWidth = (slideBtn['width'] === 'auto')?'100%':slideBtn['width']+'px';
                        var setSlideBtnHeight = (slideBtn['height'] === 'auto')?'100%':slideBtn['height']+'px';
                        var setSlideBtnPrevPos = 'left:0px;';
                        var setSlideBtnNextPos = 'right:0px;';
                        var setSlideBtnTriggleEvent = (slideBtn['trigger'] === undefined) ? 'click':slideBtn['trigger'];
                    }
                    var slideBtnDom = '<div class="resJSlideImgslideBtn resJSlideImgController" style="width:'+setSlideBtnContainerWidth+';height:'+setSlideBtnContainerHeight+'">'+
                        '<a class="resJSlideImgslideBtnPrev" href="#" style="'+setSlideBtnContainerPos+setSlideBtnPrevPos+'width:'+setSlideBtnWidth+';height:'+setSlideBtnHeight+'"></a>'+
                        '<a class="resJSlideImgslideBtnNext" href="#" style="'+setSlideBtnContainerPos+setSlideBtnNextPos+'width:'+setSlideBtnWidth+';height:'+setSlideBtnHeight+'"></a>'+
                    '</div>';
                    $(options.disObj).append(slideBtnDom);
                }
            }

        }

        //start slideshow
        if ($("#" + options.disObj.attr("id")).length > 0 && $("#" + options.disObj.attr("id")).css("display") != "none") {
            //完成載入後再將loader隱藏
            $(window).on("load", function(){
                //隱藏loader
                $(".loader",options.disObj).fadeOut(200);

                //進行loop
                if (maxAmt == 0) {
                    $("#" + options.disObj.attr("id") + ">" + options.childTag.toLowerCase()).animate({
                        opacity: "1"
                    }, options.transitTime * 1e3);
                } else {
                    //建立效果及迴圈
                    fnDefineLoop();
                }
            })
            
        }

        //thumb controller
        $("#" + options.disObj.attr("id")).on('click',".resJSlideImgThumbItem", function(){
            //set click item to current state
            var chkPrev = (curr == 0) ? maxAmt : curr-1; //取得上一個項目
            var chkCurr = $(this).index();
            //console.log(prev+','+curr);

            //click item is not current
            if(chkPrev != chkCurr) {
                //reset loop and all current state
                fnStopLoop();

                //set click item to current state
                prev = chkPrev; //取得上一個項目
                curr = chkCurr;

                //console.log('prev:'+prev+' curr:'+curr);
                begin = false;

                //建立效果及迴圈
                fnDefineLoop();
            }

            return false;
        })

        //thumb prevBtn
        $(options.disObj).on('click',".resJSlideImgThumbPrev", function(){
            if (thumb['type'] == 'vertical') {
                var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("top").replace("px",""));
                if (currentPosition < btnH) {
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbNext").removeClass('end');
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                        top: (currentPosition+thumbH-(btnH*2)) + "px"
                    },500);
                }else{
                    $(this).addClass('end');
                }
            }else{
                var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("left").replace("px",""));
                if (currentPosition < btnW) {
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbNext").removeClass('end');
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                        left: (currentPosition+thumbW-(btnW*2)) + "px"
                    },500);
                }else{
                    $(this).addClass('end');
                }
            }
            return false;
        })

        //thumb nextBtn
        $(options.disObj).on('click',".resJSlideImgThumbNext", function(){
            if (thumb['type'] == 'vertical') {
                var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("top").replace("px",""));
                if ((maxThumbTrack*-1) < currentPosition) {
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbPrev").removeClass('end');
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                        top: (currentPosition-thumbH+(btnH*2)) + "px"
                    },500);
                }else{
                    $(this).addClass('end');
                }
            }else{
                var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("left").replace("px",""));
                if ((maxThumbTrack*-1) < currentPosition) {
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbPrev").removeClass('end');
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                        left: (currentPosition-thumbW+(btnW*2)) + "px"
                    },500);
                }else{
                    $(this).addClass('end');
                }
            }
            return false;
        })
        
        //console.log(setSlideBtnTriggleEvent);

        //slideshow PrevBtn
        $(options.disObj).on(setSlideBtnTriggleEvent,".resJSlideImgslideBtnPrev", function(e){
            //reset loop and all current state
            fnStopLoop();
            //console.log(e);
            //set click item to current state
            //loop時以自動加一所以，需要減2
            prev = (curr == 0) ? maxAmt : curr-1; //先還原為目前的項目
            curr = (prev <= 0) ? maxAmt : prev-1; //取得上一個項目
            begin = false;
            
            //建立效果及迴圈
            fnDefineLoop(true);

            return false;
        })

        //slideshow NextBtn
        $(options.disObj).on(setSlideBtnTriggleEvent,".resJSlideImgslideBtnNext", function(e){
            //reset loop and all current state
            fnStopLoop();
            //console.log(e);
            //set click item to current state
            //loop時以自動加一所以，不必再加
            begin = false;

            //建立效果及迴圈
            fnDefineLoop(true);

            return false;
        })

        //slideshow touch event
        $(options.disObj).on('touchstart',function(e) {
            //touchstart
            var touch = e.originalEvent.touches[0];
            swipToNextPOS = touch.pageX-touchSwipAmt;
            swipToPrevPOS = touch.pageX+touchSwipAmt;
            trackSwipEvent = true;

        }).on('touchmove',function(e) {
            //touchmove
            var touch = e.originalEvent.touches[0];

            //swip to next
            if (trackSwipEvent && swipToNextPOS > touch.pageX){
                //reset loop and all current state
                fnStopLoop();
                begin = false;

                //建立效果及迴圈
                fnDefineLoop(true);
                trackSwipEvent = false;
            }

            //swip to prev
            if (trackSwipEvent && swipToPrevPOS < touch.pageX){
                //reset loop and all current state
                fnStopLoop();
                prev = (curr == 0) ? maxAmt : curr-1; //先還原為目前的項目
                curr = (prev <= 0) ? maxAmt : prev-1; //取得上一個項目
                begin = false;
                
                //建立效果及迴圈
                fnDefineLoop(true);
                trackSwipEvent = false;
            }

        });


        //建立效果及迴圈
        function fnDefineLoop(control){
            control = control || false; //如無定義預設值false

            //如果指令來自控制按鈕
            if (control) {
                fnUpdateThumbTrack();
            }

            //add current active class to thumb item
                $("#" + options.disObj.attr("id") + " .resJSlideImgThumbItem").removeClass('active');
                $("#" + options.disObj.attr("id") + " .resJSlideImgThumbItem:eq("+curr+")").addClass('active');

                //start to slide the first slidshow
                JResSlideShow({
                        disObj: options.disObj.attr("id"),
                        childTag: options.childTag.toLowerCase(),
                        curr: curr,
                        prev: prev,
                        maxAmt: maxAmt,
                        transitTime: options.transitTime,
                        transitStyle: options.transitStyle,
                        holdTime: options.holdTime,
                        begin: begin,
                        onTrans: options.onTrans,
                        onHold: options.onHold
                });

                begin = false; //進場預設值設為flase
                curr = (curr < maxAmt) ? curr+1 : 0; //取得下一個項目
                prev = -1; //較果結束後要把prev設回預設值

                //如果有自訂transition延遲時間加上去
                if (options.onTrans != false) {
                    var loopTime = options.holdTime * 1e3 + options.transitTime * 1e3;
                }else{
                    var loopTime = options.holdTime * 1e3;
                }

                //if auto play enable
                //start loop the slideshow
                if (autoPlay) {
                    loop = setInterval(function(){

                        fnUpdateThumbTrack();

                        JResSlideShow({
                            disObj: options.disObj.attr("id"),
                            childTag: options.childTag.toLowerCase(),
                            curr: curr,
                            prev: prev,
                            maxAmt: maxAmt,
                            transitTime: options.transitTime,
                            transitStyle: options.transitStyle,
                            holdTime: options.holdTime,
                            begin: begin,
                            onTrans: options.onTrans,
                            onHold: options.onHold
                        });

                        curr = (curr < maxAmt) ? curr+1 : 0; //取得下一個項目

                    }, loopTime);
                }

                return loop;
        }

        //停止重設迴圈
        function fnStopLoop(){
            clearTimeout(loop);
            $("#" + options.disObj.attr("id") + ">" + options.childTag.toLowerCase()).each(function(){
                if(!$(this).hasClass("resJSlideImgController")) {
                    $(this).css({
                        "z-index":"0"
                    });
                    /*$(this).animate({
                        opacity: "0"
                    }, options.transitTime);*/
                }
            })
        }

        //更新thumbtrack位置設定
        function fnUpdateThumbTrack(){
            //set loop for thumb track
                        if (ThumbScroller && thumb['state']) {
                            if (thumb['type'] == 'vertical') {
                                var currentTrackPosition = (Math.floor(curr/thumb['amount'])*thumbH)-((btnH*2)+(10*thumb['amount']));
                                var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("top").replace("px",""));
                                //console.log(currentTrackPosition+','+(currentPosition*-1));
                                $("#" + options.disObj.attr("id") + " .resJSlideImgThumbPrev").removeClass('end');
                                $("#" + options.disObj.attr("id") + " .resJSlideImgThumbNext").removeClass('end');
                                if (currentTrackPosition > (currentPosition*-1)) {
                                    if ((maxThumbTrack*-1) < currentPosition) {
                                        var newPos = (currentPosition-thumbH+(btnH*2));
                                    }
                                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                                        top: newPos + "px"
                                    },500);
                                }else if (curr == 0){
                                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                                        top: btnH + "px"
                                    },500);
                                }
                            }else{
                                var currentTrackPosition = (Math.floor(curr/thumb['amount'])*thumbW)-((btnW*2)+(10*thumb['amount']));
                                var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("left").replace("px",""));
                                //console.log(thumb['amount']+','+currentTrackPosition+','+(currentPosition*-1));
                                $("#" + options.disObj.attr("id") + " .resJSlideImgThumbPrev").removeClass('end');
                                $("#" + options.disObj.attr("id") + " .resJSlideImgThumbNext").removeClass('end');
                                if (currentTrackPosition > (currentPosition*-1)) {
                                    if ((maxThumbTrack*-1) < currentPosition) {
                                        var newPos = (currentPosition-thumbW+(btnW*2));
                                    }
                                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                                        left: newPos + "px"
                                    },500);
                                }else if (curr == 0){
                                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                                        left: btnW + "px"
                                    },500);
                                }
                            }
                        }
        }

        //檢查是否有響應式設定
        function fnCheckResponsiveSetup(){
            if(!$.isEmptyObject(setupResposive)){
                var checkWinWArray = [];
                for (var winW in setupResposive){
                    checkWinWArray.push(winW); //先建立Windows Index for sorting
                }

                checkWinWArray = checkWinWArray.sort(function(a, b){return b-a}); //DESC Sorting

                //update listAmt
                for (var i=0;i<checkWinWArray.length;i++) {
                    if ($(window).width() < checkWinWArray[i]) {
                        //thumb響應式設定
                        thumb['state'] = (setupResposive[checkWinWArray[i]]['state'] != undefined)?setupResposive[checkWinWArray[i]]['state']:thumb['state'];
                        thumb['amount'] = (setupResposive[checkWinWArray[i]]['amount'] != undefined)?setupResposive[checkWinWArray[i]]['amount']:thumb['amount'];
                        thumb['width'] = (setupResposive[checkWinWArray[i]]['width'] != undefined)?setupResposive[checkWinWArray[i]]['width']:thumb['width'];
                        thumb['height'] = (setupResposive[checkWinWArray[i]]['height'] != undefined)?setupResposive[checkWinWArray[i]]['height']:thumb['height'];
                        thumb['type'] = (setupResposive[checkWinWArray[i]]['type'] != undefined)?setupResposive[checkWinWArray[i]]['type']:thumb['type'];
                        thumb['position'] = (setupResposive[checkWinWArray[i]]['position'] != undefined)?setupResposive[checkWinWArray[i]]['position']:thumb['position'];
                        
                        if(!$.isEmptyObject(setupResposive[checkWinWArray[i]]['slideBtn'])){
                            //上下項目響應式設定
                            slideBtn['state'] = (setupResposive[checkWinWArray[i]]['slideBtn']['state'] != undefined)?setupResposive[checkWinWArray[i]]['slideBtn']['state']:slideBtn['state'];
                            slideBtn['width'] = (setupResposive[checkWinWArray[i]]['slideBtn']['width'] != undefined)?setupResposive[checkWinWArray[i]]['slideBtn']['width']:slideBtn['width'];
                            slideBtn['height'] = (setupResposive[checkWinWArray[i]]['slideBtn']['height'] != undefined)?setupResposive[checkWinWArray[i]]['slideBtn']['height']:slideBtn['height'];
                            slideBtn['type'] = (setupResposive[checkWinWArray[i]]['slideBtn']['type'] != undefined)?setupResposive[checkWinWArray[i]]['slideBtn']['type']:slideBtn['type'];
                        }
                    }
                }
            }
        }
    };

    //JSlideImg slideshow loop controller
    JResSlideShow = function(options) {
        var defaults = {
            disObj: "",
            childTag: "",
            curr: 0,
            prev: false,
            maxAmt: 0,
            transitTime: 0,
            transitStyle: '',
            holdTime: 0,
            begin: false,
            onTrans: false,
            onHold: false
        };
        options = $.extend(defaults, options);
        var disObj = options.disObj;
        var childTag = options.childTag;
        var curr = options.curr;
        var maxAmt = options.maxAmt;
        var begin = options.begin; //是否為第一次進場
        var transitTime = options.transitTime;
        var holdTime = options.holdTime;
        var transitStyle = options.transitStyle;
        //若不是第一次進場才進行上一張圖退場動作
        if (options.prev == -1) {
            var prev = (curr > 0) ? curr - 1 : maxAmt; //prev obj
        }else{
            var prev = options.prev;
        }

        $("#" + disObj + " .resJSlideImgThumbItem").removeClass('active');
        $("#" + disObj + " .resJSlideImgThumbItem:eq("+curr+")").addClass('active');

        //客製變換效果
        if (options.onTrans != false) {
            //console.log(prev+','+curr);
            options.onTrans.call({
                curr: $("#" + disObj + ">" + childTag + ":eq(" + curr + ")"),
                prev: $("#" + disObj + ">" + childTag + ":eq(" + prev + ")"),
                begin: begin
            });
            

            //載入物件延伸
            setTimeout( 
                function() {
                    if (options.onHold != false) {
                        options.onHold.call( $("#" + disObj + ">" + childTag + ":eq(" + curr + ")") );
                    }
                }
            , transitTime * 1e3);


        }else{
            //out effect
            //若不是第一次進場才進行上一張圖退場動作
            //transitStyle用來設定輪播時的效果: animate(動畫效果), 預設空值(淡入淡出)

            if (!begin) {
                switch (transitStyle) {
                    case 'animate':
                        $("#" + disObj + ">" + childTag + ":eq(" + prev + ")").css({
                            opacity: "1",
                            'z-index': '0'
                        });
                    break;
                    default:
                        $("#" + disObj + ">" + childTag + ":eq(" + prev + ")").animate({
                            opacity: "0",
                            'z-index': '0'
                        }, transitTime * 1e3, "linear");
                    break;
                }
            }

            //in effect
            $("#" + disObj + ">" + childTag + ":eq(" + curr + ")").css({
                'z-index': '1'
            });
            $("#" + disObj + ">" + childTag + ":eq(" + curr + ")").animate({
                opacity: "1"
            }, transitTime * 1e3, "linear", function() {
                //載入物件延伸
                if (options.onHold != false) {
                    options.onHold.call( $("#" + disObj + ">" + childTag + ":eq(" + curr + ")") ); 
                }else{
                    //預設動作
                    $("#" + disObj + ">" + childTag + ":eq(" + prev + ")").css({
                        opacity: "0"
                    });
                }
            });
        }
    };
}(jQuery, document, window));