const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const middlewareObj = require('../middleware/check-auth');
var ObjectId = require('mongoose').Types.ObjectId;

//models
const Package = require('../models/package_specification1');
const Stock = require('../models/stock');
const User = require('../models/user');
const Buyer = require('../models/buyer');
const ConcernedPerson = require('../models/concerned');
const Company = require('../models/company');
const Machine = require('../models/machine');

var fs = require('fs');
var multer = require('multer');
//const upload = multer({dest:'uploads/'});

//======== Uploads==============

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype == 'image/jpeg' || 'image/png') {
        cb(null, true);
    } else {
        //accept
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}).single('product_image');

//------------------------------------

//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo

//add new package
router.post('/', middlewareObj.isAuthenticated, function (req, res, next) {
    //objects
    var newPackage = new Package();
    var newStock = new Stock();

    upload(req, res, function (err) {


        if (err) {
            //     console.log(err);
            return res.status(422).json({
                error: err
            })
        }
        else {
            if (!req.file) {
                newPackage.product.product_image = "";
            } else {
                //    console.log(req.file.path);
                newPackage.product.product_image = req.file.path;
            }
        }

        //let checkForValidMongoDbID = new RegExp("^[0-9a-fA-F]{24}$");
        // var merchandiser = req.body.merchandiser;
        // var production = req.body.production;
        console.log("----------------------------------------------------------")
        console.log(req.body);
        console.log("----------------------------------------------------------")


        var company = req.body.company_name;
        var buyer = req.body.buyer_name;
        var concerned_person = req.body.concerned_person;

        var programme_id = req.body.programme_id;
        var programme_name = req.body.programme_name.toLowerCase();
        var artwork_code = req.body.artwork_code;
        var created_date = new Date();
        //product
        var package_format = req.body.package_format;
        var product_unit = req.body.product_unit;
        // var quantity = req.body.quantity;
        // quantity = +quantity || 0;

        //flat
        var flat_length = req.body.flat_length;
        flat_length = +flat_length || 0;
        var flat_width = req.body.flat_width;
        flat_width = +flat_width || 0;
        var flat_trim = req.body.flat_trim;
        flat_trim = +flat_trim || 0;

        var flat_gutter = req.body.flat_gutter;
        flat_gutter = +flat_gutter || 0;
        //carton
        var carton_length = req.body.carton_length;
        carton_length = +carton_length || 0;

        var carton_width = req.body.carton_width;
        carton_width = +carton_width || 0;
        var carton_height = req.body.carton_height;
        carton_height = +carton_height || 0;
        var carton_flap = req.body.carton_flap;
        carton_flap = +carton_flap || 0;
        var carton_zay = req.body.carton_zay;
        carton_zay = +carton_zay || 0;
        //color
        var front_process_colors = JSON.parse(req.body.front_process_colors);
        var front_spot_colors = JSON.parse(req.body.front_spot_colors);
        var back_process_colors = JSON.parse(req.body.back_process_colors);
        var back_spot_colors = JSON.parse(req.body.back_spot_colors);
        var variable_colors = JSON.parse(req.body.variable_colors);

        var imprint = req.body.imprint;
        var barcode = req.body.barcode;
        //coating
        var front_coating = JSON.parse(req.body.front_coating);
        var back_coating = JSON.parse(req.body.back_coating);
        // var front_coating_value = req.body.front_coating_value;
        // var front_coating_type = req.body.front_coating_type;
        // var back_coating_value = req.body.back_coating_value;
        // var back_coating_type = req.body.back_coating_type;
        //finishing

        var pasting = JSON.parse(req.body.pasting);
        var special_requirements = JSON.parse(req.body.special_requirements);
        var cut_type = JSON.parse(req.body.cut_type);
        var secondary_print = JSON.parse(req.body.secondary_print);
        var punch_required = req.body.punch_required;
        var punch_diameter = req.body.punch_diameter;
        punch_diameter = +punch_diameter || 0;
        var folding = req.body.folding;
        var thread_required = req.body.thread_required;
        var thread_type = req.body.thread_type;
        var thread_length = req.body.thread_length;
        thread_length = +thread_length || 0;
        var perforation = req.body.perforation;

        //stock 
        var mill_name = req.body.mill_name;
        // var grain_direction = req.body.grain_direction;
        var description = req.body.description;
        var coated_sides = req.body.coated_sides;
        var stock_weight = req.body.stock_weight;
        stock_weight = +stock_weight || 0;
        var stock_thickness_unit = req.body.stock_thickness_unit;

        var stock_thickness = req.body.stock_thickness;
        stock_thickness = +stock_thickness || 0;
        // var stock_length = req.body.stock_length;
        // stock_length = +stock_length || 0;
        // var stock_width = req.body.stock_width;
        // stock_width = +stock_width || 0;
        //packing 
        var bundle = req.body.bundle;
        bundle = +bundle || 0;
        var primary_pack = JSON.parse(req.body.primary_pack);
        var carton = req.body.carton;
        var pallet = req.body.pallet;
        //delivery
        //var delivery_location = req.body.location;
        //var delivery_date = req.body.delivery_date;
        //var delivered_by = req.body.delivered_by;

        //stock
        newStock.mill_name = mill_name;
        // newStock.grain_direction = grain_direction;
        newStock.description = description;
        newStock.coated_sides = coated_sides;
        newStock.weight = stock_weight;
        newStock.thickness = stock_thickness;
        newStock.stock_thickness_unit = stock_thickness_unit;
        // newStock.stock_length = stock_length;
        // newStock.stock_width = stock_width;

        //package
        // newPackage.merchandiser = merchandiser;
        // newPackage.production = production;

        newPackage.company = company;
        newPackage.buyer = buyer;
        newPackage.concerned_person = concerned_person;

        newPackage.programme_id = programme_id;
        newPackage.programme_name = programme_name;
        newPackage.artwork_code = artwork_code;
        newPackage.created_date = created_date;
        // newPackage.customer.buyer_name = buyer_name;
        // newPackage.customer.company_name = company_name;
        //product
        newPackage.product.unit = product_unit;
        newPackage.product.package_format = package_format;
        //newPackage.product.quantity = quantity;
        newPackage.product.flat.flat_length = flat_length;
        newPackage.product.flat.flat_width = flat_width;
        newPackage.product.flat.flat_trim = flat_trim;
        newPackage.product.flat.flat_gutter = flat_gutter;
        //carton
        newPackage.product.carton.carton_length = carton_length;
        newPackage.product.carton.carton_width = carton_width;
        newPackage.product.carton.carton_height = carton_height;
        newPackage.product.carton.carton_flap = carton_flap;
        newPackage.product.carton.carton_zay = carton_zay;
        //color
        newPackage.product.color.front.process_colors = front_process_colors;
        newPackage.product.color.front.spot_colors = front_spot_colors;
        newPackage.product.color.back.process_colors = back_process_colors;
        newPackage.product.color.back.spot_colors = back_spot_colors;
        newPackage.product.color.variable.variable_colors = variable_colors;

        newPackage.product.imprint = imprint;
        newPackage.product.barcode = barcode;
        //coating

        for (i = 0; i < front_coating.length; i++) {
            newPackage.product.coating.front.push(front_coating[i]);

        }
        for (i = 0; i < back_coating.length; i++) {
            newPackage.product.coating.back.push(back_coating[i]);

        }

        for (i = 0; i < cut_type.length; i++) {
            newPackage.product.finishing.cut_type.push(cut_type[i]);
        }

        for (i = 0; i < secondary_print.length; i++) {
            newPackage.product.finishing.secondary_print.push(secondary_print[i]);
        }
        for (i = 0; i < pasting.length; i++) {
            newPackage.product.finishing.pasting.push(pasting[i]);
        }

        for (i = 0; i < primary_pack.length; i++) {
            newPackage.packing.primary_pack.push(primary_pack[i]);
        }
        for (i = 0; i < special_requirements.length; i++) {
            newPackage.product.finishing.special_requirements.push(special_requirements[i]);

        }

        //finishing
        newPackage.product.finishing.punch_required = punch_required;
        newPackage.product.finishing.punch_diameter = punch_diameter;
        newPackage.product.finishing.folding = folding;
        newPackage.product.finishing.thread_required = thread_required;
        newPackage.product.finishing.thread_type = thread_type;
        newPackage.product.finishing.thread_length = thread_length;
        newPackage.product.finishing.perforation = perforation;
        //packing
        newPackage.packing.bundle = bundle;
        newPackage.packing.carton = carton;
        newPackage.packing.pallet = pallet;
        //delivery
        // newPackage.delivery.location = delivery_location;
        // newPackage.delivery.date = delivery_date;
        // newPackage.delivery.delivered_by = delivered_by;

        newStock.save()
            .then(savedStock => {
                newPackage.stock = savedStock;
                newPackage.save()
                    .then(savedPackage => {
                        res.status(201).json({
                            message: 'package saved',
                            package: savedPackage
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: "something went wrong"
                        })
                    })

            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "something went wrong"
                })
            })

    })
})

