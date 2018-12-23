const express = require('express');
const router = express.Router();
const TenantModel = require('../models/user');

//TODO is it okay to send id in url?

//view profile of tenant
router.get('/view/:id', function (req, res) {
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

//TODO validation
//edit profile of tenant
router.get('/edit/:id', function (req, res) {
    //TODO add middleware to make sure authenticated edit of profile
    tenantId = req.params.id;
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
router.post('/update/:id', function(req, res){
    TenantModel.findByIdAndUpdate({_id: req.params.id}, req.body).exec(function (err, response) {
        if (err){
            req.flash('error', 'Error! Please try again.');
            res.redirect('/tenant/edit/'+req.params.id);
        }else{
            req.flash('success', 'Success! Profile data updated!');
            res.redirect('/tenant/edit/'+req.params.id);
        }
    })
});

// get a list of users from the db
router.get('/', function(req, res){
    tenantModel.find({}).then((data)=> {
        res.send(data)
    })
});

// add a new user to the db
router.post('/', function(req, res){
    console.log(req.body);
    tenantModel.create(req.body).then(function(data){
        res.send(data);
    });
});



// delete a user from the db
router.delete('/:id', function(req, res){
    tenantModel.findByIdAndRemove({_id: req.params.id}).then(function(data){
        res.send(data);
    })
});

module.exports = router;