const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
//const middlewareObj = require('../middleware/check-auth');

router.post('/signup', (req, res, next) => {

    if (!req.body.email)
        return res.status(500).json({ message: 'Email is required' });
    else if (!req.body.password)
        return res.status(500).json({ message: 'Password is required' });
    else if (!req.body.username)
        return res.status(500).json({ message: 'Username is required' });
    else if (!req.body.userRole)
        return res.status(500).json({ message: 'User role is required' });

    else {
        User.find({
            $and: [{
                "email": req.body.email
            }, {
                "username": req.body.username
            }]
        })
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    return res.status(409).json({
                        message: 'Username and email already exists'
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });

                        }
                        else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email.toLowerCase(),
                                password: hash,
                                username: req.body.username.toLowerCase(),
                                userRole: req.body.userRole.toLowerCase(),
                            });
                            user.save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: 'Successfully registered',
                                        user: result
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err,
                                        message: 'Something went wrong',
                                    });
                                });
                        }
                    });
                }
            });
    }

});


router.post('/login', (req, res, next) => {
    if (!req.body.email)
        return res.status(500).json({ message: 'Email is required' });
    else if (!req.body.password)
        return res.status(500).json({ message: 'Password is required' });
    else {
        email = req.body.email;
        User.find({ email: email })
            .exec()
            .then(user => {
                if (user.length < 1) {
                    res.status(401).json({
                        message: "Wrong password/email"
                    });
                } else {
                    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                        if (err) {
                            return res.status(401).json({
                                message: "Wrong password/email"

                            });

                        } if (result) {
                            const token = jwt.sign(
                                {
                                    email: user[0].email,
                                    userId: user[0]._id
                                },
                                // process.env.JWT_KEY,
                                'secret',
                                // {
                                //     expiresIn: '1h'
                                // }
                            )
                            return res.status(200).json({
                                message: 'Successfully logged in',
                                token: token,
                                userData: {
                                    username: user[0].username,
                                    userId: user[0]._id,
                                }


                            })
                        }
                        return res.status(401).json({
                            message: "Wrong password/email"
                        });
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                    message: 'Something went wrong',
                });
            });
    }
});





module.exports = router;