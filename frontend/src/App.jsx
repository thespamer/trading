
import React from 'react';
import OrderBook from './components/OrderBook';
import TradeChart from './components/TradeChart';

function App() {
  return (
    <div className="App">
      <h1>Welcome to the Trading System</h1>
      <div className="container">
        <h2>Dashboard</h2>
        <TradeChart />
        <OrderBook />
      </div>
    </div>
  );
}

export default App;
