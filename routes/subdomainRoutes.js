const express = require('express');
var router = express.Router();
var path = require('path');

// admin specific routes
router.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/adminPage.html'));
});

// Artifact approval page
router.get('/artifactApproval', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/artifact-approval.html'));
});

// Admin Approval Homepage
router.get('/homepage', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/request-approval.html'));
});

// prob need a subdomain controller too

module.exports = router;
