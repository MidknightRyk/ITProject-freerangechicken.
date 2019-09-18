var mongoose = require('mongoose');
var path = require('path');
var Artifact = mongoose.model('Artifact');
var User = mongoose.model('User');
var ObjectID = mongoose.ObjectID;

var adminPage = function (req, res) {
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
		res.sendFile(path.join(__dirname, '/../views/adminPage.html'));
	}
};

var userApprove = function (req, res) {
	User.findOneAndUpdate({_id: ObjectID(req.body.id)}, {approved: 1});
};

var artiApprove = function (req, res) {
	Artifact.findOneAndUpdate({_id: ObjectID(req.body.id)}, {approved: 1});
};

var userDelete = function (req, res) {
	User.findOneAndDelete({_id: ObjectID(req.body.id)});
};

var artiDelete = function (req, res) {
	Artifact.findOneAndDelete({_id: ObjectID(req.body.id)});
};

module.exports.adminPage = adminPage;
module.exports.userApprove = userApprove;
module.exports.userDelete = userDelete;
module.exports.artiApprove = artiApprove;
module.exports.artiDelete = artiDelete;
