// load the things we need
var mongoose, schema, mmsConfigSchema;
mongoose = require('mongoose');
schema = mongoose.Schema;

// Schema to query MongoDB servers from MMS
mmsConfigSchema = schema({
    _id : Schema.ObjectId,  //objectId
    rs  : String,           // replicaSet role, Primary, Secondary, Arbiter
    rsid: String,           // replicaSet name
    n   : String,           // ipAddress
    p   : Number,           // TCP Port number
    ht  : []                // host type	1:DB, 2:mongos,3:config, 7:primary, 8:secondary 9:arbiter
});

// create the model for MongoDb servers and expose it to our app
module.exports = mongoose.model('BackendSchema', mmsConfigSchema);



