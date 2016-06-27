(function ($, document, window) {
    $.JResponsive = function(options) {
        //-- 設定響應式開拉式內容 --////////////////////////////////////////////////////////////////
        //-- 參數設定:////////////////////////////////////////////////////////////////////////////
        //-- 在這裡您可以選擇要嵌入開拉式區塊的內容，您可以直接由原本網頁內容的物件直接複製，或自行寫網頁內容//
        /////////////////////////////////////////////////////////////////////////////////////////
        //using object to replace variable
        //here is the default value
        var defaults = {
            defaultResponse: true,
            setUILoadWidth: 800,
            printMediaSetupMode: false,
            mobileSwitch: "body",
            viewPortSetup: "",
            res_langVarDefault: "",
            res_langVarEn: "",
            res_langVarTw: "/tw/",
            res_langArrayTw: "",
            res_langVarCn: "/cn/",
            res_langArrayCn: "",
            res_langVarAdd1: "",
            res_langArrayAdd1: "",
            res_langVarAdd2: "",
            res_langArrayAdd2: "",
            res_langVarAdd3: "",
            res_langArrayAdd3: "",
            res_langVarAdd4: "",
            res_langArrayAdd4: "",
            res_langVarAdd5: "",
            res_langArrayAdd5: "",
            defaultLangMenuObj: "",
            customLangMenu: "<ul>" + '<li><a href="#">中文版</a></li>' + '<li><a href="#">ENGLISH</a></li>' + "</ul>",
            defaultMenuObj: "",
            customMenu: "",
            defaultSubMenuObj: "",
            customSubMenu: "",
            additionalPage: "",
            pannelPosition: "left",
            pannelStyle: '',
            pannelAnimateTime: 500,
            pannelAnimateEasing: "swing",
            menuCollapse:'',
            resPageLoader: false,
            resPageLoaderTigger: 800,
            responsiveSwitch: true,
            res_langSwitch: true,
            res_tabJumperSetting: {},
            res_mobileTopNavBtnSetup: {},
            additionalBtn: "",
            res_mobileBottomNavBtnSetup: {},
            additionalBottomBtn: "",
            scrollTop: true
        };

        options = $.extend(defaults, options);

        //預設全域的響應式視窗風格
        var pannelStyle = options.pannelStyle;

        //啟用伸縮選單的物件ID
        var menuCollapse = options.menuCollapse;

        //scroll to top plugin 控制
        var scroll_to_top = options.scrollTop;
        if (scroll_to_top)resScrolltotop.init();

        //列印模式測試
        var printMediaMode = options.printMediaSetupMode;
        var printMediaSetupMode = (printMediaMode)?"all":"print";

        //設定響應式介面載入尺寸
        var setUILoadWidth = options.setUILoadWidth;

        //設定響應式介面收拉視窗的開啟動畫時間
        var pannelAnimateTime = options.pannelAnimateTime;

        //設定響應式介面收拉視窗開啟動畫效果
        var pannelAnimateEasing = options.pannelAnimateEasing;

        //設定響應式主導覽按鈕 (上方)
        var resMobileNavSetup = options.res_mobileTopNavBtnSetup;
        var resMenuState = true; //true使用:false不使用
        var resPrimM = true; //true使用主選單:false不使用
        var resMenuType = 'fixed'; //類型fixed永遠在上面,absolute只在頁面最上方
        var resMobileNavSetupWidth = 50;
        var resMobileNavSetupHeight = 50;
        var resMobileNavSetupMargin = 5;
        for (var data in resMobileNavSetup) {
            switch (data) {
              case "state":
                resMenuState = resMobileNavSetup[data];
              break;
              case "type":
                resMenuType = resMobileNavSetup[data];
              break;
              case "primary":
                resPrimM = resMobileNavSetup[data];
              break;
              case "width":
                resMobileNavSetupWidth = resMobileNavSetup[data];
                break;

              case "height":
                resMobileNavSetupHeight = resMobileNavSetup[data];
                break;

              case "margin":
                resMobileNavSetupMargin = resMobileNavSetup[data];
                break;
            }
        }
        var resMarginTop = resMenuState == true ? "margin-top:"+resMobileNavSetupHeight+"px;" : "";

        //設定響應式主導覽按鈕 (下方)
        var resBottomMobileNavSetup = options.res_mobileBottomNavBtnSetup;
        var resBottomMenuState = false; //true使用:false不使用
        var resBottomPrimM = true; //true使用主選單:false不使用
        var resBottomMenuType = 'fixed'; //類型fixed永遠在上面,absolute只在頁面最上方
        var resBottomMobileNavSetupWidth = 50;
        var resBottomMobileNavSetupHeight = 50;
        var resBottomMobileNavSetupMargin = 5;
        for (var data in resBottomMobileNavSetup) {
            switch (data) {
              case "state":
                resBottomMenuState = resBottomMobileNavSetup[data];
              break;
              case "type":
                resBottomMenuType = resBottomMobileNavSetup[data];
              break;
              case "primary":
                resBottomPrimM = resBottomMobileNavSetup[data];
              break;
              case "width":
                resBottomMobileNavSetupWidth = resBottomMobileNavSetup[data];
                break;

              case "height":
                resBottomMobileNavSetupHeight = resBottomMobileNavSetup[data];
                break;

              case "margin":
                resBottomMobileNavSetupMargin = resBottomMobileNavSetup[data];
                break;
            }
        }
        var resMarginBottom = resBottomMenuState == true ? "margin-bottom:"+(resBottomMobileNavSetupHeight+20)+"px;" : "";

        //響應式預設值 
        //開啟:true 
        //關閉:false
        var defaultResponse = (options.defaultResponse)?"true":"false";

        var responsiveSwitch = options.responsiveSwitch ? "" : "style='display:none'";
        responsiveSwitch = (viewPortSetup != 'custom') ? "" : "style='display:none'"; //如果viewPortSetup為custom不使用response按鈕
        //響應式開關
        //模組的預設路徑
        var path = $.JRes_modulePath();
        //var modulePath = options.modulePath == "" ? path : path+options.modulePath;
        var modulePath = path;
        //選單位置
        var pannelPosition = fnCheckPosition(options.pannelPosition, "position");
        var flipDirection = fnCheckPosition(options.pannelPosition, "direction");
        //擴充響應式頁面
        var additionalPageArray = options.additionalPage;
        var countAddPage = additionalPageArray.length;
        var resPageTitleMargin = Math.round((resMobileNavSetupHeight/2)/3); //resPageTitle間距
        var resPageTitleHeight = resMobileNavSetupHeight - (resPageTitleMargin * 2); //resPageTitle高度
        var additionalPageContent = '<div id="resPageLoader" class="resFlipPage resFlipPageR"><div class="menuList" style="' + resMarginTop + resMarginBottom + '">' + 
                                    '<div style="height:' + resMobileNavSetupHeight + 'px;" class="resPageController">' + 
                                    '<div style="width:' + resMobileNavSetupWidth + 'px;height:' + resMobileNavSetupHeight + 'px;" class="resAddPageBackIcon" onclick="JResPageControl({id:\'#resPageLoader\',action:\'back\',animateTime:' + pannelAnimateTime + ',animateEasing:\''+pannelAnimateEasing+'\'});return false;"></div>' + 
                                    '<div style="height:' + resPageTitleHeight + 'px;margin:' + resPageTitleMargin + 'px 0;" class="resAddPageTitle">Res Loader</div></div>'+
                                    '<div style="height:' + resBottomMobileNavSetupHeight + 'px;" class="resPageControllerBottom"><div style="width:' + resBottomMobileNavSetupWidth + 'px;height:' + resBottomMobileNavSetupHeight + 'px;" id="closeAllresFlipPage" onclick="JResPageControl({id:\'\',action:\'closeAll\',animateTime:' + pannelAnimateTime + ',animateEasing:\''+pannelAnimateEasing+'\'});return false;"></div></div>' +
                                    '<div class="resAddPageContent"><div class="resAddPageContentMain">' + 
                                    '<div id="resPageLoad_loading_icon"></div>' + 
                                    '<div id="resPageLoad_area"></div>' + 
                                    '</div></div></div></div>';
        if (countAddPage > 0) {
            for (var i = 0; i < countAddPage; i++) {
                var addPagePosition = "";
                var addPageflipDirection = "";
                if (additionalPageArray != undefined) {
                    addPagePosition = fnCheckPosition(additionalPageArray[i][1] + "_page", "position");
                    addPageflipDirection = fnCheckPosition(additionalPageArray[i][1] + "_page", "direction");
                } else {
                    addPagePosition = pannelPosition;
                    addPageflipDirection = flipDirection;
                }
                var addPageContent = additionalPageArray[i][3] != undefined ? additionalPageArray[i][3] : "";
                var addPageID = additionalPageArray[i][0] + "_pageContent";
                var relateBtn = "";
                if ($.trim(additionalPageArray[i][4]) != "") {
                    var relateID = additionalPageArray[i][4].indexOf("_pageContent") == -1 ? additionalPageArray[i][4] + "_pageContent" : additionalPageArray[i][4];
                    relateBtn = '<div style="width:' + resMobileNavSetupWidth + 'px;height:' + resMobileNavSetupHeight + 'px;" class="resAddPageNextIcon" onclick="JResPageControl({id:\'#' + relateID + '\',action:\'open\',animateTime:' + pannelAnimateTime + ',animateEasing:\''+pannelAnimateEasing+'\'});return false;"></div>';
                }
                additionalPageContent += '<div id="' + addPageID + '" class="resFlipPage ' + addPagePosition + '"><div class="menuList" style="' + resMarginTop + resMarginBottom + '">' +
                                         '<div style="height:' + resMobileNavSetupHeight + 'px;" class="resPageController">' + 
                                            '<div style="width:' + resMobileNavSetupWidth + 'px;height:' + resMobileNavSetupHeight + 'px;" class="resAddPageBackIcon" onclick="JResPageControl({id:\'#' + addPageID + '\',action:\'back\',animateTime:' + pannelAnimateTime + ',animateEasing:\''+pannelAnimateEasing+'\'});return false;"></div>' + 
                                            '<div style="height:' + resPageTitleHeight + 'px;margin:' + resPageTitleMargin + 'px 0;" class="resAddPageTitle">' + additionalPageArray[i][2] + "</div>" + 
                                            relateBtn + 
                                         '</div>'+
                                         '<div style="height:' + resBottomMobileNavSetupHeight + 'px;" class="resPageControllerBottom"><div style="width:' + resBottomMobileNavSetupWidth + 'px;height:' + resBottomMobileNavSetupHeight + 'px;" id="closeAllresFlipPage" onclick="JResPageControl({id:\'\',action:\'closeAll\',animateTime:' + pannelAnimateTime + ',animateEasing:\''+pannelAnimateEasing+'\'});return false;"></div></div>' +
                                         '<div class="resAddPageContent"><div class="resAddPageContentMain">' + 
                                            addPageContent + 
                                         "<div class='clear'></div></div></div></div></div>";
            }
        }
        //擴充上選單按鈕
        var additionalBtnArray = options.additionalBtn;
        var countAddBtn = additionalBtnArray.length;
        var additionalBtn = "";
        var btnTarget = "";
        var additionalPannelContent = "";
        var mobile_nav_BtnAmt = 0;
        //若主選單按鈕有啟用在上選單
        if (resPrimM) {
            additionalBtn += '<li id="menu_btn" style="width:' + resMobileNavSetupWidth + "px;height:" + resMobileNavSetupHeight + "px;margin-right:" + resMobileNavSetupMargin + 'px"><a href="#" style="width:' + resMobileNavSetupWidth + "px;height:" + resMobileNavSetupHeight + 'px;"></a></li>';
            mobile_nav_BtnAmt = 1;
        }
        
        if (countAddBtn > 0) {
            for (var i = 0; i < countAddBtn; i++) {
                var btnId = additionalBtnArray[i][0] != undefined ? additionalBtnArray[i][0] : "";
                var btnLink = additionalBtnArray[i][1] != undefined ? additionalBtnArray[i][1] : "#";
                var btnText = additionalBtnArray[i][2] != undefined ? additionalBtnArray[i][2] : "";
                var showBtn = true;
                switch (additionalBtnArray[i][3]) {
                  case "pannel":
                    //開啟響應式視窗
                    var addPanelPosition = "";
                    var addflipDirection = "";
                    if (additionalBtnArray[i][4][0] != undefined) {
                        addPanelPosition = fnCheckPosition(additionalBtnArray[i][4][0], "position");
                        addflipDirection = fnCheckPosition(additionalBtnArray[i][4][0], "direction");
                    } else {
                        addPanelPosition = pannelPosition;
                        addflipDirection = flipDirection;
                    }

                    //pannel風格
                    if (additionalBtnArray[i][4][2] != undefined) {
                        addPannelStyle = additionalBtnArray[i][4][2];
                    }else{
                        addPannelStyle = pannelStyle;
                    }

                    var addPanelContent = additionalBtnArray[i][4][1] != undefined ? additionalBtnArray[i][4][1] : "";
                    additionalPannelContent += '<div id="' + btnId + '_pannelContent" class="flipContent ' + addPannelStyle + ' ' + addPanelPosition + '"><div class="menuList" style="' + resMarginTop + resMarginBottom + '">' + addPanelContent + "<div class='clear'></div></div></div>";
                    btnTarget = " onclick=\"JResMobileTopNav({btnId:'#" + btnId + "',contentId:'#" + btnId + "_pannelContent',position:'" + addflipDirection + "',resetEvt:false,animateTime:" + pannelAnimateTime + ",animateEasing:'"+pannelAnimateEasing+"'});return false;\"";
                    //trim whitespace from pannel content, then check if it is empty return value false to showBtn
                    if ($.trim(addPanelContent) == "") {
                        showBtn = false;
                    }
                    break;

                  case "tab":
                    //移動至頁面區塊按鈕
                    btnTarget = " class='resTabJumper' ";
                    //檢查tab目標連結是否含有路徑
                    var targetURL = btnLink;
                    if (targetURL.split("#")[0] == undefined || targetURL.split("#")[0] == "") {
                        //若無路徑檢查tab目標物件是否存在
                        if ($(targetURL).length == 0){
                            showBtn = false;
                        }
                    }
                    break;

                    case "page":
                        //開啟響應式頁面
                        btnTarget = " class='resPageBtn' toggle='"+btnLink+"' ";
                    break;

                    case "loader":
                        //開啟響應式載入頁面
                        btnTarget = " class='resPageLoaderBtn' ";
                        var addLoaderSetup = additionalBtnArray[i][4] != undefined ? additionalBtnArray[i][4] : "";
                        //將其餘參數寫入
                        if (addLoaderSetup != "") {
                            for (var data in addLoaderSetup) {
                                btnTarget += data + "='" + addLoaderSetup[data] + "' ";
                            }
                        }

                    break;


                  case undefined:
                    btnTarget = "";
                    break;

                  default:
                    btnTarget = " target='" + additionalBtnArray[i][3] + "'";
                    break;
                }
                //showBtn value with false than don't show the button
                if (showBtn) {
                    additionalBtn += '<li id="' + btnId + '" style="width:' + resMobileNavSetupWidth + "px;height:" + resMobileNavSetupHeight + "px;margin-right:" + resMobileNavSetupMargin + 'px"><a href="' + btnLink + '" ' + btnTarget + 'style="width:' + resMobileNavSetupWidth + "px;height:" + resMobileNavSetupHeight + 'px;">' + btnText + '</a></li>';
                }
                mobile_nav_BtnAmt++;
            }
        }
        //擴充下選單按鈕
        var additionalBottomBtnArray = options.additionalBottomBtn;
        var countAddBottomBtn = additionalBottomBtnArray.length;
        var additionalBottomBtn = "";
        var BottombtnTarget = "";
        var additionalBottomPannelContent = "";
        var mobile_nav_BottomBtnAmt = 0;
        //若主選單按鈕有啟用在下選單
        if (resBottomPrimM) {
            additionalBottomBtn += '<li id="menu_btn_bottom" style="width:' + resBottomMobileNavSetupWidth + "px;height:" + resBottomMobileNavSetupHeight + "px;margin-right:" + resBottomMobileNavSetupMargin + 'px"><a href="#" style="width:' + resBottomMobileNavSetupWidth + "px;height:" + resBottomMobileNavSetupHeight + 'px;"></a></li>';
            mobile_nav_BottomBtnAmt = 1;
        }

        if (countAddBottomBtn > 0) {
            for (var i = 0; i < countAddBottomBtn; i++) {
                var btnId = additionalBottomBtnArray[i][0] != undefined ? additionalBottomBtnArray[i][0] : "";
                var btnLink = additionalBottomBtnArray[i][1] != undefined ? additionalBottomBtnArray[i][1] : "#";
                var btnText = additionalBottomBtnArray[i][2] != undefined ? additionalBottomBtnArray[i][2] : "";
                var showBtn = true;
                switch (additionalBottomBtnArray[i][3]) {
                  case "pannel":
                    //開啟響應式視窗
                    var addPanelPosition = "";
                    var addflipDirection = "";
                    if (additionalBottomBtnArray[i][4][0] != undefined) {
                        addPanelPosition = fnCheckPosition(additionalBottomBtnArray[i][4][0], "position");
                        addflipDirection = fnCheckPosition(additionalBottomBtnArray[i][4][0], "direction");
                    } else {
                        addPanelPosition = pannelPosition;
                        addflipDirection = flipDirection;
                    }

                    //pannel風格
                    if (additionalBtnArray[i][4][2] != undefined) {
                        addPannelStyle = additionalBtnArray[i][4][2];
                    }else{
                        addPannelStyle = pannelStyle;
                    }

                    var addPanelContent = additionalBottomBtnArray[i][4][1] != undefined ? additionalBottomBtnArray[i][4][1] : "";
                    additionalBottomPannelContent += '<div id="' + btnId + '_pannelContent" class="flipContent ' + addPannelStyle + ' ' + addPanelPosition + '"><div class="menuList" style="' + resMarginTop + resMarginBottom + '">' + addPanelContent + "<div class='clear'></div></div></div>";
                    BottombtnTarget = " onclick=\"JResMobileTopNav({btnId:'#" + btnId + "',contentId:'#" + btnId + "_pannelContent',position:'" + addflipDirection + "',resetEvt:false,animateTime:" + pannelAnimateTime + ",animateEasing:'"+pannelAnimateEasing+"'});return false;\"";
                    //trim whitespace from pannel content, then check if it is empty return value false to showBtn
                    if ($.trim(addPanelContent) == "") {
                        showBtn = false;
                    }
                    break;

                  case "tab":
                    //移動至頁面區塊按鈕
                    BottombtnTarget = " class='resTabJumper' ";
                    //檢查tab目標連結是否含有路徑
                    var targetURL = btnLink;
                    if (targetURL.split("#")[0] == undefined || targetURL.split("#")[0] == "") {
                        //若無路徑檢查tab目標物件是否存在
                        if ($(targetURL).length == 0){
                            showBtn = false;
                        }
                    }
                    break;

                    case "page":
                        //開啟響應式頁面
                        btnTarget = " class='resPageBtn' toggle='"+btnLink+"' ";
                    break;

                    case "loader":
                        //開啟響應式載入頁面
                        btnTarget = " class='resPageLoaderBtn' ";
                        var addLoaderSetup = additionalBtnArray[i][4] != undefined ? additionalBtnArray[i][4] : "";
                        //將其餘參數寫入
                        if (addLoaderSetup != "") {
                            for (var data in addLoaderSetup) {
                                btnTarget += data + "='" + addLoaderSetup[data] + "' ";
                            }
                        }

                    break;

                  case undefined:
                    BottombtnTarget = "";
                    break;

                  default:
                    BottombtnTarget = " target='" + additionalBottomBtnArray[i][3] + "'";
                    break;
                }
                //showBtn value with false than don't show the button
                if (showBtn) {
                    additionalBottomBtn += '<li id="' + btnId + '" style="width:' + resBottomMobileNavSetupWidth + "px;height:" + resBottomMobileNavSetupHeight + "px;margin-right:" + resBottomMobileNavSetupMargin + 'px"><a href="' + btnLink + '" ' + BottombtnTarget + 'style="width:' + resBottomMobileNavSetupWidth + "px;height:" + resBottomMobileNavSetupHeight + 'px;">' + btnText + "</a></li>";
                }
                mobile_nav_BottomBtnAmt++;
            }
        }
        //本地使用
        var noServer = true;
        if (window.location.protocol.match(/(http|https)/)) {
            var noServer = false;
        }
        //響應式開關
        var mobileSwitch = options.mobileSwitch;
        //響應式viewport其餘參數 (如果設為custom為自行寫入頁面)
        var viewPortSetup = options.viewPortSetup;
        //語言選單
        //res_langVarDefault: 網站預設語系 tw:繁體 cn:簡體 預設:英文
        //res_langVarTw: 繁中版判斷值
        //res_langVarCn: 簡中版判斷值
        //res_langVarAdd1: 外加語言1判斷值
        //res_langVarAdd2: 外加語言2判斷值
        //res_langVarAdd3: 外加語言3判斷值
        //res_langVarAdd4: 外加語言4判斷值
        //res_langVarAdd5: 外加語言5判斷值
        //res_langArrayTw: 繁中翻譯字串
        //res_langArrayCn: 簡中翻譯字串
        //res_langArrayAdd1: 外加語言1翻譯字串
        //res_langArrayAdd2: 外加語言2翻譯字串
        //res_langArrayAdd3: 外加語言3翻譯字串
        //res_langArrayAdd4: 外加語言4翻譯字串
        //res_langArrayAdd5: 外加語言5翻譯字串
        //defaultLangMenuObj: 原網頁內容的語言選單id或class
        //customLangMenu: 客製化的語言選單內容
        var res_langSwitch = options.res_langSwitch ? "" : "style='display:none'";
        //語言選單開關
        var res_langVarDefault = options.res_langVarDefault.toLowerCase();
        var res_langVarEn = options.res_langVarEn;
        //繁中版
        var res_langVarTw = options.res_langVarTw.toLowerCase();
        var res_langArrayTw = [ "language:語系", "menu:主選單", "mobile:切換手機版", "desktop:切換電腦版" ];
        var res_langArrayTw_extend = options.res_langArrayTw;
        if (res_langArrayTw_extend.length > 0) {
            for (var i = 0; i < res_langArrayTw_extend.length; i++) {
                res_langArrayTw.push(res_langArrayTw_extend[i]);
            }
        }
        //簡中版
        var res_langVarCn = options.res_langVarCn.toLowerCase();
        var res_langArrayCn = [ "language:语系", "menu:主选单", "mobile:切换手机版", "desktop:切换桌面版" ];
        var res_langArrayCn_extend = options.res_langArrayCn;
        if (res_langArrayCn_extend.length > 0) {
            for (var i = 0; i < res_langArrayCn_extend.length; i++) {
                res_langArrayCn.push(res_langArrayCn_extend[i]);
            }
        }
        //外加語言1
        var res_langVarAdd1 = options.res_langVarAdd1.toLowerCase();
        var res_langArrayAdd1 = [ "language:language", "menu:menu", "mobile:mobile", "desktop:desktop" ];
        var res_langArrayAdd1_extend = options.res_langArrayAdd1;
        if (res_langArrayAdd1_extend.length > 0) {
            for (var i = 0; i < res_langArrayAdd1_extend.length; i++) {
                res_langArrayAdd1.push(res_langArrayAdd1_extend[i]);
            }
        }
        //外加語言2
        var res_langVarAdd2 = options.res_langVarAdd2.toLowerCase();
        var res_langArrayAdd2 = [ "language:language", "menu:menu", "mobile:mobile", "desktop:desktop" ];
        var res_langArrayAdd2_extend = options.res_langArrayAdd2;
        if (res_langArrayAdd2_extend.length > 0) {
            for (var i = 0; i < res_langArrayAdd2_extend.length; i++) {
                res_langArrayAdd2.push(res_langArrayAdd2_extend[i]);
            }
        }
        //外加語言3
        var res_langVarAdd3 = options.res_langVarAdd3.toLowerCase();
        var res_langArrayAdd3 = [ "language:language", "menu:menu", "mobile:mobile", "desktop:desktop" ];
        var res_langArrayAdd3_extend = options.res_langArrayAdd3;
        if (res_langArrayAdd3_extend.length > 0) {
            for (var i = 0; i < res_langArrayAdd3_extend.length; i++) {
                res_langArrayAdd3.push(res_langArrayAdd3_extend[i]);
            }
        }
        //外加語言4
        var res_langVarAdd4 = options.res_langVarAdd4.toLowerCase();
        var res_langArrayAdd4 = [ "language:language", "menu:menu", "mobile:mobile", "desktop:desktop" ];
        var res_langArrayAdd4_extend = options.res_langArrayAdd4;
        if (res_langArrayAdd4_extend.length > 0) {
            for (var i = 0; i < res_langArrayAdd4_extend.length; i++) {
                res_langArrayAdd4.push(res_langArrayAdd4_extend[i]);
            }
        }
        //外加語言5
        var res_langVarAdd5 = options.res_langVarAdd5.toLowerCase();
        var res_langArrayAdd5 = [ "language:language", "menu:menu", "mobile:mobile", "desktop:desktop" ];
        var res_langArrayAdd5_extend = options.res_langArrayAdd5;
        if (res_langArrayAdd5_extend.length > 0) {
            for (var i = 0; i < res_langArrayAdd5_extend.length; i++) {
                res_langArrayAdd5.push(res_langArrayAdd5_extend[i]);
            }
        }
        var defaultLangMenuObj = options.defaultLangMenuObj;
        var customLangMenu = options.customLangMenu;
        //主選單
        //defaultMenuObj: 原網頁內容的主選單id或class
        //customMenu: 客製化的主選單內容
        var defaultMenuObj = options.defaultMenuObj;
        var customMenu = options.customMenu;
        //其他選單或內容
        //defaultSubMenuObj: 原網頁內容的id或class
        //customSubMenu: 客製化的內容
        var defaultSubMenuObj = options.defaultSubMenuObj;
        //語言選單
        var customSubMenu = options.customSubMenu;
        //是否要使用頁面載入按鈕
        var resPageLoader = options.resPageLoader;
        var resPageLoaderTigger = options.resPageLoaderTigger;
        //設定標籤定位移動參數
        var resTabSetup = options.res_tabJumperSetting;
        var restabJumperState = true;
        var restabJumperSpeed = 2e3;
        for (var data in resTabSetup) {
            switch (data) {
              case "state":
                restabJumperState = resTabSetup[data];
                break;

              case "speed":
                restabJumperSpeed = resTabSetup[data];
                break;
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////
        //-- 設定拉開內容判斷式 -- //////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////
        //language menu
        var language = $(defaultLangMenuObj).length > 0 ? $(defaultLangMenuObj).prop("tagName") != "UL" ? $(defaultLangMenuObj).html() : "<ul>" + $(defaultLangMenuObj).html() + "</ul>" : customLangMenu;
        //primary menu
        var primaryMenu = $(defaultMenuObj).length > 0 ? $(defaultMenuObj).prop("tagName") != "UL" ? $(defaultMenuObj).html() : "<ul>" + $(defaultMenuObj).html() + "</ul>" : customMenu;
        //submenu
        var subMenu = "";
        var countDefaultSubMenuObj = defaultSubMenuObj.length;
        if (countDefaultSubMenuObj > 0) {
            for (var i = 0; i < countDefaultSubMenuObj; i++) {
                if ($(defaultSubMenuObj[i]).length > 0) {
                    if ($(defaultSubMenuObj[i][1]).length > 0) {
                        subMenu += '<div class="resContent_' + i + '">';
                        subMenu += defaultSubMenuObj[i][0] != "" ? "<h1>" + fnTranslate(defaultSubMenuObj[i][0]) + "</h1>" : "";
                        subMenu += '<div class="resContent">';
                        subMenu += $(defaultSubMenuObj[i][1]).prop("tagName") != "UL" ? $(defaultSubMenuObj[i][1]).html() : "<ul>" + $(defaultSubMenuObj[i][1]).html() + "</ul>";
                        subMenu += "</div></div>";
                    }
                }
            }
        }
        subMenu += customSubMenu;
        //--if response is on -->
        //response cookie
        //if cookie is not set yet, set default response on
        if ($.JRes_getCookie() == "") {
            document.cookie = $.JRes_modulePath() + "_response=" + defaultResponse;
        }
        //加入行動版ICON
        $("head").prepend('<link href="' + modulePath + 'img/response/app_ico.png" rel="apple-touch-icon">');
        //加入響應式預設樣式
        //fnLoadCSS('response_default',modulePath + '_css/default.css','all');
        //$("head").append('<link id="response_default" rel="stylesheet" type="text/css" media="all" href="' + modulePath + '_css/default.css"/>');
        //將每組row之後都加上clear
        $(".resRow").append("<div class='clear'></div>");
        
        //若不是IE9以下才進行響應式設定
        if (!$.JRes_isLtIE9()){
            //check the response cookie
            if ($.JRes_getCookie() == "true" || $.JRes_getCookie() == null || $.JRes_getCookie() == "") {
                //-- add response meta --
                if (viewPortSetup != 'custom') $("head").prepend('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=0' + viewPortSetup + '">');
                var swapBtn = noServer == false ? '<div id="resSwap" ' + responsiveSwitch + "><span>" + fnTranslate("mobile") + '</span> <span class="split">|</span> <a id="swap_btn">' + fnTranslate("desktop") + "</a><div class='clear'></div></div>" : "";

                //-- loader --
                if (resPageLoader) {
                    //如果resPageLoaderTigger設定always，則總是使用
                    if (resPageLoaderTigger == "always") {
                        $(document).ready(function() {
                            $("body").append('<div id="resLoader"></div>');
                        });
                        $(window).on("load", function(){
                            setTimeout("JResLoader({dom:'#resLoader'})", 800);
                        })
                    } else {
                        //如果resPageLoaderTigger設定在某一尺寸下才使用
                        if ($(window).width() <= resPageLoaderTigger) {
                            $(document).ready(function() {
                                $("body").append('<div id="resLoader"></div>');
                            });
                            $(window).on("load", function(){
                                setTimeout("JResLoader({dom:'#resLoader'})", 800);
                            })
                        }
                    }
                }

                //-- 計算resMainWrap css設定
                var resMainWrap_miniHight = $(window).height(); //min-height
                var body_margin_top = ''; //padding-top
                var body_margin_bottom = ''; //padding-bottom

                //-- 計算導覽按鈕群長度 (上方) --
                var mobile_nav_btn_width = mobile_nav_BtnAmt * (resMobileNavSetupWidth + resMobileNavSetupMargin);
                var mobile_nav = resMenuState == true ? ' style="position:'+resMenuType+';width:' + $(window).width() + "px;height:" + resMobileNavSetupHeight + 'px;" ' : ' resState="notUsed" style="display:none" ';
                var mobile_nav_width = $(window).width() > mobile_nav_btn_width ? ' style="width:' + $(window).width() + 'px;" ' : ' style="width:' + mobile_nav_btn_width + 'px;" ';
                if (resMenuState == true) {
                    body_margin_top = 'padding-top:' + resMobileNavSetupHeight + 'px;'; //上選單有使用進行resMainWrap padding-top設定
                    resMainWrap_miniHight -= resMobileNavSetupHeight; //如果有padding則需要把resMainWrap min-height相對減去
                }

                //-- 計算導覽按鈕群長度 (下方) --
                var mobile_nav_btn_width_bottom = mobile_nav_BottomBtnAmt * (resBottomMobileNavSetupWidth + resBottomMobileNavSetupMargin);
                var mobile_nav_bottom = resBottomMenuState == true ? ' style="position:'+resBottomMenuType+';width:' + $(window).width() + "px;height:" + resBottomMobileNavSetupHeight + 'px;" ' : ' resState="notUsed" style="display:none" ';
                var mobile_nav_width_bottom = $(window).width() > mobile_nav_btn_width_bottom ? ' style="width:' + $(window).width() + 'px;" ' : ' style="width:' + mobile_nav_btn_width_bottom + 'px;" ';
                var body_margin_bottom = (resBottomMenuState == true) ? 'padding-bottom:' + resBottomMobileNavSetupHeight + 'px;' : ''; //下選單有使用進行padding-bottom
                if (resBottomMenuState == true) {
                    body_margin_bottom = 'padding-bottom:' + resBottomMobileNavSetupHeight + 'px;'; //下選單有使用進行resMainWrap padding-bottom設定
                    resMainWrap_miniHight -= resBottomMobileNavSetupHeight; //如果有padding則需要把resMainWrap min-height相對減去
                }

                //螢幕在800以下進行選單物件狀態偵測
                var body_margin = $(window).width() <= setUILoadWidth ? ' style="' + body_margin_top + body_margin_bottom + '" ' : '';

                //-- mobile menu interface --
                $("body").wrapInner('<div id="resMainWrap" '+body_margin+'></div>');
                $("body").append('<div id="mobile_nav" ' + mobile_nav + "><ul " + mobile_nav_width + ">" + additionalBtn + "</ul></div>" + '<div id="mobile_nav_bottom" ' + mobile_nav_bottom + "><ul " + mobile_nav_width_bottom + ">" + additionalBottomBtn + "</ul></div>"  + '<div id="mobile_nav_content" class="flipContent ' + pannelStyle + ' ' + pannelPosition + '"><div class="menuList" style="' + resMarginTop + resMarginBottom + '">' + swapBtn + '<div id="reslang" ' + res_langSwitch + ">" + "<h1>" + fnTranslate("language") + "</h1>" + language + "<div class='clear'></div></div>" + '<div id="resPrimery">' + "<h1>" + fnTranslate("menu") + "</h1>" + primaryMenu + "<div class='clear'></div></div>" + subMenu + "<div class='clear'></div></div></div>" + additionalPannelContent + additionalBottomPannelContent + additionalPageContent);
                //上下區主選單控制
                $("#menu_btn,#menu_btn_bottom").click(function() {
                    JResMobileTopNav({
                        btnId: "#menu_btn,#menu_btn_bottom",
                        contentId: "#mobile_nav_content",
                        position: flipDirection,
                        resetEvt: false,
                        animateTime: pannelAnimateTime,
                        animateEasing: pannelAnimateEasing
                    });
                    return false;
                });
                //-- content close mask --
                $("body").append('<div id="resContentMask"></div>');
                //-- give content container a height
                $("#resMainWrap").css("min-height", resMainWrap_miniHight + "px");

                //使用伸縮選單的物件ID
                if (menuCollapse != ""){
                    $(menuCollapse).JResMenu();
                }

            } else {
                //切換為桌面版
                $(mobileSwitch).append('<div id="resSwapDesk" class="swap_btn_desktop_wrap" ' + responsiveSwitch + '><div class="swap_btn_desktop"><span>' + fnTranslate("desktop") + '</span> | <a id="swap_btn" href="#">' + fnTranslate("mobile") + "</a></div></div>");
            }
        }
        //--add print media style sheet --
        //fnLoadCSS('resprint',modulePath + '_css/print.css',printMediaSetupMode);
        //$("head").append('<link id="resprint" rel="stylesheet" type="text/css" media="'+printMediaSetupMode+'" href="' + modulePath + '_css/print.css"/>');
        //加入響應式按鈕
        //$(".resBtn").each(function() {
            $('body').on('click','.resBtn',function(){
            //$(this).click(function() {
                var toggle = $(this).attr("toggle");
                var addBtn = options.additionalBtn;
                var countAddBtn = addBtn.length;
                for (var i = 0; i < countAddBtn; i++) {
                    if (toggle == addBtn[i][0]) {
                        var pos = addBtn[i][4][0];
                    }
                }

                JResMobileTopNav({
                    btnId: "#" + toggle,
                    contentId: "#" + toggle + "_pannelContent",
                    position: pos,
                    resetEvt: false,
                    animateTime: pannelAnimateTime,
                    animateEasing: pannelAnimateEasing
                });

                return false;
            });
        //});
        //加入響應式頁面按鈕
        //$(".resPageBtn").each(function() {
            //$(this).click(function() {
            $('body').on('click','.resPageBtn',function(){
                var toggle = $(this).attr("toggle");
                JResPageControl({
                    id: "#" + toggle + "_pageContent",
                    animateTime: pannelAnimateTime,
                    animateEasing: pannelAnimateEasing
                });
                return false;
            });
        //});
        //加入響應式Ajax載入頁面按鈕
        $("#resPageLoad_loading_icon").hide();
        $("#resPageLoader").ajaxStart(function() {
            $("#resPageLoad_loading_icon").show();
        }).ajaxComplete(function() {
            setTimeout("JResLoader({dom:'#resPageLoad_loading_icon'})", 800);
        });
        //resPageLoaderBtn
        //$(".resPageLoaderBtn").each(function() {
            //$(this).click(function() {
            $('body').on('click','.resPageLoaderBtn',function(){
                //判斷loader類型
                //查看是否總是使用響應視窗
                if ($(this).attr("tigger") == "" || $(this).attr("tigger") == undefined) {
                    //預設值在800以內寬度再使用響應視窗
                    if ($(window).width() <= setUILoadWidth) {
                        JResPageControl({
                            id: "#resPageLoader",
                            animateTime: pannelAnimateTime,
                            animateEasing: pannelAnimateEasing
                        });
                        var pageTitle = $(this).attr("title") == "" || $(this).attr("title") == undefined ? "" : $(this).attr("title");
                        var toggleParam = ($(this).attr("toggleParam") == undefined || $(this).attr("toggleParam") == "") ? "" : $(this).attr("toggleParam");
                        $("#resPageLoader .resAddPageTitle").text(pageTitle);
                        if ($(this).attr("toggle") == "" || $(this).attr("toggle") == undefined || $(this).attr("toggle") == "iframe") {
                            //iframe loader
                            $("#resPageLoad_loading_icon").show();
                            // show Loading Div
                            setTimeout("JResLoader({dom:'#resPageLoad_loading_icon'})", 800);
                            var url = $(this).attr("href");
                            var height = $(window).height() - 120;
                            $("#resPageLoad_area").html('<iframe id="resIframeLoader" style="display:block;width:100%;height:' + height + 'px;border:0;" src="' + url + '" '+toggleParam+'>');
                        } else {
                            //ajax loader
                            if ($(this).attr("toggle") == "ajax") {
                                var url = $(this).attr("href");
                            } else {
                                if ($(this).attr("toggleDom") == "" || $(this).attr("toggleDom") == undefined) {
                                    var url = $(this).attr("href");
                                } else {
                                    var url = $(this).attr("href") + " " + $(this).attr("toggleDom");
                                }
                            }
                            $("#resPageLoad_area").load(url);
                        }
                        return false;
                    } else {
                        return true;
                    }
                } else if ($(this).attr("tigger") == "always") {
                    JResPageControl({
                        id: "#resPageLoader",
                        animateTime: pannelAnimateTime,
                        animateEasing: pannelAnimateEasing
                    });
                    var pageTitle = $(this).attr("title") == "" || $(this).attr("title") == undefined ? "" : $(this).attr("title");
                    var toggleParam = ($(this).attr("toggleParam") == undefined || $(this).attr("toggleParam") == "") ? "" : $(this).attr("toggleParam");
                    $("#resPageLoader .resAddPageTitle").text(pageTitle);
                    if ($(this).attr("toggle") == "" || $(this).attr("toggle") == undefined || $(this).attr("toggle") == "iframe") {
                        //iframe loader
                        $("#resPageLoad_loading_icon").show();
                        // show Loading Div
                        setTimeout("JResLoader({dom:'#resPageLoad_loading_icon'})", 800);
                        var url = $(this).attr("href");
                        var height = $(window).height() - 120;
                        $("#resPageLoad_area").html('<iframe id="resIframeLoader" style="display:block;width:100%;height:' + height + 'px;border:0;" src="' + url + '" '+toggleParam+'>');
                    } else {
                        //ajax loader
                        if ($(this).attr("toggle") == "ajax") {
                            var url = $(this).attr("href");
                        } else {
                            if ($(this).attr("toggleDom") == "" || $(this).attr("toggleDom") == undefined) {
                                var url = $(this).attr("href");
                            } else {
                                var url = $(this).attr("href") + " " + $(this).attr("toggleDom");
                            }
                        }
                        $("#resPageLoad_area").load(url);
                    }
                    return false;
                }
            });
        //});
        //若url有#則使用定位移動函式 (restabJumperState:true使用/false停用, restabJumperSpeed:移動速度)
        $(function(){
            if (restabJumperState && window.location.hash) {
                var targetPosID = $(window.location.hash);
                var speed = restabJumperSpeed;
                var paddingAmt = 0;
                //檢查此頁面是否有此區塊物件ID
                if ($(targetPosID).length > 0) {
                    if (resMenuState === true && resMenuType === "fixed" && $(window).width() <= setUILoadWidth) {
                        paddingAmt = resMobileNavSetupHeight;
                    }
                    fnTabJumper(targetPosID, speed, paddingAmt);
                }
            }
        })
        //resTabJumper
        if (restabJumperState) {
            //$(".resTabJumper").each(function() {
            $('body').on('click','.resTabJumper',function(){
                //$(this).click(function() {
                    var targetURL = $(this).attr("href");
                    if (targetURL.split("#")[0] == undefined || targetURL.split("#")[0] == "") {
                        var targetPosID = "#" + targetURL.split("#")[1];
                        var speed = restabJumperSpeed;
                        var paddingAmt = 0;
                        //檢查此頁面是否有此區塊物件ID
                        if ($(targetPosID).length > 0) {
                            if (resMenuState === true && resMenuType === "fixed" && $(window).width() <= setUILoadWidth) {
                                paddingAmt = resMobileNavSetupHeight;
                            }
                            fnTabJumper(targetPosID, speed, paddingAmt);
                        }
                        return false;
                    } else {
                        return true;
                    }
                //});
            });

            //在相對高度的jumper按鈕加入jumperActive class
            var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "scroll"; //FF doesn't recognize mousewheel as of FF3.x
            $(window).on(mousewheelevt, function(e){
                var winScroll = $(this).scrollTop();
                //將頁面中聯結有含此ID的連結加入active
                $(".resTabJumper").each(function(){
                    var targetURL = $(this).attr("href");
                    if (targetURL.split("#")[0] == undefined || targetURL.split("#")[0] == "") {
                        var targetPosID = "#" + targetURL.split("#")[1];
                        var tragglePos = $(targetPosID).position().top;
                        var tragglePosMax = tragglePos+$(targetPosID).height();
                        if(winScroll >= tragglePos && winScroll < tragglePosMax){
                            $(this).addClass("jumperActive");
                        }else{
                            $(this).removeClass("jumperActive");
                        }
                    }
                });
            })
        }

        //reset cookie
        $("#swap_btn").click(function() {
            fnSwap(document.cookie);
            window.location.reload();
            return false;
        });
        //close all pannel if click resContentMask area
        $("#resContentMask").click(function() {
            JResMobileTopNav({
                resetEvt: true,
                animateTime: pannelAnimateTime,
                animateEasing: pannelAnimateEasing
            });
        });

        //swap version
        function fnTabJumper(targetPosID, speed, paddingAmt) {
            var paddingAmt = paddingAmt; //多10px
            $("html, body").animate({
                scrollTop: $(targetPosID).offset().top - paddingAmt
            }, speed);
        }
        //check pannel direction (針對響應式頁面及響應式按鈕)
        function fnCheckPosition(chkPos, returnVar) {
            //alert(chkPos);
            switch (chkPos) {
              case "right":
                position = "flipContentR";
                direction = "right";
                break;

              case "top":
                position = "flipContentT";
                direction = "top";
                break;

              case "top_small":
                position = "flipContentTS";
                direction = "top_small";
                break;

              case "left_under":
                position = "flipContentLU";
                direction = "left_under";
                break;

              case "right_under":
                position = "flipContentRU";
                direction = "right_under";
                break;

              case "right_page":
                position = "resFlipPageR";
                direction = "right";
                break;

              case "left_page":
                position = "resFlipPageL";
                direction = "left";
                break;

              case "top_page":
                position = "resFlipPageT";
                direction = "top";
                break;

              default:
                position = "flipContentL";
                direction = "left";
                break;
            }
            switch (returnVar) {
              case "position":
                return position;
                break;

              default:
                return direction;
                break;
            }
        }
        //swap version
        function fnSwap(responseCookie) {
            var getHost = $.JRes_modulePath();
            if ($.JRes_getCookie() == "true" || $.JRes_getCookie() == null || $.JRes_getCookie() == "") {
                document.cookie = getHost + "_response=false";
            } else {
                document.cookie = getHost + "_response=true";
            }
        }
        //translate language
        function fnTranslate(str) {
            var transStr = "";
            var checkString = window.location.href.toLowerCase();
            if (res_langVarTw != "" && checkString.indexOf(res_langVarTw) != -1) {
                transStr = fnReturnTranslate(res_langArrayTw, str);
            } else if (res_langVarCn != "" && checkString.indexOf(res_langVarCn) != -1) {
                transStr = fnReturnTranslate(res_langArrayCn, str);
            } else if (res_langVarAdd1 != "" && checkString.indexOf(res_langVarAdd1) != -1) {
                transStr = fnReturnTranslate(res_langArrayAdd1, str);
            } else if (res_langVarAdd2 != "" && checkString.indexOf(res_langVarAdd2) != -1) {
                transStr = fnReturnTranslate(res_langArrayAdd2, str);
            } else if (res_langVarAdd3 != "" && checkString.indexOf(res_langVarAdd3) != -1) {
                transStr = fnReturnTranslate(res_langArrayAdd3, str);
            } else if (res_langVarAdd4 != "" && checkString.indexOf(res_langVarAdd4) != -1) {
                transStr = fnReturnTranslate(res_langArrayAdd4, str);
            } else if (res_langVarAdd5 != "" && checkString.indexOf(res_langVarAdd5) != -1) {
                transStr = fnReturnTranslate(res_langArrayAdd5, str);
            } else if (res_langVarEn != "" && checkString.indexOf(res_langVarEn) != -1) {
                transStr = str;
            } else {
                //網站預設語系
                switch (res_langVarDefault) {
                  //繁中
                    case "tw":
                    transStr = fnReturnTranslate(res_langArrayTw, str);
                    break;

                  //簡中
                    case "cn":
                    transStr = fnReturnTranslate(res_langArrayCn, str);
                    break;

                  //外加語系1
                    case "add1":
                    transStr = fnReturnTranslate(res_langArrayAdd1, str);
                    break;

                  //外加語系2
                    case "add2":
                    transStr = fnReturnTranslate(res_langArrayAdd2, str);
                    break;

                  //外加語系3
                    case "add3":
                    transStr = fnReturnTranslate(res_langArrayAdd3, str);
                    break;

                  //外加語系4
                    case "add4":
                    transStr = fnReturnTranslate(res_langArrayAdd4, str);
                    break;

                  //外加語系5
                    case "add5":
                    transStr = fnReturnTranslate(res_langArrayAdd5, str);
                    break;

                  //預設值
                    default:
                    transStr = str;
                    break;
                }
            }
            return transStr;
        }
        function fnReturnTranslate(transArray, str) {
            var transStr;
            for (var i = 0; i < transArray.length; i++) {
                if (transArray[i].split(":")[0] == str.toLowerCase()) {
                    transStr = transArray[i].split(":")[1];
                }
            }
            return transStr;
        }
    };
    
    //取JRes Cookie參數值
    $.JRes_getCookie = function(options) {
        var defaults = {
            search_key: $.JRes_modulePath() + "_response="
        };
        options = $.extend(defaults, options);
        var name = options.search_key;
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = $.trim(ca[i]);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    };

    //取得模組跟目錄參數路徑
    $.JRes_modulePath = function() {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src.indexOf("response.js") != -1) {
                return scripts[i].src.replace("js/response.js", "");
            } else if (scripts[i].src.indexOf("response.min.js") != -1) {
                return scripts[i].src.replace("js/response.min.js", "");
            } else if (scripts[i].src.indexOf("response.beautified.js") != -1) {
                return scripts[i].src.replace("js/response.beautified.js", "");
            }
        }
    };

    //取得是否為手持設備 (true: 手持設備 false: 非手持設備)
    $.JRes_isMobile = function(){
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile|Android)/)) {
            return true;
        }else{
            return false;
        }
    }

    //檢查是否為IE9以下版本 (true: IE9以下 false: 非IE9以下)
    $.JRes_isLtIE9 = function(){
        if (navigator.userAgent.match(/(MSIE 8|MSIE 7|MSIE 6)/)) {
            return true;
        }else{
            return false;
        }
    }   

    //取得是否有flash支援 (true: 有支援 false: 非支援)
    $.JRes_isFlash = function(){
        var hasFlash = false;
        try {
          var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
          if (fo) {
            hasFlash = true;
          }
        } catch (e) {
          if (navigator.mimeTypes
                && navigator.mimeTypes['application/x-shockwave-flash'] != undefined
                && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
            hasFlash = true;
          }
        }
        return hasFlash;
    }

    //自動重整 auto refresh mode
    var resRefreshMode = true;
    $.JRes_autoRefresh = function(options){
        var defaults = {
            state: true,
            ignore: ''
        };
        options = $.extend(defaults, options);
        resRefreshMode = options.state;
        if (options.ignore != ""){
            if(options.ignore.indexOf(",") != -1){
                var ignorePage = options.ignore.split(",");
                for (var i=0; i< ignorePage.length; i++){
                    if (window.location.href.indexOf(ignorePage[i]) != -1){
                        resRefreshMode = false;
                    }
                }
            }else{
                if (window.location.href.indexOf(options.ignore) != -1){
                    resRefreshMode = false;//console.log(resRefreshMode);
                }
            }
        }

        return resRefreshMode;
    }

    //mobile enlarge control
    //mobile additional page control
    JResPageControl = function(options) {
        var defaults = {
            id: "",
            action: "open",
            animateTime: 300,
            animateEasing: 'swing'
        };
        options = $.extend(defaults, options);
        var id = options.id;
        var action = options.action;
        var animateTime = options.animateTime;
        var animateEasing = options.animateEasing;
        switch (action) {
          //關閉頁面
            case "back":
                if(!$("#resMainWrap").hasClass('resPannelOpen')){
                    $("html").removeClass("resHtmlOverflow");
                }

                if ($(id).hasClass("resFlipPageR")) {
                    $(id).animate({
                        right: "-120%"
                    }, animateTime,animateEasing);
                } else if ($(id).hasClass("resFlipPageT")) {
                    $(id).animate({
                        top: "-120%"
                    }, animateTime,animateEasing);
                } else {
                    $(id).animate({
                        left: "-120%"
                    }, animateTime,animateEasing);
                }
                //關閉時清除url_loader內容
                $("#resPageLoad_area").html("");
                $(this).animate({"z-index":-1},animateTime,animateEasing);
            break;

            //關閉全部頁面
            case "closeAll":
                if(!$("#resMainWrap").hasClass('resPannelOpen')){
                    $("html").removeClass("resHtmlOverflow");
                }

                $(".resFlipPage").each(function(){
                    if ($(this).hasClass("resFlipPageR") && ($(this).css("right") == "0px" || $(this).css("right") == "0%")){
                        $(this).animate({
                            right: "-120%"
                        },animateTime,animateEasing);
                    }else if ($(this).hasClass("resFlipPageT") && ($(this).css("top") == "0px" || $(this).css("top") == "0%")){
                        $(this).animate({
                            right: "-120%"
                        },animateTime,animateEasing);
                    }else{
                        $(this).animate({
                            right: "-120%"
                        },animateTime,animateEasing);
                    }
                })
                //關閉時清除url_loader內容
                $("#resPageLoad_area").html("");
                $(this).animate({"z-index":-1},animateTime,animateEasing);
            break;

          //打開頁面
            case "open":
            default:
                if(!$("#resMainWrap").hasClass('resPannelOpen')){
                    $("html").addClass("resHtmlOverflow");
                }
                
                if ($(id).hasClass("resFlipPageR")) {
                    $(id).animate({
                        right: "0px"
                    },animateTime,animateEasing);
                } else if ($(id).hasClass("resFlipPageT")) {
                    $(id).animate({
                        top: "0px"
                    },animateTime,animateEasing);
                } else {
                    $(id).animate({
                        left: "0px"
                    },animateTime,animateEasing);
                }
                $(id).css({"z-index":1001});
            break;
        }
    };
    //mobile navigation bar
    JResMobileTopNav = function(options) {
        var defaults = {
            btnId: "",
            contentId: "",
            position: "",
            resetEvt: true,
            animateTime: 500,
            animateEasing: "swing"
        };
        options = $.extend(defaults, options);
        var btnId = options.btnId;
        var contentId = options.contentId;
        var position = options.position;
        var resetEvt = options.resetEvt;
        var ignoreUEvent = options.ignoreUEvent;
        var animateTime = options.animateTime;
        var animateEasing = options.animateEasing;
        //開啟前先檢查其他pannel如果已經開啟則關閉
        $(".flipContentL").each(function() {
            if ($(this).css("left") == "0px" || $(this).css("left") == "0%") {
                $(this).animate({
                    left: "-90%"
                }, animateTime,animateEasing);
                $("#mobile_nav ul li a div").remove();
                $("#mobile_nav_bottom ul li a div").remove();
                $.JResContentScroll({
                    action: true
                });
            }
        });
        $(".flipContentR").each(function() {
            if ($(this).css("right") == "0px" || $(this).css("left") == "0%") {
                $(this).animate({
                    right: "-90%"
                }, animateTime,animateEasing);
                $("#mobile_nav ul li a div").remove();
                $("#mobile_nav_bottom ul li a div").remove();
                $.JResContentScroll({
                    action: true
                });
            }
        });
        $(".flipContentT").each(function() {
            if ($(this).css("top") == "0px" || $(this).css("left") == "0%") {
                $(this).animate({
                    top: "-90%"
                }, animateTime,animateEasing);
                $("#mobile_nav ul li a div").remove();
                $("#mobile_nav_bottom ul li a div").remove();
                $.JResContentScroll({
                    action: true
                });
            }
        });
        $(".flipContentTS").each(function() {
            if ($(this).css("top") == "0px" || $(this).css("left") == "0%") {
                $(this).animate({
                    top: "-110px"
                }, animateTime,animateEasing);
                $("#mobile_nav ul li a div").remove();
                $("#mobile_nav_bottom ul li a div").remove();
                $.JResContentScroll({
                    action: true
                });
            }
        });

        $(".flipContentLU").each(function() {
            if ($(this).css("left") == "0px" || $(this).css("left") == "0%") {
                $("#resContentMask").removeAttr("style").css("left", "0");
                $(this).animate({
                    left: "-90%"
                }, animateTime,animateEasing);
                $("#resMainWrap").animate({
                    left: "0"
                }, animateTime,animateEasing, function() {
                    //$(this).removeAttr("style");
                    $(this).css("left","");
                });
                $("#mobile_nav ul li a div").remove();
                $("#mobile_nav_bottom ul li a div").remove();
                $.JResContentScroll({
                    action: true
                });
            }
        });
        $(".flipContentRU").each(function() {
            if ($(this).css("right") == "0px" || $(this).css("left") == "0%") {
                $("#resContentMask").removeAttr("style").css("right", "0");
                $(this).animate({
                    right: "-90%"
                }, animateTime,animateEasing);
                $("#resMainWrap").animate({
                    right: "0"
                }, animateTime,animateEasing, function() {
                    //$(this).removeAttr("style");
                    $(this).css("right","");
                });
                $("#mobile_nav ul li a div").remove();
                $("#mobile_nav_bottom ul li a div").remove();
                $.JResContentScroll({
                    action: true
                });
            }
        });

        if (resetEvt == false) {
            $("#resMainWrap").addClass('resPannelOpen');
            //開啟視窗
            switch (position) {
              case "right":
                if ($(contentId).css("right") == "0px" || $(contentId).css("right") == "0%") {
                    $(contentId).animate({
                        right: "-90%"
                    }, animateTime,animateEasing);
                    $.JResContentScroll({
                        action: true
                    });
                    $("a div", btnId).remove();
                } else {
                    $(contentId).animate({
                        right: "0px"
                    }, animateTime,animateEasing);
                    $.JResContentScroll({
                        action: false
                    });
                    $("a", btnId).append("<div class='closeRight_btn'></div>");
                }
                break;

              case "top":
                if ($(contentId).css("top") == "0px" || $(contentId).css("top") == "0%") {
                    $(contentId).animate({
                        top: "-90%"
                    }, animateTime,animateEasing);
                    $.JResContentScroll({
                        action: true
                    });
                    $("a div", btnId).remove();
                } else {
                    $(contentId).animate({
                        top: "0px"
                    }, animateTime,animateEasing);
                    $.JResContentScroll({
                        action: false
                    });
                    $("a", btnId).append("<div class='closeTop_btn'></div>");
                }
                break;

              case "top_small":
                if ($(contentId).css("top") == "0px" || $(contentId).css("top") == "0%") {
                    $(contentId).animate({
                        top: "-100px"
                    }, animateTime,animateEasing);
                    $.JResContentScroll({
                        action: true
                    });
                    $("a div", btnId).remove();
                } else {
                    $(contentId).animate({
                        top: "0px"
                    }, animateTime,animateEasing);
                    $.JResContentScroll({
                        action: false
                    });
                    $("a", btnId).append("<div class='closeTop_btn'></div>");
                }
                break;

              case "left_under":
                if ($(contentId).css("left") == "0px" || $(contentId).css("left") == "0%") {
                    $("#resContentMask").removeAttr("style").css("left", "0");
                    $(contentId).animate({
                        left: "-90%"
                    }, animateTime,animateEasing);
                    $("#resMainWrap").animate({
                        left: "0"
                    }, animateTime,animateEasing, function() {
                        //$(this).removeAttr("style");
                        $(this).css("left","");
                    });
                    $.JResContentScroll({
                        action: true
                    });
                    $("a div", btnId).remove();
                } else {
                    $("#resContentMask").removeAttr("style").css("left", "90%");
                    $(contentId).animate({
                        left: "0px"
                    }, animateTime,animateEasing);
                    $("#resMainWrap").animate({
                        left: "90%"
                    }, animateTime,animateEasing);
                    $.JResContentScroll({
                        action: false
                    });
                    $("a", btnId).append("<div class='closeLeft_btn'></div>");
                }
                break;

              case "right_under":
                if ($(contentId).css("right") == "0px" || $(contentId).css("right") == "0%") {
                    $("#resContentMask").removeAttr("style").css("right", "0");
                    $(contentId).animate({
                        right: "-90%"
                    }, animateTime,animateEasing);
                    $("#resMainWrap").animate({
                        right: "0"
                    }, animateTime,animateEasing, function() {
                        //$(this).removeAttr("style");
                        $(this).css("right","");
                    });
                    $.JResContentScroll({
                        action: true
                    });
                    $("a div", btnId).remove();
                } else {
                    $("#resContentMask").removeAttr("style").css("right", "90%");
                    $(contentId).animate({
                        right: "0px"
                    }, animateTime,animateEasing);
                    $("#resMainWrap").animate({
                        right: "90%"
                    }, animateTime,animateEasing);
                    $.JResContentScroll({
                        action: false
                    });
                    $("a", btnId).append("<div class='closeRight_btn'></div>");
                }
                break;

              default:
                if ($(contentId).css("left") == "0px" || $(contentId).css("left") == "0%") {
                    $(contentId).animate({
                        left: "-90%"
                    }, animateTime,animateEasing);
                    $.JResContentScroll({
                        action: true
                    });
                    $("a div", btnId).remove();
                } else {
                    $(contentId).animate({
                        left: "0px"
                    }, animateTime,animateEasing);
                    $.JResContentScroll({
                        action: false
                    });
                    $("a", btnId).append("<div class='closeLeft_btn'></div>");
                }
                break;
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

    //mobile navigation bar
    //content scrollerbar
    $.JResContentScroll = function(options) {
        var defaults = {
            action: true
        };
        options = $.extend(defaults, options);
        var action = options.action;
        if (action) {
            //$("#resMainWrap").css({"position":"relative"});
            $("html").removeClass("resHtmlOverflow");
            $("#resContentMask").hide();
            $("#resMainWrap").removeClass('resPannelOpen');
        } else {
            //$("#resMainWrap").css({"position":"fixed"});
            $("html").addClass("resHtmlOverflow");
            $("#resContentMask").show();
            //$("#resMainWrap").css("min-height", $(window).height() + "px");
        }
    };

    //loadCSS
    fnLoadCSS = function(id,href,media) {
      var cssLink = $("<link>");
      $("head").append(cssLink); //IE hack: append before setting href

      cssLink.attr({
        id: id,
        rel:  "stylesheet",
        type: "text/css",
        href: href,
        media: media
      });
    };

    //content scrollerbar
    // scrolltotop plugin
    /***********************************************
    *外掛: 向上按鈕*
    * Scroll To Top Control script- c Dynamic Drive DHTML code library (www.dynamicdrive.com)
    * Modified by www.MyBloggerTricks.com
    * Modified by www.scrolltotop.com
    * This notice MUST stay intact for legal use
    * Visit Project Page at http://www.dynamicdrive.com for full source code
    ***********************************************/
    var resScrolltotop = {
        //startline: Integer. Number of pixels from top of doc scrollbar is scrolled before showing control
        //scrollto: Keyword (Integer, or "Scroll_to_Element_ID"). How far to scroll document up when control is clicked on (0=top).
        setting: {
            startline: 100,
            scrollto: 0,
            scrollduration: 1e3,
            fadeduration: [ 500, 100 ]
        },
        controlHTML: "",
        //HTML for control, which is auto wrapped in DIV w/ ID="topcontrol"
        controlattrs: {
            offsetx: 5,
            offsety: 5
        },
        //offset of control relative to right/ bottom of window corner
        anchorkeyword: "#top",
        //Enter href value of HTML anchors on the page that should also act as "Scroll Up" links
        state: {
            isvisible: false,
            shouldvisible: false
        },
        scrollup: function() {
            if (!this.cssfixedsupport) //if control is positioned using JavaScript
            this.$control.css({
                opacity: 0
            });
            //hide control immediately after clicking it
            var dest = isNaN(this.setting.scrollto) ? this.setting.scrollto : parseInt(this.setting.scrollto);
            if (typeof dest == "string" && $("#" + dest).length == 1) //check element set by string exists
            dest = $("#" + dest).offset().top; else dest = 0;
            this.$body.animate({
                scrollTop: dest
            }, this.setting.scrollduration);
        },
        keepfixed: function() {
            var $window = $(window);
            var controlx = $window.scrollLeft() + $window.width() - this.$control.width() - this.controlattrs.offsetx;
            var controly = $window.scrollTop() + $window.height() - this.$control.height() - this.controlattrs.offsety;
            this.$control.css({
                left: controlx + "px",
                top: controly + "px"
            });
        },
        togglecontrol: function() {
            var scrolltop = $(window).scrollTop();
            if (!this.cssfixedsupport) this.keepfixed();
            this.state.shouldvisible = scrolltop >= this.setting.startline ? true : false;
            if (this.state.shouldvisible && !this.state.isvisible) {
                this.$control.stop().animate({
                    opacity: 1
                }, this.setting.fadeduration[0]);
                this.state.isvisible = true;
            } else if (this.state.shouldvisible == false && this.state.isvisible) {
                this.$control.stop().animate({
                    opacity: 0
                }, this.setting.fadeduration[1]);
                this.state.isvisible = false;
            }
        },
        init: function() {
            $(document).ready(function($) {
                var mainobj = resScrolltotop;
                var iebrws = document.all;
                mainobj.cssfixedsupport = !iebrws || iebrws && document.compatMode == "CSS1Compat" && window.XMLHttpRequest;
                //not IE or IE7+ browsers in standards mode
                mainobj.$body = window.opera ? document.compatMode == "CSS1Compat" ? $("html") : $("body") : $("html,body");
                mainobj.$control = $('<div id="topcontrol" ' + mainobj.controlHTML + '></div>').css({
                    position: mainobj.cssfixedsupport ? "fixed" : "absolute",
                    bottom: mainobj.controlattrs.offsety,
                    right: mainobj.controlattrs.offsetx,
                    opacity: 0,
                    cursor: "pointer",
                    "z-index": "999"
                }).attr({
                    title: "Scroll to Top"
                }).click(function() {
                    mainobj.scrollup();
                    return false;
                }).appendTo("#resMainWrap");
                if (document.all && !window.XMLHttpRequest && mainobj.$control.text() != "") //loose check for IE6 and below, plus whether control contains any text
                mainobj.$control.css({
                    width: mainobj.$control.width()
                });
                //IE6- seems to require an explicit width on a DIV containing text
                mainobj.togglecontrol();
                $('a[href="' + mainobj.anchorkeyword + '"]').click(function() {
                    mainobj.scrollup();
                    return false;
                });
                $(window).bind("scroll resize", function(e) {
                    mainobj.togglecontrol();
                });
            });
        }
    };
    
    // scrolltotop plugin
    //Jres 螢幕尺寸變換同步功能
    //orientationchange reload
    //if in print mode or desktop mode, reload the page
    var resPrintActive = false;
    var resFullscreen = false;
    //default value set false
    if ($.JRes_getCookie() == "true" || $.JRes_getCookie() == null || $.JRes_getCookie() == "") {
        $(window).resize(function() {

                
            if (resRefreshMode) {
                if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile|Android)/)) {
                    if (!resPrintActive) {
                        //if not print event then reload when browser resize
                        //if browser in full screen than do not auto reload
                        //using screenfull plugin to check fullscreen mode
                        if (screenfull.enabled) {
                            if (screenfull.isFullscreen) {
                                resFullscreen = screenfull.isFullscreen;
                            }else{
                                window.setTimeout(function() {
                                    resFullscreen = screenfull.isFullscreen;
                                }, 100);
                            } 
                        }

                        //if is not full screen then reload the page
                        if (!resFullscreen) {
                            if (navigator.userAgent.match(/(Firefox)/)) {
                                //if in firefox
                                window.location.href = window.location.href;
                            } else {
                                //IE 9以下不進行重整
                                if (!$.JRes_isLtIE9()){
                                    //console.log($.JRes_isLtIE9());
                                    if (navigator.userAgent.match(/(IE 9|IE 10)/)){
                                        //IE 9 或 IE 10 則只在瀏覽器不等於螢幕寬的時候重整
                                        if ($(window).width() != window.innerWidth) {
                                            location.reload();
                                        }
                                    }else{
                                        location.reload();
                                    }
                                }
                            }
                        }
                        
                    }
                }
            }
        });
        $(window).on("orientationchange", function() {
            if (resRefreshMode) {
                if (navigator.userAgent.match(/(Firefox)/)) {
                    //if in firefox
                    window.location.href = window.location.href;
                } else {
                    //if in other browsers
                    location.reload();
                }
            }
        });
    }

    //save form data
    function resFnSaveForm(){
        //清掉原本存取的session
        sessionStorage.clear();

        //把form值暫存起來
        $("input,select,textarea").each(function(){
            if ($(this).attr('type') == "hidden" || $(this).attr('type') == "submit" || $(this).attr('type') == "reset") {
                //如果input為hidden,submit,reset則不進行存取
            }else{
                if ($(this).attr('name') != undefined) {
                    sessionStorage.setItem($(this).attr("name"), $(this).val());
                }
            }
        })
    }

    //read form data
    function resFnReadForm(){
        //把form值讀取出來
        $("input,select,textarea").each(function(){
            var value = sessionStorage.getItem($(this).attr("name"));

            if($(this).val() == "" && $(this).val() != value){
                if (value !== null) $(this).val(value);
            }

        })
    }

    //detect print event: if active set resPrintActive with value true
    var beforePrint = function() {
        resPrintActive = true;
    };
    //after print event: once print event detect then reset resPrintActive with value false
    var afterPrint = function() {
        resPrintActive = false;
    };
    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia("print");
        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                beforePrint();
            } else {
                afterPrint();
            }
        });
    }
    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;

    //document ready action
    var resStoreData = true;

    //Jres 螢幕尺寸變換同步功能
    //-- check resCol img width --
    $(window).on("load", function() {

        //處理resTable
        $(".resTable td").each(function(){
            if ($(this).html() == "&nbsp;" || $(this).html() == "" || $(this).html() == " "){
                $(this).addClass("resEmptyCol");
            }
        })

        /*resSplit*/
        $('.resRow').each(function() {
            //切割寬度並在W:736以上使用)
            if($(window).width() >= 736 ) {
                if ($(this).hasClass("res-slice-h")) {
                    var getTotalSlice = 0;

                    $(">[class*='resCol']",this).each(function(){
                        if($(this).attr('res-slice-h') != undefined) {
                            getTotalSlice += parseInt($(this).attr('res-slice-h'));
                        }else{
                            getTotalSlice += 1; //預設加一
                        }
                    })

                    var setSliceRatio = 100/parseInt(getTotalSlice);

                    $(">[class*='resCol']",this).each(function(){
                        if($(this).attr('res-slice-h') != undefined) {
                            var getCurrentRatio = parseInt($(this).attr('res-slice-h'));
                            $(this).width((getCurrentRatio*setSliceRatio) + '%');
                        }else{
                            $(this).width(setSliceRatio + '%');
                        }
                    })
                }
            }

            /* 切割高度並在W:570以上進行高度同步 */
            if($(window).width() >= 570 ) {
                if ($(this).hasClass("res-slice-v")){
                    var getTotalSlice = 0;
                    $(this).height($(this).height());

                    $(">[class*='resCol']",this).each(function(){
                        if($(this).attr('res-slice-v') != undefined) {
                            getTotalSlice += parseInt($(this).attr('res-slice-v'));
                        }else{
                            getTotalSlice += 1; //預設加一
                        }
                    })

                    var setSliceRatio = 100/parseInt(getTotalSlice);

                    $(">[class*='resCol']",this).each(function(){
                        if($(this).attr('res-slice-v') != undefined) {
                            var getCurrentRatio = parseInt($(this).attr('res-slice-v'));
                            $(this).height((getCurrentRatio*setSliceRatio) + '%');
                        }else{
                            $(this).height(setSliceRatio + '%');
                        }
                    })
                }

                
                if ($(this).hasClass("resEven")){
                    var rowHeight = $(this).height();
                    var maxHeight = Math.max.apply(null, $(">[class*='resCol']",this).map(function(){return $(this).height();}).get());
                    $(">[class*='resCol']",this).height(Math.max(maxHeight,rowHeight));
                }
            }
        })

        //處理res排版圖片尺寸
        /*$('.resRow [class*="resCol"]').each(function() {
            $resColW = $(this).width();
            //console.log("width:"+$resColW);
            $("img", this).each(function() {
                if (!$(this).hasClass("resIgnoreImgReSizer")) {
                    $(this).css("width", "auto");
                    //偵測尺寸前先還原圖片尺寸
                    if (!$(this).hasClass("resEnlargeImg")) {
                        if ($(this).width() >= $resColW) {
                            $(this).css("width", "100%");
                        } else {
                            //如果是以100%比方式出值，則直接以100%來出圖
                            if ($resColW <= 100) {
                                $(this).css("width", "100%");
                            } else {
                                $(this).css("width", "auto");
                            }
                        }
                    } else {
                        $(this).parent(".resEnlarge").css("width", "100%");
                        if($(this).parent(".resEnlarge").width() < $(this).width()) {
                            $(this).css({"width":"100%","height":"auto"});
                        }
                    }
                }
            });
        });*/
        
        //把form值讀取出來
        //resFnReadForm();
        
    });

    
    $(document).ready(function(){
        //取消a在IE中的focus
        $("a").focus(function(){$(this).blur()})
    })

    // Before refreshing the page, save the form data to sessionStorage
    $(window).unload(function() {
        //把form值暫存起來
        //resFnSaveForm();
    });

}(jQuery, document, window));