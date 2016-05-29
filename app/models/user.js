'use strict';
/**
 * @name    user.js
 * @kind    dbSchema
 * @description Defines schema for holding user details once authenticated against LDAP
 */

var mongoose, bcrypt, hash, compare, userSchema;

mongoose = require('mongoose');
bcrypt = require('bcrypt-nodejs');
hash = bcrypt.hashSync;
compare = bcrypt.compareSync;

// define the schema for our user model
userSchema = mongoose.Schema(
    {
        _id       : String,
        email     : String,
        password  : { type: String, 'default': null },
        name      : String,
        admin     : { type: Boolean, 'default': false },
        type      : { type: String, 'default': null},
        trackLogin: { type: Array, 'default': [] }
    }
);

// generating a hash
userSchema.methods.generateHash = function (password) {
    return hash(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
