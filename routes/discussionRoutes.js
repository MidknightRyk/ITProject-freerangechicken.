var express = require('express');
var router = express.Router();
var path = require('path');
var discussionController = require('../controllers/discussionController.js');

// GET requests
// Create Issue page
router.get('/createIssue', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/addArtifact.html'));
});

// Get Issue Page
router.get('/issue/:issue', discussionController.getIssue);

// Do we need a page for closing issues?

// POST requests
// Add Issue to Disscussion Board
router.post('/createIssue', discussionController.addIssue);

module.exports = router;
