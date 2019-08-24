const bitbnsApi = require('bitbns');

const bitbns = new bitbnsApi({
	apiKey :  process.env.BITBNS_API_KEY,
	apiSecretKey : process.env.BITBNS_SECRET_KEY
}); 

const prices = {'INR': {}};

/* 
 * Here, amount is the amount in the market currency; 
 */
function getAvgPrice(amount, priceList) {
	var count = 0.0
	var totalPrice = 0
	priceList.forEach(price => {
		if (amount <= 0) {
			break;
		}
		//bitbns weirdly has count as 'btc', noobs :/
		const amt = price.rate * price.btc
		if (amount >= amt) {
			amount = amount - amt
			count = count + price.btc
		} else {
			amount = 0
			count = count + (amount/price.rate)
		}
	})
	if (amount != 0) {
		return -1;
	}
	return amount/count
}

function getPrices(market, amount) {
	newPrices = {}
	marketPrices = prices[market]
	for (var coin in marketPrices) {
		var avgBuyPrice = marketPrices[coin]['buy']
		if (marketPrices.hasOwnProperty('buyList')) {
			avgBuyPrice = getAvgPrice(amount, marketPrice['buyList'])
			if (avgBuyPrice == -1) {
				console.log(`Skipping ${coin}/${market} since trade book is insufficient to calculate buyprice for amount`)
				avgBuyPrice = marketPrices[coin]['buy']
			}
		}
		var avgSellPrice = marketPrices[coin]['sell']
		if (marketPrices.hasOwnProperty('sellList')) {
			avgSellPrice = getAvgPrice(amount, marketPrice['sellList'])
			if (avgSellPrice == -1) {
				console.log(`Skipping ${coin}/${market} since trade book is insufficient to calculate sellprice for amount`)
				avgSellPrice = marketPrices[coin]['sell']
			}
		}
		newPrices[coin] = {
			buy: avgBuyPrice,
			sell: avgSellPrice
		}
	}
	return newPrices;
}


function openSocketToOrderBook(coin, market) {
	const socket = bitbns.getOrderBookSocket(coin, market)
	socket.on('connect', () => { 
		console.log(`Connected to socket ${coin}/${market}`)
		socket.on('news', res => {
			try {
				const data = JSON.parse(res)
				if (data === null) {
					console.log(`Data Received at ${coin}/${market}: NULL`)
					return;
				}
				if (data.type == 'tradeList') {
					return;
				}
				try {
					prices[market][coin][data.type] = JSON.parse(data.data)
				} catch(e) {
					console.log(`Data Received at ${coin}/${market}`)
					console.log('JSON parse failed: ')
					console.log(data)
				}
			} catch (e) {
				console.log(`Error in the Stream ${coin}/${market}`, e)
				openSocketToOrderBook(coin, market)
			}
		})
		/*
		socket.on('disconnect', () => {
			console.log(`Disconnected ${coin}/${market}`)
			openSocketToOrderBook(coin, market)
		})
		*/
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
			if (coin.length > 4 && coin.substring(coin.length - 4) === 'USDT') {
				continue;
			}
			prices['INR'][coin] = {
				'buy' : response.data[coin]['highest_buy_bid'],
				'sell': response.data[coin]['lowest_sell_bid'],
				'last': response.data[coin]['last_traded_price']
			}
		}
		// get order book for each coin
		for (var market in prices) {
			for (var coin in prices[market]) {
				openSocketToOrderBook(coin, market)
			}
		}

	})
}

module.exports = {
	init,
	getPrices
};
