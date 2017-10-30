/**
 * Created by Administrator on 2017/7/12.
 */
$(function (e) {
    $('.user-group li').click(function () {
        $('.user-group li').removeClass('active');
        $(this).addClass('active')
    });
    $('.data_active').click(function () {
        $('#menu').show();
        $('#my_menu').hide();
    });
    $('.data_my').click(function () {
        $('#my_menu').show();
        $('#menu').hide();
    });
    $("#main-menu-toggle").click(function () {
        e("body").hasClass("sidebar-hide") ? e("body").removeClass("sidebar-hide") : e("body").addClass("sidebar-hide");
        // e(window).resize();
    });
    $("#menu").on("click","a",function () {
        if($(this).find(".fa-minus").is(":hidden")){
            $(this).find(".fa-plus").hide().siblings(".fa-minus").show();
            $(this).parent().addClass("extend").siblings(".extend").removeClass("extend").find(".fa-minus").hide().siblings(".fa-plus").show();
        } else {
            $(this).find(".fa-plus").show().siblings(".fa-minus").hide();
            $(this).parent().removeClass("extend");
        }
    })
});