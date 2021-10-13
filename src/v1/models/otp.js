const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const otpSchema = new Schema({
	otp: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		enum: ['account activation'],
		required: true,
	},
	user_id: {
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	},
	status: {
		type: String,
		enum: ['active', 'expired'],
		default: 'active',
	},
	created_date: {
		type: Date,
		default: Date.now,
	},
});

const Otp = model('Otp', otpSchema);

module.exports = Otp;
