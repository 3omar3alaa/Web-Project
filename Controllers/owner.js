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

router.post('/update_place/:placeid', accesscontrol, function (req,res) {
    Place.findById(req.params.placeid).lean().exec(function (err, doc){
        if(err){
            req.flash('error', "Database error, please try again");
            res.redirect('/owner/edit_place/'+req.params.placeid);
        }
        else{
            if(doc){
                if(doc.ownerId == req.user._doc._id){
                    let newAvailabilityIntervals = [];
                    let valid = false;
                    for (let i = 0; i<req.body.availabilityIntervals.length;i+=2){
                        valid = isValidAvailabiltyInterval(req.body, i);
                        newAvailabilityIntervals.push({startDate: new Date(Date.parse(req.body.availabilityIntervals[i])), endDate: new Date(Date.parse(req.body.availabilityIntervals[i+1]))})

                    }
                    if(valid){
                        doc.availabilityIntervals = newAvailabilityIntervals;
                        doc.title = req.body.title;
                        doc.description = req.body.description;
                        doc.size = req.body.size;
                        doc.price = req.body.price;
                        doc.address = req.body.address;
                        Place.findByIdAndUpdate(req.params.placeid, doc).lean().exec(function (err2, doc2){
                           if(err2){
                               req.flash('error', "Database error, please try again");
                               res.redirect('/owner/edit_place/'+req.params.placeid);
                           }else{
                               req.flash('success', "Edits saved!");
                               res.redirect('/owner/edit_place/'+req.params.placeid);
                           }
                        });
                    }else{
                        req.flash('error', "Invalid time interval");
                        res.redirect('/owner/edit_place/'+req.params.placeid);
                    }
                }
                else{
                    req.flash('error', "Invalid Credentials");
                    res.redirect('/owner/edit_place/'+req.params.placeid);
                }
            }else{
                req.flash('error', "Place not found!");
                res.redirect('/owner/edit_place/'+req.params.placeid);
            }
        }
    });
});

//TODO delete interval?
router.get('/edit_place/:placeid', accesscontrol, function(req, res){
    Place.findById(req.params.placeid).lean().exec(function (err, doc){
       if(err){
           res.send('DATABASE ERROR!')
       }
       else{
           if(doc){
               if(doc.ownerId == req.user._doc._id){
                   res.render('edit_place', {place:doc, success: req.flash('success'), error: req.flash('error')});
               }
               else{
                   res.send('Invalid Credentials');
               }
           }else{
               res.send('404');
           }
       }
    });
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

function isValidAvailabiltyInterval(doc, i){
    //TODO can't make availability in accepted available periods
    return doc.availabilityIntervals[i] <  doc.availabilityIntervals[i+1];
}

module.exports = router;