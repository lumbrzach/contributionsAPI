const express = require('express');

const { getResults } = require('./../controllers/resultsController');

const router = express.Router();

router.route('/').get(getResults);

module.exports = router;
