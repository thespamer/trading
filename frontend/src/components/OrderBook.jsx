
import React, { useEffect, useState } from 'react';

function OrderBook() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/orders')
      .then(response => response.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="card">
      <h2>Livro de Ordens</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            {order.side.toUpperCase()} {order.quantity} {order.symbol} @ {order.price || 'Mercado'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderBook;
    