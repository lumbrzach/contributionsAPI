const D = require('./getGaSenator');
const isolateOfficialLastName = D.isolateOfficialLastName;
const assignMaplightID = D.assignMaplightID;
const assignAverage = D.assignAverage;
const assignAggregate = D.assignAggregate;
const assignMaplightData = D.assignMaplightData;
const getIndividualTransactions = D.getIndividualTransactions;
const getMinTransaction = D.getMinTransaction;
const getMaxTransaction = D.getMaxTransaction;
const getContribData = D.getContribData;

test('the finalData object is returned and has appropriate keys', async () => {
  const finalData = await getContribData();
  expect(finalData).toHaveProperty('democrat');
});
