import React, { useState } from 'react';
import './styles.css';
import ArbDataTable, {} from '../components/ArbDataTable';
import SearchBar from '../components/SearchBar';

function App() {
	const defaultSearchValues = {
		from: 'BITBNS',
		to: 'BINANCE',
		amount: 10000,
		market: 'INR',
	}
	const [searchValues, setSearchValues] = useState(defaultSearchValues);
	const { from, to, amount, market } = searchValues;

	return (
		<div className="App">
			<div>
				<SearchBar setSearchValues={setSearchValues} defaultSearchValues={defaultSearchValues} />
			</div>
			<div className="Container">
				<div className="ArbTable">
					<ArbDataTable from={from} to={to} amount={amount} market={market}/>
				</div>
				<div className="ArbTable">
					<ArbDataTable from={to} to={from} amount={amount} market={market}/>
				</div>
			</div>
		</div>
	)
}

export default App;
