var USD_INR = 69.26;

function convertUSDToINR(usdValue) {
  return (usdValue * USD_INR).toFixed(2);
}

module.exports = {
  convertUSDToINR
};
