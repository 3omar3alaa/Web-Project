const express = require ('express');
const router = express.Router();
// const ownerModel = require('../Models/user');

// // get a list of users from the db
// router.get('/', function(req, res){
//     // ownerModel.find({}).then((data)=> {
//     //     res.send(data)
//     // })
//     res.render('cart.ejs');
// });


// // 5c1e84e1d7afab1d282a425c
// router.get('/view_places', (req, res) =>{
//     // console.log('redirected in view_places');
//     ownerModel.find({}).then((data)=> {
//         // console.log(data);
//         res.send(data);
//         res.render('view_places.ejs', { places : data });
//     });
// });

// // Render home page
// router.get('/home', (req, res) =>{
//     // console.log('redirected in view_places');
 
//         // console.log(data);
//     res.render('cart.ejs', { places : data });

// });

// // add a new user to the db
// router.post('/', function(req, res){
//     console.log(req.body);
//     ownerModel.create(req.body).then(function(data){
//         res.redirect('/owner/view_places');
//     });
// });

// // update a user in the db
// router.put('/', function(req, res){
//     console.log(req.body);
//     ownerModel.update({_id: "5c1e84e1d7afab1d282a425c"},{
//         $push : {
//             places: req.body
//         }
//     }).then((data)=>{
//         res.redirect('/owner/view_places');
//     });
//     // ownerModel.findByIdAndUpdate({_id: "5c1e84e1d7afab1d282a425c"}, req.body).then(()=> {
//     //     ownerModel.findOne({_id: req.params.id}).then(() =>{
//     //         res.send(data);
//     //     })
//     // })
// });

// // delete a user from the db
// router.delete('/', function(req, res){
//     // ownerModel.findByIdAndRemove({_id: req.params.id}).then(function(data){
//     //     res.send(data);
//     // })
//     ownerModel.remove({}).then((data)=>{
//         res.send(data);
//     });
// });

module.exports = router;