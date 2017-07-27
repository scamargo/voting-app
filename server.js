// TODO: use socket.io to update polling results as other users are voting
// TODO: sanitize results coming in through createPoll or ViewPoll page


'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var exphbs  = require('express-handlebars');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('dotenv').load();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

app.get('/jquery/jquery.js', function(req, res) {
    res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js');
});

app.get('/handlebars/handlebars.js', function(req, res) {
    res.sendFile(__dirname + '/node_modules/express-handlebars/node_modules/handlebars/dist/handlebars.min.js');
});

app.get('/socket.io/socket.io.js', function(req, res) {
    res.sendFile(__dirname + '/node_modules/socket.io/lib/socket.js');
});

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport, io);

var port = process.env.PORT || 8080;

http.listen(port, function(){
  console.log('listening on *:' + port);
});