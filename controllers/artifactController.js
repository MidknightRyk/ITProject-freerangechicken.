var storage = require('sessionstorage');
var mongoose = require('mongoose');
var path = require('path');
var Artifact = mongoose.model('Artifact');
var User = mongoose.model('User');

// Creates a new artifact
var addArtifact = function (req, res) {
	console.log(req.body);
	var artifact = new Artifact({
		'name': req.body.name,
		'description': req.body.description,
		'author': req.session.username,
		'tags': req.body.tags,
		'placeOrigin': req.body.country,
		'year': req.body.year,
		'approved': false
	});

	// Save artifact and update the id to session storage
	artifact.save();
	var artiID = artifact._id;
	storage.artifactId = artiID;

	// Update artifact id to the relevent user who uploaded it
	User.findOneAndUpdate(
		{ 'username': req.session.username },
		{ $push: { 'artifacts': artiID } },
		function (err, artifact) {
			if (err) return console.log('couldnt update artifact to user');
		}
	);
	return res.redirect('/uploadImage');
};

// Gets a single artifact by id
var getArtifact = function (req, res) {
	var artifactID = req.params.artifact;
	Artifact.findById(artifactID.toString(), function (err, artifact) {
		if (err) return console.log(err);
		// idk the path for this cause we don't have a page for this yet
		return res.render(path.join(__dirname, '../views/artifact-page.pug'),
			{ artifact: artifact }
		);
	});
};

// Groups all existing artifacts and displays them
var groupArtifacts = function (req, res) {
	res.render(path.join(__dirname, '/../views/catalogue/catalogue.pug'),
		{stuff: Artifact.aggregate(
			[
				{ $group: { _id: '$year', artifacts: { $push: '$$ROOT' } } }
			]
	)});
};

// We need one with edit artifact

module.exports.groupArtifacts = groupArtifacts;
module.exports.addArtifact = addArtifact;
module.exports.getArtifact = getArtifact;
