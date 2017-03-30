exports.start = function(data, done) {
	done(data);
	//console.log(Date.now()+'');
	//this.setProperty('createdDate', Date.now());
};

exports.draft = function(data, done) {
	this.setProperty('users', [data.req.user._id + '']);
	this.setProperty('roles', []);
	this.setProperty('lastUser', data.req.user._id + '');
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
	this.setProperty('lastUser', data.req.user._id);
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
	console.log(data.req.user._id+"");
	console.log('ok');
	console.log('approval status' + data.req.body.approval);
	return data.req.body.approval === 'approved';
};

exports.is_approved_$nok = function(data, done) {
	// Called after MyEnd has been reached
	console.log('nok');
	console.log('approval status' + data.req.body.approval);
	return data.req.body.approval === 'rejected';
};

exports.approved = function(data, done) {
	// Called after MyEnd has been reached
	console.log('approved');
	this.setProperty('task', 'approved');
	var users = [this.getProperty('createdBy')];
	this.setProperty('users', users);
	this.setProperty('status', 'approved');
	done(data);
};

exports.approvedDone = function(data, done) {
	console.log('approvedDone');
	done(data)
}

exports.rejected = function(data, done) {
	// Called after MyEnd has been reached
	console.log('rejected')
	this.setProperty('task', 'rejected');
	var users = [this.getProperty('createdBy')];
	this.setProperty('users', users);
	this.setProperty('status', 'rejected');
	done(data);
};

exports.rejectedDone = function(data, done) {
	console.log('rejectedDone');
	done(data);
}

exports.end = function(data, done) {
	done(data);
};