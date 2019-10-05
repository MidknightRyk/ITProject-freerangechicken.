var mongoose = require('mongoose');
var editsSchema = mongoose.Schema(
	{
		description: String,	// Used to describe the changes
		editor: String,
		dateEdited: { type: Date, default: Date.now },
		oldArtifact: { type: mongoose.Schema.Types.ObjectId, ref: 'Artifact' },
		newArtifact: { type: mongoose.Schema.Types.ObjectId, ref: 'Artifact' },
		deletion: Boolean,
		approved: Boolean,
		rejected: Boolean
	}
);

mongoose.model('Edits', editsSchema);
