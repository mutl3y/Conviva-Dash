/**
 * Declare a test user to negate login
 * @type {{name: string, email: string}}
 */
if (process.env.NODE_ENV === 'development') {
    testUser = {name: 'test user', email: 'mark.heynes@sky.uk', admin: true};
    console.log(testUser);
}

/**
 * @description         Declare variables for module.
 */
//var B2BSearch;

/**
 * Load external modules
 * @type {exports}
 */
//mongo = require('mongoskin');
//B2BSearch = require('../app/models/b2bsearches');   // load the searchs from DB

/**
 *  Declare variables used to hold functions
 */
var isLoggedIn, isAdmin;


/**
 * @name        isLoggedIn
 * @description Authentication middleware
 * @param req   Request object
 * @param res   Response Object
 * @param next  Next function in chain, Allows this function to be used in dot notation form
 * @returns {*} Returns next function if user is authenticated otherwise redirects to / and logs failure
 */
isLoggedIn = function (req, res, next) {
    /**
     * todo remove development bypass before publish to prod
     */
    if (process.env.NODE_ENV === 'development' && (req.ip === '192.168.56.1' || req.ip === '127.0.0.1' || req.ip === '::1')) {
        req.user = testUser;
        return next();
    }
    if (req.isAuthenticated()) {
        console.log(req.user.name + ' is logged in');
        return next();
    }
    res.redirect('/');
    console.log('login failed from ip ', req.ip);
    return false;
};

/**
 * @name        isAdmin
 * @description Authentication middleware to allow elevation of privileges
 * @param req   Request object
 * @param res   Response Object
 * @param next  Next function in chain, Allows this function to be used in dot notation form
 * @returns {*} Returns next function if user has admin group privileges otherwise redirects to / and logs failure
 */
isAdmin = function (req, res, next) {

    //console.log('Admin authentication');
    if (req.user.admin === true) {
        //console.log(req.user.name + ' accessing admin ');
        return next();
    }
    res.redirect('/');
    console.log('Attempted admin access failed from ip ', req.ip);
    return false;
};


//noinspection JSHint
module.exports = function (app, passport, express) {
    'use strict';
    var api;


    // show the home page (will also have our login link)
    app.get(
        '/', function (req, res) {
            res.render('index.ejs', { message: req.flash('loginMessage') });
        }
    );

    // LOGOUT ==============================
    app.get(
        '/logout', function (req, res) {
            req.logout();
            res.redirect('/');
        }
    );

    // Login,
    app.route('/login').get(
        function (req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        }
    ).post(
        passport.authenticate(
            ['ldapConfig'], {
                successRedirect: '/home', // redirect to the secure profile section
                failureRedirect: '/login', // redirect back to the login page if there is an error
                failureFlash   : true // allow flash messages
            }
        )
    );

    /**
     *  @description security function secures routes beyond here to logged in users utilising isLoggedIn middleware
     */
    app.all('*', isLoggedIn);

    // old routes to refactor  todo Update landing page
    app.get(
        '/home', function (req, res) {
            res.render(
                'home.ejs', {
                    user: req.user
                }
            );

        }
    );

    /**
     * @description         Serve api folder /api/all to logged in users
     *
     */
    app.use('/api/all', express.static('./api/all'));

    /**
     * @description Serve api folder /api/client to logged in users only
     *
     */
    app.use('/api/client', express.static('./api/client'));   // Serve client api files
    app.use('/components', express.static('./bower_components'));
    app.use('/api/status', express.static('./api/status'));   // Serve status app files
    app.get(
        '/status', function (req, res) {
            res.render(
                'status.ejs', {
                    user: req.user
                }
            );
            console.log('Status page loaded by ', req.user.name, ' from ', req.ip);
        }
    );

    /**
     * @name /client
     * @description serve client template from /client
     * renders using /views/client AngularJS template
     */
    app.get(
        '/client', function (req, res) {
            res.render(
                'client.ejs', {
                    user: req.user
                }
            );
            //console.log('Client page loaded by ', req.user.name, ' from ', req.ip);
        }
    );

    /**
     * Load  restful api interface
     * @type {exports}
     */
    api = require('./api.js');
    app.get('/api/b2bActiveSearches', api.b2bActiveSearches);
    app.post('/api/b2bRunSearch/:id', api.b2bRunSearch);
    app.get('/api/statOpt', api.statusOpt);
    app.get('/api/stats', api.status);

    /**
     * Serve /admin template
     */
    app.get(
        '/admin', function (req, res) {
            res.render(
                'admin.ejs', {
                    user: req.user
                }
            );
            //console.log('Admin page loaded by ', req.user.name, ' from ', req.ip);
        }
    );

    /**
     * @name            isAdmin
     * @description     All routes past this require admin privileges
     */
    app.all('*', isAdmin);
    /**
     * @description Server client files securely
     */
    app.use('/api/admin', express.static('./api/admin'));   // Serve api  files
    app.use('/api/docs', express.static('./api/docs'));   // Serve api  files

    app.get('/api/b2bSearch/:id', api.B2bSearch);
    app.delete('/api/b2bSearch/:id', api.destroyB2bSearch);
    app.put('/api/b2bSearch/:id', api.updateB2bSearch);

    app.get('/api/b2bSearches', api.B2bSearches);
    app.post('/api/b2bSearches', api.createB2bSearches);


    /**
     * @name        404-Error
     * @description Returns custom 404 error page
     */
    app.route('*').all(
        function (req, res) {
            res.render(
                '404', {
                    url: req.url
                }
            );
        }
    );

};

// End of routing

// route middleware to ensure user is logged in
