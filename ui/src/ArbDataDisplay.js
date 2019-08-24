import React from 'react';
import Table from 'react-bootstrap/Table';

const columns = [
	'market',
	'coin',
	'from',
	'to',
	'buy',
	'sell',
	'profit'
];

function ArbDataDisplay({
	from,
	to,
	amount,
	market
}) {
	const [data, setData] = React.useState([]);
	const [error, setError] = React.useState(null);
	const [loading, setLoading] = React.useState(null);

	React.useEffect(() => {
		fetchData()
		setInterval(() => fetchData(), 1000000)
	})

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await fetch(`http://localhost:9999/arbitrage?from=${from}&to=${to}&amount=${amount}&market=${market}`);
			const body = await response.json()
			setLoading(false);
			if (response.status === 200) {
				setData(body);
				setError(null);
			} else {
				setError("Non 200 response")
			}
		} catch (e) {
			setError(`Error Fetching data: ${e}`)
		}
	}
	if (data && data.length > 0) {
		return (
			<Table bordered>
				<thead className="thead-dark">
					<tr>
						{columns.map((col, i) => <th key={i} scope="col">{col}</th>)}
					</tr>
				</thead>
				<tbody>
					{
						data.map((row, index) => {
							return (
								<tr key={index}>
									{columns.map((col, i) => <th key={i} scope="row">{row[col]}</th>)}
								</tr>
							)
						})
					}
				</tbody>
			</Table>
		);
	}
	return (
		<div>
			<h1>No data</h1>
		</div>
	);
}

export default ArbDataDisplay;
