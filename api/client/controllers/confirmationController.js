/**
 * Created by MHeynes on 03/09/2014.
 */

app.controller(
    'confirmationController', function ($scope, $uibModalInstance) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.confirm = function () {
        $uibModalInstance.close('True');
    };
});