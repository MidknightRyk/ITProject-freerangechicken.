var express = require('express');
var router = express.Router();
var path = require('path');
var discussionController = require('../controllers/discussionController.js');

/* Currently untested and standalone */

/* GET requests */

// Create Issue page
/* Currently will lead to add artifact page,
 * will change when the required pages are ready
 */
router.get('/createIssue', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/addArtifact.html'));
});

/* !!!! ATTENTION: Add new get pages before this comment !!!
 * If you do not heed the warning,
 * you gon objectid error
 * YOU HAVE BEEN WARNED
*/

// Get Issue Page
router.get('/issue/:issue', discussionController.getIssue);

// ????????? Do we need a page for closing issues ??????????

/* POST requests */

// Add Issue to Disscussion Board
router.post('/createIssue', discussionController.addIssue);

module.exports = router;
