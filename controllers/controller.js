const fs = require('fs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Artifact = mongoose.model('Artifact');
var Image = mongoose.model('Image');
var passport = require('passport');

var register = function (req, res) {
  // app.post("/register", function(req,res){
	console.log(req.body.name);

	var user = new User({
		'username': req.body.name,
		'email': req.body.email,
		'approved': false,
		'admin': false
	});

	user.setPassword(req.body.pwd);
	console.log(user);
	return user.save()
		.then(() => res.redirect('/u'));
};

/* login function */
var login = function (req, res) {
	passport.authenticate('user', (err, user, info) => {
		if (err) {
			return res.redirect('/');
		}
		if (user) {
			console.log(user);
			if (user.approved) {
				req.session.user = user._id;
				if (user.admin) {
					req.session.userType = 'admin';
				} else {
					req.session.userType = 'user';
				}
				return res.redirect('/profile');
			} else {
				return res.redirect('/u');
			}
		}
	})(req, res);
};

var addArtifact = function (req, res) {
	console.log(req.body);
	var artifact = new Artifact({
		'name': req.body.name,
		'description': req.body.description,
		'primaryImage': req.body.primaryimage,
		'author': req.body.username,
		'tags': req.body.tags,
		'placeOrigin': req.body.country,
		'year': req.body.year,
		'approved': false
	});

	return artifact.save()
    .then(() => res.redirect('/uploadImage'));
};

var getArtifact = function (req, res) {
	console.log(req.params.artifact);
	Artifact.find({'_id': ObjectId(req.params.artifact)}, function (err, artifact) {
		if (err) return console.log(err);

		console.log(req.params.artifact);
		res.send(artifact.data);
	});
};

var uploadImage = function (req, res) {
	var imgname = req.file.originalname;

	var image = new Image({
		'name': imgname,
		'data': fs.readFileSync(req.file.path),
		'contentType': req.file.mimetype
	});

	Artifact.updateOne(
		{ 'name': req.body.artifactname },
		{ $set: { 'extraImages': imgname } }
	);

	console.log('Image ' + req.file.originalname + 'has been uploaded!');
	return image.save()
		.then(() => res.redirect('/u'));
};

var getImage = function (req, res) {
	Image.findOne({ 'name': req.params.image }, function (err, images) {
		if (err) return console.log(err);

		console.log(req.params.image);
		res.contentType(images.contentType);
		res.send(images.data);
	});
};

module.exports.login = login;
module.exports.register = register;
module.exports.addArtifact = addArtifact;
module.exports.uploadImage = uploadImage;
module.exports.getImage = getImage;
module.exports.getArtifact = getArtifact;
