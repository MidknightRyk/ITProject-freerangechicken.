var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var artifactController = require('../controllers/artifactController.js');

// Routes for Artifacts

/* GET requests */

// Add Artifact page
router.get('/add-artifact', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/add-artifacts/add-artifact.html'));
});

// Edit Artifact page (currently missing)
router.get('/edit-artifact', artifactController.cloneArtifact);

router.get('/make-edits', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/edit-artifacts/edit-artifact.html'));
});

router.get('/delete-artifact', artifactController.deleteArtifact);
/* !!!! ATTENTION: Add new get pages before this !!!
 * If you do not heed the warning,
 * you gon objectid error
 * YOU HAVE BEEN WARNED
*/

// Get artifacts by id
// (currently broken cause there's no page to handle the data retrived)
router.get('/:artifact', artifactController.getArtifact);

/* POST requests */

// Add Artifact
var type = upload.array('pro-image', 5);
router.post('/add-artifact', type, artifactController.addArtifact);

// Submits ticket for edit approvals
router.post('/edit-artifact', type, artifactController.editArtifact);

// Deletes the ticket and clone created for the editing system
router.post('/cancel-edits', artifactController.cancelEdits);

// Flag artifact for deletion (accessed from edit artifact page)
router.post('/delete-artifact', artifactController.deleteArtifact);

// Clones and creates ticket for artifact Edits
router.post('/submit-ticket', artifactController.cloneArtifact);

module.exports = router;
