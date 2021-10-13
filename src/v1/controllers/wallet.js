const asyncHandler = require('../middleware/asyncHanlder');
const User = require('../models/user');
const Wallet = require('../models/wallet');

const controllers = () => {
	const transfer = asyncHandler(async (req, res, next) => {
		const { user_id } = req;

		const user = await User.findOne({ _id: user_id, status: 'active' });

		if (user) {
			
            const update = {
                $set: {
                    balance: req.body.transferAmount
                }
            }
            const result = await Wallet.findOneAndUpdate({user: req.body.receipient_id}, update, {new: true}).lean().exec();

            return res.status(200).json({result});
		}
	});

	return {
		transfer,
	};
};

module.exports = controllers();
