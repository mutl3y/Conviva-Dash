/**
 * Created by MHeynes on 03/09/2014.
 */

app.controller(
    'confirmationController', function ($scope, $modalInstance) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.confirm = function () {
        $modalInstance.close('True');
    };
});