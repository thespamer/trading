
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function TradeChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['10:00', '10:05', '10:10', '10:15', '10:20'],  // Simulated time labels
        datasets: [
          {
            label: 'Preço de Mercado',
            data: [28.5, 28.7, 28.4, 28.6, 28.8],  // Simulated market data
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tempo',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Preço (BRL)',
            },
            beginAtZero: false,
          },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, []);

  return (
    <div>
      <h3>Gráfico de Trading</h3>
      <canvas ref={chartRef} width="600" height="400"></canvas>
    </div>
  );
}

export default TradeChart;
