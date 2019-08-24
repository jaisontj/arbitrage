require('dotenv').config();
const express = require('express');
const app = express();

const bitbns = require('./exchanges/bitbns');
const binance = require('./exchanges/binance');
bitbns.init()
binance.init()

/*
Normalised data
- All CAPS
- Markets: INR, USDT, BTC, ETH
{
  exchange: {
	market: {
	  coin: {
		buy: price(in market)
		sell: price(in market)
	  }
	}
  }
}
*/

function getPrices(market, amount) {
	return {
		'BITBNS': bitbns.getPrices(market, amount),
		'BINANCE': binance.prices[market]
	}
}

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/arbitrage', (req, res) => {
	from = req.query.from;
	to = req.query.to;
	amount = req.query.amount;
	market = req.query.market;
	prices = getPrices(market, amount)
	response= []
	for (var coin in prices[from]) {
		if (!prices[to].hasOwnProperty(coin)) {
			continue;
		}
		//sell price at exchange is the rate to buy coin
		buyPrice = prices[from][coin]['sell']
		//buy price at exchange is the rate to sell coin
		sellPrice= prices[to][coin]['buy']
		profitP = ((sellPrice - buyPrice)*100/buyPrice).toFixed(2)
		response.push({
			coin: coin,
			from: from,
			to: to,
			market: market,
			buy: buyPrice,
			sell: sellPrice,
			profit: profitP 
		})
	}
	res.json(response.sort((a, b) => b.profit - a.profit))
})

app.listen(process.env.PORT, function() {
	console.log(`Server running at port ${process.env.PORT}`)
})
