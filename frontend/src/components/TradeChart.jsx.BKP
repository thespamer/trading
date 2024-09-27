import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './TradingDashboard.css';  // Import the CSS file for styles

function TradingDashboard() {
  const marketDepthChartRef = useRef(null);
  const volumeByAssetChartRef = useRef(null);
  const priceByOrderChartRef = useRef(null);
  const chartRefPrices = useRef(null);
  
  const [priceData, setPriceData] = useState({ assets: [], prices: [] });
  const [marketData, setMarketData] = useState([]);
  const [orderBook, setOrderBook] = useState([]);
  const [volumeHistory, setVolumeHistory] = useState({ buys: [], sells: [], timeLabels: [] });
  const [notifications, setNotifications] = useState([]);  // Para armazenar notificações
  
  const charts = useRef({});  // To store chart instances

  // Função para detectar matches de ordens de compra e venda
  const detectOrderMatch = (orders) => {
    const matches = [];

    const groupedOrders = orders.reduce((acc, order) => {
      if (!acc[order.symbol]) acc[order.symbol] = [];
      acc[order.symbol].push(order);
      return acc;
    }, {});

    Object.keys(groupedOrders).forEach((symbol) => {
      const buyOrders = groupedOrders[symbol].filter(order => order.side === 'buy');
      const sellOrders = groupedOrders[symbol].filter(order => order.side === 'sell');

      buyOrders.forEach((buyOrder) => {
        sellOrders.forEach((sellOrder) => {
          if (Math.abs(buyOrder.price - sellOrder.price) <= 0.01) {
            matches.push({ symbol, price: buyOrder.price });
          }
        });
      });
    });

    return matches;
  };

  // Função para adicionar notificações de matches
  const addNotification = (symbol, price) => {
    const newNotification = { id: Date.now(), symbol, price };
    setNotifications((prev) => [...prev, newNotification]);

    // Remover a notificação após 5 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
    }, 5000);
  };

  // Fetch market data and order book
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('http://192.168.1.96:8000/market-data/');
        const data = await response.json();
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    const fetchOrderBook = async () => {
      try {
        const response = await fetch('http://192.168.1.96:8000/orders/');
        const orders = await response.json();
        setOrderBook(orders);

        // Atualizar priceData com os dados de ordens
        const assets = orders.map(order => order.symbol);
        const prices = orders.map(order => order.price);
        setPriceData({ assets, prices });

        // Atualizar o volume de buys e sells
        const totalBuys = orders.filter(order => order.side === 'buy').length;
        const totalSells = orders.filter(order => order.side === 'sell').length;
        const currentTime = new Date().toLocaleTimeString();

        setVolumeHistory(prevState => ({
          buys: [...prevState.buys, totalBuys].slice(-10), // Limita o histórico a 10 pontos
          sells: [...prevState.sells, totalSells].slice(-10),
          timeLabels: [...prevState.timeLabels, currentTime].slice(-10)
        }));

        // Detectar matches de ordens e criar notificações
        const matches = detectOrderMatch(orders);
        matches.forEach(({ symbol, price }) => {
          addNotification(symbol, price);
        });
      } catch (error) {
        console.error('Error fetching order book:', error);
      }
    };

    fetchMarketData();
    fetchOrderBook();

    const intervalId = setInterval(() => {
      fetchMarketData();
      fetchOrderBook();
    }, 5000);  // Atualizar a cada 5 segundos

    return () => clearInterval(intervalId);
  }, []);

  // Atualiza o gráfico de Market Depth
  useEffect(() => {
    if (marketDepthChartRef.current) {
      const ctx = marketDepthChartRef.current.getContext('2d');

      if (charts.current['marketDepth']) {
        charts.current['marketDepth'].destroy();  // Destruir gráfico antigo
      }

      charts.current['marketDepth'] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: volumeHistory.timeLabels,  // Mostra a hora no eixo X
          datasets: [
            {
              label: 'Buys',
              data: volumeHistory.buys,  // Dados de compra ao longo do tempo
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
              tension: 0.1,
            },
            {
              label: 'Sells',
              data: volumeHistory.sells,  // Dados de venda ao longo do tempo
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Volume',
              },
            },
          },
        },
      });
    }
  }, [volumeHistory]);  // Atualiza o gráfico quando volumeHistory mudar

  // Create the Volume by Asset Chart
  useEffect(() => {
    if (volumeByAssetChartRef.current) {
      const ctx = volumeByAssetChartRef.current.getContext('2d');

      const assetVolume = orderBook.reduce((acc, order) => {
        if (!acc[order.symbol]) {
          acc[order.symbol] = 0;
        }
        acc[order.symbol] += 1;
        return acc;
      }, {});

      const labels = Object.keys(assetVolume);
      const volumes = Object.values(assetVolume);

      if (charts.current['volumeByAsset']) {
        charts.current['volumeByAsset'].destroy();
      }

      charts.current['volumeByAsset'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Order Volume by Asset',
              data: volumes,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Order Volume',
              },
            },
          },
        },
      });
    }
  }, [orderBook]);

  // Create the Price by Order Chart
  useEffect(() => {
    if (chartRefPrices.current) {
      const ctx = chartRefPrices.current.getContext('2d');
      if (charts.current['priceByAsset']) {
        charts.current['priceByAsset'].destroy();  // Destruir o gráfico antigo, se existir
      }
      charts.current['priceByAsset'] = new Chart(ctx, {
        type: 'bar',  // Gráfico de barras
        data: {
          labels: priceData.assets,  // Ativos no eixo X
          datasets: [
            {
              label: 'Order Price',
              data: priceData.prices,  // Preços no eixo Y
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Price',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Assets',
              },
            },
          },
        },
      });
    }
  }, [priceData]);

  return (
    <div>
      <h3>Trading Dashboard</h3>

      {/* Market Depth Chart */}
      <div>
        <h4>Market Depth (Buy/Sell Orders)</h4>
        <canvas ref={marketDepthChartRef} width="600" height="400"></canvas>
      </div>

      {/* Volume by Asset Chart */}
      <div>
        <h4>Order Volume by Asset</h4>
        <canvas ref={volumeByAssetChartRef} width="600" height="400"></canvas>
      </div>

      {/* Price by Order Chart */}
      <div>
        <h4>Order Price by Asset</h4>
        <canvas ref={chartRefPrices} width="600" height="400"></canvas>
      </div>

      {/* Order Book Table */}
      <div className="order-book-container">
        <h4>Order Book</h4>
        <table className="order-book-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orderBook.map((order, index) => (
              <tr key={index} className={order.side === 'buy' ? 'buy' : 'sell'}>
                <td>{order.side.charAt(0).toUpperCase() + order.side.slice(1)}</td>
                <td>{order.symbol}</td>
                <td>{order.quantity}</td>
                <td>{order.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notificações */}
	  <div className="notification-container">
  {notifications.map((notification, index) => (
    <div key={`${notification.id}-${index}`} className="notification">
      Match! {notification.symbol} @ ${notification.price.toFixed(2)}
    </div>
  ))}
</div>
    </div>
  );
}

export default TradingDashboard;

