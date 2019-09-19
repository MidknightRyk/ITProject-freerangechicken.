var mongoose = require('mongoose');
var storage = require('sessionstorage');
var Issue = mongoose.model('Issue');
var Comment = mongoose.model('Comment');
var ObjectId = require('mongodb').ObjectID;

// Adds Issue to an artifact, ensure that the session storage has the artifactID
var addIssue = function (req, res) {
	var issue = new Issue({
		'topic': req.body.topic,
		'author': req.session.username,
		'artifactID': storage.artifactId,
		'content': req.body.description
	});

	return issue.save()
		.then(() => res.redirect('/issue/:issue'));
};

var addComment = function (req, res) {
	var issueID = req.params.issue;

	var comment = new Comment({
		'author': req.session.username,
		'content': req.body.comment
	});

	Issue.findOneAndUpdate(
		{ '_id': issueID.toString() },
		{ $push: { 'comments': comment } }
	);
};

var getIssue = function (req, res) {
	Issue.findById(ObjectId(req.params.issue))
};

var closeIssue = function (req, res) {

};

var editIssue = function (req, res) {

};

module.exports.addIssue = addIssue;
module.exports.addComment = addComment;
module.export.getIssue = getIssue;
module.export.closeIssue = closeIssue;
module.export.editIssue = editIssue;
