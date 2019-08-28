var mongoose = require('mongoose');
var artifactSchema = mongoose.Schema(
    {
      name: String,
      description: String,
      imagePath: [{
        primaryImage: String,
        extraImages: { type: [String], default: null }
      }],
      author: String,
      editor: { type: String, default: null},
      dateCreated: { type: Date, default: Date.now },
      dateEdited: {type: Date, default: null},
      tags: { type: [String], index: true },
      placeOrigin: { type: String, default: null },
      year: { type: Number, index: true },
      approved: Boolean
    }
);

artifactSchema.methods.editArtifact = function(username, attribute, newInfo) {
  this.attribute = newInfo;
  this.dateEdited = Date.now;
  this.editor = username;
};

mongoose.model('Artifact',artifactSchema);
