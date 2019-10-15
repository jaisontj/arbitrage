import React, { useState, useRef } from 'react';
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

function ArbDataTable({
	from,
	to,
	amount,
	market
}) {
	const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    React.useEffect(() => {
        if(intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        fetchData(from, to, amount, market);
        intervalRef.current = setInterval(() => { 
            fetchData(from, to, amount, market);
        }, 5000);
    }, [from, to, market, amount])

	const fetchData = async (from, to, amount, market) => {
        try {
            const response = await fetch(`http://localhost:9999/arbitrage?from=${from}&to=${to}&amount=${amount}&market=${market}`);
            const body = await response.json();
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

export default React.memo(ArbDataTable);
