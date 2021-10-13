const router = require('express').Router();
const controller = require('../controllers/profile');

const routes = () => {
	// destructure controllers
	const { getProfile } = controller;

	router.route('/').get(getProfile);

	return router;
};

module.exports = routes;
