import React, { useRef, useState } from 'react';
import './styles.css';

function SearchBar({
    setSearchValues,
    defaultSearchValues
}) {

    const exchanges= ["BITBNS", "BINANCE"];
    const searchInputs = useRef(defaultSearchValues);
    const { from, to, amount, market } = searchInputs.current;
    const [fromInput, setFrom] = useState(from);
    const amountInputRef = useRef(null);
    const [amountError, setAmountError] = useState(false);
    
	return (
		<div className="searchBar">
			<div>
                <label>
                    From:
                    <select
                        defaultValue={from} 
                        onChange={(event) => { 
                            const toExchanges = exchanges.filter(exchange => exchange !== event.target.value);
                            searchInputs.current = { 
                               from: event.target.value,
                               to: toExchanges[0],
                               amount,
                               market
                            };
                            setFrom(event.target.value);
                        }}
                        className="menuItems"
                    >
                        {exchanges.map(exchange => <option value={exchange}>{exchange}</option>)}
                    </select>
                </label>
			</div>
			<div>
                <label>
                    To:
                    <select 
                        defaultValue={to} 
                        onChange={(event) => { 
                            searchInputs.current = { 
                                from,
                                to: event.target.value,
                                amount,
                                market
                             };
                        }}
                        className="menuItems"
                    >
                        {exchanges.filter(exchange => exchange !== fromInput).map(exchange => <option value={exchange}>{exchange}</option>)}
                    </select>
                </label>
			</div>
			<div>
                <label>
                    Market:
                    <select 
                        value={market}
                        onChange={(event) => { 
                            searchInputs.current = { 
                                from,
                                to,
                                amount,
                                market: event.target.value
                            }; 
                        }}
                        className="menuItems"
                    >
                        <option value="INR">INR</option>
                    </select>
                </label>
			</div>
            <div>
                <label>
                    Amount:
                    <input
                        ref={amountInputRef}
                        type="number"
                        defaultValue={amount}
                        onChange={(event) => {
                            searchInputs.current = { 
                                from,
                                to,
                                amount: event.target.value,
                                market
                            }; 
                        }}
                        onBlur={() => {
                            if(searchInputs.current.amount === '' || !(searchInputs.current.amount > 0)) {
                                setAmountError(true);
                            } else {
                                setAmountError(false);
                            }
                        }}
                        className={`menuItems ${amountError ? 'inputError' : ''}`}
                    />
                </label>
			</div>
            <div>
                <button 
                    type="button"
                    onClick={() => { 
                        setSearchValues(searchInputs.current);
                    }}
                    disabled={amountError}
                >
                    Search
                </button>
			</div>
		</div>
	)
}

export default React.memo(SearchBar);
