// server.js

// modules =================================================
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var cors = require('cors');
var logger = require('morgan');

// configuration ===========================================

// set our port
var port = process.env.PORT || 8080;

app.use(logger('dev'));
// use favicon

// enable CORS
app.use(cors());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

// set the static files location /public/img will be /img for users
app.use('/*', function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.static(__dirname + '/public'));


// routes ==================================================

app.use('/', require('./app/routes')); // configure our routes

app.use('*', function(req, res) {
  res.status(404);
  res.sendfile(`./public/404.html`);
});

// start app ===============================================
// startup our app at http://localhost:8080

app.listen(port);

// shoutout to the user
console.log(`it's alive port ` + port);

// expose app
exports = module.exports = app;
