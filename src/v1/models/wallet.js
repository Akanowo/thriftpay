const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const walletSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	account: {
		type: Types.ObjectId,
		required: true,
	},
	user: {
		type: Types.ObjectId,
		required: true,
		ref: 'User'
	},
	balance: {
		type: Number,
		default: 30000.0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Wallet = model('Wallet', walletSchema);

module.exports = Wallet;
