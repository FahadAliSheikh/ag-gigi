var mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');
var test_specSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    merchandiser: { type: String },
        production: { type: String }
    
});

module.exports = mongoose.model('Test', test_specSchema);