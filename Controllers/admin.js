const express = require ('express');
const router = express.Router();
const adminModel = require('../Controllers/admin');
const User = require('../models/user');
const Place = require('../models/place');
const accesscontrol = require('../helpers/accesscontrol').ensureAuthenticated;

// get a list of users from the db
// router.get('/', function(req, res){
//     adminModel.find({}).then((data)=> {
//         res.send(data)
//     })
// });

router.get('/statistics', accesscontrol, function(req, res){
    // adminModel.find({}).then((data)=> {
    //     res.send(data)
    // })
    if (req.user.type == "admin"){
        var usersCount;
        var placesCount;
        User.find({}).then((data)=>{
            usersCount = data.length;
            Place.find({}).then((data)=>{
                placesCount = data.length;
                res.render('statistics.ejs', {usersCount: usersCount, placesCount: placesCount});
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
    // adminModel.find({}).then((data)=> {
    //     res.send(data)
    // })
    if (req.user.type == "admin"){
        var usersCount;
        var placesCount;
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
    // adminModel.find({}).then((data)=> {
    //     res.send(data)
    // })
    if (req.user.type == "admin"){
        Place.find({}).then((data)=>{
            places = data;
            res.render('admin_places.ejs', {places: places});
        });
    }
    else{
        req.flash('failure','You are not an admin');
        res.redirect('/');
    }
});

// add a new user to the db
// router.post('/', function(req, res){
//     console.log(req.body);
//     adminModel.create(req.body).then(function(data){
//         res.send(data);
//     });
// });

// // update a user in the db
// router.put('/:id', function(req, res){
//     adminModel.findByIdAndUpdate({_id: req.params.id}, req.body).then(()=> {
//         adminModel.findOne({_id: req.params.id}).then(() =>{
//             res.send(data);
//         })
//     })
// });

// delete a user from the db
router.delete('/place/:id', function(req, res){
    // console.log("Inside delete admin");
    // Place.findByIdAndRemove({_id: req.params.id}).then(function(data){
    //     res.redirect('/');
    // })
    // console.log("Inside delete admin");
    // if(!req.user._id){
    //     res.status(500).send();
    // }
    // let query = {_id:req.params.id}

    // Place.remove(query, function(err){
    // if(err){
    //     console.log(err);
    // }
    //     res.redirect('/');
    // });

    console.log("Inside delete admin, id is "+ req.params.id);
    try{
        Place.findByIdAndRemove({_id: req.params.id}).then(function(data){
            res.redirect('/');
        });
    }catch(e){
        console.log(e);
    }

});

router.delete('/user/:id', function(req, res){
    console.log("Inside delete admin, id is "+ req.params.id);
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

    // User.findByIdAndRemove({_id: req.params.id}).then(function(data){
    //     res.redirect('/');
    // })
});

// router.delete('/:id', function(req, res){
//     if(!req.user._id){
//         res.status(500).send();
//     }
//     let query = {_id:req.params.id}

//     Place.remove(query, function(err){
//     if(err){
//         console.log(err);
//     }
//         res.send('Success');
//     });

// });

module.exports = router;