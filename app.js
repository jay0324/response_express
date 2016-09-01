var server = "server/file.php";
var EditMode = "off";
var app = angular.module('myDemoList', ['ui.sortable', "ngRoute"]);
var myStorage = 'myStorage';
var ListStorage = myStorage + "_list";
var configStorage = myStorage + "_config";
var defaultLayout = 'resCol2_4';
var project_dialog = $("#dia1").dialog({
    autoOpen: false,
    height: 500,
    width: 350,
    modal: true
});
var sortBy = 'desc';
var myOrderBy = 'default';

//routing
app.config(function($routeProvider) {
    $routeProvider
        .when("/list", {
            templateUrl: "templates/list.html"
        })
        .when("/add", {
            templateUrl: "templates/add.html"
        })
        .otherwise({ "redirectTo": "/list" });
});

//allow to create html content
app.filter('unsafe', function($sce) {
    return $sce.trustAsHtml; 
});

//make controller
app.controller('myDemoListCtrl', function($scope, $http) {

    //sync localstorage
    $scope.syncLocalStorage = function(sync_storage, sync_DATA) {
        localStorage.setItem(sync_storage, JSON.stringify(sync_DATA));
    }

    //get localstorage
    $scope.getLocalStorage = function(sync_storage) {
        return (localStorage.getItem(sync_storage) == undefined) ? $.parseJSON('[]') : $.parseJSON(localStorage.getItem(sync_storage));
    }

    //initial param for apps
    $scope.init = function() {
        //get sync data from storage
        if (localStorage.getItem(configStorage) == undefined) {
            var configDATA = {
                myLayout: defaultLayout,
                save_btn_state: "off",
                manage_btn_state: EditMode,
                currentIndex: 0,
                sortBy: sortBy,
                myOrderBy: myOrderBy
            };
            $scope.syncLocalStorage(configStorage, configDATA);
        } else {
            var configDATA = $scope.getLocalStorage(configStorage);
        }

        //set initial param from storage
        $scope.myLayout = configDATA.myLayout;
        $scope.save_btn_state = configDATA.save_btn_state;
        $scope.manage_btn_state = configDATA.manage_btn_state;
        $scope.currentIndex = configDATA.currentIndex;
        $scope.sortableDisable = (configDATA.manage_btn_state == "on") ? false : true;
        $scope.sortBy = configDATA.sortBy;
        $scope.myOrderBy = configDATA.sortBy;

        //sortable
        $scope.sortableOptions = {
            start: function(e, ui) {
                //console.log('start:'+ui.item.index());
                $scope.currentIndex = ui.item.index();
            },
            stop: function(e, ui) {
                //console.log('stop:'+ui.item.index());
                $scope.demoList.splice($scope.currentIndex, 1, addnew);
            },
            update: function(e, ui) {
                //console.log('update:'+ui.item.index());
                $scope.save_btn_state = "on";
            },
            disabled: $scope.sortableDisable
        }

        //sync localstorage
        $scope.syncConfig();
    }

    //sync configDATA
    $scope.syncConfig = function() {
        var configDATA = {
            myLayout: $scope.myLayout,
            save_btn_state: $scope.save_btn_state,
            manage_btn_state: $scope.manage_btn_state,
            currentIndex: $scope.currentIndex,
            sortBy: $scope.sortBy,
            myOrderBy: $scope.myOrderBy

        };
        $scope.syncLocalStorage(configStorage, configDATA);
    }

    //change layout
    $scope.layoutMe = function(x) {
        $scope.myLayout = x;
        $(".dataList .item").addClass("transition");

        setTimeout(function() { $(".dataList .item").removeClass("transition") }, 600);

        //set to localstorage
        $scope.syncConfig();
    }

    //order item
    $scope.orderMe = function(x) {
        $scope.reverse = ($scope.myOrderBy === x) ? !$scope.reverse : false;
        $scope.sortBy = ($scope.reverse) ? 'desc' : 'asc';
        $scope.myOrderBy = x;

        //set to localstorage
        $scope.syncConfig();
    }

    //level start
    $scope.mylevel = function(x) {
        var max = 5;
        var result = '';
        for (var i = 1; i <= 5; i++) {
            if (i <= x) {
                result += '<i class="fa fa-star" aria-hidden="true"></i>';
            } else {
                result += '<i class="fa fa-star-o" aria-hidden="true"></i>';
            }
        }
        $scope.level = result;
    }

    //thumb
    $scope.myThumb = function(x){

        if (x != 'img/index/') {
            $scope.thumbimg = '<img src="'+x+'">';
        }else{
            $scope.thumbimg = '';
        }
        
    }

    //store to Server
    $scope.saveToServer = function() {
        if ($scope.manage_btn_state == "on") {
            if ($scope.save_btn_state == "on") {
                $http({
                    method: "POST",
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    url: server,
                    data: { method: 'write', data: encodeURIComponent(angular.toJson($scope.demoList)) }
                }).then(function mySucces(response) {
                    $scope.save_btn_state = "off";

                    //sync to localstorage
                    $scope.syncLocalStorage(ListStorage,$scope.demoList);

                }, function myError(response) {
                    console.log(response.statusText);
                });
            } else {
                alert("Nothing need to save!");
            }
        } else {
            alert("Manage Locked!");
        }
    }

    //connect to Server and get data
    $scope.getDataFromServer = function() {
        $http({
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            url: server,
            data: { method: 'read' }
        }).then(function mySucces(response) {
            $scope.demoList = response.data;
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    //update item
    $scope.updateItem = function() {

        switch ($scope.process_mode) {
            case 'insert':
                //add item
                var addnew = {
                    "id": $scope.new_id,
                    "thumb": $scope.new_thumbs,
                    "title": $scope.new_title,
                    "path": $scope.new_path,
                    "tags": $scope.new_tags,
                    "level": $scope.new_level
                };

                $scope.demoList.push(addnew);
                break;
            case 'update':
                //edit item
                var addnew = {
                    "id": $scope.new_id,
                    "thumb": $scope.new_thumbs,
                    "title": $scope.new_title,
                    "path": $scope.new_path,
                    "tags": $scope.new_tags,
                    "level": $scope.new_level
                };
                $scope.demoList.splice($scope.edit_index, 1, addnew);
                break;
        }

        $scope.save_btn_state = "on";
        project_dialog.dialog("close");
    }

    //remove item
    $scope.removeItem = function(x) {
        $scope.demoList.splice(x, 1);
        $scope.save_btn_state = "on";
    }

    //edit item dia form
    $scope.editItemDia = function(x) {
        /*get data*/
        $scope.new_id = $scope.demoList[x]['id'];
        $scope.new_thumbs = $scope.demoList[x]['thumb'];
        $scope.new_title = $scope.demoList[x]['title'];
        $scope.new_path = $scope.demoList[x]['path'];
        $scope.new_tags = $scope.demoList[x]['tags'];
        $scope.new_level = $scope.demoList[x]['level'];
        $scope.button_text = "EDIT";
        $scope.process_mode = "update";
        $scope.edit_index = x;

        project_dialog.dialog("open");
    }

    //add item dia form
    $scope.addItemDia = function() {

        if ($scope.manage_btn_state == "on") {
            /* initial data */
            var d = new Date();
            $scope.new_id = $.md5(d.getTime());
            $scope.new_thumbs = 'img/index/';
            $scope.new_title = 'Demo Page';
            $scope.new_path = '';
            $scope.new_tags = '';
            $scope.new_level = 1;
            $scope.button_text = "ADD";
            $scope.process_mode = "insert";

            project_dialog.dialog("open");
        } else {
            alert("Manage locked!");
        }
    }

    //manage state on
    $scope.manage = function() {
        if ($scope.manage_btn_state == "on") {
            $scope.manage_btn_state = "off";
        } else {
            $scope.manage_btn_state = "on";
        }

        //sync localstorage
        $scope.syncConfig();
        $scope.init();
    }

    //default value
    $scope.init();

    //get data from server
    //internet checking
    if (! window.jQuery) {
        //no internet
        $scope.demoList = $scope.getLocalStorage(ListStorage);
    }else {
        // internet connected
        $scope.getDataFromServer();
    }

    
});
