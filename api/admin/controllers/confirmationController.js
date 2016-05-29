/**

 * @namespace angular_module.adminApp.controllers
 * @extends angular_module.adminApp
 *
 * @param $scope {object} pass in child scope
 *
 * @param $modalInstance {object}
 * Reference to launched modal  instance
 *
 * Presents a confirmation dialogue
 *
 */

app.controller(
    'confirmationController', function ($scope, $modalInstance) {
    /**
     *
     * @description Dismiss modal
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    /**
     * Script for close button
     */
    $scope.confirm = function () {
        $modalInstance.close('True');
    };
});