const express = require ('express');
const router = express.Router();
const User = require('../models/user');
const Place = require('../models/place');
const accesscontrol = require('../helpers/accesscontrol').ensureAuthenticated;

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

    var count = 0
    for (var i = 0; i < availableTimeIntervals.length; i++){
        if (i % 2 == 0){
            interval.startDate = new Date(Date.parse(availableTimeIntervals[i]));
        }
        else{
            interval.endDate = new Date(Date.parse(availableTimeIntervals[i]));
            availabilityIntervals.push(cloneMessage(interval));
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
    console.log("ID of user is" + req.user._id);
});


//View user places
router.get('/view_places', accesscontrol ,function(req, res){
    Place.find({ownerId: req.user._id}).then((data) => {
        res.render('view_places.ejs', { places: data});
    });
});

router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }
    let query = {_id:req.params.id}

    Place.remove(query, function(err){
    if(err){
        console.log(err);
    }
        res.send('Success');
    });

});

function cloneMessage(interval) {
    var clone ={};
    for( var key in interval ){
        if(interval.hasOwnProperty(key)) 
            clone[key]=interval[key];
    }
    return clone;
}

module.exports = router;