//edit package
router.put('/:id', (req, res, next) => {


    var id = req.params.id;
    Package.findById(id, (err, foundPackage) => {
        if (err) {
            //  console.log(err);
            res.status(500).json({ message: "something went wrong" });
        } else {
            Stock.findById(foundPackage.stock, (err, foundStock) => {
                if (err) {
                    //        console.log(err);
                    res.status(500).json({ message: "something went wrong" });
                } else {

                    upload(req, res, function (err) {
                        if (err) {
                            //        console.log(err);
                            //        console.log(err);
                            return res.status(422).send("an Error occured")
                        }
                        else {
                            if (!req.file) {
                                foundPackage.product.product_image = foundPackage.product.product_image;
                            } else {
                                if (foundPackage.product.product_image.length > 0) {
                                    var dir = __dirname;
                                    var path = "";
                                    var s = dir.split("/");
                                    var i = 0;
                                    while (i <= s.length) {
                                        if (s[i] != 'Backend') {
                                            path = path + s[i] + "/";
                                        }
                                        else {
                                            path = path + s[i] + "/";
                                            break;
                                        }

                                        i++;
                                    }
                                    path = path + foundPackage.product.product_image;
                                    fs.unlink(path);
                                }
                                foundPackage.product.product_image = req.file.path;
                            }
                            //   console.log("--------------------------------------------");
                            console.log(req.body);

                            //stock
                            foundStock.mill_name = req.body.mill_name;
                            //foundStock.grain_direction = req.body.grain_direction;
                            foundStock.description = req.body.description;
                            foundStock.coated_sides = req.body.coated_sides;

                            var stock_weight = req.body.stock_weight;
                            stock_weight = +stock_weight || 0;
                            foundStock.weight = stock_weight;

                            var stock_thickness = req.body.stock_thickness;
                            stock_thickness = +stock_thickness || 0;
                            foundStock.thickness = stock_thickness;

                            foundStock.stock_thickness_unit = req.body.stock_thickness_unit;

                            // var stock_length = req.body.stock_length;
                            // stock_length = +stock_length || 0;
                            // foundStock.stock_length = stock_length;

                            // var stock_width = req.body.stock_width;
                            // stock_width = +stock_width || 0;
                            // foundStock.stock_width = stock_width;

                            //package
                            // foundPackage.merchandiser = req.body.merchandiser;
                            // foundPackage.production = req.body.production;
                            foundPackage.programme_id = req.body.programme_id;
                            foundPackage.programme_name = req.body.programme_name.toLowerCase();
                            foundPackage.artwork_code = req.body.artwork_code;
                            // foundPackage.customer.buyer_name = req.body.buyer_name;
                            // foundPackage.customer.company_name = req.body.company_name;
                            //product
                            foundPackage.product.unit = req.body.product_unit;
                            foundPackage.product.package_format = req.body.package_format;

                            // var quantity = req.body.quantity;
                            // quantity = +quantity || 0;
                            //  console.log("------------quantity-----------------")
                            //   console.log(quantity);
                            //foundPackage.product.quantity = quantity;

                            var flat_length = req.body.flat_length;
                            flat_length = +flat_length || 0;
                            foundPackage.product.flat.flat_length = flat_length;

                            var flat_width = req.body.flat_width;
                            flat_width = +flat_width || 0;
                            foundPackage.product.flat.flat_width = flat_width;

                            var flat_trim = req.body.flat_trim;
                            flat_trim = +flat_trim || 0;
                            foundPackage.product.flat.flat_trim = flat_trim;

                            var flat_gutter = req.body.flat_gutter;
                            flat_gutter = +flat_gutter || 0;
                            foundPackage.product.flat.flat_gutter = flat_gutter;

                            //carton
                            var carton_length = req.body.carton_length;
                            carton_length = +carton_length || 0;
                            foundPackage.product.carton.carton_length = carton_length;

                            var carton_width = req.body.carton_width;
                            carton_width = +carton_width || 0;
                            foundPackage.product.carton.carton_width = carton_width;

                            var carton_height = req.body.carton_height;
                            carton_height = +carton_height || 0;
                            foundPackage.product.carton.carton_height = carton_height;

                            var carton_flap = req.body.carton_flap;
                            carton_flap = +carton_flap || 0;
                            foundPackage.product.carton.carton_flap = carton_flap;

                            var carton_zay = req.body.carton_zay;
                            carton_zay = +carton_zay || 0;
                            foundPackage.product.carton.carton_zay = carton_zay;

                            // //color
                            var front_process_colors = JSON.parse(req.body.front_process_colors);
                            var front_spot_colors = JSON.parse(req.body.front_spot_colors);
                            var back_process_colors = JSON.parse(req.body.back_process_colors);
                            var back_spot_colors = JSON.parse(req.body.back_spot_colors);
                            var variable_colors = JSON.parse(req.body.variable_colors);



                            foundPackage.product.color.front.process_colors = front_process_colors;
                            foundPackage.product.color.front.spot_colors = front_spot_colors;
                            foundPackage.product.color.back.process_colors = back_process_colors;
                            foundPackage.product.color.back.spot_colors = back_spot_colors;
                            foundPackage.product.color.variable.variable_colors = variable_colors;

                            foundPackage.product.imprint = req.body.imprint;
                            foundPackage.product.barcode = req.body.barcode;
                            //coating

                            var front_coating = JSON.parse(req.body.front_coating);
                            var back_coating = JSON.parse(req.body.back_coating);


                            //finishing

                            var pasting = JSON.parse(req.body.pasting);
                            var special_requirements = JSON.parse(req.body.special_requirements);
                            var cut_type = JSON.parse(req.body.cut_type);
                            var secondary_print = JSON.parse(req.body.secondary_print);
                            var primary_pack = JSON.parse(req.body.primary_pack);


                            // var check_punch = req.body.punch_required;
                            // punch_required = req.body.punch_required;

                            var punch_diameter = req.body.punch_diameter;
                            punch_diameter = +punch_diameter || 0;
                            foundPackage.product.finishing.punch_required = req.body.punch_required;
                            if (req.body.punch_required == 'no') {
                                foundPackage.product.finishing.punch_diameter = 0;
                            } else {
                                foundPackage.product.finishing.punch_diameter = punch_diameter;

                            }

                            var check_thread = req.body.thread_required;
                            //thread_required = req.body.thread_required;
                            foundPackage.product.finishing.thread_required = req.body.thread_required;

                            var thread_length = req.body.thread_length;
                            thread_length = +thread_length || 0;

                            // if (check_thread == 'no') {
                            //     foundPackage.product.finishing.thread_type = "";
                            //     foundPackage.product.finishing.thread_length = 0;
                            // } else {
                            foundPackage.product.finishing.thread_type = req.body.thread_type;
                            foundPackage.product.finishing.thread_length = thread_length;
                            //}

                            foundPackage.product.finishing.folding = req.body.folding;

                            foundPackage.product.finishing.perforation = req.body.perforation;
                            //packing
                            var bundle = req.body.bundle;
                            bundle = +bundle || 0;
                            foundPackage.packing.bundle = bundle;
                            foundPackage.packing.carton = req.body.carton;
                            foundPackage.packing.pallet = req.body.pallet;
                            //delivery
                            // foundPackage.delivery.location = req.body.location;

                            // foundPackage.delivery.date = req.body.delivery_date;
                            // foundPackage.delivery.delivered_by = req.body.delivered_by;

                            foundPackage.company = req.body.company_name;
                            foundPackage.buyer = req.body.buyer_name;
                            foundPackage.concerned_person = req.body.concerned_person;

                            //      console.log(req.body.buyer_name);


                            //coating
                            front_coating_aaray = [];
                            for (i = 0; i < front_coating.length; i++) {
                                front_coating_aaray.push(front_coating[i]);

                            }
                            foundPackage.product.coating.front = front_coating_aaray;

                            foundPackage.product.coating.back = [];
                            for (i = 0; i < back_coating.length; i++) {
                                foundPackage.product.coating.back.push(back_coating[i]);

                            }
                            //cut type
                            foundPackage.product.finishing.cut_type = [];
                            for (i = 0; i < cut_type.length; i++) {
                                foundPackage.product.finishing.cut_type.push(cut_type[i]);
                            }
                            //secondary print
                            foundPackage.product.finishing.secondary_print = [];
                            for (i = 0; i < secondary_print.length; i++) {
                                foundPackage.product.finishing.secondary_print.push(secondary_print[i]);
                            }
                            //pasting
                            foundPackage.product.finishing.pasting = [];
                            for (i = 0; i < pasting.length; i++) {
                                foundPackage.product.finishing.pasting.push(pasting[i]);
                            }
                            //primary packing
                            foundPackage.packing.primary_pack = [];
                            for (i = 0; i < primary_pack.length; i++) {
                                foundPackage.packing.primary_pack.push(primary_pack[i]);
                            }
                            //special requirements
                            foundPackage.product.finishing.special_requirements = [];
                            for (i = 0; i < special_requirements.length; i++) {
                                foundPackage.product.finishing.special_requirements.push(special_requirements[i]);

                            }



                            foundStock.save()
                                .then(savedStock => {
                                    //          console.log(savedStock);
                                    foundPackage.stock = savedStock;
                                    foundPackage.save((err, savedPackage) => {
                                        if (err) {
                                            //                console.log(err)
                                            res.status(500).json({ message: "something went wrong" });
                                        } else {
                                            res.status(200).json({
                                                message: "Package Updated",
                                                package: savedPackage,
                                            })
                                        }
                                    })
                                })
                                .catch(err => {
                                    //               console.log(err);
                                    res.status(500).json({
                                        message: "something went wrong"
                                    })
                                })

                        }
                    })
                }
            })
        }
    })
});

