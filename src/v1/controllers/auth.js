const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');
const asyncHandler = require('../middleware/asyncHanlder');
const { sendOtp, validateOTP } = require('../utils/otp');
const bcrypt = require('bcrypt');
const Otp = require('../models/otp');
const generateJwt = require('../utils/generateJwt');

const controllers = () => {
	const handleLogin = asyncHandler(async (req, res, next) => {
		let error;
		const { phone, password } = req.body;
		if (!phone || !password) {
			const error = new ErrorResponse('missing phone or password', 400);
			return next(error);
		}

		const user = await User.findOne({ phone, status: 'active' });

		console.log(user);

		if (!user) {
			error = new ErrorResponse('invalid phone number or password', 400);
			return next(error);
		}

		if (!(await bcrypt.compare(password, user.password))) {
			error = new ErrorResponse('invalid phone number or password', 400);
			return next(error);
		}

		const access_token = generateJwt({ user_id: user._id });

		delete user._doc.password;
		return res.status(200).json({
			status: true,
			data: {
				message: 'login successful',
				access_token,
				user,
			},
		});
	});

	const handleRegistration = asyncHandler(async (req, res, next) => {
		let { phone, password } = req.body;

		if (password) {
			req.body.password = await bcrypt.hash(password, 10);
		}

		const user = await User.create(req.body);

		console.log(user);

		if (user) {
			// verify phone number
			return sendOtp(phone, 'account activation', user._id, res, next);
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
