var mongoose = require('mongoose');
var commentSchema = mongoose.Schema(
	{
		date: { type: Date, default: Date.now },
		author: String,
		authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		content: String
	}
);

mongoose.model('Comment', commentSchema);
