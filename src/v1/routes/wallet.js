const router = require('express').Router();
const controller = require('../controllers/wallet');

const routes = () => {
	// destructure controllers
	const { transfer } = controller;

	router
        .route('/transfer')
        .post(transfer);

	return router;
};


module.exports = routes;
