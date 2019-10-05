var mongoose = require('mongoose');
var storage = require('sessionstorage');
var path = require('path');
var User = mongoose.model('User');
var Issue = mongoose.model('Issue');
var Comment = mongoose.model('Comment');
var ObjectId = mongoose.Types.ObjectId;

// Adds Issue to an artifact - ensure that the session storage has the artifactID
var addIssue = function (req, res) {
	var issue = new Issue({
		'topic': req.body.topic,
		'author': req.session.userName,
		'authorID': req.session.user,
		'artifactID': storage.artifactId || ObjectId(req.body.artifactId),
		'content': req.body.description,
		'closed': false
	});

	return issue.save()
		.then(() => res.redirect('/discussion-board/'));
};

// Add comment to issue from params
var addComment = function (req, res) {
	var issueID = req.params.issue;
	console.log(issueID);
	var comment = new Comment({
		'author': req.session.userName,
		'authorID': req.session.user,
		'content': req.body.comment
	});

	comment.save();

	Issue.findOneAndUpdate(
		{ '_id': ObjectId(issueID) },
		{ $push: { 'comments': comment._id } }
	);
	res.redirect('/discussionBoard/' + issueID);
};

// Render issue details page
var getIssue = function (req, res) {
	var issueID = req.params.issue;
	var userID = req.session.user;
	User.findById(userID).exec((err, user) => {
		if (err) return console.log(err);
		Issue.findById(ObjectId(issueID))
		.deepPopulate('authorID comments comments.authorID')
		.exec(function (err, issue) {
			if (err) return console.log(err);
			// idk the path for this cause we don't have a page for this yet
			return res.render(path.join(__dirname, '../views/discussion-board/issue-details-page.pug'),
				{ user: user, issue: issue }
			);
		});
			// { issue: issue, comment: [issue.comments] }
	});
};

// Close issues that are resolved OR reopen issues that need to be revisited
var reIssue = function (req, res) {
	var issueID = req.body.issueId || req.query.issueId;
	Issue.findOneAndUpdate(
		{ '_id': ObjectId(issueID) },
		{ 'closed': !'closed' }
	);
};

// Only editable fields: Title and description
var editIssue = function (req, res) {
	var issueID = req.params.issue;
	Issue.findById(ObjectId(issueID))
	.exec(function (err, issue) {
		if (err) return console.log(err);
		if ((req.session.userType === 'admin') ||
		(req.session.user === issue.authorID)) {
			issue.topic = req.body.newTopic;
			issue.content = req.body.newContent;
		} else {
			// Only admin/issue author allowed to edit issues
			return res.redirect('/no-access');
		}
	});
};

module.exports.addIssue = addIssue;
module.exports.addComment = addComment;
module.exports.getIssue = getIssue;
module.exports.reIssue = reIssue;
module.exports.editIssue = editIssue;
