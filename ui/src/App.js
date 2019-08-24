import React, { Component } from 'react';
import './App.css'
import ArbDataDisplay from './ArbDataDisplay'

function App() {
	return (
		<div className="App">
			<div className="Container">
				<ArbDataDisplay from="BITBNS" to="BINANCE" amount={10000} market="INR"/>
			</div>
			<div className="Container">
				<ArbDataDisplay from="BINANCE" to="BITBNS" amount={10000} market="INR"/>
			</div>
		</div>
	)
}

export default App;
