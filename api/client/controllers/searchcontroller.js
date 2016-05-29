//var mask = require('json-mask')

var searchController;

app.controller(
    'searchController', function ($scope, $http, $uibModalInstance, $log, $filter, $timeout, obj) {
    $log.debug($scope);
    $scope.showResults = false;
    $scope.alerts = [];
    $scope.resetForm = function () {
        $scope.formData = {
            _id       : obj._id,
            title     : obj.name,
            queryArray: [ ]
        };
        populateFormdata();
        $scope.valid = false;
    };


    $log.debug('Search Controller wants to run [' + obj._id + '}', obj.name);
    /**
     * setup arrays to hold search params and form data
     */
    $scope.searchParams = obj;
    $scope.resetForm();

    /**
     * populate formData.queryArray with one empty object per search item
     */
    function populateFormdata() {
        for (var i = 0; i < $scope.searchParams.queryArray.length; i += 1) {
            var fieldName = $scope.searchParams.queryArray[i].field;
            var pushObject = {};
            pushObject.field = fieldName;
            pushObject.query = '';

            $scope.formData.queryArray.push(pushObject);
            $log.debug(pushObject);
            $scope.showResults = false;
        }
    }

    /**
     * alertUser function
     * @param ty    Type of message
     * @param msg   Message to display
     * @param t     Timeout to clear message
     */
    function alertUser(ty, msg, t) {

        switch (ty) {
            case 'success':
                $scope.alerts.push({ type: 'success', msg: msg});
                break;
            case 'warning':
                $scope.alerts.push({ type: 'warning', msg: msg});
                break;
            case 'danger':
                $scope.alerts.push({ type: 'danger', msg: msg});
                break;

            default:
                console.log('$scope.alertUser, MessageEvent type not recconised: ' + ty);
                $scope.alerts.push({ type: 'default', msg: msg});
                break;
        }

        /**
         * Clear user message
         */
        $timeout(function () {
            $scope.alerts.splice(0, 1);
        }, t);
    }

    $scope.validate = function () {
        var result;
//        alert = $scope.formData || 'Didn\'t resolve';   // Tests for returning variable todo remove
        result = $filter('json')($scope.formData);      // Tests for valid JSON
        $log.debug(result);
        $scope.valid = true;
        $log.debug('Valid JSON received =  ', $scope.valid);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.run = function () {
        $log.debug('Form Data',$scope.formData);
        var config = {
            method : 'post',
            url    : '/api/b2bRunSearch/' + $scope.formData._id,
            data   : $scope.formData,
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        };
        $log.debug(config);
        $http(config)
            .error(
            function (data, status, headers, config) {
                //Debugging stuff todo
                $log.debug('Status code returned is ' + status);
                $log.error('Error running search: ', config.data.id, ' http status returned from api is ', status);
                alertUser('danger', data.userMsg, 10000);
                $scope.resetForm();
            })      // End of error loop

            .success(
            function (data, status, headers, config) {

                //Debugging stuff todo
                $log.debug('Status code returned is ' + status);
                $log.debug('Length of data returned ' + data.data.length);
                $log.debug(arguments);

                /**
                 * Display message to user
                 *
                 */
                switch (status) {
                    case 200:
                        alertUser('success', 'Compiling results', 3000);
                        var tbl = prettyPrint(data.data, { maxDepth: 4 });
                        angular.element('#resultsTable').replaceWith(tbl);
                        $scope.showResults = true;
                        break;

                    case 206:
                        alertUser('warning', 'No results returned', 3000);
                        console.log('No Results returned');
                        $scope.resetForm();
                        break;

                    default:
                        alertUser('danger', 'Unknown status \nPlease report this to DBA team \n' + status, 5000);
                }
            }
        );      // end of succsess loop
    };          // end of $scope.run

    $scope.close = function () {
        $uibModalInstance.close($scope.formData);
    };

    $scope.getItemState = function (form, itemPrefix, index) {

        if (typeof form !== 'undefined' && typeof itemPrefix !== 'undefined' && typeof index !== 'undefined') {
            console.log('Variables declared with values');
            console.log('Form = ', form);
//            console.log('Prefix = ', itemPrefix);
//            console.log('Index = ', index);

//            var s = '' + index;
//            var i = itemPrefix+s;
//            console.log('combind form name ', typeof(i));
//            console.log(i);
//            console.log(form.i);

//            if (form.i.$valid) {
//                console.log('Valid');
//                return "valid";
//            }
//            else if (form.i.$invalid) {
//                console.log('Invalid');
//                return "invalid";
//            }
//            else {
//                return "";
//            }
        }
    };

    $scope.getItemError = function (item) {
        if (item.$invalid) {
            return item.$error;
        }
        else {
            return null;
        }
    };

    $scope.getValidationCSSClass = function (item) {
        // We show an error only if the item has been modified
        // at least once to avoid displaying errors as soon as
        // the form is loaded (we wait for the user to interact
        // with the controls before declaring them invalid).
        return {
            invalidItem: item.$invalid && item.$dirty
        };
    };

    $scope.getValidationError = function (item) {
        // We show an error only if the item has been modified
        // at least once to avoid displaying errors as soon as
        // the form is loaded (we wait for the user to interact
        // with the controls before declaring them invalid).
        if (item.$dirty && item.$error.required) {
            return "Required field";
        }
        else {
            return "";
        }
    };

});

