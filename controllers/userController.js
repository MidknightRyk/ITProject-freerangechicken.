var mongoose = require('mongoose');
var User = mongoose.model('User');

var editProfile = function (req, res) {
	var userID = (req.session.user);
	User.findOneAndUpdate(
		{ '_id': userID },
		function (err, user) {
			if (err) return console.log(err);
			user.name = req.body.name || user.name;
			user.username = req.body.username || user.username;
			user.email = req.body.email || user.email;
			user.relationship = req.body.relationship || user.relationship;

			// Update session info
			req.session.userName = user.name;
			req.session.username = user.username;
		}
	);
	return res.redirect('/profile');
};

module.exports.editProfile = editProfile;
