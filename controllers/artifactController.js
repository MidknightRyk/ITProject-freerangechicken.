var storage = require('sessionstorage');
var mongoose = require('mongoose');
var Artifact = mongoose.model('Artifact');
var path = require('path');
var ObjectID = require('mongodb').ObjectID;

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

	artifact.save();
	storage.artifactId = artifact._id;
	console.log(artifact._id);
	return res.redirect('/uploadImage');
};

// Gets a single artifact by id
var getArtifact = function (req, res) {
	var artifactID = req.params.id;
	Artifact.findById(ObjectID(artifactID), function (err, artifact) {
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

module.exports.groupArtifacts = groupArtifacts;
module.exports.addArtifact = addArtifact;
module.exports.getArtifact = getArtifact;
