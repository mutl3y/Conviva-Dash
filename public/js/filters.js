'use strict';
/**
 * Created by MHeynes on 10/09/2014.
 */

/* Filters */
app.filter('interpolate', ['version', function (version) {
    return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
    };
}]);

console.log('Filters wired up');          // todo remove

