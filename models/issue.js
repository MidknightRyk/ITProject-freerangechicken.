var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var issueSchema = mongoose.Schema(
	{
		topic: String,
		dateCreated: { type: Date, default: Date.now },
		author: String,
		artifactID: String,
		content: String,
		comments: [Comment]
	}
);

mongoose.model('Issue', issueSchema);
