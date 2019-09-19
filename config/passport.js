const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = mongoose.model('User');

// User authorisation strategy
passport.use('user', new LocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'pwd'
	},
	function (username, password, done) {
		User.findOne({ 'email': username }, function (err, user, res) {
			console.log(username);
			if (!err) {
				if (!user || !user.validatePassword(password)) {
					return done(null, false, { errors: { 'email or password': 'is invalid' } });
				}
				return done(null, user);
			} else {
				// If user input username instead of email
				User.findOne({'username': username}, function (err, user, res) {
					if (!err) {
						if (!user || !user.validatePassword(password)) {
							return done(null, false, { errors: { 'email or password': 'is invalid' } });
						}
						return done(null, user);
					} else {
						throw err;
					}
				});
			}
		});
	}
));

// Serialise User with id
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

// Find user in the database
passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});
