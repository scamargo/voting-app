'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PollOption = new Schema({
	text: String,
    _poll: { type: Schema.Types.ObjectId, ref: 'Poll' },
    voteCount: Number
});

module.exports = mongoose.model('PollOption', PollOption);