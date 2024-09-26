import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function TradingDashboard() {
  const chartRef = useRef(null);
  const [marketData, setMarketData] = useState([]);
  const [orderVolume, setOrderVolume] = useState({ buys: 0, sells: 0 });
  const [volumeHistory, setVolumeHistory] = useState({ buys: [], sells: [], timeLabels: [] });
  const [valuablePaper, setValuablePaper] = useState('');
  const [paperRanking, setPaperRanking] = useState([]);
  const [priceHistory, setPriceHistory] = useState({});
  const charts = useRef({});  // Para armazenar as instâncias dos gráficos

  // Fetch market data and order book data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('http://192.168.1.96:8000/market-data/');
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
        const response = await fetch('http://192.168.1.96:8000/orders/');
        const orders = await response.json();

        // Calculate buy/sell volume
        const buys = orders.filter(order => order.side === 'buy').length;
        const sells = orders.filter(order => order.side === 'sell').length;

        // Add data to the volume history
        const currentTime = new Date().toLocaleTimeString(); // Get the current time
        setVolumeHistory(prevState => ({
          buys: [...prevState.buys, buys].slice(-10),  // Limit to the last 10 points
          sells: [...prevState.sells, sells].slice(-10),
          timeLabels: [...prevState.timeLabels, currentTime].slice(-10),  // Save the time labels for the last 10 points
        }));

        setOrderVolume({ buys, sells });
      } catch (error) {
        console.error('Error fetching order volume:', error);
      }
    };

    // Fetch data every 10 seconds
    fetchMarketData();
    fetchOrderVolume();
    const intervalId = setInterval(() => {
      fetchMarketData();
      fetchOrderVolume();
    }, 20000);  // Atualizar a cada 10 segundos

    return () => clearInterval(intervalId);
  }, [priceHistory]);

  // Create the chart for Buy/Sell Volume over time
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (charts.current['orderVolume']) {
        charts.current['orderVolume'].destroy();  // Destruir o gráfico antigo se existir
      }
      charts.current['orderVolume'] = new Chart(ctx, {
        type: 'line',  // Alterar para gráfico de linha
        data: {
          labels: volumeHistory.timeLabels,  // Usar os labels de tempo
          datasets: [
            {
              label: 'Buys',
              data: volumeHistory.buys,  // Dados de Buy ao longo do tempo
              borderColor: 'rgba(54, 162, 235, 1)',  // Cor da linha para buys
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,  // Linha com preenchimento
              tension: 0.1,  // Suavização da curva
            },
            {
              label: 'Sells',
              data: volumeHistory.sells,  // Dados de Sell ao longo do tempo
              borderColor: 'rgba(255, 99, 132, 1)',  // Cor da linha para sells
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
              tension: 0.1,  // Suavização da curva
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
  }, [volumeHistory]);

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
        {Object.keys(priceHistory).map(symbol => (
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
        ))}
      </div>
    </div>
  );
}

export default TradingDashboard;

