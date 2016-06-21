(function ($, document, window) {
	//slider功能
    $.fn.JResContentSlider = function(options) {
        var defaults = {
            autoPlay: true,
            delayTime: 3000,
            touchSwipAmt: 100, 
            transitionTime: 1000,
            listAmt: 5,
            listPaddingAmt: 2,
            from:0,
            type: 'horizontal',
            btnSetup:{
                nextBtn:{
                    state: true,
                    width: 20,
                    height: 20
                },
                prevBtn:{
                    state: true,
                    width: 20,
                    height: 20
                }
            },
            setupResposive: {}
        };
        options = $.extend(defaults, options);

        //設定物件model
        var obj = $(this);
        var autoPlay = options.autoPlay;
        var touchSwipAmt = options.touchSwipAmt;
        var delayTime = options.delayTime;
        var transitionTime = options.transitionTime;
        var listAmt = parseInt(options.listAmt);
        var listPaddingAmt = parseInt(options.listPaddingAmt);
        var btnSetup = options.btnSetup;
        var paddingAmt = options.paddingAmt;
        var from = options.from;
        var type = options.type;

        var setupResposive = options.setupResposive;
        //檢查是否有響應式設定
        if(!$.isEmptyObject(setupResposive)){
            var checkWinWArray = [];
            for (var winW in setupResposive){
                checkWinWArray.push(winW); //先建立Windows Index for sorting
            }

            checkWinWArray = checkWinWArray.sort(function(a, b){return b-a}); //DESC Sorting

            //update listAmt
            for (var i=0;i<checkWinWArray.length;i++) {
                if ($(window).width() < checkWinWArray[i]) {
                    listAmt = (setupResposive[checkWinWArray[i]]['listAmt'] != undefined)?setupResposive[checkWinWArray[i]]['listAmt']:listAmt;
                    listPaddingAmt = (setupResposive[checkWinWArray[i]]['listPaddingAmt'] != undefined)?setupResposive[checkWinWArray[i]]['listPaddingAmt']:listPaddingAmt;
                    btnSetup = (setupResposive[checkWinWArray[i]]['btnSetup'] != undefined)?setupResposive[checkWinWArray[i]]['btnSetup']:btnSetup;
                    autoPlay = (setupResposive[checkWinWArray[i]]['autoPlay'] != undefined)?setupResposive[checkWinWArray[i]]['autoPlay']:btnSetup;
                }
            }
        }

        //看是要走縱向還是橫向
        if(type == "vertical"){
            //縱向
            
            //崁入縱向樣式
            $(".sliderContainer",obj).addClass("sliderVertical");
            $(obj).height("100%");

            //創建按鈕組
                if(!$.isEmptyObject(btnSetup)){
                    for (var btn in btnSetup) {
                        var setState = (btnSetup[btn]['state'] != undefined)?btnSetup[btn]['state']:true;
                        if(setState){
                            var setHeight = (btnSetup[btn]['height'] != undefined)?btnSetup[btn]['height']:20;
                            var setStyle =  'style="height:'+setHeight+'px';
                            switch (btn){
                                case "nextBtn":
                                    $(".sliderContainer",obj).append('<div class="sliderContainerPrevBtn" '+setStyle+'"></div>');
                                break;
                                case "prevBtn":
                                    $(".sliderContainer",obj).append('<div class="sliderContainerNextBtn" '+setStyle+'"></div>');
                                break;
                            }
                        } 
                    }    
                }
                var prevHeight = $(".sliderContainer .sliderContainerPrevBtn",obj).height();
                var nextHeight = $(".sliderContainer .sliderContainerNextBtn",obj).height();

                var amountOfItem = $(".sliderContainer>ul>li",obj).length;
                var containerHeight = $(obj).height() - (nextHeight+prevHeight);
                //console.log($(obj).height());
                var itemHeight = (containerHeight/listAmt) - (listPaddingAmt*2);
                var startPOS = containerHeight*from*-1;
                var currentPOS = 0;
                var setContainerHeight = (itemHeight+(listPaddingAmt*2))*amountOfItem;
                var swipToNextPOS = 0;
                var swipToPrevPOS = 0;
                var trackSwipEvent = false;
                var startLimited = containerHeight*from;
                var endLimited = setContainerHeight-(startLimited);
                //console.log(currentPOS);
                //設定container樣式
                $(".sliderContainer>ul",obj).height(setContainerHeight).css({"margin-top":(prevHeight+startPOS)+"px","margin-bottom":nextHeight+"px"}); 
                //設定item樣式
                $(".sliderContainer>ul>li",obj).height(itemHeight).css({"margin":listPaddingAmt+"px 0"});

                //將slide中圖片bind resIgnoreImgReSizer class
                $(".sliderContainer img",obj).each(function(){
                    $(this).addClass("resIgnoreImgReSizer");
                })

        }else{
            //預設橫向

                //創建按鈕組
                if(!$.isEmptyObject(btnSetup)){
                    for (var btn in btnSetup) {
                        var setState = (btnSetup[btn]['state'] != undefined)?btnSetup[btn]['state']:true;
                        if(setState){
                            var setWidth = (btnSetup[btn]['width'] != undefined)?btnSetup[btn]['width']:20;
                            var setStyle =  'style="width:'+setWidth+'px';
                            switch (btn){
                                case "nextBtn":
                                    $(".sliderContainer",obj).append('<div class="sliderContainerPrevBtn" '+setStyle+'"></div>');
                                break;
                                case "prevBtn":
                                    $(".sliderContainer",obj).append('<div class="sliderContainerNextBtn" '+setStyle+'"></div>');
                                break;
                            }
                        } 
                    }    
                }
                var prevWidth = $(".sliderContainer .sliderContainerPrevBtn",obj).width();
                var nextWidth = $(".sliderContainer .sliderContainerNextBtn",obj).width();

                var amountOfItem = $(".sliderContainer>ul>li",obj).length;
                //var containerWidth = ($(window).width() > 800)?$(".sliderContainer",obj).width() - (nextWidth+prevWidth+paddingAmt):$(window).width() - (nextWidth+prevWidth+paddingAmt);
                var containerWidth = $(".sliderContainer",obj).width() - (nextWidth+prevWidth);
                //console.log(containerWidth);
                var itemWidth = (containerWidth/listAmt) - (listPaddingAmt*2);
                var startPOS = containerWidth*from*-1;
                var currentPOS = 0;
                var setContainerWidth = (itemWidth+(listPaddingAmt*2))*amountOfItem;
                var swipToNextPOS = 0;
                var swipToPrevPOS = 0;
                var trackSwipEvent = false;
                var startLimited = containerWidth*from;
                var endLimited = setContainerWidth-(startLimited);
                //console.log(currentPOS);
                //設定container樣式
                $(".sliderContainer>ul",obj).width(setContainerWidth).css({"margin-left":(prevWidth+startPOS)+"px","margin-right":nextWidth+"px"}); 
                //設定item樣式
                $(".sliderContainer>ul>li",obj).width(itemWidth).css({"margin":"0 "+listPaddingAmt+"px"});

                //將slide中圖片bind resIgnoreImgReSizer class
                $(".sliderContainer img",obj).each(function(){
                    $(this).addClass("resIgnoreImgReSizer");
                })
        }

        //設定control
        //prev btn event
        $(obj).on('click',".sliderContainerPrevBtn", function(){
            //檢查走向
            if (type == "vertical"){
                //進行動作
                if ((currentPOS*-1) > (startLimited*-1)){
                    currentPOS+=containerHeight;
                }else{
                    currentPOS = -(endLimited-containerHeight);
                }
                $(".sliderContainer>ul",obj).animate({'top':currentPOS+"px"},transitionTime);
            }else{
                //進行動作
                if ((currentPOS*-1) > (startLimited*-1)){
                    currentPOS+=containerWidth;
                }else{
                    currentPOS = -(endLimited-containerWidth);
                }
                $(".sliderContainer>ul",obj).animate({'left':currentPOS+"px"},transitionTime);
            }

            //console.log(currentPOS);
        })

        //next btn event
        $(obj).on('click',".sliderContainerNextBtn", function(){
            //檢查走向
            if (type == "vertical"){
                if (((currentPOS*-1) < endLimited) && (endLimited+currentPOS) > containerHeight ){
                    currentPOS-=containerHeight;
                }else{
                    currentPOS = startLimited;
                }
                $(".sliderContainer>ul",obj).animate({'top':currentPOS+"px"},transitionTime);
            }else{
                if (((currentPOS*-1) < endLimited) && (endLimited+currentPOS) > containerWidth ){
                    currentPOS-=containerWidth;
                }else{
                    currentPOS = startLimited;
                }
                $(".sliderContainer>ul",obj).animate({'left':currentPOS+"px"},transitionTime);
            }
            //console.log(currentPOS);
        })
        
        //content area event
        $(obj).on('mouseenter',".sliderContainer",function(e) {
            //mouseenter
            if(autoPlay) {
                //mouse over stop looping
                clearInterval(timeID);
            }

        }).on('mouseleave',".sliderContainer",function(e) {

            //mouseleave
            if(autoPlay) {
                timeID = setInterval(function() {
                    //檢查走向
                    if (type == "vertical"){
                        if (((currentPOS*-1) < endLimited) && (endLimited+currentPOS) > containerHeight ){
                            currentPOS-=containerHeight;
                        }else{
                            currentPOS = startLimited;
                        }
                        $(".sliderContainer>ul",obj).animate({'top':currentPOS+"px"},transitionTime);
                    }else{
                        if (((currentPOS*-1) < endLimited) && (endLimited+currentPOS) > containerWidth ){
                            currentPOS-=containerWidth;
                        }else{
                            currentPOS = startLimited;
                        }
                        $(".sliderContainer>ul",obj).animate({'left':currentPOS+"px"},transitionTime);
                    }
                    //console.log(currentPOS);
                }, delayTime);
            }

        }).on('touchstart',".sliderContainer",function(e) {
            //touchstart
            var touch = e.originalEvent.touches[0];
            if (type == "vertical"){
                swipToNextPOS = touch.pageY-touchSwipAmt;
                swipToPrevPOS = touch.pageY+touchSwipAmt;
            }else{
                swipToNextPOS = touch.pageX-touchSwipAmt;
                swipToPrevPOS = touch.pageX+touchSwipAmt;
            }
            
            trackSwipEvent = true;

        }).on('touchmove',".sliderContainer",function(e) {
            //touchmove
            var touch = e.originalEvent.touches[0];
            
            //檢查走向
            if (type == "vertical"){
                var trackAction = touch.pageY;
            }else{
                var trackAction = touch.pageX;
            }

            //swip to next
            if (trackSwipEvent && swipToNextPOS > trackAction){
                
                //檢查走向
                if (type == "vertical"){
                    if (((currentPOS*-1) < endLimited) && (endLimited+currentPOS) > containerHeight ){
                        currentPOS-=containerHeight;
                    }else{
                        currentPOS = startLimited;
                    }
                    $(".sliderContainer>ul",obj).animate({'top':currentPOS+"px"},transitionTime);
                }else{
                    if (((currentPOS*-1) < endLimited) && (endLimited+currentPOS) > containerWidth ){
                        currentPOS-=containerWidth;
                    }else{
                        currentPOS = startLimited;
                    }
                    $(".sliderContainer>ul",obj).animate({'left':currentPOS+"px"},transitionTime);
                }
                trackSwipEvent = false;
            }

            //swip to prev
            if (trackSwipEvent && swipToPrevPOS < trackAction){
                //檢查走向
                if (type == "vertical"){
                    if ((currentPOS*-1) > (startLimited*-1)){
                        currentPOS+=containerHeight;
                    }else{
                        currentPOS = -(endLimited-containerHeight);
                    }
                    $(".sliderContainer>ul",obj).animate({'top':currentPOS+"px"},transitionTime);
                }else{
                    if ((currentPOS*-1) > (startLimited*-1)){
                        currentPOS+=containerWidth;
                    }else{
                        currentPOS = -(endLimited-containerWidth);
                    }
                    $(".sliderContainer>ul",obj).animate({'left':currentPOS+"px"},transitionTime);
                }
                trackSwipEvent = false;
            }
        });

        //循環播放
        if(autoPlay) {
            var timeID = setInterval(function() {
                //檢查走向
                if (type == "vertical"){
                    if (((currentPOS*-1) < endLimited) && (endLimited+currentPOS) > containerHeight ){
                        currentPOS-=containerHeight;
                    }else{
                        currentPOS = startLimited;
                    }
                    $(".sliderContainer>ul",obj).animate({'top':currentPOS+"px"},transitionTime);
                }else{
                    if (((currentPOS*-1) < endLimited) && (endLimited+currentPOS) > containerWidth ){
                        currentPOS-=containerWidth;
                    }else{
                        currentPOS = startLimited;
                    }
                    $(".sliderContainer>ul",obj).animate({'left':currentPOS+"px"},transitionTime);
                }
                //console.log(currentPOS);

            }, delayTime);
        }
    }
}(jQuery, document, window));