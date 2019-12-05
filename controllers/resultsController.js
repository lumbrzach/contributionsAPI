// const Results = require('./../models/resultsModel');
const getGaSenator = require('./../getGaSenator');
const getContribData = getGaSenator.getContribData;
const getOfficialInfo = getGaSenator.getOfficialInfo;

exports.getResults = async (req, resp) => {
  const results = await getContribData();
  const officials = await getOfficialInfo();
  try {
    resp.status(200).json({
      status: 'success',
      data: {
        results,
        officials
      }
    });
  } catch (err) {
    resp.status(500).json({
      status: 'fail',
      message: err
    });
  }
};
