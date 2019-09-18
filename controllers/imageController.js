const fs = require('fs');
var storage = require('sessionstorage');
var mongoose = require('mongoose');
var Image = mongoose.model('Image');
var Artifact = mongoose.model('Artifact');
var User = mongoose.model('User');

// Upload images
var uploadImage = function (req, res) {
	var imgname = req.file.originalname;

	var image = new Image({
		'name': imgname,
		'data': fs.readFileSync(req.file.path),
		'contentType': req.file.mimetype
	});

	image.save();
	var imgID = image._id;

	// Add Primary Image to artifact by id
	if (req.body.imageType === 'primaryImage') {
		var artifactID = storage.artifactId;
		console.log('Updating Primary Image for ' + artifactID);
		Artifact.findOneAndUpdate(
			{ '_id': artifactID.toString() },
			{ 'primaryImage': imgID },
			function (err, artifact) {
				if (err) return console.log('couldnt update artifact image');

				console.log(artifact.name);
			}
		);

		// Update image schema link
		image.artifactId = artifactID;

	// Add Extra Images to artifact by id
	} else if (req.body.imageType === 'extraImage') {
		console.log('Updating Extra Images Image for ' + artifactID);
		Artifact.findOneAndUpdate(
			{ '_id': artifactID.toString() },
			{ $push: { 'extraImages': imgID } }
		);

		// Update image schema link
		image.artifactId = artifactID;
	} else if (req.body.imageType === 'userProfilePhoto') {
		var userID = req.session.user;
		console.log('Updating User Profile Photo ' + userID);
		User.findOneAndUpdate(
			{ '_id': userID.toString() },
			{ 'displayPic': imgID }
		);
	}

	console.log('Image ' + req.file.originalname + 'has been uploaded!');
	return res.redirect('/u');
};

// Retrive images from mongo
var getImage = function (req, res) {
	Image.findOne({ 'name': req.params.image }, function (err, images) {
		if (err) return console.log(err);

		console.log(req.params.image);
		res.contentType(images.contentType);
		res.send(images.data);
	});
};

module.exports.uploadImage = uploadImage;
module.exports.getImage = getImage;
