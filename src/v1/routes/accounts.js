const router = require('express').Router();
const controller = require('../controllers/account');

const routes = () => {
	// destructure controllers
	const { createVAcc } = controller;

	router.route('/').get(getProfile);

	return router;
};

module.exports = routes;
