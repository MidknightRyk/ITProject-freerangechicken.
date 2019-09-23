var mongoose = require('mongoose');
var storage = require('sessionstorage');
var path = require('path');
var Issue = mongoose.model('Issue');
var Comment = mongoose.model('Comment');
var ObjectId = mongoose.Schema.Types.ObjectId;

// Adds Issue to an artifact, ensure that the session storage has the artifactID
var addIssue = function (req, res) {
	var issue = new Issue({
		'topic': req.body.topic,
		'author': req.session.userName,
		'artifactID': storage.artifactId,
		'content': req.body.description,
		'closed': false
	});

	return issue.save()
		.then(() => res.redirect('/issue/:issue'));
};

var addComment = function (req, res) {
	var issueID = req.params.issue;

	var comment = new Comment({
		'author': req.session.userName,
		'content': req.body.comment
	});

	Issue.findOneAndUpdate(
		{ '_id': ObjectId(issueID) },
		{ $push: { 'comments': comment } }
	);
};

var getIssue = function (req, res) {
	var issueID = req.params.issue;
	Issue.findById(ObjectId(issueID))
	.populate({ path: 'comments', model: Comment })
	.exec(function (err, issue) {
		if (err) return console.log(err);
		// idk the path for this cause we don't have a page for this yet
		return res.render(path.join(__dirname, '../views/discussion-board/issue-page.pug'),
		{ issue: issue, comment: [issue.comments] }
	);
	});
};

// Close issues that are resolve, so basically like archiving?
var closeIssue = function (req, res) {
	var issueID = req.body.issueId || req.query.issueId;
	Issue.findOneAndUpdate(
		{ '_id': ObjectId(issueID) },
		{ 'closed': true }
	);
	// Remove the comment functionality for this issue
	// Also are we able to reopen issues?
};

// Only editable fields: Title?? and description
var editIssue = function (req, res) {
	var issueID = req.params.issue;
	Issue.findOneAndUpdate(
		{ '_id': ObjectId(issueID) },
		{ 'topic': req.body.newTopic, 'content': req.body.newContent }
	);
};

module.exports.addIssue = addIssue;
module.exports.addComment = addComment;
module.exports.getIssue = getIssue;
module.exports.closeIssue = closeIssue;
module.exports.editIssue = editIssue;
