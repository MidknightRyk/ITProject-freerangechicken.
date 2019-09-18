var mongoose = require('mongoose');
var path = require('path');
var Artifact = mongoose.model('Artifact');
var User = mongoose.model('User');

var adminPage = function (req, res) {
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
};

var userApprove = function (req, res) {
	var userId = req.body.userId || req.query.userId;
	User.findOneAndUpdate({_id: userId}, {approved: 1}).then(
		function (err, res) {
			if (err) {
				throw err;
			} else {
				res.send(userId);
			}
		}
	);
};

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
