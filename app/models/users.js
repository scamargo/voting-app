'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	reddit: {
		id: String,
		username: String,
        linkKarma: Number
	},
   nbrClicks: {
      clicks: Number
   },
   pollsOfUser: [{ type: Schema.Types.ObjectId, ref: 'Poll' }]
});

module.exports = mongoose.model('User', User);

//var Users = mongoose.model('User', User);
//module.exports = Users
