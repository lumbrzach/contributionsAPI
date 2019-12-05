const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const resultsRouter = require('./routes/resultsRoute');

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(cors());

app.use('/api/v1/results', resultsRouter);

module.exports = app;
