'use client';

import React, { useState } from 'react';
import { simulateChargingStations, ChargePoint } from '@/utils/SimulationLogic';
import SimulationInputs from '@/components/SimulationInputs';
import SimulationChart from '@/components/charts/SimulationChart';
import ConcurrencyFactorChart from '@/components/charts/ConcurrencyFactorChart';
import ChargingEventsStats from '@/components/ChargingEventStats';
import SimulationResults from '@/components/SimulationResults';

const Home: React.FC = () => {
  const [chargePoints, setChargePoints] = useState<ChargePoint[]>([
    { count: 20, power: 11 },
  ]);
  const [arrivalProbabilityMultiplier, setArrivalProbabilityMultiplier] =
    useState(100);
  const [carConsumption, setCarConsumption] = useState(18);
  const [powerUsage, setPowerUsage] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [totalEnergy, setTotalEnergy] = useState<number>(0);
  const [actualMaxDemand, setActualMaxDemand] = useState<number>(0);
  const [theoreticalMaxDemand, setTheoreticalMaxDemand] = useState<number>(0);
  const [concurrencyFactor, setConcurrencyFactor] = useState<number>(0);
  const [totalChargingEvents, setTotalChargingEvents] = useState<number[]>([]);
  const [rangeResults, setRangeResults] = useState<any[]>([]);
  const [chargingValues, setChargingValues] = useState<number[][]>([]);

  const [showChart, setShowChart] = useState(false);
  const [showRangeResults, setShowRangeResults] = useState(false);

  const runSimulation = () => {
    const {
      powerUsage,
      timeLabels,
      totalEnergy,
      actualMaxDemand,
      theoreticalMaxDemand,
      concurrencyFactor,
      totalChargingEvents,
    } = simulateChargingStations(
      chargePoints,
      arrivalProbabilityMultiplier,
      carConsumption
    );
    setPowerUsage(powerUsage);
    setTimeLabels(timeLabels);
    setTotalEnergy(totalEnergy);
    setActualMaxDemand(actualMaxDemand);
    setTheoreticalMaxDemand(theoreticalMaxDemand);
    setConcurrencyFactor(concurrencyFactor);
    setTotalChargingEvents(totalChargingEvents);
    setChargingValues(chargingValues);
    setShowChart((prev) => !prev);
  };

  const runSimulationForDifferentChargePoints = () => {
    const results = [];
    for (let i = 1; i <= 30; i++) {
      const chargePoints = [{ count: i, power: 11 }];
      const { actualMaxDemand, theoreticalMaxDemand, concurrencyFactor } =
        simulateChargingStations(
          chargePoints,
          arrivalProbabilityMultiplier,
          carConsumption
        );
      results.push({
        chargePoints: i,
        actualMaxDemand,
        theoreticalMaxDemand,
        concurrencyFactor,
      });
    }
    setRangeResults(results);

    setShowRangeResults((prev) => !prev);
  };


  const toggleChart = () => {
    setShowChart((prev) => !prev);
  };

  return (
    <>
      <div className="p-[5%] w-full bg-gray-200 min-h-screen">
        <h1 className="text-2xl font-bold mb-10 text-center">
          EV Charging Simulation
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
            <SimulationInputs
              chargePoints={chargePoints}
              setChargePoints={setChargePoints}
              arrivalProbabilityMultiplier={arrivalProbabilityMultiplier}
              setArrivalProbabilityMultiplier={setArrivalProbabilityMultiplier}
              carConsumption={carConsumption}
              setCarConsumption={setCarConsumption}
              runSimulation={runSimulation}
            />

            <button
              onClick={runSimulationForDifferentChargePoints}
              className="px-4 py-2 bg-green-700 text-white rounded mt-4 block"
            >
              Run Simulation for 1-30 Charge Points
            </button>
          </div>

          {showChart && powerUsage.length > 0 && (
            <>
              <SimulationResults
                totalEnergy={totalEnergy}
                theoreticalMaxDemand={theoreticalMaxDemand}
                actualMaxDemand={actualMaxDemand}
                concurrencyFactor={concurrencyFactor}
              />

              <ChargingEventsStats totalChargingEvents={totalChargingEvents} />
            </>
          )}
        </div>

        {showChart && powerUsage.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
              <div className="flex justify-center my-8">
                <p className="font-medium">
                  Charging Simulation Chart Charging Events Over Time
                </p>
              </div>

              <div>
                <SimulationChart
                  powerUsage={powerUsage}
                  timeLabels={timeLabels}
                  theoreticalMaxDemand={theoreticalMaxDemand}
                  actualMaxDemand={actualMaxDemand}
                  chargingValues={chargingValues}
                  totalChargingEvents={totalChargingEvents}
                />
              </div>
            </div>
          </div>
        )}

        {showRangeResults && rangeResults.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="p-6 relative flex flex-col min-w-0 mb-4 lg:mb-0 break-words bg-gray-50 shadow-lg rounded">
              <div className="rounded-t mb-0 px-0 border-0">
                <div className="flex flex-wrap items-center px-4 py-2">
                  <div className="relative w-full max-w-full flex-grow flex-1">
                    <h3 className="font-semibold text-base text-gray-900 dark:text-gray-50">
                      Range Simulation Results
                    </h3>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto">
                  <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Charge Points
                        </th>
                        <th className="px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Actual Max Demand (kW)
                        </th>
                        <th className="px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                          Theoretical Max Demand (kW)
                        </th>
                        <th className="px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                          Concurrency Factor (%)
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {rangeResults.map((result, index) => (
                        <tr key={index}>
                          <td className="py-2 px-4 border-b border-b-gray-50">
                            {result.chargePoints}
                          </td>
                          <td className="py-2 px-4 border-b border-b-gray-50">
                            {result.actualMaxDemand.toFixed(2)}{' '}
                            <span className="text-gray-700 text-xs">kW</span>
                          </td>
                          <td className="py-2 px-4 border-b border-b-gray-50">
                            {result.theoreticalMaxDemand.toFixed(2)}{' '}
                            <span className="text-gray-700 text-xs">kW</span>
                          </td>
                          <td className="py-2 px-4 border-b border-b-gray-50">
                            {(result.concurrencyFactor * 100).toFixed(2)}{' '}
                            <span className="text-gray-700 text-xs">%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col min-w-0 mb-4 lg:mb-0 ">
              <div className="p-6 break-words rounded mb-0 px-0 border-0 bg-gray-50 shadow-lg">
                <div className="flex flex-wrap items-center px-4 py-2">
                  <div className="relative w-full max-w-full flex-grow flex-1">
                    <h3 className="font-semibold text-base text-gray-900 dark:text-gray-50">
                      Concurrency chart (1 - 30 charge port)
                    </h3>
                  </div>
                </div>
                <div className="block w-full overflow-x-auto">
                  <ConcurrencyFactorChart rangeResults={rangeResults} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
