// components/ChargingEventsStats.tsx
import React from 'react';

interface ChargingEventsStatsProps {
  totalChargingEvents: number[];
}

const ChargingEventsStats: React.FC<ChargingEventsStatsProps> = ({
  totalChargingEvents,
}) => {
  // Calculate the total number of charging events
  const totalEvents = totalChargingEvents.reduce(
    (sum, events) => sum + events,
    0
  );

  // Calculate average number of charging events per day, week, and month
  const dailyAverageEvents = totalEvents / 365;
  const weeklyAverageEvents = dailyAverageEvents * 7;
  const monthlyAverageEvents = dailyAverageEvents * 30.44; // Average days in a month

  const stats = [
    { label: 'Total per year', value: totalEvents },
    { label: 'Average per month', value: monthlyAverageEvents.toFixed(2) },
    { label: 'Average per week', value: weeklyAverageEvents.toFixed(2) },
    { label: 'Average per day', value: dailyAverageEvents.toFixed(2) },
  ];

  return (
    <>
      <div className="p-6 relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
        <div className="rounded-t mb-0 px-0 border-0">
          <div className="flex flex-wrap items-center px-4 py-2">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-50">
                Charging Events Statistics
              </h3>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse">
              <tbody>
                {stats.map((stat, index) => (
                  <tr key={index} className="text-gray-700 dark:text-gray-100">
                    <th className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {stat.label}
                    </th>
                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {stat.value} charging
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChargingEventsStats;
