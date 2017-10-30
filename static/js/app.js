/**
 * Created by baopengzhang on 2017/2/22.
 */
function getOs() {
    var OsObject = "";
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        return "MSIE";
    }
    if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
        return "Firefox";
    }
    if (isSafari = navigator.userAgent.indexOf("Safari") > 0) {
        return "Safari";
    }
    if (isCamino = navigator.userAgent.indexOf("Camino") > 0) {
        return "Camino";
    }
    if (isMozilla = navigator.userAgent.indexOf("Gecko/") > 0) {
        return "Gecko";
    }
}
$(function () {
    if (!getOs()) {
        $("#header").css("padding-right", "17px");
        $("body").css("margin-right", "17px");
    }
});
function primaryMenuToggle(obj) {
    $(obj).toggleClass("actived").siblings(".sidebar-collapse").slideToggle().parent("li").siblings("li").find(".sidebar-collapse").slideUp().siblings("a").removeClass("actived").find("span.plus").show().siblings("span.minus").hide();
    if($(obj).hasClass("actived")){
        $(obj).find("span.minus").show().siblings("span.plus").hide();
    } else {
        $(obj).find("span.plus").show().siblings("span.minus").hide()
    }
}
function activeNavMenu(obj) {
    $("#sidebar").find("a").removeClass("active");
    $(obj).addClass("active");
}
//手机屏时，点击user显示菜单
function showCollapseMenu() {
    $(".collapse-menu").slideToggle("slow");
}
//元素拖動效果
var mousex = 0, mousey = 0;
var divLeft, divTop;
function elementDraggable($obj,e) {
    // console.log("開始拖拽.....")
    var offset = $($obj).offset();
    divLeft = parseInt(offset.left);
    divTop = parseInt(offset.top);
    mousey = e.pageY;
    mousex = e.pageX;
    $($obj).bind('mousemove',dragElement);
    // $($obj).bind('mouseup',cancelDraggable($obj));
}
function cancelDraggable($obj) {
    // console.log("拖拽結束......")
    $($obj).unbind('mousemove');
}
function dragElement(event) {
    var left = divLeft + (event.clientX - mousex);
    var top = divTop + (event.clientY - mousey);
    // console.log(event)
    var max_left=event.clientX-10;
    var max_top=event.clientY-10;
    left=(left>max_left)?max_left:left;
    top=(top>max_top)?max_top:top;
    left=(left<0)?0:left;
    top=(top<0)?0:top;
    $(this).css({
        'top' :  top + 'px',
        'left' : left + 'px',
        'position' : 'absolute'
    });
    return false;
}
function selectColumn($obj) {
    $($obj).addClass("selected").siblings("tr").removeClass("selected")
}
function frameGoBack(obj){
    if(obj.frameElement && obj.frameElement.tagName=="IFRAME"){
        obj.history.back(-1)
    } else {
        return
    }
}
function frameRefresh(obj) {
    if(obj.location){
        obj.location.reload()
    }
}