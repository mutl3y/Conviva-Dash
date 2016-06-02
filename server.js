#!/usr/local/bin/nodemon
'use strict';
/**
 * @namespace       [[{NodeJS }]]       ROOT
 *  @class                              NodeJS
 *  @module         [[{ Javascript }]]  server.js
 *  @description                        Main NodeJS module
 */


/**
 *
 *
 * Load nconf-jsonminify  module to provide different configurations depending on
 * the setting of NODE_ENV os variable, this version also allows comments in JSON;
 * @type {exports}
 */
//var fs = require('fs');
var nconf = require('nconf-jsonminify'),
    conf = function (string) {
        return (nconf.get(string));
    };

console.log(conf('NODE_ENV'));

if (!conf('NODE_ENV')) {
    console.log('\f\n\n\nNode Enviroment Not Set\n Please define NODE_ENV to continue');
    console.log('Linux:\t export NODE_ENV=production');
    process.exit(0);
} else {
    conf('NODE_ENV');
}


nconf.load('config/' + process.env.NODE_ENV, '/config');
console.log('This application is being started in ' + conf('NODE_ENV') + ' mode');

//noinspection JSHint
/**
 * @description         Variable creation and assignment
 *
 */
var httpType, httpport, appport, express, app, mongoose, passport, flash, morgan, bodyParser,
    cookieParser, session, compress, sslOptions, server, dbOptions, secretConf, MongoStore;

httpType = conf('httpType');
httpport = conf('httpport');
appport = conf('appport');
express = require('express');
app = express();
mongoose = require('mongoose');
passport = require('passport');
flash = require('connect-flash');
morgan = require('morgan');
bodyParser = require('body-parser');
session = require('express-session');
MongoStore = require('connect-mongo')(session);
compress = require('compression');
sslOptions = require(conf('ssloptions'));
cookieParser = require('cookie-parser');
secretConf = {
    secret: (conf('session_secret')),
    resave: true,
    saveUninitialized: true,
    store: new MongoStore(
        {
            url: 'mongodb://localhost/test'
            // db: 'userSessions'
        }
    )
};


/** @description        Environment start control
 *
 * require http method configured in nconf and add in any development utils
 *
 */
if (conf('NODE_ENV') === 'production') {
    server = require('https').Server(sslOptions, app);

    //noinspection JSUnusedGlobalSymbols
    /**
     * Moving config to environment based json file stored in /config/NODE_ENV/config.json
     *
     * Temporary function to expose variable resolution
     * todo Remove before publish to prod
     */
    var testString = function getConfig(testString) {
        console.log('\n\n');
        console.log('Config variable searched for is ', testString);
        console.log('This has a type of              ', typeof(conf(testString)));
        console.log('This has a value of             ', conf(testString));
        console.log('\n\n');
    };
} else {
    server = require('http').Server(app);

}

/**
 * @description         Load socket.io module to use web sockets,
 * Provides real time 2 way connection for faster more responsive pages
 *
 * whilst currently only used for displaying messages to the end user
 * this is also suitable to use for requesting data from the server instead of using
 * http methods such as .get .put .post etc
 */
//var io = require('socket.io')(server);

/**
 * @description         load http redirect module and pass in ports (source, destination)
 */
require('./app/redirect')(httpport, appport);

/**
 * @name                mongoose-connect
 * @kind                DB connection
 * @description
 * Setup config db connection with its options retrieved via nconf
 *
 */
mongoose.connect(conf('configDBUri'), conf('dbOptions'));

/**
 * @name                Passport
 * @kind                middleware
 * @description         Authentication module utilizing Passport authentication schemas
 * @param  passport object previously defined
 */
require('./config/passport')(passport);

/**
 * @name                 Express Setup
 *
 * @description          set up our express application
 *
 */
app.use('/', express.static('./public'));                       // Serve public files

// log requests
app.use(morgan('dev', {
    skip: function (req, res) {
        return (res.statusCode <= 304);
    }
}));

app.use(cookieParser());                                        // read cookies (needed for auth)
app.use(bodyParser.urlencoded({'extended': 'true'}));           // get information from html forms
app.use(bodyParser.json());                                     // JSON parsing of request body
app.use(bodyParser.json({type: 'application/vnd.api+json'}));   // Set JSON parsing to jsonapi, http://jsonapi.org/
app.set('view engine', 'ejs');                                  // set up ejs for Templating
app.use(session(secretConf));                                   // set up session saving
app.use(passport.initialize());                                 // Initialise Passport
app.use(passport.session());                                    // persistent login sessions
app.use(flash());                                               // use connect-flash for flash messages stored in session

/**
 *  @description        Load socketio config
 *
 *  @kind               require sub module
 *
 *  pass in io function variable for 2 way binding
 */
//require('./app/socketio')(io);

/**
 *  @description        Load application routes from routing file.
 *
 *  @kind               require sub module
 *
 *  pass in express, passport and socketio function variables
 */
require('./app/routes.js')(app, passport, express);

/**
 * @description         launch App
 *
 * Start express server instance listening for requests on appport from nconf('NODE_ENV')
 */
server.listen(appport);

/**
 * @description         Log starting message to console
 */
setTimeout(function () {
    console.log('MongoDash listening to' + ' ' + httpType + ' on port ' + appport);
}, 2000);





