const ErrorResponse = require('../utils/errorResponse');
module.exports = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	// TODO: check error name and change error response message and code

	// default error response
	return res.status(error.statusCode || 500).json({
		status: false,
		error: error.message || 'Server Error',
	});
};
