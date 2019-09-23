var mongoose = require('mongoose');
var issueSchema = mongoose.Schema(
	{
		topic: String,
		dateCreated: { type: Date, default: Date.now },
		author: String,
		artifactID: String,
		content: String,
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
		closed: Boolean
	}
);

mongoose.model('Issue', issueSchema);
