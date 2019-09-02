var mongoose = require('mongoose');
var imageSchema = mongoose.Schema(
	{
		name: String,
		data: Buffer,
		artifactID: String,
		contentType: String
	}, {timestamps: true}
);

mongoose.model('Image', imageSchema);
