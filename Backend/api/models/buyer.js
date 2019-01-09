var mongoose = require('mongoose');
var buyerSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    buyer_name: { type: String },
    concerned_person: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'ConcernedPerson' }
    ],
});

module.exports = mongoose.model('Buyer', buyerSchema);