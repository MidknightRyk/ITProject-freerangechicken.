// Code for reset functionality adapted from:
// http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/

var mongoose = require('mongoose');
var path = require('path');
var User = mongoose.model('User');
var Artifact = mongoose.model('Artifact');
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

// Registration function
var register = function (req, res) {
	// If email is not registered

	User.findOne({ email: req.body.email }).then(function (user) {
		if (user) {
			req.flash('error', 'That user already exists!');
			console.log('user exists');
			return res.redirect('back');
		} else {
			// If username is not taken
			User.findOne({username: req.body.name}).then(function (name) {
				if (name) {
					req.flash('error', 'Username taken!');
					console.log('username taken');
					return res.redirect('back');
				} else {
					// Create new user and redirect to awaiting approval page
					var user = new User({
						'name': req.body.name,
						'username': req.body.username,
						'email': req.body.email,
						'approved': false,
						'admin': false
					});
					user.setPassword(req.body.pwd);
					return user.save()
            .then(() => res.redirect('/u'));
				}
			});
		}
	});
};

// Login function
var login = function (req, res) {

	passport.authenticate('user', (err, user, info) => {
		if (err) {
			console.log(err);
			return res.redirect('/');
		}
		if (user) {

			if (user.approved) {
				// Keep user id and name in session storage
				req.session.user = user._id;
				req.session.userName = user.name;
				req.session.username = user.username;
				// Set user type
				if (user.admin) {
					req.session.userType = 'admin';
				} else {
					req.session.userType = 'user';
				}
				return res.redirect('/catalogue');
			}
		} else {
			return res.redirect('/');
		}
	})(req, res);
};

// Retrieve profile
var profile = function (req, res) {
	var userID = (req.session.user);
	User.findById(userID)
	.populate({ path: 'artifacts', model: Artifact })
	.exec((err, user) => {
		if (err) return console.log(err);

		res.render(path.join(__dirname, '/../views/profile-page/profile-page.pug'),
				{user: user, artifacts: user.artifacts});
	});
};

// Logout function
var logout = function (req, res) {
	console.log("'Logging out!'");
	req.session = null;
	res.redirect('/');
};

// Forgot password function sends email to user
var forgot = function (req, res, next) {
	async.waterfall([
		function (done) {
			crypto.randomBytes(20, function (err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function (token, done) {
			User.findOne({ email: req.body.email }, function (err, user) {
				if (err) return console.log(err);
				if (!user) {
					req.flash('error', 'No account with that email address exists.');
					return res.redirect('/forgot');
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

				user.save(function (err) {
					done(err, token, user);
				});
			});
		},
		function (token, user, done) {
			var smtpTransport = nodemailer.createTransport('smtps://freerangechickenfeed%40gmail.com:' + encodeURIComponent('comp2019') + '@smtp.gmail.com:465');
			var mailOptions = {
				to: user.email,
				from: 'freerangechickenfeed@gmail.com',
				subject: 'Culturchive - Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' + req.headers.host + '/reset/' + token + '\n\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
				done(err, 'done');
			});
		}
	], function (err) {
		if (err) return next(err);
		res.redirect('/forgot');
	});
};

var reset = function (req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
		if (err) return console.log(err);
		if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('/forgot');
		}
		res.render('reset', {
			user: req.user
		});
	});
};

var resetPassword = function (req, res) {
	async.waterfall([
		function (done) {
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
				if (err) return console.log(err);
				if (!user) {
					req.flash('error', 'Password reset token is invalid or has expired.');
					return res.redirect('back');
				}

				user.setPassword(req.body.password);
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;

				user.save(function (err) {
					if (err) return console.log(err);
					req.session.user = user._id;
					req.session.userName = user.name;
					req.session.username = user.username;
					// Set user type
					if (user.admin) {
						req.session.userType = 'admin';
					} else {
						req.session.userType = 'user';
					}
					return res.redirect('/catalogue');
				});
			});
		},
		function (user, done) {
			var smtpTransport = nodemailer.createTransport('smtps://freerangechickenfeed%40gmail.com:' + encodeURIComponent('comp2019') + '@smtp.gmail.com:465');
			var mailOptions = {
				to: user.email,
				from: 'freerangechickenfeed@gmail.com',
				subject: 'Culturchive - Your password has been changed',
				text: 'Hello,\n\n' +
				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				req.flash('success', 'Success! Your password has been changed.');
				done(err);
			});
		}
	], function (err) {
		if (err) return console.log(err);
		res.redirect('/');
	});
};

module.exports.login = login;
module.exports.register = register;
module.exports.profile = profile;
module.exports.logout = logout;
module.exports.forgot = forgot;
module.exports.reset = reset;
module.exports.resetPassword = resetPassword;
