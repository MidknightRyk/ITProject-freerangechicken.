var mongoose = require('mongoose');
var crypto = require('crypto');
var userSchema = mongoose.Schema(
    {
        username: String,
        email: String,
        hash: String,
        salt: String,
        admin: Boolean,
        approved: Boolean
    }
);

userSchema.methods.setPassword = function(password) {
  this.account.salt = crypto.randomBytes(16).toString('hex');
  this.account.hash = crypto.pbkdf2Sync(password, this.account.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.account.salt, 10000, 512, 'sha512').toString('hex');
  return this.account.hash === hash;
};

mongoose.model('User',userSchema);
