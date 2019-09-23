var mongoose = require('mongoose');
var artifactSchema = mongoose.Schema(
	{
		name: String,
		description: String,
		// Stores the image object id
		primaryImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
		extraImages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
		author: String,
		editor: String,
		dateCreated: { type: Date, default: Date.now },
		dateEdited: Date,
		tags: { type: [String], index: true },
		placeOrigin: { type: String, default: null },
		year: { type: Number, index: true },
		approved: { type: Boolean, default: false }
	}
);

artifactSchema.methods.edit = function (username, attribute, newInfo) {
	this.attribute = newInfo;
	this.dateEdited = Date.now;
	this.editor = username;
};

mongoose.model('Artifact', artifactSchema, 'artifacts');
mongoose.model('OldArtifact', artifactSchema, 'artifact-logs');
