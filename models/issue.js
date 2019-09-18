var mongoose = require('mongoose');
var issueSchema = mongoose.Schema(
	{
		topic: String,
		dateCreated: { type: Date, default: Date.now },
		author: String,
		artifactID: String,
		content: String
	}
);

mongoose.model('Issue', issueSchema);
