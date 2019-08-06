const request = require('request');
var cron = require('node-cron')

async function fetchPrices(url, exchangeName, responseParser) {
	console.log(`Fetching ${exchangeName} rates`);
	try {
		const response = await fetch(url)
		responseParser(response)
	} catch (e) {
		console.log(`Failed to fetch ${exchangeName} rates`)
		console.log(e)
	}
}

function sync(url, exchangeName, responseParser) {
	fetchPrices(url, exchangeName, responseParser)
	var task = cron.schedule('5 * * * * *', function() {
		fetchPrices(url, exchangeName, responseParser)
	});
	task.start()
}

function fetch(url) {
	return new Promise((resolve, reject) => {
		request(url, function(error, response, body) {
			if (error) {
				reject(error)
				return
			}
			if (response.statusCode === 200) {
				const pricesJson = JSON.parse(body)
				resolve(pricesJson)
			} else {
				//Non 200 response
				if (body) {
					try {
						const errorBody = JSON.parse(body)
						reject(errorBody)
					} catch (error) {
						reject(body)
					}
					return
				}
				reject("Unknown Error")
			}
		});
	})
}

module.exports = {
	sync
};
