/**
 * Created by MHeynes on 10/09/2014.
 *
 */

console.log('\n\nAPI App Logger mode ' + process.env.NODE_ENV + '\n\n');
function logger() {
    if (process.env.NODE_ENV === 'development') {
        var d = new Date();
        var i;
        var dispd = d.toUTCString();
        console.log('\f\n\nDisplaying ' + arguments.length + ' arguments \t\t', dispd);

        /**
         * Loop through arguments $exceptionHandler display to screen
         */
        for (i = 0; i <= arguments.length - 1; i++) {
            console.log('Argument ', i, 'is a', typeof(arguments[ i ]), '-->\t', arguments[ i ], '\n');
        }
    }
}
function inArray( needle, haystack ) {
    'use strict';
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[ i ].match(needle)) {
            return true;
        }
    }
    return false;
}

var searchStore = require('../app/models/searchStore');
// todo remove ?
// var statusCMD = require('../app/models/statusModel');
var mongo = require('mongoskin');
var b2bDB = mongo.db(
    'mongodb://localhost:27017/conviva', {
        db    : {
            readPreference: mongo.ReadPreference.PRIMARY_PREFERRED
        },
        server: {
            'auto_reconnect': true,
            'socketOptions' : {keepAlive: 1}
        }
    }
);

// todo remove ?
//var adminDB = mongo.db(
//    'mongodb://localhost:27017/admin', {
//        db           : {
//            readPreference: mongo.ReadPreference.PRIMARY_PREFERRED
//        },
//        server       : {
//            'auto_reconnect': true,
//            'socketOptions' : {keepAlive: 1}
//        },
//        native_parser: true
//    }
//);

/**
 * @name isValidSearch
 * @param obj
 * @returns {boolean}
 * @description checks passed object validates before saving;
 *
 * Basic validation
 */
var isValidSearch = function ( obj ) {
    //validateQuery(obj);
    var validSearch = true; // todo finsih off server side validation
    console.log('Validating\t' + obj.title);
    if (validSearch) {
        console.log('valid     \t' + obj.title);
        return true;
    } else {
        console.log('invalid   \t', obj);
        return false;
    }
};

/**
 * Validation function
 * @param results
 * @param q
 * @returns {*}
 */
var validateQuery = function ( results, q ) {
    console.log('Validating Query');      // Debugging todo
    var failTest = function ( msg, q ) {
        q.valid = 'false';
        console.log(msg);
        return q;
    };    // Function to parse statuary fields

    var rqa, qa, properties;

    q.valid = false;                    // Default valid to false;
    var qva = [];                       // Create empty array to hold validation results
    rqa = results.queryArray;           // Local placeholder for query array from DB
    qa = q.queryArray;                  // Local placeholder for query array from User
    q.db = results.database;            // Retrieve destination db name from DB
    q.coll = results.Collection;        // Retrieve collection name from DB
    properties = results.projection.split(','); // Convert projection string to Array

    /**
     *  Validate required fields, reject if not defined
     *
     *  Rejects any calls without a DB, Collection or Projection field specified.
     */
    if (!q.db) {
        failTest('No DB specified for ' + q.id, q);
    }
    if (!q.coll) {
        failTest('No Collection specified for ' + q.id, q);
    }
    if (!properties) {
        failTest('No Projected fields specified for ' + q.id, q);
    }

    /**
     * Create pro2 JSON object from properties Array
     *
     * Split values at :
     */
    properties.forEach(function ( property ) {
        var tup = property.split(':');
        q.pro2[ tup[ 0 ] ] = parseInt(tup[ 1 ]);
    });


    /* validate users query array objects */
    var i;
    for (i = 0; i < rqa.length; i++) {
        var rao       = rqa[ i ],
            rf        = rao.field,
            rt        = rao.type.toLowerCase(),
            rmin      = rao.min,
            rmax      = rao.max,
            rreg      = rao.regExp,
            rrequired = rao.required,
            x;

        /* search queryArray for field and extract validation params */
        for (x = 0; x <= qa.length - 1; x++) {
            var f = qa[ x ].field;
            var qu = qa[ x ].query || '';

            if (f === rf) {
                var t;
                if ((rrequired && qu.length < rmin) || (qu.length > 0 && qu.length < rmin)) {
                    console.log('Too short', rf, rmin, rrequired);
                    qva.push(f + ' Too Short : failed');

                } else if (qu.length > rmax) {
                    console.log('Too Long', rf);
                    qva.push(f + ' Too_Long : failed');

                } else {
                    //console.log('RT = ', rt);
                    //console.log(t);
                    if (rt === 'regexp') {
                        t = 'regexp';
                    } else {
                        t = typeof(qu);
                    }

                    switch (t) {
                        case 'number':
                            qva.push(f + '.' + rmin + ' : ' + (q >= rmin));
                            q.obj[ f ] = Number(qu);
                            break;

                        case 'string':
                            qva.push(f + '.length.' + rmax + ' : ' + (qu.length <= rmax ));
                            q.obj[ f ] = String(qu);
                            break;

                        case 'regexp':
                            console.log('Matched Regex ');
                            q.obj[ f ] = new RegExp(qu, 'i');
                            break;

                        default:
                            console.log('Typecasting result =', t);
                            if (typeof(qu) !== 'object') {
                                qva.push('Unknown query attribute : false');
                            }
                    }
                }
            }
        }
    }
    q.valid = !inArray('failed', qva);
    console.log(q.obj, 'is valid:', q.valid);
    console.log('Query Validation Array\n', qva);
    return q;
};

