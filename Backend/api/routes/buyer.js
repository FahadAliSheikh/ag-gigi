const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const middlewareObj = require('../middleware/check-auth');

//models

const Buyer = require('../models/buyer');
const Concerned = require('../models/concerned');
const Company = require('../models/company');

//add new buyer
router.post('/', middlewareObj.isAuthenticated, function (req, res, next) {
    //objects
    var newBuyer = new Buyer();
    var buyer_name = req.body.buyer_name;
    var company_id = req.body.company_id;
    Company.find({ _id: company_id })
        .exec()
        .then(foundCompany => {
            //     console.log(foundCompany);
            //newBuyer.company = foundCompany._id;
            newBuyer.buyer_name = buyer_name;
            newBuyer.save()
                .then(savedBuyer => {
                    foundCompany[0].buyer.push(savedBuyer);
                    foundCompany[0].save()
                        .then(savedCompany => {
                            res.status(201).json({
                                messages: 'buyer saved',
                                buyer: savedBuyer,
                            })
                        })
                })
                .catch(err => {
                    //        console.log(err);
                    res.status(500).json({
                        error: err,
                    })
                })

                .catch(err => {
                    //        console.log(err);
                    res.status(500).json({
                        error: err,
                    })
                })
        })
        .catch(err => {
            //    console.log(err);
            res.status(500).json({
                error: err,
                message: "something went wrong"
            })
        })
})

//search all buyers
router.get('/search-all-buyers', (req, res, next) => {
    //   console.log("query data===========");
    //   console.log(req.query);
    var q = req.query.search;
    var company_id = req.query.company_id;

    //   console.log(req.query.company_id);
    Company.findById(company_id)
        .populate('buyer')
        .exec()
        .then(foundCompany => {
            //         console.log("found Company");
            //         console.log(foundCompany);
            var returnBuyer = [];
            var buyers = foundCompany.buyer;
            ///console.log(buyers);
            buyers.forEach(buyer => {
                //        console.log(buyer);
                if (buyer.buyer_name.search(q) != -1) {
                    returnBuyer.push(buyer);
                }
            });
            // console.log(returnBuyer);
            res.status(200).json({
                buyers: returnBuyer,
            })
        })
        .catch(err => {
            //   console.log(err);
            res.status(500).json({
                messsage: 'something went wrong'
            })
        })
})

//get one buyer
router.get('/:id', middlewareObj.isAuthenticated, (req, res, next) => {
    Buyer.find({ _id: req.params.id })
        .populate('buyer')
        .exec()
        .then(foundBuyer => {
            //    console.log(foundBuyer)
            res.status(200).json({
                message: "buyer found",
                buyer: foundBuyer[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                messaeg: "something went wrong"
            })
        })
})


//get all buyers
router.get('/', middlewareObj.isAuthenticated, (req, res, next) => {

    // var q = req.query.search;
    var company_id = req.query.company_id;

    //   console.log(req.query.company_id);
    Company.findById(company_id)
        .populate('buyer')
        .exec()
        .then(foundCompany => {
            var buyers = foundCompany.buyer;
            res.status(200).json({
                buyers: buyers,
            })
        })
        .catch(err => {
            //      console.log(err);
            res.status(500).json({
                messsage: 'something went wrong'
            })
        })
})

//edit one buyer
router.put('/:id', middlewareObj.isAuthenticated, function (req, res, next) {
    //   console.log(req.params.id);
    var buyer_name = req.body.buyer_name;

    Buyer.find({ _id: req.params.id })
        .exec()
        .then(foundBuyer => {
            //        console.log(foundBuyer);
            foundBuyer[0].buyer_name = buyer_name;
            foundBuyer[0].save()
                .then(savedBuyer => {
                    res.status(200).json({
                        message: "buyer updated",
                        buyer: savedBuyer
                    })
                })
                .catch(err => {
                    //       console.log(err);
                    res.status(500).json({
                        error: err,
                        message: "something went wrong"
                    })
                })

        })
        .catch(err => {
            //    console.log(err);
            res.status(500).json({
                error: err,
                message: "something went wrong"
            })
        })
})

//delete one buyer
router.delete('/:id', middlewareObj.isAuthenticated, middlewareObj.BuyerHasPackage, (req, res, next) => {
    var company_id = req.query.company_id;
    //    console.log(company_id);
    var buyer_id = req.params.id;
    Buyer.findByIdAndRemove(buyer_id, (err, deletedBuyer) => {
        if (err) {
            //    console.log(err);
            res.status(500).json({
                message: "something went wrong"
            })
        } else {
            Company.find({ _id: company_id })
                .exec()
                .then(foundCompany => {
                    var foundCompanyBuyers = foundCompany[0].buyer;
                    var index = foundCompanyBuyers.indexOf(buyer_id);
                    if (index > -1) {
                        foundCompanyBuyers.splice(index, 1);
                        //       console.log(foundCompany[0]);
                    }
                    foundCompany[0].save()
                        .then(savedCompany => {
                            //           console.log(deletedBuyer);
                            //          console.log(savedCompany);
                            var deletedBuyerConcerned = deletedBuyer.concerned_person;
                            if (deletedBuyerConcerned) {
                                deletedBuyerConcerned.forEach((deleteConcerned) => {
                                    //                console.log("ids of concerned persons to be deleted");
                                    //              console.log(deleteConcerned)

                                    Concerned.findByIdAndRemove(deleteConcerned, (err, deletedConcerned) => {
                                        if (err) {
                                            //                  console.log(err);
                                            res.status(500).json({
                                                message: "something went wrong"
                                            })
                                        } else {
                                            //                   console.log("deleted");
                                        }
                                    })
                                })
                            }
                            res.status(200).json({
                                message: "buyer deleted"
                            })
                        })
                        .catch(err => {
                            //         console.log(err);
                            res.status(500).json({
                                message: "something went wrong"
                            })
                        })
                })
                .catch(err => {
                    //              console.log(err);
                    res.status(500).json({
                        message: "something went wrong"
                    })
                })
        }
    })
})


module.exports = router;
