# response
this is a response setup for general webpage which is not designed by table and flash layout

=======================================================================================================================
版本說明
=======================================================================================================================
Program: JQuery Responsive plugin
Programmer: Jay HSU

-修改: 修正mobile safari UI文字置中問題
-增加: JResponsive寫入在螢幕尺寸變換重整停用狀態下，仍保持UI同步更新，寫法:

//建立重整function JResponsive宣告在這邊
function resInit() {
	$.JResponsive();
}
//jquery onload function
$(function() { 
	$.JRes_autoRefresh({state: false}); //停用自動重整
	resInit(); //呼叫UI
	$(window).resize(function(){resInit();})//重整的時候就呼叫UI
})

=======================================================================================================================
#其他外掛
=======================================================================================================================
jQuery Easing Plugin: http://gsgd.co.uk/sandbox/jquery/easing/
screenfull.js: https://sindresorhus.com/screenfull.js/

=======================================================================================================================
#套用方式及相關文件說明
=======================================================================================================================

#Date: 2016/08/17 後版本請在網頁中加入viewport標籤
```
<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=0" />
```

#Date: 2015/11/28 響應式尺寸變動預設為葉面重整來取得UI建立所需的數值，如需改為非重整的方式，請參照以下作法
```
//建立重整function JResponsive宣告在這邊
function resInit() {
	$.JResponsive();
}
//jquery onload function
$(function() { 
	$.JRes_autoRefresh({state: false}); //停用自動重整
	resInit(); //呼叫UI
	$(window).resize(function(){resInit();})//重整的時候就呼叫UI
})
```

在head所有加入下面幾行幾可啟用
注意: jquery請看情形加入，如果該頁面已經有用jQuery則不用加入
如果jquery用的是v1.7.1請取代為v1.11.1版 (因為1.7.x版會有重複執行的狀況)

* 自行建置主程式
sass建構樣式參數: sass/main/style1/_JResVar.scss

* 調整響應式內容
檔案: custom.js

* 調整響應式樣式
無SASS樣式檔案: nosass.css
SASS樣式檔案: sass/custom/_JResCustomSetup.scss

NOTE: 若您可以用sass來轉css的人，可以透過_sass下的scss來編輯產生css
如果沒有的人請直接編輯_css下的css檔案

#jQuery: 
=======================================================================================================================
```
<!--JQUERY-->
<script type="text/javascript" src="response/jquery.min.js"></script> <!--jQuery Local v1.11.1 -->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> <!--cloudflare CDN v1.11.1 -->
<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.1.min.js"></script> <!--jQuery CDN v1.11.1 -->
```
=======================================================================================================================

#Responsive:
# 主程式及設定包建置於response/dist/下的response資料夾內，可以直接複製該資料夾放到網頁目錄下，然後用以下程式來引用文件即可
=======================================================================================================================
```
<!--響應式設定-->
<link rel="stylesheet" type="text/css" href="response/response.min.css" media="all"> <!--預設響應式樣式-->
<link rel="stylesheet" type="text/css" href="response/css/sass.css" media="all"> <!--客製樣式 SASS-->
<link rel="stylesheet" type="text/css" href="response/css/nosass.css" media="all"> <!--客製樣式NO SASS-->
<script type="text/javascript" src="response/response.min.js"></script> <!--響應式主程式-->
<script type="text/javascript" src="response/js/custom.js"></script> <!--客製設定-->
<!--響應式設定-->
```
=======================================================================================================================

#Responsive Rawgit Path:
=======================================================================================================================
```
<!-- rawgit cdn -->
https://cdn.rawgit.com/jay0324/response/master/response/dist/response/response.min.css
https://cdn.rawgit.com/jay0324/response/master/response/dist/response/response.min.js
```
=======================================================================================================================

