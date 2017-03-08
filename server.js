//set up
//getting all the tools needed

var express = require('express');
var app = express();


app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 3000);




var mongoose = require('mongoose');
var passport = require('passport');
var aws = require('aws-sdk');
var flash = require('connect-flash');
var session = require('express-session');
app.use(session({ secret: 'mypixelboxaccount' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//DB configuration
var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

//routes
require('./app/routes.js')(app, passport);
