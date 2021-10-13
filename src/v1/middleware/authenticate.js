const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

const authenticate = (req, res, next) => {
	let error;

	const { authorization } = req.headers;
	if (!authorization) {
		error = new ErrorResponse('authentication is required', 401);
		return next(error);
	}

	const token = authorization.split(' ')[1];
	if (!token) {
		error = new ErrorResponse('missing token', 401);
		return next(error);
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
		if (err) {
			error = new ErrorResponse(err.message, 401);
			return next(error);
		}

		req.user_id = payload.user_id;
		next();
	});
};

module.exports = authenticate;
