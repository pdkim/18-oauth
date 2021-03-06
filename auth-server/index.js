'use strict';

require('dotenv').config();
require('babel-register');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOD_URI);

require('./src/app.js').start(process.env.PORT);