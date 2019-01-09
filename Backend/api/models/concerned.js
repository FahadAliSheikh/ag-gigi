var mongoose = require('mongoose');
var concernedPersonSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    concerned_person: { type: String },
    concerned_person_phone: { type: String },
    concerned_person_email: { type: String }
});

module.exports = mongoose.model('ConcernedPerson', concernedPersonSchema);