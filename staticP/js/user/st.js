/**
 * Created by Frighting on 2017/7/13.
 */
/***
 * 生成手機app二維碼
 * @param id
 */
function downloadAppQrcode(id) {
    var host = window.location.host;
    $("#" + id).html("");
    $("#" + id).qrcode({
        render: "table",
        width: "200",
        height: "200",
        text: host + "/download.html"
    });
}
/***
 * 登出
 */
function logout() {
    $.ajax({
        url: urls.logout,
        type: "get",
        dataType: "json",
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded'
            'X-CSRFToken': window.localStorage.getItem("X-CSRFToken")
        },
        beforeSend: function () {
        },
        success: function (response) {
            console.log(response)
            window.localStorage.clear();
            window.location.href = "../index.html";
        },
        error: function (rep, e, t) {
            alert("數據請求失敗，請稍候再試")
        }
    });
}

/**时间**/
var now = setInterval(getNowTime, 1000);
function getNowTime() {
    var dataTime = new Date();
    var dates = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var wu = "";
    var hour = dataTime.getHours();
    if (hour < 12) {
        wu = "上午";
    } else {
        wu = "下午";
        hour -= 12;
    }
    var minute = dataTime.getMinutes();
    minute = (minute < 10) ? ('0' + minute) : minute;
    var second = dataTime.getSeconds();
    second = (second < 10) ? ('0' + second) : second;
    var year = dataTime.getFullYear();
    var month = dataTime.getMonth() + 1;
    var date = dataTime.getDate();
    var day = dataTime.getDay();
    $('#now_time').html(year + "年" + month + "月" + date + "日&nbsp;" + wu + "&nbsp;" + hour + ":" + minute + ':' + second);
}

/**查找出当前元素在list数组中的下标**/
function inArrayIndex(key, value, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i][key] == value) {
            return i;
        }
    }
    return -1;
}


/**
 * req = new AJAXPlus({
 *  dataType: json,
 *  headers:{ 'X-CSRFToken': window.localStorage.getItem("X-CSRFToken") },
 *  method: POST
 * })
 * req.ajax({
 *  url:
 *  success:function
 *  status201: function(response){}
 *  status202: function(response){}
 *  success: function(response){}
 *  error: function(response){}
 * })
 *
 * **/

function AJAXPlus(opt) {
    this.opt = opt || {};
    this.opt.beforeSend = opt.beforeSend || function () {
        };
    this.error = opt.error || function (response) {};
    this.opt.error = opt.error || function (response){};

    this.success = opt.success || function(response){};
    this.opt.success = opt.success || function(response){}
}
AJAXPlus.prototype.ajax = function (params) {
    params = params || {};
    for (var key in params) {
        if (key == "error") this.error = params.error;
        else if(key == "success") this.success = params.success;
        else this.opt[key] = params[key];
    }

    params = this.opt;
    var error = this.error;
    var success = this.success;
    this.opt.error = function (response) {
        var handler = eval("params.status" + response.status);
        var invoke = handler || error;
        invoke(response);
    };
    this.opt.success = function(response){
        var handler = eval("params.status" + response.status);
        var invoke = handler || success;
        invoke(response);
    };
    $.ajax(this.opt);
};

function newAjax(_method){
    var ajaxReq = new AJAXPlus({
        dataType:"json",
        headers:{'X-CSRFToken': window.localStorage.getItem("X-CSRFToken")},
        method:_method["method"]
    });
    return ajaxReq;
}