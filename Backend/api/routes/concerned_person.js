const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const middlewareObj = require('../middleware/check-auth');

//models
const Package = require('../models/package_specification1');
const Stock = require('../models/stock');
const User = require('../models/user');
const Buyer = require('../models/buyer');
const Concerned = require('../models/concerned');
const Company = require('../models/company');


//add new person
router.post('/', middlewareObj.isAuthenticated, function (req, res, next) {
    //objects
    var newConcerned = new Concerned();
    var concerned_person = req.body.concerned_person;
    var concerned_person_phone = req.body.concerned_person_phone;
    var concerned_person_email = req.body.concerned_person_email;

    newConcerned.concerned_person = concerned_person;
    newConcerned.concerned_person_phone = concerned_person_phone;
    newConcerned.concerned_person_email = concerned_person_email;

    Buyer.find({ _id: req.body.buyer_id })
        .exec()
        .then(foundBuyer => {
            // console.log(foundBuyer);
            newConcerned.save()
                .then(savedConcerned => {

                    foundBuyer[0].concerned_person.push(savedConcerned);
                    foundBuyer[0].save()
                        .then(savedBuyer => {
                            res.status(201).json({
                                message: "concerned person saved",
                                concerned: savedConcerned,
                            })
                        })
                        .catch(err => {
                            //   console.log(err);
                            res.status(500).json({
                                message: "something went wrong",
                            })
                        })

                })
                .catch(err => {
                    // console.log(err);
                    res.status(500).json({
                        message: "something went wrong",
                    })
                })
        })
        .catch(err => {
            //   console.log(err);
            res.status(500).json({
                message: "something went wrong",
            })
        })
})


//update concerned person
router.put('/:id', middlewareObj.isAuthenticated, function (req, res, next) {
    //objects
    //var newConcerned = new Concerned();
    var concerned_person = req.body.concerned_person;
    var concerned_person_phone = req.body.concerned_person_phone;
    var concerned_person_email = req.body.concerned_person_email;

    Concerned.find({ _id: req.params.id })
        .exec()
        .then(foundConcerned => {
            //    console.log(foundConcerned);
            foundConcerned[0].concerned_person = concerned_person;
            foundConcerned[0].concerned_person_phone = concerned_person_phone;
            foundConcerned[0].concerned_person_email = concerned_person_email;

            foundConcerned[0].save()
                .then(savedConcerned => {
                    res.status(201).json({
                        message: "concerned person saved",
                        concernedPerson: savedConcerned,
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message: "something went wrong"
                    })
                })


        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})


//search persons
router.get('/search-all-concerned', (req, res, next) => {

    var q = req.query.search;
    var buyer_id = req.query.buyer_id;
    Buyer.findById(buyer_id)
        .populate('concerned_person')
        .exec()
        .then(foundBuyer => {
            var returnConcerned = [];
            var concerneds = foundBuyer.concerned_person;
            concerneds.forEach(concerned => {
                if (concerned.concerned_person.search(q) != -1) {
                    returnConcerned.push(concerned);
                }
            });
            res.status(200).json({
                concernedPersons: returnConcerned,
            })
        })
        .catch(err => {
            //  console.log(err);
            res.status(500).json({
                messsage: 'something went wrong'
            })
        })
})

//get one concerned person
router.get('/:id', middlewareObj.isAuthenticated, (req, res, next) => {
    //var buyer_id = req.query.buyer_id;
    Concerned.find({ _id: req.params.id })
        .exec()
        .then(foundConcerned => {
            //      console.log(foundConcerned);
            res.status(200).json({
                message: "concerned person found",
                concernedPerson: foundConcerned[0],
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "something went wrong"
            })
        })
})

//get all concerned persons
router.get('/', middlewareObj.isAuthenticated, (req, res, next) => {

    var q = req.query.search;
    var buyer_id = req.query.buyer_id;
    Buyer.findById(buyer_id)
        .populate('concerned_person')
        .exec()
        .then(foundBuyer => {
            var concerneds = foundBuyer.concerned_person;
            res.status(200).json({
                concernedPersons: concerneds,
            })
        })
        .catch(err => {
            //    console.log(err);
            res.status(500).json({
                messsage: 'something went wrong'
            })
        })
})

//delete one 
router.delete('/:id', middlewareObj.isAuthenticated, middlewareObj.PersonHasPackage, (req, res, next) => {

    var buyer_id = req.query.buyer_id;
    var concerned_id = req.params.id;
    //    console.log(buyer_id);
    Concerned.findByIdAndRemove(req.params.id, (err, deletedConcerned) => {
        if (err) {
            res.status(500).json({
                message: 'something went wrong'
            })
        } else {
            //    console.log(deletedConcerned);
            Buyer.find({ _id: buyer_id })
                .exec()
                .then(foundBuyer => {
                    // console.log(foundBuyer);
                    var foundBuyerConcerned = foundBuyer[0].concerned_person;
                    //   console.log(foundBuyerConcerned);
                    var index = foundBuyerConcerned.indexOf(concerned_id);
                    //          console.log(index);
                    if (index > -1) {
                        foundBuyerConcerned.splice(index, 1);
                        //        console.log(foundBuyer[0]);
                    }
                    foundBuyer[0].save()
                        .then(savedBuyer => {
                            res.status(200).json({
                                message: "concerned person deleted"
                            })
                        })
                        .catch(err => {
                            //     console.log(err);
                            res.status(500).json({
                                message: "something went wrong"
                            })
                        })
                })
                .catch(err => {
                    //       console.log(err);
                    res.status(500).json({
                        message: "somthing went wrong"
                    })
                })
        }
    });
})



module.exports = router;
