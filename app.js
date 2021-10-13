const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config({ path: './src/v1/config/.env' });
const colors = require('colors');
const errorHandler = require('./src/v1/middleware/errorHandler');
const xssProtection = require('x-xss-protection');
const dbConnect = require('./src/v1/config/db');

dbConnect();

// api import
const v1Api = require('./src/v1/routes');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;

const app = express();

// app config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(xssProtection());
app.use(cookieParser());

// helmet config
if (process.env.NODE_ENV === 'production') {
	app.use(helmet());
}

// mount APIs
app.use('/api/v1', v1Api);

app.get('/*', (req, res, next) => {
	return res.status(404).json({
		status: false,
		error: 'NOT FOUND',
	});
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`App started on port ${PORT}`.yellow.bold);
});
