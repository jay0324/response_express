(function($, document, window) {
    //JSlideImg 功能
    $.fn.JSlideImg = function(options) {
        var defaults = {
            disObj: this,
            childTag: "img",
            childClass: "",
            transitTime: 1,
            transitStyle: '',
            holdTime: 4,
            paddingAmt: 0,
            layout: "clear",
            touchSwipAmt: 100,
            thumb: {},
            slideBtn: {},
            autoPlay: true,
            setupResposive: {},
            onTrans: false,
            onHold: false,
            enlargeObj: false,
            multiLayerMode: {}
        };
        options = $.extend(defaults, options);

        //預設先置入loader mask
        $(this).addClass("resJSlideImg");

        //加入loader
        $(this).ready(function() {
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

            //多層次模式
            var multiLayerMode = options.multiLayerMode;

            //子項目類別名稱
            var childClass = options.childClass;

            //如果物件是連結,則抓取子物件img來判斷長寬
            var getChildImg = (options.childTag.toLowerCase() == 'a') ? ">img" : "";

            //連結enlargeObj 模組
            if (options.enlargeObj) {
                options.childTag = 'div';
                getChildImg = ">img";
            }

            var paddingAmt = options.paddingAmt;
            var maxAmt = $(">" + options.childTag.toLowerCase()+childClass, this).length - 1;
            var maxAmtThumb = $(">" + options.childTag.toLowerCase()+childClass, this).length;
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
            var displayTitle = options.displayTitle;

            //螢幕寬與上層容器取得其最小值來作為最大寬度
            var maxJSlideWidth = Math.min(($(window).width() - paddingAmt), ($(resContainer).parent().width() - paddingAmt));
            var maxJSlideHeight = Math.min(($(window).height() - paddingAmt), ($(resContainer).parent().height() - paddingAmt));
            if (maxJSlideWidth == 0) maxJSlideWidth = $(window).width() - paddingAmt;
            if (maxJSlideHeight == 0) maxJSlideHeight = $(window).height() - paddingAmt;

            var setSlideBtnTriggleEvent;
            var ThumbScroller;
            var btnH;
            var btnW;
            var positionPrev;
            var positionNext;
            var positionTrack;
            var thumbW;
            var thumbH;
            var maxThumbTrack;
            var thumbWUL;
            var thumbHUL;
            var thumbTitleOranitation;
            var thumbTitlePosition;
            var thumbSlideBtnOranitationClass;
            var thumbAmt;
            var setthumbTitlePosition;
            var posH;
            var thumbPos;
            var thumbDomObj;
            var thumbTitleObj;
            var setSlideBtnContainerPos;
            var setSlideBtnContainerWidth;
            var setSlideBtnContainerHeight;
            var setSlideBtnWidth;
            var setSlideBtnHeight;
            var setSlideBtnPrevPos;
            var setSlideBtnNextPos;
            var setSlideBtnOranitationClass;

            //取得物件小圖設定值
            /*initial value*/
            var thumbInitial = {
                state: false,
                amount: 4,
                width: 'auto',
                height: 'auto',
                type: 'horizontal',
                position: 'auto',
                overlap: true,
                overlapPos: 'auto',
                displayTitle: 'auto',
                thumbRatio: 1
            }

            //取得前後項目切換按鈕
            /*initial value*/
            var sideBtnInitial = {
                state: false,
                trigger: 'click',
                width: 100,
                height: 100,
                type: 'horizontal'
            }

            //多物件畫布模式預設值
            var multiLayerModeInitial = {
                state: false,
                canvasW: $(window).width(),
                canvasH: $(window).height()
            };

            /*initial data*/
            multiLayerMode['state'] = (multiLayerMode['state'] == undefined) ? multiLayerModeInitial['state'] : multiLayerMode['state'];
            multiLayerMode['canvasW'] = (multiLayerMode['canvasW'] == undefined) ? multiLayerModeInitial['canvasW'] : multiLayerMode['canvasW'];
            multiLayerMode['canvasH'] = (multiLayerMode['canvasH'] == undefined) ? multiLayerModeInitial['canvasH'] : multiLayerMode['canvasH'];

            if (!multiLayerMode['state']){
                //單物件模式
                $(options.childTag.toLowerCase()+childClass + ":eq(0)" + getChildImg, this).one('load', function() {
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
                    $(options.childTag.toLowerCase()+childClass, resContainer).css("width", "100%");

                    //console.log('before:' + resJSlideHeight);

                    //如果slideshow物件非img則取得容器寬高
                    //if (resJSlideWidth == undefined) resJSlideWidth = $(options.disObj).width();
                    //if (resJSlideHeight == undefined) resJSlideHeight = $(options.disObj).height();

                    //console.log('after:' + resJSlideHeight);

                    //檢查是否有響應式設定
                    fnCheckResponsiveSetup();

                    //取得物件小圖設定值
                    if (!$.isEmptyObject(thumb)) {

                        /*initial data*/
                        thumb['state'] = (thumb['state'] == undefined) ? thumbInitial['state'] : thumb['state'];
                        thumb['amount'] = (thumb['amount'] == undefined) ? thumbInitial['amount'] : thumb['amount'];
                        thumb['width'] = (thumb['width'] == undefined) ? thumbInitial['width'] : thumb['width'];
                        thumb['height'] = (thumb['height'] == undefined) ? thumbInitial['height'] : thumb['height'];
                        thumb['type'] = (thumb['type'] == undefined) ? thumbInitial['type'] : thumb['type'];
                        thumb['position'] = (thumb['position'] == undefined) ? thumbInitial['position'] : thumb['position'];
                        thumb['overlap'] = (thumb['overlap'] == undefined) ? thumbInitial['overlap'] : thumb['overlap'];
                        thumb['overlapPos'] = (thumb['overlapPos'] == undefined) ? thumbInitial['overlapPos'] : thumb['overlapPos'];
                        thumb['displayTitle'] = (thumb['displayTitle'] == undefined) ? thumbInitial['displayTitle'] : thumb['displayTitle'];
                        thumb['thumbRatio'] = (thumb['thumbRatio'] == undefined) ? thumbInitial['thumbRatio'] : thumb['thumbRatio'];

                        /*analyse data*/
                        if (thumb['state']) {
                            thumbAmt = (thumb['amount'] == 'auto') ? maxAmtThumb : thumb['amount'];
                            ThumbScroller = (maxAmtThumb <= thumbAmt) ? false : true;

                            if (thumb['type'] == 'vertical') {
                                btnH = (ThumbScroller) ? 20 : 0;
                                /*如果width和height設定為auto*/
                                thumb['height'] = (thumb['height'] == 'auto') ? (((resJSlideHeight - (btnH * 2)) / thumbAmt) - 12) : thumb['height'];
                                thumb['width'] = (thumb['width'] == 'auto') ? (thumb['height'] * thumb['thumbRatio']) : thumb['width'];
                                btnW = (thumb['width'] + 12);
                                positionPrev = "top:0;";
                                positionNext = "bottom:0;";
                                positionTrack = "top:" + btnH + "px;";
                                thumbW = (thumb['width'] + 12);
                                thumbH = (((thumb['height'] + 12) * thumbAmt) + (btnH * 2));
                                maxThumbTrack = (((maxAmtThumb / thumbAmt) - 1) * thumbH) - ((btnH * 2) + (10 * thumbAmt));
                                thumbWUL = (thumb['width'] + 12) + 'px';
                                thumbHUL = "auto";
                                thumbTitleOranitation = 'vetical';
                                thumbSlideBtnOranitationClass = "resSlideBtnV";
                                switch (thumb['displayTitle']) {
                                    case 'left':
                                        setthumbTitlePosition = 'bottom:0;left:0;right:initial;';
                                        break;
                                    case 'right':
                                    default:
                                        setthumbTitlePosition = 'bottom:0;right:0;left:initial;';
                                        break;
                                }
                                thumbTitlePosition = 'width:' + (resJSlideWidth - thumb['width'] - 25) + 'px;' + setthumbTitlePosition;

                                //apply overlapping
                                if (!thumb['overlap']) {
                                    switch (thumb['overlapPos']) {
                                        case 'right':
                                            $(options.disObj).css({
                                                'width': ($(options.disObj).width() - (thumb['width'] + 20)) + 'px',
                                                'padding-right': (thumb['width'] + 20) + 'px'
                                            });
                                            $(options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'width': $(options.disObj).width() + 'px',
                                                'height': 'auto'
                                            });
                                            $(">" + options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'margin-right': '0',
                                                'right': (thumb['width'] + 20) + 'px'
                                            });
                                            break;
                                        default:
                                            $(options.disObj).css({
                                                'width': ($(options.disObj).width() - (thumb['width'] + 20)) + 'px',
                                                'padding-left': (thumb['width'] + 20) + 'px'
                                            });
                                            $(options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'width': $(options.disObj).width() + 'px',
                                                'height': 'auto'
                                            });
                                            $(">" + options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'margin-left': '0',
                                                'left': (thumb['width'] + 20) + 'px'
                                            });
                                            break;
                                    }
                                }

                                if (thumb['position'] === 'auto') {
                                    posH = (resJSlideHeight - thumbH) / 2;
                                    if (thumb['overlapPos'] == 'right') {
                                        thumbPos = 'right:10px;top:' + posH + 'px;';
                                    } else {
                                        thumbPos = 'left:10px;bottom:' + posH + 'px;';
                                    }
                                } else {
                                    thumbPos = thumb['position'];
                                }
                            } else {
                                btnW = (ThumbScroller) ? 20 : 0;
                                /*如果width和height設定為auto*/
                                thumb['width'] = (thumb['width'] == 'auto') ? (((resJSlideWidth - (btnW * 2)) / thumbAmt) - 12) : thumb['width'];
                                thumb['height'] = (thumb['height'] == 'auto') ? (thumb['width'] * thumb['thumbRatio']) : thumb['height'];
                                btnH = (thumb['height'] + 12);
                                positionPrev = "left:0;";
                                positionNext = "right:0;";
                                positionTrack = "left:" + btnW + "px;";
                                thumbW = (((thumb['width'] + 12) * thumbAmt) + (btnW * 2));
                                thumbH = (thumb['height'] + 12);
                                maxThumbTrack = (((maxAmtThumb / thumbAmt) - 1) * thumbW) - ((btnW * 2) + (10 * thumbAmt));
                                thumbWUL = 'auto';
                                thumbHUL = (thumb['height'] + 12) + 'px';
                                thumbTitleOranitation = 'horizontal';
                                thumbTitlePosition = 'bottom:' + (thumbH + 10) + 'px';
                                thumbSlideBtnOranitationClass = "resSlideBtnH";

                                //apply overlapping
                                if (!thumb['overlap']) {
                                    switch (thumb['overlapPos']) {
                                        case 'top':
                                            $(options.disObj).css({ 'padding-top': (thumb['height'] + 20) + 'px' });
                                            $(">" + options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'margin-bottom': '0',
                                                'top': (thumb['height'] + 20) + 'px'
                                            });
                                            break;
                                        default:
                                            $(options.disObj).css({ 'padding-bottom': (thumb['height'] + 20) + 'px' });
                                            $(">" + options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'margin-top': '0',
                                                'bottom': (thumb['height'] + 20) + 'px'
                                            });
                                            break;
                                    }
                                }

                                if (thumb['position'] === 'auto') {
                                    posW = (resJSlideWidth - thumbW) / 2;
                                    if (thumb['overlapPos'] == 'top') {
                                        thumbPos = 'left:' + posW + 'px;top:10px;';
                                    } else {
                                        thumbPos = 'left:' + posW + 'px;bottom:10px;';
                                    }
                                } else {
                                    thumbPos = thumb['position'];
                                }
                            }

                            thumbDomObj = "";
                            thumbTitleObj = "";
                            $("#" + options.disObj.attr("id") + ">" + options.childTag.toLowerCase()+childClass + getChildImg).each(function() {
                                var getDefaultTitle = (options.childTag.toLowerCase() == "img") ? ($(this).attr('alt') == undefined || $(this).attr('alt') == "") ? "" : $(this).attr('alt') : ($(this).attr('title') == undefined || $(this).attr('title') == "") ? "" : $(this).attr('title');
                                var source = ($(this).attr('toggle-thumb-source') == undefined || $(this).attr('toggle-thumb-source') == "") ? $(this).attr('src') : $(this).attr('toggle-thumb-source');
                                var title = ($(this).attr('toggle-thumb-title') == undefined || $(this).attr('toggle-thumb-title') == "") ? getDefaultTitle : $(this).attr('toggle-thumb-title');

                                //設定thumb圖片的顯示區域
                                if (thumb['displayTitle'] == 'auto') {
                                    var setStyleForThumbImg = (title == undefined || title == "") ? ' resThumbFit ' : '';
                                    thumbDomObj += '<li class="resJSlideImgThumbItem' + setStyleForThumbImg + '" style="width:' + thumb['width'] + 'px;height:' + thumb['height'] + 'px;">' +
                                        '<img src="' + source + '" />' +
                                        '<span>' + title + '</span>' +
                                        '</li>';
                                } else {
                                    var setStyleForThumbImg = ' resThumbFit ';
                                    thumbDomObj += '<li class="resJSlideImgThumbItem' + setStyleForThumbImg + '" style="width:' + thumb['width'] + 'px;height:' + thumb['height'] + 'px;">' +
                                        '<img src="' + source + '" />' +
                                        '</li>';

                                    if (!(title == undefined || title == "")) {
                                        thumbTitleObj += '<div class="thumbTitleWrapObj">' + title + '</div>';
                                    }
                                }

                            })

                            var thumbTitileDom = (thumb['displayTitle'] != 'auto') ? '<div class="thumbTitleWrap ' + thumbTitleOranitation + '" style="' + thumbTitlePosition + '">' + thumbTitleObj + '</div>' : '';
                            var thumbDom = '<div class="resJSlideImgThumb resJSlideImgController ' + thumbSlideBtnOranitationClass + '" style="' + thumbPos + 'width:' + thumbW + 'px;height:' + thumbH + 'px">' +
                                '<a class="resJSlideImgThumbPrev end" href="#" style="' + positionPrev + 'width:' + btnW + 'px;height:' + btnH + 'px"></a>' +
                                '<ul class="resJSlideImgThumbTrack" style="' + positionTrack + 'width:' + thumbWUL + ';height:' + thumbHUL + '">' + thumbDomObj +
                                '</ul><a class="resJSlideImgThumbNext" href="#" style="' + positionNext + 'width:' + btnW + 'px;height:' + btnH + 'px"></a></div>';
                            $(options.disObj).append(thumbTitileDom + thumbDom);
                        }
                    }

                    //取得前後項目切換按鈕
                    if (!$.isEmptyObject(slideBtn)) {
                        /*initial data*/
                        thumb['state'] = (thumb['state'] == undefined) ? sideBtnInitial['state'] : thumb['state'];
                        thumb['trigger'] = (thumb['trigger'] == undefined) ? sideBtnInitial['trigger'] : thumb['trigger'];
                        thumb['width'] = (thumb['width'] == undefined) ? sideBtnInitial['width'] : thumb['width'];
                        thumb['height'] = (thumb['height'] == undefined) ? sideBtnInitial['height'] : thumb['height'];
                        thumb['type'] = (thumb['type'] == undefined) ? sideBtnInitial['type'] : thumb['type'];

                        /*analyse data*/
                        if (slideBtn['state']) {
                            if (slideBtn['type'] == 'vertical') {
                                setSlideBtnContainerPos = 'left:' + ((resJSlideWidth - slideBtn['width']) / 2) + 'px;';
                                setSlideBtnContainerWidth = (slideBtn['width'] == 'auto') ? '100%' : slideBtn['width'] + 'px';
                                setSlideBtnContainerHeight = resJSlideHeight;
                                setSlideBtnWidth = (slideBtn['width'] == 'auto') ? '100%' : slideBtn['width'] + 'px';
                                setSlideBtnHeight = (slideBtn['height'] == 'auto') ? '100%' : slideBtn['height'] + 'px';
                                setSlideBtnPrevPos = 'top:0;';
                                setSlideBtnNextPos = 'bottom:0;';
                                setSlideBtnTriggleEvent = (slideBtn['trigger'] == undefined) ? 'click' : slideBtn['trigger'];
                                setSlideBtnOranitationClass = "resSlideBtnV";
                            } else {
                                setSlideBtnContainerPos = 'top:' + ((resJSlideHeight - slideBtn['height']) / 2) + 'px;';
                                setSlideBtnContainerWidth = resJSlideWidth;
                                setSlideBtnContainerHeight = (slideBtn['height'] == 'auto') ? '100%' : slideBtn['height'] + 'px';
                                setSlideBtnWidth = (slideBtn['width'] == 'auto') ? '100%' : slideBtn['width'] + 'px';
                                setSlideBtnHeight = (slideBtn['height'] == 'auto') ? '100%' : slideBtn['height'] + 'px';
                                setSlideBtnPrevPos = 'left:0px;';
                                setSlideBtnNextPos = 'right:0px;';
                                setSlideBtnTriggleEvent = (slideBtn['trigger'] == undefined) ? 'click' : slideBtn['trigger'];
                                setSlideBtnOranitationClass = "resSlideBtnH";
                            }
                            var slideBtnDom = '<div class="resJSlideImgslideBtn resJSlideImgController ' + setSlideBtnOranitationClass + '" style="width:' + setSlideBtnContainerWidth + ';height:' + setSlideBtnContainerHeight + '">' +
                                '<a class="resJSlideImgslideBtnPrev" href="#" style="' + setSlideBtnContainerPos + setSlideBtnPrevPos + 'width:' + setSlideBtnWidth + ';height:' + setSlideBtnHeight + '"></a>' +
                                '<a class="resJSlideImgslideBtnNext" href="#" style="' + setSlideBtnContainerPos + setSlideBtnNextPos + 'width:' + setSlideBtnWidth + ';height:' + setSlideBtnHeight + '"></a>' +
                                '</div>';
                            $(options.disObj).append(slideBtnDom);
                        }
                    }

                    //start slideshow
                    if ($("#" + options.disObj.attr("id")).length > 0 && $("#" + options.disObj.attr("id")).css("display") != "none") {
                        //完成載入後再將loader隱藏
                        $(window).on("load", function() {
                            //隱藏loader
                            $(".loader", options.disObj).fadeOut(200);

                            //進行loop
                            if (maxAmt == 0) {
                                $("#" + options.disObj.attr("id") + ">" + options.childTag.toLowerCase()+childClass).animate({
                                    opacity: "1"
                                }, options.transitTime * 1e3);
                            } else {
                                //建立效果及迴圈
                                fnDefineLoop();
                            }
                        })
                    }
                }).each(function() {
                    if (this.complete) {
                        //console.log('process:' + resJSlideHeight);
                        $(this).trigger('load');
                    }
                });
            }else{
                //多物件畫布模式
                resJSlideWidth = multiLayerMode['canvasW'];
                resJSlideHeight = multiLayerMode['canvasH'];

                //檢查圖片長寬比例
                if (resJSlideWidth >= maxJSlideWidth) {
                    resJSlideHeight = resJSlideHeight * (maxJSlideWidth / resJSlideWidth);
                    resJSlideWidth = maxJSlideWidth;
                }

                resContainer.width(resJSlideWidth);
                resContainer.height(resJSlideHeight);
                maxJSlideHeight = resJSlideHeight;
                $(options.childTag.toLowerCase()+childClass, resContainer).css("width", "100%");

                    //console.log('before:' + resJSlideHeight);

                    //如果slideshow物件非img則取得容器寬高
                    //if (resJSlideWidth == undefined) resJSlideWidth = $(options.disObj).width();
                    //if (resJSlideHeight == undefined) resJSlideHeight = $(options.disObj).height();

                    //console.log('after:' + resJSlideHeight);

                //檢查是否有響應式設定
                fnCheckResponsiveSetup();

                //取得物件小圖設定值
                if (!$.isEmptyObject(thumb)) {

                        /*initial data*/
                        thumb['state'] = (thumb['state'] == undefined) ? thumbInitial['state'] : thumb['state'];
                        thumb['amount'] = (thumb['amount'] == undefined) ? thumbInitial['amount'] : thumb['amount'];
                        thumb['width'] = (thumb['width'] == undefined) ? thumbInitial['width'] : thumb['width'];
                        thumb['height'] = (thumb['height'] == undefined) ? thumbInitial['height'] : thumb['height'];
                        thumb['type'] = (thumb['type'] == undefined) ? thumbInitial['type'] : thumb['type'];
                        thumb['position'] = (thumb['position'] == undefined) ? thumbInitial['position'] : thumb['position'];
                        thumb['overlap'] = (thumb['overlap'] == undefined) ? thumbInitial['overlap'] : thumb['overlap'];
                        thumb['overlapPos'] = (thumb['overlapPos'] == undefined) ? thumbInitial['overlapPos'] : thumb['overlapPos'];
                        thumb['displayTitle'] = (thumb['displayTitle'] == undefined) ? thumbInitial['displayTitle'] : thumb['displayTitle'];
                        thumb['thumbRatio'] = (thumb['thumbRatio'] == undefined) ? thumbInitial['thumbRatio'] : thumb['thumbRatio'];

                        /*analyse data*/
                        if (thumb['state']) {
                            thumbAmt = (thumb['amount'] == 'auto') ? maxAmtThumb : thumb['amount'];
                            ThumbScroller = (maxAmtThumb <= thumbAmt) ? false : true;

                            if (thumb['type'] == 'vertical') {
                                btnH = (ThumbScroller) ? 20 : 0;
                                /*如果width和height設定為auto*/
                                thumb['height'] = (thumb['height'] == 'auto') ? (((resJSlideHeight - (btnH * 2)) / thumbAmt) - 12) : thumb['height'];
                                thumb['width'] = (thumb['width'] == 'auto') ? (thumb['height'] * thumb['thumbRatio']) : thumb['width'];
                                btnW = (thumb['width'] + 12);
                                positionPrev = "top:0;";
                                positionNext = "bottom:0;";
                                positionTrack = "top:" + btnH + "px;";
                                thumbW = (thumb['width'] + 12);
                                thumbH = (((thumb['height'] + 12) * thumbAmt) + (btnH * 2));
                                maxThumbTrack = (((maxAmtThumb / thumbAmt) - 1) * thumbH) - ((btnH * 2) + (10 * thumbAmt));
                                thumbWUL = (thumb['width'] + 12) + 'px';
                                thumbHUL = "auto";
                                thumbTitleOranitation = 'vetical';
                                thumbSlideBtnOranitationClass = "resSlideBtnV";
                                switch (thumb['displayTitle']) {
                                    case 'left':
                                        setthumbTitlePosition = 'bottom:0;left:0;right:initial;';
                                        break;
                                    case 'right':
                                    default:
                                        setthumbTitlePosition = 'bottom:0;right:0;left:initial;';
                                        break;
                                }
                                thumbTitlePosition = 'width:' + (resJSlideWidth - thumb['width'] - 25) + 'px;' + setthumbTitlePosition;

                                //apply overlapping
                                if (!thumb['overlap']) {
                                    switch (thumb['overlapPos']) {
                                        case 'right':
                                            $(options.disObj).css({
                                                'width': ($(options.disObj).width() - (thumb['width'] + 20)) + 'px',
                                                'padding-right': (thumb['width'] + 20) + 'px'
                                            });
                                            $(options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'width': $(options.disObj).width() + 'px',
                                                'height': 'auto'
                                            });
                                            $(">" + options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'margin-right': '0',
                                                'right': (thumb['width'] + 20) + 'px'
                                            });
                                            break;
                                        default:
                                            $(options.disObj).css({
                                                'width': ($(options.disObj).width() - (thumb['width'] + 20)) + 'px',
                                                'padding-left': (thumb['width'] + 20) + 'px'
                                            });
                                            $(options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'width': $(options.disObj).width() + 'px',
                                                'height': 'auto'
                                            });
                                            $(">" + options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'margin-left': '0',
                                                'left': (thumb['width'] + 20) + 'px'
                                            });
                                            break;
                                    }
                                }

                                if (thumb['position'] === 'auto') {
                                    posH = (resJSlideHeight - thumbH) / 2;
                                    if (thumb['overlapPos'] == 'right') {
                                        thumbPos = 'right:10px;top:' + posH + 'px;';
                                    } else {
                                        thumbPos = 'left:10px;bottom:' + posH + 'px;';
                                    }
                                } else {
                                    thumbPos = thumb['position'];
                                }
                            } else {
                                btnW = (ThumbScroller) ? 20 : 0;
                                /*如果width和height設定為auto*/
                                thumb['width'] = (thumb['width'] == 'auto') ? (((resJSlideWidth - (btnW * 2)) / thumbAmt) - 12) : thumb['width'];
                                thumb['height'] = (thumb['height'] == 'auto') ? (thumb['width'] * thumb['thumbRatio']) : thumb['height'];
                                btnH = (thumb['height'] + 12);
                                positionPrev = "left:0;";
                                positionNext = "right:0;";
                                positionTrack = "left:" + btnW + "px;";
                                thumbW = (((thumb['width'] + 12) * thumbAmt) + (btnW * 2));
                                thumbH = (thumb['height'] + 12);
                                maxThumbTrack = (((maxAmtThumb / thumbAmt) - 1) * thumbW) - ((btnW * 2) + (10 * thumbAmt));
                                thumbWUL = 'auto';
                                thumbHUL = (thumb['height'] + 12) + 'px';
                                thumbTitleOranitation = 'horizontal';
                                thumbTitlePosition = 'bottom:' + (thumbH + 10) + 'px';
                                thumbSlideBtnOranitationClass = "resSlideBtnH";

                                //apply overlapping
                                if (!thumb['overlap']) {
                                    switch (thumb['overlapPos']) {
                                        case 'top':
                                            $(options.disObj).css({ 'padding-top': (thumb['height'] + 20) + 'px' });
                                            $(">" + options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'margin-bottom': '0',
                                                'top': (thumb['height'] + 20) + 'px'
                                            });
                                            break;
                                        default:
                                            $(options.disObj).css({ 'padding-bottom': (thumb['height'] + 20) + 'px' });
                                            $(">" + options.childTag.toLowerCase()+childClass, options.disObj).css({
                                                'margin-top': '0',
                                                'bottom': (thumb['height'] + 20) + 'px'
                                            });
                                            break;
                                    }
                                }

                                if (thumb['position'] === 'auto') {
                                    posW = (resJSlideWidth - thumbW) / 2;
                                    if (thumb['overlapPos'] == 'top') {
                                        thumbPos = 'left:' + posW + 'px;top:10px;';
                                    } else {
                                        thumbPos = 'left:' + posW + 'px;bottom:10px;';
                                    }
                                } else {
                                    thumbPos = thumb['position'];
                                }
                            }

                            thumbDomObj = "";
                            thumbTitleObj = "";
                            $("#" + options.disObj.attr("id") + ">" + options.childTag.toLowerCase()+childClass + getChildImg).each(function() {
                                var getDefaultTitle = (options.childTag.toLowerCase() == "img") ? ($(this).attr('alt') == undefined || $(this).attr('alt') == "") ? "" : $(this).attr('alt') : ($(this).attr('title') == undefined || $(this).attr('title') == "") ? "" : $(this).attr('title');
                                var source = ($(this).attr('toggle-thumb-source') == undefined || $(this).attr('toggle-thumb-source') == "") ? $(this).attr('src') : $(this).attr('toggle-thumb-source');
                                var title = ($(this).attr('toggle-thumb-title') == undefined || $(this).attr('toggle-thumb-title') == "") ? getDefaultTitle : $(this).attr('toggle-thumb-title');

                                //設定thumb圖片的顯示區域
                                if (thumb['displayTitle'] == 'auto') {
                                    var setStyleForThumbImg = (title == undefined || title == "") ? ' resThumbFit ' : '';
                                    thumbDomObj += '<li class="resJSlideImgThumbItem' + setStyleForThumbImg + '" style="width:' + thumb['width'] + 'px;height:' + thumb['height'] + 'px;">' +
                                        '<img src="' + source + '" />' +
                                        '<span>' + title + '</span>' +
                                        '</li>';
                                } else {
                                    var setStyleForThumbImg = ' resThumbFit ';
                                    thumbDomObj += '<li class="resJSlideImgThumbItem' + setStyleForThumbImg + '" style="width:' + thumb['width'] + 'px;height:' + thumb['height'] + 'px;">' +
                                        '<img src="' + source + '" />' +
                                        '</li>';

                                    if (!(title == undefined || title == "")) {
                                        thumbTitleObj += '<div class="thumbTitleWrapObj">' + title + '</div>';
                                    }
                                }

                            })

                            var thumbTitileDom = (thumb['displayTitle'] != 'auto') ? '<div class="thumbTitleWrap ' + thumbTitleOranitation + '" style="' + thumbTitlePosition + '">' + thumbTitleObj + '</div>' : '';
                            var thumbDom = '<div class="resJSlideImgThumb resJSlideImgController ' + thumbSlideBtnOranitationClass + '" style="' + thumbPos + 'width:' + thumbW + 'px;height:' + thumbH + 'px">' +
                                '<a class="resJSlideImgThumbPrev end" href="#" style="' + positionPrev + 'width:' + btnW + 'px;height:' + btnH + 'px"></a>' +
                                '<ul class="resJSlideImgThumbTrack" style="' + positionTrack + 'width:' + thumbWUL + ';height:' + thumbHUL + '">' + thumbDomObj +
                                '</ul><a class="resJSlideImgThumbNext" href="#" style="' + positionNext + 'width:' + btnW + 'px;height:' + btnH + 'px"></a></div>';
                            $(options.disObj).append(thumbTitileDom + thumbDom);
                        }
                }

                //取得前後項目切換按鈕
                if (!$.isEmptyObject(slideBtn)) {
                        /*initial data*/
                        thumb['state'] = (thumb['state'] == undefined) ? sideBtnInitial['state'] : thumb['state'];
                        thumb['trigger'] = (thumb['trigger'] == undefined) ? sideBtnInitial['trigger'] : thumb['trigger'];
                        thumb['width'] = (thumb['width'] == undefined) ? sideBtnInitial['width'] : thumb['width'];
                        thumb['height'] = (thumb['height'] == undefined) ? sideBtnInitial['height'] : thumb['height'];
                        thumb['type'] = (thumb['type'] == undefined) ? sideBtnInitial['type'] : thumb['type'];

                        /*analyse data*/
                        if (slideBtn['state']) {
                            if (slideBtn['type'] == 'vertical') {
                                setSlideBtnContainerPos = 'left:' + ((resJSlideWidth - slideBtn['width']) / 2) + 'px;';
                                setSlideBtnContainerWidth = (slideBtn['width'] == 'auto') ? '100%' : slideBtn['width'] + 'px';
                                setSlideBtnContainerHeight = resJSlideHeight;
                                setSlideBtnWidth = (slideBtn['width'] == 'auto') ? '100%' : slideBtn['width'] + 'px';
                                setSlideBtnHeight = (slideBtn['height'] == 'auto') ? '100%' : slideBtn['height'] + 'px';
                                setSlideBtnPrevPos = 'top:0;';
                                setSlideBtnNextPos = 'bottom:0;';
                                setSlideBtnTriggleEvent = (slideBtn['trigger'] == undefined) ? 'click' : slideBtn['trigger'];
                                setSlideBtnOranitationClass = "resSlideBtnV";
                            } else {
                                setSlideBtnContainerPos = 'top:' + ((resJSlideHeight - slideBtn['height']) / 2) + 'px;';
                                setSlideBtnContainerWidth = resJSlideWidth;
                                setSlideBtnContainerHeight = (slideBtn['height'] == 'auto') ? '100%' : slideBtn['height'] + 'px';
                                setSlideBtnWidth = (slideBtn['width'] == 'auto') ? '100%' : slideBtn['width'] + 'px';
                                setSlideBtnHeight = (slideBtn['height'] == 'auto') ? '100%' : slideBtn['height'] + 'px';
                                setSlideBtnPrevPos = 'left:0px;';
                                setSlideBtnNextPos = 'right:0px;';
                                setSlideBtnTriggleEvent = (slideBtn['trigger'] == undefined) ? 'click' : slideBtn['trigger'];
                                setSlideBtnOranitationClass = "resSlideBtnH";
                            }
                            var slideBtnDom = '<div class="resJSlideImgslideBtn resJSlideImgController ' + setSlideBtnOranitationClass + '" style="width:' + setSlideBtnContainerWidth + ';height:' + setSlideBtnContainerHeight + '">' +
                                '<a class="resJSlideImgslideBtnPrev" href="#" style="' + setSlideBtnContainerPos + setSlideBtnPrevPos + 'width:' + setSlideBtnWidth + ';height:' + setSlideBtnHeight + '"></a>' +
                                '<a class="resJSlideImgslideBtnNext" href="#" style="' + setSlideBtnContainerPos + setSlideBtnNextPos + 'width:' + setSlideBtnWidth + ';height:' + setSlideBtnHeight + '"></a>' +
                                '</div>';
                            $(options.disObj).append(slideBtnDom);
                        }
                }

                //start slideshow
                if ($("#" + options.disObj.attr("id")).length > 0 && $("#" + options.disObj.attr("id")).css("display") != "none") {
                        //完成載入後再將loader隱藏
                        $(window).on("load", function() {
                            //隱藏loader
                            $(".loader", options.disObj).fadeOut(200);

                            //進行loop
                            if (maxAmt == 0) {
                                $("#" + options.disObj.attr("id") + ">" + options.childTag.toLowerCase()+childClass).animate({
                                    opacity: "1"
                                }, options.transitTime * 1e3);
                            } else {
                                //建立效果及迴圈
                                fnDefineLoop();
                            }
                        })
                }
            }

            //設定物件內容長寬
            if (!multiLayerMode['state']){
                $(">" + options.childTag.toLowerCase()+childClass + getChildImg, this).each(function() {
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
                        } else if (resJSlideWidth_item > resJSlideHeight_item) {
                            //如果圖片是橫的
                            if (resJSlideWidth_item >= maxJSlideWidth) {
                                resJSlideHeight_item = resJSlideHeight_item * (maxJSlideWidth / resJSlideWidth_item);
                                resJSlideWidth_item = maxJSlideWidth;
                            }
                        } else {
                            //如果圖片是方的
                            if (resJSlideWidth_item > maxJSlideWidth) {
                                resJSlideHeight_item = resJSlideHeight_item * (maxJSlideWidth / resJSlideWidth_item);
                                resJSlideWidth_item = maxJSlideWidth;
                            } else {
                                resJSlideWidth_item = resJSlideWidth_item * (maxJSlideHeight / resJSlideHeight_item);
                                resJSlideHeight_item = maxJSlideHeight;
                            }
                        }
                        //console.log('MaxH: '+maxJSlideHeight+', ItemW: '+resJSlideWidth_item+', itemH: '+resJSlideHeight_item);

                        $(this).width(resJSlideWidth_item);
                        $(this).height(resJSlideHeight_item);
                    }).each(function() {
                        if (this.complete) {
                            $(this).trigger('load');
                        }
                    });
                })
            }
        }

        //thumb controller
        $("#" + options.disObj.attr("id")).on('click', ".resJSlideImgThumbItem", function() {
            //set click item to current state
            var chkPrev = (curr == 0) ? maxAmt : curr - 1; //取得上一個項目
            var chkCurr = $(this).index();
            //console.log(prev+','+curr);

            //click item is not current
            if (chkPrev != chkCurr) {
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
        $(options.disObj).on('click', ".resJSlideImgThumbPrev", function() {
            if (thumb['type'] == 'vertical') {
                var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("top").replace("px", ""));
                if (currentPosition < btnH) {
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbNext").removeClass('end');
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                        top: (currentPosition + thumbH - (btnH * 2)) + "px"
                    }, 500);
                } else {
                    $(this).addClass('end');
                }
            } else {
                var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("left").replace("px", ""));
                if (currentPosition < btnW) {
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbNext").removeClass('end');
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                        left: (currentPosition + thumbW - (btnW * 2)) + "px"
                    }, 500);
                } else {
                    $(this).addClass('end');
                }
            }
            return false;
        })

        //thumb nextBtn
        $(options.disObj).on('click', ".resJSlideImgThumbNext", function() {
            if (thumb['type'] == 'vertical') {
                var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("top").replace("px", ""));
                if ((maxThumbTrack * -1) < currentPosition) {
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbPrev").removeClass('end');
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                        top: (currentPosition - thumbH + (btnH * 2)) + "px"
                    }, 500);
                } else {
                    $(this).addClass('end');
                }
            } else {
                var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("left").replace("px", ""));
                if ((maxThumbTrack * -1) < currentPosition) {
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbPrev").removeClass('end');
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                        left: (currentPosition - thumbW + (btnW * 2)) + "px"
                    }, 500);
                } else {
                    $(this).addClass('end');
                }
            }
            return false;
        })

        //slideshow PrevBtn
        $(options.disObj).on(setSlideBtnTriggleEvent, ".resJSlideImgslideBtnPrev", function(e) {
            //reset loop and all current state
            fnStopLoop();
            //console.log(e);
            //set click item to current state
            //loop時以自動加一所以，需要減2
            prev = (curr == 0) ? maxAmt : curr - 1; //先還原為目前的項目
            curr = (prev <= 0) ? maxAmt : prev - 1; //取得上一個項目
            begin = false;

            //建立效果及迴圈
            fnDefineLoop(true);

            return false;
        })

        //slideshow NextBtn
        $(options.disObj).on(setSlideBtnTriggleEvent, ".resJSlideImgslideBtnNext", function(e) {
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
        $(options.disObj).on('touchstart', function(e) {
            //touchstart
            var touch = e.originalEvent.touches[0];
            swipToNextPOS = touch.pageX - touchSwipAmt;
            swipToPrevPOS = touch.pageX + touchSwipAmt;
            trackSwipEvent = true;
        }).on('touchmove', function(e) {
            //touchmove
            var touch = e.originalEvent.touches[0];

            //swip to next
            if (trackSwipEvent && swipToNextPOS > touch.pageX) {
                //reset loop and all current state
                fnStopLoop();
                begin = false;

                //建立效果及迴圈
                fnDefineLoop(true);
                trackSwipEvent = false;
            }

            //swip to prev
            if (trackSwipEvent && swipToPrevPOS < touch.pageX) {
                //reset loop and all current state
                fnStopLoop();
                prev = (curr == 0) ? maxAmt : curr - 1; //先還原為目前的項目
                curr = (prev <= 0) ? maxAmt : prev - 1; //取得上一個項目
                begin = false;

                //建立效果及迴圈
                fnDefineLoop(true);
                trackSwipEvent = false;
            }
        });

        //建立效果及迴圈
        function fnDefineLoop(control) {
            control = control || false; //如無定義預設值false

            //如果指令來自控制按鈕
            if (control) {
                fnUpdateThumbTrack();
            }

            //add current active class to thumb item
            $("#" + options.disObj.attr("id") + " .resJSlideImgThumbItem").removeClass('active');
            $("#" + options.disObj.attr("id") + " .resJSlideImgThumbItem:eq(" + curr + ")").addClass('active');

            //start to slide the first slidshow
            JResSlideShow({
                disObj: options.disObj.attr("id"),
                childTag: options.childTag.toLowerCase(),
                childClass: childClass,
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
            curr = (curr < maxAmt) ? curr + 1 : 0; //取得下一個項目
            prev = -1; //較果結束後要把prev設回預設值

            //如果有自訂transition延遲時間加上去
            if (options.onTrans != false) {
                var loopTime = options.holdTime * 1e3 + options.transitTime * 1e3;
            } else {
                var loopTime = options.holdTime * 1e3;
            }

            //if auto play enable
            //start loop the slideshow
            if (autoPlay) {
                loop = setInterval(function() {

                    fnUpdateThumbTrack();

                    JResSlideShow({
                        disObj: options.disObj.attr("id"),
                        childTag: options.childTag.toLowerCase(),
                        childClass: childClass,
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

                    curr = (curr < maxAmt) ? curr + 1 : 0; //取得下一個項目

                }, loopTime);
            }

            return loop;
        }

        //停止重設迴圈
        function fnStopLoop() {
            clearTimeout(loop);
            $("#" + options.disObj.attr("id") + ">" + options.childTag.toLowerCase()+childClass).each(function() {
                if (!$(this).hasClass("resJSlideImgController")) {
                    $(this).css({
                        "z-index": "0"
                    });
                    /*$(this).animate({
                        opacity: "0"
                    }, options.transitTime);*/
                }
            })
        }

        //更新thumbtrack位置設定
        function fnUpdateThumbTrack() {
            //set loop for thumb track
            if (ThumbScroller && thumb['state']) {
                if (thumb['type'] == 'vertical') {
                    var currentTrackPosition = (Math.floor(curr / thumbAmt) * thumbH) - ((btnH * 2) + (10 * thumbAmt));
                    var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("top").replace("px", ""));
                    //console.log(currentTrackPosition+','+(currentPosition*-1));
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbPrev").removeClass('end');
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbNext").removeClass('end');
                    if (currentTrackPosition > (currentPosition * -1)) {
                        if ((maxThumbTrack * -1) < currentPosition) {
                            var newPos = (currentPosition - thumbH + (btnH * 2));
                        }
                        $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                            top: newPos + "px"
                        }, 500);
                    } else if (curr == 0) {
                        $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                            top: btnH + "px"
                        }, 500);
                    }
                } else {
                    var currentTrackPosition = (Math.floor(curr / thumbAmt) * thumbW) - ((btnW * 2) + (10 * thumbAmt));
                    var currentPosition = parseInt($("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").css("left").replace("px", ""));
                    //console.log(thumbAmt+','+currentTrackPosition+','+(currentPosition*-1));
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbPrev").removeClass('end');
                    $("#" + options.disObj.attr("id") + " .resJSlideImgThumbNext").removeClass('end');
                    if (currentTrackPosition > (currentPosition * -1)) {
                        if ((maxThumbTrack * -1) < currentPosition) {
                            var newPos = (currentPosition - thumbW + (btnW * 2));
                        }
                        $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                            left: newPos + "px"
                        }, 500);
                    } else if (curr == 0) {
                        $("#" + options.disObj.attr("id") + " .resJSlideImgThumbTrack").animate({
                            left: btnW + "px"
                        }, 500);
                    }
                }
            }
        }

        //檢查是否有響應式設定
        function fnCheckResponsiveSetup() {
            if (!$.isEmptyObject(setupResposive)) {
                var checkWinWArray = [];
                for (var winW in setupResposive) {
                    checkWinWArray.push(winW); //先建立Windows Index for sorting
                }

                checkWinWArray = checkWinWArray.sort(function(a, b) {
                    return b - a }); //DESC Sorting

                //update listAmt
                for (var i = 0; i < checkWinWArray.length; i++) {
                    if ($(window).width() < checkWinWArray[i]) {
                        //thumb響應式設定
                        thumb['state'] = (setupResposive[checkWinWArray[i]]['state'] != undefined) ? setupResposive[checkWinWArray[i]]['state'] : thumb['state'];
                        thumb['amount'] = (setupResposive[checkWinWArray[i]]['amount'] != undefined) ? setupResposive[checkWinWArray[i]]['amount'] : thumb['amount'];
                        thumb['width'] = (setupResposive[checkWinWArray[i]]['width'] != undefined) ? setupResposive[checkWinWArray[i]]['width'] : thumb['width'];
                        thumb['height'] = (setupResposive[checkWinWArray[i]]['height'] != undefined) ? setupResposive[checkWinWArray[i]]['height'] : thumb['height'];
                        thumb['type'] = (setupResposive[checkWinWArray[i]]['type'] != undefined) ? setupResposive[checkWinWArray[i]]['type'] : thumb['type'];
                        thumb['position'] = (setupResposive[checkWinWArray[i]]['position'] != undefined) ? setupResposive[checkWinWArray[i]]['position'] : thumb['position'];
                        thumb['overlap'] = (setupResposive[checkWinWArray[i]]['overlap'] != undefined) ? setupResposive[checkWinWArray[i]]['overlap'] : thumb['overlap'];
                        thumb['overlapPos'] = (setupResposive[checkWinWArray[i]]['overlapPos'] != undefined) ? setupResposive[checkWinWArray[i]]['overlapPos'] : thumb['overlapPos'];
                        thumb['dsiplayTitle'] = (setupResposive[checkWinWArray[i]]['dsiplayTitle'] != undefined) ? setupResposive[checkWinWArray[i]]['dsiplayTitle'] : thumb['dsiplayTitle'];
                        thumb['thumbRatio'] = (setupResposive[checkWinWArray[i]]['thumbRatio'] != undefined) ? setupResposive[checkWinWArray[i]]['thumbRatio'] : thumb['thumbRatio'];

                        if (!$.isEmptyObject(setupResposive[checkWinWArray[i]]['slideBtn'])) {
                            //上下項目響應式設定
                            slideBtn['state'] = (setupResposive[checkWinWArray[i]]['slideBtn']['state'] != undefined) ? setupResposive[checkWinWArray[i]]['slideBtn']['state'] : slideBtn['state'];
                            slideBtn['width'] = (setupResposive[checkWinWArray[i]]['slideBtn']['width'] != undefined) ? setupResposive[checkWinWArray[i]]['slideBtn']['width'] : slideBtn['width'];
                            slideBtn['height'] = (setupResposive[checkWinWArray[i]]['slideBtn']['height'] != undefined) ? setupResposive[checkWinWArray[i]]['slideBtn']['height'] : slideBtn['height'];
                            slideBtn['type'] = (setupResposive[checkWinWArray[i]]['slideBtn']['type'] != undefined) ? setupResposive[checkWinWArray[i]]['slideBtn']['type'] : slideBtn['type'];
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
            childClass: '',
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
        var childClass = options.childClass;
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
        } else {
            var prev = options.prev;
        }

        $("#" + disObj + " .resJSlideImgThumbItem").removeClass('active');
        $("#" + disObj + " .resJSlideImgThumbItem:eq(" + curr + ")").addClass('active');

        //thumbTitle
        $("#" + disObj + " .thumbTitleWrapObj").fadeOut(600);
        $("#" + disObj + " .thumbTitleWrapObj:eq(" + curr + ")").fadeIn(600);

        //客製變換效果
        if (options.onTrans != false) {
            //console.log(prev+','+curr);
            options.onTrans.call({
                curr: $("#" + disObj + ">" + childTag + childClass + ":eq(" + curr + ")"),
                prev: $("#" + disObj + ">" + childTag + childClass + ":eq(" + prev + ")"),
                begin: begin
            });


            //載入物件延伸
            setTimeout(
                function() {
                    if (options.onHold != false) {
                        options.onHold.call($("#" + disObj + ">" + childTag + childClass + ":eq(" + curr + ")"));
                    }
                }, transitTime * 1e3);


        } else {
            //out effect
            //若不是第一次進場才進行上一張圖退場動作
            //transitStyle用來設定輪播時的效果: animate(動畫效果), 預設空值(淡入淡出)

            if (!begin) {
                switch (transitStyle) {
                    case 'animate':
                        $("#" + disObj + ">" + childTag + childClass + ":eq(" + prev + ")").css({
                            opacity: "1",
                            'z-index': '0'
                        });
                        break;
                    default:
                        $("#" + disObj + ">" + childTag + childClass + ":eq(" + prev + ")").animate({
                            opacity: "0",
                            'z-index': '0'
                        }, transitTime * 1e3, "linear");
                        break;
                }
            }

            //in effect
            $("#" + disObj + ">" + childTag + childClass + ":eq(" + curr + ")").css({
                'z-index': '1'
            });
            $("#" + disObj + ">" + childTag + childClass + ":eq(" + curr + ")").animate({
                opacity: "1"
            }, transitTime * 1e3, "linear", function() {
                //載入物件延伸
                if (options.onHold != false) {
                    options.onHold.call($("#" + disObj + ">" + childTag + childClass + ":eq(" + curr + ")"));
                } else {
                    //預設動作
                    $("#" + disObj + ">" + childTag + childClass + ":eq(" + prev + ")").css({
                        opacity: "0"
                    });
                }
            });
        }
    };
}(jQuery, document, window));
