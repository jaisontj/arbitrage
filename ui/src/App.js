import React, { Component } from 'react';
import './App.css'
import ArbDataDisplay from './ArbDataDisplay'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class App extends Component {

	render() {
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
}


export default App;
