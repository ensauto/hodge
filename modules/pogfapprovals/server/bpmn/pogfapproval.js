var mongoose = require('mongoose'),
Uploadfile = mongoose.model('Uploadfile');
exports.start = function(data, done) {
	done(data);
};

exports.draft = function(data, done) {
	this.setProperty('users', [data.req.user._id + '']);
	this.setProperty('roles', []);
	this.setProperty('processedByUserId', data.req.user._id + '');
	this.setProperty('processedBy', data.req.user.displayName);
	this.setProperty('createdByUserId', data.req.user._id + '');
	this.setProperty('createdBy', data.req.user.displayName);
	this.setProperty('task', 'draft');
	this.setProperty('status', 'not submitted');
	done(data);
};

exports.draftDone = function(data, done) {
	done(data);
}

exports.approval = function(data, done) {
	this.setProperty('users', []);
	this.setProperty('roles', ['admin', 'ogfapprover']);
	this.setProperty('processedByUserId', data.req.user._id);
	this.setProperty('processedBy', data.req.user.displayName);
	this.setProperty('task', 'approval');
	this.setProperty('status', 'awaiting approval');
	done(data);
};

exports.approvalDone = function(data, done) {
	done(data);
};

exports.is_approved_ = function(data, done) {
	// Called after MyEnd has been reached
	done(data);
};

exports.is_approved_$ok = function(data, done) {
	// Called after MyEnd has been reached
	return data.req.body.approval === 'approved';
};

exports.is_approved_$nok = function(data, done) {
	// Called after MyEnd has been reached
	return data.req.body.approval === 'rejected';
};

exports.approved = function(data, done) {
	// Called after MyEnd has been reached
	this.setProperty('task', 'approved');
	var users = [this.getProperty('createdBy')];
	this.setProperty('users', users);
	this.setProperty('status', 'approved');
	var req = data.req;
	Uploadfile.update({processId: req.pogfapproval._id + ''}, {$set: { openAccess: true }}).exec(function(err){
		done(data);	
	});
};

exports.approvedDone = function(data, done) {
	done(data)
}

exports.rejected = function(data, done) {
	// Called after MyEnd has been reached
	this.setProperty('task', 'rejected');
	var users = [this.getProperty('createdBy')];
	this.setProperty('users', users);
	this.setProperty('status', 'rejected');
	done(data);
};

exports.rejectedDone = function(data, done) {
	done(data);
}

exports.end = function(data, done) {
	done(data);
};