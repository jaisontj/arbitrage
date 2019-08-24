var USD_INR = 71.80;

function convertUSDToINR(usdValue) {
  return (usdValue * USD_INR).toFixed(4);
}

module.exports = {
  convertUSDToINR
};
