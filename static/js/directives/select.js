/**
 * Created by baopengzhang on 2017/5/17.
 */
app.directive("mySelect",function () {
    function link($scope, element, attrs) {
        $scope.$watch(attrs['mySelect'], function() {
            angular.element(element[0]).selectmenu({
                change: function( event, ui ) {
                    var index = ui.item.index;
                    angular.element(element[0]).change()
                }
            });
        }, true);
        // $scope.getDom = function() {
        //     return {
        //         'height': element[0].offsetHeight,
        //         'width': element[0].offsetWidth
        //     };
        // };
        $scope.$watch($scope.getDom, function() {
            // resize echarts图表
            myChart.resize();
        }, true);
    }
    return {
        restrict: 'A',
        link: link
    };
});