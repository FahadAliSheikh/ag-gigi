var mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');
var userSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    username: { type: String },
    email: { type: String },
    password: { type: String },
    userRole:{type:String}
    
});

module.exports = mongoose.model('User', userSchema);