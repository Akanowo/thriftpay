const asyncHandler = require('../middleware/asyncHanlder');
const User = require('../models/user');
const Wallet = require('../models/wallet');
const {Types} = require('mongoose');
const SMS = require('../utils/sms');

const controllers = () => {
	const transfer = asyncHandler(async (req, res, next) => {
		const { user_id } = req;

        const transferAmount = parseFloat(req.body.transferAmount);
			

            const updateReceipient = {
                $inc: {
                    balance: transferAmount,
                }
            }

            const  hostUpdate = {
                $inc: {
                    balance: -transferAmount,
                }
            };

            const select = {"agent.pin": 0, "customer.pin": 0};
            const result = await Wallet.findOneAndUpdate({user: Types.ObjectId(req.body.receipient_id)}, updateReceipient, {new: true}).populate('user', select).lean().exec();
            const result01 = await Wallet.findOneAndUpdate({user: user_id}, hostUpdate, {new: true}).populate('user', select).lean().exec();

            //TODO: Send sms when update successful
            const smsService = new SMS(result.user.customer.phone, ` You have recieved ${transferAmount} in your wallet, from ${result01.user.agent.firstname}`);

            try {
                smsService.TransferSuccessMessage();
            } catch (err) {
                return next(err)
            }

            res.status(200).json({status: true, data: {sender_wallet_update: result01, receipient_wallet: result} })
	});

	return {
		transfer,
	};
};

module.exports = controllers();
