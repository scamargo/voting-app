'use strict';

var User = require('../models/users.js');
var Poll = require('../models/polls.js');
var PollOption = require('../models/pollOptions.js');
var Vote = require('../models/votes.js');
var mongoose = require('mongoose');
var crypto = require('crypto');

function VoteHandler () {

	/*this.getVotes = function (req, res) {
		Vote
			.find({ '_pollOptionId': req.query.optionId })
			.count(function(err, count){
			    if(err) { throw err; }
			    // TODO: send back poll option ID with data
			    res.json(count);
			});
	};*/

	this.addVote = function (req, res) {
	    User
			.findOne({ 'reddit.id': req.user.reddit.id })
			.exec(function (err, result) {
				if (err) { throw err; }

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
	
	this.hasNotVoted = function(req, res, next) {
	    Vote
	        .find({ '_voter': req.user._id, '_poll': req.query.pollId})
            .count(function(err,count){
                if(err) { throw err; }

                if (count < 1) {
			        return next();
		        } else {
			        res.send('Cannot vote in same poll twice');
		        }
            });
	};

}

module.exports = VoteHandler;
