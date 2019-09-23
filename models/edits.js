var mongoose = require('mongoose');
var editsSchema = mongoose.Schema(
	{
		description: String,	// Used to describe the changes
		editor: String,
		dateEdited: Date,
		oldArtifact: { type: mongoose.Schema.Types.ObjectId, ref: 'Artifact' },
		newArtifact: { type: mongoose.Schema.Types.ObjectId, ref: 'Artifact' },
		approved: Boolean,
		rejected: Boolean
	}
);

mongoose.model('Edits', editsSchema);
