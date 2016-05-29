var LocalStrategy, WindowsStrategy, User, configAuth, trackLogin;
LocalStrategy = require('passport-local').Strategy; // Local login strategy
WindowsStrategy = require('passport-windowsauth');  // AD via LDAP strategy
User = require('../app/models/user');               // Load user schema

/**
 * Load parameters from config file
 */
var nconf = require('nconf-jsonminify');
nconf.get('NODE_ENV');
configAuth = nconf.get('ldapConfig');     // Authentication Parameters retrieved from config file

/**
 * Essential User auditing middleware
 * If this process stops working App will exit
 *
 */
trackLogin = function () {
    return function (id, ip) {
        'use strict';
        User.update(
            {'_id': id}, {$push: {
                'trackLogin': {
                    'date': new Date(),
                    'ip'  : ip}}
            }, {upsert: true}, function (err, data) {
                if (err) {
                    console.log('\n\n\n\n\n Unable to track logins, terminating \n\n\n');
                    console.log(data);
                    throw err;
                }
                console.log(id + ' Logged In from ' + ip);
            }
        );  // Track User
    };
};


//noinspection JSUnusedGlobalSymbols,JSHint
function debugToFile(varToDebug) {
    'use strict';
    var debugToSave, fs;
    debugToSave = JSON.stringify(varToDebug, null, 4);
    fs = require('fs');
    fs.writeFile(
        './debug/request,json', debugToSave, function (err) {
            if (err) {
                console.log(err);
            }
        }
    );
}


function inArray(needle, haystack) {
    'use strict';
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i].match(needle)) {
            return true;
        }
    }
    return false;
}

module.exports = function (passport) {
    'use strict';

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(
        function (user, done) {
            done(null, user.id);
        }
    );

    // used to deserialize the user
    passport.deserializeUser(
        function (id, done) {
            User.findById(
                id, function (err, user) {
                    done(err, user);
                }
            );
        }
    );

    passport.use(
        'ldapConfig', new WindowsStrategy(
            {
                usernameField    : 'username',
                passwordField    : 'password',
                passReqToCallback: true,
                ldap             : {
                    url            : configAuth.url,
                    base           : configAuth.base,
                    bindDN         : configAuth.bindDN,
                    bindCredentials: configAuth.bindCredentials,
                    timeout        : configAuth.timeout,
                    checkInterval  : configAuth.checkInterval
                },
                integrated       : false},
            function (req, profile, done) {
                if (profile === null) {
                    console.log(
                            'Failed login attempt, username:' + req.body.username + ' , ' +
                            'IP Address ' + req.ip + ' , Date: ' + new Date()
                    );
                    return done(null, false, req.flash('loginMessage', 'Login Failure.'));
                }
                var groups = profile._json.memberOf;
                if (!inArray('mongodash', groups)) {
                    console.log(
                            'Attempt to login by non group member ' + profile._json.cn +
                            ' from ' + req.ip + ' , Date: ' + new Date()
                    );
                    return done(null, false, req.flash('loginMessage', 'Login Failure.'));
                }
                // asynchronous
                process.nextTick(
                    function () {
                        User.findOne(
                            { '_id': profile.id }, function (err, user) {
                                // if there are any errors, return the error
                                if (err) {
                                    return done(err);
                                }

                                // if no user
                                // s found in configDB.users, Add User Detail
                                if (!user) {
                                    var newUser = new User();
                                    newUser._id = profile.id;
                                    newUser.name = profile._json.cn;
                                    newUser.email = profile._json.mail;
                                    newUser.type = 'AD';
                                    if (inArray('mongodash-admin', groups)) {
                                        newUser.admin = true;
                                    }
                                    console.log('Creating new user  ' + newUser.name);
                                    newUser.save(
                                        function (err) {
                                            if (err) {
                                                throw err;
                                            }
                                            console.log(this);
                                            setTimeout(trackLogin(newUser._id, req.ip), 5000);
                                            return done(null, newUser);
                                        }
                                    );
                                }
                                else {          // all is well, return user
                                    trackLogin(user._id, req.ip);
                                    return done(null, user);
                                }
                                return false;
                            }
                        );
                    }
                );
                return false;
            }
        )
    );
};
/*
 // =========================================================================
 // LOCAL LOGIN =============================================================
 // =========================================================================
 passport.use (
 'local-login', new LocalStrategy (
 {
 usernameField: 'username',
 passwordField: 'password',
 passReqToCallback: true // allows us to pass in the req from our route
 }, function (req, email, password, done) {
 // Use lower-case e-mails to avoid case-sensitive e-mail matching
 if (email) {
 email = email.toLowerCase ();
 }

 // asynchronous
 process.nextTick (
 function () {
 User.findOne (
 { 'local.email': email }, function (err, user) {
 // if there are any errors, return the error
 if (err) {
 return done (err);
 }

 // if no user is found, return the message
 if (!user || !user.validPassword (password)) {
 return done (
 null,
 false,
 req.flash ('loginMessage', 'Login Failure.'));
 }
 // all is well, return user
 else {
 trackLogin (user._id, req.ip);
 return done (null, user);
 }
 }
 );
 }
 );
 }
 )
 );
 */



