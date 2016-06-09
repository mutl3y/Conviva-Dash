/**
 * Created by Mark on 07/06/2016.
 */
var $rootScope,
    $scope,
    controller;

beforeEach(function () {
    module('adminApp');

    inject(function ( $injector ) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        controller = $injector.get('$controller')('adminMainCtrl', {$scope: $scope});
    })
});

describe('Controller: adminMainCtrl', function () {
    var adminMainCtrl,
        //httpBackend,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ( $controller, $rootScope ) {
        scope = $rootScope.$new();

        adminMainCtrl = $controller('adminMainCtrl', {
            $scope: scope
            // place here mocked dependencies
        });
    }));

    describe('Create and set variables', function () {
        it('should setup inital variables', function () {
            expect($scope.searchesChecked).toEqual([]);
            expect($scope.orderProp).toEqual('name');
            expect($scope.direction).toEqual(false);
            expect($scope.fieldTypes).toEqual([
                {name: 'String', popover: 'Alpha numeric, Min / Max refers to characters'},
                {name: 'Number', popover: 'Whole integers only, Min / Max Number'},
                {name: 'Regexp', popover: 'Regular Expression'}
            ]);
            expect($scope.dbTypes).toEqual([
                {name: 'MongoDB', popover: 'MongoDB '},
                {name: 'MS_SQL', popover: 'Microsoft SQL Server'},
                {name: 'MY_SQL', popover: 'My-SQL'},
                {name: 'Oracle', popover: 'Oracle'}
            ]);
        });


    });

    // todo Templating checks Needs implementing
    describe('Function: $scope.$watchCollection, watch searchesChecked and modify visible editor buttons', function () {
        beforeEach(inject(function ( _$httpBackend_ ) {
            $httpBackend = _$httpBackend_;
        }));

        describe('start without anything selected', function () {
            it('should not have classes set for editor buttons', function () {
                //var $httpBackend;
                $httpBackend.when('GET', '/api/b2bSearches').respond('hello');
                expect($scope.searchesChecked.length).toBe(0);
                expect($scope.searchesChecked).toBeDefined();

                //expect($el('#create_Button:btn').count()).toBe(0);
            })
        });
        describe('with only a single search selected', function () {
            it('should hide create button but show others', function () {
                $scope.searchesChecked.push('test object');
                expect($scope.searchesChecked.length).toBe(1);
            })
        });
        describe('with more than a single search selected', function () {
            it('should only show reset and delete buttons', function () {
                $scope.searchesChecked.push('test object');
                $scope.searchesChecked.push('test object');
                expect($scope.searchesChecked.length).toBeGreaterThan(1)
            })
        });

    });

// todo: Need to fix .this addressing
    xdescribe('Function: $scope.toggleSelected, toggle search highlighting when selected', function () {
        it('should toggle the selection of a search ', function () {
            $scope.$controller.selected = 'as';
            $scope.search = {
                $$hashKey : "object:3",
                Collection: "NowTV",
                _id       : "574d9a0a7ceb7e642e580818",
                active    : true,
                database  : "conviva",
                dbEngine  : "mongodb",
                explain   : null,
                isChecked : true,
                name      : "testing",
                projection: "_id:0",
                queryType : "findOne",
                updated   : "2016-05-31T14:05:09.316Z"
            };
            $scope.selected = {};
            $scope.selected.isChecked = true;
            console.log(this);

            //scope.toggleSelected();
            //expect($scope.selected).toEqual();

            //expect($scope.selected.isChecked).toBeTruthy();

        });
        xit('should remove a deselected search from the searchesChecked array and de-highlight search in browser', function () {
            expect().toBe();
        });
    });

    // todo: This module does nothing in codebase and needs fleshing out or abandoning
    xdescribe('Function: $scope.RunTest, Should test run the query', function () {
        it('Should test run the query', function () {

        })
    });
    describe('Function: $scope.reset,   Should reset searches selected', function () {
        it('should empty the searchesChecked array', function () {
            $scope.searchesChecked = [ 'a test array entry' ];
            $scope.searchResults = [ {name: 'testObject', isChecked: true} ];
            expect($scope.searchResults).toContain(jasmine.objectContaining({isChecked: true}));
            expect($scope.searchesChecked.length).toBe(1);
            $scope.reset();
            expect($scope.searchesChecked.length).toBe(0);
            expect($scope.searchResults).not.toContain(jasmine.objectContaining({isChecked: true}));
        });
    });

    describe('Function: $scope.sort,   Should sort based on provided column ', function () {
        it('should sort on a passed column', function () {
            $scope.orderProp = '';
            $scope.sort('name');
            expect($scope.orderProp).toBe('name');
            expect($scope.direction).toBeFalsy()
        });

        it('should invert the sort if passed the same column', function () {
            $scope.sort('name');
            expect($scope.orderProp).toBe('name');
            expect($scope.direction).toBeTruthy();
        });
        it('should should change sort to a new passed column and reset direction', function () {
            $scope.sort('title');
            expect($scope.orderProp).toBe('title');
            expect($scope.direction).toBeFalsy()
        });


    });
    xdescribe('Http call: $http.get, Should request and return available searches', function () {
        beforeEach(inject(function ( _$httpBackend_ ) {
            $httpBackend = _$httpBackend_;
        }));
        fdescribe('With data: Test with returned data', function () {
            
            it('should request searches from application', function () {
                $httpBackend.when('GET', '/api/b2bSearches').respond([ {
                    $$hashKey : "object:3",
                    Collection: "NowTV",
                    _id       : "574d9a0a7ceb7e642e580818",
                    active    : true,
                    database  : "conviva",
                    dbEngine  : "mongodb",
                    explain   : null,
                    isChecked : true,
                    name      : "testing",
                    projection: "_id:0",
                    queryType : "findOne",
                    updated   : "2016-05-31T14:05:09.316Z"
                } ]);
                $scope.$digest();

            })
        });
        describe('Without Data: Test with no returned data', function () {
            it('should request searches from application', function () {
                $httpBackend.when('GET', '/api/b2bSearches').respond('hello');
            })
        });
        describe('With Error: Force error', function () {
            it('should continue to run but report error to user', function () {

            })
        })
    });
    xdescribe('Function: $scope.deleteSearch,    Should delete selected search', function () {
        it('', function () {
            expect().toBe();
        })
    });
    xdescribe('Function: $scope.deleteSearches,  Should launch a delete confirmation modal and delete searches using $scope.deleteSearch', function () {
        it('', function () {
            expect().toBe();
        })
    });
    xdescribe('Function: $scope.createSearch,    Should launch a create search modal', function () {
        it('', function () {
            expect().toBe();
        })
    });
    xdescribe('Function: $scope.editSearch,  Should launch an edit search modal', function () {
        it('', function () {
            expect().toBe();
        })
    });


});
