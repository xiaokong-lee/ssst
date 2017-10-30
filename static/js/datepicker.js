/**
 * Created by baopengzhang on 2017/4/14.
 */
$(".form_datetime").datetimepicker({
    format: 'yyyy-mm-dd hh:ii:ss',
    autoclose: true,
    beforeShow: function () {
        console.log("haogieh")
        setTimeout(function () {
                $('#ui-datepicker-div').css("z-index", 999);
            }, 100
        );
    }
});
