const express = require ('express');
const router = express.Router();
const User = require('../models/user');
const Place = require('../models/place');
const accesscontrol = require('../helpers/accesscontrol').ensureAuthenticated;

// const ownerModel = require('../Models/user');

// Render Add Place Page
router.get('/add_place', accesscontrol ,function(req, res){
    res.render('add_place.ejs');
});

// Add new place
router.post('/add_place', function(req, res){
    console.log(req.body);
    const availableTimeIntervals = req.body.availabilityIntervals;

    availabilityIntervals = [];
    interval = {
        'startDate': null,
        'endDate': null
    };

    var i = 0;
    for (i = 0; i < availableTimeIntervals.length; i++){
        if (i % 2 == 1){
            interval.startDate = new Date(Date.parse(availableTimeIntervals[i]));
        }
        else{
            interval.endDate = new Date(Date.parse(availableTimeIntervals[i]));
            availabilityIntervals.push(interval);
        }
    }
        
    const title = req.body.title;
    const price = req.body.price;
    const size = req.body.size;
    const address = req.body.address;
    const description = req.body.description;

    //TODO : Do server validation here

    let newPlace = new Place({
        ownerId: req.user._id,
        title: title,
        price: price,
        size: size,
        availabilityIntervals: availabilityIntervals,
        description : description,
        address: address 
    });

    newPlace.save((err) =>{
        if(err){
            console.log(err);
            return;
        }
        else{
            req.flash('success','New place added');
            res.redirect('/');
        }
    });
    // console.log("Insha'allah", availabilityIntervals);
    // console.log("Available time intervals " + availableTimeIntervals);
    //console.log("Length of time intervals " + availableTimeIntervals.length)

    console.log("ID of user is" + req.user._id);
    // ownerModel.find({}).then((data)=> {
    //     res.send(data)
    // })
});


//View user places
router.get('/view_places', accesscontrol ,function(req, res){
    // ownerModel.find({}).then((data)=> {
    //     res.send(data)
    // })
    res.render('view_places.ejs');
});


// // 5c1e84e1d7afab1d282a425c
// router.get('/view_places', (req, res) =>{
//     // console.log('redirected in view_places');
//     ownerModel.find({}).then((data)=> {
//         // console.log(data);
//         res.send(data);
//         res.render('view_places.ejs', { places : data });
//     });
// });

// // Render home page
// router.get('/home', (req, res) =>{
//     // console.log('redirected in view_places');
 
//         // console.log(data);
//     res.render('cart.ejs', { places : data });

// });

// // add a new user to the db
// router.post('/', function(req, res){
//     console.log(req.body);
//     ownerModel.create(req.body).then(function(data){
//         res.redirect('/owner/view_places');
//     });
// });

// // update a user in the db
// router.put('/', function(req, res){
//     console.log(req.body);
//     ownerModel.update({_id: "5c1e84e1d7afab1d282a425c"},{
//         $push : {
//             places: req.body
//         }
//     }).then((data)=>{
//         res.redirect('/owner/view_places');
//     });
//     // ownerModel.findByIdAndUpdate({_id: "5c1e84e1d7afab1d282a425c"}, req.body).then(()=> {
//     //     ownerModel.findOne({_id: req.params.id}).then(() =>{
//     //         res.send(data);
//     //     })
//     // })
// });

// // delete a user from the db
// router.delete('/', function(req, res){
//     // ownerModel.findByIdAndRemove({_id: req.params.id}).then(function(data){
//     //     res.send(data);
//     // })
//     ownerModel.remove({}).then((data)=>{
//         res.send(data);
//     });
// });

module.exports = router;