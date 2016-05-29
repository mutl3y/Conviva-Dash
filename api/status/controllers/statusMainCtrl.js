/**
 * @ngdoc controller
 * @name mongoDashStatus.controller:statusMainCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */

app.controller('StatusMainController', function ($scope, $http, $uibModal, $log, $resource) {
        'use strict';
        $scope.orderProp = 'name';          // Default sort field
        $scope.direction = false;           // default search direction false = ascending
        $scope.statObjectsToDisplay = [];   // Array to hold status Objects
        $scope.draggedTitle = '';
        $scope.colourPairs = [
            {b: '73fdce', c: '534cb7'},
            {b: 'c6ac7f', c: '36492'},
            {b: 'c869d1', c: '2e3301'},
            {b: '92711a', c: 'ded0ba'},
            {b: '66de75', c: 'ac6298'},
            {b: '2bf4ab', c: '7e6504'},
            {b: 'f1bd50', c: '5dac2'},
            {b: 'd5a8e3', c: 'c031b0'},
            {b: 'a91716', c: 'a2dd28'},
            {b: 'fd1b6a', c: '85d8f6'},
            {b: 'ba260c', c: '44f50f'},
            {b: 'e5fcd1', c: '2f8d1f'},
            {b: 'f47aaa', c: '9d1c68'},
            {b: '973223', c: '2af095'},
            {b: '993050', c: '74db51'},
            {b: '671cfd', c: 'fa8d0c'},
            {b: '272c18', c: '5188f9'},
            {b: 'a266bb', c: 'f2bc70'},
            {b: '80d67a', c: '4a6a89'},
            {b: 'f5ef4', c: 'e93abb'}];

        function shuffleArray(d) {
            for (var c = d.length - 1; c > 0; c--) {
                var b = Math.floor(Math.random() * (c + 1));
                var a = d[c];
                d[c] = d[b];
                d[b] = a;
            }
            return d;
        }

        shuffleArray($scope.colourPairs);

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
         * when landing on the page, get all status info and show it
         *
         * @kind            function
         */

        $scope.getStatsData = function () {
            $http.get('/api/stats')
                .success(
                function (data) {
                    /**
                     * Handle status objects dynamically as they are returned.
                     *
                     * todo Expand this to include graphs generated client side
                     *
                     */
                    data.forEach(function (obj, i, a) {
                            obj.show = false;
                            obj.drag = true;
                            obj.class = 'col-xs-6 col-md-5 col col-lg-5 chart-outer-container';

                            // Add a unique color to each status object.
                            obj.styles = 'background-color : #' + $scope.colourPairs[i].b + '; color: #' + $scope.colourPairs[i].c + ';';
                            $scope.statObjectsToDisplay.push(obj);
                            //console.log('Size of json is ', $scope.sizeOf(obj.result), obj);
                        }
                    );
                }
            )
                .error(
                function (data) {
                    $log.error('Error whilst retrieving server stats: ', data);
                }
            );
        };
        $scope.getStatsData();
    }
);


