'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PollOption = new Schema({
	text: String,
    pollForOption: [{ type: Schema.Types.ObjectId, ref: 'Poll' }]
});

module.exports = mongoose.model('PollOption', PollOption);