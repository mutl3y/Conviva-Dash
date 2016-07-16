/**
 * @name    b2bsearches.js
 * @kind    dbSchema to hold searches
 * @description Defines schema for holding search details
 *
 */

// load the things we need
var mongoose, schema, type, ObjectId, Mixed, searchSchema, queryObject, objectHistory;
mongoose = require('mongoose');

schema = mongoose.Schema;
type = schema.Types;
ObjectId = type.ObjectId;
Mixed = type.Mixed;
//Object = type.Object;

/**
 *  @description define the schema for search objects
 */
queryObject = new mongoose.Schema({
    'field'     : {type: String},
    'name'      : {type: String},
    'helperText': {type: String, 'default': ''},
    'type'      : {type: String, 'default': 'String'},
    'min'       : {type: Number, 'default': 1},
    'max'       : {type: Number, 'default': 6},
    'required'  : {type: Boolean, 'default': true},
    'regExp'    : {type: String, 'default': ''},
    'regParam'  : {type: String, 'default': 'i'},
    'ignoreCase': {type: Boolean, 'default': true}
});

/**
 *  @description define the schema for search object change history
 */
objectHistory = new mongoose.Schema({
    'changeBy'  : {type: String},
    'change'    : {type: String},
    'changeDate': {type: Date, 'default': Date.now}
});


/**
 *  @description define the schema for our search model
 *  @schema
 */
searchSchema = mongoose.Schema({
    name      : {type: String, 'default': null},
    dbEngine  : {type: String, 'default': 'mongodb'},
    database  : {type: String, 'default': 'testing'},
    Collection: {type: String, 'default': 'test'},
    queryType : {type: String, 'default': 'findOne'},
    queryArray: [ queryObject ],
    projection: {type: Object, 'default': {'n': 1}},
    active    : {type: Boolean, 'default': false},
    updated   : {type: Date, 'default': Date.now},
    history   : [ objectHistory ],
    explain   : {type: Mixed, 'default': null}
});

searchSchema.statics.activeQueries = function ( dbtype, cb ) {
    this.find({dbEngine: dbtype, active: true}, {'__v': 0, 'history': 0}, cb);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('B2BSearch', searchSchema);
