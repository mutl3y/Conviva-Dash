//noinspection JSUnusedGlobalSymbols
/**
 * @module api/admin/modalInstanceController
 *
 */

/**
 * @class   angular_module
 * @extends adminApp
 * @param $scope {object} childscope of parent
 * @param $uibModalInstance {object} Reference to Modal
 * @param items {object} Variables being passed in
 * @description Controls the individual Modal popups
 *
 * Popup Modal controller for Admin app<br>
 *
 * This module controls the popup Modals<br>
 *
 * Created by MHeynes on 09/09/2014.
 *
 */
app.controller(
    'ModalInstanceCtrl',  function ($scope, $uibModalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});