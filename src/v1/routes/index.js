const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const authRouter = require('./auth');
const profileRouter = require('./profile');
const walletRouter = require('./wallet');
const webhook = require('./webhook');

router.use('/auth', authRouter());
router.use('/profile', authenticate, profileRouter());
router.use('/wallet', authenticate, walletRouter());
router.use('/webhook', webhook());

router.use('/', (req, res, next) => {
	return res.status(200).json({
		status: true,
		message: 'welcome to v1 api',
	});
});

module.exports = router;
