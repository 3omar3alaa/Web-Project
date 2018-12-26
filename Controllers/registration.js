const express = require ('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');

// Render sign up page
router.get('/signup', function (req, res) {
    res.render('sign_up.ejs');
});

// Sign Up process
router.post('/signup', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const fullName = req.body.fullName;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.address;

    console.log(username + " " + password + " " + fullName + " " + email + " " + phone + " " + address);

    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('fullName', 'fullName is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('phone', 'phone is required').notEmpty();
    req.checkBody('address', 'address is required').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        console.log("Error: Validation");
        res.render('sign_up.ejs', {
        errors:errors
        });
    } else {
        let newUser = new User({
        username:username,
        password:password,
        fullName:fullName,
        email:email,
        phone:phone,
        address:address
        });

        bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            if(err){
            console.log(err);
            }
            newUser.password = hash;
            newUser.save(function(err){
            if(err){
                console.log(err);
                return;
            } else {
                req.flash('success','You are now registered and can log in');
                res.redirect('/user/signin');
            }
            });
        });
        });
    }
});


// Render sign in page
router.get('/signin', function (req, res) {
    res.render('sign_in.ejs',{success: req.flash('success'), error: req.flash('error')});
});

// Sign in Process
router.post('/signin', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/user/signin',
    failureFlash: true
  })(req, res, next);
});

// Sign out process
router.get('/signout', function(req, res){
  req.logout();
  // req.flash('success', 'You are logged out');
  res.redirect('/');
});
module.exports = router;