
'use strict';

var User = require('../models/users.js');
var Poll = require('../models/polls.js');
var PollOption = require('../models/pollOptions');
var mongoose = require('mongoose');
var crypto = require('crypto');

function PollHandler () {

	this.getPolls = function (req, res) {
		Poll
			.find({ 'ownerOfPoll': req.user._id })
			.populate('optionsInPoll')
			.exec(function (err, result) {
				if (err) { throw err; }
				
				res.json(result);
			});
	};
	
	this.renderPoll = function(req, res) {
		Poll
			.findOne({ 'urlHash': req.params.hash })
			.populate('optionsInPoll')
			.exec(function (err, result) {
				if (err) { throw err; }
				
				if(req.user)
					res.render('viewPoll', { poll: result, username: req.user.reddit.username });
				else
					res.render('viewPoll', { poll: result });
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

	this.addPoll = function (req, res) {
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
	
	// TODO: prevent first option from being duplicated
	function addPollOptions(optionsArr, poll){
		var pollOption = {};
		
		for(var i=0; i < optionsArr.length;i++) {
			pollOption = new PollOption({
				text: optionsArr[i],
				_poll: poll._id
			});
			
			!function(pollOption){ //preserve pollOption within closure
				pollOption.save(function(err) {
			    	if (err) { throw err; }
			    	poll.optionsInPoll.push(pollOption);
			    	console.log(pollOption.text + ' added to poll')
			    	poll.save(function(err) {
			    		if (err) { throw err; }		
			    	});
			        console.log('PollOption: '+pollOption.text+' saved' );
	        	});
			}(pollOption)
		}
	}

	this.removePoll = function (req, res) {

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
	};

}

module.exports = PollHandler;
