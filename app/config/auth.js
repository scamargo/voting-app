'use strict';

module.exports = {
	'redditAuth': {
		'clientID': process.env.REDDIT_KEY,
		'clientSecret': process.env.REDDIT_SECRET,
		'callbackURL': process.env.APP_URL + 'auth/reddit/callback'
	}
};
