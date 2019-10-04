var express = require('express');
var router = express.Router();
var path = require('path');
var artifactController = require('../controllers/artifactController.js');

// Routes for Artifacts

/* GET requests */

// Get add Artifact page
router.get('/addArtifact', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/add-artifacts/add-artifact.html'));
});

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
router.post('/addArtifact', artifactController.addArtifact);

/* !! The below routes are missing GET pairs delibrately !!
 * will be implemented when pages for them are implemented
 * It's also untested so ...
 * proceed w caution
 */

// Suggest Edits for artifacts
router.post('/editArtifact', artifactController.suggestEdits);

// Flag artifact for deletion
router.post('deleteArtifact', artifactController.deleteArtifact);

// Approve Edits for artifacts
// ** needs edit ticket id in params **
router.post('/approveEdits', artifactController.editArtifact);

module.exports = router;
