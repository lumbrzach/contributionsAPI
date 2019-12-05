const express = require('express');
const morgan = require('morgan');

const resultsRouter = require('./routes/resultsRoute');

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Mounting Routes
app.use('/api/v1/results', resultsRouter);

module.exports = app;
