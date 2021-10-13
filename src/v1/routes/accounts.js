const router = require('express').Router();
const controller = require('../controllers/account');

const routes = () => {
	// destructure controllers
	const { topUp } = controller;

	router.route('/topUp').post(topUp);

	return router;
};

module.exports = routes;
