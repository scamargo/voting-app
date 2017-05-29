'use strict';

var RedditStrategy = require('passport-reddit').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new RedditStrategy({
		clientID: configAuth.redditAuth.clientID,
		clientSecret: configAuth.redditAuth.clientSecret,
		callbackURL: configAuth.redditAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'reddit.id': profile.id }, function (err, user) { // try 'redditId' alternatively
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.reddit.id = profile.id;
					newUser.reddit.username = profile.name;
					newUser.reddit.linkKarma = profile.link_karma;
					newUser.nbrClicks.clicks = 0;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));
};
