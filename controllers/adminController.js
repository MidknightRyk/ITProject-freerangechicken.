var mongoose = require('mongoose');
var path = require('path');
var Artifact = mongoose.model('Artifact');
var User = mongoose.model('User');
var Edits = mongoose.model('Edits');
var nodemailer = require('nodemailer');

// Gets unapproved users and artifacts
// Displays them on admin page
var adminPage = function (req, res) {
	if (req.session.userType === 'admin') {
		User.find({'approved': 0}).lean().exec(function (err, users) {
			if (!err) {
				Artifact.find({'approved': 0}).lean().exec(function (err, artifacts) {
					if (!err) {
						Edits.find({'deletion': true}).lean().populate('oldArtifact').exec(function (err, deletes) {
							if (!err) {
								console.log(deletes);
								res.render(path.join(__dirname, '/../views/admin-page/admin-page.pug'),
									{users: users, artifacts: artifacts, deletes: deletes});
							} else { throw err; }
						});
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
	var userId = req.body.userId || req.query.userId;
	User.findOneAndUpdate({_id: userId}, {approved: 1}, function (err, user, done) {
		if (err) {
			throw err;
		} else {
			var smtpTransport = nodemailer.createTransport('smtps://freerangechickenfeed%40gmail.com:' + encodeURIComponent('comp2019') + '@smtp.gmail.com:465');
			var mailOptions = {
				to: user.email,
				from: 'freerangechickenfeed@gmail.com',
				subject: 'Culturchive - Account approved',
				text: 'Hello ' + user.name + ',\n\n' +
				'This is to inform you that your account has been approved.\n' +
				'Click the link below to sign in.\n' +
				'http://culturchive.herokuapp.com\n\nBest regards,\nFree Range Chicken Team'
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				done(err);
			});
		}
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
