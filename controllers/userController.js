var mongoose = require('mongoose');
var User = mongoose.model('User');
var Artifact = mongoose.model('Artifact');
var path = require('path');

// Get edit profile Page
var getProfileEdit = function (req, res) {
	var userID = (req.session.user);
	User.findById(userID, function (err, user) {
		if (err) return console.log(err);
		res.render(path.join(__dirname, '/../views/edit-profile/edit-profile.pug'),
			{ user: user }
		);
	});
};

// Edit user profile
var editProfile = function (req, res) {
	console.log(req.body);
	var userID = (req.session.user);
	console.log('Editing ' + userID + ' profile information');
	User.findById(userID, function (err, user) {
		if (err) return console.log(err);
		user.name = req.body[0].value || user.name;
		user.username = req.body[1].value || user.username;
		user.email = req.body[2].value || user.email;
		user.relationship = req.body[3].value || user.relationship;

		// Update session info
		req.session.userName = user.name;
		req.session.username = user.username;
		user.save();
	});
	res.redirect('/profile');
};

// Retrieve user information for catalogue
var catalogue = function (req, res) {
	var userID = (req.session.user);
	User.findById(userID).exec((err, user) => {
		if (err) return console.log(err);
		Artifact.aggregate([
			{ $match: {'approved': true} }, { $sort: {year: 1} }, { $group: { _id: '$year', articles: { $push: '$$ROOT' } } }
		]).exec((err, artifacts) => {
			if (err) return console.log(err);
			console.log(artifacts);
			res.render(path.join(__dirname, '/../views/catalogue/catalogue.pug'),
					{user: user, artifacts: artifacts});
		});
	});
};

module.exports.editProfile = editProfile;
module.exports.catalogue = catalogue;
module.exports.getProfileEdit = getProfileEdit;
