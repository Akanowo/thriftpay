const asyncHandler = require('../middleware/asyncHanlder');
const User = require('../models/user');

const controllers = () => {
	const getProfile = asyncHandler(async (req, res, next) => {
		const { user_id } = req;
		const user = await User.findOne({ _id: user_id, status: 'active' });
		if (user) {
			delete user._doc.password;
			return res.status(200).json({
				status: true,
				data: user,
			});
		}
	});

	return {
		getProfile,
	};
};

module.exports = controllers();
