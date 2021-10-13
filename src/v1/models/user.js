const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
	email: {
		type: String,
		match: [
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please enter a valid email address',
		],
	},
	password: {
		type: String,
		required: [1, 'passowrd is required'],
	},
	firstname: {
		type: String,
		required: [1, 'first name is required'],
		match: [/^[a-z ,.'-]+$/i, 'format not valid'],
	},
	lastname: {
		type: String,
		required: [1, 'last name is required'],
		match: [/^[a-z ,.'-]+$/i, 'format not valid'],
	},
	phone: {
		type: String,
		required: [1, 'phone number is required'],
		unique: true,
	},
	dob: String,
	status: {
		type: String,
		enum: ['active', 'inactive'],
		default: 'inactive',
	},
});

const User = model('User', userSchema);

module.exports = User;
