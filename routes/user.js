const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post('/register',async (req, res, next) => {
    bcrypt.hash(req.body.password,10).then(hash =>{
        const user = new User({
            email: req.body.email,
            password: hash
        })

        user.save().then(usr => {
            res.status(201).json({
                message: "User created successfully.",
                result: usr
            });
        })
    })
})

router.post('/login',async (req, res, next) => {
    let foundUser;
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(!user){
            return res.status(401).json({
                message: 'User not found!!'
            });
        }
        foundUser = user;
        return bcrypt.compare(req.body.password,user.password);
    }).then(result => {
        if(!result){
            return res.status(401).json({
                message: 'Password incorrect!!'
            });
        }
        const token = jwt.sign({
            email: foundUser.email,
            userId: foundUser._id
        },"secret_key",{
            expiresIn: "1h"
        });
        res.status(200).json({
            message: 'Login success',
            token: token,
            expiresIn: "1"
        })
    }).catch(err => {
        res.status(500).json({
            message: 'Internal error occurred'
        })
    });
})



module.exports = router;
