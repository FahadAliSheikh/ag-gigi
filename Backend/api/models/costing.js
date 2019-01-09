
var mongoose = require('mongoose');

var costingSchema = mongoose.Schema({
    created_at: {
        type: Date,
    },
    package: {
        // package id for which costing/estimation is being done
    },
    // printingMachine = { type: mongoose.Schema.Types.ObjectId, ref: 'Machine' },
    // dieCuttingMachine = { type: mongoose.Schema.Types.ObjectId, ref: 'Machine' },
    // guillotineCuttingMachine={ type: mongoose.Schema.Types.ObjectId, ref: 'Machine' },
    stock_sheet:
    {
        stock_length: { type: Number },
        stock_width: { type: Number },
        stock_sheets_without_wastage: { type: Number },
        wastage_sheets: { type: Number },
        total_stock_sheets: { type: Number },
        stock_rate: { type: Number },
    },
    press_sheet:
    {
        press_length: { type: Number },
        press_width: { type: Number },
        press_sheets_from_stock_length: { type: Number },
        press_sheets_from_stock_width: { type: Number },
        press_sheets_from_one_stock: { type: Number },
        total_printing_sheets: { type: Number },
        total_wastage_area: { type: Number },
    },
    product: {
        ups_from_length: { type: Number },
        ups_from_width: { type: Number },
        products_from_one_sheet: { type: Number },
        print_direction: { type: String },

    },

    costs:
    {
        printing_machine_cost: { type: Number },
        die_machine_cost: { type: Number },
        guillotine_machine_cost: { type: Number },
        material_cost: { type: Number },
        plate_cost: { type: Number },
        die_cost: { type: Number },
        front_coating_cost: { type: Number },
        back_coating_cost: { type: Number },
        thread_cost: { type: Number },
        pasting_cost: { type: Number },
        special_requirement_cost: { type: Number },
        folding_cost: { type: Number },
        primary_packing_cost: { type: Number },
        carton_cost: { type: Number },
        pallet_cost: { type: Number },
        delivery_cost: { type: Number },
        total_cost: { type: Number }
    }
})


module.exports = mongoose.model('Costing', costingSchema);