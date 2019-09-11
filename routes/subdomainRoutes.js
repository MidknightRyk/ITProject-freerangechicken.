const express = require('express');
var router = express.Router();
var path = require('path');

// admin specific routes
router.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/../views/adminPage.html'));
});

// prob need a subdomain controller too

module.exports = router;
