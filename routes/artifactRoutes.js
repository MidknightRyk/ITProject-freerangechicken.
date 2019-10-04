var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var artifactController = require('../controllers/artifactController.js');

// Routes for Artifacts

/* GET requests */

// Add Artifact page
router.get('/addArtifact', function (req, res) {
	res.render(path.join(__dirname, '/../views/add-artifacts/add-artifact.pug'));
});

// Edit Artifact page (currently missing)
router.get('/editArtifact', function (req, res) {
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
var type = upload.array('pro-image', 5);
router.post('/addArtifact', type, artifactController.addArtifact);

// Submits ticket for edit approvals
router.post('/editArtifact', artifactController.editArtifact);

// Flag artifact for deletion (accessed from edit artifact page)
router.post('/deleteArtifact', artifactController.deleteArtifact);

/* !! The below routes are missing GET pairs delibrately !!
 * will be implemented when pages for them are implemented
 * It's also untested so ...
 * proceed w caution
 */

// Clones and creates ticket for artifact Edits
router.post('/createTicket', artifactController.cloneArtifact);

// Approve Edits for artifacts
// ** needs edit ticket id in params **
router.post('/approveEdits', artifactController.editApproval);

module.exports = router;
