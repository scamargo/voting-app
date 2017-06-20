'use strict';

var User = require('../models/users.js');
var Poll = require('../models/polls.js');
var PollOption = require('../models/pollOptions');
var mongoose = require('mongoose');



function PollHandler () {

	this.getPolls = function (req, res) {
		Poll
			.find({ 'ownerOfPoll': req.user._id })
			//.populate('optionsInPoll') TODO: get options by poll
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result);
			});
	};

	this.addPoll = function (req, res) {
	    User
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
	                addPollOptions(req.query.options, poll) //TODO: how to check for error;
	                
	                res.send('Added poll');
        		});
			});
	    
	};
	
	function addPollOptions(optionsArr, poll){
		var pollOption = {};
		
		for(var i=0; i < optionsArr.length;i++) {
			pollOption = new PollOption({
				text: optionsArr[i],
				_poll: poll._id
			});
			
			pollOption.save(function(err) {
		    	if (err) { throw err; }
		        console.log('PollOption: '+pollOption.text+' saved' );
        	});
		}
	}

	this.removePoll = function (req, res) {
		
		Poll
			.remove({ '_id': mongoose.Types.ObjectId(req.query.pollId) },function(err, result){ //undefined??
		        if (err) return res.status(500).send({err: 'Error: Could not delete poll'});
		        if(!result) return res.status(400).send({err: 'Poll not deleted from database'});
		        console.log('deleted!!!');
		        res.send(result); 
    	});
	};

}

module.exports = PollHandler;
