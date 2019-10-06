var mongoose = require('mongoose');
var path = require('path');
var Artifact = mongoose.model('Artifact');
var User = mongoose.model('User');
var nodemailer = require('nodemailer');
var async = require('async');

// Gets unapproved users and artifacts
// Displays them on admin page
var adminPage = function (req, res) {
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
			var smtpTransport = nodemailer.createTransport('SMTP', {
				service: 'Gmail',
				auth: {
					user: 'freerangechickenfeed@gmail.com',
					pass: 'comp2019'
				}
			});
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
	if (req.session.userType === 'admin') {
		User.find({'approved': 0}).lean().exec(function (err, users) {
			if (!err) {
				Artifact.find({'approved': 0}).lean().exec(function (err, artifacts) {
					if (!err) {
						res.render(path.join(__dirname, '/../views/admin-page/admin-page.pug'),
							{users: users, artifacts: artifacts});
					} else { throw err; }
				});
			} else { throw err; }
		});
	} else {
		res.redirect('/no-access');
	}
};

// Approves user
var userApprove = function (req, res) {
	async.waterfall([
		function (done) {
			var userId = req.body.userId || req.query.userId;
			User.findOneAndUpdate({_id: userId}, {approved: 1}, function (err, user) {
				if (err) {
					throw err;
				} else {
					res.send(userId);
				}
			});
		},
		function (user, done) {
			var smtpTransport = nodemailer.createTransport('SMTP', {
				service: 'Gmail',
				auth: {
					user: 'freerangechickenfeed@gmail.com',
					pass: 'comp2019'
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'freerangechickenfeed@gmail.com',
				subject: 'Culturchive - Account approved',
				text: 'Hello,\n\n' +
				'This is to inform you that your account has been approved.\n' +
				'Click the link below to sign in.\n' +
				'http://culturchive.herokuapp.com\n'
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				done(err);
			});
		}
	], function (err) {
		if (err) return console.log(err);
		res.redirect('/');
	});
};

// Approves artifact
var artiApprove = function (req, res) {
	var userId = req.body.userId || req.query.userId;
	console.log(userId);
	Artifact.findOneAndUpdate({_id: userId}, {approved: 1}).then(
		function (err, res) {
			if (err) {
				throw err;
			} else {
				res.send(userId);
			}
		}
	);
};

// Deletes user
var userDelete = function (req, res) {
	var userId = req.body.userId || req.query.userId;
	User.findOneAndDelete({_id: userId}).then(
		function (err, res) {
			if (err) {
				throw err;
			} else {
				res.send(userId);
			}
		}
	);
};

// Deletes artifact
var artiDelete = function (req, res) {
	var userId = req.body.userId || req.query.userId;
	Artifact.findOneAndDelete({_id: userId}).then(
		function (err, res) {
			if (err) {
				throw err;
			} else {
				res.send(userId);
			}
		}
	);
};

module.exports.adminPage = adminPage;
module.exports.userApprove = userApprove;
module.exports.userDelete = userDelete;
module.exports.artiApprove = artiApprove;
module.exports.artiDelete = artiDelete;
