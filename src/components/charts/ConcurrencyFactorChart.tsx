// components/charts/ConcurrencyFactorChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';

interface ConcurrencyFactorChartProps {
  rangeResults: Array<{
    chargePoints: number;
    concurrencyFactor: number;
  }>;
}

const ConcurrencyFactorChart: React.FC<ConcurrencyFactorChartProps> = ({ rangeResults }) => {
  const data = {
    labels: rangeResults.map((result) => result.chargePoints),
    datasets: [
      {
        label: 'Concurrency Factor',
        data: rangeResults.map((result) => result.concurrencyFactor * 100),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Number of Charge Points',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Concurrency Factor (%)',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ConcurrencyFactorChart;