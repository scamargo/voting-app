
'use strict';

var User = require('../models/users.js');
var Poll = require('../models/polls.js');
var PollOption = require('../models/pollOptions.js');
var Vote = require('../models/votes.js')
var mongoose = require('mongoose');
var crypto = require('crypto');
var validator = require('validator');

function PollHandler () {

	this.getPolls = function (req, res) {
		
		if(!req.query.pollId) 
		{
			var filteredQuery = {};
			if(req.user) {
				filteredQuery['ownerOfPoll'] = req.user._id;
			}
			
			Poll
				.find(filteredQuery)
				.populate('optionsInPoll')
				.exec(function (err, result) {
					if (err) { throw err; }
					
					res.json(result);
				});
		}
		else
		{
			Poll
				.findOne({ '_id': req.query.pollId })
				.populate('optionsInPoll')
				.exec(function (err, result) {
					if (err) { throw err; }
					
					var c = 0;
					for(var i=0;i<result.optionsInPoll.length;i++){
						(function(i) {
						Vote.find({"_pollOption":result.optionsInPoll[i]})
							.count(function(err,data){
								if(err) { throw err; }
								
								result.optionsInPoll[i].voteCount = data;
	
								c++;
								if(c == result.optionsInPoll.length) {
	
									res.json(result);
								}
							});
						})(i);
					}
				});	
		}
	};
	
	this.renderPoll = function(req, res) { 
		if(!validator.isAlphanumeric(req.params.hash)){
			res.render('errorPage',{'errorMessage':'Invalid hash'});
			return;
		}
		
		Poll
			.findOne({ 'urlHash': req.params.hash })
			.populate('optionsInPoll')
			.exec(function (err, result) {
				if (err) { throw err; }
				
				if(result==null){
					res.render('errorPage',{'errorMessage':'That hash does not exist'});
					return;
				}
				
				var c = 0;
				for(var i=0;i<result.optionsInPoll.length;i++){
					(function(i) {
					Vote.find({"_pollOption":result.optionsInPoll[i]})
						.count(function(err,data){
							if(err) { throw err; }
							
							result.optionsInPoll[i].voteCount = data;

							c++;
							if(c == result.optionsInPoll.length) {
								if(req.user) {
								    Vote
								        .find({ '_voter': req.user._id, '_poll': result._id})
							            .count(function(err,count){
							                if(err) { throw err; }
							
							                res.render('viewPoll', { poll: result, username: req.user.reddit.username, userVoteCount: count });
							            });
								}
								else
								{
									res.render('viewPoll', { poll: result });
								}
							}
						});
					})(i);
				}
			});	
	};
	
	
	
	this.renderAllPolls = function(req, res) {
		Poll
			.find()
			.exec(function (err, result) {
				if (err) { throw err; }
				
				if(req.user)
					res.render('home', { polls: result, username: req.user.reddit.username });
				else
					res.render('home', { polls: result, poll: result });
			});	
	};
	
	this.renderMyPollsPage = function(req, res) {
		Poll
			.find({ 'ownerOfPoll': req.user._id })
			.exec(function (err, result) {
				if (err) { throw err; }
				
				res.render('myPollsPage', { polls: result, username: req.user.reddit.username });
			});	
	};
	
	this.renderMyPolls = function(req, res) {
		Poll
			.find({ 'ownerOfPoll': req.user._id })
			.exec(function (err, result) {
				if (err) { throw err; }
				
				res.render('myPolls', { layout: false, polls: result });
			});	
	};

	this.addPoll = function (req, res) {
	    
	    if(validator.isEmpty(req.query.question)) {
	    	res.send('Question cannot be empty');
	    	return;
	    }
	    
	    if(req.query.options == null || req.query.options.length < 2) {
	    	res.send('Poll must include at least two options');
	    	return;
	    }
	    for(var i=0; i < req.query.options.length;i++) {
			if(validator.isEmpty(req.query.options[i])) {
				res.send('Poll options cannot be empty');
				return;
			}
		}
	    
	    User
			.findOne({ 'reddit.id': req.user.reddit.id })
			.exec(function (err, result) {
				if (err) { throw err; }

				result.pollsOfUser || (result.pollsOfUser = [])
				var user = result;
			
				var poll = new Poll({
					question: req.query.question,
					ownerOfPoll: user._id,
					urlHash: crypto.randomBytes(8).toString('hex')
				});
				
	        	poll.save(function(err) {
		            if (err) { throw err; }
	                addPollOptions(req.query.options, poll) //TODO: how to check for error;
	                
	                res.json(poll);
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
			
			poll.optionsInPoll.push(pollOption);
			
			pollOption.save(function(err) {
		    	if (err) { throw err; }
        	});
		}
		
		poll.save(function(err){
			if (err) { throw err; }
		});
	}

	this.removePoll = function (req, res) {

		Poll
			.remove({ '_id': mongoose.Types.ObjectId(req.query.pollId) },function(err, result){
		        if (err) return res.status(500).send({err: 'Error: Could not delete poll'});
		        if(!result) return res.status(400).send({err: 'Poll not deleted from database'});
		        Vote
		        	.remove({'_poll': mongoose.Types.ObjectId(req.query.pollId)},function(err,result){
		        		if (err) return res.status(500).send({err: 'Error: Could not delete votes'});
		        		if(!result) return res.status(400).send({err: 'Votesmongo not deleted from database'});
		        	})
		        PollOption
		        	.remove({'_poll':mongoose.Types.ObjectId(req.query.pollId)},function(err,result){
		        		if (err) return res.status(500).send({err: 'Error: Could not delete poll options'});
		        		if(!result) return res.status(400).send({err: 'Poll option not deleted from database'});
		        	})
		        res.send(result); // TODO: send result once all related data is deleted -- not before
    	});
	};
	
	this.updatePoll = function (req, res, next) {
	    Poll
			.findOne({ '_id': req.query.pollId })
			.exec(function (err, result) {
				if (err) { throw err; }

				var poll = result;
			
				var pollOption = new PollOption({
					text: req.query.option,
					_poll: poll._id,
				});
				
				poll.optionsInPoll.push(pollOption);
				
	        	pollOption.save(function(err, pollOption) {
		            if (err) { throw err; }
		            req.query.pollOptionId = pollOption._id.toString();
	                
	                poll.save(function(err, poll) {
	                	if (err) { throw err; }
	                	return next();
	                });
        		});
			});
	    
	};

}

module.exports = PollHandler;
