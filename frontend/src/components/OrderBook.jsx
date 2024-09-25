
import React, { useEffect, useState } from 'react';

function OrderBook() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://192.168.1.96:8000/orders')
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  return (
    <div>
      <h3>Order Book</h3>
      <ul>
        {orders.length > 0 ? (
          orders.map(order => (
            <li key={order.id}>
              {order.side.toUpperCase()} {order.quantity} {order.symbol} @ {order.price || 'Market'}
            </li>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </ul>
    </div>
  );
}

export default OrderBook;
