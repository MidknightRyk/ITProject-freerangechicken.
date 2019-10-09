var mongoose = require('mongoose');
var path = require('path');
var Artifact = mongoose.model('Artifact');
var OldArtifact = mongoose.model('OldArtifact');
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
						Edits.find({'deletion': true, 'approved': false}).lean().populate('oldArtifact').exec(function (err, deletes) {
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
	// Fetch data from body/query
	var userId = req.body.userId || req.query.userId;
	User.findOneAndUpdate({_id: userId}, {approved: 1}, function (err, user, done) {
		if (err) {
			throw err;
		} else {
			// Email authorisation
			var smtpTransport = nodemailer.createTransport('smtps://freerangechickenfeed%40gmail.com:' + encodeURIComponent('comp2019') + '@smtp.gmail.com:465');
			// Mail content
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

/* Used when approving denying artifact edits
 * Approved: new arifact gets uploaded, old artifact is moved to logs
 * Rejected: new artifact is deleted, old artifact doesn't change
 */
var editApproval = function (req, res) {
	var editID = req.params.edits;
	var approval = req.body.approval || req.query.approval;
	Edits.findById(editID, function (err, edit) {
		if (err) return console.log(err);

		var artifactID = edit.oldArtifact;
		var newartifactID = edit.newArtifact;

		// If the edits have been approved, the make the changes
		if (approval /* approved */) {
			edit.approved = true;

			Artifact.findById(artifactID, function (err, artifact) {
				if (err) return console.log(err);
				// Place the old artifact into logs, to keep track of changes
				var oldArti = new OldArtifact(artifact);
				oldArti.save();

				// Replace all the fields of the original artifact with the new info
				// Deletes the temp artifact
				Artifact.findOneAndDelete(
					{ '_id': newartifactID },
					function (err, newartifact) {
						if (err) return console.log(err);

						artifact.name = newartifact.name;
						artifact.description = newartifact.description;
						artifact.tags = newartifact.tags;	// Might need changes to this (array probs amirite)
						artifact.placeOrigin = newartifact.placeOrigin;
						artifact.year = newartifact.year;
						artifact.editor = edit.editor;
						artifact.dateEdited = edit.dateEdited;
					});
				artifact.save();
			});

		// If the changes are rejected, delete the temp artifact
		} else {
			edit.approval = true;
			edit.rejected = true;

			Artifact.findOneAndDelete({ '_id': newartifactID });
		};
		edit.save();
	});
};

var deleteApproval = function (req, res) {
	var editID = req.body.editID || req.query.editID;
	var approval = req.body.approval || req.query.approval;
	Edits.findById(editID, function (err, edit) {
		if (err) return console.log(err);
		console.log(editID);
		console.log(approval);
		var artifactID = edit.oldArtifact;
		// If this is approved, delete artifact.
		if (approval /* approved */) {
			edit.approved = true;

			Artifact.findOneAndDelete(
				{ '_id': artifactID },
				function (err, artifact) {
					if (err) return console.log(err);
					// Place the old artifact into logs, to keep track of changes
					var oldArti = new OldArtifact(artifact);
					oldArti.save();

					// delete from user
					User.findOneAndUpdate(
						{ '_id': artifact.author },
						{ $pull: { 'artifacts': artifactID } }
					);
				});
		} else {
			edit.deletion = false;
			edit.rejected = true;
		}
		edit.save();
	});
};

module.exports.adminPage = adminPage;
module.exports.userApprove = userApprove;
module.exports.userDelete = userDelete;
module.exports.artiApprove = artiApprove;
module.exports.artiDelete = artiDelete;
module.exports.editApproval = editApproval;
module.exports.deleteApproval = deleteApproval;
