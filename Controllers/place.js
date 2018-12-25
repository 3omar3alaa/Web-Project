const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const PlaceModel = require('../models/place');
const mongoose = require('mongoose');

router.get('/view_all', function (req, res) {
   cond = {};
   if(req.query.min_size && req.query.max_size){
       cond.size = {$gt: parseFloat(req.query.min_size), $lt: parseFloat(req.query.max_size)};
   }else if(req.query.min_size){
       cond.size = {$gt: parseFloat(req.query.min_size)};
   }else if(req.query.max_size){
       cond.size = {$lt: parseFloat(req.query.max_size)};
   }

    if(req.query.min_price && req.query.max_price){
        cond.price = {$gt: parseFloat(req.query.min_price), $lt: parseFloat(req.query.max_price)};
    }else if(req.query.min_price){
        cond.price = {$gt: parseFloat(req.query.min_price)};
    }else if(req.query.max_price){
        cond.price = {$lt: parseFloat(req.query.max_price)};
    }

    if(req.query.address){
        cond.address = new RegExp(req.query.address, "i");
    }


   PlaceModel.find(cond, function (err, doc) {
       res.render('find_places', {places : doc, query : req.query});
   })

});



module.exports = router;

