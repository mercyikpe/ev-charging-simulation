import React, { useState } from 'react';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js/auto';

interface SimulationChartProps {
  powerUsage: number[];
  timeLabels: string[];
  theoreticalMaxDemand: number;
  actualMaxDemand: number;
  chargingValues: number[][];
  totalChargingEvents: number[];
}

const SimulationChart: React.FC<SimulationChartProps> = ({
  powerUsage,
  timeLabels,
  theoreticalMaxDemand,
  actualMaxDemand,
  chargingValues,
  totalChargingEvents,
}) => {
  const [viewMode, setViewMode] = useState<'year' | 'month' | 'week' | 'day'>(
    'day'
  );
  const [chartType, setChartType] = useState<
    'powerUsage' | 'chargingValues' | 'chargingEvents'
  >('powerUsage');

  const averagePowerUsage =
    powerUsage.reduce((sum, value) => sum + value, 0) / powerUsage.length;
  const maxDemandIndex = powerUsage.indexOf(actualMaxDemand);

  const getDataForViewMode = (data: number[]) => {
    switch (viewMode) {
      case 'month':
        return data.slice(0, 31 * 24 * 4);
      case 'week':
        return data.slice(0, 7 * 24 * 4);
      case 'day':
        return data.slice(0, 24 * 4);
      default:
        return data;
    }
  };

  const getLabelForViewMode = () => {
    switch (viewMode) {
      case 'month':
        return timeLabels.slice(0, 31 * 24 * 4);
      case 'week':
        return timeLabels.slice(0, 7 * 24 * 4);
      case 'day':
        return timeLabels.slice(0, 24 * 4);
      default:
        return timeLabels;
    }
  };

  const options: ChartOptions<'line'> = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time Range',
        },
      },
      y: {
        title: {
          display: true,
          text:
            chartType === 'chargingEvents'
              ? 'Number of Events'
              : 'Power Usage (kW)',
        },
        min: 0,
        max:
          chartType === 'chargingEvents'
            ? Math.max(...totalChargingEvents) * 1.1
            : Math.max(theoreticalMaxDemand, ...powerUsage) * 1.1,
      },
    },
  };

  const getChartData = () => {
    switch (chartType) {
      case 'chargingValues':
        return {
          labels: getLabelForViewMode(),
          datasets: chargingValues.map((values, index) => ({
            label: `Chargepoint ${index + 1}`,
            data: getDataForViewMode(values),
            borderColor: `hsl(${
              (index * 360) / chargingValues.length
            }, 70%, 50%)`,
            fill: false,
          })),
        };
      case 'chargingEvents':
        return {
          labels: getLabelForViewMode(),
          datasets: [
            {
              label: 'Charging Events',
              data: getDataForViewMode(totalChargingEvents),
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            },
          ],
        };
      default:
        return {
          labels: getLabelForViewMode(),
          datasets: [
            {
              label: 'Power Usage (kW)',
              data: getDataForViewMode(powerUsage),
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            },
            {
              label: 'Average Power Usage',
              data: Array(getDataForViewMode(powerUsage).length).fill(
                averagePowerUsage
              ),
              borderColor: 'rgba(0,255,0,0.5)',
              borderDash: [2, 2],
              fill: false,
            },
            {
              label: 'Max Demand Point',
              data: Array(getDataForViewMode(powerUsage).length).fill(null),
              pointBackgroundColor: 'rgba(255,165,0,1)',
              pointBorderColor: 'rgba(255,165,0,1)',
              pointRadius: 5,
              pointHoverRadius: 8,
              showLine: false,
            },
          ],
        };
    }
  };

  return (
    <>
      <div className="mx-auto flex flex-wrap justify-between w-full lg:w-2/3 mb-10">
        <div className="mb-4 flex flex-wrap gap-6 mt-6">
          <button
            onClick={() => setViewMode('year')}
            className={`mr-2 px-2 py-1 rounded ${
              viewMode === 'year'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            Year
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`mr-2 px-2 py-1 rounded ${
              viewMode === 'month'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`mr-2 px-2 py-1 rounded ${
              viewMode === 'week'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-2 py-1 rounded ${
              viewMode === 'day'
                ? 'bg-blue-700 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            Day
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-6 mt-6">
          <button
            onClick={() => setChartType('powerUsage')}
            className={`mr-2 px-2 py-1 rounded ${
              chartType === 'powerUsage'
                ? 'bg-green-700 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            Power Usage
          </button>
          <button
            onClick={() => setChartType('chargingValues')}
            className={`mr-2 px-2 py-1 rounded ${
              chartType === 'chargingValues'
                ? 'bg-green-700 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            Charging Values
          </button>
          <button
            onClick={() => setChartType('chargingEvents')}
            className={`px-2 py-1 rounded ${
              chartType === 'chargingEvents'
                ? 'bg-green-700 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            Charging Events
          </button>
        </div>
      </div>

      <div className="mx-auto w-full lg:w-2/3">
        <Line data={getChartData()} options={options} />
      </div>
    </>
  );
};

export default SimulationChart;
