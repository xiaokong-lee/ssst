/**
 * 确认框
 * @param url 确认后需要跳转的URL
 * @param txt	确认框显示的内容
 */
function confirm_todo(url, txt) {
	art.dialog.through({
		title:"确认执行该操作",
		content : txt,
		icon : "question",
		lock : "true",
		window : "top",
		ok : function() {
			// ad_alert("正在执行中，请稍候...",120);
            dialog_loading();
			location.href = url;
		},
		cancel : function() {
		}
	});
}
/***
 * 弹框，弹出页面（默认高度为80%，默认宽度为80%）
 * @param url	页面路径
 * @param title	弹出框的title
 * @param height	弹出框的高度（可用百分比）
 * @param width	弹出框的宽度（可用百分比）
 */
function dialog_open_yesno(url, title, height, width) {
	if (height == undefined)
		height = "80%";
	if (width == undefined)
		width = "80%";
	if (title == undefined)
		title = "";
	art.dialog.open(url, {
		title : title,
		height : height,
		width : width,
		lock : true,
		yesText : "返回",
		loadingTip : "载入中...",
		window : "top",
		ok : function(iframeWin, topWin) {
		},
		cancel : function() {
			location.reload();
		}
	});
}
/***
 * 弹框，弹出页面（默认高度为80%，默认宽度为80%）
 * @param url	页面路径
 * @param title	弹出框的title
 * @param height	弹出框的高度（可用百分比）
 * @param width	弹出框的宽度（可用百分比）
 */
function dialog_open(url, title, height, width) {
	if (height == undefined)
		height = "80%";
	if (width == undefined)
		width = "80%";
	if (title == undefined)
		title = "";
	art.dialog.open(url, {
		title : title,
		height : height,
		width : width,
		lock : true,
		loadingTip : "载入中..."
	});
}

/**
 * 关闭弹出页面并重新加载来源页面
 */
function dialog_close(){
    var win = art.dialog.open.origin;
    win.location.reload();
    art.dialog.close();
}

/**
 * 重载来源页面
 */
function originReload(){
    var win = art.dialog.open.origin;
    win.location.reload();
}

/**
 * alert类型弹框默认显示时间3秒
 * @param txt   弹框内容
 */
function dialog_alert(txt) {
	ad_alert(txt,3);
}
/**
 * 自定义显示内容、时间弹框
 * @param txt	弹框内容
 * @param wait	显示时间
 */
function ad_alert(txt,wait) {
	art.dialog.through({
		time : wait,
		content : txt,
		lock : true,
		icon : "warning",
		title : "提示消息",
	});
}
function alertDialog(msg,icon,title) {
	if(icon == undefined){icon = "warning"}
    if(title == undefined){title = "消息提示";}
    art.dialog.through({
        content : msg,
        lock : true,
        icon : icon,
        title : title,
        ok : function () {
            return true;
        }
    });
}
/**
 *	类似alert弹框用户确认后消失（确认后执行函数）
 * @param msg	弹框内容
 * @param yesFunc	确认后执行的函数
 */
function disalog_alert_success(msg,yesFunc){
	art.dialog.through({
		content : msg,
		lock : true,
		icon : "succeed",
		title : "提示消息",
		ok : yesFunc
	});
}
/**
 * 类似alert弹框用户确认后消失（确认后跳转）
 * @param msg	弹框内容
 * @param redirect_url	确认后跳转的URL
 */
function dialog_alert_success2(msg,redirect_url){
	art.dialog.through({
		// time : 3,
		content : msg,
		lock : true,
		icon : "face-smile",
		title : "提示消息",
		ok : function(iframeWin, topWin) {
			top.location.href = redirect_url;
		}
	});
}
/**
 * 提示消息
 * @param msg
 * @param yesFunc
 */
function alert_success_fun(msg,yesFunc){
	art.dialog.through({
		time : 3,
		content : msg,
		lock : true,
		icon : "face-smile",
		title : "提示消息",
		ok : yesFunc
	});
}
/**
 * alert弹框 失败效果，确认后执行传入的函数
 * @param msg	弹框内容
 * @param noFunc	确认后执行的函数
 */
function disalog_alert_failure(msg,noFunc){
	art.dialog.through({
		content : msg,
		lock : true,
		icon : "face-sad",
		title : "提示消息",
		ok : noFunc
	});
}
/**
 * alert弹框 失败效果，确认后跳转
 * @param msg	弹框内容
 * @param redirect_url	跳转URL
 */
function dialog_alert_failure2(msg,redirect_url){
	art.dialog.through({
		// time : 300000,
		content : msg,
		lock : true,
		icon : "face-sad",
		title : "提示消息",
		ok : function(iframeWin, topWin) {
			top.location.href = redirect_url;
		}
	});
}
/**
 * 正在加载中ui效果
 */
function dialog_loading(){
    $.blockUI({
        message: '正在处理中，请稍候...',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            'border-radius':'10px',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: 0.8,
            color: '#fff'
        },
        overlayCSS:  {
            backgroundColor: '#000',
            opacity:         0.0,
            cursor:          'wait'
        }
    });
}

/**
 * 正在载入中
 */
function dialog_loading2(){
    $.growlUI('','正在载入中，请稍候...',300000);
}