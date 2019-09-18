var mongoose = require('mongoose');
var path = require('path');
var User = mongoose.model('User');
var Artifact = mongoose.model('Artifact');
var passport = require('passport');
var ObjectId = require('mongodb').ObjectID;

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

var profile = function (req, res) {
	User.findById(ObjectId(req.session.user))
	.populate({ path: 'artifacts', model: Artifact })
	.exec((err, user) => {
		if (err) return console.log(err);
		res.render(path.join(__dirname, '/../views/profile-page/profile-page.pug'),
				{user: user, artifacts: user.artifacts});
	});
};

module.exports.login = login;
module.exports.register = register;
module.exports.profile = profile;
