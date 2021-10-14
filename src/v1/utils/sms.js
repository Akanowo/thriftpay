
const axios = require('axios');
const ErrorResponse = require('./errorResponse');

const username = 'sanbox';
const endpoint = '/v1/africastalking/version1/messaging';
const config = {
    headers: {
        'sandbox-key': process.env.SANDBOX_KEY,
    },
};

class SMS {
    constructor(phone, content) {
        this.phone = phone;
        this.content = content;

        // const data = {
        //     username,
        //     to: phone,
        //     message: `To verify your phone number, please use this OTP: ${otp}`,
        // };
    }

    SendOtp() { }

    async TransferSuccessMessage() {
        const successData = {
            username,
            to: this.phone,
            message: this.content
        }

        const response = await axios.post(
            `${process.env.BASE_URL}${endpoint}`,
            successData,
            config
        );


        if (response.data.SMSMessageData.Recipients[0].statusCode === 101) {
			console.log(response.data);
			return {
				status: true,
				message: 'otp sent',
			};
		}

		if (response.data.SMSMessageData.Recipients[0].statusCode === 403) {
			console.log(response.data);
			error = new ErrorResponse(
				'invalid phone number',
				response.data.SMSMessageData.Recipients[0].statusCode
			);

			throw error;
		}
    }
}

module.exports = SMS