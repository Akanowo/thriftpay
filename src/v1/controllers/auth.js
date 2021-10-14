const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');
const asyncHandler = require('../middleware/asyncHanlder');
const { sendOtp, validateOTP } = require('../utils/otp');
const bcrypt = require('bcrypt');
const Otp = require('../models/otp');
const generateJwt = require('../utils/generateJwt');
const shortid = require('short-id');
const uuid = require('uuid');
const axios = require('axios').default;
const VAccount = require('../models/vaccount');
const Wallet = require('../models/wallet');

const createVAcc = async (user_data) => {
	let response;
	const endpoint = `/woven/vnubans/create_customer`;
	const config = {
		headers: {
			'sandbox-key': process.env.SANDBOX_KEY,
			'api-secret': process.env.API_SECRET,
		},
	};
	const data = {
		customer_reference: uuid.v4(),
		name: 'Thriftpay',
		email: 'ukoakanowo98@gmail.com',
		mobile_number: user_data.phone,
		use_frequency: '5',
		min_amount: 100,
		max_amount: 300000,
		callback_url: 'https://webhook.site',
		meta_data: {
			somedatakey: 'Thriftpay financial services',
		},
	};

	try {
		console.log(`${process.env.BASE_URL}${endpoint}`);
		response = await axios.post(
			`${process.env.BASE_URL}${endpoint}`,
			data,
			config
		);
	} catch (error) {
		return { status: false, error };
	}

	if (response.data.status === 'success') {
		return response.data.data;
	}
};

const controllers = () => {
	const handleLogin = asyncHandler(async (req, res, next) => {
		let error;
		const { phone, pin } = req.body;
		if (!phone || !pin) {
			const error = new ErrorResponse('missing phone or pin', 400);
			return next(error);
		}

		req.body.phone = '+234' + phone.slice(1, phone.length);

		const user = await User.findOne({
			$or: [
				{ 'agent.phone': req.body.phone },
				{ 'customer.phone': req.body.phone },
			],
			status: 'active',
		});

		console.log(user);

		if (!user) {
			error = new ErrorResponse('invalid phone number or pin', 400);
			return next(error);
		}

		if (!(await bcrypt.compare(pin, user.agent.pin || user.customer.pin))) {
			error = new ErrorResponse('invalid phone number or pin', 400);
			return next(error);
		}

		// get user's account and wallet details
		const account_details = await VAccount.findOne({ user: user._id });
		const wallet_details = await Wallet.findOne({ user: user._id });

		const access_token = generateJwt({ user_id: user._id });

		// delete user._doc.pin;

		if (user.type === 'agent') {
			delete user._doc.agent.pin;
		} else {
			delete user._doc.customer.pin;
		}

		return res.status(200).json({
			status: true,
			data: {
				message: 'login successful',
				access_token,
				user,
				account_details,
				wallet_details,
			},
		});
	});

	const handleRegistration = asyncHandler(async (req, res, next) => {
		let { type, phone } = req.body;
		let error;

		console.log(req.body);

		if (!type || !phone) {
			error = new ErrorResponse(`Missing request body`, 400);
			return next(error);
		}

		req.body.phone = '+234' + phone.slice(1, phone.length);
		console.log(req.body.phone);

		req.body.pin = await bcrypt.hash(req.body.pin, 10);

		let user_data;

		let userExists;

		if (type === 'agent') {
			userExists = await User.findOne({ 'agent.phone': req.body.phone });
			console.log(userExists);

			if (userExists) {
				error = new ErrorResponse(`user exists with that phone number`, 400);
				return next(error);
			}

			user_data = {
				type,
				agent: {
					...req.body,
					code: shortid.generate(),
				},
			};

			delete user_data.agent.type;
		} else {
			userExists = await User.findOne({ 'agent.phone': req.body.phone });

			if (userExists) {
				error = new ErrorResponse(`user exists with that phone number`, 400);
				return next(error);
			}
			user_data = {
				type,
				customer: {
					...req.body,
				},
			};
		}

		const user = await User.create(user_data);

		console.log(user);

		if (user) {
			// verify phone number
			// return sendOtp(phone, 'account activation', user._id, res, next);

			// create account with woven api
			const newVAcc = await createVAcc(req.body);
			console.log('new virtual account: ', newVAcc);

			if (!newVAcc.status) {
				error = new ErrorResponse(
					newVAcc.error.response.data.message,
					newVAcc.error.response.status
				);
				return next(error);
			}

			// edit api response
			const phoneSplit = req.body.phone.replace('+234', '');
			newVAcc.custom_acc_number = phoneSplit;
			newVAcc.account_name = `${req.body.lastname} ${req.body.firstname}`;
			newVAcc.account_email = 'ukoakanowo98@gmail.com';
			newVAcc.account_mobile_number = `${req.body.phone}`;
			newVAcc.account_reference = uuid.v4();
			newVAcc.user = user._id;

			console.log('Edited virtual account: ', newVAcc);

			// store virtual account
			const userDbVAcc = await VAccount.create(newVAcc);

			if (userDbVAcc) {
				const wallet_data = {
					name: 'Default',
					account: userDbVAcc._id,
					user: user._id,
				};

				// create wallet
				const userWallet = await Wallet.create(wallet_data);

				const access_token = generateJwt({ user_id: user._id });
				delete user._doc.pin;
				return res.status(200).json({
					status: true,
					data: {
						access_token,
						user,
						account_details: userDbVAcc,
						wallet_details: userWallet,
					},
				});
			}
		}
	});

	const handleAccountVerification = asyncHandler(async (req, res, next) => {
		const { otp } = req.body;

		console.log(req.body);

		// find otp
		const validOtp = await Otp.findOne({
			otp: Number.parseInt(otp),
			status: 'active',
		});
		if (validOtp) {
			// validate otp is valid
			if (validateOTP(validOtp.created_date)) {
				if (validOtp.type === 'account activation') {
					// update user status
					const userUpdate = await User.findByIdAndUpdate(
						validOtp.user_id,
						{ $set: { status: 'active' } },
						{ returnDocument: true }
					);
					const otpUpdate = await Otp.findByIdAndUpdate(validOtp._id, {
						$set: { status: 'expired' },
					});
					if (userUpdate) {
						const access_token = generateJwt({ user_id: userUpdate._id });
						delete userUpdate._doc.password;
						delete userUpdate._doc.pin;
						return res.status(200).json({
							status: true,
							data: {
								access_token,
								user: userUpdate,
							},
						});
					}
				}
			}

			const otpUpdate = await Otp.findByIdAndUpdate(validOtp._id, {
				$set: { status: 'expired' },
			});
			const error = new ErrorResponse('otp expired', 400);
			return next(error);
		}

		const error = new ErrorResponse('invalid otp', 400);
		return next(error);
	});

	return {
		handleLogin,
		handleRegistration,
		handleAccountVerification,
	};
};

module.exports = controllers();
