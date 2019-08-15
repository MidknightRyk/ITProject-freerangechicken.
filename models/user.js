var mongoose = require('mongoose');
var userSchema = mongoose.Schema(
    {
        "name":String
    }
);
mongoose.model('User',userSchema);
