const fs = require('fs');
var storage = require('sessionstorage');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var defaultDP = ObjectId('5d8b3762f8e40e67dab64acd');
var Image = mongoose.model('Image');
var Artifact = mongoose.model('Artifact');
var User = mongoose.model('User');

// Upload artifact images
var uploadImages = function (req, res) {
	// collect the images uploaded
	var files = req.files;
	// Get the artifact that these images are assigned to
	var artifactID = storage.artifactId;
	Artifact.findById(artifactID, function (err, artifact) {
		if (err) return console.log(err);

		// Upload and Assign the Primary image
		var primary = files.shift();
		var imgname = primary.originalname;

		var image = new Image({
			'name': imgname,
			'data': fs.readFileSync(primary.path),
			'contentType': primary.mimetype
		});

		artifact.primaryImage = image._id;
		console.log('Updating Primary Image for ' + artifactID);
		// Update image schema link
		image.artifactId = artifactID;
		image.usage = 'artifact primary image';
		image.save();
		console.log('Primary Image ' + primary.originalname + ' has been uploaded!');

		// Continue by uploading each of the remaining images as extra images
		files.forEach(function (thisImg) {
			imgname = thisImg.originalname;
			image = new Image({
				'name': imgname,
				'data': fs.readFileSync(thisImg.path),
				'contentType': thisImg.mimetype
			});
			artifact.extraImages.push(image._id);
			console.log('Updating Extra Images Image for ' + artifactID);
			// Update image schema link
			image.artifactId = artifactID;
			image.usage = 'artifact extra image';
			image.save();
			console.log('Extra Image ' + thisImg.originalname + ' has been uploaded!');
		});
		artifact.save();
	});
	// direct to awaiting approval
	return res.redirect('/u');
};

var reuploadImages = function (req, res) {
	// collect the images uploaded
	var files = req.files;
	// Get the artifact that these images are assigned to
	var artifactID = storage.artifactId;
	console.log(artifactID);
	// update the relevant artifact
	Artifact.findById(artifactID)
	.exec(function (err, artifact) {
		if (err) return console.log(err);
		files.forEach(function (thisImg) {
			var imgname = thisImg.originalname;
			var image = new Image({
				'name': imgname,
				'data': fs.readFileSync(thisImg.path),
				'contentType': thisImg.mimetype
			});
			artifact.extraImages.push(image._id);
			console.log('Updating Extra Images Image for ' + artifactID);
			// Update image schema link
			image.artifactId = artifactID;
			image.usage = 'artifact extra image';
			image.save();
			console.log('Extra Image ' + thisImg.originalname + ' has been uploaded!');
		});
		artifact.save();
	});
	res.redirect('/catalogue');
};

// Uploads display picture function
var uploadDisplayPic = function (req, res) {
	var imgname = req.file.originalname;

	var image = new Image({
		'name': imgname,
		'data': fs.readFileSync(req.file.path),
		'contentType': req.file.mimetype
	});

	var imgID = image._id;
	var userID = req.session.user;
	console.log('Updating User Profile Photo ' + userID);
	User.findById(userID, function (err, user) {
		if (err) return console.log(err);
		var oldDp = user.displayPic;
		if (oldDp !== defaultDP) {
			console.log(oldDp);
			Image.findByIdAndDelete(oldDp, function (err, img) {
				if (err) return console.log(err);
				console.log('deleted: ' + img._id);
			});
		}
		user.displayPic = imgID;
		console.log('new img is: ' + user.displayPic);
		user.save();
	});

	image.userId = userID;
	image.usage = 'user display picture';
	image.save();
	console.log('Image ' + req.file.originalname + ' has been uploaded!');
	return res.redirect('/');
};

// Retrive images from mongo
var getImage = function (req, res) {
	var cond = req.params.image;
	console.log('getting image: ' + cond);
	// Look for image by name
	Image.findOne({ 'name': cond }, function (err, image) {
		if (err) return console.log(err);
		if (image) {
			// Image found
			res.contentType(image.contentType);
			return res.send(image.data);
		};
	});

	/* this works but throws an error for some reason grr */

	// If not found look by ID
	Image.findOne({ '_id': cond }, function (err, img) {
		if (err) return console.log(err);
		res.contentType(img.contentType);
		res.send(img.data);
	});
};

/* need to implement an edit image function */

module.exports.uploadImages = uploadImages;
module.exports.getImage = getImage;
module.exports.reuploadImages = reuploadImages;
module.exports.uploadDisplayPic = uploadDisplayPic;
