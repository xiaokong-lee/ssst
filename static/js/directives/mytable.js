/**
 * Created by baopengzhang on 2017/5/17.
 */
app.directive('myTable',function () {
    return{
        restrict:'A',
        replace:true,
        templateUrl:'tmpl/system/table.html',
        link: function (scope,elements,attrs) {
            scope.filter = attrs.filter;
            scope.search = attrs.search;

            scope.dateFilter = attrs.datefilter;
            if(attrs.headers){
                scope.headers = attrs.headers.split(",");
            }
            if(attrs.fields){
                scope.fields = attrs.headers.split(",");
            }
            function getActiveIndex() {
                for(var i=0;i<scope.datas.pages.length;i++){
                    if(scope.datas.pages[i].active){
                        return i;
                    }
                }
            }
            scope.activePage = function (evt) {
                var el = evt.target;
                var text = el.innerHTML;
                var num = getActiveIndex(scope.datas.pages);
                var length = scope.datas.pages.length;
                var n;
                var direction;
                if(text >0){
                    if((text-1) == num) return;
                    n = text-1;
                } else {
                    if(text == "上一頁"){
                        if(num == 0) return;
                        n = num-1;
                        direction = "prev"
                    }
                    if(text == "下一頁"){
                        if(num == length-1) return;
                        n = num+1;
                        direction = "next"
                    }
                }
                scope.datas.activePageData = scope.datas.datas[n];
                function setStatus(obj) {
                    obj.active = false;
                    obj.show = false;
                }
                scope.datas.pages.map(setStatus);
                scope.datas.pages[n].active = true;
                scope.datas.pages[n].show = true;
                if(n+1<length){
                    scope.datas.pages[n+1].show = true;
                } else {
                    if(n-2>=0){
                        scope.datas.pages[n-2].show = true;
                    }
                }
                if(n+2<length){
                    scope.datas.pages[n+2].show = true;
                } else {
                    if(n-3>=0){
                        scope.datas.pages[n-3].show = true;
                    }
                }
                if(n-1>=0){
                    scope.datas.pages[n-1].show = true;
                } else {
                    if(n+2<length){
                        scope.datas.pages[n+2].show = true;
                    }
                }
                if(n-2>=0){
                    scope.datas.pages[n-2].show = true;
                } else {
                    if(n+3<length){
                        scope.datas.pages[n+3].show = true;
                    }
                }
                // console.log(n+"/"+JSON.stringify(scope.datas.pages))
            };
            function devideData(_data,num) {
                var datas = [];
                var pages = [];
                for(var i=0;i<Math.ceil(_data.length/num);i++){
                    var d = [];
                    for(var j=0;j<num;j++){
                        var index = i*num+j;
                        if(_data[index]){
                            d.push(_data[index]);
                        }
                    }
                    datas[i]=d;
                    var active = (i==0)?true:false;
                    var show = (i<5)?true:false;
                    pages.push({'id':i,'active':active,'show':show})
                }
                return {"datas":datas,"pages":pages};
            }
            function getDataObj(data,num){
                var dataObj = devideData(data,num);
                var tableData = {};
                tableData.datas = dataObj.datas;
                tableData.pages = dataObj.pages;
                tableData.totalColumns = data.length;
                tableData.activePageData = tableData.datas[0];
                return tableData
            }
        }

    }
});
// app.directive('myTable',function () {
//     return{
//         restrict:'A',
//         replace:true,
//         templateUrl:'tmpl/system/table.html',
//         link: function (scope,elements,attrs) {
//             scope.filter = attrs.filter;
//             scope.search = attrs.search;
//
//             scope.dateFilter = attrs.datefilter;
//             if(attrs.headers){
//                 scope.headers = attrs.headers.split(",");
//             }
//             if(attrs.fields){
//                 scope.fields = attrs.headers.split(",");
//             }
//             function getActiveIndex() {
//                 for(var i=0;i<scope.datas.pages.length;i++){
//                     if(scope.datas.pages[i].active){
//                         return i;
//                     }
//                 }
//             }
//             scope.activePage = function (evt) {
//                 var el = evt.target;
//                 var text = el.innerHTML;
//                 var num = getActiveIndex(scope.datas.pages);
//                 var length = scope.datas.pages.length;
//                 var n;
//                 var direction;
//                 if(text >0){
//                     if((text-1) == num) return;
//                     n = text-1;
//                 } else {
//                     if(text == "上一頁"){
//                         if(num == 0) return;
//                         n = num-1;
//                         direction = "prev"
//                     }
//                     if(text == "下一頁"){
//                         if(num == length-1) return;
//                         n = num+1;
//                         direction = "next"
//                     }
//                 }
//                 scope.datas.activePageData = scope.datas.datas[n];
//                 function setStatus(obj) {
//                     obj.active = false;
//                     obj.show = false;
//                 }
//                 scope.datas.pages.map(setStatus);
//                 scope.datas.pages[n].active = true;
//                 scope.datas.pages[n].show = true;
//                 if(n+1<length){
//                     scope.datas.pages[n+1].show = true;
//                 } else {
//                     if(n-2>=0){
//                         scope.datas.pages[n-2].show = true;
//                     }
//                 }
//                 if(n+2<length){
//                     scope.datas.pages[n+2].show = true;
//                 } else {
//                     if(n-3>=0){
//                         scope.datas.pages[n-3].show = true;
//                     }
//                 }
//                 if(n-1>=0){
//                     scope.datas.pages[n-1].show = true;
//                 } else {
//                     if(n+2<length){
//                         scope.datas.pages[n+2].show = true;
//                     }
//                 }
//                 if(n-2>=0){
//                     scope.datas.pages[n-2].show = true;
//                 } else {
//                     if(n+3<length){
//                         scope.datas.pages[n+3].show = true;
//                     }
//                 }
//                 // console.log(n+"/"+JSON.stringify(scope.datas.pages))
//             };
//             function devideData(_data,num) {
//                 var datas = [];
//                 var pages = [];
//                 for(var i=0;i<Math.ceil(_data.length/num);i++){
//                     var d = [];
//                     for(var j=0;j<num;j++){
//                         var index = i*num+j;
//                         if(_data[index]){
//                             d.push(_data[index]);
//                         }
//                     }
//                     datas[i]=d;
//                     var active = (i==0)?true:false;
//                     var show = (i<5)?true:false;
//                     pages.push({'id':i,'active':active,'show':show})
//                 }
//                 return {"datas":datas,"pages":pages};
//             }
//             function getDataObj(data,num){
//                 var dataObj = devideData(data,num);
//                 var tableData = {};
//                 tableData.datas = dataObj.datas;
//                 tableData.pages = dataObj.pages;
//                 tableData.totalColumns = data.length;
//                 tableData.activePageData = tableData.datas[0];
//                 return tableData
//             }
//         }
//
//     }
// });
