var mongoose = require('mongoose');
var companySchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    buyer: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer' }
    ],
    company_name: { type: String },
    company_address: { type: String },
    company_telephone: { type: String },
});

module.exports = mongoose.model('Company', companySchema);