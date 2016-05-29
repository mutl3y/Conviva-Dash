/**
 * Created by MHeynes on 10/09/2014.
 */
'use strict';

/* Directives */


app.directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
        elm.text(version);
    };
}]);

console.log('Shared directives wired up');  // todo remove