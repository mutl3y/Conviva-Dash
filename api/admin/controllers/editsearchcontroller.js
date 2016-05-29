//noinspection JSHint
/**
 * @module api/admin/editSearchController
 */
var editSearchController;


/**
 * @param $scope            {object} childscope of parent
 * @param $http             {object}
 * @param $modalInstance    {object} Reference to Modal
 * @param $log              {object}
 * @param $filter           {object}
 * @param obj               {object}
 * @param fieldTypes        {object} Pass in globaly defined field types
 * @description Create and edit search controller for admin app
 * @extends adminApp
 * @class angular_module
 * @augments angular_module.adminApp
 * @memberOf api/admin
 */
app.controller(
    'editSearchController',  function ($scope, $http, $modalInstance, $log, $filter, obj, fieldTypes) {
    $log.debug('edit controller recieved this to edit', obj);
    $scope.formData = obj;
    $scope.data = {};
    $scope.data.fieldTypes = fieldTypes;
    $scope.data.dbTypes = $scope.$$prevSibling.dbTypes;
    $scope.formData.title = 'Edit Search ' + obj._id;
    $scope.popovers = true;

    $scope.selected2 = undefined;

    $scope.valid = false;

    $scope.validate = function () {
        var alert, result;
        alert = $scope.formData || 'Didn\'t resolve';   // Tests for returning variable
        result = $filter('json')($scope.formData);      // Tests for valid JSON
        $scope.formData.projection = $scope.formData.projection.replace(/'/g, ' '); // Remove any single quotes
        $scope.formData.projection = $scope.formData.projection.replace(/"/g, ' '); // Remove any double quotes
        alertT(result);
        $scope.valid = true;
        $log.debug('Form Valid =  ', $scope.valid);
    };

    $scope.checkForm = function () {
        alertT('Simulating Validation', 300);
        return false;
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        var config = {
            method : 'put',
            url    : '/api/b2bsearch/' + obj._id,
            data   : $scope.formData,
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        };
        $log.debug(config);
        $http(config).success(
            function (data) {
                $log.debug('Search Sent to server: ', obj.name);
                $log.debug(data);
            }
        ).error(
            function (err) {
                $log.error('Error submitting form: ', err);
            }
        );

        $modalInstance.close($scope.formData);
    };

    $scope.status = 'loading...';

    $scope.selected2 = undefined;

});