exports.B2bSearches = function ( req, res ) {
    searchStore.find({}, {'__v': 0}, function ( err, results ) {
        if (err) {
            console.log('Error occured during find ' + err);
            res.json('Error Occured');
        } else {
            res.json(results);
        }
    });
};

exports.B2bSearch = function ( req, res ) {
    searchStore.findOne({_id: req.params.id}, {'__v': 0, updated: 0}, function ( err, obj ) {
        if (err) {
            console.log('Error occured during B2bsearch findOne' + err);
            res.json('Error Occured');
        } else {
            res.json(obj);
        }
    });
};

exports.createB2bSearches = function ( req, res ) {
    'use strict';
    if (isValidSearch(req.body)) {
        req.body.history.push({'changeBy': req.user.name, 'change': 'Initial Creation'});
        var b2bSearch = new searchStore(req.body);
        b2bSearch.save(function ( err, results ) {
            if (err) {
                console.log('Error during save of ' + req.body.name);
                console.log(err, results);
            }
            exports.B2bSearches(req, res);
        });
    }
};

exports.updateB2bSearch = function ( req, res ) {
    var obj = req.body;
    //console.log(obj);
    if (isValidSearch(obj)) {
        delete obj._id;
        obj.updated = Date.now();
        obj.history.push({'changeBy': req.user.name});
        if (obj.history.length >= 10) {
            obj.history.splice(1, 1);
        }
        //console.log(obj.history);
        searchStore.findByIdAndUpdate(
            req.params.id, {$set: obj}, {upsert: true}, function ( err, obj ) {
                if (err) {
                    console.log('Error occured during findByIdAndUpdate ' + err);
                    res.send(500);
                } else {
                    exports.B2bSearches(req, res);
                    console.log('Saved \t\t' + obj._id);
                }

            }
        );
    } else {
        console.log('Invalid search ', obj);
        exports.B2bSearches(req, res);
    }
    //console.log(obj);
};

exports.destroyB2bSearch = function ( req, res ) {
    searchStore.remove({_id: req.params.id}, function ( err ) {
        if (err) {
            console.log('Error occured during delete ' + err);
        } else {
            exports.B2bSearches(req, res);
            console.log('Deleted \t' + req.params.id);
        }
        //res.json(true); //todo does this need to return a respoonse
    });
};

exports.b2bActiveSearches = function ( req, res ) {
    searchStore.find({'active': true}, {'__v': 0, 'history': 0}, function ( err, results ) {
        if (err) {
            console.log('Error occured during client find search ' + err);
            res.json('Error Occured');
        } else {
            res.json(results);
        }
    });
};

