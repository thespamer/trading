import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function TradingDashboard() {
  const marketDepthChartRef = useRef(null);
  const volumeByAssetChartRef = useRef(null);
  const priceByOrderChartRef = useRef(null);

  const [marketData, setMarketData] = useState([]);
  const [orderBook, setOrderBook] = useState([]);

  const charts = useRef({});  // To store chart instances

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
      } catch (error) {
        console.error('Error fetching order book:', error);
      }
    };

    fetchMarketData();
    fetchOrderBook();

    const intervalId = setInterval(() => {
      fetchMarketData();
      fetchOrderBook();
    }, 5000);  // Update every 20 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Create the Market Depth Chart
  useEffect(() => {
    if (marketDepthChartRef.current) {
      const ctx = marketDepthChartRef.current.getContext('2d');

      const groupedOrders = orderBook.reduce(
        (acc, order) => {
          if (!acc[order.symbol]) {
            acc[order.symbol] = { buy: [], sell: [] };
          }
          if (order.side === 'buy') {
            acc[order.symbol].buy.push(order.price);
          } else {
            acc[order.symbol].sell.push(order.price);
          }
          return acc;
        },
        {}
      );

      const labels = Object.keys(groupedOrders);
      const buyData = labels.map(
        symbol => groupedOrders[symbol].buy.length || 0
      );
      const sellData = labels.map(
        symbol => groupedOrders[symbol].sell.length || 0
      );

      if (charts.current['marketDepth']) {
        charts.current['marketDepth'].destroy();
      }

      charts.current['marketDepth'] = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Buy Orders',
              data: buyData,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
              tension: 0.1,
            },
            {
              label: 'Sell Orders',
              data: sellData,
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
                text: 'Assets',
              },
            },
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
    if (priceByOrderChartRef.current) {
      const ctx = priceByOrderChartRef.current.getContext('2d');

      const labels = orderBook.map(order => order.symbol);
      const prices = orderBook.map(order => order.price);

      if (charts.current['priceByOrder']) {
        charts.current['priceByOrder'].destroy();
      }

      charts.current['priceByOrder'] = new Chart(ctx, {
        type: 'scatter',
        data: {
          labels,
          datasets: [
            {
              label: 'Order Price',
              data: prices.map((price, idx) => ({ x: labels[idx], y: price })),
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Assets',
              },
            },
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Price',
              },
            },
          },
        },
      });
    }
  }, [orderBook]);

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
        <canvas ref={priceByOrderChartRef} width="600" height="400"></canvas>
      </div>
    </div>
  );
}

export default TradingDashboard;

