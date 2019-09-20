var express = require('express');
var router = express.Router();
var path = require('path');
var artifactController = require('../controllers/artifactController.js');

// Routes for Artifacts

// Artifacts
// Get artifacts by id
router.get('/:artifact', artifactController.getArtifact);

// Get add Artifact page
router.get('/addArtifact', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/addArtifact.html'));
});

// POST requests

// Artifacts
// Add Artifact
router.post('/addArtifact', artifactController.addArtifact);

// Suggest Edits for artifacts
router.post('/editArtifact', artifactController.suggestEdits);

// Approve Edits for artifacts
// ** needs edit ticket id in params **
router.post('/approveArtifacts', artifactController.editArtifact);

module.exports = router;
