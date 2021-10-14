const router = require('express').Router();

const routes = () => {
	router
		.route('/')
		.get((req, res, next) => {})
		.post((req, res, next) => {
			let response;
			const { session_id, service_code, phone_number, text } = req.body;

			if (text === '') {
				response = 'CON What would you want to check \n';
				response += '1. Create Account \n';
				response += '2. Wallet to Wallet Transfer';
			}

			if (text === '1') {
				response = 'CON Choose account information you want to view \n';
				response += '1. Account number \n';
				response += '2. Account balance';
			}
		});

	return router;
};

module.exports = routes;
