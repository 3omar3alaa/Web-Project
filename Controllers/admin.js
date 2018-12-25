const express = require ('express');
const router = express.Router();
const adminModel = require('../Controllers/admin');
const User = require('../models/user');
const Place = require('../models/place');
const accesscontrol = require('../helpers/accesscontrol').ensureAuthenticated;


router.get('/statistics', accesscontrol, function(req, res){
    if (req.user.type == "admin"){
        var usersCount;
        var placesCount;
        var users;
        var places;
        User.find({type: "user"}).then((data)=>{
            usersCount = data.length;
            users = data;
            Place.find({}).then((data)=>{
                placesCount = data.length;
                places = data;
                res.render('statistics.ejs', {usersCount: usersCount, placesCount: placesCount, places: places, users: users});
            });
        });
    }
    else{
        console.log("You are not an admin");
        req.flash('failure','You are not an admin');
        res.redirect('/');
    }
});

router.get('/users', accesscontrol, function(req, res){
    if (req.user.type == "admin"){
        User.find({type: "user"}).then((data)=>{
            res.render('admin_users.ejs', {users: data});
        });
    }
    else{
        req.flash('failure','You are not an admin');
        res.redirect('/');
    }
});

router.get('/places', accesscontrol, function(req, res){
    if (req.user.type == "admin"){
        Place.find({}).then((data)=>{
            res.render('admin_places.ejs', {places: data});
        });
    }
    else{
        req.flash('failure','You are not an admin');
        res.redirect('/');
    }
});

// delete a place from the db
router.delete('/place/:id', function(req, res){
    try{
        Place.findByIdAndRemove({_id: req.params.id}).then(function(data){
            res.redirect('/');
        });
    }catch(e){
        console.log(e);
    }

});

router.delete('/user/:id', function(req, res){
    try{
        Place.deleteMany({ ownerId: req.params.id}, (err)=>{
            if(err){
                console.log(err);
            }else{
                User.findByIdAndRemove({_id: req.params.id}).then((data)=>{
                    res.redirect('/')
                })
            }
        });
    }catch(e){
        console.log(e);
    }
});

module.exports = router;