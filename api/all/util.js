/**
 * Created by MHeynes on 22/09/2014.
 */

/**
 * @name                alertT
 * todo Remove this debugging helper
 * @param msg
 * @param timeout
 */
var alertT = function alertUser(msg, timeout) {
    'use strict';
    var timeT = timeout || 5000;
    var w = window.open('', 'Alert Box', ' location=0,status=0,scrollbars=0, width=500,height=500');
    if (typeof(msg) !== 'object') {
        w.document.write('<h1>' + msg + '</h1>');
    } else {
        w.document.write('<h1>Object received</h1>');

        for (var key in msg) {
            if (msg.hasOwnProperty(key)) {
                w.document.write('<h3><b>' + key + ' </b></h3>' + msg[key]);
            }
        }
    }
    w.focus();
    setTimeout(function () {
        w.close();
    }, timeT);
};

/**
 * @description              Utility functions below
 */

//noinspection JSUnusedGlobalSymbols
/**
 * @name        printArrayObj
 * @param       arr   array to process
 *
 * @description
 * Enumerate through array of objects and console.log 1st level parameters
 *
 * Used for debugging and available in the console *
 * Checks items in array are objects with an _id field
 * if object iterate though and log to console for diagnostics
 *
 * @kind            function
 *
 * todo Debug util REMOVE
 */
function printArrayObj(arr) {
    'use strict';
    console.log('Printing array contents');
    console.log(angular.toJson(arr, [true]));
}

function getDuration(timeMillis) {
    var units = [
        {label: "millis", mod: 1000},
        {label: "seconds", mod: 60},
        {label: "minutes", mod: 60},
        {label: "hours", mod: 24},
        {label: "days", mod: 7},
        {label: "weeks", mod: 52},
    ];
    var duration = new Object();
    var x = timeMillis;
    for (i = 0; i < units.length; i++) {
        var tmp = x % units[i].mod;
        duration[units[i].label] = tmp;
        x = (x - tmp) / units[i].mod
    }
    return duration;
}


/**
 * @name            lookupID
 *
 * @param test     object to search for by ._id
 * @param array     array containing objects to test against
 * @returns         {boolean} true if found otherwise false
 * @kind            function
 *
 * @description
 * Chain-able search ID lookup test.
 */
var lookupID = function (test, array) {
    'use strict';
    //console.log('Testing array contents for \t' + test._id);
    for (var obj in array) {
        //noinspection JSUnfilteredForInLoop
        if (!array[obj].hasOwnProperty('_id')) {
            return false;
        } else {
            //noinspection JSUnfilteredForInLoop
            if (test._id === array[obj]._id) {
                //console.log('Matched \t\t\t\t\t' + test._id);
                return true;
            }
        }
    }
    return false;
};