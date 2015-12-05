var User = require('../models/User');

import {
    token_secret
}
from '../config'

import bodyparser from 'body-parser'
var jwt = require('jsonwebtoken');

module.exports = function(router) {


    router.get('/setup', (req, res) => {


        let currentDate = new Date();
        console.log(currentDate)

        var nick = new User({
            name: 'test',
            password: 'password',
            admin: true
        });

        nick.save((err) => {
            if (err) throw err;
            console.log('User saved successfully');
            res.json({
                success: true
            });
        });
        console.log("success")
    });



    router.post('/authenticate', function(req, res) {
        console.log(req.body)
        User.findOne({
            name: req.body.name
        }, (err, user) => {
            if (err) throw err;
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {
                if (user.password != req.body.password) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    var token = jwt.sign(user, token_secret, {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }

            }

        });
    });

    router.use((req, res, next) => {
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, token_secret, function(err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }

    });

    router.get('/', (req, res) => {
        res.json({
            message: 'Welcome to the coolest API on earth!'
        });
    });

    router.get('/users', (req, res) => {
        User.find({}, function(err, users) {
            res.json(users);
        });
    });

    router.get('/check', (req, res) => {
        res.json(req.decoded);
    });



}