=======================================================================================================================
#響應式設定相關參數說明
=======================================================================================================================
	jQuery conflict usage: 
	-----------------------------------------
		* noConflict:
		jQuery.noConflict()(function($){
			$.JResponsive();
		})

		* without noConflict:
		$(function() { 
			$.JResponsive();
		})
	-----------------------------------------

	Usage: 
		$(function() { 

			//取得目前響應式開關參數=============================================================
			$.JRes_getCookie()
			//===================================================================================
			
			//取得網站根目錄=====================================================================
			$.JRes_modulePath()
			//===================================================================================

			//取得是否為手持設備 (true: 手持設備 false: 非手持設備)==============================
			$.JRes_isMobile()
			//===================================================================================

			//取得是否有flash支援 (true: 有支援 false: 非支援)===================================
			$.JRes_isFlash()
			//===================================================================================

			//以預設值直接啟動功能===============================================================
			$.JResponsive()
			//===================================================================================

			//檢查是否為IE9以下版本 (true: IE9以下 false: 非IE9以下)=============================
    		$.JRes_isLtIE9()
    		//===================================================================================

    		//重整頁面動作=======================================================================
    		$.JRes_autoRefresh({
    			state: (是否要啟用頁面重整動作,預設值true),
    			ignore: '' (排除不需要重整動作的頁面,可以用整個頁面的網址路徑或路徑中特殊字串,一個以上用","隔開)
    		})
    		//===================================================================================
			
			//客製化設定=========================================================================
			$.JResponsive({
				defaultResponse: 響應式啟動或關閉(布林) (預設true),
				setUILoadWidth: 載入介面尺寸,預設值為800 (注意: 此設定一旦修改,相對應css也要調整才會正常載入設定),
            	printMediaSetupMode: 將網頁切換為列印模式 (預設:false),
				modulePath: '模組路徑',
				mobileSwitch: '響應式開關放置的位置ID或class',
				viewPortSetup: '響應式viewport其餘參數 (ex: ,user-scalable=1) 開始一定要寫","',
				res_langVarDefault: '網站預設語系 tw:繁體 cn:簡體 add1:外加語系1 add2:外加語系2 add3:外加語系3 add4:外加語系4 add5:外加語系5 預設:英文',
				res_langVarEn: '網址列上語系的判斷值',
				res_langVarTw: '網址列上語系的判斷值',
				res_langArrayTw: ['預翻譯字串:翻譯後字串','預翻譯字串:翻譯後字串',...],
				res_langVarCn: '網址列上語系的判斷值',
				res_langArrayCn: ['預翻譯字串:翻譯後字串','預翻譯字串:翻譯後字串',...],
				res_langVarAdd1: '網址列上語系的判斷值',
				res_langArrayAdd1: ['預翻譯字串:翻譯後字串','預翻譯字串:翻譯後字串',...],
				res_langVarAdd2: '網址列上語系的判斷值',
				res_langArrayAdd2: ['預翻譯字串:翻譯後字串','預翻譯字串:翻譯後字串',...],
				res_langVarAdd3: '網址列上語系的判斷值',
				res_langArrayAdd3: ['預翻譯字串:翻譯後字串','預翻譯字串:翻譯後字串',...],
				res_langVarAdd4: '網址列上語系的判斷值',
				res_langArrayAdd4: ['預翻譯字串:翻譯後字串','預翻譯字串:翻譯後字串',...],
				res_langVarAdd5: '網址列上語系的判斷值',
				res_langArrayAdd5: ['預翻譯字串:翻譯後字串','預翻譯字串:翻譯後字串',...],
				defaultLangMenuObj: '語言選單的物件ID或class',
				customLangMenu: '客製語言選單內容',
				defaultMenuObj: '主選單的物件ID或class',
				customMenu: '客製主選單選單內容',
				defaultSubMenuObj: [["其它嵌入的物件的標題","其它嵌入的物件ID或class"],["其它嵌入的物件的標題","其它嵌入的物件ID或class"]...],
				customSubMenu: '客製嵌入的物件內容',
				additionalPage: [["頁面ID名稱","視窗開啟方式(left,top,right)","頁面標題","頁面內容","相關頁面ID(會產生下一頁按鈕)"],...]
				pannelPosition: '預設響應式視窗開啟方式(top,left,right,left_under,right_under)',
				pannelStyle: '預設響應式視窗風格 預設為空值,style1)",
				pannelAnimateTime: 響應是視窗動畫播放時間,預設500(毫秒),
            	pannelAnimateEasing: 響應式視窗動畫效果，預設"swing"(參考文件:http://gsgd.co.uk/sandbox/jquery/easing/),
				menuCollapse: '要套用收闔式的物件ID,如多個ID可用逗號隔開',
				resPageLoader: true/false (是否使用頁面載入動畫,預設false),
				resPageLoaderTigger: 'always'/800/600/... (是否在特定螢幕寬以下才使用loader,預設值為800),
				responsiveSwitch: true/false (是否使用響應式切換開關,預設true),
				res_langSwitch:true/false (是否使用語言切換開關,預設true)
				res_tabJumperSetting: {} (設定Tab標籤頁面定位, 預設值 state:true,speed:3000),
            	res_mobileTopNavBtnSetup: {} (設定上方主選單, 預設值 state:true,type:fixed,primary:true,width:50,height:50,margin:5),
            	additionalBtn: [
	            	[
	            		"按鈕ID名稱",
	            		"按鈕連結",
	            		"按鈕顯示文字",
	            		"按鈕目標 (一般target視窗目標如:target,new,blank等 或 pannel來啟動響應式視窗/tab來建立Tab標籤定位按鈕)",
		            	[
		            		"pannel值啟動之響應式視窗位置(top,top_small,left,right,left_under,right_under)",
		            		"pannel值啟動之響應式視窗內容",
		            		"pannel風格樣式(預設空值,style1)"
		            	]
	        		],
					[
	            		"按鈕ID名稱",
	            		"自行建立響應式頁面的ID",
	            		"按鈕顯示文字",
	            		"page"
	            	],
	            	[
	            		"按鈕ID名稱",
	            		"預載入之URL",
	            		"按鈕顯示文字",
	            		"loader",
	            		{
	            			title: 頁面標題 (字串),
							toggle: Loader類型 (字串 ajax/iframe 預設iframe),
							toggleDom: ajax載入特定物件 (字串 ID或Class)
	            		}
	            	]
				],
            	res_mobileBottomNavBtnSetup: 請參照res_mobileTopNavBtnSetup的設定值,
            	additionalBottomBtn: 請參照additionalBtn的設定值,
            	scrollTop: 使用ScrollToTop外掛功能 (預設:true),
            	app_icon: APP icon的圖檔路徑 (預設: "img/response/app_ico.png")
			});
			//===================================================================================
			
			//文字跑馬燈效果函式=================================================================
			$(obj).JResMarquee({
				objWidth: 內容長度 (預設值"auto",會以文字大小的設定來算長度)
				fontSize: "文字大小",
				position: "方向 (-1:由左向右 1:由右向左)",
				speed: "速度 (數字越小越快)"
			})
			//===================================================================================
			
			//橫向卷軸效果函式===================================================================
			$(obj).JResOverflow({
				flow: 橫向卷軸開關 (true:啟用 false:關閉),
				paddingAmt: 相對圖文間距(px),
				setUILoadWidth: 載入介面尺寸,預設值為800 (注意: 此設定一旦修改,相對應css也要調整才會正常載入設定)
			});
			
			$(obj).addClass("resUnwrap"); //取消橫向卷軸
			//===================================================================================
			
			//圖片放大功能=======================================================================
			$(obj).JResEnlarge({
				enlargeSize: 圖片放大類型 ("100%":符合螢幕 "auto":原尺寸)
				scalePx: 手動縮放調整尺寸(px),
				paddingAmt: 相對圖文間距(px),
				extraSource: "放大後圖片路徑(預設為原圖)",
				setUILoadWidth: 載入介面尺寸,預設值為800 (注意: 此設定一旦修改,相對應css也要調整才會正常載入設定),
				popupMode: 是否使用影視窗(布林) (預設false),
				enablePluginMode: 是否與其他shadowbox共存(布林) (預設false)
			});
			
			$(obj).addClass("resUnlarger"); //取消圖片放大

			//物件參數設定
			//toggle-src 為選加值, 您可以統一用extraSource來設定全域設定或直接用此參數來設定單一物件
			<img src="圖片路徑" toggle-src="其他圖片路徑" />

			//===================================================================================
			
			//簡易淡出淡入畫面切換效果函式=======================================================
			$(obj).JSlideImg({
				autoPlay: true, //自動撥放 預設: ture
				childTag: "畫面切換物件的tag, 如: img,div,a,...",
				transitTime: 畫面切換秒數,
				transitStyle: "animate(動畫效果,只針對當前圖片做淡入),預設值為空值(雙向淡入淡出)",
				holdTime: 畫面停留秒數,
				paddingAmt: 相對縮圖尺寸(px),
				layout: 排版 如: left: 靠齊左 / right:靠其右 / 預設:清除,
				touchSwipAmt: 觸控捲動觸發移動量(數字) (預設:100),
				thumb: {						//小圖切換按鈕
					state: true,				//是否使用(預設false)
					amount: 4,					//一次顯示數量, 'auto':自動偵測數量
					width:50,					//小圖寬度
					height:50,					//小圖高度
					type: 'horizontal',			//顯示方式(直式:vertical 橫式: horizontal)
					position: 'left:10px;bottom:10px;'	//位置(以style的方式來定位，結尾一定要有分號，不然會顯示不出來),
					overlap: true,				//是否要覆蓋在slideshow的圖片上
                	overlapPos: 'auto'			//對齊位置，預設為'auto'，向上對齊(type為縱向)，向左(type為橫向)
                	displayTitle: 'auto'		//顯示title的方式, 預設'auto': 直接顯示在thumb選項裡 'top':統一顯示於thumb選項上方 'left': 若thumb為縱向排列則會排在左下 'right': 若thumb為縱向排列則會排在右下
				},
				slideBtn:{
					state: true,				//是否使用上下項目切換按鈕組
					trigger: 'click',			//觸發動作 預設:click 其他: mouseenter ...
					width: 100,					//按鈕寬
					height: 100,				//按鈕高
					type: 'horizontal'			//按鈕呈現方式(直式:vertical 橫式: horizontal) 
				},
				setupResposive: {				//小圖在不同尺寸下的設定
					600:{						//尺寸
					    //設定參照thumb的設定項目
						slideBtn:{}				//上下項目切換按鈕組設定值請參照上面設定方式
					}
				},
				onTrans: function(){}, //客製倫播效果 預設:false
				onHold: function(){} //客製內容物件動態效果 預設:false
			});

			//html結構
			<div id="mySlideshow">
				<img src="img_path" toggle-thumb-source="thumb_img_path" toggle-thumb-title="thumb_title" />
				.
				.
				.//除了img已外也可以用其他標籤來當子項目,childTag值請設定為該標籤即可
			</div>
			//===================================================================================
			
			//將表格Table轉格響應式格式==========================================================
			$(obj).addClass("resTable");
			//===================================================================================

			//響應式選單按鈕設定值===============================================================
			$(obj).addClass("resBtn");
			$(obj).attr("toggle","選單ID");
			//===================================================================================
			
			//響應式頁面按鈕設定值===============================================================
			$(obj).addClass("resPageBtn");
			$(obj).attr("toggle","響應式頁面ID");
			//===================================================================================
			
			//響應式Loader頁面按鈕設定值 (預設以iframe載入)======================================
			$(obj).addClass("resPageLoaderBtn");
			$(obj).attr("title","載入頁面標題區內容"); //選則填寫 (預設值為空值)
			$(obj).attr("tigger","載入情況"); //選擇填寫 (always: 總是使用 / 預設: 只在800寬度下使用)
			$(obj).attr("toggle","載入方式"); //選擇填寫 (ajax: 使用ajax載入 / 預設: 預設以iframe載入)
			$(obj).attr("toggleDom","ajax載入特定物件"); //選擇填寫 (帶入ajax頁面中的ID,tag,或class)
			$(obj).attr("toggleParam","iframe attribute"); //選擇填寫 (帶入iframe頁面中的參數如:allowfullscreen)
			//===================================================================================

			//Tab標籤頁面定位按鈕設定值==========================================================
			//在頁面滑動至相對高度的jumper按鈕會加入jumperActive class, 在客製化修改其樣式即可
			$(obj).addClass("resTabJumper");
			<a class="resTabJumper" href="#目標ID" toggle-offset="微調卷軸定位">連結</a>
			//===================================================================================

			//Tab group建立=====================================================================
			$(obj).JResContentTab({
				init: 預設的顯示標籤 (預設:0),
	            fx: 切換效果 (預設:slide / fade,slide,show),
	            transitTime: 切換效果時間 (預設:300),
	            createTabs: {			//js寫入Tab
	            	tab1:{				//新標籤編號
	            		id: "物件ID",
						text: "Tab按鈕顯示文字",
						content: "Tab內容"
	            	}
	            },
	            onClick: {} //tab點擊客製動作, 預設 false,
	            resMode: '', //響應式呈現模式 'expend':完全展開 'collapse': 收合展開 預設:無
            	resModeActiveWidth: 604 //響應式呈現模式觸發尺寸(尺寸修改請一併修改樣式)
			});

			//直接建立在本文的結構
			//直接開啟tab，可以在網址上加入標籤，如: 頁面路徑#內容ID
			<div id="物件ID">
                <ul class="tabs">
                    <li><a href="#內容ID1" class="tabsBtn">按鈕顯示文字</a></li>
                    <li><a href="#內容ID2" class="tabsBtn">按鈕顯示文字</a></li>
                </ul>

                <ul class="tabs_content">
                    <li id="內容ID1" class="tabsContent">
                        按鈕顯示內容
                	</li>
                   	<li id="內容ID2" class="tabsContent">
                        按鈕顯示內容
                	</li>
                </ul>
            </div>
            //===================================================================================

            //slider功能=========================================================================
            $(物件ID).JResContentSlider({
            	autoPlay: 啟用自動輪播(布林) (預設:true),
            	touchSwipAmt: 觸控捲動觸發移動量(數字) (預設:100),
            	delayTime: 停留時間(毫秒) (預設:3000),
            	transitionTime: 轉場時間(毫秒) (預設200)
				listAmt: 顯示數量(數字) (預設5),
				listPaddingAmt: 每個項目的間距(數字) (預設2),
				from: 第一個顯示的項目(數字) (預設0),
				type: 呈現方式(字串: horizontal/vertical) (預設horizontal),
				btnSetup:{				//按鈕設定(物件)
	                nextBtn:{			//往後按鈕(物件)
	                    state: 是否顯示(布林)(預設true),
	                    width: 按鈕寬度(數字)(預設20)
	                },
	                prevBtn:{			//往前按鈕(物件)
	                    state: 是否顯示(布林)(預設true),
	                    width: 按鈕寬度(數字)(預設20)
	                }
	            },
				setupResposive: {		//響應式設定(物件)
					800:{				//螢幕尺寸(物件:設定此物件名稱請以尺寸寬度來命名)
						listAmt: 顯示項目(數字:預設5),
						listPaddingAmt: 每個項目的間距(數字) (預設2),
						btnSetup: {}參照全域的設定方式,
						autoPlay: 參照全域的設定方式
					},
					600:{
						listAmt: 顯示項目(數字:預設4),
						listPaddingAmt: 每個項目的間距(數字) (預設2),
						btnSetup: {}參照全域的設定方式,
						autoPlay: 參照全域的設定方式
					},
					420:{
						listAmt: 顯示項目(數字:預設2),
						listPaddingAmt: 每個項目的間距(數字) (預設2),
						btnSetup: {}參照全域的設定方式,
						autoPlay: 參照全域的設定方式
					}
				}
			});
			//html結構
			<div id="myItemSlider2">
                <div class="sliderContainer">
                    <ul>
                        <li><a href=""><img src="圖片" alt="" /></a></li>
                        <li><a href=""><img src="圖片" alt="" /></a></li>
                    </ul>
                </div>
            </div>
            //===================================================================================

            //Ladder設定 (錯位效果)==============================================================
            $(物件).JResLadderObj({
		        setupMode: 設定模式 (布林)(預設值false),
		        state: 使用 (布林)(預設值true),
		        position: 定位方式(字串)(預設'fixed',其他'absolute'),
		        container: 若定位方式為'absolute'必須提供父層的容器物件ID,
		        path: {			//路徑設定
		        	0:{		//路徑名稱或編號
		        		speed: 1,			//卷軸速度
		        		start:{				//點位設定(起點)
		            		ladder: 0,		//點位開始的卷軸位置
		                	x: 400,			//點位x位置
		                	y: 1000,		//點位y位置
		                	z: 2, 			//點位z位置
		                	opacity: 0		//透明度 (浮點 0~1)
		            	},
		            	end: {				//點位設定(終點)
		                	ladder: 600,	//點位終點的卷軸位置
		                	x: 800,			//點位x位置
		                	y: 100,			//點位y位置
		                	z: 2, 			//點位z位置
		                	opacity: 1		//透明度 (浮點 0~1)
		            	} 
		        	}
		        }
		    });
		    //定位連結
		    <a href="#" class="resLadderJumper" toggle="物件ID" ladder="選擇物件的路徑名稱或編號">Link1</a>
		    //====================================================================================

		    //Follow up設定 (跟屁蟲)==============================================================
		    $(物件).JResFollowObj({
				position: 定位方式(字串)(預設'fixed',其他'absolute'),
				pos: {			//定位位置 (top:位置(單位PX),left:位置(單位PX),...跟CSS一樣)
		            top: 200,
		            left: 10
		        },
		        delay: 100 		//延遲速度
			});
			//====================================================================================

			//延遲載入動作偵測====================================================================
			$(containerID).JResDelayLoader({
				state: 是否使用 (布林 預設true),
            	loadObj: 延遲載入的物件ID或class (字串: 預設為空值),
            	delay: 每個物件載入延遲的時間 (毫秒: 預設200),
            	transition: 載入效果的時間 (毫秒: 500),
            	eventPos: 觸發動作的位置(預設100,為瀏覽器高度的一半加100，您可以加減其數值),
				onLoad: function () {} //其他延遲後載入的動作,預設false
			})
			//====================================================================================
 
			//resMenu功能=========================================================================
			$(menuObjID).JResMenu({
		        view: 顯示方式(字串)(horizontal: 橫向, vertical:縱向(預設)),
		        action: 觸發方式(字串)(hover: 滑過觸發, click: 點擊觸發(預設)),
		        fx: 使用展開收闔效果 (預設: true, "mixed": 混合模式(當混和模式的時候，有子選單的A連結如果將它的HREF設為#則就會以收合方式效果帶入，反之如果給HREF連結則會跳頁))
		    })

		    //HTML結構
		    <div id="menuObjID">
		    	<ul>
		    		<li>
		    			<a href="#">連結</a>
		    			<ul>
				    		<li>
				    			<a href="#">連結</a>
				    			如果還有子層就沿續一樣的結構...
				    		</li>
				    		...
				    	</ul>
		    		</li>
		    		...
		    	</ul>
		    </div>

		    //備註: 因為程式執行後樣式才會寫入物件，建議可以先將樣式先寫入物件，在頁面載入時樣式才會預先出現
		    //如: <div id="menuObjID" class="程式載入樣式名稱">
		    //====================================================================================

		    //JResScrollSticker功能===============================================================
		    $("#ID").JResScrollSticker({
		    	position:{} //設定位置樣式,預設值為top:0 (obj)
		    });
		    //====================================================================================

		    //JResAccordion功能===================================================================
		    $("#ID").JResAccordion({
	            height: 300, 		//高度
	            amount: 4,			//數量
	            openW: 52,			//開啟寬/高度(%)
	            headingW: 40,		//標題區寬/高度(%)
	            contentW: 60,		//內容區寬/高度(%)
	            delay: 1000,		//動畫長度 (毫秒)
	            fx:'linear',		//動畫效果 (參照Jquery earsing)
	            type: 'horizontal'	//排列方式 (horizontal:橫向 / vertical:縱向)
	        });

	        //HTML結構
	        <ul id="demoAccordion" class="resAccordion">
                <li>
                    <div class="heading"> Heading </div>
                    <div class="content"> Content </div>
                </li>
                <li>
                    <div class="heading"> Heading </div>
                    <div class="content"> Content </div>
                </li>
                <li>
                    <div class="heading"> Heading </div>
                    <div class="content"> Content </div>
                </li>
                <li>
                    <div class="heading"> Heading </div>
                    <div class="content"> Content </div>
                </li>
            </ul>

		    //====================================================================================

		    //res排版樣式=========================================================================
		    .resTableRow: 將結構同.resRow，只是他是以table的方式來排列，不過這個就沒有響應式了，
		    其他尺寸的呈現，再依照需求修改樣式即可

		    .resRow的設定值:
			.resEven: 用在將resRow下的resCol設為同高度
			.res-slice-h: 用在將resRow下的resCol橫向自動均分
			.res-slice-v: 用在將resRow下的resCol縱向自動均分

			.resCol*的設定值 (引入12格線排版樣式.resCol1~.resCol12):
			.resCol: 無任何定義的resCol Dom
			.overflow: 定義此resCol Dom加入卷軸
			.top: 定義此resCol Dom的內容縱向向上對齊
			.middle: 定義此resCol Dom的內容縱向向中對齊
			.bottom: 定義此resCol Dom的內容縱向向下對齊

			ATTR -> res-slice-h="定義此resCol橫向相對比例"
			ATTR -> res-slice-v="定義此resCol縱向相對比例"

			其他:
			.resSelect: 客製化下拉式
			.clear: 清除流動
			.resContainer: 外框
			.resDocLayout: 內框
			.resTable: 流動式表格

		    //====================================================================================

			
		})
