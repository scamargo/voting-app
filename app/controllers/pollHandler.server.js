'use strict';

var Users = require('../models/users.js');
var Poll = require('../models/polls.js');



function PollHandler () {

	this.getPolls = function (req, res) { // TODO: debug
		Poll
			.findOne({ 'ownerOfPoll': req.user._id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result);
			});
	};

	this.addPoll = function (req, res) {
	    Users
			.findOne({ 'reddit.id': req.user.reddit.id })
			.exec(function (err, result) {
				if (err) { throw err; }

				result.pollsOfUser || (result.pollsOfUser = [])
				var user = result;
			
				var poll = new Poll({
					question: req.query.question,
					ownerOfPoll: user._id
				});
				
	        	poll.save(function(err) {
		            if (err) { throw err; }
		            //user.pollsOfUser.push(poll);
		            //user.save(function(err) {
		                //if (err) { throw err; }
		                res.send('Added poll');
		            //});
        		});
				
			});
	    
	};

	/*this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};*/

}

module.exports = PollHandler;
