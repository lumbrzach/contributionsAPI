const getGaSenator = require('./../getGaSenator');
const getContribData = getGaSenator.getContribData;

const Results = getContribData();

module.exports = Results;
