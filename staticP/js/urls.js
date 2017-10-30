/**
 * Created by baopengzhang on 2017/5/26.
 */
var host90 = "http://10.129.4.97:90";
// var host90 = "http://st.foxconn.com";
// var host90 = "http://10.149.6.160";
// var host90 = "http://10.149.6.177";


var urls = {
    host: host90,
    mQtt: "ws://10.129.7.199:61614",
    login: host90 + "/ac/login",
    logout: host90 + "/ac/logout",
    CodeLogin: host90 + "/ac/QR_code_login ",
    checkUser: host90 + "/ac/check_user",
    mySystemMenu: host90 + "/menu/mySystemMenu",
    myMenu: host90 + "/menu/mymenu",
    userAuth: host90 + "/menu/user_auth",
    retrieveCode: host90 + "/ac/retrieve_pwd",
    retrievePwd: host90 + "/ac/set_new_pwd",
    bugFeedBack: "http://10.129.4.145/feedback?pid=PR201706300001",
    bugSearch: "http://10.129.4.145/searchsmall",
    set_new_pwd:host90 + "/ac/set_new_pwd"
};


// app.constant('urls',

var app =
    {
    "host": host90,
    "mqtt": "ws://10.129.7.199:61614",
    "login": host90 + "/ac/login",
    "logout": host90 + "/ac/logout",
    "CodeLogin": host90 + "/ac/QR_code_login ",
    "checkUser": host90 + "/ac/check_user",
    "functions":host90 + "/ars/functions",
    "roles":host90 + "/ars/roles",
    "orgRole": host90 + "/ac/org_role",
    "users":host90 + "/ars/user_role",
    "tmplcategory":host90 + "/forms/tmplcategory",
    "datasource":host90 + "/forms/datasource",
    "dataitem":host90 + "/forms/datasource/item",
    "analyztmpl":host90 + "/forms/analyzetemp",
    "tmpls":host90 + "/forms/tmpls",
    "tmplconfig":host90 + "/forms/tmplconfig",
    "forms":host90 + "/forms/forms",
    "sendMsg":host90 + "/api/workflow_reminder",
    "workflow":host90 + "/api/workflow_name",
    "workflows":host90 + "/api/workflow/",
    "userRoles":host90 + "/forms/datasource/item/parser?UserID=1",
    "workFlowRole": host90 + "/api/workflow_role",
    "wl_approval":host90 + "/api/workflow_approval",
    "acUsers": host90 + "/ac/users",
    "userflow":"",
    "urgeform":"",
    "tasks":"",
    "myagents":"",
    "agentUserConfig":host90 + "/api/workflow_agent_config",
    "agents": host90 + "/api/workflow_agent",
    "userOrg": host90 + "/api/user_org",
    "ckeckFlowTitle": host90 + "/api/workflow_name",
    "orgLevel": host90 + "/ac/org_level",
    "org": host90 + "ac/org",
    "info_duty": host90 + "/ac/duty",
    "info_site": host90 + "/ac/site",
    "form_fileUplonad":host90 + "/forms/fileupload",
    "retrieve_pwd":host90 + "/ac/retrieve_pwd",
    "retrieve_code":host90 + "/ac/set_new_pwd",
    "myagented":"",
    "formsreport":"",
    "logos":"",
    "systemmenu":host90 + "/menu/systemMenu",
    "mysystemmenu":host90 + "/menu/mySystemMenu",
    "mymenu":host90 + "/menu/mymenu",
    "mysystemmenu":host90 + "/menu/mySystemMenu",
    "menu_func":host90 + "/menu/user_func",
    "form_type":host90 + "/api/from_type",
    "from_approval":host90 + "/api/from_approval",
    "from_approval2":host90 + "/api/from_approval2",
    "from_users":host90 + "/ac/users",
    "system_func":host90 + "/menu/system_func",
    "user_func":host90 + "/menu/user_func",
    "dataParser":host90+"/forms/datasource/item/parser",
    "user_auth":host90+"/menu/user_auth",
    "batch_check":host90+"/api/workflow_bacth_approval",
    "fromNodeTotal": host90 + "/api/from_node",
    "fromNodeTotalMonth": host90 + "/api/from_month",
    "fromTypeTotal": host90 + "/api/from_type?status=11",
    "status": host90 + "/ac/status",
    "activeUser": host90 + "/ac/active_user",
    "historyVideo": "http://10.167.192.160:8088/VSOM.asmx/Getstream_Clip_Palytime?CamName=",
    "bugFeedBack": "http://10.129.4.145/feedback?pid=PR201706300001",
    "bugSearch": "http://10.129.4.145/searchsmall",
}


