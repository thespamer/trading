
import React, { useEffect, useState } from 'react';

function OrderBook() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/orders')
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error('Erro ao buscar ordens:', error));
  }, []);

  return (
    <div>
      <h3>Livro de Ordens</h3>
      <ul>
        {orders.length > 0 ? (
          orders.map(order => (
            <li key={order.id}>
              {order.side.toUpperCase()} {order.quantity} {order.symbol} @ {order.price || 'Mercado'}
            </li>
          ))
        ) : (
          <p>Nenhuma ordem disponível.</p>
        )}
      </ul>
    </div>
  );
}

export default OrderBook;
