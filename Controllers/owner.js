const express = require ('express');
const router = express.Router();
const ownerModel = require('../Models/owner');

// get a list of users from the db
router.get('/', function(req, res){
    ownerModel.find({}).then((data)=> {
        res.send(data)
    })
});

// add a new user to the db
router.post('/', function(req, res){
    console.log(req.body);
    ownerModel.create(req.body).then(function(data){
        res.send(data);
    });
});

// update a user in the db
router.put('/:id', function(req, res){
    ownerModel.findByIdAndUpdate({_id: req.params.id}, req.body).then(()=> {
        ownerModel.findOne({_id: req.params.id}).then(() =>{
            res.send(data);
        })
    })
});

// delete a user from the db
router.delete('/:id', function(req, res){
    ownerModel.findByIdAndRemove({_id: req.params.id}).then(function(data){
        res.send(data);
    })
});

module.exports = router;