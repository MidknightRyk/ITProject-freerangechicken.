var mongoose = require('mongoose');
var path = require('path');
var User = mongoose.model('User');
var Artifact = mongoose.model('Artifact');
var passport = require('passport');

// Registration function
var register = function (req, res) {
	// If email is not registered
	User.findOne({ email: req.body.email }).then(function (user) {
		if (user) {
			return res.status(400).send('That user already exisits!');
		} else {
			// If username is not taken
			User.findOne({username: req.body.name}).then(function (name) {
				if (name) {
					return res.status(400).send('Username taken!');
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
				return res.redirect('/profile');
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
	req.session = null;
	res.redirect('/');
};

module.exports.login = login;
module.exports.register = register;
module.exports.profile = profile;
module.exports.logout = logout;
