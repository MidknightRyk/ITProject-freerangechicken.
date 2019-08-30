var mongoose = require('mongoose');
var imageSchema = mongoose.Schema(
    {
      name: String,
      contentType: String,
      image: String
    }
);

mongoose.model('Image',imageSchema);
