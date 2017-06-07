'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');
var mongoose = require('mongoose');



function PollHandler () {

	this.getPolls = function (req, res) {
		Polls
			.find({ 'ownerOfPoll': req.user._id })
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
	                res.send('Added poll');
        		});
				
			});
	    
	};

	this.removePoll = function (req, res) {
		
		Polls
			.remove({ '_id': mongoose.Types.ObjectId(req.query.pollId) },function(err, result){ //undefined??
		        if (err) return res.status(500).send({err: 'Error: Could not delete poll'});
		        if(!result) return res.status(400).send({err: 'Poll not deleted from database'});
		        console.log('deleted!!!');
		        res.send(result); 
    	});
	};

}

module.exports = PollHandler;
