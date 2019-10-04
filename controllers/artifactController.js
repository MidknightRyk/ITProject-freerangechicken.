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
	return res.redirect(307, '/images/uploadPrimaryImage');
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
 */

// Flags Artifact for deletion by submitting a ticket
var deleteArtifact = function (req, res) {
	// If suggesting deletion
	var artifactID = storage.artifactId;
	var edits = new Edits({
		description: req.body.editDescription,
		editor: req.session.userName,
		dateEdited: Date.now,
		oldArtifact: artifactID,
		deletion: true,
		approved: false
	});
	edits.save();
};

// Creates a duplicate artifact for edits and stores old and new into a ticket
var cloneArtifact = function (req, res) {
	var artifactID = storage.artifactId;
	var edits = new Edits({
		// description: req.body.editDescription,
		editor: req.session.userName,
		dateEdited: Date.now,
		oldArtifact: artifactID,
		// newArtifact: arti.id,
		approved: false
	});
	Artifact.findById(artifactID,
	function (err, artifact) {
		if (err) return console.log(err);
		var editedArtifact = new Artifact({
			'name': artifact.name,
			'description': artifact.description,
			'tags': artifact.tags,
			'placeOrigin': artifact.placeOrigin,
			'year': artifact.year,
			'primaryImage': artifact.primaryImage,
			'extraImages': artifact.extraImages,
			'approved': false
		});
		editedArtifact.save();
		artifactID = editedArtifact._id;
		edits.newArtifact = artifactID;
		storage.artifactId = artifactID;
	});
	edits.save();
	storage.ticketId = edits._id;
};

var suggestEdits = function (req, res) {
	Edits.findByOneAndUpdate(storage.ticketId, function (err, ticket) {
		if (err) return console.log(err);
		ticket.description = req.body.ticketDescription;
		Artifact.findById(ticket.newArtifact, function (err, artifact) {
			if (err) return console.log(err);
			artifact.name = req.body.name || artifact.name;
			artifact.description = req.body.description || artifact.description;
			artifact.tags = (req.body.tag).split(',') || artifact.tags;
			artifact.placeOrigin = req.body.placeOrigin || artifact.placeOrigin;
			artifact.year = req.body.year || artifact.year;
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

				// If this artifact is flagged for deletion, delete and then return.
				if (edit.deletion === true) {
					User.findOneAndUpdate(
						{ '_id': artifact.author },
						{ $pull: { 'artifacts': artifactID } }
					);
					artifact.remove();
				} else {
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
				}
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
module.exports.deleteArtifact = deleteArtifact;
module.exports.cloneArtifact = cloneArtifact;
module.exports.suggestEdits = suggestEdits;
module.exports.editArtifact = editArtifact;
