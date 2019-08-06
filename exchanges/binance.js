var sync = require('./utils').sync
const currency_converter = require('../currency_converter')

const markets = ['BTC', 'ETH', 'BNB', 'USDT']

var prices = {}
var lastUpdated = null

function init() {
	sync('https://api.binance.com/api/v3/ticker/price', 'Binance', responseHandler)
}

async function responseHandler(allResponse) {
	allResponse.forEach((response) => {
		//Check for market
		var coinName = ''
		var marketName = ''
		const price = parseFloat(response.price)
		markets.forEach((market) => {
			if (response.symbol.indexOf(market) > 0) {
				//This market exists in symbol
				coinName = response.symbol.split(market)[0]
				marketName = market
			}
		})
		if (!prices.hasOwnProperty(marketName)) {
			prices[marketName] = {}
		}
		prices[marketName][coinName] = {
			buy: price, sell: price
		}
		//Convert usdt to inr as well
		if (marketName === 'USDT') {
			prices['INR'] = {}
			prices['INR'][coinName] = {
				buy: currency_converter.convertUSDToINR(price),
				sell: currency_converter.convertUSDToINR(price)
			}
		}
	})
	lastUpdated = new Date()
}

module.exports = {
	init,
	prices,
	lastUpdated
};
