'use strict';

var User = require('../models/users.js');
var Poll = require('../models/polls.js');
var PollOption = require('../models/pollOptions.js');
var Vote = require('../models/votes.js');
var mongoose = require('mongoose');
var crypto = require('crypto');

function VoteHandler () {

	this.getVotes = function (req, res) {
		Vote
			.find({ '_pollOptionId': req.query.optionId })
			.count(function(err, count){
			    if(err) { throw err; }
			    // TODO: send back poll option ID with data
			    res.json(count);
			});
	};

	this.addVote = function (req, res) { // TODO: validate user hasn't already voted in this poll
	    User
			.findOne({ 'reddit.id': req.user.reddit.id })
			.exec(function (err, result) {
				if (err) { throw err; }

				//result.pollsOfUser || (result.pollsOfUser = [])
				var user = result;
			
				var vote = new Vote({
					_voter: user._id,
					_poll: req.query.pollId,
					_pollOption: req.query.pollOptionId // TODO: validate pollOption exists with poll
				});
				
	        	vote.save(function(err) {
		            if (err) { throw err; }
		            
		            Vote.find({_pollOption: req.query.pollOptionId}).count(function(err,data){
		                if(err) { throw err; }
		                res.json(data);    
		            });
        		});
			});
	};

	/*this.removePoll = function (req, res) {

		Poll
			.remove({ '_id': mongoose.Types.ObjectId(req.query.pollId) },function(err, result){
		        if (err) return res.status(500).send({err: 'Error: Could not delete poll'});
		        if(!result) return res.status(400).send({err: 'Poll not deleted from database'});
		        PollOption
		        	.remove({'_poll':mongoose.Types.ObjectId(req.query.pollId)},function(err,result){
		        		if (err) return res.status(500).send({err: 'Error: Could not delete poll option'});
		        		if(!result) return res.status(400).send({err: 'Poll option not deleted from database'});
		        	})
		        res.send(result); // TODO: send result once all poll options are deleted -- not before
    	});
	};*/

}

module.exports = VoteHandler;