exports.b2bRunSearch = function ( req, res ) {
    var objData = {
        coll      : {},
        pro2      : {},
        obj       : {},
        id        : req.params.id,
        queryArray: req.body.queryArray
    };
    var rtn = {};

    searchStore.findOne({_id: objData.id}, {
            'database'  : 1,
            'Collection': 1,
            'queryType' : 1,
            'queryArray': 1,
            'projection': 1
        },
        function ( err, results ) {
            if (err) {  // catch errors
                console.log('Error occurred during client run search ' + objData.id, err);
                rtn.userMsg = 'Error occurred,' + err;
                res.status(503).json(rtn);
            } else if (results === null) {  // catch no results
                console.log('Search not found with id \t', objData.id);
                res.status(400);
            } else {
                validateQuery(results, objData);

                if (objData.valid) {

                    //console.log('Query run with ', objData);
                    /**
                     * todo validate search using params from db queryArray before running query
                     *
                     *
                     * Return results to client
                     *
                     */
                    try {
                        b2bDB.collection(objData.coll).find(objData.obj, objData.pro2).toArray(function ( err, data ) {
                            if (err) {
                                console.log(err, objData);
                                res.status(500);
                            }
                            console.log('b2bDB.collection ', objData.coll, objData.obj, objData.pro2);
                            console.log('Data length = ', data.length);
                            rtn.data = data;
                            if (rtn.data.length <= 0) {
                                console.log('No results found');
                                rtn.userMsg = 'No results found';
                                res.status(206).json(rtn);
                            } else {
                                rtn.userMsg = 'Compiling results';
                                console.log('Got results for ', JSON.stringify(rtn, null, 4));
                                res.status(200).json(rtn);
                            }
                        });
                    }
                    catch (e) {
                        logger('Error occurred run search operation\n Error stack :\n', e);
                    }
                } else {
                    rtn.userMsg = 'Failed Validation, Please amend and try again';
                    console.log('Search failed validation');
                    res.status(400).json(rtn);
                }
            }
        }
    );
};


