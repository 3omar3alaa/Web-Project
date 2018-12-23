const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs'); 

// setup express app
const app = express();

// setup view Engine
// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs'); 

// setup public files
app.use(express.static(__dirname + '/public'));

// Connect to database
mongoose.connect('mongodb://localhost/airdb', { useNewUrlParser: true });
mongoose.Promise = global.Promise;




// app.set('view engine', 'html'); 

app.use(bodyParser.urlencoded({
  extended: true
})); 

// transform all comming requests into json format
app.use(bodyParser.json());


// Web App Entry Page



// Controllers
app.use('/admin', require('./Controllers/admin'));
app.use('/owner', require('./Controllers/owner'));
// app.use('/api/tenant', require('./Controllers/tenant'));
app.get('/*', (req, res) => {
    console.log(req.url);
    if (req.url == '/'){
        res.render('cart.ejs');
    }
    else{
        data= fs.readFile('./Views/' + req.url,   function (err, data) {
        res.setHeader('Content-Type', 'text/html');
        res.send(data);})
    }
    // res.render('cart.ejs');
    // data= fs.readFile('./Views/' + req.url,   function (err, data) {
    // res.setHeader('Content-Type', 'text/html');
    // res.send(data);})
});

// Listening
app.listen(process.env.PORT || 3000, () => {
	console.log('>> Now listening for Requests');
});
