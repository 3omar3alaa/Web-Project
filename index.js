const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// setup express app
const app = express();
// setup view Engine
// app.engine('html', require('ejs').renderFile);
// setup public files
// app.use(express.static(__dirname + '/public'));

// Connect to database
mongoose.connect('mongodb://localhost/airdb', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({
  extended: true
}));

// transform all comming requests into json format
app.use(bodyParser.json());


// Web App Entry Page



// Controllers
app.use('/api/admin', require('./Controllers/admin'));
app.use('/api/owner', require('./Controllers/owner'));
// app.use('/api/tenant', require('./Controllers/tenant'));
// app.get('/*', (req, res) => {
// 	res.render('index.html');
// });

// Listening
app.listen(process.env.PORT || 3000, () => {
	console.log('>> Now listening for Requests');
});
