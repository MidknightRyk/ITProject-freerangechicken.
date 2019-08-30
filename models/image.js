var mongoose = require('mongoose');
var imageSchema = mongoose.Schema(
    {
      name: String,
      data: Buffer,
      contentType: String
    }
);

mongoose.model('Image',imageSchema);
