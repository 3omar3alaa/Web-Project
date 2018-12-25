const express = require('express');
const compu = require('../helpers/computation');
const router = express.Router();
const UserModel = require('../models/user');
const PlaceModel = require('../models/place');
const mongoose = require('mongoose');
const accesscontrol = require('../helpers/accesscontrol').ensureAuthenticated;


router.get('/cancel/:offerId', accesscontrol, function (req, res){
    offerId = mongoose.Types.ObjectId(req.params.offerId);
    tenantId = req.user._doc._id.toString();
    placeId = req.headers.placeid;
    PlaceModel.update({_id : placeId}, {$pull: {offersLog: {_id : offerId}}}).exec(function (err, response) {
        if (err){
            req.flash('error', 'Error! Please try again.');
            res.redirect('/offer/view_sent');
        }else{
            req.flash('success', 'Offer removed successfully!');
            res.redirect('/offer/view_sent');
        }
    });
});

router.get('/accept', accesscontrol, function (req, res){
    offerId = req.headers.offerid;
    ownerId = req.user._doc._id.toString();
    placeId = req.headers.placeid;
    PlaceModel.findById(placeId).lean().exec(function (err, doc) {
        if (err){
            req.flash('error', 'Error! Please try again.');
            res.redirect('/offer/view_received');
        }else{
            //Check availability
            let offers = doc.offersLog;
            let currentOffer = null;
            for(let offer of offers){
                if(offer._id.toString() == offerId.toString()){
                    currentOffer = offer;
                }
            }
            let valid = false;
            let availableIndex = null;
            let i =0;
            for (i = 0; i < doc.availabilityIntervals.length;i++){
                if(compu.isInRange(currentOffer.offerInterval.startDate, currentOffer.offerInterval.endDate,
                    doc.availabilityIntervals[i].startDate, doc.availabilityIntervals[i].endDate)){
                    valid = true;
                    availableIndex = i;
                }
            }
            if(!valid){
                req.flash('error', 'Error! Invalid time interval.');
                res.redirect('/offer/view_received');
            }
            else{
                let newAvailabiltyInterval1 = {startDate: doc.availabilityIntervals[availableIndex].startDate,
                endDate: currentOffer.offerInterval.startDate};
                let newAvailabiltyInterval12 = {startDate: currentOffer.offerInterval.endDate,
                    endDate: doc.availabilityIntervals[availableIndex].endDate};

                doc.availabilityIntervals.splice(availableIndex,1);
                doc.availabilityIntervals.push(newAvailabiltyInterval1);
                doc.availabilityIntervals.push(newAvailabiltyInterval12);
                currentOffer.status = "accepted";

                PlaceModel.findByIdAndUpdate(placeId, doc).exec(function (err, response2) {
                    if (err){
                        req.flash('error', 'Error! Please try again.');
                        res.redirect('/offer/view_received');
                    }else{
                        req.flash('success', 'Offer accepted successfully!');
                        res.redirect('/offer/view_received');
                    }
                });
            }
        }
    });
});

router.get('/reject', accesscontrol, function (req, res){
    offerId = req.headers.offerid;
    ownerId = req.user._doc._id.toString();
    placeId = req.headers.placeid;
    PlaceModel.update({_id : placeId}, {$pull: {offersLog: {_id : offerId}}}).exec(function (err, response) {
        if (err){
            req.flash('error', 'Error! Please try again.');
            res.redirect('/offer/view_received');
        }else{
            req.flash('success', 'Offer rejected successfully!');
            res.redirect('/offer/view_received');
        }
    });
});

router.get('/view_received', accesscontrol, function (req, res){
    PlaceModel.aggregate([{$match:{ownerId:req.user._doc._id.toString()}},{$match : {"offersLog.status":"pending"}},
        {$redact : {$cond:[{$eq : [{ "$ifNull": [ "$status", "pending" ] }, "pending"]}, "$$DESCEND", "$$PRUNE"]}}])
        .exec(function (err, doc) { //TODO pending plus start is not a past event
        res.render('offers_received', {owner:{_id:req.user._doc._id.toString()}, places : doc, success: req.flash('success'), error: req.flash('error')});
    });
});


//TODO check given id is the logged in id
//TODO is it okay to send id?
router.get('/view_sent', accesscontrol, function (req, res){
    PlaceModel.aggregate([{$match : {"offersLog.tenantId":req.user._doc._id.toString()}},
        {$redact : {$cond:[{$eq : [{ "$ifNull": [ "$tenantId", req.user._doc._id.toString() ] }, req.user._doc._id.toString()]}, "$$DESCEND", "$$PRUNE"]}}])
        .exec(function (err, doc) {
            res.render('offers_done', {tenant:{_id:req.user._doc._id}, places : doc, success: req.flash('success'), error: req.flash('error')});
    });
});

//TODO check tenantId is the logged in user
//TODO lock database??
router.post('/apply', accesscontrol, function (req, res){
    PlaceModel.findById(req.body.placeId).lean().exec(function (err, doc){
        if(err){ //TODO check if doc empty
            res.send('No such place!') //TODO better error
        }else{
            let isValid = true;
            for (let okayInterval of doc.availabilityIntervals){
                if(!(compu.isInRange(
                    req.body.startDate, req.body.endDate,
                    okayInterval.startDate, okayInterval.endDate))){
                    isValid = false;
                }
            }

            if(!isValid){
                res.send('Place not available in this period!'); //TODO better error
            }
            else{
                let offer = {tenantId : req.user._doc._id.toString(),
                    offerInterval : {
                        startDate: new Date(Date.parse(req.body.startDate)),
                        endDate: new Date(Date.parse(req.body.endDate))
                    },
                    status: 'pending'};
                doc.offersLog.push(offer);
                PlaceModel.findByIdAndUpdate(doc._id, doc, function (err, response) {
                    if(err){
                        res.send('Database error!'); //TODO better error
                    }
                    else{
                        res.send('Success');
                    }
                });
            }

        }
    });
});

module.exports = router;