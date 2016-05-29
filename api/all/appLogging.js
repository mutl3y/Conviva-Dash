/**
 * Created by MHeynes on 22/09/2014.
 */

/**
 * @description Debug logging control
 */
app.config(['$logProvider', function ($logProvider) {
    $logProvider.debugEnabled(true);
}]);

/**
 * @description Custom debug messages and control
 */
app.config(['$provide', function ($provide) {
    $provide.decorator('$log', ['$delegate', function ($delegate) {
        // Keep track of the original debug method, we'll need it later.
        var origDebug = $delegate.debug;
        /*
         * Intercept the call to $log.debug() so we can add on
         * our enhancement. We're going to add on a time stamp to the message that will be logged.
         */
        $delegate.debug = function () {
            var args = [arguments];
            var date = new Date();
            var formattedDate = 'Debug ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
//            args[0] = [new Date().toString(), ': ', args[0]].join('');
            args.unshift(formattedDate);
            // Send on our enhanced message to the original debug method.
            origDebug.apply(null, args);
        };
        return $delegate;
    }]);
}]);


