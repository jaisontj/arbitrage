const bitbnsApi = require('bitbns');

const bitbns = new bitbnsApi({
	apiKey :  process.env.BITBNS_API_KEY,
	apiSecretKey : process.env.BITBNS_SECRET_KEY
}); 

const prices = {'INR': {}};

function getPrices(market, amount) {
	return prices[market];
}

function handleOrderBookUpdate(coin, market, data) {
	prices[market][coin]['order_book'] = data
}

function openSocketToOrderBook(coin, market) {
	console.log(`Open Socket to ${coin}/${market}`)
	const socket = bitbns.getOrderBookSocket(coin, market)
	socket.on('connect', () => console.log(`Connected to socket ${coin}/${market}`))
	socket.on('news', res => {
		try {
			const data = JSON.parse(res)
			console.log(`Data Received at ${coin}/${market}`)
			console.log(data)
			handleOrderBookUpdate(coin, market, data)
		} catch (e) {
			console.log(`Error in the Stream ${coin}/${market}`, e)
			openSocketToOrderBook(coin, market)
		}
	})
	socket.on('disconnect', () => {
		console.log(`Disconnected ${coin}/${market}`)
		openSocketToOrderBook(coin, market)
	})
}

function init(){
	// get price against INR
	bitbns.getTickerApi('', function(error, response){
		allPrices = response.data
		if (response.status != 1) {
			// Error
			console.log(`Error fetching all tickers: ${responseJson.error}`)
			return
		}
		for(var coin in allPrices) {
			prices['INR'][coin] = {
				'buy' : response.data[coin]['highest_buy_bid'],
				'sell': response.data[coin]['lowest_sell_bid'],
				'last': response.data[coin]['lowest_sell_bid']
			}
		}
		// get order book for each coin
		for (var market in prices) {
			for (var coin in prices[market]) {
				//openSocketToOrderBook(coin, market)
			}
		}

	})
}

module.exports = {
	init,
	getPrices
};
