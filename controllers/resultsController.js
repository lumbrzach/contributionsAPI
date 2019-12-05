// const Results = require('./../models/resultsModel');
const getGaSenator = require('./../getGaSenator');
const getContribData = getGaSenator.getContribData;

exports.getResults = async (req, resp) => {
  const results = await getContribData();
  try {
    resp.status(200).json({
      status: 'success',
      data: {
        results
      }
    });
  } catch (err) {
    resp.status(500).json({
      status: 'fail',
      message: err
    });
  }
};
