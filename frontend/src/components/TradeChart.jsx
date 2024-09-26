import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function TradingDashboard() {
  const chartRef = useRef(null);
  const [marketData, setMarketData] = useState([]);
  const [orderVolume, setOrderVolume] = useState({ buys: 0, sells: 0 });
  const [valuablePaper, setValuablePaper] = useState('');
  const [paperRanking, setPaperRanking] = useState([]);
  const [priceHistory, setPriceHistory] = useState({});
  const charts = useRef({});  // Para armazenar as instâncias dos gráficos

  // Fetch market data and order book data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('http://192.168.1.96:8000/market-data');
        const data = await response.json();
        setMarketData(data);

        // Process valuable paper and ranking
        if (data.length > 0) {
          // Finding the most valuable paper
          const valuable = data.reduce((prev, curr) => (curr.price > prev.price ? curr : prev), data[0]);
          setValuablePaper(valuable.symbol);

          // Ranking papers by price
          const ranking = data.sort((a, b) => b.price - a.price);
          setPaperRanking(ranking);

          // Collect price history
          const updatedPriceHistory = { ...priceHistory };
          data.forEach(paper => {
            if (!updatedPriceHistory[paper.symbol]) {
              updatedPriceHistory[paper.symbol] = [];
            }
            updatedPriceHistory[paper.symbol].push(paper.price);
            // Limit the history to the last 10 data points
            if (updatedPriceHistory[paper.symbol].length > 10) {
              updatedPriceHistory[paper.symbol].shift();
            }
          });
          setPriceHistory(updatedPriceHistory);
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    const fetchOrderVolume = async () => {
      try {
        const response = await fetch('http://192.168.1.96:8000/orders');
        const orders = await response.json();

        // Calculate buy/sell volume
        const buys = orders.filter(order => order.side === 'buy').length;
        const sells = orders.filter(order => order.side === 'sell').length;
        setOrderVolume({ buys, sells });
      } catch (error) {
        console.error('Error fetching order volume:', error);
      }
    };

    // Fetch data every 5 seconds
    fetchMarketData();
    fetchOrderVolume();
    const intervalId = setInterval(() => {
      fetchMarketData();
      fetchOrderVolume();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [priceHistory]);

  // Create the chart for Buy/Sell Volume
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (charts.current['orderVolume']) {
        charts.current['orderVolume'].destroy();  // Destruir o gráfico antigo se existir
      }
      charts.current['orderVolume'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Buys', 'Sells'],
          datasets: [
            {
              label: 'Order Volume',
              data: [orderVolume.buys, orderVolume.sells],
              backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [orderVolume]);

  // Render price history as a chart for each paper
  const renderPriceHistoryCharts = () => {
    return Object.keys(priceHistory).map(symbol => (
      <div key={symbol}>
        <h4>{symbol} Price History</h4>
        <canvas
          id={`chart-${symbol}`}
          ref={canvas => {
            if (canvas && priceHistory[symbol]) {
              const ctx = canvas.getContext('2d');
              if (charts.current[symbol]) {
                charts.current[symbol].destroy();  // Destruir o gráfico antigo se existir
              }
              charts.current[symbol] = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: priceHistory[symbol].map((_, index) => `Point ${index + 1}`),
                  datasets: [
                    {
                      label: `${symbol} Price`,
                      data: priceHistory[symbol],
                      borderColor: 'rgba(75, 192, 192, 1)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      fill: true,
                    },
                  ],
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: false,
                    },
                  },
                },
              });
            }
          }}
          width="600"
          height="400"
        ></canvas>
      </div>
    ));
  };

  return (
    <div>
      <h3>Trading Dashboard</h3>
      
      {/* Gráfico de volume de ordens */}
      <div>
        <h4>Order Volume</h4>
        <canvas ref={chartRef} width="600" height="400"></canvas>
      </div>
      
      {/* Informações adicionais */}
      <div>
        <h4>Most Valuable Paper: {valuablePaper}</h4>
        <h4>Paper Ranking (by Price)</h4>
        <ul>
          {paperRanking.map(paper => (
            <li key={paper.symbol}>{paper.symbol}: ${paper.price.toFixed(2)}</li>
          ))}
        </ul>
        
        <h4>Price History of Papers</h4>
        {renderPriceHistoryCharts()}
      </div>
    </div>
  );
}

export default TradingDashboard;

