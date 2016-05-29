/*jshint node: true, strict: true */


var express = require('express');
var redirect = express();

// Basic http to https redirect module.
module.exports = function (httpport, appport) {
    'use strict';
    var httpredirect;
    httpredirect = require('http').Server(redirect);

    redirect.get('*', function (req, res) {
        var hostname = req.headers.host.slice(0, req.headers.host.indexOf(':'));
        res.redirect('https://' + hostname + ':' + appport + req.url);
    });

    httpredirect.listen(httpport);
    console.log('HTTP listening on port ' + httpport + ' redirecting to https on port ' + appport);
};
