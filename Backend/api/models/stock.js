var mongoose = require('mongoose');
var stockSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    mill_name: { type: String },
    // grain_direction: { type: String },
    description: { type: mongoose.Schema.Types.ObjectId, ref: 'Description' },
    coated_sides: { type: mongoose.Schema.Types.ObjectId, ref: 'CoatedSides' },
    weight: { type: Number },
    thickness: { type: Number },
    stock_thickness_unit: { type: String },
    // stock_length: { type: Number, required: false },
    // stock_width: { type: Number, required: false },
});

module.exports = mongoose.model('Stock', stockSchema);





















