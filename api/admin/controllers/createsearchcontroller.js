/**
 * @class angular_module.adminApp.createSearchController
 * Created by MHeynes on 09/09/2014.
 */
var createSearchController;


app.controller('createSearchController', function ($scope, $http, $filter, $uibModalInstance, $timeout, $log, fieldTypes) {
    $scope.formData = {
        title     : 'Create Search',
        queryArray: [
            {}
        ],
        history   : [ ]
    };
    $log.debug('printing scope', $scope);
    $scope.data = {};
    $scope.data.fieldTypes = fieldTypes;
    $scope.valid = false;
    $scope.validJson = false;
    /*   button choices */
    $scope.validate = function () {
        var alert, result;
        alert = $scope.formData || 'Didn\'t resolve';   // Tests for returning variable
        result = $filter('json')($scope.formData);      // Tests for valid JSON
        alertT(result, 3000);
        if (result === 1) {
            $scope.validJson = false;
            $log.error('Failed JSON validation', result);
        } else {
            $scope.validJson = true;
            $scope.valid = $scope.validJson;
            $log.debug('scope valid statement', $scope.valid);
            var test = function () {
                $log.debug('scope valid statement', $scope.valid);
            };

            $timeout(test, 1000);
            $log.debug('testing ' + result);
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    $scope.save = function () {
        var config = {
            method : 'post',
            url    : '/api/b2bsearches',
            data   : $scope.formData,
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        };
        //$log.debug(config);
        $http(config).success(
            function (data) {
                $log.debug('Search added', $scope.formData.name);
                $uibModalInstance.close(data);
                //$log.debug(data);
            }).
            error(function (err) {
                $log.error('Error submitting form: ', err);
            });
        // todo Validate this search utilizing same check as for new searches


    };


    $scope.status = 'loading...';
});