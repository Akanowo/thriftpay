const router = require('express').Router();

router.use('/', (req, res, next) => {
	return res.status(200).json({
		status: true,
		message: 'welcome to v1 api',
	});
});

module.exports = router;
