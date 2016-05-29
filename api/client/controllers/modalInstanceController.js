//noinspection JSUnusedGlobalSymbols
/**
 * @module api/client/modalInstanceController
 *
 */

/**
 * @class   angular_module
 * @extends clientApp
 * @param $scope {object} childscope of parent
 * @param $modalInstance {object} Reference to Modal
 * @param items {object} Variables being passed in
 * @description Controls the individual Modal popups
 *
 * Popup Modal controller for Client app<br>
 *
 * This module controls the popup Modals<br>
 *
 * Created by MHeynes on 09/09/2014.
 *
 */

app.controller(
        'ModalInstanceCtrl', function ($scope, $modalInstance, items) {
        $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});