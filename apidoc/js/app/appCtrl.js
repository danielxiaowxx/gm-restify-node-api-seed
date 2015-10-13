/**
 * User: Daniel
 * 对应页面index.html
 */

(function() {
    var controller = angular.module('openapi.controller', []);

    controller.controller('AppCtrl', ['$scope', function AppCtrl($scope) {

        /*========== Widget Events ==================================================*/

        /*========== Scope Models ==================================================*/

        $scope.versions = [];

        $scope.services = [];

        $scope.serviceAPIDoc = {};

        $scope.docData = {};

        /*========== Scope Functions ==================================================*/

        $scope.changeVersion = function(version) {
            $scope.services = [];
            _.each($scope.docData[version], function(data, key) {
                $scope.services.push({version:version, service:key});
            });
        }

        $scope.changeService = function(service, version) {
            $scope.serviceAPIDoc = $scope.docData[version][service];
        }

        /*========== Listeners ==================================================*/

        /*========== Watches ==================================================*/

        /*========== Private Functions ==================================================*/

        function _init() {
            var data = API_DATA;
            $scope.docData = data;
            _.each(data, function(data, key) {
                $scope.versions.push(key);
            });
        }

        _init();
    }]);

})();

