'user strict';

var bodyparser = require('body-parser');
import {
    User1
}
from '../models/User.js'

module.exports = function loadUserRoutes(router, passport) {

    router.get('/auth/facebook', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

    router.post('/sign_up', passport.authenticate('local-signup'), function(req, res) {
        console.log(req.body);
        req.session.hoge = "hogehoge";
        req.session.save(function() {
            res.send()
        });
        res.json(req.user);
    });


    router.post('/sign_in', passport.authenticate('local-login'), function(req, res) {
        console.log(req.body);
        res.json(req.user);
    });


    router.get('/signout', function(req, res) {

        req.logout();
        res.end();
    });

    //get auth credentials from server
    router.post('/load_auth_into_state', function(req, res) {

        console.log("+++++++++++++load_auth_into_state+++++++++++++")
        console.log(req.user);
        // console.log(req);


        // console.log(req.body);
        // console.log(req.user);

        res.json(req.user);
        // console.log(req.user.local.username)

        // User.findOneAndUpdate({ 'local.username': req.user.local.username}, function(err, user) {
        //  if (err) {
        //    console.log("find one error")
        //  }
        //  if (!user) {
        //    console.log("no user error")

        //  }
        //  // if (!user.validPassword(password)) {
        //  //   return done(null, false)
        //  // }
        //  console.log(req.body)
        //  console.log("find user")
        //  user.local.socketid = req.body.socketid
        //  user.local.password = "asdfa"
        //  user.save(function(err) {
        //    if (err) { console.log(err);console.log("save error") }
        //    console.log(user);
        //    console.log("user find error")

        //  });


        //  User.findOne({ 'local.username': req.user.local.username}, function(err, user) {

        //     console.log(req.body)

        //     if (err) {
        //       console.log("tura!")
        //     }
        //     if (user) {
        //      console.log("tubr!")
        //     } else {
        //       var newUser = new User();
        //       newUser.local.username = "username";
        //       newUser.local.password = "newUser.generateHash(password);"
        //       newUser.local.socketid = "req.body.socketid;"

        //       newUser.save(function(err, user) {
        //         if (err) {
        //           throw err;
        //         }
        //         console.log("turc!")
        //       });
        //     }



        // })




        //   console.log("+++++++++++++load_auth_into_state+++++++++++++")



        // var fs=require("fs");
        // fs.readFile("test.json" , 'utf8',function(err,data){
        // console.log(data);
        // res.json(data);
        // });

    });

    // get usernames for validating whether a username is available
    router.get('/allusers', function(req, res) {
        User.find({
            'local.username': {
                $exists: true
            }
        }, {
            'local.username': 1,
            _id: 0
        }, function(err, data) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    msg: 'internal server error'
                });
            }
            res.json(data);
        });
    })

    // Check if username in DB
    router.post('/validate_username', function(req, res) {
        User.find({
            username: req.body.username
        }, function(err, data) {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    msg: 'error validating username'
                })
            }
            if (data.length > 0) {
                res.json({
                    valid: false
                })
            } else {
                res.json({
                    valid: true
                })
            }
        }).limit(1)
    })
};