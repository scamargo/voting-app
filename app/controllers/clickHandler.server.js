'use strict';

var Users = require('../models/users.js');
var Poll = require('../models/polls.js');

function ClickHandler () {

	this.getClicks = function (req, res) {
		Users
			.findOne({ 'reddit.id': req.user.reddit.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result.nbrClicks);
			});
	};

	this.addClick = function (req, res) {
		Users
			.findOneAndUpdate({ 'reddit.id': req.user.reddit.id }, { $inc: { 'nbrClicks.clicks': 1 } })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};

	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'reddit.id': req.user.reddit.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};
	
	this.addPoll = function (req, res) {
	    var user;
		Users
			.findOne({ 'reddit.id': req.user.reddit.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result.nbrClicks);
			});
	    
		var poll = new Poll({question: 'How many licks?'}); // TODO: pull this from req query
        poll.save(function(err) {
            if (err) { throw err; }
            user.pollsOfUser.push(poll);
            user.save(function(err) {
                if (err) { throw err; }
                res.send(user.pollsOfUser);
            });
        });
	};

}

module.exports = ClickHandler;
