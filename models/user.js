var mongoose = require('mongoose');
var crypto = require('crypto');
var userSchema = mongoose.Schema(
	{
		username: String,
		email: String,
		hash: String,
		salt: String,
		admin: Boolean,
		approved: Boolean,
		dateJoined: { type: Date, default: Date.now },
		relationship: String,
		artifacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artifact' }]
	}
);

userSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function (password) {
	const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
	return this.hash === hash;
};

mongoose.model('User', userSchema);
