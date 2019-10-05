var express = require('express');
var router = express.Router();
var path = require('path');
var discussionController = require('../controllers/discussionController.js');

/* Currently untested */

/* GET requests */

// Discussion forum page
router.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/discussion-board/discussion-forum-main.html'));
});

// Create Issue page
/* Currently leads to a new page, but i think it's not supposed to?
 */
router.get('/create-issue', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/discussion-board/start-new-issue.html'));
});

/* !!!! ATTENTION: Add new get pages before this comment !!!
 * If you do not heed the warning,
 * you gon objectid error
 * YOU HAVE BEEN WARNED
*/

// Get Issue Page
router.get('/:issue', discussionController.getIssue);

// ????????? Do we need a page for closing issues ??????????

/* POST requests */

// Add Issue to Disscussion Board
router.post('/create-issue', discussionController.addIssue);

// Edits existing issue
router.post('/edit-issue', discussionController.editIssue);

// Toggles the issue's 'resolved' status
router.post('/re-issue', discussionController.reIssue);

module.exports = router;
