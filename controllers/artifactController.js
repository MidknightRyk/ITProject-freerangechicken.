var storage = require('sessionstorage');
var mongoose = require('mongoose');
var Artifact = mongoose.model('Artifact');
var path = require('path');

var addArtifact = function (req, res) {
	console.log(req.body);
	var artifact = new Artifact({
		'name': req.body.name,
		'description': req.body.description,
		'author': req.body.username,
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

var getArtifact = function (req, res) {
	console.log(req.params.artifact);
	Artifact.find({'_id': (req.params.artifact).toString()}, function (err, artifact) {
		if (err) return console.log(err);

		console.log(req.params.artifact);
		res.send(artifact.data);
	});
};

var groupArtifacts = function (req, res) {
	res.render(path.join(__dirname, '/../views/catalogue/catalogue.pug'),
		{stuff: Artifact.aggregate(
			[
				{ $group: { _id: "$year", artifacts: { $push: "$$ROOT" } } }
			]
	)});
};

module.exports.groupArtifacts = groupArtifacts;
module.exports.addArtifact = addArtifact;
module.exports.getArtifact = getArtifact;
