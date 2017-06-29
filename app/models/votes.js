'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Vote = new Schema({
    _voter: { type: Schema.Types.ObjectId, ref: 'User' },
    _poll: { type: Schema.Types.ObjectId, ref: 'Poll' },
    _pollOption: { type: Schema.Types.ObjectId, ref: 'PollOption' }
});

module.exports = mongoose.model('Vote', Vote);