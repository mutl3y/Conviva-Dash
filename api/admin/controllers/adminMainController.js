/**
 * Created by MHeynes on 11/09/2014.
 * @module
 */
var adminMainCtrl;

/**
 * @class angular_module.adminApp.controllers
 * @extends angular_module.adminApp
 * @param $scope        {object} $http    {@link https://docs.angularjs.org/guide/scope}
 * @param $http         {object} $http    {@link http://docs.angularjs.org/api/ng.$http}
 * @param $modal        {object} $http    pass in Modal service from UI-Bootstrap
 * @param $log          {object} $http   Angular logging facility
 * @description Main Angular controller for page
 *
 */
app.controller(
    'adminMainCtrl', function ($scope, $http, $modal, $log) {
        'use strict';
        $scope.searchesChecked = [];
        $scope.orderProp = 'name';  // Default sort field
        $scope.direction = false;   // default search direction false= ascending
        $scope.fieldTypes = [
            {name: 'String', popover: 'Alpha numeric, Min / Max refers to characters'},
            {name: 'Number', popover: 'Whole integers only, Min / Max Number'},
            {name: 'Regexp', popover: 'Regular Expression'}
        ];

        $scope.dbTypes = [
            {name: 'MongoDB', popover: 'MongoDB '},
            {name: 'MS_SQL', popover: 'Microsoft SQL Server'},
            {name: 'MY_SQL', popover: 'Oracle My-SQL'},
            {name: 'Oracle', popover: 'Oracle'}
        ];


        /**
         * @function    $scope.$watchCollection
         * @description Button watcher to keep the right buttons viable for a given scenario
         * @argument    Array to watch
         *
         *
         */
        $scope.$watchCollection('searchesChecked', function () {
            //noinspection LocalVariableNamingConventionJS
            var $createButton, $editButton, $deleteButton, $resetButton;
            $createButton = $('#create_Button');
            $editButton = $('#edit_Button');
            $deleteButton = $('#delete_Button');
            $resetButton = $('#reset_Button');

            switch ($scope.searchesChecked.length) {
                case 0:
                    $createButton.removeClass('hidden').addClass('btn-success btn');
                    $editButton.removeClass('btn btn-primary').addClass('hidden');
                    $deleteButton.removeClass('btn btn-danger').addClass('hidden');
                    $resetButton.removeClass('btn').addClass('hidden');
                    break;
                case 1:
                    $createButton.removeClass('btn-success btn').addClass('hidden');
                    $editButton.removeClass('hidden').addClass('btn btn-primary');
                    $deleteButton.removeClass('hidden').addClass('btn btn-danger');
                    $resetButton.removeClass('hidden').addClass('btn');
                    break;
                default:
                    $createButton.removeClass('btn-success btn').addClass('hidden');
                    $editButton.removeClass('hidden').addClass('hidden');
                    $deleteButton.removeClass('hidden').addClass('btn btn-danger');
                    break;
            }
        });


        /**
         * @function toggleSelected
         *
         * @Description Toggle function to add / remove selected searches from a pre-processing array.\n
         * Calls resetButton to update edit and delete button visibility
         *
         * @kind            function
         */
        $scope.toggleSelected = function () {
            $log.debug($scope);
            $scope.selected = this.search;
            $scope.selected.isChecked = !$scope.selected.isChecked;
            if (lookupID($scope.selected, $scope.searchesChecked)) {
                $scope.searchesChecked = $.grep(
                    $scope.searchesChecked, function (elem) {
                        return elem !== $scope.selected;
                    }
                );
            } else {
                $scope.searchesChecked.push($scope.selected);
                $log.debug('Pushed New Object \t\t\t', $scope.selected._id);
            }
        };
        $scope.RunTest = function () {
            $log.info($scope.searchesChecked);
        };

        /**
         * Reset selections
         */
        $scope.reset = function () {
            var s, o;
            $scope.searchesChecked = [];
            for (o = 0; o <= $scope.searchResults.length - 1; o++) {
                $scope.searchResults[o].isChecked = false;
            }
        };

        /**
         * @name sort
         *
         * @param column
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
        $http.get('/api/b2bSearches').success(
            function (data) {
                $scope.searchResults = data;
                $scope.searchNames = [];
                //console.log( $scope.searchResults[0].name);
                for (var item in data) {
                    $scope.searchNames.push(data[item].name);
                }
            }
        ).error(
            function (data) {
                $log.error('Error whilst querying server: ', data);
            }
        );

        /**
         * @name            deleteSearch
         * @kind            function
         * @description
         * Used to delete item by _id
         * Creates a dynamic object that contains the _id of the obj to be deleted
         *
         * Can also delete by name but not implemented in this version of the admin app
         *
         * sends the object._id  to the server for deletion
         */
        $scope.deleteSearch = function (id) {
            $log.debug('Received _id ' + id);
            var config = {
                method: 'DELETE',
                url: '/api/b2bSearch/' + id,
//                             data    : {'_id' : id},
                headers: {'Content-Type': 'application/json;charset=utf-8'}
            };
            $log.debug(config);

            $http(config).success(function (data) {
                $log.debug('Search deleted', id);
                $scope.searchResults = data;
                //$log.debug(data);
            }).error(function (data) {
                $log.error('Error deleting search: ', data);
            });

        };


        /**
         * @name deleteSearchs
         *
         * @description
         *
         * looping through objects in the pre-processing array and pass to deleteSearch function
         * defined in main controller function
         *
         * @kind            function
         *
         */
        $scope.deleteSearches = function () {

            var modalInstance = $modal.open(
                {
                    templateUrl: '/api/admin/partials/confirm.html',
                    controller: 'confirmationController',
                    size: 'lg'
                }
            );

            modalInstance.result.then(
                function (result) {
                    $log.debug(result);
                    $log.debug('Put deletes here');
                    for (var obj in $scope.searchesChecked) {
                        //noinspection JSUnfilteredForInLoop
                        var item = $scope.searchesChecked[obj];
                        if (!item.hasOwnProperty('_id')) {
                            $log.error('Error: Missing id in delete');
                        } else {
                            $log.debug(item._id);
                            $scope.deleteSearch(item._id);
                            $log.debug('Deleted ' + item._id);
                        }
                    }

                    $http.get('/api/b2bSearches').success(
                        function (data) {
                            $scope.searchResults = data;
                            $log.debug(data);
                            $scope.searchesChecked.length = 0;
                        }
                    ).error(
                        function (data) {
                            $log.error('Oops: ', data);
                        }
                    );

                }, function () {
                    $log.debug('Delete Searches Modal dismissed, ');
                }
            );
            //$scope.ButtonReset();
        };// end of deleteSearches

        /*                     */
        /**
         * @name            createSearch
         * @description
         * Used when submitting the create search form
         * sends the formData object to the server
         *
         * @kind            function
         *
         * Pass in $scope, $http and $timeout
         *
         * todo Debug form submission issue
         */
        $scope.createSearch = function () {


            var modalInstance = $modal.open(
                {
                    templateUrl: '/api/admin/partials/editSearchForm.html',
                    controller: 'createSearchController',
                    size: 'lg',
                    resolve: {
                        fieldTypes: function () {
                            return $scope.fieldTypes;
                        }
                    }
                }
            );

            modalInstance.result.then(function (result) {
                $scope.searchResults = result;
            }, function () {
                $log.debug('Create search Modal dismissed, ');
            });
        };


        /*                     */
        //noinspection JSUnusedLocalSymbols
        /**
         * @name            editSearch
         * @description
         * Used when editing search result
         * sends the formData object to the server as an update
         *
         * @kind            function
         *
         * Pass in $scope, $http and $timeout
         *
         * todo Debug form submission issue
         */
        $scope.editSearch = function ($modalInstance) {
            var selected;
            $log.debug('Search passed to edit', this.selected);
            selected = this.selected;
            //noinspection JSUnusedGlobalSymbols
            var modalInstance = $modal.open(
                {
                    templateUrl: '/api/admin/partials/editSearchForm.html',
                    controller: editSearchController,
                    size: 'lg',
                    resolve: {
                        obj: function () {
                            return $scope.searchesChecked[0];
                        },
                        fieldTypes: function () {
                            return $scope.fieldTypes;
                        }
                    }
                }
            );

            modalInstance.result.then(
                function (editedSearch) {
                    $scope.searchesChecked.length = 0;
                    $scope.selected.isChecked = false;
                    $log.debug(editedSearch); //$scope.selected = selectedItem;
                    // todo Validate this search utilizing same check as for new searches
                    // todo Save this search to the server
                }, function () {
                    $log.debug('Edit Search Modal dismissed, ' + new Date());
                }
            );
        };


    }
); // End SearchAdmin controller