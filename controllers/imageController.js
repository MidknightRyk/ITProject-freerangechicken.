const fs = require('fs');
var storage = require('sessionstorage');
var mongoose = require('mongoose');
var Image = mongoose.model('Image');
var Artifact = mongoose.model('Artifact');

// Upload images
var uploadImage = function (req, res) {
	var imgname = req.file.originalname;

	var image = new Image({
		'name': imgname,
		'data': fs.readFileSync(req.file.path),
		'contentType': req.file.mimetype
	});

	// Add Primary Image to artifact by id
	if (req.body.imageType === 'primaryImage') {
		var artifactID = storage.artifactId;
		console.log('Updating Primary Image for ' + artifactID);
		Artifact.findOneAndUpdate(
			{ '_id': artifactID.toString() },
			{ 'primaryImage': imgname },
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
			{ $push: { 'extraImages': imgname } }
		);

		// Update image schema link
		image.artifactId = artifactID;
	} else if (req.body.imageType === 'userProfilePhoto') {
		console.log('Updating User Profile Photo ' + artifactID);
	}

	console.log('Image ' + req.file.originalname + 'has been uploaded!');
	return image.save()
		.then(() => res.redirect('/u'));
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
