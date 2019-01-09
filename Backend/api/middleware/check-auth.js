const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Package = require('../models/package_specification1');

middlewareObj = {}

middlewareObj.isAuthenticated = function (req, res, next) {
    try {
        console.log(req.headers);
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, 'secret');
        req.decoded = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({

            message: 'auth failed'
        })
    }
}

middlewareObj.CompanyHasPackage = function (req, res, next) {
    try {
        console.log(req.params.id);

        Package.find({ company: req.params.id }, (err, foundPackages) => {
            if (err) {
                res.status(500).json({
                    message: "something went wrong"
                })
            } else {
                if (foundPackages.length > 0) {
                    res.status(500).json({
                        message: " This company cannot be deleted, it has pending orders "
                    })
                } else {
                    // console.log(foundPackages);
                    next();
                    console.log("no package found")
                }
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "something went wrong"
        })
    }
}

middlewareObj.BuyerHasPackage = function (req, res, next) {
    try {
        console.log(req.params.id);

        Package.find({ buyer: req.params.id }, (err, foundPackages) => {
            if (err) {
                res.status(500).json({
                    message: "something went wrong"
                })
            } else {
                if (foundPackages.length > 0) {
                    res.status(500).json({
                        message: " This buyer cannot be deleted, it has pending orders "
                    })
                } else {
                    // console.log(foundPackages);
                    next();
                }
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "something went wrong"
        })
    }
}
middlewareObj.PersonHasPackage = function (req, res, next) {
    try {
        console.log(req.params.id);

        Package.find({ concerned_person: req.params.id }, (err, foundPackages) => {
            if (err) {
                res.status(500).json({
                    message: "something went wrong"
                })
            } else {
                if (foundPackages.length > 0) {
                    res.status(500).json({
                        message: " This person cannot be deleted, it has pending orders "
                    })
                } else {
                    // console.log(foundPackages);
                    next();
                }
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "something went wrong"
        })
    }
}

module.exports = middlewareObj;
