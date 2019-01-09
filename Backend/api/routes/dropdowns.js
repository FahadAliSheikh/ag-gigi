const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const middlewareObj = require('../middleware/check-auth');
const Package = require('../models/package_specification1');
const Machine = require('../models/machine');

//get barcode
router.get('/get_barcodes', (req, res, next) => {
    Machine.barCode.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                barCodes: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})
//get coatings
router.get('/get_coatings', (req, res, next) => {
    Machine.Coating.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                coatings: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})

//get cuts
router.get('/get_package_formats', (req, res, next) => {
    Machine.PackageFormat.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                packageFormats: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})
//get secondary Prints
router.get('/get_secondary_prints', (req, res, next) => {
    Machine.SecondaryPrint.find({})
        .exec()
        .then(found => {
            console.log(found);
            res.status(200).json({
                secondaryPrints: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wring"
            })
        })
})
//get cuts
router.get('/get_cuts', (req, res, next) => {
    Machine.Cut.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                cuts: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})

//get threads
router.get('/get_threads', (req, res, next) => {
    Machine.Thread.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                threads: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})
//get pasting
router.get('/get_pastings', (req, res, next) => {
    Machine.Pasting.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                pastings: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})
//get special requirements
router.get('/get_special_reqs', (req, res, next) => {
    Machine.SpecialRequirement.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                special_requirements: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})
//get foldings 
router.get('/get_foldings', (req, res, next) => {
    Machine.Folding.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                foldings: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})
//get Perforation
router.get('/get_perforations', (req, res, next) => {
    Machine.Perforation.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                perforations: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})

//get descriptions
router.get('/get_descriptions', (req, res, next) => {
    Machine.Description.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                descriptions: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})
//get CoatedSides
router.get('/get_coated_sides', (req, res, next) => {
    Machine.CoatedSides.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                coatedSides: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})
// //get PrimaryPacking
router.get('/get_primary_packings', (req, res, next) => {
    Machine.PrimaryPacking.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                primaryPackings: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})
//get cartons
router.get('/get_cartons', (req, res, next) => {
    Machine.Carton.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                cartons: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})
//get pallets
router.get('/get_pallets', (req, res, next) => {
    Machine.Pallet.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                pallets: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})
//get deliver by
router.get('/get_deliverbys', (req, res, next) => {
    Machine.DeliverBy.find({})
        .exec()
        .then(found => {
            res.status(200).json({
                deliverbys: found
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})

module.exports = router;