var storage = require('sessionstorage');
var mongoose = require('mongoose');
var path = require('path');
var Artifact = mongoose.model('Artifact');
var Issue = mongoose.model('Issue');
var User = mongoose.model('User');
var Edits = mongoose.model('Edits');

// Creates a new artifact
var addArtifact = function (req, res) {
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
	res.redirect(307, '/images/upload-images');
};

// Gets a single artifact by id
var getArtifact = function (req, res) {
	var artifactID = req.params.artifact;
	var userID = (req.session.user);
	User.findById(userID).exec((err, user) => {
		if (err) return console.log(err);
		Artifact.findById(artifactID, function (err, artifact) {
			if (err) return console.log(err);
			storage.artifactId = artifact.id;
			Issue.find({'artifactID': artifact.id}).deepPopulate('authorID comments comments.authorID').exec(function (err, issues) {
				if (err) return console.log(err);
				return res.render(path.join(__dirname, '../views/artifact/artifact.pug'),
					{ user: user, artifact: artifact, issues: issues }
				);
			});
			// idk the path for this cause we don't have a page for this yet
		});
	});
};

// Gets all artifacts with requested tag
var getTag = function (req, res) {
	var tag = req.params.tag;
	var userID = (req.session.user);
	User.findById(userID).exec((err, user) => {
		if (err) return console.log(err);
		Artifact.find({ 'tags': { $elemMatch: tag } }, function (err, artifacts) {
			if (err) return console.log(err);
			return res.render(path.join(__dirname, '../views/artifact/tag.pug'),
				{user: user, artifacts: artifacts});
			// idk the path for this cause we don't have a page for this yet
		});
	});
};

/* Used to make edits for approval
 * Creates a new artifact with all the edited values,
 * assigns it to a edit suggestion doc.
 */

// Flags Artifact for deletion by submitting a ticket
var deleteArtifact = function (req, res) {
	// If suggesting deletion
	var artifactID = storage.artifactId;
	console.log('deleting artifact: ' + artifactID);
	var edits = new Edits({
		description: req.body.editDescription,
		editor: req.session.userName,
		oldArtifact: artifactID,
		deletion: true,
		approved: false
	});
	edits.save();
	console.log(edits);
	res.redirect('/catalogue');
};

// Creates a duplicate artifact for edits and stores old and new into a ticket
var cloneArtifact = function (req, res) {
	var artifactID = storage.artifactId;
	Artifact.findById(artifactID)
	.exec(function (err, artifact) {
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
		var editID = editedArtifact._id;
		storage.artifactId = editID;
		var edits = new Edits({
			// description: req.body.editDescription,
			editor: req.session.userName,
			oldArtifact: artifactID,
			newArtifact: editID,
			approved: false
		});
		edits.save();
		storage.ticketId = edits._id;
		return res.render(path.join(__dirname, '../views/edit-artifact/edit-artifact.pug'),
			{artifact: editedArtifact});
	});
};

var cancelEdits = function (req, res) {
	// Delete the clone
	Artifact.findByIdAndDelete(storage.artifactId);

	// Delete the ticket created and replace the storage id with the original artifact id
	Edits.findByIdAndDelete(storage.ticketId)
	.exec(function (err, edits) {
		if (err) return console.log(err);
		storage.artifactId = edits.oldArtifact;
	});
	return res.redirect('/artifacts/' + storage.artifactId.toString());
};

var editArtifact = function (req, res) {
	console.log(req.files);
	console.log(req.body);
	Edits.findById(storage.ticketId, function (err, ticket) {
		console.log('edits being sent according to: ' + ticket);
		if (err) return console.log(err);
		ticket.description = req.body.ticketDescription;
		Artifact.findById(ticket.newArtifact, function (err, artifact) {
			if (err) return console.log(err);
			artifact.name = req.body.name || artifact.name;
			artifact.description = req.body.description || artifact.description;
			// artifact.tags = (req.body.tag).split(',') || artifact.tags;
			artifact.placeOrigin = req.body.country || artifact.placeOrigin;
			artifact.year = req.body.year || artifact.year;
			artifact.save();
		});
		ticket.save();
	});
	// res.redirect(307, '/images/upload-images');
};

module.exports.addArtifact = addArtifact;
module.exports.getArtifact = getArtifact;
module.exports.getTag = getTag;
module.exports.deleteArtifact = deleteArtifact;
module.exports.cloneArtifact = cloneArtifact;
module.exports.cancelEdits = cancelEdits;
module.exports.editArtifact = editArtifact;
