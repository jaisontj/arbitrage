import React, { PureComponent } from 'react';
import Table from 'react-bootstrap/Table';

class ArbDataDisplay extends PureComponent {
	constructor() {
		super()
		this.state = {
			loading: true,
			columns: [
				'market',
				'coin',
				'from',
				'to',
				'buy',
				'sell',
				'profit'
			],
			data: [],
			error: null
		}
	}

	setError(error) {
		this.setState({
			...this.state,
			error: error
		})
	}

	componentDidMount(){
		setInterval(() => this.fetchData(), 1000)
	}

	async fetchData() {
		try {
			const response = await fetch(`http://localhost:9999/arbitrage?from=${this.props.from}&to=${this.props.to}&amount=${this.props.amount}&market=${this.props.market}`)
			const body = await response.json()
			if (response.status === 200) {
				this.setState({
					...this.state,
					data: body,
					loading: false,
					error: null
				})
			} else {
				this.setError("Non 200 response")
			}
		} catch(e) {
			this.setError("Error Fetching data: " + e)
		}
	} 

	render() {
		if (this.state.data != null) {
			return (
				<Table bordered>
				<thead className="thead-dark">
				<tr>
				{this.state.columns.map((col,i) => <th key={i} scope="col">{col}</th>)}
				</tr>
				</thead>
				<tbody>
				{
					this.state.data.map((row, index) => {
						return (
							<tr key={index}>
							{this.state.columns.map((col, i) => <th key={i} scope="row">{row[col]}</th>)}
							</tr>
						)
					})
				}
				</tbody>
				</Table>
			)
		}
		return (
			<div>
			<h1>Loading</h1>
			</div>
		)
	}

}

export default ArbDataDisplay;
