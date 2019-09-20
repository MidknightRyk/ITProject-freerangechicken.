var storage = require('sessionstorage');
var mongoose = require('mongoose');
var path = require('path');
var Artifact = mongoose.model('Artifact');
var OldArtifact = mongoose.model('OldArtifact');
var User = mongoose.model('User');
var Edits = mongoose.model('Edits');

// Creates a new artifact
var addArtifact = function (req, res) {
	console.log(req.body);
	var artifact = new Artifact({
		'name': req.body.name,
		'description': req.body.description,
		'author': req.session.userName,
		'tags': (req.body.tags).split(','),
		'placeOrigin': req.body.country,
		'year': req.body.year
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
	return res.redirect('/images/uploadImage');
};

// Gets a single artifact by id
var getArtifact = function (req, res) {
	var artifactID = req.params.artifact;
	Artifact.findById(artifactID, function (err, artifact) {
		if (err) return console.log(err);
		storage.artifactId = artifact.id;
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

/* Used to make edits for approval
 * Creates a new artifact with all the edited values,
 * assigns it to a edit suggestion doc.
 * ***Does not include image edits***
 */
var suggestEdits = function (req, res) {
	var artifactID = storage.artifactId;
	Artifact.findById(artifactID,
	function (err, artifact) {
		if (err) return console.log(err);
		var editedArtifact = new Artifact({
			'name': req.body.name || artifact.name,
			'description': req.body.description || artifact.description,
			'tags': req.body.tags || artifact.tags,
			'placeOrigin': req.body.country || artifact.placeOrigin,
			'year': req.body.year || artifact.year,
			'approved': false
		});

		editedArtifact.save(function (err, arti) {
			if (err) return console.log(err);
			var edits = new Edits({
				description: req.body.description,
				editor: req.session.userName,
				dateEdited: Date.now,
				oldArtifact: artifact.id,
				newArtifact: arti.id,
				approved: false
			});
			edits.save();
		});
	});

	return res.redirect('/u');
};

/* Used when approving denying artifact edits
 * Approved: new arifact gets uploaded, old artifact is moved to logs
 * Rejected: new artifact is deleted, old artifact doesn't change
 */
var editArtifact = function (req, res) {
	var editID = req.params.edits;
	Edits.findById(editID, function (err, edit) {
		if (err) return console.log(err);

		var artifactID = edit.oldArtifact;
		var newartifactID = edit.newArtifact;

		// If the edits have been approved, the make the changes
		if (req.body.approval /* approved */) {
			edit.approved = true;

			Artifact.findById(artifactID, function (err, artifact) {
				if (err) return console.log(err);
				// Place the old artifact into logs, to keep track of changes
				var oldArti = new OldArtifact(artifact);
				oldArti.save();

				// Replace all the fields of the original artifact with the new info
				// Deletes the temp artifact
				Artifact.findOneAndDelete(
					{ '_id': newartifactID },
					function (err, newartifact) {
						if (err) return console.log(err);

						artifact.name = newartifact.name;
						artifact.description = newartifact.description;
						artifact.tags = newartifact.tags;	// Might need changes to this (array probs amirite)
						artifact.placeOrigin = newartifact.placeOrigin;
						artifact.year = newartifact.year;
						artifact.editor = edit.editor;
						artifact.dateEdited = edit.dateEdited;
					});
				artifact.save();
			});

		// If the changes are rejected, delete the temp artifact
		} else {
			edit.approval = true;
			edit.rejected = true;

			Artifact.findOneAndDelete({ '_id': newartifactID });
		};
		edit.save();
	});
};

module.exports.groupArtifacts = groupArtifacts;
module.exports.addArtifact = addArtifact;
module.exports.getArtifact = getArtifact;
module.exports.suggestEdits = suggestEdits;
module.exports.editArtifact = editArtifact;
