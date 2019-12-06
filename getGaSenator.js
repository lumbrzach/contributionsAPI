const axios = require('axios');

////////////// GLOBAL VARIABLES FOR ENDPOINTS //////////////////////////////////

const GOOGLE_API_KEY = 'AIzaSyDeF1ABV2BiaF7daEYxjMdXpaqRag-UnV0';
const GOOGLE_TEST_URL = `https://www.googleapis.com/civicinfo/v2/voterinfo?address=3066%20Valley%20Cir%2C%20Decatur%2C%20GA%2030033&electionId=2000&fields=contests&key=${GOOGLE_API_KEY}`;
const MAPLIGHT_NAMES_URL =
  'https://api.maplight.org/maplight-api/fec/candidate_names/';
const MAPLIGHT_CONTRIBUTIONS_BY_ID =
  'https://api.maplight.org/maplight-api/fec/contributions?election_cycle=2014&candidate_mlid=';

////////////// GLOBAL VARIABLES FOR DATA MANIPULATIPON //////////////////////////

let nunnLast = '';
let swaffordLast = '';
let perdueLast = '';
let officials = [];
let nunnID = '';
let swafID = '';
let perdueID = '';
let nunnData = '';
let swafData = '';
let perdueData = '';
let nunnTransactions = '';
let swafTransactions = '';
let perdueTransactions = '';
let finalData = {
  republican: {
    aggregate: null,
    average: null,
    min: null,
    max: null
  },
  democrat: {
    aggregate: null,
    average: null,
    min: null,
    max: null
  },
  libertarian: {
    aggregate: null,
    average: null,
    min: null,
    max: null
  }
};

/////////////////// MASTER FCN /////////////////////////////////////////////

const getContribData = async () => {
  try {
    //Get list of officials
    const response = await axios.get(GOOGLE_TEST_URL);
    //Narrow down to Senatorial Election
    officials = response.data.contests[0].candidates;
    await isolateOfficialLastName();
    const nameArray = await axios.all([
      axios.get(MAPLIGHT_NAMES_URL + nunnLast),
      axios.get(MAPLIGHT_NAMES_URL + swaffordLast),
      axios.get(MAPLIGHT_NAMES_URL + perdueLast)
    ]);
    await assignMaplightID(nameArray);
    const contribData = await axios.all([
      axios.get(MAPLIGHT_CONTRIBUTIONS_BY_ID + nunnID),
      axios.get(MAPLIGHT_CONTRIBUTIONS_BY_ID + swafID),
      axios.get(MAPLIGHT_CONTRIBUTIONS_BY_ID + perdueID)
    ]);
    await assignMaplightData(contribData);
    await assignAggregate();
    await assignAverage();
    await getIndividualTransactions();
    await getMinTransaction();
    await getMaxTransaction();
    return finalData;
  } catch (err) {
    console.log('OHHH NOO', err);
  }
};

//////////////////////// HELPER FCNS /////////////////////////////////////////

const getMaxTransaction = async () => {
  // Get max transaction amound and assign to final data structure
  finalData.democrat.max = Math.max(...nunnTransactions);
  finalData.republican.max = Math.max(...perdueTransactions);
  finalData.libertarian.max = Math.max(...swafTransactions);
};

const getMinTransaction = async () => {
  // Get min transaction amound and assign to final data structure
  finalData.democrat.min = Math.min(...nunnTransactions);
  finalData.republican.min = Math.min(...perdueTransactions);
  finalData.libertarian.min = Math.min(...swafTransactions);
};

const getIndividualTransactions = async () => {
  // Isolate individal transactions and assign to global variable
  nunnTransactions = nunnData.rows.map(
    transaction => transaction.TransactionAmount
  );
  swafTransactions = swafData.rows.map(
    transaction => transaction.TransactionAmount
  );
  perdueTransactions = perdueData.rows.map(
    transaction => transaction.TransactionAmount
  );
};

const assignMaplightData = async arr => {
  // Assign Maplight contribution data to relevant global variables
  nunnData = arr[0].data.data;
  swafData = arr[1].data.data;
  perdueData = arr[2].data.data;
};

const assignAggregate = async () => {
  // Isolate aggregate contrib data and assign to final data structure
  finalData.republican.aggregate = perdueData.aggregate_totals[0].total_amount;
  finalData.democrat.aggregate = nunnData.aggregate_totals[0].total_amount;
  finalData.libertarian.aggregate = swafData.aggregate_totals[0].total_amount;
};

const assignAverage = async () => {
  // Compute average contrib data and assign to final data structure
  finalData.republican.average = Math.round(
    perdueData.aggregate_totals[0].total_amount /
      perdueData.aggregate_totals[0].contributions
  );
  finalData.democrat.average = Math.round(
    nunnData.aggregate_totals[0].total_amount /
      nunnData.aggregate_totals[0].contributions
  );
  finalData.libertarian.average = Math.round(
    swafData.aggregate_totals[0].total_amount /
      swafData.aggregate_totals[0].contributions
  );
};

const assignMaplightID = async arr => {
  // Assign Maplight ID to global variables
  nunnID = arr[0].data.data.candidate_names[0].CandidateMaplightID;
  swafID = arr[1].data.data.candidate_names[0].CandidateMaplightID;
  perdueID = arr[2].data.data.candidate_names[0].CandidateMaplightID;
};

const isolateOfficialLastName = async () => {
  // Isolate last names for Maplight lookup and assign to global variables
  nunnLast = officials[0].name.split(' ')[2];
  swaffordLast = officials[1].name.split(' ')[2];
  perdueLast = officials[2].name.split(' ')[2];
};

const getOfficialInfo = async () => {
  return officials;
};

module.exports = {
  isolateOfficialLastName,
  assignMaplightID,
  assignAverage,
  assignAggregate,
  assignMaplightData,
  getIndividualTransactions,
  getMinTransaction,
  getMaxTransaction,
  getOfficialInfo,
  getContribData
};
