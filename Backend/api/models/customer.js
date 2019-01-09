var mongoose = require('mongoose');
var customerSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    buyer_name: { type: String },
    company_name: { type: String },
    company_address: { type: String },
    company_telephone: { type: String },
    concerned_person: { type: String },
    concerned_person_phone: { type: String },
    concerned_person_email: { type: String }
});

module.exports = mongoose.model('Customer', customerSchema);
// var mongoose = require('mongoose');
// var customerSchema = mongoose.Schema({
//     // _id: mongoose.Schema.Types.ObjectId,
//     buyer: [
//         { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer' }
//     ]
//     ,
//     // concerned_person: [
//     //     { type: mongoose.Schema.Types.ObjectId, ref: 'ConcernedPerson' }
//     // ],
//     company_name: { type: String },
//     company_address: { type: String },
//     company_telephone: { type: String },
// });

// module.exports = mongoose.model('Customer', customerSchema);