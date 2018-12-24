const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const flash = require('connect-flash');
const multer = require('multer');
const upload = multer();
const passport = require('passport');
const config = require('./config/database');





// setup express app
const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// setup view Engine
// app.engine('html', require('ejs').renderFile);
// setup public files
// app.use(express.static(__dirname + '/public'));

const seed = true;
if (seed){
    require('./helpers/db_routines').seed();
}else{
    mongoose.connect('mongodb://localhost/airdb', { useNewUrlParser: true });
    mongoose.Promise = global.Promise;
}


// transform all coming requests into json format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Make global variable of User that can be seen by all URLs
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Controllers
app.use('/tenant', require('./Controllers/tenant'));
app.use('/offer', require('./Controllers/offer'));
app.use('/user', require('./Controllers/registration'));
// app.get('/*', (req, res) => {
// 	res.render('index.html');
// });
app.use('/admin', require('./Controllers/admin'));
app.use('/owner', require('./Controllers/owner'));
// app.use('/api/tenant', require('./Controllers/tenant'));
app.get('/*', (req, res) => {
    // console.log(req.url);
    if (req.url == '/'){
        console.log(res.locals.user);
        res.render('home.ejs');
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
