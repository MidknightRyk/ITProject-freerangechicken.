var mongoose = require('mongoose');
var imageSchema = mongoose.Schema(
	{
		name: String,
		data: Buffer,
		artifactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artifact' },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		contentType: String,
		usage: String
	}, {timestamps: true}
);

mongoose.model('Image', imageSchema);
