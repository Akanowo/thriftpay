const axios = require('axios').default;
const Otp = require('../models/otp');
const ErrorResponse = require('./errorResponse');
const moment = require('moment');

const generateOTP = () => {
	const digits = '0123456789';
	let OTP = '';
	for (let i = 0; i < 4; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}
	return OTP;
};

const sendOtp = async (phone, type, user_id, res, next) => {
	// generate and save new otp
	const otp = generateOTP();

	const savedOtpData = await Otp.create({ otp, type, user_id });
	let error;

	if (savedOtpData) {
		const endpoint = '/v1/africastalking/version1/messaging';
		const config = {
			headers: {
				'sandbox-key': process.env.SANDBOX_KEY,
			},
		};

		const data = {
			username: 'sanbox',
			to: phone,
			message: `To verify your phone number, please use this OTP: ${otp}`,
		};

		let response;

		try {
			response = await axios.post(
				`${process.env.BASE_URL}${endpoint}`,
				data,
				config
			);
		} catch (error) {
			return next(error);
		}

		if (response.data.SMSMessageData.Recipients[0].statusCode === 101) {
			console.log(response.data);
			return res.status(201).json({
				status: true,
				message: 'otp sent',
			});
		}

		if (response.data.SMSMessageData.Recipients[0].statusCode === 403) {
			console.log(response.data);
			error = new ErrorResponse(
				'invalid phone number',
				response.data.SMSMessageData.Recipients[0].statusCode
			);
			return next(error);
		}

		error = new ErrorResponse(
			response.data.SMSMessageData.Recipients[0].status,
			response.data.SMSMessageData.Recipients[0].statusCode
		);
		return next(error);
	}
};

const validateOTP = (date) => {
	const a = moment(date);
	const b = moment().utc();
	const d = a.diff(b, 'minute');
	console.log(d);
	if (d > 10) {
		return false;
	}
	return true;
};

module.exports = { sendOtp, validateOTP };
