const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const vAccountSchema = new Schema({
	vnuban: String,
	bank_name: String,
	bank_code: String,
	id: Number,
	expires_on: Number,
	use_frequency: Number,
	max_amount: Number,
	min_amount: Number,
	callback_url: String,
	meta_data: Object,
	merchantId: Number,
	status: String,
	currency: String,
	used: Number,
	is_test: Number,
	destination_nuban: String,
	destination_nuban_bank_code: String,
	account_name: String,
	account_email: String,
	account_mobile_number: String,
	account_reference: String,
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	user: Types.ObjectId,
	custom_acc_number: String,
});

const VAccount = model('VAccount', vAccountSchema);

module.exports = VAccount;
