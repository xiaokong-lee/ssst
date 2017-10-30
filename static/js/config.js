var app = angular.module('MyApp', ['ngRoute', 'ngAnimate','ngCookies','ngDraggable','ui.select','ui.select2','angular-drag']);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'tmpl/public/home.html',
            controller: 'indexCtrl'
        })
        .when('/introduction', {
            templateUrl: 'tmpl/public/introduction.html',
            controller: 'introductionCtrl'
        })
        .when('/none', {
            templateUrl: 'tmpl/public/none.html',
            controller: 'noneCtrl'
        })
        .when('/download', {
            templateUrl: 'tmpl/public/download.html',
            controller: 'downloadCtrl'
        })
        .when('/changepassword', {
            templateUrl: 'tmpl/public/changepassword.html',
            controller: 'changepasswordCtrl'
        })
         .when('/findpassword', {
            templateUrl: 'tmpl/public/findpassword.html',
            controller: 'findpasswordCtrl'
        })
         .when('/modifypwd', {
            templateUrl: 'tmpl/public/modifypwd.html',
            controller: 'modifypwdCtrl'
        })
         .when('/allmessage', {
            templateUrl: 'tmpl/public/allmessage.html',
            controller: 'allmessageCtrl'
        })
        .when('/dashborad', {
            templateUrl: 'tmpl/dashboard/dashboard.html',
            controller: 'dashboradCtrl'
        })
        .when('/dashboard-v2', {
            templateUrl: 'tmpl/dashboard/dashboard-v2.html',
            controller: 'dashboardCtrl'
        })
        .when('/dashboard-v3', {
            templateUrl: 'tmpl/dashboard/dashboard.html',
            controller: 'dashboardCtrl'
        })
        .when('/dashboard-v4', {
            templateUrl: 'tmpl/dashboard/dashboard.html',
            controller: 'dashboardCtrl'
        })
        .when('/dashboard-v5', {
            templateUrl: 'tmpl/dashboard/dashboard.html',
            controller: 'dashboardCtrl'
        })
        .when('/messagelist', {
            templateUrl: 'tmpl/public/messagelist.html',
            controller: 'messagelistCtrl'
        })
        .when('/mes', {
            templateUrl: 'tmpl/mes/sites.html',
            controller: 'mesCtrl'
        })
        .when('/sites', {
            templateUrl: 'tmpl/mes/sites.html',
            controller: 'mesCtrl'
        })
        .when('/buildings', {
            templateUrl: 'tmpl/mes/buildings.html',
            controller: 'mesCtrl'
        })
        .when('/smartsight', {
            templateUrl: 'tmpl/mes/smartsight.html',
            controller: 'mesCtrl'
        })
        .when('/sightvideo/:id', {
            templateUrl: 'tmpl/mes/sightvideo.html',
            controller: 'sightvideoCtrl'
        })
        .when('/e-office', {
            templateUrl: 'tmpl/e-office/oa1/oa-1-01.html',
            controller: 'eOfficeCtrl'
        })
        .when('/users', {
            templateUrl: 'tmpl/e-office/users.html',
            controller: 'usersCtrl'
        })
        .when('/user:id', {
            templateUrl: 'tmpl/e-office/user.html',
            controller: 'userCtrl'
        })
        .when('/roles', {
            templateUrl: 'tmpl/e-office/roles.html',
            controller: 'rolesCtrl'
        })
        .when('/funcs', {
            templateUrl: 'tmpl/e-office/funcs.html',
            controller: 'funcsCtrl'
        })
        .when('/forms', {
            templateUrl: 'tmpl/e-office/forms.html',
            controller: 'formsCtrl'
        })
        .when('/form:id', {
            templateUrl: 'tmpl/e-office/form.html',
            controller: 'formCtrl'
        })
        .when('/mobileForm:id', {
            templateUrl: 'tmpl/e-office/mobileForm.html',
            controller: 'mobileFormCtrl'
        })
        .when('/workflows', {
            templateUrl: 'tmpl/e-office/workflows.html',
            controller: 'workflowsCtrl'
        })
        .when('/workflow/:id', {
            templateUrl: 'tmpl/e-office/workflow.html',
            controller: 'workflowCtrl'
        })
        .when('/wfroles', {
            templateUrl: 'tmpl/e-office/wfroles.html',
            controller: 'wfrolesCtrl'
        })
        .when('/tasks', {
            templateUrl: 'tmpl/e-office/tasks.html',
            controller: 'tasksCtrl'
        })
        .when('/agentadd', {
            templateUrl: 'tmpl/e-office/agentadd.html',
            controller: 'agentaddCtrl'
        })
        .when('/task:no', {
            templateUrl: 'tmpl/e-office/task.html',
            controller: 'taskCtrl'
        })
        .when('/agents', {
            templateUrl: 'tmpl/e-office/agents.html',
            controller: 'agentsCtrl'
        })
        .when('/agentsUsers', {
            templateUrl: 'tmpl/e-office/agentUsers.html',
            controller: 'agentUsersCtrl'
        })
        .when('/reportform', {
            templateUrl: 'tmpl/e-office/reportform.html',
            controller: 'reportformCtrl'
        })
        .when('/reportforms/:param', {
            templateUrl: 'tmpl/e-office/reportforms.html',
            controller: 'reportformsCtrl'
        })
        .when('/reportmenbers/:param', {
            templateUrl: 'tmpl/e-office/reportmenbers.html',
            controller: 'reportmenbersCtrl'
        })
        .when('/tmpls', {
            templateUrl: 'tmpl/e-office/tmpls.html',
            controller: 'tmplsCtrl'
        })
        .when('/tmpl:id', {
            templateUrl: 'tmpl/e-office/tmpl.html',
            controller: 'tmplCtrl'
        })
        .when('/tmplpre:id', {
            templateUrl: 'tmpl/e-office/tmplpre.html',
            controller: 'tmplpreCtrl'
        })
        .when('/createtmpl:id', {
            templateUrl: 'tmpl/e-office/createtmpl.html',
            controller: 'createtmplCtrl'
        })
        .when('/tempconfig', {
            templateUrl: 'tmpl/e-office/tempconfig.html',
            controller: 'tempconfigCtrl'
        })
        .when('/note', {
            templateUrl: 'tmpl/public/note.html',
            controller: ' '
        })
        .when('/mymenu', {
            templateUrl: 'tmpl/e-office/mymenu.html',
            controller: 'mymenuCtrl'
        })
        .when('/systemmenu', {
            templateUrl: 'tmpl/e-office/systemmenu.html',
            controller: 'systemmenuCtrl'
        })
        .when('/info', {
            templateUrl: 'tmpl/public/info.html',
            controller: 'infoCtrl'
        })
        .when('/organize', {
            templateUrl: 'tmpl/e-office/organize.html',
            controller: 'organizeCtrl'
        })
        .when('/organize_usermanage', {
            templateUrl: 'tmpl/e-office/userlistmanage.html',
            controller: 'organize_usermanageCtrl'
        })
        .otherwise({redirectTo: '/'});
}]);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01';
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.put["Content-Type"] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Accept'] = 'application/json, text/javascript, */*; q=0.01';
    $httpProvider.defaults.headers.put['X-Requested-With'] = 'XMLHttpRequest';
}]);
app.run(function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
            $templateCache.remove(current.templateUrl);
            console.log("清除緩存一次；")
        }
    });
});
app.factory('screen',function ($window) {
    var factory = {};
    factory.get = function () {
        return {"height":$window.innerHeight,"width":$window.innerWidth};
    };
    return factory
});
app.factory("filter",function () {
    var factory = {};
    factory.get = function ($arr,key,value) {
        console.log(arr)
        if(!key && !value){
            return $arr;
        } else {
            var arr = [];
            if(key){
                for(var i=0;i<$arr.length;i++){
                    if($arr[i][key] == value){
                        arr.push($arr[i])
                    }
                }
            } else {
                for(var i=0;i<$arr.length;i++){
                    if(angular.isArray(value)){
                        if(JSON.stringify($arr[i]).indexOf(value[0])>-1 || JSON.stringify($arr[i]).indexOf(value[1])>-1 || JSON.stringify($arr[i]).indexOf(value[2])>-1){
                            arr.push($arr[i])
                        }
                    } else {
                        if(JSON.stringify($arr[i]).indexOf(value)>-1){
                            arr.push($arr[i])
                        }
                    }
                }
            }
            return arr;
        }
    };
    return factory;
});
app.filter('submitor',function () {
    return function ($obj,param) {
        var ds = [];
        for(var i=0;i<$obj.length;i++){
            if($obj[i].node == param){
                ds.push($obj[i])
            }
        }
        return ds;
    }
});
app.filter('hasChart',function () {
    return function (charts,library) {
        function chartFilter(id,chart) {
            return chart.id != id
        }
        for(var i=0;i<charts.length;i++){
            library.filter(chartFilter(charts[i]));
        }
        return library;
    }
});
// 過濾器
app.filter('locationStyle', function () { //可以注入依赖
    return function (obj) {
        var str = "left:" + obj.left + ";top:" + obj.top;
        return str;
    }
});
//定義組件：動態獲取Object標籤代碼
app.factory("GetObjectHtml", function () {
    var factory = {};
    factory.get = function (width, percent, url) {
        var _percent = percent ? percent : 0.5652;
        var height = width * _percent;
        var html = "<object type='application/x-vlc-plugin' width=" + width + " height=" + height + " " +
            "pluginspage='http://www.videolan.org' codebase='http://downloads.videolan.org/pub/videolan/vlc-webplugins/2.0.6/npapi-vlc-2.0.6.tar.xz' " +
            "style='z-index:10000;'> " +
            "<param name='mrl' value=" + url + " width=" + width + ">" +
            "<param name='volume' value='50' /> " +
            "<param name='autoplay' value='true' /> " +
            "<param name='loop' value='false' /> " +
            "<param name='fullscreen' value='true' /> " +
            "<param name='controls' value='false' />" +
            "<embed type='application/x-google-vlc-plugin' version='VideoLAN.VLCPlugin.2' " +
            "autoplay='yes' loop='no' width='640' height='480' target=" + url + " ></embed>" +
            "</object>";
        return html;
    };
    return factory;
});
app.service("GetVideoObject", function (GetObjectHtml) {
    this.get = function (url) {
        var con = document.getElementById("camera_container");
        var width = con.offsetWidth - 20;
        con.innerHTML = GetObjectHtml.get(width, "", url);
    }
});
app.service('$ajax',function ($http,$location,$window,$rootScope) {
    function httpAjax(method,url,data,success,error) {
        $http({
            method: method,
            url: url,
            data:data,
            // withCredentials:true,
            // crossDomain: true,
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': $window.localStorage.getItem("X-CSRFToken")
            },
            transformRequest: function ( data ) {
                 return $.param(data);
            }
        }).then(function successCallback(response) {
                if(response.status == 203){
                    $window.localStorage.clear();
                    $rootScope.userData = {
                        "isUserAuth": false
                    };
                    dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
                } else {
                    success(response)
                }
            }, function errorCallback(response) {
                if(error){
                    error(response)
                } else {
                    alert("數據訪問失敗，請聯繫系統管理員！")
                }
        });
    }
    this.get = function(url,data,success,error){
        httpAjax('GET',url,data,success,error);
    };
    this.post = function (url,data,success,error) {
        httpAjax('POST',url,data,success,error);
    };
    this.put = function (url,data,success,error) {
        httpAjax('PUT',url,data,success,error);
    };
    this.delete = function (url,data,success,error) {
        httpAjax('DELETE',url,data,success,error);
    };
});
app.service('$sendMsg', function ($http,$location,$rootScope,$window,inArrayIndex,urls) {
    this.get = function (stomClient,flag) {
        if(flag){
            // var msg = {
            //     type:"cuidan",                                             //後臺推送的消息類型為催單
            //     from:"張xx(F1234567)",                                     //表單的發起人(姓名與工號)
            //     to:"李xx(F1330314),王x(F43458567)",                        //表單待簽人員的工號，若存在多個並行待簽人員，則用逗號隔開
            //     date:"2017-06-22 08:00",                                   //系统推送消息时间
            //     content:[                                                  //不同的消息類型對應不同的內容格式，放在Json數組中，數組中一條Json數據對應一個被催單據
            //         {
            //             form_id:"15",                                   //待簽表單id
            //             form_no:"HRS0011706220001",                     //待簽表單編號
            //             form_name:"测试",                               //待簽表單名稱
            //             initial_date:"2017-06-22 08:31:12",              //待簽表單發起時間
            //             current_approver:"王xx(F563456)" ,             //當前節點表單簽核完成人員
            //             current_approve_date:"2017-06-22 08:31:12",     //當前節點表單簽核完成時間
            //             current_approve_status:"pass|reject|redirect", //當前節點表單簽核狀態
            //             current_approve_comment:"agree",               //當前節點表單簽核人意見
            //             next_approver:"李xx(F1234567),王x(F43458567)" ,//下一個待簽人員
            //             status:"open|close|reject|frozen",            //當前表單的狀態
            //         }
            //     ],
            //     message:{type:"表单签核动态1", time:"2017-06-27 11:55:08",
            //         title:"【表單簽核】您有一筆表單需要簽核", url:"#/form:173"}
            // };
            var username = $rootScope.userData.info.username;
            if($rootScope.userData.message.length == 0){
                $rootScope.notify = false;
            }
            var stompUrl = urls.mqtt;
            var stompU="iot";
            var stompP="iot123!";
            var Topic = '/topic/st/message';
            stomClient = stompPackage.stompConnect(stompUrl, stompU, stompP, function () {
                var us44=stompPackage.stompSubscribe(Topic,function (data) {
                    // data = JSON.stringify(data);
                    // if(typeof(data) == "string"){
                    console.log('44:',data);
                    var msg = eval('(' + data +')');
                    console.log("msg:"+msg);
                    if(msg["type"] != "mt"){
                        console.log("45:",msg,"username",username);
                        if(msg["to"]){
                            if(msg["to"].indexOf(username) > -1){
                                $rootScope.notify = true;
                                var index=inArrayIndex.get(msg['message']["time"],$rootScope.userData.message,"time");
                                console.log(index,"index");
                                if(index == "none"){
                                    $rootScope.userData.message.push(msg['message']);
                                    $window.localStorage.setItem("userInfo", JSON.stringify($rootScope.userData));
                                }
                            }
                        }
                    }
                    if(typeof(data) == "string"){
                        console.log('44:',data);
                        // data = JSON.parse(data);
                        var msg = eval('(' + data +')');
                        if(msg["type"] != "mt"){
                            console.log("45:",msg,"username",username);
                            if(msg["to"].indexOf(username) > -1){
                                $rootScope.notify = true;
                                var index=inArrayIndex.get(msg['message']["time"],$rootScope.userData.message,"time");
                                console.log(index,"index");
                                if(index == "none"){
                                    $rootScope.userData.message.push(msg['message']);
                                    $window.localStorage.setItem("userInfo", JSON.stringify($rootScope.userData));
                                }
                            }
                        }
                    }
                });
            });
            return stomClient;
        }else{
            stomClient.disconnect(function(){
                console.log("See you next time!");
            });
        }
    }
});
app.factory('inArrayIndex',function () {
    var factory = {};
    factory.get = function (value,arr,name) {
        var param = name?name:"id";
        for(var i=0;i<arr.length;i++){
            if(arr[i][param]){
                if(arr[i][param] == value){
                    return i
                }
            } else {
                if(arr[i] == value){
                    return i
                }
            }
        }
        return "none";
    };
    return factory;
});
app.factory('objDeepCopy',function () {
    var factory = {};
    factory.get = function (source) {
        var result={};
        for (var key in source) {
            result[key] = source[key]
        }
        return result;
    }
    return factory
});
app.factory('arrDeepCopy',function () {
    var factory = {};
    factory.get = function (arr) {
        return arr.slice(0)
    };
    return factory;
});
app.directive('myDatetime',function () {
    function link($scope, element, attrs) {
        // $(element[0]).datepicker();
        // console.log(element)
        $("#datepicker1,#datepicker2,#datepicker3,#datepicker4,#datepicker5,#datepicker6").datetimepicker({
            format: 'yyyy-mm-dd hh:00:00',
            autoclose: true,
            minView:1,
            todayBtn:true,
            pickDate: true,
            pickTime: true,
            hourStep: 1,
            minuteStep: 15,
            secondStep: 30,
            inputMask: true ,
            beforeShow: function () {
                $('#ui-datepicker-div').css("z-index", 999);
            }
        });
    }
    return {
        restrict: 'A',
        link: link
    };
});
app.directive('myDate',function () {
    function link($scope, element, attrs) {
        // $(element[0]).datepicker();
        console.log(element)
        $("#date1,#date2").datetimepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            minView:2,
            todayBtn:true,
            beforeShow: function () {
                $('#ui-datepicker-div').css("z-index", 999);
            }
        });
    }
    return {
        restrict: 'A',
        link: link
    };
});
app.directive('date',function () {
    function link($scope, element, attrs) {
        // $(element[0]).datepicker();
        $(".date").datetimepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            minView:2,
            todayBtn:true,
            beforeShow: function () {
                $('#ui-datepicker-div').css("z-index", 999);
            }
        });
    }
    return {
        restrict: 'AC',
        link: link
    };
});
app.directive('datetime',function () {
    function link($scope, element, attrs) {
        // $(element[0]).datepicker();
        $(".datetime").datetimepicker({
            format: 'yyyy-mm-dd hh:00:00',
            autoclose: true,
            minView:1,
            todayBtn:true,
            beforeShow: function () {
                $('#ui-datepicker-div').css("z-index", 999);
            }
        });
    }
    return {
        restrict: 'AC',
        link: link
    };
});
