'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    ownerOfPoll: { type: Schema.Types.ObjectId, ref: 'User' },
	question: String,
    optionsInPoll: [{ type: Schema.Types.ObjectId, ref: 'PollOption' }],
    urlHash: String
});

module.exports = mongoose.model('Poll', Poll);