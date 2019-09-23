var mongoose = require('mongoose');
var commentSchema = mongoose.Schema(
	{
		date: { type: Date, default: Date.now },
		author: String,
		content: String
	}
);

mongoose.model('Comment', commentSchema);
