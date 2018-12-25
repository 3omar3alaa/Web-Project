const express = require('express');
const router = express.Router();
const TenantModel = require('../models/user');
const accesscontrol = require('../helpers/accesscontrol').ensureAuthenticated;

//TODO is it okay to send id in url?

//view profile of tenant
router.get('/view/:id', accesscontrol, function (req, res) {
    //TODO add middleware to make sure authenticated view of profile
    tenantId = req.params.id;
    TenantModel.findById(tenantId).lean().exec(function (err, doc) {
        if(err){
            res.send('No such user') //TODO add 404 page
        }
        else{
            res.render('view_profile', {tenant: doc});
        }
    });
});

//view own profile
router.get('/view_own_profile', accesscontrol, function (req, res) {
    //TODO add middleware to make sure authenticated view of profile
    tenantId = req.user._doc._id;
    TenantModel.findById(tenantId).lean().exec(function (err, doc) {
        if(err){
            res.send('No such user') //TODO add 404 page
        }
        else{
            res.render('view_profile', {tenant: doc, settings : {canEdit : true}});
        }
    });
});

//TODO validation
//edit profile of tenant
router.get('/edit', accesscontrol, function (req, res) {
    //TODO add middleware to make sure authenticated edit of profile
    tenantId = req.user._doc._id.toString();
    TenantModel.findById(tenantId).lean().exec(function (err, doc) {
        if(err){
            res.send('No such user'); //TODO add 404 page
        }
        else{
            res.render('edit_profile', {tenant: doc, success: req.flash('success'), error: req.flash('error')});
        }
    });
});

//TODO validation
// update a tenant
router.post('/update/:id', accesscontrol, function(req, res){
    TenantModel.findByIdAndUpdate({_id: req.user._doc._id}, req.body).exec(function (err, response) {
        if (err){
            req.flash('error', 'Error! Please try again.');
            res.redirect('/tenant/edit');
        }else{
            req.flash('success', 'Success! Profile data updated!');
            res.redirect('/tenant/edit');
        }
    })
});

module.exports = router;