const fs = require('fs');
var storage = require('sessionstorage');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var defaultDP = ObjectId('5d85d612220b38000446b55c');
var Image = mongoose.model('Image');
var Artifact = mongoose.model('Artifact');
var User = mongoose.model('User');

var multiTest = function (req, res) {
	var files = req.files;
	files.forEach(function (thisImg) {
		console.log(thisImg.originalname);
	});
	return res.redirect('/u');
};

// Upload images
var uploadImages = function (req, res) {
	var files = req.files;

	files.forEach(function (thisImg) {
		var imgname = thisImg.originalname;

		var image = new Image({
			'name': imgname,
			'data': fs.readFileSync(thisImg.path),
			'contentType': thisImg.mimetype
		});

		var imgID = image._id;

		// Add Primary Image to artifact by id
		if (thisImg.imageType === 'primaryImage') {
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
			console.log('Image ' + thisImg.originalname + ' has been uploaded!');
			// prob return the artifact page lol
			return res.redirect('/u');

		// Add Extra Images to artifact by id
		} else if (thisImg.imageType === 'extraImage') {
			console.log('Updating Extra Images Image for ' + artifactID);
			Artifact.findOneAndUpdate(
				{ '_id': artifactID },
				{ $push: { 'extraImages': imgID } }
			);

			// Update image schema link
			image.artifactId = artifactID;
			image.usage = 'artifact extra image';
			image.save();
			console.log('Image ' + thisImg.originalname + ' has been uploaded!');
			// Go to want to add more/if not then go to artifact page
			return res.redirect('/u');
		} else {
			image.usage = 'not set/random';
			image.save();
			console.log('Image ' + thisImg.originalname + ' has been uploaded!');
			// idek what this is for lol
			return res.redirect('/');
		}
	});
};

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
	Image.findOne({ '_id': req.params.image }, function (err, images) {
		if (err) return console.log(err);

		res.contentType(images.contentType);
		res.send(images.data);
	});
};

module.exports.uploadImages = uploadImages;
module.exports.getImage = getImage;
module.exports.uploadDisplayPic = uploadDisplayPic;
module.exports.multiTest = multiTest;
