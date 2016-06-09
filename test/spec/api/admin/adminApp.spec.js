/**
 * Created by Mark on 07/06/2016.
 */
'use strict';

describe('Module: adminApp', function () {
    describe('Check app is defined', function () {
        it('Should start the app and define dependancy injections', function () {
            expect(angular.module('adminApp')).toBeDefined();
        });
        it('should check modules have been injected', function () {
            expect(angular.module('adminApp').requires).toEqual([ 'ngResource', 'ui.bootstrap', 'ngAnimate' ]);
        });
    });
});
