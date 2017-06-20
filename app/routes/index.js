'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var crypto = require('crypto');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var pollHandler = new PollHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});
		
	app.route('/secret')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/secret.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.reddit);
		});

	app.route('/auth/reddit')
		.get(function(req, res, next){
			req.session.state = crypto.randomBytes(32).toString('hex');
			passport.authenticate('reddit', {
    			state: req.session.state,
    			duration: 'permanent',
			})(req, res, next);
		});

	app.route('/auth/reddit/callback')
		.get(function(req, res, next){
			// Check for origin via state token
			if (req.query.state == req.session.state){
	    		passport.authenticate('reddit', {
	    			successRedirect: '/',
	    			failureRedirect: '/login'
	    		})(req, res, next);
			}
			else {
	    		next( new Error(403) );
			}
		});
		
	app.route('/new')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/editPoll.html');
		});
	
	app.route('/api/:id/polls')
		.get(isLoggedIn, pollHandler.getPolls)
		.post(isLoggedIn, pollHandler.addPoll)
		.delete(isLoggedIn, pollHandler.removePoll)
};
