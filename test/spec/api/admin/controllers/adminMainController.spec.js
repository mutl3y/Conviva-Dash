/**
 * Created by Mark on 07/06/2016.
 */
var $rootScope,
    $scope,
    controller;

var testObject = {
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

describe('Controller: adminMainCtrl', function () {
    var adminMainCtrl,
        //httpBackend,
        scope, compile, doc;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ( $controller, _$rootScope_, $compile ) {
        scope = $rootScope.$new();
        compile = $compile;
        adminMainCtrl = $controller('adminMainCtrl', {
            $scope: scope
        });
    }));

    describe('Create and set variables', function () {
        it('should setup initial variables', function () {
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
        var dom, $httpBackend, compiled;
        var createButton;             // createButton var for debug only

        beforeEach(inject(function ( _$httpBackend_ ) {
            $httpBackend = _$httpBackend_;
            jasmine.getFixtures().fixturesPath = "base/views";
            $httpBackend.when('GET', '/api/b2bSearches').respond(testObject);
            compiled = compile(angular.element(readFixtures('admin.ejs')))($scope);
            $scope.$digest();

        }));

        describe('start without anything selected', function () {
            it('should start with only Create search button visible', function () {
                expect(scope.searchesChecked.length).toBe(0);
                expect(scope.searchesChecked).toBeDefined();
                expect(compiled.find('#create_Button').hasClass('hidden')).toBeFalsy();
                expect(compiled.find('#edit_Button').hasClass('hidden')).toBeTruthy();
                expect(compiled.find('#delete_Button').hasClass('hidden')).toBeTruthy();
                expect(compiled.find('#reset_Button').hasClass('hidden')).toBeTruthy();
            })
        });

// todo: need to check dom updates as searchesChecked changes
        describe('with only a single search selected', function () {
            it('should hide create button but show others', function () {
                createButton = compiled.find('#create_Button');
                scope.searchesChecked.push(testObject);
                expect(scope.searchesChecked.length).toBe(1);

                compiled.find('#create_Button').addClass('hidden');  // Testing only

                expect(compiled.find('#create_Button').hasClass('hidden')).toBeTruthy();
                //    expect(compiled.find('#edit_Button').hasClass('hidden')).toBeFalsy();
                //    expect(compiled.find('#delete_Button').hasClass('hidden')).toBeFalsy();
                //    expect(compiled.find('#reset_Button').hasClass('hidden')).toBeFalsy();
            })
        });

// todo: need to check dom updates as searchesChecked changes
        describe('with more than a single search selected', function () {
            it('should only show reset and delete buttons', function () {
                scope.searchesChecked.push(testObject);
                scope.searchesChecked.push(testObject);
                expect(scope.searchesChecked.length).toBeGreaterThan(1);

                //expect(compiled.find('#create_Button').hasClass('hidden')).toBeTruthy();
                //expect(compiled.find('#edit_Button').hasClass('hidden')).toBeFalsy();
                //expect(compiled.find('#delete_Button').hasClass('hidden')).toBeFalsy();
                //expect(compiled.find('#reset_Button').hasClass('hidden')).toBeFalsy();
            })
        });
    });

// todo: Need to fix .this addressing
    xdescribe('Function: $scope.toggleSelected, toggle search highlighting when selected', function () {
        it('should toggle the selection of a search ', function () {
            $scope.$controller.selected = 'as';
            $scope.search = testObject;
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
    describe('Http call: $http.get, Should request and return available searches', function () {
        var $httpBackend;
        beforeEach(inject(function ( _$httpBackend_ ) {
            $httpBackend = _$httpBackend_;
        }));
        describe('Without Data: Should return no data', function () {
            var testObject = {};
            it('should request searches from application', function () {
                $httpBackend.when('GET', '/api/b2bSearches').respond();
                $httpBackend.flush();
                expect($scope.searchResults).not.toBeDefined();
            });
        });
        describe('With data: Test with returned data', function () {


            it('should request searches from application', function () {
                $httpBackend.when('GET', '/api/b2bSearches').respond([ testObject ], 200);
                $httpBackend.flush();
                expect($scope.searchResults.length).toBe(1);
            })
        });
        describe('With Error: Force error', function () {
            it('should continue to run but report error to user', function () {
                $httpBackend.when('GET', '/api/b2bSearches').respond(500);
                $httpBackend.flush();
                expect($scope.status).toBe(500);
                expect($scope.searchResults).not.toBeDefined();
            })
        })
    });

    xdescribe('Function: $scope.deleteSearch,    Should delete selected search', function () {
        it('should accept an id to pass to the delete search api', function () {
            selectedSearch
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
    xdescribe('Function: $scope.editSearch,      Should launch an edit search modal', function () {
        it('', function () {
            expect().toBe();
        })
    });
});
