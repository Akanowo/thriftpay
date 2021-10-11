const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config({ path: './src/v1/config/.env' });
const colors = require('colors');
const errorHandler = require('./src/v1/middleware/errorHandler');

// api import
const v1Api = require('./src/v1/routes');

const PORT = process.env.PORT || 3000;

const app = express();

// app config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// helmet config
if (process.env.NODE_ENV === 'production') {
	app.use(helmet());
}

app.use(function (req, res, next) {
	res.header('X-XSS-Protection', 0);
	next();
});

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
