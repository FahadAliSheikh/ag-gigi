var mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');
var pkg_specSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,

    // merchandiser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // production: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },

    company: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Company'
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Buyer'
    },
    concerned_person: {
        type: mongoose.Schema.Types.ObjectId, ref: 'ConcernedPerson'
    },

    programme_id: { type: String },
    programme_name: { type: String },
    artwork_code: { type: String },
    created_date: { type: String },
    //product
    product: {
        unit: { type: String },
        package_format: { type: mongoose.Schema.Types.ObjectId, ref: 'PackageFormat' },
        product_image: { type: String },
        //quantity: { type: Number },
        flat: {
            flat_length: { type: Number },
            flat_width: { type: Number },
            flat_trim: { type: Number },
            flat_gutter: { type: Number }
        },// flat ends here
        carton: {
            carton_length: { type: Number },
            carton_width: { type: Number },
            carton_height: { type: Number },
            carton_flap: { type: Number },
            carton_zay: { type: Number }
        },//carton ends here
        color: {
            front: {
                process_colors: [],
                spot_colors: []
            },
            back: {
                process_colors: [],
                spot_colors: []

            },
            variable: {
                variable_colors: []
            }
        },//color ends here
        imprint: { type: String },
        barcode: { type: mongoose.Schema.Types.ObjectId, ref: 'barcode' },
        coating: {
            front: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Coating"
            }],
            back: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Coating"
                }
            ],
        },//coating ends here
        finishing: {
            pasting: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Pasting"
                }
            ],
            special_requirements: [{
                type: mongoose.Schema.Types.ObjectId, ref: 'SpecialRequirement'
            }],
            cut_type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Cut"
            }],
            secondary_print: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "SecondaryPrint"
                }
            ],
            punch_required: { type: String },
            punch_diameter: { type: Number },
            folding: { type: mongoose.Schema.Types.ObjectId, ref: 'Folding' },
            thread_required: { type: String },
            thread_type: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
            thread_length: { type: Number },
            perforation: { type: mongoose.Schema.Types.ObjectId, ref: 'Perforation' },
        },//finishing ends here
    }, //product ends here

    packing: {
        bundle: { type: Number },
        primary_pack: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'PrimaryPacking' }
        ],
        carton: { type: String },
        pallet: { type: String },
    },//packing ends here

    // delivery: {
    //     location: { type: String },
    //     date: { type: String },
    //     delivered_by: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliverBy' },
    // }
});

module.exports = mongoose.model('Package', pkg_specSchema);