const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const PlaceModel = require('../models/place');
const mongoose = require('mongoose');
const accesscontrol = require('../helpers/accesscontrol').ensureAuthenticated;

router.get('/view_all', accesscontrol, function (req, res) {
   cond = {};
   if(req.query.min_size && req.query.max_size){
       cond.size = {$gte: parseFloat(req.query.min_size), $lte: parseFloat(req.query.max_size)};
   }else if(req.query.min_size){
       cond.size = {$gte: parseFloat(req.query.min_size)};
   }else if(req.query.max_size){
       cond.size = {$lte: parseFloat(req.query.max_size)};
   }

    if(req.query.min_price && req.query.max_price){
        cond.price = {$gte: parseFloat(req.query.min_price), $lte: parseFloat(req.query.max_price)};
    }else if(req.query.min_price){
        cond.price = {$gte: parseFloat(req.query.min_price)};
    }else if(req.query.max_price){
        cond.price = {$lte: parseFloat(req.query.max_price)};
    }

    if(req.query.address){
        cond.address = new RegExp(req.query.address, "i");
    }


   PlaceModel.find(cond, function (err, doc) {
       res.render('find_places', {places : doc, query : req.query});
   });

});

router.get('/review/:placeid', accesscontrol, function (req, res) {
    PlaceModel.findById(req.params.placeid).lean().exec(function (err, doc) {
        if(err){
            req.flash('error', 'Error! Please try again.');
            res.redirect('/place/view/'+req.params.placeid);
        }
        else if(!canMakeReview(req.user._doc._id, doc)){
            req.flash('error', "You can't review places you haven't been accepted in.");
            res.redirect('/place/view/'+req.params.placeid);
        }
        else{
            doc.reviews.push({tenantId : req.user._doc._id, reviewText : req.query.review});
            PlaceModel.findByIdAndUpdate({_id : req.params.placeid}, doc).lean().exec(function (err, doc2){
                if(err){
                    req.flash('error', 'Error! Please try again.');
                    res.redirect('/place/view/'+req.params.placeid);
                }else{
                    req.flash('success', "Review added!");
                    res.redirect('/place/view/'+req.params.placeid);
                }
            });
        }
    });
});

router.get('/view/:placeid', accesscontrol, function (req, res){
    PlaceModel.findById(req.params.placeid).lean().exec(function (err, doc) {
        res.render('detailed_place', {place : doc, settings : { canReview : canMakeReview(req.user._doc._id, doc)},
            success: req.flash('success'), error: req.flash('error')});
    });
});

function canMakeReview(userId, placeDoc){
    let canReview = false;
    for (let i = 0; i < placeDoc.offersLog.length; i++){
        if (placeDoc.offersLog[i].tenantId == userId && placeDoc.offersLog[i].status == 'accepted'){
            canReview = true;
            break;
        }
    }
    return canReview;
}

module.exports = router;

