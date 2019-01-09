const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const middlewareObj = require('../middleware/check-auth');

//models

const Buyer = require('../models/buyer');
const Concerned = require('../models/concerned');
const Company = require('../models/company');


// add new company
router.post('/', middlewareObj.isAuthenticated, function (req, res, next) {
    //objects
 //     console.log(req);
    var newCompany = new Company();
    var company_name = req.body.company_name;
    var company_address = req.body.company_address;
    var company_telephone = req.body.company_telephone;

    newCompany.company_name = company_name;
    newCompany.company_address = company_address;
    newCompany.company_telephone = company_telephone;

    newCompany.save()
        .then(savedCompany => {
            res.status(201).json({
                message: 'company saved',
                company: savedCompany

            })
        })
        .catch(err => {
            res.status().json({
                message: "something went wrong"
            })
        })
})

// search companies
router.get('/search-all-companies', (req, res, next) => {

    var q = req.query.search;
   //   console.log(q);
    //   console.log(q);
    Company.find({
        company_name: {
            $regex: new RegExp(q)
        },
    })
        .populate({
            path: 'buyer',
            populate: { path: 'concerned_person' }
        })
        //       .populate('concerned_person')
        .exec()
        .then(foundCompanies => {
            res.status(200).json({
                companies: foundCompanies

            })
        })
        .catch(err => {
           //   console.log(err);
            res.status(500).json({
                message: "something went wrong"
            })
        })
})

//get one company
router.get('/:id', middlewareObj.isAuthenticated, (req, res, next) => {
    Company.find({ _id: req.params.id })
        .populate({
            path: 'buyer',
            populate: { path: 'concerned_person' }
        })
        .exec()
        .then(foundCompany => {
            res.status(200).json({
                message: 'company found',
                company: foundCompany[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})

//get all companies
router.get('/', middlewareObj.isAuthenticated, (req, res, next) => {
    Company.find({})
        .populate({
            path: 'buyer',
            populate: { path: 'concerned_person' }
        })
        .exec()
        .then(companies => {
            res.status(200).json({
                message: "companies found",
                companies: companies,
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'something went wrong'
            })
        })
})

//update a company
router.put('/:id', middlewareObj.isAuthenticated, function (req, res, next) {

    var company_name = req.body.company_name;
    var company_address = req.body.company_address;
    var company_telephone = req.body.company_telephone;

    Company.find({ _id: req.params.id })
        .exec()
        .then(foundCompany => {
            foundCompany[0].company_name = company_name;
            foundCompany[0].company_address = company_address;
            foundCompany[0].company_telephone = company_telephone;
            foundCompany[0].save()
                .then(savedCompany => {
                    res.status(201).json({
                        message: "company updated",
                        company: savedCompany
                    })
                }).catch(err => {
                 //     console.log(err);
                    res.status(500).json({
                        message: "something went wrong"
                    })
                })
        })
        .catch(err => {
           //   console.log(err);
            res.status(500).json({
                message: "something went wrong"
            })
        })
})

//delete a company
router.delete('/:id', middlewareObj.isAuthenticated, middlewareObj.CompanyHasPackage, (req, res, next) => {

    Company.findByIdAndRemove(req.params.id, (err, deletedCompany) => {
        if (err) {
            res.status(500).json({
                message: "something went wrong"
            })
        } else {
            var deletedCompanyBuyer = deletedCompany.buyer;
            if (deletedCompanyBuyer) {
                deletedCompanyBuyer.forEach((deleteBuyer) => {
                    Buyer.findByIdAndRemove(deleteBuyer, (err, deletedBuyer) => {
                        if (err) {
                            res.status(500).json({
                                message: "something went wrong"
                            })
                        } else {
                            var deletedBuyerConcerned = deletedBuyer.concerned_person;
                            if (deletedBuyerConcerned) {
                                deletedBuyerConcerned.forEach((deleteConcerned) => {
                                    Concerned.findByIdAndRemove(deleteConcerned, (err, deletedConcerned) => {
                                        if (err) {
                                        //      console.log(err);
                                            res.status(500).json({
                                                message: "something went wrong"
                                            })
                                        } else {
                                          //    console.log("deleted");
                                        }
                                    })
                                })
                            }
                        }
                    })
                })
            }
            res.status(200).json({
                message: "company deleted"
            })
        }
    });
});

module.exports = router;
