const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config({ path: './src/v1/config/.env' });
const colors = require('colors');

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

app.listen(PORT, () => {
	console.log(`App started on port ${PORT}`.yellow.bold);
});