//get merchandisers
router.get('/get-all-merchandisers', (req, res, next) => {
    User.find({ 'userRole': 'merchandiser' })
        .exec()
        .then(foundMerchandisers => {
            const response = {
                merchandisers: foundMerchandisers.map(foundMerchandiser => {
                    return {
                        _id: foundMerchandiser._id,
                        username: foundMerchandiser.username
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                //error: err,
                message: 'something went wrong'
            })
        })
});

//get production
router.get('/get-all-production', (req, res, next) => {
    User.find({ 'userRole': 'production' })
        .exec()
        .then(foundProductions => {
            const response = {
                productions: foundProductions.map(foundProduction => {
                    return {
                        _id: foundProduction._id,
                        username: foundProduction.username
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                //  error: err,
                message: 'something went wrong'
            })
        })
});

//get all companies
router.get('/get-all-companies', (req, res, next) => {
    Company.find()
        .populate({
            path: 'buyer',
            populate: { path: 'concerned_person' }
        })
        .exec()
        .then(foundCompanies => {
            res.status(200).json({
                companies: foundCompanies

            })
        })
        .catch(err => {
            //    console.log(err);
            res.status(500).json({
                message: "something went wrong"
            })
        })
})

//search Packages
router.get('/search-all-packages', (req, res, next) => {

    var q = req.query.search;
    //   console.log(q);
    // console.log(q);
    Package.find({
        programme_name: {
            $regex: new RegExp(q)
        },
    })
        .populate('product.finishing.cut_type')
        .exec()
        .then(foundPackages => {
            res.status(200).json({
                packages: foundPackages
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "something went wrong"
            })
        })
})

//get coatings
router.get('/get_coating', (req, res, next) => {
    Machine.Coating.find({})
        .exec()
        .then(allCoatings => {
            res.status(200).json({
                coatings: allCoatings
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'something went wrong'
            })
        })
})

router.get('/get_finishing', (req, res, next) => {
    Machine.Finishing.find({})
        .exec()
        .then(foundFinishing => {
            res.status(200).json({
                finishings: foundFinishing
            })

        })
        .catch(err => {
            res.status(500).json({
                message: 'something went wrong'
            })
        })
})


//get one package
router.get('/:id', (req, res, next) => {
    var id = req.params.id;
    Package.findById({ _id: id })
        .populate([
            'company',
            'buyer',
            'concerned_person',
            'product.package_format',
            'product.barcode',
            'product.coating.front',
            'product.coating.back',
            'product.finishing.pasting',
            'product.finishing.special_requirements ',
            'product.finishing.cut_type ',
            'product.finishing.secondary_print ',
            'product.finishing.folding ',
            'product.finishing.thread_type ',
            'product.finishing.perforation ',
            'packing.primary_pack',

        ])
        .populate({
            path: 'stock',
            populate: [
                { path: 'description' },
                { path: 'coated_sides' }
            ]
        })
        .exec()
        .then(foundPackage => {
            console.log(foundPackage);
            // foundPackage.product.finishing.pasting.forEach(element => {
            //     console.log(element._id);
            // });
            // console.log(foundPackage.product.coating.front);
            res.status(200).json({
                message: "Package found",
                package: foundPackage,
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Package not found'
            })
        })
});


//get all the packages
router.get('/', (req, res, next) => {
    Package.find({})
        .populate('company')
        .populate('stock')
        .populate('buyer')
        .exec()
        .then(packages => {
            // console.log('-------------------------hello------------');
            // console.log(packages);
            const response = {
                message: "All packages",
                package: packages.map(package => {
                    return {
                        _id: package._id,
                        programme_id: package.programme_id,
                        programme_name: package.programme_name,
                        buyer_name: package.buyer.buyer_name,
                        company_name: package.company.company_name,
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            //    console.log(err);
            res.status(500).json({
                error: err,
                message: "Something went wrong"
            });
        })
});



//delete one package
router.delete('/:id', (req, res, next) => {
    var id = req.params.id;
    Package.findById({ _id: id })
        .exec()
        .then(foundPackage => {
            Package.remove({ _id: id })
                .exec()
                .then(removedPackage => {

                    Stock.remove({ _id: foundPackage.stock._id })
                        .exec()
                        .then(removedStock => {
                            if (foundPackage.product.product_image.length > 1) {
                                var dir = __dirname;
                                var path = "";
                                var s = dir.split("/");
                                var i = 0;
                                while (i <= s.length) {
                                    if (s[i] != 'Backend') {
                                        path = path + s[i] + "/";
                                    }
                                    else {
                                        path = path + s[i] + "/";
                                        break;
                                    }

                                    i++;
                                }
                                path = path + foundPackage.product.product_image;
                                fs.unlink(path);
                            }
                            res.status(200).json({
                                message: "Package removed"
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                message: "Stock not found"
                            })
                        })

                })
                .catch(err => {
                    res.status(500).json({
                        message: 'could not remove package'
                    })
                })

        })
        .catch(err => {
            res.status(500).json({
                message: "package not found"
            })
        })
});


module.exports = router;
