const express = require('express');
const compu = require('../helpers/computation');
const router = express.Router();
const UserModel = require('../models/user');
const PlaceModel = require('../models/place');
const mongoose = require('mongoose');


//TODO check tenant id of offer is the logged in id
router.get('/cancel/:offerId', function (req, res){
    offerId = mongoose.Types.ObjectId(req.params.offerId);
    tenantId = req.headers.tenantid;
    placeId = req.headers.placeid;
    PlaceModel.update({_id : placeId}, {$pull: {offersLog: {_id : offerId}}}).exec(function (err, response) {
        if (err){
            req.flash('error', 'Error! Please try again.');
            res.redirect('/offer/view_all/'+tenantId);
        }else{
            req.flash('success', 'Offer removed successfully!');
            res.redirect('/offer/view_all/'+tenantId);
        }
    });
});


//TODO check given id is the logged in id
//TODO is it okay to send id?
router.get('/view_all/:id', function (req, res){
    PlaceModel.find({"offersLog.tenantId":req.params.id},
        {title:1, offersLog:{$elemMatch:{tenantId: req.params.id}}}).lean().exec(function (err, doc) {
            res.render('offers_done', {tenant:{_id:req.params.id}, places : doc, success: req.flash('success'), error: req.flash('error')});
    });
});

//TODO check tenantId is the logged in user
//TODO lock database??
router.post('/apply', function (req, res){
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
                let offer = {tenantId : req.body.tenantId,
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

module.exports = router