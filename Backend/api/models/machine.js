var mongoose = require('mongoose');

var machineSchema = mongoose.Schema({
    machine_name: { type: String },
    machine_type: { type: String },
    machine_man_name: { type: String },
    no_of_colors: { type: Number },
    machine_cost: { type: Number },
    max_size: {
        length: Number,
        width: Number,
    },
    min_size: {
        length: Number,
        width: Number,
    },
    plate: {
        length: Number,
        width: Number,
        price: Number
    }

})

var barCode = mongoose.Schema({
    type: { type: String },
    price: { type: Number }
})

var Coating = mongoose.Schema({
    type: { type: String },
    price: { type: Number },
})

// var CoatingType = mongoose.Schema({
//     type: { type: String },
//     price: { type: Number }
// })
// var CoatingValue = mongoose.Schema({
//     format: { type: String },
//     price: { type: Number }
// })

// var Packing = mongoose.Schema({
//     primary_packing: [],
//     catron_price: Number,
//     pallet_price: Number
// })
var PackageFormat = mongoose.Schema({
    type: { type: String },
    price: { type: Number }
})

var Cut = mongoose.Schema({
    type: { type: String },
    price: { type: Number }
})

var SecondaryPrint = mongoose.Schema({
    type: { type: String },
    price: { type: Number }
})

var Thread = mongoose.Schema({
    type: { type: String },
    price: { type: Number }
})
var Pasting = mongoose.Schema({
    type: { type: String },
    price: { type: Number }
})

var SpecialRequirement = mongoose.Schema({
    type: { type: String },
    price: { type: Number }
})
var Folding = mongoose.Schema({
    value: { type: String },
    price: { type: Number, default: 0 },
    no_of_folds: { type: Number },
})
var Perforation = mongoose.Schema({
    value: { type: String },
    price: { type: Number }
})

var Description = mongoose.Schema({
    type: { type: String },
    // price: { type: Number },
    // stock_rate: { type: Number },
    // stock_rate_unit: { type: String }
})

var CoatedSides = mongoose.Schema({
    type: { type: String },
    price: { type: Number }

})

var PrimaryPacking = mongoose.Schema({
    type: { type: String },
    price: { type: Number }

})
// var Carton = mongoose.Schema({
//     value: { type: String },
//     price: { type: Number }

// })
// var Pallet = mongoose.Schema({
//     value: { type: String },
//     price: { type: Number }

// })
var DeliverBy = mongoose.Schema({
    type: { type: String },
    price: { type: Number }
})


Machine = mongoose.model('Machine', machineSchema);
barCode = mongoose.model('barcode', barCode);
Coating = mongoose.model('Coating', Coating);
// CoatingType = mongoose.model('CoatingType', CoatingType);
// CoatingValue = mongoose.model('CoatingValue', CoatingValue);
PackageFormat = mongoose.model('PackageFormat', PackageFormat);
Cut = mongoose.model('Cut', Cut);
SecondaryPrint = mongoose.model('SecondaryPrint', SecondaryPrint);
Thread = mongoose.model('Thread', Thread);
Pasting = mongoose.model('Pasting', Pasting);
SpecialRequirement = mongoose.model('SpecialRequirement', SpecialRequirement);
// Bindery = mongoose.model('Bindery', Bindery);
Folding = mongoose.model('Folding', Folding);
Perforation = mongoose.model('Perforation', Perforation);
Description = mongoose.model('Description', Description);
CoatedSides = mongoose.model('CoatedSides', CoatedSides);
PrimaryPacking = mongoose.model('PrimaryPacking', PrimaryPacking);
// Carton = mongoose.model('Carton', Carton);
//Pallet = mongoose.model('Pallet', Pallet);
DeliverBy = mongoose.model('DeliverBy', DeliverBy);
module.exports = {
    Machine, barCode, Coating, PackageFormat, Cut, SecondaryPrint, Thread,
    Pasting, SpecialRequirement, Folding,
    Perforation, Description, CoatedSides,
    PrimaryPacking, DeliverBy,
    // Carton, Pallet,
}