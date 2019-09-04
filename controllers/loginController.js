var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

var register = function (req, res) {
	User.findOne({ email: req.body.email }).then(function (user) {
		if (user) {
			return res.status(400).send('That user already exisits!');
		} else {
			User.findOne({username: req.body.name}).then(function (name) {
				if (name) {
					return res.status(400).send('Username taken!');
				} else {
					var user = new User({
						'username': req.body.name,
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

/* login function */
var login = function (req, res) {
	passport.authenticate('user', (err, user, info) => {
		if (err) {
			return res.redirect('/');
		}
		if (user) {
			if (user.approved) {
				req.session.user = user._id;
				if (user.admin) {
					req.session.userType = 'admin';
				} else {
					req.session.userType = 'user';
				}
				return res.redirect('/profile');
			}
		} else {
			return res.redirect('/u');
		}
	})(req, res);
};

module.exports.login = login;
module.exports.register = register;
