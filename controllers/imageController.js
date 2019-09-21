const fs = require('fs');
var storage = require('sessionstorage');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var defaultDP = ObjectId('5d85d612220b38000446b55c');
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

	var imgID = image._id;

	// Add Primary Image to artifact by id
	if (req.body.imageType === 'primaryImage') {
		var artifactID = storage.artifactId;
		console.log('Updating Primary Image for ' + artifactID);
		Artifact.findOneAndUpdate(
			{ '_id': artifactID },
			{ 'primaryImage': imgID }
		);

		// Update image schema link
		image.artifactId = artifactID;
		image.usage = 'artifact primary image';
		image.save();

	// Add Extra Images to artifact by id
	} else if (req.body.imageType === 'extraImage') {
		console.log('Updating Extra Images Image for ' + artifactID);
		Artifact.findOneAndUpdate(
			{ '_id': artifactID },
			{ $push: { 'extraImages': imgID } }
		);

		// Update image schema link
		image.artifactId = artifactID;
		image.usage = 'artifact extra image';
		image.save();

	// Adds new display photo for user
	} else if (req.body.imageType === 'userProfilePhoto') {
		var userID = req.session.user;
		console.log('Updating User Profile Photo ' + userID);
		User.findById(userID, function (err, user) {
			if (err) return console.log(err);
			var oldDp = user.displayPic;
			if (oldDp !== defaultDP) {
				console.log(oldDp);
				Image.findOneAndDelete(
					{ '_id': user.displayPic }
				);
			}
			user.displayPic = imgID;
			console.log('old img is: ' + oldDp);
			console.log('new img is: ' + user.displayPic);
			user.save();
		});

		image.userId = userID;
		image.usage = 'user display picture';
		image.save();
	} else {
		image.usage = 'not set/random';
		image.save();
	}

	console.log('Image ' + req.file.originalname + 'has been uploaded!');
	return res.redirect('/u');
};

// Retrive images from mongo
var getImage = function (req, res) {
	Image.findOne({ '_id': req.params.image }, function (err, images) {
		if (err) return console.log(err);

		res.contentType(images.contentType);
		res.send(images.data);
	});
};

module.exports.uploadImage = uploadImage;
module.exports.getImage = getImage;
