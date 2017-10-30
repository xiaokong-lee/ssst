/**
 * Created by baopengzhang on 2017/6/16.
 */
app.controller('indexCtrl', function ($scope, $rootScope, $http,$ajax,urls,inArrayIndex,$location,$window, $interval) {
    var url = $location.absUrl();
    if(url.indexOf("tk=")>0){
        var tk = url.split("tk=")[1];
        $window.localStorage.setItem("X-CSRFToken", tk);
    }
    // $ajax.get(urls.checkUser, "", function (response) {
    //     if(response.data.data == "not auth"){
    //         $window.localStorage.clear();
    //     }
    // });
    var userInfo = $window.localStorage.getItem("userInfo");
    if(userInfo){
        $rootScope.userData = eval('(' + userInfo + ')');
    } else {
        $rootScope.userData = {
            "isUserAuth": false
        }
    }
});
app.controller('signinCtrl', function ($scope, $rootScope, $location, $window, $ajax, urls) {
    $rootScope.userData = {
        "info":"",
        "isUserAuth": false
    };
    var loginFun = function (url,data) {
        $ajax.post(url, data, function (response) {
            if (response.status == 200) {
                $window.localStorage.setItem("X-CSRFToken", response.data["X-CSRFToken"]);
                $rootScope.userData.info = response.data;
                var signFlag = true;
                if(response.data["sign"] == ""){
                    signFlag = false;
                }
                var my_auth = "";
                var my_auth_flag = false;
                var _url_auth_info = urls.user_auth+"/"+$rootScope.userData.info.id; // 獲取用戶授權信息
                //初始化登錄信息
                $rootScope.userData.message = [];
                $rootScope.userData['info'] = response.data;
                $rootScope.userData['info']['name'] = response.data.username;
                $ajax.get(_url_auth_info, "", function(response_3) {
                    if(response_3.status == 200){
                        if(response_3.data){
                            my_auth = response_3.data;
                            my_auth_flag = true;
                        }
                        $rootScope.userData['my_auth'] = my_auth;
                        $window.localStorage.setItem("userInfo", JSON.stringify($rootScope.userData));
                    }
                });
                $window.localStorage.setItem("userInfo", JSON.stringify($rootScope.userData));
                if(signFlag){
                    $location.path("/forms");
                }else{
                    alert("請完善個人信息！");
                    $location.path("/info");
                }
            }
            else if(response.status == 202){
                alert(response.data.message)
            }
        },function () {
            alert("登錄失敗，請稍後再試！");
        });
    };
    $scope.myLogin = false;
    var stomClient = "";
    $scope.toggle_login = function() {
        $scope.myLogin= !$scope.myLogin;
        if($scope.myLogin){
            document.getElementById("mycode").innerHTML = "";
            var stompUrl = urls.mqtt;
            var stompU="iot";
            var stompP="iot123!";
            var us44;
            var tp_head = '/topic/login/';
            var tp_barcode='na';
            var stom_aa = tp_head+parseInt(Math.random()*1000000000)+'/'+tp_barcode;
            stomClient = stompPackage.stompConnect(stompUrl, stompU, stompP, function () {
                $("#mycode").qrcode({
                    render:"table",
                    width:"200",
                    height:"200",
                    text:stom_aa
                });
                us44=stompPackage.stompSubscribe(stom_aa,function (data) {
                    if(typeof(data) == "string"){
                        var username = data.split(",")[0];
                        var uid = data.split(",")[1];
                        var data = {username:username,uid:uid,type:"web"};
                        loginFun(urls.CodeLogin,data);
                    }
                });
                // stompPackage.stompSend(stom_aa,{},i+" websocket test info...");
            });
        }else{
            stomClient.disconnect(function(){
                console.log("See you next time!");
            });
        }
    };
    $scope.myLoad = false;
    $scope.title='手機掃描，安全登錄';
    $scope.toggle_load = function() {
        var host = $window.location.host;
        $scope.myLoad = !$scope.myLoad;
        if($scope.myLoad){
            $scope.title='扫描二维码免费下载APP';
            angular.element(document.getElementById("login_title")).addClass("download_title");
            $scope.download_title='download_title';
            $("#app_code").html("");
            $("#app_code").qrcode({
                    render:"table",
                    width:"200",
                    height:"200",
                    text:host + "/download.html"
                });
        }else {
            $scope.title='手機掃描，安全登錄';
            angular.element(document.getElementById("login_title")).removeClass("download_title");
        }
    };
    $scope.userAuth = function () {
        if ($scope.username == undefined || $scope.username == "") {
            alert("请输入用户名");
            return;
        } else if ($scope.password == undefined) {
            alert("请输入密码");
            return;
        }
        var data = {username: $scope.username.trim(), password: $scope.password.trim()};
        loginFun(urls.login,data);
    };
    $scope.enterPress = function (evt) {
        var e = evt || $window.event;
        if (e.keyCode == 13) {
            $scope.userAuth();
        }
    };
    $scope.restFunc = function () {
        $scope.username = undefined;
        $scope.password = undefined;
    }
});
app.controller('findpasswordCtrl', function ($scope, $rootScope, screen,$ajax,urls,$interval,$location) {
    $scope.userData.isUserAuth = false;
    $scope.menber_id="";
    $scope.menber_email="";
    $scope.menber_code_num="";
    $scope.timer_="發送驗證碼";
    $scope.submit_form=function () {
        $ajax.post(urls.retrieve_code, {"check_code":$scope.menber_code_num}, function (response) {
            if(response.status==200){
                var path="modifypwd?"+$scope.menber_code_num;
                window.location.href="#/modifypwd?"+$scope.menber_code_num;
                // $location.path("modifypwd?"+$scope.menber_code_num);
            }else {
                alert(response.data.message);
            }
        },function (xhr) {
            if(xhr.status==400){
                alert(xhr.data.message);
            }
        })
    };

    $scope.send_code=function (e) {
        // alert($scope.menber_id);
        // alert($scope.menber_email);
        $scope.menber_data={
            "username":$scope.menber_id,
            "email":$scope.menber_email
        };
        if(!$scope.menber_id){
            alert('工號不能為空');
            return false;
        }
        var reg = /^.+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        var _my_email_tf=reg.test($scope.menber_email);
        if(!_my_email_tf){
            alert('郵箱格式錯誤');
            return false;
        }
        $ajax.post(urls.retrieve_pwd, $scope.menber_data, function (response) {
            if(response.data.message=="Send successfully!"){
                angular.element(".submit_form_code").removeAttr('disabled');
                angular.element(".time_out_button").prop('disabled', true);
                var s=120;
                $scope.timer=$interval(function(){
                    s--;
                    $scope.timer_=s+"s";
                    if(s<=0){
                        angular.element(".time_out_button").removeAttr('disabled');
                        $interval.cancel($scope.timer);
                        $scope.timer_="發送驗證碼";
                    }
                },1000);   //该函数延迟2秒执行
            }else {
                alert(response.data.message);
            }
        }, function (response) {
            if(response.data){
                alert(response.data.message);
            }else {
                alert("請檢查網絡")
            }
        })
    };
    $scope.$on('destroy',function(){
        $interval.cancel($scope.timer);
    });  //在控制器里，添加$on函数

    $scope.myStyle = {
        'width': screen.get().width + "px",
        'height': screen.get().height - 30 + "px"
    }
});
app.controller('modifypwdCtrl', function ($scope, $rootScope, screen,$ajax,urls) {
    $scope.userData.isUserAuth = false;
    $scope.myStyle = {
        'width': screen.get().width + "px",
        'height': screen.get().height - 30 + "px"
    };
    $scope.newpassword="";
    $scope.new2password="";
    angular.element(".form-control").keypress(function (s){
        if(s.keyCode==13){
            $scope.sub_password();
        }
    });
    $scope.sub_password=function () {
        if($scope.newpassword!=$scope.new2password||$scope.newpassword==""||$scope.new2password==""){
            alert("兩次密碼不相同，或為空");
            return false;
        }
        var Href=window.location.href;
        var arr=Href.split("?");
        $scope.codenumber=arr[arr.length-1];  //獲取url傳遞的code值
        $ajax.post(urls.retrieve_code, {"check_code":$scope.codenumber,"new_pwd":$scope.newpassword}, function (response) {
            if(response.status==200){
                dialog_alert_success2("密碼修改成功請重新登錄！","public/login.html");
            }else {
                alert(response.data.message);
            }
        },function (xhr) {
            if(xhr.status==400){
                alert(xhr.data.message);
            }else {
                alert("請檢查網絡")
            }
        })
    }
});
app.controller('downloadCtrl', function ($scope, $rootScope, screen) {
    $scope.userData.isUserAuth = false;
});
app.controller('introductionCtrl', function ($scope, $rootScope, screen) {
    $scope.userData.isUserAuth = false;
    $scope.myStyle = {
        'width': screen.get().width + "px",
        'height': screen.get().height - 30 + "px"
    }
});
app.controller('noneCtrl', function ($scope, $rootScope, screen) {
    $scope.userData.isUserAuth = false;
    $scope.myStyle = {
        'width': screen.get().width + "px",
        'height': screen.get().height - 30 + "px"
    }
});
app.controller('menuCtrl', function ($scope, $rootScope,$location, $window) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.myBar = 'sysMenu';
    $scope.menuGroup = {
        "myMenu": false,
        "sysMenu": true
    };
    $scope.menuToggle = function (param) {
        $scope.myBar = param;
        for (var key in $scope.menuGroup) {
            if (key == param) {
                $scope.menuGroup[key] = true;
            } else {
                $scope.menuGroup[key] = false;
            }
        }
    };
});
app.controller('mymenuCtrl', function ($scope, $rootScope, $window,$location, $ajax, urls, screen, objDeepCopy,inArrayIndex) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.myStyle = {
        "height": (screen.get().height - 30 - 60) + "px"
    };
    $scope.mymenu = [];
    $scope.funcs = [];
    var _url = urls.user_func + "/" + $rootScope.userData.info.id;
    $ajax.get(_url, "", function (response) {
        $scope.funcs = response.data.data.length ? response.data.data : [];
        var _url = urls.mymenu + "/" + $rootScope.userData.info.id;
        $ajax.get(_url, "", function (response) {
            if (response.status == 200) {
                if (response.data.data.my_menu_json) {
                    $scope.mymenu = eval(response.data.data.my_menu_json);
                    for(var i=0;i<$scope.funcs.length;i++){
                        if(inArrayIndex.get($scope.funcs[i].id,$scope.mymenu)>=0){
                            $scope.funcs[i].is_selected = true;
                        } else {
                            $scope.funcs[i].is_selected = false;
                        }
                    }
                } else {
                    $scope.mymenu = [];
                }
            }
        });

    });
    $scope.setSelected = function (evt, param,$obj,index) {
        if(param==1 && $obj.is_selected == true){
            alert("該功能已經在我的菜單中！");
            return
        }
        var menu = (param == 1) ? document.getElementById("funcs") : document.getElementById("mymenu");
        angular.element(menu).find(".select").removeClass("select");
        angular.element(evt.target).parent().addClass("select")
        if (param == 1) {
            $scope.left_index = index;
        } else {
            $scope.right_index = index;
        }
    };
    $scope.transferArrow = function (evt, arrow,index) {
        if (arrow == "down") {
            var _index = parseInt(index) + 1;
        } else {
            var _index = parseInt(index) - 1;
        }
        var c = $scope.mymenu[index];
        var d = $scope.mymenu[_index];
        $scope.mymenu[_index] = c;
        $scope.mymenu[index] = d;
    };
    $scope.funcsTransferLeft = function () {
        if ($scope.right_index<0) {
            alert("請先選擇一個菜單！");
            return
        }
        var func = $scope.mymenu[$scope.right_index]
        $scope.mymenu.splice($scope.right_index, 1)
        for(var i=0;i<$scope.funcs.length;i++){
            if($scope.funcs[i].id == func.id){
                $scope.funcs[i].is_selected = false;
                $scope.right_index=""
                return
            }
        }
    };
    $scope.funcsTransferRight = function () {
        if ($scope.left_index<0) {
            alert("請先選擇一項功能！");
            return
        }
        var func = $scope.funcs[$scope.left_index]
        $scope.mymenu.push(func);
        // $scope.funcs.splice($scope.left_index, 1);
        angular.element(document.getElementById("funcs")).find(".select").removeClass("select")
        for(var i=0;i<$scope.mymenu.length;i++){
            if($scope.mymenu[i].id == $scope.funcs[$scope.left_index].id){
                $scope.mymenu[i].is_selected = true;
                $scope.left_index=""
                return
            }
        }
    };
    $scope.editFunc = function (evt,index) {
        $scope.func_show = true;
        $scope.func = {};
        $scope.func_index = index;
        $scope._func = objDeepCopy.get($scope.mymenu[$scope.func_index]);
    };
    $scope.saveFunc = function () {
        $scope.mymenu[$scope.func_index] = $scope._func;
        $scope.func_show = false;
    };
    $scope.cancelFunc = function () {
        $scope.func_show = false;
    };
    $scope.saveMymenu = function () {
        var data = {"my_menu_json": JSON.stringify($scope.mymenu)}
        var _url = urls.mymenu + "/" + $rootScope.userData.info.id;
        $ajax.put(_url, data, function (response) {
            if (response.status == 200) {
                alert("修改我的菜單成功！")
                var sidebar = $rootScope.userData.sidebar;
                for(var i=0; i<sidebar.length; i++){
                    for(var j=0;j<sidebar[i]["content"].length; j++){
                        for(var k=0;k<sidebar[i]["content"][j].list.length;k++){
                            var index = inArrayIndex.get(sidebar[i].content[j].list[k].id,$scope.mymenu);
                            if(index>=0){
                                sidebar[i].content[j].list[k].isMyMenu = true;
                            } else {
                                sidebar[i].content[j].list[k].isMyMenu = false;
                            }
                        }
                    }
                }
                $rootScope.userData.myMenu = $scope.mymenu;
                $rootScope.userData.sidebar = sidebar;
                $window.localStorage.setItem("userInfo", JSON.stringify($rootScope.userData));
            }
        }, function (response) {
            alert("修改我的菜單失敗，請稍後重試！")
        })
    };
});
app.controller('systemmenuCtrl', function ($scope, $rootScope, $window,$location, $ajax, urls,icons2, $compile, screen, objDeepCopy) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.myStyle = {
        "minHeight": (screen.get().height - 30 - 60) + "px"
    };
    $scope.icons = icons2.data;
    $ajax.get(urls.system_func, "", function (response) {
        if (response.status == 200) {
            $scope.funcs = response.data.data;
        }
    });
    getData(urls.systemmenu, 'first')
    function getData(url, param, action) {
        $ajax.get(url, "", function (response) {
            var data = response.data.data;
            if (!data.length) {
                alert("該版本系統菜單為空！")
                // $scope.system = system;
            }
            for (var i = 0; i < data.length; i++) {
                if (param) {
                    if (data[i].enabled) {
                        $scope.systemMenu = data[i];
                        $scope.systemMenu.status = "當前";
                        $scope.system = eval(data[i].menu_json);
                        return
                    }
                } else {
                    $scope.systemMenu = data[i];
                    $scope.system = eval(data[i].menu_json);
                    if (data[i].enabled == 1) {
                        $scope.systemMenu.status = "當前";
                    } else {
                        $scope.systemMenu.status = "";
                    }
                }
            }
            if(action){
                $rootScope.userData.sidebar = $scope.systemMenu;
                $window.sessionStorage.setItem("userInfo", JSON.stringify($rootScope.userData));
            }
        });
    }
    $scope.setSystem = function (param) {
        var _url = urls.systemmenu + "/" + param;
        getData(_url);
    };
    $scope.toggleList = function (evt) {
        if(evt.stopPropagation){
            evt.stopPropagation()
        }
        var obj = evt.target;
        if(evt.currentTarget.nodeName == "BUTTON"){
            obj = evt.currentTarget;
        }
        if (angular.element(obj).parent().siblings("ul").hasClass("shown")) {
            angular.element(obj).parent().siblings("ul").removeClass("shown");
            angular.element(obj).children("i").attr("class","fa fa-plus")
        } else {
            angular.element(obj).parent().siblings("ul").addClass("shown");
            angular.element(obj).children("i").attr("class","fa fa-minus")
        }
    };
    $scope.setSelected = function (evt, param,$obj) {
        if(param==1 && $obj['selected'] == "true"){
            alert("該功能已經在我的菜單中！");
            return
        }
        var menu = (param == 1) ? document.getElementById("funcs") : document.getElementById("system");
        angular.element(menu).find(".select").removeClass("select");
        angular.element(evt.target).parent().addClass("select")
        if (param == 1) {
            $scope.left_index = angular.element(evt.target).parent().attr("data-index");
        } else {
            if (angular.element(evt.target).hasClass("func")) {
                $scope.funcSelected = true;
                $scope.selected_index = angular.element(evt.target).parent().attr("data-index");
                $scope.right_index = angular.element(evt.target).parent().attr("data-parent")
            } else {
                $scope.funcSelected = false;
                var parent = angular.element(evt.target).parent().attr("data-parent");
                var index = angular.element(evt.target).parent().attr("data-index")
                if (parent && index) {
                    $scope.right_index = parent + "[" + index + "].list";
                }
            }
        }
    };
    $scope.transferArrow = function (evt, arrow,index,parent) {
        if (arrow == "down") {
            var _index = parseInt(index) + 1;
        } else {
            var _index = parseInt(index) - 1;
        }
        eval("var c=$scope.system" + parent + "[" + index + "]")
        c.index = _index;
        eval("var d=$scope.system" + parent + "[" + _index + "]")
        d.index = index;
        eval("$scope.system" + parent + "[" + index + "]=d")
        eval("$scope.system" + parent + "[" + _index + "]=c")
    }
    $scope.moduleArrow = function (evt,arrow,index) {
        if (arrow == "down") {
            var _index = parseInt(index) + 1;
        } else {
            var _index = parseInt(index) - 1;
        }
        var c = $scope.system[index];
        var d = $scope.system[_index];
        c.index = _index;
        d.index = index;
        $scope.system[index] = d;
        $scope.system[_index] = c;
    }
    $scope.listArrow = function (evt,arrow,index,parent) {
        if (arrow == "down") {
            var _index = parseInt(index) + 1;
        } else {
            var _index = parseInt(index) - 1;
        }
        eval("var c=$scope.system" + parent + "[" + index + "]")
        c.index = _index;
        eval("var d=$scope.system" + parent + "[" + _index + "]")
        d.index = index;
        eval("$scope.system" + parent + "[" + index + "]=d")
        eval("$scope.system" + parent + "[" + _index + "]=c")
    };
    $scope.editModule = function (evt,index) {
        $scope.module_show = true;
        $scope.module_action = "edit";
        $scope.module_index = index;
        $scope._module = objDeepCopy.get($scope.system[index]);
    };
    $scope.createModule = function (evt) {
        $scope.module_show = true;
        $scope.module_action = "create";
        $scope._module = {}
    };
    $scope.removeModule = function (evt,index) {
        if ($scope.system[index].content.length) {
            alert("該模塊下存在子模塊，不能刪除！")
        } else {
            $scope.system.splice(index, 1)
            for (var i = 0; i < $scope.system.length; i++) {
                $scope.system[i].index = i;
            }
            $scope.system.splice(index, 1)
        }
    }
    $scope.editList = function (evt,index,parent) {
        $scope.list_show = true;
        $scope.list_action = "edit";
        $scope.list_index = "$scope.system" + parent + "[" + index + "]";
        $scope._list = objDeepCopy.get(eval($scope.list_index))
    };
    $scope.createList = function (evt,index) {
        $scope.list_show = true;
        $scope.list_action = "create";
        $scope.module_index = index;
        $scope._list = {}
    };
    $scope.removeList = function (evt,index,parent) {
        eval("var len=$scope.system" + parent + "[" + index + "].list.length")
        if (len) {
            alert("該子模塊下存在菜單，不能刪除！")
        } else {
            eval("$scope.system" + parent + ".splice(" + index + ",1)")
            // eval("for(var i=0;i<$scope.system" + parent + ".length;i++){$scope.system" + parent + "[i]['index']=i}")
            // eval("$scope.system" + parent + ".splice(" + index + ",1)")
        }
    }
    $scope.editFunc = function (evt,index,parent) {
        $scope.func_show = true;
        $scope.func = {};
        $scope.func_index = "$scope.system" + parent + "[" + index + "]";
        $scope._func = objDeepCopy.get(eval($scope.func_index))
    };
    $scope.saveModule = function (evt) {
        if (!$scope._module.title) {
            alert("請完整填寫表單！");
            return;
        }
        if ($scope.module_action == "edit") {
            $scope.system[$scope.module_index] = $scope._module;
        } else {
            var index = $scope.system.length;
            $scope._module['index'] = index;
            $scope._module['content'] = []
            $scope.system.push($scope._module)
        }
        $scope.module_show = false;
    };
    $scope.cancelModule = function (evt) {
        $scope.module_show = false;
    };
    $scope.getListIcon = function (name) {
        $scope._list.icon = name;
    };
    $scope.saveList = function (evt) {
        if (!$scope._list.name || !$scope._list.icon) {
            alert("請完整填寫表單！")
            return
        }
        if ($scope.list_action == "edit") {
            eval($scope.list_index + "=$scope._list");
        } else {
            var index = $scope.module_index
            $scope._list['index'] = $scope.system[index]['content'].length;
            $scope._list['list'] = []
            $scope.system[index].content.push($scope._list)
        }
        $scope.list_show = false;
    };
    $scope.cancelList = function (evt) {
        $scope.list_show = false;
    };
    $scope.saveFunc = function (evt) {
        if (!$scope._func.name) {
            alert("請完整填寫表單！")
            return
        }
        eval($scope.func_index + "=$scope._func");
        $scope.func_show = false;
    };
    $scope.cancelFunc = function (evt) {
        $scope.func_show = false;
    };
    $scope.funcsTransferLeft = function (evt) {
        if ($scope.funcSelected<0) {
            alert("請選擇一個菜單項！")
            return
        }
        eval("var func = $scope.system" + $scope.right_index + "[" + $scope.selected_index + "]");
        eval("$scope.system" + $scope.right_index + ".splice(" + $scope.selected_index + ",1)");
        eval("for(var i=0;i<$scope.system" + $scope.right_index + ".length;i++){$scope.system" + $scope.right_index + "[i]['index']=i}")
        $scope.funcSelected = ""
        for(var i=0;i<$scope.funcs.length;i++){
            if($scope.funcs[i].function_id==func.id){
                $scope.funcs[i].selected = false;
                return
            }
        }
    };
    $scope.funcsTransferRight = function (evt) {
        if ($scope.left_index<0) {
            alert("請選擇一項功能！");
            return
        }
        if ($scope.right_index<0) {
            alert("請選擇一個菜單項！");
            return
        }
        var func = {
            "name": $scope.funcs[$scope.left_index].name,
            "id": $scope.funcs[$scope.left_index].function_id,
            "code": $scope.funcs[$scope.left_index].code,
            "full_code": $scope.funcs[$scope.left_index].full_code
        };
        eval("$scope.system" + $scope.right_index + ".push(func)");
        eval("for(var i=0;i<$scope.system" + $scope.right_index + ".length;i++){$scope.system" + $scope.right_index + "[i]['index']=i}")
        $scope.funcs[$scope.left_index].selected = true;
        $scope.left_index = "";
        angular.element(document.getElementById("funcs")).find(".select").removeClass("select")
    };
    $scope.saveSystem = function (evt, status) {
        var data = {"menu_json": JSON.stringify($scope.system)};
        if (status) {
            data["status"] = "enabled";
        } else {
            data["status"] = "disable";
        }
        var _url = urls.systemmenu + "/" + $scope.systemMenu.menu_id;
        $ajax.put(_url, data, function (response) {
            if (response.data.status == "202") {
                if (status) {
                    $scope.systemMenu.enabled = 1;
                    alert("設置為當前系統菜單成功！請重新登錄后生效！");
                    getData(urls.systemmenu,"",status);
                } else {
                    alert("系統菜單保存成功！")
                }
            } else {
                alert("系統菜單保存失敗，請稍後重試！")
            }
        })
    };
    $scope.saveAsSystem = function (evt) {
        var data = {
            "projectID": 2,
            "projectName": "ST",
            "menu_json": JSON.stringify($scope.system),
            "status": "enabled"
        };
        var _url = urls.systemmenu + "/" + $scope.systemMenu.menu_id;
        $ajax.post(_url, data, function (response) {
            if (response.data.status == "201") {
                alert("系統菜單保存成功！請重新登錄后生效！")
                getData(_url);
            } else {
                alert("系統菜單保存失敗，請稍後重試！");
            }
        });
    };
});
app.controller('messagelistCtrl', function ($scope, $rootScope, $window,$location) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.myGroup = 'person';
    $scope.groups = {
        "person": true,
        "group": false
    };
    $scope.groupToggle = function (param) {
        $scope.myGroup = param;
        for (var key in $scope.groups) {
            if (key == param) {
                $scope.groups[key] = true;
            } else {
                $scope.groups[key] = false;
            }
        }
    }
});
app.controller('allmessageCtrl', function ($scope, $rootScope, $window,$location, $http) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableName = 'allmessage';
    $scope._data = [
        {
            "no": "20170501002",
            "submitor": "張三",
            "date": "2017-05-01",
            "type": "12",
            "state": "待辦理",

        },
        {
            "no": "20170501002",
            "submitor": "張三",
            "date": "2017-05-01",
            "type": "12",
            "state": "待辦理",
        },
        {
            "no": "20170501002",
            "submitor": "張三",
            "date": "2017-05-01",
            "type": "12",
            "state": "待辦理",
        },
        {
            "no": "20170501002",
            "submitor": "張三",
            "date": "2017-05-01",
            "type": "12",
            "state": "待辦理",
        },
        {
           "no": "20170501002",
            "submitor": "張三",
            "date": "2017-05-01",
            "type": "12",
            "state": "待辦理",
        },
        {
            "no": "20170501002",
            "submitor": "張三",
            "date": "2017-05-01",
            "type": "12",
            "state": "待辦理",
        }
    ];
});
app.controller('usersCtrl', function ($scope, $rootScope, $window, $location, urls, $ajax, inArrayIndex) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableKeys = ['user','role'];
    $ajax.get(urls.roles, "", function (response) {
        $scope.roles = response.data;
    });
    function getData() {
        $ajax.get(urls.users, "", function (response) {
            $scope.datas = response.data;
        });
    }
    getData();
    $scope.getSelectedCount = function () {
        $scope.selectedFuncs = angular.element(document.getElementById("user_table")).find("[checked='checked']").length;
    };
    function getSelectRole() {
        var arr = [];
       for(var i=0;i<$scope.roles.length;i++){
            if($scope.roles[i].checked){
                arr.push($scope.roles[i].id)
            }
        }
        return arr;
    }
    function setSelectRole(data) {
        if(!data || !data.length) {data=[]}
        for(var i=0;i<$scope.roles.length;i++){
            if(inArrayIndex.get($scope.roles[i].id,data)>=0){
                $scope.roles[i].checked=true;
            } else {
                $scope.roles[i].checked =false;
            }
        }
    }
    $scope.editUser = function (id) {
        $scope.modal_show = true;
        $scope.action = "edit";
        var _url = urls.users + "/" + id;
        $ajax.get(_url, "", function (response) {
            $scope.user ={"user":{"id":response.data.user[0][0],"last_name":response.data.user[0][2]},"role":{}};
            var arr = [];
            for(var i=0;i<response.data.role.length;i++){
                arr.push(response.data.role[i][0]);
            }
            setSelectRole(arr);
        });
    };
    $scope.deleteUser = function (id) {
        var conf=confirm("確定要刪除這個用戶綁定的所有角色嗎？");
        if(conf){
            var _url = urls.users+"/"+id;
            $ajax.delete(_url,"",function (response) {
                if(response.status==200){
                    alert("刪除用戶綁定的所有角色成功！")
                    getData()
                }
            });
        }
    };
    $scope.createUser = function () {
        $scope.action = "create";
        $scope.modal_show = true;
        $scope.data_ready = false;
        $ajax.get(urls.users + "?void=true", "", function (response) {
            if (response.status == 200) {
                $scope.unbingUsers = response.data;
                $scope.data_ready = true;
            }
        });
        $scope.user = {"role":{},"user":{"id":""}};
        setSelectRole("")
    };
    $scope.saveUser = function (evt) {
        $scope.user.role ={"id":getSelectRole()};
        if (!$scope.user.role.id.length) {
            alert("請選擇要綁定的角色！");
            return
        }
        if(!$scope.user.user.id){
            alert("請選擇要綁定的用戶！");
            return
        }
        var data = {"user.id":$scope.user.user.id,"role.id":"["+$scope.user.role.id.toString()+"]"}
        angular.element(evt.target).prop("disabled", "disabled");
        if ($scope.action == "create") {
            $ajax.post(urls.users, data, function (response) {
                if (response.status == 201 || response.status == 200) {
                    alert("添加角色成功！新角色將在用戶下次登錄時生效！");
                    $scope.modal_show = false;
                    getData();
                    angular.element(evt.target).removeProp("disabled");
                    var index = inArrayIndex.get($scope.user.user.id,$scope.unbingUsers)
                    $scope.unbingUsers.splice(index,1)
                }
            }, function (response) {
                alert("添加角色失敗，請稍後重試！");
                angular.element(evt.target).removeProp("disabled");
            })
        } else {
            var _url = urls.users + "/" + $scope.user.user.id;
            $ajax.put(_url, data, function (response) {
                if (response.status == 201 || response.status == 200) {
                    alert("修改角色成功！新角色將在用戶下次登錄時生效！");
                    $scope.modal_show = false;
                    getData();
                    angular.element(evt.target).removeProp("disabled");
                }
            }, function (response) {
                alert("修改角色失敗，請稍後重試！")
                angular.element(evt.target).removeProp("disabled");
            })
        }
    };
    $scope.cancelUser = function () {
        $scope.modal_show = false;
    }
});
app.controller('rolesCtrl', function ($scope, $rootScope, $routeParams, $window, $compile, urls, $ajax, $location, inArrayIndex) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableKeys = ['role_name','role_desc','create_date'];
    $scope.dataUrl=urls.roles;
    $ajax.get(urls.functions, "", function (response) {
        if (response.status == 200) {
            $scope.funcs = response.data;
        }
    });
    function getData() {
        $ajax.get(urls.roles, "", function (response) {
            $scope.datas = response.data;
        });
    }
    getData();
    $scope.getSelectedCount = function () {
        $scope.selectedFuncs = angular.element(document.getElementById("func_table")).find("[checked='checked']").length;
    };
    function getSelectFunc() {
        var arr = [];
        var inputs = document.getElementById("func_table").getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (angular.element(inputs[i]).prop("checked") == "checked" || angular.element(inputs[i]).prop("checked") == true) {
                arr.push(angular.element(inputs[i]).parent().parent().attr("data-id"))
            }
        }
        return arr;
    }
    function setSelectFunc(data) {
        if (!data) {data = []}
        var inputs = document.getElementById("func_table").getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            var id = angular.element(inputs[i]).parent().parent().attr("data-id")
            if (inArrayIndex.get(id, data) >= 0) {
                angular.element(inputs[i]).prop("checked", "checked")
            } else {
                angular.element(inputs[i]).removeProp("checked")
            }
        }
    }
    $scope.editRole = function (id) {
        $scope.modal_show = true;
        $scope.action = "edit";
        var _url = urls.roles + "/" + id;
        $ajax.get(_url, "", function (response) {
            $scope.role = response.data;
            setSelectFunc(eval($scope.role.func_list.replace("\"", "")))
        });
    };
    $scope.deleteRole = function (id) {
        var conf = confirm("確定要刪除這個角色嗎？");
        if(conf){
            var _url = urls.roles + "/" + id;
            $ajax.delete(_url, "", function (response) {
                if(response.status==200){
                    alert("刪除角色成功！")
                    getData();
                }
            });
        }
    };
    $scope.createRole = function () {
        $scope.modal_show = true;
        $scope.action = "create";
        $scope.role = {};
        $scope.role.is_active = true;
        setSelectFunc()
    };
    $scope.saveRole = function (evt) {
        var list = getSelectFunc();
        if (!list.length) {
            alert("請選擇角色的功能！");
            return
        } else {
            $scope.role.func_list = "[" + list.toString() + "]";
        }
        if (!$scope.role.role_name || !$scope.role.role_desc || !$scope.role.func_list) {
            alert("請完整填寫表單！");
            return
        }
        angular.element(evt.target).prop("disabled", "disabled");
        if ($scope.action == "create") {
            $scope.role.project = 2;
            $ajax.post(urls.roles, $scope.role, function (response) {
                if (response.status == 201 || response.status == 200) {
                    alert("添加角色成功！");
                    $scope.modal_show = false;
                    getData();
                } else {
                    alert(JSON.stringify(response.data.message))
                }
                angular.element(evt.target).removeProp("disabled");
            }, function (response) {
                alert("創建角色失敗，請稍後重試！");
                angular.element(evt.target).removeProp("disabled");
            })
        } else {
            var _url = urls.roles + "/" + $scope.role.id;
            $ajax.put(_url, $scope.role, function (response) {
                if (response.status == 201 || response.status == 200) {
                    alert("修改角色成功！");
                    $scope.modal_show = false;
                    getData();
                } else {
                    alert(JSON.stringify(response.data.message))
                }
                angular.element(evt.target).removeProp("disabled");
            }, function (response) {
                alert("修改角色失敗，請稍後重試！")
                angular.element(evt.target).removeProp("disabled");
            })
        }
    };
    $scope.cancelRole = function () {
        $scope.modal_show = false;
    };
    $scope.setFuncRole = function (id) {
        var funcs = [parseInt(id)];
        $scope.func_role.funcs = funcs;
    };
    $scope.bindingRole = function () {
        $scope.binding_show = true;
        $scope.selected_func = "";
        $scope.func_role = {"funcs":[],"roles":[]}
        $ajax.get(urls.functions,"",function (response) {
            if(response.status==200){
                $scope.funcs = response.data;
            }
        });
        $ajax.get(urls.roles,"",function (response) {
            if(response.status==200){
                $scope.roles = response.data;
            }
        })
    };
    $scope.saveBindRole = function () {
        if(!$scope.func_role.funcs[0]>0){
            alert("請選擇一個功能！")
            return
        }
        var roles = [];
        for(var i=0;i<$scope.roles.length;i++){
            if($scope.roles[i].checked == true || $scope.roles[i].checked == "true"){
                roles.push($scope.roles[i].id)
            }
        }
        if(!roles.length){
            alert("請選擇角色！")
            return
        }
        $scope.func_role.roles = roles;
        console.log($scope.func_role)
        $scope.binding_show = false;
    };
    $scope.cancelBindRole = function () {
        $scope.binding_show = false;
    }
});
app.controller('funcsCtrl', function ($scope, $rootScope, urls, $ajax, $window,$location) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableKeys = ['name','code','full_code','parent_code','desc','desc2','create_date'];
    function getData() {
        $ajax.get(urls.functions, "", function (response) {
            $scope.datas = response.data;
        });
    }
    getData();
    $scope.editFunc = function (id) {
        $scope.modal_show = true;
        $scope.action = "edit";
        var _url = urls.functions + "/" + id;
        $ajax.get(_url, "", function (response) {
            $scope.func = response.data;
        });
    };
    $scope.createFunc = function (evt) {
        $scope.modal_show = true;
        $scope.action = "create";
        $scope.func = {"is_active":true};
    };
    $scope.saveFunc = function (evt) {
        if (!$scope.func.name || !$scope.func.code || !$scope.func.desc || !$scope.func.desc2 || !$scope.func.parent_code) {
            alert("請完整填寫表單！");
            return
        }
        angular.element(evt.target).prop("disabled", "disabled");
        // $scope.func.is_active = angular.element(document.getElementById("funcStatus")).prop("checked");
        if ($scope.action == "edit") {
            var _url = urls.functions + "/" + $scope.func.id;
            $ajax.put(_url, $scope.func, function (response) {
                if (response.status == 200 || response.status == 201) {
                    alert("修改成功！")
                    getData();
                    angular.element(evt.target).removeProp("disabled");
                }
                $scope.modal_show = false;
            }, function (response) {
                alert(response.data)
                angular.element(evt.target).removeProp("disabled");
            })
        } else {
            $scope.func.is_active = true;
            $scope.func.project = 2;
            $scope.func.parent_id = 19;
            $scope.func.definer = $rootScope.userData.info.id;
            $ajax.post(urls.functions, $scope.func, function (response) {
                $scope.modal_show = false;
                if (response.status == 200 || response.status == 201) {
                    alert("添加成功！")
                    getData();
                    angular.element(evt.target).removeProp("disabled");
                }
            }, function (response) {
                alert(JSON.stringify(response))
                angular.element(evt.target).removeProp("disabled");
            })
        }
    };
    $scope.cancelFunc = function (evt) {
        $scope.func = {};
        $scope.modal_show = false;
    };
});
app.controller('tmplsCtrl', function ($scope, $rootScope, $window, $ajax,$location, urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $ajax.get(urls.tmplcategory, "", function (response) {
        $scope.category = response.data.data;
    });
    $ajax.get(urls.tmpls +"?type=0", "", function (response) {
        $scope.tmpls = response.data.data;
        $scope.tmplsAll = response.data.data;
    });
    /**电子表单搜索功能**/
    $scope.tmplSearch = function (evt) {
        var keyWord = $scope.keyWord.trim().toUpperCase();
        var temp = [];
        for(var i=0;i<$scope.tmplsAll.length;i++){
            var name = $scope.tmplsAll[i]["table_name"].toUpperCase();
            if(name.indexOf(keyWord)>-1){
                temp.push($scope.tmplsAll[i]);
            }
        }
        $scope.tmpls = temp;
    };
    $scope.enterPress = function (evt) {
        var e = evt || $window.event;
        if (e.keyCode == 13) {
            $scope.tmplSearch();
        }
    };
    /**电子表单分类**/
    $scope.tmplFilter = function (evt,param) {
        var btn = document.getElementsByClassName("btn");
        angular.element(btn).removeClass("active");
        angular.element(evt.target).addClass("active");
        var type = "table_type";
        if(param == 0){$scope.tmpls  = $scope.tmplsAll; return;}
        var temp = [];
        for(var i=0;i<$scope.tmplsAll.length;i++){
            if(param == $scope.tmplsAll[i][type]){
                temp.push($scope.tmplsAll[i]);
            }
        }
        $scope.tmpls = temp;
    };
});
app.controller('tmplCtrl', function ($scope, $rootScope, urls, $ajax, $window, $http, $routeParams, icons, $compile, $location, inArrayIndex, screen,$sce) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    console.log($rootScope.userData)
    $scope.static_url = urls.host;
    $scope.myStyle = {
        "height": (screen.get().height) + "px"
    };
    var routeParams = $routeParams.id.toString().replace(":", "");
    var id=routeParams;
    if(routeParams.indexOf("&type=")>=0){
        var params = routeParams.split("&type=");
        id=params[0];
        $scope.preview = true;
    }
    var _url = urls.tmpls + "/" + id;
    $ajax.get(_url, "", function (response) {
        $scope.formTitle = response.data.data[0].table_name;
        $scope.formId = response.data.data[0].id;
        $scope.formType = response.data.data[0].desc;
        if($scope.formType == "general"){
            eval("$scope.form="+response.data.data[0].table_content);
            console.log("-----form------",$scope.form)
            for(var i=0;i<$scope.form.table.length;i++){
                for(var j=0;j<$scope.form.table[i].list.length;j++){
                    if($scope.form.table[i].list[j].fixed && $scope.form.table[i].list[j].value){
                        $scope.form.table[i].list[j].text = $sce.trustAsHtml($scope.form.table[i].list[j].value.toString())
                    }
                    if(!$scope.form.table[i].list[j].fixed && $scope.form.table[i].list[j].style){
                        var style={"textAlign":"center"};
                        style['fontSize']=$scope.form.table[i].list[j].style.fontSize?$scope.form.table[i].list[j].style.fontSize:"12px";
                        style['textAlign']=$scope.form.table[i].list[j].style.textAlign?$scope.form.table[i].list[j].style.textAlign:"center";
                        $scope.form.table[i].list[j].input['style']=style;
                    }
                }
            }
            if($scope.form.dataSource){
                var dataSource = $scope.form.dataSource[0]
                var _url = urls.dataParser;
                $ajax.get(_url,"",function (response) {
                    if(response.status==200){
                        var data = response.data.data[0];
                        for(var s=0;s<dataSource.fill.length;s++){
                            var key=dataSource.fill[s].key;
                            var name=dataSource.fill[s].name;
                            // angular.element(document.getElementById("tmpl")).find("input[name='"+key+"']").val(data[name]).prop("readonly","readonly")
                            for(var i=0;i<$scope.form.table.length;i++){
                                for(var j=0;j<$scope.form.table[i].list.length;j++){
                                    if($scope.form.table[i].list[j].name==key){
                                        $scope.form.table[i].list[j].value=data[name];
                                        $scope.form.table[i].list[j].readonly=true;
                                    }
                                }
                            }
                        }
                    }
                })
            }
            function setCacuRule(method,key,data) {
                for(var i=0;i<$scope.form.table.length;i++){
                    for(var j=0;j<$scope.form.table[i].list.length;j++){
                        if($scope.form.table[i].list[j].name==key){
                            $scope.form.table[i].list[j]['cacuRule'] = {"method":method,"data":data};
                        }
                    }
                }
            }
            if($scope.form.cacuRules){
                var cacuRules = $scope.form.cacuRules;
                for(var i=0;i<cacuRules.length;i++){
                    for(var j=0;j<cacuRules[i].steps.length;j++){
                        if(cacuRules[i].steps[j].param1){
                            setCacuRule('tragger',cacuRules[i].steps[j].param1,cacuRules[i].target)
                        }
                        if(cacuRules[i].type=='defined' && cacuRules[i].steps[j].param2){
                            setCacuRule('tragger',cacuRules[i].steps[j].param2,cacuRules[i].target)
                        }
                    }
                    if(cacuRules[i].target){
                        setCacuRule('get',cacuRules[i].target,cacuRules[i].steps)
                    }
                }
                console.log($scope.form)
            }
        } else {
            $scope.form = {
                "UserName":$scope.userData.info.chinese_name,
                "UserID":$scope.userData.info.username,
                "Department":$scope.userData.info.org,
                "DepartCode":"N/A",
                "ApplyDate":new Date().toLocaleDateString()
            };
            var _url=urls.acUsers+"/"+$rootScope.userData.info.id;
            $ajax.get(_url,"",function (response) {
                if(response.status==200){
                    $scope.form.DepartCode=response.data.org[0].org_code;
                }
            });
        }
        $scope.workflow_type = response.data.data[0].workflow_type;
        if(response.data.data[0].workflow_content){
            var content = response.data.data[0].workflow_content;
            $scope.routerUsers = [];
            for(var i=0;i<content.length;i++){
                var obj = {"id":content[i].id,"name":content[i].name,"index":i,"userList":[]}
                $scope.routerUsers.push(obj);
            }
        }
    });

    $scope.fillData = function (evt,data) {
        if(!data || !data['fill'] || !data['match']) return
        var value = angular.element(evt.target).val().trim();
        if(!value) return
        var _url = urls.dataParser+"?UserID="+value;
        $ajax.get(_url,"",function (response) {
            if(response.status==200){
                var _data = response.data.data[0];
                for(var i=0;i<data.fill.length;i++){
                    var key = data.fill[i].key;
                    var name = data.fill[i].name;
                    if(_data[name]){
                        angular.element(document.getElementById("tmpl")).find("input[name='"+key+"']").val(_data[name])
                    }
                }
            }
        })
    };
    function getSelectIndex() {
        var trs=document.getElementById("tmpl").getElementsByTagName("tr");
        for(var i=0;i<trs.length;i++){
            if(angular.element(trs[i]).hasClass("selected")){
                return i;
            }
        }
        return -1;
    }
    $scope.insertColumn =function () {
        var selected_index = getSelectIndex();
        if(selected_index<0){
            alert("請先選擇一行！")
            return
        }
        var length=$scope.form.table.length;
        var column = angular.copy($scope.form.table[selected_index]);
        var time_flag=new Date().getTime();
        for(var i=0;i<column.list.length;i++){
            var name=column.list[i].name;
            column.list[i].name=name+"_"+time_flag;
            if(column.list[i].dataSource){
                if(column.list[i].dataSource.match){
                    column.list[i].dataSource.match[0].key = column.list[i].dataSource.match[0].key+"_"+time_flag;
                }
                if(column.list[i].dataSource.fill){
                    for(var j=0;j<column.list[i].dataSource.fill.length;j++){
                        column.list[i].dataSource.fill[j].key = column.list[i].dataSource.fill[j].key+"_"+time_flag;
                    }
                }
            }
        }
        $scope.form.table.splice(selected_index+1,length-column,column)
        for(var i=selected_index;i<$scope.form.table.length;i++){
            $scope.form.table[i].index=i;
        }
        angular.element(document.getElementById("tmpl")).find(".selected").removeClass("selected");
    };
    $scope.appendColumn = function () {
        var selected_index = getSelectIndex();
        if(selected_index<0){
            alert("請先選擇一行！");
            return
        }
        var column = angular.copy($scope.form.table[selected_index]);
        var time_flag=new Date().getTime();
        for(var i=0;i<column.list.length;i++){
            var name=column.list[i].name;
            column.list[i].name=name+"_"+time_flag;
            if(column.list[i].dataSource){
                if(column.list[i].dataSource.match){
                    column.list[i].dataSource.match[0].key = column.list[i].dataSource.match[0].key+"_"+time_flag;
                }
                if(column.list[i].dataSource.fill){
                    for(var j=0;j<column.list[i].dataSource.fill.length;j++){
                        column.list[i].dataSource.fill[j].key = column.list[i].dataSource.fill[j].key+"_"+time_flag;
                    }
                }
            }
        }
        var length = $scope.form.table.length;
        column.index =length;
        $scope.form.table.push(column)
    };
    $scope.removeColumn = function () {
        var selected_index = getSelectIndex();
        if(selected_index<0){
            alert("請先選擇一行！")
            return
        }
        for(var i=0;i<angular.element(document.getElementById("tmpl")).find(".selected").find("td").length;i++){
            if(angular.element(document.getElementById("tmpl")).find(".selected").find("td").eq(i).prop("rowspan")>1){
                alert("選中行存在跨行單元格，無法刪除！");
                return
            }
        }
        $scope.form.table.splice(selected_index,1)
        for(var i=0;i<$scope.form.table.length;i++){
            $scope.form.table[i].index = i;
        }
    };
    $scope.files_0 = [];
    $scope.files = [];
    $scope.addFile = function (evt,param) {
        var file_id="filename"+param;
        var file = document.querySelector("#"+file_id).files[0];
        if (file) {
            var name = file.name;
            var type = file.name.substr(file.name.length-4,4).replace(".","");
            if(param==1){
                if(type != "pdf"){
                    alert("上傳文件格式要求為pdf格式！")
                } else {
                    $scope.files_0[0] = {"name": name,"type":type,"file":file};
                    angular.element(document.getElementById(file_id)).val("");
                }
            } else {
                if(type !="pdf" && type !="ppt" && type !="pptx" && type!="docx" && type!="doc" && type!="xlsx" && type!="xls" && type!="png" && type!="jpg"){
                    type = 'oth'
                }
                if ($scope.files.length<=4) {
                    $scope.files.push({"name":name,"type":type,"file":file});
                    angular.element(document.getElementById(file_id)).val("");
                } else {
                    alert("最多只能上傳5個附件！")
                }
            }
        } else {
            alert("請先選擇文件")
        }
    };
    $scope.removeFile = function (param,index) {
        if(param==1){
            $scope.files_0.splice(0,1);
            angular.element(document.getElementById("filename0")).val("")
        } else {
            $scope.files.splice(index, 1);
            angular.element(document.getElementById("filename1")).val("")
        }
    };
    var userList = [];
    var routerIndex = "";
    $scope.addRouterUser = function (index) {
        routerIndex = index;
        userList = [];
        $scope.routerUser_show = true;
        $scope.selectUsers = $scope.routerUsers[index].userList;
        if(!$scope.users){
            $ajax.get(urls.dataParser+"?UserID=1","",function (response) {
                if(response.status==200){
                    $scope._users = angular.copy(response.data.data);
                    $scope.users = angular.copy(response.data.data);
                }
            });
        } else {
            $scope.users = angular.copy($scope._users);
        }
        setSelectData();
    };
    function setSelectData() {
        if($scope.selectUsers && $scope.selectUsers.length){
            var count=0;
            for(var i=0;i<$scope.users.length;i++){
                if(count>=$scope.selectUsers.length) return
                if(inArrayIndex.get($scope.users[i].UserName,$scope.selectUsers,"UserName")>=0){
                    $scope.users[i]['select']=true;
                    count+=1;
                }
            }
        }
    }
    function dataSearch(_keyword) {
        var keyword = _keyword.trim();
        if(!keyword){
            $scope.users=$scope._users;
        } else {
            $scope.users = [];
            if($scope._users && $scope._users.length){
                for(var i=0;i<$scope._users.length;i++){
                    if(JSON.stringify($scope._users[i]).indexOf(keyword)>=0 || JSON.stringify($scope._users[i]).indexOf(angular.uppercase(keyword))>=0 || JSON.stringify($scope._users[i]).indexOf(angular.lowercase(keyword))>=0){
                        $scope.users.push($scope._users[i])
                    }
                }
            }
        }
    }
    $scope.dataSearch = function (keyword) {
        dataSearch(keyword);
    };
    $scope.keyUpSearch = function (evt) {
        if(evt.keyCode==13){
            dataSearch(evt.target.value)
        }
    };
    $scope.setUsers = function (model,index) {
        if(model){
            $scope.users[index]['select']=true;
        } else {
            $scope.users[index]['select']=false;
        }
    };
    $scope.removeUser = function (parent,index) {
        $scope.routerUsers[parent].userList.splice(index,1);
    };
    $scope.saveRouterUser = function () {
        $scope.routerUser_show = false;
        $scope.routerUsers[routerIndex].userList=[];
        for(var i=0;i<$scope.users.length;i++){
            if($scope.users[i].select){
                $scope.routerUsers[routerIndex].userList.push($scope.users[i]);
            }
        }
    };
    $scope.cancelRouterUser = function () {
        $scope.routerUser_show = false;
    };
    $scope.saveForm = function (evt) {
        if(!$scope.files_0.length && $scope.formType !="general"){
            alert("請上傳簽核附件！");
            return
        }
        if($scope.workflow_type =='self'){
            for(var i=0;i<$scope.routerUsers.length;i++){
                if(!$scope.routerUsers[i].userList.length){
                    alert("請完整填寫路由信息！")
                    return
                }
            }
        }
        angular.element(evt.target).prop("disabled","disabled");
        var fd = new FormData();
        if($scope.formType=="general"){
            angular.element(document.getElementById("tmpl")).find(".selected").removeClass("selected");
            var tds =document.getElementById("tmpl").getElementsByTagName("td");
            for(var i=0;i<tds.length;i++){
                if(angular.element(tds[i]).attr("data-fixed")=="false" || angular.element(tds[i]).attr("data-readonly")=="false"){
                    var type = angular.element(tds[i]).attr("data-type");
                    var value = "";
                    if(type=="input"){
                        value = angular.element(tds[i]).find("input").val();
                    } else if(type=="select"){
                        value = angular.element(tds[i]).find("select").val();
                    } else if(type=='radio'){
                        value = angular.element(tds[i]).find("input:checked").parent().text();
                    } else if(type=='checkbox'){
                        for(var j=0;j<angular.element(tds[i]).find("input:checked").length;j++){
                            value = value+angular.element(tds[i]).find("input:checked").eq(j).parent().text()+";";
                        }
                    } else if(type=='textArea') {
                        value = angular.element(tds[i]).find("textArea").val();
                    } else {
                        value = angular.element(tds[i]).find("input").val();
                    }
                    var index = angular.element(tds[i]).attr("data-index");
                    eval("$scope.form.table"+index+".value=value")
                    angular.element(tds[i]).html(value)
                }
            }
        }
        fd.append("content", JSON.stringify($scope.form));
        fd.append("name", $scope.formTitle);
        fd.append("tmpl_id", $scope.formId);
        fd.append("userList",$scope.routerUsers?JSON.stringify($scope.routerUsers):[]);
        // var html = {
        //     "html":angular.element(document.getElementById("tmpl")).html(),
        //     "height":angular.element(document.getElementById("tmpl")).height()+1,
        //     "width":angular.element(document.getElementById("tmpl")).width()
        // };
        fd.append("html",angular.element(document.getElementById("tmpl")).html());
        if($scope.workflow_type =='self'){
            fd.append("workflow_content", $scope.routerUsers);
        }
        if($scope.files_0.length){
            fd.append("filename1", $scope.files_0[0].file);
        }
        if($scope.files && $scope.files.length){
            for (var i=0; i<$scope.files.length; i++) {
                var name = "filename"+(parseInt(i)+2);
                fd.append(name, $scope.files[i].file);
            }
        }
        $http({
            method: "POST",
            url: urls.forms,
            data: fd,
            headers: {
                'Content-Type': undefined,
                'X-CSRFToken': $window.localStorage.getItem("X-CSRFToken")
            },
            transformRequest: angular.identity
        }).then(function successCallback(response) {
            if (response.data.status == 200 || response.data.status == true || response.data.status == 201 ) {
                alert("表單提交成功！");
                $location.path("/tmpls")
            } else {
                alert(JSON.stringify(response.data))
            }
        }, function errorCallback(response) {
            alert("表單提交失敗，請稍後再試！");
            angular.element(evt.target).removeProp("disabled");
        });
    };
    $scope.cancelForm = function () {
        $location.path("/tmpls")
    };
});
app.controller('createtmplCtrl', function ($scope, $rootScope, $routeParams, $window, urls, $ajax,arrDeepCopy, $http, $location, $compile, inArrayIndex, screen,$sce) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.static_url = urls.host;
    function getLogos() {
        $ajax.get(urls.formlogo,"",function (response) {
            if(response.status==200){
                $scope.logos=response.data.data;
                for(var i=0;i<$scope.logos.length;i++){
                    $scope.logos[i].img_url = $scope.static_url+"/"+$scope.logos[i].img_url;
                }
            }
        });
    }
    getLogos();
    var _html = "";
    var _style = "";
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.sources=[];
    function getCategory() {
        $ajax.get(urls.tmplcategory, "", function (response) {
            $scope.categorys = response.data.data;
        });
    }
    getCategory();
    $ajax.get(urls.workflow, "", function (response) {
        $scope.workflows = response.data.data;
    });
    var id = $routeParams.id.toString().replace(":", "");
    if (id) {
        var _url = urls.tmpls + "/" + id;
        $ajax.get(_url, "", function (response) {
            if (response.status == 200) {
                $scope.tmpl = response.data.data[0];
                $scope.formTitle = response.data.data[0].table_name;
                $scope.formId = response.data.data[0].id;
                $scope.formType = response.data.data[0].desc;
                if($scope.formType !="general"){
                    angular.element(document.getElementById("generalType")).removeClass("active").siblings("button").addClass("active")
                }
                $scope.category = response.data.data[0].type;
                $scope._workflow = response.data.data[0].workflow;
                $scope.form = JSON.parse(response.data.data[0].table_content);
                for(var i=0;i<$scope.form.table.length;i++){
                    for(var j=0;j<$scope.form.table[i].list.length;j++){
                        if($scope.form.table[i].list[j].dataSource){
                            $scope.sources = [];
                            $scope.sources.push($scope.form.table[i].list[j].dataSource)
                        }
                        if($scope.form.table[i].list[j].fixed && $scope.form.table[i].list[j].value){
                            $scope.form.table[i].list[j].text = $sce.trustAsHtml($scope.form.table[i].list[j].value.toString())
                        }
                    }
                }
                $scope.tmpl_show = true;
            }
        }, function (response) {
            if (response.data) {
                alert(response.data)
            } else {
                alert("未獲取到模板數據！")
            }
        });
    } else {
        $scope.tmpl = {};
        $scope.formTitle = "";
        $scope.formId="";
        $scope.formType="";
        $scope.workflow="";
        $scope.form = {
        "title":{
            "name":"title",
            "value":"",
            "fixed":true,
            "style":{
                "textAlign":'center',
            }
        },"subtitle":{
            "name":"subtitle",
            "fixed":true,
            "value":"",
            "style":{
                "textAlign":'center',
            }
        }, "caption":{
            "style":{
                "textAlign":"center",
                "borderLeft":"1px solid #000",
                "borderRight":"1px solid #000",
                "border-top":"1px solid #000"
            }
        }, "logo":{
            "name":"logo",
            "fixed":true,
            "src":"",
            "style":{
                "position":"absolute",
                "left":0,
                "top":0,
                "height":"28px",
                "width":"auto",
                "paddingLeft":"10px",
                "paddingTop":"10px"
            }
        },table:"",
            "style":{
                    "width":"100%",
                    "textAlign": "center",
                    "lineHeight":"16px",
                    "borderLeftWidth":"1px",
                    "borderTopWidth":"1px",
                    "borderLeftStyle":"solid",
                    "borderTopStyle":"solid",
                    "backgroundColor": "#fff"
            }
        };
        $ajax.get(urls.formlogo,"",function (response) {
            if(response.status==200){
                $scope.form.logo.src=response.data.data[0].img_url
            }
        });
        $scope.formType = "general";
    }
    $scope.setWorkflow = function (id) {
        if(id){
            $scope.workflow=id;
        }
    };
    $scope.editFormRouter = function () {
        $scope.router_select = true;
    };
    $scope.cancelFormRouter = function () {
        $scope.router_select = false;
    };
    $scope.formTypeToggle = function (evt, param) {
        angular.element(evt.target).addClass("active").siblings().removeClass("active")
        $scope.formType = param;
        if(param == 'attachment'){
            $scope.tmpl_show= true;
        } else{
            $scope.tmpl_show = false;
        }
    };
    $scope.setCategory = function () {
        $scope.category_show =true;
    };
    $scope.addCategory = function (evt) {
        $scope.category_form = true;
        $scope.cate = {}
    };
    $scope.cancelCategory = function () {
        $scope.category_form = false;
    };
    $scope.saveCategory = function () {
        $scope.category_form = false;
        if(!$scope.cate.type || !$scope.cate.type_english || !$scope.cate.type_code){
            alert("請完整填寫表單！");
            return
        }
        $ajax.post(urls.tmplcategory,$scope.cate,function (response) {
            if(response.status == 201){
                alert("添加表單類別成功！");
                $ajax.get(urls.tmplcategory,"",function (result) {
                    $scope.categorys = result.data.data;
                })
            }
        })
    };
    $scope.closeCategory = function () {
        $scope.category_show =false;
    };
    $scope.deleteCategory = function (id) {
        var url = urls.tmplcategory+"/"+id;
        $ajax.delete(url,"",function (response) {
            if(response.status=200){
                alert("刪除成功！")
                $ajax.get(urls.tmplcategory,"",function (result) {
                    $scope.categorys = result.data.data;
                })
            }
        })
    };
    $scope.uploadFile = function (evt) {
        if (!$scope.formTitle) {
            alert("請先輸入模板名稱！");
            return
        }
        var file = document.querySelector('input[type=file]').files[0];
        if(!file){
            alert("請先選擇文件！")
            return
        }
        var file_name = file.name.toString();
        if (file_name.slice(file_name.length - 4) != ".xls" && file_name.slice(file_name.length - 4) != "xlsx") {
            alert("文件格式（.xls）錯誤！")
            return
        }
        var fd = new FormData();
        fd.append('filename', file);
        angular.element(evt.target).addClass("myGradBtn").prop("disabled","disabled")
        $http({
            method: "POST",
            url: urls.analyztmpl,
            data: fd,
            headers: {
                'Content-Type': undefined,
                'X-CSRFToken': $window.localStorage.getItem("X-CSRFToken")
            },
            transformRequest: angular.identity
        }).then(function successCallback(response) {
            if (response.status == 202 || response.status == 200 || response.status == 201) {
                angular.element(evt.target).removeClass("myGradBtn").removeProp("disabled");
                angular.element(document.getElementById("input_file")).val("");
                $scope.tmpl_show = true;
                $scope.form.table = getExcelData(response.data.data)
                $scope.form.title.value = $scope.formTitle;
            } else if(response.status == 406){
                alert("數據解析失敗，請確認文件版本");
                angular.element(evt.target).removeClass("myGradBtn").removeProp("disabled");
            }
        }, function errorCallback(response) {
            angular.element(evt.target).removeProp("disabled");
        });
    };
    // /* 分析Excel解析后的數據 */
    function getExcelData(format) {
        var tableWidth = format.table_width;
        var keys = format.keys;
        var row_number = 0;
        var trs=[];
        var tr={};
        var tds = [];
        for (var i = 0; i < keys; i++) {
            var key = "key" + i;
            var node = format[key];
            if (node["row"] != row_number) {
                var tr={"index":row_number,"list":tds};
                trs.push(tr);
                tds=[];
                tr={};
                row_number = node["row"];
            }
            var width = (parseFloat(node.width / tableWidth) * 100).toFixed(2).toString() + "%";
            var cols = node.colspan ? node.colspan : "1";
            var rows = node.rowspan ? node.rowspan : "1";
            var fixed = node.fixed;
            if(fixed && node["value"]){
                var value = node.value;
                var text=$sce.trustAsHtml(node["value"].toString());
            }
            var td={"name":key,"fixed":fixed,"value":value,"text":text,"width":width,"cols":cols,"rows":rows};
            if(fixed == false || fixed == "false"){
                td['input'] = {"type":""}
            }
            tds.push(td);
        }
        tr={"index":row_number,"list":tds};
        trs.push(tr);
        return trs;
    }
    $scope.setValue = function (value) {
        $scope.styleObj.value = value;
        $scope.styleObj.text = $sce.trustAsHtml(value)
    };
    $scope.setProp = function (evt, param) {
        angular.element(evt.target).addClass("active").siblings("button").removeClass("active");
        if (param == "data") {
            $scope.dataFill_show = true;
        }
        angular.element($scope.styleObj).children("input").prop("type",param);
    };
    $scope.setDataSource = function () {
        $scope.dataFill_show = true;
        document.getElementById("body").style.overflow="hidden";
        $ajax.get(urls.datasource, "", function (response) {
            if (response.status == 200) {
                $scope.dataSources = response.data.data;
            } else {
                alert("未獲取到數據源，請稍後再試！")
            }
        });
    };
    $scope.createDataSource = function () {
        $scope.dataSource_show = true;
        $scope.source = {"name":"111","match":[],"fill":[]};
    };
    $scope.removeDataSource = function (index) {
        console.log($scope.form,index)
        if($scope.sources[index].match[0].key){
            for(var i=0;i<$scope.form.table.length;i++){
                for(var j=0;j<$scope.form.table[i].list.length;j++){
                    if($scope.form.table[i].list[j].name==$scope.sources[index].match[0].key){
                        $scope.form.table[i].list[j].dataSource = "";
                        $scope.sources.splice(index,1);
                        return
                    }
                }
            }
        } else {
            for(var i=0;i<$scope.form.table.dataSource.length;i++){
                if($scope.form.table.dataSource[i].name==$scope.sources[index].name){
                    $scope.form.table.dataSource.splice(i,1);
                }
            }
            $scope.sources.splice(index,1);
        }
    };
    $scope.getDataSource = function (id) {
        if(!id) return
        $scope.source = {"name":"111","match":[{"key":"","name":""}],"fill":[]};
        $scope.selectedDataItems = [];
        var _url = urls.dataitem + "?Source=" + id;
        $ajax.get(_url, "", function (response) {
            $scope.dataItems = response.data.data;
            var index = inArrayIndex.get(id,$scope.dataSources,'Sourceid')
            $scope.source['name'] = $scope.dataSources[index].api;
        });
        $scope.matchScope = [];
        for(var i=0;i<$scope.form.table.length;i++){
            for(var j=0;j<$scope.form.table[i].list.length;j++){
                if(!$scope.form.table[i].list[j].fixed){
                    if($scope.styleObj.name != $scope.form.table[i].list[j].name){
                        $scope.matchScope.push($scope.form.table[i].list[j])
                    }
                }
            }
        }
        $scope.fillScope = angular.copy($scope.matchScope)
    };
    $scope.setFillScope = function (key) {
        $scope.fillScope = angular.copy($scope.matchScope);
        if(key){
            var index = inArrayIndex.get(key,$scope.matchScope,'name')
            $scope.fillScope.splice(index,1)
        }
    };
    $scope.setMatchData = function (key,value) {
        if(!key){
            $scope.source['match'][0]={"key":"","name":""};
        } else {
            if(!value){
                alert("請選擇單元格名稱！");
                return
            } else {
                $scope.source['match'][0]={"key":key,"name":value};
            }
        }
        // $scope.itemScope = angular.copy($scope.dataItems);
    };
    $scope.setFillData = function (key,name) {
        if($scope.source['fill'].name){
            $scope.source['fill'].key=key;
        } else {
            $scope.source['fill'].push({"name":name,"key":key})
        }
    };
    $scope.saveDataSource = function (evt) {
        if(!$scope.source.name){
            alert("請選擇數據源！");
            return
        }
        if(!$scope.source.match[0].key){
            if(!$scope.form['dataSource']){
                $scope.form['dataSource']=[];
            }
            $scope.form.dataSource.push($scope.source);
        } else {
            for(var i=0;i<$scope.form.table.length;i++){
                for(var j=0;j<$scope.form.table[i].list.length;j++){
                    if($scope.form.table[i].list[j].name==$scope.source.match[0].key){
                        $scope.form.table[i].list[j].dataSource = $scope.source;
                        break;
                    }
                }
            }
        }
        $scope.sources.push($scope.source);
        $scope.dataSourceId = "";
        $scope.source={};
        $scope.dataItems=[];
        $scope.matchScope=[];
        $scope.dataSource_show=false
    };
    $scope.cancelDataSource = function () {
        $scope.dataSourceId = "";
        $scope.source={};
        $scope.dataItems=[];
        $scope.matchScope=[];
        $scope.dataSource_show=false;
    };
    $scope.closeDataSource = function () {
        $scope.dataSourceId = "";
        $scope.dataFill_show = false;
        document.getElementById("body").style.overflow="auto";
        $scope.source={};
        $scope.dataItems=[];
        $scope.matchScope=[];
    };
    $scope.cacuRules = [];
    $scope.setCacuRules = function () {
        $scope.cacuRules_show = true;
        if($scope.form.cacuRules && $scope.form.cacuRules.length){
            $scope.cacuRules = $scope.form.cacuRules;
        }
    };
    $scope.setCacuType = function (evt,type) {
        $scope.cacuRule = {"type":type,"steps":[],"target":""};
        angular.element(evt.target).addClass("btn-info").siblings("button").removeClass("btn-info")
    };
    $scope.createCacuRule = function () {
        $scope.cacuRule_show = true;
        $scope.cacuRule = {"type":"","steps":[],"target":""};
        $scope.cacuKeys = [];
        for(var i=0;i<$scope.form.table.length;i++){
            for(var j=0;j<$scope.form.table[i].list.length;j++){
                if(!$scope.form.table[i].list[j].fixed){
                    $scope.cacuKeys.push($scope.form.table[i].list[j].name)
                }
            }
        }
    };
    $scope.saveCacuRule = function () {
        console.log($scope.cacuRule);
        console.log($scope.cacuRules);
        if($scope.cacuRule.type=="sumUp"){
            if(!$scope.cacuRule.steps.length){
                alert("請添加計算步驟！")
                return
            }
        } else if($scope.cacuRule.type=="defined"){
            if(!$scope.cacuRule.steps.length){
                alert("請添加計算步驟！")
                return
            } else {
                if(!$scope.cacuRule.steps[0].param1 || !$scope.cacuRule.steps[0].param2 || !$scope.cacuRule.steps[0].method){
                    alert("請正確配置計算步驟一！")
                    return
                }
            }
        }
        if(!$scope.cacuRule.target){
            alert("請正確配置目標單元格的值！")
            return
        }
        $scope.cacuRules.push($scope.cacuRule);
        $scope.cacuRule_show = false;
    };
    $scope.cancelCacuRule = function () {
        $scope.cacuRule_show = false;
    };
    $scope.createCacuStep = function (){
        $scope.cacuRule.steps.push({"param1":"","method":"","param2":""})
    };
    $scope.removeCacuStep = function (index) {
        $scope.cacuRule.steps.splice(index,1)
    };
    $scope.removeCacuRule = function (index) {
        $scope.cacuRules.splice(index,1);
    };
    $scope.saveCacuRules = function () {
        $scope.cacuRules_show = false;
        $scope.form.cacuRules = $scope.cacuRules;
        console.log($scope.form)
    };
    $scope.setStyleObj = function (parent_index,index,$obj) {
        if($obj=='form'){
            $scope.styleObj = $scope.form;
            $scope.styleObj['name']="form";
        } else if($obj.name=="title"){
            $scope.styleObj = $scope.form.title
        } else if($obj.name=="logo"){
            $scope.styleObj = $scope.form.logo;
        } else if($obj.name=="subtitle"){
            $scope.styleObj = $scope.form.subtitle
        } else {
            $scope.styleObj = eval("$scope.form.table["+parent_index+"].list["+index+"]")
            if(!$scope.styleObj.style){
                $scope.styleObj.style={}
            }
        }
        $scope.setting= true;
        $scope.style_show = true;
        if($scope.styleObj.input){
            $scope.input_type=$scope.styleObj.input.type?$scope.styleObj.input.type:"";
        }
    };
    $scope.setStyle = function (name,value) {
        if(name=='display'){
            if(value){
                $scope.styleObj.style[name] ="inline-block";
            } else {
                $scope.styleObj.style[name] ="none";
            }
        } else {
            $scope.styleObj.style[name] =value;
        }
    };
    $scope.setDisplay = function (evt) {
        var checked = angular.element(evt.target).prop("checked");
        if (checked) {
            angular.element($scope.styleObj).css("display", "block")
        } else {
            angular.element($scope.styleObj).css("display", "none")
        }
    };
    $scope.setBorder = function (param) {
        if(param){
            $scope.form.style.borderColor="transparent";
            $scope.form.caption.style.borderColor="transparent";
            for(var i=0;i<$scope.form.table.length;i++){
                for(var j=0;j<$scope.form.table[i].list.length;j++){
                    if($scope.form.table[i].list[j].style){
                        $scope.form.table[i].list[j].style.borderColor="transparent";
                    } else {
                        $scope.form.table[i].list[j].style={"borderColor":"transparent"}
                    }
                }
            }
        } else {
            $scope.form.style.borderColor="#000";
            $scope.form.caption.style.borderColor="#000";
            for(var i=0;i<$scope.form.table.length;i++){
                for(var j=0;j<$scope.form.table[i].list.length;j++){
                    if($scope.form.table[i].list[j].style){
                        $scope.form.table[i].list[j].style.borderColor="#000";
                    } else {
                        $scope.form.table[i].list[j].style={"borderColor":"#000"}
                    }
                }
            }
        }
    };
    $scope.delLogo = function (id) {
        var url = urls.formlogo+"/"+id;
        $ajax.delete(url,"",function (response) {
            if(response.status==200){
                alert("刪除成功！")
                getLogos();
            }
        })
    };
    $scope.uploadLogo = function () {
        var file=document.querySelector("#logo_file").files[0];
        if(!file){
            alert("請選擇文件")
            return
        }
        var fd = new FormData();
        fd.append("filename",file);
        $http({
            method:'POST',
            url:urls.formlogo,
            data: fd,
            headers: {
                'Content-Type':undefined,
                'X-CSRFToken': $window.localStorage.getItem("X-CSRFToken")
            },
            transformRequest: angular.identity
        })
        .success( function ( response )
        {
            if(response.status==200){
                //上传成功的操作
                alert("上傳成功!");
                getLogos();
                angular.element(document.getElementById("logo_file")).val("")
            } else {
                alert(JSON.stringify(response.data));
            }
        })
        .error(function (xhr) {
            alert("error");
        });
    };
    $scope.setLogoData = function () {
        $scope.logos_show=true;
    };
    $scope.closeSetLogo = function () {
        $scope.logos_show=false;
    };
    $scope.setImg = function (src) {
        angular.element($scope.styleObj).attr("src", src)
    };
    $scope.setInputType = function (param) {
        if($scope.styleObj['input'].type){
            $scope.styleObj['input'].type=param;
        } else {
            $scope.styleObj['input']={"type":param}
        }
        $scope.input_type=param;
    };
    $scope.setInputProp = function (evt,param) {
        if(param == "date" || param == "datetime"){
            $scope.styleObj['input'][param]=true;
            if(param == "date"){
                $scope.styleObj['input']['datetime']=false;
            } else {
                $scope.styleObj['input']['date']=false;
            }
            $scope.styleObj['input'].inputType="text";
        } else {
            $scope.styleObj['input']['date']=false;
            $scope.styleObj['input']['datetime']=false;
            $scope.styleObj['input'].inputType=param;
        }
    };
    $scope.setOptions = function (evt) {
        var options = angular.element(evt.target).val().trim().toString().split(",");
        $scope.styleObj['input'].options=options;
    };
    $scope.setAttr = function (evt,param) {
        $scope.styleObj['input'][param] = parseInt(angular.element(evt.target).val())
        angular.element(evt.target).prop(param,parseInt(angular.element(evt.target).val()))
    };
    $scope.saveSetting = function () {
        $scope.setting = false;
    };
    $scope.cancelSetting = function () {
        $scope.setting = false;
        angular.element($scope.styleObj).attr("style",_style);
    };
    $scope.setClient = function (param) {
        $scope.client = param;
    };
    $scope.saveFormTmpl = function () {
        if(!$scope.workflow){
            $scope.workflow = $scope._workflow.workflow_id;
        }
        if (!$scope.formTitle || !$scope.formType || !$scope.category || !$scope.workflow) {
            alert("請完整填寫模板！")
            return;
        }
        var data = {
            "name": $scope.formTitle,
            "desc": $scope.formType,
            "workflow_id": $scope.workflow,
            "type": $scope.category,
            "client":$scope.client,
            "content": $scope.formType=='general'?JSON.stringify($scope.form):""
        };
        if (id) {
            data.type = $scope.category.type_id;
            var _url = urls.tmpls + "/" + id;
            $ajax.post(_url, data, function (response) {
                if (response.status == 202) {
                    alert("修改表單模板成功！")
                    $location.path("/tmpls")
                }
            }, function (response) {
                alert("修改表單模板失敗！請重試一次！")
            })
        } else {
            $ajax.post(urls.tmpls, data, function (response) {
                if (response.status == 201) {
                    alert("創建表單模板成功！")
                    $location.path("/tmpls")
                }
            }, function (response) {
                alert("創建表單模板失敗！請重試一次！")
            });
        }
    };
    $scope.cancelSave = function () {
        if($scope.formId){
            var info = "確定要取消修改模板嗎？"
        } else {
            var info = "確定要取消模板創建嗎？"
        }
        var text =confirm(info);
        if(text == true){
            $location.path("/tmpls");
        }
    };
    $scope.closePreview = function () {
        $scope.preview_show = false;
    };
});
app.controller('tempconfigCtrl', function ($scope, $rootScope, $window,$location, urls, $ajax) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableKeys = ['table_type__forms_type','table_name','version','status_name'];
    var getDate = function () {
        $ajax.get(urls.tmpls +"?type=1", "", function (response) {
            $scope.datas = response.data.data;
        });
    };
    getDate();
    $scope.tmplStatus = function (evt,param,status) {
        var data = {status:status};
        var td = document.getElementById(param);
        $ajax.put(urls.tmpls + "/" + param, data, function (response) {
            if (response.status == 202) {
                if(status == 0){
                    alert("模板禁用成功！");
                } else if(status == 1){
                    alert("模板启用成功！");
                }
                getDate();
            }
        }, function (response) {
            alert(JSON.stringify(response.data.message).replace("\"",""))
        });
    };
    $scope.deleteTmpl = function (id) {
        var conf=confirm("確定要刪除這個模板嗎？");
        if(conf){
            var _url = urls.tmpls+"/"+id;
            $ajax.delete(_url,"",function (response) {
                if(response.status==202){
                    alert("刪除模板成功！")
                    getDate();
                }
            })
        }
    };
});
app.controller('workflowsCtrl', function ($scope, $rootScope, $ajax, $window,$location, urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableKeys = ['name','start','end','len','founder','username','rectime'];
    function getData() {
        $ajax.get(urls.workflows+"/", "", function (response) {
            $scope.datas = response.data.data;
        });
    }
    getData();
    $scope.workFlowStatus = function (evt,param,status) {
        var msg = "";
        if(status == 0){msg = "禁用"}
        else if(status == 1){msg = "啓用"}
        var data = {id:param,enabled:status};
        $ajax.put(urls.workflows+"/", data, function (response) {
            if (response.status == 200) {
                alert(msg + "成功");
                getData();
            }else if(response.status == 202){
                // alert(msg + "失敗");
                alert(response.data.data);
            }
         });
    };
    $scope.delWorkFlows = function (evt) {
        var id = angular.element(evt.target).attr("data-id");
        $ajax.delete(urls.workflows +"/"+ id, "", function (response) {
            if (response.status == 200) {
                alert("删除成功");
                getData();
            } else {
                alert(JSON.stringify(response.data))
            }
        });
    };
    $scope.deleteWorkflow = function (id) {
        var conf=confirm("確定要刪除這個流程嗎？");
        if(conf){
            var _url=urls.workflows+"/"+id;
            $ajax.delete(_url,"",function (response) {
                if(response.status==200){
                    alert("刪除流程成功！");
                    getData();
                } else {
                    alert(JSON.stringify(response.data.data))
                }
            })
        }
    };
});
app.controller('workflowCtrl', function ($scope, $rootScope, $ajax, $http, $location, $window, $routeParams, urls, screen) {
    $scope.id = $routeParams.id;
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.workFlow = {};
    $scope.draggableObjects = [{name: 'node'}];
    $scope.droppedObjects = [];
    $scope.node = {};
    $scope.index = -1;

    $scope.myStyle = {
        "min-height": (screen.get().height-30) + "px"
    };
    if ($scope.id != "add") {
        /**获取当前流程配置的数据**/
        $ajax.get(urls.workflows +"/"+ $scope.id, "", function (response) {
            $scope.workFlow = response.data.data;
            $scope.workFlow.type = response.data.data["workflow_type"];
            $scope.workFlowTitle = $scope.workFlow.title;
            var temp_data = [];
            for (var i = 0; i < response.data.data.data.length; i++) {
                var temp = {};
                temp = response.data.data.data[i].property;
                temp = eval('(' + temp + ')');
                temp["name"] = response.data.data.data[i].name;
                temp_data.push(temp);
            }
            $scope.droppedObjects = temp_data;
        });
    }
    $scope.onDropComplete = function (data, evt) {
        $rootScope.draggableLength = $scope.droppedObjects.length;
        if($scope.workFlow.type){
            $scope.droppedObjects.push({'name': '未命名','userRoles':[], 'userMode':'','upToLevel':'','lowerToLevel':'',
                'upLevel':'','forwordMode':'', 'forwardUsers':'','forwardBackMode':'', 'rejectMode':''});
            $scope.property_show = false;
            $scope.nodeCount = $scope.droppedObjects.length;
        }else{alert("請先選擇工作流籤核模式")}
    };
    $scope.select2Options = {
        allowClear:true,
        placeholder:'請選擇'
    };
    /**獲取所有籤核人信息**/
    var getUsers = function () {
        $ajax.get(urls.userRoles, "", function (response) {
            $scope.users = response.data.data;
        });
    };
    getUsers();
    $scope.getProperty = function (index, evt) {
        $rootScope.draggableLength = index;
        $scope.property_show = true;
        $scope.node = $scope.droppedObjects[index];
        $scope.index = index;
        /**select2實例化開始**/
        $scope.select2Options = {
            allowClear:true,
            placeholder:'請選擇'
        };
        getUsers();
        /**select2實例化結束**/
        $scope.node.userRoles = $scope.droppedObjects[index]["userRoles"];
    };
    /**最高籤核級數信息**/
    $ajax.get(urls.orgLevel, "", function (response) {
        $scope.upToLevels = eval(response.data);
    });

    /**工作流籤核類型**/
    $scope.workFlowType = function (evt,param) {
        if(param == "self"){
            for(var i=0;i<$scope.droppedObjects.length;i++){
                $scope.droppedObjects[i]["forwardBackMode"] = "";
                $scope.droppedObjects[i]["forwardUsers"] = "";
                $scope.droppedObjects[i]["forwordMode"] = "";
                $scope.droppedObjects[i]["rejectMode"] = "";
                $scope.droppedObjects[i]["userMode"] = "";
                $scope.droppedObjects[i]["userRoles"] = "";
                $scope.droppedObjects[i]["lowerToLevel"] = "";
                $scope.droppedObjects[i]["upToLevel"] = "";
                $scope.droppedObjects[i]["upLevel"] = "";
            }
        }
    };
    /**将节点属性设置到节点中**/
    // $scope.setProperty = function (param, model) {
    //     if ($scope.property_show) {
    //         // $scope.node[param] = model;
    //         console.log("-------start-------");
    //         console.log(JSON.stringify($scope.node));
    //         console.log(JSON.stringify($scope.droppedObjects));
    //         console.log("--------end--------");
    //     }
    // };
    /**彈出籤核角色選擇框**/
    $scope.selected = [];
    $scope.selectedRole = [];
    $scope.setUserRoles = function (evt) {
        var userMode = $scope.node.userMode;
        if(!userMode){
            alert("請先選擇籤核模式！");
            $scope.node.userRoles = [];
            return;
        }
        $scope.userRoles_show = true;
        if ($scope.node.userRoles != "" ) {
            $scope.selected = $scope.node.userRole.slice(0);
            $scope.selectedRole = $scope.node.userRoles.slice(0);
        }else{
            $scope.selected = [];
            $scope.selectedRole = [];
        }
        $ajax.get(urls.userRoles, "", function (response) {
            if (response.status == 200) {
                $scope.workFlowRole = response.data.data;
                $scope.workFlowRoles = $scope.workFlowRole;
            }
        });
    };
    $scope.updateSelection = function ($event, id,userName) {
        var userMode = $scope.node.userMode;
        if(userMode == "normal"){
            $scope.selected = [];
            $scope.selectedRole = [];
        }
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        var name = checkbox.name;
        if (action == 'add' && $scope.selected.indexOf(id) == -1) {
            $scope.selected.push(id+"("+userName+")");
            $scope.selectedRole.push(name);
        }
        if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx, 1);
            $scope.selectedRole.splice(idx, 1);
        }
    };
    $scope.isSelected = function (id) {
        return $scope.selected.toString().indexOf(id) >= 0;
    };
    /**搜索功能**/
    $scope.searchRole = function (evt) {
        var val = angular.element(evt.target).parent().siblings("input").val().trim();
        if (val == undefined) {
            val = angular.element(evt.target).parent().parent().siblings("input").val().trim();
        }
        val = val.toUpperCase();
        var temp = [];
        for (var i = 0; i < $scope.workFlowRoles.length; i++) {
            if($scope.workFlowRoles[i]["OrgName"]){
                if ($scope.workFlowRoles[i]["UserID"].toUpperCase().indexOf(val) >= 0 ||
                    $scope.workFlowRoles[i]["UserName"].toUpperCase().indexOf(val) >=0 ||
                    $scope.workFlowRoles[i]["OrgName"].toUpperCase().indexOf(val) >=0) {
                    temp.push($scope.workFlowRoles[i]);
                }
            }else{
                if ($scope.workFlowRoles[i]["UserID"].toUpperCase().indexOf(val) >= 0 ||
                    $scope.workFlowRoles[i]["UserName"].toUpperCase().indexOf(val) >=0) {
                    temp.push($scope.workFlowRoles[i]);
                }
            }
        }
        $scope.workFlowRole = temp;
    };
    /**签核角色保存**/
    $scope.saveFunc = function (evt) {
        // var userMode = $scope.node.userMode;
        // if(userMode == "normal"){
        //     alert("該正常簽核模式下只能選擇一個簽核人,取最後選擇項");
        // }
        $scope.droppedObjects[$scope.index].userRole = $scope.selected;
        $scope.droppedObjects[$scope.index].userRoles = $scope.selectedRole;
        $scope.modal_show = false;
        $scope.userRoles_show = false;
    };
    /**选择转呈用户组 start**/
    $scope.selectedId = [];
    $scope.selectedFUser = [];
    $scope.setForwardUsers = function (evt) {
        $scope.forwardUsers_show = true;
        if ($scope.node.forwardUsers != "") {
            $scope.selectedId = $scope.node.forwardUsers.slice(0);
            $scope.selectedFUser = $scope.node.forwardUsers.slice(0);
        }
        $ajax.get(urls.userRoles, "", function (response) {
            $scope.forwardUsers = response.data.data;
            $scope.forwardUsersAll = $scope.forwardUsers;
        });
    };
    $scope.updateSelectionFU = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        if (action == 'add' && $scope.selectedId.indexOf(id) == -1) {
            $scope.selectedId.push(id);
            $scope.selectedFUser.push(checkbox.name);
        }
        if (action == 'remove' && $scope.selectedId.indexOf(id) != -1) {
            var idx = $scope.selectedId.indexOf(id);
            $scope.selectedId.splice(idx, 1);
            $scope.selectedFUser.splice(idx, 1);
        }
    };
    $scope.isSelectedUser = function (id) {
        return $scope.selectedId.indexOf(id) >= 0;
    };
    /**搜索转呈用户组**/
    var searchForward = function (val) {
        val = val.trim().toUpperCase();
        var temp = [];
        for (var i = 0; i < $scope.forwardUsersAll.length; i++) {
            if($scope.forwardUsersAll[i]["OrgName"]){
                if ($scope.forwardUsersAll[i]["UserID"].toUpperCase().indexOf(val) >= 0 ||
                    $scope.forwardUsersAll[i]["UserName"].toUpperCase().indexOf(val) >=0 ||
                    $scope.forwardUsersAll[i]["OrgName"].toUpperCase().indexOf(val) >=0) {
                    temp.push($scope.forwardUsersAll[i]);
                }
            }else{
                if ($scope.forwardUsersAll[i]["UserID"].toUpperCase().indexOf(val) >= 0 ||
                    $scope.forwardUsersAll[i]["UserName"].toUpperCase().indexOf(val) >=0) {
                    temp.push($scope.forwardUsersAll[i]);
                }
            }
        }
        $scope.forwardUsers = temp;
    };
    $scope.searchForwardUser = function (evt) {
        var val = angular.element(evt.target).parent().siblings("input").val().trim();
        if (val == undefined) {
            val = angular.element(evt.target).parent().parent().siblings("input").val().trim();
        }
        searchForward(val);
    };
    $scope.saveUserFunc = function (evt) {
        if($scope.node.userMode == "normal" && $scope.selectedFUser.length >1){
            alert("該簽核模式下轉呈用戶只能選擇一個！");
            return;
        }
        $scope.droppedObjects[$scope.index].forwardUsers = $scope.selectedFUser;
        $scope.modal_show = false;
        $scope.forwardUsers_show = false;
    };
    $scope.cancelFunc = function (evt) {
        $scope.modal_show = false;
        $scope.forwardUsers_show = false;
        $scope.userRoles_show = false;
    };
    /**选择转呈用户组 end**/

    $scope.keyUpSearch = function (evt) {
        if(evt.keyCode==13) {
            var val = angular.element(evt.target).val();
            searchForward(val);
        }
    };
    /**节点下移**/
    $scope.nodeDown = function (index) {
        if(index == 0 && $scope.workFlow.type == "other"){
            alert("預定義模式中的第一個節點不可以移動！")
        } else if(index == $scope.droppedObjects.length-1){
            alert("該節點已經是最後一個節點！")
        } else if (index != $scope.droppedObjects.length - 1) {
            $scope._node = $scope.droppedObjects[index + 1];
            $scope.droppedObjects[index + 1] = $scope.droppedObjects[index];
            $scope.droppedObjects[index] = $scope._node;
        } else {
            $scope._node = $scope.droppedObjects[index];
            $scope.droppedObjects.pop();
            $scope.droppedObjects.unshift($scope._node);
        }
    };
    /**节点上移**/
    $scope.nodeUp = function (index) {
        if(index == 0){
            alert("該節點已經是第一個節點");
        } else if (index != 0) {
            $scope._node = $scope.droppedObjects[index - 1];
            $scope.droppedObjects[index - 1] = $scope.droppedObjects[index];
            $scope.droppedObjects[index] = $scope._node;
        } else {
            $scope._node = $scope.droppedObjects[index];
            $scope.droppedObjects.splice(0, 1);
            $scope.droppedObjects.push($scope._node);
        }
    };
    /**删除流程节点**/
    $scope.delNode = function (index, evt) {
        $scope.droppedObjects.pop(index);
        $scope.nodeCount = $scope.droppedObjects.length;
    };
    $scope.checkWorkFlowTitle = function (param) {
        if($scope.id == "add" ){
            var data = {title: param};
            $ajax.post(urls.ckeckFlowTitle, data, function (response) {
                if (response.data.status == 202) {
                    alert(response.data.data);
                    $scope.workFlow.title = "";
                }
            });
        }
    };
    /**保存流程**/
    $scope.saveWorkFlow = function () {
        if ($scope.workFlow.title == undefined || $scope.workFlow.title == "") {
            alert("請輸入工作流名稱");
            return;
        }
        var temp_data = [];
        for (var i = 0; i < $scope.droppedObjects.length; i++) {
            var temp = {};
            temp["name"] = $scope.droppedObjects[i]["name"];
            temp["property"] = $scope.droppedObjects[i];
            temp_data.push(temp)
        }
        var workflow = {
            title: $scope.workFlow.title, data: temp_data,
            type:$scope.workFlow.type
        };
        var data = {workflow: JSON.stringify(workflow)};
        $scope.url = urls.workflows + "/"+$scope.id;
        if ($scope.id == "add") {
            /**新增 流程配置方法**/
            $scope.url = urls.workflows+"/";
            $ajax.post($scope.url, data, function (response) {
                if (response.status == 201) {
                    alert(response.data.data);
                    $location.path("/workflows")
                } else if (response.data.status == 200) {
                    alert(response.data.data);
                }
            });
        } else {
            /**修改 流程配置方法**/
            $ajax.put($scope.url, data, function (response) {
                if (response.status == 200) {
                    alert(response.data.data);
                    $location.path("/workflows")
                }else if(response.status == 202){
                    alert(response.data.data);
                }
            });
        }
    };
});
app.controller('wfrolesCtrl', function ($scope, $rootScope, $ajax, $window,  $location, urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableName = "wfroles";
    $scope.type = "edit";
    function getData() {
        $ajax.get(urls.workFlowRole, "", function (response) {
            $scope._data = response.data;
        });
    }
    getData();
    $scope.editWFRole = function (evt) {
        $scope.modal_show = true;
        $scope.wfroles_show = true;
        $scope.type = "edit";
        var id = angular.element(evt.target).attr("data-id");
        var _url = urls.workFlowRole + "/" + id;
        $ajax.get(_url, "", function (response) {
            if (response.status == 200) {
                $scope.WFRole = response.data;
            }
        })
    };
    $scope.deleteWFRole = function (evt) {
        var id = angular.element(evt.target).attr("data-id");
        $ajax.delete(urls.workFlowRole + "/" + id, "", function (response) {
            if (response.status == 204) {
                alert("删除成功");
                getData();
                // $window.location.reload();
            } else if (response.data.status == 400) {
                alert(response.data.data)
            }
        });
    };
    $scope.createWFRole = function (evt) {
        $scope.modal_show = true;
        $scope.wfroles_show = true;
        $scope.type = "create";
        $scope.WFRole = {};
    };
    /**修改和創建角色**/
    $scope.saveWFRole = function (evt) {
        if ($scope.WFRole.role == "" || $scope.WFRole.role == undefined) {
            alert("請輸入角色名稱");
            return;
        } else if ($scope.WFRole.desc == "" || $scope.WFRole.desc == undefined) {
            alert("請輸入角色描述");
            return;
        }
        var url = urls.workFlowRole;
        var data = {role: $scope.WFRole.role, desc: $scope.WFRole.desc};
        if ($scope.type == "edit") {
            url = url + "/" + $scope.WFRole.id;
            $ajax.put(url, data, function (response) {
                if (response.status == 200) {
                    $scope.modal_show = false;
                    $scope.wfroles_show = false;
                    alert("角色修改成功");
                    getData();
                }
            })
        } else if ($scope.type == "create") {
            $ajax.post(url, data, function (response) {
                if (response.status == 201) {
                    $scope.modal_show = false;
                    $scope.wfroles_show = false;
                    alert("角色創建成功");
                    getData();
                } else if (response.data.status == 400) {
                    alert(response.data.data);
                }
            });
        }
    };
});
app.controller('tableCtrl', function ($scope) {
    $scope.perPage=20;
    var pageDatas=[];
    var datas=angular.copy($scope.datas);
    var searchMode=false;
    function devideData(data) {
        if(!data) return
        $scope.pageArr=[];
        pageDatas=[];
        $scope.dataCount = data.length;
        var i=0;
        while (data.length>0){
            pageDatas.push(data.splice(0,$scope.perPage));
            $scope.pageArr.push(i);
            i++;
        }
    }
    function setPage(data) {
        devideData(data);
        $scope.activePage=$scope.activePage?$scope.activePage:0;
        $scope.data = [];
        for(var i=$scope.activePage;i>=0;i--){
            if(pageDatas[i] && pageDatas[i].length){
                $scope.data=pageDatas[i];
                $scope.activePage=i;
                return
            }
        }
    }
    function tableFilter(data,keys,value) {
        var arr=[];
        for(var i=0;i<data.length;i++){
            var str = JSON.stringify(data[i]);
            if(angular.isArray(keys)){
                str="";
                for(var j=0;j<keys.length;j++){
                    var key = keys[j];
                    if(angular.isArray(data[i][key])){
                        if(key=="user"){
                            str+=data[i][key][0][1]+"//"+data[i][key][0][2];
                        } else if(key=="role"){
                            for(var k=0;k<data[i][key].length;k++){
                                str+=data[i][key][k][1]+"//"
                            }
                        } else if(key=="approver_name"){
                            str+=JSON.stringify(data[i][key])
                        }
                    } else if(angular.isObject(data[i][key])){
                        for(var k in data[i][key]){
                            str+=data[i][key][k]+"//"
                        }
                    } else {
                        str+=JSON.stringify(data[i][key])?JSON.stringify(data[i][key]):"";
                    }
                }
            }
            if(angular.lowercase(str).indexOf(angular.lowercase(value))>=0){
                arr.push(data[i])
            }
        }
        return arr;
    }
    function searchData() {
        var value = angular.element(document.getElementById("keyword")).val().trim().replace(/\s*$/g,'');
        var _datas = angular.copy($scope.datas);
        if (value) {
            _datas = tableFilter(_datas, $scope.tableKeys, value);
        } else {
            searchMode=false;
            $scope.activePage=0;
        }
        if(!searchMode){
            $scope.activePage=0;
        }
        setPage(_datas);
    }
    setPage(datas);
    $scope.active=true;
    $scope.changePage = function (param) {
        var index;
        if(angular.isString(param)){
            if(param=="next"){
                index=$scope.activePage+1;
            } else if(param=="prev"){
                index=$scope.activePage-1;
            } else if(param=="first"){
                index=0;
            } else if(param=="last"){
                index=$scope.pageArr.length-1;
            }
        } else {
            index=param;
        }
        $scope.activePage=index;
        $scope.data=pageDatas[index]
    };
    function dataSearch() {
        searchMode=false;
        searchData();
        searchMode=true;
    }
    $scope.dataSearch = function () {
        dataSearch();
    };
    $scope.$watch('datas', function () {
        datas=angular.copy($scope.datas)
        setPage(datas);
        if(searchMode){
            searchData();
        }
    }, true);
    $scope.keyUpSearch = function (evt) {
        if(evt.keyCode==13){
            dataSearch()
        }
    };
});
app.controller('tasksCtrl', function ($scope, $rootScope, $window) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    // $scope.tableName = 'tasks';
    // // $scope.filterKey = "node";
    // $scope.filterValue = $rootScope.userData.info.name;
    // $scope.datas = [
    //     {
    //         "no": "20170501002",
    //         "name": "实体显微镜点检",
    //         "submitor": "張三",
    //         "id": "F1330635",
    //         "date": "2017-05-01",
    //         "state": "待辦理",
    //         "node": "王五"
    //     },
    //     {
    //         "no": "20170501002",
    //         "name": "周末加班申请",
    //         "submitor": "張三",
    //         "id": "F1330635",
    //         "date": "2017-05-01",
    //         "state": "已辦理",
    //         "node": "王五"
    //     },
    //     {
    //         "no": "20170501002",
    //         "name": "乘坐班车申请",
    //         "submitor": "張三",
    //         "id": "F1330635",
    //         "date": "2017-05-01",
    //         "state": "已辦理",
    //         "node": "王五"
    //     },
    //     {
    //         "no": "20170501002",
    //         "name": "KJ-1000点检",
    //         "submitor": "王五",
    //         "id": "F1353635",
    //         "date": "2017-05-01",
    //         "state": "待辦理",
    //         "node": "張三"
    //     },
    //     {
    //         "no": "20170501002",
    //         "name": "乘坐班车申请",
    //         "submitor": "張三",
    //         "id": "F1330635",
    //         "date": "2017-05-01",
    //         "state": "已辦理",
    //         "node": "王五"
    //     },
    //     {
    //         "no": "20170501002",
    //         "name": "KJ-1000点检",
    //         "submitor": "張三",
    //         "id": "F1330635",
    //         "date": "2017-05-01",
    //         "state": "已辦結",
    //         "node": "王五"
    //     }
    // ];
});
app.controller('formsCtrl', function ($scope, $rootScope, $window,$location, urls, $ajax,inArrayIndex) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableKeys=['card_id','name','apply','approver_name','wrecord__create_time','time'];
    $scope.filterKey = "0";
    // alertDialog("这是一个测试alert");
    // dialog_alert_success2("您還沒有登錄請重新登錄","public/login.html");
    // dialog_open('../AngularIndex.html#/users','测试弹框','90%','65%');
    function getData(filter) {
        var filterKey = filter?parseInt(filter):0;
        $ajax.get(urls.forms +"?type="+filterKey , "", function (response) {
            if (response.status == 200) {
                $scope.datas = response.data.data;
            }
        });
    }
    getData($scope.filterKey);
    $scope.changeFormType = function (param) {
        $scope.filterKey=param;
        getData(param);
    };
    $scope.record_list = [];
    $scope.getWorkflow = function (evt,id) {
        var checked = angular.element(evt.target).prop("checked");
        if(checked){
            $scope.record_list.push(id)
        } else {
            var index = inArrayIndex.get(id,$scope.record_list);
            if(index>=0){
                $scope.record_list.splice(index,1)
            }
        }
    };
    $scope.sendMsg = function (evt,param) {
        $ajax.post(urls.sendMsg, {id:param}, function (response) {
            if (response.status == 200) {
                alert(response.data.data)
            }else if(response.status == 202){
                alert(response.data.data);
            }
        }, function (response) {
            alert("催單失敗，請稍後重試！")
        })
    };
    $scope.batchCheck = function (evt,action) {
        if(!$scope.record_list.length){
            alert("請選擇要簽核的表單！");
            return
        }
        angular.element(evt.target).prop("disabled","disabled");
        if($scope.record_list.length>=0){
            var data = {"action":action,"recordList":JSON.stringify($scope.record_list)}
            $ajax.post(urls.batch_check,data,function (response) {
                if(response.status == 200){
                    alert(response.data.data);
                    angular.element(evt.target).removeProp("disabled");
                    $scope.record_list=[];
                    getData()
                }
            },function (response) {
                alert("批量簽核失敗！");
                angular.element(evt.target).removeProp("disabled")
            })
        }
    };
});
app.controller('mobileFormCtrl', function ($scope, $rootScope,$location, $routeParams, $window, $ajax,$http, urls,$sce) {
    var param = $routeParams.id.toString().replace(":", "");
    var params = param.split("&tk=")
    var id= params[0];
    var tk = params[1];
    $window.localStorage.setItem("X-CSRFToken", tk);
    var _url = urls.forms + "/" + id;
    $scope.files = [];
    $ajax.get(_url, "", function (response) {
        if (response.status == 200) {
            $scope.form = response.data.data[0];
            $scope.formType = response.data.data[0].post_type;
            $scope.content = JSON.parse(response.data.data[0].form_content);
            if($scope.formType=="general"){
                for(var i=0;i<$scope.content.table.length;i++){
                    for(var j=0;j<$scope.content.table[i].list.length;j++){
                        if($scope.content.table[i].list[j].fixed && $scope.content.table[i].list[j].value){
                            $scope.content.table[i].list[j].text = $sce.trustAsHtml($scope.content.table[i].list[j].value.toString())
                        }
                    }
                }
            }
        }
    });
});
app.controller('formCtrl', function ($scope, $rootScope, $routeParams, $ajax, $window, urls, icons, $location, $compile,$http,$sce) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    var id = $routeParams.id.toString().replace(":", "");
    var _url = urls.forms + "/" + id;
    $scope.nowDate = new Date().toLocaleDateString();
    $scope.static_url = urls.host;
    $scope.files = [];
    $scope.fd_send={};
    $scope.delfile=function(ele,_id){
        angular.element(ele.target).parents("tr").remove();
        $scope.fd_send[_id]="";
    };
    $ajax.get(_url, "", function (response) {
        if (response.status == 200) {
            $scope.form = response.data.data[0];
            $ajax.get(urls.dataParser+"?UserID="+$scope.form.applicant, "", function (response) {
                $scope.user_form=response.data.data[0];
            });
            $scope.formId=response.data.data[0].id;
            $scope.formType = response.data.data[0].post_type;
            $scope.files =[];
            for (var i = 0; i < 6; i++) {
                var file_name = "file" + i;
                if ($scope.form[file_name]) {
                    var file = $scope.form[file_name];
                    var name = file.name;
                    var href = file.href;
                    var type = file.name.substr(file.name.length-4,4).replace(".","");
                    if(type !="pdf" && type !="ppt" && type !="pptx" && type!="docx" && type!="doc" && type!="xlsx" && type!="xls" && type!="png" && type!="jpg"){
                        type = 'oth'
                    }
                    $scope.files.push({"name":name,"href":href,"type":type})
                }
            }
            $scope.content = JSON.parse(response.data.data[0].form_content);
            if($scope.formType=="general"){
                for(var i=0;i<$scope.content.table.length;i++){
                    for(var j=0;j<$scope.content.table[i].list.length;j++){
                        if($scope.content.table[i].list[j].fixed && $scope.content.table[i].list[j].value){
                            $scope.content.table[i].list[j].text = $sce.trustAsHtml($scope.content.table[i].list[j].value.toString())
                        }
                    }
                }
            }
            $scope.url = urls.wl_approval + "/" + response.data.data[0].wrecord_id;
            $ajax.get($scope.url, "", function (response) {
                $scope.workflow = response.data.data[0];
                if($scope.workflow.property){
                    if($scope.workflow.record){
                        for(var i=0;i<$scope.workflow.record.length;i++){
                            if($scope.workflow.record[i].jon==$rootScope.userData.info.username){
                                $scope.node=$scope.workflow.record[i];
                                // $scope.workflow = $scope.workflow.record[i];
                            }
                        }
                    }
                }
            })
        }
    });
    $scope.addFile = function () {
        var file = document.querySelector("#filename0").files[0];
        if(file){
            $scope.file = {"name":file.name,"file":file}
            angular.element("#filename0").val("");
        } else {
            alert("請先選擇文件")
        }
    };
    $scope.cancelConfirm = function () {
        $scope.confirm.status=false;
    };
    $scope.confirmAction = function (evt) {
        angular.element(evt.target).prop("disabled","disabled");
        if($scope.confirm.status){
            if($scope.confirm.list.length && !$scope.confirm.user){
                alert("請"+$scope.confirm.title)
                return
            }
        }
        var fd = new FormData();
        fd.append("id",$scope.node.id);
        fd.append("action",$scope.action);
        fd.append("desc",$scope.comment);
        fd.append("username",$scope.confirm.user);
        if($scope.action=="rejected"){
            fd.append("type",$scope.confirm.type?1:0);
        }
        if($scope.file){
            fd.append("filename",$scope.file.file);
        }
        $http({
            method: "POST",
            url: urls.wl_approval,
            data: fd,
            headers: {
                'Content-Type': undefined,
                'X-CSRFToken': $window.localStorage.getItem("X-CSRFToken")
            },
            transformRequest: angular.identity
        }).then(function successCallback(response) {
            if (response.data.status == 200 || response.data.status == true || response.data.status == 201 ) {
                alert("表單簽核成功！");
                $location.path("/forms");
            } else {
                alert(response.data.data);
                angular.element(evt.target).removeProp("disabled");
            }
        }, function errorCallback(response) {
            alert("表單簽核失敗，請稍後再試！");
            angular.element(evt.target).removeProp("disabled");
        });
    };
    $scope.setConfirmUser = function (id) {
        $scope.confirm.user=id;
    };
    $scope.checkAction = function (action,evt) {
        $scope.comment = angular.element(document.getElementById("comment")).val().trim();
        if(action == "rejected" && !$scope.comment){
            alert("請輸入簽核意見！");
            return;
        }
        $scope.action = action;
        $scope.confirm = {"title":"","list":[],"status":false,"user":"","type":true}
        if(action=="forward"){
            $scope.confirm.status=true;
            if($scope.node.forward_list && $scope.node.forward_list.length){
                $scope.confirm.title="指定轉呈用戶";
                $scope.confirm.list = $scope.node.forward_list;
            } else {
                $scope.confirm.title="選擇轉呈用戶";
                $ajax.get(urls.userRoles,"",function (response) {
                    if(response.status==200){
                        $scope.confirm.list =response.data.data;
                    }
                })
            }
        } else if(action=="rejected"){
            if(angular.element(evt.target).text().trim() != "取消申請"){
                $scope.confirm.status=true;
                $scope.confirm.title="選擇駁回節點";
                if($scope.node.reject_list){
                    $scope.confirm.list = $scope.node.reject_list;
                }
            }

        } else if(action=="pass" && $scope.node.user_list.length){
            $scope.confirm.status=true;
            $scope.confirm.title="指定下一簽核節點";
            $scope.confirm.list = $scope.node.user_list;
        } else {
            $scope.confirm.status=false;
        }
        if(!$scope.confirm.status){
            angular.element(evt.target).prop("disabled","disabled");
            if($scope.confirm.status){
                if(!$scope.confirm.user){
                    alert("請"+$scope.confirm.title);
                    return
                }
            }
            var fd = new FormData();
            fd.append("id",$scope.node.id);
            fd.append("action",$scope.action);
            fd.append("desc",$scope.comment);
            if($scope.file){
                fd.append("filename",$scope.file.file);
            }
            $http({
                method: "POST",
                url: urls.wl_approval,
                data: fd,
                headers: {
                    'Content-Type': undefined,
                    'X-CSRFToken': $window.localStorage.getItem("X-CSRFToken")
                },
                transformRequest: angular.identity
            }).then(function successCallback(response) {
                if (response.data.status == 200 || response.data.status == true || response.data.status == 201 ) {
                    alert("表單簽核成功！");
                    $location.path("/forms");
                } else {
                    alert(response.data.data);
                    angular.element(evt.target).removeProp("disabled");
                }
            }, function errorCallback(response) {
                alert("表單簽核失敗，請稍後再試！");
                angular.element(evt.target).removeProp("disabled");
            });
        }
    };
});
app.controller('taskCtrl', function ($scope, $rootScope, $window) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');

});
app.controller('agentaddCtrl', function ($scope, $rootScope, $window, $ajax, $location, urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    /**获取当前用户的组织**/
    $ajax.get(urls.userOrg, "", function (response) {
        $scope.agentUsers = response.data.data;
    });
    /**选择组织产生对应的代理人信息**/
    $scope.setAgentUser = function (evt) {
        $ajax.get(urls.userOrg + "?org=" + $scope.org, "", function (response) {
            $scope.userList = response.data.data.data[0]["user_list"]
        });
        if($scope.org == ""){
            $scope.userList = "";
        }
    };
    /**获取代理任务列表**/
    var generalsId = [], generalsName = [], attachmentsId = [], attachmentsName = [];
    $ajax.get(urls.tmpls +"?type=0", "", function (response) {
        var tmpls = response.data.data;
        $scope.attachments = [];
        $scope.generals = [];
        for(var i=0;i<tmpls.length;i++){
            if(tmpls[i]["desc"] == "attachment"){
                $scope.attachments.push(tmpls[i]);
                attachmentsId.push(tmpls[i]["id"]);
                attachmentsName.push(tmpls[i]["table_name"]);
            }else if(tmpls[i]["desc"] == "general"){
                $scope.generals.push(tmpls[i]);
                generalsId.push(tmpls[i]["id"]);
                generalsName.push(tmpls[i]["table_name"])
            }
        }
        $scope.tmplsAll = response.data.data;
    });
    $scope.selectedId_Gen = [];
    $scope.selectedName_Gen = [];
    $scope.selectedId_Att = [];
    $scope.selectedName_Att = [];
    $scope.updateSelection = function ($event, id, param) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        if(param == "attachments"){
            if (action == 'add' && $scope.selectedId_Att.indexOf(id) == -1) {
                $scope.selectedId_Att.push(id);
                $scope.selectedName_Att.push(angular.element(checkbox).attr("data-name"));
                if($scope.selectedId_Att.length == attachmentsId.length){
                    angular.element(document.getElementById("attachments")).attr("checked","checked");
                }
            }else if (action == 'remove' && $scope.selectedId_Att.indexOf(id) != -1){
                angular.element(document.getElementById("attachments")).removeAttr("checked");
                var idx = $scope.selectedId_Att.indexOf(id);
                $scope.selectedId_Att.splice(idx, 1);
                $scope.selectedName_Att.splice(idx, 1);
            }
        }else if(param == "generals"){
            if (action == 'add' && $scope.selectedId_Gen.indexOf(id) == -1) {
                $scope.selectedId_Gen.push(id);
                $scope.selectedName_Gen.push(angular.element(checkbox).attr("data-name"));
            }else if (action == 'remove' && $scope.selectedId_Gen.indexOf(id) != -1 ) {
                angular.element(document.getElementById("generals")).removeAttr("checked");
                var idx = $scope.selectedId_Gen.indexOf(id);
                $scope.selectedId_Gen.splice(idx, 1);
                $scope.selectedName_Gen.splice(idx, 1);
            }
        }
    };
    $scope.isSelected = function (id,param) {
        if(param == "attachments"){
            return $scope.selectedId_Att.indexOf(id) >= 0;
        }else if(param == "generals"){
            return $scope.selectedId_Gen.indexOf(id) >= 0;
        }
    };
    $scope.checkGenerals = function (evt) {
        var checkbox = evt.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        if (action == 'add' ) {
            $scope.selectedId_Gen = generalsId.slice(0);
            $scope.selectedName_Gen = generalsName.slice(0);
        }else if (action == 'remove') {
            $scope.selectedId_Gen = [];
            $scope.selectedName_Gen = [];
        }
    };
    $scope.checkAttach = function (evt) {
        var checkbox = evt.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        if (action == 'add' ) {
            $scope.selectedId_Att = attachmentsId.slice(0);
            $scope.selectedName_Att = attachmentsName.slice(0);
        }else if (action == 'remove') {
            $scope.selectedId_Att = [];
            $scope.selectedName_Att = [];
        }
    };
    /**新增我的工作代理提交**/
    $scope.addAgent = function () {
        $scope.startTime = angular.element(document.getElementById("datepicker1")).val();
        $scope.endTime = angular.element(document.getElementById("datepicker2")).val();
        if ($scope.org == undefined || $scope.org == "") {
            alert("請選擇代理組織");return;
        } else if ($scope.user == "" || $scope.user == undefined) {
            alert("請選擇代理人");return;
        } else if ($scope.startTime == "" || $scope.startTime == undefined) {
            alert("請輸入代理開始時間");return;
        } else if ($scope.endTime == "" || $scope.endTime == undefined) {
            alert("請輸入代理結束時間");return;
        } else if($scope.selectedId_Gen.length == 0 && $scope.selectedId_Att.length == 0){
            alert("晴選擇代理任務");return;
        }else if($scope.endTime <= $scope.startTime){
            alert("結束時間不能小於開始時間"); $scope.endTime = "";return ;
        }
        var data = {
            user_agent_id: $scope.user,
            start_time: $scope.startTime,
            end_time: $scope.endTime,
            tmpls_Gen:[$scope.selectedId_Gen,$scope.selectedName_Gen],
            tmpls_Att:[$scope.selectedId_Att,$scope.selectedName_Att]
        };
        $ajax.post(urls.agents, {data:JSON.stringify(data)}, function (response) {
            if (response.status == 201) {
                alert(response.data.data);
                $location.path("/agents");
            } else {
                alert(response.data.data)
            }
        });
    };
});
app.controller('agentUsersCtrl', function ($scope, $rootScope, $window, $ajax,$location, urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableKeys = ['jon','name','org','agent_jon','agent_name','rectime'];
    /**獲取所有常用代理人信息**/
    var getData = function () {
        $ajax.get(urls.agentUserConfig, "", function (response) {
            $scope.datas = response.data.data;
        });
    };
    getData();
    /**彈出新增常用代理人模態框**/
    $scope.addAgentUsers = function () {
        $scope.modal_show = true;
        $scope.agentAddUser_show = true;
        $ajax.get(urls.userOrg, "", function (response) {
            $scope.userOrgs = response.data.data.data;
        });
        if(!$scope.acUsers){
            $ajax.get(urls.userRoles, "", function (response) {
                $scope.acUsers = response.data.data;
            });
        }
    };
    /**新增常用代理人**/
    $scope.saveAgentUser = function (evt, userOrg, agentUser) {
        if (userOrg == "" || userOrg == undefined) {
            alert("請選擇組織");
            return;
        } else if (agentUser == "" || agentUser == undefined) {
            alert("請選擇代理人");
            return;
        }
        var data = {org: userOrg, agent: agentUser};
        $ajax.post(urls.agentUserConfig, data, function (response) {
            if (response.status == 201) {
                alert(response.data.data);
                $scope.modal_show = false;
                $scope.agentAddUser_show = false;
                getData();
            }else if(response.status == 202){
                alert(response.data.data);
            }
        });
    };
    $scope.cancelModal = function (evt) {
        $scope.modal_show = false;
        $scope.agentAddUser_show = false;
    };
    $scope.delAgentUser = function (evt, param) {
        $ajax.delete(urls.agentUserConfig + "/" + param, "", function (response) {
            if (response.status == 204) {
                alert("刪除成功")
                getData();
            }
        });
    };
});
app.controller('agentsCtrl', function ($scope, $rootScope, $ajax, $window,$location, urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.myAgent = 'agented';
    $scope.agent = [];
    $scope.activeAgent = {
        "agented": true,
        "beAgented": false
    };
    $scope.agentToggle = function (param) {
        $scope.myAgent = param;
        for (var key in $scope.activeAgent) {
            if (key == param) {
                $scope.activeAgent[key] = true;
            } else {
                $scope.activeAgent[key] = false;
            }
        }
    };
    $scope.setAgent = function () {
        $scope.modal_show = true;
        $scope.agentAdd_show = true;
        $ajax.get(urls.userOrg, "", function (response) {
            $scope.userOrg = response.data.data.data;
            $scope.jon = response.data.data.jon;
            $scope.name = response.data.data.name;
        });
    };
    $scope.saveAgent = function (evt) {
        var isAllEqual = new Set($scope.agent).size === 1;
        if (($scope.agent.length > 1 && isAllEqual) || $scope.agent.length == 0) {
            alert("请选择代理人");
            return;
        }
        for (var i = 0; i < $scope.userOrg.length; i++) {
            if (($scope.userOrg[i].use_id == undefined || $scope.userOrg[i].use_id == "")
                && $scope.userOrg[i].startTime != undefined && $scope.userOrg[i].endTime != undefined) {
                alert("请选择代理人");
                return;
            } else if (($scope.userOrg[i].use_id != undefined && ($scope.userOrg[i].startTime == undefined || $scope.userOrg[i].startTime == ""))
                && ($scope.userOrg[i].use_id != "" && ($scope.userOrg[i].startTime == "" || $scope.userOrg[i].endTime == undefined))) {
                alert("请输入开始时间");
                return;
            } else if (($scope.userOrg[i].use_id != undefined && ($scope.userOrg[i].endTime == undefined || $scope.userOrg[i].endTime == ""))
                && ($scope.userOrg[i].use_id != "" && ($scope.userOrg[i].endTime == "" || $scope.userOrg[i].endTime == undefined))) {
                alert("请输入结束时间");
                return;
            }
        }
        var data = {data: JSON.stringify($scope.userOrg)};
        $ajax.post(urls.agents, data, function (response) {
            if (response.status == 201) {
                alert(response.data.data);
                $scope.modal_show = false;
                $scope.agentAdd_show = false;
                $ajax.get(urls.agents + "?agent=0", "", function (response) {
                    $scope._data = response.data.data;
                });
            }
        });
    };
    $scope.setProperty = function (index, param, model) {
        $scope.userOrg[index][param] = model;
        if (param == "use_id") {
            $scope.agent[index] = model;
        }
        if (param == "endTime") {
            if ($scope.userOrg[index].startTime == undefined || $scope.userOrg[index].startTime == "") {
                alert("请输入开始时间");
            } else if (model <= $scope.userOrg[index].startTime) {
                alert("请输入正确的时间（结束时间应大于开始时间）");
                $scope.userOrg[index].endTime = "";
            }
        }
    };
    $scope.cancelFunc = function (evt) {
        $scope.modal_show = false;
        $scope.agentAdd_show = false;
    }
});
app.controller('agentedCtrl', function ($scope, $rootScope, $ajax, $window,$location, urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){         dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");     }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableKeys = ['rectime','org','jon','name','start','end','status'];
    $ajax.get(urls.agents + "?agent=0", "", function (response) {
        $scope.datas = response.data.data;
    });
});
app.controller('beAgentedCtrl', function ($scope, $rootScope, $ajax, $window,$location, urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableKeys = ['jon','name','rectime','org','start','end','status'];
    function getData() {
        $ajax.get(urls.agents + "?agent=1", "", function (response) {
            if (response.status == 200) {
                $scope.datas = response.data.data;
            }
        });
    }
    getData();
    $scope.updateAgentUser = function (evt, param, flag) {
        var data = {id: param, status: flag};
        $ajax.post(urls.userOrg, data, function (response) {
            if (response.status == 200) {
                alert(response.data.data);
                getData();
            }
        });
    }
});
app.controller('checkdetailCtrl', function ($scope, $rootScope, $window,$location) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.toggle = function () {
        $scope.myForm = !$scope.myForm;
    };
});
// 流程報表統計--按表單類型區分
app.controller('reportformsCtrl', function ($scope, $rootScope, $window,$location, $routeParams,$ajax,urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    // 獲取url傳遞的ID
    var _href=window.location.href;
    var _my_url=_href.split("/");
    var _id=_my_url[_my_url.length-1];
    $scope.tableKeys=['typename','name','starttime','endtime','time']
    $ajax.get(urls.from_approval+"/"+_id,"",function (response) {
        $scope.datas = response.data.data;
        $rootScope.userData = eval('(' + userInfo + ')');
        $scope.name = $routeParams.param;
    });
});
// 流程報表統計--按審核人員區分
app.controller('reportmenbersCtrl', function ($scope, $rootScope, $window,$location, $routeParams,$ajax,urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.name = $routeParams.param;
    $scope.tableKeys = ['name','typename','starttime','endtime','time'];
    // 獲取url傳遞的ID
    var _href=window.location.href;
    var _my_url_id=_href.split("?");
    $scope._my_url_typeid=_my_url_id[_my_url_id.length-1];
    var _my_url=_my_url_id[_my_url_id.length-2].split("/");
    $scope.reportmenbersCtrl_id=_my_url[_my_url.length-1];
    $ajax.get(urls.from_approval2+"?username="+$scope.reportmenbersCtrl_id+"&type_id="+$scope._my_url_typeid,"",function (response) {
        $scope.datas = response.data.data;
    });
    $scope._data = [];
});
app.controller('reportformCtrl', function ($scope, $rootScope, $window,$location,$ajax,urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableKeys = ['name','starttime','endtime','time'];
    $scope.reportToggle = function (param) {
        $scope.myReport = param;
        for (var key in $scope.reportGroup) {
            if (key == param) {
                $scope.reportGroup[key] = true;
            } else {
                $scope.reportGroup[key] = false;
            }
        }
    };
    $scope.myReform = 'reformed';
    $scope.activeReform = {
        "reformed": true,
        "beReformed": false
    };
    $scope.reformToggle = function (param) {
        $scope.myReform = param;
        for (var key in $scope.activeReform) {
            if (key == param) {
                $scope.activeReform[key] = true;
            } else {
                $scope.activeReform[key] = false;
            }
        }
    };
    $ajax.get(urls.form_type,"",function (response) {
        var type = typeof response.data.data;
        $scope.datas = (type=='string')?[]:response.data.data;
        $scope.myReport = 'list';
        $scope.reportGroup = {
            "list": true,
            "chart": false
        };
    });

    $ajax.get(urls.fromNodeTotal,"",function (response) {
        var data1=[];
        var data2=[];
        for(var i=0;i<response.data.data.length;i++){
            data1.push(response.data.data[i].name);
            data2.push(response.data.data[i].time);
        }
        $scope.chart1 = {
            backgroundColor: '#404a59',
            title: {
                text: '前二十平均历时最长的簽核人員',
                subtext: '',
                textAlign: 'left',
                textStyle: {
                    color: '#fff',
                    fontWeight: '500',
                    fontFamily: 'NSimSun'
                }
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: data1,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval: 0,
                        // rotate: 45,//倾斜度 -90 至 90 默认为0
                        margin: 10,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#eee'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#eee'
                        }
                    }
                }
            ],
            series: [
                {
                    itemStyle: {
                        normal: {
                            //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD'
                                ];
                                return colorList[params.dataIndex]
                            },
                            //以下为是否显示，显示位置和显示格式的设置了
//                         label: {
//                             show: true,
//                             position: 'top',
// //                             formatter: '{c}'
//                             formatter: '{b}\n{c}'
//                         }
                        }
                    },
                    name: '历时',
                    type: 'bar',
                    barWidth: '60%',
                    data: data2
                }
            ]
        };
    });
    $ajax.get(urls.fromNodeTotalMonth,"",function (response) {
        // [
        //     {
        //         name: 'Step Start',
        //         type: 'line',
        //         step: 'start',
        //         data: [120, 132, 101, 134, 90, 230, 210]
        //     },
        //     {
        //         name: 'Step Middle',
        //         type: 'line',
        //         step: 'middle',
        //         data: [220, 282, 201, 234, 290, 430, 410]
        //     },
        //     {
        //         name: 'Step End',
        //         type: 'line',
        //         step: 'end',
        //         data: [450, 432, 401, 454, 590, 530, 510]
        //     }
        // ]
        // var data_data=[];
        // for(var i in response.data.valus[0]){
        //     var obj={};
        //     obj.name='Step Start';
        //     obj.type='line';
        //     for(var j=0;j<response.data.valus.length;j++){
        //
        //     }
        // }

        $scope.chart3 = {
            title: {
                text: '当前一个月各表单类型平均历时',
                subtext: '',
                textAlign: 'left',
                textStyle: {
                    fontWeight: '500',
                    fontFamily: 'NSimSun',
                    color: '#fff'
                },
            },
            backgroundColor: '#404a59',
            color: [
                '#dd4444', '#fec42c', '#80F1BE'
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data:response.data.data.date,
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                }
            },
            series: response.data.data.valus

        }

    });
    $ajax.get(urls.fromTypeTotal,"",function (response) {
        $scope.chart2 = {
            backgroundColor: '#404a59',
            title: {
                text: '前二十平均历时最长的表单类型',
                subtext: '',
                textAlign: 'left',
                textStyle: {
                    color: '#fff',
                    fontWeight: '500',
                    fontFamily: 'NSimSun'
                }
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: response.data.data.name,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval: 0,
                        // rotate: 45,//倾斜度 -90 至 90 默认为0
                        margin: 10,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#eee'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#eee'
                        }
                    }
                }
            ],
            series: [
                {
                    itemStyle: {
                        normal: {
                            //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD'
                                ];
                                return colorList[params.dataIndex]
                            },
                            //以下为是否显示，显示位置和显示格式的设置了
//                         label: {
//                             show: true,
//                             position: 'top',
// //                             formatter: '{c}'
//                             formatter: '{b}\n{c}'
//                         }
                        }
                    },
                    name: '历时',
                    type: 'bar',
                    barWidth: '60%',
                    data: response.data.data.value
                }
            ]
        };
    });
    var dataBJ = [
        [1, 26, "优"],
        [2, 85,"良"],
        [3, 78, "良"],
        [4, 21, "优"],
        [5, 41, "优"],
        [6, 56,"良"],
        [7, 64, "良"]
    ];
    var dataGZ = [
        [1, 26, "优"],
        [2, 85,"良"],
        [3, 78, "良"],
        [4, 21, "优"],
        [5, 41, "优"],
        [6, 56,"良"],
        [7, 64, "良"]
    ];
    var dataSH = [
        [1, 26, "优"],
        [2, 85,"良"],
        [3, 78, "良"],
        [4, 21, "优"],
        [5, 41, "优"],
        [6, 56,"良"],
        [7, 64, "良"]
    ];
    var schema = [
        {name: 'date', index: 0, text: '日'},
        {name: '历时', index: 1, text: '总历时'},
        {name: '节点1', index: 2, text: '节点1历时'},
        {name: '节点2', index: 3, text: '节点2历时'},
        {name: '', index: 4, text: ''},
        {name: '', index: 5, text: ''},
        {name: '', index: 6, text: ''}
    ];
    var itemStyle = {
        normal: {
            opacity: 0.8,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
    };
});
app.controller('beReportformCtrl', function ($scope, $rootScope,$ajax,urls, $window,$location) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.tableKeys =['approver_record','name','typename','starttime','endtime','time'];
    $scope.reportGroup = {
        "list": true,
        "report": false
    };
    $scope.myReport = 'list';
    $scope.reportToggle = function (param) {
        $scope.myReport = param;
    };
    $scope.myReform = 'reformed';
    $scope.activeReform = {
        "reform": true,
        "beReform": false
    };
    $scope.reformToggle = function (param) {
        $scope.myReform = param;
        for (var key in $scope.activeReform) {
            if (key == param) {
                $scope.activeReform[key] = true;
            } else {
                $scope.activeReform[key] = false;
            }
        }
    };
    $ajax.get(urls.from_approval,"",function (response) {
        var type = typeof response.data.data;
        $scope.datas = (type=='string')?[]:response.data.data;
    });
});
app.controller('dashboradCtrl', function ($scope, $rootScope, $window,$location) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    alert("溫馨提示：該頁面圖表數據都為樣板數據！")
    $rootScope.userData.dashboard = [
        {"name": "系統版", "list": ["1", "2", "7", "4", "5", "6"]}
    ];
    $rootScope.userData.formList = [];
    $scope.library = [
        {"id": "chart1", "name": "訂單量與營收", "type": "echart1"},
        {"id": "chart2", "name": "產品銷量與分佈", "type": ""},
        {"id": "chart7", "name": "產品良率", "type": "echart7"},
        {"id": "chart4", "name": "客戶退貨率", "type": "echart4"},
        {"id": "chart5", "name": "OQC批退率", "type": "echart5"},
        {"id": "chart6", "name": "報廢率與異常次數", "type": ""},
        {"id": "chart8", "name": "製程良率", "type": "echart8"},
        {"id": "chart3", "name": "稼動率", "type": "echart6"}
    ];
    $scope.booking = [false, false, false, false, false, false, false, false, false, false];
    $scope.dataChanged = [false, false, false, false, false, false, false, false, false, false];
    $scope.bookingToggle = function (n) {
        $scope.booking[n] = !$scope.booking[n];
    };
    $scope.droppedObj = [];
    $scope.darggableObj = [];
    var num = $rootScope.userData.dashboard.length;
    for (var i = 0; i < num; i++) {
        $scope.droppedObj[i] = $rootScope.userData.dashboard[i].list.map(getChartObj);
        $scope.darggableObj[i] = haschartFilter($scope.droppedObj[i], deepCopy($scope.library));
    }
    function getArrIndex(id, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                return i;
            }
        }
    }

    $scope.onDropComplete = function (n, evt) {
        var id = evt.element.context.getAttribute("data-id");
        var index = getArrIndex(id, $scope.darggableObj[n]);
        $scope.droppedObj[n].push($scope.darggableObj[n][index]);
        $scope.darggableObj[n].splice(index, 1);
        $scope.dataChanged[n] = true;
    };
    $scope.deleteChart = function (n, id) {
        var index = getArrIndex(id, $scope.droppedObj[n]);
        $scope.darggableObj[n].push($scope.droppedObj[n][index]);
        $scope.droppedObj[n].splice(index, 1);
        $scope.dataChanged[n] = true;
    };
    function collectObj(n) {
        return $scope.droppedObj[n].map(removeChartObj);
    }

    $scope.saveTmpl = function (n) {
        if (!$scope.dashboard.name) {
            alert("模板名稱不能為空！")
        } else {
            $rootScope.userData.dashboard[n].name = $scope.dashboard.name;
        }
        $rootScope.userData.dashboard[n].list = collectObj(n);
        $scope.dataChanged[n] = false;
    };
    $scope.cancelSave = function (n) {
        $scope.dataChanged[n] = false;
    };
    $scope.saveAnother = function (n) {
        var name = prompt("請輸入模板名稱（10個字符以內）", "");
        if (name) {
            var num = $rootScope.userData.dashboard.length;
            if (num > 10) {
                alert("Dashboard模板不能多於10張！")
            } else {
                var data = {};
                data.list = collectObj(n);
                data.name = name;
                $rootScope.userData.dashboard.push(data)
            }
            $scope.dataChanged[n] = false;
        }
    };
    function tmplNameCheck(name) {
        if (name.length > 10 && name) {
            alert("模板名稱不能大於10個字符！請重新輸入");
            return tmplNameCheck(prompt("請輸入模板名稱（10個字符以內）", ""))
        }
    }

    function deepCopy(arr) {
        return arr.slice(0);
    }

    function getChartObj(id) {
        var _id = "chart" + id;
        for (var i = 0; i < $scope.library.length; i++) {
            if ($scope.library[i].id == _id) {
                return $scope.library[i]
            }
        }
    }

    function removeChartObj(obj) {
        return obj.id.replace("chart", "")
    }

    function haschartFilter(droppedObj, darggableObj) {
        for (var i = 0; i < droppedObj.length; i++) {
            for (var j = 0; j < darggableObj.length; j++) {
                if (droppedObj[i].id == darggableObj[j].id) {
                    darggableObj.splice(j, 1);
                }
            }
        }
        return darggableObj;
    }

    $scope.chart1 = {
        backgroundColor: '#ffffff',//背景色
        title: {
            text: '订单量和营收',
            subtext: '',
            textAlign: 'left',
            textStyle: {
                fontWeight: '500',
                fontFamily: 'NSimSun'
            }
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        legend: {
            y: 'bottom',
            data: ['计划达成量', '实际达成量', '增长率']
        },
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '',
                min: 0,
                max: 250,
                interval: 50,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value} %',
                    // textStyle: {
                    //     color: '#999'
                    // }
                }
            }
        ],
        series: [
            {
                name: '计划达成量',
                type: 'bar',
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            },
            {
                name: '实际达成量',
                type: 'bar',
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            },
            {
                name: '增长率',
                type: 'line',
                yAxisIndex: 1,
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
        ]
    };
    var dataAxis = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    var data = [22, 18, 19, 23, 29, 33, 31, 12, 44, 32, 9, 14, 21, 12, 13, 33, 19, 12, 12, 22];
    var yMax = 60;
    var dataShadow = [];
    for (var i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
    }
    $scope.chart4 = {
        backgroundColor: '#ffffff',//背景色
        title: {
            text: '客户退货率',
            subtext: '',
            textAlign: 'left',
            textStyle: {
                fontWeight: '500',
                fontFamily: 'NSimSun'
            }
        },
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 'auto',
                formatter: '{value} %',
                textStyle: {
                    color: '#999'
                }
            }
        },
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
            { // For shadow
                type: 'bar',
                itemStyle: {
                    normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: dataShadow,
                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'}
                            ]
                        )
                    }
                },
                data: data
            }
        ]
    };
    function random() {
        var r = Math.round(Math.random() * 100);
        return (r * (r % 2 == 0 ? 1 : -1));
    }

    function randomDataArray() {
        var d = [];
        var len = 100;
        while (len--) {
            d.push([
                random(),
                random(),
                Math.abs(random()),
            ]);
        }
        return d;
    }

    $scope.chart5 = {
        title: {
            text: 'IQC/OQC批退率',
            subtext: '',
            textAlign: 'left',
            textStyle: {
                fontWeight: '500',
                fontFamily: 'NSimSun'
            }
        },
        backgroundColor: '#ffffff',//背景色
        tooltip: {
            trigger: 'axis',
            showDelay: 0,
            axisPointer: {
                show: true,
                type: 'cross',
                lineStyle: {
                    type: 'dashed',
                    width: 1
                }
            }
        },
        legend: {
            y: 'bottom',
            data: ['IQC批退率', 'OQC批退率']
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataZoom: {show: true},
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        xAxis: [
            {
                type: 'value',
                splitNumber: 4,
                scale: true
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitNumber: 4,
                scale: true
            }
        ],
        series: [
            {
                name: 'IOQ批退率',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[2] / 5);
                },
                data: randomDataArray()
            },
            {
                name: 'OQC批退率',
                type: 'scatter',
                symbolSize: function (value) {
                    return Math.round(value[2] / 5);
                },
                data: randomDataArray()
            }
        ]
    };
    $scope.chart3 = {
        title: {
            text: '稼动率',
            subtext: '',
            textAlign: 'left',
            textStyle: {
                fontWeight: '500',
                fontFamily: 'NSimSun'
            }
        },
        backgroundColor: '#ffffff',//背景色
        tooltip: {
            trigger: 'axis'
        },
        // toolbox: {
        //     show: true,
        //     feature: {
        //         mark: {show: true},
        //         dataView: {show: true, readOnly: false},
        //         magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
        //         restore: {show: true},
        //         saveAsImage: {show: true}
        //     }
        // },
        calculable: true,
        legend: {
            y: 'bottom',
            data: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
        },
        xAxis: [
            {
                type: 'category',
                splitLine: {show: false},
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
        ],
        yAxis: [
            {
                type: 'value',
                position: 'right'
            }
        ],
        series: [
            {
                name: 'a',
                type: 'bar',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: 'b',
                type: 'bar',
                tooltip: {trigger: 'item'},
                stack: '广告',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: 'c',
                type: 'bar',
                tooltip: {trigger: 'item'},
                stack: '广告',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: 'd',
                type: 'bar',
                tooltip: {trigger: 'item'},
                stack: '广告',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: 'e',
                type: 'line',
                data: [862, 1018, 964, 1026, 1679, 1600, 1570]
            },

            {
                name: 'f',
                type: 'pie',
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                center: [160, 130],
                radius: [0, 50],
                itemStyle: {
                    normal: {
                        labelLine: {
                            length: 20
                        }
                    }
                },
                data: [
                    {value: 1048, name: 'a'},
                    {value: 251, name: 'b'},
                    {value: 147, name: 'c'},
                    {value: 102, name: 'd'}
                ]
            }
        ]
    };
    $scope.chart7 = {
        backgroundColor: '#ffffff',//背景色
        title: {
            text: '产品良率',
            subtext: '',
            textAlign: 'left',
            textStyle: {
                fontWeight: '500',
                fontFamily: 'NSimSun'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#283b56'
                }
            }
        },
        legend: {
            y: 'bottom',
            data: ['产品总数', '产品良率']
        },
        toolbox: {
            show: false,
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: (function () {
                    var now = new Date();
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                        now = new Date(now - 5000);
                    }
                    return res;
                })()
            },
            {
                type: 'category',
                boundaryGap: true,
                data: (function () {
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.push(len + 1);
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '报废率',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value} %',
                    // textStyle: {
                    //     color: '#999'
                    // }
                }
            },
            {
                type: 'value',
                scale: true,
                name: '产品总数',
                max: 1200,
                min: 0,
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name: '产品总数',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: (function () {
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.push(Math.round(Math.random() * 1000));
                    }
                    return res;
                })()
            },
            {
                name: '产品良率',
                type: 'line',
                data: (function () {
                    var res = [];
                    var len = 0;
                    while (len < 10) {
                        res.push((Math.random() * 10 + 5).toFixed(1) - 0);
                        len++;
                    }
                    return res;
                })()
            }
        ]
    };
    $scope.chart8 = {
        backgroundColor: '#ffffff',//背景色
        title: {
            text: '制程良率',
            subtext: '',
            textAlign: 'left',
            textStyle: {
                fontWeight: '500',
                fontFamily: 'NSimSun'
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            y: 'bottom',
            data: ['制程A', '制程B', '制程C']
        },
        // toolbox: {
        //     show: true,
        //     feature: {
        //         mark: {show: true},
        //         dataView: {show: true, readOnly: false},
        //         magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
        //         restore: {show: true},
        //         saveAsImage: {show: true}
        //     }
        // },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '制程A',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [10, 12, 21, 54, 260, 830, 710]
            },
            {
                name: '制程B',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [30, 182, 434, 791, 390, 30, 10]
            },
            {
                name: '制程C',
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [1320, 1132, 601, 234, 120, 90, 20]
            }
        ]
    };
});
app.controller('eOfficeCtrl', function ($scope, $rootScope, $window) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
});
app.controller('mesCtrl', function ($scope, $rootScope, $http, $window) {
    $rootScope.sidebar_show = true;
    $scope.sight_status = {"sight_map": true, "sight_list": false, "sight_block": false};
    var userAgent = $window.navigator.userAgent;
    $scope.showSightBlock = function (name) {
        for (var key in this.sight_status) {
            this.sight_status[key] = false;
        }
        this.sight_status[name] = true;
    };
    $http({
        method: 'GET',
        url: 'static/data/cameraList.json',
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded'
            'X-CSRFToken': $window.localStorage.getItem("X-CSRFToken")
        },
    }).then(function successCallback(response) {
        $scope.cameras = response.data.data;
        var span1 = "<span class='glyphicon glyphicon-facetime-video'></span>";
        var span2 = "<span class='icon-smiley'></span> " +
            "<span class='border-left-top-1'></span> " +
            "<span class='border-left-top-2'></span> " +
            "<span class='border-left-bot-1'></span> " +
            "<span class='border-left-bot-2'></span> " +
            "<span class='border-right-top-1'></span> " +
            "<span class='border-right-top-2'></span> " +
            "<span class='border-right-bot-1'></span> " +
            "<span class='border-right-bot-2'></span>";
        var sights = document.getElementById("sights");
        for (var i = 0; i < $scope.cameras.length; i++) {
            var loc_obj = $scope.cameras[i].location;
            var location = "left:" + loc_obj.left + ";top:" + loc_obj.top;
            var sn = $scope.cameras[i].sn;
            var type = $scope.cameras[i].type;
            var name = $scope.cameras[i].name;
            var cla = (type == "ipCamera") ? "icon-video" : "face-identify";
            var span = (type == "ipCamera") ? span1 : span2;
            // var html = "<a id='" + sn + "' href='#/sightvideo/" + sn + "' title='" + name + "' class='" + cla + "'>" + span + "</a>";
            var href='tmpl/mes/video.html?'+sn;
            if(userAgent.indexOf("Firefox")>=0){
                href="#/sightvideo/:"+sn;
            } else if(userAgent.indexOf("Chrome")>=0){
                href="tmpl/rtspPlayer/index.html?"+sn;
                // href="tmpl/mes/iframe-video.html?"+sn;
            }
            var html = "<a target='_blank' id='" + sn + "' href='"+href+"' title='" + name + "' class='" + cla + "'>" + span + "</a>";
            var li = document.createElement("li");
            li.setAttribute("style", location);
            li.innerHTML = html;
            if (sights) {
                sights.appendChild(li);
            }
        }
    }, function errorCallback(response) {
        alert(response.data)
    });
});
app.controller("sightvideoCtrl", function ($scope, $rootScope, $window,$location, $ajax,$http, $routeParams, urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.liveVideo = true;
    function getObjectHtml(width, percent, url) {
        var _percent = percent ? percent : 0.5652;
        var height = width * _percent;
        var html = "<object type='application/x-vlc-plugin' width=" + width + " height=" + height + " style='z-index:10000;'> " +
            "<param name='mrl' value=" + url + " width=" + width + " height=" + height +">" +
            "<param name='volume' value='50' /> " +
            "<param name='autoplay' value='true' /> " +
            "<param name='loop' value='false' /> " +
            "<param name='fullscreen' value='true' /> " +
            "<param name='controls' value='false' />" +
            "</object>";
        return html;
    }
    function getVideoObject(url) {
        var con = document.getElementById("camera_container");
        var width = con.offsetWidth - 20;
        con.innerHTML = getObjectHtml(width, "", url);
    }
    $ajax.get("static/data/cameraList.json","",function (response) {
        if(response.status==200){
            $scope.cameras = response.data.data;
            if ($routeParams.id.replace(":","")) {
                for (var i = 0; i < $scope.cameras.length; i++) {
                    if ($scope.cameras[i].sn == $routeParams.id.replace(":","")) {
                        $scope.active_camera = $scope.cameras[i];
                        getVideoObject($scope.active_camera.stream_address);
                    }
                }
            }
        }
    },function (response) {
        alert(response.data)
    });
    var userAgent=$window.navigator.userAgent;
    if(userAgent.indexOf("WOW64")>=0 || userAgent.indexOf("win64")>=0){
        $scope.userCPU='Bit64';
    } else {
        $scope.userCPU='Bit32';
    }
    $scope.getLiveVideo = function () {
        var url = $scope.active_camera.stream_address;
        getVideoObject(url);
        $scope.liveVideo = true;
    };
    $scope.getHistoryVideo = function () {
        $http({
            method: 'GET',
            url: url
            // headers: {
            //     // 'Content-Type': 'application/x-www-form-urlencoded'
            //     'X-CSRFToken': $window.localStorage.getItem("X-CSRFToken")
            // }
        }).then(function successCallback(response) {
            var str = response.data;
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(str, "text/xml");
            var rtsp = angular.element(xmlDoc).find("string").html();
            if (rtsp) {
                getVideoObject(rtsp);
                $scope.liveVideo = false;
            } else {
                alert(response.data);
            }
            $scope.videoLoading = false;
        }, function errorCallback(response) {
            $scope.videoLoading = false;
            alert(response.data);
        });
    };
});
app.controller("infoCtrl", function ($scope, $rootScope, $window, $http,$location,$ajax,urls,$timeout) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    var up_manage="";
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.liveVideo = true;
    $scope.host = urls.host;
    // alert($scope.host);
    $scope.init_ajax=function () {
        $ajax.get(urls.from_users+"/"+$rootScope.userData.info.id,"",function (response) {
            $scope.usermanage=response.data;
            up_manage=response.data;
            var time = new Date().getTime();    //用于提供实时随机数
            $timeout(function () {
                $scope.usermanage.sign=response.data.sign + '?' + time;  //增加随机参数时间可强制刷新
                $scope.usermanage.head=response.data.head + '?' + time;  //增加随机参数时间可强制刷新
            });
        });
    };
    $scope.init_ajax();
    $scope.info_duty={};
    $scope.info_site={};
    $ajax.get(urls.info_duty,"",function (response) {
        var _data=response.data;
        for (var i=0;i<_data.length;i++){
            $scope.info_duty[_data[i].id]=_data[i].name;
        }
    });
    $ajax.get(urls.info_site,"",function (response) {
        var _data=response.data;
        for (var i=0;i<_data.length;i++){
            $scope.info_site[_data[i].id]=_data[i].site_name;
        }
    });
    $scope.upplod_sign=function () {
        angular.element("#file_upplod_sign").click();
    };
    $scope.upplod_sign1=function () {
        angular.element("#upth_heade").click();
    };
    angular.element("#file_upplod_sign").change(function (e) {
        onSubmit(e.target.value,"#file_upplod_sign","sign");
    });
    angular.element("#upth_heade").change(function (e) {
        onSubmit(e.target.value,"#upth_heade","head");
    });
    function onSubmit(path,_id,_val){
        // var form1 = document.forms[0];
        var file = path;
        if (file == null||file == ""){
            alert("请选择要上传的图片!");
            return false;
        }
        if (file.lastIndexOf('.')==-1){    //如果不存在"."
            alert("路径不正确!");
            return false;
        }
        var AllImgExt=".jpg|.jpeg|.gif|.bmp|.png|";
        var extName = file.substring(file.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）
        if(AllImgExt.indexOf(extName+"|")==-1)
        {
            ErrMsg="该文件类型不允许上传。请上传 "+AllImgExt+" 类型的文件，当前文件类型为"+extName;
            alert(ErrMsg);
            return false;
        }
        $scope.save(_id,_val);
    }
    // 文件上傳
    $scope.save = function(_id,_val) {
        var fd = new FormData();
        var file = document.querySelector(_id).files[0];
        // up_manage
        fd.append(_val, file);
        fd.append("site", up_manage.site);
        fd.append("username", up_manage.username);
        fd.append("first_name", up_manage.first_name);
        fd.append("last_name", up_manage.last_name);
        fd.append("email", up_manage.email);
        fd.append("ext", up_manage.ext);
        fd.append("short_number", up_manage.short_number);
        fd.append("mobile_phone", up_manage.mobile_phone);
        var reg = /^.+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        var _my_email_tf=reg.test(up_manage.email);
        if(!_my_email_tf||up_manage.email.length>40){
            alert('郵箱格式錯誤');
            return false;
        }
        if(up_manage.sex=="男"){
            var _sex=0;
        }else {
            var _sex=1;
        }
        fd.append("sex", _sex);
        fd.append("duty", up_manage.duty);
        $http({
            method:'PUT',
            url:urls.from_users+"/"+$rootScope.userData.info.id,
            data: fd,
            headers: {
                'Content-Type':undefined,
                'X-CSRFToken': $window.localStorage.getItem("X-CSRFToken")
            },
            transformRequest: angular.identity
        })
        .success( function ( response )
        {
            //上传成功的操作
            alert("上傳成功；");
            // $scope.init_ajax();
            // console.log(response);
            // window.location.reload();//刷新当前页面.
            // top.location.reload();
            var time = new Date().getTime();    //用于提供实时随机数
            // $scope.$apply(function () {
            //     // $scope.logoSrc =  字符串 + '?' + time;  //增加随机参数时间可强制刷新
            //     $scope.usermanage.sign=response.sign + '?' + time;  //增加随机参数时间可强制刷新
            //     $scope.usermanage.head=response.head + '?' + time;  //增加随机参数时间可强制刷新
            // });
            $timeout(function () {
                $scope.usermanage.sign=response.sign + '?' + time;  //增加随机参数时间可强制刷新
                $scope.usermanage.head=response.head + '?' + time;  //增加随机参数时间可强制刷新
            });
            // $scope.init_ajax();
        })
        .error(function (xhr) {
            alert("error");
        });
    };
    $scope.kipe_usermanage=function () {
        var fd = new FormData();
        // var file = document.querySelector(_id).files[0];
        // // up_manage
        // fd.append(_val, file);
        fd.append("site", up_manage.site);
        fd.append("username", up_manage.username);
        fd.append("first_name", up_manage.first_name);
        fd.append("last_name", up_manage.last_name);
        fd.append("email", up_manage.email);
        fd.append("ext", up_manage.ext);
        fd.append("short_number", up_manage.short_number);
        fd.append("mobile_phone", up_manage.mobile_phone);
        fd.append("motto", up_manage.motto);

        var reg = /^.+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        var _my_email_tf=reg.test(up_manage.email);
        if(!_my_email_tf||up_manage.email.length>40){
            alert('郵箱格式錯誤');
            return false;
        }

        if(up_manage.sex=="男"){
            var _sex=0;
        }else {
            var _sex=1;
        }
        fd.append("sex", _sex);
        fd.append("duty", up_manage.duty);
        $http({
            method:'PUT',
            url:urls.from_users+"/"+$rootScope.userData.info.id,
            data: fd,
            headers: {
                'Content-Type':undefined,
                'X-CSRFToken': $window.localStorage.getItem("X-CSRFToken")
            },
            transformRequest: angular.identity
        })
            .success( function ( response )
            {
                //上传成功的操作
                alert("修改成功");
                window.location.reload();//刷新当前页面
            })
            .error(function (xhr) {
                alert("error");
            });
    };

    $scope.change_password_={};
    $scope.change_password_sevel=function () {
        // if(!$scope.change_password_.id){
        //     alert('用戶名不能為空');
        //     return false;
        // }
        if(!$scope.change_password_.oldpassword){
            alert('原始密碼不能為空');
            return false;
        }
        if(!$scope.change_password_.newpassword){
            alert('新密碼不能為空');
            return false;
        }
        if($scope.change_password_.newpassword2!=$scope.change_password_.newpassword){
            alert('兩次密碼不一致');
            return false;
        }
        $ajax.post(urls.update_pwd, {"username":$scope.usermanage.username,"old_pwd":$scope.change_password_.oldpassword,"new_pwd":$scope.change_password_.newpassword}, function (response) {
            if(response.status==200){
                alert(response.data.message);
                $scope.module_show=false;
                // var path="modifypwd?"+$scope.menber_code_num;
                // window.location.href="#/modifypwd?"+$scope.menber_code_num;
                // $location.path("modifypwd?"+$scope.menber_code_num);
            }else {
                alert(response.data.message);
            }
        },function (xhr) {
            if(xhr.status==400){
                alert(xhr.data.message);
            }
        })
    };
    $scope.module_show=false;
    $scope.change_password_show=function () {
        $scope.module_show=true;
    }
    $scope.change_module_hide=function () {
        $scope.module_show=false;
    }
});
app.controller("organizeCtrl", function ($scope, $rootScope,$window,$location,urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.liveVideo = true;
    $scope.orgLevel = urls.orgLevel;
});
app.controller("organize_usermanageCtrl", function ($scope, $rootScope, $window,$location) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.liveVideo = true;
});
// changepasswordCtrl
app.controller("changepasswordCtrl", function ($scope, $rootScope, $window,$location, $ajax, urls) {
    var userInfo = $window.localStorage.getItem("userInfo");
    if(!userInfo){
        dialog_alert_failure2("您還沒有登錄請重新登錄","public/login.html");
    }
    $rootScope.userData = eval('(' + userInfo + ')');
    $scope.liveVideo = true;
    $scope.change_password_={};
    $scope.change_password_sevel=function () {
        if(!$scope.change_password_.id){
            alert('用戶名不能為空');
            return false;
        }
        if(!$scope.change_password_.oldpassword){
            alert('原始密碼不能為空');
            return false;
        }
        if(!$scope.change_password_.newpassword){
            alert('新密碼不能為空');
            return false;
        }
        if($scope.change_password_.newpassword2!=$scope.change_password_.newpassword){
            alert('兩次密碼不一致');
            return false;
        }
        $ajax.post(urls.update_pwd, {"username":$scope.change_password_.id,"old_pwd":$scope.change_password_.oldpassword,"new_pwd":$scope.change_password_.newpassword}, function (response) {
            if(response.status==200){
                alert(response.data.message);
                // var path="modifypwd?"+$scope.menber_code_num;
                // window.location.href="#/modifypwd?"+$scope.menber_code_num;
                // $location.path("modifypwd?"+$scope.menber_code_num);
            }else {
                alert(response.data.message);
            }
        },function (xhr) {
            if(xhr.status==400){
                alert(xhr.data.message);
            }
        })
    };
});