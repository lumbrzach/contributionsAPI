const D = require('./getGaSenator');
const getContribData = D.getContribData;

test('the finalData object is returned and has appropriate nested objects', async () => {
  const finalData = await getContribData();
  expect(finalData).toHaveProperty('democrat');
  expect(finalData).toHaveProperty('republican');
  expect(finalData).toHaveProperty('libertarian');
});

test('the finaData object is returned and nested values are present', async () => {
  const finalData = await getContribData();
  expect(finalData.democrat.max).toBeTruthy();
  expect(finalData.libertarian.min).toBeTruthy();
  expect(finalData.republican.aggregate).toBeTruthy();
});
