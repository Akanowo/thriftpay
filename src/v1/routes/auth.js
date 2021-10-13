const router = require('express').Router();
const controller = require('../controllers/auth');

const routes = () => {
	// destructure controllers
	const { handleLogin, handleRegistration, handleAccountVerification } =
		controller;

	router.route('/login').post(handleLogin);

	router.route('/register').post(handleRegistration);
	router.route('/validate-otp').post(handleAccountVerification);

	return router;
};

module.exports = routes;
