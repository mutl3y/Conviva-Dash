//noinspection JSHint
/**
 * @module api/admin/editSearchController
 */

/**
 * @param $scope            {object} childscope of parent
 * @param $http             {object}
 * @param $uibModalInstance    {object} Reference to Modal
 * @param $log              {object}
 * @param $filter           {object}
 * @param obj               {object}
 * @param fieldTypes        {object} Pass in globally defined field types
 * @description Create and edit search controller for admin app
 * @extends adminApp
 * @class angular_module
 * @augments angular_module.adminApp
 * @memberOf adminApp/admin
 */
angular.module('adminApp').controller('editSearchController', editSearchController);

function editSearchController( $scope, $http, $uibModalInstance, $log, $filter, obj, fieldTypes ) {
    $log.debug('edit controller received this to edit', obj);
    $scope.formData = obj;
    $scope.data = {};
    $scope.data.fieldTypes = fieldTypes;
    $scope.data.dbTypes = $scope.$$prevSibling.dbTypes;
    $scope.formData.title = 'Edit Search ' + obj._id;
    $scope.popovers = true;

    $scope.selected2 = undefined;

    $scope.valid = false;

    $scope.validate = function () {
        var result;
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
        $uibModalInstance.dismiss('cancel');
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
            function ( data ) {
                $log.debug('Search Sent to server: ', obj.name);
                $log.debug(data);
            }
        ).error(
            function ( err ) {
                $log.error('Error submitting form: ', err);
            }
        );

        $uibModalInstance.close($scope.formData);
    };

    $scope.status = 'loading...';

    $scope.selected2 = undefined;

}

