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

router.get('/view/:placeid', accesscontrol, function (req, res){
    PlaceModel.findById(req.params.placeid).lean().exec(function (err, doc) {
        res.render('detailed_place', {place : doc});
    });
});



module.exports = router;

