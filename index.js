const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const flash = require('connect-flash');
const multer = require('multer');
const upload = multer();


// setup express app
const app = express();
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// setup view Engine
// app.engine('html', require('ejs').renderFile);
// setup public files
// app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

// Connect to database
mongoose.connect('mongodb://localhost/airdb', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
mongoose.Promise = global.Promise;


// transform all coming requests into json format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// for parsing multipart/form-data
app.use(upload.array());

// Web App Entry 4



// Controllers
app.use('/api/admin', require('./Controllers/admin'));
app.use('/api/owner', require('./Controllers/owner'));
app.use('/tenant', require('./Controllers/tenant'));
app.use('/offer', require('./Controllers/offer'));
// app.get('/*', (req, res) => {
// 	res.render('index.html');
// });

// Listening
app.listen(process.env.PORT || 3000, () => {
	console.log('>> Now listening for Requests');
});
