var mongoose = require('mongoose');
var User = mongoose.model('User');
var Artifact = mongoose.model('Artifact');
var path = require('path');

var editProfile = function (req, res) {
	var userID = (req.session.user);
	console.log('Editing ' + userID + ' profile information');
	User.findById(userID, function (err, user) {
		if (err) return console.log(err);
		user.name = req.body.name || user.name;
		user.username = req.body.username || user.username;
		user.email = req.body.email || user.email;
		user.relationship = req.body.relationship || user.relationship;
		console.log(user.name);
		console.log(req.body.name);

		// Update session info
		req.session.userName = user.name;
		req.session.username = user.username;
		user.save();
	});
};

// Retrieve user information for catalogue
var catalogue = function (req, res) {
	var userID = (req.session.user);
	User.findById(userID).exec((err, user) => {
		if (err) return console.log(err);
		Artifact.aggregate([
			{ $sort: {year: 1} }, { $group: { _id: '$year', articles: { $push: '$$ROOT' } } }
		]).exec((err, artifacts) => {
			if (err) return console.log(err);
			console.log(artifacts);
			res.render(path.join(__dirname, '/../views/catalogueNew/catalogue.pug'),
					{user: user, artifacts: artifacts});
		});
	});
};

module.exports.editProfile = editProfile;
module.exports.catalogue = catalogue;