//
///**
// * Returns active status objects for user to choose from
// * @param req   Request object
// * @param res   Response object
// */
//exports.statusOpt = function ( req, res ) {
//    //var count = statusCMD.count({active:true}, function (err, count) {
//    //    if (err) {
//    //        console.log('\nThere was an error retrieving count of status objects');
//    //    } else {
//    //        console.log('Count = ', count);
//    //        if (count === 0) {
//    //            var status = new statusCMD({
//    //                command   : 'listDatabases',
//    //                name      : 'List Databases',
//    //                helperText: 'This will list dbs',
//    //                active    : true
//    //            });
//    //            status.save(function (err, results) {
//    //                if (err) {
//    //                    console.log('\nError occured saving a default status object', err);
//    //                } else {
//    //                    console.log('\nCreated a default status object: ', results);
//    //                }
//    //            });
//    //        }
//    //    }
//    //});
//    statusCMD.find({active: true}, {_id: 1, name: 1, command: 1, helperText: 1}, function ( err, results ) {
//        if (err) {
//            console.log('Error occured finding status objects', err);
//        } else {
//            if (!results) {
//                console.log('No documents found');
//                res.json({name: 'No Staus objects available'});
//            } else {
//                console.log(results);
//                res.json(results);
//            }
//        }
//    });
//};
//
//exports.status = function ( req, res ) {
//    var returnData = [];
//    var serverStatusOptions = {
//        serverStatus      : 1,
//        workingSet        : 1,
//        asserts           : 0,
//        backgroundFlushing: 1,
//        connections       : 1,
//        cursors           : 0,
//        dur               : 0,
//        extra_info        : 0,
//        globalLock        : 1,
//        indexCounters     : 1,
//        locks             : 0,
//        network           : 0,
//        opcounters        : 0,
//        opcountersRepl    : 0,
//        recordStats       : 0,
//        repl              : 1,
//        writeBacksQueued  : 1,
//        mem               : 0,
//        metrics           : 0
//    };
//
//    /**
//     *  Active Object status objects
//     */
//
//    var adminStatusCmds = [
//        {name: 'serverStatus', query: serverStatusOptions},
//        //{name: 'replSetGetStatus', query: {'replSetGetStatus': 1}},
//        {name: 'buildinfo', query: {'buildinfo': 1}},
//        {name: 'getCmdLineOpts', query: {'getCmdLineOpts': 1}},
//        {name: 'connPoolStats', query: {'connPoolStats': 1}},
//        {name: 'startupWarnings', query: {'getLog': 'startupWarnings'}},
//        {name: 'hostInfo', query: {hostInfo: 1}},
//        {name: '_isSelf', query: {'_isSelf': 1}},
//        {name: 'getParameterAll', query: {'getParameter': '*'}},
//        {name: 'shardVersion', query: {'getShardVersion': 'mdbfoo.foo'}},
//        {
//            name: 'List CMD\'s Available', query: {
//            listCommands: 1
//        }
//        },
//        {name: 'test2', query: {'count': 'mdbfoo.foo'}}
//    ];
//
//
//    adminStatusCmds.forEach(function ( stat ) {
//        adminDB.command(stat.query, function ( err, result ) {
//            if (err) {
//                console.log(err);
//            }
//            returnData.push({name: stat.name, type: 'JSON', result: result});
//        });
//    });
//
//
//    adminDB.admin().listDatabases(function ( err, result ) {
//        if (err) {
//            console.log(err);
//        }
//        returnData.push({name: 'dbList', type: 'JSON', result: result.databases});
//    });
//
//    // Return collection list for db with useful stats
//    b2bDB.collections(function ( err, items ) {
//        var returnArray = [];
//        items.forEach(function ( item ) {
//            if (!item.collectionName.startsWith('system')) {
//                //console.log(item);
//                b2bDB.command({'collStats': item.collectionName, scale: 1024}, function ( err, result ) {
//                    if (err) {
//                        console.log(err);
//                    }
//                    returnArray.push({
//                        name: item.collectionName, result: {
//                            nameSpaces   : result.ns,
//                            sizeInKB     : result.size,
//                            storageSizeKB: result.storageSize,
//                            indexCount   : result.nindexes,
//                            indexSizeKB  : result.totalIndexSize
//                        }
//                    });
//                    //console.log(returnArray);
//                });
//
//            }
//        });
//        returnData.push({name: 'Collection Stats', type: 'JSON', result: returnArray});
//    });
//
//    //console.log(b2bDB.collection('invoicePeriod_current'));
//
//
//    b2bDB.collections(function ( err, items ) {
//        var rtnArray = [];
//        var invCols = [];
//        items.forEach(function ( item ) {
//            if (item.collectionName.startsWith('invoicePeriod')) {
//                invCols.push(item.collectionName);
//            }
//        });
//
//        invCols.sort().forEach(function ( invCol ) {
//            b2bDB.collection(invCol).count(function ( err, count ) {
//                var pos = invCol.indexOf('_') + 1;
//                var name = invCol.slice(pos);
//                var date = new Date(name);
//
//                rtnArray.push({
//                    name: name,
//                    y   : count,
//                    y0  : 0,
//                    x   : invCols.indexOf(invCol)
//                });
//            });
//        });
//
//        returnData.push({name: 'CDR Counts Stats', type: 'JSON', result: rtnArray});
//        returnData.push({name: 'CDR\'s by Bill Run (Graph)', type: 'barGraph', result: [ rtnArray ]});
//
//    });
//
//    var statusCmds = [
//
//
//        {
//            name: 'test', query: {
//            listCommands: 1
//        }
//        },
//        {name: 'test2', query: {'count': 'customers'}},
//    ];
//
//    statusCmds.forEach(function ( stat ) {
//        b2bDB.command(stat.query, function ( err, result ) {
//            if (err) {
//                console.log(err);
//            }
//            returnData.push({name: stat.name, result: result});
//        });
//    });
//
//    setTimeout(function () {
//        //console.log('Returning data with setTimeout, 500');
//        res.send(returnData);
//        for (var x = 0; x >= returnData.length; x++) {
//            console.log(returnData[ x ]);
//            console.log(x);
//        }
//        adminDB.close();
//    }, 500);
//
//
//};