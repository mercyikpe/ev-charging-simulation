import React from 'react';

interface SimulationResultsProps {
  totalEnergy: number;
  theoreticalMaxDemand: number;
  actualMaxDemand: number;
  concurrencyFactor: number;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({
  totalEnergy,
  theoreticalMaxDemand,
  actualMaxDemand,
  concurrencyFactor,
}) => {
  const results = [
    { label: 'Total energy consumed', value: `${totalEnergy.toFixed(2)} kWh` },
    { label: 'Theoretical maximum power demand', value: `${theoreticalMaxDemand.toFixed(2)} kW` },
    { label: 'Actual maximum power demand', value: `${actualMaxDemand.toFixed(2)} kW` },
    { label: 'Concurrency factor', value: `${(concurrencyFactor * 100).toFixed(2)}%` },
  ];

  return (
    <div className="p-6 relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
      <div className="rounded-t mb-0 px-0 border-0">
        <div className="flex flex-wrap items-center px-4 py-2">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-50">
              Simulation Results
            </h3>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="text-gray-700 dark:text-gray-100">
                  <th className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {result.label}
                  </th>
                  <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {result.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;
