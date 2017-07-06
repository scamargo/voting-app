'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var VoteHandler = require(path + '/app/controllers/voteHandler.server.js')
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
	var voteHandler = new VoteHandler();
		
	app.route('/')
		.get(function (req, res) {
			pollHandler.renderAllPolls(req,res);
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
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
	
	app.route('/mypolls')
		.get(isLoggedIn, function (req, res) {
			pollHandler.renderMyPollsPage(req,res);
		});
		
	app.route('/rendermypolls')
		.get(isLoggedIn, function(req, res) {
			pollHandler.renderMyPolls(req, res);	
		});
		
	app.route('/new')
		.get(isLoggedIn, function (req, res) {
			res.render('createPollPage');
		});
		
	app.route('/polls/:hash')
		.get(function (req, res) {
			pollHandler.renderPoll(req,res);
		});
	
	// API CALLS
	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.reddit);
		});
	
	app.route('/api/:id/polls')
		.get(isLoggedIn, pollHandler.getPolls)
		.post(isLoggedIn, pollHandler.addPoll)
		.delete(isLoggedIn, pollHandler.removePoll);
		
	function hasNotVoted (req, res, next) {
		voteHandler.hasNotVoted(req, res, next);
	}
		
	app.route('/api/:id/votes')
		.post(isLoggedIn, hasNotVoted, voteHandler.addVote); // Respond with error when user is not authenticated
		
	app.get('/api/:id/poll', function(req, res) {
		pollHandler.getPollById(req,res);
	});

};