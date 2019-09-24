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
	var count = 0.0;
	var totalPrice = amount;
	for (var i = 0; i < priceList.length; i++) {
		const price = priceList[i];
		if (amount <= 0) {
			break;
		}
		//bitbns weirdly has count as 'btc', noobs :/
		const amt = price.rate * price.btc
		if (amount >= amt) {
			amount = amount - amt
			count = count + price.btc
		} else {
			count = count + (amount/price.rate)
			amount = 0
		}
	}
	if (amount != 0) {
		return -1;
	}
	return totalPrice/count
}

function getPrices(market, amount) {
	newPrices = {}
	marketPrices = prices[market]
	for (var coin in marketPrices) {
		const coinPrice = marketPrices[coin]
		var avgBuyPrice = coinPrice['buy']
		if (coinPrice.hasOwnProperty('buyList')) {
			avgBuyPrice = getAvgPrice(amount, coinPrice['buyList'])
			if (avgBuyPrice == -1) {
				console.log(`Skipping ${coin}/${market} since trade book is insufficient to calculate buyprice for amount`)
				continue;
			}
		} else {
			console.log(`Skipping ${coin}/${market} since marketPrice has no property 'buyList'`);
			continue;
		}
		var avgSellPrice = coinPrice['sell']
		if (coinPrice.hasOwnProperty('sellList')) {
			avgSellPrice = getAvgPrice(amount, coinPrice['sellList'])
			if (avgSellPrice == -1) {
				console.log(`Skipping ${coin}/${market} since trade book is insufficient to calculate sellprice for amount`)
				continue;
			}
		} else {
			console.log(`Skipping ${coin}/${market} since marketPrice has no property 'sellList'`);
			continue;
		}
		newPrices[coin] = {
			buy: avgBuyPrice,
			sell: avgSellPrice
		}
	}
	return newPrices;
}

const failedPairs = {
	'BCHABC/INR': 4,
	'PHB/INR': 4,
	'VEN/INR': 4,
	'SC/INR': 4,
	'RPX/INR': 4,
	'RAM/INR': 4,
	'VEN/INR': 4
};

function shouldSkipPair(coin, market) {
	const pair = `${coin}/${market}`;
	if (!failedPairs.hasOwnProperty(pair)) {
		return false;
	}
	// if this pair returned null data > 3 times, then skip this
	return failedPairs[pair] > 3;
}

function trackFailedPair(coin, market) {
	const pair = `${coin}/${market}`;
	if (!failedPairs.hasOwnProperty(pair)) {
		failedPairs[pair] = 0;
	}
	failedPairs[pair]++;
}

function openSocketToOrderBook(coin, market) {
	if (shouldSkipPair(coin, market)) {
		return;
	}
	const socket = bitbns.getOrderBookSocket(coin, market)
	socket.on('connect', () => { 
		socket.on('news', res => {
			try {
				const data = JSON.parse(res)
				if (data === null) {
					console.log(`Data Received at ${coin}/${market}: NULL`)
					trackFailedPair(coin, market);
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
					trackFailedPair(coin, market);
				}
			} catch (e) {
				console.log(`Error in the Stream ${coin}/${market}`)
				console.log(`${e.name}: ${e.message}`)
				if (e instanceof SyntaxError) {
					console.log(`JSON parsing error while parsing: \n`);
					console.log(res);
					trackFailedPair(coin, market);
				} 
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
