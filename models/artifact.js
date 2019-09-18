var mongoose = require('mongoose');
var artifactSchema = mongoose.Schema(
	{
		name: String,
		description: String,
		// Stores the image object id
		primaryImage: { type: String, default: null },
		extraImages: { type: [String], default: null },
		author: String,
		editor: String,
		dateCreated: { type: Date, default: Date.now },
		dateEdited: Date,
		tags: { type: [String], index: true },
		placeOrigin: { type: String, default: null },
		year: { type: Number, index: true },
		approved: Boolean
	}
);

artifactSchema.methods.editArtifact = function (username, attribute, newInfo) {
	this.attribute = newInfo;
	this.dateEdited = Date.now;
	this.editor = username;
};

mongoose.model('Artifact', artifactSchema);
