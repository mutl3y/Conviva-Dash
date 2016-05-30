/**
 * Created by MHeynes on 11/09/2014.
 */
var clientMainCtrl;


/**
 *
 * @param $scope
 * @param $http
 * @param $timeout
 * @description
 *
 *
 .controller('clientMainCtrl', ['$log', function ($log) {
        $log.debug('Hello Debug!');
    }]);
 *
 * Main Angular controller for page
 *
 *  @kind            function
 */
app.controller(
    'clientMainCtrl', function ($scope, $http, $uibModal, $log) {
        'use strict';
        $log.debug('client main controller initial scope ', $scope);
        $scope.orderProp = 'name';  // Default sort field
        $scope.direction = false;   // default search direction false= ascending


        /**

         * @name setSelected
         *
         * @description
         * Toggle function to add / remove selected searches from a pre-processing array
         *
         * Calls resetButton to update edit and delete button visibility
         *
         * @kind            function
         */
        $scope.setSelected = function () {
            //console.log("show", arguments, this);
            if ($scope.lastSelected) {
                $scope.lastSelected.selected = '';
            }
            this.selected = 'selected';
            $scope.lastSelected = this;
        };

        $scope.RunTest = function () {
            $log.debug('scope.lastSelected ',$scope.lastSelected);
            //delete obj[ 0 ].regExp;
            var runSearch= $scope.lastSelected.search;
            $log.debug('Unmodified object ', runSearch);
            for (var a=0; a < runSearch.queryArray.length; a++){
                var update = runSearch.queryArray[ a ].regExp || '';
                $log.debug('Re-written object before ', update);
                update.replace(/\//g, '\\');
                runSearch.queryArray[ a ].regExp = new RegExp(update);
                $log.debug('Re-written object after', update);
            }


            // todo add open dynamic modal from here using search parameters
             var modalInstance = $uibModal.open(
                {
                    templateUrl: '/api/client/partials/search.html',
                    controller : 'searchController',
                    size       : 'lg',
                    resolve    : {
                        obj: function () {
                            return runSearch;
                        }
                    }}
            );

            modalInstance.result.then(
                function (result) {
                    $log.debug('modal instance result ', result);

                    $http.get('/api/b2bActiveSearches').success(
                        function (data) {
                            $scope.searchResults = data;
                            $log.debug('http.get returned data', data);
                            $scope.selected = '';
                        }
                    ).error(
                        function (data) {
                            $log.error('Oops: ', data);
                        }
                    );

                }, function () {
                    $log.debug('Run Search Modal dismissed ');
                }
            );
        };

        /**
         * @name            sort
         *
         * @param           column
         *
         * @description
         * Provides sort function for showResults data
         *
         * @kind            function
         */
        $scope.sort = function (column) {
            if ($scope.orderProp === column) {
                $scope.direction = !$scope.direction;
            } else {
                $scope.orderProp = column;
                $scope.direction = false;
            }
        };


        /**
         * @name            .get
         * @description
         *
         * when landing on the page, get all searchResults and show them
         *
         * @kind            function
         *
         */
        $http.get('/api/b2bActiveSearches').success(
            function (data) {
                $scope.searchResults = data;
                /// $log.debug(data);
            }
        ).error(
            function (data) {
                $log.error('Error whilst querying server: ', data);
            }
        );

    }
); // end client main controller