var currScrollPos = 0;
var ladderObjAmt = 0;
(function ($, document, window) {
	//物件ladder定位功能
    $.fn.JResLadderObj = function(options) {
        var defaults = {
            state: true,
            setupMode: false,
            position: 'fixed',
            container: '',
            path: {
                0:{
                    speed: 1,
                    start:{
                        ladder: 0,
                        x: 0,
                        y: 0,
                        z: 0,
                        opacity: 0
                    },
                    end: {
                        ladder: 0,
                        x: 0,
                        y: 0,
                        z: 0,
                        opacity: 1
                    } 
                }
            }
        };
        options = $.extend(defaults, options);
        var obj = $(this);
        var state = options.state;
        var mode = options.setupMode;
        var path = options.path;
        var currentPoint = 0;
        var currentPosX,currentPosY,currentPosZ,currentOpacity,scrollAmt = 0;
        var position = options.position;
        var speed = 1;
        var pathArray = [];
        var container = options.container;
        var track = (position=="fixed" && container != "")?$(document).height():$(container).height();
        var winW = $(window).width();
        var currentPath;


        //定位位置
        if(!$.isEmptyObject(path)){
            for (var point in path) {
                pathArray.push(point);
            }
        }

        //若有啟用且該頁面有此物件
        if (state && $(obj).length > 0) {

            //定義物件的預設ladder高度
            var initStartLadderForGeneal = (position == "fixed") ? 0 : Math.round($(container).position().top)-Math.round($(window).height());
            var initEndLadderForGeneal = (position == "fixed") ? 0 : Math.round($(container).position().top)+Math.round($(window).height());

            //定義物件
            $(obj).addClass("JResLadderObj");

            //定位物件
            $(obj).css({
                'position':position,
                'top':path[pathArray[0]]['start']['y'],
                'left':path[pathArray[0]]['start']['x'],
                'z-index':path[pathArray[0]]['start']['z'],
                opacity: path[pathArray[0]]['start']['opacity'],
                '-ms-filter': "progid:DXImageTransform.Microsoft.Alpha(Opacity="+Math.round(path[pathArray[0]]['start']['opacity']*100)+")",
                'filter': "alpha(opacity="+Math.round(path[pathArray[0]]['start']['opacity']*100)+")"
            });

            //if is setup mode, show position dialog
            if (mode){
                var showModeData = {'currScrollPos':currScrollPos,
                                    'track':track,
                                    'path':pathArray[0],
                                    'start':path[pathArray[0]]['start']['ladder'],
                                    'end':path[pathArray[0]]['end']['ladder'],
                                    'currentPosX':Math.round(path[pathArray[0]]['start']['x']),
                                    'currentPosY':Math.round(path[pathArray[0]]['start']['y']),
                                    'currentPosZ':path[pathArray[0]]['start']['z'],
                                    'currentOpacity':path[pathArray[0]]['start']['opacity'],
                                    'scrollAmt': scrollAmt
                                   };
                fnSetupMode($(obj),showModeData);
                fnGlobalInfo(showModeData);
            }

            //console.log(pathArray);

            //加入控制 
            var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "scroll" //FF doesn't recognize mousewheel as of FF3.x
            $(window).on(mousewheelevt, function(e){
                    //取得目前物件位置
                    currentPosX = parseInt($(obj).position().left);
                    currentPosY = parseInt($(obj).position().top);
                    currentPosZ = parseInt($(obj).css("z-index"));
                    currentOpacity = parseFloat($(obj).css("opacity")); //parseFloat return value with floatpoint
                    scrollAmt = 0;
                    //console.log(path['0']['start']['ladder']+","+$(this).scrollTop()+","+ (path['0']['end']['ladder'] <= $(this).scrollTop()));
                    //檢查動向
                    if ((path[pathArray[pathArray.length-1]]['end']['ladder'] + initEndLadderForGeneal) >= $(this).scrollTop()) {
                        if ((path[pathArray[pathArray.length-1]]['start']['ladder'] + initStartLadderForGeneal) <= $(this).scrollTop()) {
                            for (var i = 0; i < pathArray.length; i++) {
                            //針對目前的scrollTop位置尋找適合的定位點
                                if((path[pathArray[i]]['start']['ladder'] + initStartLadderForGeneal) <= $(this).scrollTop() && (path[pathArray[i]]['end']['ladder'] + initEndLadderForGeneal) >= $(this).scrollTop()){
                                    currentPath = i;
                                    //console.log("scroll: "+$(this).scrollTop()+" start:"+path[pathArray[i]]['start']['ladder']+" end:"+path[pathArray[i]]['end']['ladder']);

                                    var pathTrack = (path[pathArray[i]]['end']['ladder'] + initEndLadderForGeneal) - (path[pathArray[i]]['start']['ladder'] + initStartLadderForGeneal);
                                    var xPath = path[pathArray[i]]['start']['x'] - path[pathArray[i]]['end']['x'];
                                    var yPath = path[pathArray[i]]['start']['y'] - path[pathArray[i]]['end']['y'];
                                    var xDirection = (xPath < 0) ? 1 : -1;
                                    var yDirection = (yPath < 0) ? 1 : -1;
                                    var xMoveAmt = Math.abs(xPath)/pathTrack;
                                    var yMoveAmt = Math.abs(yPath)/pathTrack;
                                    scrollAmt = Math.abs($(this).scrollTop()-currScrollPos);
                                    var scrollDirection = ($(this).scrollTop() < currScrollPos)? -1 : 1 ;
                                    var opacityAmt = Math.abs(path[pathArray[i]]['start']['opacity'] - path[pathArray[i]]['end']['opacity'])/pathTrack;
                                    //console.log("currentOpacity: "+currentOpacity+" opacityAmt: "+opacityAmt*scrollAmt+" top: "+$(this).scrollTop()+" prev: "+currScrollPos);
                                    //console.log("opacityAmt: "+opacityAmt);

                                    //計算X軸位置
                                    currentPosX += (xMoveAmt*scrollAmt)*scrollDirection*xDirection;
                                    if (path[pathArray[i]]['start']['x'] < path[pathArray[i]]['end']['x']) {
                                        currentPosX = (currentPosX <= path[pathArray[i]]['start']['x']) ? path[pathArray[i]]['start']['x'] : currentPosX;
                                        currentPosX = (currentPosX >= path[pathArray[i]]['end']['x']) ? path[pathArray[i]]['end']['x'] : currentPosX;
                                    }else{
                                        currentPosX = (currentPosX >= path[pathArray[i]]['start']['x']) ? path[pathArray[i]]['start']['x'] : currentPosX;
                                        currentPosX = (currentPosX <= path[pathArray[i]]['end']['x']) ? path[pathArray[i]]['end']['x'] : currentPosX;
                                    }

                                    //計算y軸位置
                                    currentPosY += (yMoveAmt*scrollAmt)*scrollDirection*yDirection;
                                    //console.log("obj: "+$(obj).attr("id")+" y:"+scrollAmt+" x:"+currentPosX+" scroll: "+$(this).scrollTop());
                                    if (path[pathArray[i]]['start']['y'] < path[pathArray[i]]['end']['y']) {
                                        currentPosY = (currentPosY <= path[pathArray[i]]['start']['y']) ? path[pathArray[i]]['start']['y'] : currentPosY;
                                        currentPosY = (currentPosY >= path[pathArray[i]]['end']['y']) ? path[pathArray[i]]['end']['y'] : currentPosY;
                                    }else{
                                        currentPosY = (currentPosY >= path[pathArray[i]]['start']['y']) ? path[pathArray[i]]['start']['y'] : currentPosY;
                                        currentPosY = (currentPosY <= path[pathArray[i]]['end']['y']) ? path[pathArray[i]]['end']['y'] : currentPosY;
                                    }

                                    //計算z-index位置
                                    currentPosZ = ((path[pathArray[i]]['end']['ladder'] + initEndLadderForGeneal) >= $(this).scrollTop())? path[pathArray[i]]['start']['z'] : path[pathArray[i]]['end']['z'];
                                    //console.log('currentScroll: '+$(this).scrollTop()+" endScroll: "+path[pathArray[i]]['end']['ladder']);

                                    //計算opacity值
                                    currentOpacity += (opacityAmt*scrollAmt)*scrollDirection;
                                    //console.log('currentScroll: '+currentOpacity);

                                    $(obj).css({
                                        'top':Math.round(currentPosY)+'px',
                                        'left':Math.round(currentPosX)+'px',
                                        'z-index':currentPosZ,
                                        opacity:currentOpacity
                                    });
                                }
                            }
                        }else{
                            //當定位在最初設定前，則將物件移到最初位置 (其他)
                            currentPosX = path[pathArray[pathArray.length-1]]['start']['x'];
                            currentPosY = path[pathArray[pathArray.length-1]]['start']['y'];
                            currentPosZ = path[pathArray[pathArray.length-1]]['start']['z'];
                            currentOpacity = path[pathArray[pathArray.length-1]]['start']['opacity'];
                            $(obj).css({
                                'top':Math.round(currentPosY)+'px',
                                'left':Math.round(currentPosX)+'px',
                                'z-index':currentPosZ,
                                opacity:currentOpacity
                            });
                        }

                    }else{
                        //當定位已達最後設定
                        currentOpacity = path[pathArray[pathArray.length-1]]['end']['opacity'];
                        if (position == "fixed"){
                            //當定位已達最後設定，則將物件移動改為一般卷軸移動 (fixed)
                            var scrollDirection = ($(this).scrollTop() < currScrollPos)? 1 : -1 ;
                            var scrollAmt = Math.abs($(this).scrollTop()-currScrollPos);
                            currentPosY = (currentPosY > path[pathArray[pathArray.length-1]]['end']['y']) ? path[pathArray[pathArray.length-1]]['end']['y'] : currentPosY;
                            currentPosY += (scrollAmt)*scrollDirection;
                            //console.log($(obj).attr("id")+": "+currentPosY);
                            $(obj).css({
                                'top':currentPosY+'px',
                                opacity:currentOpacity
                            });
                        }else{
                            //當定位已達最後設定，則將物件移到最終位置 (其他)
                            currentPosX = path[pathArray[pathArray.length-1]]['end']['x'];
                            currentPosY = path[pathArray[pathArray.length-1]]['end']['y'];
                            $(obj).css({
                                'top':Math.round(currentPosY)+'px',
                                'left':Math.round(currentPosX)+'px',
                                opacity:currentOpacity
                            });
                        }
                    }

                    //update scrollPos global var
                    if($(obj).attr("id") == $(".JResLadderObj").last().attr("id")) {
                        currScrollPos = $(this).scrollTop();
                    }

                    //if is setup mode, show position dialog
                    if (mode){
                        var showModeData = {'currScrollPos':currScrollPos,
                                            'track':track,
                                            'path':pathArray[currentPath],
                                            'start':(path[pathArray[currentPath]]['start']['ladder'] + initStartLadderForGeneal),
                                            'end':(path[pathArray[currentPath]]['end']['ladder'] + initEndLadderForGeneal),
                                            'currentPosX':Math.round(currentPosX),
                                            'currentPosY':Math.round(currentPosY),
                                            'currentPosZ':currentPosZ,
                                            'currentOpacity':currentOpacity,
                                            'scrollAmt': scrollAmt
                                            };
                        fnSetupMode($(obj),showModeData);
                        fnGlobalInfo(showModeData);
                    }

            });

        }


        $(document).on('click','.resLadderJumper',function(){
            var getToggleObj = $(this).attr("toggle");
            var getLadderPoint = $(this).attr("ladder");
            if ($(obj).attr("id") == getToggleObj) {
               var toMoveFromTop = (path[pathArray[getLadderPoint]]['end']['ladder'] + initEndLadderForGeneal); 
            }
            //console.log(toMoveFromTop);
            $("html, body").animate({
                scrollTop: toMoveFromTop
            }, 3000);
            return false;
        })

        //setup mode info box
        function fnSetupMode(obj,showModeData){
            var showModeContent = 'ScrollTrack: '+showModeData['track']+'<br>'+
                'CurrentPath: '+showModeData['path']+'<br>'+
                'PathStart: '+(showModeData['start'] + initStartLadderForGeneal)+'<br>'+
                'PathEnd: '+(showModeData['end'] + initEndLadderForGeneal)+'<br>'+
                'Obj1 X: '+showModeData['currentPosX']+'<br>'+
                'Obj1 Y: '+showModeData['currentPosY']+'<br>'+
                'Obj1 Z: '+showModeData['currentPosZ']+'<br>'+
                'Opacity: '+showModeData['currentOpacity']+'<br>';
            $(".resLadderMode",obj).remove();
            $(obj).append('<div id="resLadderInfoBox_'+$(obj).attr("id")+'" class="resLadderMode"><div class="title">ID: '+$(obj).attr("id")+'</div><div class="content">'+showModeContent+'</div></div>');
        }

        //global info
        function fnGlobalInfo(showModeData){
            var showModeContent = 'CurrentScroll: '+showModeData['currScrollPos']+'<br>'+
                'scrollAmt: '+showModeData['scrollAmt']+'<br>';
            $("#resGlobalInfo").remove();
            $('body').append('<div id="resGlobalInfo" class="resLadderMode"><div class="title">Setup Mode: ON</div><div class="content">'+showModeContent+'</div></div>');
        }
    }

}(jQuery, document, window));