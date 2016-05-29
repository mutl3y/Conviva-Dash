/**
 * @name    statusModel.js
 * @kind    dbSchema to hold status Objects
 * @description Defines schema for holding objects for the status app
 */

// load the things we need
var mongoose, schema, type, ObjectId, Mixed, statusSchema, objectHistory;
mongoose = require('mongoose');

schema = mongoose.Schema;
type = schema.Types;
ObjectId = type.ObjectId;
Mixed = type.Mixed;

/**
 *  @description define the schema for object change history
 */
objectHistory = new mongoose.Schema({
    'changeBy'  : {type: String},
    'oldObject' : {type: Mixed},
    'changeDate': {type: Date, 'default': Date.now}
});


/**
 *  @description define the schema for status app objects
 */
statusSchema = mongoose.Schema({
    name         : {type: String, required: 'You must name this item', unique: true},
    command      : {type: String, required: 'You must define a command'},
    active       : {type: Boolean, 'default': false},
    rtnType      : {
        type    : String,
        default : 'Array',
        required: 'Define output type, Need to know how to display this object'
    },
    dispByDefault: {type: Boolean, default: false},
    dispFields   : {type: Array},
    //dispFields   : {type: Array, 'default': ''},
    helperText   : {type: String, 'default': '', required: 'Please describe this object'},
    history      : [objectHistory]
});

statusSchema.statics.statusCmds = function (statusCmds, cb) {
    this.find({active: true}, {'__v': 0, 'history': 0}, cb);
};

/**
 * Keep change history
 */
//statusSchema.post('validate', function (doc) {
//    console.log('Pre save looks like this\n ', doc);
//    if (doc.history.length === 0) {
//        var upd = doc;
//        upd.history=[];
//        var history = {oldObject: 'First Commit'};
//        doc.history.push(history);
//    } else {
//        this.find({_id: doc._id}, function (a) {
//            console.log(a);
//        });
//        var upd = doc;
//        upd.history = [];
//        var history = doc.history;
//        doc.history.push(history);
//    }
//    console.log(history);
//});

// create the model for users and expose it to our app
module.exports = mongoose.model('statusCMD', statusSchema);
