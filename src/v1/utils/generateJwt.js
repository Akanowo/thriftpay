const jwt = require('jsonwebtoken');

const generateJwt = (payload) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
	return token;
};

module.exports = generateJwt;
