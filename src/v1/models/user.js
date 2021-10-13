const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const agentSchema = new Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	pin: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		required: true,
	},
});

const customerSchema = new Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	pin: {
		type: String,
		required: true,
		max: 6,
	},
	dob: {
		type: String,
		required: true,
	},
	agent_code: {
		type: String,
		required: true,
	},
});

const userSchema = new Schema({
	status: {
		type: String,
		enum: ['active', 'inactive'],
		default: 'inactive',
	},
	type: {
		type: String,
		enum: ['agent', 'customer'],
	},
	agent: agentSchema,
	customer: customerSchema,
});

const User = model('User', userSchema);

module.exports = User;
