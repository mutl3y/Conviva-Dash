/**

 * @namespace angular_module.adminApp.controllers
 * @extends angular_module.adminApp
 *
 * @param $scope {object} pass in child scope
 *
 * @param $uibModalInstance {object}
 * Reference to launched modal  instance
 *
 * Presents a confirmation dialogue
 *
 */

angular.module('adminApp').controller(
    'confirmationController', function ($scope, $uibModalInstance) {
    /**
     *
     * @description Dismiss modal
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * Script for close button
     */
    $scope.confirm = function () {
        $uibModalInstance.close('True');
    };
});